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
  { id: "cat", name: "猫咪", mood: "开心", image: "assets/pets/cat.gif" },
  { id: "dog", name: "小狗", mood: "兴奋", image: "assets/pets/dog.gif" },
  { id: "rabbit", name: "兔子", mood: "活泼", image: "assets/pets/rabbit.gif" },
  { id: "hamster", name: "小鼠", mood: "满足", image: "assets/pets/hamster.gif" },
  { id: "fox", name: "花栗鼠", mood: "害羞", image: "assets/pets/fox.gif" },
  { id: "panda", name: "企鹅", mood: "元气", image: "assets/pets/panda.gif" },
  { id: "bear", name: "小熊", mood: "友好", image: "assets/pets/bear.gif" },
  { id: "frog", name: "小龟", mood: "惊喜", image: "assets/pets/frog.gif" },
  { id: "lion", name: "狮子", mood: "勇敢", image: "assets/pets/lion.gif" },
  { id: "tiger", name: "老虎", mood: "威风", image: "assets/pets/tiger.gif" },
  { id: "leopard", name: "花豹", mood: "敏捷", image: "assets/pets/leopard.gif" },
  { id: "elephant", name: "大象", mood: "温柔", image: "assets/pets/elephant.gif" },
  { id: "giraffe", name: "长颈鹿", mood: "优雅", image: "assets/pets/giraffe.gif" },
  { id: "zebra", name: "斑马", mood: "清爽", image: "assets/pets/zebra.gif" },
  { id: "monkey", name: "小猴", mood: "机灵", image: "assets/pets/monkey.gif" },
  { id: "gorilla", name: "大猩猩", mood: "可靠", image: "assets/pets/gorilla.gif" },
  { id: "giant-panda", name: "大熊猫", mood: "憨萌", image: "assets/pets/giant-panda.gif" },
  { id: "red-panda", name: "小熊猫", mood: "俏皮", image: "assets/pets/red-panda.gif" },
  { id: "koala", name: "考拉", mood: "慵懒", image: "assets/pets/koala.gif" },
  { id: "kangaroo", name: "袋鼠", mood: "活力", image: "assets/pets/kangaroo.gif" },
  { id: "alpaca", name: "羊驼", mood: "软绵", image: "assets/pets/alpaca.gif" },
  { id: "deer", name: "小鹿", mood: "灵动", image: "assets/pets/deer.gif" },
  { id: "hippo", name: "河马", mood: "敦厚", image: "assets/pets/hippo.gif" },
  { id: "rhino", name: "犀牛", mood: "稳重", image: "assets/pets/rhino.gif" },
  { id: "crocodile", name: "鳄鱼", mood: "淘气", image: "assets/pets/crocodile.gif" },
  { id: "polar-bear", name: "北极熊", mood: "清凉", image: "assets/pets/polar-bear.gif" },
  { id: "seal", name: "海豹", mood: "圆润", image: "assets/pets/seal.gif" },
  { id: "dolphin", name: "海豚", mood: "聪明", image: "assets/pets/dolphin.gif" },
  { id: "flamingo", name: "火烈鸟", mood: "优美", image: "assets/pets/flamingo.gif" },
  { id: "peacock", name: "孔雀", mood: "闪耀", image: "assets/pets/peacock.gif" },
  { id: "parrot", name: "鹦鹉", mood: "健谈", image: "assets/pets/parrot.gif" },
  { id: "owl", name: "猫头鹰", mood: "睿智", image: "assets/pets/owl.gif" },
  { id: "raccoon", name: "浣熊", mood: "好奇", image: "assets/pets/raccoon.gif" },
  { id: "camel", name: "骆驼", mood: "坚韧", image: "assets/pets/camel.gif" },
  { id: "wolf", name: "小狼", mood: "坚定", image: "assets/pets/wolf.gif" },
  { id: "snake", name: "小蛇", mood: "神秘", image: "assets/pets/snake.gif" },
  { id: "milk_dragon", name: "奶龙", mood: "软萌", image: "assets/pets/milk-dragon.gif", adminOnly: true },
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
let realtimeBattleChannel = null;
let realtimeAttendanceChannel = null;
let selectedStudentId = null;
let statusTimer = null;
let copiedCourse = null;
let isPastingCourse = false;
let petFoods = [];
let petDetailReturnView = "schedule";
let petLeaderboardReturnView = "schedule";
let petLeaderboard = [];
let adminPetComparison = null;
let petBattleHistory = [];
let selectedBattleHistoryStudentId = null;
let dailyPetBattleCount = 0;
let challengeRecords = [];
let questionBank = [];
let importedQuestions = [];
let challengeState = {
  type: "choice",
  attemptId: null,
  attemptsUsed: 0,
  attemptsRemaining: 50,
  choiceStreak: 0,
  answered: false,
};
let studentSortMode = "manual";
let petSortMode = "manual";
let draggedStudentId = null;
let attendanceRecords = [];
let attendanceBusy = false;

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
const attendanceManagementPage = document.querySelector("#attendanceManagementPage");
const petManagementPage = document.querySelector("#petManagementPage");
const petBattleHistoryPage = document.querySelector("#petBattleHistoryPage");
const petDetailPage = document.querySelector("#petDetailPage");
const petLeaderboardPage = document.querySelector("#petLeaderboardPage");
const studentChallengePage = document.querySelector("#studentChallengePage");
const challengeRecordsPage = document.querySelector("#challengeRecordsPage");
const questionBankPage = document.querySelector("#questionBankPage");
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
  dailyPetBattleCount = 0;
  renderSchedule();
  if (!canEdit && !petDetailPage.hidden) loadDailyPetBattleCount().then(renderPetDetail);
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

function getTodayAttendanceStudentIds() {
  const today = getScheduleToday();
  const ids = new Set();
  schedule.forEach((course) => {
    if (!courseOccursOnDate(course, today)) return;
    course.studentIds.forEach((studentId) => ids.add(studentId));
  });
  return [...ids];
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
}

function normalizePetFields(profile) {
  return {
    ...profile,
    pet: profile.pet || "",
    pet_name: profile.pet_name || "",
    pet_experience: Math.max(Number(profile.pet_experience) || 0, 0),
    pet_coins: Math.max(Number(profile.pet_coins) || 0, 0),
    pet_checkin_date: profile.pet_checkin_date || "",
    pet_checkin_streak: Math.max(Number(profile.pet_checkin_streak) || 0, 0),
  };
}

function getPetLevelRequirement(levelValue) {
  return Math.max(1, Math.floor(Number(levelValue) || 1)) * 10;
}

function getPetLevelThreshold(levelValue) {
  const level = Math.max(0, Math.floor(Number(levelValue) || 0));
  return 5 * level * (level + 1);
}

function getPetLevel(experienceValue) {
  const experience = Math.max(Number(experienceValue) || 0, 0);
  let completedLevels = Math.floor((-1 + Math.sqrt(1 + (0.8 * experience))) / 2);
  const threshold = getPetLevelThreshold;
  while (threshold(completedLevels + 1) <= experience) completedLevels += 1;
  while (completedLevels > 0 && threshold(completedLevels) > experience) completedLevels -= 1;
  const level = completedLevels + 1;
  const levelStart = threshold(completedLevels);
  const levelEnd = threshold(completedLevels + 1);
  return {
    level,
    levelStart,
    levelEnd,
    progress: experience - levelStart,
    required: getPetLevelRequirement(level),
  };
}

function getPetDisplayName(owner, pet) {
  return owner?.pet_name || pet?.name || "我的宠物";
}

function getMaskedStudentName(username) {
  const name = String(username || "").normalize("NFKC").trim();
  return name ? `${Array.from(name)[0]}同学` : "其他同学";
}

function isPetCheckedInToday(owner) {
  return owner?.pet_checkin_date === toISODate(getScheduleToday());
}

function getNextCheckinExperience(owner) {
  const today = getScheduleToday();
  const yesterday = toISODate(addDays(today, -1));
  const nextStreak = owner?.pet_checkin_date === yesterday
    ? (Number(owner.pet_checkin_streak) || 0) + 1
    : 1;
  return nextStreak + 1;
}

function getOwnerById(ownerId) {
  if (currentUser?.id === ownerId) return currentUser;
  return students.find((student) => student.id === ownerId) || null;
}

function getOwnerByUsername(username) {
  if (currentUser?.username === username) return currentUser;
  return students.find((student) => student.username === username) || null;
}

function formatPetCheckinDate(value) {
  if (!value) return "暂无";
  const [year, month, day] = value.split("-");
  return `${Number(month)}月${Number(day)}日`;
}

function updateVisitorPet() {
  const pet = petCatalog.find((item) => item.id === currentUser?.pet);
  visitorPet.hidden = !currentUser;
  visitorPet.disabled = !pet;
  visitorPet.classList.toggle("is-unassigned", !pet);
  visitorPet.setAttribute("aria-label", pet ? "查看我的宠物中心" : "宠物等待曾老师分配");
  if (!pet) {
    const image = document.querySelector("#visitorPetImage");
    image.removeAttribute("src");
    image.alt = "";
    image.className = "pet-image";
    document.querySelector("#visitorPetMood").textContent = "宠物中心";
    document.querySelector("#visitorPetName").textContent = "等待曾老师分配";
    return;
  }
  const level = getPetLevel(currentUser.pet_experience).level;
  const image = document.querySelector("#visitorPetImage");
  image.src = pet.image;
  image.alt = `${pet.name}全身画像`;
  image.className = "pet-image";
  document.querySelector("#visitorPetMood").textContent = `宠物中心 · Lv.${level} · ${currentUser.pet_coins} 金币`;
  document.querySelector("#visitorPetName").textContent = getPetDisplayName(currentUser, pet);
}

function getFoodIcon(foodName) {
  if (/鱼|虾/.test(foodName)) return "fish";
  if (/骨|磨牙/.test(foodName)) return "bone";
  if (/胡萝卜|生菜|海藻|草/.test(foodName)) return "carrot";
  if (/奶|奶酪/.test(foodName)) return "milk";
  if (/糖|饼干/.test(foodName)) return "cookie";
  if (/蛋糕|甜点/.test(foodName)) return "cake-slice";
  return "apple";
}

function renderPetDetail() {
  const pet = petCatalog.find((item) => item.id === currentUser?.pet);
  if (!pet || !currentUser) return;
  const levelInfo = getPetLevel(currentUser.pet_experience);
  const displayName = getPetDisplayName(currentUser, pet);
  const progressPercent = Math.min((levelInfo.progress / levelInfo.required) * 100, 100);
  const detailImage = document.querySelector("#petDetailImage");
  detailImage.src = pet.image;
  detailImage.alt = `${pet.name}全身画像`;
  detailImage.className = "pet-detail-image";
  document.querySelector("#petSpeciesName").textContent = `${pet.name} · ${pet.mood}`;
  document.querySelector("#petProfileName").textContent = displayName;
  document.querySelector("#petNameInput").value = displayName;
  document.querySelector("#petLevelBadge").textContent = `Lv.${levelInfo.level}`;
  document.querySelector("#petLevelText").textContent = `Lv.${levelInfo.level}`;
  document.querySelector("#petExperienceText").textContent = `${levelInfo.progress.toLocaleString("zh-CN")} / ${levelInfo.required.toLocaleString("zh-CN")} 经验`;
  document.querySelector("#petTotalExperience").textContent = currentUser.pet_experience.toLocaleString("zh-CN");
  document.querySelector("#petCoinBalance").textContent = currentUser.pet_coins.toLocaleString("zh-CN");
  document.querySelector("#petCheckinStreak").textContent = currentUser.pet_checkin_streak.toLocaleString("zh-CN");
  const progressTrack = document.querySelector(".pet-progress-track");
  progressTrack.setAttribute("aria-valuemax", String(levelInfo.required));
  progressTrack.setAttribute("aria-valuenow", String(levelInfo.progress));
  document.querySelector("#petProgressFill").style.width = `${progressPercent}%`;

  const checkedIn = isPetCheckedInToday(currentUser);
  const checkinButton = document.querySelector("#petCheckinButton");
  checkinButton.disabled = checkedIn;
  document.querySelector("#petCheckinButtonText").textContent = checkedIn
    ? "今日已签到"
    : `签到领取 ${getNextCheckinExperience(currentUser)} 经验`;

  const foodGrid = document.querySelector("#petFoodGrid");
  const foods = petFoods.filter((food) => food.pet_type === pet.id);
  foodGrid.replaceChildren();
  foods.forEach((food) => {
    const card = createElement("article", "pet-food-card");
    const icon = createElement("span", "pet-food-icon");
    icon.innerHTML = `<i data-lucide="${getFoodIcon(food.name)}"></i>`;
    const copy = createElement("div", "pet-food-copy");
    copy.append(
      createElement("strong", "", food.name),
      createElement("small", "", `+${food.experience} 经验`),
    );
    const cost = createElement("span", "pet-food-cost");
    cost.innerHTML = `<i data-lucide="coins"></i><strong>${food.coin_cost}</strong>`;
    const feedButton = createElement("button", "secondary-button pet-feed-button");
    feedButton.type = "button";
    feedButton.disabled = currentUser.pet_coins < food.coin_cost;
    feedButton.innerHTML = '<i data-lucide="utensils"></i><span>喂食</span>';
    feedButton.addEventListener("click", () => feedCurrentPet(food, feedButton));
    card.append(icon, copy, cost, feedButton);
    foodGrid.append(card);
  });
  document.querySelector("#petFoodEmpty").hidden = foods.length > 0;
  document.querySelector("#petBattlePanel").hidden = canEdit;
  const battleButton = document.querySelector("#matchPetBattle");
  const reachedBattleLimit = dailyPetBattleCount >= 3;
  battleButton.disabled = reachedBattleLimit;
  document.querySelector("#matchPetBattleText").textContent = reachedBattleLimit ? "今日已完成" : "匹配对手";
  document.querySelector("#petBattleDailyStatus").textContent = `今日 ${Math.min(dailyPetBattleCount, 3)} / 3 场`;
  document.querySelector("#adminPetComparePanel").hidden = canEdit || !adminPetComparison;
  if (!canEdit && adminPetComparison) renderAdminPetComparison();
  updateVisitorPet();
  if (window.lucide) window.lucide.createIcons();
}

