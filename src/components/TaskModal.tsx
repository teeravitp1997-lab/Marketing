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
  AlertCircle
} from 'lucide-react';
import { TaskItem, TeamRole, TaskStatus, TaskPriority, TeamMember } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: TaskItem | null;
  onSave: (task: TaskItem) => void;
  onDelete?: (taskId: string) => void;
  defaultRole?: TeamRole;
  members?: TeamMember[];
}

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
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [assigneeName, setAssigneeName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [budget, setBudget] = useState<number | ''>('');
  const [spent, setSpent] = useState<number | ''>('');
  const [tagsInput, setTagsInput] = useState('');

  // Graphic specifics
  const [version, setVersion] = useState('v1.0 (Draft)');
  const [figmaUrl, setFigmaUrl] = useState('');
  const [driveUrl, setDriveUrl] = useState('');
  const [reviewNotes, setReviewNotes] = useState('');

  // Offline specifics
  const [eventLocation, setEventLocation] = useState('');
  const [printSpecs, setPrintSpecs] = useState('');

  // Online specifics
  const [platform, setPlatform] = useState<'Meta Ads' | 'Google Ads' | 'TikTok Ads' | 'SEO/Blog' | 'KOL/Influencer' | 'Email' | 'Other'>('Meta Ads');
  const [targetKpi, setTargetKpi] = useState('');

  const defaultAssignee = members.length > 0 ? members[0].name : 'ทีมการตลาด';

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setRole(task.role);
      setStatus(task.status);
      setPriority(task.priority);
      setAssigneeName(task.assignee?.name || defaultAssignee);
      setDueDate(task.dueDate || '');
      setBudget(task.budget !== undefined ? task.budget : '');
      setSpent(task.spent !== undefined ? task.spent : '');
      setTagsInput(task.tags ? task.tags.join(', ') : '');

      // Graphic
      setVersion(task.version || 'v1.0 (Draft)');
      setFigmaUrl(task.figmaUrl || '');
      setDriveUrl(task.driveUrl || '');
      setReviewNotes(task.reviewNotes || '');

      // Offline
      setEventLocation(task.eventLocation || '');
      setPrintSpecs(task.printSpecs || '');

      // Online
      setPlatform(task.platform || 'Meta Ads');
      setTargetKpi(task.targetKpi || '');
    } else {
      // Default reset
      setTitle('');
      setDescription('');
      setRole(defaultRole === 'all' ? 'offline' : defaultRole);
      setStatus('todo');
      setPriority('medium');
      setAssigneeName(defaultAssignee);
      setDueDate(new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0]);
      setBudget('');
      setSpent('');
      setTagsInput('');
      setVersion('v1.0 (Draft)');
      setFigmaUrl('');
      setDriveUrl('');
      setReviewNotes('');
      setEventLocation('');
      setPrintSpecs('');
      setPlatform('Meta Ads');
      setTargetKpi('');
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

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const updatedTask: TaskItem = {
      id: task ? task.id : 'task-' + Date.now(),
      title: title.trim(),
      description: description.trim(),
      role,
      status,
      priority,
      assignee: assigneeObj,
      dueDate,
      budget: budget === '' ? 0 : Number(budget),
      spent: spent === '' ? 0 : Number(spent),
      tags: tags.length > 0 ? tags : [role.toUpperCase()],
      version: role === 'graphic' ? version : undefined,
      figmaUrl: role === 'graphic' && figmaUrl ? figmaUrl : undefined,
      driveUrl: (role === 'graphic' || role === 'offline') && driveUrl ? driveUrl : undefined,
      reviewNotes: role === 'graphic' ? reviewNotes : undefined,
      eventLocation: role === 'offline' ? eventLocation : undefined,
      printSpecs: role === 'offline' ? printSpecs : undefined,
      platform: role === 'online' ? platform : undefined,
      targetKpi: role === 'online' ? targetKpi : undefined,
      createdAt: task ? task.createdAt : Date.now(),
      updatedAt: Date.now(),
      updatedBy: assigneeObj.name,
    };

    onSave(updatedTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#3D4034]/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FDFCF7] border border-[#E8E2D2] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E8E2D2] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              role === 'offline' ? 'bg-[#EDF3EB] text-[#2D5A34]' :
              role === 'online' ? 'bg-[#FEF8E7] text-[#8C6514]' :
              'bg-[#FDF0EB] text-[#C85A32]'
            }`}>
              {role === 'offline' && <MapPin className="w-4 h-4" />}
              {role === 'online' && <Globe className="w-4 h-4" />}
              {role === 'graphic' && <Palette className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-[#344E41]">
                {task ? 'แก้ไขข้อมูลงาน / บรีฟ' : 'สร้างงานใหม่ / บรีฟงานการตลาด'}
              </h3>
              <p className="text-[11px] text-[#6B705C]">
                ข้อมูลจะถูกบันทึกและอัปเดตตรงกันทุกคนในทีมแบบ Real-time ทันที
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
          
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
              placeholder="เช่น บรีฟ Banner แคมเปญ 9.9, ผลิต Standee หน้าร้าน, ยิง Meta Ads Conversion"
              className="w-full px-3.5 py-2.5 bg-white border border-[#D9D0BE] rounded-xl text-sm text-[#3D4034] placeholder-[#A5A58D] focus:outline-none focus:border-[#588157] focus:ring-1 focus:ring-[#588157]"
            />
          </div>

          {/* Role & Status Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#3D4034] mb-1.5">
                ทีมที่รับผิดชอบ (Role) *
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-[#D9D0BE] rounded-xl text-xs sm:text-sm text-[#3D4034] focus:outline-none focus:border-[#588157]"
              >
                <option value="offline">Offline Team (งานอีเวนต์, สื่อหน้าร้าน, งานพิมพ์)</option>
                <option value="online">Online Team (แคมเปญ Ads, Content, SEO)</option>
                <option value="graphic">Graphic Team (บรีฟงาน, Figma/Drive, เวอร์ชันงาน)</option>
              </select>
            </div>

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
          </div>

          {/* ===================================================
              ROLE-SPECIFIC SECTIONS
              =================================================== */}

          {/* 1. Graphic Team Specific Fields */}
          {role === 'graphic' && (
            <div className="p-4 bg-[#FDF0EB] border border-[#F5D0C5] rounded-2xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#F5D0C5]">
                <span className="text-xs font-bold text-[#C85A32] flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-[#E76F51]" />
                  การจัดการบรีฟ & ไฟล์กราฟิก (Graphic & Creative)
                </span>
                <span className="text-[11px] text-[#C85A32]">Version & Deliverables</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#3D4034] mb-1 font-medium">
                    สถานะเวอร์ชันงาน (Version)
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
                  <label className="block text-xs text-[#3D4034] mb-1 font-medium">
                    ลิงก์ Figma Design / Master Canvas
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
                <label className="block text-xs text-[#3D4034] mb-1 font-medium">
                  ลิงก์ Google Drive / ไฟล์แนบ Export (.AI, .PSD, .PNG, .PDF)
                </label>
                <input
                  type="url"
                  value={driveUrl}
                  onChange={(e) => setDriveUrl(e.target.value)}
                  placeholder="https://drive.google.com/drive/folders/..."
                  className="w-full px-3 py-1.5 bg-white border border-[#D9D0BE] rounded-xl text-xs text-[#3D4034] placeholder-[#A5A58D] focus:outline-none focus:border-[#588157]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#3D4034] mb-1 font-medium">
                  โน้ตผลการตรวจ / ข้อแก้ไขจากทีม (Review & Feedback Notes)
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

          {/* 2. Offline Team Specific Fields */}
          {role === 'offline' && (
            <div className="p-4 bg-[#EDF3EB] border border-[#D0DEC9] rounded-2xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#D0DEC9]">
                <span className="text-xs font-bold text-[#2D5A34] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#588157]" />
                  รายละเอียดงาน Offline / อีเวนต์ / สื่อหน้าร้าน
                </span>
                <span className="text-[11px] text-[#2D5A34]">POSM & Production</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#3D4034] mb-1 font-medium">
                    สถานที่จัดงาน / จุดติดตั้งสาขา (Location / Branch)
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
                  <label className="block text-xs text-[#3D4034] mb-1 font-medium">
                    สเปคงานพิมพ์ / วัสดุการผลิต (Print Specifications)
                  </label>
                  <input
                    type="text"
                    value={printSpecs}
                    onChange={(e) => setPrintSpecs(e.target.value)}
                    placeholder="เช่น PP Board 5mm ไดคัท, Tension Fabric 6x3m, เคลือบด้าน"
                    className="w-full px-3 py-1.5 bg-white border border-[#D9D0BE] rounded-xl text-xs text-[#3D4034] placeholder-[#A5A58D] focus:outline-none focus:border-[#588157]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#3D4034] mb-1 font-medium">
                  ลิงก์ไฟล์โครงสร้าง / แผนผัง Floor Plan (Drive)
                </label>
                <input
                  type="url"
                  value={driveUrl}
                  onChange={(e) => setDriveUrl(e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="w-full px-3 py-1.5 bg-white border border-[#D9D0BE] rounded-xl text-xs text-[#3D4034] placeholder-[#A5A58D] focus:outline-none focus:border-[#588157]"
                />
              </div>
            </div>
          )}

          {/* 3. Online Team Specific Fields */}
          {role === 'online' && (
            <div className="p-4 bg-[#FEF8E7] border border-[#EEDFB4] rounded-2xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#EEDFB4]">
                <span className="text-xs font-bold text-[#8C6514] flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#E9C46A]" />
                  ช่องทาง Online Ads / Content Plan / SEO
                </span>
                <span className="text-[11px] text-[#8C6514]">Channel & KPI Goals</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#3D4034] mb-1 font-medium">
                    แพลตฟอร์มโฆษณา / สื่อออนไลน์
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as any)}
                    className="w-full px-3 py-1.5 bg-white border border-[#D9D0BE] rounded-xl text-xs text-[#3D4034] focus:outline-none focus:border-[#588157]"
                  >
                    <option value="Meta Ads">Meta Ads (Facebook & IG)</option>
                    <option value="TikTok Ads">TikTok Ads / TikTok Shop Live</option>
                    <option value="Google Ads">Google Ads (Search & Performance Max)</option>
                    <option value="SEO/Blog">SEO / Website Content</option>
                    <option value="KOL/Influencer">KOL & Influencer Partnership</option>
                    <option value="Email">Email Marketing & CRM</option>
                    <option value="Other">Other Channel</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[#3D4034] mb-1 font-medium">
                    เป้าหมาย KPI แคมเปญ
                  </label>
                  <input
                    type="text"
                    value={targetKpi}
                    onChange={(e) => setTargetKpi(e.target.value)}
                    placeholder="เช่น ROAS > 4.5x, CVR > 3.8%, 2,000 Orders"
                    className="w-full px-3 py-1.5 bg-white border border-[#D9D0BE] rounded-xl text-xs text-[#3D4034] placeholder-[#A5A58D] focus:outline-none focus:border-[#588157]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[#3D4034] mb-1.5">
              รายละเอียดบรีฟ / สิ่งที่ต้องส่งมอบ (Deliverables & Scope)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ระบุข้อกำหนดของงาน เช่น ขนาดสัดส่วนชิ้นงาน, จุดประสงค์, กลุ่มเป้าหมาย, ข้อความโปรโมชั่น..."
              className="w-full px-3.5 py-2.5 bg-white border border-[#D9D0BE] rounded-xl text-xs sm:text-sm text-[#3D4034] placeholder-[#A5A58D] focus:outline-none focus:border-[#588157]"
            ></textarea>
          </div>

          {/* Assignee & Due Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
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
                ความสำคัญ (Priority)
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-[#D9D0BE] rounded-xl text-xs text-[#3D4034] focus:outline-none focus:border-[#588157]"
              >
                <option value="urgent">⚡ Urgent (ด่วนที่สุด)</option>
                <option value="high">High (สำคัญมาก)</option>
                <option value="medium">Medium (ปานกลาง)</option>
                <option value="low">Low (ปกติ)</option>
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
