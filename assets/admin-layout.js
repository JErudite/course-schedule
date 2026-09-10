/* Admin dashboard order is a per-account preference on this browser. */
window.AdminLayout = (() => {
  const grid = document.querySelector("#adminHub .admin-feature-grid");
  let drag = null;
  let frame = 0;
  const defaultOrder = [];
  const items = () => [...grid.querySelectorAll(":scope > .admin-feature-item")];
  const key = () => `admin-feature-order:${currentUser?.id || ""}`;
  const order = () => items().map(item => item.dataset.featureKey);
  function mergeOrder(saved, available) {
    const valid = Array.isArray(saved) ? saved.filter(id => typeof id === "string" && available.includes(id)) : [];
    return [...new Set([...valid, ...available])];
  }
  function applyOrder(ids) {
    const byId = new Map(items().map(item => [item.dataset.featureKey, item]));
    for (const id of mergeOrder(ids, [...byId.keys()])) grid.append(byId.get(id));
  }
  function save() {
    try { localStorage.setItem(key(), JSON.stringify(order())); showStatus("板块顺序已自动保存（当前浏览器）"); }
    catch { showStatus("排序已调整，但浏览器未允许保存；刷新后可能恢复原顺序"); }
  }
  function finish(cancel = false) {
    if (!drag) return;
    const previous = drag;
    drag = null;
    cancelAnimationFrame(frame);
    previous.item.classList.remove("is-dragging");
    if (previous.handle.hasPointerCapture(previous.pointerId)) previous.handle.releasePointerCapture(previous.pointerId);
    if (cancel || currentUser?.id !== previous.userId || !canEdit) applyOrder(previous.before);
    else if (JSON.stringify(previous.before) !== JSON.stringify(order())) save();
  }
  function moveAt(x, y) {
    if (!drag) return;
    const target = document.elementFromPoint(x, y)?.closest(".admin-feature-item");
    if (!target || target.parentElement !== grid || target === drag.item || target.hidden) return;
    const all = items();
    grid.insertBefore(drag.item, all.indexOf(drag.item) < all.indexOf(target) ? target.nextSibling : target);
  }
  function scrollDrag() {
    if (!drag) return;
    if (!canEdit || currentUser?.id !== drag.userId || document.querySelector("#adminHub").hidden) { finish(true); return; }
    const dy = drag.y < 70 ? -10 : drag.y > window.innerHeight - 70 ? 10 : 0;
    if (dy) { window.scrollBy(0, dy); moveAt(drag.x, drag.y); }
    frame = requestAnimationFrame(scrollDrag);
  }
  function addHandle(item, title) {
    const handle = document.createElement("button");
    handle.type = "button";
    handle.className = "admin-drag-handle";
    handle.textContent = "⠿";
    handle.title = `按住拖动${title}；也可用方向键调整`;
    handle.setAttribute("aria-label", `调整${title}的位置`);
    handle.addEventListener("click", event => event.preventDefault());
    handle.addEventListener("pointerdown", event => {
      if (!canEdit || !currentUser || event.button !== 0 || drag) return;
      event.preventDefault();
      handle.focus({ preventScroll: true });
      drag = { item, handle, pointerId: event.pointerId, userId: currentUser.id, before: order(), x: event.clientX, y: event.clientY };
      item.classList.add("is-dragging");
      handle.setPointerCapture(event.pointerId);
      frame = requestAnimationFrame(scrollDrag);
    });
    handle.addEventListener("pointermove", event => {
      if (!drag || drag.handle !== handle || event.pointerId !== drag.pointerId) return;
      event.preventDefault();
      drag.x = event.clientX; drag.y = event.clientY;
      moveAt(drag.x, drag.y);
      // Moving the card in the DOM may release pointer capture on some browsers.
      handle.setPointerCapture(event.pointerId);
    });
    handle.addEventListener("pointerup", event => { if (drag?.pointerId === event.pointerId) finish(); });
    handle.addEventListener("pointercancel", () => finish(true));
    handle.addEventListener("keydown", event => {
      if (event.key === "Escape") { finish(true); return; }
      if (!canEdit || drag || !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
      event.preventDefault();
      const visible = items().filter(node => !node.hidden);
      const index = visible.indexOf(item);
      const delta = ["ArrowLeft", "ArrowUp"].includes(event.key) ? -1 : 1;
      const target = visible[index + delta];
      if (!target) return;
      grid.insertBefore(item, delta < 0 ? target : target.nextSibling);
      handle.focus(); save();
    });
    item.append(handle);
  }
  function refresh() {
    if (drag) finish(true);
    for (const item of items()) if (!item.querySelector(".admin-feature-button")) item.remove();
    for (const button of grid.querySelectorAll(":scope > .admin-feature-button")) {
      const item = document.createElement("div");
      item.className = "admin-feature-item";
      item.dataset.featureKey = button.id || `operations:${button.dataset.operationsRoute}`;
      if (!defaultOrder.includes(item.dataset.featureKey)) defaultOrder.push(item.dataset.featureKey);
      button.before(item); item.append(button);
      addHandle(item, button.querySelector("strong").textContent);
    }
    for (const item of items()) item.hidden = item.querySelector(".admin-feature-button").hidden;
    if (!canEdit || !currentUser) return;
    let saved;
    try { saved = JSON.parse(localStorage.getItem(key())); } catch { saved = []; }
    applyOrder(mergeOrder(saved, defaultOrder));
  }
  window.addEventListener("blur", () => finish(true));
  refresh();
  return { refresh };
})();
