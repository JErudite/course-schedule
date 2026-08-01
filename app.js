const SUPABASE_URL = "https://dpjyjzszqmgakwtdhmwq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_PyH98bSXQ2rSCzIfmLNN5w_4rTJ6P-x";

const days = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
const defaultCourseColor = "#ffffff";
const colorPalette = [
  { value: "", label: "自动 / 白色", color: "#ffffff" },
  { value: "#f44336", label: "红色", color: "#f44336" },
  { value: "#e91e63", label: "玫红", color: "#e91e63" },
  { value: "#9c27b0", label: "紫色", color: "#9c27b0" },
  { value: "#673ab7", label: "深紫", color: "#673ab7" },
  { value: "#3f51b5", label: "靛蓝", color: "#3f51b5" },
  { value: "#2196f3", label: "蓝色", color: "#2196f3" },
  { value: "#00a6a6", label: "青色", color: "#00a6a6" },
  { value: "#4caf50", label: "绿色", color: "#4caf50" },
  { value: "#8bc34a", label: "浅绿", color: "#8bc34a" },
  { value: "#ffc107", label: "黄色", color: "#ffc107" },
  { value: "#ff9800", label: "橙色", color: "#ff9800" },
  { value: "#795548", label: "棕色", color: "#795548" },
  { value: "#607d8b", label: "灰蓝", color: "#607d8b" },
];
const petCatalog = [
  { id: "cat", name: "猫咪", mood: "开心", image: "assets/pets/cat.png", animation: "pet-bounce" },
  { id: "dog", name: "小狗", mood: "兴奋", image: "assets/pets/dog.png", animation: "pet-wag" },
  { id: "rabbit", name: "兔子", mood: "活泼", image: "assets/pets/rabbit.png", animation: "pet-hop" },
  { id: "hamster", name: "仓鼠", mood: "满足", image: "assets/pets/hamster.png", animation: "pet-nibble" },
  { id: "fox", name: "狐狸", mood: "害羞", image: "assets/pets/fox.png", animation: "pet-sway" },
  { id: "panda", name: "熊猫", mood: "困困", image: "assets/pets/panda.png", animation: "pet-doze" },
  { id: "bear", name: "小熊", mood: "友好", image: "assets/pets/bear.png", animation: "pet-wave" },
  { id: "frog", name: "青蛙", mood: "惊喜", image: "assets/pets/frog.png", animation: "pet-pop" },
];
const timelineStart = 8 * 60;
const timelineEnd = 21 * 60;
const snapMinutes = 10;
const slotCount = (timelineEnd - timelineStart) / snapMinutes;
const repeatPresets = new Set([1, 2, 3, 7]);
const scheduleTimeZone = "Asia/Shanghai";

let scheduleToday = getScheduleToday();
let currentWeekStart = startOfWeek(scheduleToday);
let selectedWeekStart = new Date(currentWeekStart);
let weekOverviewYear = getISOWeekYear(selectedWeekStart);
let selectedCourseId = null;
let selectedOccurrenceDate = null;
let formMode = "view";
let schedule = [];
let students = [];
let currentUser = null;
let canEdit = false;
let realtimeChannel = null;
let realtimeAssignmentChannel = null;
let realtimeStudentChannel = null;
let selectedStudentId = null;
let statusTimer = null;
let copiedCourse = null;
let isPastingCourse = false;

const grid = document.querySelector("#scheduleGrid");
const scheduleScroll = document.querySelector("#scheduleScroll");
const weekLabel = document.querySelector("#weekLabel");
const weekRange = document.querySelector("#weekRange");
const weekOverviewDialog = document.querySelector("#weekOverviewDialog");
const weekThumbnailGrid = document.querySelector("#weekThumbnailGrid");
const dialog = document.querySelector("#courseDialog");
const courseForm = document.querySelector("#courseForm");
const dialogDetails = document.querySelector("#dialogDetails");
const dialogCourseActions = document.querySelector("#dialogCourseActions");
const dayStartInput = document.querySelector("#courseStartDateInput");
const startTimeInput = document.querySelector("#courseStartTimeInput");
const durationInput = document.querySelector("#courseDurationInput");
const repeatInput = document.querySelector("#courseRepeatInput");
const repeatDaysInput = document.querySelector("#courseRepeatDaysInput");
const customRepeatField = document.querySelector("#customRepeatField");
const repeatStopInput = document.querySelector("#courseRepeatStopInput");
const repeatStopField = document.querySelector("#repeatStopField");
const repeatCountInput = document.querySelector("#courseRepeatCountInput");
const repeatCountField = document.querySelector("#repeatCountField");
const courseColorInput = document.querySelector("#courseColorInput");
const saveCourseButton = document.querySelector("#saveCourse");
const statusMessage = document.querySelector("#statusMessage");
const authButton = document.querySelector("#authButton");
const appShell = document.querySelector("#appShell");
const loginScreen = document.querySelector("#loginScreen");
const loginForm = document.querySelector("#loginForm");
const loginSubmit = document.querySelector("#loginSubmit");
const loginError = document.querySelector("#loginError");
const deleteDialog = document.querySelector("#deleteDialog");
const confirmDeleteButton = document.querySelector("#confirmDelete");
const studentForm = document.querySelector("#studentForm");
const addStudentButton = document.querySelector("#addStudentButton");
const deleteStudentDialog = document.querySelector("#deleteStudentDialog");
const confirmDeleteStudentButton = document.querySelector("#confirmDeleteStudent");
const lessonSummary = document.querySelector("#lessonSummary");
const scheduleSection = document.querySelector("#scheduleSection");
const adminHub = document.querySelector("#adminHub");
const studentManagementPage = document.querySelector("#studentManagementPage");
const petManagementPage = document.querySelector("#petManagementPage");
const pageFooter = document.querySelector("#pageFooter");
const copyModeBar = document.querySelector("#copyModeBar");
const visitorPet = document.querySelector("#visitorPet");

if (!window.supabase) {
  setSyncState("offline", "连接组件加载失败");
  showStatus("连接组件加载失败，请刷新页面重试");
  throw new Error("Supabase client library failed to load");
}

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    detectSessionInUrl: true,
    autoRefreshToken: true,
  },
});

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

function parseISODate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function toISODate(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function daysBetween(first, second) {
  return Math.round((startOfDay(second) - startOfDay(first)) / (24 * 60 * 60 * 1000));
}

function startOfDay(date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function getScheduleToday() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: scheduleTimeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return new Date(Number(values.year), Number(values.month) - 1, Number(values.day));
}

function getAcademicPeriod(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  let academicStartYear;
  let semesterName;

  if (month === 0) {
    academicStartYear = year - 1;
    semesterName = "秋季学期";
  } else if (month >= 7) {
    academicStartYear = year;
    semesterName = "秋季学期";
  } else {
    academicStartYear = year - 1;
    semesterName = "春季学期";
  }

  return `${academicStartYear} - ${academicStartYear + 1} 学年 · ${semesterName}`;
}

function updateAcademicPeriod() {
  document.querySelector("#termLabel").textContent = getAcademicPeriod(scheduleToday);
}

function refreshCurrentDate() {
  const nextToday = getScheduleToday();
  if (sameDay(nextToday, scheduleToday)) return;

  const wasShowingCurrentWeek = sameDay(selectedWeekStart, currentWeekStart);
  scheduleToday = nextToday;
  currentWeekStart = startOfWeek(scheduleToday);
  if (wasShowingCurrentWeek) selectedWeekStart = new Date(currentWeekStart);
  updateAcademicPeriod();
  renderSchedule();
  if (weekOverviewDialog.open) renderWeekOverview();
}

function startDateAutoRefresh() {
  updateAcademicPeriod();
  window.setInterval(refreshCurrentDate, 60 * 1000);
  window.addEventListener("focus", refreshCurrentDate);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) refreshCurrentDate();
  });
}