function renderAdminPetComparison() {
  const comparison = adminPetComparison;
  const pet = petCatalog.find((item) => item.id === comparison?.pet_type);
  if (!comparison || !pet) return;
  const image = document.querySelector("#adminComparePetImage");
  image.src = pet.image;
  image.alt = `${pet.name}正面全身画像`;
  document.querySelector("#adminComparePetSpecies").textContent = `${pet.name} · ${pet.mood}`;
  document.querySelector("#adminComparePetName").textContent = comparison.pet_name || pet.name;
  document.querySelector("#adminComparePetLevel").textContent = `Lv.${comparison.pet_level}`;
  document.querySelector("#adminComparePetExperience").textContent = Number(comparison.pet_experience).toLocaleString("zh-CN");
  document.querySelector("#adminComparePetProgress").textContent = `${Number(comparison.level_progress).toLocaleString("zh-CN")} / ${Number(comparison.level_required).toLocaleString("zh-CN")}`;
  document.querySelector("#adminComparePetCoins").textContent = Number(comparison.pet_coins).toLocaleString("zh-CN");
  document.querySelector("#adminComparePetStreak").textContent = `${Number(comparison.pet_checkin_streak) || 0} 天`;
  document.querySelector("#adminComparePetCheckin").textContent = formatPetCheckinDate(comparison.pet_checkin_date);
}

async function loadAdminPetComparison() {
  if (canEdit) {
    adminPetComparison = null;
    return true;
  }
  const { data, error } = await supabaseClient.rpc("get_admin_pet_comparison");
  adminPetComparison = error ? null : (Array.isArray(data) ? data[0] : data);
  return !error;
}

async function loadDailyPetBattleCount() {
  if (canEdit || !currentUser?.pet) {
    dailyPetBattleCount = 0;
    return true;
  }
  const { data, error } = await supabaseClient.rpc("get_my_pet_battle_summary");
  const summary = Array.isArray(data) ? data[0] : data;
  dailyPetBattleCount = error ? 0 : Math.max(Number(summary?.battles_used_today) || 0, 0);
  return !error;
}

async function saveCurrentPetName(event) {
  event.preventDefault();
  const input = document.querySelector("#petNameInput");
  const name = input.value.trim();
  if (!name || name.length > 20) {
    showStatus("宠物名字需为 1 - 20 个字符");
    return;
  }
  const button = document.querySelector("#savePetName");
  button.disabled = true;
  const { error } = await supabaseClient.rpc("rename_my_pet", { p_name: name });
  button.disabled = false;
  if (error) {
    showStatus("宠物名字保存失败，请稍后重试");
    return;
  }
  currentUser.pet_name = name;
  renderPetDetail();
  showStatus(`宠物名字已改为“${name}”`);
}

async function checkInCurrentPet() {
  const button = document.querySelector("#petCheckinButton");
  button.disabled = true;
  const { data, error } = await supabaseClient.rpc("check_in_pet");
  if (error) {
    showStatus(error.message?.includes("already checked") ? "今天已经签到过了" : "签到失败，请稍后重试");
    await refreshCurrentUserPet();
    return;
  }
  const result = Array.isArray(data) ? data[0] : data;
  currentUser.pet_experience = Number(result.experience) || currentUser.pet_experience;
  currentUser.pet_checkin_streak = Number(result.streak) || 0;
  currentUser.pet_checkin_date = result.checkin_date || toISODate(getScheduleToday());
  renderPetDetail();
  showStatus(`签到成功，获得 ${result.gained_experience} 经验`);
}

async function feedCurrentPet(food, button) {
  button.disabled = true;
  const { data, error } = await supabaseClient.rpc("feed_my_pet", { p_food_id: food.id });
  if (error) {
    showStatus(error.message?.includes("not enough coins") ? "金币不足" : "喂食失败，请稍后重试");
    await refreshCurrentUserPet();
    return;
  }
  const result = Array.isArray(data) ? data[0] : data;
  currentUser.pet_experience = Number(result.experience) || currentUser.pet_experience;
  currentUser.pet_coins = Number(result.coins) || 0;
  renderPetDetail();
  showStatus(`${getPetDisplayName(currentUser)}吃下${food.name}，获得 ${result.gained_experience} 经验`);
}

function getBattleMoveLabel(move) {
  return { rock: "石头", paper: "布", scissors: "剪刀" }[move] || "";
}

function renderPetBattleResult(result) {
  const opponentPet = petCatalog.find((pet) => pet.id === result.opponent_pet);
  if (!opponentPet) return;
  const challengerWon = result.winner === "challenger";
  const myPet = petCatalog.find((pet) => pet.id === currentUser.pet);
  const myImage = document.querySelector("#battleMyPetImage");
  const opponentImage = document.querySelector("#battleOpponentPetImage");
  myImage.src = myPet.image;
  myImage.alt = `${getPetDisplayName(currentUser, myPet)}的正面全身画像`;
  opponentImage.src = opponentPet.image;
  opponentImage.alt = `${result.opponent_pet_name || opponentPet.name}的正面全身画像`;
  document.querySelector("#battleMyPetName").textContent = getPetDisplayName(currentUser, myPet);
  document.querySelector("#battleMyPetLevel").textContent = `Lv.${result.challenger_level} · ${currentUser.username}`;
  document.querySelector("#battleOpponentPetName").textContent = result.opponent_pet_name || opponentPet.name;
  document.querySelector("#battleOpponentPetLevel").textContent = `Lv.${result.opponent_level} · ${result.opponent_display_name || getMaskedStudentName(result.opponent_username)}`;
  document.querySelector("#petBattleOutcome").className = `pet-battle-outcome ${challengerWon ? "is-win" : "is-loss"}`;
  document.querySelector("#petBattleOutcomeTitle").textContent = challengerWon ? "匹配获胜" : "匹配惜败";
  document.querySelector("#petBattleOutcomeText").textContent = result.battle_method === "level"
    ? `双方等级对比：Lv.${result.challenger_level} 对 Lv.${result.opponent_level}`
    : `同等级石头剪刀布：你出${getBattleMoveLabel(result.challenger_move)}，对方出${getBattleMoveLabel(result.opponent_move)}`;
  document.querySelector("#petBattleReward").textContent = `你的宠物获得 ${result.challenger_reward} 经验，对方获得 ${result.opponent_reward} 经验`;
  document.querySelector("#petBattleResult").hidden = false;
}

async function matchCurrentPetBattle() {
  if (!currentUser?.pet || canEdit) return;
  const button = document.querySelector("#matchPetBattle");
  const label = document.querySelector("#matchPetBattleText");
  button.disabled = true;
  label.textContent = "正在匹配";
  const { data, error } = await supabaseClient.rpc("match_pet_battle");
  button.disabled = false;
  label.textContent = "再次匹配";
  if (error) {
    const noOpponent = error.message?.includes("no battle opponent");
    const dailyLimit = error.message?.includes("daily battle limit reached");
    if (dailyLimit) {
      dailyPetBattleCount = 3;
      renderPetDetail();
    }
    showStatus(dailyLimit ? "今日 3 次对战机会已用完" : (noOpponent ? "暂时没有其他已分配宠物的学生" : "匹配失败，请稍后重试"));
    return;
  }
  const result = Array.isArray(data) ? data[0] : data;
  if (!result) return;
  currentUser.pet_experience = Number(result.challenger_experience) || currentUser.pet_experience;
  dailyPetBattleCount = Number(result.battles_used_today) || Math.min(dailyPetBattleCount + 1, 3);
  renderPetDetail();
  renderPetBattleResult(result);
  showStatus(`匹配完成，获得 ${result.challenger_reward} 经验`);
}

function getLeaderboardRewardText(entry) {
  const position = Number(entry.rank_position);
  if (position === 1) return "直升一级";
  const percent = Number(entry.next_reward_percent) || 0;
  return percent > 0 ? `本级经验 ${percent}%` : "无奖励";
}

function renderPetLeaderboard() {
  const list = document.querySelector("#petLeaderboardList");
  list.replaceChildren();
  petLeaderboard.forEach((entry) => {
    const pet = petCatalog.find((item) => item.id === entry.pet_type);
    if (!pet) return;
    const leaderboardPetName = entry.pet_name && entry.pet_name !== "未命名宠物" ? entry.pet_name : pet.name;
    const rankPosition = Number(entry.rank_position);
    const row = createElement("article", `pet-leaderboard-row rank-${Math.min(rankPosition, 4)}${entry.is_self ? " is-self" : ""}`);
    const rank = createElement("span", "pet-leaderboard-rank", `第${rankPosition}名`);
    if (rankPosition <= 3) rank.innerHTML = `<i data-lucide="${["crown", "medal", "award"][rankPosition - 1]}"></i><strong>第${rankPosition}名</strong>`;

    const identity = createElement("div", "pet-leaderboard-identity");
    const image = createElement("img");
    image.src = pet.image;
    image.alt = `${pet.name}正面全身画像`;
    image.loading = "lazy";
    const identityCopy = createElement("div");
    identityCopy.append(
      createElement("strong", "", leaderboardPetName),
      createElement("small", "", canEdit
        ? `${entry.owner_username} · ${pet.name}`
        : (entry.is_self ? `我的宠物 · ${pet.name}` : `${entry.owner_display_name || getMaskedStudentName(entry.owner_username)} · ${pet.name}`)),
    );
    identity.append(image, identityCopy);

    const level = createElement("div", "pet-leaderboard-level");
    const levelHead = createElement("div");
    levelHead.append(
      createElement("strong", "", `Lv.${entry.pet_level}`),
      createElement("span", "", `${Number(entry.level_progress).toLocaleString("zh-CN")} / ${Number(entry.level_required).toLocaleString("zh-CN")}`),
    );
    const progress = createElement("div", "pet-leaderboard-progress");
    const progressFill = createElement("span");
    progressFill.style.width = `${Math.min((Number(entry.level_progress) / Number(entry.level_required)) * 100, 100)}%`;
    progress.append(progressFill);
    level.append(levelHead, progress, createElement("small", "", `累计 ${Number(entry.pet_experience).toLocaleString("zh-CN")} 经验`));

    const reward = createElement("div", "pet-leaderboard-reward");
    reward.append(
      createElement("strong", "", getLeaderboardRewardText(entry)),
      createElement("small", "", Number(entry.last_reward_experience) > 0 ? `上次结算 +${Number(entry.last_reward_experience)} 经验` : "等待本周结算"),
    );
    row.append(rank, identity, level, reward);
    list.append(row);
  });
  document.querySelector("#petLeaderboardEmpty").hidden = petLeaderboard.length > 0;
  document.querySelector("#adminRankingCount").textContent = `${petLeaderboard.length} 只宠物`;
  if (window.lucide) window.lucide.createIcons();
}

