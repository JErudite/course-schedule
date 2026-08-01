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