function formatMonthDay(date) {
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

function formatFullDate(date) {
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
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

function getRepeatDescription(interval, count = null) {
  if (interval === null) return "不重复";
  let description;
  if (interval === 1) description = "每天重复";
  else if (interval === 7) description = "每周重复";
  else description = `每 ${interval} 天重复`;
  return count === null ? `${description} · 持续` : `${description} · 共 ${count} 次`;
}

function getWeekNumber(date) {
  const isoDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const weekday = isoDate.getUTCDay() || 7;
  isoDate.setUTCDate(isoDate.getUTCDate() + 4 - weekday);
  const isoYearStart = new Date(Date.UTC(isoDate.getUTCFullYear(), 0, 1));
  return Math.ceil(((isoDate - isoYearStart) / (24 * 60 * 60 * 1000) + 1) / 7);
}

function getISOWeekYear(date) {
  const isoDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const weekday = isoDate.getUTCDay() || 7;
  isoDate.setUTCDate(isoDate.getUTCDate() + 4 - weekday);
  return isoDate.getUTCFullYear();
}

function getISOWeeksInYear(year) {
  return getWeekNumber(new Date(year, 11, 28));
}

function getISOWeekStart(year, weekNumber) {
  const firstWeekStart = startOfWeek(new Date(year, 0, 4));
  return addDays(firstWeekStart, (weekNumber - 1) * 7);
}

function renderWeekOverview() {
  const totalWeeks = getISOWeeksInYear(weekOverviewYear);
  document.querySelector("#weekOverviewTitle").textContent = `${weekOverviewYear} 年周次总览`;
  document.querySelector("#weekOverviewYear").textContent = `${weekOverviewYear} 年`;
  weekThumbnailGrid.replaceChildren();

  for (let number = 1; number <= totalWeeks; number += 1) {
    const start = getISOWeekStart(weekOverviewYear, number);
    const end = addDays(start, 6);
    const button = createElement("button", "week-thumbnail");
    button.type = "button";
    button.dataset.week = String(number);
    button.classList.toggle("is-current", sameDay(start, currentWeekStart));
    button.classList.toggle("is-selected", sameDay(start, selectedWeekStart));
    button.setAttribute("aria-label", `选择第 ${number} 周，${formatMonthDay(start)}至${formatMonthDay(end)}`);

    const miniature = createElement("span", "week-miniature");
    miniature.setAttribute("aria-hidden", "true");
    for (let day = 0; day < 7; day += 1) miniature.append(createElement("i"));
    button.append(
      createElement("strong", "", `第 ${number} 周`),
      createElement("small", "", `${start.getMonth() + 1}/${start.getDate()} - ${end.getMonth() + 1}/${end.getDate()}`),
      miniature,
    );
    button.addEventListener("click", () => {
      selectedWeekStart = start;
      renderSchedule();
      weekOverviewDialog.close();
    });
    weekThumbnailGrid.append(button);
  }
}

function openWeekOverview() {
  weekOverviewYear = getISOWeekYear(selectedWeekStart);
  renderWeekOverview();
  weekOverviewDialog.showModal();
  window.requestAnimationFrame(() => {
    weekThumbnailGrid.querySelector(".week-thumbnail.is-selected")?.scrollIntoView({ block: "center" });
  });
}

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum);
}

function getCourseEnd(course) {
  return course.startTime + course.duration;
}

function gcd(first, second) {
  let a = Math.abs(first);
  let b = Math.abs(second);
  while (b) [a, b] = [b, a % b];
  return a;
}

function occurrenceIndexForDate(course, date) {
  const difference = daysBetween(parseISODate(course.startDate), date);
  if (difference < 0) return -1;
  if (course.repeatIntervalDays === null) return difference === 0 ? 0 : -1;
  if (difference % course.repeatIntervalDays !== 0) return -1;
  const index = difference / course.repeatIntervalDays;
  return course.repeatCount === null || index < course.repeatCount ? index : -1;
}

function seriesShareADate(first, second) {
  if (first.repeatIntervalDays === null) {
    return occurrenceIndexForDate(second, parseISODate(first.startDate)) >= 0;
  }
  if (second.repeatIntervalDays === null) {
    return occurrenceIndexForDate(first, parseISODate(second.startDate)) >= 0;
  }
  if (first.repeatCount === null && second.repeatCount === null) {
    const difference = daysBetween(parseISODate(second.startDate), parseISODate(first.startDate));
    return difference % gcd(first.repeatIntervalDays, second.repeatIntervalDays) === 0;
  }

  const finite = first.repeatCount !== null
    && (second.repeatCount === null || first.repeatCount <= second.repeatCount) ? first : second;
  const other = finite === first ? second : first;
  for (let index = 0; index < finite.repeatCount; index += 1) {
    const date = addDays(parseISODate(finite.startDate), index * finite.repeatIntervalDays);
    if (occurrenceIndexForDate(other, date) >= 0) return true;
  }
  return false;
}

function hasSeriesConflict(candidate, ignoredId) {
  return schedule.some((course) => course.id !== ignoredId
    && candidate.studentIds.some((studentId) => course.studentIds.includes(studentId))
    && candidate.startTime < getCourseEnd(course)
    && getCourseEnd(candidate) > course.startTime
    && seriesShareADate(candidate, course));
}

function courseOccursOnDate(course, date) {
  return occurrenceIndexForDate(course, date) >= 0;
}

function getVisibleOccurrences() {
  const occurrences = [];
  schedule.forEach((course) => {
    for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
      const date = addDays(selectedWeekStart, dayIndex);
      if (courseOccursOnDate(course, date)) occurrences.push({ course, date, dayIndex });
    }
  });
  return occurrences.sort((first, second) => first.dayIndex - second.dayIndex || first.course.startTime - second.course.startTime);
}

function mapCourse(row) {
  const repeatIntervalDays = row.repeat_interval_days === null ? null : Number(row.repeat_interval_days);
  return {
    id: row.id,
    startDate: row.start_date,
    repeatIntervalDays,
    repeatCount: repeatIntervalDays === null ? 1 : row.repeat_count == null ? null : Number(row.repeat_count),
    startTime: Number(row.start_time),
    duration: Number(row.duration),
    name: row.name,
    notes: row.notes || "",
    color: row.color || "",
    studentIds: (row.course_students || []).map((assignment) => assignment.student_id),
    version: Number(row.version),
    updatedAt: row.updated_at,
  };
}

function getEffectiveCourseColor(course) {
  if (course.color) return course.color;
  const assignedStudent = students.find((student) => course.studentIds.includes(student.id) && student.color);
  if (assignedStudent?.color) return assignedStudent.color;
  if (!canEdit && currentUser?.color) return currentUser.color;
  return defaultCourseColor;
}

