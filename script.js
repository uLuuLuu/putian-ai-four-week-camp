/* ==========================================================================
   AI 动手四周营 · 莆田学院 × 腾讯云AI 交流圈
   交互脚本：hash 路由 / 侧栏树 / 鼠标轨迹 / 打卡进度 / 复制 / 教学文件下载
   依赖：index.html + style.css + assets/
   ========================================================================== */
'use strict';

/* ==========================================================================
   〇、工具
   ========================================================================== */
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));
const esc = (s) =>
  String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

/* ==========================================================================
   一、数据区（改内容只用改这里）
   ========================================================================== */
const WEEKS = [
  {
    id: 1,
    label: 'Week 1',
    tab: '装 WorkBuddy',
    icon: 'assets/icons/week1.svg',
    title: '把 WorkBuddy 装进你的电脑',
    subtitle: '装一个能真的动手干活的 AI 同事',
    duration: '约 25 分钟',
    prereq: '无，零门槛',
    output: '1 个能跑通任务的 WorkBuddy',
    level: '★☆☆☆☆',
    goal:
      '很多同学不是不会用 AI，是打开对话框之后不知道说什么。这一周的目标很简单：<b>把工具装好、让它认识你、现场跑通一个任务</b>。装完这一步，你就跨过了最难的那个门槛。',
    steps: [
      '<b>下载安装</b>：打开官网 <a href="https://www.workbuddy.cn/" target="_blank" rel="noopener noreferrer">workbuddy.cn</a>，往下拉到页面最底部的「<b>立即下载</b>」。Windows 只有一个包直接下；<b>Mac 有两个包，选错会闪退</b>——点苹果菜单 → 关于本机 → 看「芯片」：Apple M 系列选 <code>Mac ARM64</code>，Intel Core 选 <code>Mac x64</code>。Win 弹蓝色警告点「更多信息 → 仍要运行」；Mac 提示开发者不明就去「系统设置 → 隐私与安全性」点「仍要打开」。',
      '<b>微信扫码登录</b>：新用户有限时免费的体验版额度，这几周的练习量完全够用，先不用考虑付费。',
      '<b>选一个模型</b>：在输入框下方找「模型选择」，不知道选哪个就问它「当前推荐哪个模型做内容生成」。',
      '<b>建工作空间（别跳过）</b>：自己动手建一个文件夹当它的"工位"（Win：<code>D:\\AI工作区</code>；Mac：<code>~/Documents/AI工作区</code>），里面再建 <code>01-原始资料</code> / <code>02-我的项目</code> / <code>03-产出</code>。然后在输入框左下角点「<b>选择工作空间</b>」选中它。不选的话，它生成的文件会散落在默认目录，你下次根本找不到。',
      '<b>验证工作空间</b>：问它"你现在的工作空间是哪个目录？把这个目录下的文件列给我看"，报出的路径要和你建的文件夹<b>对得上</b>。对不上就是没选上。',
      '<b>五步初始化</b>：让它认识你（专业/年级/在忙什么）→ 挑一个语气 → 装 1 个技能 → 连上你的数据线。全都是"对着它说一句话"，不用点设置菜单。',
      '<b>跑通第一个任务</b>：让它整理你的乱文件夹、做一份期末复习计划，或者建一个每天早上自动推送信息的任务。',
      '<b>记住一件事</b>：WorkBuddy 是跑在<strong>你电脑上</strong>的本地应用，电脑关机 = 定时任务不执行。',
    ],
    check: [
      '能正常打开 WorkBuddy，微信扫码登录成功',
      '选好了模型（不是默认的 Auto 状态）',
      '自己建了 AI工作区 文件夹，并设成了工作空间',
      '让它报过一次工作空间路径，和你文件夹的实际路径对得上',
      '告诉过它你的专业、年级、正在忙的事',
      '至少装上了 1 个技能',
      '跑通了一个任务，右侧结果区拿到了真实文件',
      '知道「电脑关机定时任务不跑」这件事',
    ],
    links: [{ label: '打开 WorkBuddy 官网下载', url: 'https://www.workbuddy.cn/' }],
    playCopy:
      '⚡ 本周效率挑战：\n用 AI 做一件"以前至少要花 1 小时"的事。\n可以是：整理课堂笔记 / 做 PPT 大纲 / 改简历 / 总结论文 / 安排复习计划\n做完来群里说一句：我用 AI 省下了____分钟。\n看看谁是这一周真正的效率王。',
    more: [
      '课表截图转日历（整学期一次搞定）',
      '让 AI 把你乱糟糟的下载文件夹整理成三类',
      '建一个"每天早上 8 点推送今日待办"的定时任务',
    ],
  },
  {
    id: 2,
    label: 'Week 2',
    tab: '搭你的知识库',
    icon: 'assets/icons/week2.svg',
    title: '搭一个会自己长大的知识库',
    subtitle: '让资料从"存下来"变成"能被问出来"',
    duration: '约 70 分钟（30 收 + 40 编译）',
    prereq: '完成第 1 周',
    output: '1 个能查的知识库 + 1 个能自己长大的知识网络',
    level: '★★☆☆☆',
    goal:
      '这一周解决一个具体问题：<b>资料越存越多，却越来越用不上</b>。用 ima 收资料，再让 WorkBuddy 把资料编译成"会长大"的知识网络——一份素材进来，牵动多个页面更新。',
    steps: [
      '<b>【第一部分】装 ima</b>：去 <a href="https://ima.qq.com/" target="_blank" rel="noopener noreferrer">ima.qq.com</a> 下载客户端。四个入口数据自动同步，建议「电脑客户端 + 微信小程序」两个就够——小程序负责随手收，客户端负责整理。',
      '<b>建知识库 + 定结构</b>：改个好名字，然后<b>手动建 3 个文件夹</b>：<code>01-原始素材</code> / <code>02-知识页</code> / <code>03-我的产出</code>。这 3 个对应「存储 / 处理 / 思考」，<b>别建超过 3 个</b>。',
      '<b>让 WorkBuddy 帮你"备菜"</b>：先扫描你本地那堆乱文件，去重、合并、给命名建议，生成一份《导入清单》——你再照着清单往 ima 里拖。',
      '<b>投喂</b>：六种收集方式——本地文件拖拽 / 微信群文件 / 公众号文章一键存 / 网页链接 / 图片（能认字）/ 录音（自动转文字）。<b>别一次投 200 个，先投 5 份。</b>',
      '<b>学会用 @ 提问</b>：提问时带上 <code>@你的知识库名</code>，它才会只从你存的资料里找答案。',
      '<b>【第二部分】打通 WorkBuddy × ima</b>：这是本周<b>唯一的硬门槛</b>。在连接器管理里找到 ima 点「信任」授权；要 Key 就去 <a href="https://ima.qq.com/agent-interface" target="_blank" rel="noopener noreferrer">ima.qq.com/agent-interface</a> 拿。连通后发「列出我的所有知识库」验证。',
      '<b>让 AI 采访你</b>：冷启动最爽的一步——你不需要写任何东西，它一次问一个问题，把你的私人知识"问"出来。通常 15–20 个问题。',
      '<b>让它设计并搭建骨架</b>：基于采访结果规划知识页、子分类、<b>命名规则</b>、以及「总索引」和「操作日志」两个特殊页。<b>先看方案再执行。</b>',
      '<b>跑第一次"摄入"</b>：说一句「检查有哪些没处理过的素材，执行一次摄入」，看它通读、建摘要页、更新相关页面、标注矛盾、建立引用、更新索引、追加日志——<b>一份素材牵动多个页面</b>。',
      '<b>同一个问题问两边</b>：先去 ima 原生问答问，再让 WorkBuddy 读知识页答。<b>对比两边的回答，你就亲眼看到了"检索"和"编译"的区别。</b>',
    ],
    check: [
      'ima 装好并登录成功',
      '建好了自己的知识库，并手动建好 3 个文件夹',
      '用 WorkBuddy 做过一次「导入前整理」，拿到了清单',
      '01-原始素材 里至少 5 份资料，用到 3 种以上收集方式',
      '成功用 @知识库名 提过问，答案引用了你的资料',
      '★ WorkBuddy 能列出你的知识库（连通成功）',
      '完成了 AI 采访，它对你有了相当完整的了解',
      '02-知识页 里有知识页，「总索引」和「操作日志」都建好了',
      '★ 跑通过至少一次「摄入」，看到过一份素材牵动多个页面',
      '做过"同一个问题问两边"的对比，有自己的感受',
      '知道三条习惯：只追加不覆盖 / 想清楚再动手 / 写错就追加更正',
    ],
    links: [
      { label: 'ima 官网下载', url: 'https://ima.qq.com/' },
      { label: 'ima 智能接口（拿 Key）', url: 'https://ima.qq.com/agent-interface' },
    ],
    playCopy:
      '🗂️ 想问问大家：如果给你大学四年的资料建一个 AI 知识库，你第一批会放什么？\n\n① 课程 PPT\n② 论文资料\n③ 考研资料\n④ 面经 / 八股\n⑤ Prompt 收藏\n\n我最近觉得 ima 这种知识库工具很适合资料多的人，\n关键是先别贪多，先从一个场景开始。\n\n我先来：我第一批放的是这学期所有专业课课件。',
    more: [
      '把一门专业课的课件 + 笔记建成一个"期末急救知识库"',
      '用知识库回答"我这份简历还有哪些没写出来的经历"',
      '建一个社团资料库：活动方案 + 复盘 + 通讯录',
    ],
  },
  {
    id: 3,
    label: 'Week 3',
    tab: '做第一个 Skill',
    icon: 'assets/icons/week3.svg',
    title: '做你的第一个 Skill',
    subtitle: '把一件重复的事，口述成能复用的技能',
    duration: '约 40 分钟',
    prereq: '完成第 2 周（有知识库效果更好）',
    output: '1 个可复用、可分享的 Skill',
    level: '★★★☆☆',
    goal:
      'Skill 是"你把怎么做一件事讲清楚，AI 帮你固化成可复用能力"。这一周你会拥有第一个<b>能传下去</b>的 AI 资产——导出一个文件夹发给同学就能用。',
    steps: [
      '<b>先筛选，别急着动手</b>：用三个标准过一遍——会重复（做过 ≥3 次）、有套路（每次步骤差不多）、有明确输出（会产出具体东西）。三条全中才值得做。',
      '<b>口述流程</b>：不用学怎么写 Skill，你只要会"说"。像带新人一样把步骤讲出来，重点是<b>「你最在意的三条规矩」</b>这一栏千万别空——它是防止 AI 偷懒编造的护栏。',
      '<b>生成 Skill</b>：确认它复述的理解无误后，让它生成 Skill 文件、写入你的规矩、告诉你安装路径、给你 3 个调用示例。',
      '<b>立刻试跑</b>：用真实素材跑一次，并让它自己交代「哪一步是猜的」。第一次不完美很正常。',
      '<b>迭代改 3 轮</b>：不改代码，只改说法。每次改完用同一个输入重跑对比。改 2–3 次基本就稳了。',
      '<b>导出分享</b>：Skill 是可以导出成文件夹发给同学的——这是你第一个能"传下去"的 AI 资产。',
    ],
    check: [
      '能用自己的话说清 Skill 是什么',
      '用三个标准筛出了要做的那件事',
      '把流程完整口述给了 WorkBuddy，并确认了它的复述',
      '给出了至少 3 条"最在意的规矩"',
      'Skill 生成成功，知道它装在哪',
      '用真实素材试跑过至少 1 次',
      '迭代修改过至少 1 轮，并对比了前后差别',
      '导出了 Skill 文件夹，准备分享',
    ],
    links: [],
    playCopy:
      '🎯 Prompt 擂台开打！\n\n今天的任务：用一句话让 AI 写出"最土但最真诚的情书"。\n\n规则很简单：\n1. 每人发一句 Prompt\n2. 可以晒 AI 生成结果\n3. 大家投票选"土味天花板"\n\n不要怕离谱，越像大学生整活越好😂\n（做完这个你就知道，为什么有些 Prompt 一次就中，有些怎么改都不行）',
    more: [
      '「课堂笔记整理器」：把老师发的 PPT 变成结构化复习笔记',
      '「简历项目挖掘器」：从一段经历里挖出可量化的成果表述',
      '「群公告生成器」：一条消息改成三档详细程度的通知',
    ],
  },
  {
    id: 4,
    label: 'Week 4',
    tab: '做个人网页',
    icon: 'assets/icons/week4.svg',
    title: '做个人网页并上线',
    subtitle: '把前三周攒的东西装进橱窗，拿一个能发出去的链接',
    duration: '约 60 分钟',
    prereq: '完成第 2、3 周（没做知识库也有替代方案）',
    output: '1 个公网可访问的个人主页',
    level: '★★★★☆',
    goal:
      '前三周攒的是"能力"，这一周攒的是"证据"。4 个模块的内容（我是谁 / 我会什么 / 我做过什么 / 怎么找我）<b>全是私人知识</b>——别自己硬憋，让 AI 读你的知识页帮你起草。',
    steps: [
      '<b>★ 先让 AI 读你的知识库</b>：第 2 周那 40 分钟在这里兑现。4 个模块的内容<b>全是私人知识</b>——别自己硬憋，让 WorkBuddy 读你的知识页，从你自己的经历和偏好里起草。<b>没做知识库的话，就用"让 AI 当面试官反问你"这个替代方案。</b>',
      '<b>先定内容，别一上来就让 AI 做</b>：这是最常见的失败方式。先拿到「网页内容清单」，确认 4 个模块都有内容，再动手。',
      '<b>用标准四文件结构生成</b>：<code>index.html</code>（内容）+ <code>style.css</code>（样式）+ <code>script.js</code>（交互）+ <code>assets/</code>（图片图标）。要求它只用<b>相对路径</b>，所有资源双击就能打开。',
      '<b>本地打开看，改到满意</b>：双击 index.html 就能看。改配色、改字号、改布局，全程只用嘴说。想看手机效果按 F12 切手机预览。',
      '<b>让它一次给 2 个风格版本</b>：深色科技风 vs 浅色简约风，放两个文件夹对比，选一个。',
      '<b>部署上线</b>：最简单是直接让它一键部署给你公网链接；想练手可以选 GitHub Pages。',
      '<b>换设备验证</b>：把链接发给一个同学，让他在自己手机上打开——路径问题只有换设备才会暴露。',
    ],
    check: [
      '有「网页内容清单」，4 个模块都有内容',
      '（做了知识库的同学）内容是 AI 读你的知识页生成的，不是你硬憋的',
      '目录结构是 index.html + style.css + script.js + assets/',
      '所有资源引用都是相对路径，没有 C:\\ 或 /Users/ 开头的',
      '本地双击 index.html 能正常打开，样式和图片都在',
      '手机上打开也正常（响应式生效）',
      '至少改过 1 轮，对比了不同风格',
      '拿到公网链接，并且在别人的手机上打开验证过',
      '没放手机号、身份证等隐私信息',
      '已经把链接写进简历或个人介绍里',
    ],
    links: [],
    playCopy:
      '🏆 本周 AI 作品墙开放选题：个人主页巡礼。\n\n这周大家陆续做出了自己的个人主页，\n欢迎把链接发到群里，格式：\n\n名字 + 主页链接 + 一句话说明你放了什么\n\n互相看看、互相提建议。\n做得好的会进群精华，也会作为社群优秀案例推荐出去。\n（提醒：主页上别放手机号、身份证这些隐私信息）',
    more: [
      '把社团招新做成一个单页（比长图好传播）',
      '给课程作业做一个"作品说明页"',
    '做一个"我的 2026"年度小结页',
  ],
  },
];

