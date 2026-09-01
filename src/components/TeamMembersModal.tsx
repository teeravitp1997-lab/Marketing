import React, { useState } from 'react';
import { 
  X, 
  Users, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  ShieldCheck,
  Sparkles,
  MapPin,
  Globe,
  Palette
} from 'lucide-react';
import { TeamMember, TeamRole } from '../types';

interface TeamMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: TeamMember[];
  onSaveMembers: (members: TeamMember[], actionName?: string) => void;
}

const DEFAULT_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80',
];

export const TeamMembersModal: React.FC<TeamMembersModalProps> = ({
  isOpen,
  onClose,
  members,
  onSaveMembers,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [role, setRole] = useState<'offline' | 'online' | 'graphic' | 'lead'>('offline');
  const [avatar, setAvatar] = useState(DEFAULT_AVATARS[0]);

  if (!isOpen) return null;

  const handleOpenAdd = () => {
    setEditingMemberId(null);
    setName('');
    setRoleTitle('');
    setRole('offline');
    setAvatar(DEFAULT_AVATARS[Math.floor(Math.random() * DEFAULT_AVATARS.length)]);
    setIsEditing(true);
  };

  const handleOpenEdit = (m: TeamMember) => {
    setEditingMemberId(m.id);
    setName(m.name);
    setRoleTitle(m.roleTitle || '');
    setRole(m.role);
    setAvatar(m.avatar);
    setIsEditing(true);
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingMemberId) {
      // Edit
      const updated = members.map(m => {
        if (m.id === editingMemberId) {
          return {
            ...m,
            name: name.trim(),
            roleTitle: roleTitle.trim() || 'Marketing Member',
            role,
            avatar,
            lastActive: Date.now(),
          };
        }
        return m;
      });
      onSaveMembers(updated, `แก้ไขข้อมูลสมาชิก "${name.trim()}"`);
    } else {
      // Add
      const newMember: TeamMember = {
        id: 'member-' + Date.now(),
        name: name.trim(),
        roleTitle: roleTitle.trim() || 'Marketing Member',
        role,
        avatar,
        lastActive: Date.now(),
        isOnline: true,
      };
      onSaveMembers([newMember, ...members], `เพิ่มสมาชิกใหม่ "${newMember.name}"`);
    }

    setIsEditing(false);
    setEditingMemberId(null);
  };

  const handleDeleteMember = (id: string, memberName: string) => {
    if (confirm(`คุณต้องการลบสมาชิก "${memberName}" ออกจากทีมใช่หรือไม่?`)) {
      const remaining = members.filter(m => m.id !== id);
      onSaveMembers(remaining, `ลบสมาชิก "${memberName}"`);
      if (editingMemberId === id) {
        setIsEditing(false);
      }
    }
  };

  const getRoleBadge = (r: string) => {
    if (r === 'offline') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#EDF3EB] text-[#2D5A34] border border-[#C5DCB7]">
          <MapPin className="w-2.5 h-2.5" /> Offline
        </span>
      );
    }
    if (r === 'online') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#FEF8E7] text-[#8C6514] border border-[#EEDFB4]">
          <Globe className="w-2.5 h-2.5" /> Online
        </span>
      );
    }
    if (r === 'lead') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#F5F2EA] text-[#344E41] border border-[#D9D0BE]">
          <ShieldCheck className="w-2.5 h-2.5" /> Team Lead
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#FDF0EB] text-[#C85A32] border border-[#F5D0C5]">
        <Palette className="w-2.5 h-2.5" /> Graphic
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#3D4034]/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FDFCF7] border border-[#E8E2D2] rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl my-8">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E8E2D2] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#EDF3EB] border border-[#C5DCB7] flex items-center justify-center">
              <Users className="w-4 h-4 text-[#588157]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#344E41]">
                จัดการสมาชิกทีมการตลาด (Team Members)
              </h3>
              <p className="text-[11px] text-[#6B705C]">
                เพิ่ม แก้ไข หรือลบผู้รับผิดชอบงานในระบบได้แบบ Real-time ({members.length} คน)
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
          
          {/* Top action: Add new member toggle */}
          <div className="flex items-center justify-between gap-3 pb-2 border-b border-[#E8E2D2]">
            <span className="text-xs font-semibold text-[#344E41]">รายชื่อสมาชิกทั้งหมด</span>
            {!isEditing && (
              <button
                onClick={handleOpenAdd}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#588157] hover:bg-[#476B46] text-white transition shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>เพิ่มสมาชิกใหม่</span>
              </button>
            )}
          </div>

          {/* Edit/Add Form */}
          {isEditing && (
            <form onSubmit={handleSaveMember} className="bg-white border border-[#D9D0BE] rounded-2xl p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#E8E2D2]">
                <h4 className="text-xs font-bold text-[#344E41]">
                  {editingMemberId ? 'แก้ไขข้อมูลสมาชิก' : 'เพิ่มสมาชิกใหม่'}
                </h4>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-xs text-[#6B705C] hover:text-[#3D4034]"
                >
                  ✕ ปิดฟอร์ม
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#3D4034] mb-1">
                    ชื่อ - นามสกุล / ชื่อเล่น *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="เช่น กานต์ (Offline Lead)"
                    className="w-full px-3 py-1.5 bg-[#FDFCF7] border border-[#D9D0BE] rounded-xl text-xs text-[#3D4034] focus:outline-none focus:border-[#588157]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#3D4034] mb-1">
                    ตำแหน่งงาน (Job Title)
                  </label>
                  <input
                    type="text"
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    placeholder="เช่น Event Producer, Ads Specialist"
                    className="w-full px-3 py-1.5 bg-[#FDFCF7] border border-[#D9D0BE] rounded-xl text-xs text-[#3D4034] focus:outline-none focus:border-[#588157]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#3D4034] mb-1">
                    ทีม / สายงานหลัก (Role)
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full px-3 py-1.5 bg-[#FDFCF7] border border-[#D9D0BE] rounded-xl text-xs text-[#3D4034] focus:outline-none focus:border-[#588157]"
                  >
                    <option value="offline">Offline Team (อีเวนต์, หน้าร้าน, สื่อพิมพ์)</option>
                    <option value="online">Online Team (Ads, Content, Social, KOL)</option>
                    <option value="graphic">Graphic Team (ออกแบบ, บรีฟ, Figma)</option>
                    <option value="lead">Marketing Lead (หัวหน้าทีม/ผู้บริหาร)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#3D4034] mb-1">
                    URL รูปโปรไฟล์ (Avatar)
                  </label>
                  <input
                    type="url"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-1.5 bg-[#FDFCF7] border border-[#D9D0BE] rounded-xl text-xs text-[#3D4034] focus:outline-none focus:border-[#588157]"
                  />
                </div>
              </div>

              {/* Avatar Preset Picker */}
              <div>
                <label className="block text-[11px] text-[#6B705C] mb-1.5">หรือเลือกรูปโปรไฟล์สำเร็จรูป:</label>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {DEFAULT_AVATARS.map((av, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatar(av)}
                      className={`relative w-8 h-8 rounded-full overflow-hidden border-2 transition ${
                        avatar === av ? 'border-[#588157] scale-110 shadow-xs' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={av} alt="" className="w-full h-full object-cover" />
                      {avatar === av && (
                        <div className="absolute inset-0 bg-[#588157]/30 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
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
                  {editingMemberId ? 'บันทึกการแก้ไข' : 'บันทึกสมาชิก'}
                </button>
              </div>
            </form>
          )}

          {/* Members List */}
          <div className="space-y-2.5">
            {members.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#8D927E] border border-dashed border-[#D9D0BE] rounded-xl">
                ยังไม่มีสมาชิกในทีม กรุณากดปุ่ม "+ เพิ่มสมาชิกใหม่"
              </div>
            ) : (
              members.map(m => (
                <div
                  key={m.id}
                  className="flex items-center justify-between gap-3 p-3 bg-white border border-[#E8E2D2] hover:border-[#D0DEC9] rounded-xl shadow-xs transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative flex-shrink-0">
                      <img
                        src={m.avatar || DEFAULT_AVATARS[0]}
                        alt={m.name}
                        className="w-9 h-9 rounded-full object-cover border border-[#E8E2D2]"
                      />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#588157] ring-2 ring-white"></span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-[#344E41] truncate">
                          {m.name}
                        </h4>
                        {getRoleBadge(m.role)}
                      </div>
                      <p className="text-[11px] text-[#6B705C] truncate">
                        {m.roleTitle || 'Marketing Team Member'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => handleOpenEdit(m)}
                      className="p-1.5 rounded-lg text-[#6B705C] hover:text-[#344E41] hover:bg-[#EDF3EB] transition"
                      title="แก้ไขข้อมูลสมาชิก"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteMember(m.id, m.name)}
                      className="p-1.5 rounded-lg text-[#8D927E] hover:text-[#E76F51] hover:bg-[#FDF0EB] transition"
                      title="ลบสมาชิก"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
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