function colorWithAlpha(color, alpha) {
  const value = color.replace("#", "");
  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function applyCourseColor(element, color) {
  const effective = color || defaultCourseColor;
  const isWhite = effective.toLowerCase() === defaultCourseColor;
  element.style.setProperty("--course-color", isWhite ? "#aeb7b0" : effective);
  element.style.setProperty("--course-background", isWhite ? "#ffffff" : colorWithAlpha(effective, 0.14));
  element.style.setProperty("--course-border", isWhite ? "#d7ddd8" : colorWithAlpha(effective, 0.42));
}

function showStatus(message) {
  statusMessage.textContent = message;
  statusMessage.classList.add("is-visible");
  window.clearTimeout(statusTimer);
  statusTimer = window.setTimeout(() => statusMessage.classList.remove("is-visible"), 3200);
}

function setSyncState(state, text) {
  const syncState = document.querySelector("#syncState");
  syncState.className = `sync-state is-${state}`;
  document.querySelector("#syncStateText").textContent = text;
}

function updateLessonSummary() {
  lessonSummary.hidden = canEdit || !currentUser;
  const current = Number(currentUser?.current_lesson_count) || 0;
  const required = Number(currentUser?.required_lesson_count) || 0;
  document.querySelector("#currentLessonCount").textContent = String(current);
  document.querySelector("#requiredLessonCount").textContent = String(required);
  document.querySelector("#remainingLessonCount").textContent = String(Math.max(required - current, 0));
  document.querySelector("#lifetimeLessonCount").textContent = String(Number(currentUser?.lesson_count) || 0);
}

function updateVisitorPet() {
  const pet = petCatalog.find((item) => item.id === currentUser?.pet);
  visitorPet.hidden = canEdit || !currentUser || !pet;
  if (!pet) return;
  const image = document.querySelector("#visitorPetImage");
  image.src = pet.image;
  image.alt = `${pet.name}，${pet.mood}表情`;
  image.className = `pet-image ${pet.animation}`;
  document.querySelector("#visitorPetMood").textContent = `${pet.mood}表情`;
  document.querySelector("#visitorPetName").textContent = pet.name;
}

function hideAdminPages() {
  adminHub.hidden = true;
  studentManagementPage.hidden = true;
  petManagementPage.hidden = true;
}

function showScheduleView() {
  scheduleSection.hidden = false;
  pageFooter.hidden = false;
  hideAdminPages();
  document.body.classList.remove("is-admin-view");
  renderSchedule();
}

function renderAdminHubCounts() {
  document.querySelector("#adminStudentCount").textContent = `${students.length} 人`;
  document.querySelector("#assignedPetCount").textContent = `${students.filter((student) => student.pet).length} 人已分配`;
}

async function showAdminHub() {
  if (!canEdit) return;
  await loadStudents();
  scheduleSection.hidden = true;
  pageFooter.hidden = true;
  hideAdminPages();
  adminHub.hidden = false;
  document.body.classList.add("is-admin-view");
  document.querySelector("#openStudentManagement").focus();
}

async function showStudentManagement() {
  if (!canEdit) return;
  await loadStudents();
  hideAdminPages();
  studentManagementPage.hidden = false;
  document.querySelector("#studentUsernameInput").focus();
}

async function showPetManagement() {
  if (!canEdit) return;
  await loadStudents();
  hideAdminPages();
  petManagementPage.hidden = false;
  document.querySelector("#petStudentList")?.querySelector("button")?.focus();
}

function updateCopyModeUI() {
  copyModeBar.hidden = !copiedCourse || !canEdit;
  document.body.classList.toggle("is-copying-course", Boolean(copiedCourse && canEdit));
  document.querySelector("#copiedCourseName").textContent = copiedCourse?.name || "";
  if (window.lucide) window.lucide.createIcons();
}

function clearCopyMode() {
  copiedCourse = null;
  updateCopyModeUI();
}

function updatePermissionUI() {
  document.body.classList.toggle("can-edit", canEdit);
  document.querySelector("#addCourse").hidden = !canEdit;
  document.querySelector("#studentManagerButton").hidden = !canEdit;
  dialogCourseActions.hidden = !canEdit || formMode !== "view" || !selectedCourseId;
  document.querySelector("#permissionHint").textContent = canEdit
    ? `${currentUser?.username || "管理员"} · 可管理课程、学生账号和课次进度`
    : `${currentUser?.username || "访客"} · 只显示分配给你的课程`;
  updateLessonSummary();
  updateVisitorPet();

  authButton.setAttribute("aria-label", "退出登录");
  authButton.innerHTML = `<i data-lucide="log-out"></i><span>退出登录</span>`;

  if (!canEdit && formMode !== "view" && dialog.open) dialog.close();
  if (!canEdit) {
    clearCopyMode();
    showScheduleView();
  }
  updateCopyModeUI();
  if (window.lucide) window.lucide.createIcons();
  renderSchedule();
  refreshOpenDialog();
}

function getCourseStudentNames(course) {
  if (!canEdit) return [currentUser?.username].filter(Boolean);
  return students
    .filter((student) => course.studentIds.includes(student.id))
    .map((student) => student.username);
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
    if (sameDay(date, scheduleToday)) header.classList.add("is-today");
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
      cell.dataset.dayIndex = String(dayIndex);
      cell.dataset.slot = String(slot);
      cell.style.gridColumn = String(dayIndex + 2);
      cell.style.gridRow = String(slot + 2);
      if (sameDay(addDays(selectedWeekStart, dayIndex), scheduleToday)) cell.classList.add("is-today");
      grid.append(cell);
    });
  }

  const occurrences = getVisibleOccurrences();
  occurrences.forEach(({ course, date, dayIndex }) => {
    const studentNames = getCourseStudentNames(course);
    const studentText = studentNames.length ? studentNames.join("、") : "未分配学生";
    const card = createElement("button", `course-card${canEdit ? " is-editable" : " is-readonly"}`);
    card.type = "button";
    card.dataset.courseId = course.id;
    card.dataset.occurrenceDate = toISODate(date);
    placeCourseCard(card, dayIndex, course.startTime, course.duration);
    applyCourseColor(card, getEffectiveCourseColor(course));
    card.setAttribute("aria-label", `${course.name}，${formatTime(course.startTime)}，上课学生：${studentText}`);
    card.title = canEdit ? "拖动将移动整个课程系列，点击可编辑详情" : "点击查看课程详情";
    card.append(
      createElement("strong", "", course.name),
      createElement("span", "course-time", `${formatTime(course.startTime)} - ${formatTime(getCourseEnd(course))}`),
      createElement("span", "course-students", studentText),
    );
    enableCourseInteraction(card, course, { date, dayIndex });
    grid.append(card);
  });

  if (occurrences.length === 0) {
    const empty = createElement("div", "schedule-empty", "本周暂无课程");
    empty.style.gridColumn = "2 / 9";
    empty.style.gridRow = "2 / span 12";
    grid.append(empty);
  }

  const weekNumber = getWeekNumber(selectedWeekStart);
  const weekEnd = addDays(selectedWeekStart, 6);
  const totalMinutes = occurrences.reduce((total, occurrence) => total + occurrence.course.duration, 0);
  weekLabel.textContent = `第 ${weekNumber} 周`;
  weekRange.textContent = `${formatMonthDay(selectedWeekStart)} - ${formatMonthDay(weekEnd)}`;
  document.querySelector("#todayText").textContent = `${days[(scheduleToday.getDay() + 6) % 7]}，${formatMonthDay(scheduleToday)}`;
  document.querySelector("#courseCount").textContent = String(schedule.length);
  document.querySelector("#occurrenceCount").textContent = String(occurrences.length);
  document.querySelector("#durationCount").textContent = (totalMinutes / 60).toFixed(1).replace(".0", "");
}

function placeCourseCard(card, dayIndex, startTime, duration) {
  const startSlot = Math.round((startTime - timelineStart) / snapMinutes);
  const durationSlots = Math.max(1, Math.round(duration / snapMinutes));
  card.style.gridColumn = String(dayIndex + 2);
  card.style.gridRow = `${startSlot + 2} / span ${durationSlots}`;
}

function enableCourseInteraction(card, course, occurrence) {
  let dragState = null;
  let suppressClick = false;

  if (canEdit) {
    card.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      const gridRect = grid.getBoundingClientRect();
      const firstCell = grid.querySelector(".grid-cell");
      const slotHeight = firstCell ? firstCell.getBoundingClientRect().height : 12;
      const timeColumnWidth = parseFloat(getComputedStyle(grid).gridTemplateColumns.split(" ")[0]);
      dragState = {
        pointerId: event.pointerId,
        originX: event.clientX,
        originY: event.clientY,
        originScrollLeft: scheduleScroll.scrollLeft,
        originScrollTop: scheduleScroll.scrollTop,
        originalDayIndex: occurrence.dayIndex,
        originalStart: course.startTime,
        dayWidth: (gridRect.width - timeColumnWidth) / 7,
        slotHeight,
        nextDayIndex: occurrence.dayIndex,
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
      dragState.nextDayIndex = clamp(dragState.originalDayIndex + Math.round(deltaX / dragState.dayWidth), 0, 6);
      dragState.nextStart = clamp(
        dragState.originalStart + Math.round(deltaY / dragState.slotHeight) * snapMinutes,
        timelineStart,
        timelineEnd - course.duration,
      );
      placeCourseCard(card, dragState.nextDayIndex, dragState.nextStart, course.duration);
      card.querySelector(".course-time").textContent = `${formatTime(dragState.nextStart)} - ${formatTime(dragState.nextStart + course.duration)}`;
    });

    card.addEventListener("pointerup", async (event) => {
      if (!dragState || event.pointerId !== dragState.pointerId) return;
      if (card.hasPointerCapture(event.pointerId)) card.releasePointerCapture(event.pointerId);
      if (!dragState.moved) {
        dragState = null;
        return;
      }

      suppressClick = true;
      const dayShift = dragState.nextDayIndex - dragState.originalDayIndex;
      const candidate = {
        ...course,
        startDate: toISODate(addDays(parseISODate(course.startDate), dayShift)),
        startTime: dragState.nextStart,
      };
      dragState = null;
      card.classList.remove("is-dragging");
      card.removeAttribute("aria-grabbed");

      if (hasSeriesConflict(candidate, course.id)) {
        showStatus("该课程系列会与现有课程冲突，已恢复原位置");
        renderSchedule();
        return;
      }

      card.classList.add("is-saving");
      showStatus("正在移动整个课程系列…");
      await persistCourseUpdate(course, candidate, "课程系列已移动并实时同步");
    });

    card.addEventListener("pointercancel", () => {
      dragState = null;
      renderSchedule();
    });
  }

  card.addEventListener("click", (event) => {
    if (suppressClick) {
      suppressClick = false;
      event.preventDefault();
      return;
    }
    showCourse(course.id, toISODate(occurrence.date));
  });
}