/* ---------- 逐周开放时间（按真实排期推进解锁） ---------- */
const OPEN_DATES = { 1: '2026-10-19', 2: '2026-10-26', 3: '2026-11-02', 4: '2026-11-09' };
let previewAllOpen = false; // 管理员预览：临时把所有周当作已开放

function pad2(n) {
  return (n < 10 ? '0' : '') + n;
}
function parseOpen(s) {
  const p = s.split('-');
  return new Date(+p[0], +p[1] - 1, +p[2]);
}
function todayMid() {
  const t = new Date();
  return new Date(t.getFullYear(), t.getMonth(), t.getDate());
}
function openLabel(wk) {
  const d = parseOpen(OPEN_DATES[wk.id]);
  return d.getMonth() + 1 + '月' + d.getDate() + '日';
}
function weekIsOpen(wk) {
  if (previewAllOpen) return true;
  return todayMid().getTime() >= parseOpen(OPEN_DATES[wk.id]).getTime();
}
function openCount() {
  return WEEKS.filter(weekIsOpen).length;
}
/** 当前最新已开放的周（按 id 最大）；都没开放则返回 null */
function latestOpenWeek() {
  let lw = null;
  WEEKS.forEach((w) => {
    if (weekIsOpen(w)) lw = w;
  });
  return lw;
}
/** 统一的开放状态徽章，三处（日历 / 路线卡 / 周 tab）共用 */
function statusChip(wk, size) {
  const open = weekIsOpen(wk);
  const cls = 'chip ' + (open ? 'chip--ok' : 'chip--lock') + (size ? ' chip--' + size : '');
  const txt = open ? '已开放' : openLabel(wk) + '开放';
  return '<span class="' + cls + '">' + txt + '</span>';
}

