// Student view extras: a greeting, a lesson-balance ring and a live countdown on the
// next-lesson card. Only decorates what the app renders for students.
(() => {
  const section = document.querySelector("#scheduleSection");
  const summary = document.querySelector("#lessonSummary");
  const nextCard = document.querySelector("#nextLessonCard");
  if (!section || !summary || !nextCard) return;

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const weekdayNames = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

  const hello = el("div", "student-hello");
  hello.hidden = true;
  section.prepend(hello);

  function renderHello() {
    hello.hidden = canEdit || !currentUser;
    if (hello.hidden) return;
    const today = getScheduleToday();
    const name = String(currentUser.username || "同学");
    const copy = el("div", "");
    copy.append(el("small", "", `${today.getMonth() + 1}月${today.getDate()}日 · ${weekdayNames[today.getDay()]}`), el("strong", "", `Hi，${name.length > 2 ? name.slice(-2) : name}`));
    hello.replaceChildren(copy, el("span", "student-hello-avatar", name.slice(0, 1)));
  }

  const ring = el("div", "lesson-ring");
  ring.setAttribute("role", "img");
  summary.prepend(ring);

  function renderRing() {
    const current = Number(currentUser?.current_lesson_count) || 0;
    const required = Number(currentUser?.required_lesson_count) || 0;
    const left = Math.max(required - current, 0);
    const circumference = 2 * Math.PI * 38;
    const share = required ? Math.min(1, current / required) : 0;
    const angle = -Math.PI / 2 + share * 2 * Math.PI;
    ring.setAttribute("aria-label", `已上 ${current} 次，共 ${required} 次，还剩 ${left} 次`);
    ring.innerHTML = `<svg viewBox="0 0 92 92" aria-hidden="true"><circle cx="46" cy="46" r="38" fill="none" stroke="#f2f2f7" stroke-width="8"/><circle class="lesson-ring-arc" cx="46" cy="46" r="38" fill="none" stroke="${left === 0 ? "#ff3b30" : left <= 3 ? "#ff9500" : "#34c759"}" stroke-width="8" stroke-linecap="round" stroke-dasharray="${circumference * share} ${circumference}" transform="rotate(-90 46 46)"/><circle cx="${46 + 38 * Math.cos(angle)}" cy="${46 + 38 * Math.sin(angle)}" r="5" fill="#ffffff" stroke="#1c1c1e" stroke-width="2"/></svg><span><b>${left}</b><small>还剩</small></span>`;
  }

  // Countdown to the next lesson today; the card text itself comes from renderNextLesson.
  let target = null;
  let timer = 0;
  function renderCountdown() {
    nextCard.querySelector(".next-countdown")?.remove();
    target = null;
    if (canEdit || !currentUser || nextCard.hidden) return;
    const now = getScheduleTimeMinutes();
    const next = getOccurrencesForDate(getScheduleToday()).find((course) => course.startTime > now);
    if (!next || nextCard.textContent.includes("正在上课")) return;
    target = next.startTime;
    const box = el("span", "next-countdown");
    box.setAttribute("aria-live", "off");
    nextCard.append(box);
    tick();
  }
  function tick() {
    const box = nextCard.querySelector(".next-countdown");
    if (!box || target === null) return;
    const seconds = Math.max(0, (target - getScheduleTimeMinutes()) * 60 - new Date().getSeconds());
    const pad = (value) => String(value).padStart(2, "0");
    box.textContent = `${pad(Math.floor(seconds / 3600))}:${pad(Math.floor((seconds % 3600) / 60))}:${pad(seconds % 60)} 后上课`;
  }
  window.clearInterval(timer);
  timer = window.setInterval(tick, 1000);

  const wrap = (name, after) => {
    const original = window[name];
    if (typeof original !== "function") return;
    window[name] = function wrapped(...args) {
      const result = original.apply(this, args);
      after();
      return result;
    };
  };
  wrap("updateLessonSummary", () => { renderRing(); renderHello(); });
  wrap("renderNextLesson", renderCountdown);
  renderRing();
  renderHello();
  renderCountdown();
})();