function enableTimelineCreation() {
  let selection = null;

  function getSlotAtPointer(event) {
    const gridRect = grid.getBoundingClientRect();
    const firstCell = grid.querySelector(".grid-cell");
    const firstHeader = grid.querySelector(".day-header");
    const slotHeight = firstCell?.getBoundingClientRect().height || 12;
    const headerHeight = firstHeader?.getBoundingClientRect().height || 64;
    return clamp(Math.floor((event.clientY - gridRect.top - headerHeight) / slotHeight), 0, slotCount - 1);
  }

  function updateSelection(currentSlot) {
    if (!selection) return;
    selection.currentSlot = currentSlot;
    const startSlot = Math.min(selection.anchorSlot, currentSlot);
    const endSlot = Math.max(selection.anchorSlot, currentSlot) + 1;
    const startTime = timelineStart + startSlot * snapMinutes;
    const duration = (endSlot - startSlot) * snapMinutes;
    selection.startSlot = startSlot;
    selection.startTime = startTime;
    selection.duration = duration;
    placeCourseCard(selection.preview, selection.dayIndex, startTime, duration);
    selection.preview.querySelector("span").textContent = `${formatTime(startTime)} - ${formatTime(startTime + duration)}`;
  }

  function clearSelection() {
    if (!selection) return;
    if (grid.hasPointerCapture(selection.pointerId)) grid.releasePointerCapture(selection.pointerId);
    selection.preview.remove();
    selection = null;
    document.body.classList.remove("is-selecting-course");
  }

  grid.addEventListener("pointerdown", (event) => {
    if (!canEdit || event.button !== 0 || dialog.open) return;
    const cell = event.target.closest(".grid-cell");
    if (!cell) return;

    if (copiedCourse) {
      event.preventDefault();
      if (isPastingCourse) return;
      const targetStart = timelineStart + Number(cell.dataset.slot) * snapMinutes;
      pasteCopiedCourse(Number(cell.dataset.dayIndex), targetStart);
      return;
    }

    event.preventDefault();
    const preview = createElement("div", "course-create-preview");
    preview.append(createElement("span", "", ""));
    selection = {
      pointerId: event.pointerId,
      dayIndex: Number(cell.dataset.dayIndex),
      anchorSlot: Number(cell.dataset.slot),
      currentSlot: Number(cell.dataset.slot),
      startSlot: Number(cell.dataset.slot),
      startTime: timelineStart + Number(cell.dataset.slot) * snapMinutes,
      duration: snapMinutes,
      preview,
    };
    grid.append(preview);
    grid.setPointerCapture(event.pointerId);
    document.body.classList.add("is-selecting-course");
    updateSelection(selection.anchorSlot);
  });

  grid.addEventListener("pointermove", (event) => {
    if (!selection || event.pointerId !== selection.pointerId) return;
    event.preventDefault();
    const scrollRect = scheduleScroll.getBoundingClientRect();
    if (event.clientY < scrollRect.top + 76) scheduleScroll.scrollTop -= 10;
    if (event.clientY > scrollRect.bottom - 28) scheduleScroll.scrollTop += 10;
    updateSelection(getSlotAtPointer(event));
  });

  grid.addEventListener("pointerup", (event) => {
    if (!selection || event.pointerId !== selection.pointerId) return;
    const preset = {
      startDate: toISODate(addDays(selectedWeekStart, selection.dayIndex)),
      startTime: selection.startTime,
      duration: selection.duration,
    };
    clearSelection();
    openNewCourse(preset);
  });

  grid.addEventListener("pointercancel", clearSelection);
}

async function pasteCopiedCourse(dayIndex, targetStart) {
  if (!canEdit || !copiedCourse || isPastingCourse) return;
  const candidate = {
    ...copiedCourse,
    startDate: toISODate(addDays(selectedWeekStart, dayIndex)),
    startTime: Math.min(targetStart, timelineEnd - copiedCourse.duration),
    studentIds: [...copiedCourse.studentIds],
  };
  if (hasSeriesConflict(candidate)) {
    showStatus("粘贴位置与该学生的现有课程冲突，请换一个时间刻度");
    return;
  }

  isPastingCourse = true;
  const saved = await createCourse(candidate, `“${candidate.name}”已粘贴，可继续选择时间刻度`);
  isPastingCourse = false;
  if (saved) updateCopyModeUI();
}

function copySelectedCourse() {
  const course = schedule.find((item) => item.id === selectedCourseId);
  if (!canEdit || !course) return;
  copiedCourse = {
    startDate: course.startDate,
    repeatIntervalDays: course.repeatIntervalDays,
    repeatCount: course.repeatCount,
    startTime: course.startTime,
    duration: course.duration,
    name: course.name,
    notes: course.notes,
    color: course.color,
    studentIds: [...course.studentIds],
  };
  dialog.close();
  updateCopyModeUI();
  showStatus(`已复制“${course.name}”，点击时间轴即可粘贴`);
}

function showCourse(courseId, occurrenceDate) {
  const course = schedule.find((item) => item.id === courseId);
  if (!course) return;
  selectedCourseId = courseId;
  selectedOccurrenceDate = occurrenceDate;
  formMode = "view";
  showCourseDetails(course);
  if (!dialog.open) dialog.showModal();
}

function showCourseDetails(course) {
  const occurrence = selectedOccurrenceDate ? parseISODate(selectedOccurrenceDate) : parseISODate(course.startDate);
  dialog.classList.remove("is-editing");
  courseForm.hidden = true;
  dialogDetails.hidden = false;
  document.querySelector("#dialogTitle").textContent = course.name;
  document.querySelector("#dialogType").textContent = course.repeatIntervalDays === null ? "单次课程" : "重复课程";
  document.querySelector("#dialogTime").textContent = `${formatFullDate(occurrence)} · ${formatTime(course.startTime)} - ${formatTime(getCourseEnd(course))}（${formatDuration(course.duration)}）`;
  const assignedNames = canEdit
    ? students.filter((student) => course.studentIds.includes(student.id)).map((student) => student.username)
    : [currentUser?.username].filter(Boolean);
  document.querySelector("#dialogStudents").textContent = assignedNames.length
    ? `上课学生：${assignedNames.join("、")}`
    : "尚未分配学生";
  document.querySelector("#dialogRepeat").textContent = `${getRepeatDescription(course.repeatIntervalDays, course.repeatCount)} · 首次 ${formatFullDate(parseISODate(course.startDate))}`;
  const notes = document.querySelector("#dialogNotes");
  notes.textContent = course.notes || "暂无备注";
  notes.classList.toggle("is-empty", !course.notes);
  document.querySelector("#dialogAccent").style.background = getEffectiveCourseColor(course);
  dialogCourseActions.hidden = !canEdit;
}

function refreshOpenDialog() {
  if (!dialog.open || formMode !== "view" || !selectedCourseId) return;
  const course = schedule.find((item) => item.id === selectedCourseId);
  if (!course) {
    dialog.close();
    return;
  }
  showCourseDetails(course);
}

function populateDurationOptions() {
  for (let minutes = 10; minutes <= 240; minutes += 10) {
    durationInput.add(new Option(formatDuration(minutes), String(minutes)));
  }
}