/* ---------- 群内互动玩法 ---------- */
const PLAYS = [
  { cat: '产品体验', title: '今天你用 AI 做了哪件小事', text: '【今天你用 AI 做了哪件小事？】\n不是非要做大项目。改一句话、总结一页资料、查一个概念、排一个计划，都算。\n如果没用，也说说为什么：不知道用在哪？还是懒得打开？\n我先来：今天 AI 帮我把待办重新排了优先级。' },
  { cat: '软广种草', title: '场景接龙：我最想用 AI 解决____', text: '来个真实场景接龙：\n我最想用 AI 解决______。\n可以很具体，比如"帮我把老师发的 20 页 PPT 整理成复习重点""帮我把简历写得像真的做过项目""帮社团少开两次会"\n我先来：我最想用 AI 解决 ddl 太多时不知道先做哪个。' },
  { cat: '学习提效', title: '效率挑战：你省下了多少分钟', text: '⚡ 本周效率挑战：\n用 AI 做一件"以前至少要花 1 小时"的事。\n可以是：\n📄 整理课堂笔记  📊 做 PPT 大纲  📝 改简历  📚 总结论文  📌 安排复习计划\n做完来群里说一句：我用 AI 省下了____分钟。\n看看谁是真正的效率王。' },
  { cat: 'Prompt 教学', title: '把烂 Prompt 改成好 Prompt', text: '【把烂 Prompt 改成好 Prompt】\n烂版：帮我写论文。\n好版要补：角色、主题、字数、结构、资料、语气、输出格式。\n公式记一下：\n角色 + 任务 + 背景 + 输出要求\n你会怎么改？评论区交作业，优秀版本我整理成模板发群里。' },
  { cat: 'Prompt 分享', title: '万能学习 Prompt，建议收藏', text: '【万能学习 Prompt，建议收藏】\n你是一名会讲大白话的助教。请解释这个概念，要求：\n1. 先用一句话说清楚\n2. 举一个大学生能懂的例子\n3. 列 3 道自测题\n你想拿哪个概念试试？\n（把"这个概念"换成你卡住的任何一个词）' },
  { cat: '产品体验', title: '资料太多？ima 适合这些人', text: '【资料太多？ima 适合这些人】\n考研党：放专业课资料\n论文党：放文献和笔记\n求职党：放面经和项目复盘\n社团人：放活动方案和 SOP\n你如果建知识库，第一类资料会放什么？\n（我第一批放的是这学期的全部专业课课件）' },
  { cat: 'AI 共创', title: 'AI 工具吐槽局', text: '🧯 AI 工具吐槽局。\n用的时候最让你难受的是啥？\n① 答案太虚 ② 格式很乱 ③ 文件读不准 ④ 不懂学生场景 ⑤ 反应慢 ⑥ 其他\n可以直接吐槽，越具体越有用。\n我们会把高频问题整理反馈上去。' },
  { cat: '软广种草', title: '本周 AI 作品墙更新', text: '🏆 本周 AI 作品墙更新！\n这周看到几位同学用 AI 做出了很实用的东西：\n📌 复习思维导图  📌 社团招新文案  📌 简历优化版本  📌 课程汇报 PPT 大纲\n欢迎继续投稿，优秀作品下周上墙。\n重点不是炫技，是让大家看到 AI 真的能帮上忙。' },
  { cat: '游戏互动', title: 'AI 猜专业小游戏', text: '【AI 猜专业小游戏】\n发一句你专业里最典型的话，让 AI 猜你的专业。\n例：今天又在画受力分析 / 又在背传播学 / 又在调 bug / 又在做培养皿\n看看它能不能猜中，也看看哪个专业最有辨识度👀' },
  { cat: 'AI 角色扮演', title: '面试模拟间开放', text: '🎤 面试模拟间开放。\n想练的同学可以发：专业 + 目标岗位 + 最怕的问题\nAI 先当面试官问一轮，大家再一起帮你改回答。\n别等真面试才发现自己说不清项目经历。\n社恐同学可以先围观。' },
  { cat: '留存共创', title: 'AI 功能许愿池', text: '🪄 开一个 AI 功能许愿池。\n如果 AI 真的要为大学生做一个功能，你最想要什么？\n比如：\n一键整理课堂录音 / 论文格式检查 / 简历项目挖掘 / 期末复习排期 / 社团活动方案生成\n不用考虑能不能实现，先说你最想要的。' },
  { cat: '激活讨论', title: 'AI 新闻真假怎么判断？', text: '【AI 新闻真假怎么判断？】\n看到离谱消息，别急着转发。我一般三步：\n查来源：是不是官方/权威媒体\n问 AI：让它列证据和反证\n再判断：有没有夸大标题党\n你遇到过最离谱的 AI 新闻是什么？' },
  { cat: 'Prompt 擂台', title: '同一任务，不同写法', text: '🎯 Prompt 擂台：\n同一个任务，每人用一句 Prompt 实现，看谁的一次成。\n今天的题目：把一段口语化的聊天记录，整理成正式的会议纪要。\n规则：\n1. 只发你的 Prompt，不发结果\n2. 大家互相改一版\n3. 最后统一跑，看哪版最稳\n（这是提升 Prompt 能力最快的方式：看别人怎么切问题）' },
];

