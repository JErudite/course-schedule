/* Operations pages share the existing authenticated client and visual system. */
window.CourseOperations = (() => {
  let ready = false;
  let canDeleteStudents = false;
  let classes = [];
  let members = [];
  let activeRoute = "";
  let pageToken = 0;
  let realtime = null;
  let threshold = 3;
  let summaryToken = 0;
  let sessionToken = 0;
  let dashboardRequest = 0;
  const el = (tag, text = "", className = "") => createElement(tag, className, text);
  const page = el("section", "", "admin-page operations-page");
  page.id = "operationsPage"; page.hidden = true;
  appShell.append(page);
  const nav = el("nav", "", "operations-nav"); nav.hidden = true; nav.setAttribute("aria-label", "个人服务");
  document.querySelector(".topbar").after(nav);
  const dashboard = el("section", "", "operations-dashboard"); dashboard.id = "operationsDashboard"; dashboard.hidden = true;
  document.querySelector("#adminHub .admin-feature-grid").before(dashboard);
  const summary = el("p", "", "operations-attendance-summary"); summary.hidden = true;
  document.querySelector("#calendarOverview").before(summary);
  const messages = {pending:"待领取",fulfilled:"已领取",cancelled:"已取消 / 已退款"};
  const fmt = value => value ? new Date(value).toLocaleString("zh-CN", {timeZone:scheduleTimeZone,hour12:false}) : "—";
  const name = id => students.find(student => student.id === id)?.username || (currentUser?.id === id ? currentUser.username : "学生");
  const hint = text => el("p",text,"operations-hint");
  const card = (title, text = "") => { const box=el("article","","operations-card"); box.append(el("h3",title)); if(text)box.append(hint(text)); return box; };
  async function rpc(method,params={}) { const result=await supabaseClient.rpc(method,params); if(result.error) throw result.error; return result.data; }
  async function query(request) { const result=await request; if(result.error) throw result.error; return result.data || []; }
  function errorText(error) {
    const text=String(error?.message || "");
    if (/stale|刷新/.test(text)) return "记录已更新，请刷新此页后重试。";
    if (/42501|permission|administrator|authentication/.test(`${error?.code} ${text}`)) return "权限不足或登录已失效，请重新登录。";
    if (/[\u3400-\u9fff]/.test(text)) return text;
    return "操作未完成，请检查网络后重试；不要重复提交新的订单。";
  }
  function button(text,action,primary=false) {
    const b=el("button",text,primary?"primary-button":"secondary-button"); b.type="button";
    b.addEventListener("click",async()=>{ if(b.disabled)return; b.disabled=true; try{await action();}catch(error){showStatus(errorText(error));}finally{b.disabled=false;} });
    return b;
  }
  function input(label,type="text",value="") {
    const field=el("label","","form-field"), control=el("input"); control.type=type; control.value=value;
    control.setAttribute("aria-label",label); field.append(el("span",label),control); return {field,control};
  }
  function select(label,options,value="") {
    const field=el("label","","form-field"), control=el("select");
    for(const [key,text] of options){const option=el("option",text);option.value=key;control.append(option);} control.value=options.some(([key])=>key===value)?value:(options[0]?.[0]||"");
    control.setAttribute("aria-label",label);field.append(el("span",label),control);return {field,control};
  }
  function list(empty="暂无记录") { const container=el("div","","operations-list"); container.append(hint(empty)); return container; }
  function pageHeading(title,description,backToStudents=false) {
    hideAdminPages(); scheduleSection.hidden=true; pageFooter.hidden=true; page.hidden=false;
    document.body.classList.add("is-admin-view"); page.replaceChildren();
    const header=el("div","","admin-page-header"), copy=el("div");copy.append(el("h2",title),hint(description));
    header.append(copy,button(backToStudents?"返回学生管理":canEdit?"返回管理后台":"返回课程表",()=>backToStudents?showStudentManagement():canEdit?showAdminHub():showScheduleView()));page.append(header);
    header.querySelector("h2").tabIndex=-1;header.querySelector("h2").focus();window.scrollTo({top:0,behavior:"instant"});
  }
  async function open(route,id) {
    if(!ready || !currentUser)return;
    const titles={ledger:["课时明细","每一笔调整均保留前后余额；上线前余额仅作快照，不虚构旧流水。"],accounts:["账号与安全","停用可以恢复；删除账号及其学习记录不可恢复，请谨慎操作。"],classes:["班级管理","一个学生可在多个独立班级中。按班选课时复制成员，不追改历史课程。"],orders:[canEdit?"商城订单与核销":"我的兑换记录","待领取订单由曾老师核销；取消订单会退回金币。"],notifications:["课程通知",canEdit?"查看每位学生的通知与已读回执。":"这里只显示分配给你的课程变更。"],recycle:["课程回收站","恢复被删除的课程或时段，不恢复重复系列中未被删除的其他日期。"],learning:["学习周报与任务","按真实答题记录统计；学习任务仍遵守每日挑战次数和金币规则。"]};
    if(!canEdit)titles.accounts[1]="仅可修改自己的登录密码，请勿向他人透露密码。";
    titles.attendance=[`${name(id)} · 打卡记录`,"全部已登记的到课、补课、请假记录，按日期从近到远排列。"];
    if(!titles[route] || (!canEdit && ["classes","recycle","attendance"].includes(route)))return;
    pageHeading(...titles[route],route==="attendance"); activeRoute=route; const token=++pageToken;
    const body=el("div","","operations-content");page.append(body);
    try{ await ({attendance:()=>renderStudentAttendance(body,id),ledger:()=>renderLedger(body,id||currentUser.id),accounts:()=>renderAccounts(body),classes:()=>renderClasses(body),orders:()=>renderOrders(body),notifications:()=>renderNotifications(body),recycle:()=>renderRecycle(body),learning:()=>renderLearning(body)})[route](); }
    catch(error){if(token===pageToken) body.append(hint(errorText(error)),button("重新加载",()=>open(route,id)));}
  }
  function hide(){page.hidden=true;activeRoute="";pageToken++;}
  async function loadClasses(){
    if(!canEdit){classes=[];members=[];return;}
    [classes,members]=await Promise.all([query(supabaseClient.from("teaching_classes").select("id,name,is_active,version").order("name")),query(supabaseClient.from("class_students").select("class_id,student_id"))]);
  }
  function classGroups(){
    const activeClasses=classes.filter(c=>c.is_active);
    if(!activeClasses.length)return null;
    const byId=new Map(students.map(s=>[s.id,s])); const covered=new Set();
    const groups=activeClasses.map(c=>{
      const roster=members.filter(m=>m.class_id===c.id).map(m=>byId.get(m.student_id)).filter(Boolean).sort(compareStudentNames);
      roster.forEach(s=>covered.add(s.id));return {label:c.name,title:c.name,detail:`${roster.length} 人 · 独立班级`,students:roster};
    });
    const others=students.filter(s=>!covered.has(s.id));
    if(others.length)groups.push({label:"未加入班级",title:"可在班级管理中分配",detail:`${others.length} 人`,students:others,isUnassigned:true});
    return groups;
  }
  async function sessionChanged(){
    const token=++sessionToken;
    ready=false;canDeleteStudents=false;hide();nav.hidden=true;dashboard.hidden=true;summary.hidden=true;
    if(realtime){await supabaseClient.removeChannel(realtime);realtime=null;}
    if(!currentUser)return;
    const userId=currentUser.id;
    try{
      const status=await rpc("get_operations_status"); if(currentUser?.id!==userId||token!==sessionToken)return;
      ready=status.version===1; canDeleteStudents=canEdit&&status.student_account_deletion_enabled===true; threshold=Number(status.low_lesson_threshold)||0; if(!ready)return;
      await loadClasses(); if(currentUser?.id!==userId||token!==sessionToken)return; buildNavigation(status.unread);
      realtime=supabaseClient.channel(`operations-${userId}`)
        .on("postgres_changes",{event:"*",schema:"public",table:"student_notifications",filter:`student_id=eq.${userId}`},()=>refreshUnread())
        .on("postgres_changes",{event:"*",schema:"public",table:"course_attendance"},async()=>{if(canEdit&&!attendanceManagementPage.hidden)await Promise.all([loadStudents(),loadAttendance(),loadAttendanceHistory({quiet:true})]);else if(canEdit&&!adminHub.hidden)await Promise.all([loadTodayAttendanceSummary(),refreshDashboard()]);})
        .on("postgres_changes",{event:"*",schema:"public",table:"teaching_classes"},()=>loadClasses())
        .on("postgres_changes",{event:"*",schema:"public",table:"class_students"},()=>loadClasses()).subscribe();
      renderSchedule(); if(canEdit)renderStudentList();
    }catch(error){if(token===sessionToken){ready=false;showStatus("服务功能暂未加载，请检查网络后刷新；课程表仍可继续查看。");}}
  }
  function buildNavigation(unread=0){
    nav.hidden=false;nav.replaceChildren();const notes=button(`课程通知${unread?`（${unread} 未读）`:""}`,()=>open("notifications"));notes.id="operationsNotifications";nav.append(notes);
    nav.append(button("学习周报 / 任务",()=>open("learning")),button("兑换记录",()=>open("orders")),button("账号与安全",()=>open("accounts")));
    if(!canEdit)nav.append(button("我的课时明细",()=>open("ledger",currentUser.id)));
    const grid=document.querySelector("#adminHub .admin-feature-grid");grid.querySelectorAll("[data-operations-route]").forEach(node=>node.remove());
    if(canEdit)for(const [route,title,subtitle,icon] of [["classes","班级管理","独立班级与成员","users-round"],["learning","学习周报与任务","按班布置挑战与查看完成情况","notebook-pen"],["accounts","账号与安全","停用恢复、删除与密码管理","shield-check"],["orders","订单核销","待领取、已领取与退款","package-check"],["notifications","课程通知","变更与已读回执","bell"],["recycle","课程回收站","恢复误删的课程","archive-restore"]]){
      const b=button("",()=>open(route));b.className="admin-feature-button";b.dataset.operationsRoute=route;
      const mark=el("span","","admin-feature-icon is-student"); const i=el("i");i.dataset.lucide=icon;mark.append(i);
      b.append(mark,el("strong",title),el("span",subtitle));grid.append(b);
    }
    window.lucide?.createIcons();
  }
  async function refreshUnread(){if(!ready)return;try{const status=await rpc("get_operations_status");const b=document.querySelector("#operationsNotifications");if(b)b.textContent=`课程通知${status.unread?`（${status.unread} 未读）`:""}`;}catch{}}
  async function refreshDashboard(){
    if(!ready||!canEdit)return;dashboard.hidden=false;dashboard.replaceChildren(hint("正在读取今日待办…"));
    const request=++dashboardRequest,userId=currentUser.id,attendanceRequest=todayAttendanceRequest;
    try{
      const today=toISODate(getScheduleToday());
      const [attendance,orders]=await Promise.all([rpc("get_attendance_for_date_v3",{p_attendance_date:today}),supabaseClient.from("coin_shop_purchases").select("id",{count:"exact",head:true}).eq("status","pending")]);
      if(orders.error)throw orders.error;
      if(!canEdit||currentUser?.id!==userId||request!==dashboardRequest)return;
      cacheTodayAttendance(attendance,today,attendanceRequest);
      dashboard.replaceChildren(el("h3","今日待办")); const tiles=el("div","","operations-tiles");
      const pending=attendance.filter(a=>!a.status).length;
      tiles.append(button(`${new Set(attendance.map(a=>a.course_id||a.student_id)).size} 节今日课程 · ${pending} 课次待打卡`,()=>showAttendanceManagement()),button(`${orders.count||0} 笔订单待领取`,()=>open("orders")));
      dashboard.append(tiles);
      const low=students.filter(s=>!s.disabled_at&&getStudentRemainingCount(s)<=threshold).sort((a,b)=>getStudentRemainingCount(a)-getStudentRemainingCount(b));
      const settings=el("div","","operations-inline");const level=input("低课时预警阈值（次）","number",threshold);level.control.min=0;level.control.max=100;
      settings.append(level.field,button("保存预警设置",async()=>{const n=Number(level.control.value);if(!Number.isInteger(n)||n<0||n>100)throw new Error("请输入 0–100 的整数");await query(supabaseClient.from("operations_settings").update({low_lesson_threshold:n}).eq("id",true));threshold=n;await refreshDashboard();}));dashboard.append(settings);
      const warnings=el("div","","operations-chips");for(const s of low)warnings.append(button(`${s.username} · 剩 ${getStudentRemainingCount(s)} 次`,()=>open("ledger",s.id)));dashboard.append(low.length?warnings:hint("当前没有低课时预警。"));
    }catch(error){if(currentUser?.id===userId&&request===dashboardRequest)dashboard.replaceChildren(hint(errorText(error)),button("重新读取待办",refreshDashboard));}
  }
  async function renderLedger(body,id){
    const student=canEdit?students.find(s=>s.id===id):currentUser;if(!student)throw new Error("学生不存在");
    const title=card(`${student.username} · 剩余 ${getStudentRemainingCount(student)} 次`,`当前已上 ${student.current_lesson_count} 次 / 当前应上 ${student.required_lesson_count} 次`);body.append(title);
    if(canEdit){
      const current=input("当前已上","number",student.current_lesson_count),required=input("当前应上（续课后总额）","number",student.required_lesson_count),reason=input("调整原因");
      current.control.min=0;required.control.min=0;reason.control.maxLength=300;reason.control.placeholder="例如：本次续费增加 24 次";
      const form=el("div","","operations-form");form.append(current.field,required.field,reason.field,button("记录课时调整",async()=>{
        await rpc("adjust_student_lessons",{p_student_id:id,p_current:Number(current.control.value),p_required:Number(required.control.value),p_reason:reason.control.value,p_expected_current:student.current_lesson_count,p_expected_required:student.required_lesson_count});await loadStudents();await open("ledger",id);showStatus("课时调整和流水已保存");
      },true));title.append(form);
    }
    const records=list();body.append(records);let offset=0;
    const more=button("加载更多课时流水",load);body.append(more);
    async function load(){const data=await query(supabaseClient.from("lesson_ledger").select("id,old_current,new_current,old_required,new_required,reason,created_at").eq("student_id",id).order("id",{ascending:false}).range(offset,offset+49));if(!offset&&data.length)records.replaceChildren();for(const row of data){const entry=card(row.reason,fmt(row.created_at));entry.append(el("p",`已上：${row.old_current} → ${row.new_current}　应上：${row.old_required} → ${row.new_required}`),hint(`剩余：${Math.max(row.old_required-row.old_current,0)} → ${Math.max(row.new_required-row.new_current,0)} 次`));records.append(entry);}offset+=data.length;more.hidden=data.length<50;}
    await load();
  }
  async function renderStudentAttendance(body,id){
    const count=hint("正在读取打卡记录…"), records=list("该学生暂无打卡记录");body.append(count,records);
    let offset=0, lastYear="";
    const more=button("加载更早的打卡记录",load);body.append(more);
    async function load(){
      const data=await rpc("get_student_attendance_records",{p_student_id:id,p_offset:offset});
      if(!offset&&data.length)records.replaceChildren();
      for(const r of data){
        const year=String(r.attendance_date).slice(0,4);
        if(year!==lastYear){records.append(el("h3",`${year} 年`,"student-attendance-year"));lastYear=year;}
        const row=el("article","","student-attendance-record"),status=attendanceStatusOptions.find(s=>s.value===r.status);
        const copy=el("div");copy.append(el("strong",formatAttendanceDay(r.attendance_date)),hint(r.course_names||"历史课程"));
        if(r.is_legacy)copy.append(hint("旧版按日记录"));
        row.append(copy,el("span",`✓ ${status?.label||"已打卡"}`,`student-attendance-status ${status?.className||""}`));records.append(row);
      }
      offset+=data.length;const total=Number(data[0]?.total_count)||offset;
      count.textContent=`共 ${total} 条打卡记录${offset<total?` · 已显示 ${offset} 条`:""}`;more.hidden=offset>=total;
    }
    await load();
  }
  function selfPasswordCard(){
    const box=card("修改我的密码","请使用不容易被猜到的新密码，不再使用姓名缩写。密码不会存入操作日志。");
    const next=input("新密码","password"),again=input("再次输入新密码","password");for(const c of [next.control,again.control]){c.autocomplete="new-password";c.minLength=10;c.maxLength=72;}
    box.append(next.field,again.field,button("更新我的密码",async()=>{
      if(next.control.value!==again.control.value)throw new Error("两次密码输入不一致");
      if(!/^(?=.*[A-Za-z])(?=.*\d).{10,72}$/.test(next.control.value))throw new Error("密码需为 10–72 位，包含字母与数字");
      const {error}=await supabaseClient.auth.updateUser({password:next.control.value});if(error)throw error;
      next.control.value="";again.control.value="";showStatus("密码已更新，请妥善保存新密码");
    },true));return box;
  }
  async function renderAccounts(body){
    body.append(selfPasswordCard());if(!canEdit)return;
    const search=input("搜索学生账号");search.control.placeholder="输入学生姓名";body.append(search.field);
    const all=await query(supabaseClient.from("students").select("id,username,disabled_at").eq("is_admin",false).order("username"));const roster=list();body.append(roster);
    function render(){const visible=all.filter(s=>s.username.includes(search.control.value.trim()));roster.replaceChildren();for(const s of visible){
      const box=card(`${s.username} · ${s.disabled_at?"已停用":"可登录"}`);const actions=el("div","","operations-inline");
      actions.append(button(s.disabled_at?"恢复账号":"停用账号",async()=>{
        if(!await confirmAction(`${s.disabled_at?"恢复":"停用"}${s.username}的账号？`,"历史课时、课程分配、订单和挑战记录都会保留。"))return;
        await rpc("set_student_account_enabled",{p_student_id:s.id,p_enabled:Boolean(s.disabled_at)});await loadStudents();await open("accounts");
      }));
      if(canDeleteStudents){const remove=button("删除账号",()=>deleteStudent(s.id));remove.classList.add("danger-button");actions.append(remove);}box.append(actions);
      const reset=el("details");reset.append(el("summary","重置该学生密码"));const password=input(`为${s.username}设置新密码`,"password");password.control.autocomplete="new-password";password.control.maxLength=72;
      reset.append(password.field,button("确认重置密码",async()=>{await rpc("admin_reset_student_password",{p_student_id:s.id,p_password:password.control.value});password.control.value="";reset.open=false;showStatus("学生密码已重置，旧登录会话已注销");}),hint("至少 10 位并包含字母和数字；请通过私密渠道告知学生。"));box.append(reset);roster.append(box);
    }if(!visible.length)roster.append(hint("没有匹配的账号"));}search.control.addEventListener("input",render);render();
  }
  function confirmAction(title,detail){return new Promise(resolve=>{
    const d=el("dialog","","confirm-dialog");const actions=el("div","","confirm-actions");let yes=false;
    actions.append(button("取消",()=>d.close()),button("确认",()=>{yes=true;d.close();},true));d.append(el("h3",title),hint(detail),actions);document.body.append(d);
    d.addEventListener("close",()=>{d.remove();resolve(yes);},{once:true});d.showModal();
  });}
  async function renderClasses(body){
    await loadClasses();const editor=card("新建班级");const className=input("班级名称");className.control.maxLength=60;
    const choices=el("div","","operations-members");const search=input("查找班级学生");const checked=new Set();let editing=null;
    function drawMembers(){choices.replaceChildren();for(const s of students.filter(s=>!s.disabled_at&&s.username.includes(search.control.value.trim())).sort(compareStudentNames)){
      const label=el("label"),c=el("input");c.type="checkbox";c.checked=checked.has(s.id);c.addEventListener("change",()=>c.checked?checked.add(s.id):checked.delete(s.id));label.append(c,el("span",s.username));choices.append(label);
    }}
    search.control.addEventListener("input",drawMembers);drawMembers();
    editor.append(className.field,search.field,choices,button("保存班级",async()=>{
      await rpc("save_teaching_class",{p_id:editing?.id||null,p_name:className.control.value,p_student_ids:[...checked],p_expected_version:editing?.version||null,p_active:true});await open("classes");showStatus("班级和成员已保存");
    },true));body.append(editor);
    for(const c of classes){const ids=members.filter(m=>m.class_id===c.id).map(m=>m.student_id);const item=card(`${c.name}${c.is_active?"":"（已停用）"}`,ids.map(name).join("、")||"尚无学生");
      item.append(button("编辑班级",()=>{editing=c;className.control.value=c.name;checked.clear();ids.forEach(id=>checked.add(id));drawMembers();editor.querySelector("h3").textContent=`编辑 ${c.name}`;editor.scrollIntoView({block:"start"});}),button(c.is_active?"停用班级":"恢复班级",async()=>{await rpc("save_teaching_class",{p_id:c.id,p_name:c.name,p_student_ids:ids,p_expected_version:c.version,p_active:!c.is_active});await open("classes");}));body.append(item);
    }
  }
  function fillClassPicker(){
    let container=document.querySelector("#operationsClassPicker");if(container)container.remove();if(!ready||!canEdit)return;
    const pick=select("按班级选择学生",[["","不使用班级快捷选择"],...classes.filter(c=>c.is_active).map(c=>[c.id,c.name])]);container=pick.field;container.id="operationsClassPicker";
    container.append(hint("选择班级会替换当前勾选名单；之后仍可单独增减学生。"));document.querySelector("#studentChecklist").before(container);
    pick.control.addEventListener("change",()=>{if(pick.control.value)renderStudentChecklist(members.filter(m=>m.class_id===pick.control.value).map(m=>m.student_id));});
  }
  async function renderOrders(body){
    const state=select("订单状态",[["pending","待领取"],["fulfilled","已领取"],["cancelled","已取消"],["","全部"]],canEdit?"pending":"");body.append(state.field);const records=list();body.append(records);let offset=0;
    const more=button("加载更多订单",()=>load(false));body.append(more);
    async function load(reset=false){if(reset){offset=0;records.replaceChildren();}let request=supabaseClient.from("coin_shop_purchases").select("id,student_id,product_name,coin_cost,status,purchased_at,status_changed_at").order("purchased_at",{ascending:false}).order("id").range(offset,offset+49);if(state.control.value)request=request.eq("status",state.control.value);const data=await query(request);
      if(!offset)records.replaceChildren();for(const o of data){const box=card(`${o.product_name} · ${o.coin_cost} 金币`,`${canEdit?`${name(o.student_id)} · `:""}${fmt(o.purchased_at)} · ${messages[o.status]}`);box.append(hint(`订单号：${o.id}`));if(canEdit&&o.status==="pending"){
        box.append(button("确认已领取",async()=>{if(!await confirmAction("确认商品已交给学生？","核销后不能重复领取或直接取消。"))return;await rpc("set_coin_order_status",{p_id:o.id,p_status:"fulfilled"});await load(true);}),button("取消并退回金币",async()=>{if(!await confirmAction("取消此订单？","金币退回学生账户；有限库存商品同时回补库存。"))return;await rpc("set_coin_order_status",{p_id:o.id,p_status:"cancelled"});await load(true);}));}records.append(box);}
      if(!offset&&!data.length)records.append(hint("暂无该状态的订单"));offset+=data.length;more.hidden=data.length<50;
    }state.control.addEventListener("change",()=>load(true).catch(e=>showStatus(errorText(e))));await load(true);
  }
  function productStock(cardElement,product){
    if(!ready)return;cardElement.append(hint(product.stock===null||product.stock===undefined?"库存不限":`剩余库存 ${product.stock} 件`));
    if(canEdit){const stock=input(`${product.name}库存（留空不限）`,"number",product.stock??"");stock.control.min=0;stock.control.max=1000000;
      cardElement.append(stock.field,button("保存库存",async()=>{const n=stock.control.value===""?null:Number(stock.control.value);if(n!==null&&(!Number.isInteger(n)||n<0||n>1000000))throw new Error("请输入有效库存");const request=supabaseClient.from("coin_shop_products").update({stock:n}).eq("id",product.id);const guarded=product.stock===null?request.is("stock",null):request.eq("stock",product.stock);const data=await query(guarded.select("id"));if(!data.length)throw new Error("库存已被订单更新，请刷新后重试");await loadCoinShopProducts();showStatus("库存已保存");}));
    }
  }
  function shopRequestId(productId){
    const key=`coin-checkout:${currentUser.id}:${productId}`;let id=localStorage.getItem(key);if(!id){id=crypto.randomUUID();localStorage.setItem(key,id);}return id;
  }
  function finishShopRequest(productId){localStorage.removeItem(`coin-checkout:${currentUser.id}:${productId}`);}
  async function renderNotifications(body){
    const records=list("暂无课程通知");body.append(records);let offset=0;const more=button("加载更多通知",load);body.append(more);
    const courseText=c=>c?`${c.name} · ${c.start_date} · ${formatTime(c.start_time)}–${formatTime(Number(c.start_time)+Number(c.duration))}${c.repeat_interval_days?"（重复系列）":""}`:"无课程安排";
    async function load(){const data=await query(supabaseClient.from("student_notifications").select("id,student_id,title,details,created_at,read_at").order("id",{ascending:false}).range(offset,offset+49));if(!offset&&data.length)records.replaceChildren();for(const n of data){const item=card(`${canEdit?`${name(n.student_id)} · `:""}${n.title}`,`${fmt(n.created_at)} · ${n.read_at?`已读 ${fmt(n.read_at)}`:"未读"}`);if("before" in n.details||"after" in n.details)item.append(el("p",`原安排：${courseText(n.details.before)}`),el("p",`新安排：${courseText(n.details.after)}`));else item.append(el("p",`${n.details.name||"课程"}：${n.details.start||""} 至 ${n.details.end||""}`));
      if(n.student_id===currentUser.id&&!n.read_at)item.append(button("我已知悉",async()=>{await rpc("acknowledge_notification",{p_id:n.id});await open("notifications");await refreshUnread();}));records.append(item);}offset+=data.length;more.hidden=data.length<50;}
    await load();
  }
  async function renderRecycle(body){
    const records=list();body.append(records);let offset=0;const more=button("加载更多回收记录",load);body.append(more);
    async function load(){const data=await query(supabaseClient.from("course_recycle_bin").select("id,course_snapshot,deleted_at,restored_at").order("deleted_at",{ascending:false}).order("id").range(offset,offset+49));if(!offset&&data.length)records.replaceChildren();for(const row of data){const c=row.course_snapshot;const item=card(`${c.name} · ${c.start_date}`,`删除于 ${fmt(row.deleted_at)}${row.restored_at?" · 已恢复":""}`);item.append(hint(`${formatTime(c.start_time)}–${formatTime(Number(c.start_time)+Number(c.duration))} · ${c.repeat_interval_days?`重复 ${c.repeat_count??"持续"} 次`:"单次课程"}`));
      if(!row.restored_at)item.append(button("恢复该课程",async()=>{if(!await confirmAction("恢复这段课程安排？","恢复前会检查与现有课程是否冲突。"))return;try{await rpc("restore_deleted_course",{p_id:row.id});}catch(e){if(e.code!=="23P01")throw e;if(!await confirmAction("恢复的课程与现有课程重叠", "仍要恢复吗？请确认这不是已经手动补建的课程。"))return;await rpc("restore_deleted_course",{p_id:row.id,p_allow_conflict:true});}await loadSchedule();await open("recycle");showStatus("课程已恢复");}));records.append(item);}offset+=data.length;more.hidden=data.length<50;}
    await load();
  }
  function deleteStudent(id){
    const student=students.find(s=>s.id===id);
    if(!canDeleteStudents||!canEdit||!student||student.is_admin||document.querySelector("#permanentStudentDeleteDialog"))return;
    const dialog=el("dialog","","confirm-dialog");dialog.id="permanentStudentDeleteDialog";
    const title=el("h3",`删除“${student.username}”的账号？`);title.id="permanentStudentDeleteTitle";dialog.setAttribute("aria-labelledby",title.id);
    dialog.append(title,hint("删除后不能恢复：该账号无法再登录，其课时、打卡、宠物、对战、挑战、已处理订单和课程分配记录将删除。课程本身、其他学生的课时与金币不会删除。若只想暂时禁止登录，请取消并使用停用。"));
    const check=input("输入学生完整姓名确认删除");check.control.autocomplete="off";check.control.placeholder=student.username;
    const feedback=hint("");feedback.setAttribute("role","status");
    const actions=el("div","","confirm-actions"),cancel=button("取消",()=>dialog.close());
    let saving=false;
    const confirm=button("永久删除账号",async()=>{
      if(check.control.value.trim()!==student.username)return;
      saving=true;cancel.disabled=true;check.control.disabled=true;feedback.textContent="正在删除，请勿重复提交…";
      try{
        await rpc("permanently_delete_student_account",{p_student_id:id,p_expected_username:check.control.value.trim()});
        dialog.close();students=students.filter(s=>s.id!==id);copiedCourse=null;selectedStudentId=null;
        renderStudentList();renderAdminHubCounts();
        await Promise.all([loadStudents(),loadSchedule({quiet:true}),loadClasses()]);
        if(activeRoute==="accounts")await open("accounts");
        showStatus(`已删除“${student.username}”的账号及关联记录，无法恢复`);
      }catch(error){feedback.textContent=errorText(error);}
      finally{saving=false;cancel.disabled=false;check.control.disabled=false;}
    });
    confirm.className="danger-button";confirm.disabled=true;
    check.control.addEventListener("input",()=>{confirm.disabled=check.control.value.trim()!==student.username;});
    dialog.addEventListener("cancel",event=>{if(saving)event.preventDefault();});
    dialog.addEventListener("close",()=>dialog.remove(),{once:true});
    actions.append(cancel,confirm);dialog.append(check.field,feedback,actions);appShell.append(dialog);dialog.showModal();cancel.focus();
  }
  async function renderLearning(body){
    const week=input("周报起始日期","date",toISODate(startOfWeek(getScheduleToday())));const report=list();body.append(week.field,report);
    async function loadReport(){const data=await rpc("get_learning_weekly_report",{p_start:week.control.value});report.replaceChildren();for(const r of data){const box=card(`${r.username} · 答对 ${r.correct} / ${r.answered} 题`,`${r.learning_days} 天学习 · 答题 ${Math.round(Number(r.duration_seconds)/60)} 分钟 · 正确率 ${r.answered?Math.round(r.correct/r.answered*100):0}%`);box.append(hint("题库表现（按正确率从低到高，样本少时仅供参考）："));for(const w of r.weak_areas||[])box.append(hint(`${w.bank}：${w.correct} / ${w.answered} 题`));report.append(box);}if(!data.length)report.append(hint("该周暂无记录"));}
    week.control.addEventListener("change",()=>loadReport().catch(e=>showStatus(errorText(e))));await loadReport();
    if(canEdit){await loadClasses();const banks=await query(supabaseClient.from("pet_challenge_banks").select("id,name").eq("is_active",true).is("merged_into",null));
      const form=card("给班级布置学习任务","发布时保存班级成员快照。按发布后、截止日内在该题库答完的题数计算；错题复习不计入任务。不会额外发币。"),cls=select("任务班级",classes.filter(c=>c.is_active).map(c=>[c.id,c.name])),bank=select("任务子题库",banks.map(b=>[b.id,b.name])),type=select("任务题型",[["choice","选择题"],["word","单词题"]],"choice"),target=input("目标题数","number",10),due=input("截止日期","date",toISODate(addDays(getScheduleToday(),7)));
      target.control.min=1;target.control.max=500;due.control.min=toISODate(getScheduleToday());let requestId=crypto.randomUUID();
      form.append(cls.field,bank.field,type.field,target.field,due.field,button("发布任务",async()=>{await rpc("create_learning_assignment",{p_request_id:requestId,p_class_id:cls.control.value,p_bank_id:bank.control.value,p_type:type.control.value,p_target:Number(target.control.value),p_deadline:due.control.value});requestId=crypto.randomUUID();await open("learning");showStatus("学习任务已发布");},true));body.append(form);
    }
    body.append(el("h3",canEdit?"任务完成情况":"我的学习任务"));const assignments=list();body.append(assignments);let offset=0;const more=button("加载更多学习任务",loadTasks);body.append(more);
    async function loadTasks(){const data=await rpc("get_learning_assignments",{p_offset:offset});if(!offset&&data.length)assignments.replaceChildren();for(const a of data){const complete=a.answered>=a.question_target;const box=card(`${canEdit?`${a.username} · `:""}${a.bank_name} · ${a.challenge_type==="choice"?"选择题":"单词题"}`,`${a.class_name} · 截止 ${a.deadline} · ${a.cancelled_at?"已取消":complete?"已完成":a.deadline<toISODate(getScheduleToday())?"已截止":"进行中"}`);box.append(el("p",`${a.answered} / ${a.question_target} 题 · 答对 ${a.correct} 题`));
      if(canEdit&&!a.cancelled_at)box.append(button("取消此班级任务",async()=>{if(!await confirmAction("取消整个班级的这项任务？","已完成的答题记录与已获得金币不会删除。"))return;await rpc("cancel_learning_assignment",{p_id:a.id});await open("learning");}));
      if(!canEdit&&!a.cancelled_at&&!complete&&a.deadline>=toISODate(getScheduleToday()))box.append(button("前往挑战",async()=>{await showStudentChallenge();setChallengeType(a.challenge_type);const bankOption=availableChallengeBanks.find(b=>b.bank_id===a.bank_id&&b.challenge_type===a.challenge_type);if(!bankOption){showStatus("此题库暂不可挑战，请联系曾老师");return;}challengeState.bankId=a.bank_id;challengeState.bankName=a.bank_name;document.querySelector("#studentChallengeBank").value=a.bank_id;showStatus(`已选择 ${a.bank_name}，开始挑战即可计入任务`);},true));assignments.append(box);}offset+=data.length;more.hidden=data.length<100;}await loadTasks();
  }
  async function scheduleSummary(){
    if(!ready||!currentUser){summary.hidden=true;return;}const token=++summaryToken;
    let start,end;
    if(scheduleView==="week"){start=new Date(selectedWeekStart);end=addDays(start,6);}else if(scheduleView==="month"){start=new Date(selectedCalendarDate.getFullYear(),selectedCalendarDate.getMonth(),1);end=new Date(start.getFullYear(),start.getMonth()+1,0);}else{start=new Date(selectedCalendarDate.getFullYear(),0,1);end=new Date(start.getFullYear(),11,31);}
    try{const data=await rpc("get_attendance_summary",{p_start:toISODate(start),p_end:toISODate(end)});if(token!==summaryToken)return;summary.hidden=false;summary.textContent=`本视图实际打卡：到课 ${data.present}${canEdit?" 人次":" 次"} · 补课 ${data.makeup} · 请假 ${data.leave}。排课数含未来课程，不等于实际到课${data.legacy?`；含 ${data.legacy} 条旧版按日记录`:""}。`;}catch{if(token===summaryToken){summary.hidden=false;summary.textContent="实际打卡统计暂未读到，请检查网络后刷新。";}}
  }
  return {get ready(){return ready;},get canDeleteStudents(){return canDeleteStudents;},sessionChanged,hide,open,deleteStudent,refreshDashboard,fillClassPicker,classGroups,productStock,shopRequestId,finishShopRequest,scheduleSummary};
})();
if (currentUser) void window.CourseOperations.sessionChanged();
