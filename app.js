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
const timelineStart = 6 * 60;
const timelineEnd = 24 * 60;
const snapMinutes = 10;
const slotCount = (timelineEnd - timelineStart) / snapMinutes;
const repeatPresets = new Set([1, 7]);
const studentSortModes = new Set(["manual", "surname", "remaining-asc", "remaining-desc", "class"]);
const scheduleTimeZone = "Asia/Shanghai";
const officialHolidaySchedules = {
  2025: {
    source: "国务院办公厅关于2025年部分节假日安排的通知",
    sourceUrl: "https://www.gov.cn/zhengce/content/202411/content_6986382.htm",
    holidays: [
      { name: "元旦", start: "2025-01-01", end: "2025-01-01" },
      { name: "春节", start: "2025-01-28", end: "2025-02-04" },
      { name: "清明节", start: "2025-04-04", end: "2025-04-06" },
      { name: "劳动节", start: "2025-05-01", end: "2025-05-05" },
      { name: "端午节", start: "2025-05-31", end: "2025-06-02" },
      { name: "国庆节、中秋节", start: "2025-10-01", end: "2025-10-08" },
    ],
    workdays: ["2025-01-26", "2025-02-08", "2025-04-27", "2025-09-28", "2025-10-11"],
  },
  2026: {
    source: "国务院办公厅关于2026年部分节假日安排的通知",
    sourceUrl: "https://www.gov.cn/zhengce/content/202511/content_7047090.htm",
    holidays: [
      { name: "元旦", start: "2026-01-01", end: "2026-01-03" },
      { name: "春节", start: "2026-02-15", end: "2026-02-23" },
      { name: "清明节", start: "2026-04-04", end: "2026-04-06" },
      { name: "劳动节", start: "2026-05-01", end: "2026-05-05" },
      { name: "端午节", start: "2026-06-19", end: "2026-06-21" },
      { name: "中秋节", start: "2026-09-25", end: "2026-09-27" },
      { name: "国庆节", start: "2026-10-01", end: "2026-10-07" },
    ],
    workdays: ["2026-01-04", "2026-02-14", "2026-02-28", "2026-05-09", "2026-09-20", "2026-10-10"],
  },
};
const scheduleViews = new Set(["week", "month", "year"]);
const pageFontSizeMinimum = 80;
const pageFontSizeMaximum = 130;
const pageFontSizeStep = 5;
const defaultPageFontSize = 100;
const pageFontSizeStorageKey = "page-font-size";

let scheduleToday = getScheduleToday();
let currentWeekStart = startOfWeek(scheduleToday);
let selectedWeekStart = new Date(currentWeekStart);
let selectedCalendarDate = new Date(scheduleToday);
let scheduleView = "week";
let weekOverviewYear = getISOWeekYear(selectedWeekStart);
let yearPickerStart = selectedCalendarDate.getFullYear() - 5;
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
let realtimeCoinShopChannel = null;
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
let questionBanks = [];
let availableChallengeBanks = [];
let importedQuestions = [];
let questionImportFileName = "";
let challengeState = {
  type: "choice",
  bankId: "",
  bankName: "",
  sessionId: null,
  attemptId: null,
  sessionAnswered: 0,
  sessionRemaining: 10,
  dailyAttempts: 0,
  dailyRemaining: 50,
  choiceStreak: 0,
  answered: false,
};
let studentSortMode = "manual";
let petSortMode = "manual";
let pageFontSize = defaultPageFontSize;
let draggedStudentId = null;
let attendanceRecords = [];
let attendanceHistory = [];
let selectedAttendanceDate = "";
let attendanceBusy = false;
let courseConflictResolver = null;
let coinShopProducts = [];
let selectedCoinShopProductId = null;
let selectedCoinShopPurchaseId = null;
let coinShopPreviewUrl = null;
let autoFocusedScheduleDate = "";
let yearViewAutoScrollPending = false;

const grid = document.querySelector("#scheduleGrid");
const scheduleScroll = document.querySelector("#scheduleScroll");
const weekLabel = document.querySelector("#weekLabel");
const weekRange = document.querySelector("#weekRange");
const weekOverviewDialog = document.querySelector("#weekOverviewDialog");
const weekThumbnailGrid = document.querySelector("#weekThumbnailGrid");
const periodOverviewEyebrow = document.querySelector("#periodOverviewEyebrow");
const periodOverviewTitle = document.querySelector("#weekOverviewTitle");
const periodOverviewYear = document.querySelector("#weekOverviewYear");
const periodYearJumpForm = document.querySelector("#periodYearJumpForm");
const periodYearInput = document.querySelector("#periodYearInput");
const periodYearJumpText = document.querySelector("#periodYearJumpText");
const periodYearJumpHint = document.querySelector("#periodYearJumpHint");
const scheduleViewSwitcher = document.querySelector("#scheduleViewSwitcher");
const pageFontSizeInput = document.querySelector("#pageFontSizeInput");
const pageFontSizeValue = document.querySelector("#pageFontSizeValue");
const resetPageFontSize = document.querySelector("#resetPageFontSize");
const calendarOverview = document.querySelector("#calendarOverview");
const occurrencePeriodLabel = document.querySelector("#occurrencePeriodLabel");
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
const customWeekdayField = document.querySelector("#customWeekdayField");
const repeatStopInput = document.querySelector("#courseRepeatStopInput");
const repeatStopField = document.querySelector("#repeatStopField");
const repeatCountInput = document.querySelector("#courseRepeatCountInput");
const repeatCountField = document.querySelector("#repeatCountField");
const repeatEndDateInput = document.querySelector("#courseRepeatEndDateInput");
const repeatEndDateField = document.querySelector("#repeatEndDateField");
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
const courseConflictDialog = document.querySelector("#courseConflictDialog");
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
const coinShopPage = document.querySelector("#coinShopPage");
const studentChallengePage = document.querySelector("#studentChallengePage");
const challengeRecordsPage = document.querySelector("#challengeRecordsPage");
const questionBankPage = document.querySelector("#questionBankPage");
const questionReviewPage = document.querySelector("#questionReviewPage");
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
    detectSessionInUrl: false,
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

function sameMonth(first, second) {
  return first.getFullYear() === second.getFullYear() && first.getMonth() === second.getMonth();
}

function sameYear(first, second) {
  return first.getFullYear() === second.getFullYear();
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

function getOfficialDayInfo(date) {
  const isoDate = toISODate(date);
  const scheduleForYear = officialHolidaySchedules[date.getFullYear()];
  if (!scheduleForYear) return null;
  if (scheduleForYear.workdays.includes(isoDate)) {
    return { type: "workday", name: "调休上班", label: "班" };
  }
  const holiday = scheduleForYear.holidays.find((item) => isoDate >= item.start && isoDate <= item.end);
  return holiday ? { type: "holiday", name: holiday.name, label: "休" } : null;
}

function getMonthCalendarStart(date) {
  return startOfWeek(new Date(date.getFullYear(), date.getMonth(), 1));
}

function getMonthCalendarEnd(date) {
  return addDays(getMonthCalendarStart(date), 41);
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

  const wasShowingCurrentPeriod = scheduleView === "week"
    ? sameDay(selectedWeekStart, currentWeekStart)
    : scheduleView === "month"
      ? sameMonth(selectedCalendarDate, scheduleToday)
      : sameYear(selectedCalendarDate, scheduleToday);
  scheduleToday = nextToday;
  currentWeekStart = startOfWeek(scheduleToday);
  if (wasShowingCurrentPeriod) {
    selectedCalendarDate = new Date(scheduleToday);
    selectedWeekStart = new Date(currentWeekStart);
  }
  updateAcademicPeriod();
  dailyPetBattleCount = 0;
  renderSchedule();
  if (!canEdit && !petDetailPage.hidden) loadDailyPetBattleCount().then(renderPetDetail);
  if (weekOverviewDialog.open) renderSchedulePeriodOverview();
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
  const normalizedMinutes = ((minutes % (24 * 60)) + (24 * 60)) % (24 * 60);
  const hour = Math.floor(normalizedMinutes / 60);
  const minute = normalizedMinutes % 60;
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

function getRepeatDescription(interval, count = null, endDate = null, repeatWeekdays = []) {
  if (interval === null) return "不重复";
  let description;
  if (repeatWeekdays.length) description = `每${repeatWeekdays.map((weekday) => days[weekday - 1]).join("、")}重复`;
  else if (interval === 1) description = "每天重复";
  else if (interval === 7) description = "每周重复";
  else description = `每 ${interval} 天重复`;
  if (endDate) return `${description} · 至 ${formatFullDate(parseISODate(endDate))}`;
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
  periodOverviewEyebrow.textContent = "全年周次";
  periodOverviewTitle.textContent = `${weekOverviewYear} 年周次总览`;
  periodOverviewYear.textContent = `${weekOverviewYear} 年`;
  periodYearInput.value = String(weekOverviewYear);
  periodYearJumpText.textContent = "定位年份";
  periodYearJumpHint.textContent = "输入年份后选择对应周次";
  weekThumbnailGrid.className = "week-thumbnail-grid is-week-picker";
  weekThumbnailGrid.setAttribute("aria-label", `${weekOverviewYear}年全年周次列表`);
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
      selectedCalendarDate = new Date(start);
      renderSchedule();
      weekOverviewDialog.close();
    });
    weekThumbnailGrid.append(button);
  }
}

function renderMonthOverview() {
  periodOverviewEyebrow.textContent = "全年月份";
  periodOverviewTitle.textContent = `${weekOverviewYear} 年月份总览`;
  periodOverviewYear.textContent = `${weekOverviewYear} 年`;
  periodYearInput.value = String(weekOverviewYear);
  periodYearJumpText.textContent = "定位年份";
  periodYearJumpHint.textContent = "输入年份后选择要查看的月份";
  weekThumbnailGrid.className = "week-thumbnail-grid period-thumbnail-grid is-month-picker";
  weekThumbnailGrid.setAttribute("aria-label", `${weekOverviewYear}年月份列表`);
  weekThumbnailGrid.replaceChildren();

  for (let month = 0; month < 12; month += 1) {
    const monthDate = new Date(weekOverviewYear, month, 1);
    const monthEnd = new Date(weekOverviewYear, month + 1, 0);
    const courseCount = getOccurrencesBetween(monthDate, monthEnd).length;
    const button = createElement("button", "week-thumbnail period-thumbnail");
    button.type = "button";
    button.classList.toggle("is-current", sameMonth(monthDate, scheduleToday));
    button.classList.toggle("is-selected", sameMonth(monthDate, selectedCalendarDate));
    button.setAttribute("aria-label", `选择${weekOverviewYear}年${month + 1}月${courseCount ? `，共${courseCount}节课` : ""}`);
    button.append(
      createElement("strong", "", `${month + 1} 月`),
      createElement("small", "", courseCount ? `${courseCount} 节课` : "暂无课程"),
      createElement("span", "period-thumbnail-line"),
    );
    button.addEventListener("click", () => {
      selectedCalendarDate = new Date(monthDate);
      selectedWeekStart = startOfWeek(selectedCalendarDate);
      renderSchedule();
      weekOverviewDialog.close();
    });
    weekThumbnailGrid.append(button);
  }
}

function renderYearOverview() {
  const rangeEnd = yearPickerStart + 11;
  periodOverviewEyebrow.textContent = "年份选择";
  periodOverviewTitle.textContent = "选择要查看的年份";
  periodOverviewYear.textContent = `${yearPickerStart} - ${rangeEnd}`;
  periodYearInput.value = String(selectedCalendarDate.getFullYear());
  periodYearJumpText.textContent = "直接跳转";
  periodYearJumpHint.textContent = "可直接输入年份，或从下方年份中选择";
  weekThumbnailGrid.className = "week-thumbnail-grid period-thumbnail-grid is-year-picker";
  weekThumbnailGrid.setAttribute("aria-label", `${yearPickerStart}年至${rangeEnd}年列表`);
  weekThumbnailGrid.replaceChildren();

  for (let offset = 0; offset < 12; offset += 1) {
    const year = yearPickerStart + offset;
    const yearStart = new Date(year, 0, 1);
    const yearEnd = new Date(year, 11, 31);
    const courseCount = getOccurrencesBetween(yearStart, yearEnd).length;
    const isCurrentYear = year === scheduleToday.getFullYear();
    const button = createElement("button", "week-thumbnail period-thumbnail year-thumbnail");
    button.type = "button";
    button.classList.toggle("is-current", isCurrentYear);
    button.classList.toggle("is-selected", year === selectedCalendarDate.getFullYear());
    button.setAttribute("aria-label", `选择${year}年${courseCount ? `，共${courseCount}节课` : "，暂无课程"}`);
    button.append(
      createElement("strong", "", `${year} 年`),
      createElement("small", "", courseCount
        ? `${isCurrentYear ? "今年 · " : ""}${courseCount} 节课`
        : (isCurrentYear ? "今年 · 暂无课程" : "暂无课程")),
      createElement("span", "period-thumbnail-line"),
    );
    button.addEventListener("click", () => {
      selectedCalendarDate = new Date(year, 0, 1);
      selectedWeekStart = startOfWeek(selectedCalendarDate);
      renderSchedule();
      weekOverviewDialog.close();
    });
    weekThumbnailGrid.append(button);
  }
}

function renderSchedulePeriodOverview() {
  if (scheduleView === "month") {
    renderMonthOverview();
    return;
  }
  if (scheduleView === "year") {
    renderYearOverview();
    return;
  }
  renderWeekOverview();
}

function openSchedulePeriodOverview() {
  if (scheduleView === "week") {
    weekOverviewYear = getISOWeekYear(selectedWeekStart);
  } else if (scheduleView === "month") {
    weekOverviewYear = selectedCalendarDate.getFullYear();
  } else {
    yearPickerStart = selectedCalendarDate.getFullYear() - 5;
  }
  renderSchedulePeriodOverview();
  weekOverviewDialog.showModal();
  window.requestAnimationFrame(() => {
    weekThumbnailGrid.querySelector(".week-thumbnail.is-selected")?.scrollIntoView({ block: "center" });
  });
}

function setScheduleView(nextView) {
  if (!scheduleViews.has(nextView) || nextView === scheduleView) return;
  if (nextView === "year") yearViewAutoScrollPending = true;
  scheduleView = nextView;
  if (scheduleView === "week") selectedWeekStart = startOfWeek(selectedCalendarDate);
  renderSchedule();
}

function shiftSelectedSchedulePeriod(amount) {
  if (scheduleView === "week") {
    selectedWeekStart = addDays(selectedWeekStart, amount * 7);
    selectedCalendarDate = new Date(selectedWeekStart);
  } else if (scheduleView === "month") {
    selectedCalendarDate = new Date(selectedCalendarDate.getFullYear(), selectedCalendarDate.getMonth() + amount, 1);
    selectedWeekStart = startOfWeek(selectedCalendarDate);
  } else {
    selectedCalendarDate = new Date(selectedCalendarDate.getFullYear() + amount, selectedCalendarDate.getMonth(), 1);
    selectedWeekStart = startOfWeek(selectedCalendarDate);
  }
  renderSchedule();
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

function normalizePageFontSize(value) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return defaultPageFontSize;
  const clampedValue = clamp(numericValue, pageFontSizeMinimum, pageFontSizeMaximum);
  return Math.round(clampedValue / pageFontSizeStep) * pageFontSizeStep;
}

