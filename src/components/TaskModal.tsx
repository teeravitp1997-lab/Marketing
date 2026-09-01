import React, { useState, useEffect } from 'react';
import { 
  X, 
  Trash2, 
  Save, 
  Palette, 
  MapPin, 
  Globe, 
  ExternalLink, 
  Calendar, 
  DollarSign, 
  User, 
  Tag, 
  Layers,
  Sparkles,
  AlertCircle,
  Tv,
  Share2,
  Printer,
  Compass,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { TaskItem, TeamRole, TaskStatus, TaskPriority, TeamMember, MarketingJobType } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: TaskItem | null;
  onSave: (task: TaskItem) => void;
  onDelete?: (taskId: string) => void;
  defaultRole?: TeamRole;
  members?: TeamMember[];
}

export const MARKETING_JOB_TYPES: { id: string; label: string; icon: string; category: string }[] = [
  // 🎨 Graphic & Creative Job Types
  { id: 'graphic_keyvisual', label: 'กราฟิก Key Visual, Banner & โปสเตอร์ (Key Visual & Artwork)', icon: '🎨', category: 'Graphic / Design' },
  { id: 'motion_video', label: 'วิดีโอ & โมชันกราฟิก (Motion Graphic & Short Video)', icon: '🎬', category: 'Graphic / Motion' },
  { id: 'packaging_dieline', label: 'บรรจุภัณฑ์ & งานไดคัท (Packaging & Dieline Sticker)', icon: '📦', category: 'Graphic / Packaging' },
  { id: 'brand_ci_design', label: 'โลโก้, CI & Design System (Brand Identity & Guidelines)', icon: '✨', category: 'Graphic / CI' },
  { id: 'spatial_3d_design', label: '3D Render & ออกแบบโครงสร้างบูธ (3D Spatial & Booth Design)', icon: '🏛️', category: 'Graphic / 3D' },
  
  // 🏢 Offline & Event Job Types
  { id: 'posm_print', label: 'สื่อหน้าร้าน & งานพิมพ์ (POSM, Standee, Brochure)', icon: '🖨️', category: 'POSM / งานพิมพ์' },
  { id: 'event_booth', label: 'งานอีเวนต์ & บูธกิจกรรม (Event, Booth & Roadshow)', icon: '🎪', category: 'อีเวนต์ / บูธ' },
  { id: 'ooh_billboard', label: 'ป้ายบิลบอร์ด & สื่อนอกบ้าน (OOH / LED / Transit)', icon: '🏙️', category: 'สื่อนอกบ้าน OOH' },

  // 🌐 Online & Digital Job Types
  { id: 'digital_ads', label: 'สื่อโฆษณาออนไลน์ (Meta, Google, TikTok Ads)', icon: '📱', category: 'ยิงแอดออนไลน์' },
  { id: 'kol_influencer', label: 'KOL & อินฟลูเอนเซอร์ (Influencer Review & PR)', icon: '🌟', category: 'KOL / PR' },
  { id: 'content_social', label: 'คอนเทนต์ & โซเชียลมีเดีย (Content, Video, SEO)', icon: '✍️', category: 'Content / Social' },
  { id: 'live_commerce', label: 'ไลฟ์สด & Live Streaming (TikTok Shop / Shopee)', icon: '🔴', category: 'Live Streaming' },

  // 🔄 Marketing Campaigns & Mixed Types
  { id: 'promotion_crm', label: 'กิจกรรมโปรโมชั่น & CRM (Promotion, Loyalty)', icon: '🎁', category: 'โปรโมชั่น / CRM' },
  { id: 'omnichannel', label: 'แคมเปญผสมผสาน O2O (Online-to-Offline Marketing)', icon: '🔄', category: 'O2O / ผสมผสาน' },
  { id: 'other', label: 'อื่นๆ (Custom Marketing Deliverable)', icon: '📌', category: 'อื่นๆ' },
];

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  task,
  onSave,
  onDelete,
  defaultRole = 'offline',
  members = [],
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [role, setRole] = useState<'offline' | 'online' | 'graphic'>('offline');
  const [jobType, setJobType] = useState<string>('posm_print');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [assigneeName, setAssigneeName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [budget, setBudget] = useState<number | ''>('');
  const [spent, setSpent] = useState<number | ''>('');
  const [tagsInput, setTagsInput] = useState('');

  // Shared specs for Offline & Online & Graphic
  const [platform, setPlatform] = useState<string>('Meta Ads');
  const [targetKpi, setTargetKpi] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [printSpecs, setPrintSpecs] = useState('');
  const [driveUrl, setDriveUrl] = useState('');

  // Graphic specifics
  const [version, setVersion] = useState('v1.0 (Draft)');
  const [figmaUrl, setFigmaUrl] = useState('');
  const [reviewNotes, setReviewNotes] = useState('');

  const defaultAssignee = members.length > 0 ? members[0].name : 'ทีมการตลาด';

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setRole(task.role);
      setJobType(task.jobType || (task.role === 'offline' ? 'posm_print' : task.role === 'online' ? 'digital_ads' : 'digital_ads'));
      setStatus(task.status);
      setPriority(task.priority);
      setAssigneeName(task.assignee?.name || defaultAssignee);
      setDueDate(task.dueDate || '');
      setBudget(task.budget !== undefined ? task.budget : '');
      setSpent(task.spent !== undefined ? task.spent : '');
      setTagsInput(task.tags ? task.tags.join(', ') : '');

      // Shared specs
      setPlatform(task.platform || 'Meta Ads');
      setTargetKpi(task.targetKpi || '');
      setEventLocation(task.eventLocation || '');
      setPrintSpecs(task.printSpecs || '');
      setDriveUrl(task.driveUrl || '');

      // Graphic
      setVersion(task.version || 'v1.0 (Draft)');
      setFigmaUrl(task.figmaUrl || '');
      setReviewNotes(task.reviewNotes || '');
    } else {
      // Default reset
      setTitle('');
      setDescription('');
      const initialRole = defaultRole === 'all' ? 'offline' : defaultRole;
      setRole(initialRole);
      setJobType(initialRole === 'offline' ? 'posm_print' : initialRole === 'online' ? 'digital_ads' : 'graphic_keyvisual');
      setStatus('todo');
      setPriority('medium');
      setAssigneeName(defaultAssignee);
      setDueDate(new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0]);
      setBudget('');
      setSpent('');
      setTagsInput('');
      
      // Shared specs reset
      setPlatform(initialRole === 'offline' ? 'Store/Branch' : initialRole === 'online' ? 'Meta Ads' : 'Meta Ads');
      setTargetKpi('');
      setEventLocation('');
      setPrintSpecs('');
      setDriveUrl('');

      // Graphic reset
      setVersion('v1.0 (Draft)');
      setFigmaUrl('');
      setReviewNotes('');
    }
  }, [task, defaultRole, isOpen, defaultAssignee]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const chosenMember = members.find(m => m.name === assigneeName);
    const assigneeObj = chosenMember ? {
      name: chosenMember.name,
      avatar: chosenMember.avatar,
      roleTitle: chosenMember.roleTitle || chosenMember.role,
    } : {
      name: assigneeName || 'ทีมการตลาด',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      roleTitle: 'Team Member',
    };

    const chosenJobTypeObj = MARKETING_JOB_TYPES.find(j => j.id === jobType);

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    // If no tags, default to role and job category
    if (tags.length === 0) {
      tags.push(role.toUpperCase());
      if (chosenJobTypeObj) tags.push(chosenJobTypeObj.category.split('/')[0].trim());
    }

    const updatedTask: TaskItem = {
      id: task ? task.id : 'task-' + Date.now(),
      title: title.trim(),
      description: description.trim(),
      role,
      jobType,
      jobTypeLabel: chosenJobTypeObj ? chosenJobTypeObj.label : undefined,
      status,
      priority,
      assignee: assigneeObj,
      dueDate,
      budget: budget === '' ? 0 : Number(budget),
      spent: spent === '' ? 0 : Number(spent),
      tags,
      
      // Shared specs across Offline & Online & Graphic
      platform: platform || undefined,
      targetKpi: targetKpi.trim() || undefined,
      eventLocation: eventLocation.trim() || undefined,
      printSpecs: printSpecs.trim() || undefined,
      driveUrl: driveUrl.trim() || undefined,

      // Graphic specifics
      version: role === 'graphic' ? version : undefined,
      figmaUrl: role === 'graphic' && figmaUrl ? figmaUrl : undefined,
      reviewNotes: role === 'graphic' ? reviewNotes : undefined,

      createdAt: task ? task.createdAt : Date.now(),
      updatedAt: Date.now(),
      updatedBy: assigneeObj.name,
    };

    onSave(updatedTask);
    onClose();
  };

  const selectedJobTypeObj = MARKETING_JOB_TYPES.find(j => j.id === jobType);

  return (
    <div className="fixed inset-0 z-50 bg-[#3D4034]/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FDFCF7] border border-[#E8E2D2] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E8E2D2] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shadow-xs ${
              role === 'offline' ? 'bg-[#EDF3EB] text-[#2D5A34] border border-[#D0DEC9]' :
              role === 'online' ? 'bg-[#FEF8E7] text-[#8C6514] border border-[#EEDFB4]' :
              'bg-[#FDF0EB] text-[#C85A32] border border-[#F5D0C5]'
            }`}>
              {selectedJobTypeObj?.icon || (role === 'offline' ? '🎪' : role === 'online' ? '📱' : '🎨')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#344E41]">
                  {task ? 'แก้ไขข้อมูลงาน / บรีฟ' : 'สร้างงานใหม่ / บรีฟการตลาด'}
                </h3>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                  role === 'offline' ? 'bg-[#EDF3EB] text-[#2D5A34] border border-[#C5DCB7]' :
                  role === 'online' ? 'bg-[#FEF8E7] text-[#8C6514] border border-[#EEDFB4]' :
                  'bg-[#FDF0EB] text-[#C85A32] border border-[#F5D0C5]'
                }`}>
                  หน้าที่หลัก: {role.toUpperCase()}
                </span>
              </div>
              <p className="text-[11px] text-[#6B705C]">
                Offline & Online สามารถเลือกลักษณะงานร่วมกันได้ทุกรูปแบบอย่างยืดหยุ่น
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#6B705C] hover:text-[#3D4034] hover:bg-[#F5F2EA] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[78vh] overflow-y-auto custom-scrollbar">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-[#3D4034] mb-1.5">
              ชื่องาน / หัวข้อบรีฟ *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="เช่น บรีฟ Banner 9.9, บูธ Roadshow Central World, ยิง Meta Ads Conversion, ป้าย Standee หน้าร้าน"
              className="w-full px-3.5 py-2.5 bg-white border border-[#D9D0BE] rounded-xl text-sm text-[#3D4034] placeholder-[#A5A58D] focus:outline-none focus:border-[#588157] focus:ring-1 focus:ring-[#588157]"
            />
          </div>

          {/* Core Roles & Characteristics Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* 1. Primary Responsibility / Department */}
            <div>
              <label className="block text-xs font-semibold text-[#3D4034] mb-1.5 flex items-center justify-between">
                <span>หน้าที่หลัก (Primary Role) *</span>
                <span className="text-[10px] text-[#6B705C] font-normal">ทีมที่รับผิดชอบหลัก</span>
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-[#D9D0BE] rounded-xl text-xs sm:text-sm text-[#3D4034] font-medium focus:outline-none focus:border-[#588157]"
              >
                <option value="offline">🏢 Offline Team (งานพื้นที่, อีเวนต์, หน้าร้าน, สื่อออฟไลน์)</option>
                <option value="online">🌐 Online Team (ดิจิทัลมาร์เก็ตติ้ง, แคมเปญ Ads, Content, โซเชียล)</option>
                <option value="graphic">🎨 Graphic Team (ออกแบบกราฟิก, ครีเอทีฟ, ผลิตไฟล์สื่อ)</option>
              </select>
            </div>

            {/* 2. Job Characteristics (Shared across all teams) */}
            <div>
              <label className="block text-xs font-semibold text-[#3D4034] mb-1.5 flex items-center justify-between">
                <span>ลักษณะงาน (Marketing Job Type) *</span>
                <span className="text-[10px] text-[#588157] font-semibold">เลือกได้ทั้ง 2 ทีม</span>
              </label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#D9D0BE] rounded-xl text-xs sm:text-sm text-[#3D4034] font-medium focus:outline-none focus:border-[#588157]"
              >
                {MARKETING_JOB_TYPES.map(j => (
                  <option key={j.id} value={j.id}>
                    {j.icon} {j.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status & Priority Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#3D4034] mb-1.5">
                สถานะการดำเนินงาน (Status) *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-[#D9D0BE] rounded-xl text-xs sm:text-sm text-[#3D4034] focus:outline-none focus:border-[#588157]"
              >
                <option value="todo">To Do (รอดำเนินการ)</option>
                <option value="in_progress">In Progress (กำลังดำเนินการ)</option>
                <option value="review">Review (รอตรวจงาน / รออนุมัติบรีฟ)</option>
                <option value="done">Done (เสร็จสมบูรณ์ / Approved)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3D4034] mb-1.5">
                ความสำคัญ (Priority) *
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-[#D9D0BE] rounded-xl text-xs sm:text-sm text-[#3D4034] focus:outline-none focus:border-[#588157]"
              >
                <option value="urgent">⚡ Urgent (ด่วนที่สุด)</option>
                <option value="high">High (สำคัญมาก)</option>
                <option value="medium">Medium (ปานกลาง)</option>
                <option value="low">Low (ปกติ)</option>
              </select>
            </div>
          </div>

          {/* ===================================================
              SHARED MARKETING & EXECUTION SPECS (Unified for Offline & Online)
              =================================================== */}
          <div className="p-4 bg-[#F5F2EA]/90 border border-[#E8E2D2] rounded-2xl space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-[#E8E2D2]">
              <span className="text-xs font-bold text-[#344E41] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#588157]" />
                รายละเอียดและสเปคของงาน (Channel, KPI, Location & Production Specs)
              </span>
              <span className="text-[11px] text-[#6B705C] bg-white px-2 py-0.5 rounded-md border border-[#E8E2D2]">
                ใช้ได้ทุกทีม
              </span>
            </div>

            {/* Platform & Target KPI */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[#3D4034] mb-1 font-semibold flex items-center gap-1">
                  <Globe className="w-3 h-3 text-[#8C6514]" /> ช่องทาง / สื่อ / แพลตฟอร์ม
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-[#D9D0BE] rounded-xl text-xs text-[#3D4034] focus:outline-none focus:border-[#588157]"
                >
                  <option value="Meta Ads">📱 Meta Ads (Facebook & Instagram)</option>
                  <option value="TikTok Ads">🎵 TikTok Ads / TikTok Shop Live</option>
                  <option value="Google Ads">🔍 Google Ads (Search, YouTube & PMax)</option>
                  <option value="Store/Branch">🏪 หน้าร้าน / จุดขายสาขา (Store POSM)</option>
                  <option value="Event/Venue">🎪 ศูนย์การค้า / สถานที่จัดงาน (Event Hall & Venue)</option>
                  <option value="Billboard/OOH">🏙️ ป้ายบิลบอร์ด & สื่อนอกบ้าน (OOH / LED / Transit)</option>
                  <option value="KOL/Influencer">🌟 KOL & Influencer Partnership</option>
                  <option value="SEO/Blog">📝 SEO / Website Content & Blog</option>
                  <option value="Email">✉️ LINE OA / CRM / SMS / Email</option>
                  <option value="Other">📌 อื่นๆ (Other Media Channel)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-[#3D4034] mb-1 font-semibold flex items-center gap-1">
                  <Tag className="w-3 h-3 text-[#588157]" /> เป้าหมาย KPI / ตัวชี้วัดผล
                </label>
                <input
                  type="text"
                  value={targetKpi}
                  onChange={(e) => setTargetKpi(e.target.value)}
                  placeholder="เช่น ROAS > 4.5x, Foot traffic > 8,000 คน, CVR > 3.8%"
                  className="w-full px-3 py-1.5 bg-white border border-[#D9D0BE] rounded-xl text-xs text-[#3D4034] placeholder-[#A5A58D] focus:outline-none focus:border-[#588157]"
                />
              </div>
            </div>

            {/* Location & Print / Production Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[#3D4034] mb-1 font-semibold flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#588157]" /> สถานที่จัดงาน / จุดติดตั้งสาขา
                </label>
                <input
                  type="text"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  placeholder="เช่น Central World ชั้น 1 ลาน Beacon, สาขากรุงเทพฯ 25 จุด"
                  className="w-full px-3 py-1.5 bg-white border border-[#D9D0BE] rounded-xl text-xs text-[#3D4034] placeholder-[#A5A58D] focus:outline-none focus:border-[#588157]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#3D4034] mb-1 font-semibold flex items-center gap-1">
                  <Printer className="w-3 h-3 text-[#C85A32]" /> สเปคการผลิต / งานพิมพ์ / วัสดุ
                </label>
                <input
                  type="text"
                  value={printSpecs}
                  onChange={(e) => setPrintSpecs(e.target.value)}
                  placeholder="เช่น PP Board 5mm ไดคัท, Tension Fabric 6x3m, Art Card 260g"
                  className="w-full px-3 py-1.5 bg-white border border-[#D9D0BE] rounded-xl text-xs text-[#3D4034] placeholder-[#A5A58D] focus:outline-none focus:border-[#588157]"
                />
              </div>
            </div>

            {/* Shared Google Drive Link */}
            <div>
              <label className="block text-xs text-[#3D4034] mb-1 font-semibold flex items-center gap-1">
                <ExternalLink className="w-3 h-3 text-[#588157]" /> ลิงก์โฟลเดอร์ Google Drive / ไฟล์แนบ
              </label>
              <input
                type="url"
                value={driveUrl}
                onChange={(e) => setDriveUrl(e.target.value)}
                placeholder="https://drive.google.com/drive/folders/..."
                className="w-full px-3 py-1.5 bg-white border border-[#D9D0BE] rounded-xl text-xs text-[#3D4034] placeholder-[#A5A58D] focus:outline-none focus:border-[#588157]"
              />
            </div>
          </div>

          {/* ===================================================
              GRAPHIC TEAM SPECIALIZED FIELDS (Shown if role === 'graphic')
              =================================================== */}
          {role === 'graphic' && (
            <div className="p-4 bg-[#FDF0EB] border border-[#F5D0C5] rounded-2xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#F5D0C5]">
                <span className="text-xs font-bold text-[#C85A32] flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-[#E76F51]" />
                  สถานะไฟล์กราฟิก & ลิงก์ Figma (Graphic Master Deliverables)
                </span>
                <span className="text-[11px] text-[#C85A32]">Figma & Versioning</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#3D4034] mb-1 font-semibold">
                    เวอร์ชันงาน (Version)
                  </label>
                  <input
                    type="text"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    placeholder="เช่น v1.0, v2.3 Revised, Final Approved"
                    className="w-full px-3 py-1.5 bg-white border border-[#D9D0BE] rounded-xl text-xs text-[#3D4034] placeholder-[#A5A58D] focus:outline-none focus:border-[#588157]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#3D4034] mb-1 font-semibold">
                    ลิงก์ Figma Master File
                  </label>
                  <input
                    type="url"
                    value={figmaUrl}
                    onChange={(e) => setFigmaUrl(e.target.value)}
                    placeholder="https://www.figma.com/file/..."
                    className="w-full px-3 py-1.5 bg-white border border-[#D9D0BE] rounded-xl text-xs text-[#3D4034] placeholder-[#A5A58D] focus:outline-none focus:border-[#588157]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#3D4034] mb-1 font-semibold">
                  โน้ตผลการตรวจ / ฟีดแบ็กจากทีม (Review & Feedback Notes)
                </label>
                <textarea
                  rows={2}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="เช่น ปรับสีฟอนต์ให้อ่านง่ายขึ้น, เพิ่มขนาดโลโก้สปอนเซอร์, ตรวจปรู๊ฟสีพร้อมส่งพิมพ์..."
                  className="w-full px-3 py-1.5 bg-white border border-[#D9D0BE] rounded-xl text-xs text-[#3D4034] placeholder-[#A5A58D] focus:outline-none focus:border-[#588157]"
                ></textarea>
              </div>
            </div>
          )}

          {/* Description / Scope */}
          <div>
            <label className="block text-xs font-semibold text-[#3D4034] mb-1.5">
              รายละเอียดบรีฟ / สิ่งที่ต้องส่งมอบ (Deliverables & Scope)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ระบุข้อกำหนดของงาน เช่น ขนาดสัดส่วนชิ้นงาน, จุดประสงค์, กลุ่มเป้าหมาย, ข้อความโปรโมชั่น, สิ่งที่ต้องส่งมอบ..."
              className="w-full px-3.5 py-2.5 bg-white border border-[#D9D0BE] rounded-xl text-xs sm:text-sm text-[#3D4034] placeholder-[#A5A58D] focus:outline-none focus:border-[#588157]"
            ></textarea>
          </div>

          {/* Assignee & Due Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#3D4034] mb-1.5">
                ผู้รับผิดชอบ (Assignee)
              </label>
              <select
                value={assigneeName}
                onChange={(e) => setAssigneeName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#D9D0BE] rounded-xl text-xs text-[#3D4034] focus:outline-none focus:border-[#588157]"
              >
                {members.length > 0 ? (
                  members.map(m => (
                    <option key={m.id || m.name} value={m.name}>
                      {m.name} ({m.roleTitle || m.role})
                    </option>
                  ))
                ) : (
                  <option value="ทีมการตลาด">ทีมการตลาด</option>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3D4034] mb-1.5">
                กำหนดส่ง (Due Date)
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#D9D0BE] rounded-xl text-xs text-[#3D4034] focus:outline-none focus:border-[#588157]"
              />
            </div>
          </div>

          {/* Budget & Tags Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#3D4034] mb-1.5">
                งบประมาณที่ตั้งไว้ (บาท)
              </label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0"
                className="w-full px-3 py-2 bg-white border border-[#D9D0BE] rounded-xl text-xs text-[#3D4034] placeholder-[#A5A58D] focus:outline-none focus:border-[#588157]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#3D4034] mb-1.5">
                ค่าใช้จ่ายจริงที่ใช้ไป (บาท)
              </label>
              <input
                type="number"
                value={spent}
                onChange={(e) => setSpent(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0"
                className="w-full px-3 py-2 bg-white border border-[#D9D0BE] rounded-xl text-xs text-[#3D4034] placeholder-[#A5A58D] focus:outline-none focus:border-[#588157]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#3D4034] mb-1.5">
                แท็ก (คั่นด้วยจุลภาค)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="POSM, 9.9, Ads, Figma"
                className="w-full px-3 py-2 bg-white border border-[#D9D0BE] rounded-xl text-xs text-[#3D4034] placeholder-[#A5A58D] focus:outline-none focus:border-[#588157]"
              />
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-[#E8E2D2] flex items-center justify-between">
            {task && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm('คุณต้องการลบงานนี้ใช่หรือไม่?')) {
                    onDelete(task.id);
                    onClose();
                  }
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-[#E76F51] hover:bg-[#FDF0EB] border border-[#F5D0C5] transition"
              >
                <Trash2 className="w-4 h-4" />
                <span>ลบงาน</span>
              </button>
            ) : <div></div>}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium bg-[#F5F2EA] hover:bg-[#EAE5D9] text-[#3D4034] transition"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold bg-[#588157] hover:bg-[#476B46] text-white shadow-md shadow-[#588157]/20 active:scale-95 transition"
              >
                <Save className="w-4 h-4" />
                <span>{task ? 'บันทึกการแก้ไข' : 'สร้างงานบรีฟ'}</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
