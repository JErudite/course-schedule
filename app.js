const defaultSchedule = [
  { id: "math", day: 1, startTime: 480, duration: 100, name: "高等数学", room: "博学楼 A201", teacher: "陈老师", type: "required" },
  { id: "english", day: 1, startTime: 840, duration: 100, name: "大学英语", room: "文科楼 305", teacher: "周老师", type: "required" },
  { id: "programming", day: 2, startTime: 600, duration: 100, name: "程序设计基础", room: "信息楼 402", teacher: "林老师", type: "practice" },
  { id: "film", day: 2, startTime: 960, duration: 100, name: "影视鉴赏", room: "艺术楼 106", teacher: "宋老师", type: "elective" },
  { id: "linear-algebra", day: 3, startTime: 480, duration: 100, name: "线性代数", room: "博学楼 B203", teacher: "王老师", type: "required" },
  { id: "data-structure", day: 3, startTime: 840, duration: 170, name: "数据结构实验", room: "实验中心 512", teacher: "赵老师", type: "practice" },
  { id: "sports", day: 4, startTime: 600, duration: 100, name: "大学体育", room: "东区体育场", teacher: "郑老师", type: "other" },
  { id: "history", day: 4, startTime: 960, duration: 100, name: "中国近现代史纲要", room: "博学楼 C108", teacher: "许老师", type: "required" },
  { id: "discrete-math", day: 5, startTime: 480, duration: 100, name: "离散数学", room: "博学楼 A305", teacher: "吴老师", type: "required" },
  { id: "innovation", day: 5, startTime: 840, duration: 100, name: "创新创业基础", room: "创客空间 201", teacher: "何老师", type: "elective" },
];

const days = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
const typeNames = {
  required: "必修课程",
  elective: "选修课程",
  practice: "实践课程",
  other: "公共课程",
};
const typeColors = {
  required: "#2f6b4f",
  elective: "#326a88",
  practice: "#9a533e",
  other: "#826b28",
};
const timelineStart = 8 * 60;
const timelineEnd = 21 * 60;
const snapMinutes = 10;
const slotCount = (timelineEnd - timelineStart) / snapMinutes;
const storageKey = "course-schedule-v2";

const semesterStart = startOfWeek(new Date(2026, 1, 16));
const demoToday = new Date(2026, 3, 13);
const currentWeekStart = startOfWeek(demoToday);
let selectedWeekStart = new Date(currentWeekStart);
let selectedCourseId = null;
let schedule = loadSchedule();
let statusTimer = null;

const grid = document.querySelector("#scheduleGrid");
const scheduleScroll = document.querySelector("#scheduleScroll");
const weekLabel = document.querySelector("#weekLabel");
const weekRange = document.querySelector("#weekRange");
const dialog = document.querySelector("#courseDialog");
const courseForm = document.querySelector("#courseForm");
const dialogDetails = document.querySelector("#dialogDetails");
const dayInput = document.querySelector("#courseDayInput");
const startTimeInput = document.querySelector("#courseStartTimeInput");
const durationInput = document.querySelector("#courseDurationInput");
const statusMessage = document.querySelector("#statusMessage");

function loadSchedule() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (!Array.isArray(saved)) return defaultSchedule.map((course) => ({ ...course }));
    return defaultSchedule.map((course) => {
      const editedCourse = saved.find((item) => item.id === course.id);
      return editedCourse ? { ...course, ...editedCourse } : { ...course };
    });
  } catch {
    return defaultSchedule.map((course) => ({ ...course }));
  }
}

function saveSchedule() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(schedule));
  } catch {
    // Editing and dragging still work when local storage is unavailable.
  }
}

function startOfWeek(date) {
  const result = new Date(date);
  const day = result.getDay() || 7;
  result.setDate(result.getDate() - day + 1);
  result.setHours(0, 0, 0, 0);
  return result;
}

function addDays(date, amount) {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
}

function sameDay(first, second) {
  return first.getFullYear() === second.getFullYear()
    && first.getMonth() === second.getMonth()
    && first.getDate() === second.getDate();
}