function setPageFontSize(value, { persist = true } = {}) {
  pageFontSize = normalizePageFontSize(value);
  document.documentElement.style.setProperty("--page-font-scale", String(pageFontSize / 100));
  document.documentElement.dataset.pageFontSize = String(pageFontSize);
  pageFontSizeInput.value = String(pageFontSize);
  pageFontSizeInput.setAttribute("aria-valuetext", `${pageFontSize}%`);
  pageFontSizeValue.value = `${pageFontSize}%`;
  resetPageFontSize.hidden = pageFontSize === defaultPageFontSize;

  if (!persist) return;
  if (pageFontSize === defaultPageFontSize) {
    window.localStorage.removeItem(pageFontSizeStorageKey);
  } else {
    window.localStorage.setItem(pageFontSizeStorageKey, String(pageFontSize));
  }
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

function lcm(first, second) {
  return Math.abs(first * second) / gcd(first, second);
}

function getISOWeekday(date) {
  return date.getDay() || 7;
}

function normalizeRepeatWeekdays(values = []) {
  return [...new Set(values.map(Number).filter((value) => Number.isInteger(value) && value >= 1 && value <= 7))]
    .sort((first, second) => first - second);
}

function countWeekdayOccurrences(startDate, endDate, repeatWeekdays) {
  const weekdays = normalizeRepeatWeekdays(repeatWeekdays);
  const difference = daysBetween(startDate, endDate);
  if (difference < 0 || weekdays.length === 0) return 0;
  const totalDays = difference + 1;
  const fullWeeks = Math.floor(totalDays / 7);
  const remainder = totalDays % 7;
  const startWeekday = getISOWeekday(startDate);
  return fullWeeks * weekdays.length
    + weekdays.filter((weekday) => ((weekday - startWeekday + 7) % 7) < remainder).length;
}

function getCourseOccurrenceDate(course, index) {
  if (!Number.isInteger(index) || index < 0) return null;
  const startDate = parseISODate(course.startDate);
  if (course.repeatIntervalDays === null) return index === 0 ? startDate : null;
  const weekdays = normalizeRepeatWeekdays(course.repeatWeekdays);
  if (!weekdays.length) return addDays(startDate, index * course.repeatIntervalDays);
  const startWeekday = getISOWeekday(startDate);
  const offsets = weekdays
    .map((weekday) => (weekday - startWeekday + 7) % 7)
    .sort((first, second) => first - second);
  return addDays(startDate, Math.floor(index / offsets.length) * 7 + offsets[index % offsets.length]);
}

function occurrenceIndexForDate(course, date) {
  const difference = daysBetween(parseISODate(course.startDate), date);
  if (difference < 0) return -1;
  if (course.repeatIntervalDays === null) return difference === 0 ? 0 : -1;
  const weekdays = normalizeRepeatWeekdays(course.repeatWeekdays);
  let index;
  if (weekdays.length) {
    if (!weekdays.includes(getISOWeekday(date))) return -1;
    index = countWeekdayOccurrences(parseISODate(course.startDate), date, weekdays) - 1;
  } else {
    if (difference % course.repeatIntervalDays !== 0) return -1;
    index = difference / course.repeatIntervalDays;
  }
  return course.repeatCount === null || index < course.repeatCount ? index : -1;
}

function seriesShareADate(first, second) {
  if (first.repeatIntervalDays === null) {
    return occurrenceIndexForDate(second, parseISODate(first.startDate)) >= 0;
  }
  if (second.repeatIntervalDays === null) {
    return occurrenceIndexForDate(first, parseISODate(second.startDate)) >= 0;
  }
  if (first.repeatCount !== null || second.repeatCount !== null) {
    const finite = first.repeatCount !== null
      && (second.repeatCount === null || first.repeatCount <= second.repeatCount) ? first : second;
    const other = finite === first ? second : first;
    for (let index = 0; index < finite.repeatCount; index += 1) {
      const date = getCourseOccurrenceDate(finite, index);
      if (date && occurrenceIndexForDate(other, date) >= 0) return true;
    }
    return false;
  }

  const firstWeekdays = normalizeRepeatWeekdays(first.repeatWeekdays);
  const secondWeekdays = normalizeRepeatWeekdays(second.repeatWeekdays);
  if (!firstWeekdays.length && !secondWeekdays.length) {
    const difference = daysBetween(parseISODate(second.startDate), parseISODate(first.startDate));
    return difference % gcd(first.repeatIntervalDays, second.repeatIntervalDays) === 0;
  }

  const firstPeriod = firstWeekdays.length ? 7 : first.repeatIntervalDays;
  const secondPeriod = secondWeekdays.length ? 7 : second.repeatIntervalDays;
  const scanStart = parseISODate(first.startDate > second.startDate ? first.startDate : second.startDate);
  const scanDays = lcm(firstPeriod, secondPeriod);
  for (let offset = 0; offset < scanDays; offset += 1) {
    const date = addDays(scanStart, offset);
    if (occurrenceIndexForDate(first, date) >= 0 && occurrenceIndexForDate(second, date) >= 0) return true;
  }
  return false;
}

function getSeriesConflicts(candidate, ignoredId) {
  return schedule.filter((course) => course.id !== ignoredId
    && candidate.studentIds.some((studentId) => course.studentIds.includes(studentId))
    && candidate.startTime < getCourseEnd(course)
    && getCourseEnd(candidate) > course.startTime
    && seriesShareADate(candidate, course));
}

function shiftRepeatEndDate(course, nextStartDate) {
  if (!course.repeatEndDate) return null;
  const dayShift = daysBetween(parseISODate(course.startDate), parseISODate(nextStartDate));
  return toISODate(addDays(parseISODate(course.repeatEndDate), dayShift));
}

function shiftRepeatWeekdays(repeatWeekdays, dayShift) {
  return normalizeRepeatWeekdays(repeatWeekdays).map((weekday) => ((weekday - 1 + dayShift) % 7 + 7) % 7 + 1).sort((a, b) => a - b);
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

function getOccurrencesBetween(startDate, endDate) {
  const occurrences = [];
  const totalDays = daysBetween(startDate, endDate);
  for (let dayIndex = 0; dayIndex <= totalDays; dayIndex += 1) {
    const date = addDays(startDate, dayIndex);
    schedule.forEach((course) => {
      if (courseOccursOnDate(course, date)) occurrences.push({ course, date, dayIndex });
    });
  }
  return occurrences.sort((first, second) => first.date - second.date || first.course.startTime - second.course.startTime);
}

function getOccurrencesForDate(date) {
  return schedule
    .filter((course) => courseOccursOnDate(course, date))
    .sort((first, second) => first.startTime - second.startTime);
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
    repeatEndDate: repeatIntervalDays === null ? null : (row.repeat_end_date || null),
    repeatWeekdays: repeatIntervalDays === null ? [] : normalizeRepeatWeekdays(row.repeat_weekdays || []),
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

function settleCourseConflict(confirmed) {
  if (!courseConflictResolver) return;
  const resolve = courseConflictResolver;
  courseConflictResolver = null;
  if (courseConflictDialog.open) courseConflictDialog.close();
  resolve(confirmed);
}

function requestCourseConflictConfirmation(candidate, conflicts) {
  const courseNames = [...new Set(conflicts.map((course) => course.name))];
  const affectedStudents = students
    .filter((student) => candidate.studentIds.includes(student.id)
      && conflicts.some((course) => course.studentIds.includes(student.id)))
    .map((student) => student.username);
  const conflictLabel = courseNames.slice(0, 3).join("、") || "现有课程";
  const extraCount = Math.max(courseNames.length - 3, 0);
  const studentLabel = affectedStudents.join("、") || "所选学生";
  document.querySelector("#courseConflictText").textContent = `“${candidate.name}”会与“${conflictLabel}${extraCount ? `”等 ${courseNames.length} 门课程` : "”"}在部分日期和时间重叠，涉及${studentLabel}。确认仍然保存吗？`;
  if (!courseConflictDialog.open) courseConflictDialog.showModal();
  document.querySelector("#cancelCourseConflict").focus();
  return new Promise((resolve) => { courseConflictResolver = resolve; });
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

function getCoinShopImageUrl(imagePath) {
  if (!imagePath) return "";
  const { data } = supabaseClient.storage.from("coin-shop-products").getPublicUrl(imagePath);
  return data?.publicUrl || "";
}

function normalizeCoinShopProduct(product) {
  return {
    ...product,
    coin_cost: Number(product.coin_cost) || 0,
    image_url: getCoinShopImageUrl(product.image_path),
  };
}

function openCoinShopDeleteDialog(product) {
  if (!canEdit || !product) return;
  selectedCoinShopProductId = product.id;
  document.querySelector("#coinShopDeleteProductName").textContent = product.name;
  document.querySelector("#coinShopDeleteDialog").showModal();
}

function openCoinShopPurchaseDialog(product) {
  if (canEdit || !currentUser || !product) return;
  selectedCoinShopPurchaseId = product.id;
  document.querySelector("#coinShopPurchaseProductName").textContent = product.name;
  document.querySelector("#coinShopPurchaseProductCost").textContent = product.coin_cost.toLocaleString("zh-CN");
  document.querySelector("#coinShopPurchaseDialog").showModal();
}

function renderCoinShopProducts() {
  const gridElement = document.querySelector("#coinShopProductGrid");
  gridElement.replaceChildren();
  coinShopProducts.forEach((product) => {
    const card = createElement("article", "coin-shop-product-card");
    const imageWrap = createElement("div", "coin-shop-product-image");
    const image = createElement("img");
    image.src = product.image_url;
    image.alt = product.name;
    image.loading = "lazy";
    image.decoding = "async";
    imageWrap.append(image);

    const copy = createElement("div", "coin-shop-product-copy");
    const price = createElement("span", "coin-shop-product-price");
    price.innerHTML = `<i data-lucide="coins"></i><strong>${product.coin_cost.toLocaleString("zh-CN")}</strong><small>金币</small>`;
    copy.append(createElement("strong", "", product.name), price);

    card.append(imageWrap, copy);
    if (canEdit) {
      const deleteButton = createElement("button", "icon-button coin-shop-delete-button");
      deleteButton.type = "button";
      deleteButton.title = `删除${product.name}`;
      deleteButton.setAttribute("aria-label", `删除${product.name}`);
      deleteButton.innerHTML = '<i data-lucide="trash-2"></i>';
      deleteButton.addEventListener("click", () => openCoinShopDeleteDialog(product));
      card.append(deleteButton);
    } else {
      const purchaseButton = createElement("button", "primary-button coin-shop-purchase-button");
      purchaseButton.type = "button";
      purchaseButton.disabled = !currentUser || currentUser.pet_coins < product.coin_cost;
      purchaseButton.innerHTML = purchaseButton.disabled
        ? '<i data-lucide="lock-keyhole"></i><span>金币不足</span>'
        : '<i data-lucide="shopping-cart"></i><span>立即购买</span>';
      purchaseButton.addEventListener("click", () => openCoinShopPurchaseDialog(product));
      card.append(purchaseButton);
    }
    gridElement.append(card);
  });
  document.querySelector("#coinShopProductEmpty").hidden = coinShopProducts.length > 0;
  document.querySelector("#coinShopProductCount").textContent = `${coinShopProducts.length} 件`;
  document.querySelector("#adminCoinShopCount").textContent = `${coinShopProducts.length} 件商品`;
  document.querySelector("#coinShopStudentBalance").textContent = `${Number(currentUser?.pet_coins || 0).toLocaleString("zh-CN")} 金币`;
  if (window.lucide) window.lucide.createIcons();
}

async function loadCoinShopProducts({ quiet = false } = {}) {
  if (!currentUser) return false;
  const { data, error } = await supabaseClient
    .from("coin_shop_products")
    .select("id, name, image_path, coin_cost, created_at")
    .order("created_at", { ascending: false });
  if (error) {
    coinShopProducts = [];
    renderCoinShopProducts();
    if (!quiet) showStatus("金币商城读取失败，请稍后重试");
    return false;
  }
  coinShopProducts = (data || []).map(normalizeCoinShopProduct);
  renderCoinShopProducts();
  return true;
}

function clearCoinShopImagePreview() {
  if (coinShopPreviewUrl) URL.revokeObjectURL(coinShopPreviewUrl);
  coinShopPreviewUrl = null;
  const preview = document.querySelector("#coinShopImagePreview");
  preview.hidden = true;
  preview.removeAttribute("src");
  document.querySelector("#coinShopImagePlaceholder").hidden = false;
  document.querySelector("#coinShopUploadStatus").textContent = "等待选择商品图片";
}

function resetCoinShopForm() {
  document.querySelector("#coinShopForm").reset();
  clearCoinShopImagePreview();
}

function validateCoinShopImage(file) {
  const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
  if (!file || !allowedTypes.has(file.type)) return "请选择 PNG、JPG、WebP 或 GIF 图片";
  if (file.size > 5 * 1024 * 1024) return "商品图片不能超过 5MB";
  return "";
}

function updateCoinShopImagePreview(file) {
  const input = document.querySelector("#coinShopImageInput");
  const validationError = validateCoinShopImage(file);
  if (validationError) {
    input.value = "";
    clearCoinShopImagePreview();
    showStatus(validationError);
    return;
  }
  if (coinShopPreviewUrl) URL.revokeObjectURL(coinShopPreviewUrl);
  coinShopPreviewUrl = URL.createObjectURL(file);
  const preview = document.querySelector("#coinShopImagePreview");
  preview.src = coinShopPreviewUrl;
  preview.hidden = false;
  document.querySelector("#coinShopImagePlaceholder").hidden = true;
  document.querySelector("#coinShopUploadStatus").textContent = `${file.name} · ${(file.size / 1024).toFixed(0)} KB`;
}

async function addCoinShopProduct(event) {
  event.preventDefault();
  if (!canEdit) return;
  const name = document.querySelector("#coinShopNameInput").value.trim();
  const coinCost = Number(document.querySelector("#coinShopCostInput").value);
  const file = document.querySelector("#coinShopImageInput").files?.[0];
  const validationError = validateCoinShopImage(file);
  if (!name || name.length > 40) {
    showStatus("商品名称需为 1 - 40 个字符");
    return;
  }
  if (!Number.isSafeInteger(coinCost) || coinCost < 1 || coinCost > 999999) {
    showStatus("商品金币需为 1 - 999999 的整数");
    return;
  }
  if (validationError) {
    showStatus(validationError);
    return;
  }

  const button = document.querySelector("#addCoinShopProduct");
  const buttonLabel = button.querySelector("span");
  const extensionByType = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  };
  const imagePath = `products/${crypto.randomUUID()}.${extensionByType[file.type]}`;
  button.disabled = true;
  buttonLabel.textContent = "正在上传";
  const { error: uploadError } = await supabaseClient.storage
    .from("coin-shop-products")
    .upload(imagePath, file, { cacheControl: "3600", contentType: file.type, upsert: false });
  if (uploadError) {
    button.disabled = false;
    buttonLabel.textContent = "添加商品";
    showStatus("商品图片上传失败，请稍后重试");
    return;
  }

  const { error: insertError } = await supabaseClient
    .from("coin_shop_products")
    .insert({ name, image_path: imagePath, coin_cost: coinCost });
  if (insertError) {
    await supabaseClient.storage.from("coin-shop-products").remove([imagePath]);
    button.disabled = false;
    buttonLabel.textContent = "添加商品";
    showStatus("商品保存失败，请稍后重试");
    return;
  }

  button.disabled = false;
  buttonLabel.textContent = "添加商品";
  resetCoinShopForm();
  await loadCoinShopProducts({ quiet: true });
  showStatus(`商品“${name}”已加入金币商城`);
}

async function deleteSelectedCoinShopProduct() {
  if (!canEdit || !selectedCoinShopProductId) return;
  const product = coinShopProducts.find((item) => item.id === selectedCoinShopProductId);
  if (!product) return;
  const button = document.querySelector("#confirmCoinShopDelete");
  button.disabled = true;
  const { data, error } = await supabaseClient
    .from("coin_shop_products")
    .delete()
    .eq("id", product.id)
    .select("id")
    .maybeSingle();
  button.disabled = false;
  if (error || !data) {
    showStatus("删除商品失败，请稍后重试");
    return;
  }
  const { error: imageDeleteError } = await supabaseClient.storage.from("coin-shop-products").remove([product.image_path]);
  document.querySelector("#coinShopDeleteDialog").close();
  selectedCoinShopProductId = null;
  await loadCoinShopProducts({ quiet: true });
  showStatus(imageDeleteError ? `商品“${product.name}”已删除，图片清理失败` : `商品“${product.name}”已删除`);
}

async function purchaseSelectedCoinShopProduct() {
  if (canEdit || !currentUser || !selectedCoinShopPurchaseId) return;
  const product = coinShopProducts.find((item) => item.id === selectedCoinShopPurchaseId);
  if (!product) return;
  const button = document.querySelector("#confirmCoinShopPurchase");
  button.disabled = true;
  const { data, error } = await supabaseClient.rpc("purchase_coin_shop_product", {
    p_product_id: product.id,
  });
  button.disabled = false;
  if (error) {
    const isInsufficient = error.message?.includes("insufficient coins");
    showStatus(isInsufficient ? "金币不足，暂时无法购买该商品" : "购买失败，请稍后重试");
    return;
  }
  const result = Array.isArray(data) ? data[0] : data;
  currentUser.pet_coins = Number(result?.remaining_coins) || 0;
  document.querySelector("#coinShopPurchaseDialog").close();
  selectedCoinShopPurchaseId = null;
  updateVisitorPet();
  renderCoinShopProducts();
  showStatus(`已购买“${result?.product_name || product.name}”，剩余 ${currentUser.pet_coins} 金币`);
}

function normalizeQuestionText(value) {
  return String(value || "").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
}

function normalizeQuestionExplanation(value) {
  return normalizeQuestionText(value).replace(/^(?:答案)?解析\s*[:：]?\s*/i, "").slice(0, 2000);
}

function stripQuestionNumber(value) {
  return normalizeQuestionText(value).replace(/^(?:第\s*)?\d+\s*[.、)）]\s*/, "");
}

function stripChoiceLabel(value) {
  return normalizeQuestionText(value).replace(/^[（(]?\s*[A-Da-d]\s*[）).、:：]\s*/, "");
}

function resolveChoiceAnswer(value, options) {
  const { answer } = splitAnswerAndExplanation(value);
  const cleaned = normalizeQuestionText(answer)
    .replace(/^(?:参考)?(?:正确)?答案\s*[:：]?\s*/i, "")
    .replace(/^[（(]\s*([A-Da-d])\s*[）)]$/, "$1")
    .replace(/[。；;，,\s]+$/g, "");
  if (/^[A-Da-d]$/.test(cleaned)) return options[cleaned.toUpperCase().charCodeAt(0) - 65] || "";
  return options.find((option) => option.toLocaleLowerCase("zh-CN") === cleaned.toLocaleLowerCase("zh-CN")) || "";
}

function splitAnswerAndExplanation(value) {
  const text = normalizeQuestionText(value);
  const marker = text.match(/(?:[【[]\s*(?:答案)?解析\s*[】\]]\s*[:：]?|(?:答案解析|解析|解答|理由|说明)\s*[:：])\s*/i);
  if (!marker || marker.index === undefined) return { answer: text, explanation: "" };
  return {
    answer: normalizeQuestionText(text.slice(0, marker.index)).replace(/[（(【[]+$/g, ""),
    explanation: normalizeQuestionExplanation(text.slice(marker.index + marker[0].length)).replace(/[）)】\]]+$/g, ""),
  };
}

function setChoiceAnswerKeyEntry(answerKey, number, answer, explanation = "") {
  const key = String(Number(number));
  if (!key || key === "NaN" || !/^[A-Da-d]$/.test(normalizeQuestionText(answer))) return;
  const previous = answerKey.get(key) || {};
  answerKey.set(key, {
    answer: normalizeQuestionText(answer).toUpperCase(),
    explanation: normalizeQuestionExplanation(explanation || previous.explanation),
  });
}

function extractChoiceAnswerKey(rawText) {
  const lines = String(rawText || "").replace(/\r/g, "\n").split(/\n+/).map(normalizeQuestionText).filter(Boolean);
  const answerKey = new Map();
  let answerSectionIndex = -1;
  let inAnswerSection = false;
  let lastNumber = "";

  lines.forEach((line, lineIndex) => {
    const pureHeading = /^(?:(?:参考|正确)?答案(?:及解析)?|答案解析|answer\s*key|answers?)\s*[:：]?$/i.test(line);
    const numberedHeading = /^(?:(?:参考|正确)?答案(?:及解析)?|答案解析|answer\s*key|answers?)\s*[:：]\s*(?=(?:第\s*)?\d+)/i.test(line);
    if (pureHeading || numberedHeading) {
      inAnswerSection = true;
      if (answerSectionIndex < 0) answerSectionIndex = lineIndex;
    }

    if (!inAnswerSection) {
      const inline = line.match(/^(?:第\s*)?(\d+)\s*(?:题)?\s*[.．、)）:：-]?\s*(?:参考)?(?:正确)?答案\s*[:：]?\s*[（(]?([A-Da-d])[）)]?(.*)$/i);
      if (inline) {
        const details = splitAnswerAndExplanation(`${inline[2]} ${inline[3] || ""}`);
        setChoiceAnswerKeyEntry(answerKey, inline[1], details.answer, details.explanation);
      }
      return;
    }

    const content = line.replace(/^(?:(?:参考|正确)?答案(?:及解析)?|答案解析|answer\s*key|answers?)\s*[:：]?\s*/i, "");
    const matches = [...content.matchAll(/(?:^|\s|[，,;；])(?:第\s*)?(\d+)\s*(?:题)?\s*[.．、)）:：-]?\s*(?:答案\s*[:：]?\s*)?[（(]?([A-Da-d])[）)]?(?=\s|[，,;；。]|[【[]|(?:答案)?解析|$)/gi)];
    matches.forEach((match) => {
      lastNumber = match[1];
      setChoiceAnswerKeyEntry(answerKey, match[1], match[2]);
    });
    if (matches.length === 1) {
      const match = matches[0];
      const trailing = content.slice((match.index || 0) + match[0].length);
      const details = splitAnswerAndExplanation(`${match[2]} ${trailing}`);
      setChoiceAnswerKeyEntry(answerKey, match[1], details.answer, details.explanation);
    } else if (matches.length === 0 && lastNumber) {
      const explanationMatch = content.match(/^(?:[【[]\s*)?(?:答案)?解析(?:\s*[】\]])?\s*[:：]?\s*(.+)$/i);
      if (explanationMatch) {
        const previous = answerKey.get(String(Number(lastNumber))) || {};
        setChoiceAnswerKeyEntry(answerKey, lastNumber, previous.answer, explanationMatch[1]);
      }
    }
  });

  return {
    answerKey,
    questionText: answerSectionIndex >= 0 ? lines.slice(0, answerSectionIndex).join("\n") : String(rawText || ""),
  };
}

function isValidImportedQuestion(question, { requireAnswer = true } = {}) {
  if (!question || !["choice", "word"].includes(question.challenge_type)) return false;
  if (!question.prompt || question.prompt.length > 300) return false;
  if (requireAnswer && (!question.correct_answer || question.correct_answer.length > 120)) return false;
  if (question.correct_answer?.length > 120) return false;
  if ((question.explanation || "").length > 2000) return false;
  if (question.challenge_type === "word") return question.options === null && (!requireAnswer || Boolean(question.correct_answer));
  return Array.isArray(question.options)
    && question.options.length === 4
    && question.options.every((option) => option && option.length <= 120)
    && (!requireAnswer || question.options.some((option) => option.toLocaleLowerCase("zh-CN") === question.correct_answer.toLocaleLowerCase("zh-CN")));
}

function dedupeImportedQuestions(questions) {
  const unique = new Map();
  questions.forEach((question) => {
    if (!isValidImportedQuestion(question, { requireAnswer: false })) return;
    const key = JSON.stringify([
      question.challenge_type,
      question.prompt.toLocaleLowerCase("zh-CN"),
      question.options,
    ]);
    const existing = unique.get(key);
    if (!existing) unique.set(key, question);
    else {
      if (!existing.correct_answer && question.correct_answer) existing.correct_answer = question.correct_answer;
      if (!existing.explanation && question.explanation) existing.explanation = question.explanation;
      if (!existing.answer_source && question.answer_source) existing.answer_source = question.answer_source;
      if (!existing.review_warning && question.review_warning) existing.review_warning = question.review_warning;
    }
  });
  return [...unique.values()].slice(0, 500);
}

function prepareQuestionLines(rawText) {
  return String(rawText || "")
    .replace(/\r/g, "\n")
    .replace(/(?=[A-Da-d]\s*[.、)）:：]\s*)/g, "\n")
    .replace(/\s+(?=(?:参考)?(?:正确)?答案\s*[:：])/g, "\n")
    .split(/\n+/)
    .map(normalizeQuestionText)
    .filter(Boolean);
}

