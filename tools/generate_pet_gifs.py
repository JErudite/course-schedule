from __future__ import annotations

from pathlib import Path
from typing import Callable

from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "assets" / "pets"
SCALE = 2
SIZE = 384
CANVAS = SIZE * SCALE
FRAME_DURATIONS = [2200, 160, 220, 180, 1600]


def sc(value: float) -> int:
    return round(value * SCALE)


def box(left: float, top: float, right: float, bottom: float) -> tuple[int, int, int, int]:
    return tuple(sc(value) for value in (left, top, right, bottom))


def ellipse(draw: ImageDraw.ImageDraw, bounds, fill, outline=None, width=1):
    draw.ellipse(box(*bounds), fill=fill, outline=outline, width=sc(width))


def polygon(draw: ImageDraw.ImageDraw, points, fill):
    draw.polygon([(sc(x), sc(y)) for x, y in points], fill=fill)


def line(draw: ImageDraw.ImageDraw, points, fill, width=1, joint="curve"):
    draw.line([(sc(x), sc(y)) for x, y in points], fill=fill, width=sc(width), joint=joint)


def rounded(draw: ImageDraw.ImageDraw, bounds, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(box(*bounds), radius=sc(radius), fill=fill, outline=outline, width=sc(width))


def gradient_ellipse(image: Image.Image, bounds, top, bottom, blur=0):
    left, y1, right, y2 = box(*bounds)
    height = max(y2 - y1, 1)
    gradient = Image.new("RGBA", (right - left, height))
    pixels = gradient.load()
    for y in range(height):
        ratio = y / max(height - 1, 1)
        color = tuple(round(top[index] * (1 - ratio) + bottom[index] * ratio) for index in range(4))
        for x in range(right - left):
            pixels[x, y] = color
    mask = Image.new("L", gradient.size, 0)
    ImageDraw.Draw(mask).ellipse((0, 0, gradient.width - 1, gradient.height - 1), fill=255)
    if blur:
        mask = mask.filter(ImageFilter.GaussianBlur(sc(blur)))
    image.alpha_composite(Image.composite(gradient, Image.new("RGBA", gradient.size), mask), (left, y1))


def shadow(image: Image.Image, bounds, opacity=45):
    layer = Image.new("RGBA", image.size)
    draw = ImageDraw.Draw(layer)
    ellipse(draw, bounds, (92, 68, 84, min(opacity, 18)))
    layer = layer.filter(ImageFilter.GaussianBlur(sc(7)))
    image.alpha_composite(layer)


def shine(image: Image.Image, bounds, opacity=42):
    layer = Image.new("RGBA", image.size)
    draw = ImageDraw.Draw(layer)
    ellipse(draw, bounds, (255, 255, 255, opacity))
    layer = layer.filter(ImageFilter.GaussianBlur(sc(5)))
    image.alpha_composite(layer)


def capsule(image: Image.Image, center, size, angle, fill):
    width, height = (sc(value) for value in size)
    layer = Image.new("RGBA", (width, height))
    ImageDraw.Draw(layer).rounded_rectangle((0, 0, width - 1, height - 1), radius=height // 2, fill=fill)
    rotated = layer.rotate(angle, resample=Image.Resampling.BICUBIC, expand=True)
    x = sc(center[0]) - rotated.width // 2
    y = sc(center[1]) - rotated.height // 2
    image.alpha_composite(rotated, (x, y))


def face(draw: ImageDraw.ImageDraw, frame: int, eye_y=150, eye_dx=31, expression="cute", iris_color=(116, 73, 116, 255)):
    eye_color = (63, 43, 58, 255)
    left_eye = 192 - eye_dx
    right_eye = 192 + eye_dx
    if frame == 1:
        line(draw, [(left_eye - 12, eye_y), (left_eye, eye_y + 6), (left_eye + 12, eye_y)], eye_color, 3)
        line(draw, [(right_eye - 12, eye_y), (right_eye, eye_y + 6), (right_eye + 12, eye_y)], eye_color, 3)
        line(draw, [(left_eye - 11, eye_y - 2), (left_eye - 16, eye_y - 6)], eye_color, 2)
        line(draw, [(right_eye + 11, eye_y - 2), (right_eye + 16, eye_y - 6)], eye_color, 2)
    elif frame == 2:
        for center in (left_eye, right_eye):
            ellipse(draw, (center - 16, eye_y - 20, center + 16, eye_y + 20), (255, 252, 255, 255))
            ellipse(draw, (center - 12, eye_y - 16, center + 12, eye_y + 17), iris_color)
            ellipse(draw, (center - 9, eye_y - 11, center + 9, eye_y + 17), eye_color)
            ellipse(draw, (center - 7, eye_y - 12, center + 1, eye_y - 3), (255, 255, 255, 255))
            ellipse(draw, (center + 3, eye_y + 4, center + 7, eye_y + 8), (255, 220, 244, 255))
            polygon(draw, [(center - 2, eye_y - 2), (center, eye_y + 2), (center + 4, eye_y + 3), (center + 1, eye_y + 6), (center + 2, eye_y + 10), (center - 2, eye_y + 8), (center - 5, eye_y + 10), (center - 4, eye_y + 6), (center - 7, eye_y + 3), (center - 3, eye_y + 2)], (255, 255, 255, 230))
        line(draw, [(left_eye - 13, eye_y - 15), (left_eye - 18, eye_y - 20)], eye_color, 2)
        line(draw, [(right_eye + 13, eye_y - 15), (right_eye + 18, eye_y - 20)], eye_color, 2)
    elif frame == 3:
        line(draw, [(left_eye - 12, eye_y + 3), (left_eye, eye_y - 6), (left_eye + 12, eye_y + 3)], eye_color, 3)
        line(draw, [(right_eye - 12, eye_y + 3), (right_eye, eye_y - 6), (right_eye + 12, eye_y + 3)], eye_color, 3)
        line(draw, [(left_eye - 11, eye_y), (left_eye - 16, eye_y - 5)], eye_color, 2)
        line(draw, [(right_eye + 11, eye_y), (right_eye + 16, eye_y - 5)], eye_color, 2)
    else:
        for center in (left_eye, right_eye):
            ellipse(draw, (center - 15, eye_y - 19, center + 15, eye_y + 19), (255, 252, 255, 255))
            ellipse(draw, (center - 11, eye_y - 15, center + 11, eye_y + 16), iris_color)
            ellipse(draw, (center - 8, eye_y - 10, center + 8, eye_y + 16), eye_color)
            ellipse(draw, (center - 7, eye_y - 12, center + 1, eye_y - 4), (255, 255, 255, 255))
            ellipse(draw, (center + 3, eye_y + 5, center + 7, eye_y + 9), (255, 219, 241, 245))
        line(draw, [(left_eye - 13, eye_y - 14), (left_eye - 18, eye_y - 19)], eye_color, 2)
        line(draw, [(right_eye + 13, eye_y - 14), (right_eye + 18, eye_y - 19)], eye_color, 2)

    cheek = (248, 146, 163, 255) if frame in (2, 3) else (241, 171, 177, 255)
    ellipse(draw, (left_eye - 46, eye_y + 18, left_eye - 16, eye_y + 32), cheek)
    ellipse(draw, (right_eye + 16, eye_y + 18, right_eye + 46, eye_y + 32), cheek)
    ellipse(draw, (left_eye - 40, eye_y + 20, left_eye - 31, eye_y + 23), (255, 214, 224, 235))
    ellipse(draw, (right_eye + 29, eye_y + 20, right_eye + 38, eye_y + 23), (255, 214, 224, 235))

    mouth_y = eye_y + 31
    if expression == "tongue" and frame in (2, 3):
        line(draw, [(181, mouth_y), (192, mouth_y + 8), (203, mouth_y)], eye_color, 3)
        ellipse(draw, (185, mouth_y + 6, 199, mouth_y + 20), (241, 112, 147, 255))
    elif frame == 3:
        line(draw, [(176, mouth_y), (184, mouth_y + 8), (192, mouth_y), (200, mouth_y + 8), (208, mouth_y)], eye_color, 3)
        polygon(draw, [(118, eye_y - 22), (122, eye_y - 13), (132, eye_y - 12), (124, eye_y - 6), (127, eye_y + 4), (118, eye_y - 1), (110, eye_y + 4), (112, eye_y - 6), (104, eye_y - 12), (114, eye_y - 13)], (255, 220, 82, 230))
        polygon(draw, [(266, eye_y - 20), (270, eye_y - 11), (280, eye_y - 10), (272, eye_y - 4), (275, eye_y + 6), (266, eye_y + 1), (258, eye_y + 6), (260, eye_y - 4), (252, eye_y - 10), (262, eye_y - 11)], (255, 220, 82, 230))
    else:
        line(draw, [(181, mouth_y), (192, mouth_y + 7), (203, mouth_y)], eye_color, 3)


def cat(frame: int) -> Image.Image:
    image = Image.new("RGBA", (CANVAS, CANVAS))
    draw = ImageDraw.Draw(image)
    shadow(image, (112, 321, 272, 349))
    ellipse(draw, (147, 221, 177, 333), (211, 123, 69, 255))
    ellipse(draw, (207, 221, 237, 333), (211, 123, 69, 255))
    ellipse(draw, (133, 194, 251, 303), (229, 145, 83, 255))
    ellipse(draw, (150, 220, 234, 306), (250, 188, 140, 255))
    polygon(draw, [(129, 125), (151, 69), (181, 124)], (222, 132, 78, 255))
    polygon(draw, [(203, 124), (233, 69), (255, 125)], (222, 132, 78, 255))
    polygon(draw, [(143, 117), (153, 89), (171, 120)], (245, 174, 167, 255))
    polygon(draw, [(213, 120), (231, 89), (241, 117)], (245, 174, 167, 255))
    gradient_ellipse(image, (119, 98, 265, 229), (246, 179, 111, 255), (219, 125, 73, 255))
    draw = ImageDraw.Draw(image)
    line(draw, [(141, 176), (101, 166)], (112, 77, 68, 210), 2)
    line(draw, [(141, 185), (98, 185)], (112, 77, 68, 210), 2)
    line(draw, [(243, 176), (283, 166)], (112, 77, 68, 210), 2)
    line(draw, [(243, 185), (286, 185)], (112, 77, 68, 210), 2)
    ellipse(draw, (187, 166, 197, 174), (161, 91, 89, 255))
    face(draw, frame, 151, 31)
    line(draw, [(239, 258), (278, 277), (266, 318)], (207, 112, 65, 255), 17)
    shine(image, (145, 111, 185, 140))
    return image


def dog(frame: int) -> Image.Image:
    image = Image.new("RGBA", (CANVAS, CANVAS))
    draw = ImageDraw.Draw(image)
    shadow(image, (105, 323, 279, 351))
    ellipse(draw, (146, 224, 177, 334), (205, 132, 73, 255))
    ellipse(draw, (207, 224, 238, 334), (205, 132, 73, 255))
    gradient_ellipse(image, (128, 190, 256, 307), (239, 171, 100, 255), (205, 124, 67, 255))
    draw = ImageDraw.Draw(image)
    ellipse(draw, (151, 220, 233, 306), (255, 214, 167, 255))
    ellipse(draw, (103, 111, 153, 220), (151, 91, 58, 255))
    ellipse(draw, (231, 111, 281, 220), (151, 91, 58, 255))
    gradient_ellipse(image, (119, 91, 265, 230), (248, 188, 112, 255), (214, 135, 74, 255))
    draw = ImageDraw.Draw(image)
    ellipse(draw, (158, 158, 226, 213), (255, 218, 172, 255))
    ellipse(draw, (184, 166, 200, 179), (87, 58, 55, 255))
    face(draw, frame, 145, 31, "tongue")
    line(draw, [(246, 260), (286, 246), (279, 222)], (190, 111, 61, 255), 15)
    shine(image, (145, 105, 187, 136))
    return image


def rabbit(frame: int) -> Image.Image:
    image = Image.new("RGBA", (CANVAS, CANVAS))
    draw = ImageDraw.Draw(image)
    shadow(image, (104, 323, 280, 351))
    ellipse(draw, (139, 34, 179, 151), (223, 211, 247, 255))
    ellipse(draw, (205, 34, 245, 151), (223, 211, 247, 255))
    ellipse(draw, (151, 49, 167, 129), (232, 146, 179, 255))
    ellipse(draw, (217, 49, 233, 129), (232, 146, 179, 255))
    ellipse(draw, (148, 220, 178, 334), (190, 172, 224, 255))
    ellipse(draw, (206, 220, 236, 334), (190, 172, 224, 255))
    gradient_ellipse(image, (125, 188, 259, 310), (226, 215, 247, 255), (184, 164, 221, 255))
    gradient_ellipse(image, (118, 98, 266, 232), (242, 233, 255, 255), (201, 185, 231, 255))
    draw = ImageDraw.Draw(image)
    ellipse(draw, (185, 170, 199, 181), (235, 123, 151, 255))
    face(draw, frame, 151, 30)
    ellipse(draw, (243, 244, 275, 278), (238, 231, 250, 255))
    shine(image, (145, 111, 185, 142))
    return image


def hamster(frame: int) -> Image.Image:
    image = Image.new("RGBA", (CANVAS, CANVAS))
    draw = ImageDraw.Draw(image)
    shadow(image, (101, 318, 283, 349))
    ellipse(draw, (125, 92, 174, 141), (221, 140, 126, 255))
    ellipse(draw, (210, 92, 259, 141), (221, 140, 126, 255))
    ellipse(draw, (139, 105, 162, 128), (247, 179, 184, 255))
    ellipse(draw, (222, 105, 245, 128), (247, 179, 184, 255))
    gradient_ellipse(image, (108, 113, 276, 319), (225, 201, 211, 255), (177, 146, 175, 255))
    draw = ImageDraw.Draw(image)
    ellipse(draw, (143, 169, 241, 292), (247, 231, 221, 255))
    ellipse(draw, (179, 168, 205, 189), (236, 139, 151, 255))
    ellipse(draw, (104, 235, 158, 285), (194, 162, 188, 255))
    ellipse(draw, (226, 235, 280, 285), (194, 162, 188, 255))
    face(draw, frame, 151, 32)
    if frame in (2, 3):
        ellipse(draw, (177, 226, 207, 253), (244, 203, 91, 255))
        line(draw, [(192, 230), (192, 251)], (153, 112, 49, 255), 2)
    shine(image, (135, 129, 178, 172))
    return image


def chipmunk(frame: int) -> Image.Image:
    image = Image.new("RGBA", (CANVAS, CANVAS))
    draw = ImageDraw.Draw(image)
    shadow(image, (102, 322, 282, 351))
    line(draw, [(256, 288), (303, 261), (302, 184), (274, 150)], (133, 74, 78, 255), 38)
    line(draw, [(256, 288), (303, 261), (302, 184), (274, 150)], (180, 105, 92, 255), 24)
    ellipse(draw, (146, 221, 176, 334), (209, 121, 69, 255))
    ellipse(draw, (208, 221, 238, 334), (209, 121, 69, 255))
    gradient_ellipse(image, (126, 181, 258, 309), (245, 166, 91, 255), (207, 112, 64, 255))
    draw = ImageDraw.Draw(image)
    ellipse(draw, (154, 209, 230, 302), (255, 213, 161, 255))
    polygon(draw, [(132, 125), (151, 83), (177, 125)], (224, 132, 75, 255))
    polygon(draw, [(207, 125), (233, 83), (252, 125)], (224, 132, 75, 255))
    gradient_ellipse(image, (119, 101, 265, 226), (250, 180, 103, 255), (214, 120, 68, 255))
    draw = ImageDraw.Draw(image)
    ellipse(draw, (181, 166, 203, 182), (77, 52, 50, 255))
    face(draw, frame, 149, 31)
    line(draw, [(139, 157), (116, 143)], (109, 66, 63, 255), 4)
    line(draw, [(245, 157), (268, 143)], (109, 66, 63, 255), 4)
    if frame in (2, 3):
        ellipse(draw, (176, 225, 208, 254), (129, 77, 51, 255))
        polygon(draw, [(180, 236), (192, 219), (204, 236)], (100, 125, 66, 255))
    shine(image, (143, 114, 183, 143))
    return image


def penguin(frame: int) -> Image.Image:
    image = Image.new("RGBA", (CANVAS, CANVAS))
    draw = ImageDraw.Draw(image)
    shadow(image, (99, 322, 285, 350))
    polygon(draw, [(147, 297), (101, 334), (181, 335)], (242, 137, 60, 255))
    polygon(draw, [(237, 297), (203, 335), (283, 334)], (242, 137, 60, 255))
    ellipse(draw, (118, 80, 266, 325), (82, 63, 135, 255))
    ellipse(draw, (145, 126, 239, 307), (249, 243, 249, 255))
    ellipse(draw, (136, 98, 248, 222), (250, 245, 252, 255))
    polygon(draw, [(182, 164), (202, 164), (192, 184)], (241, 135, 52, 255))
    polygon(draw, [(124, 192), (79, 244), (132, 260)], (70, 55, 121, 255))
    polygon(draw, [(260, 192), (305, 244), (252, 260)], (70, 55, 121, 255))
    face(draw, frame, 142, 29)
    if frame in (2, 3):
        polygon(draw, [(192, 184), (180, 197), (204, 197)], (246, 159, 71, 255))
    shine(image, (141, 94, 177, 129))
    return image


def bear(frame: int) -> Image.Image:
    image = Image.new("RGBA", (CANVAS, CANVAS))
    draw = ImageDraw.Draw(image)
    shadow(image, (97, 323, 287, 352))
    ellipse(draw, (116, 86, 169, 139), (190, 107, 62, 255))
    ellipse(draw, (215, 86, 268, 139), (190, 107, 62, 255))
    ellipse(draw, (131, 101, 154, 124), (239, 166, 113, 255))
    ellipse(draw, (230, 101, 253, 124), (239, 166, 113, 255))
    ellipse(draw, (132, 224, 178, 338), (192, 108, 62, 255))
    ellipse(draw, (206, 224, 252, 338), (192, 108, 62, 255))
    gradient_ellipse(image, (111, 182, 273, 315), (231, 151, 82, 255), (184, 96, 57, 255))
    draw = ImageDraw.Draw(image)
    ellipse(draw, (148, 211, 236, 302), (251, 194, 129, 255))
    gradient_ellipse(image, (116, 100, 268, 235), (244, 173, 94, 255), (197, 108, 60, 255))
    draw = ImageDraw.Draw(image)
    ellipse(draw, (156, 160, 228, 215), (250, 199, 143, 255))
    ellipse(draw, (184, 164, 200, 177), (86, 57, 52, 255))
    face(draw, frame, 145, 31)
    shine(image, (142, 115, 184, 145))
    return image


def turtle(frame: int) -> Image.Image:
    image = Image.new("RGBA", (CANVAS, CANVAS))
    draw = ImageDraw.Draw(image)
    shadow(image, (84, 312, 300, 344))
    ellipse(draw, (123, 259, 165, 330), (122, 189, 94, 255))
    ellipse(draw, (219, 259, 261, 330), (122, 189, 94, 255))
    ellipse(draw, (98, 163, 286, 305), (75, 157, 136, 255))
    ellipse(draw, (112, 174, 272, 292), (63, 137, 121, 255))
    line(draw, [(192, 176), (192, 292)], (112, 202, 122, 255), 5)
    line(draw, [(126, 217), (258, 217)], (112, 202, 122, 255), 5)
    line(draw, [(142, 184), (169, 217), (142, 278)], (112, 202, 122, 255), 4)
    line(draw, [(242, 184), (215, 217), (242, 278)], (112, 202, 122, 255), 4)
    gradient_ellipse(image, (132, 82, 252, 199), (171, 229, 100, 255), (94, 170, 75, 255))
    draw = ImageDraw.Draw(image)
    face(draw, frame, 133, 27)
    ellipse(draw, (186, 159, 198, 169), (80, 95, 53, 255))
    shine(image, (149, 96, 183, 123))
    return image


def milk_dragon(frame: int) -> Image.Image:
    image = Image.new("RGBA", (CANVAS, CANVAS))
    draw = ImageDraw.Draw(image)
    shadow(image, (99, 323, 285, 352))
    ellipse(draw, (150, 238, 177, 334), (228, 133, 43, 255))
    ellipse(draw, (207, 238, 234, 334), (228, 133, 43, 255))
    gradient_ellipse(image, (132, 192, 252, 310), (255, 209, 71, 255), (225, 125, 42, 255))
    draw = ImageDraw.Draw(image)
    ellipse(draw, (157, 218, 227, 296), (255, 238, 176, 255))
    polygon(draw, [(139, 112), (151, 75), (169, 116)], (255, 238, 176, 255))
    polygon(draw, [(215, 116), (233, 75), (245, 112)], (255, 238, 176, 255))
    gradient_ellipse(image, (108, 88, 276, 235), (255, 225, 92, 255), (234, 142, 43, 255))
    draw = ImageDraw.Draw(image)
    ellipse(draw, (185, 169, 191, 175), (201, 113, 68, 255))
    ellipse(draw, (193, 169, 199, 175), (201, 113, 68, 255))
    face(draw, frame, 146, 32, "tongue", (88, 167, 91, 255))
    capsule(image, (131, 245), (55, 20), 30, (239, 153, 45, 255))
    capsule(image, (253, 245), (55, 20), -30, (222, 117, 39, 255))
    shine(image, (139, 106, 184, 139))
    return image


def zoo_pet(frame: int, spec: dict) -> Image.Image:
    image = Image.new("RGBA", (CANVAS, CANVAS))
    draw = ImageDraw.Draw(image)
    body = spec["body"]
    light = spec.get("light", (247, 214, 169, 255))
    dark = spec.get("dark", tuple(max(channel - 38, 0) for channel in body[:3]) + (255,))
    kind = spec["kind"]

    shadow(image, (99, 321, 285, 350))
    if kind == "peacock":
        for bounds, color in [
            ((93, 133, 291, 310), (69, 157, 129, 255)),
            ((112, 150, 272, 303), (80, 181, 145, 255)),
        ]:
            ellipse(draw, bounds, color)
        for x, y in [(128, 176), (192, 151), (256, 176), (145, 234), (239, 234)]:
            ellipse(draw, (x - 12, y - 12, x + 12, y + 12), (61, 94, 143, 255))
            ellipse(draw, (x - 6, y - 6, x + 6, y + 6), (246, 197, 68, 255))
    elif kind == "flamingo":
        line(draw, [(166, 257), (160, 336)], dark, 8)
        line(draw, [(218, 257), (224, 336)], dark, 8)
    elif kind == "snake":
        ellipse(draw, (118, 243, 266, 330), dark)
        ellipse(draw, (136, 258, 248, 309), (0, 0, 0, 0))

    if kind == "lion":
        ellipse(draw, (91, 65, 293, 246), dark)
    elif kind == "peacock":
        pass
    elif kind not in ("seal", "dolphin", "snake", "flamingo"):
        ellipse(draw, (148, 231, 179, 335), dark)
        ellipse(draw, (205, 231, 236, 335), dark)

    if kind == "giraffe":
        rounded(draw, (165, 153, 219, 274), 24, body)
        gradient_ellipse(image, (139, 211, 245, 315), body, dark)
    elif kind == "gorilla":
        gradient_ellipse(image, (113, 184, 271, 316), body, dark)
        capsule(image, (112, 252), (86, 32), 72, dark)
        capsule(image, (272, 252), (86, 32), -72, dark)
    elif kind == "kangaroo":
        gradient_ellipse(image, (132, 188, 252, 317), body, dark)
        ellipse(draw, (157, 230, 227, 297), light)
        line(draw, [(246, 270), (305, 311)], dark, 19)
    elif kind == "flamingo":
        gradient_ellipse(image, (131, 190, 253, 285), body, dark)
    elif kind == "seal":
        gradient_ellipse(image, (120, 190, 264, 326), body, dark)
        capsule(image, (119, 260), (65, 27), 48, dark)
        capsule(image, (265, 260), (65, 27), -48, dark)
    elif kind == "dolphin":
        gradient_ellipse(image, (130, 183, 254, 322), body, dark)
        polygon(draw, [(192, 303), (165, 339), (192, 329), (219, 339)], dark)
        capsule(image, (125, 247), (65, 24), 38, dark)
        capsule(image, (259, 247), (65, 24), -38, dark)
    elif kind == "snake":
        rounded(draw, (165, 177, 219, 286), 27, body)
    else:
        gradient_ellipse(image, (128, 188, 256, 313), body, dark)
        ellipse(draw, (156, 218, 228, 302), light)

    draw = ImageDraw.Draw(image)
    if kind in ("lion", "tiger", "leopard", "red_panda", "raccoon", "wolf"):
        polygon(draw, [(122, 121), (143, 72), (176, 123)], dark)
        polygon(draw, [(208, 123), (241, 72), (262, 121)], dark)
        polygon(draw, [(137, 114), (146, 89), (166, 119)], light)
        polygon(draw, [(218, 119), (238, 89), (247, 114)], light)
    elif kind in ("elephant", "koala"):
        ellipse(draw, (78, 102, 150, 208), dark)
        ellipse(draw, (234, 102, 306, 208), dark)
        ellipse(draw, (92, 118, 143, 190), light)
        ellipse(draw, (241, 118, 292, 190), light)
    elif kind in ("monkey", "gorilla"):
        ellipse(draw, (87, 117, 145, 187), dark)
        ellipse(draw, (239, 117, 297, 187), dark)
    elif kind in ("giant_panda", "polar_bear", "hippo"):
        ellipse(draw, (105, 91, 155, 141), dark)
        ellipse(draw, (229, 91, 279, 141), dark)
    elif kind in ("giraffe", "deer", "alpaca"):
        ellipse(draw, (122, 91, 158, 133), dark)
        ellipse(draw, (226, 91, 262, 133), dark)
    elif kind == "rhino":
        ellipse(draw, (111, 96, 153, 140), dark)
        ellipse(draw, (231, 96, 273, 140), dark)
    elif kind == "kangaroo":
        ellipse(draw, (127, 47, 163, 134), dark)
        ellipse(draw, (221, 47, 257, 134), dark)
        ellipse(draw, (139, 60, 153, 119), light)
        ellipse(draw, (231, 60, 245, 119), light)
    elif kind in ("owl", "parrot", "peacock"):
        polygon(draw, [(123, 123), (143, 83), (174, 126)], body)
        polygon(draw, [(210, 126), (241, 83), (261, 123)], body)

    head_bounds = (108, 88, 276, 231) if kind not in ("giraffe", "kangaroo") else (116, 83, 268, 218)
    gradient_ellipse(image, head_bounds, spec.get("head", body), dark)
    draw = ImageDraw.Draw(image)

    if kind == "alpaca":
        for x, y in [(134, 101), (151, 90), (171, 87), (192, 85), (213, 87), (233, 91), (250, 103)]:
            ellipse(draw, (x - 18, y - 15, x + 18, y + 16), light)
    if kind == "giraffe":
        line(draw, [(144, 101), (137, 64)], dark, 8)
        line(draw, [(240, 101), (247, 64)], dark, 8)
        ellipse(draw, (128, 54, 146, 72), dark)
        ellipse(draw, (238, 54, 256, 72), dark)
    if kind == "deer":
        for side in (-1, 1):
            x = 192 + side * 48
            line(draw, [(x, 104), (x + side * 8, 67), (x + side * 23, 52)], dark, 5)
            line(draw, [(x + side * 6, 74), (x - side * 6, 58)], dark, 4)
    if kind == "lion":
        ellipse(draw, (150, 160, 234, 219), light)
    if kind == "giant_panda":
        ellipse(draw, (132, 124, 174, 179), (65, 57, 72, 255))
        ellipse(draw, (210, 124, 252, 179), (65, 57, 72, 255))
    if kind in ("red_panda", "raccoon"):
        polygon(draw, [(119, 135), (174, 119), (176, 171), (128, 176)], dark)
        polygon(draw, [(265, 135), (210, 119), (208, 171), (256, 176)], dark)
    if kind == "tiger":
        for x in (144, 192, 240):
            polygon(draw, [(x - 8, 101), (x, 127), (x + 8, 101)], dark)
    if kind == "zebra":
        for x in (139, 172, 212, 245):
            polygon(draw, [(x - 10, 96), (x + 5, 139), (x + 13, 96)], dark)
        for y in (221, 251, 281):
            line(draw, [(143, y), (166, y + 9)], dark, 6)
            line(draw, [(241, y), (218, y + 9)], dark, 6)
    if kind == "leopard":
        for x, y in [(137, 118), (192, 108), (246, 119), (151, 199), (233, 198), (165, 249), (222, 268)]:
            ellipse(draw, (x - 5, y - 5, x + 5, y + 5), dark)
    if kind == "elephant":
        polygon(draw, [(183, 168), (201, 168), (207, 240), (192, 259), (177, 240)], dark)
        polygon(draw, [(167, 190), (176, 213), (160, 207)], (255, 244, 218, 255))
        polygon(draw, [(217, 190), (208, 213), (224, 207)], (255, 244, 218, 255))
    if kind == "rhino":
        polygon(draw, [(179, 174), (192, 139), (205, 174)], (242, 232, 207, 255))
    if kind == "crocodile":
        rounded(draw, (131, 169, 253, 215), 23, light)
        for x in range(151, 240, 22):
            polygon(draw, [(x, 205), (x + 7, 216), (x + 14, 205)], (255, 255, 241, 255))
    if kind in ("parrot", "peacock"):
        polygon(draw, [(179, 168), (205, 168), (192, 191)], (247, 166, 55, 255))
        if kind == "peacock":
            for x in (177, 192, 207):
                line(draw, [(x, 91), (x + (x - 192) // 2, 61)], dark, 3)
                ellipse(draw, (x - 5, 51, x + 5, 62), (64, 141, 190, 255))
    if kind == "flamingo":
        polygon(draw, [(174, 164), (211, 164), (225, 181), (199, 190), (177, 182)], (64, 58, 70, 255))
    if kind == "owl":
        ellipse(draw, (126, 114, 187, 181), light)
        ellipse(draw, (197, 114, 258, 181), light)
        polygon(draw, [(183, 168), (201, 168), (192, 186)], (242, 165, 55, 255))
    if kind == "hippo":
        rounded(draw, (151, 167, 233, 215), 22, light)
        ellipse(draw, (169, 180, 177, 188), dark)
        ellipse(draw, (207, 180, 215, 188), dark)
    if kind == "dolphin":
        polygon(draw, [(192, 88), (174, 62), (207, 83)], dark)

    face(draw, frame, 146, 33, "tongue" if kind in ("dog", "monkey", "seal") else "cute", spec.get("iris", (116, 73, 116, 255)))
    shine(image, (137, 101, 181, 135))
    return image


ZOO_PETS = {
    "lion": {"kind": "lion", "body": (229, 151, 63, 255), "dark": (164, 95, 48, 255), "light": (255, 211, 135, 255)},
    "tiger": {"kind": "tiger", "body": (242, 151, 51, 255), "dark": (78, 62, 60, 255), "light": (255, 223, 174, 255)},
    "leopard": {"kind": "leopard", "body": (232, 177, 76, 255), "dark": (91, 70, 58, 255), "light": (255, 226, 164, 255)},
    "elephant": {"kind": "elephant", "body": (156, 164, 187, 255), "dark": (112, 120, 148, 255), "light": (197, 204, 221, 255), "iris": (74, 111, 156, 255)},
    "giraffe": {"kind": "giraffe", "body": (244, 194, 85, 255), "dark": (151, 96, 58, 255), "light": (255, 227, 154, 255)},
    "zebra": {"kind": "zebra", "body": (245, 244, 239, 255), "dark": (69, 68, 78, 255), "light": (255, 255, 255, 255)},
    "monkey": {"kind": "monkey", "body": (170, 104, 66, 255), "dark": (112, 71, 57, 255), "light": (239, 182, 127, 255)},
    "gorilla": {"kind": "gorilla", "body": (89, 91, 106, 255), "dark": (57, 59, 71, 255), "light": (151, 145, 148, 255), "iris": (77, 99, 139, 255)},
    "giant-panda": {"kind": "giant_panda", "body": (244, 242, 238, 255), "dark": (54, 54, 65, 255), "light": (255, 255, 255, 255)},
    "red-panda": {"kind": "red_panda", "body": (202, 91, 54, 255), "dark": (89, 53, 59, 255), "light": (250, 205, 160, 255)},
    "koala": {"kind": "koala", "body": (163, 169, 179, 255), "dark": (111, 116, 129, 255), "light": (212, 215, 221, 255)},
    "kangaroo": {"kind": "kangaroo", "body": (197, 130, 77, 255), "dark": (145, 91, 60, 255), "light": (245, 194, 139, 255)},
    "alpaca": {"kind": "alpaca", "body": (228, 210, 191, 255), "dark": (173, 142, 125, 255), "light": (255, 242, 221, 255)},
    "deer": {"kind": "deer", "body": (188, 119, 69, 255), "dark": (107, 69, 57, 255), "light": (242, 190, 133, 255)},
    "hippo": {"kind": "hippo", "body": (157, 133, 165, 255), "dark": (112, 93, 127, 255), "light": (216, 178, 190, 255)},
    "rhino": {"kind": "rhino", "body": (147, 155, 164, 255), "dark": (101, 111, 120, 255), "light": (201, 207, 209, 255)},
    "crocodile": {"kind": "crocodile", "body": (90, 166, 91, 255), "dark": (51, 113, 74, 255), "light": (164, 210, 111, 255), "iris": (76, 139, 80, 255)},
    "polar-bear": {"kind": "polar_bear", "body": (239, 244, 246, 255), "dark": (178, 192, 202, 255), "light": (255, 255, 255, 255), "iris": (91, 132, 162, 255)},
    "seal": {"kind": "seal", "body": (137, 158, 177, 255), "dark": (89, 111, 139, 255), "light": (198, 213, 224, 255), "iris": (72, 112, 158, 255)},
    "dolphin": {"kind": "dolphin", "body": (92, 170, 205, 255), "dark": (52, 117, 164, 255), "light": (181, 226, 236, 255), "iris": (48, 111, 166, 255)},
    "flamingo": {"kind": "flamingo", "body": (244, 136, 157, 255), "dark": (202, 87, 128, 255), "light": (255, 200, 208, 255)},
    "peacock": {"kind": "peacock", "body": (55, 136, 174, 255), "dark": (45, 87, 133, 255), "light": (95, 205, 173, 255), "iris": (52, 119, 161, 255)},
    "parrot": {"kind": "parrot", "body": (224, 73, 74, 255), "dark": (145, 54, 87, 255), "light": (255, 191, 75, 255)},
    "owl": {"kind": "owl", "body": (159, 113, 77, 255), "dark": (94, 70, 67, 255), "light": (232, 190, 128, 255)},
    "raccoon": {"kind": "raccoon", "body": (146, 153, 163, 255), "dark": (71, 75, 89, 255), "light": (207, 210, 211, 255)},
    "camel": {"kind": "alpaca", "body": (205, 151, 91, 255), "dark": (146, 98, 62, 255), "light": (244, 199, 135, 255)},
    "wolf": {"kind": "wolf", "body": (133, 147, 162, 255), "dark": (72, 82, 102, 255), "light": (208, 215, 219, 255), "iris": (72, 118, 167, 255)},
    "snake": {"kind": "snake", "body": (98, 178, 104, 255), "dark": (49, 117, 80, 255), "light": (176, 222, 126, 255), "iris": (75, 142, 77, 255)},
}


PETS: dict[str, Callable[[int], Image.Image]] = {
    "cat": cat,
    "dog": dog,
    "rabbit": rabbit,
    "hamster": hamster,
    "fox": chipmunk,
    "panda": penguin,
    "bear": bear,
    "frog": turtle,
    "milk-dragon": milk_dragon,
}

for zoo_pet_name, zoo_pet_spec in ZOO_PETS.items():
    PETS[zoo_pet_name] = lambda frame, spec=zoo_pet_spec: zoo_pet(frame, spec)


def save_gif(name: str, renderer: Callable[[int], Image.Image]) -> None:
    frames = []
    for frame_index in range(len(FRAME_DURATIONS)):
        frame = renderer(frame_index)
        frame.thumbnail((SIZE, SIZE), Image.Resampling.LANCZOS)
        alpha = frame.getchannel("A").point(lambda value: 255 if value >= 96 else 0)
        frame.putalpha(alpha)
        frames.append(frame)
    output = OUTPUT_DIR / f"{name}.gif"
    frames[0].save(
        output,
        save_all=True,
        append_images=frames[1:],
        duration=FRAME_DURATIONS,
        loop=0,
        disposal=2,
        optimize=True,
        transparency=0,
    )
    print(output)


if __name__ == "__main__":
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for pet_name, pet_renderer in PETS.items():
        save_gif(pet_name, pet_renderer)