function formatMonthDay(date) {
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

function formatTime(minutes) {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function parseTime(value) {
  const [hour, minute] = value.split(":").map(Number);
  return hour * 60 + minute;
}

function formatDuration(minutes) {
  if (minutes < 60) return `${minutes} 分钟`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder ? `${hours} 小时 ${remainder} 分钟` : `${hours} 小时`;
}

function getWeekNumber(date) {
  return Math.floor((date - semesterStart) / (7 * 24 * 60 * 60 * 1000)) + 1;
}

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum);
}

function getCourseEnd(course) {
  return course.startTime + course.duration;
}

function hasConflict(candidate, ignoredId) {
  return schedule.some((course) => course.id !== ignoredId
    && course.day === candidate.day
    && candidate.startTime < getCourseEnd(course)
    && candidate.startTime + candidate.duration > course.startTime);
}

function showStatus(message) {
  statusMessage.textContent = message;
  statusMessage.classList.add("is-visible");
  window.clearTimeout(statusTimer);
  statusTimer = window.setTimeout(() => statusMessage.classList.remove("is-visible"), 2200);
}

function renderSchedule() {
  grid.replaceChildren();
  const corner = createElement("div", "grid-corner");
  grid.append(corner);

  days.forEach((day, index) => {
    const date = addDays(selectedWeekStart, index);
    const header = createElement("div", "day-header");
    header.style.gridColumn = String(index + 2);
    header.style.gridRow = "1";
    if (sameDay(date, demoToday)) header.classList.add("is-today");
    header.append(createElement("strong", "", day), createElement("span", "", `${date.getMonth() + 1}/${date.getDate()}`));
    grid.append(header);
  });

  for (let hour = 8; hour < 21; hour += 1) {
    const time = createElement("div", "time-slot");
    time.style.gridColumn = "1";
    time.style.gridRow = `${(hour - 8) * 6 + 2} / span 6`;
    time.append(createElement("strong", "", `${String(hour).padStart(2, "0")}:00`));
    grid.append(time);
  }

  for (let slot = 0; slot < slotCount; slot += 1) {
    days.forEach((_, dayIndex) => {
      const cell = createElement("div", `grid-cell${slot % 6 === 0 ? " is-hour" : ""}`);
      cell.style.gridColumn = String(dayIndex + 2);
      cell.style.gridRow = String(slot + 2);
      if (sameDay(addDays(selectedWeekStart, dayIndex), demoToday)) cell.classList.add("is-today");
      grid.append(cell);
    });
  }

  schedule.forEach((course) => {
    const card = createElement("button", `course-card ${course.type}`);
    card.type = "button";
    placeCourseCard(card, course.day, course.startTime, course.duration);
    card.setAttribute("aria-label", `${course.name}，${formatTime(course.startTime)}，${course.room}，${course.teacher}`);
    card.append(
      createElement("strong", "", course.name),
      createElement("span", "course-time", `${formatTime(course.startTime)} - ${formatTime(getCourseEnd(course))}`),
      createElement("span", "", course.room),
      createElement("span", "", course.teacher),
    );
    enableCourseDragging(card, course);
    grid.append(card);
  });

  const weekNumber = getWeekNumber(selectedWeekStart);
  const weekEnd = addDays(selectedWeekStart, 6);
  const totalMinutes = schedule.reduce((total, course) => total + course.duration, 0);
  weekLabel.textContent = `第 ${weekNumber} 周`;
  weekRange.textContent = `${formatMonthDay(selectedWeekStart)} - ${formatMonthDay(weekEnd)}`;
  document.querySelector("#todayText").textContent = `${days[demoToday.getDay() - 1]}，${formatMonthDay(demoToday)}`;
  document.querySelector("#courseCount").textContent = String(schedule.length);
  document.querySelector("#durationCount").textContent = (totalMinutes / 60).toFixed(1).replace(".0", "");
}

function placeCourseCard(card, day, startTime, duration) {
  const startSlot = Math.round((startTime - timelineStart) / snapMinutes);
  const durationSlots = Math.max(1, Math.round(duration / snapMinutes));
  card.style.gridColumn = String(day + 1);
  card.style.gridRow = `${startSlot + 2} / span ${durationSlots}`;
}