function setDurationValue(minutes) {
  durationInput.querySelectorAll("option[data-extended-duration]").forEach((option) => option.remove());
  const value = String(minutes);
  if (!Array.from(durationInput.options).some((option) => option.value === value)) {
    const option = new Option(formatDuration(minutes), value);
    option.dataset.extendedDuration = "true";
    durationInput.add(option);
  }
  durationInput.value = value;
}

function updateRepeatFields() {
  const isRepeating = repeatInput.value !== "";
  customRepeatField.hidden = repeatInput.value !== "custom";
  repeatStopField.hidden = !isRepeating;
  repeatCountField.hidden = !isRepeating || repeatStopInput.value !== "count";
}

function setRepeatControls(interval, count) {
  if (interval === null) repeatInput.value = "";
  else if (repeatPresets.has(interval)) repeatInput.value = String(interval);
  else repeatInput.value = "custom";
  repeatDaysInput.value = String(interval ?? 4);
  repeatStopInput.value = interval !== null && count !== null ? "count" : "";
  repeatCountInput.value = String(count ?? 2);
  updateRepeatFields();
}

function readRepeatInterval() {
  if (repeatInput.value === "") return null;
  if (repeatInput.value === "custom") return Number(repeatDaysInput.value);
  return Number(repeatInput.value);
}

function readRepeatCount(interval) {
  if (interval === null) return 1;
  return repeatStopInput.value === "count" ? Number(repeatCountInput.value) : null;
}

function renderColorPalette(container, selectedValue, onSelect, labelPrefix) {
  container.replaceChildren();
  colorPalette.forEach((option) => {
    const button = createElement("button", `color-swatch${option.value === selectedValue ? " is-selected" : ""}`);
    button.type = "button";
    button.dataset.value = option.value;
    button.style.setProperty("--swatch-color", option.color);
    button.title = option.label;
    button.setAttribute("aria-label", `${labelPrefix}：${option.label}`);
    button.setAttribute("role", "radio");
    button.setAttribute("aria-checked", String(option.value === selectedValue));
    if (!option.value) button.classList.add("is-auto");
    button.addEventListener("click", () => {
      onSelect(option.value);
      renderColorPalette(container, option.value, onSelect, labelPrefix);
    });
    container.append(button);
  });
}

function setCourseColor(value = "") {
  courseColorInput.value = value;
  renderColorPalette(
    document.querySelector("#courseColorPalette"),
    value,
    setCourseColor,
    "课程颜色",
  );
}

function fillCourseForm(course) {
  document.querySelector("#courseNameInput").value = course?.name || "";
  dayStartInput.value = course?.startDate || toISODate(selectedWeekStart);
  startTimeInput.value = formatTime(course?.startTime ?? timelineStart);
  setDurationValue(course?.duration ?? 100);
  document.querySelector("#courseNotesInput").value = course?.notes || "";
  setRepeatControls(course ? course.repeatIntervalDays : 7, course ? course.repeatCount : null);
  setCourseColor(course?.color || "");
  renderStudentChecklist(course?.studentIds || []);
}

function renderStudentChecklist(selectedIds) {
  const selected = new Set(selectedIds);
  const checklist = document.querySelector("#studentChecklist");
  checklist.replaceChildren();
  students.forEach((student) => {
    const label = createElement("label", "student-check-item");
    const checkbox = createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "studentIds";
    checkbox.value = student.id;
    checkbox.checked = selected.has(student.id);
    const color = createElement("i", "student-color-indicator");
    color.style.setProperty("--student-color", student.color || defaultCourseColor);
    color.setAttribute("aria-hidden", "true");
    label.append(checkbox, color, createElement("span", "", student.username));
    checklist.append(label);
  });
  document.querySelector("#studentChecklistEmpty").hidden = students.length > 0;
}

function readSelectedStudentIds() {
  return Array.from(document.querySelectorAll('#studentChecklist input[name="studentIds"]:checked'))
    .map((input) => input.value);
}

function openNewCourse(preset = null) {
  if (!canEdit) return;
  selectedCourseId = null;
  selectedOccurrenceDate = null;
  formMode = "create";
  dialog.classList.add("is-editing");
  document.querySelector("#dialogType").textContent = "新建课程";
  document.querySelector("#dialogTitle").textContent = "新增课程";
  document.querySelector("#dialogAccent").style.background = defaultCourseColor;
  dialogCourseActions.hidden = true;
  dialogDetails.hidden = true;
  courseForm.hidden = false;
  document.querySelector("#saveCourseText").textContent = "创建课程";
  fillCourseForm(preset);
  if (!dialog.open) dialog.showModal();
  document.querySelector("#courseNameInput").focus();
}

function startEditingCourse() {
  const course = schedule.find((item) => item.id === selectedCourseId);
  if (!canEdit || !course) return;
  formMode = "edit";
  dialog.classList.add("is-editing");
  dialogDetails.hidden = true;
  dialogCourseActions.hidden = true;
  courseForm.hidden = false;
  document.querySelector("#dialogType").textContent = "编辑课程系列";
  document.querySelector("#dialogTitle").textContent = course.name;
  document.querySelector("#saveCourseText").textContent = "保存修改";
  fillCourseForm(course);
  document.querySelector("#courseNameInput").focus();
}

function cancelCourseForm() {
  if (formMode === "create") {
    dialog.close();
    return;
  }
  formMode = "view";
  const course = schedule.find((item) => item.id === selectedCourseId);
  if (course) showCourseDetails(course);
}

function sortSchedule() {
  schedule.sort((first, second) => first.startDate.localeCompare(second.startDate) || first.startTime - second.startTime);
}

function describeSaveError(error) {
  const isConflict = error.code === "23P01" || error.message.toLowerCase().includes("conflict");
  if (isConflict) return "所选学生在该时间已有课程，请调整时间或人员";
  if (error.message.toLowerCase().includes("stale course")) return "这门课程刚被其他设备修改，请确认最新内容后重试";
  return "保存失败，请检查连接后重试";
}

function toSaveCourseParams(course, expectedVersion) {
  return {
    p_id: course.id,
    p_start_date: course.startDate,
    p_repeat_interval_days: course.repeatIntervalDays,
    p_repeat_count: course.repeatCount,
    p_start_time: course.startTime,
    p_duration: course.duration,
    p_name: course.name,
    p_notes: course.notes,
    p_color: course.color || null,
    p_student_ids: course.studentIds,
    p_expected_version: expectedVersion,
  };
}

async function createCourse(candidate, successMessage = "课程已创建并实时同步") {
  if (!canEdit) return false;
  const newCourse = {
    ...candidate,
    id: window.crypto?.randomUUID?.() || `course-${Date.now()}`,
  };
  const { data, error } = await supabaseClient.rpc("save_course", toSaveCourseParams(newCourse, null));

  if (error) {
    showStatus(describeSaveError(error));
    return false;
  }

  const savedCourse = { ...mapCourse(Array.isArray(data) ? data[0] : data), studentIds: newCourse.studentIds };
  schedule.push(savedCourse);
  sortSchedule();
  renderSchedule();
  showStatus(successMessage);
  return true;
}

async function persistCourseUpdate(original, candidate, successMessage) {
  if (!canEdit) {
    showStatus("当前为只读模式，请先以管理员身份登录");
    renderSchedule();
    return false;
  }

  const { data, error } = await supabaseClient.rpc(
    "save_course",
    toSaveCourseParams({ ...candidate, id: original.id }, original.version),
  );

  if (error) {
    showStatus(describeSaveError(error));
    await loadSchedule({ quiet: true });
    return false;
  }
  const savedCourse = {
    ...mapCourse(Array.isArray(data) ? data[0] : data),
    studentIds: candidate.studentIds,
  };
  schedule = schedule.map((course) => course.id === savedCourse.id ? savedCourse : course);
  sortSchedule();
  renderSchedule();
  refreshOpenDialog();
  showStatus(successMessage);
  return true;
}

