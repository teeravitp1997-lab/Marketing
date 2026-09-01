import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getDatabase, 
  ref, 
  onValue, 
  set, 
  Database,
  Unsubscribe 
} from 'firebase/database';
import { TaskItem, AssetLink, CampaignSummary, ActivityLog, FirebaseConfigState, TeamMember } from '../types';
import { INITIAL_TASKS, INITIAL_ASSETS, INITIAL_CAMPAIGN, INITIAL_CAMPAIGNS, INITIAL_ACTIVITY, INITIAL_MEMBERS } from '../data/initialData';

const FIREBASE_CONFIG_STORAGE_KEY = 'mkt_hub_firebase_config';
const LOCAL_TASKS_KEY = 'mkt_hub_tasks';
const LOCAL_ASSETS_KEY = 'mkt_hub_assets';
const LOCAL_CAMPAIGN_KEY = 'mkt_hub_campaign';
const LOCAL_CAMPAIGNS_LIST_KEY = 'mkt_hub_campaigns_list';
const LOCAL_MEMBERS_KEY = 'mkt_hub_members';
const LOCAL_ACTIVITY_KEY = 'mkt_hub_activity';

class FirebaseSyncService {
  private app: FirebaseApp | null = null;
  private db: Database | null = null;
  private unsubscribeTasks: Unsubscribe | null = null;
  private unsubscribeAssets: Unsubscribe | null = null;
  private unsubscribeCampaign: Unsubscribe | null = null;
  private unsubscribeCampaignsList: Unsubscribe | null = null;
  private unsubscribeMembers: Unsubscribe | null = null;
  private unsubscribeActivity: Unsubscribe | null = null;
  private broadcastChannel: BroadcastChannel | null = null;

  public config: FirebaseConfigState = {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    isConfigured: false,
  };

  constructor() {
    this.loadSavedConfig();
    this.initBroadcastChannel();
  }