function enableCourseDragging(card, course) {
  let dragState = null;
  let suppressClick = false;

  card.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    const gridRect = grid.getBoundingClientRect();
    const firstCell = grid.querySelector(".grid-cell");
    const slotHeight = firstCell ? firstCell.getBoundingClientRect().height : 12;
    const timeColumnWidth = parseFloat(getComputedStyle(grid).gridTemplateColumns.split(" ")[0]);
    const dayWidth = (gridRect.width - timeColumnWidth) / 7;
    dragState = {
      pointerId: event.pointerId,
      originX: event.clientX,
      originY: event.clientY,
      originScrollLeft: scheduleScroll.scrollLeft,
      originScrollTop: scheduleScroll.scrollTop,
      originalDay: course.day,
      originalStart: course.startTime,
      dayWidth,
      slotHeight,
      nextDay: course.day,
      nextStart: course.startTime,
      moved: false,
    };
    card.setPointerCapture(event.pointerId);
  });

  card.addEventListener("pointermove", (event) => {
    if (!dragState || event.pointerId !== dragState.pointerId) return;
    const scrollRect = scheduleScroll.getBoundingClientRect();
    if (event.clientX < scrollRect.left + 36) scheduleScroll.scrollLeft -= 10;
    if (event.clientX > scrollRect.right - 36) scheduleScroll.scrollLeft += 10;
    if (event.clientY < scrollRect.top + 76) scheduleScroll.scrollTop -= 10;
    if (event.clientY > scrollRect.bottom - 28) scheduleScroll.scrollTop += 10;

    const deltaX = event.clientX - dragState.originX + scheduleScroll.scrollLeft - dragState.originScrollLeft;
    const deltaY = event.clientY - dragState.originY + scheduleScroll.scrollTop - dragState.originScrollTop;
    if (!dragState.moved && Math.hypot(deltaX, deltaY) < 5) return;

    event.preventDefault();
    dragState.moved = true;
    card.classList.add("is-dragging");
    card.setAttribute("aria-grabbed", "true");
    dragState.nextDay = clamp(dragState.originalDay + Math.round(deltaX / dragState.dayWidth), 1, 7);
    dragState.nextStart = clamp(
      dragState.originalStart + Math.round(deltaY / dragState.slotHeight) * snapMinutes,
      timelineStart,
      timelineEnd - course.duration,
    );
    placeCourseCard(card, dragState.nextDay, dragState.nextStart, course.duration);
    card.querySelector(".course-time").textContent = `${formatTime(dragState.nextStart)} - ${formatTime(dragState.nextStart + course.duration)}`;
  });

  card.addEventListener("pointerup", (event) => {
    if (!dragState || event.pointerId !== dragState.pointerId) return;
    if (card.hasPointerCapture(event.pointerId)) card.releasePointerCapture(event.pointerId);
    if (!dragState.moved) {
      dragState = null;
      return;
    }

    suppressClick = true;
    const candidate = { ...course, day: dragState.nextDay, startTime: dragState.nextStart };
    if (hasConflict(candidate, course.id)) {
      showStatus("该时间段已有课程，已恢复原位置");
    } else {
      course.day = candidate.day;
      course.startTime = candidate.startTime;
      saveSchedule();
      showStatus(`已调整至${days[course.day - 1]} ${formatTime(course.startTime)}`);
    }
    dragState = null;
    window.requestAnimationFrame(renderSchedule);
  });

  card.addEventListener("pointercancel", () => {
    dragState = null;
    renderSchedule();
  });

  card.addEventListener("click", (event) => {
    if (suppressClick) {
      suppressClick = false;
      event.preventDefault();
      return;
    }
    showCourse(course.id);
  });
}

function showCourse(courseId) {
  const course = schedule.find((item) => item.id === courseId);
  if (!course) return;
  selectedCourseId = courseId;
  setEditing(false);
  updateDialogDetails(course);
  if (!dialog.open) dialog.showModal();
}