/* ---------- 常见问题 ---------- */
const FAQS = [
  {
    q: '四周内容是按时间线开放的吗？',
    a: '是，按开放时间<b>逐步解锁</b>：第 1 周 10 月 19 日、第 2 周 10 月 26 日、第 3 周 11 月 2 日、第 4 周 11 月 9 日。每到对应日期，那一周就会标记为「已开放」。但<b>无论是否到时间，任意一周都能随时点开看完整内容</b>——进度快的可以先看后面的。建议按周推进：一周只做一件事，做完就有一个能用的东西。',
  },
  {
    q: '每周要花多少时间？',
    a: '第 1 周约 25 分钟；第 2 周约 30 分钟（把资料收进来）+ 约 40 分钟（让 AI 把资料编译成知识）；第 3 周约 40 分钟；第 4 周约 60 分钟。<b>建议一次做完，中间别断</b>，分两次反而容易卡在半路。',
  },
  {
    q: '做出来的东西能写进简历吗？',
    a: '能，而且这是这四周最被低估的收获。一句「独立设计并落地 4 个 AI 自动化技能，其中 X 个已分享给班级同学使用」，比「熟悉办公软件」有说服力得多。第 4 周的个人主页链接也可以直接放在简历抬头。',
  },
  {
    q: '卡住了该问谁？',
    a: '先按这个格式发到群里，别只发「我不会」：<br><code>【求助】专业-年级-名字 我做到第__步 我看到的报错/现象：（截图或原文） 我已经试过：（写你试过什么）</code><br>这样别人一看就知道怎么帮你，回得也快。',
  },
  {
    q: '我是零基础，跟得上吗？',
    a: '跟得上，这套内容就是按零基础设计的：全程只用嘴说，不写一行代码。唯一需要动手的是建文件夹和点按钮。真卡住了按上面的格式发群，比一个人闷头试快得多。',
  },
  {
    q: '必须按 1→2→3→4 的顺序做吗？',
    a: '强烈建议。第 2 周用第 1 周装好的 WorkBuddy，第 3 周用第 2 周的知识库，第 4 周用前三周攒的全部东西——<b>这是一条递进链，跳周会断</b>。有兴趣的内容可以先看，但动手做请按顺序。',
  },
];

/* ---------- 教学文件 ---------- */
const DOCS = [
  { week: 1, title: 'Week1 教学文件', desc: '装 WorkBuddy + 跑通任务', icon: '📄' },
  { week: 2, title: 'Week2 教学文件', desc: '搭 ima 知识库 + 摄入', icon: '📄' },
  { week: 3, title: 'Week3 教学文件', desc: '做第一个 Skill', icon: '📄' },
  { week: 4, title: 'Week4 教学文件', desc: '做个人网页并上线', icon: '📄' },
];

const CHECKIN_TMPL =
  '【Week_ 打卡】专业-年级-名字\n✅ 我完成了：______\n💡 最有收获的一点：______\n🆘 卡住的地方（没有就写"无"）：______';

/* ==========================================================================
   二、路由（hash：每个导航项 = 一个独立页面视图）
   ========================================================================== */
const ROUTES = ['/', '/calendar', '/week', '/docs', '/plays', '/checkin', '/faq', '/join'];