function parseChoiceTableRows(tableRows, answerKey = new Map()) {
  const questions = [];
  tableRows.forEach((rawCells, rowIndex) => {
    const cells = rawCells.map(normalizeQuestionText).filter(Boolean);
    const promptIndex = /^\d+$/.test(cells[0] || "") ? 1 : 0;
    if (cells.length < promptIndex + 6) return;
    const sourceNumber = promptIndex ? cells[0] : String(rowIndex + 1);
    const prompt = stripQuestionNumber(cells[promptIndex]);
    const options = cells.slice(promptIndex + 1, promptIndex + 5).map(stripChoiceLabel);
    const supplied = splitAnswerAndExplanation(cells.slice(promptIndex + 5).join(" "));
    const keyEntry = answerKey.get(String(Number(sourceNumber))) || {};
    const correctAnswer = resolveChoiceAnswer(supplied.answer || keyEntry.answer, options);
    const question = {
      challenge_type: "choice",
      prompt,
      options,
      correct_answer: correctAnswer,
      explanation: normalizeQuestionExplanation(supplied.explanation || keyEntry.explanation),
      answer_source: correctAnswer ? "文档自动匹配" : "",
    };
    if (isValidImportedQuestion(question, { requireAnswer: false })) questions.push(question);
  });
  return questions;
}

