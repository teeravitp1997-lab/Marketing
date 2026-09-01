export type TeamRole = 'all' | 'offline' | 'online' | 'graphic';

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  role: 'offline' | 'online' | 'graphic';
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
  
  // Specific fields for Graphic / Briefs
  version?: string; // e.g. "v1.0", "v2.1 (Revised)", "vFinal"
  figmaUrl?: string;
  driveUrl?: string;
  reviewNotes?: string;
  
  // Specific fields for Offline
  eventLocation?: string;
  printSpecs?: string;
  
  // Specific fields for Online
  platform?: 'Meta Ads' | 'Google Ads' | 'TikTok Ads' | 'SEO/Blog' | 'KOL/Influencer' | 'Email' | 'Other';
  targetKpi?: string;

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