function routeOf(hash) {
  const h = (hash || '').replace(/^#/, '') || '/';
  const parts = h.split('/').filter(Boolean);
  if (!parts.length) return { name: '/', week: 1 };
  if (parts[0] === 'week') {
    const w = Math.min(4, Math.max(1, parseInt(parts[1] || '1', 10) || 1));
    return { name: '/week', week: w };
  }
  const name = '/' + parts[0];
  return { name: ROUTES.indexOf(name) >= 0 ? name : '/', week: 1 };
}

function currentRoute() {
  return routeOf(location.hash);
}

function applyRoute(opts) {
  opts = opts || {};
  const r = currentRoute();
  if (ROUTES.indexOf(r.name) < 0) {
    location.replace('#/');
    return;
  }

  // 切换视图
  $$('.view').forEach((v) => v.classList.toggle('is-active', v.dataset.view === r.name));

  // 顶部导航高亮
  $$('#navLinks a').forEach((a) => a.classList.toggle('is-active', a.dataset.route === r.name));

  // 侧栏高亮
  markSideActive(r);

  // 每周详情：切 tab
  if (r.name === '/week') applyActiveTab(r.week);

  // 关闭移动端菜单
  closeMobileNav();

  // 滚回顶部（锚点跳转不滚）
  if (!opts.keepScroll) window.scrollTo(0, 0);

  // 重新触发滚动淡入
  const active = $('.view.is-active');
  if (active) {
    $$('.reveal', active).forEach((el) => el.classList.remove('is-in'));
    requestAnimationFrame(() => revealScan());
  }
  updateReadProgress();
}

/* ==========================================================================
   三、侧边目录栏
   ========================================================================== */
function navGroups() {
  return [
    {
      title: '开始',
      items: [
        { route: '/', label: '主页' },
        { route: '/calendar', label: '课程日历' },
      ],
    },
    {
      title: '四周',
      items: WEEKS.map((w) => ({ route: '/week/' + w.id, label: 'W' + w.id + ' · ' + w.tab })),
    },
    {
      title: '资源',
      items: [
        { route: '/docs', label: '教学文件' },
        { route: '/plays', label: '互动玩法' },
      ],
    },
    {
      title: '其他',
      items: [
        { route: '/checkin', label: '打卡进度' },
        { route: '/faq', label: '常见问题' },
        { route: '/join', label: '加入社群' },
      ],
    },
  ];
}

function renderSideNav() {
  const box = $('#sideNav');
  if (!box) return;
  box.innerHTML = navGroups()
    .map(
      (g) => `
    <div class="side__group">
      <p class="side__title">${esc(g.title)}</p>
      <ul class="side__list">
        ${g.items
          .map(
            (it) =>
              '<li><a class="side__link" href="#' +
              it.route +
              '" data-side="' +
              it.route +
              '"><span>' +
              esc(it.label) +
              '</span></a></li>'
          )
          .join('')}
      </ul>
    </div>`
    )
    .join('');
}

function markSideActive(r) {
  const want = r.name === '/week' ? '/week/' + r.week : r.name;
  $$('#sideNav .side__link').forEach((a) => a.classList.toggle('is-active', a.dataset.side === want));
}

function renderFootLinks() {
  const box = $('#footLinks');
  if (!box) return;
  const items = [];
  navGroups().forEach((g) => g.items.forEach((it) => items.push(it)));
  box.innerHTML = items
    .map((it) => '<a href="#' + it.route + '">' + esc(it.label) + '</a>')
    .join('');
}

/* ==========================================================================
   四、打卡进度（本地保存）
   ========================================================================== */
const PKEY = 'ptu_camp_progress_v1';
function readProgress() {
  try {
    const a = JSON.parse(localStorage.getItem(PKEY) || '[]');
    return [0, 1, 2, 3].map((i) => !!a[i]);
  } catch (e) {
    return [false, false, false, false];
  }
}
function writeProgress(arr) {
  try {
    localStorage.setItem(PKEY, JSON.stringify(arr));
  } catch (e) {}
}
/** 下一个该做的周 = 第一个没完成的周；全完成则返回第 4 周 */
function nextWeek() {
  const p = readProgress();
  for (let i = 0; i < 4; i++) if (!p[i]) return i + 1;
  return 4;
}

function renderProgress() {
  const p = readProgress();
  const done = p.filter(Boolean).length;
  const dc = $('#doneCount');
  const bar = $('#progressBar');
  const msg = $('#progressMsg');
  if (dc) dc.textContent = done;
  if (bar) bar.style.width = (done / 4) * 100 + '%';
  if (msg) {
    if (done === 0) msg.textContent = '从第 1 周开始吧，先把它装进电脑。';
    else if (done < 4) msg.textContent = '已完成 ' + done + ' 周，下一周是第 ' + nextWeek() + ' 周。';
    else msg.textContent = '🎉 四周全完成，你已经有自己的 AI 工作流了。';
  }
  // 主页状态条
  const hs = $('#homeStatus');
  if (hs) hs.innerHTML = renderStatusbarHTML(done);
  // 清单
  const list = $('#checklist');
  if (list) {
    list.innerHTML = WEEKS.map(
      (w) =>
        '<li class="' +
        (p[w.id - 1] ? 'is-done' : '') +
        '">' +
        '<input type="checkbox" id="pw' +
        w.id +
        '"' +
        (p[w.id - 1] ? ' checked' : '') +
        '>' +
        '<label for="pw' +
        w.id +
        '">WEEK ' +
        w.id +
        ' · ' +
        esc(w.title) +
        '</label>' +
        '<span class="cdone">' +
        (p[w.id - 1] ? '✓ 已完成' : '') +
        '</span>' +
        '</li>'
    ).join('');
    $$('#checklist input').forEach((cb) => {
      cb.addEventListener('change', () => {
        const id = parseInt(cb.id.replace('pw', ''), 10);
        const arr = readProgress();
        arr[id - 1] = cb.checked;
        writeProgress(arr);
        renderProgress();
        renderHomeFocus();
        toast(cb.checked ? '第 ' + id + ' 周已标记完成 ✓' : '已取消第 ' + id + ' 周的完成标记');
      });
    });
  }
  renderHomeFocus();
}

function renderStatusbarHTML(done) {
  const focusW = latestOpenWeek() || WEEKS[0];
  const nOpen = openCount();
  return (
    '<div class="statusbar">' +
    '<div class="statusbar__cell"><span>开放状态</span><b>' +
    nOpen +
    ' / 4 周已开放</b></div>' +
    '<div class="statusbar__cell statusbar__cell--wide"><span>本周主推</span><b>《' +
    esc(focusW.title) +
    '》</b></div>' +
    '<div class="statusbar__cell"><span>我的打卡</span><b>' +
    done +
    ' / 4 周</b></div>' +
    '<div class="statusbar__act">' +
    '<a class="btn btn--primary btn--sm" href="#/week/' +
    focusW.id +
    '">进入第 ' +
    focusW.id +
    ' 周</a>' +
    '<a class="btn btn--ghost-dark btn--sm" href="#/checkin">去打卡</a>' +
    '</div>' +
    '</div>'
  );
}

function renderRuleCard() {
  const box = $('#ruleCard');
  if (!box) return;
  box.innerHTML =
    '<h4>打卡规矩</h4>' +
    '<p><b>1.</b> 一周一条，做完就发，不用等齐全。</p>' +
    '<p><b>2.</b> 格式里的下划线填不满也没关系，发出来就行。</p>' +
    '<p><b>3.</b> 卡住的地方写出来，比写"无"更有价值——那就是别人的答疑素材。</p>' +
    '<p><b>4.</b> 进度只存在你这台浏览器里，清缓存会丢；群里的打卡记录才是公认的。</p>';
}

/* ==========================================================================
   五、主页各区块
   ========================================================================== */
function renderHomeFocus() {
  const box = $('#homeFocus');
  if (!box) return;
  const p = readProgress();
  const done = p.filter(Boolean).length;
  const lw = latestOpenWeek();
  const w = lw || WEEKS[0];
  const open = !!lw;
  let k;
  if (done === 4) k = 'ALL DONE · 四周全完成';
  else if (!open) k = 'SOON · ' + openLabel(w) + ' 开放';
  else k = 'NOW · 第 ' + w.id + ' 周进行中';
  box.innerHTML =
    '<div class="focus">' +
    '<img class="focus__icon" src="' +
    w.icon +
    '" alt="">' +
    '<div>' +
    '<span class="focus__k">' +
    k +
    '</span>' +
    '<h3>' +
    esc(w.title) +
    '</h3>' +
    '<p>' +
    esc(w.subtitle) +
    ' · ' +
    esc(w.duration) +
    ' · 产出：' +
    esc(w.output) +
    '</p>' +
    '</div>' +
    '<a class="btn btn--primary" href="#/week/' +
    w.id +
    '">进入第 ' +
    w.id +
    ' 周 →</a>' +
    '</div>';
}

function calrowHTML(w, compact) {
  return (
    '<article class="calrow">' +
    '<div class="calrow__no"><b>W' +
    w.id +
    '</b></div>' +
    '<div class="calrow__main"><h4>' +
    esc(w.title) +
    '</h4><p>' +
    esc(w.subtitle) +
    '</p></div>' +
    '<div class="calrow__meta">' +
    '<span class="calrow__when">' +
    esc(w.duration) +
    '</span>' +
    '<span>前置：' +
    esc(w.prereq) +
    '</span>' +
    '</div>' +
    '<div class="calrow__act">' +
    statusChip(w) +
    '<a class="linkbtn" href="#/week/' +
    w.id +
    '">进入 →</a>' +
    '</div>' +
    '</article>'
  );
}

function renderCalendars() {
  const home = $('#calendarList');
  if (home) home.innerHTML = WEEKS.map((w) => calrowHTML(w, true)).join('');
  const full = $('#calendarFull');
  if (full) full.innerHTML = WEEKS.map((w) => calrowHTML(w, false)).join('');
}

function renderRoad() {
  const box = $('#roadGrid');
  if (!box) return;
  box.innerHTML = WEEKS.map(
    (w) =>
      '<a class="roadcard" href="#/week/' +
      w.id +
      '">' +
      '<span class="roadcard__badge">' +
      statusChip(w, 'xs') +
      '</span>' +
      '<div class="roadcard__top">' +
      '<img class="roadcard__icon" src="' +
      w.icon +
      '" alt="">' +
      '<div><span class="roadcard__no">WEEK ' +
      w.id +
      '</span><h3 class="roadcard__t">' +
      esc(w.title) +
      '</h3></div>' +
      '</div>' +
      '<p class="roadcard__sub">' +
      esc(w.subtitle) +
      '</p>' +
      '<div class="roadcard__foot">' +
      '<span class="roadcard__dur">⏱ ' +
      esc(w.duration) +
      ' · ' +
      esc(w.level) +
      '</span>' +
      '<span class="linkbtn">进入 →</span>' +
      '</div>' +
      '</a>'
  ).join('');
}

function rescardHTML(d) {
  return (
    '<div class="rescard">' +
    '<span class="rescard__icon">' +
    d.icon +
    '</span>' +
    '<div class="rescard__meta"><b>' +
    esc(d.title) +
    '</b><span>' +
    esc(d.desc) +
    '</span></div>' +
    '<button class="btn btn--sm" type="button" data-dl="' +
    d.week +
    '">下载 .md</button>' +
    '</div>'
  );
}

function renderDocs() {
  const home = $('#homeDocs');
  if (home) home.innerHTML = '<div class="reslist">' + DOCS.map(rescardHTML).join('') + '</div>';
  const full = $('#resList');
  if (full) full.innerHTML = '<div class="reslist">' + DOCS.map(rescardHTML).join('') + '</div>';
}

function renderPlays() {
  const box = $('#playsGrid');
  if (!box) return;
  box.innerHTML = PLAYS.map(
    (p) =>
      '<div class="playcard">' +
      '<span class="playcard__cat">' +
      esc(p.cat) +
      '</span>' +
      '<h4>' +
      esc(p.title) +
      '</h4>' +
      '<pre class="code" id="play_' +
      PLAYS.indexOf(p) +
      '">' +
      esc(p.text) +
      '</pre>' +
      '<button class="btn btn--ghost-dark btn--sm" type="button" data-copy="#play_' +
      PLAYS.indexOf(p) +
      '">复制文案</button>' +
      '</div>'
  ).join('');
}

function renderFaqs() {
  const box = $('#faqList');
  if (!box) return;
  box.innerHTML = FAQS.map(
    (f) =>
      '<div class="faqitem"><q>' +
      esc(f.q) +
      '</q><div class="a">' +
      f.a +
      '</div></div>'
  ).join('');
}

/* ---------- 主页折叠区 ---------- */
function renderFolds() {
  const box = $('#homeFolds');
  if (!box) return;
  const folds = [
    {
      t: '打卡规矩：怎么发才有人回',
      b:
        '<p><b>格式</b>：<code>【Week_ 打卡】专业-年级-名字</code>，后面三项能填多少填多少。</p>' +
        '<p><b>卡住的地方一定要写出来</b>——那是最有价值的答疑素材，比写"无"有用得多。</p>' +
        '<p><b>求助格式</b>：<code>【求助】专业-年级-名字 我做到第__步 我看到的报错/现象 我已经试过</code></p>',
    },
    {
      t: '玩法精选：先挑这 3 个发起',
      b:
        '<p><b>① 今天你用 AI 做了哪件小事</b>——门槛最低，适合冷启动，没人答也自然。</p>' +
        '<p><b>② 效率挑战：省下多少分钟</b>——配合第 1 周打卡，能量化。</p>' +
        '<p><b>③ AI 猜专业小游戏</b>——纯娱乐，适合活跃气氛、拉沉默的人说话。</p>' +
        '<p class="hintline">完整 13 个玩法（含可复制文案）在 <a href="#/plays">互动玩法页</a>。</p>',
    },
    {
      t: '四周分别做出什么（一句话版）',
      b:
        '<p><b>W1</b> 一个能跑通任务的 WorkBuddy</p>' +
        '<p><b>W2</b> 一个能查、能自己长大的知识库</p>' +
        '<p><b>W3</b> 一个可复用、可分享的 Skill</p>' +
        '<p><b>W4</b> 一个公网可访问的个人主页链接</p>',
    },
  ];
  box.innerHTML = folds
    .map(
      (f, i) =>
        '<div class="fold' +
        (i === 0 ? ' is-open' : '') +
        '">' +
        '<button class="fold__head" type="button">' +
        esc(f.t) +
        '<i>▾</i></button>' +
        '<div class="fold__body">' +
        f.b +
        '</div>' +
        '</div>'
    )
    .join('');
  $$('.fold__head', box).forEach((h) =>
    h.addEventListener('click', () => h.parentElement.classList.toggle('is-open'))
  );
}

/* ==========================================================================
   六、每周详情（tabs + panels）
   ========================================================================== */
function ckKey(w) {
  return 'ptu_ck_' + w;
}

function weekPanelHTML(w) {
  const meta = [
    ['预计用时', w.duration],
    ['前置要求', w.prereq],
    ['本周产出', w.output],
    ['难度', w.level],
  ];
  return (
    '<div class="wkcard">' +
    '<div class="wkcard__head">' +
    '<img class="wkcard__icon" src="' +
    w.icon +
    '" alt="">' +
    '<div><span class="wkcard__k">' +
    w.label +
    ' · 把工具变成能力</span>' +
    '<h2>' +
    esc(w.title) +
    '</h2>' +
    '<p class="wkcard__sub">' +
    esc(w.subtitle) +
    '</p></div>' +
    '</div>' +
    '<div class="wkcard__goal">' +
    w.goal +
    '</div>' +
    '<ul class="wkmeta">' +
    meta
      .map((m) => '<li><b>' + esc(m[0]) + '</b>' + esc(m[1]) + '</li>')
      .join('') +
    '</ul>' +
    '<p class="sec-mini">分步指引</p>' +
    '<ol class="steps">' +
    w.steps.map((s) => '<li>' + s + '</li>').join('') +
    '</ol>' +
    '<p class="sec-mini">验收清单（点方框打勾，进度自动保存）</p>' +
    '<ul class="check" data-w="' +
    w.id +
    '">' +
    w.check
      .map((c, i) => {
        const star = c.indexOf('★') === 0;
        const label = star ? '<span class="star">★</span> ' + esc(c.slice(1).trim()) : esc(c);
        return (
          '<li><input type="checkbox" class="ckbox" data-i="' +
          i +
          '" id="ck' +
          w.id +
          '_' +
          i +
          '"><label for="ck' +
          w.id +
          '_' +
          i +
          '">' +
          label +
          '</label></li>'
        );
      })
      .join('') +
    '</ul>' +
    (w.links && w.links.length
      ? '<p class="sec-mini">相关链接</p><div>' +
        w.links
          .map(
            (l) =>
              '<a class="wklink" href="' +
              esc(l.url) +
              '" target="_blank" rel="noopener noreferrer">🔗 ' +
              esc(l.label) +
              '</a>'
          )
          .join('') +
        '</div>'
      : '') +
    '<p class="sec-mini">本周打卡格式</p>' +
    '<pre class="code" id="w' +
    w.id +
    'checkin">【Week' +
    w.id +
    ' 打卡】专业-年级-名字\n✅ 我完成了：' +
    esc(w.output) +
    '\n💡 最有收获的一点：______\n🆘 卡住的地方（没有就写"无"）：______</pre>' +
    '<button class="btn btn--ghost-dark btn--sm" type="button" data-copy="#w' +
    w.id +
    'checkin">复制打卡格式</button>' +
    '<p class="sec-mini">群内互动 · 本周话题</p>' +
    '<pre class="code" id="w' +
    w.id +
    'topic">' +
    esc(w.playCopy) +
    '</pre>' +
    '<button class="btn btn--ghost-dark btn--sm" type="button" data-copy="#w' +
    w.id +
    'topic">复制话题文案</button>' +
    '<p class="sec-mini">举一反三</p>' +
    '<ul class="more">' +
    w.more.map((m) => '<li>' + esc(m) + '</li>').join('') +
    '</ul>' +
    '<div style="margin-top:22px;display:flex;gap:10px;flex-wrap:wrap">' +
    (w.id < 4
      ? '<a class="btn btn--primary" href="#/week/' + (w.id + 1) + '">下一周：' + esc(WEEKS[w.id].tab) + ' →</a>'
      : '<a class="btn btn--primary" href="#/join">加入社群，与伙伴交流共创 →</a>') +
    '<button class="btn btn--ghost-dark" type="button" data-dl="' +
    w.id +
    '">下载本周教学文件</button>' +
    '</div>' +
    '</div>'
  );
}

function renderWeekTabs() {
  const box = $('#weekTabs');
  if (!box) return;
  box.innerHTML = WEEKS.map(
    (w) =>
      '<button class="tab" type="button" role="tab" data-w="' +
      w.id +
      '"><img src="' +
      w.icon +
      '" alt="">W' +
      w.id +
      ' · ' +
      esc(w.tab) +
      '<span class="tab__chip">' +
      statusChip(w, 'xs') +
      '</span></button>'
  ).join('');
  $$('.tab', box).forEach((t) =>
    t.addEventListener('click', () => {
      location.hash = '#/week/' + t.dataset.w;
    })
  );
}

function renderWeekPanels() {
  const box = $('#weekPanels');
  if (!box) return;
  box.innerHTML = WEEKS.map(
    (w) => '<div class="panel" data-w="' + w.id + '">' + weekPanelHTML(w) + '</div>'
  ).join('');
  // 恢复清单勾选状态
  $$('.panel .check').forEach((ul) => {
    const w = parseInt(ul.dataset.w, 10);
    let saved = [];
    try {
      saved = JSON.parse(localStorage.getItem(ckKey(w)) || '[]');
    } catch (e) {}
    $$('.ckbox', ul).forEach((cb) => {
      const i = parseInt(cb.dataset.i, 10);
      if (saved[i]) {
        cb.checked = true;
        cb.closest('li').classList.add('is-done');
      }
      cb.addEventListener('change', () => {
        let arr = [];
        try {
          arr = JSON.parse(localStorage.getItem(ckKey(w)) || '[]');
        } catch (e) {}
        arr[i] = cb.checked;
        try {
          localStorage.setItem(ckKey(w), JSON.stringify(arr));
        } catch (e) {}
        cb.closest('li').classList.toggle('is-done', cb.checked);
      });
    });
  });
}

function applyActiveTab(week) {
  const w = week || currentRoute().week || 1;
  $$('.tab').forEach((t) => t.classList.toggle('is-active', parseInt(t.dataset.w, 10) === w));
  $$('.panel').forEach((p) => p.classList.toggle('is-active', parseInt(p.dataset.w, 10) === w));
}

/* ==========================================================================
   七、复制 / 下载 / toast
   ========================================================================== */
let toastTimer;
function toast(msg) {
  const t = $('#toast');
  if (!t) return;
  t.textContent = msg || '已复制 ✓';
  t.classList.add('is-show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('is-show'), 1600);
}

function copyText(txt) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(txt).then(() => toast('已复制 ✓')).catch(() => legacyCopy(txt));
  } else {
    legacyCopy(txt);
  }
}
function legacyCopy(txt) {
  const ta = document.createElement('textarea');
  ta.value = txt;
  ta.setAttribute('readonly', '');
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    toast('已复制 ✓');
  } catch (e) {
    toast('复制失败，请手动选中复制');
  }
  document.body.removeChild(ta);
}