function parseChoiceQuestions(rawText, tableRows = []) {
  const { answerKey, questionText } = extractChoiceAnswerKey(rawText);
  const questions = parseChoiceTableRows(tableRows, answerKey);
  let current = null;
  let pendingPrompt = "";

  const finishCurrent = () => {
    if (!current) return;
    const options = ["A", "B", "C", "D"].map((letter) => normalizeQuestionText(current.options[letter]));
    const keyEntry = answerKey.get(String(Number(current.source_number))) || {};
    const supplied = splitAnswerAndExplanation(current.answer || keyEntry.answer);
    const correctAnswer = resolveChoiceAnswer(supplied.answer, options);
    const question = {
      challenge_type: "choice",
      prompt: normalizeQuestionText(current.prompt),
      options,
      correct_answer: correctAnswer,
      explanation: normalizeQuestionExplanation(current.explanation || supplied.explanation || keyEntry.explanation),
      answer_source: correctAnswer ? "文档自动匹配" : "",
    };
    if (isValidImportedQuestion(question, { requireAnswer: false })) {
      const blankCount = (question.prompt.match(/_{2,}/g) || []).length;
      const optionPartCounts = question.options.map((option) => option.split(/\s+/).filter(Boolean).length);
      question.review_warning = blankCount > 1 && optionPartCounts.some((count) => count < blankCount)
        ? `题干含 ${blankCount} 处空格，请核对选项是否完整`
        : "";
      questions.push(question);
    }
    current = null;
  };

  prepareQuestionLines(questionText).forEach((line) => {
    const numberedAnswerMatch = line.match(/^(?:第\s*)?(\d+)\s*(?:题)?\s*[.．、)）:：-]?\s*(?:参考)?(?:正确)?答案\s*[:：]?\s*[（(]?([A-Da-d])[）)]?(.*)$/i);
    if (numberedAnswerMatch) {
      if (current && String(Number(current.source_number)) === String(Number(numberedAnswerMatch[1]))) {
        const supplied = splitAnswerAndExplanation(`${numberedAnswerMatch[2]} ${numberedAnswerMatch[3] || ""}`);
        current.answer = supplied.answer;
        current.explanation = supplied.explanation || current.explanation;
      }
      return;
    }
    const answerMatch = line.match(/^(?:参考)?(?:正确)?答案\s*[:：]?\s*(.+)$/i);
    if (answerMatch) {
      if (current) {
        const supplied = splitAnswerAndExplanation(answerMatch[1]);
        current.answer = supplied.answer;
        current.explanation = supplied.explanation || current.explanation;
      }
      pendingPrompt = "";
      return;
    }

    const explanationMatch = line.match(/^(?:[【[]\s*)?(?:答案)?解析(?:\s*[】\]])?\s*[:：]?\s*(.+)$/i);
    if (explanationMatch && current) {
      current.explanation = normalizeQuestionExplanation(`${current.explanation || ""} ${explanationMatch[1]}`);
      return;
    }

    const optionMatch = line.match(/^[（(]?\s*([A-Da-d])\s*[）).、:：]\s*(.+)$/);
    if (optionMatch) {
      if (!current) current = { prompt: pendingPrompt, options: {} };
      current.options[optionMatch[1].toUpperCase()] = normalizeQuestionText(optionMatch[2]);
      return;
    }

    const questionMatch = line.match(/^(?:第\s*)?(\d+)\s*[.．、)）]\s*(.+)$/);
    if (questionMatch) {
      if (current) finishCurrent();
      current = { source_number: questionMatch[1], prompt: normalizeQuestionText(questionMatch[2]), options: {}, answer: "", explanation: "" };
      pendingPrompt = "";
      return;
    }

    if (current && current.options.D) {
      finishCurrent();
      current = { source_number: questions.length + 1, prompt: line, options: {}, answer: "", explanation: "" };
      pendingPrompt = "";
    } else if (current) {
      const lastOption = ["D", "C", "B", "A"].find((letter) => current.options[letter]);
      if (lastOption) current.options[lastOption] = normalizeQuestionText(`${current.options[lastOption]} ${line}`);
      else current.prompt = normalizeQuestionText(`${current.prompt} ${line}`);
    } else pendingPrompt = normalizeQuestionText(line.replace(/^(?:题目|问题)\s*[:：]\s*/, ""));
  });
  if (current) finishCurrent();
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
      const supplied = splitAnswerAndExplanation(directQuestion[2]);
      const question = {
        challenge_type: "word",
        prompt: normalizeQuestionText(directQuestion[1]),
        options: null,
        correct_answer: normalizeQuestionText(supplied.answer),
        explanation: supplied.explanation,
        answer_source: supplied.answer ? "文档自动匹配" : "",
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

function getBankName(bankId) {
  return questionBanks.find((bank) => bank.bank_id === bankId)?.bank_name || "未分类";
}

function createQuestionBankSelect(questionType, selectedValue = "", includeEmpty = true) {
  const select = document.createElement("select");
  select.className = "question-bank-select";
  if (includeEmpty) select.append(new Option("未分类", ""));
  questionBanks.forEach((bank) => {
    const typeCount = questionBank.filter((question) => question.bank_id === bank.bank_id && question.challenge_type === questionType && question.is_active).length;
    select.append(new Option(`${bank.bank_name} · ${typeCount} 道${questionType === "choice" ? "选择题" : "单词题"}`, bank.bank_id));
  });
  select.value = selectedValue || "";
  return select;
}

function updateImportedQuestionValidity() {
  importedQuestions.forEach((question) => {
    question.is_review_ready = isValidImportedQuestion(question)
      && Boolean(question.bank_id)
      && !question.review_warning;
  });
  const ready = importedQuestions.length > 0 && importedQuestions.every((question) => question.is_review_ready);
  document.querySelector("#saveImportedQuestions").disabled = !ready;
  document.querySelector("#questionReviewAlert").textContent = ready
    ? "所有题目已完成核对，可以确认导入。"
    : "请为每道题填写正确答案、选择子题库，并处理红色提示后再导入。";
}

function renderQuestionRow(question, { preview = false, index = 0 } = {}) {
  const row = createElement("article", `question-bank-row${preview && !question.is_review_ready ? " is-review-warning" : ""}`);
  const type = createElement("span", `question-type-badge${question.challenge_type === "word" ? " is-word" : ""}`, question.challenge_type === "choice" ? "选择题" : "单词题");
  const indexLabel = createElement("span", "question-preview-index", `#${index + 1}`);

  if (preview) {
    const editor = createElement("div", "question-review-editor");
    const prompt = document.createElement("textarea");
    prompt.className = "question-review-prompt";
    prompt.rows = 2;
    prompt.value = question.prompt || "";
    prompt.setAttribute("aria-label", `第${index + 1}题题干`);
    prompt.addEventListener("input", () => { question.prompt = normalizeQuestionText(prompt.value); updateImportedQuestionValidity(); });
    editor.append(prompt);
    if (question.challenge_type === "choice") {
      const options = createElement("div", "question-review-options");
      (question.options || ["", "", "", ""]).forEach((option, optionIndex) => {
        const input = document.createElement("input");
        input.type = "text";
        input.value = option;
        input.placeholder = `${String.fromCharCode(65 + optionIndex)} 选项`;
        input.addEventListener("input", () => { question.options[optionIndex] = normalizeQuestionText(input.value); updateImportedQuestionValidity(); });
        options.append(input);
      });
      editor.append(options);
    }
    const controls = createElement("div", "question-review-controls");
    const answerLabel = createElement("label", "form-field");
    answerLabel.append(createElement("span", "", question.challenge_type === "choice" ? "正确答案" : "标准答案"));
    if (question.challenge_type === "choice") {
      const select = document.createElement("select");
      select.append(new Option("请选择正确答案", ""));
      (question.options || []).forEach((option, optionIndex) => select.append(new Option(`${String.fromCharCode(65 + optionIndex)}. ${option || "（待填写）"}`, option)));
      select.value = question.correct_answer || "";
      select.addEventListener("change", () => {
        question.correct_answer = select.value;
        question.answer_source = question.correct_answer ? "人工确认" : "";
        answerStatus.className = question.correct_answer ? "question-answer-match" : "question-review-warning";
        answerStatus.textContent = question.correct_answer ? "答案已人工确认" : "文件未提供可匹配答案，请确认";
        updateImportedQuestionValidity();
      });
      answerLabel.append(select);
    } else {
      const input = document.createElement("input");
      input.type = "text"; input.maxLength = 120; input.value = question.correct_answer || "";
      input.addEventListener("input", () => {
        question.correct_answer = normalizeQuestionText(input.value);
        question.answer_source = question.correct_answer ? "人工确认" : "";
        answerStatus.className = question.correct_answer ? "question-answer-match" : "question-review-warning";
        answerStatus.textContent = question.correct_answer ? "答案已人工确认" : "文件未提供可匹配答案，请确认";
        updateImportedQuestionValidity();
      });
      answerLabel.append(input);
    }
    const bankLabel = createElement("label", "form-field");
    bankLabel.append(createElement("span", "", "所属子题库"));
    const bankSelect = createQuestionBankSelect(question.challenge_type, question.bank_id, false);
    bankSelect.addEventListener("change", () => { question.bank_id = bankSelect.value; updateImportedQuestionValidity(); });
    bankLabel.append(bankSelect);
    controls.append(answerLabel, bankLabel);
    editor.append(controls);
    const explanationLabel = createElement("label", "form-field question-explanation-field");
    explanationLabel.append(createElement("span", "", "答案解析（可选，学生提交后显示）"));
    const explanation = document.createElement("textarea");
    explanation.rows = 2;
    explanation.maxLength = 2000;
    explanation.placeholder = "若文档附带解析会自动填入，也可以在此修改";
    explanation.value = question.explanation || "";
    explanation.addEventListener("input", () => { question.explanation = normalizeQuestionExplanation(explanation.value); updateImportedQuestionValidity(); });
    explanationLabel.append(explanation);
    editor.append(explanationLabel);
    const answerStatus = createElement(
      "small",
      question.correct_answer ? "question-answer-match" : "question-review-warning",
      question.correct_answer ? `${question.answer_source || "答案已确认"}，请核对` : "文件未提供可匹配答案，请确认",
    );
    editor.append(answerStatus);
    const warning = createElement("small", "question-review-warning", question.review_warning || "");
    warning.hidden = !warning.textContent;
    editor.append(warning);
    if (question.review_warning) {
      const originalWarning = question.review_warning;
      const confirmation = createElement("label", "question-review-confirmation");
      const checkbox = document.createElement("input"); checkbox.type = "checkbox";
      confirmation.append(checkbox, createElement("span", "", "我已核对题干与选项，确认可以导入"));
      checkbox.addEventListener("change", () => {
        question.review_warning = checkbox.checked ? "" : originalWarning;
        warning.hidden = checkbox.checked;
        updateImportedQuestionValidity();
      });
      editor.append(confirmation);
    }
    row.append(type, editor, indexLabel);
    return row;
  }

  const copy = createElement("div", "question-bank-copy");
  const optionText = question.challenge_type === "choice"
    ? (question.options || []).map((option, optionIndex) => `${String.fromCharCode(65 + optionIndex)}. ${option}`).join(" · ")
    : "中英文互问";
  copy.append(createElement("strong", "", question.prompt), createElement("small", "", optionText));
  const meta = createElement("div", "question-bank-meta");
  meta.append(
    createElement("strong", "", `答案：${question.correct_answer}`),
    createElement("small", "question-bank-explanation", `解析：${question.explanation || "暂无解析"}`),
    createElement("small", "", `${getBankName(question.bank_id)} · ${question.source_name || ""}`),
  );
  const actions = createElement("div", "question-bank-actions");
  const bankSelect = createQuestionBankSelect(question.challenge_type, question.bank_id);
  bankSelect.title = "设置所属子题库";
  bankSelect.addEventListener("change", async () => {
    bankSelect.disabled = true;
    const { data, error } = await supabaseClient.rpc("set_pet_challenge_question_bank", { p_question_id: question.question_id, p_bank_id: bankSelect.value || null });
    bankSelect.disabled = false;
    if (error || data !== true) { bankSelect.value = question.bank_id || ""; showStatus("子题库保存失败，请重试"); return; }
    question.bank_id = bankSelect.value || null; renderQuestionBankSummary(); showStatus("题目分类已保存");
  });
  const toggle = createElement("label", "question-active-toggle");
  const checkbox = document.createElement("input"); checkbox.type = "checkbox"; checkbox.checked = question.is_active === true;
  const label = createElement("span", "", checkbox.checked ? "已启用" : "已停用");
  checkbox.addEventListener("change", async () => {
    checkbox.disabled = true;
    const { data, error } = await supabaseClient.rpc("set_pet_challenge_question_active", { p_question_id: question.question_id, p_is_active: checkbox.checked });
    checkbox.disabled = false;
    if (error || data !== true) { checkbox.checked = !checkbox.checked; showStatus("题目状态保存失败，请重试"); return; }
    question.is_active = checkbox.checked; label.textContent = checkbox.checked ? "已启用" : "已停用"; renderQuestionBankSummary();
  });
  toggle.append(checkbox, label);
  const deleteButton = createElement("button", "icon-button"); deleteButton.type = "button"; deleteButton.title = "删除题目"; deleteButton.innerHTML = '<i data-lucide="trash-2"></i>';
  deleteButton.addEventListener("click", async () => {
    if (!window.confirm("确认删除这道题吗？已完成的答题记录会保留。")) return;
    deleteButton.disabled = true;
    const { data, error } = await supabaseClient.rpc("delete_pet_challenge_question", { p_question_id: question.question_id });
    if (!error && data === true) { questionBank = questionBank.filter((item) => item.question_id !== question.question_id); renderQuestionBank(); showStatus("题目已删除"); }
    else { deleteButton.disabled = false; showStatus("题目删除失败，请重试"); }
  });
  const editButton = createElement("button", "icon-button"); editButton.type = "button"; editButton.title = "编辑题目"; editButton.innerHTML = '<i data-lucide="pencil"></i>';
  editButton.addEventListener("click", async () => {
    const promptValue = window.prompt("修改题干", question.prompt);
    if (promptValue === null) return;
    let optionsValue = question.options;
    if (question.challenge_type === "choice") {
      const updated = [];
      for (let index = 0; index < 4; index += 1) {
        const value = window.prompt(`修改 ${String.fromCharCode(65 + index)} 选项`, question.options[index]);
        if (value === null) return;
        updated.push(normalizeQuestionText(value));
      }
      optionsValue = updated;
    }
    const answerValue = window.prompt("修改正确答案（选择题请填写与选项完全一致的内容）", question.correct_answer);
    if (answerValue === null) return;
    const explanationValue = window.prompt("修改答案解析（可留空，学生提交答案后显示）", question.explanation || "");
    if (explanationValue === null) return;
    editButton.disabled = true;
    const { data, error } = await supabaseClient.rpc("update_pet_challenge_question_v2", {
      p_question_id: question.question_id,
      p_prompt: normalizeQuestionText(promptValue),
      p_options: optionsValue,
      p_correct_answer: normalizeQuestionText(answerValue),
      p_explanation: normalizeQuestionExplanation(explanationValue),
    });
    editButton.disabled = false;
    if (error || data !== true) { showStatus("题目保存失败，请检查选项和答案"); return; }
    question.prompt = normalizeQuestionText(promptValue); question.options = optionsValue; question.correct_answer = normalizeQuestionText(answerValue); question.explanation = normalizeQuestionExplanation(explanationValue);
    renderQuestionBank(); showStatus("题目已更新");
  });
  actions.append(bankSelect, toggle, editButton, deleteButton);
  row.append(type, copy, meta, actions);
  return row;
}

function renderQuestionBankSummary() {
  const activeQuestions = questionBank.filter((question) => question.is_active);
  const choiceCount = activeQuestions.filter((question) => question.challenge_type === "choice").length;
  const wordCount = activeQuestions.filter((question) => question.challenge_type === "word").length;
  document.querySelector("#questionBankSummary").textContent = `${activeQuestions.length} 道启用 · 选择题 ${choiceCount} · 单词题 ${wordCount}`;
  document.querySelector("#adminQuestionCount").textContent = `${activeQuestions.length} 道启用`;
  document.querySelector("#questionDashboardTotal").textContent = String(questionBank.length);
  document.querySelector("#questionDashboardActive").textContent = String(activeQuestions.length);
  document.querySelector("#questionDashboardBanks").textContent = String(questionBanks.length);
}

function renderQuestionBank() {
  const typeFilter = document.querySelector("#questionTypeFilter")?.value || "";
  const bankFilter = document.querySelector("#questionBankFilter")?.value || "";
  const search = (document.querySelector("#questionSearchInput")?.value || "").trim().toLocaleLowerCase("zh-CN");
  const filtered = questionBank.filter((question) => {
    if (typeFilter && question.challenge_type !== typeFilter) return false;
    if (bankFilter === "unassigned" && question.bank_id) return false;
    if (bankFilter && bankFilter !== "unassigned" && question.bank_id !== bankFilter) return false;
    if (search && ![question.prompt, question.correct_answer, question.explanation, question.source_name, getBankName(question.bank_id)].join(" ").toLocaleLowerCase("zh-CN").includes(search)) return false;
    return true;
  });
  const list = document.querySelector("#questionBankList");
  list.replaceChildren(...filtered.map((question) => renderQuestionRow(question)));
  document.querySelector("#questionBankEmpty").hidden = filtered.length > 0;
  renderQuestionBankSummary();
  if (window.lucide) window.lucide.createIcons();
}

function renderImportedQuestionPreview() {
  const previewList = document.querySelector("#questionPreviewList");
  previewList.replaceChildren(...importedQuestions.map((question, index) => renderQuestionRow(question, { preview: true, index })));
  const choiceCount = importedQuestions.filter((question) => question.challenge_type === "choice").length;
  const wordCount = importedQuestions.filter((question) => question.challenge_type === "word").length;
  const matchedCount = importedQuestions.filter((question) => question.correct_answer).length;
  document.querySelector("#questionPreviewSummary").textContent = `${importedQuestions.length} 道 · 已匹配答案 ${matchedCount} · 选择题 ${choiceCount} · 单词题 ${wordCount}`;
  updateImportedQuestionValidity();
  if (window.lucide) window.lucide.createIcons();
}

function renderQuestionBanks() {
  const list = document.querySelector("#questionSubBankList");
  list.replaceChildren(...questionBanks.map((bank) => {
    const row = createElement("article", "question-sub-bank-row");
    const copy = createElement("div", "question-sub-bank-copy");
    const bankQuestions = questionBank.filter((question) => question.bank_id === bank.bank_id);
    const choiceQuestions = bankQuestions.filter((question) => question.challenge_type === "choice");
    const wordQuestions = bankQuestions.filter((question) => question.challenge_type === "word");
    const stats = createElement("div", "question-sub-bank-stats");
    stats.append(
      createElement("span", "question-sub-bank-stat is-choice", `选择题 ${choiceQuestions.filter((question) => question.is_active).length} / ${choiceQuestions.length}`),
      createElement("span", "question-sub-bank-stat is-word", `单词题 ${wordQuestions.filter((question) => question.is_active).length} / ${wordQuestions.length}`),
      createElement("span", "question-sub-bank-stat", `合计 ${bank.active_question_count || 0} / ${bank.question_count || 0} 道启用`),
    );
    copy.append(createElement("strong", "", bank.bank_name), stats);
    const nameInput = document.createElement("input"); nameInput.type = "text"; nameInput.value = bank.bank_name; nameInput.maxLength = 40;
    const save = createElement("button", "secondary-button", "保存"); save.type = "button";
    save.addEventListener("click", async () => {
      const { error } = await supabaseClient.rpc("update_pet_challenge_bank", { p_bank_id: bank.bank_id, p_name: nameInput.value.trim(), p_is_active: bank.is_active });
      if (error) { showStatus("子题库保存失败，请重试"); return; }
      bank.bank_name = nameInput.value.trim(); renderQuestionBanks(); renderQuestionBank(); showStatus("子题库已更新");
    });
    const toggle = document.createElement("input"); toggle.type = "checkbox"; toggle.checked = bank.is_active; toggle.title = "启用子题库";
    toggle.addEventListener("change", async () => {
      const { error } = await supabaseClient.rpc("update_pet_challenge_bank", { p_bank_id: bank.bank_id, p_name: bank.bank_name, p_is_active: toggle.checked });
      if (error) { toggle.checked = !toggle.checked; showStatus("子题库状态保存失败"); return; }
      bank.is_active = toggle.checked; renderQuestionBanks();
    });
    const del = createElement("button", "icon-button", ""); del.type = "button"; del.title = "删除子题库"; del.innerHTML = '<i data-lucide="trash-2"></i>';
    del.addEventListener("click", async () => {
      if (!window.confirm(`确认删除子题库“${bank.bank_name}”吗？题目会变为未分类。`)) return;
      const { error } = await supabaseClient.rpc("delete_pet_challenge_bank", { p_bank_id: bank.bank_id });
      if (error) { showStatus("子题库删除失败，请重试"); return; }
      questionBanks = questionBanks.filter((item) => item.bank_id !== bank.bank_id); questionBank.forEach((item) => { if (item.bank_id === bank.bank_id) item.bank_id = null; });
      renderQuestionBanks(); renderQuestionBank(); showStatus("子题库已删除");
    });
    const controls = createElement("div", "question-sub-bank-actions"); controls.append(nameInput, save, toggle, del);
    row.append(copy, controls); return row;
  }));
  document.querySelector("#questionSubBankEmpty").hidden = questionBanks.length > 0;
  document.querySelector("#questionBankFilter").replaceChildren(new Option("全部子题库", ""), new Option("未分类", "unassigned"), ...questionBanks.map((bank) => new Option(bank.bank_name, bank.bank_id)));
  const reviewSelect = document.querySelector("#questionReviewBank");
  reviewSelect.replaceChildren(new Option("选择所属子题库", ""), ...questionBanks.map((bank) => new Option(bank.bank_name, bank.bank_id)));
  if (window.lucide) window.lucide.createIcons();
}

async function loadQuestionBank({ quiet = false } = {}) {
  if (!canEdit) return false;
  const [{ data: banks, error: bankError }, { data, error }] = await Promise.all([
    supabaseClient.rpc("get_admin_pet_challenge_banks"),
    loadAllAdminQuestionBankRows(),
  ]);
  if (bankError || error) {
    questionBank = []; questionBanks = []; renderQuestionBanks(); renderQuestionBank();
    if (!quiet) showStatus("题库读取失败，请先确认数据库迁移已应用");
    return false;
  }
  questionBanks = (banks || []).map((bank) => ({ ...bank, question_count: Number(bank.question_count) || 0, active_question_count: Number(bank.active_question_count) || 0 }));
  questionBank = (data || []).map((question) => ({ ...question, options: Array.isArray(question.options) ? question.options : null, is_active: question.is_active === true }));
  renderQuestionBanks(); renderQuestionBank(); return true;
}

async function loadAllAdminQuestionBankRows() {
  const pageSize = 1000;
  const rows = [];
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabaseClient
      .rpc("get_admin_pet_challenge_question_bank_v3")
      .range(from, from + pageSize - 1);
    if (error) return { data: null, error };
    rows.push(...(data || []));
    if (!data || data.length < pageSize) return { data: rows, error: null };
  }
}

function getQuestionFileKind(file) {
  const name = file?.name?.toLocaleLowerCase("zh-CN") || "";
  if (name.endsWith(".docx")) return "docx";
  if (name.endsWith(".pdf") || file?.type === "application/pdf") return "pdf";
  if (["image/png", "image/jpeg", "image/webp", "image/gif", "image/bmp"].includes(file?.type) || /\.(?:png|jpe?g|webp|gif|bmp)$/.test(name)) return "image";
  return "";
}