async function deleteSelectedCourse() {
  const course = schedule.find((item) => item.id === selectedCourseId);
  if (!course || !canEdit) return;
  confirmDeleteButton.disabled = true;
  const { data: deleted, error } = await supabaseClient.rpc("delete_course", {
    p_course_id: course.id,
    p_expected_version: course.version,
  });
  confirmDeleteButton.disabled = false;

  if (error) {
    showStatus("删除失败，请检查连接后重试");
    return;
  }
  if (!deleted) {
    showStatus("课程已在其他设备变更，请刷新后重试");
    await loadSchedule({ quiet: true });
    deleteDialog.close();
    return;
  }

  schedule = schedule.filter((item) => item.id !== course.id);
  deleteDialog.close();
  dialog.close();
  renderSchedule();
  showStatus("课程及其全部重复安排已删除");
}

async function loadSchedule({ quiet = false } = {}) {
  if (!quiet) setSyncState("connecting", "正在读取课程");
  const { data, error } = await supabaseClient
    .from("courses")
    .select("*, course_students(student_id)")
    .order("start_date", { ascending: true })
    .order("start_time", { ascending: true });

  if (error) {
    setSyncState("offline", "连接中断");
    showStatus("无法读取云端课程，请稍后刷新页面");
    return false;
  }

  schedule = data.map(mapCourse);
  renderSchedule();
  refreshOpenDialog();
  if (!quiet) setSyncState("connecting", "正在建立实时同步");
  return true;
}

async function applyRealtimeChange() {
  await loadSchedule({ quiet: true });
  setSyncState("online", canEdit ? "管理员 · 实时同步" : "只读 · 实时同步");
}

async function applyStudentRealtimeChange() {
  if (!currentUser) return;
  if (canEdit) {
    await loadStudents();
    return;
  }

  const { data, error } = await supabaseClient
    .from("students")
    .select("lesson_count, current_lesson_count, required_lesson_count, color, pet")
    .eq("id", currentUser.id)
    .single();
  if (!error && data) {
    currentUser.lesson_count = Number(data.lesson_count) || 0;
    currentUser.current_lesson_count = Number(data.current_lesson_count) || 0;
    currentUser.required_lesson_count = Number(data.required_lesson_count) || 0;
    currentUser.color = data.color || "";
    currentUser.pet = data.pet || "";
    updateLessonSummary();
    updateVisitorPet();
    renderSchedule();
  }
}

function subscribeToCourses() {
  if (realtimeChannel) supabaseClient.removeChannel(realtimeChannel);
  if (realtimeAssignmentChannel) supabaseClient.removeChannel(realtimeAssignmentChannel);
  if (realtimeStudentChannel) supabaseClient.removeChannel(realtimeStudentChannel);
  realtimeChannel = supabaseClient
    .channel("course-schedule-live")
    .on("postgres_changes", { event: "*", schema: "public", table: "courses" }, applyRealtimeChange)
    .subscribe((status) => {
      if (status === "SUBSCRIBED") {
        setSyncState("online", canEdit ? "管理员 · 实时同步" : "只读 · 实时同步");
      } else if (["CHANNEL_ERROR", "TIMED_OUT", "CLOSED"].includes(status)) {
        setSyncState("offline", "实时连接中断");
      }
    });
  realtimeAssignmentChannel = supabaseClient
    .channel("course-assignment-live")
    .on("postgres_changes", { event: "*", schema: "public", table: "course_students" }, applyRealtimeChange)
    .subscribe();
  realtimeStudentChannel = supabaseClient
    .channel("student-stats-live")
    .on("postgres_changes", { event: "*", schema: "public", table: "students" }, applyStudentRealtimeChange)
    .subscribe();
}

async function loadStudents() {
  if (!canEdit) {
    students = [];
    return true;
  }
  const { data, error } = await supabaseClient
    .from("students")
    .select("id, username, lesson_count, current_lesson_count, required_lesson_count, color, pet, created_at")
    .eq("is_admin", false)
    .order("created_at", { ascending: true });
  if (error) {
    showStatus("无法读取访客账号，请稍后重试");
    return false;
  }
  students = data.map((student) => ({
    ...student,
    lesson_count: Number(student.lesson_count) || 0,
    current_lesson_count: Number(student.current_lesson_count) || 0,
    required_lesson_count: Number(student.required_lesson_count) || 0,
    color: student.color || "",
    pet: student.pet || "",
  }));
  renderStudentList();
  renderPetStudentList();
  renderAdminHubCounts();
  renderSchedule();
  return true;
}

function createStudentCountField(labelText, value) {
  const label = createElement("label", "student-count-field");
  const caption = createElement("small", "", labelText);
  const input = createElement("input");
  input.type = "number";
  input.min = "0";
  input.max = "100000";
  input.step = "1";
  input.value = String(value);
  input.setAttribute("aria-label", labelText);
  label.append(caption, input);
  return { label, input };
}

function renderStudentList() {
  const list = document.querySelector("#studentList");
  list.replaceChildren();
  students.forEach((student) => {
    const row = createElement("div", "student-row");
    let selectedColor = student.color || "";

    const identity = createElement("div", "student-identity");
    const colorPicker = createElement("div", "student-color-picker");
    const colorButton = createElement("button", "student-color-button");
    const studentName = createElement("strong", "", student.username);
    const palette = createElement("div", "color-palette student-color-palette");
    colorButton.type = "button";
    colorButton.title = `设置${student.username}的颜色`;
    colorButton.setAttribute("aria-label", `设置${student.username}的颜色`);
    colorButton.style.setProperty("--student-color", selectedColor || defaultCourseColor);
    palette.hidden = true;
    const selectStudentColor = (value) => {
      selectedColor = value;
      colorButton.style.setProperty("--student-color", value || defaultCourseColor);
      palette.hidden = true;
    };
    renderColorPalette(palette, selectedColor, selectStudentColor, `${student.username}的颜色`);
    colorButton.addEventListener("click", () => {
      palette.hidden = !palette.hidden;
    });
    colorPicker.append(colorButton, palette);
    identity.append(colorPicker, studentName);

    const currentField = createStudentCountField(`${student.username}当前已上`, student.current_lesson_count);
    const requiredField = createStudentCountField(`${student.username}当前应上`, student.required_lesson_count);
    const lifetimeField = createStudentCountField(`${student.username}历史已上`, student.lesson_count);
    const remaining = createElement("output", "student-remaining-count");
    let previousCurrentCount = student.current_lesson_count;
    const updateRemaining = () => {
      const current = Number(currentField.input.value) || 0;
      const required = Number(requiredField.input.value) || 0;
      remaining.textContent = `${Math.max(required - current, 0)} 次`;
    };
    currentField.input.addEventListener("input", () => {
      if (currentField.input.value !== "") {
        const nextCurrentCount = Number(currentField.input.value);
        if (Number.isInteger(nextCurrentCount) && nextCurrentCount >= 0) {
          const lifetimeCount = Number(lifetimeField.input.value) || 0;
          lifetimeField.input.value = String(Math.max(lifetimeCount + nextCurrentCount - previousCurrentCount, 0));
          previousCurrentCount = nextCurrentCount;
        }
      }
      updateRemaining();
    });
    requiredField.input.addEventListener("input", updateRemaining);
    updateRemaining();

    const saveButton = createElement("button", "icon-button save-lesson-count");
    saveButton.type = "button";
    saveButton.title = `保存${student.username}的课次数`;
    saveButton.setAttribute("aria-label", `保存${student.username}的课次数`);
    saveButton.innerHTML = '<i data-lucide="save"></i>';
    saveButton.addEventListener("click", () => saveStudentLearningProfile(student.id, {
      currentInput: currentField.input,
      requiredInput: requiredField.input,
      lifetimeInput: lifetimeField.input,
      color: selectedColor,
    }, saveButton));
    [currentField.input, requiredField.input, lifetimeField.input].forEach((input) => {
      input.addEventListener("keydown", (event) => {
        if (event.key !== "Enter") return;
        event.preventDefault();
        saveButton.click();
      });
    });

    const removeButton = createElement("button", "icon-button delete-student");
    removeButton.type = "button";
    removeButton.title = `删除${student.username}`;
    removeButton.setAttribute("aria-label", `删除${student.username}`);
    removeButton.innerHTML = '<i data-lucide="trash-2"></i>';
    removeButton.addEventListener("click", () => {
      selectedStudentId = student.id;
      document.querySelector("#deleteStudentName").textContent = student.username;
      deleteStudentDialog.showModal();
    });
    const actions = createElement("div", "student-row-actions");
    actions.append(saveButton, removeButton);
    row.append(identity, currentField.label, requiredField.label, remaining, lifetimeField.label, actions);
    list.append(row);
  });
  document.querySelector("#studentCount").textContent = `${students.length} 人`;
  document.querySelector("#studentListEmpty").hidden = students.length > 0;
  if (window.lucide) window.lucide.createIcons();
}

