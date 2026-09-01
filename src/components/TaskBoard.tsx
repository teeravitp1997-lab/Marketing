import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  LayoutGrid, 
  List as ListIcon, 
  MapPin, 
  Globe, 
  Palette, 
  ExternalLink, 
  Clock, 
  Calendar, 
  DollarSign, 
  MoreVertical, 
  CheckCircle2, 
  AlertCircle,
  FolderGit2,
  Sparkles,
  ChevronRight,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TaskItem, TeamRole, TaskStatus, TaskPriority } from '../types';

interface TaskBoardProps {
  tasks: TaskItem[];
  activeRole: TeamRole;
  onRoleChange: (role: TeamRole) => void;
  onOpenTaskModal: (task?: TaskItem, defaultRole?: TeamRole) => void;
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  onDeleteTask: (taskId: string) => void;
  selectedStatusFilter?: TaskStatus | 'all';
}

const COLUMNS: { key: TaskStatus; title: string; subtitle: string; color: string; bg: string; border: string; icon: any }[] = [
  {
    key: 'todo',
    title: 'To Do',
    subtitle: 'รอดำเนินการ',
    color: 'text-[#3D4034]',
    bg: 'bg-[#F5F2EA]/90',
    border: 'border-[#E8E2D2]',
    icon: Clock,
  },
  {
    key: 'in_progress',
    title: 'In Progress',
    subtitle: 'กำลังดำเนินการ',
    color: 'text-[#588157]',
    bg: 'bg-[#EDF3EB]/90',
    border: 'border-[#D0DEC9]',
    icon: Sparkles,
  },
  {
    key: 'review',
    title: 'Review / Brief',
    subtitle: 'รอตรวจ / รออนุมัติบรีฟ',
    color: 'text-[#B8860B]',
    bg: 'bg-[#FEF8E7]/90',
    border: 'border-[#EEDFB4]',
    icon: EyeIcon,
  },
  {
    key: 'done',
    title: 'Done / Approved',
    subtitle: 'เสร็จสิ้นสมบูรณ์',
    color: 'text-[#344E41]',
    bg: 'bg-[#EDF3EB]/90',
    border: 'border-[#C5DCB7]',
    icon: CheckCircle2,
  },
];

function EyeIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