/** 由数据生成 Markdown（本地双击打开时的下载源） */
function buildMd(w) {
  const L = [];
  L.push('# ' + w.label + ' 教学文件 · ' + w.title);
  L.push('');
  L.push('## 目标');
  L.push(w.goal.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());
  L.push('');
  L.push('- 预计用时：' + w.duration);
  L.push('- 前置要求：' + w.prereq);
  L.push('- 本周产出：' + w.output);
  L.push('- 难度：' + w.level);
  L.push('');
  L.push('## 分步指引');
  w.steps.forEach((s, i) => {
    L.push((i + 1) + '. ' + s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());
  });
  L.push('');
  L.push('## 验收清单');
  w.check.forEach((c) => L.push('- [ ] ' + c));
  if (w.links && w.links.length) {
    L.push('');
    L.push('## 相关链接');
    w.links.forEach((l) => L.push('- ' + l.label + '：' + l.url));
  }
  L.push('');
  L.push('## 打卡格式');
  L.push('```');
  L.push('【Week' + w.id + ' 打卡】专业-年级-名字');
  L.push('✅ 我完成了：' + w.output);
  L.push('💡 最有收获的一点：______');
  L.push('🆘 卡住的地方（没有就写"无"）：______');
  L.push('```');
  L.push('');
  L.push('## 举一反三');
  w.more.forEach((m) => L.push('- ' + m));
  L.push('');
  return L.join('\n');
}

