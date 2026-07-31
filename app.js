const SUPABASE_URL = "https://dpjyjzszqmgakwtdhmwq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_PyH98bSXQ2rSCzIfmLNN5w_4rTJ6P-x";
const ADMIN_EMAIL = "703223232@qq.com";
const SITE_URL = "https://jerudite.github.io/course-schedule/";

const days = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
const toneColors = ["#2f6b4f", "#326a88", "#9a533e", "#826b28"];
const timelineStart = 8 * 60;
const timelineEnd = 21 * 60;
const snapMinutes = 10;
const slotCount = (timelineEnd - timelineStart) / snapMinutes;
const semesterStart = startOfWeek(new Date(2026, 1, 16));
const scheduleToday = new Date(2026, 3, 13);
const currentWeekStart = startOfWeek(scheduleToday);
const repeatPresets = new Set([1, 2, 3, 7]);

let selectedWeekStart = new Date(currentWeekStart);
let selectedCourseId = null;
let selectedOccurrenceDate = null;
let formMode = "view";
let schedule = [];
let currentSession = null;
let canEdit = false;
let realtimeChannel = null;
let statusTimer = null;

const grid = document.querySelector("#scheduleGrid");
const scheduleScroll = document.querySelector("#scheduleScroll");
const weekLabel = document.querySelector("#weekLabel");
const weekRange = document.querySelector("#weekRange");
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
const saveCourseButton = document.querySelector("#saveCourse");
const statusMessage = document.querySelector("#statusMessage");
const authButton = document.querySelector("#authButton");
const loginDialog = document.querySelector("#loginDialog");
const loginForm = document.querySelector("#loginForm");
const loginSubmit = document.querySelector("#loginSubmit");
const deleteDialog = document.querySelector("#deleteDialog");
const confirmDeleteButton = document.querySelector("#confirmDelete");

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

function getRepeatDescription(interval) {
  if (interval === null) return "不重复";
  if (interval === 1) return "每天重复";
  if (interval === 7) return "每周重复";
  return `每 ${interval} 天重复`;
}

