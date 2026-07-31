const SUPABASE_URL = "https://dpjyjzszqmgakwtdhmwq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_PyH98bSXQ2rSCzIfmLNN5w_4rTJ6P-x";
const ADMIN_EMAIL = "703223232@qq.com";
const SITE_URL = "https://jerudite.github.io/course-schedule/";

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
const semesterStart = startOfWeek(new Date(2026, 1, 16));
const scheduleToday = new Date(2026, 3, 13);
const currentWeekStart = startOfWeek(scheduleToday);

let selectedWeekStart = new Date(currentWeekStart);
let selectedCourseId = null;
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
const editCourseButton = document.querySelector("#editCourse");
const dayInput = document.querySelector("#courseDayInput");
const startTimeInput = document.querySelector("#courseStartTimeInput");
const durationInput = document.querySelector("#courseDurationInput");
const saveCourseButton = document.querySelector("#saveCourse");
const statusMessage = document.querySelector("#statusMessage");
const authButton = document.querySelector("#authButton");
const loginDialog = document.querySelector("#loginDialog");
const loginForm = document.querySelector("#loginForm");
const loginSubmit = document.querySelector("#loginSubmit");

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
  if (text !== undefined) element.textContent = text;
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

function mapCourse(row) {
  return {
    id: row.id,
    day: Number(row.day),
    startTime: Number(row.start_time),
    duration: Number(row.duration),
    name: row.name,
    room: row.room,
    teacher: row.teacher,
    type: row.type,
    version: Number(row.version),
    updatedAt: row.updated_at,
  };
}

function toDatabaseUpdate(course) {
  return {
    day: course.day,
    start_time: course.startTime,
    duration: course.duration,
    name: course.name,
    room: course.room,
    teacher: course.teacher,
    type: course.type,
  };
}

function showStatus(message) {
  statusMessage.textContent = message;
  statusMessage.classList.add("is-visible");
  window.clearTimeout(statusTimer);
  statusTimer = window.setTimeout(() => statusMessage.classList.remove("is-visible"), 3000);
}

function setSyncState(state, text) {
  const syncState = document.querySelector("#syncState");
  const syncStateText = document.querySelector("#syncStateText");
  syncState.className = `sync-state is-${state}`;
  syncStateText.textContent = text;
}

function updatePermissionUI() {
  editCourseButton.hidden = !canEdit;
  document.body.classList.toggle("can-edit", canEdit);
  document.querySelector("#permissionHint").textContent = canEdit
    ? "管理员模式 · 拖动或点击课程即可修改，变化会实时同步"
    : "只读模式 · 管理员的修改会实时显示在这里";

  if (currentSession) {
    authButton.classList.add("is-authenticated");
    authButton.setAttribute("aria-label", "退出管理员登录");
    authButton.innerHTML = `<i data-lucide="log-out"></i><span id="authButtonText">退出登录</span>`;
  } else {
    authButton.classList.remove("is-authenticated");
    authButton.setAttribute("aria-label", "管理员登录");
    authButton.innerHTML = `<i data-lucide="lock-keyhole"></i><span id="authButtonText">管理员登录</span>`;
  }

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

  schedule.forEach((course) => {
    const card = createElement("button", `course-card ${course.type}${canEdit ? " is-editable" : " is-readonly"}`);
    card.type = "button";
    card.dataset.courseId = course.id;
    placeCourseCard(card, course.day, course.startTime, course.duration);
    card.setAttribute("aria-label", `${course.name}，${formatTime(course.startTime)}，${course.room}，${course.teacher}`);
    card.title = canEdit ? "拖动调整时间，点击编辑详情" : "点击查看课程详情";
    card.append(
      createElement("strong", "", course.name),
      createElement("span", "course-time", `${formatTime(course.startTime)} - ${formatTime(getCourseEnd(course))}`),
      createElement("span", "", course.room),
      createElement("span", "", course.teacher),
    );
    enableCourseInteraction(card, course);
    grid.append(card);
  });

  const weekNumber = getWeekNumber(selectedWeekStart);
  const weekEnd = addDays(selectedWeekStart, 6);
  const totalMinutes = schedule.reduce((total, course) => total + course.duration, 0);
  weekLabel.textContent = `第 ${weekNumber} 周`;
  weekRange.textContent = `${formatMonthDay(selectedWeekStart)} - ${formatMonthDay(weekEnd)}`;
  document.querySelector("#todayText").textContent = `${days[scheduleToday.getDay() - 1]}，${formatMonthDay(scheduleToday)}`;
  document.querySelector("#courseCount").textContent = String(schedule.length);
  document.querySelector("#durationCount").textContent = (totalMinutes / 60).toFixed(1).replace(".0", "");
}

function placeCourseCard(card, day, startTime, duration) {
  const startSlot = Math.round((startTime - timelineStart) / snapMinutes);
  const durationSlots = Math.max(1, Math.round(duration / snapMinutes));
  card.style.gridColumn = String(day + 1);
  card.style.gridRow = `${startSlot + 2} / span ${durationSlots}`;
}