function updateDialogDetails(course) {
  document.querySelector("#dialogTitle").textContent = course.name;
  document.querySelector("#dialogType").textContent = typeNames[course.type];
  document.querySelector("#dialogTime").textContent = `${days[course.day - 1]} · ${formatTime(course.startTime)} - ${formatTime(getCourseEnd(course))}（${formatDuration(course.duration)}）`;
  document.querySelector("#dialogRoom").textContent = course.room;
  document.querySelector("#dialogTeacher").textContent = course.teacher;
  document.querySelector("#dialogAccent").style.background = typeColors[course.type];
}

function populateFormOptions() {
  days.forEach((day, index) => dayInput.add(new Option(day, String(index + 1))));
  for (let duration = 10; duration <= 240; duration += 10) {
    durationInput.add(new Option(formatDuration(duration), String(duration)));
  }
}

function updateStartTimeLimit() {
  const duration = Number(durationInput.value) || 10;
  const maximumStart = timelineEnd - duration;
  startTimeInput.max = formatTime(maximumStart);
  if (startTimeInput.value && parseTime(startTimeInput.value) > maximumStart) {
    startTimeInput.value = formatTime(maximumStart);
  }
}

function setEditing(isEditing) {
  dialog.classList.toggle("is-editing", isEditing);
  courseForm.hidden = !isEditing;
  dialogDetails.hidden = isEditing;
}

function beginEditing() {
  const course = schedule.find((item) => item.id === selectedCourseId);
  if (!course) return;
  courseForm.elements.name.value = course.name;
  courseForm.elements.teacher.value = course.teacher;
  courseForm.elements.room.value = course.room;
  courseForm.elements.type.value = course.type;
  courseForm.elements.day.value = String(course.day);
  courseForm.elements.startTime.value = formatTime(course.startTime);
  courseForm.elements.duration.value = String(course.duration);
  updateStartTimeLimit();
  setEditing(true);
  courseForm.elements.name.focus();
  courseForm.elements.name.select();
}

function closeCourseDialog() {
  setEditing(false);
  dialog.close();
}

function changeWeek(offset) {
  selectedWeekStart = addDays(selectedWeekStart, offset * 7);
  renderSchedule();
}

durationInput.addEventListener("change", updateStartTimeLimit);

courseForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const course = schedule.find((item) => item.id === selectedCourseId);
  if (!course) return;

  const candidate = {
    ...course,
    name: courseForm.elements.name.value.trim(),
    teacher: courseForm.elements.teacher.value.trim(),
    room: courseForm.elements.room.value.trim(),
    type: courseForm.elements.type.value,
    day: Number(courseForm.elements.day.value),
    startTime: parseTime(courseForm.elements.startTime.value),
    duration: Number(courseForm.elements.duration.value),
  };

  if (hasConflict(candidate, course.id)) {
    showStatus("该时间段已有课程，请选择其他时间");
    return;
  }

  Object.assign(course, candidate);
  saveSchedule();
  renderSchedule();
  updateDialogDetails(course);
  setEditing(false);
  showStatus("课程信息已保存");
});

document.querySelector("#previousWeek").addEventListener("click", () => changeWeek(-1));
document.querySelector("#nextWeek").addEventListener("click", () => changeWeek(1));
document.querySelector("#todayButton").addEventListener("click", () => {
  selectedWeekStart = new Date(currentWeekStart);
  renderSchedule();
});
document.querySelector("#currentWeek").addEventListener("click", () => {
  selectedWeekStart = new Date(currentWeekStart);
  renderSchedule();
});
document.querySelector("#editCourse").addEventListener("click", beginEditing);
document.querySelector("#cancelEdit").addEventListener("click", () => setEditing(false));
document.querySelector("#closeDialog").addEventListener("click", closeCourseDialog);
dialog.addEventListener("click", (event) => {
  if (event.target === dialog && !dialog.classList.contains("is-editing")) closeCourseDialog();
});
dialog.addEventListener("cancel", () => setEditing(false));

populateFormOptions();
renderSchedule();
if (window.lucide) window.lucide.createIcons();
