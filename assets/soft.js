// Soft-card layer: keeps the sidebar's current page highlighted, adds the login password toggle.
// Loaded last; it only reads the page and toggles classes, never changes app logic.
(() => {
  const pages = ["scheduleSection", "adminHub", "courseHolidayPage", "studentManagementPage", "attendanceManagementPage",
    "petManagementPage", "petBattleHistoryPage", "petDetailPage", "petLeaderboardPage", "coinShopPage",
    "studentChallengePage", "challengeRecordsPage", "questionBankPage", "questionReviewPage"];
  // Sub-pages light up the entry they belong to.
  const parent = { petBattleHistoryPage: "petManagementPage", questionReviewPage: "questionBankPage" };

  function markCurrentPage() {
    const open = pages.find((id) => {
      const page = document.getElementById(id);
      return page && !page.hidden;
    });
    const current = parent[open] || open;
    document.querySelectorAll(".sidebar-nav-item").forEach((item) => {
      const on = item.dataset.page === current;
      item.classList.toggle("is-current", on);
      if (on) item.setAttribute("aria-current", "page");
      else item.removeAttribute("aria-current");
    });
  }

  const watcher = new MutationObserver(markCurrentPage);
  pages.forEach((id) => {
    const page = document.getElementById(id);
    if (page) watcher.observe(page, { attributes: true, attributeFilter: ["hidden"] });
  });

  // Login: show or hide the password.
  const reveal = document.querySelector("#loginReveal");
  const password = document.querySelector("#loginPassword");
  reveal?.addEventListener("click", () => {
    const show = password.type === "password";
    password.type = show ? "text" : "password";
    reveal.setAttribute("aria-pressed", String(show));
    reveal.setAttribute("aria-label", show ? "隐藏密码" : "显示密码");
    password.focus();
  });

  window.SoftUI = { markCurrentPage };
  markCurrentPage();
})();
