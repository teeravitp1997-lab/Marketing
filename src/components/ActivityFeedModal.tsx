import React from 'react';
import { 
  X, 
  History, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  PlusCircle, 
  Edit3, 
  Trash2,
  FolderGit2
} from 'lucide-react';
import { ActivityLog } from '../types';

interface ActivityFeedModalProps {
  isOpen: boolean;
  onClose: () => void;
  activities: ActivityLog[];
  onDeleteActivity?: (id: string) => void;
  onClearAllActivity?: () => void;
}

export const ActivityFeedModal: React.FC<ActivityFeedModalProps> = ({
  isOpen,
  onClose,
  activities,
  onDeleteActivity,
  onClearAllActivity,
}) => {
  if (!isOpen) return null;

  const formatTime = (ts: number) => {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return 'เมื่อสักครู่';
    if (diff < 3600) return `${Math.floor(diff / 60)} นาทีที่แล้ว`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} ชั่วโมงที่แล้ว`;
    return new Date(ts).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#3D4034]/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FDFCF7] border border-[#E8E2D2] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl my-8">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E8E2D2] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#EDF3EB] border border-[#C5DCB7] flex items-center justify-center">
              <History className="w-4 h-4 text-[#588157]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#344E41]">
                บันทึกกิจกรรมเรียลไทม์ (Activity Feed)
              </h3>
              <p className="text-[11px] text-[#6B705C]">
                ประวัติการสร้าง แก้ไข และย้ายสถานะงานของทีมการตลาด
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

        {/* Top Action Bar in Modal */}
        {activities.length > 0 && onClearAllActivity && (
          <div className="px-6 py-2 bg-[#F5F2EA] border-b border-[#E8E2D2] flex items-center justify-between">
            <span className="text-[11px] text-[#6B705C] font-medium">
              มีทั้งหมด {activities.length} รายการ
            </span>
            <button
              onClick={() => {
                if (confirm('คุณต้องการล้างประวัติกิจกรรมทั้งหมดใช่หรือไม่?')) {
                  onClearAllActivity();
                }
              }}
              className="text-[11px] text-[#E76F51] hover:underline flex items-center gap-1 font-medium"
            >
              <Trash2 className="w-3 h-3" />
              <span>ล้างประวัติทั้งหมด</span>
            </button>
          </div>
        )}

        {/* Activity List */}
        <div className="p-6 space-y-3 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {activities.length === 0 ? (
            <div className="py-12 text-center text-[#8D927E] text-xs">
              ยังไม่มีประวัติกิจกรรมล่าสุด
            </div>
          ) : (
            activities.map(act => (
              <div
                key={act.id}
                className="group flex items-start gap-3 p-3 rounded-xl bg-white border border-[#E8E2D2] hover:border-[#D0DEC9] transition shadow-xs"
              >
                <img
                  src={act.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover border border-[#E8E2D2] mt-0.5 flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#344E41] truncate">
                      {act.userName}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[#8D927E] flex items-center gap-1 flex-shrink-0">
                        <Clock className="w-3 h-3" />
                        {formatTime(act.timestamp)}
                      </span>
                      {onDeleteActivity && (
                        <button
                          onClick={() => onDeleteActivity(act.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-[#8D927E] hover:text-[#E76F51] rounded transition"
                          title="ลบรายการนี้"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs font-medium text-[#588157] mt-0.5 truncate">
                    {act.targetTitle}
                  </p>

                  {act.details && (
                    <p className="text-[11px] text-[#6B705C] mt-1 leading-relaxed">
                      {act.details}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#E8E2D2] bg-[#F5F2EA] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white border border-[#D9D0BE] text-[#3D4034] hover:bg-[#EAE5D9] text-xs font-medium transition"
          >
            ปิด
          </button>
        </div>

      </div>
    </div>
  );
};