function enableCourseInteraction(card, course) {
  let dragState = null;
  let suppressClick = false;

  if (canEdit) {
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

    card.addEventListener("pointerup", async (event) => {
      if (!dragState || event.pointerId !== dragState.pointerId) return;
      if (card.hasPointerCapture(event.pointerId)) card.releasePointerCapture(event.pointerId);
      if (!dragState.moved) {
        dragState = null;
        return;
      }

      suppressClick = true;
      const candidate = { ...course, day: dragState.nextDay, startTime: dragState.nextStart };
      dragState = null;
      card.classList.remove("is-dragging");
      card.removeAttribute("aria-grabbed");

      if (hasConflict(candidate, course.id)) {
        showStatus("该时间段已有课程，已恢复原位置");
        renderSchedule();
        return;
      }

      card.classList.add("is-saving");
      showStatus("正在保存课程时间…");
      await persistCourseUpdate(course, candidate, `已调整至${days[candidate.day - 1]} ${formatTime(candidate.startTime)}`);
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

function refreshOpenDialog() {
  if (!dialog.open || !selectedCourseId) return;
  const course = schedule.find((item) => item.id === selectedCourseId);
  if (!course) {
    dialog.close();
    return;
  }
  updateDialogDetails(course);
}

function populateFormOptions() {
  days.forEach((day, index) => dayInput.add(new Option(day, String(index + 1))));
  for (let minutes = 30; minutes <= 240; minutes += 10) {
    durationInput.add(new Option(formatDuration(minutes), String(minutes)));
  }
}

function setEditing(editing) {
  const course = schedule.find((item) => item.id === selectedCourseId);
  const shouldEdit = Boolean(editing && canEdit && course);
  dialog.classList.toggle("is-editing", shouldEdit);
  courseForm.hidden = !shouldEdit;
  dialogDetails.hidden = shouldEdit;
  editCourseButton.hidden = !canEdit || shouldEdit;
  if (!shouldEdit || !course) return;

  document.querySelector("#courseNameInput").value = course.name;
  document.querySelector("#courseTeacherInput").value = course.teacher;
  document.querySelector("#courseRoomInput").value = course.room;
  document.querySelector("#courseTypeInput").value = course.type;
  dayInput.value = String(course.day);
  startTimeInput.value = formatTime(course.startTime);
  durationInput.value = String(course.duration);
  document.querySelector("#courseNameInput").focus();
}

async function persistCourseUpdate(original, candidate, successMessage) {
  if (!canEdit) {
    showStatus("当前为只读模式，请先以管理员身份登录");
    renderSchedule();
    return false;
  }

  const { data, error } = await supabaseClient
    .from("courses")
    .update(toDatabaseUpdate(candidate))
    .eq("id", original.id)
    .eq("version", original.version)
    .select()
    .maybeSingle();

  if (error) {
    const isConflict = error.code === "23P01" || error.message.toLowerCase().includes("conflict");
    showStatus(isConflict ? "该时间段已有课程，修改未保存" : "保存失败，请检查连接后重试");
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

function sortSchedule() {
  schedule.sort((first, second) => first.day - second.day || first.startTime - second.startTime);
}

async function loadSchedule({ quiet = false } = {}) {
  if (!quiet) setSyncState("connecting", "正在读取课程");
  const { data, error } = await supabaseClient
    .from("courses")
    .select("*")
    .order("day", { ascending: true })
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
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "courses" },
      applyRealtimeChange,
    )
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
  const course = schedule.find((item) => item.id === selectedCourseId);
  if (!course || !canEdit) {
    setEditing(false);
    showStatus("当前账号没有编辑权限");
    return;
  }

  const candidate = {
    ...course,
    name: document.querySelector("#courseNameInput").value.trim(),
    teacher: document.querySelector("#courseTeacherInput").value.trim(),
    room: document.querySelector("#courseRoomInput").value.trim(),
    type: document.querySelector("#courseTypeInput").value,
    day: Number(dayInput.value),
    startTime: parseTime(startTimeInput.value),
    duration: Number(durationInput.value),
  };

  if (candidate.startTime % snapMinutes !== 0 || candidate.startTime < timelineStart || getCourseEnd(candidate) > timelineEnd) {
    showStatus("课程时间需在 08:00 - 21:00 内，并按 10 分钟设置");
    return;
  }
  if (hasConflict(candidate, course.id)) {
    showStatus("该时间段已有课程，请选择其他时间");
    return;
  }

  saveCourseButton.disabled = true;
  const saved = await persistCourseUpdate(course, candidate, "课程信息已保存并同步");
  saveCourseButton.disabled = false;
  if (saved) setEditing(false);
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
    options: {
      emailRedirectTo: SITE_URL,
      shouldCreateUser: true,
    },
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
  document.querySelector("#closeDialog").addEventListener("click", () => dialog.close());
  editCourseButton.addEventListener("click", () => setEditing(true));
  document.querySelector("#cancelEdit").addEventListener("click", () => setEditing(false));
  courseForm.addEventListener("submit", handleCourseSubmit);
  dialog.addEventListener("close", () => {
    selectedCourseId = null;
    setEditing(false);
  });

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
  populateFormOptions();
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