function getWeekNumber(date) {
  return Math.floor((date - semesterStart) / (7 * 24 * 60 * 60 * 1000)) + 1;
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

function seriesShareADate(first, second) {
  const firstStart = parseISODate(first.startDate);
  const secondStart = parseISODate(second.startDate);
  const difference = daysBetween(secondStart, firstStart);

  if (first.repeatIntervalDays === null && second.repeatIntervalDays === null) {
    return difference === 0;
  }
  if (first.repeatIntervalDays === null) {
    return difference >= 0 && difference % second.repeatIntervalDays === 0;
  }
  if (second.repeatIntervalDays === null) {
    return difference <= 0 && Math.abs(difference) % first.repeatIntervalDays === 0;
  }
  return difference % gcd(first.repeatIntervalDays, second.repeatIntervalDays) === 0;
}

function hasSeriesConflict(candidate, ignoredId) {
  return schedule.some((course) => course.id !== ignoredId
    && candidate.startTime < getCourseEnd(course)
    && getCourseEnd(candidate) > course.startTime
    && seriesShareADate(candidate, course));
}

function courseOccursOnDate(course, date) {
  const difference = daysBetween(parseISODate(course.startDate), date);
  if (difference < 0) return false;
  if (course.repeatIntervalDays === null) return difference === 0;
  return difference % course.repeatIntervalDays === 0;
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
  return {
    id: row.id,
    startDate: row.start_date,
    repeatIntervalDays: row.repeat_interval_days === null ? null : Number(row.repeat_interval_days),
    startTime: Number(row.start_time),
    duration: Number(row.duration),
    name: row.name,
    teacher: row.teacher,
    notes: row.notes || "",
    version: Number(row.version),
    updatedAt: row.updated_at,
  };
}

function toDatabaseCourse(course) {
  return {
    start_date: course.startDate,
    repeat_interval_days: course.repeatIntervalDays,
    start_time: course.startTime,
    duration: course.duration,
    name: course.name,
    teacher: course.teacher,
    notes: course.notes,
  };
}

function getCourseTone(courseId) {
  let hash = 0;
  for (const character of courseId) hash = ((hash << 5) - hash + character.charCodeAt(0)) | 0;
  return Math.abs(hash) % toneColors.length;
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

function updatePermissionUI() {
  document.body.classList.toggle("can-edit", canEdit);
  document.querySelector("#addCourse").hidden = !canEdit;
  dialogCourseActions.hidden = !canEdit || formMode !== "view" || !selectedCourseId;
  document.querySelector("#permissionHint").textContent = canEdit
    ? "管理员模式 · 可新增、编辑、删除或拖动整个课程系列"
    : "只读模式 · 管理员的修改会实时显示在这里";

  if (currentSession) {
    authButton.classList.add("is-authenticated");
    authButton.setAttribute("aria-label", "退出管理员登录");
    authButton.innerHTML = `<i data-lucide="log-out"></i><span>退出登录</span>`;
  } else {
    authButton.classList.remove("is-authenticated");
    authButton.setAttribute("aria-label", "管理员登录");
    authButton.innerHTML = `<i data-lucide="lock-keyhole"></i><span>管理员登录</span>`;
  }

  if (!canEdit && formMode !== "view" && dialog.open) dialog.close();
  if (window.lucide) window.lucide.createIcons();
  renderSchedule();
  refreshOpenDialog();
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
      cell.style.gridColumn = String(dayIndex + 2);
      cell.style.gridRow = String(slot + 2);
      if (sameDay(addDays(selectedWeekStart, dayIndex), scheduleToday)) cell.classList.add("is-today");
      grid.append(cell);
    });
  }

  const occurrences = getVisibleOccurrences();
  occurrences.forEach(({ course, date, dayIndex }) => {
    const tone = getCourseTone(course.id);
    const card = createElement("button", `course-card tone-${tone}${canEdit ? " is-editable" : " is-readonly"}`);
    card.type = "button";
    card.dataset.courseId = course.id;
    card.dataset.occurrenceDate = toISODate(date);
    placeCourseCard(card, dayIndex, course.startTime, course.duration);
    card.setAttribute("aria-label", `${course.name}，${formatTime(course.startTime)}，${course.teacher}，${getRepeatDescription(course.repeatIntervalDays)}`);
    card.title = canEdit ? "拖动将移动整个课程系列，点击可编辑详情" : "点击查看课程详情";
    card.append(
      createElement("strong", "", course.name),
      createElement("span", "course-time", `${formatTime(course.startTime)} - ${formatTime(getCourseEnd(course))}`),
      createElement("span", "", course.teacher),
      createElement("span", "course-repeat", getRepeatDescription(course.repeatIntervalDays)),
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
  document.querySelector("#todayText").textContent = `${days[scheduleToday.getDay() - 1]}，${formatMonthDay(scheduleToday)}`;
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
  const tone = getCourseTone(course.id);
  dialog.classList.remove("is-editing");
  courseForm.hidden = true;
  dialogDetails.hidden = false;
  document.querySelector("#dialogTitle").textContent = course.name;
  document.querySelector("#dialogType").textContent = course.repeatIntervalDays === null ? "单次课程" : "重复课程";
  document.querySelector("#dialogTime").textContent = `${formatFullDate(occurrence)} · ${formatTime(course.startTime)} - ${formatTime(getCourseEnd(course))}（${formatDuration(course.duration)}）`;
  document.querySelector("#dialogTeacher").textContent = course.teacher;
  document.querySelector("#dialogRepeat").textContent = `${getRepeatDescription(course.repeatIntervalDays)} · 首次 ${formatFullDate(parseISODate(course.startDate))}`;
  const notes = document.querySelector("#dialogNotes");
  notes.textContent = course.notes || "暂无备注";
  notes.classList.toggle("is-empty", !course.notes);
  document.querySelector("#dialogAccent").style.background = toneColors[tone];
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
  for (let minutes = 30; minutes <= 240; minutes += 10) {
    durationInput.add(new Option(formatDuration(minutes), String(minutes)));
  }
}

function setRepeatControls(interval) {
  if (interval === null) repeatInput.value = "";
  else if (repeatPresets.has(interval)) repeatInput.value = String(interval);
  else repeatInput.value = "custom";
  repeatDaysInput.value = String(interval ?? 4);
  customRepeatField.hidden = repeatInput.value !== "custom";
}

function readRepeatInterval() {
  if (repeatInput.value === "") return null;
  if (repeatInput.value === "custom") return Number(repeatDaysInput.value);
  return Number(repeatInput.value);
}

function fillCourseForm(course) {
  document.querySelector("#courseNameInput").value = course?.name || "";
  document.querySelector("#courseTeacherInput").value = course?.teacher || "";
  dayStartInput.value = course?.startDate || toISODate(selectedWeekStart);
  startTimeInput.value = formatTime(course?.startTime ?? timelineStart);
  durationInput.value = String(course?.duration ?? 100);
  document.querySelector("#courseNotesInput").value = course?.notes || "";
  setRepeatControls(course?.repeatIntervalDays ?? 7);
}

function openNewCourse() {
  if (!canEdit) return;
  selectedCourseId = null;
  selectedOccurrenceDate = null;
  formMode = "create";
  dialog.classList.add("is-editing");
  document.querySelector("#dialogType").textContent = "新建课程";
  document.querySelector("#dialogTitle").textContent = "新增课程";
  document.querySelector("#dialogAccent").style.background = toneColors[0];
  dialogCourseActions.hidden = true;
  dialogDetails.hidden = true;
  courseForm.hidden = false;
  document.querySelector("#saveCourseText").textContent = "创建课程";
  fillCourseForm(null);
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
  return isConflict ? "该课程系列会与现有课程冲突，请调整日期或时间" : "保存失败，请检查连接后重试";
}

async function createCourse(candidate) {
  if (!canEdit) return false;
  const newCourse = {
    ...candidate,
    id: window.crypto?.randomUUID?.() || `course-${Date.now()}`,
  };
  const { data, error } = await supabaseClient
    .from("courses")
    .insert({ id: newCourse.id, ...toDatabaseCourse(newCourse) })
    .select()
    .single();

  if (error) {
    showStatus(describeSaveError(error));
    return false;
  }

  const savedCourse = mapCourse(data);
  schedule.push(savedCourse);
  sortSchedule();
  renderSchedule();
  showStatus("课程已创建并实时同步");
  return true;
}

async function persistCourseUpdate(original, candidate, successMessage) {
  if (!canEdit) {
    showStatus("当前为只读模式，请先以管理员身份登录");
    renderSchedule();
    return false;
  }

  const { data, error } = await supabaseClient
    .from("courses")
    .update(toDatabaseCourse(candidate))
    .eq("id", original.id)
    .eq("version", original.version)
    .select()
    .maybeSingle();

  if (error) {
    showStatus(describeSaveError(error));
    await loadSchedule({ quiet: true });
    return false;
  }
  if (!data) {
    showStatus("这门课程刚被其他设备修改，请确认最新内容后重试");
    await loadSchedule({ quiet: true });
    return false;
  }

  const savedCourse = mapCourse(data);
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
  const { data, error } = await supabaseClient
    .from("courses")
    .delete()
    .eq("id", course.id)
    .eq("version", course.version)
    .select()
    .maybeSingle();
  confirmDeleteButton.disabled = false;

  if (error) {
    showStatus("删除失败，请检查连接后重试");
    return;
  }
  if (!data) {
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
    .select("*")
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

function applyRealtimeChange(payload) {
  if (payload.eventType === "DELETE") {
    schedule = schedule.filter((course) => course.id !== payload.old.id);
  } else {
    const incoming = mapCourse(payload.new);
    const existingIndex = schedule.findIndex((course) => course.id === incoming.id);
    if (existingIndex === -1) schedule.push(incoming);
    else schedule[existingIndex] = incoming;
  }
  sortSchedule();
  renderSchedule();
  refreshOpenDialog();
  setSyncState("online", canEdit ? "管理员 · 实时同步" : "只读 · 实时同步");
}

function subscribeToCourses() {
  if (realtimeChannel) supabaseClient.removeChannel(realtimeChannel);
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
}

async function applySession(session) {
  currentSession = session;
  canEdit = false;
  if (session) {
    const { data, error } = await supabaseClient.rpc("can_edit_courses");
    canEdit = !error && data === true;
    if (!canEdit) showStatus("当前账号没有课程编辑权限");
  }
  updatePermissionUI();
  setSyncState("online", canEdit ? "管理员 · 实时同步" : "只读 · 实时同步");
}

async function handleCourseSubmit(event) {
  event.preventDefault();
  if (!canEdit || !["create", "edit"].includes(formMode)) return;
  const existing = schedule.find((item) => item.id === selectedCourseId);
  if (formMode === "edit" && !existing) return;

  const candidate = {
    ...(existing || {}),
    startDate: dayStartInput.value,
    repeatIntervalDays: readRepeatInterval(),
    startTime: parseTime(startTimeInput.value),
    duration: Number(durationInput.value),
    name: document.querySelector("#courseNameInput").value.trim(),
    teacher: document.querySelector("#courseTeacherInput").value.trim(),
    notes: document.querySelector("#courseNotesInput").value.trim(),
  };

  if (!candidate.startDate || candidate.startTime % snapMinutes !== 0 || candidate.startTime < timelineStart || getCourseEnd(candidate) > timelineEnd) {
    showStatus("课程时间需在 08:00 - 21:00 内，并按 10 分钟设置");
    return;
  }
  if (candidate.repeatIntervalDays !== null && (!Number.isInteger(candidate.repeatIntervalDays) || candidate.repeatIntervalDays < 1 || candidate.repeatIntervalDays > 365)) {
    showStatus("重复间隔需为 1 - 365 天的整数");
    return;
  }
  if (hasSeriesConflict(candidate, existing?.id)) {
    showStatus("该课程系列会与现有课程冲突，请调整日期或时间");
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
  const email = document.querySelector("#loginEmail").value.trim().toLowerCase();
  if (email !== ADMIN_EMAIL) {
    showStatus("此邮箱没有课程编辑权限");
    return;
  }

  loginSubmit.disabled = true;
  const { error } = await supabaseClient.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: SITE_URL, shouldCreateUser: true },
  });
  loginSubmit.disabled = false;
  if (error) {
    showStatus("登录邮件发送失败，请稍后重试");
    return;
  }
  loginDialog.close();
  loginForm.reset();
  showStatus("登录链接已发送，请前往邮箱查收");
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
  document.querySelector("#currentWeek").addEventListener("click", () => {
    selectedWeekStart = new Date(currentWeekStart);
    renderSchedule();
  });
  document.querySelector("#todayButton").addEventListener("click", () => {
    selectedWeekStart = new Date(currentWeekStart);
    renderSchedule();
  });
  document.querySelector("#addCourse").addEventListener("click", openNewCourse);
  document.querySelector("#closeDialog").addEventListener("click", () => dialog.close());
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
    customRepeatField.hidden = repeatInput.value !== "custom";
    if (!customRepeatField.hidden) repeatDaysInput.focus();
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

  authButton.addEventListener("click", async () => {
    if (currentSession) {
      const { error } = await supabaseClient.auth.signOut();
      if (error) showStatus("退出失败，请稍后重试");
      else showStatus("已退出管理员模式");
      return;
    }
    loginDialog.showModal();
    document.querySelector("#loginEmail").focus();
  });
  document.querySelector("#closeLoginDialog").addEventListener("click", () => loginDialog.close());
  loginForm.addEventListener("submit", handleLoginSubmit);
}

async function initializeApp() {
  populateDurationOptions();
  bindEvents();
  renderSchedule();
  if (window.lucide) window.lucide.createIcons();

  const { data: { session }, error } = await supabaseClient.auth.getSession();
  if (error) showStatus("登录状态读取失败，当前以只读模式打开");
  await applySession(session);
  await loadSchedule();
  subscribeToCourses();

  supabaseClient.auth.onAuthStateChange((_event, nextSession) => {
    window.setTimeout(() => applySession(nextSession), 0);
  });
}

initializeApp().catch(() => {
  setSyncState("offline", "初始化失败");
  showStatus("页面初始化失败，请刷新后重试");
});