function dl(week) {
  const w = WEEKS[week - 1];
  if (!w) return;
  const fallback = buildMd(w);
  const finish = (text) => {
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'week' + week + '-' + w.tab.replace(/\s+/g, '') + '.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    toast('已开始下载 Week' + week + ' 教学文件');
  };
  // 优先读 assets/teaching/ 下的真实文件（部署后改文件即生效）；
  // file:// 双击打开时 fetch 会被浏览器拦截，此时用内置副本。
  if (location.protocol === 'http:' || location.protocol === 'https:') {
    fetch('assets/teaching/week' + week + '.md')
      .then((r) => (r.ok ? r.text() : Promise.reject()))
      .then(finish)
      .catch(() => finish(fallback));
  } else {
    finish(fallback);
  }
}

/* ==========================================================================
   八、动效：鼠标轨迹 / 开场 / 进度条 / 回顶 / 淡入 / 卡片微光
   ========================================================================== */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- 鼠标轨迹 ---------- */
function initTrail() {
  const cvs = $('#trail');
  if (!cvs || reduceMotion) return;
  const ctx = cvs.getContext('2d');
  let pts = [];
  let raf = null;
  function resize() {
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = ['108,92,231', '99,91,255', '0,184,169'];
  window.addEventListener(
    'mousemove',
    (e) => {
      pts.push({ x: e.clientX, y: e.clientY, t: performance.now(), c: COLORS[pts.length % 3] });
      if (pts.length > 26) pts.shift();
      if (!raf) raf = requestAnimationFrame(draw);
    },
    { passive: true }
  );

  function draw() {
    const now = performance.now();
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    pts = pts.filter((p) => now - p.t < 620);
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      const age = (now - p.t) / 620;
      const r = 2 + (1 - age) * 5;
      ctx.beginPath();
      ctx.fillStyle = 'rgba(' + p.c + ',' + (0.34 * (1 - age)).toFixed(3) + ')';
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    raf = pts.length ? requestAnimationFrame(draw) : null;
  }
}

/* ---------- 开场动画 ---------- */
function initSplash() {
  const s = $('#splash');
  if (!s) return;
  const hide = () => s.classList.add('is-done');
  if (reduceMotion) {
    hide();
    return;
  }
  setTimeout(hide, 900);
  window.addEventListener('keydown', hide, { once: true });
}

/* ---------- 顶部栏 / 阅读进度 / 回顶 ---------- */
function initScroll() {
  const nav = $('#nav');
  const bar = $('#readProgress');
  const top = $('#toTop');
  function upd() {
    const y = window.scrollY || 0;
    if (nav) nav.classList.toggle('is-stuck', y > 12);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.width = (h > 0 ? Math.min(100, (y / h) * 100) : 0) + '%';
    if (top) top.classList.toggle('is-show', y > 500);
  }
  upd();
  window.addEventListener('scroll', upd, { passive: true });
  window.addEventListener('resize', upd);
  if (top)
    top.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));
}
function updateReadProgress() {
  const bar = $('#readProgress');
  if (!bar) return;
  const h = document.documentElement.scrollHeight - window.innerHeight;
  const y = window.scrollY || 0;
  bar.style.width = (h > 0 ? Math.min(100, (y / h) * 100) : 0) + '%';
}

