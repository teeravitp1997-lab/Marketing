import React, { useState } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  Wallet, 
  CheckCircle2, 
  Clock, 
  Eye, 
  Circle,
  Calendar,
  DollarSign,
  ChevronRight,
  Edit3,
  Layers,
  Plus
} from 'lucide-react';
import { CampaignSummary, TaskItem, TaskStatus, TeamRole } from '../types';

interface DashboardOverviewProps {
  campaign: CampaignSummary;
  campaignsList: CampaignSummary[];
  tasks: TaskItem[];
  onUpdateCampaign: (updated: CampaignSummary) => void;
  onSelectCampaign: (campaign: CampaignSummary) => void;
  onOpenCampaignManager: () => void;
  onFilterStatus?: (status: TaskStatus | 'all') => void;
  activeStatusFilter?: TaskStatus | 'all';
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  campaign,
  campaignsList,
  tasks,
  onUpdateCampaign,
  onSelectCampaign,
  onOpenCampaignManager,
  onFilterStatus,
  activeStatusFilter = 'all',
}) => {
  const [isEditingCampaign, setIsEditingCampaign] = useState(false);
  const [editTitle, setEditTitle] = useState(campaign.name);
  const [editTotalBudget, setEditTotalBudget] = useState(campaign.totalBudget);
  const [editStartDate, setEditStartDate] = useState(campaign.startDate);
  const [editEndDate, setEditEndDate] = useState(campaign.endDate);
  const [editStatus, setEditStatus] = useState(campaign.status);

  // Status counts
  const statusCounts = {
    todo: tasks.filter(t => t.status === 'todo').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    review: tasks.filter(t => t.status === 'review').length,
    done: tasks.filter(t => t.status === 'done').length,
  };

  // Budget calculations from tasks
  const calculatedSpent = tasks.reduce((sum, t) => sum + (t.spent || (t.status === 'done' ? (t.budget || 0) : 0)), 0);
  const totalAllocated = tasks.reduce((sum, t) => sum + (t.budget || 0), 0);
  const remainingBudget = Math.max(0, campaign.totalBudget - (campaign.spentBudget || calculatedSpent));
  const spentPercent = Math.min(100, Math.round(((campaign.spentBudget || calculatedSpent) / (campaign.totalBudget || 1)) * 100));

  // Role workload breakdown
  const offlineTasks = tasks.filter(t => t.role === 'offline').length;
  const onlineTasks = tasks.filter(t => t.role === 'online').length;
  const graphicTasks = tasks.filter(t => t.role === 'graphic').length;

  const handleStartEdit = () => {
    setEditTitle(campaign.name);
    setEditTotalBudget(campaign.totalBudget);
    setEditStartDate(campaign.startDate);
    setEditEndDate(campaign.endDate);
    setEditStatus(campaign.status);
    setIsEditingCampaign(true);
  };

  const handleSaveCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCampaign({
      ...campaign,
      name: editTitle,
      totalBudget: Number(editTotalBudget),
      startDate: editStartDate,
      endDate: editEndDate,
      status: editStatus,
    });
    setIsEditingCampaign(false);
  };

  return (
    <section className="space-y-4">
      {/* Top Row: Campaign Hero Card & Budget Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Main Campaign Hero Info (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-[#E8E2D2] rounded-2xl p-5 sm:p-6 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#A3B18A]/10 rounded-full blur-3xl -z-0 pointer-events-none"></div>

          <div className="relative z-10">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
              
              {/* Campaign Switcher Dropdown */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#EDF3EB] text-[#2D5A34] border border-[#C5DCB7]">
                  <Sparkles className="w-3.5 h-3.5 text-[#588157]" />
                  แคมเปญหลัก
                </span>

                {campaignsList.length > 1 ? (
                  <select
                    value={campaign.id}
                    onChange={(e) => {
                      const found = campaignsList.find(c => c.id === e.target.value);
                      if (found) onSelectCampaign(found);
                    }}
                    className="text-xs bg-[#F5F2EA] border border-[#D9D0BE] text-[#344E41] font-semibold rounded-lg px-2.5 py-1 focus:outline-none focus:border-[#588157]"
                  >
                    {campaignsList.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                ) : null}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={onOpenCampaignManager}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-[#F5F2EA] hover:bg-[#EAE5D9] text-[#344E41] border border-[#D9D0BE] rounded-lg transition shadow-2xs"
                  title="จัดการ / เพิ่ม / ลบ แคมเปญ"
                >
                  <Layers className="w-3.5 h-3.5 text-[#588157]" />
                  <span className="hidden sm:inline">จัดการแคมเปญ</span>
                </button>

                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                  campaign.status === 'active' ? 'bg-[#FEF8E7] text-[#8C6514] border-[#EEDFB4]' :
                  campaign.status === 'planning' ? 'bg-[#F5F2EA] text-[#6B705C] border-[#D9D0BE]' :
                  'bg-[#EDF3EB] text-[#2D5A34] border-[#C5DCB7]'
                }`}>
                  {campaign.status === 'active' ? 'Active' : campaign.status}
                </span>

                <button
                  onClick={handleStartEdit}
                  className="p-1.5 rounded-lg text-[#6B705C] hover:text-[#344E41] hover:bg-[#F5F2EA] transition"
                  title="แก้ไขข้อมูลแคมเปญนี้"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {isEditingCampaign ? (
              <form onSubmit={handleSaveCampaign} className="space-y-3 mt-3 bg-[#F5F2EA] p-4 rounded-xl border border-[#E8E2D2]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-[#3D4034] mb-1">ชื่อแคมเปญ</label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-[#D9D0BE] rounded-lg text-xs text-[#3D4034] focus:outline-none focus:border-[#588157]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#3D4034] mb-1">สถานะ</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as any)}
                      className="w-full px-3 py-1.5 bg-white border border-[#D9D0BE] rounded-lg text-xs text-[#3D4034] focus:outline-none focus:border-[#588157]"
                    >
                      <option value="active">Active (กำลังดำเนินงาน)</option>
                      <option value="planning">Planning (วางแผน)</option>
                      <option value="completed">Completed (เสร็จสิ้น)</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs text-[#3D4034] mb-1">งบประมาณรวม (บาท)</label>
                    <input
                      type="number"
                      value={editTotalBudget}
                      onChange={(e) => setEditTotalBudget(Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-white border border-[#D9D0BE] rounded-lg text-xs text-[#3D4034] focus:outline-none focus:border-[#588157]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#3D4034] mb-1">วันเริ่ม</label>
                    <input
                      type="date"
                      value={editStartDate}
                      onChange={(e) => setEditStartDate(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-[#D9D0BE] rounded-lg text-xs text-[#3D4034] focus:outline-none focus:border-[#588157]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#3D4034] mb-1">วันสิ้นสุด</label>
                    <input
                      type="date"
                      value={editEndDate}
                      onChange={(e) => setEditEndDate(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-[#D9D0BE] rounded-lg text-xs text-[#3D4034] focus:outline-none focus:border-[#588157]"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingCampaign(false)}
                    className="px-3 py-1 text-xs bg-[#EAE5D9] hover:bg-[#DDD7C9] text-[#3D4034] rounded-lg"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 text-xs font-semibold bg-[#588157] hover:bg-[#476B46] text-white rounded-lg"
                  >
                    บันทึก
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#344E41] tracking-tight">
                  {campaign.name}
                </h2>
                <div className="flex items-center gap-2 text-xs text-[#6B705C] mt-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#588157]" />
                  <span>ระยะเวลาแคมเปญ: {campaign.startDate} ถึง {campaign.endDate}</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Team Workload Chips */}
          <div className="relative z-10 pt-4 mt-4 border-t border-[#E8E2D2] flex flex-wrap items-center gap-3">
            <span className="text-xs text-[#6B705C] font-medium">สัดส่วนงานทีม:</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#EDF3EB] text-[#2D5A34] border border-[#C5DCB7]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#588157]"></span>
              Offline: {offlineTasks} งาน
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#FEF8E7] text-[#8C6514] border border-[#EEDFB4]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E9C46A]"></span>
              Online: {onlineTasks} งาน
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#FDF0EB] text-[#C85A32] border border-[#F5D0C5]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E76F51]"></span>
              Graphic: {graphicTasks} บรีฟ
            </span>
          </div>
        </div>

        {/* Budget Tracker Metrics (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-[#E8E2D2] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#EDF3EB] border border-[#C5DCB7] flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-[#588157]" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#344E41] uppercase tracking-wider">ภาพรวมงบประมาณ (Budget)</h3>
                  <p className="text-[11px] text-[#6B705C]">ติดตามค่าใช้จ่ายจริงเทียบกับงบที่ตั้งไว้</p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#344E41] bg-[#F5F2EA] px-2.5 py-0.5 rounded-lg border border-[#D9D0BE]">
                ใช้ไป {spentPercent}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-[#F5F2EA] rounded-full h-2.5 overflow-hidden my-3 border border-[#E8E2D2]">
              <div
                className="bg-gradient-to-r from-[#A3B18A] via-[#588157] to-[#344E41] h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${spentPercent}%` }}
              ></div>
            </div>

            {/* 3 Metric Cards */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-2">
              <div className="bg-[#FDFCF7] p-2.5 rounded-xl border border-[#E8E2D2]">
                <span className="text-[10px] text-[#6B705C] block">งบประมาณรวม</span>
                <span className="text-xs sm:text-sm font-bold text-[#344E41]">
                  ฿{(campaign.totalBudget || 0).toLocaleString()}
                </span>
              </div>
              <div className="bg-[#FDFCF7] p-2.5 rounded-xl border border-[#E8E2D2]">
                <span className="text-[10px] text-[#6B705C] block">ใช้ไปแล้ว</span>
                <span className="text-xs sm:text-sm font-bold text-[#B8860B]">
                  ฿{(campaign.spentBudget || calculatedSpent).toLocaleString()}
                </span>
              </div>
              <div className="bg-[#FDFCF7] p-2.5 rounded-xl border border-[#E8E2D2]">
                <span className="text-[10px] text-[#6B705C] block">คงเหลือ</span>
                <span className="text-xs sm:text-sm font-bold text-[#588157]">
                  ฿{remainingBudget.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-[#6B705C] mt-3 pt-2.5 border-t border-[#E8E2D2] flex items-center justify-between">
            <span>งบประมาณที่ผูกกับงานย่อย (Allocated):</span>
            <span className="font-semibold text-[#344E41]">฿{totalAllocated.toLocaleString()}</span>
          </div>
        </div>

      </div>

      {/* Second Row: 4 Workflow Status Metric Cards (Clickable Filter) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        
        {/* To Do */}
        <button
          onClick={() => onFilterStatus && onFilterStatus(activeStatusFilter === 'todo' ? 'all' : 'todo')}
          className={`p-4 rounded-2xl border transition text-left flex items-center justify-between ${
            activeStatusFilter === 'todo'
              ? 'bg-[#F5F2EA] border-[#588157] ring-2 ring-[#588157]/20 shadow-sm'
              : 'bg-white border-[#E8E2D2] hover:border-[#D9D0BE] shadow-sm'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F5F2EA] text-[#6B705C] flex items-center justify-center border border-[#E8E2D2]">
              <Circle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-[#6B705C] font-medium">To Do</p>
              <p className="text-lg sm:text-xl font-bold text-[#344E41]">{statusCounts.todo} งาน</p>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-lg bg-[#F5F2EA] text-[#6B705C] border border-[#E8E2D2]">รอดำเนินการ</span>
        </button>

        {/* In Progress */}
        <button
          onClick={() => onFilterStatus && onFilterStatus(activeStatusFilter === 'in_progress' ? 'all' : 'in_progress')}
          className={`p-4 rounded-2xl border transition text-left flex items-center justify-between ${
            activeStatusFilter === 'in_progress'
              ? 'bg-[#EDF3EB] border-[#588157] ring-2 ring-[#588157]/20 shadow-sm'
              : 'bg-white border-[#E8E2D2] hover:border-[#D9D0BE] shadow-sm'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EDF3EB] text-[#588157] border border-[#C5DCB7] flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-[#6B705C] font-medium">In Progress</p>
              <p className="text-lg sm:text-xl font-bold text-[#588157]">{statusCounts.in_progress} งาน</p>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-lg bg-[#EDF3EB] text-[#2D5A34] border border-[#C5DCB7]">กำลังทำ</span>
        </button>

        {/* Review */}
        <button
          onClick={() => onFilterStatus && onFilterStatus(activeStatusFilter === 'review' ? 'all' : 'review')}
          className={`p-4 rounded-2xl border transition text-left flex items-center justify-between ${
            activeStatusFilter === 'review'
              ? 'bg-[#FEF8E7] border-[#E9C46A] ring-2 ring-[#E9C46A]/20 shadow-sm'
              : 'bg-white border-[#E8E2D2] hover:border-[#D9D0BE] shadow-sm'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FEF8E7] text-[#B8860B] border border-[#EEDFB4] flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-[#6B705C] font-medium">Review</p>
              <p className="text-lg sm:text-xl font-bold text-[#B8860B]">{statusCounts.review} บรีฟ</p>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-lg bg-[#FEF8E7] text-[#8C6514] border border-[#EEDFB4]">รอตรวจ/บรีฟ</span>
        </button>

        {/* Done */}
        <button
          onClick={() => onFilterStatus && onFilterStatus(activeStatusFilter === 'done' ? 'all' : 'done')}
          className={`p-4 rounded-2xl border transition text-left flex items-center justify-between ${
            activeStatusFilter === 'done'
              ? 'bg-[#EDF3EB] border-[#344E41] ring-2 ring-[#344E41]/20 shadow-sm'
              : 'bg-white border-[#E8E2D2] hover:border-[#D9D0BE] shadow-sm'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EDF3EB] text-[#344E41] border border-[#C5DCB7] flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-[#6B705C] font-medium">Done</p>
              <p className="text-lg sm:text-xl font-bold text-[#344E41]">{statusCounts.done} งาน</p>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-lg bg-[#EDF3EB] text-[#2D5A34] border border-[#C5DCB7]">เสร็จสมบูรณ์</span>
        </button>

      </div>
    </section>
  );
};