function validateQuestionFile(file, kind) {
  const limits = { docx: 10, pdf: 20, image: 12 };
  if (!kind) return "请选择 DOCX、PDF、PNG、JPG、WebP、GIF 或 BMP 文件";
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

function createScaledCanvas(width, height, maxSide = 3200) {
  const shortSide = Math.max(1, Math.min(width, height));
  const upscale = Math.max(1, Math.min(2, 1500 / shortSide));
  const scale = Math.min(upscale, maxSide / Math.max(width, height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));
  return { canvas, scale };
}

function enhanceCanvasForQuestionOcr(canvas) {
  const context = canvas.getContext("2d", { alpha: false, willReadFrequently: true });
  const image = context.getImageData(0, 0, canvas.width, canvas.height);
  for (let index = 0; index < image.data.length; index += 4) {
    const luminance = (image.data[index] * 0.299) + (image.data[index + 1] * 0.587) + (image.data[index + 2] * 0.114);
    const contrasted = Math.max(0, Math.min(255, ((luminance - 128) * 1.25) + 128));
    image.data[index] = contrasted;
    image.data[index + 1] = contrasted;
    image.data[index + 2] = contrasted;
    image.data[index + 3] = 255;
  }
  context.putImageData(image, 0, 0);
  return canvas;
}

async function extractImageQuestionContent(file) {
  const bitmap = await createImageBitmap(file);
  const { canvas } = createScaledCanvas(bitmap.width, bitmap.height);
  canvas.getContext("2d", { alpha: false }).drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  enhanceCanvasForQuestionOcr(canvas);
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
  return enhanceCanvasForQuestionOcr(canvas);
}

async function extractPdfQuestionContent(file) {
  if (!window.pdfjsLib) throw new Error("PDF 识别组件加载失败");
  window.pdfjsLib.GlobalWorkerOptions.workerSrc = "vendor/pdfjs/pdf.worker.min.js";
  const pdf = await window.pdfjsLib.getDocument({
    data: new Uint8Array(await file.arrayBuffer()),
    isEvalSupported: false,
  }).promise;
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
    ]).map((question) => ({
      ...question,
      explanation: question.explanation || "",
      answer_source: question.answer_source || (question.correct_answer ? "文档自动匹配" : ""),
      bank_id: "",
      is_review_ready: false,
    }));
    questionImportFileName = file.name;
    document.querySelector("#questionReviewFile").textContent = `${file.name} · ${content.method}`;
    renderImportedQuestionPreview();
    updateQuestionImportProgress(importedQuestions.length
      ? `${file.name} · ${content.method} · 已识别 ${importedQuestions.length} 道题，等待审核`
      : `${file.name} · 未识别到结构完整题目`);
    if (importedQuestions.length) {
      scheduleSection.hidden = true;
      pageFooter.hidden = true;
      hideAdminPages();
      questionReviewPage.hidden = false;
      document.body.classList.add("is-admin-view");
      document.querySelector("#closeQuestionReview").focus();
      const matchedCount = importedQuestions.filter((question) => question.correct_answer).length;
      showStatus(`已识别 ${importedQuestions.length} 道题，自动匹配 ${matchedCount} 道答案，请核对后导入`);
    } else showStatus("未识别到结构完整题目，请检查文件内容");
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
  if (!importedQuestions.every((question) => question.is_review_ready)) {
    showStatus("请先完成所有题目的答案和子题库确认");
    button.disabled = false;
    return;
  }
  const { data, error } = await supabaseClient.rpc("import_pet_challenge_questions_v3", {
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
  updateQuestionImportProgress("支持 Word、PDF 和图片 OCR，答案与解析会自动匹配并进入审核页");
  importedQuestions = [];
  renderImportedQuestionPreview();
  await loadQuestionBank({ quiet: true });
  showQuestionBank();
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
  const totalAttempts = Number(summary.total_attempts ?? choiceAttempts + wordAttempts);
  document.querySelector("#totalChallengeCount").textContent = `${totalAttempts} / 50`;
  document.querySelector("#choiceChallengeCount").textContent = `选择题 ${choiceAttempts}`;
  document.querySelector("#wordChallengeCount").textContent = `单词题 ${wordAttempts}`;
  document.querySelector("#challengeSessionCount").textContent = `${Number(summary.sessions_used) || 0} / 5`;
  document.querySelector("#challengeCoinCount").textContent = `${Number(summary.earned_coins) || 0} 金币`;
  document.querySelector("#challengeBonusState").textContent = summary.completion_bonus_claimed
    ? "今日满题奖励已领取 · 点击进入商城"
    : "满 50 题奖励 10 金币 · 点击进入商城";
  if (challengeState.sessionId) document.querySelector("#challengeQuestionProgress").textContent = `本轮第 ${challengeState.sessionAnswered + 1} / 10 题 · 今日剩余 ${Math.max(0, 50 - totalAttempts)} 题`;
}

async function loadChallengeSummary() {
  const { data, error } = await supabaseClient.rpc("get_my_challenge_summary_v2");
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
  challengeState.sessionId = null;
  challengeState.bankId = "";
  challengeState.answered = false;
  document.querySelector("#showChoiceChallenge").classList.toggle("is-active", type === "choice");
  document.querySelector("#showChoiceChallenge").setAttribute("aria-selected", String(type === "choice"));
  document.querySelector("#showWordChallenge").classList.toggle("is-active", type === "word");
  document.querySelector("#showWordChallenge").setAttribute("aria-selected", String(type === "word"));
  document.querySelector("#choiceChallengeOptions").hidden = type !== "choice";
  document.querySelector("#wordChallengeForm").hidden = type !== "word";
  document.querySelector("#challengeResult").hidden = true;
  document.querySelector("#nextChallengeQuestion").hidden = true;
  document.querySelector("#finishChallengeSession").hidden = true;
  document.querySelector("#wordChallengeAnswer").value = "";
  renderAvailableChallengeBanks();
}

function renderChallengeQuestion(question) {
  challengeState.attemptId = Number(question.attempt_id);
  challengeState.sessionAnswered = Math.max(0, Number(question.session_question_number) - 1);
  challengeState.sessionRemaining = Number(question.session_remaining) || 0;
  challengeState.dailyAttempts = Number(question.daily_attempts) || 0;
  challengeState.dailyRemaining = Number(question.daily_remaining) || 0;
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
  if (!currentUser || canEdit || !challengeState.sessionId) return;
  const questionCard = document.querySelector("#challengeQuestionCard");
  questionCard.classList.add("is-loading");
  const { data, error } = await supabaseClient.rpc("get_next_pet_challenge_question_v3", { p_session_id: challengeState.sessionId });
  questionCard.classList.remove("is-loading");
  if (error) {
    document.querySelector("#challengePrompt").textContent = error.message?.includes("session completed")
      ? "本轮 10 题已完成"
      : (error.message?.includes("limit") ? "今日挑战次数已用完，明天再来吧" : "当前没有可用题目，请稍后再试");
    document.querySelector("#choiceChallengeOptions").replaceChildren();
    document.querySelector("#wordChallengeForm").hidden = true;
    document.querySelector("#challengeQuestionProgress").textContent = "本轮已完成";
    document.querySelector("#nextChallengeQuestion").hidden = true;
    document.querySelector("#finishChallengeSession").hidden = false;
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
  const reward = correct ? `答对了，获得 1 金币${Number(result.gained_experience) ? ` · ${result.gained_experience} 经验` : ""}` : "这次答错了，本题无奖励";
  const bonus = Number(result.completion_bonus_coins) ? ` · 完成今日 50 题额外 +${result.completion_bonus_coins} 金币` : "";
  document.querySelector("#challengeResultTitle").textContent = reward;
  document.querySelector("#challengeResultDetail").textContent = `本题用时 ${formatChallengeDuration(result.duration_seconds)} · 本轮剩余 ${result.session_remaining} 题${bonus}`;
  document.querySelector("#challengeCorrectAnswer").textContent = `正确答案：${result.correct_answer || "暂无"}`;
  document.querySelector("#challengeAnswerExplanation").textContent = result.explanation
    ? `解析：${result.explanation}`
    : "本题暂无解析";
  resultBox.hidden = false;
  document.querySelector("#nextChallengeQuestion").hidden = result.session_remaining <= 0;
  document.querySelector("#finishChallengeSession").hidden = result.session_remaining > 0;
  if (window.lucide) window.lucide.createIcons();
}

async function submitChallengeAnswer(answer, clickedButton = null) {
  if (!challengeState.attemptId || challengeState.answered) return;
  if (clickedButton) clickedButton.disabled = true;
  document.querySelector("#submitWordChallenge").disabled = true;
  challengeState.answered = true;
  const { data, error } = await supabaseClient.rpc("answer_pet_challenge_question_v3", {
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
  currentUser.pet_coins = Number(result.total_coins) || currentUser.pet_coins;
  challengeState.sessionAnswered = 10 - Number(result.session_remaining || 0);
  renderChallengeResult(result);
  await loadChallengeSummary();
  if (!petDetailPage.hidden) renderPetDetail();
  updateVisitorPet();
  showStatus(result.is_correct ? `答对了，获得 ${result.gained_experience} 经验` : "答错了，继续加油");
}

function renderAvailableChallengeBanks() {
  const select = document.querySelector("#studentChallengeBank");
  const banks = availableChallengeBanks.filter((bank) => bank.challenge_type === challengeState.type);
  select.replaceChildren(...banks.map((bank) => new Option(`${bank.bank_name} · ${bank.question_count} 题`, bank.bank_id)));
  select.disabled = banks.length === 0;
  document.querySelector("#challengeBankEmpty").hidden = banks.length > 0;
  document.querySelector("#startChallengeSession").disabled = banks.length === 0;
  challengeState.bankId = banks[0]?.bank_id || "";
  challengeState.bankName = banks[0]?.bank_name || "";
  if (banks.length) select.value = challengeState.bankId;
}

async function loadAvailableChallengeBanks() {
  const { data, error } = await supabaseClient.rpc("get_available_pet_challenge_banks");
  if (error) { availableChallengeBanks = []; renderAvailableChallengeBanks(); showStatus("子题库读取失败，请稍后重试"); return false; }
  availableChallengeBanks = (data || []).map((bank) => ({ ...bank, question_count: Number(bank.question_count) || 0 }));
  renderAvailableChallengeBanks();
  return true;
}

async function startChallengeSession() {
  if (canEdit || !currentUser) return;
  const select = document.querySelector("#studentChallengeBank");
  challengeState.bankId = select.value;
  if (!challengeState.bankId) { showStatus("请先选择一个子题库"); return; }
  const button = document.querySelector("#startChallengeSession"); button.disabled = true;
  const { data, error } = await supabaseClient.rpc("start_pet_challenge_session", {
    p_challenge_type: challengeState.type,
    p_bank_id: challengeState.bankId,
  });
  button.disabled = false;
  if (error) { showStatus(error.message?.includes("limit") ? "今日最多挑战 5 轮" : "挑战轮次开始失败，请重试"); return; }
  const session = Array.isArray(data) ? data[0] : data;
  if (!session) return;
  challengeState.sessionId = Number(session.session_id);
  challengeState.sessionAnswered = Number(session.session_answered) || 0;
  document.querySelector("#challengeStartPanel").hidden = true;
  document.querySelector("#challengeQuestionCard").hidden = false;
  await loadNextChallengeQuestion();
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
    metrics.append(createElement("strong", "", `+${record.reward_coins || 0} 金币 · +${record.reward_experience} 经验`), createElement("small", "", `${record.bank_name || "历史题库"} · ${formatChallengeDuration(record.duration_seconds)} · ${formatChallengeDate(record.answered_at)}`));
    row.append(result, identity, question, metrics);
    list.append(row);
  });
  document.querySelector("#challengeRecordEmpty").hidden = challengeRecords.length > 0;
  document.querySelector("#challengeRecordTotal").textContent = `${challengeRecords.length} 条`;
}

async function loadAdminChallengeRecords() {
  if (!canEdit) return false;
  const { data, error } = await supabaseClient.rpc("get_admin_pet_challenge_records_v2", { p_limit: 500 });
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
  if (canEdit || !currentUser) return;
  scheduleSection.hidden = true;
  pageFooter.hidden = true;
  hideAdminPages();
  studentChallengePage.hidden = false;
  document.body.classList.add("is-admin-view");
  setChallengeType("choice");
  document.querySelector("#challengeStartPanel").hidden = false;
  document.querySelector("#challengeQuestionCard").hidden = true;
  await Promise.all([loadChallengeSummary(), loadAvailableChallengeBanks()]);
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
  coinShopPage.hidden = true;
  studentChallengePage.hidden = true;
  challengeRecordsPage.hidden = true;
  questionBankPage.hidden = true;
  questionReviewPage.hidden = true;
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
  document.querySelector("#adminCoinShopCount").textContent = `${coinShopProducts.length} 件商品`;
  if (questionBank.length) renderQuestionBankSummary();
}

async function showAdminHub() {
  if (!canEdit) return;
  await Promise.all([loadStudents(), loadQuestionBank({ quiet: true }), loadCoinShopProducts({ quiet: true })]);
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
  selectedAttendanceDate = toISODate(getScheduleToday());
  await loadSchedule({ quiet: true });
  await Promise.all([loadAttendance(), loadAttendanceHistory({ quiet: true })]);
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

function showQuestionReview() {
  if (!canEdit || importedQuestions.length === 0) return;
  scheduleSection.hidden = true;
  pageFooter.hidden = true;
  hideAdminPages();
  questionReviewPage.hidden = false;
  document.body.classList.add("is-admin-view");
  renderQuestionBanks();
  renderImportedQuestionPreview();
  document.querySelector("#closeQuestionReview").focus();
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

async function showCoinShop() {
  if (!currentUser) return;
  scheduleSection.hidden = true;
  pageFooter.hidden = true;
  hideAdminPages();
  coinShopPage.hidden = false;
  document.body.classList.add("is-admin-view");
  document.querySelector("#coinShopCreateSection").hidden = !canEdit;
  document.querySelector("#coinShopStudentSummary").hidden = canEdit;
  document.querySelector("#coinShopListTitle").textContent = canEdit ? "全部商品" : "可兑换商品";
  document.querySelector("#closeCoinShop span").textContent = canEdit ? "返回管理后台" : "返回学习挑战";
  await loadCoinShopProducts();
  if (canEdit) document.querySelector("#coinShopNameInput").focus();
  else document.querySelector("#closeCoinShop").focus();
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
  copyModeBar.hidden = !copiedCourse || !canEdit || scheduleView !== "week";
  document.body.classList.toggle("is-copying-course", Boolean(copiedCourse && canEdit && scheduleView === "week"));
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
  document.querySelector("#openStudentChallenge").hidden = canEdit || !currentUser;
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

function createHolidayBadge(info, { includeName = false } = {}) {
  if (!info) return null;
  const wrapper = createElement("span", `calendar-day-status is-${info.type}`);
  const badge = createElement("i", `calendar-status-badge is-${info.type}`, info.label);
  badge.setAttribute("aria-hidden", "true");
  wrapper.setAttribute("aria-label", `${info.name}，${info.type === "holiday" ? "法定放假" : "调休上班"}`);
  wrapper.title = `${info.name} · ${info.type === "holiday" ? "法定放假" : "调休上班"}`;
  wrapper.append(badge);
  if (includeName) wrapper.append(createElement("small", "", info.name));
  return wrapper;
}

function createCalendarCourseButton(course, date) {
  const button = createElement("button", "calendar-course-chip");
  button.type = "button";
  button.setAttribute("aria-label", `${course.name}，${formatTime(course.startTime)} 至 ${formatTime(getCourseEnd(course))}`);
  button.title = `${course.name} · ${formatTime(course.startTime)} - ${formatTime(getCourseEnd(course))}`;
  button.append(
    createElement("span", "", formatTime(course.startTime)),
    createElement("strong", "", course.name),
  );
  applyCourseColor(button, getEffectiveCourseColor(course));
  button.addEventListener("click", () => showCourse(course.id, toISODate(date)));
  return button;
}

function renderScheduleSummary(occurrences, periodLabel) {
  const totalMinutes = occurrences.reduce((total, occurrence) => total + occurrence.course.duration, 0);
  document.querySelector("#courseCount").textContent = String(schedule.length);
  occurrencePeriodLabel.textContent = periodLabel;
  document.querySelector("#occurrenceCount").textContent = String(occurrences.length);
  document.querySelector("#durationCount").textContent = (totalMinutes / 60).toFixed(1).replace(".0", "");
}

function updateScheduleViewControls() {
  scheduleViewSwitcher.querySelectorAll("[data-schedule-view]").forEach((button) => {
    const isActive = button.dataset.scheduleView === scheduleView;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  const periodNames = { week: "本周", month: "本月", year: "今年" };
  const pickerNames = { week: "选择周次", month: "选择月份", year: "选择年份" };
  document.querySelector("#todayButton span").textContent = `返回${periodNames[scheduleView]}`;
  document.querySelector("#currentWeek").disabled = false;
  document.querySelector("#currentWeek").setAttribute("aria-label", pickerNames[scheduleView]);
  document.querySelector("#currentWeek").title = pickerNames[scheduleView];
  updateCopyModeUI();
}

function updateHolidayDataNote(year) {
  const note = document.querySelector("#holidayDataNote");
  const holidaySchedule = officialHolidaySchedules[year];
  if (holidaySchedule) {
    note.textContent = `${year}年 · 国务院办公厅通知`;
    note.title = holidaySchedule.source;
    return;
  }
  note.textContent = `${year}年官方放假调休安排暂未收录`;
  note.removeAttribute("title");
}

function renderWeekSchedule() {
  scheduleScroll.hidden = false;
  calendarOverview.hidden = true;
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
    const holidayInfo = getOfficialDayInfo(date);
    if (holidayInfo) {
      header.classList.add(`is-${holidayInfo.type}`);
      header.append(createHolidayBadge(holidayInfo, { includeName: true }));
    }
    grid.append(header);
  });

  for (let hour = timelineStart / 60; hour < timelineEnd / 60; hour += 1) {
    const time = createElement("div", "time-slot");
    time.style.gridColumn = "1";
    time.style.gridRow = `${((hour * 60 - timelineStart) / snapMinutes) + 2} / span ${60 / snapMinutes}`;
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
    const card = createElement("button", `course-card${canEdit ? " is-editable" : " is-readonly"}`);
    card.type = "button";
    card.dataset.courseId = course.id;
    card.dataset.occurrenceDate = toISODate(date);
    if (course.duration <= 10) card.classList.add("is-tiny");
    else if (course.duration <= 20) card.classList.add("is-micro");
    else if (course.duration <= 40) card.classList.add("is-compact");
    else if (course.duration <= 60) card.classList.add("is-short");
    placeCourseCard(card, dayIndex, course.startTime, course.duration);
    applyCourseColor(card, getEffectiveCourseColor(course));
    card.setAttribute("aria-label", `${course.name}，${formatTime(course.startTime)} 至 ${formatTime(getCourseEnd(course))}`);
    card.title = canEdit ? "拖动将移动整个课程系列，点击可编辑详情" : "点击查看课程详情";
    card.append(
      createElement("strong", "", course.name),
      createElement("span", "course-time", `${formatTime(course.startTime)} - ${formatTime(getCourseEnd(course))}`),
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
  weekLabel.textContent = `第 ${weekNumber} 周`;
  weekRange.textContent = `${formatMonthDay(selectedWeekStart)} - ${formatMonthDay(weekEnd)}`;
  document.querySelector("#previousWeek").setAttribute("aria-label", "上一周");
  document.querySelector("#previousWeek").title = "上一周";
  document.querySelector("#nextWeek").setAttribute("aria-label", "下一周");
  document.querySelector("#nextWeek").title = "下一周";
  document.querySelector("#todayText").textContent = `${days[(scheduleToday.getDay() + 6) % 7]}，${formatMonthDay(scheduleToday)}`;
  document.querySelector("#scheduleTitle").textContent = "本周安排";
  updateHolidayDataNote(getISOWeekYear(selectedWeekStart));
  renderScheduleSummary(occurrences, "本周");
  autoFocusTodayCourse(occurrences);
}

function getScheduleTimeMinutes() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: scheduleTimeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return Number(values.hour) * 60 + Number(values.minute);
}

function selectTodayCourseForAutoFocus(todayCourses, currentMinutes) {
  return todayCourses.find(({ course }) => course.startTime + course.duration > currentMinutes) || todayCourses.at(-1) || null;
}

function calculateTimelineScrollTop(course, slotHeight, headerHeight, viewportHeight, maximumScrollTop) {
  const courseCenter = headerHeight
    + ((course.startTime - timelineStart) / snapMinutes) * slotHeight
    + (course.duration / snapMinutes) * slotHeight / 2;
  return clamp(courseCenter - viewportHeight / 2, 0, Math.max(0, maximumScrollTop));
}

function autoFocusTodayCourse(occurrences) {
  const todayKey = toISODate(scheduleToday);
  if (!currentUser || autoFocusedScheduleDate === todayKey || !sameDay(selectedWeekStart, currentWeekStart)) return;
  const todayCourses = occurrences
    .filter((occurrence) => sameDay(occurrence.date, scheduleToday))
    .sort((first, second) => first.course.startTime - second.course.startTime);
  if (!todayCourses.length) return;
  const currentMinutes = getScheduleTimeMinutes();
  const target = selectTodayCourseForAutoFocus(todayCourses, currentMinutes);
  autoFocusedScheduleDate = todayKey;
  window.requestAnimationFrame(() => {
    const slotHeight = grid.querySelector(".grid-cell")?.getBoundingClientRect().height || 12;
    const headerHeight = grid.querySelector(".day-header")?.getBoundingClientRect().height || 64;
    const targetScrollTop = calculateTimelineScrollTop(
      target.course,
      slotHeight,
      headerHeight,
      scheduleScroll.clientHeight,
      scheduleScroll.scrollHeight - scheduleScroll.clientHeight,
    );
    scheduleScroll.scrollTo({ top: targetScrollTop, behavior: "auto" });
  });
}

function renderMonthSchedule() {
  scheduleScroll.hidden = true;
  calendarOverview.hidden = false;
  calendarOverview.className = "calendar-overview is-month-view";
  calendarOverview.replaceChildren();

  const year = selectedCalendarDate.getFullYear();
  const month = selectedCalendarDate.getMonth();
  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 0);
  const calendarStart = getMonthCalendarStart(selectedCalendarDate);
  const monthGrid = createElement("div", "month-calendar-grid");
  monthGrid.setAttribute("aria-label", `${year}年${month + 1}月课程日历`);

  days.forEach((day) => monthGrid.append(createElement("strong", "calendar-weekday", day)));
  for (let dayIndex = 0; dayIndex < 42; dayIndex += 1) {
    const date = addDays(calendarStart, dayIndex);
    const isCurrentMonth = date.getMonth() === month;
    const holidayInfo = getOfficialDayInfo(date);
    const courses = getOccurrencesForDate(date);
    const cell = createElement("article", "month-day");
    if (!isCurrentMonth) cell.classList.add("is-outside-month");
    if (sameDay(date, scheduleToday)) cell.classList.add("is-today");
    if (holidayInfo) cell.classList.add(`is-${holidayInfo.type}`);

    const heading = createElement("div", "month-day-heading");
    const dateButton = createElement("button", "month-day-number", String(date.getDate()));
    dateButton.type = "button";
    dateButton.title = `查看${formatFullDate(date)}所在周`;
    dateButton.setAttribute("aria-label", `切换到${formatFullDate(date)}所在周`);
    dateButton.addEventListener("click", () => {
      selectedCalendarDate = new Date(date);
      selectedWeekStart = startOfWeek(date);
      setScheduleView("week");
    });
    heading.append(dateButton);
    if (holidayInfo) heading.append(createHolidayBadge(holidayInfo, { includeName: true }));
    cell.append(heading);

    const courseList = createElement("div", "month-course-list");
    courses.slice(0, 3).forEach((course) => courseList.append(createCalendarCourseButton(course, date)));
    if (courses.length > 3) courseList.append(createElement("small", "month-more-count", `还有 ${courses.length - 3} 节`));
    cell.append(courseList);
    monthGrid.append(cell);
  }
  calendarOverview.append(monthGrid);

  const occurrences = getOccurrencesBetween(monthStart, monthEnd);
  weekLabel.textContent = `${year}年${month + 1}月`;
  weekRange.textContent = "月视图";
  document.querySelector("#previousWeek").setAttribute("aria-label", "上个月");
  document.querySelector("#previousWeek").title = "上个月";
  document.querySelector("#nextWeek").setAttribute("aria-label", "下个月");
  document.querySelector("#nextWeek").title = "下个月";
  document.querySelector("#todayText").textContent = `${year}年${month + 1}月 · 节假日与调休日历`;
  document.querySelector("#scheduleTitle").textContent = "本月安排";
  updateHolidayDataNote(year);
  renderScheduleSummary(occurrences, "本月");
}

function renderYearSchedule() {
  scheduleScroll.hidden = true;
  calendarOverview.hidden = false;
  calendarOverview.className = "calendar-overview is-year-view";
  calendarOverview.replaceChildren();

  const year = selectedCalendarDate.getFullYear();
  const yearGrid = createElement("div", "year-calendar-grid");
  yearGrid.setAttribute("aria-label", `${year}年课程与节假日日历`);

  for (let month = 0; month < 12; month += 1) {
    const monthDate = new Date(year, month, 1);
    const monthCard = createElement("section", "year-month-card");
    monthCard.dataset.month = String(month);
    monthCard.tabIndex = 0;
    monthCard.setAttribute("role", "button");
    monthCard.setAttribute("aria-label", `查看${year}年${month + 1}月月视图`);
    monthCard.title = `点击进入${year}年${month + 1}月月视图`;
    const openMonth = () => {
      selectedCalendarDate = new Date(monthDate);
      setScheduleView("month");
    };
    monthCard.addEventListener("click", openMonth);
    monthCard.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      openMonth();
    });
    monthCard.append(createElement("strong", "year-month-title", `${month + 1}月`));

    const miniature = createElement("div", "year-month-grid");
    ["一", "二", "三", "四", "五", "六", "日"].forEach((day) => miniature.append(createElement("small", "year-weekday", day)));
    const calendarStart = getMonthCalendarStart(monthDate);
    for (let dayIndex = 0; dayIndex < 42; dayIndex += 1) {
      const date = addDays(calendarStart, dayIndex);
      if (date.getMonth() !== month) {
        miniature.append(createElement("span", "year-day is-empty"));
        continue;
      }
      const holidayInfo = getOfficialDayInfo(date);
      const courseCount = getOccurrencesForDate(date).length;
      const dayCell = createElement("span", "year-day");
      if (sameDay(date, scheduleToday)) dayCell.classList.add("is-today");
      if (courseCount) dayCell.classList.add("has-course");
      if (holidayInfo) dayCell.classList.add(`is-${holidayInfo.type}`);
      dayCell.title = [formatFullDate(date), holidayInfo?.name, courseCount ? `${courseCount} 节课` : ""].filter(Boolean).join(" · ");
      dayCell.setAttribute("aria-label", dayCell.title);
      dayCell.append(createElement("b", "", String(date.getDate())));
      if (holidayInfo) dayCell.append(createHolidayBadge(holidayInfo));
      if (courseCount) dayCell.append(createElement("i", "year-course-dot", courseCount > 1 ? String(courseCount) : ""));
      miniature.append(dayCell);
    }
    monthCard.append(miniature);
    yearGrid.append(monthCard);
  }
  calendarOverview.append(yearGrid);
  if (yearViewAutoScrollPending) {
    yearViewAutoScrollPending = false;
    const targetMonth = selectedCalendarDate.getMonth();
    window.requestAnimationFrame(() => {
      yearGrid.querySelector(`[data-month="${targetMonth}"]`)?.scrollIntoView({ block: "start", inline: "nearest", behavior: "auto" });
    });
  }

  const yearStart = new Date(year, 0, 1);
  const yearEnd = new Date(year, 11, 31);
  const occurrences = getOccurrencesBetween(yearStart, yearEnd);
  weekLabel.textContent = `${year}年`;
  weekRange.textContent = "年视图";
  document.querySelector("#previousWeek").setAttribute("aria-label", "上一年");
  document.querySelector("#previousWeek").title = "上一年";
  document.querySelector("#nextWeek").setAttribute("aria-label", "下一年");
  document.querySelector("#nextWeek").title = "下一年";
  document.querySelector("#todayText").textContent = `${year}年 · 全年课程与节假日`;
  document.querySelector("#scheduleTitle").textContent = "全年总览";
  updateHolidayDataNote(year);
  renderScheduleSummary(occurrences, year === scheduleToday.getFullYear() ? "今年" : `${year}年`);
}

function renderSchedule() {
  updateScheduleViewControls();
  if (scheduleView === "month") {
    renderMonthSchedule();
    return;
  }
  if (scheduleView === "year") {
    renderYearSchedule();
    return;
  }
  renderWeekSchedule();
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
        repeatEndDate: course.repeatEndDate
          ? toISODate(addDays(parseISODate(course.repeatEndDate), dayShift))
          : null,
        repeatWeekdays: shiftRepeatWeekdays(course.repeatWeekdays, dayShift),
        startTime: dragState.nextStart,
      };
      dragState = null;
      card.classList.remove("is-dragging");
      card.removeAttribute("aria-grabbed");

      const conflicts = getSeriesConflicts(candidate, course.id);
      if (conflicts.length && !await requestCourseConflictConfirmation(candidate, conflicts)) {
        showStatus("已取消移动，课程恢复原位置");
        renderSchedule();
        return;
      }

      card.classList.add("is-saving");
      showStatus("正在移动整个课程系列…");
      await persistCourseUpdate(course, candidate, "课程系列已移动并实时同步", conflicts.length > 0);
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
    repeatEndDate: shiftRepeatEndDate(copiedCourse, toISODate(addDays(selectedWeekStart, dayIndex))),
    repeatWeekdays: shiftRepeatWeekdays(
      copiedCourse.repeatWeekdays,
      daysBetween(parseISODate(copiedCourse.startDate), addDays(selectedWeekStart, dayIndex)),
    ),
    startTime: Math.min(targetStart, timelineEnd - copiedCourse.duration),
    studentIds: [...copiedCourse.studentIds],
  };
  const conflicts = getSeriesConflicts(candidate);
  if (conflicts.length && !await requestCourseConflictConfirmation(candidate, conflicts)) {
    showStatus("已取消粘贴，请选择其他时间刻度");
    return;
  }

  isPastingCourse = true;
  const saved = await createCourse(candidate, `“${candidate.name}”已粘贴，可继续选择时间刻度`, conflicts.length > 0);
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
    repeatEndDate: course.repeatEndDate,
    repeatWeekdays: [...course.repeatWeekdays],
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
  document.querySelector("#dialogRepeat").textContent = `${getRepeatDescription(course.repeatIntervalDays, course.repeatCount, course.repeatEndDate, course.repeatWeekdays)} · 首次 ${formatFullDate(parseISODate(course.startDate))}`;
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
  customWeekdayField.hidden = repeatInput.value !== "weekdays";
  repeatStopField.hidden = !isRepeating;
  repeatCountField.hidden = !isRepeating || repeatStopInput.value !== "count";
  repeatEndDateField.hidden = !isRepeating || repeatStopInput.value !== "date";
  repeatEndDateInput.min = dayStartInput.value;
}

function getDefaultRepeatEndDate(interval) {
  if (!dayStartInput.value || interval === null) return "";
  return toISODate(addDays(parseISODate(dayStartInput.value), interval * 3));
}

function ensureRepeatEndDateValue(interval) {
  repeatEndDateInput.min = dayStartInput.value;
  if (!repeatEndDateInput.value || repeatEndDateInput.value < dayStartInput.value) {
    repeatEndDateInput.value = getDefaultRepeatEndDate(interval);
  }
}

function setRepeatWeekdayControls(values = []) {
  const selected = new Set(normalizeRepeatWeekdays(values));
  document.querySelectorAll('#customWeekdayField input[name="repeatWeekdays"]').forEach((input) => {
    input.checked = selected.has(Number(input.value));
  });
}

function readRepeatWeekdays() {
  if (repeatInput.value !== "weekdays") return [];
  return normalizeRepeatWeekdays(Array.from(
    document.querySelectorAll('#customWeekdayField input[name="repeatWeekdays"]:checked'),
    (input) => Number(input.value),
  ));
}

function ensureDefaultRepeatWeekday() {
  if (repeatInput.value !== "weekdays" || readRepeatWeekdays().length || !dayStartInput.value) return;
  const weekday = getISOWeekday(parseISODate(dayStartInput.value));
  const input = document.querySelector(`#customWeekdayField input[name="repeatWeekdays"][value="${weekday}"]`);
  if (input) input.checked = true;
}

function setRepeatControls(interval, count, endDate = null, repeatWeekdays = []) {
  if (interval === null) repeatInput.value = "";
  else if (repeatWeekdays.length) repeatInput.value = "weekdays";
  else if (repeatPresets.has(interval)) repeatInput.value = String(interval);
  else repeatInput.value = "custom";
  repeatDaysInput.value = String(interval ?? 4);
  setRepeatWeekdayControls(repeatWeekdays);
  repeatStopInput.value = interval !== null && endDate ? "date" : (interval !== null && count !== null ? "count" : "");
  repeatCountInput.value = String(count ?? 2);
  repeatEndDateInput.value = endDate || "";
  updateRepeatFields();
  if (repeatStopInput.value === "date") ensureRepeatEndDateValue(interval);
}

function readRepeatInterval() {
  if (repeatInput.value === "") return null;
  if (repeatInput.value === "custom") return Number(repeatDaysInput.value);
  if (repeatInput.value === "weekdays") return 7;
  return Number(repeatInput.value);
}

function readRepeatEndDate(interval) {
  if (interval === null || repeatStopInput.value !== "date") return null;
  return repeatEndDateInput.value || null;
}

function readRepeatCount(interval, endDate = readRepeatEndDate(interval), repeatWeekdays = readRepeatWeekdays()) {
  if (interval === null) return 1;
  if (endDate) {
    if (repeatWeekdays.length) {
      return countWeekdayOccurrences(parseISODate(dayStartInput.value), parseISODate(endDate), repeatWeekdays);
    }
    const difference = daysBetween(parseISODate(dayStartInput.value), parseISODate(endDate));
    return difference < 0 ? 0 : Math.floor(difference / interval) + 1;
  }
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
  dayStartInput.value = course?.startDate || toISODate(selectedCalendarDate);
  startTimeInput.value = formatTime(course?.startTime ?? timelineStart);
  setDurationValue(course?.duration ?? 100);
  document.querySelector("#courseNotesInput").value = course?.notes || "";
  setRepeatControls(
    repeatInterval,
    repeatInterval === null ? 1 : (course?.repeatCount ?? null),
    course?.repeatEndDate || null,
    course?.repeatWeekdays || [],
  );
  setCourseColor(course?.color || "");
  renderStudentChecklist(course?.studentIds || []);
}

function renderStudentChecklist(selectedIds) {
  const selected = new Set(selectedIds);
  const checklist = document.querySelector("#studentChecklist");
  checklist.replaceChildren();
  [...students].sort(compareStudentNames).forEach((student) => {
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

function toSaveCourseParams(course, expectedVersion, allowConflict = false) {
  return {
    p_id: course.id,
    p_start_date: course.startDate,
    p_repeat_interval_days: course.repeatIntervalDays,
    p_repeat_count: course.repeatCount,
    p_repeat_end_date: course.repeatEndDate || null,
    p_repeat_weekdays: course.repeatWeekdays?.length ? course.repeatWeekdays : null,
    p_start_time: course.startTime,
    p_duration: course.duration,
    p_name: course.name,
    p_notes: course.notes,
    p_color: course.color || null,
    p_student_ids: course.studentIds,
    p_allow_conflict: allowConflict,
    p_expected_version: expectedVersion,
  };
}

async function createCourse(candidate, successMessage = "课程已创建并实时同步", allowConflict = false) {
  if (!canEdit) return false;
  const newCourse = {
    ...candidate,
    id: window.crypto?.randomUUID?.() || `course-${Date.now()}`,
  };
  const { data, error } = await supabaseClient.rpc("save_course", toSaveCourseParams(newCourse, null, allowConflict));

  if (error) {
    showStatus(describeSaveError(error));
    return false;
  }

  const savedCourse = { ...mapCourse(Array.isArray(data) ? data[0] : data), studentIds: newCourse.studentIds };
  schedule.push(savedCourse);
  sortSchedule();
  renderSchedule();
  if (studentSortMode === "class") renderStudentList();
  showStatus(successMessage);
  return true;
}

async function persistCourseUpdate(original, candidate, successMessage, allowConflict = false) {
  if (!canEdit) {
    showStatus("当前为只读模式，请先以曾老师账号登录");
    renderSchedule();
    return false;
  }

  const { data, error } = await supabaseClient.rpc(
    "save_course",
    toSaveCourseParams({ ...candidate, id: original.id }, original.version, allowConflict),
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
  if (studentSortMode === "class") renderStudentList();
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
  if (canEdit && studentSortMode === "class") renderStudentList();
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

async function applyCoinShopRealtimeChange() {
  if (!currentUser) return;
  await loadCoinShopProducts({ quiet: true });
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
  if (realtimeCoinShopChannel) supabaseClient.removeChannel(realtimeCoinShopChannel);
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
      if (canEdit && !attendanceManagementPage.hidden) {
        await Promise.all([loadAttendance(), loadAttendanceHistory({ quiet: true })]);
      }
    })
    .subscribe();
  realtimeCoinShopChannel = supabaseClient
    .channel("coin-shop-live")
    .on("postgres_changes", { event: "*", schema: "public", table: "coin_shop_products" }, applyCoinShopRealtimeChange)
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

const attendanceStatusOptions = [
  { value: "present", label: "到课", icon: "check", className: "is-present" },
  { value: "makeup", label: "补课", icon: "book-open-check", className: "is-makeup" },
  { value: "leave", label: "请假", icon: "calendar-off", className: "is-leave" },
];

function formatAttendanceDay(value, includeYear = false) {
  const date = parseISODate(value);
  return `${includeYear ? `${date.getFullYear()} 年 ` : ""}${date.getMonth() + 1} 月 ${date.getDate()} 日`;
}

async function loadAttendance() {
  if (!canEdit) return false;
  selectedAttendanceDate ||= toISODate(getScheduleToday());
  const { data, error } = await supabaseClient.rpc("get_attendance_for_date_v2", {
    p_attendance_date: selectedAttendanceDate,
  });
  if (error) {
    attendanceRecords = [];
    renderAttendance();
    showStatus("所选日期的打卡记录读取失败，请稍后重试");
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

async function loadAttendanceHistory({ quiet = false } = {}) {
  if (!canEdit) return false;
  const { data, error } = await supabaseClient.rpc("get_attendance_history_v2", { p_limit_days: 30 });
  if (error) {
    attendanceHistory = [];
    renderAttendanceHistory();
    if (!quiet) showStatus("历史打卡记录读取失败，请稍后重试");
    return false;
  }
  attendanceHistory = (data || []).map((record) => ({
    ...record,
    attendance_date: record.attendance_date || "",
    status: record.status || "",
    course_names: record.course_names || "历史课程",
  }));
  renderAttendanceHistory();
  return true;
}

async function selectAttendanceDate(value) {
  const today = toISODate(getScheduleToday());
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value > today || attendanceBusy) return;
  selectedAttendanceDate = value;
  document.querySelector("#attendanceDatePicker").value = value;
  await loadAttendance();
  renderAttendanceHistory();
}

function renderAttendance() {
  const list = document.querySelector("#attendanceList");
  if (!list) return;
  const todayIso = toISODate(getScheduleToday());
  selectedAttendanceDate ||= todayIso;
  document.querySelector("#attendanceDateLabel").textContent = `${formatAttendanceDay(selectedAttendanceDate)}${selectedAttendanceDate === todayIso ? " · 今天" : ""}`;
  const presentCount = attendanceRecords.filter((record) => record.status === "present").length;
  const makeupCount = attendanceRecords.filter((record) => record.status === "makeup").length;
  const leaveCount = attendanceRecords.filter((record) => record.status === "leave").length;
  const pendingCount = attendanceRecords.filter((record) => !record.status).length;
  document.querySelector("#attendanceSummary").textContent = `${attendanceRecords.length} 名学生 · 到课 ${presentCount} · 补课 ${makeupCount} · 请假 ${leaveCount} · 待打卡 ${pendingCount}`;
  const datePicker = document.querySelector("#attendanceDatePicker");
  datePicker.max = todayIso;
  datePicker.value = selectedAttendanceDate;
  document.querySelector("#showTodayAttendance").disabled = selectedAttendanceDate === todayIso || attendanceBusy;
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
    attendanceStatusOptions.forEach(({ value, label, icon, className }) => {
      const button = createElement("button", `secondary-button attendance-status-button ${className}${record.status === value ? " is-selected" : ""}`);
      button.type = "button";
      button.disabled = attendanceBusy;
      button.innerHTML = `<i data-lucide="${icon}"></i><span>${label}</span>`;
      button.addEventListener("click", () => setAttendanceStatus(record.student_id, value));
      controls.append(button);
    });
    row.append(identity, progress, controls);
    list.append(row);
  });
  document.querySelector("#attendanceEmpty").hidden = attendanceRecords.length > 0;
  document.querySelector("#markAllPresent").disabled = attendanceBusy || attendanceRecords.length === 0;
  if (selectedAttendanceDate === todayIso) document.querySelector("#adminAttendanceCount").textContent = `${pendingCount} 人待打卡`;
  if (window.lucide) window.lucide.createIcons();
}

function renderAttendanceHistory() {
  const list = document.querySelector("#attendanceHistoryList");
  if (!list) return;
  const groups = new Map();
  attendanceHistory.forEach((record) => {
    if (!groups.has(record.attendance_date)) groups.set(record.attendance_date, []);
    groups.get(record.attendance_date).push(record);
  });
  list.replaceChildren(...[...groups.entries()].map(([date, records]) => {
    const article = createElement("article", `attendance-history-day${date === selectedAttendanceDate ? " is-selected" : ""}`);
    const heading = createElement("div", "attendance-history-day-heading");
    const dateButton = createElement("button", "attendance-history-date");
    dateButton.type = "button";
    dateButton.textContent = formatAttendanceDay(date, parseISODate(date).getFullYear() !== getScheduleToday().getFullYear());
    dateButton.addEventListener("click", () => selectAttendanceDate(date));
    const summary = createElement("span", "", attendanceStatusOptions
      .map(({ value, label }) => `${label} ${records.filter((record) => record.status === value).length}`)
      .join(" · "));
    heading.append(dateButton, summary);
    const statusGrid = createElement("div", "attendance-history-status-grid");
    attendanceStatusOptions.forEach(({ value, label, icon, className }) => {
      const statusGroup = createElement("div", `attendance-history-status ${className}`);
      const title = createElement("strong", "", "");
      title.innerHTML = `<i data-lucide="${icon}"></i><span>${label}</span>`;
      const names = records.filter((record) => record.status === value);
      const nameList = createElement("div", "attendance-history-names");
      nameList.replaceChildren(...(names.length
        ? names.map((record) => {
          const name = createElement("span", "", record.username || "学生");
          name.title = record.course_names;
          return name;
        })
        : [createElement("small", "", "无人")]));
      statusGroup.append(title, nameList);
      statusGrid.append(statusGroup);
    });
    article.append(heading, statusGrid);
    return article;
  }));
  document.querySelector("#attendanceHistoryEmpty").hidden = attendanceHistory.length > 0;
  if (window.lucide) window.lucide.createIcons();
}

async function setAttendanceStatus(studentId, status) {
  if (!canEdit || attendanceBusy) return;
  const record = attendanceRecords.find((item) => item.student_id === studentId);
  const student = students.find((item) => item.id === studentId);
  const remainingLessons = Math.max(
    0,
    (Number(student?.required_lesson_count) || 0) - (Number(student?.current_lesson_count) || 0),
  );
  if (status === "present" && record?.status !== "present" && student && remainingLessons === 0) {
    showStatus(`${record?.username || student?.username || "该学生"}无法进行打卡，课程次数不足`);
    return;
  }
  attendanceBusy = true;
  renderAttendance();
  const { error } = await supabaseClient.rpc("set_attendance_for_date_v2", {
    p_student_id: studentId,
    p_attendance_date: selectedAttendanceDate,
    p_status: status,
  });
  attendanceBusy = false;
  if (error) {
    if (String(error.message || "").includes("课程次数不足")) {
      showStatus(error.message);
    } else {
      showStatus("打卡保存失败，请确认学生在所选日期有分配课程");
    }
    renderAttendance();
    return;
  }
  await Promise.all([loadStudents(), loadAttendance(), loadAttendanceHistory({ quiet: true })]);
  const messages = {
    present: "已登记到课；只有到课计入当前已上次数",
    makeup: "已登记补课；当前已上次数不变",
    leave: "已登记请假；当前已上次数不变",
  };
  showStatus(messages[status] || "打卡已保存");
}

async function markAllStudentsPresent() {
  if (!canEdit || attendanceBusy || attendanceRecords.length === 0) return;
  const insufficientNames = attendanceRecords
    .filter((record) => {
      if (record.status === "present") return false;
      const student = students.find((item) => item.id === record.student_id);
      return student
        && (Number(student.required_lesson_count) || 0) <= (Number(student.current_lesson_count) || 0);
    })
    .map((record) => record.username || students.find((item) => item.id === record.student_id)?.username || "该学生");
  attendanceBusy = true;
  renderAttendance();
  const { data, error } = await supabaseClient.rpc("mark_all_attendance_present_v2", {
    p_attendance_date: selectedAttendanceDate,
  });
  attendanceBusy = false;
  if (error) {
    showStatus("一键到课失败，请稍后重试");
    renderAttendance();
    return;
  }
  await Promise.all([loadStudents(), loadAttendance(), loadAttendanceHistory({ quiet: true })]);
  const checkedInCount = Number(data) || 0;
  const successMessage = checkedInCount > 0
    ? `已登记 ${formatAttendanceDay(selectedAttendanceDate)} ${checkedInCount} 名学生到课`
    : "没有可新增的到课记录";
  showStatus(insufficientNames.length
    ? `${successMessage}；${insufficientNames.join("、")}无法进行打卡，课程次数不足`
    : successMessage);
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

function compareStudentNames(first, second) {
  return first.username.localeCompare(second.username, "zh-CN-u-co-pinyin", { sensitivity: "base" });
}

function getStudentRemainingCount(student) {
  return Math.max(
    (Number(student.required_lesson_count) || 0) - (Number(student.current_lesson_count) || 0),
    0,
  );
}

function compareClassCourses(first, second) {
  return first.startDate.localeCompare(second.startDate)
    || first.startTime - second.startTime
    || first.name.localeCompare(second.name, "zh-CN-u-co-pinyin", { sensitivity: "base" });
}

function getStudentClassGroups() {
  const studentById = new Map(students.map((student) => [student.id, student]));
  const parent = new Map(students.map((student) => [student.id, student.id]));
  const assignedStudentIds = new Set();
  const relatedCourses = [];

  const findRoot = (studentId) => {
    let root = studentId;
    while (parent.get(root) !== root) root = parent.get(root);
    let current = studentId;
    while (parent.get(current) !== current) {
      const next = parent.get(current);
      parent.set(current, root);
      current = next;
    }
    return root;
  };

  const connectStudents = (firstId, secondId) => {
    const firstRoot = findRoot(firstId);
    const secondRoot = findRoot(secondId);
    if (firstRoot !== secondRoot) parent.set(secondRoot, firstRoot);
  };

  schedule.forEach((course) => {
    const studentIds = [...new Set(course.studentIds.filter((studentId) => studentById.has(studentId)))];
    if (!studentIds.length) return;
    studentIds.forEach((studentId) => assignedStudentIds.add(studentId));
    studentIds.slice(1).forEach((studentId) => connectStudents(studentIds[0], studentId));
    relatedCourses.push({ course, studentIds });
  });

  const groupsByRoot = new Map();
  students.forEach((student) => {
    if (!assignedStudentIds.has(student.id)) return;
    const root = findRoot(student.id);
    if (!groupsByRoot.has(root)) groupsByRoot.set(root, { students: [], courses: [] });
    groupsByRoot.get(root).students.push(student);
  });

  relatedCourses.forEach(({ course, studentIds }) => {
    const group = groupsByRoot.get(findRoot(studentIds[0]));
    if (group) group.courses.push({ ...course, assignedStudentCount: studentIds.length });
  });

  const assignedGroups = [...groupsByRoot.values()].map((group) => {
    const chronologicalCourses = [...group.courses].sort(compareClassCourses);
    const primaryCourse = [...group.courses].sort((first, second) => (
      second.assignedStudentCount - first.assignedStudentCount || compareClassCourses(first, second)
    ))[0];
    const courseNames = [...new Set(chronologicalCourses.map((course) => course.name))];
    return {
      label: primaryCourse?.name || "已分班",
      detail: `${group.students.length} 人 · ${courseNames.length} 门课程关联`,
      title: courseNames.length ? `关联课程：${courseNames.join("、")}` : "根据课程分配自动识别",
      firstCourse: chronologicalCourses[0],
      students: [...group.students].sort(compareStudentNames),
    };
  }).sort((first, second) => compareClassCourses(first.firstCourse, second.firstCourse));

  const unassignedStudents = students
    .filter((student) => !assignedStudentIds.has(student.id))
    .sort(compareStudentNames);
  if (unassignedStudents.length) {
    assignedGroups.push({
      label: "未分班",
      detail: `${unassignedStudents.length} 人 · 暂无课程分配`,
      title: "这些学生尚未被分配到任何课程",
      students: unassignedStudents,
      isUnassigned: true,
    });
  }
  return assignedGroups;
}

function getStudentListSections() {
  if (studentSortMode === "class") return getStudentClassGroups();
  let orderedStudents = students;
  if (studentSortMode === "surname") orderedStudents = [...students].sort(compareStudentNames);
  if (["remaining-asc", "remaining-desc"].includes(studentSortMode)) {
    const direction = studentSortMode === "remaining-asc" ? 1 : -1;
    orderedStudents = [...students].sort((first, second) => (
      direction * (getStudentRemainingCount(first) - getStudentRemainingCount(second))
      || compareStudentNames(first, second)
    ));
  }
  return [{ students: orderedStudents }];
}

function createStudentClassDivider(group) {
  const divider = createElement("div", `student-class-divider${group.isUnassigned ? " is-unassigned" : ""}`);
  divider.title = group.title;
  const label = createElement("strong", "", group.isUnassigned ? group.label : `班级：${group.label}`);
  const detail = createElement("span", "", group.detail);
  divider.append(label, detail);
  return divider;
}

function setStudentAutoSaveState(element, state, studentName) {
  const labels = {
    saved: "已自动保存",
    pending: "等待自动保存",
    saving: "正在自动保存",
    error: "自动保存失败",
  };
  element.className = `student-auto-save-state is-${state}`;
  element.title = `${studentName}${labels[state]}`;
  element.setAttribute("aria-label", `${studentName}${labels[state]}`);
}

function renderStudentList() {
  const list = document.querySelector("#studentList");
  list.replaceChildren();
  getStudentListSections().forEach((section) => {
    if (studentSortMode === "class") list.append(createStudentClassDivider(section));
    section.students.forEach((student) => {
    const row = createElement("div", `student-row${studentSortMode === "manual" ? " is-draggable" : ""}`);
    row.dataset.studentId = student.id;
    row.draggable = studentSortMode === "manual";
    let selectedColor = student.color || "";
    let requestAutoSave = () => {};

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
      requestAutoSave(true);
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
    updateRemaining();

    const autoSaveState = createElement("span", "student-auto-save-state is-saved");
    autoSaveState.setAttribute("role", "status");
    autoSaveState.setAttribute("aria-live", "polite");
    autoSaveState.innerHTML = [
      '<span class="student-save-icon is-saved-icon"><i data-lucide="cloud-check"></i></span>',
      '<span class="student-save-icon is-progress-icon"><i data-lucide="loader-circle"></i></span>',
      '<span class="student-save-icon is-error-icon"><i data-lucide="circle-alert"></i></span>',
    ].join("");
    setStudentAutoSaveState(autoSaveState, "saved", student.username);

    let autoSaveTimer = null;
    let saveInProgress = false;
    let saveQueued = false;
    let needsRemainingResort = false;

    const refreshRemainingSortWhenReady = () => {
      if (!["remaining-asc", "remaining-desc"].includes(studentSortMode)) return;
      if (row.contains(document.activeElement)) {
        needsRemainingResort = true;
        return;
      }
      renderStudentList();
    };

    const flushAutoSave = async () => {
      autoSaveTimer = null;
      if (saveInProgress) return;
      saveQueued = false;
      saveInProgress = true;
      setStudentAutoSaveState(autoSaveState, "saving", student.username);
      const saved = await saveStudentLearningProfile(student.id, {
        currentCount: Number(currentField.input.value),
        requiredCount: Number(requiredField.input.value),
        lifetimeCount: student.lesson_count,
        color: selectedColor,
      });
      saveInProgress = false;
      if (!saved) {
        setStudentAutoSaveState(autoSaveState, "error", student.username);
        return;
      }
      if (saveQueued) {
        requestAutoSave(true);
        return;
      }
      setStudentAutoSaveState(autoSaveState, "saved", student.username);
      refreshRemainingSortWhenReady();
    };

    requestAutoSave = (immediate = false) => {
      saveQueued = true;
      if (autoSaveTimer !== null) window.clearTimeout(autoSaveTimer);
      setStudentAutoSaveState(autoSaveState, "pending", student.username);
      autoSaveTimer = window.setTimeout(flushAutoSave, immediate ? 0 : 700);
    };

    [currentField.input, requiredField.input].forEach((input) => {
      input.addEventListener("input", () => {
        updateRemaining();
        requestAutoSave();
      });
      input.addEventListener("change", () => requestAutoSave(true));
      input.addEventListener("keydown", (event) => {
        if (event.key !== "Enter") return;
        event.preventDefault();
        requestAutoSave(true);
        input.blur();
      });
    });
    row.addEventListener("focusout", () => {
      window.setTimeout(() => {
        if (!needsRemainingResort || row.contains(document.activeElement)
          || saveInProgress || saveQueued || autoSaveTimer !== null) return;
        needsRemainingResort = false;
        renderStudentList();
      }, 0);
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
    actions.append(autoSaveState, removeButton);
    row.append(identity, currentField.label, requiredField.label, remaining, actions);
    if (studentSortMode === "manual") bindStudentRowDrag(row, student.id);
    list.append(row);
    });
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
  studentSortMode = studentSortModes.has(value) ? value : "manual";
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

async function saveStudentLearningProfile(studentId, profile) {
  if (!canEdit) return false;
  const currentCount = Number(profile.currentCount);
  const requiredCount = Number(profile.requiredCount);
  const lifetimeCount = Number(profile.lifetimeCount) || 0;
  const counts = [currentCount, requiredCount, lifetimeCount];
  if (counts.some((count) => !Number.isInteger(count) || count < 0 || count > 100000)) {
    showStatus("课次数需为 0 - 100000 的整数");
    return false;
  }

  const { error } = await supabaseClient.rpc("set_student_learning_profile", {
    p_student_id: studentId,
    p_current_count: currentCount,
    p_required_count: requiredCount,
    p_lifetime_count: lifetimeCount,
    p_color: profile.color || null,
  });
  if (error) {
    showStatus("学生课程进度自动保存失败，请稍后重试");
    await loadStudents();
    return false;
  }

  const student = students.find((item) => item.id === studentId);
  if (student) {
    student.current_lesson_count = currentCount;
    student.required_lesson_count = requiredCount;
    student.lesson_count = lifetimeCount;
    student.color = profile.color || "";
  }
  renderSchedule();
  return true;
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
    if (realtimeCoinShopChannel) await supabaseClient.removeChannel(realtimeCoinShopChannel);
    realtimeChannel = null;
    realtimeAssignmentChannel = null;
    realtimeStudentChannel = null;
    realtimeBattleChannel = null;
    realtimeAttendanceChannel = null;
    realtimeCoinShopChannel = null;
    attendanceRecords = [];
    attendanceHistory = [];
    selectedAttendanceDate = "";
    petBattleHistory = [];
    petLeaderboard = [];
    adminPetComparison = null;
    questionBank = [];
    importedQuestions = [];
    coinShopProducts = [];
    selectedCoinShopProductId = null;
    selectedCoinShopPurchaseId = null;
    autoFocusedScheduleDate = "";
    yearViewAutoScrollPending = false;
    resetCoinShopForm();
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
  document.querySelector("#openStudentChallenge").hidden = canEdit || !currentUser;
  subscribeToCourses();
}

async function handleCourseSubmit(event) {
  event.preventDefault();
  if (!canEdit || !["create", "edit"].includes(formMode)) return;
  const existing = schedule.find((item) => item.id === selectedCourseId);
  if (formMode === "edit" && !existing) return;
  const repeatIntervalDays = readRepeatInterval();
  const repeatWeekdays = readRepeatWeekdays();
  const repeatEndDate = readRepeatEndDate(repeatIntervalDays);

  const candidate = {
    ...(existing || {}),
    startDate: dayStartInput.value,
    repeatIntervalDays,
    repeatCount: readRepeatCount(repeatIntervalDays, repeatEndDate, repeatWeekdays),
    repeatEndDate,
    repeatWeekdays,
    startTime: parseTime(startTimeInput.value),
    duration: Number(durationInput.value),
    name: document.querySelector("#courseNameInput").value.trim(),
    notes: document.querySelector("#courseNotesInput").value.trim(),
    color: courseColorInput.value,
    studentIds: readSelectedStudentIds(),
  };

  if (!candidate.startDate || candidate.startTime % snapMinutes !== 0 || candidate.startTime < timelineStart || getCourseEnd(candidate) > timelineEnd) {
    showStatus("课程时间需在 06:00 - 次日 00:00 内，并按 10 分钟设置");
    return;
  }
  if (candidate.repeatIntervalDays !== null && (!Number.isInteger(candidate.repeatIntervalDays) || candidate.repeatIntervalDays < 1 || candidate.repeatIntervalDays > 365)) {
    showStatus("重复间隔需为 1 - 365 天的整数");
    return;
  }
  if (repeatInput.value === "weekdays" && candidate.repeatWeekdays.length === 0) {
    showStatus("请至少选择一个每周重复日期");
    return;
  }
  if (candidate.repeatWeekdays.length && !candidate.repeatWeekdays.includes(getISOWeekday(parseISODate(candidate.startDate)))) {
    showStatus("首次上课日期对应的星期必须包含在重复日期中");
    return;
  }
  if (candidate.repeatIntervalDays !== null && repeatStopInput.value === "date"
    && (!candidate.repeatEndDate || candidate.repeatEndDate < candidate.startDate)) {
    showStatus("截止日期不能早于首次上课日期");
    return;
  }
  if (candidate.repeatIntervalDays !== null && candidate.repeatCount !== null
    && (!Number.isInteger(candidate.repeatCount) || candidate.repeatCount < 1 || candidate.repeatCount > 10000)) {
    showStatus("重复次数需为 1 - 10000 的整数，并包含首次课程");
    return;
  }
  const conflicts = getSeriesConflicts(candidate, existing?.id);
  if (conflicts.length && !await requestCourseConflictConfirmation(candidate, conflicts)) {
    showStatus("已取消保存，请调整课程时间或学生");
    return;
  }

  saveCourseButton.disabled = true;
  const saved = formMode === "create"
    ? await createCourse(candidate, "课程已创建并实时同步", conflicts.length > 0)
    : await persistCourseUpdate(existing, candidate, "课程信息已保存并实时同步", conflicts.length > 0);
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
  const lookup = await supabaseClient.rpc("resolve_login_email", { p_username: username });
  const loginEmail = lookup.data;
  const lookupError = lookup.error;
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
  document.querySelector("#previousWeek").addEventListener("click", () => shiftSelectedSchedulePeriod(-1));
  document.querySelector("#nextWeek").addEventListener("click", () => shiftSelectedSchedulePeriod(1));
  document.querySelector("#currentWeek").addEventListener("click", openSchedulePeriodOverview);
  scheduleViewSwitcher.addEventListener("click", (event) => {
    const button = event.target.closest("[data-schedule-view]");
    if (button) setScheduleView(button.dataset.scheduleView);
  });
  pageFontSizeInput.addEventListener("input", (event) => setPageFontSize(event.target.value));
  resetPageFontSize.addEventListener("click", () => setPageFontSize(defaultPageFontSize));
  document.querySelector("#closeWeekOverview").addEventListener("click", () => weekOverviewDialog.close());
  document.querySelector("#previousWeekYear").addEventListener("click", () => {
    if (scheduleView === "year") yearPickerStart -= 12;
    else weekOverviewYear -= 1;
    renderSchedulePeriodOverview();
  });
  document.querySelector("#nextWeekYear").addEventListener("click", () => {
    if (scheduleView === "year") yearPickerStart += 12;
    else weekOverviewYear += 1;
    renderSchedulePeriodOverview();
  });
  periodYearJumpForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const targetYear = Number.parseInt(periodYearInput.value, 10);
    if (!Number.isInteger(targetYear) || targetYear < 1900 || targetYear > 2200) {
      periodYearInput.reportValidity();
      return;
    }
    if (scheduleView === "year") {
      selectedCalendarDate = new Date(targetYear, 0, 1);
      selectedWeekStart = startOfWeek(selectedCalendarDate);
      renderSchedule();
      weekOverviewDialog.close();
      return;
    }
    weekOverviewYear = targetYear;
    renderSchedulePeriodOverview();
  });
  document.querySelector("#todayButton").addEventListener("click", () => {
    selectedCalendarDate = new Date(scheduleToday);
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
    if (!customWeekdayField.hidden) {
      ensureDefaultRepeatWeekday();
      customWeekdayField.querySelector('input[name="repeatWeekdays"]:checked')?.focus();
    }
    if (repeatStopInput.value === "date") ensureRepeatEndDateValue(readRepeatInterval());
  });
  repeatStopInput.addEventListener("change", () => {
    updateRepeatFields();
    if (!repeatCountField.hidden) repeatCountInput.focus();
    if (!repeatEndDateField.hidden) {
      ensureRepeatEndDateValue(readRepeatInterval());
      repeatEndDateInput.focus();
    }
  });
  dayStartInput.addEventListener("change", () => {
    updateRepeatFields();
    if (repeatStopInput.value === "date") ensureRepeatEndDateValue(readRepeatInterval());
  });
  document.querySelector("#cancelCourseConflict").addEventListener("click", () => settleCourseConflict(false));
  document.querySelector("#confirmCourseConflict").addEventListener("click", () => settleCourseConflict(true));
  courseConflictDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    settleCourseConflict(false);
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
  document.querySelector("#openCoinShopManagement").addEventListener("click", showCoinShop);
  document.querySelector("#openChallengeRecords").addEventListener("click", showChallengeRecords);
  document.querySelector("#openQuestionBank").addEventListener("click", showQuestionBank);
  document.querySelector("#openStudentChallenge").addEventListener("click", showStudentChallenge);
  document.querySelector("#challengeCoinShopShortcut").addEventListener("click", showCoinShop);
  document.querySelector("#closeStudentManagement").addEventListener("click", showAdminHub);
  document.querySelector("#closeAttendanceManagement").addEventListener("click", showAdminHub);
  document.querySelector("#closePetManagement").addEventListener("click", showAdminHub);
  document.querySelector("#closePetBattleHistory").addEventListener("click", showPetManagement);
  document.querySelector("#openPetLeaderboard").addEventListener("click", () => showPetLeaderboard(canEdit ? "admin" : "schedule"));
  document.querySelector("#closePetLeaderboard").addEventListener("click", () => {
    if (petLeaderboardReturnView === "admin") showAdminHub();
    else showScheduleView();
  });
  document.querySelector("#closeCoinShop").addEventListener("click", () => {
    if (canEdit) showAdminHub();
    else showStudentChallenge();
  });
  document.querySelector("#refreshCoinShop").addEventListener("click", () => loadCoinShopProducts());
  document.querySelector("#coinShopImageInput").addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (file) updateCoinShopImagePreview(file);
    else clearCoinShopImagePreview();
  });
  document.querySelector("#coinShopForm").addEventListener("submit", addCoinShopProduct);
  document.querySelector("#cancelCoinShopDelete").addEventListener("click", () => document.querySelector("#coinShopDeleteDialog").close());
  document.querySelector("#confirmCoinShopDelete").addEventListener("click", deleteSelectedCoinShopProduct);
  document.querySelector("#coinShopDeleteDialog").addEventListener("close", () => {
    selectedCoinShopProductId = null;
  });
  document.querySelector("#cancelCoinShopPurchase").addEventListener("click", () => document.querySelector("#coinShopPurchaseDialog").close());
  document.querySelector("#confirmCoinShopPurchase").addEventListener("click", purchaseSelectedCoinShopProduct);
  document.querySelector("#coinShopPurchaseDialog").addEventListener("close", () => {
    selectedCoinShopPurchaseId = null;
  });
  document.querySelector("#closeStudentChallenge").addEventListener("click", showScheduleView);
  document.querySelector("#closeChallengeRecords").addEventListener("click", showAdminHub);
  document.querySelector("#refreshChallengeRecords").addEventListener("click", loadAdminChallengeRecords);
  document.querySelector("#closeQuestionBank").addEventListener("click", showAdminHub);
  document.querySelector("#refreshQuestionBank").addEventListener("click", () => loadQuestionBank());
  document.querySelector("#closeQuestionReview").addEventListener("click", showQuestionBank);
  document.querySelector("#cancelQuestionImport").addEventListener("click", () => {
    importedQuestions = [];
    document.querySelector("#questionBankFile").value = "";
    document.querySelector("#importQuestionPreview").disabled = true;
    showQuestionBank();
  });
  document.querySelector("#applyReviewBank").addEventListener("click", () => {
    const bankId = document.querySelector("#questionReviewBank").value;
    if (!bankId) return showStatus("请选择要应用的子题库");
    importedQuestions.forEach((question) => { question.bank_id = bankId; });
    renderImportedQuestionPreview();
  });
  document.querySelector("#createReviewBank").addEventListener("click", async () => {
    const nameInput = document.querySelector("#questionReviewNewBankName");
    const name = nameInput.value.trim();
    if (!name) return showStatus("请输入子题库名称");
    const { data, error } = await supabaseClient.rpc("create_pet_challenge_bank", { p_name: name, p_challenge_type: "mixed" });
    if (error) return showStatus("子题库创建失败，请重试");
    const bankId = Array.isArray(data) ? data[0] : data;
    await loadQuestionBank({ quiet: true });
    importedQuestions.forEach((question) => { if (!question.bank_id) question.bank_id = bankId; });
    nameInput.value = ""; renderImportedQuestionPreview(); showStatus(`已创建子题库“${name}”并应用`);
  });
  document.querySelector("#questionBankCreateForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const nameInput = document.querySelector("#newQuestionBankName");
    const name = nameInput.value.trim();
    if (!name) return;
    const { error } = await supabaseClient.rpc("create_pet_challenge_bank", { p_name: name, p_challenge_type: "mixed" });
    if (error) { showStatus("子题库创建失败，请检查名称是否重复"); return; }
    nameInput.value = ""; await loadQuestionBank({ quiet: true }); showStatus(`子题库“${name}”已创建`);
  });
  ["#questionTypeFilter", "#questionBankFilter", "#questionSearchInput"].forEach((selector) => {
    document.querySelector(selector).addEventListener("input", renderQuestionBank);
    document.querySelector(selector).addEventListener("change", renderQuestionBank);
  });
  document.querySelector("#questionBankFile").addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    document.querySelector("#importQuestionPreview").disabled = !file;
    document.querySelector("#questionImportStatus").textContent = file ? `${file.name} · 准备识别` : "等待选择 Word、PDF 或图片文件";
  });
  document.querySelector("#importQuestionPreview").addEventListener("click", previewQuestionDocument);
  document.querySelector("#saveImportedQuestions").addEventListener("click", saveImportedQuestions);
  document.querySelector("#showChoiceChallenge").addEventListener("click", () => setChallengeType("choice"));
  document.querySelector("#showWordChallenge").addEventListener("click", () => setChallengeType("word"));
  document.querySelector("#studentChallengeBank").addEventListener("change", (event) => {
    challengeState.bankId = event.target.value;
  });
  document.querySelector("#startChallengeSession").addEventListener("click", startChallengeSession);
  document.querySelector("#nextChallengeQuestion").addEventListener("click", loadNextChallengeQuestion);
  document.querySelector("#finishChallengeSession").addEventListener("click", () => {
    challengeState.sessionId = null;
    document.querySelector("#challengeQuestionCard").hidden = true;
    document.querySelector("#challengeStartPanel").hidden = false;
    loadChallengeSummary(); loadAvailableChallengeBanks();
  });
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
  document.querySelector("#attendanceDatePicker").addEventListener("change", (event) => selectAttendanceDate(event.target.value));
  document.querySelector("#showTodayAttendance").addEventListener("click", () => selectAttendanceDate(toISODate(getScheduleToday())));
  document.querySelector("#refreshAttendanceHistory").addEventListener("click", () => Promise.all([loadAttendance(), loadAttendanceHistory()]));
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
  setPageFontSize(window.localStorage.getItem(pageFontSizeStorageKey) ?? defaultPageFontSize, { persist: false });
  const savedStudentSortMode = window.localStorage.getItem("student-sort-mode");
  studentSortMode = studentSortModes.has(savedStudentSortMode) ? savedStudentSortMode : "manual";
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