function createPetVisual(pet, className = "") {
  const visual = createElement("div", `pet-visual${className ? ` ${className}` : ""}`);
  const image = createElement("img", `pet-image ${pet.animation}`);
  const copy = createElement("div", "pet-visual-copy");
  image.src = pet.image;
  image.alt = `${pet.name}，${pet.mood}表情`;
  image.loading = "lazy";
  copy.append(createElement("strong", "", pet.name), createElement("small", "", `${pet.mood}表情`));
  visual.append(image, copy);
  return visual;
}

function renderPetStudentList() {
  const list = document.querySelector("#petStudentList");
  list.replaceChildren();
  students.forEach((student) => {
    const row = createElement("section", "pet-student-row");
    const header = createElement("div", "pet-student-header");
    const identity = createElement("div", "pet-student-identity");
    const color = createElement("i", "student-color-indicator");
    const current = createElement("div", "pet-current");
    const chooseButton = createElement("button", "secondary-button pet-choose-button");
    const chooser = createElement("div", "pet-choice-grid");
    const assignedPet = petCatalog.find((pet) => pet.id === student.pet);
    color.style.setProperty("--student-color", student.color || defaultCourseColor);
    color.setAttribute("aria-hidden", "true");
    identity.append(color, createElement("strong", "", student.username));

    if (assignedPet) current.append(createPetVisual(assignedPet, "is-current"));
    else {
      const empty = createElement("div", "pet-empty-preview");
      empty.innerHTML = '<i data-lucide="paw-print"></i><span>暂未分配</span>';
      current.append(empty);
    }

    chooseButton.type = "button";
    chooseButton.innerHTML = '<i data-lucide="paw-print"></i><span>选择宠物</span>';
    chooseButton.setAttribute("aria-expanded", "false");
    chooseButton.addEventListener("click", () => {
      const willOpen = chooser.hidden;
      chooser.hidden = !willOpen;
      chooseButton.setAttribute("aria-expanded", String(willOpen));
      if (willOpen) chooser.querySelector("button")?.focus();
    });
    header.append(identity, current, chooseButton);

    const noneButton = createElement("button", `pet-choice${student.pet ? "" : " is-selected"}`);
    noneButton.type = "button";
    noneButton.innerHTML = '<span class="pet-none-icon"><i data-lucide="circle-slash-2"></i></span><strong>暂不分配</strong><small>无宠物</small>';
    noneButton.addEventListener("click", () => saveStudentPet(student.id, "", chooser));
    chooser.append(noneButton);

    petCatalog.forEach((pet) => {
      const option = createElement("button", `pet-choice${student.pet === pet.id ? " is-selected" : ""}`);
      option.type = "button";
      option.setAttribute("aria-label", `分配${pet.name}给${student.username}，${pet.mood}表情`);
      option.append(createPetVisual(pet, "is-choice"));
      option.addEventListener("click", () => saveStudentPet(student.id, pet.id, chooser));
      chooser.append(option);
    });
    chooser.hidden = true;
    row.append(header, chooser);
    list.append(row);
  });
  document.querySelector("#petStudentCount").textContent = `${students.length} 人`;
  document.querySelector("#petStudentListEmpty").hidden = students.length > 0;
  if (window.lucide) window.lucide.createIcons();
}

async function saveStudentPet(studentId, petId, chooser) {
  if (!canEdit) return;
  chooser.querySelectorAll("button").forEach((button) => { button.disabled = true; });
  const { error } = await supabaseClient.rpc("set_student_pet", {
    p_student_id: studentId,
    p_pet: petId || null,
  });
  if (error) {
    showStatus("宠物分配失败，请稍后重试");
    await loadStudents();
    return;
  }

  const student = students.find((item) => item.id === studentId);
  if (student) student.pet = petId;
  renderPetStudentList();
  renderAdminHubCounts();
  const pet = petCatalog.find((item) => item.id === petId);
  showStatus(pet ? `已把${pet.name}分配给${student?.username || "该学生"}` : `已取消${student?.username || "该学生"}的宠物`);
}

async function saveStudentLearningProfile(studentId, fields, button) {
  if (!canEdit) return;
  const currentCount = Number(fields.currentInput.value);
  const requiredCount = Number(fields.requiredInput.value);
  const lifetimeCount = Number(fields.lifetimeInput.value);
  const counts = [currentCount, requiredCount, lifetimeCount];
  if (counts.some((count) => !Number.isInteger(count) || count < 0 || count > 100000)) {
    showStatus("课次数需为 0 - 100000 的整数");
    return;
  }

  button.disabled = true;
  const { error } = await supabaseClient.rpc("set_student_learning_profile", {
    p_student_id: studentId,
    p_current_count: currentCount,
    p_required_count: requiredCount,
    p_lifetime_count: lifetimeCount,
    p_color: fields.color || null,
  });
  button.disabled = false;
  if (error) {
    showStatus("学生课程进度保存失败，请稍后重试");
    await loadStudents();
    return;
  }

  const student = students.find((item) => item.id === studentId);
  if (student) {
    student.current_lesson_count = currentCount;
    student.required_lesson_count = requiredCount;
    student.lesson_count = lifetimeCount;
    student.color = fields.color || "";
  }
  fields.currentInput.value = String(currentCount);
  fields.requiredInput.value = String(requiredCount);
  fields.lifetimeInput.value = String(lifetimeCount);
  renderSchedule();
  showStatus(`已保存${student?.username || "该学生"}的颜色与课程进度`);
}

async function handleStudentSubmit(event) {
  event.preventDefault();
  if (!canEdit) return;
  const username = document.querySelector("#studentUsernameInput").value.trim();
  if (!username) return;

  addStudentButton.disabled = true;
  const { error } = await supabaseClient.rpc("create_student_account", { p_username: username });
  addStudentButton.disabled = false;
  if (error) {
    const duplicate = error.code === "23505" || error.message.toLowerCase().includes("already exists");
    showStatus(duplicate ? "该用户名已存在，请换一个名字" : "新增账号失败，请稍后重试");
    return;
  }
  studentForm.reset();
  await loadStudents();
  showStatus(`已新增访客“${username}”，登录密码为 88888888`);
}

async function deleteSelectedStudent() {
  const student = students.find((item) => item.id === selectedStudentId);
  if (!student || !canEdit) return;
  confirmDeleteStudentButton.disabled = true;
  const { error } = await supabaseClient.rpc("delete_student_account", { p_student_id: student.id });
  confirmDeleteStudentButton.disabled = false;
  if (error) {
    showStatus("删除访客账号失败，请稍后重试");
    return;
  }
  students = students.filter((item) => item.id !== student.id);
  selectedStudentId = null;
  deleteStudentDialog.close();
  renderStudentList();
  await loadSchedule({ quiet: true });
  showStatus(`已删除访客“${student.username}”及其课程分配`);
}

