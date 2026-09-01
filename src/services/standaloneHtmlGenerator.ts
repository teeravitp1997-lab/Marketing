export function generateStandaloneHtml(): string {
  return `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Marketing Collaboration Hub - Real-time</title>
  
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            brand: {
              50: '#eef2ff',
              100: '#e0e7ff',
              500: '#6366f1',
              600: '#4f46e5',
              700: '#4338ca',
              900: '#312e81',
            }
          }
        }
      }
    }
  </script>

  <!-- Google Fonts & Lucide Icons -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Prompt:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://unpkg.com/lucide@latest"></script>

  <style>
    body {
      font-family: 'Plus Jakarta Sans', 'Prompt', sans-serif;
    }
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: rgba(15, 23, 42, 0.6);
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(79, 70, 229, 0.4);
      border-radius: 9999px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: rgba(79, 70, 229, 0.8);
    }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased selection:bg-indigo-500 selection:text-white">

  <!-- ==========================================
       HEADER & NAVIGATION BAR
       ========================================== -->
  <header class="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      
      <!-- Brand Logo -->
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
          <i data-lucide="layers" class="w-5 h-5 text-white"></i>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-lg font-bold text-white tracking-tight">Marketing Hub</h1>
            <span id="syncStatusBadge" class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              Local Sync Mode
            </span>
          </div>
          <p class="text-xs text-slate-400">Offline · Online · Graphic Real-time Collaboration</p>
        </div>
      </div>

      <!-- Action & Controls -->
      <div class="flex items-center gap-2 sm:gap-3">
        <!-- Firebase Setup Button -->
        <button onclick="openConfigModal()" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition">
          <i data-lucide="database" class="w-3.5 h-3.5 text-amber-400"></i>
          <span class="hidden sm:inline">ตั้งค่า Firebase</span>
        </button>

        <!-- New Task Button -->
        <button onclick="openTaskModal()" class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition">
          <i data-lucide="plus-circle" class="w-4 h-4"></i>
          <span>สร้างงาน / บรีฟ</span>
        </button>
      </div>

    </div>
  </header>

  <!-- ==========================================
       MAIN CONTENT CONTAINER
       ========================================== -->
  <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

    <!-- 1. DASHBOARD OVERVIEW SECTION -->
    <section class="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <!-- Campaign Card -->
      <div class="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div class="flex items-start justify-between">
          <div>
            <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-2">
              <i data-lucide="sparkles" class="w-3 h-3"></i> แคมเปญหลักที่กำลังดำเนินงาน
            </div>
            <h2 id="campaignTitle" class="text-lg font-bold text-white">Q3 Mega Brand Re-launch & 9.9 Super Sale</h2>
            <p class="text-xs text-slate-400 mt-1">ระยะเวลา: <span id="campaignDates">15 ส.ค. - 30 ก.ย. 2026</span></p>
          </div>
          <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Active</span>
        </div>

        <div class="mt-5 grid grid-cols-3 gap-3 pt-4 border-t border-slate-800/80">
          <div>
            <span class="text-xs text-slate-400">งบประมาณรวม</span>
            <p id="totalBudgetDisplay" class="text-base font-bold text-white mt-0.5">฿850,000</p>
          </div>
          <div>
            <span class="text-xs text-slate-400">ใช้ไปแล้ว</span>
            <p id="spentBudgetDisplay" class="text-base font-bold text-amber-400 mt-0.5">฿385,000</p>
          </div>
          <div>
            <span class="text-xs text-slate-400">คงเหลือ</span>
            <p id="remainingBudgetDisplay" class="text-base font-bold text-emerald-400 mt-0.5">฿465,000</p>
          </div>
        </div>
      </div>

      <!-- Quick Status Metric Summary -->
      <div class="grid grid-cols-2 gap-3 lg:col-span-2">
        <div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5">
          <div class="w-10 h-10 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center">
            <i data-lucide="circle" class="w-5 h-5"></i>
          </div>
          <div>
            <p class="text-xs text-slate-400">รอดำเนินการ (To Do)</p>
            <p id="countTodo" class="text-xl font-bold text-white">0</p>
          </div>
        </div>

        <div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5">
          <div class="w-10 h-10 rounded-xl bg-indigo-950/60 text-indigo-400 border border-indigo-800/40 flex items-center justify-center">
            <i data-lucide="loader" class="w-5 h-5 animate-spin"></i>
          </div>
          <div>
            <p class="text-xs text-slate-400">กำลังทำ (In Progress)</p>
            <p id="countInProgress" class="text-xl font-bold text-indigo-400">0</p>
          </div>
        </div>

        <div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5">
          <div class="w-10 h-10 rounded-xl bg-amber-950/60 text-amber-400 border border-amber-800/40 flex items-center justify-center">
            <i data-lucide="eye" class="w-5 h-5"></i>
          </div>
          <div>
            <p class="text-xs text-slate-400">รอตรวจ / รีวิว (Review)</p>
            <p id="countReview" class="text-xl font-bold text-amber-400">0</p>
          </div>
        </div>

        <div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5">
          <div class="w-10 h-10 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 flex items-center justify-center">
            <i data-lucide="check-circle-2" class="w-5 h-5"></i>
          </div>
          <div>
            <p class="text-xs text-slate-400">เสร็จสิ้น (Done)</p>
            <p id="countDone" class="text-xl font-bold text-emerald-400">0</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 2. ROLE FILTER & SEARCH BAR -->
    <section class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/40 p-3 rounded-2xl border border-slate-800/80">
      
      <!-- Role Filter Pills -->
      <div class="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 custom-scrollbar">
        <button onclick="setRoleFilter('all')" id="btn-role-all" class="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 text-white transition">
          ทั้งหมด (All Roles)
        </button>
        <button onclick="setRoleFilter('offline')" id="btn-role-offline" class="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-slate-800/80 hover:bg-slate-800 text-slate-300 transition flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-amber-400"></span> Offline Team (อีเวนต์/หน้าร้าน)
        </button>
        <button onclick="setRoleFilter('online')" id="btn-role-online" class="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-slate-800/80 hover:bg-slate-800 text-slate-300 transition flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-sky-400"></span> Online Team (Ads/Content)
        </button>
        <button onclick="setRoleFilter('graphic')" id="btn-role-graphic" class="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-slate-800/80 hover:bg-slate-800 text-slate-300 transition flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-pink-400"></span> Graphic Team (บรีฟ/ไฟล์งาน)
        </button>
      </div>

      <!-- Search Input -->
      <div class="relative min-w-[220px]">
        <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"></i>
        <input type="text" id="searchInput" oninput="handleSearch(this.value)" placeholder="ค้นหางาน, บรีฟ, สเปค..." class="w-full pl-9 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500">
      </div>
    </section>

    <!-- 3. KANBAN BOARD SYSTEM (REAL-TIME) -->
    <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
      
      <!-- Column: To Do -->
      <div class="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-3 flex flex-col min-h-[480px]">
        <div class="flex items-center justify-between pb-3 mb-2 border-b border-slate-800">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
            <h3 class="text-xs font-bold text-slate-200 uppercase tracking-wider">To Do (รอดำเนินการ)</h3>
          </div>
          <span id="badge-todo" class="px-2 py-0.5 text-xs font-bold rounded-md bg-slate-800 text-slate-300">0</span>
        </div>
        <div id="column-todo" class="space-y-3 flex-1"></div>
      </div>

      <!-- Column: In Progress -->
      <div class="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-3 flex flex-col min-h-[480px]">
        <div class="flex items-center justify-between pb-3 mb-2 border-b border-slate-800">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-indigo-400"></span>
            <h3 class="text-xs font-bold text-slate-200 uppercase tracking-wider">In Progress (กำลังทำ)</h3>
          </div>
          <span id="badge-in_progress" class="px-2 py-0.5 text-xs font-bold rounded-md bg-indigo-950 text-indigo-300 border border-indigo-800/40">0</span>
        </div>
        <div id="column-in_progress" class="space-y-3 flex-1"></div>
      </div>

      <!-- Column: Review -->
      <div class="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-3 flex flex-col min-h-[480px]">
        <div class="flex items-center justify-between pb-3 mb-2 border-b border-slate-800">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <h3 class="text-xs font-bold text-slate-200 uppercase tracking-wider">Review (รอตรวจ/บรีฟ)</h3>
          </div>
          <span id="badge-review" class="px-2 py-0.5 text-xs font-bold rounded-md bg-amber-950 text-amber-300 border border-amber-800/40">0</span>
        </div>
        <div id="column-review" class="space-y-3 flex-1"></div>
      </div>

      <!-- Column: Done -->
      <div class="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-3 flex flex-col min-h-[480px]">
        <div class="flex items-center justify-between pb-3 mb-2 border-b border-slate-800">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <h3 class="text-xs font-bold text-slate-200 uppercase tracking-wider">Done (เสร็จสมบูรณ์)</h3>
          </div>
          <span id="badge-done" class="px-2 py-0.5 text-xs font-bold rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800/40">0</span>
        </div>
        <div id="column-done" class="space-y-3 flex-1"></div>
      </div>

    </section>

    <!-- 4. SHARED ASSET LIBRARY SECTION -->
    <section class="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div>
          <h2 class="text-base font-bold text-white flex items-center gap-2">
            <i data-lucide="folder-git-2" class="w-5 h-5 text-indigo-400"></i>
            Shared Asset Library (คลังไฟล์ & ลิงก์สำคัญ)
          </h2>
          <p class="text-xs text-slate-400">ลิงก์ Google Drive, Figma, Canva, Artwork พร้อมใช้ร่วมกันของทีม</p>
        </div>
        <button onclick="openAssetModal()" class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 transition">
          <i data-lucide="plus" class="w-3.5 h-3.5"></i>
          เพิ่มลิงก์ชิ้นงาน
        </button>
      </div>

      <div id="assetsContainer" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <!-- Asset Cards will be rendered here -->
      </div>
    </section>

  </main>

  <!-- ==========================================
       TASK / BRIEF CREATE & EDIT MODAL
       ========================================== -->
  <div id="taskModal" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm hidden items-center justify-center p-4 overflow-y-auto">
    <div class="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl my-8">
      <div class="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
        <h3 id="taskModalTitle" class="text-base font-bold text-white">สร้างงานใหม่ / บรีฟงาน</h3>
        <button onclick="closeTaskModal()" class="text-slate-400 hover:text-white p-1 rounded-lg">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <form id="taskForm" onsubmit="handleTaskSubmit(event)" class="p-6 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
        <input type="hidden" id="taskId">

        <div>
          <label class="block text-xs font-medium text-slate-300 mb-1">ชื่องาน / หัวข้อบรีฟ *</label>
          <input type="text" id="taskTitleInput" required class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500" placeholder="เช่น แคมเปญ Ads 9.9, บรีฟป้าย Standee หน้าร้าน">
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">ทีมที่รับผิดชอบ (Role) *</label>
            <select id="taskRoleSelect" onchange="toggleRoleSpecificFields(this.value)" class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500">
              <option value="offline">Offline (อีเวนต์/หน้าร้าน/พิมพ์)</option>
              <option value="online">Online (Ads/Content/SEO)</option>
              <option value="graphic">Graphic (บรีฟ/Figma/Artwork)</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">สถานะ (Status) *</label>
            <select id="taskStatusSelect" class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500">
              <option value="todo">To Do (รอดำเนินการ)</option>
              <option value="in_progress">In Progress (กำลังทำ)</option>
              <option value="review">Review (รอตรวจ/รีวิว)</option>
              <option value="done">Done (เสร็จสมบูรณ์)</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">ความสำคัญ (Priority)</label>
            <select id="taskPrioritySelect" class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500">
              <option value="medium">Medium</option>
              <option value="urgent">Urgent (ด่วนที่สุด)</option>
              <option value="high">High (สำคัญ)</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">กำหนดส่ง (Due Date)</label>
            <input type="date" id="taskDueDateInput" class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500">
          </div>
        </div>

        <!-- Role-Specific: Graphic Team Fields -->
        <div id="graphicFields" class="p-3.5 bg-pink-950/20 border border-pink-900/40 rounded-xl space-y-3">
          <div class="text-xs font-semibold text-pink-300 flex items-center gap-1.5">
            <i data-lucide="palette" class="w-3.5 h-3.5"></i> สเปคสำหรับ Graphic Team
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-xs text-slate-300 mb-1">เวอร์ชันงาน (Version)</label>
              <input type="text" id="taskVersionInput" placeholder="เช่น v1.0, v2.1 Revised, Final" class="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white">
            </div>
            <div>
              <label class="block text-xs text-slate-300 mb-1">ลิงก์ Figma / Preview</label>
              <input type="url" id="taskFigmaInput" placeholder="https://figma.com/file/..." class="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white">
            </div>
          </div>
          <div>
            <label class="block text-xs text-slate-300 mb-1">ลิงก์ Google Drive / ไฟล์แนบ</label>
            <input type="url" id="taskDriveInput" placeholder="https://drive.google.com/..." class="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white">
          </div>
          <div>
            <label class="block text-xs text-slate-300 mb-1">โน้ตผลการตรวจ / Feedback</label>
            <input type="text" id="taskReviewNotesInput" placeholder="คอมเมนต์แก้ไข หรือข้อเสนอแนะ..." class="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white">
          </div>
        </div>

        <!-- Role-Specific: Offline Fields -->
        <div id="offlineFields" class="p-3.5 bg-amber-950/20 border border-amber-900/40 rounded-xl space-y-3 hidden">
          <div class="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
            <i data-lucide="map-pin" class="w-3.5 h-3.5"></i> รายละเอียดงาน Offline / อีเวนต์
          </div>
          <div>
            <label class="block text-xs text-slate-300 mb-1">สถานที่จัดงาน / สาขาติดตั้ง</label>
            <input type="text" id="taskLocationInput" placeholder="เช่น ลานกิจกรรม Central World, สาขา 1-10" class="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white">
          </div>
          <div>
            <label class="block text-xs text-slate-300 mb-1">สเปคงานพิมพ์ / วัสดุ</label>
            <input type="text" id="taskPrintSpecsInput" placeholder="เช่น PP Board 5mm ไดคัท, ผ้า Tension 6x3m" class="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white">
          </div>
        </div>

        <!-- Role-Specific: Online Fields -->
        <div id="onlineFields" class="p-3.5 bg-sky-950/20 border border-sky-900/40 rounded-xl space-y-3 hidden">
          <div class="text-xs font-semibold text-sky-300 flex items-center gap-1.5">
            <i data-lucide="globe" class="w-3.5 h-3.5"></i> ช่องทาง Online Ads / Content
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-xs text-slate-300 mb-1">แพลตฟอร์ม</label>
              <input type="text" id="taskPlatformInput" placeholder="เช่น Meta Ads, TikTok, SEO" class="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white">
            </div>
            <div>
              <label class="block text-xs text-slate-300 mb-1">เป้าหมาย KPI</label>
              <input type="text" id="taskKpiInput" placeholder="เช่น ROAS > 4x, CVR 3.5%" class="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white">
            </div>
          </div>
        </div>

        <div>
          <label class="block text-xs font-medium text-slate-300 mb-1">รายละเอียดบรีฟ (Description)</label>
          <textarea id="taskDescInput" rows="3" class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500" placeholder="อธิบายรายละเอียดงาน, ข้อกำหนด, สิ่งที่ต้องส่งมอบ..."></textarea>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">ผู้รับผิดชอบ (Assignee)</label>
            <input type="text" id="taskAssigneeInput" placeholder="ชื่อผู้รับผิดชอบ" class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white">
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">งบประมาณ (บาท)</label>
            <input type="number" id="taskBudgetInput" placeholder="0" class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white">
          </div>
        </div>

        <div class="pt-4 border-t border-slate-800 flex items-center justify-between">
          <button type="button" id="btnDeleteTask" onclick="handleDeleteTask()" class="px-3.5 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition hidden">
            ลบงานนี้
          </button>
          <div class="flex items-center gap-2 ml-auto">
            <button type="button" onclick="closeTaskModal()" class="px-4 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300">
              ยกเลิก
            </button>
            <button type="submit" class="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30">
              บันทึกงาน
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>

  <!-- ==========================================
       SHARED ASSET ADD MODAL
       ========================================== -->
  <div id="assetModal" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
      <div class="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
        <h3 class="text-base font-bold text-white">เพิ่มชิ้นงานในคลัง (Asset Link)</h3>
        <button onclick="closeAssetModal()" class="text-slate-400 hover:text-white p-1 rounded-lg">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <form id="assetForm" onsubmit="handleAssetSubmit(event)" class="p-6 space-y-4">
        <div>
          <label class="block text-xs font-medium text-slate-300 mb-1">ชื่อชิ้นงาน / ไฟล์ *</label>
          <input type="text" id="assetTitleInput" required placeholder="เช่น Brand Guideline 2026, Figma Master Banner" class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white">
        </div>

        <div>
          <label class="block text-xs font-medium text-slate-300 mb-1">URL ลิงก์ไฟล์ *</label>
          <input type="url" id="assetUrlInput" required placeholder="https://drive.google.com/... หรือ https://figma.com/..." class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white">
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">ประเภท</label>
            <select id="assetCategorySelect" class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white">
              <option value="brand_guideline">Brand Guideline</option>
              <option value="graphic_template">Graphic Template</option>
              <option value="footage_photo">Footage / Photo</option>
              <option value="offline_print">Offline Print</option>
              <option value="online_ads">Online Ads</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">บริการ (Provider)</label>
            <select id="assetProviderSelect" class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white">
              <option value="Google Drive">Google Drive</option>
              <option value="Figma">Figma</option>
              <option value="Canva">Canva</option>
              <option value="Dropbox">Dropbox</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-xs font-medium text-slate-300 mb-1">คำอธิบายเพิ่มเติม</label>
          <input type="text" id="assetDescInput" placeholder="รายละเอียดไฟล์ ขนาดฟอนต์ หรือรหัสผ่าน (ถ้ามี)" class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white">
        </div>

        <div class="pt-4 border-t border-slate-800 flex items-center justify-end gap-2">
          <button type="button" onclick="closeAssetModal()" class="px-4 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300">
            ยกเลิก
          </button>
          <button type="submit" class="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white">
            บันทึกชิ้นงาน
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- ==========================================
       FIREBASE CONFIGURATION MODAL
       ========================================== -->
  <div id="configModal" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
      <div class="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <i data-lucide="database" class="w-5 h-5 text-amber-400"></i>
          <h3 class="text-base font-bold text-white">ตั้งค่า Firebase Realtime Database</h3>
        </div>
        <button onclick="closeConfigModal()" class="text-slate-400 hover:text-white p-1 rounded-lg">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <div class="p-6 space-y-4">
        <div class="p-3 bg-indigo-950/40 border border-indigo-800/40 rounded-xl text-xs text-indigo-300 leading-relaxed">
          <strong>วิธีเชื่อมต่อ Real-time สำหรับทีมทุกคน:</strong>
          <ol class="list-decimal list-inside mt-1 space-y-1 text-slate-300">
            <li>สร้างโปรเจกต์ที่ <a href="https://console.firebase.google.com" target="_blank" class="text-indigo-400 underline">Firebase Console</a></li>
            <li>ไปที่ <b>Realtime Database</b> &gt; สร้างฐานข้อมูล (ตั้งค่า Rules เป็น read/write: true สำหรับทดสอบ)</li>
            <li>คัดลอกค่า <code class="bg-slate-800 px-1 py-0.5 rounded text-amber-300">databaseURL</code> และ <code class="bg-slate-800 px-1 py-0.5 rounded text-amber-300">apiKey</code> มาวางด้านล่าง</li>
          </ol>
        </div>

        <div>
          <label class="block text-xs font-medium text-slate-300 mb-1">Firebase Database URL *</label>
          <input type="url" id="cfgDbUrl" placeholder="https://your-project-default-rtdb.firebaseio.com" class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white">
        </div>

        <div>
          <label class="block text-xs font-medium text-slate-300 mb-1">API Key *</label>
          <input type="text" id="cfgApiKey" placeholder="AIzaSy..." class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white">
        </div>

        <div>
          <label class="block text-xs font-medium text-slate-300 mb-1">Project ID</label>
          <input type="text" id="cfgProjectId" placeholder="your-project-id" class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white">
        </div>

        <div class="pt-3 border-t border-slate-800 flex items-center justify-between">
          <button type="button" onclick="disconnectAndReset()" class="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800">
            รีเซ็ตเป็น Local Mode
          </button>
          <div class="flex items-center gap-2">
            <button type="button" onclick="closeConfigModal()" class="px-4 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300">
              ปิด
            </button>
            <button type="button" onclick="saveFirebaseConfig()" class="px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white">
              เชื่อมต่อ & บันทึก
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ==========================================
       JAVASCRIPT REALTIME & LOGIC CORE
       ========================================== -->
  <script type="module">
    // Import Firebase v9+ Modular Web SDK from CDN
    import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
    import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";

    // --- State Storage ---
    let appState = {
      roleFilter: 'all',
      searchQuery: '',
      tasks: [],
      assets: [],
      campaign: {
        title: 'Q3 Mega Brand Re-launch & 9.9 Super Sale',
        dates: '15 ส.ค. - 30 ก.ย. 2026',
        totalBudget: 850000,
        spentBudget: 385000,
      }
    };

    let firebaseDb = null;
    const STORAGE_KEY_CONFIG = 'mkt_hub_cfg';
    const STORAGE_KEY_TASKS = 'mkt_hub_tasks_local';
    const STORAGE_KEY_ASSETS = 'mkt_hub_assets_local';

    // --- Sample Seed Data ---
    const DEFAULT_TASKS = [
      {
        id: 't-1',
        title: 'ผลิตและติดตั้งป้าย Standee หน้าร้าน 25 สาขา',
        desc: 'จัดพิมพ์ Standee ไดคัท 80x180cm สำหรับโปรโมชั่น 9.9',
        role: 'offline',
        status: 'in_progress',
        priority: 'high',
        assignee: 'กานต์ (Offline Lead)',
        dueDate: '2026-09-05',
        budget: 45000,
        printSpecs: 'PP Board 5mm เคลือบด้านกันน้ำ',
        eventLocation: 'สาขากรุงเทพฯ และปริมณฑล (25 จุด)'
      },
      {
        id: 't-2',
        title: 'แคมเปญ Meta Ads ทราฟฟิก 9.9 Flash Sale',
        desc: 'ยิงโฆษณา Conversion + Catalog Sales เจาะกลุ่ม Lookalike 1-2%',
        role: 'online',
        status: 'in_progress',
        priority: 'urgent',
        assignee: 'วิน (Performance)',
        dueDate: '2026-09-10',
        budget: 150000,
        platform: 'Meta Ads',
        targetKpi: 'ROAS > 4.5x, Purchases > 2,000'
      },
      {
        id: 't-3',
        title: 'บรีฟกราฟิก Banner ชุด 9.9 Super Sale (10 Sizes)',
        desc: 'ออกแบบ Key Visual สไตล์ไฮป์สะดุดตา โทนสี Electric Orange',
        role: 'graphic',
        status: 'review',
        priority: 'urgent',
        assignee: 'นิว (Art Director)',
        dueDate: '2026-09-04',
        budget: 25000,
        version: 'v2.3 (Final Draft)',
        figmaUrl: 'https://figma.com',
        driveUrl: 'https://drive.google.com',
        reviewNotes: 'ทีม Online ขอขยายขนาดโลโก้ขึ้น 15%'
      },
      {
        id: 't-4',
        title: 'ประสานงานบูธกิจกรรม Event Launch ณ Central World',
        desc: 'จองพื้นที่จัดบูธ 6x6m, ออกแบบ Backdrop, เจ้าหน้าที่ MC',
        role: 'offline',
        status: 'review',
        priority: 'urgent',
        assignee: 'พลอย (Event Co.)',
        dueDate: '2026-09-12',
        budget: 180000,
        eventLocation: 'Central World ชั้น 1 ลาน Beacon',
        printSpecs: 'Tension Fabric 6x3m'
      }
    ];

    const DEFAULT_ASSETS = [
      {
        id: 'a-1',
        title: 'Brand Guideline & Master Logo Vector (2026)',
        category: 'brand_guideline',
        url: 'https://drive.google.com',
        provider: 'Google Drive',
        desc: 'ไฟล์โลโก้ทุกรูปแบบ (.AI, .SVG, .PNG), สี และ ฟอนต์'
      },
      {
        id: 'a-2',
        title: 'Figma Master UI & Marketing Banner Design System',
        category: 'graphic_template',
        url: 'https://figma.com',
        provider: 'Figma',
        desc: 'เทมเพลตป้ายโฆษณา, Product Card, Badge ส่วนลด'
      }
    ];

    // --- Firebase Initialization & Realtime Subscription ---
    function initApp() {
      lucide.createIcons();
      loadLocalState();
      
      const savedConfig = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (savedConfig) {
        try {
          const cfg = JSON.parse(savedConfig);
          if (cfg.databaseURL) {
            connectFirebase(cfg);
          }
        } catch (e) {
          console.warn('Invalid saved Firebase config', e);
        }
      }
      
      renderAll();
    }

    function connectFirebase(config) {
      try {
        const app = getApps().length === 0 ? initializeApp(config) : getApp();
        firebaseDb = getDatabase(app, config.databaseURL);

        // Subscribe to Tasks
        const tasksRef = ref(firebaseDb, 'mkt_hub/tasks');
        onValue(tasksRef, (snapshot) => {
          if (snapshot.exists()) {
            const val = snapshot.val();
            appState.tasks = Array.isArray(val) ? val.filter(Boolean) : Object.values(val);
          } else {
            appState.tasks = DEFAULT_TASKS;
            set(tasksRef, DEFAULT_TASKS);
          }
          renderAll();
        });

        // Subscribe to Assets
        const assetsRef = ref(firebaseDb, 'mkt_hub/assets');
        onValue(assetsRef, (snapshot) => {
          if (snapshot.exists()) {
            const val = snapshot.val();
            appState.assets = Array.isArray(val) ? val.filter(Boolean) : Object.values(val);
          } else {
            appState.assets = DEFAULT_ASSETS;
            set(assetsRef, DEFAULT_ASSETS);
          }
          renderAll();
        });

        // Update badge
        const badge = document.getElementById('syncStatusBadge');
        if (badge) {
          badge.className = 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
          badge.innerHTML = '<span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Firebase Real-time Live';
        }
      } catch (err) {
        console.error('Firebase connection error:', err);
      }
    }

    function loadLocalState() {
      try {
        const savedTasks = localStorage.getItem(STORAGE_KEY_TASKS);
        appState.tasks = savedTasks ? JSON.parse(savedTasks) : DEFAULT_TASKS;

        const savedAssets = localStorage.getItem(STORAGE_KEY_ASSETS);
        appState.assets = savedAssets ? JSON.parse(savedAssets) : DEFAULT_ASSETS;
      } catch (e) {
        appState.tasks = DEFAULT_TASKS;
        appState.assets = DEFAULT_ASSETS;
      }
    }

    function syncState() {
      if (firebaseDb) {
        set(ref(firebaseDb, 'mkt_hub/tasks'), appState.tasks);
        set(ref(firebaseDb, 'mkt_hub/assets'), appState.assets);
      } else {
        localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(appState.tasks));
        localStorage.setItem(STORAGE_KEY_ASSETS, JSON.stringify(appState.assets));
      }
      renderAll();
    }

    // --- Rendering Functions ---
    function renderAll() {
      renderDashboard();
      renderTasks();
      renderAssets();
      lucide.createIcons();
    }

    function renderDashboard() {
      let todo = 0, inProg = 0, review = 0, done = 0;
      let spent = 0;

      appState.tasks.forEach(t => {
        if (t.status === 'todo') todo++;
        else if (t.status === 'in_progress') inProg++;
        else if (t.status === 'review') review++;
        else if (t.status === 'done') done++;

        if (t.budget) spent += Number(t.budget);
      });

      document.getElementById('countTodo').innerText = todo;
      document.getElementById('countInProgress').innerText = inProg;
      document.getElementById('countReview').innerText = review;
      document.getElementById('countDone').innerText = done;

      document.getElementById('spentBudgetDisplay').innerText = '฿' + spent.toLocaleString();
      const remaining = Math.max(0, 850000 - spent);
      document.getElementById('remainingBudgetDisplay').innerText = '฿' + remaining.toLocaleString();
    }

    function renderTasks() {
      const columns = {
        todo: document.getElementById('column-todo'),
        in_progress: document.getElementById('column-in_progress'),
        review: document.getElementById('column-review'),
        done: document.getElementById('column-done'),
      };

      Object.values(columns).forEach(col => col.innerHTML = '');
      const counts = { todo: 0, in_progress: 0, review: 0, done: 0 };

      const filtered = appState.tasks.filter(t => {
        const matchRole = appState.roleFilter === 'all' || t.role === appState.roleFilter;
        const q = appState.searchQuery.toLowerCase();
        const matchSearch = !q || (t.title && t.title.toLowerCase().includes(q)) || (t.desc && t.desc.toLowerCase().includes(q));
        return matchRole && matchSearch;
      });

      filtered.forEach(task => {
        if (counts[task.status] !== undefined) counts[task.status]++;
        const card = createTaskCard(task);
        if (columns[task.status]) {
          columns[task.status].appendChild(card);
        }
      });

      document.getElementById('badge-todo').innerText = counts.todo;
      document.getElementById('badge-in_progress').innerText = counts.in_progress;
      document.getElementById('badge-review').innerText = counts.review;
      document.getElementById('badge-done').innerText = counts.done;
    }

    function createTaskCard(task) {
      const div = document.createElement('div');
      div.className = 'bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-3.5 space-y-2.5 transition cursor-pointer shadow-sm';
      div.onclick = () => window.openEditTask(task.id);

      const roleBadge = task.role === 'offline' 
        ? '<span class="px-2 py-0.5 text-[10px] font-semibold rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">Offline</span>'
        : task.role === 'online'
        ? '<span class="px-2 py-0.5 text-[10px] font-semibold rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">Online</span>'
        : '<span class="px-2 py-0.5 text-[10px] font-semibold rounded bg-pink-500/10 text-pink-400 border border-pink-500/20">Graphic</span>';

      const priorityBadge = task.priority === 'urgent'
        ? '<span class="text-[10px] text-rose-400 font-bold">⚡ Urgent</span>'
        : task.priority === 'high'
        ? '<span class="text-[10px] text-amber-400 font-medium">High</span>'
        : '';

      let extraContent = '';
      if (task.role === 'graphic' && (task.version || task.figmaUrl)) {
        extraContent = \`
          <div class="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>\${task.version || 'Draft'}</span>
            <div class="flex gap-1.5 text-indigo-400">
              \${task.figmaUrl ? '<span class="hover:underline">Figma ↗</span>' : ''}
              \${task.driveUrl ? '<span class="hover:underline">Drive ↗</span>' : ''}
            </div>
          </div>
        \`;
      } else if (task.role === 'offline' && task.eventLocation) {
        extraContent = \`
          <div class="pt-1.5 border-t border-slate-800/80 text-[11px] text-slate-400 truncate">
            📍 \${task.eventLocation}
          </div>
        \`;
      } else if (task.role === 'online' && task.platform) {
        extraContent = \`
          <div class="pt-1.5 border-t border-slate-800/80 text-[11px] text-sky-400 truncate">
            🌐 \${task.platform} \${task.targetKpi ? '· ' + task.targetKpi : ''}
          </div>
        \`;
      }

      div.innerHTML = \`
        <div class="flex items-center justify-between gap-2">
          \${roleBadge}
          \${priorityBadge}
        </div>
        <h4 class="text-xs font-bold text-white line-clamp-2">\${task.title}</h4>
        \${task.desc ? \`<p class="text-[11px] text-slate-400 line-clamp-2">\${task.desc}</p>\` : ''}
        \${extraContent}
        <div class="pt-1.5 flex items-center justify-between text-[11px] text-slate-400">
          <span>\${task.assignee || 'ยังไม่กำหนด'}</span>
          <span>\${task.dueDate || ''}</span>
        </div>
      \`;

      return div;
    }

    function renderAssets() {
      const container = document.getElementById('assetsContainer');
      container.innerHTML = '';

      appState.assets.forEach(asset => {
        const card = document.createElement('div');
        card.className = 'bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex items-start justify-between gap-3 hover:border-slate-700 transition';
        card.innerHTML = \`
          <div class="min-w-0 flex-1">
            <span class="inline-block text-[10px] font-semibold text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/40 mb-1.5">\${asset.provider}</span>
            <h4 class="text-xs font-bold text-white truncate">\${asset.title}</h4>
            <p class="text-[11px] text-slate-400 line-clamp-1 mt-0.5">\${asset.desc || ''}</p>
          </div>
          <a href="\${asset.url}" target="_blank" class="p-2 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white transition flex-shrink-0">
            <i data-lucide="external-link" class="w-4 h-4"></i>
          </a>
        \`;
        container.appendChild(card);
      });
    }

    // --- Window Globals for Modals & Event Listeners ---
    window.setRoleFilter = (role) => {
      appState.roleFilter = role;
      ['all', 'offline', 'online', 'graphic'].forEach(r => {
        const btn = document.getElementById('btn-role-' + r);
        if (btn) {
          if (r === role) {
            btn.className = 'px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 text-white transition';
          } else {
            btn.className = 'px-3.5 py-1.5 rounded-xl text-xs font-medium bg-slate-800/80 hover:bg-slate-800 text-slate-300 transition flex items-center gap-1.5';
          }
        }
      });
      renderTasks();
    };

    window.handleSearch = (q) => {
      appState.searchQuery = q;
      renderTasks();
    };

    window.toggleRoleSpecificFields = (role) => {
      document.getElementById('graphicFields').className = role === 'graphic' ? 'p-3.5 bg-pink-950/20 border border-pink-900/40 rounded-xl space-y-3' : 'hidden';
      document.getElementById('offlineFields').className = role === 'offline' ? 'p-3.5 bg-amber-950/20 border border-amber-900/40 rounded-xl space-y-3' : 'hidden';
      document.getElementById('onlineFields').className = role === 'online' ? 'p-3.5 bg-sky-950/20 border border-sky-900/40 rounded-xl space-y-3' : 'hidden';
    };

    window.openTaskModal = (task = null) => {
      const modal = document.getElementById('taskModal');
      const deleteBtn = document.getElementById('btnDeleteTask');
      
      if (task) {
        document.getElementById('taskModalTitle').innerText = 'แก้ไขงาน / บรีฟ';
        document.getElementById('taskId').value = task.id;
        document.getElementById('taskTitleInput').value = task.title;
        document.getElementById('taskRoleSelect').value = task.role;
        document.getElementById('taskStatusSelect').value = task.status;
        document.getElementById('taskPrioritySelect').value = task.priority || 'medium';
        document.getElementById('taskDueDateInput').value = task.dueDate || '';
        document.getElementById('taskDescInput').value = task.desc || '';
        document.getElementById('taskAssigneeInput').value = task.assignee || '';
        document.getElementById('taskBudgetInput').value = task.budget || '';

        // Role specifics
        document.getElementById('taskVersionInput').value = task.version || '';
        document.getElementById('taskFigmaInput').value = task.figmaUrl || '';
        document.getElementById('taskDriveInput').value = task.driveUrl || '';
        document.getElementById('taskReviewNotesInput').value = task.reviewNotes || '';
        document.getElementById('taskLocationInput').value = task.eventLocation || '';
        document.getElementById('taskPrintSpecsInput').value = task.printSpecs || '';
        document.getElementById('taskPlatformInput').value = task.platform || '';
        document.getElementById('taskKpiInput').value = task.targetKpi || '';

        window.toggleRoleSpecificFields(task.role);
        deleteBtn.classList.remove('hidden');
      } else {
        document.getElementById('taskModalTitle').innerText = 'สร้างงานใหม่ / บรีฟงาน';
        document.getElementById('taskForm').reset();
        document.getElementById('taskId').value = '';
        window.toggleRoleSpecificFields('offline');
        deleteBtn.classList.add('hidden');
      }

      modal.classList.remove('hidden');
      modal.classList.add('flex');
    };

    window.openEditTask = (id) => {
      const task = appState.tasks.find(t => t.id === id);
      if (task) window.openTaskModal(task);
    };

    window.closeTaskModal = () => {
      const modal = document.getElementById('taskModal');
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    };

    window.handleTaskSubmit = (e) => {
      e.preventDefault();
      const id = document.getElementById('taskId').value || ('t-' + Date.now());
      const role = document.getElementById('taskRoleSelect').value;

      const updatedTask = {
        id,
        title: document.getElementById('taskTitleInput').value,
        role,
        status: document.getElementById('taskStatusSelect').value,
        priority: document.getElementById('taskPrioritySelect').value,
        dueDate: document.getElementById('taskDueDateInput').value,
        desc: document.getElementById('taskDescInput').value,
        assignee: document.getElementById('taskAssigneeInput').value,
        budget: Number(document.getElementById('taskBudgetInput').value) || 0,
        version: document.getElementById('taskVersionInput').value,
        figmaUrl: document.getElementById('taskFigmaInput').value,
        driveUrl: document.getElementById('taskDriveInput').value,
        reviewNotes: document.getElementById('taskReviewNotesInput').value,
        eventLocation: document.getElementById('taskLocationInput').value,
        printSpecs: document.getElementById('taskPrintSpecsInput').value,
        platform: document.getElementById('taskPlatformInput').value,
        targetKpi: document.getElementById('taskKpiInput').value,
      };

      const existingIndex = appState.tasks.findIndex(t => t.id === id);
      if (existingIndex >= 0) {
        appState.tasks[existingIndex] = updatedTask;
      } else {
        appState.tasks.unshift(updatedTask);
      }

      syncState();
      window.closeTaskModal();
    };

    window.handleDeleteTask = () => {
      const id = document.getElementById('taskId').value;
      if (id && confirm('ยืนยันการลบงานนี้?')) {
        appState.tasks = appState.tasks.filter(t => t.id !== id);
        syncState();
        window.closeTaskModal();
      }
    };

    // Asset Modal
    window.openAssetModal = () => {
      const modal = document.getElementById('assetModal');
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    };

    window.closeAssetModal = () => {
      const modal = document.getElementById('assetModal');
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    };

    window.handleAssetSubmit = (e) => {
      e.preventDefault();
      const newAsset = {
        id: 'a-' + Date.now(),
        title: document.getElementById('assetTitleInput').value,
        url: document.getElementById('assetUrlInput').value,
        category: document.getElementById('assetCategorySelect').value,
        provider: document.getElementById('assetProviderSelect').value,
        desc: document.getElementById('assetDescInput').value,
      };

      appState.assets.unshift(newAsset);
      syncState();
      window.closeAssetModal();
      document.getElementById('assetForm').reset();
    };

    // Config Modal
    window.openConfigModal = () => {
      const modal = document.getElementById('configModal');
      const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (saved) {
        try {
          const cfg = JSON.parse(saved);
          document.getElementById('cfgDbUrl').value = cfg.databaseURL || '';
          document.getElementById('cfgApiKey').value = cfg.apiKey || '';
          document.getElementById('cfgProjectId').value = cfg.projectId || '';
        } catch(e){}
      }
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    };

    window.closeConfigModal = () => {
      const modal = document.getElementById('configModal');
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    };

    window.saveFirebaseConfig = () => {
      const dbUrl = document.getElementById('cfgDbUrl').value.trim();
      const apiKey = document.getElementById('cfgApiKey').value.trim();
      const projectId = document.getElementById('cfgProjectId').value.trim();

      if (!dbUrl) {
        alert('กรุณากรอก Firebase Database URL');
        return;
      }

      const cfg = { databaseURL: dbUrl, apiKey, projectId };
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(cfg));
      connectFirebase(cfg);
      window.closeConfigModal();
    };

    window.disconnectAndReset = () => {
      localStorage.removeItem(STORAGE_KEY_CONFIG);
      firebaseDb = null;
      const badge = document.getElementById('syncStatusBadge');
      if (badge) {
        badge.className = 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20';
        badge.innerHTML = '<span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span> Local Sync Mode';
      }
      window.closeConfigModal();
    };

    // Initialize on DOM load
    window.addEventListener('DOMContentLoaded', initApp);
  </script>

</body>
</html>`;
}