/* ---------- 滚动淡入 ---------- */
let io = null;
function revealScan() {
  if (!io) return;
  $$('.reveal').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight - 60) el.classList.add('is-in');
    else io.observe(el);
  });
}
function initReveal() {
  if (reduceMotion) {
    $$('.reveal').forEach((el) => el.classList.add('is-in'));
    return;
  }
  io = new IntersectionObserver(
    (es) => {
      es.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.06, rootMargin: '0px 0px -40px 0px' }
  );
  revealScan();
}

/* ---------- 卡片鼠标微光 ---------- */
function initGlow() {
  if (reduceMotion) return;
  $$('.roadcard, .rescard, .playcard, .card, .calrow, .faqitem, .statusbar, .focus').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
      el.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
    });
  });
}

/* ---------- 移动端菜单 ---------- */
function closeMobileNav() {
  const links = $('#navLinks');
  const burger = $('#navBurger');
  const side = $('#side');
  if (links) links.classList.remove('is-open');
  if (burger) burger.classList.remove('is-open');
  if (side) side.classList.remove('is-open');
  if (burger) burger.setAttribute('aria-expanded', 'false');
}
function initMobileNav() {
  const burger = $('#navBurger');
  const links = $('#navLinks');
  if (burger && links)
    burger.addEventListener('click', () => {
      const on = !links.classList.contains('is-open');
      links.classList.toggle('is-open', on);
      burger.classList.toggle('is-open', on);
      burger.setAttribute('aria-expanded', on ? 'true' : 'false');
    });
  // 窄屏：点击左侧目录以外的区域关闭抽屉
  document.addEventListener('click', (e) => {
    const side = $('#side');
    if (!side || !side.classList.contains('is-open')) return;
    if (side.contains(e.target)) return;
    const b = $('#navBurger');
    if (b && b.contains(e.target)) return;
    side.classList.remove('is-open');
  });
}

/* ==========================================================================
   九、初始化
   ========================================================================== */
// 加入页：社群二维码 <-> 负责人个人微信 切换
function initQrSwitch(){
  const btn = $('#switchQr');
  if(!btn) return;
  const img = $('#joinQr');
  const txt = $('#joinQrText');
  const label = $('#switchQrText');
  const hint = $('#qrHint');
  const GROUP = 'assets/qr-group.jpg';
  const PERSONAL = 'assets/qr-personal.jpg';
  btn.addEventListener('click', () => {
    const toPersonal = img.getAttribute('src') === GROUP;
    if(toPersonal){
      img.src = PERSONAL;
      img.alt = '负责人 西米Luu 个人微信';
      label.textContent = '切换到社群二维码';
      txt.textContent = '微信 扫一扫，添加负责人';
      hint.textContent = '当前显示：负责人个人微信';
      toast('已切换到负责人微信');
    } else {
      img.src = GROUP;
      img.alt = '莆田学院 × 腾讯云AI 交流圈 入群二维码';
      label.textContent = '切换到负责人微信';
      txt.textContent = '微信 / 企业微信 扫码加入';
      hint.textContent = '当前显示：社群二维码';
      toast('已切回社群二维码');
    }
  });
}

function initPreview() {
  const gear = $('#previewGear');
  const banner = $('#previewBanner');
  const exit = $('#previewExit');
  if (!gear) return;
  function apply() {
    renderCalendars();
    renderRoad();
    renderWeekTabs();
    renderProgress();
    applyActiveTab();
    initGlow();
    if (previewAllOpen) {
      gear.classList.add('is-on');
      if (banner) banner.hidden = false;
    } else {
      gear.classList.remove('is-on');
      if (banner) banner.hidden = true;
    }
  }
  gear.addEventListener('click', () => {
    previewAllOpen = true;
    apply();
    toast('预览模式：所有周显示为「已开放」');
  });
  if (exit)
    exit.addEventListener('click', () => {
      previewAllOpen = false;
      apply();
      toast('已退出预览');
    });
}

function init() {
  renderSideNav();
  renderFootLinks();
  renderCalendars();
  renderRoad();
  renderHomeFocus();
  renderDocs();
  renderFolds();
  renderWeekTabs();
  renderWeekPanels();
  renderPlays();
  renderFaqs();
  renderRuleCard();
  renderProgress();

  // 复制按钮（data-copy="#id"）
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-copy]');
    if (btn) {
      const el = $(btn.getAttribute('data-copy'));
      if (el) copyText(el.innerText);
      return;
    }
    const dlb = e.target.closest('[data-dl]');
    if (dlb) dl(parseInt(dlb.getAttribute('data-dl'), 10));
  });

  // 清空打卡
  const reset = $('#resetProgress');
  if (reset)
    reset.addEventListener('click', () => {
      if (!confirm('确定清空本机打卡记录？（只清你这台浏览器的记录，不影响群里）')) return;
      writeProgress([false, false, false, false]);
      renderProgress();
      toast('已清空本机打卡记录');
    });

  initSplash();
  initTrail();
  initScroll();
  initReveal();
  initGlow();
  initMobileNav();
  initQrSwitch();
  initPreview();

  window.addEventListener('hashchange', () => applyRoute());
  applyRoute();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
