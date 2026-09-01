export type TeamRole = 'all' | 'offline' | 'online' | 'graphic';

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type MarketingJobType = 
  | 'graphic_keyvisual'  // กราฟิก Key Visual, Banner & โปสเตอร์
  | 'motion_video'       // วิดีโอสั้น, Motion Graphic & Animation
  | 'packaging_dieline'  // บรรจุภัณฑ์, สติกเกอร์ & งานไดคัท
  | 'brand_ci_design'    // โลโก้, CI & Design System
  | 'spatial_3d_design'  // 3D Render & ออกแบบโครงสร้าง 3 มิติ
  | 'digital_ads'        // สื่อโฆษณาออนไลน์ (Meta, Google, TikTok)
  | 'event_booth'        // งานอีเวนต์, บูธ & กิจกรรมออนกราวด์
  | 'posm_print'         // สื่อหน้าร้าน, ป้าย & งานพิมพ์
  | 'ooh_billboard'      // ป้ายบิลบอร์ด & สื่อนอกบ้าน (OOH)
  | 'kol_influencer'     // KOL, อินฟลูเอนเซอร์ & PR
  | 'content_social'     // คอนเทนต์, วิดีโอ & โซเชียลมีเดีย
  | 'live_commerce'      // ไลฟ์สด & Live Streaming
  | 'promotion_crm'      // โปรโมชั่น, แคมเปญขาย & CRM
  | 'omnichannel'        // แคมเปญผสมผสาน (Omnichannel / O2O)
  | 'other';             // อื่นๆ

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  role: 'offline' | 'online' | 'graphic'; // หน้าที่หลัก
  jobType?: MarketingJobType | string;   // ลักษณะงาน (เลือกได้ร่วมกันทั้ง Offline, Online และ Graphic)
  jobTypeLabel?: string;                 // ชื่อภาษาไทยของลักษณะงาน
  status: TaskStatus;
  priority: TaskPriority;
  assignee: {
    name: string;
    avatar: string;
    roleTitle: string;
  };
  dueDate: string;
  budget?: number;
  spent?: number;
  tags: string[];
  
  // Specific fields for Graphic / Creative Briefs
  version?: string; // e.g. "v1.0", "v2.1 (Revised)", "vFinal"
  figmaUrl?: string;
  driveUrl?: string;
  reviewNotes?: string;
  
  // Shared Marketing Specs (ทั้ง Offline และ Online สามารถเลือกใช้ร่วมกันได้)
  eventLocation?: string; // สถานที่จัดงาน / จุดติดตั้ง / สาขา
  printSpecs?: string;    // สเปคการผลิต / งานพิมพ์ / วัสดุ
  platform?: 'Meta Ads' | 'Google Ads' | 'TikTok Ads' | 'SEO/Blog' | 'KOL/Influencer' | 'Email' | 'Billboard/OOH' | 'Store/Branch' | 'Event/Venue' | 'Other' | string;
  targetKpi?: string;     // เป้าหมาย KPI (ยอดขาย, ROAS, Foot traffic, Reach)

  createdAt: number;
  updatedAt: number;
  updatedBy: string;
}

export interface AssetLink {
  id: string;
  title: string;
  category: 'brand_guideline' | 'offline_print' | 'online_ads' | 'graphic_template' | 'footage_photo';
  url: string;
  provider: 'Figma' | 'Google Drive' | 'Dropbox' | 'Canva' | 'OneDrive' | 'Other';
  description?: string;
  fileType?: string;
  updatedAt: number;
  updatedBy: string;
}

export interface CampaignSummary {
  id: string;
  name: string;
  status: 'planning' | 'active' | 'completed';
  startDate: string;
  endDate: string;
  totalBudget: number;
  allocatedBudget: number;
  spentBudget: number;
}

export interface ActivityLog {
  id: string;
  timestamp: number;
  userName: string;
  userAvatar: string;
  action: 'create' | 'update' | 'delete' | 'status_change' | 'config';
  targetType: 'task' | 'asset' | 'config';
  targetTitle: string;
  details?: string;
}

export interface FirebaseConfigState {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  isConfigured: boolean;
}

export interface CollaboratorPresence {
  id: string;
  name: string;
  avatar: string;
  role: 'offline' | 'online' | 'graphic' | 'lead';
  roleTitle?: string;
  activeTab?: string;
  lastActive: number;
  isOnline: boolean;
}

export type TeamMember = CollaboratorPresence;

