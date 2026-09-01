import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Layers
} from 'lucide-react';
import { CampaignSummary } from '../types';

interface CampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaigns: CampaignSummary[];
  activeCampaignId: string;
  onSelectCampaign: (campaign: CampaignSummary) => void;
  onSaveCampaignsList: (campaigns: CampaignSummary[], actionName?: string) => void;
}

export const CampaignModal: React.FC<CampaignModalProps> = ({
  isOpen,
  onClose,
  campaigns,
  activeCampaignId,
  onSelectCampaign,
  onSaveCampaignsList,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingCampId, setEditingCampId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'planning' | 'active' | 'completed'>('active');
  const [totalBudget, setTotalBudget] = useState<number | ''>(500000);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]);

  if (!isOpen) return null;

  const handleOpenAdd = () => {
    setEditingCampId(null);
    setName('');
    setStatus('active');
    setTotalBudget(300000);
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate(new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]);
    setIsEditing(true);
  };

  const handleOpenEdit = (camp: CampaignSummary) => {
    setEditingCampId(camp.id);
    setName(camp.name);
    setStatus(camp.status);
    setTotalBudget(camp.totalBudget);
    setStartDate(camp.startDate);
    setEndDate(camp.endDate);
    setIsEditing(true);
  };

  const handleSaveCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const budgetNum = totalBudget === '' ? 0 : Number(totalBudget);

    if (editingCampId) {
      // Update existing
      const updatedList = campaigns.map(c => {
        if (c.id === editingCampId) {
          const updated: CampaignSummary = {
            ...c,
            name: name.trim(),
            status,
            totalBudget: budgetNum,
            startDate,
            endDate,
          };
          if (c.id === activeCampaignId) {
            onSelectCampaign(updated);
          }
          return updated;
        }
        return c;
      });
      onSaveCampaignsList(updatedList, `แก้ไขแคมเปญ "${name.trim()}"`);
    } else {
      // Add new
      const newCamp: CampaignSummary = {
        id: 'cmp-' + Date.now(),
        name: name.trim(),
        status,
        startDate,
        endDate,
        totalBudget: budgetNum,
        allocatedBudget: 0,
        spentBudget: 0,
      };
      const updatedList = [newCamp, ...campaigns];
      onSaveCampaignsList(updatedList, `สร้างแคมเปญใหม่ "${newCamp.name}"`);
      onSelectCampaign(newCamp);
    }

    setIsEditing(false);
    setEditingCampId(null);
  };

  const handleDeleteCampaign = (id: string, campName: string) => {
    if (campaigns.length <= 1) {
      alert('ต้องมีอย่างน้อย 1 แคมเปญในระบบ');
      return;
    }

    if (confirm(`คุณต้องการลบแคมเปญ "${campName}" ใช่หรือไม่?`)) {
      const remaining = campaigns.filter(c => c.id !== id);
      onSaveCampaignsList(remaining, `ลบแคมเปญ "${campName}"`);
      if (id === activeCampaignId && remaining.length > 0) {
        onSelectCampaign(remaining[0]);
      }
      if (editingCampId === id) {
        setIsEditing(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#3D4034]/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FDFCF7] border border-[#E8E2D2] rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl my-8">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E8E2D2] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#EDF3EB] border border-[#C5DCB7] flex items-center justify-center">
              <Layers className="w-4 h-4 text-[#588157]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#344E41]">
                จัดการแคมเปญการตลาด (Campaign Manager)
              </h3>
              <p className="text-[11px] text-[#6B705C]">
                สลับแคมเปญหลัก, เพิ่มแคมเปญใหม่, หรือแก้ไขงบประมาณและระยะเวลา
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#6B705C] hover:text-[#3D4034] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
          
          {/* Top Add Button */}
          <div className="flex items-center justify-between gap-3 pb-2 border-b border-[#E8E2D2]">
            <span className="text-xs font-semibold text-[#344E41]">
              แคมเปญทั้งหมด ({campaigns.length} แคมเปญ)
            </span>
            {!isEditing && (
              <button
                onClick={handleOpenAdd}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#588157] hover:bg-[#476B46] text-white transition shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>เพิ่มแคมเปญใหม่</span>
              </button>
            )}
          </div>

          {/* Form */}
          {isEditing && (
            <form onSubmit={handleSaveCampaign} className="bg-white border border-[#D9D0BE] rounded-2xl p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#E8E2D2]">
                <h4 className="text-xs font-bold text-[#344E41]">
                  {editingCampId ? 'แก้ไขข้อมูลแคมเปญ' : 'สร้างแคมเปญใหม่'}
                </h4>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-xs text-[#6B705C] hover:text-[#3D4034]"
                >
                  ✕ ปิดฟอร์ม
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#3D4034] mb-1">
                  ชื่อแคมเปญ *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="เช่น Q4 End-Year Mega Sale 2026, Summer Brand Launch"
                  className="w-full px-3 py-1.5 bg-[#FDFCF7] border border-[#D9D0BE] rounded-xl text-xs text-[#3D4034] focus:outline-none focus:border-[#588157]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#3D4034] mb-1">
                    งบประมาณรวม (บาท)
                  </label>
                  <input
                    type="number"
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="500000"
                    className="w-full px-3 py-1.5 bg-[#FDFCF7] border border-[#D9D0BE] rounded-xl text-xs text-[#3D4034] focus:outline-none focus:border-[#588157]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#3D4034] mb-1">
                    สถานะแคมเปญ
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-1.5 bg-[#FDFCF7] border border-[#D9D0BE] rounded-xl text-xs text-[#3D4034] focus:outline-none focus:border-[#588157]"
                  >
                    <option value="active">กำลังดำเนินการ (Active)</option>
                    <option value="planning">ช่วงวางแผน (Planning)</option>
                    <option value="completed">เสร็จสิ้นแล้ว (Completed)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#3D4034] mb-1">
                    วันเริ่มต้น
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#FDFCF7] border border-[#D9D0BE] rounded-xl text-xs text-[#3D4034] focus:outline-none focus:border-[#588157]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#3D4034] mb-1">
                    วันสิ้นสุด
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#FDFCF7] border border-[#D9D0BE] rounded-xl text-xs text-[#3D4034] focus:outline-none focus:border-[#588157]"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-[#E8E2D2] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 text-xs bg-[#F5F2EA] text-[#3D4034] rounded-xl hover:bg-[#EAE5D9]"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-[#588157] hover:bg-[#476B46] text-white rounded-xl shadow-xs"
                >
                  {editingCampId ? 'บันทึกการแก้ไข' : 'สร้างแคมเปญ'}
                </button>
              </div>
            </form>
          )}

          {/* List of Campaigns */}
          <div className="space-y-3">
            {campaigns.map(camp => {
              const isActive = camp.id === activeCampaignId;

              return (
                <div
                  key={camp.id}
                  className={`p-4 rounded-xl border transition flex flex-col justify-between gap-3 ${
                    isActive
                      ? 'bg-[#EDF3EB] border-[#588157] ring-1 ring-[#588157] shadow-xs'
                      : 'bg-white border-[#E8E2D2] hover:border-[#D0DEC9]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-[#344E41]">
                          {camp.name}
                        </h4>
                        {isActive && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#588157] text-white">
                            Active ปัจจุบัน
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                          camp.status === 'active' ? 'bg-[#FEF8E7] text-[#8C6514] border-[#EEDFB4]' :
                          camp.status === 'planning' ? 'bg-[#F5F2EA] text-[#6B705C] border-[#D9D0BE]' :
                          'bg-[#EDF3EB] text-[#2D5A34] border-[#C5DCB7]'
                        }`}>
                          {camp.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-xs text-[#6B705C]">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#588157]" />
                          {camp.startDate} ~ {camp.endDate}
                        </span>
                        <span>·</span>
                        <span className="font-semibold text-[#344E41]">
                          งบประมาณ: ฿{(camp.totalBudget || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleOpenEdit(camp)}
                        className="p-1.5 rounded-lg text-[#6B705C] hover:text-[#344E41] hover:bg-white transition"
                        title="แก้ไขแคมเปญนี้"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCampaign(camp.id, camp.name)}
                        className="p-1.5 rounded-lg text-[#8D927E] hover:text-[#E76F51] hover:bg-[#FDF0EB] transition"
                        title="ลบแคมเปญนี้"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {!isActive && (
                    <div className="pt-2 border-t border-[#E8E2D2] flex justify-end">
                      <button
                        onClick={() => {
                          onSelectCampaign(camp);
                        }}
                        className="px-3 py-1 text-xs font-semibold bg-white hover:bg-[#588157] text-[#344E41] hover:text-white border border-[#D9D0BE] rounded-lg transition shadow-xs"
                      >
                        เลือกแสดงแคมเปญนี้
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#E8E2D2] bg-[#F5F2EA] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white border border-[#D9D0BE] text-[#3D4034] hover:bg-[#EAE5D9] text-xs font-medium transition"
          >
            เสร็จสิ้น
          </button>
        </div>

      </div>
    </div>
  );
};