async function applySession(session) {
  currentUser = null;
  canEdit = false;

  if (!session) {
    schedule = [];
    students = [];
    appShell.hidden = true;
    loginScreen.hidden = false;
    hideAdminPages();
    scheduleSection.hidden = false;
    pageFooter.hidden = false;
    clearCopyMode();
    if (realtimeChannel) await supabaseClient.removeChannel(realtimeChannel);
    if (realtimeAssignmentChannel) await supabaseClient.removeChannel(realtimeAssignmentChannel);
    if (realtimeStudentChannel) await supabaseClient.removeChannel(realtimeStudentChannel);
    realtimeChannel = null;
    realtimeAssignmentChannel = null;
    realtimeStudentChannel = null;
    renderSchedule();
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  const { data: profile, error } = await supabaseClient
    .from("students")
    .select("id, username, is_admin, lesson_count, current_lesson_count, required_lesson_count, color, pet")
    .eq("id", session.user.id)
    .single();

  if (error || !profile) {
    loginError.textContent = "该账号已失效，请联系管理员";
    await supabaseClient.auth.signOut();
    return;
  }

  currentUser = {
    ...profile,
    lesson_count: Number(profile.lesson_count) || 0,
    current_lesson_count: Number(profile.current_lesson_count) || 0,
    required_lesson_count: Number(profile.required_lesson_count) || 0,
    color: profile.color || "",
    pet: profile.pet || "",
  };
  canEdit = profile.is_admin === true;
  if (canEdit) await loadStudents();
  appShell.hidden = false;
  loginScreen.hidden = true;
  loginError.textContent = "";
  updatePermissionUI();
  await loadSchedule();
  subscribeToCourses();
}

async function handleCourseSubmit(event) {
  event.preventDefault();
  if (!canEdit || !["create", "edit"].includes(formMode)) return;
  const existing = schedule.find((item) => item.id === selectedCourseId);
  if (formMode === "edit" && !existing) return;
  const repeatIntervalDays = readRepeatInterval();

  const candidate = {
    ...(existing || {}),
    startDate: dayStartInput.value,
    repeatIntervalDays,
    repeatCount: readRepeatCount(repeatIntervalDays),
    startTime: parseTime(startTimeInput.value),
    duration: Number(durationInput.value),
    name: document.querySelector("#courseNameInput").value.trim(),
    notes: document.querySelector("#courseNotesInput").value.trim(),
    color: courseColorInput.value,
    studentIds: readSelectedStudentIds(),
  };

  if (!candidate.startDate || candidate.startTime % snapMinutes !== 0 || candidate.startTime < timelineStart || getCourseEnd(candidate) > timelineEnd) {
    showStatus("课程时间需在 08:00 - 21:00 内，并按 10 分钟设置");
    return;
  }
  if (candidate.repeatIntervalDays !== null && (!Number.isInteger(candidate.repeatIntervalDays) || candidate.repeatIntervalDays < 1 || candidate.repeatIntervalDays > 365)) {
    showStatus("重复间隔需为 1 - 365 天的整数");
    return;
  }
  if (candidate.repeatIntervalDays !== null && candidate.repeatCount !== null
    && (!Number.isInteger(candidate.repeatCount) || candidate.repeatCount < 1 || candidate.repeatCount > 10000)) {
    showStatus("重复次数需为 1 - 10000 的整数，并包含首次课程");
    return;
  }
  if (hasSeriesConflict(candidate, existing?.id)) {
    showStatus("所选学生在该时间已有课程，请调整时间或人员");
    return;
  }

  saveCourseButton.disabled = true;
  const saved = formMode === "create"
    ? await createCourse(candidate)
    : await persistCourseUpdate(existing, candidate, "课程信息已保存并实时同步");
  saveCourseButton.disabled = false;

  if (!saved) return;
  if (formMode === "create") dialog.close();
  else {
    formMode = "view";
    selectedOccurrenceDate = candidate.startDate;
    const updated = schedule.find((item) => item.id === selectedCourseId);
    if (updated) showCourseDetails(updated);
  }
}

async function handleLoginSubmit(event) {
  event.preventDefault();
  const username = document.querySelector("#loginUsername").value.trim();
  const password = document.querySelector("#loginPassword").value;
  loginError.textContent = "";

  loginSubmit.disabled = true;
  const { data: loginEmail, error: lookupError } = await supabaseClient
    .rpc("resolve_login_email", { p_username: username });
  if (lookupError || !loginEmail) {
    loginSubmit.disabled = false;
    loginError.textContent = "用户名或密码错误";
    return;
  }

  const { error } = await supabaseClient.auth.signInWithPassword({ email: loginEmail, password });
  loginSubmit.disabled = false;
  if (error) {
    loginError.textContent = "用户名或密码错误";
    return;
  }
  loginForm.reset();
}

function bindEvents() {
  document.querySelector("#previousWeek").addEventListener("click", () => {
    selectedWeekStart = addDays(selectedWeekStart, -7);
    renderSchedule();
  });
  document.querySelector("#nextWeek").addEventListener("click", () => {
    selectedWeekStart = addDays(selectedWeekStart, 7);
    renderSchedule();
  });
  document.querySelector("#currentWeek").addEventListener("click", openWeekOverview);
  document.querySelector("#closeWeekOverview").addEventListener("click", () => weekOverviewDialog.close());
  document.querySelector("#previousWeekYear").addEventListener("click", () => {
    weekOverviewYear -= 1;
    renderWeekOverview();
  });
  document.querySelector("#nextWeekYear").addEventListener("click", () => {
    weekOverviewYear += 1;
    renderWeekOverview();
  });
  document.querySelector("#todayButton").addEventListener("click", () => {
    selectedWeekStart = new Date(currentWeekStart);
    renderSchedule();
  });
  document.querySelector("#addCourse").addEventListener("click", () => openNewCourse());
  enableTimelineCreation();
  document.querySelector("#closeDialog").addEventListener("click", () => dialog.close());
  document.querySelector("#copyCourse").addEventListener("click", copySelectedCourse);
  document.querySelector("#editCourse").addEventListener("click", startEditingCourse);
  document.querySelector("#deleteCourse").addEventListener("click", () => {
    const course = schedule.find((item) => item.id === selectedCourseId);
    if (!course || !canEdit) return;
    document.querySelector("#deleteCourseName").textContent = course.name;
    deleteDialog.showModal();
  });
  document.querySelector("#cancelEdit").addEventListener("click", cancelCourseForm);
  courseForm.addEventListener("submit", handleCourseSubmit);
  repeatInput.addEventListener("change", () => {
    updateRepeatFields();
    if (!customRepeatField.hidden) repeatDaysInput.focus();
  });
  repeatStopInput.addEventListener("change", () => {
    updateRepeatFields();
    if (!repeatCountField.hidden) repeatCountInput.focus();
  });
  dialog.addEventListener("close", () => {
    selectedCourseId = null;
    selectedOccurrenceDate = null;
    formMode = "view";
    dialog.classList.remove("is-editing");
    courseForm.hidden = true;
    dialogDetails.hidden = false;
  });

  document.querySelector("#cancelDelete").addEventListener("click", () => deleteDialog.close());
  confirmDeleteButton.addEventListener("click", deleteSelectedCourse);
  document.querySelector("#cancelCopyMode").addEventListener("click", clearCopyMode);

  authButton.addEventListener("click", async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) showStatus("退出失败，请稍后重试");
  });

  document.querySelector("#studentManagerButton").addEventListener("click", showAdminHub);
  document.querySelector("#closeAdminHub").addEventListener("click", showScheduleView);
  document.querySelector("#openStudentManagement").addEventListener("click", showStudentManagement);
  document.querySelector("#openPetManagement").addEventListener("click", showPetManagement);
  document.querySelector("#closeStudentManagement").addEventListener("click", showAdminHub);
  document.querySelector("#closePetManagement").addEventListener("click", showAdminHub);
  studentForm.addEventListener("submit", handleStudentSubmit);
  document.querySelector("#cancelDeleteStudent").addEventListener("click", () => deleteStudentDialog.close());
  confirmDeleteStudentButton.addEventListener("click", deleteSelectedStudent);
  deleteStudentDialog.addEventListener("close", () => {
    selectedStudentId = null;
  });
  loginForm.addEventListener("submit", handleLoginSubmit);
}

async function initializeApp() {
  populateDurationOptions();
  startDateAutoRefresh();
  bindEvents();
  renderSchedule();
  if (window.lucide) window.lucide.createIcons();

  const { data: { session }, error } = await supabaseClient.auth.getSession();
  if (error) loginError.textContent = "登录状态读取失败，请刷新页面重试";
  await applySession(session);

  supabaseClient.auth.onAuthStateChange((_event, nextSession) => {
    window.setTimeout(() => applySession(nextSession), 0);
  });
}

initializeApp().catch(() => {
  setSyncState("offline", "初始化失败");
  showStatus("页面初始化失败，请刷新后重试");
});