async function loadPetLeaderboard() {
  const { data, error } = await supabaseClient.rpc("get_pet_leaderboard");
  if (error) {
    petLeaderboard = [];
    renderPetLeaderboard();
    showStatus("排行榜读取失败，请稍后重试");
    return false;
  }
  petLeaderboard = (data || []).map((entry) => ({
    ...entry,
    rank_position: Number(entry.rank_position),
    pet_experience: Number(entry.pet_experience) || 0,
    pet_level: Number(entry.pet_level) || 1,
    level_progress: Number(entry.level_progress) || 0,
    level_required: Number(entry.level_required) || 10,
    next_reward_percent: Number(entry.next_reward_percent) || 0,
    last_reward_experience: Number(entry.last_reward_experience) || 0,
  }));
  renderPetLeaderboard();
  return true;
}

function normalizeQuestionText(value) {
  return String(value || "").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
}

function stripQuestionNumber(value) {
  return normalizeQuestionText(value).replace(/^(?:第\s*)?\d+\s*[.、)）]\s*/, "");
}

function stripChoiceLabel(value) {
  return normalizeQuestionText(value).replace(/^[（(]?\s*[A-Da-d]\s*[）).、:：]\s*/, "");
}

function resolveChoiceAnswer(value, options) {
  const cleaned = normalizeQuestionText(value)
    .replace(/^(?:参考)?(?:正确)?答案\s*[:：]?\s*/i, "")
    .replace(/[。；;，,\s]+$/g, "");
  if (/^[A-Da-d]$/.test(cleaned)) return options[cleaned.toUpperCase().charCodeAt(0) - 65] || "";
  return options.find((option) => option.toLocaleLowerCase("zh-CN") === cleaned.toLocaleLowerCase("zh-CN")) || "";
}

function isValidImportedQuestion(question) {
  if (!question || !["choice", "word"].includes(question.challenge_type)) return false;
  if (!question.prompt || question.prompt.length > 300 || !question.correct_answer || question.correct_answer.length > 120) return false;
  if (question.challenge_type === "word") return question.options === null;
  return Array.isArray(question.options)
    && question.options.length === 4
    && question.options.every((option) => option && option.length <= 120)
    && question.options.some((option) => option.toLocaleLowerCase("zh-CN") === question.correct_answer.toLocaleLowerCase("zh-CN"));
}

function dedupeImportedQuestions(questions) {
  const seen = new Set();
  return questions.filter((question) => {
    if (!isValidImportedQuestion(question)) return false;
    const key = JSON.stringify([
      question.challenge_type,
      question.prompt.toLocaleLowerCase("zh-CN"),
      question.correct_answer.toLocaleLowerCase("zh-CN"),
      question.options,
    ]);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 500);
}

function prepareQuestionLines(rawText) {
  return String(rawText || "")
    .replace(/\r/g, "\n")
    .replace(/\s+(?=[A-Da-d]\s*[.、)）:：]\s*)/g, "\n")
    .replace(/\s+(?=(?:参考)?(?:正确)?答案\s*[:：])/g, "\n")
    .split(/\n+/)
    .map(normalizeQuestionText)
    .filter(Boolean);
}

function parseChoiceTableRows(tableRows) {
  const questions = [];
  tableRows.forEach((rawCells) => {
    const cells = rawCells.map(normalizeQuestionText).filter(Boolean);
    const promptIndex = /^\d+$/.test(cells[0] || "") ? 1 : 0;
    if (cells.length < promptIndex + 6) return;
    const prompt = stripQuestionNumber(cells[promptIndex]);
    const options = cells.slice(promptIndex + 1, promptIndex + 5).map(stripChoiceLabel);
    const correctAnswer = resolveChoiceAnswer(cells[promptIndex + 5], options);
    const question = { challenge_type: "choice", prompt, options, correct_answer: correctAnswer };
    if (isValidImportedQuestion(question)) questions.push(question);
  });
  return questions;
}

function parseChoiceQuestions(rawText, tableRows = []) {
  const questions = parseChoiceTableRows(tableRows);
  let current = null;
  let pendingPrompt = "";

  const finishCurrent = (answerValue) => {
    if (!current) return;
    const options = ["A", "B", "C", "D"].map((letter) => normalizeQuestionText(current.options[letter]));
    const question = {
      challenge_type: "choice",
      prompt: normalizeQuestionText(current.prompt),
      options,
      correct_answer: resolveChoiceAnswer(answerValue || current.answer, options),
    };
    if (isValidImportedQuestion(question)) questions.push(question);
    current = null;
  };

  prepareQuestionLines(rawText).forEach((line) => {
    const answerMatch = line.match(/^(?:参考)?(?:正确)?答案\s*[:：]?\s*(.+)$/i);
    if (answerMatch) {
      if (current) finishCurrent(answerMatch[1]);
      pendingPrompt = "";
      return;
    }

    const optionMatch = line.match(/^[（(]?\s*([A-Da-d])\s*[）).、:：]\s*(.+)$/);
    if (optionMatch) {
      if (!current) current = { prompt: pendingPrompt, options: {} };
      current.options[optionMatch[1].toUpperCase()] = normalizeQuestionText(optionMatch[2]);
      return;
    }

    const questionMatch = line.match(/^(?:第\s*)?\d+\s*[.、)）]\s*(.+)$/);
    if (questionMatch) {
      if (current) finishCurrent("");
      current = { prompt: normalizeQuestionText(questionMatch[1]), options: {} };
      pendingPrompt = "";
      return;
    }

    if (current) {
      const lastOption = ["D", "C", "B", "A"].find((letter) => current.options[letter]);
      if (lastOption) current.options[lastOption] = normalizeQuestionText(`${current.options[lastOption]} ${line}`);
      else current.prompt = normalizeQuestionText(`${current.prompt} ${line}`);
    } else pendingPrompt = normalizeQuestionText(line.replace(/^(?:题目|问题)\s*[:：]\s*/, ""));
  });
  if (current) finishCurrent("");
  return questions;
}

function containsChinese(value) {
  return /[\u3400-\u9fff]/.test(value);
}

function containsLatin(value) {
  return /[A-Za-z]/.test(value);
}

function createWordPairQuestions(firstValue, secondValue) {
  const first = normalizeQuestionText(firstValue);
  const second = normalizeQuestionText(secondValue);
  if (!first || !second || first.length > 120 || second.length > 120) return [];
  if (containsChinese(first) && containsLatin(second) && !containsChinese(second)) {
    return [
      { challenge_type: "word", prompt: `“${first}”的英文是？`, options: null, correct_answer: second },
      { challenge_type: "word", prompt: `“${second}”的中文是？`, options: null, correct_answer: first },
    ];
  }
  if (containsLatin(first) && !containsChinese(first) && containsChinese(second)) {
    return [
      { challenge_type: "word", prompt: `“${first}”的中文是？`, options: null, correct_answer: second },
      { challenge_type: "word", prompt: `“${second}”的英文是？`, options: null, correct_answer: first },
    ];
  }
  return [];
}

