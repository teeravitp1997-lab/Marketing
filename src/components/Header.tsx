import React from 'react';
import { 
  Layers, 
  Database, 
  PlusCircle, 
  Code2, 
  History, 
  Sparkles,
  Wifi,
  WifiOff,
  Users
} from 'lucide-react';
import { TeamRole, CollaboratorPresence } from '../types';

interface HeaderProps {
  activeRole: TeamRole;
  onRoleChange: (role: TeamRole) => void;
  isFirebaseLive: boolean;
  onOpenTaskModal: () => void;
  onOpenConfigModal: () => void;
  onOpenCodeModal: () => void;
  onOpenActivityModal: () => void;
  onOpenMembersModal?: () => void;
  activeCollaborators: CollaboratorPresence[];
}

export const Header: React.FC<HeaderProps> = ({
  activeRole,
  onRoleChange,
  isFirebaseLive,
  onOpenTaskModal,
  onOpenConfigModal,
  onOpenCodeModal,
  onOpenActivityModal,
  onOpenMembersModal,
  activeCollaborators,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#FDFCF7]/90 backdrop-blur-md border-b border-[#E8E2D2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Project Info */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#344E41] via-[#588157] to-[#A3B18A] flex items-center justify-center shadow-md shadow-[#588157]/20 flex-shrink-0">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-[#344E41] tracking-tight truncate">
                  Marketing Collaboration Hub
                </h1>
                {isFirebaseLive ? (
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EDF3EB] text-[#2D5A34] border border-[#C5DCB7]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#588157] animate-pulse"></span>
                    Firebase RTDB Live
                  </span>
                ) : (
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FEF8E7] text-[#8C6514] border border-[#EEDFB4]" title="ซิงค์ข้อมูลผ่าน Local Real-time Channel (เปิดสองแท็บข้อมูลจะอัปเดตตรงกัน)">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E9C46A]"></span>
                    Real-time Sync Mode
                  </span>
                )}
              </div>
              <p className="text-xs text-[#6B705C] truncate hidden md:block">
                ระบบบรีฟงานและติดตามแคมเปญการตลาด (Offline · Online · Graphic)
              </p>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Active Collaborators Presence Stack -> Clickable to manage members */}
            <button
              onClick={onOpenMembersModal}
              id="btn-manage-team-members"
              className="flex items-center gap-1.5 px-2.5 py-1 bg-[#F5F2EA] hover:bg-[#EAE5D9] rounded-xl border border-[#E8E2D2] transition shadow-2xs cursor-pointer"
              title="คลิกเพื่อ เพิ่ม / แก้ไข / ลบ สมาชิกในทีม"
            >
              <div className="flex -space-x-2">
                {activeCollaborators.slice(0, 4).map((user) => (
                  <div key={user.id} className="relative">
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-6 h-6 rounded-full border-2 border-[#FDFCF7] object-cover"
                    />
                    <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#588157] ring-1 ring-[#FDFCF7]"></span>
                  </div>
                ))}
              </div>
              <span className="text-[11px] text-[#344E41] font-semibold pl-1 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-[#588157]" />
                <span className="hidden sm:inline">ทีม ({activeCollaborators.length})</span>
              </span>
            </button>

            {/* Single-File HTML Standalone Code Export Modal Trigger */}
            <button
              onClick={onOpenCodeModal}
              id="btn-export-code"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#F5F2EA] hover:bg-[#EAE5D9] text-[#344E41] border border-[#D9D0BE] transition shadow-sm"
              title="ดูและดาวน์โหลดโค้ด HTML Single-File สมบูรณ์แบบ CDN"
            >
              <Code2 className="w-4 h-4 text-[#588157]" />
              <span className="hidden sm:inline">โค้ด Single-File HTML</span>
            </button>

            {/* Activity History Modal Trigger */}
            <button
              onClick={onOpenActivityModal}
              id="btn-activity-history"
              className="p-2 rounded-xl text-[#6B705C] hover:text-[#3D4034] hover:bg-[#F5F2EA] border border-[#D9D0BE] transition"
              title="ประวัติการแก้ไขล่าสุด"
            >
              <History className="w-4 h-4" />
            </button>

            {/* Firebase Settings */}
            <button
              onClick={onOpenConfigModal}
              id="btn-firebase-settings"
              className={`p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-medium border transition flex items-center gap-1.5 ${
                isFirebaseLive
                  ? 'bg-[#EDF3EB] text-[#2D5A34] border-[#C5DCB7] hover:bg-[#DCEADA]'
                  : 'bg-[#F5F2EA] text-[#6B705C] border-[#D9D0BE] hover:bg-[#EAE5D9]'
              }`}
              title="ตั้งค่าเชื่อมต่อ Firebase Realtime Database"
            >
              <Database className={`w-4 h-4 ${isFirebaseLive ? 'text-[#588157]' : 'text-[#B8860B]'}`} />
              <span className="hidden md:inline">Firebase DB</span>
            </button>

            {/* Create Task / Brief Button */}
            <button
              onClick={onOpenTaskModal}
              id="btn-create-task-main"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#588157] hover:bg-[#476B46] text-white shadow-md shadow-[#588157]/20 active:scale-95 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>สร้างงาน / บรีฟ</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