  private loadSavedConfig() {
    try {
      const saved = localStorage.getItem(FIREBASE_CONFIG_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.databaseURL && parsed.apiKey) {
          this.config = { ...parsed, isConfigured: true };
          this.initFirebase(this.config);
        }
      }
    } catch {
      // Ignore fallback
    }
  }

  private initBroadcastChannel() {
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        this.broadcastChannel = new BroadcastChannel('mkt_hub_sync_channel');
      }
    } catch (e) {
      console.warn('BroadcastChannel not supported or blocked in this context', e);
    }
  }

  public initFirebase(config: FirebaseConfigState): boolean {
    try {
      if (!config.databaseURL) {
        this.config = { ...config, isConfigured: false };
        return false;
      }

      if (getApps().length === 0) {
        this.app = initializeApp(config);
      } else {
        this.app = getApp();
      }

      this.db = getDatabase(this.app, config.databaseURL);
      this.config = { ...config, isConfigured: true };
      localStorage.setItem(FIREBASE_CONFIG_STORAGE_KEY, JSON.stringify(this.config));
      return true;
    } catch (err) {
      console.error('Firebase initialization error:', err);
      this.config.isConfigured = false;
      return false;
    }
  }

  public disconnectFirebase() {
    this.cleanupListeners();
    this.app = null;
    this.db = null;
    this.config.isConfigured = false;
    localStorage.removeItem(FIREBASE_CONFIG_STORAGE_KEY);
  }

  private cleanupListeners() {
    if (this.unsubscribeTasks) this.unsubscribeTasks();
    if (this.unsubscribeAssets) this.unsubscribeAssets();
    if (this.unsubscribeCampaign) this.unsubscribeCampaign();
    if (this.unsubscribeCampaignsList) this.unsubscribeCampaignsList();
    if (this.unsubscribeMembers) this.unsubscribeMembers();
    if (this.unsubscribeActivity) this.unsubscribeActivity();
  }

  // --- Real-time Listeners ---

  public subscribeToTasks(callback: (tasks: TaskItem[]) => void): () => void {
    if (this.db && this.config.isConfigured) {
      const tasksRef = ref(this.db, 'marketing_hub/tasks');
      this.unsubscribeTasks = onValue(tasksRef, (snapshot) => {
        if (snapshot.exists()) {
          const val = snapshot.val();
          const list: TaskItem[] = Array.isArray(val) ? val.filter(Boolean) : Object.values(val);
          callback(list);
        } else {
          this.seedInitialTasks();
          callback(INITIAL_TASKS);
        }
      }, (error) => {
        console.warn('Firebase RTDB read error, falling back to local store:', error);
        callback(this.getLocalTasks());
      });

      return () => {
        if (this.unsubscribeTasks) this.unsubscribeTasks();
      };
    } else {
      callback(this.getLocalTasks());

      const handleStorage = (e: StorageEvent) => {
        if (e.key === LOCAL_TASKS_KEY && e.newValue) {
          try {
            callback(JSON.parse(e.newValue));
          } catch { /* ignore */ }
        }
      };

      const handleBroadcast = (event: MessageEvent) => {
        if (event.data?.type === 'TASKS_UPDATED') {
          callback(event.data.payload);
        }
      };

      window.addEventListener('storage', handleStorage);
      if (this.broadcastChannel) {
        this.broadcastChannel.addEventListener('message', handleBroadcast);
      }

      return () => {
        window.removeEventListener('storage', handleStorage);
        if (this.broadcastChannel) {
          this.broadcastChannel.removeEventListener('message', handleBroadcast);
        }
      };
    }
  }

  public subscribeToAssets(callback: (assets: AssetLink[]) => void): () => void {
    if (this.db && this.config.isConfigured) {
      const assetsRef = ref(this.db, 'marketing_hub/assets');
      this.unsubscribeAssets = onValue(assetsRef, (snapshot) => {
        if (snapshot.exists()) {
          const val = snapshot.val();
          const list: AssetLink[] = Array.isArray(val) ? val.filter(Boolean) : Object.values(val);
          callback(list);
        } else {
          this.seedInitialAssets();
          callback(INITIAL_ASSETS);
        }
      }, (error) => {
        console.warn('Firebase RTDB assets read error:', error);
        callback(this.getLocalAssets());
      });

      return () => {
        if (this.unsubscribeAssets) this.unsubscribeAssets();
      };
    } else {
      callback(this.getLocalAssets());

      const handleStorage = (e: StorageEvent) => {
        if (e.key === LOCAL_ASSETS_KEY && e.newValue) {
          try {
            callback(JSON.parse(e.newValue));
          } catch { /* ignore */ }
        }
      };

      const handleBroadcast = (event: MessageEvent) => {
        if (event.data?.type === 'ASSETS_UPDATED') {
          callback(event.data.payload);
        }
      };

      window.addEventListener('storage', handleStorage);
      if (this.broadcastChannel) {
        this.broadcastChannel.addEventListener('message', handleBroadcast);
      }

      return () => {
        window.removeEventListener('storage', handleStorage);
        if (this.broadcastChannel) {
          this.broadcastChannel.removeEventListener('message', handleBroadcast);
        }
      };
    }
  }

  public subscribeToCampaign(callback: (campaign: CampaignSummary) => void): () => void {
    if (this.db && this.config.isConfigured) {
      const campaignRef = ref(this.db, 'marketing_hub/campaign');
      this.unsubscribeCampaign = onValue(campaignRef, (snapshot) => {
        if (snapshot.exists()) {
          callback(snapshot.val());
        } else {
          this.seedInitialCampaign();
          callback(INITIAL_CAMPAIGN);
        }
      });

      return () => {
        if (this.unsubscribeCampaign) this.unsubscribeCampaign();
      };
    } else {
      callback(this.getLocalCampaign());

      const handleBroadcast = (event: MessageEvent) => {
        if (event.data?.type === 'CAMPAIGN_UPDATED') {
          callback(event.data.payload);
        }
      };

      if (this.broadcastChannel) {
        this.broadcastChannel.addEventListener('message', handleBroadcast);
      }

      return () => {
        if (this.broadcastChannel) {
          this.broadcastChannel.removeEventListener('message', handleBroadcast);
        }
      };
    }
  }

  public subscribeToCampaignsList(callback: (campaigns: CampaignSummary[]) => void): () => void {
    if (this.db && this.config.isConfigured) {
      const campsRef = ref(this.db, 'marketing_hub/campaigns_list');
      this.unsubscribeCampaignsList = onValue(campsRef, (snapshot) => {
        if (snapshot.exists()) {
          const val = snapshot.val();
          const list: CampaignSummary[] = Array.isArray(val) ? val.filter(Boolean) : Object.values(val);
          callback(list);
        } else {
          this.saveCampaignsList(INITIAL_CAMPAIGNS);
          callback(INITIAL_CAMPAIGNS);
        }
      });

      return () => {
        if (this.unsubscribeCampaignsList) this.unsubscribeCampaignsList();
      };
    } else {
      callback(this.getLocalCampaignsList());

      const handleBroadcast = (event: MessageEvent) => {
        if (event.data?.type === 'CAMPAIGNS_LIST_UPDATED') {
          callback(event.data.payload);
        }
      };

      if (this.broadcastChannel) {
        this.broadcastChannel.addEventListener('message', handleBroadcast);
      }

      return () => {
        if (this.broadcastChannel) {
          this.broadcastChannel.removeEventListener('message', handleBroadcast);
        }
      };
    }
  }

  public subscribeToMembers(callback: (members: TeamMember[]) => void): () => void {
    if (this.db && this.config.isConfigured) {
      const membersRef = ref(this.db, 'marketing_hub/members');
      this.unsubscribeMembers = onValue(membersRef, (snapshot) => {
        if (snapshot.exists()) {
          const val = snapshot.val();
          const list: TeamMember[] = Array.isArray(val) ? val.filter(Boolean) : Object.values(val);
          callback(list);
        } else {
          this.saveMembers(INITIAL_MEMBERS);
          callback(INITIAL_MEMBERS);
        }
      });

      return () => {
        if (this.unsubscribeMembers) this.unsubscribeMembers();
      };
    } else {
      callback(this.getLocalMembers());

      const handleBroadcast = (event: MessageEvent) => {
        if (event.data?.type === 'MEMBERS_UPDATED') {
          callback(event.data.payload);
        }
      };

      if (this.broadcastChannel) {
        this.broadcastChannel.addEventListener('message', handleBroadcast);
      }

      return () => {
        if (this.broadcastChannel) {
          this.broadcastChannel.removeEventListener('message', handleBroadcast);
        }
      };
    }
  }

  public subscribeToActivity(callback: (logs: ActivityLog[]) => void): () => void {
    if (this.db && this.config.isConfigured) {
      const actRef = ref(this.db, 'marketing_hub/activity');
      this.unsubscribeActivity = onValue(actRef, (snapshot) => {
        if (snapshot.exists()) {
          const val = snapshot.val();
          const list: ActivityLog[] = Array.isArray(val) ? val.filter(Boolean) : Object.values(val);
          callback(list.sort((a, b) => b.timestamp - a.timestamp));
        } else {
          this.seedInitialActivity();
          callback(INITIAL_ACTIVITY);
        }
      });

      return () => {
        if (this.unsubscribeActivity) this.unsubscribeActivity();
      };
    } else {
      callback(this.getLocalActivity());

      const handleBroadcast = (event: MessageEvent) => {
        if (event.data?.type === 'ACTIVITY_UPDATED') {
          callback(event.data.payload);
        }
      };

      if (this.broadcastChannel) {
        this.broadcastChannel.addEventListener('message', handleBroadcast);
      }

      return () => {
        if (this.broadcastChannel) {
          this.broadcastChannel.removeEventListener('message', handleBroadcast);
        }
      };
    }
  }

  // --- Mutation Actions ---

  public async saveTasks(tasks: TaskItem[], updatedBy = 'ทีมการตลาด', actionName?: string) {
    if (this.db && this.config.isConfigured) {
      try {
        const tasksRef = ref(this.db, 'marketing_hub/tasks');
        await set(tasksRef, tasks);
      } catch (err) {
        console.error('Firebase saveTasks error:', err);
      }
    }

    // Always keep local updated
    localStorage.setItem(LOCAL_TASKS_KEY, JSON.stringify(tasks));
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage({ type: 'TASKS_UPDATED', payload: tasks });
    }

    if (actionName) {
      this.logActivity({
        id: 'act-' + Date.now(),
        timestamp: Date.now(),
        userName: updatedBy,
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        action: 'update',
        targetType: 'task',
        targetTitle: actionName,
        details: 'แก้ไขข้อมูลงานแบบ Real-time',
      });
    }
  }

  public async saveAssets(assets: AssetLink[], updatedBy = 'ทีมการตลาด', actionName?: string) {
    if (this.db && this.config.isConfigured) {
      try {
        const assetsRef = ref(this.db, 'marketing_hub/assets');
        await set(assetsRef, assets);
      } catch (err) {
        console.error('Firebase saveAssets error:', err);
      }
    }

    localStorage.setItem(LOCAL_ASSETS_KEY, JSON.stringify(assets));
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage({ type: 'ASSETS_UPDATED', payload: assets });
    }

    if (actionName) {
      this.logActivity({
        id: 'act-' + Date.now(),
        timestamp: Date.now(),
        userName: updatedBy,
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        action: 'update',
        targetType: 'asset',
        targetTitle: actionName,
        details: 'อัปเดตชิ้นงานใน Shared Asset Library',
      });
    }
  }

  public async saveCampaign(campaign: CampaignSummary, updatedBy = 'Marketing Lead') {
    if (this.db && this.config.isConfigured) {
      try {
        const campRef = ref(this.db, 'marketing_hub/campaign');
        await set(campRef, campaign);
      } catch (err) {
        console.error('Firebase saveCampaign error:', err);
      }
    }

    localStorage.setItem(LOCAL_CAMPAIGN_KEY, JSON.stringify(campaign));
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage({ type: 'CAMPAIGN_UPDATED', payload: campaign });
    }
  }

  public async saveCampaignsList(campaigns: CampaignSummary[]) {
    if (this.db && this.config.isConfigured) {
      try {
        const campsRef = ref(this.db, 'marketing_hub/campaigns_list');
        await set(campsRef, campaigns);
      } catch (err) {
        console.error('Firebase saveCampaignsList error:', err);
      }
    }

    localStorage.setItem(LOCAL_CAMPAIGNS_LIST_KEY, JSON.stringify(campaigns));
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage({ type: 'CAMPAIGNS_LIST_UPDATED', payload: campaigns });
    }
  }

  public async saveMembers(members: TeamMember[]) {
    if (this.db && this.config.isConfigured) {
      try {
        const membersRef = ref(this.db, 'marketing_hub/members');
        await set(membersRef, members);
      } catch (err) {
        console.error('Firebase saveMembers error:', err);
      }
    }

    localStorage.setItem(LOCAL_MEMBERS_KEY, JSON.stringify(members));
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage({ type: 'MEMBERS_UPDATED', payload: members });
    }
  }

  public async logActivity(log: ActivityLog) {
    const current = this.getLocalActivity();
    const updated = [log, ...current].slice(0, 50);

    if (this.db && this.config.isConfigured) {
      try {
        const actRef = ref(this.db, 'marketing_hub/activity');
        await set(actRef, updated);
      } catch (err) {
        console.error('Firebase logActivity error:', err);
      }
    }

    localStorage.setItem(LOCAL_ACTIVITY_KEY, JSON.stringify(updated));
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage({ type: 'ACTIVITY_UPDATED', payload: updated });
    }
  }

  public async deleteActivity(activityId: string) {
    const current = this.getLocalActivity();
    const updated = current.filter(a => a.id !== activityId);
    await this.saveActivityList(updated);
  }

  public async clearActivity() {
    await this.saveActivityList([]);
  }

  public async resetToDefaults() {
    await this.saveTasks(INITIAL_TASKS, 'Admin', 'รีเซ็ตข้อมูลตัวอย่างทั้งหมด');
    await this.saveAssets(INITIAL_ASSETS, 'Admin', 'รีเซ็ตคลังชิ้นงาน');
    await this.saveCampaign(INITIAL_CAMPAIGN, 'Admin');
    await this.saveCampaignsList(INITIAL_CAMPAIGNS);
    await this.saveMembers(INITIAL_MEMBERS);
    await this.saveActivityList(INITIAL_ACTIVITY);
  }

  public async clearAllData() {
    await this.saveTasks([], 'Admin', 'ล้างข้อมูลงานทั้งหมด');
    await this.saveAssets([], 'Admin', 'ล้างคลังชิ้นงานทั้งหมด');
    await this.saveCampaign({
      id: 'cmp-blank',
      name: 'แคมเปญใหม่ (New Campaign)',
      status: 'planning',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      totalBudget: 0,
      allocatedBudget: 0,
      spentBudget: 0,
    }, 'Admin');
    await this.saveCampaignsList([]);
    await this.saveActivityList([]);
  }

  private async saveActivityList(list: ActivityLog[]) {
    if (this.db && this.config.isConfigured) {
      const actRef = ref(this.db, 'marketing_hub/activity');
      await set(actRef, list);
    }
    localStorage.setItem(LOCAL_ACTIVITY_KEY, JSON.stringify(list));
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage({ type: 'ACTIVITY_UPDATED', payload: list });
    }
  }

  // --- Seed Helpers ---
  private seedInitialTasks() {
    this.saveTasks(INITIAL_TASKS);
  }

  private seedInitialAssets() {
    this.saveAssets(INITIAL_ASSETS);
  }

  private seedInitialCampaign() {
    this.saveCampaign(INITIAL_CAMPAIGN);
  }

  private seedInitialActivity() {
    this.saveActivityList(INITIAL_ACTIVITY);
  }

  // --- Local Getters ---
  private getLocalTasks(): TaskItem[] {
    try {
      const saved = localStorage.getItem(LOCAL_TASKS_KEY);
      if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return INITIAL_TASKS;
  }

  private getLocalAssets(): AssetLink[] {
    try {
      const saved = localStorage.getItem(LOCAL_ASSETS_KEY);
      if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return INITIAL_ASSETS;
  }

  private getLocalCampaign(): CampaignSummary {
    try {
      const saved = localStorage.getItem(LOCAL_CAMPAIGN_KEY);
      if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return INITIAL_CAMPAIGN;
  }

  private getLocalCampaignsList(): CampaignSummary[] {
    try {
      const saved = localStorage.getItem(LOCAL_CAMPAIGNS_LIST_KEY);
      if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return INITIAL_CAMPAIGNS;
  }

  public getLocalMembers(): TeamMember[] {
    try {
      const saved = localStorage.getItem(LOCAL_MEMBERS_KEY);
      if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return INITIAL_MEMBERS;
  }

  private getLocalActivity(): ActivityLog[] {
    try {
      const saved = localStorage.getItem(LOCAL_ACTIVITY_KEY);
      if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return INITIAL_ACTIVITY;
  }
}

export const firebaseService = new FirebaseSyncService();