function parseWordQuestions(rawText, tableRows = []) {
  const questions = [];
  const addPair = (first, second) => questions.push(...createWordPairQuestions(first, second));

  tableRows.forEach((cells) => {
    const values = cells.map(normalizeQuestionText).filter(Boolean);
    const start = /^\d+$/.test(values[0] || "") ? 1 : 0;
    if (values.length === start + 2) addPair(values[start], values[start + 1]);
  });

  prepareQuestionLines(rawText).forEach((rawLine) => {
    const line = stripQuestionNumber(rawLine);
    if (/^[（(]?\s*[A-Da-d]\s*[）).、:：]/.test(line) || /^(?:参考)?(?:正确)?答案\s*[:：]/.test(line)) return;

    const directQuestion = line.match(/^(?:题目|问题|Q)\s*[:：]\s*(.+?)\s+(?:答案|A)\s*[:：]\s*(.+)$/i);
    if (directQuestion) {
      const question = {
        challenge_type: "word",
        prompt: normalizeQuestionText(directQuestion[1]),
        options: null,
        correct_answer: normalizeQuestionText(directQuestion[2]),
      };
      if (isValidImportedQuestion(question)) questions.push(question);
      return;
    }

    const pair = line.match(/^(.+?)\s*(?:\t|[-–—=＝→|｜])\s*(.+)$/);
    if (pair) {
      addPair(pair[1], pair[2]);
      return;
    }

    const spacedPair = line.match(/^([A-Za-z][A-Za-z '\-]{0,80})\s+([\u3400-\u9fff][\u3400-\u9fff\s]{0,80})$/)
      || line.match(/^([\u3400-\u9fff][\u3400-\u9fff\s]{0,80})\s+([A-Za-z][A-Za-z '\-]{0,80})$/);
    if (spacedPair) addPair(spacedPair[1], spacedPair[2]);
  });
  return questions;
}

function getQuestionDocumentRows(html) {
  const parsed = new DOMParser().parseFromString(String(html || ""), "text/html");
  return [...parsed.querySelectorAll("tr")].map((row) => [...row.querySelectorAll(":scope > th, :scope > td")].map((cell) => cell.textContent));
}

function renderQuestionRow(question, { preview = false, index = 0 } = {}) {
  const row = createElement("article", "question-bank-row");
  const type = createElement("span", `question-type-badge${question.challenge_type === "word" ? " is-word" : ""}`, question.challenge_type === "choice" ? "选择题" : "单词题");
  const copy = createElement("div", "question-bank-copy");
  const optionText = question.challenge_type === "choice"
    ? question.options.map((option, optionIndex) => `${String.fromCharCode(65 + optionIndex)}. ${option}`).join(" · ")
    : "中英文互问";
  copy.append(createElement("strong", "", question.prompt), createElement("small", "", optionText));
  const meta = createElement("div", "question-bank-meta");
  meta.append(createElement("strong", "", `答案：${question.correct_answer}`), createElement("small", "", preview ? "待确认导入" : question.source_name));

  if (preview) {
    row.append(type, copy, meta, createElement("span", "question-preview-index", `#${index + 1}`));
    return row;
  }

  const toggle = createElement("label", "question-active-toggle");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = question.is_active === true;
  const label = createElement("span", "", checkbox.checked ? "已启用" : "已停用");
  checkbox.addEventListener("change", async () => {
    checkbox.disabled = true;
    const { data, error } = await supabaseClient.rpc("set_pet_challenge_question_active", {
      p_question_id: question.question_id,
      p_is_active: checkbox.checked,
    });
    checkbox.disabled = false;
    if (error || data !== true) {
      checkbox.checked = !checkbox.checked;
      showStatus("题目状态保存失败，请重试");
      return;
    }
    question.is_active = checkbox.checked;
    label.textContent = checkbox.checked ? "已启用" : "已停用";
    renderQuestionBankSummary();
    showStatus(checkbox.checked ? "题目已启用" : "题目已停用");
  });
  toggle.append(checkbox, label);
  row.append(type, copy, meta, toggle);
  return row;
}

function renderQuestionBankSummary() {
  const activeQuestions = questionBank.filter((question) => question.is_active);
  const choiceCount = activeQuestions.filter((question) => question.challenge_type === "choice").length;
  const wordCount = activeQuestions.filter((question) => question.challenge_type === "word").length;
  document.querySelector("#questionBankSummary").textContent = `${activeQuestions.length} 道启用 · 选择题 ${choiceCount} · 单词题 ${wordCount}`;
  document.querySelector("#adminQuestionCount").textContent = `${activeQuestions.length} 道启用`;
}

function renderQuestionBank() {
  const list = document.querySelector("#questionBankList");
  list.replaceChildren(...questionBank.map((question) => renderQuestionRow(question)));
  document.querySelector("#questionBankEmpty").hidden = questionBank.length > 0;
  renderQuestionBankSummary();
  if (window.lucide) window.lucide.createIcons();
}

function renderImportedQuestionPreview() {
  const previewSection = document.querySelector("#questionPreviewSection");
  const previewList = document.querySelector("#questionPreviewList");
  previewSection.hidden = importedQuestions.length === 0;
  previewList.replaceChildren(...importedQuestions.map((question, index) => renderQuestionRow(question, { preview: true, index })));
  const choiceCount = importedQuestions.filter((question) => question.challenge_type === "choice").length;
  const wordCount = importedQuestions.filter((question) => question.challenge_type === "word").length;
  document.querySelector("#questionPreviewSummary").textContent = `${importedQuestions.length} 道 · 选择题 ${choiceCount} · 单词题 ${wordCount}`;
}

async function loadQuestionBank({ quiet = false } = {}) {
  if (!canEdit) return false;
  const { data, error } = await supabaseClient.rpc("get_admin_pet_challenge_question_bank");
  if (error) {
    questionBank = [];
    renderQuestionBank();
    if (!quiet) showStatus("题库读取失败，请稍后重试");
    return false;
  }
  questionBank = (data || []).map((question) => ({
    ...question,
    options: Array.isArray(question.options) ? question.options : null,
    is_active: question.is_active === true,
  }));
  renderQuestionBank();
  return true;
}

function getQuestionFileKind(file) {
  const name = file?.name?.toLocaleLowerCase("zh-CN") || "";
  if (name.endsWith(".docx")) return "docx";
  if (name.endsWith(".pdf") || file?.type === "application/pdf") return "pdf";
  if (["image/png", "image/jpeg", "image/webp"].includes(file?.type) || /\.(?:png|jpe?g|webp)$/.test(name)) return "image";
  return "";
}

function validateQuestionFile(file, kind) {
  const limits = { docx: 10, pdf: 20, image: 12 };
  if (!kind) return "请选择 DOCX、PDF、PNG、JPG 或 WebP 文件";
  if (file.size > limits[kind] * 1024 * 1024) return `${kind === "image" ? "图片" : kind.toUpperCase()} 文件不能超过 ${limits[kind]} MB`;
  return "";
}

function updateQuestionImportProgress(message) {
  document.querySelector("#questionImportStatus").textContent = message;
}

async function extractDocxQuestionContent(file) {
  if (!window.mammoth) throw new Error("Word 识别组件加载失败");
  const arrayBuffer = await file.arrayBuffer();
  const [rawResult, htmlResult] = await Promise.all([
    window.mammoth.extractRawText({ arrayBuffer }),
    window.mammoth.convertToHtml({ arrayBuffer }),
  ]);
  return { text: rawResult.value, tableRows: getQuestionDocumentRows(htmlResult.value), method: "Word 文本识别" };
}

function extractPdfTextItems(textContent) {
  let text = "";
  let previousY = null;
  textContent.items.forEach((item) => {
    const value = String(item.str || "").trim();
    if (!value) return;
    const y = Number(item.transform?.[5]);
    const newLine = previousY !== null && Number.isFinite(y) && Math.abs(y - previousY) > 3;
    text += `${text && (newLine || item.hasEOL) ? "\n" : (text ? " " : "")}${value}`;
    previousY = item.hasEOL ? null : y;
  });
  return text;
}

async function createQuestionOcrWorker(fileName) {
  if (!window.Tesseract) throw new Error("图片识别组件加载失败");
  return window.Tesseract.createWorker("chi_sim+eng", 1, {
    workerPath: "vendor/tesseract/worker.min.js",
    langPath: "vendor/tessdata",
    corePath: "vendor/tesseract/core",
    logger: (message) => {
      if (message.status === "recognizing text") {
        updateQuestionImportProgress(`${fileName} · 正在识别文字 ${Math.round((message.progress || 0) * 100)}%`);
      }
    },
  });
}

function createScaledCanvas(width, height, maxSide = 2600) {
  const scale = Math.min(1, maxSide / Math.max(width, height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));
  return { canvas, scale };
}

async function extractImageQuestionContent(file) {
  const bitmap = await createImageBitmap(file);
  const { canvas } = createScaledCanvas(bitmap.width, bitmap.height);
  canvas.getContext("2d", { alpha: false }).drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const worker = await createQuestionOcrWorker(file.name);
  try {
    const result = await worker.recognize(canvas);
    return { text: result.data.text, tableRows: [], method: "图片文字识别" };
  } finally {
    await worker.terminate();
  }
}

async function renderPdfPageForOcr(page) {
  const viewport = page.getViewport({ scale: 2 });
  const { canvas, scale } = createScaledCanvas(viewport.width, viewport.height);
  const renderViewport = page.getViewport({ scale: 2 * scale });
  await page.render({ canvasContext: canvas.getContext("2d", { alpha: false }), viewport: renderViewport }).promise;
  return canvas;
}

async function extractPdfQuestionContent(file) {
  if (!window.pdfjsLib) throw new Error("PDF 识别组件加载失败");
  window.pdfjsLib.GlobalWorkerOptions.workerSrc = "vendor/pdfjs/pdf.worker.min.js";
  const pdf = await window.pdfjsLib.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  if (pdf.numPages > 30) {
    await pdf.destroy();
    throw new Error("PDF 最多支持 30 页，请拆分后再导入");
  }

  const pages = [];
  const ocrPages = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    updateQuestionImportProgress(`${file.name} · 正在读取第 ${pageNumber} / ${pdf.numPages} 页`);
    const page = await pdf.getPage(pageNumber);
    const pageText = extractPdfTextItems(await page.getTextContent());
    pages[pageNumber - 1] = pageText;
    if (normalizeQuestionText(pageText).length < 30) ocrPages.push({ pageNumber, page });
  }

  if (ocrPages.length) {
    const worker = await createQuestionOcrWorker(file.name);
    try {
      for (let index = 0; index < ocrPages.length; index += 1) {
        const { pageNumber, page } = ocrPages[index];
        updateQuestionImportProgress(`${file.name} · 扫描页 OCR ${index + 1} / ${ocrPages.length}`);
        const result = await worker.recognize(await renderPdfPageForOcr(page));
        pages[pageNumber - 1] = result.data.text;
      }
    } finally {
      await worker.terminate();
    }
  }
  await pdf.destroy();
  return { text: pages.join("\n\n"), tableRows: [], method: ocrPages.length ? "PDF 文本提取 + 扫描页识别" : "PDF 文本提取" };
}

async function previewQuestionDocument() {
  const fileInput = document.querySelector("#questionBankFile");
  const file = fileInput.files?.[0];
  if (!file) return;
  const kind = getQuestionFileKind(file);
  const validationError = validateQuestionFile(file, kind);
  if (validationError) return showStatus(validationError);

  const button = document.querySelector("#importQuestionPreview");
  button.disabled = true;
  updateQuestionImportProgress(`正在识别 ${file.name}`);
  try {
    const content = kind === "docx"
      ? await extractDocxQuestionContent(file)
      : (kind === "pdf" ? await extractPdfQuestionContent(file) : await extractImageQuestionContent(file));
    importedQuestions = dedupeImportedQuestions([
      ...parseChoiceQuestions(content.text, content.tableRows),
      ...parseWordQuestions(content.text, content.tableRows),
    ]);
    renderImportedQuestionPreview();
    updateQuestionImportProgress(importedQuestions.length
      ? `${file.name} · ${content.method} · 已识别 ${importedQuestions.length} 道题`
      : `${file.name} · 未识别到有效题目`);
    showStatus(importedQuestions.length ? `已识别 ${importedQuestions.length} 道题，请确认后加入题库` : "未识别到有效题目，请检查文件内容");
  } catch (error) {
    importedQuestions = [];
    renderImportedQuestionPreview();
    updateQuestionImportProgress(`${file.name} · 识别失败`);
    showStatus(error?.message || "文件识别失败，请确认文件可以正常打开");
  } finally {
    button.disabled = false;
  }
}

async function saveImportedQuestions() {
  if (!canEdit || importedQuestions.length === 0) return;
  const file = document.querySelector("#questionBankFile").files?.[0];
  const button = document.querySelector("#saveImportedQuestions");
  button.disabled = true;
  const { data, error } = await supabaseClient.rpc("import_pet_challenge_questions", {
    p_questions: importedQuestions,
    p_source_name: file?.name || "文件导入",
  });
  button.disabled = false;
  if (error) {
    showStatus("题目保存失败，请检查题目内容后重试");
    return;
  }
  const result = Array.isArray(data) ? data[0] : data;
  const inserted = Number(result?.inserted) || 0;
  const skipped = Number(result?.skipped) || 0;
  importedQuestions = [];
  document.querySelector("#questionBankFile").value = "";
  document.querySelector("#importQuestionPreview").disabled = true;
  updateQuestionImportProgress("等待选择 Word、PDF 或图片文件");
  renderImportedQuestionPreview();
  await loadQuestionBank({ quiet: true });
  showStatus(`已加入 ${inserted} 道题${skipped ? `，跳过 ${skipped} 道重复题` : ""}`);
}

function getStudentInitialPassword(username) {
  const name = String(username || "").normalize("NFKC").trim();
  if (!name || !window.pinyinPro?.pinyin) return "";
  const syllables = window.pinyinPro.pinyin(name, { toneType: "none", type: "array" });
  return syllables
    .map((syllable) => String(syllable).replace(/[^A-Za-z]/g, "").charAt(0))
    .filter(Boolean)
    .join("")
    .toUpperCase()
    .slice(0, 12);
}

function updateStudentPasswordPreview() {
  const username = document.querySelector("#studentUsernameInput").value;
  document.querySelector("#studentPasswordInput").value = getStudentInitialPassword(username);
}

function formatChallengeDuration(seconds) {
  if (seconds === null || seconds === undefined) return "未提交";
  const value = Number(seconds) || 0;
  if (value < 60) return `${value} 秒`;
  return `${Math.floor(value / 60)} 分 ${value % 60} 秒`;
}

function formatChallengeDate(value) {
  if (!value) return "暂无时间";
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: scheduleTimeZone,
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function renderChallengeSummary(summary) {
  const choiceAttempts = Number(summary.choice_attempts) || 0;
  const wordAttempts = Number(summary.word_attempts) || 0;
  const choiceRemaining = Number(summary.choice_remaining ?? Math.max(0, 50 - choiceAttempts));
  const wordRemaining = Number(summary.word_remaining ?? Math.max(0, 50 - wordAttempts));
  document.querySelector("#choiceChallengeCount").textContent = `${choiceAttempts} / 50`;
  document.querySelector("#wordChallengeCount").textContent = `${wordAttempts} / 50`;
  document.querySelector("#choiceChallengeStreak").textContent = `连续答对 ${Number(summary.choice_streak) || 0}`;
  if (challengeState.type === "choice") document.querySelector("#challengeQuestionProgress").textContent = `今日剩余 ${choiceRemaining} 题`;
  else document.querySelector("#challengeQuestionProgress").textContent = `今日剩余 ${wordRemaining} 题`;
}

async function loadChallengeSummary() {
  const { data, error } = await supabaseClient.rpc("get_my_challenge_summary");
  if (error) {
    showStatus("挑战进度读取失败，请稍后重试");
    return null;
  }
  const summary = Array.isArray(data) ? data[0] : data;
  renderChallengeSummary(summary || {});
  return summary || {};
}

function setChallengeType(type) {
  challengeState.type = type;
  challengeState.attemptId = null;
  challengeState.answered = false;
  document.querySelector("#showChoiceChallenge").classList.toggle("is-active", type === "choice");
  document.querySelector("#showChoiceChallenge").setAttribute("aria-selected", String(type === "choice"));
  document.querySelector("#showWordChallenge").classList.toggle("is-active", type === "word");
  document.querySelector("#showWordChallenge").setAttribute("aria-selected", String(type === "word"));
  document.querySelector("#choiceChallengeOptions").hidden = type !== "choice";
  document.querySelector("#wordChallengeForm").hidden = type !== "word";
  document.querySelector("#challengeResult").hidden = true;
  document.querySelector("#nextChallengeQuestion").hidden = true;
  document.querySelector("#wordChallengeAnswer").value = "";
  loadNextChallengeQuestion();
}

function renderChallengeQuestion(question) {
  challengeState.attemptId = Number(question.attempt_id);
  challengeState.attemptsUsed = Number(question.attempts_used) || 0;
  challengeState.attemptsRemaining = Number(question.attempts_remaining) || 0;
  challengeState.choiceStreak = Number(question.choice_streak) || 0;
  challengeState.answered = false;
  document.querySelector("#challengeQuestionType").textContent = question.challenge_type === "choice" ? "选择题挑战" : "单词挑战";
  document.querySelector("#challengePrompt").textContent = question.prompt;
  document.querySelector("#challengeResult").hidden = true;
  document.querySelector("#nextChallengeQuestion").hidden = true;
  const options = document.querySelector("#choiceChallengeOptions");
  options.replaceChildren();
  (question.options || []).forEach((option, index) => {
    const button = createElement("button", "challenge-option");
    button.type = "button";
    button.innerHTML = `<span>${String.fromCharCode(65 + index)}</span><strong></strong>`;
    button.querySelector("strong").textContent = option;
    button.addEventListener("click", () => submitChallengeAnswer(option, button));
    options.append(button);
  });
  if (window.lucide) window.lucide.createIcons();
}

async function loadNextChallengeQuestion() {
  if (!currentUser?.pet || canEdit) return;
  const questionCard = document.querySelector("#challengeQuestionCard");
  questionCard.classList.add("is-loading");
  const { data, error } = await supabaseClient.rpc("get_next_pet_challenge_question", { p_challenge_type: challengeState.type });
  questionCard.classList.remove("is-loading");
  if (error) {
    document.querySelector("#challengePrompt").textContent = error.message?.includes("daily challenge limit")
      ? "今日挑战次数已用完，明天再来吧"
      : "当前没有可用题目，请稍后再试";
    document.querySelector("#choiceChallengeOptions").replaceChildren();
    document.querySelector("#wordChallengeForm").hidden = true;
    document.querySelector("#challengeQuestionProgress").textContent = "今日剩余 0 题";
    await loadChallengeSummary();
    return false;
  }
  const question = Array.isArray(data) ? data[0] : data;
  if (!question) return false;
  renderChallengeQuestion(question);
  await loadChallengeSummary();
  return true;
}

function renderChallengeResult(result) {
  const resultBox = document.querySelector("#challengeResult");
  const correct = result.is_correct === true;
  resultBox.className = `challenge-result ${correct ? "is-correct" : "is-wrong"}`;
  document.querySelector("#challengeResultTitle").textContent = correct ? `答对了，获得 ${result.gained_experience} 经验` : "这次答错了";
  document.querySelector("#challengeResultDetail").textContent = `本题用时 ${formatChallengeDuration(result.duration_seconds)} · 今日还剩 ${result.attempts_remaining} 题`;
  resultBox.hidden = false;
  document.querySelector("#nextChallengeQuestion").hidden = result.attempts_remaining <= 0;
  if (window.lucide) window.lucide.createIcons();
}

async function submitChallengeAnswer(answer, clickedButton = null) {
  if (!challengeState.attemptId || challengeState.answered) return;
  if (clickedButton) clickedButton.disabled = true;
  document.querySelector("#submitWordChallenge").disabled = true;
  challengeState.answered = true;
  const { data, error } = await supabaseClient.rpc("answer_pet_challenge_question", {
    p_attempt_id: challengeState.attemptId,
    p_answer: answer,
  });
  document.querySelector("#submitWordChallenge").disabled = false;
  if (error) {
    challengeState.answered = false;
    if (clickedButton) clickedButton.disabled = false;
    showStatus("提交答案失败，请重试");
    return;
  }
  const result = Array.isArray(data) ? data[0] : data;
  if (!result) return;
  currentUser.pet_experience = Number(result.total_experience) || currentUser.pet_experience;
  renderChallengeResult(result);
  await loadChallengeSummary();
  if (!petDetailPage.hidden) renderPetDetail();
  updateVisitorPet();
  showStatus(result.is_correct ? `答对了，获得 ${result.gained_experience} 经验` : "答错了，继续加油");
}

function renderChallengeRecords() {
  const list = document.querySelector("#challengeRecordList");
  list.replaceChildren();
  challengeRecords.forEach((record) => {
    const row = createElement("article", `challenge-record-row ${record.is_correct ? "is-correct" : "is-wrong"}`);
    const result = createElement("span", "challenge-record-result", record.is_correct ? "对" : "错");
    const identity = createElement("div", "challenge-record-identity");
    identity.append(createElement("strong", "", record.student_username), createElement("small", "", `${record.pet_name} · ${record.challenge_type === "choice" ? "选择题" : "单词"}`));
    const question = createElement("div", "challenge-record-question");
    question.append(createElement("strong", "", record.question_prompt), createElement("small", "", `回答：${record.submitted_answer || "-"}`));
    const metrics = createElement("div", "challenge-record-metrics");
    metrics.append(createElement("strong", "", `+${record.reward_experience} 经验`), createElement("small", "", `${formatChallengeDuration(record.duration_seconds)} · ${formatChallengeDate(record.answered_at)}`));
    row.append(result, identity, question, metrics);
    list.append(row);
  });
  document.querySelector("#challengeRecordEmpty").hidden = challengeRecords.length > 0;
  document.querySelector("#challengeRecordTotal").textContent = `${challengeRecords.length} 条`;
}

async function loadAdminChallengeRecords() {
  if (!canEdit) return false;
  const { data, error } = await supabaseClient.rpc("get_admin_pet_challenge_records", { p_limit: 500 });
  if (error) {
    challengeRecords = [];
    renderChallengeRecords();
    showStatus("挑战记录读取失败，请稍后重试");
    return false;
  }
  challengeRecords = (data || []).map((record) => ({
    ...record,
    reward_experience: Number(record.reward_experience) || 0,
    duration_seconds: record.duration_seconds === null ? null : Number(record.duration_seconds) || 0,
  }));
  renderChallengeRecords();
  return true;
}

async function showStudentChallenge() {
  if (canEdit || !currentUser?.pet) return;
  scheduleSection.hidden = true;
  pageFooter.hidden = true;
  hideAdminPages();
  studentChallengePage.hidden = false;
  document.body.classList.add("is-admin-view");
  setChallengeType("choice");
  document.querySelector("#showChoiceChallenge").focus();
}

async function showChallengeRecords() {
  if (!canEdit) return;
  await loadAdminChallengeRecords();
  scheduleSection.hidden = true;
  pageFooter.hidden = true;
  hideAdminPages();
  challengeRecordsPage.hidden = false;
  document.body.classList.add("is-admin-view");
  document.querySelector("#refreshChallengeRecords").focus();
}

function hideAdminPages() {
  adminHub.hidden = true;
  studentManagementPage.hidden = true;
  attendanceManagementPage.hidden = true;
  petManagementPage.hidden = true;
  petBattleHistoryPage.hidden = true;
  petDetailPage.hidden = true;
  petLeaderboardPage.hidden = true;
  studentChallengePage.hidden = true;
  challengeRecordsPage.hidden = true;
  questionBankPage.hidden = true;
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
  document.querySelector("#adminAttendanceCount").textContent = `${getTodayAttendanceStudentIds().length} 人待打卡`;
  if (questionBank.length) renderQuestionBankSummary();
}

async function showAdminHub() {
  if (!canEdit) return;
  await Promise.all([loadStudents(), loadQuestionBank({ quiet: true })]);
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

async function showAttendanceManagement() {
  if (!canEdit) return;
  await loadSchedule({ quiet: true });
  await loadAttendance();
  hideAdminPages();
  scheduleSection.hidden = true;
  pageFooter.hidden = true;
  attendanceManagementPage.hidden = false;
  document.body.classList.add("is-admin-view");
  renderAttendance();
  document.querySelector("#markAllPresent").focus();
}

async function showPetManagement() {
  if (!canEdit) return;
  await loadStudents();
  await loadPetBattleHistory();
  hideAdminPages();
  petManagementPage.hidden = false;
  document.querySelector("#petStudentList")?.querySelector("button")?.focus();
}

function renderFullPetBattleHistory() {
  const student = getOwnerById(selectedBattleHistoryStudentId);
  const battles = student ? getStudentPetBattles(student.id) : [];
  const wins = student ? battles.filter((battle) => battle.winner_id === student.id).length : 0;
  document.querySelector("#petBattleHistoryTitle").textContent = student ? `${student.username}的对战记录` : "全部对战记录";
  document.querySelector("#petBattleHistoryStudent").textContent = student?.username || "学生";
  document.querySelector("#petBattleHistoryTotal").textContent = String(battles.length);
  document.querySelector("#petBattleHistoryWins").textContent = String(wins);
  document.querySelector("#petBattleHistoryLosses").textContent = String(battles.length - wins);
  document.querySelector("#petBattleHistoryList").replaceChildren(
    ...battles.map((battle) => renderAdminPetBattleRecord(battle, student)),
  );
  document.querySelector("#petBattleHistoryEmpty").hidden = battles.length > 0;
  if (window.lucide) window.lucide.createIcons();
}

function showFullPetBattleHistory(studentId) {
  if (!canEdit || !getOwnerById(studentId)) return;
  selectedBattleHistoryStudentId = studentId;
  hideAdminPages();
  petBattleHistoryPage.hidden = false;
  renderFullPetBattleHistory();
  document.querySelector("#closePetBattleHistory").focus();
}

async function showQuestionBank() {
  if (!canEdit) return;
  await loadQuestionBank();
  scheduleSection.hidden = true;
  pageFooter.hidden = true;
  hideAdminPages();
  questionBankPage.hidden = false;
  document.body.classList.add("is-admin-view");
  document.querySelector("#questionBankFile").focus();
}

async function showPetLeaderboard(returnView = canEdit ? "admin" : "schedule") {
  petLeaderboardReturnView = returnView;
  scheduleSection.hidden = true;
  pageFooter.hidden = true;
  hideAdminPages();
  petLeaderboardPage.hidden = false;
  document.body.classList.add("is-admin-view");
  await loadPetLeaderboard();
  document.querySelector("#closePetLeaderboard").focus();
}

async function showPetDetail() {
  const pet = petCatalog.find((item) => item.id === currentUser?.pet);
  if (!currentUser || !pet) return;
  if (!canEdit) await Promise.all([loadAdminPetComparison(), loadDailyPetBattleCount()]);
  petDetailReturnView = "schedule";
  scheduleSection.hidden = true;
  pageFooter.hidden = true;
  hideAdminPages();
  petDetailPage.hidden = false;
  document.body.classList.add("is-admin-view");
  renderPetDetail();
  document.querySelector("#petNameInput").focus();
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
  document.querySelector("#openStudentChallenge").hidden = canEdit || !currentUser?.pet;
  dialogCourseActions.hidden = !canEdit || formMode !== "view" || !selectedCourseId;
  document.querySelector("#permissionHint").textContent = canEdit
    ? `${currentUser?.username || "曾老师"} · 可管理课程、学生账号和课次进度`
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
  const repeatInterval = course?.repeatIntervalDays ?? null;
  document.querySelector("#courseNameInput").value = course?.name || "";
  dayStartInput.value = course?.startDate || toISODate(selectedWeekStart);
  startTimeInput.value = formatTime(course?.startTime ?? timelineStart);
  setDurationValue(course?.duration ?? 100);
  document.querySelector("#courseNotesInput").value = course?.notes || "";
  setRepeatControls(repeatInterval, repeatInterval === null ? 1 : (course?.repeatCount ?? null));
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
    showStatus("当前为只读模式，请先以曾老师账号登录");
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

function setCourseDeleteButtonsDisabled(disabled) {
  [
    confirmDeleteButton,
    document.querySelector("#deleteOccurrenceOnly"),
    document.querySelector("#deleteOccurrenceFuture"),
  ].forEach((button) => { button.disabled = disabled; });
}

async function deleteSelectedCourse(mode = "all") {
  const course = schedule.find((item) => item.id === selectedCourseId);
  if (!course || !canEdit) return;
  setCourseDeleteButtonsDisabled(true);
  const response = mode === "all"
    ? await supabaseClient.rpc("delete_course", {
      p_course_id: course.id,
      p_expected_version: course.version,
    })
    : await supabaseClient.rpc("delete_course_occurrence", {
      p_course_id: course.id,
      p_occurrence_date: selectedOccurrenceDate || course.startDate,
      p_mode: mode,
      p_expected_version: course.version,
    });
  setCourseDeleteButtonsDisabled(false);
  const { data: deleted, error } = response;

  if (error) {
    const stale = error.message?.toLowerCase().includes("stale course");
    showStatus(stale ? "课程刚被其他设备修改，请确认后重试" : "删除失败，请检查连接后重试");
    if (stale) await loadSchedule({ quiet: true });
    return;
  }
  if (!deleted) {
    showStatus("课程已在其他设备变更，请刷新后重试");
    await loadSchedule({ quiet: true });
    deleteDialog.close();
    return;
  }

  deleteDialog.close();
  dialog.close();
  await loadSchedule({ quiet: true });
  if (mode === "single") showStatus("仅当天课程已删除，其他重复课程保持不变");
  else if (mode === "future") showStatus("当天及后续课程已删除，此前课程保持不变");
  else showStatus("课程已删除");
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
  if (canEdit) renderAdminHubCounts();
  if (!attendanceManagementPage.hidden && canEdit) {
    await loadAttendance();
  }
  refreshOpenDialog();
  if (!quiet) setSyncState("connecting", "正在建立实时同步");
  return true;
}

async function applyRealtimeChange() {
  await loadSchedule({ quiet: true });
  setSyncState("online", canEdit ? "曾老师 · 实时同步" : "只读 · 实时同步");
}

async function applyStudentRealtimeChange() {
  if (!currentUser) return;
  if (canEdit) {
    await loadStudents();
    await refreshCurrentUserPet();
    if (!petLeaderboardPage.hidden) await loadPetLeaderboard();
    if (!petManagementPage.hidden) await loadPetBattleHistory();
    return;
  }

  await refreshCurrentUserPet();
  if (!petLeaderboardPage.hidden) await loadPetLeaderboard();
  await loadAdminPetComparison();
}

async function refreshCurrentUserPet() {
  if (!currentUser) return;
  const { data, error } = await supabaseClient
    .from("students")
    .select("lesson_count, current_lesson_count, required_lesson_count, color, pet, pet_name, pet_experience, pet_coins, pet_checkin_date, pet_checkin_streak")
    .eq("id", currentUser.id)
    .single();
  if (!error && data) {
    currentUser = normalizePetFields({
      ...currentUser,
      ...data,
      lesson_count: Number(data.lesson_count) || 0,
      current_lesson_count: Number(data.current_lesson_count) || 0,
      required_lesson_count: Number(data.required_lesson_count) || 0,
      color: data.color || "",
    });
    updateLessonSummary();
    updateVisitorPet();
    if (!petDetailPage.hidden) renderPetDetail();
    renderSchedule();
  }
}

function subscribeToCourses() {
  if (realtimeChannel) supabaseClient.removeChannel(realtimeChannel);
  if (realtimeAssignmentChannel) supabaseClient.removeChannel(realtimeAssignmentChannel);
  if (realtimeStudentChannel) supabaseClient.removeChannel(realtimeStudentChannel);
  if (realtimeBattleChannel) supabaseClient.removeChannel(realtimeBattleChannel);
  if (realtimeAttendanceChannel) supabaseClient.removeChannel(realtimeAttendanceChannel);
  realtimeChannel = supabaseClient
    .channel("course-schedule-live")
    .on("postgres_changes", { event: "*", schema: "public", table: "courses" }, applyRealtimeChange)
    .subscribe((status) => {
      if (status === "SUBSCRIBED") {
        setSyncState("online", canEdit ? "曾老师 · 实时同步" : "只读 · 实时同步");
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
  realtimeBattleChannel = supabaseClient
    .channel("pet-battle-history-live")
    .on("postgres_changes", { event: "*", schema: "public", table: "pet_battles" }, async () => {
      if (canEdit && (!petManagementPage.hidden || !petBattleHistoryPage.hidden)) await loadPetBattleHistory();
    })
    .subscribe();
  realtimeAttendanceChannel = supabaseClient
    .channel("attendance-live")
    .on("postgres_changes", { event: "*", schema: "public", table: "student_attendance" }, async () => {
      if (canEdit && !attendanceManagementPage.hidden) await loadAttendance();
    })
    .subscribe();
}

async function loadStudents() {
  if (!canEdit) {
    students = [];
    return true;
  }
  const { data, error } = await supabaseClient
    .from("students")
    .select("id, username, is_admin, lesson_count, current_lesson_count, required_lesson_count, color, pet, pet_name, pet_experience, pet_coins, pet_checkin_date, pet_checkin_streak, sort_order, created_at")
    .eq("is_admin", false)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) {
    showStatus("无法读取访客账号，请稍后重试");
    return false;
  }
  students = data.map((student) => normalizePetFields({
    ...student,
    lesson_count: Number(student.lesson_count) || 0,
    current_lesson_count: Number(student.current_lesson_count) || 0,
    required_lesson_count: Number(student.required_lesson_count) || 0,
    color: student.color || "",
    sort_order: Number(student.sort_order) || 0,
  }));
  renderStudentList();
  renderPetStudentList();
  renderAdminHubCounts();
  renderSchedule();
  return true;
}

async function loadAttendance() {
  if (!canEdit) return false;
  const { data, error } = await supabaseClient.rpc("get_today_attendance");
  if (error) {
    attendanceRecords = [];
    renderAttendance();
    showStatus("今日打卡记录读取失败，请稍后重试");
    return false;
  }
  attendanceRecords = (data || []).map((record) => ({
    ...record,
    current_lesson_count: Number(record.current_lesson_count) || 0,
    status: record.status || "",
    course_names: record.course_names || "",
  }));
  renderAttendance();
  return true;
}

function renderAttendance() {
  const list = document.querySelector("#attendanceList");
  if (!list) return;
  const today = getScheduleToday();
  document.querySelector("#attendanceDateLabel").textContent = `${today.getMonth() + 1} 月 ${today.getDate()} 日`;
  const presentCount = attendanceRecords.filter((record) => record.status === "present").length;
  document.querySelector("#attendanceSummary").textContent = `${attendanceRecords.length} 名学生 · 已到课 ${presentCount} 人`;
  list.replaceChildren();
  attendanceRecords.forEach((record) => {
    const row = createElement("article", "attendance-row");
    const identity = createElement("div", "attendance-identity");
    const color = createElement("i", "student-color-indicator");
    const student = students.find((item) => item.id === record.student_id);
    color.style.setProperty("--student-color", student?.color || defaultCourseColor);
    identity.append(color, createElement("strong", "", record.username || student?.username || "学生"));
    identity.append(createElement("small", "", record.course_names || "今日课程"));
    const progress = createElement("span", "attendance-current-count", `当前已上 ${record.current_lesson_count} 次`);
    const controls = createElement("div", "attendance-status-controls");
    [
      ["present", "到课", "check"],
      ["leave", "请假", "calendar-off"],
    ].forEach(([status, label, icon]) => {
      const button = createElement("button", `secondary-button attendance-status-button${record.status === status ? " is-selected" : ""}`);
      button.type = "button";
      button.disabled = attendanceBusy;
      button.innerHTML = `<i data-lucide="${icon}"></i><span>${label}</span>`;
      button.addEventListener("click", () => setAttendanceStatus(record.student_id, status));
      controls.append(button);
    });
    row.append(identity, progress, controls);
    list.append(row);
  });
  document.querySelector("#attendanceEmpty").hidden = attendanceRecords.length > 0;
  document.querySelector("#markAllPresent").disabled = attendanceBusy || attendanceRecords.length === 0;
  document.querySelector("#adminAttendanceCount").textContent = `${attendanceRecords.length} 人待打卡`;
  if (window.lucide) window.lucide.createIcons();
}

async function setAttendanceStatus(studentId, status) {
  if (!canEdit || attendanceBusy) return;
  attendanceBusy = true;
  renderAttendance();
  const { error } = await supabaseClient.rpc("set_today_attendance", {
    p_student_id: studentId,
    p_status: status,
  });
  attendanceBusy = false;
  if (error) {
    showStatus("打卡保存失败，请确认学生今天有分配课程");
    renderAttendance();
    return;
  }
  await Promise.all([loadStudents(), loadAttendance()]);
  showStatus(status === "present" ? "已登记到课，当前已上次数 +1" : "已登记请假，当前已上次数不变");
}

async function markAllStudentsPresent() {
  if (!canEdit || attendanceBusy || attendanceRecords.length === 0) return;
  attendanceBusy = true;
  renderAttendance();
  const { data, error } = await supabaseClient.rpc("mark_all_today_attendance_present");
  attendanceBusy = false;
  if (error) {
    showStatus("一键到课失败，请稍后重试");
    renderAttendance();
    return;
  }
  await Promise.all([loadStudents(), loadAttendance()]);
  showStatus(`已登记今日 ${Number(data) || attendanceRecords.length} 名学生到课`);
}

async function loadPetFoods() {
  const { data, error } = await supabaseClient
    .from("pet_foods")
    .select("id, pet_type, name, experience, coin_cost, sort_order")
    .order("pet_type", { ascending: true })
    .order("sort_order", { ascending: true });
  if (error) {
    petFoods = [];
    return false;
  }
  petFoods = data.map((food) => ({
    ...food,
    experience: Number(food.experience) || 0,
    coin_cost: Number(food.coin_cost) || 0,
  }));
  return true;
}

async function loadPetBattleHistory() {
  if (!canEdit) {
    petBattleHistory = [];
    return true;
  }
  const pageSize = 1000;
  const allBattles = [];
  for (let offset = 0; ; offset += pageSize) {
    const { data, error } = await supabaseClient
      .from("pet_battles")
      .select("id, challenger_id, opponent_id, challenger_level, opponent_level, battle_method, challenger_move, opponent_move, winner_id, challenger_reward, opponent_reward, challenger_pet, opponent_pet, challenger_pet_name, opponent_pet_name, created_at")
      .order("created_at", { ascending: false })
      .range(offset, offset + pageSize - 1);
    if (error) {
      petBattleHistory = [];
      renderPetStudentList();
      return false;
    }
    allBattles.push(...(data || []));
    if (!data || data.length < pageSize) break;
  }
  petBattleHistory = allBattles.map((battle) => ({
    ...battle,
    challenger_level: Number(battle.challenger_level) || 1,
    opponent_level: Number(battle.opponent_level) || 1,
    challenger_reward: Number(battle.challenger_reward) || 0,
    opponent_reward: Number(battle.opponent_reward) || 0,
  }));
  renderPetStudentList();
  if (!petBattleHistoryPage.hidden && selectedBattleHistoryStudentId) renderFullPetBattleHistory();
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
  const orderedStudents = studentSortMode === "surname"
    ? [...students].sort((first, second) => first.username.localeCompare(second.username, "zh-CN-u-co-pinyin", { sensitivity: "base" }))
    : students;
  orderedStudents.forEach((student) => {
    const row = createElement("div", `student-row${studentSortMode === "manual" ? " is-draggable" : ""}`);
    row.dataset.studentId = student.id;
    row.draggable = studentSortMode === "manual";
    let selectedColor = student.color || "";

    const identity = createElement("div", "student-identity");
    const dragHandle = createElement("span", "student-drag-handle");
    dragHandle.innerHTML = '<i data-lucide="grip-vertical"></i>';
    dragHandle.title = "拖动调整顺序";
    dragHandle.setAttribute("aria-hidden", "true");
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
    identity.append(dragHandle, colorPicker, studentName);

    const currentField = createStudentCountField(`${student.username}当前已上`, student.current_lesson_count);
    const requiredField = createStudentCountField(`${student.username}当前应上`, student.required_lesson_count);
    const remaining = createElement("output", "student-remaining-count");
    const updateRemaining = () => {
      const current = Number(currentField.input.value) || 0;
      const required = Number(requiredField.input.value) || 0;
      remaining.textContent = `${Math.max(required - current, 0)} 次`;
    };
    currentField.input.addEventListener("input", updateRemaining);
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
      lifetimeCount: student.lesson_count,
      color: selectedColor,
    }, saveButton));
    [currentField.input, requiredField.input].forEach((input) => {
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
    row.append(identity, currentField.label, requiredField.label, remaining, actions);
    if (studentSortMode === "manual") bindStudentRowDrag(row, student.id);
    list.append(row);
  });
  document.querySelector("#studentCount").textContent = `${students.length} 人`;
  document.querySelector("#studentListEmpty").hidden = students.length > 0;
  if (window.lucide) window.lucide.createIcons();
}

function bindStudentRowDrag(row, studentId) {
  row.addEventListener("dragstart", (event) => {
    draggedStudentId = studentId;
    row.classList.add("is-dragging");
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", studentId);
  });
  row.addEventListener("dragover", (event) => {
    if (!draggedStudentId || draggedStudentId === studentId) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    document.querySelectorAll(".student-row.is-drop-target").forEach((item) => item.classList.remove("is-drop-target"));
    row.classList.add("is-drop-target");
  });
  row.addEventListener("dragleave", () => row.classList.remove("is-drop-target"));
  row.addEventListener("drop", async (event) => {
    event.preventDefault();
    row.classList.remove("is-drop-target");
    if (!draggedStudentId || draggedStudentId === studentId) return;
    const sourceIndex = students.findIndex((item) => item.id === draggedStudentId);
    const targetIndex = students.findIndex((item) => item.id === studentId);
    if (sourceIndex < 0 || targetIndex < 0) return;
    const nextOrder = [...students];
    const [moved] = nextOrder.splice(sourceIndex, 1);
    nextOrder.splice(targetIndex, 0, moved);
    students = nextOrder;
    renderStudentList();
    await saveStudentOrder();
  });
  row.addEventListener("dragend", () => {
    draggedStudentId = null;
    document.querySelectorAll(".student-row.is-dragging, .student-row.is-drop-target").forEach((item) => {
      item.classList.remove("is-dragging", "is-drop-target");
    });
  });
}

async function saveStudentOrder() {
  const { error } = await supabaseClient.rpc("reorder_students", {
    p_student_ids: students.map((student) => student.id),
  });
  if (error) {
    showStatus("学生顺序保存失败，请稍后重试");
    await loadStudents();
    return;
  }
  students.forEach((student, index) => { student.sort_order = index + 1; });
  renderPetStudentList();
  renderStudentChecklist(readSelectedStudentIds());
  showStatus("学生顺序已保存");
}

function setStudentSortMode(value) {
  studentSortMode = value === "surname" ? "surname" : "manual";
  document.querySelector("#studentDragHint").hidden = studentSortMode !== "manual";
  renderStudentList();
}

function setPetSortMode(value) {
  petSortMode = ["level", "surname"].includes(value) ? value : "manual";
  document.querySelector("#petDragHint").hidden = petSortMode !== "manual";
  renderPetStudentList();
}

function getOrderedPetOwners() {
  const adminOwner = currentUser ? [currentUser] : [];
  let orderedStudents = students;
  if (petSortMode === "surname") {
    orderedStudents = [...students].sort((first, second) => first.username.localeCompare(second.username, "zh-CN-u-co-pinyin", { sensitivity: "base" }));
  } else if (petSortMode === "level") {
    orderedStudents = [...students].sort((first, second) => {
      const levelDifference = getPetLevel(second.pet_experience).level - getPetLevel(first.pet_experience).level;
      if (levelDifference) return levelDifference;
      const experienceDifference = second.pet_experience - first.pet_experience;
      if (experienceDifference) return experienceDifference;
      return first.username.localeCompare(second.username, "zh-CN-u-co-pinyin", { sensitivity: "base" });
    });
  }
  return [...adminOwner, ...orderedStudents];
}

function createPetVisual(pet, className = "", owner = null) {
  const visual = createElement("div", `pet-visual${className ? ` ${className}` : ""}`);
  const image = createElement("img", "pet-image");
  const copy = createElement("div", "pet-visual-copy");
  image.src = pet.image;
  image.alt = `${pet.name}全身画像`;
  image.loading = "lazy";
  copy.append(
    createElement("strong", "", getPetDisplayName(owner, pet)),
    createElement("small", "", `${pet.name} · ${pet.mood}`),
  );
  visual.append(image, copy);
  return visual;
}

function createPetResourceField(labelText, value, suffix) {
  const label = createElement("label", "pet-resource-field");
  const caption = createElement("span", "", labelText);
  const inputWrap = createElement("div", "pet-resource-input");
  const input = createElement("input");
  input.type = "number";
  input.min = "0";
  input.step = "1";
  input.value = String(value);
  input.setAttribute("aria-label", labelText);
  inputWrap.append(input, createElement("small", "", suffix));
  label.append(caption, inputWrap);
  return { label, input };
}

function getStudentPetBattles(studentId) {
  return petBattleHistory.filter((battle) => battle.challenger_id === studentId || battle.opponent_id === studentId);
}

function renderAdminPetBattleRecord(battle, student) {
  const isChallenger = battle.challenger_id === student.id;
  const opponentId = isChallenger ? battle.opponent_id : battle.challenger_id;
  const opponent = getOwnerById(opponentId);
  const won = battle.winner_id === student.id;
  const myLevel = isChallenger ? battle.challenger_level : battle.opponent_level;
  const opponentLevel = isChallenger ? battle.opponent_level : battle.challenger_level;
  const reward = isChallenger ? battle.challenger_reward : battle.opponent_reward;
  const myMove = isChallenger ? battle.challenger_move : battle.opponent_move;
  const opponentMove = isChallenger ? battle.opponent_move : battle.challenger_move;
  const opponentPetId = isChallenger ? battle.opponent_pet : battle.challenger_pet;
  const opponentPet = petCatalog.find((pet) => pet.id === opponentPetId);
  const opponentPetName = isChallenger ? battle.opponent_pet_name : battle.challenger_pet_name;
  const record = createElement("article", `admin-pet-battle-record ${won ? "is-win" : "is-loss"}`);
  const result = createElement("span", "admin-pet-battle-result", won ? "胜" : "负");
  const copy = createElement("div", "admin-pet-battle-copy");
  const timestamp = new Intl.DateTimeFormat("zh-CN", {
    timeZone: scheduleTimeZone,
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(battle.created_at));
  const method = battle.battle_method === "level"
    ? `等级对比 Lv.${myLevel} : Lv.${opponentLevel}`
    : `${getBattleMoveLabel(myMove)} 对 ${getBattleMoveLabel(opponentMove)}`;
  copy.append(
    createElement("strong", "", `对战 ${opponent?.username || "已删除账号"} · ${opponentPetName || opponentPet?.name || "宠物"}`),
    createElement("small", "", `${method} · +${reward} 经验 · ${timestamp}`),
  );
  record.append(result, copy);
  return record;
}

function createAdminPetDetails(student, assignedPet) {
  const details = createElement("div", "admin-pet-details");
  const levelInfo = getPetLevel(student.pet_experience);
  const battles = getStudentPetBattles(student.id);
  const wins = battles.filter((battle) => battle.winner_id === student.id).length;
  const metrics = createElement("dl", "admin-pet-detail-metrics");
  const values = [
    ["宠物种类", assignedPet?.name || "暂未分配"],
    ["宠物名字", assignedPet ? getPetDisplayName(student, assignedPet) : "-"],
    ["当前等级", `Lv.${levelInfo.level}`],
    ["当前等级经验", levelInfo.progress.toLocaleString("zh-CN")],
    ["金币余额", student.pet_coins.toLocaleString("zh-CN")],
    ["连续签到", `${student.pet_checkin_streak} 天`],
    ["最近签到", formatPetCheckinDate(student.pet_checkin_date)],
    ["对战记录", `${battles.length} 场 · ${wins} 胜 · ${battles.length - wins} 负`],
  ];
  values.forEach(([label, value]) => {
    const item = createElement("div");
    item.append(createElement("dt", "", label), createElement("dd", "", value));
    metrics.append(item);
  });

  const battleSection = createElement("section", "admin-pet-battle-history");
  const battleHeading = createElement("div", "admin-pet-battle-heading");
  battleHeading.append(createElement("h4", "", "最近 5 场"));
  if (battles.length > 5) {
    const moreButton = createElement("button", "secondary-button pet-battle-more-button");
    moreButton.type = "button";
    moreButton.innerHTML = `<span>查看全部 ${battles.length} 场</span><i data-lucide="arrow-right"></i>`;
    moreButton.addEventListener("click", () => showFullPetBattleHistory(student.id));
    battleHeading.append(moreButton);
  }
  battleSection.append(battleHeading);
  if (battles.length) battles.slice(0, 5).forEach((battle) => battleSection.append(renderAdminPetBattleRecord(battle, student)));
  else battleSection.append(createElement("p", "empty-list-hint", "暂无对战记录"));
  details.append(metrics, battleSection);
  details.hidden = true;
  return details;
}

function renderPetStudentList() {
  const list = document.querySelector("#petStudentList");
  list.replaceChildren();
  const owners = getOrderedPetOwners();
  owners.forEach((student) => {
    const isAdminOwner = student.is_admin === true;
    const isDraggable = !isAdminOwner && petSortMode === "manual";
    const row = createElement("section", `pet-student-row${isAdminOwner ? " is-admin-pet" : ""}${isDraggable ? " is-draggable" : ""}`);
    row.dataset.studentId = student.id;
    row.draggable = isDraggable;
    const header = createElement("div", "pet-student-header");
    const identity = createElement("div", "pet-student-identity");
    const color = createElement("i", "student-color-indicator");
    const current = createElement("div", "pet-current");
    const actions = createElement("div", "pet-assignment-actions");
    const chooser = createElement("div", "pet-choice-grid");
    const assignedPet = petCatalog.find((pet) => pet.id === student.pet);
    color.style.setProperty("--student-color", student.color || defaultCourseColor);
    color.setAttribute("aria-hidden", "true");
    if (isDraggable) {
      const dragHandle = createElement("span", "student-drag-handle");
      dragHandle.innerHTML = '<i data-lucide="grip-vertical"></i>';
      dragHandle.title = "拖动调整顺序";
      dragHandle.setAttribute("aria-hidden", "true");
      identity.append(dragHandle);
    }
    identity.append(color, createElement("strong", "", student.username));
    if (isAdminOwner) identity.append(createElement("small", "pet-admin-label", "曾老师"));

    if (assignedPet) current.append(createPetVisual(assignedPet, "is-current", student));
    else {
      const empty = createElement("div", "pet-empty-preview");
      empty.innerHTML = '<i data-lucide="paw-print"></i><span>暂未分配</span>';
      current.append(empty);
    }

    if (isAdminOwner) {
      const exclusive = createElement("span", "pet-exclusive-label");
      exclusive.innerHTML = '<i data-lucide="shield-check"></i><span>曾老师专属</span>';
      actions.append(exclusive);
    } else {
      const chooseButton = createElement("button", "secondary-button pet-choose-button");
      chooseButton.type = "button";
      chooseButton.innerHTML = '<i data-lucide="paw-print"></i><span>选择宠物</span>';
      chooseButton.setAttribute("aria-expanded", "false");
      chooseButton.addEventListener("click", () => {
        const willOpen = chooser.hidden;
        chooser.hidden = !willOpen;
        chooseButton.setAttribute("aria-expanded", String(willOpen));
        if (willOpen) chooser.querySelector("button")?.focus();
      });
      actions.append(chooseButton);
    }
    const details = createAdminPetDetails(student, assignedPet);
    const detailButton = createElement("button", "secondary-button pet-detail-toggle");
    const battleCount = getStudentPetBattles(student.id).length;
    detailButton.type = "button";
    detailButton.disabled = !assignedPet;
    detailButton.setAttribute("aria-expanded", "false");
    detailButton.innerHTML = `<i data-lucide="${battleCount ? "swords" : "clipboard-list"}"></i><span>${battleCount ? `${battleCount} 场对战` : "宠物详情"}</span>`;
    detailButton.addEventListener("click", () => {
      const willOpen = details.hidden;
      details.hidden = !willOpen;
      detailButton.setAttribute("aria-expanded", String(willOpen));
      detailButton.querySelector("span").textContent = willOpen ? "收起详情" : (battleCount ? `${battleCount} 场对战` : "宠物详情");
    });
    actions.append(detailButton);
    header.append(identity, current, actions);

    if (!isAdminOwner) {
      const noneButton = createElement("button", `pet-choice${student.pet ? "" : " is-selected"}`);
      noneButton.type = "button";
      noneButton.innerHTML = '<span class="pet-none-icon"><i data-lucide="circle-slash-2"></i></span><strong>暂不分配</strong><small>无宠物</small>';
      noneButton.addEventListener("click", () => saveStudentPet(student.id, "", chooser));
      chooser.append(noneButton);

      petCatalog.filter((pet) => !pet.adminOnly).forEach((pet) => {
        const option = createElement("button", `pet-choice${student.pet === pet.id ? " is-selected" : ""}`);
        option.type = "button";
        option.setAttribute("aria-label", `分配${pet.name}给${student.username}`);
        option.append(createPetVisual(pet, "is-choice"));
        option.addEventListener("click", () => saveStudentPet(student.id, pet.id, chooser));
        chooser.append(option);
      });
    }
    chooser.hidden = true;

    const levelInfo = getPetLevel(student.pet_experience);
    const resourceEditor = createElement("div", "pet-resource-editor");
    const levelPreview = createElement("div", "pet-resource-level");
    levelPreview.innerHTML = `<small>当前等级与本级经验</small><strong>Lv.${levelInfo.level}</strong><span>${levelInfo.progress.toLocaleString("zh-CN")} 经验</span>`;
    const experienceField = createPetResourceField(`为${student.username}增加经验`, 0, "经验");
    experienceField.input.placeholder = "输入本次增加值";
    const coinsField = createPetResourceField(`${student.username}的金币余额`, student.pet_coins, "金币");
    const saveButton = createElement("button", "primary-button pet-resource-save");
    saveButton.type = "button";
    saveButton.innerHTML = '<i data-lucide="badge-plus"></i><span>分配经验与金币</span>';
    saveButton.disabled = !assignedPet;
    experienceField.input.disabled = !assignedPet;
    coinsField.input.disabled = !assignedPet;
    saveButton.addEventListener("click", () => saveStudentPetResources(
      student.id,
      experienceField.input,
      coinsField.input,
      saveButton,
    ));
    resourceEditor.append(levelPreview, experienceField.label, coinsField.label, saveButton);

    row.append(header, resourceEditor, details);
    if (!isAdminOwner) row.append(chooser);
    if (isDraggable) bindPetRowDrag(row, student.id);
    list.append(row);
  });
  document.querySelector("#petStudentCount").textContent = `${owners.length} 人（含曾老师）`;
  document.querySelector("#petStudentListEmpty").hidden = students.length > 0;
  if (window.lucide) window.lucide.createIcons();
}

function bindPetRowDrag(row, studentId) {
  row.addEventListener("dragstart", (event) => {
    draggedStudentId = studentId;
    row.classList.add("is-dragging");
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", studentId);
  });
  row.addEventListener("dragover", (event) => {
    if (!draggedStudentId || draggedStudentId === studentId) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    document.querySelectorAll(".pet-student-row.is-drop-target").forEach((item) => item.classList.remove("is-drop-target"));
    row.classList.add("is-drop-target");
  });
  row.addEventListener("dragleave", () => row.classList.remove("is-drop-target"));
  row.addEventListener("drop", async (event) => {
    event.preventDefault();
    row.classList.remove("is-drop-target");
    if (!draggedStudentId || draggedStudentId === studentId) return;
    const sourceIndex = students.findIndex((item) => item.id === draggedStudentId);
    const targetIndex = students.findIndex((item) => item.id === studentId);
    if (sourceIndex < 0 || targetIndex < 0) return;
    const nextOrder = [...students];
    const [moved] = nextOrder.splice(sourceIndex, 1);
    nextOrder.splice(targetIndex, 0, moved);
    students = nextOrder;
    renderPetStudentList();
    await saveStudentOrder();
  });
  row.addEventListener("dragend", () => {
    draggedStudentId = null;
    document.querySelectorAll(".pet-student-row.is-dragging, .pet-student-row.is-drop-target").forEach((item) => {
      item.classList.remove("is-dragging", "is-drop-target");
    });
  });
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
  if (student) {
    student.pet = petId;
  }
  renderPetStudentList();
  renderAdminHubCounts();
  const pet = petCatalog.find((item) => item.id === petId);
  showStatus(pet ? `已把${pet.name}分配给${student?.username || "该学生"}，原有名字与成长数据已继承` : `已取消${student?.username || "该学生"}的宠物，成长数据已保留`);
}

async function saveStudentPetResources(studentId, experienceInput, coinsInput, button) {
  if (!canEdit) return;
  const experienceGain = Number(experienceInput.value);
  const coins = Number(coinsInput.value);
  if (![experienceGain, coins].every((value) => Number.isSafeInteger(value) && value >= 0)) {
    showStatus("增加经验与金币余额需为不小于 0 的整数");
    return;
  }

  button.disabled = true;
  const { data, error } = await supabaseClient.rpc("add_student_pet_resources", {
    p_student_id: studentId,
    p_experience_gain: experienceGain,
    p_coins: coins,
  });
  button.disabled = false;
  if (error) {
    showStatus("宠物资源保存失败，请稍后重试");
    await loadStudents();
    return;
  }

  const saved = Array.isArray(data) ? data[0] : data;
  const updatedExperience = Number(saved?.experience);
  const updatedCoins = Number(saved?.coins);
  if (!Number.isSafeInteger(updatedExperience) || !Number.isSafeInteger(updatedCoins)) {
    showStatus("宠物资源已保存，正在刷新数据");
    await loadStudents();
    return;
  }

  if (currentUser?.id === studentId) {
    currentUser.pet_experience = updatedExperience;
    currentUser.pet_coins = updatedCoins;
  } else {
    const student = students.find((item) => item.id === studentId);
    if (student) {
      student.pet_experience = updatedExperience;
      student.pet_coins = updatedCoins;
    }
  }
  const levelInfo = getPetLevel(updatedExperience);
  renderPetStudentList();
  updateVisitorPet();
  if (!petDetailPage.hidden) renderPetDetail();
  showStatus(`已增加 ${experienceGain} 经验，当前 Lv.${levelInfo.level} · ${levelInfo.progress.toLocaleString("zh-CN")} 经验`);
}

async function saveStudentLearningProfile(studentId, fields, button) {
  if (!canEdit) return;
  const currentCount = Number(fields.currentInput.value);
  const requiredCount = Number(fields.requiredInput.value);
  const lifetimeCount = Number(fields.lifetimeCount) || 0;
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
  renderSchedule();
  showStatus(`已保存${student?.username || "该学生"}的颜色与课程进度`);
}

async function handleStudentSubmit(event) {
  event.preventDefault();
  if (!canEdit) return;
  const username = document.querySelector("#studentUsernameInput").value.trim();
  const password = document.querySelector("#studentPasswordInput").value;
  if (!username || !password) {
    showStatus("无法生成姓名首字母密码，请检查学生姓名");
    return;
  }

  addStudentButton.disabled = true;
  const { error } = await supabaseClient.rpc("create_student_account", { p_username: username, p_password: password });
  addStudentButton.disabled = false;
  if (error) {
    const duplicate = error.code === "23505" || error.message.toLowerCase().includes("already exists");
    showStatus(duplicate ? "该用户名已存在，请换一个名字" : "新增账号失败，请稍后重试");
    return;
  }
  studentForm.reset();
  await loadStudents();
  showStatus(`已新增访客“${username}”，登录密码为 ${password}`);
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
    document.body.classList.remove("is-admin-view");
    clearCopyMode();
    if (realtimeChannel) await supabaseClient.removeChannel(realtimeChannel);
    if (realtimeAssignmentChannel) await supabaseClient.removeChannel(realtimeAssignmentChannel);
    if (realtimeStudentChannel) await supabaseClient.removeChannel(realtimeStudentChannel);
    if (realtimeBattleChannel) await supabaseClient.removeChannel(realtimeBattleChannel);
    if (realtimeAttendanceChannel) await supabaseClient.removeChannel(realtimeAttendanceChannel);
    realtimeChannel = null;
    realtimeAssignmentChannel = null;
    realtimeStudentChannel = null;
    realtimeBattleChannel = null;
    realtimeAttendanceChannel = null;
    attendanceRecords = [];
    petBattleHistory = [];
    petLeaderboard = [];
    adminPetComparison = null;
    questionBank = [];
    importedQuestions = [];
    renderSchedule();
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  const { data: profile, error } = await supabaseClient
    .from("students")
    .select("id, username, is_admin, lesson_count, current_lesson_count, required_lesson_count, color, pet, pet_name, pet_experience, pet_coins, pet_checkin_date, pet_checkin_streak")
    .eq("id", session.user.id)
    .single();

  if (error || !profile) {
    loginError.textContent = "该账号已失效，请联系曾老师";
    await supabaseClient.auth.signOut();
    return;
  }

  currentUser = normalizePetFields({
    ...profile,
    lesson_count: Number(profile.lesson_count) || 0,
    current_lesson_count: Number(profile.current_lesson_count) || 0,
    required_lesson_count: Number(profile.required_lesson_count) || 0,
    color: profile.color || "",
  });
  canEdit = profile.is_admin === true;
  if (canEdit) await loadStudents();
  else await loadAdminPetComparison();
  await loadPetFoods();
  appShell.hidden = false;
  loginScreen.hidden = true;
  loginError.textContent = "";
  updatePermissionUI();
  await loadSchedule();
  document.querySelector("#openStudentChallenge").hidden = canEdit || !currentUser.pet;
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
  let loginEmail = null;
  let lookupError = null;
  if (username === "曾老师") loginEmail = "703223232@qq.com";
  else {
    const lookup = await supabaseClient.rpc("resolve_login_email", { p_username: username });
    loginEmail = lookup.data;
    lookupError = lookup.error;
  }
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
    const isRepeating = course.repeatIntervalDays !== null;
    const deleteText = document.querySelector("#deleteDialogText");
    const deleteName = createElement("strong", "", course.name);
    deleteName.id = "deleteCourseName";
    deleteText.replaceChildren(
      document.createTextNode(isRepeating ? "请选择如何删除“" : "确认删除“"),
      deleteName,
      document.createTextNode(isRepeating ? "”" : "”吗？"),
    );
    document.querySelector("#deleteSeriesOptions").hidden = !isRepeating;
    document.querySelector("#deleteSingleActions").hidden = isRepeating;
    document.querySelector("#cancelSeriesDelete").hidden = !isRepeating;
    document.querySelector("#deleteOccurrenceDate").textContent = formatFullDate(parseISODate(selectedOccurrenceDate || course.startDate));
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
  document.querySelector("#cancelSeriesDelete").addEventListener("click", () => deleteDialog.close());
  confirmDeleteButton.addEventListener("click", () => deleteSelectedCourse("all"));
  document.querySelector("#deleteOccurrenceOnly").addEventListener("click", () => deleteSelectedCourse("single"));
  document.querySelector("#deleteOccurrenceFuture").addEventListener("click", () => deleteSelectedCourse("future"));
  document.querySelector("#cancelCopyMode").addEventListener("click", clearCopyMode);

  authButton.addEventListener("click", async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) showStatus("退出失败，请稍后重试");
  });

  document.querySelector("#studentManagerButton").addEventListener("click", showAdminHub);
  document.querySelector("#closeAdminHub").addEventListener("click", showScheduleView);
  document.querySelector("#openStudentManagement").addEventListener("click", showStudentManagement);
  document.querySelector("#openAttendanceManagement").addEventListener("click", showAttendanceManagement);
  document.querySelector("#openPetManagement").addEventListener("click", showPetManagement);
  document.querySelector("#openPetRankingManagement").addEventListener("click", () => showPetLeaderboard("admin"));
  document.querySelector("#openChallengeRecords").addEventListener("click", showChallengeRecords);
  document.querySelector("#openQuestionBank").addEventListener("click", showQuestionBank);
  document.querySelector("#openStudentChallenge").addEventListener("click", showStudentChallenge);
  document.querySelector("#closeStudentManagement").addEventListener("click", showAdminHub);
  document.querySelector("#closeAttendanceManagement").addEventListener("click", showAdminHub);
  document.querySelector("#closePetManagement").addEventListener("click", showAdminHub);
  document.querySelector("#closePetBattleHistory").addEventListener("click", showPetManagement);
  document.querySelector("#openPetLeaderboard").addEventListener("click", () => showPetLeaderboard(canEdit ? "admin" : "schedule"));
  document.querySelector("#closePetLeaderboard").addEventListener("click", () => {
    if (petLeaderboardReturnView === "admin") showAdminHub();
    else showScheduleView();
  });
  document.querySelector("#closeStudentChallenge").addEventListener("click", showScheduleView);
  document.querySelector("#closeChallengeRecords").addEventListener("click", showAdminHub);
  document.querySelector("#refreshChallengeRecords").addEventListener("click", loadAdminChallengeRecords);
  document.querySelector("#closeQuestionBank").addEventListener("click", showAdminHub);
  document.querySelector("#refreshQuestionBank").addEventListener("click", () => loadQuestionBank());
  document.querySelector("#questionBankFile").addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    document.querySelector("#importQuestionPreview").disabled = !file;
    document.querySelector("#questionImportStatus").textContent = file ? `${file.name} · 准备识别` : "等待选择 Word、PDF 或图片文件";
  });
  document.querySelector("#importQuestionPreview").addEventListener("click", previewQuestionDocument);
  document.querySelector("#saveImportedQuestions").addEventListener("click", saveImportedQuestions);
  document.querySelector("#showChoiceChallenge").addEventListener("click", () => setChallengeType("choice"));
  document.querySelector("#showWordChallenge").addEventListener("click", () => setChallengeType("word"));
  document.querySelector("#nextChallengeQuestion").addEventListener("click", loadNextChallengeQuestion);
  document.querySelector("#wordChallengeForm").addEventListener("submit", (event) => {
    event.preventDefault();
    submitChallengeAnswer(document.querySelector("#wordChallengeAnswer").value);
  });
  visitorPet.addEventListener("click", showPetDetail);
  document.querySelector("#closePetDetail").addEventListener("click", () => {
    if (petDetailReturnView === "admin") showAdminHub();
    else showScheduleView();
  });
  document.querySelector("#petNameForm").addEventListener("submit", saveCurrentPetName);
  document.querySelector("#petCheckinButton").addEventListener("click", checkInCurrentPet);
  document.querySelector("#matchPetBattle").addEventListener("click", matchCurrentPetBattle);
  document.querySelector("#studentSortMode").addEventListener("change", (event) => {
    setStudentSortMode(event.target.value);
    window.localStorage.setItem("student-sort-mode", studentSortMode);
  });
  document.querySelector("#petSortMode").addEventListener("change", (event) => {
    setPetSortMode(event.target.value);
    window.localStorage.setItem("pet-sort-mode", petSortMode);
  });
  document.querySelector("#markAllPresent").addEventListener("click", markAllStudentsPresent);
  document.querySelector("#studentUsernameInput").addEventListener("input", updateStudentPasswordPreview);
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
  studentSortMode = window.localStorage.getItem("student-sort-mode") === "surname" ? "surname" : "manual";
  petSortMode = ["level", "surname"].includes(window.localStorage.getItem("pet-sort-mode"))
    ? window.localStorage.getItem("pet-sort-mode")
    : "manual";
  document.querySelector("#studentSortMode").value = studentSortMode;
  document.querySelector("#studentDragHint").hidden = studentSortMode !== "manual";
  document.querySelector("#petSortMode").value = petSortMode;
  document.querySelector("#petDragHint").hidden = petSortMode !== "manual";
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