export const TaskBoard: React.FC<TaskBoardProps> = ({
  tasks,
  activeRole,
  onRoleChange,
  onOpenTaskModal,
  onUpdateTaskStatus,
  onDeleteTask,
  selectedStatusFilter = 'all',
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | 'all'>('all');
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  // Extract all unique tags
  const allTags = Array.from(new Set(tasks.flatMap(t => t.tags || []))).slice(0, 8);

  // Filtering
  const filteredTasks = tasks.filter(task => {
    const matchRole = activeRole === 'all' || task.role === activeRole;
    const matchStatus = selectedStatusFilter === 'all' || task.status === selectedStatusFilter;
    const matchTag = selectedTag === 'all' || (task.tags && task.tags.includes(selectedTag));
    const q = searchQuery.toLowerCase().trim();
    const matchQuery = !q || 
      task.title.toLowerCase().includes(q) || 
      (task.description && task.description.toLowerCase().includes(q)) ||
      (task.assignee?.name && task.assignee.name.toLowerCase().includes(q)) ||
      (task.version && task.version.toLowerCase().includes(q)) ||
      (task.eventLocation && task.eventLocation.toLowerCase().includes(q));

    return matchRole && matchStatus && matchTag && matchQuery;
  });

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch { /* ignore */ }
  };

  const handleStatusChangeWithFeedback = (taskId: string, newStatus: TaskStatus) => {
    onUpdateTaskStatus(taskId, newStatus);
    if (newStatus === 'done') {
      triggerConfetti();
    }
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    setDraggedTaskId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (id) {
      handleStatusChangeWithFeedback(id, status);
      setDraggedTaskId(null);
    }
  };

  return (
    <section className="space-y-4">
      
      {/* Control Bar: Role Filters, Search, Tags, View Toggle */}
      <div className="bg-white border border-[#E8E2D2] rounded-2xl p-3 sm:p-4 space-y-3 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          {/* Role Filter Tabs */}
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto pb-1 lg:pb-0 custom-scrollbar">
            <button
              onClick={() => onRoleChange('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                activeRole === 'all'
                  ? 'bg-[#344E41] text-white shadow-sm'
                  : 'bg-[#F5F2EA] hover:bg-[#EAE5D9] text-[#3D4034]'
              }`}
            >
              ทั้งหมด (All Roles · {tasks.length})
            </button>

            <button
              onClick={() => onRoleChange('offline')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                activeRole === 'offline'
                  ? 'bg-[#588157] text-white shadow-sm'
                  : 'bg-[#F5F2EA] hover:bg-[#EAE5D9] text-[#3D4034]'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${activeRole === 'offline' ? 'bg-white' : 'bg-[#588157]'}`}></span>
              Offline Team (อีเวนต์/หน้าร้าน)
            </button>

            <button
              onClick={() => onRoleChange('online')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                activeRole === 'online'
                  ? 'bg-[#E9C46A] text-[#3D4034] shadow-sm'
                  : 'bg-[#F5F2EA] hover:bg-[#EAE5D9] text-[#3D4034]'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${activeRole === 'online' ? 'bg-[#3D4034]' : 'bg-[#B8860B]'}`}></span>
              Online Team (Ads/Content)
            </button>

            <button
              onClick={() => onRoleChange('graphic')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                activeRole === 'graphic'
                  ? 'bg-[#E76F51] text-white shadow-sm'
                  : 'bg-[#F5F2EA] hover:bg-[#EAE5D9] text-[#3D4034]'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${activeRole === 'graphic' ? 'bg-white' : 'bg-[#E76F51]'}`}></span>
              Graphic Team (บรีฟ/Figma/ไฟล์งาน)
            </button>
          </div>

          {/* Search & View Toggle */}
          <div className="flex items-center gap-2 justify-between lg:justify-end">
            <div className="relative min-w-[200px] sm:min-w-[260px] flex-1 sm:flex-initial">
              <Search className="w-4 h-4 text-[#8D927E] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาชื่องาน, ผู้รับผิดชอบ, สเปค..."
                className="w-full pl-9 pr-3 py-1.5 bg-[#FDFCF7] border border-[#D9D0BE] rounded-xl text-xs text-[#3D4034] placeholder-[#A5A58D] focus:outline-none focus:border-[#588157]"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-[#F5F2EA] border border-[#E8E2D2] rounded-xl p-1">
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-1.5 rounded-lg text-xs transition ${
                  viewMode === 'kanban' ? 'bg-[#588157] text-white shadow-sm' : 'text-[#6B705C] hover:text-[#3D4034]'
                }`}
                title="มุมมองกระดาน Kanban"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg text-xs transition ${
                  viewMode === 'list' ? 'bg-[#588157] text-white shadow-sm' : 'text-[#6B705C] hover:text-[#3D4034]'
                }`}
                title="มุมมองตารางรายการ Table List"
              >
                <ListIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Quick Tag Filter Pills */}
        {allTags.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 text-[11px] text-[#6B705C] custom-scrollbar">
            <span className="text-[10px] uppercase font-semibold text-[#8D927E] flex items-center gap-1">
              <Filter className="w-3 h-3 text-[#588157]" /> แท็ก:
            </span>
            <button
              onClick={() => setSelectedTag('all')}
              className={`px-2 py-0.5 rounded-md transition ${
                selectedTag === 'all' ? 'bg-[#EDF3EB] text-[#2D5A34] border border-[#C5DCB7] font-semibold' : 'hover:bg-[#F5F2EA]'
              }`}
            >
              ทั้งหมด
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? 'all' : tag)}
                className={`px-2 py-0.5 rounded-md transition ${
                  selectedTag === tag ? 'bg-[#588157] text-white' : 'bg-[#F5F2EA] hover:bg-[#EAE5D9] text-[#3D4034]'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ===================================================
          1. KANBAN BOARD VIEW
          =================================================== */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {COLUMNS.map(col => {
            const colTasks = filteredTasks.filter(t => t.status === col.key);
            const Icon = col.icon;

            return (
              <div
                key={col.key}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.key)}
                className={`rounded-2xl border ${col.border} ${col.bg} p-3.5 flex flex-col min-h-[520px] transition shadow-sm`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E8E2D2]">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${col.color}`} />
                    <div>
                      <h3 className={`text-xs font-bold ${col.color} uppercase tracking-wider`}>
                        {col.title}
                      </h3>
                      <p className="text-[10px] text-[#6B705C]">{col.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 text-xs font-bold rounded-lg bg-white text-[#3D4034] border border-[#E8E2D2] shadow-xs">
                      {colTasks.length}
                    </span>
                    <button
                      onClick={() => onOpenTaskModal(undefined, activeRole === 'all' ? 'offline' : activeRole)}
                      className="p-1 rounded-lg text-[#6B705C] hover:text-[#344E41] hover:bg-white/80 transition"
                      title="เพิ่มงานในสเตตัสนี้"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Task Cards in Column */}
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[750px] custom-scrollbar pr-0.5">
                  {colTasks.length === 0 ? (
                    <div className="h-40 rounded-xl border border-dashed border-[#D9D0BE] flex flex-col items-center justify-center text-center p-4 text-[#8D927E] bg-white/40">
                      <p className="text-xs">ยังไม่มีงานในสถานะนี้</p>
                      <button
                        onClick={() => onOpenTaskModal(undefined, activeRole === 'all' ? 'offline' : activeRole)}
                        className="mt-2 text-[11px] text-[#588157] hover:text-[#344E41] hover:underline flex items-center gap-1 font-medium"
                      >
                        <Plus className="w-3 h-3" /> สร้างงานใหม่
                      </button>
                    </div>
                  ) : (
                    colTasks.map(task => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={() => onOpenTaskModal(task)}
                        onStatusChange={handleStatusChangeWithFeedback}
                        onDelete={() => onDeleteTask(task.id)}
                        onDragStart={(e) => handleDragStart(e, task.id)}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ===================================================
           2. TABLE / LIST VIEW
           =================================================== */
        <div className="bg-white border border-[#E8E2D2] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#3D4034]">
              <thead className="bg-[#F5F2EA] text-[#6B705C] uppercase text-[10px] tracking-wider border-b border-[#E8E2D2]">
                <tr>
                  <th className="px-4 py-3 font-semibold">ชื่องาน / บรีฟ</th>
                  <th className="px-3 py-3 font-semibold">หน้าที่หลัก</th>
                  <th className="px-3 py-3 font-semibold">ลักษณะงาน</th>
                  <th className="px-3 py-3 font-semibold">สถานะ</th>
                  <th className="px-3 py-3 font-semibold">ความสำคัญ</th>
                  <th className="px-3 py-3 font-semibold">ผู้รับผิดชอบ</th>
                  <th className="px-3 py-3 font-semibold">กำหนดส่ง</th>
                  <th className="px-3 py-3 font-semibold">รายละเอียด / ลิงก์</th>
                  <th className="px-3 py-3 font-semibold text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2D2]">
                {filteredTasks.map(task => (
                  <tr key={task.id} className="hover:bg-[#FDFCF7] transition">
                    <td className="px-4 py-3 font-medium text-[#344E41] max-w-xs">
                      <div className="font-semibold text-sm line-clamp-1">{task.title}</div>
                      {task.description && (
                        <div className="text-[11px] text-[#6B705C] line-clamp-1">{task.description}</div>
                      )}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <RoleBadge role={task.role} />
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <JobTypeBadge jobType={task.jobType} label={task.jobTypeLabel} />
                    </td>
                    <td className="px-3 py-3">
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChangeWithFeedback(task.id, e.target.value as TaskStatus)}
                        className="bg-white border border-[#D9D0BE] text-[#3D4034] text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-[#588157]"
                      >
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="review">Review</option>
                        <option value="done">Done</option>
                      </select>
                    </td>
                    <td className="px-3 py-3">
                      <PriorityBadge priority={task.priority} />
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1.5">
                        <img 
                          src={task.assignee?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'} 
                          alt="" 
                          className="w-5 h-5 rounded-full object-cover border border-[#E8E2D2]"
                        />
                        <span className="truncate max-w-[110px] text-[#3D4034]">{task.assignee?.name || 'ยังไม่กำหนด'}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-[#6B705C] whitespace-nowrap">
                      {task.dueDate || '-'}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap items-center gap-1.5 max-w-sm">
                        {task.platform && (
                          <span className="px-1.5 py-0.5 rounded bg-[#FEF8E7] text-[#8C6514] text-[10px] border border-[#EEDFB4] font-medium">
                            {task.platform}
                          </span>
                        )}
                        {task.targetKpi && (
                          <span className="px-1.5 py-0.5 rounded bg-[#EDF3EB] text-[#2D5A34] text-[10px] border border-[#C5DCB7] font-medium truncate max-w-[130px]" title={task.targetKpi}>
                            🎯 {task.targetKpi}
                          </span>
                        )}
                        {task.eventLocation && (
                          <span className="px-1.5 py-0.5 rounded bg-[#F5F2EA] text-[#6B705C] text-[10px] border border-[#E8E2D2] truncate max-w-[130px]" title={task.eventLocation}>
                            📍 {task.eventLocation}
                          </span>
                        )}
                        {task.figmaUrl && (
                          <a href={task.figmaUrl} target="_blank" rel="noreferrer" className="text-[#E76F51] hover:underline flex items-center gap-0.5 font-medium text-[11px]">
                            Figma <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                        {task.driveUrl && (
                          <a href={task.driveUrl} target="_blank" rel="noreferrer" className="text-[#588157] hover:underline flex items-center gap-0.5 font-medium text-[11px]">
                            Drive <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                        {task.version && (
                          <span className="px-1.5 py-0.5 rounded bg-[#FDF0EB] text-[#C85A32] text-[10px] border border-[#F5D0C5]">
                            {task.version}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <button
                        onClick={() => onOpenTaskModal(task)}
                        className="px-2.5 py-1 rounded-lg bg-[#F5F2EA] hover:bg-[#EAE5D9] text-[#344E41] border border-[#D9D0BE] text-xs transition"
                      >
                        แก้ไข
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </section>
  );
};

// Sub-component: Individual Kanban Task Card
const TaskCard: React.FC<{
  task: TaskItem;
  onEdit: () => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onDelete: () => void;
  onDragStart: (e: React.DragEvent) => void;
}> = ({ task, onEdit, onStatusChange, onDelete, onDragStart }) => {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onEdit}
      className="bg-white hover:bg-[#FCFBF8] border border-[#E8E2D2] hover:border-[#D0DEC9] rounded-xl p-3.5 space-y-3 cursor-grab active:cursor-grabbing transition shadow-xs hover:shadow-md group relative"
    >
      {/* Card Header: Role (หน้าที่หลัก) & Job Type (ลักษณะงาน) & Priority */}
      <div className="flex flex-wrap items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <RoleBadge role={task.role} />
          {task.jobType && (
            <JobTypeBadge jobType={task.jobType} label={task.jobTypeLabel} />
          )}
        </div>
        <PriorityBadge priority={task.priority} />
      </div>

      {/* Title & Description */}
      <div>
        <h4 className="text-xs sm:text-sm font-bold text-[#344E41] leading-snug group-hover:text-[#588157] transition line-clamp-2">
          {task.title}
        </h4>
        {task.description && (
          <p className="text-[11px] text-[#6B705C] line-clamp-2 mt-1 leading-relaxed">
            {task.description}
          </p>
        )}
      </div>

      {/* Unified Marketing Execution Highlights (Shared for all roles) */}
      {(task.platform || task.targetKpi || task.eventLocation || task.printSpecs || task.figmaUrl || task.driveUrl || task.version) && (
        <div className="p-2.5 bg-[#F8F6EE] border border-[#E8E2D2] rounded-lg space-y-1.5 text-[11px]">
          
          {/* Platform & KPI */}
          {(task.platform || task.targetKpi) && (
            <div className="flex items-center justify-between gap-2 flex-wrap text-[11px]">
              {task.platform && (
                <span className="font-semibold text-[#8C6514] flex items-center gap-1">
                  <Globe className="w-3 h-3 text-[#E9C46A]" /> {task.platform}
                </span>
              )}
              {task.targetKpi && (
                <span className="text-[10px] text-[#2D5A34] bg-[#EDF3EB] px-1.5 py-0.5 rounded border border-[#C5DCB7] font-medium truncate max-w-[160px]" title={task.targetKpi}>
                  🎯 {task.targetKpi}
                </span>
              )}
            </div>
          )}

          {/* Location & Print Specs */}
          {(task.eventLocation || task.printSpecs) && (
            <div className="space-y-0.5 pt-0.5 border-t border-[#E8E2D2]/60">
              {task.eventLocation && (
                <div className="flex items-center gap-1 text-[#2D5A34] truncate font-medium text-[10px]">
                  <MapPin className="w-3 h-3 flex-shrink-0 text-[#588157]" />
                  <span className="truncate">{task.eventLocation}</span>
                </div>
              )}
              {task.printSpecs && (
                <p className="text-[10px] text-[#6B705C] truncate">
                  🖨️ สเปค: {task.printSpecs}
                </p>
              )}
            </div>
          )}

          {/* Graphic & Assets Deliverables */}
          {(task.figmaUrl || task.driveUrl || task.version || task.reviewNotes) && (
            <div className="space-y-1 pt-1 border-t border-[#E8E2D2]/60">
              <div className="flex items-center justify-between gap-1 flex-wrap">
                {task.version && (
                  <span className="text-[10px] font-semibold text-[#C85A32] bg-[#FDF0EB] px-1.5 py-0.5 rounded border border-[#F5D0C5]">
                    🏷️ {task.version}
                  </span>
                )}
                <div className="flex items-center gap-1.5 ml-auto">
                  {task.figmaUrl && (
                    <a
                      href={task.figmaUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="px-1.5 py-0.5 rounded bg-white hover:bg-[#E76F51] text-[#C85A32] hover:text-white transition flex items-center gap-0.5 border border-[#F5D0C5] text-[10px] shadow-xs"
                      title="เปิดไฟล์ Figma"
                    >
                      Figma <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                  {task.driveUrl && (
                    <a
                      href={task.driveUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="px-1.5 py-0.5 rounded bg-white hover:bg-[#588157] text-[#588157] hover:text-white transition flex items-center gap-0.5 border border-[#C5DCB7] text-[10px] shadow-xs"
                      title="เปิดโฟลเดอร์ Google Drive"
                    >
                      Drive <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
              </div>
              {task.reviewNotes && (
                <p className="text-[10px] text-[#6B705C] line-clamp-1 italic">
                  💬 "{task.reviewNotes}"
                </p>
              )}
            </div>
          )}

        </div>
      )}

      {/* Card Footer: Assignee, Due Date & Quick Status Shift */}
      <div className="pt-2 border-t border-[#E8E2D2] flex items-center justify-between text-[11px] text-[#6B705C]">
        <div className="flex items-center gap-1.5 min-w-0">
          <img
            src={task.assignee?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
            alt=""
            className="w-5 h-5 rounded-full object-cover border border-[#E8E2D2] flex-shrink-0"
          />
          <span className="truncate max-w-[90px] font-medium text-[#3D4034]">
            {task.assignee?.name ? task.assignee.name.split(' ')[0] : 'ทีมงาน'}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {task.dueDate && (
            <span className="flex items-center gap-0.5 text-[10px] text-[#6B705C]">
              <Calendar className="w-3 h-3 text-[#8D927E]" />
              {task.dueDate.split('-').slice(1).join('/')}
            </span>
          )}

          {/* Quick Status Forwarder */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              const nextStatus: Record<TaskStatus, TaskStatus> = {
                todo: 'in_progress',
                in_progress: 'review',
                review: 'done',
                done: 'todo',
              };
              onStatusChange(task.id, nextStatus[task.status]);
            }}
            className="p-1 rounded-md hover:bg-[#F5F2EA] text-[#6B705C] hover:text-[#588157] transition ml-1"
            title="เลื่อนไปสถานะถัดไป"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper Badge: Role (หน้าที่หลัก)
const RoleBadge: React.FC<{ role: string }> = ({ role }) => {
  if (role === 'offline') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#EDF3EB] text-[#2D5A34] border border-[#C5DCB7]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#588157]"></span> Offline
      </span>
    );
  }
  if (role === 'online') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#FEF8E7] text-[#8C6514] border border-[#EEDFB4]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#E9C46A]"></span> Online
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#FDF0EB] text-[#C85A32] border border-[#F5D0C5]">
      <span className="w-1.5 h-1.5 rounded-full bg-[#E76F51]"></span> Graphic
    </span>
  );
};

// Helper Badge: Job Characteristic (ลักษณะงาน)
const JobTypeBadge: React.FC<{ jobType?: string; label?: string }> = ({ jobType, label }) => {
  if (!jobType) return null;

  const jobTypeMap: Record<string, { label: string; icon: string; style: string }> = {
    posm_print: { label: 'POSM / งานพิมพ์', icon: '🖨️', style: 'bg-[#F4F1EA] text-[#555B46] border-[#DDD5C5]' },
    event_booth: { label: 'อีเวนต์ & บูธ', icon: '🎪', style: 'bg-[#EDF3EB] text-[#2D5A34] border-[#C5DCB7]' },
    digital_ads: { label: 'โฆษณา Ads', icon: '📱', style: 'bg-[#FEF8E7] text-[#8C6514] border-[#EEDFB4]' },
    kol_influencer: { label: 'KOL & PR', icon: '🌟', style: 'bg-[#FDF0EB] text-[#C85A32] border-[#F5D0C5]' },
    content_social: { label: 'Content & Social', icon: '✍️', style: 'bg-[#EEF4F8] text-[#2A5C7A] border-[#C8DFEE]' },
    live_commerce: { label: 'Live Streaming', icon: '🔴', style: 'bg-[#FDECEE] text-[#B02A37] border-[#F8CCD1]' },
    ooh_billboard: { label: 'ป้าย OOH', icon: '🏙️', style: 'bg-[#F1EEF8] text-[#563D7C] border-[#DCD5EE]' },
    promotion_crm: { label: 'โปรโมชั่น & CRM', icon: '🎁', style: 'bg-[#FEF6E8] text-[#9A6400] border-[#F5DCB1]' },
    omnichannel: { label: 'Omnichannel O2O', icon: '🔄', style: 'bg-[#EBF7F2] text-[#1E7253] border-[#BEE7D5]' },
    other: { label: 'อื่นๆ', icon: '📌', style: 'bg-[#F5F2EA] text-[#6B705C] border-[#E8E2D2]' },
  };

  const info = jobTypeMap[jobType] || { label: label || jobType, icon: '📌', style: 'bg-[#F5F2EA] text-[#6B705C] border-[#E8E2D2]' };

  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium border ${info.style}`} title={label || info.label}>
      <span>{info.icon}</span>
      <span className="truncate max-w-[100px]">{info.label}</span>
    </span>
  );
};

const PriorityBadge: React.FC<{ priority: TaskPriority }> = ({ priority }) => {
  if (priority === 'urgent') {
    return (
      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#FDF0EB] text-[#E76F51] border border-[#F5D0C5]">
        ⚡ Urgent
      </span>
    );
  }
  if (priority === 'high') {
    return (
      <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#FEF8E7] text-[#B8860B] border border-[#EEDFB4]">
        High
      </span>
    );
  }
  if (priority === 'low') {
    return <span className="text-[10px] text-[#A5A58D] font-medium">Low</span>;
  }
  return <span className="text-[10px] text-[#6B705C] font-medium">Med</span>;
};
