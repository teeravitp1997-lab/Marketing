/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  TaskItem, 
  AssetLink, 
  CampaignSummary, 
  ActivityLog, 
  TeamRole, 
  TaskStatus, 
  CollaboratorPresence,
  TeamMember
} from './types';
import { firebaseService } from './services/firebaseService';
import { Header } from './components/Header';
import { DashboardOverview } from './components/DashboardOverview';
import { TaskBoard } from './components/TaskBoard';
import { AssetLibrary } from './components/AssetLibrary';
import { TaskModal } from './components/TaskModal';
import { CampaignModal } from './components/CampaignModal';
import { TeamMembersModal } from './components/TeamMembersModal';
import { FirebaseSettingsModal } from './components/FirebaseSettingsModal';
import { CodeExportModal } from './components/CodeExportModal';
import { ActivityFeedModal } from './components/ActivityFeedModal';
import { INITIAL_TASKS, INITIAL_ASSETS, INITIAL_CAMPAIGN, INITIAL_CAMPAIGNS, INITIAL_ACTIVITY, INITIAL_MEMBERS } from './data/initialData';

export default function App() {
  // State
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [assets, setAssets] = useState<AssetLink[]>(INITIAL_ASSETS);
  const [campaign, setCampaign] = useState<CampaignSummary>(INITIAL_CAMPAIGN);
  const [campaignsList, setCampaignsList] = useState<CampaignSummary[]>(INITIAL_CAMPAIGNS);
  const [members, setMembers] = useState<TeamMember[]>(INITIAL_MEMBERS);
  const [activities, setActivities] = useState<ActivityLog[]>(INITIAL_ACTIVITY);

  // Filters & Views
  const [activeRole, setActiveRole] = useState<TeamRole>('all');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');

  // Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [taskModalDefaultRole, setTaskModalDefaultRole] = useState<TeamRole>('offline');

  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

  const [isFirebaseLive, setIsFirebaseLive] = useState(firebaseService.config.isConfigured);

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubTasks = firebaseService.subscribeToTasks((newTasks) => {
      setTasks(newTasks);
    });

    const unsubAssets = firebaseService.subscribeToAssets((newAssets) => {
      setAssets(newAssets);
    });

    const unsubCampaign = firebaseService.subscribeToCampaign((newCamp) => {
      setCampaign(newCamp);
    });

    const unsubCampaignsList = firebaseService.subscribeToCampaignsList((newList) => {
      setCampaignsList(newList);
    });

    const unsubMembers = firebaseService.subscribeToMembers((newMembers) => {
      setMembers(newMembers);
    });

    const unsubActivity = firebaseService.subscribeToActivity((newActs) => {
      setActivities(newActs);
    });

    setIsFirebaseLive(firebaseService.config.isConfigured);

    return () => {
      unsubTasks();
      unsubAssets();
      unsubCampaign();
      unsubCampaignsList();
      unsubMembers();
      unsubActivity();
    };
  }, [isFirebaseLive]);

  // Handlers for Tasks
  const handleOpenNewTaskModal = (task?: TaskItem, defaultRole: TeamRole = 'offline') => {
    if (task) {
      setEditingTask(task);
    } else {
      setEditingTask(null);
      setTaskModalDefaultRole(defaultRole);
    }
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (taskToSave: TaskItem) => {
    const existingIndex = tasks.findIndex(t => t.id === taskToSave.id);
    let updatedTasks: TaskItem[];
    let actionDetail = '';

    if (existingIndex >= 0) {
      updatedTasks = [...tasks];
      updatedTasks[existingIndex] = taskToSave;
      actionDetail = `แก้ไขงาน "${taskToSave.title}" (${taskToSave.role})`;
    } else {
      updatedTasks = [taskToSave, ...tasks];
      actionDetail = `สร้างงานใหม่ "${taskToSave.title}" (${taskToSave.role})`;
    }

    setTasks(updatedTasks);
    firebaseService.saveTasks(updatedTasks, taskToSave.assignee?.name || 'ทีมงาน', actionDetail);
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    const target = tasks.find(t => t.id === taskId);
    if (!target) return;

    const updatedTasks = tasks.map(t => 
      t.id === taskId 
        ? { ...t, status: newStatus, updatedAt: Date.now() } 
        : t
    );

    const statusLabels: Record<TaskStatus, string> = {
      todo: 'To Do',
      in_progress: 'In Progress',
      review: 'Review',
      done: 'Done',
    };

    setTasks(updatedTasks);
    firebaseService.saveTasks(
      updatedTasks, 
      target.assignee?.name || 'ทีมงาน', 
      `ย้ายสถานะงาน "${target.title}" เป็น ${statusLabels[newStatus]}`
    );
  };

  const handleDeleteTask = (taskId: string) => {
    const target = tasks.find(t => t.id === taskId);
    const updatedTasks = tasks.filter(t => t.id !== taskId);
    setTasks(updatedTasks);
    firebaseService.saveTasks(
      updatedTasks, 
      'Admin', 
      `ลบงาน "${target ? target.title : taskId}"`
    );
  };

  // Handlers for Assets
  const handleSaveAssets = (updatedAssets: AssetLink[], actionName?: string) => {
    setAssets(updatedAssets);
    firebaseService.saveAssets(updatedAssets, 'ทีมงาน', actionName);
  };

  // Handlers for Campaign
  const handleUpdateCampaign = (updatedCampaign: CampaignSummary) => {
    setCampaign(updatedCampaign);
    firebaseService.saveCampaign(updatedCampaign, 'Marketing Lead');
    
    // Also update in campaigns list
    const updatedList = campaignsList.map(c => c.id === updatedCampaign.id ? updatedCampaign : c);
    setCampaignsList(updatedList);
    firebaseService.saveCampaignsList(updatedList);
  };

  const handleSelectCampaign = (selected: CampaignSummary) => {
    setCampaign(selected);
    firebaseService.saveCampaign(selected, 'Marketing Lead');
  };

  const handleSaveCampaignsList = (updatedList: CampaignSummary[], actionName?: string) => {
    setCampaignsList(updatedList);
    firebaseService.saveCampaignsList(updatedList);
    if (actionName) {
      firebaseService.logActivity({
        id: 'act-' + Date.now(),
        timestamp: Date.now(),
        userName: 'Marketing Lead',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        action: 'update',
        targetType: 'config',
        targetTitle: actionName,
        details: 'จัดการแคมเปญการตลาด',
      });
    }
  };

  // Handlers for Members
  const handleSaveMembers = (updatedMembers: TeamMember[], actionName?: string) => {
    setMembers(updatedMembers);
    firebaseService.saveMembers(updatedMembers);
    if (actionName) {
      firebaseService.logActivity({
        id: 'act-' + Date.now(),
        timestamp: Date.now(),
        userName: 'Admin',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        action: 'update',
        targetType: 'config',
        targetTitle: actionName,
        details: 'จัดการรายชื่อสมาชิกทีม',
      });
    }
  };

  // Activity Handlers
  const handleDeleteActivity = (id: string) => {
    firebaseService.deleteActivity(id);
  };

  const handleClearActivity = () => {
    firebaseService.clearActivity();
  };

  // Reset & Clear handlers
  const handleResetToDefaults = () => {
    firebaseService.resetToDefaults();
    setTasks(INITIAL_TASKS);
    setAssets(INITIAL_ASSETS);
    setCampaign(INITIAL_CAMPAIGN);
    setCampaignsList(INITIAL_CAMPAIGNS);
    setMembers(INITIAL_MEMBERS);
    setActivities(INITIAL_ACTIVITY);
  };

  const handleClearAllData = () => {
    firebaseService.clearAllData();
    setTasks([]);
    setAssets([]);
    setActivities([]);
    setCampaignsList([]);
  };

  return (
    <div className="min-h-screen bg-[#FDFCF7] text-[#3D4034] flex flex-col antialiased">
      
      {/* Top Header Navigation */}
      <Header
        activeRole={activeRole}
        onRoleChange={setActiveRole}
        isFirebaseLive={isFirebaseLive}
        onOpenTaskModal={() => handleOpenNewTaskModal(undefined, activeRole === 'all' ? 'offline' : activeRole)}
        onOpenConfigModal={() => setIsConfigModalOpen(true)}
        onOpenCodeModal={() => setIsCodeModalOpen(true)}
        onOpenActivityModal={() => setIsActivityModalOpen(true)}
        onOpenMembersModal={() => setIsMembersModalOpen(true)}
        activeCollaborators={members}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* 1. Dashboard Overview: Campaign & Status & Budget */}
        <DashboardOverview
          campaign={campaign}
          campaignsList={campaignsList}
          tasks={tasks}
          onUpdateCampaign={handleUpdateCampaign}
          onSelectCampaign={handleSelectCampaign}
          onOpenCampaignManager={() => setIsCampaignModalOpen(true)}
          onFilterStatus={setStatusFilter}
          activeStatusFilter={statusFilter}
        />

        {/* 2. Task & Brief System (Real-time Kanban & List) */}
        <TaskBoard
          tasks={tasks}
          activeRole={activeRole}
          onRoleChange={setActiveRole}
          onOpenTaskModal={handleOpenNewTaskModal}
          onUpdateTaskStatus={handleUpdateTaskStatus}
          onDeleteTask={handleDeleteTask}
          selectedStatusFilter={statusFilter}
        />

        {/* 3. Shared Asset Library */}
        <AssetLibrary
          assets={assets}
          onSaveAssets={handleSaveAssets}
        />

      </main>

      {/* Footer */}
      <footer className="border-t border-[#E8E2D2] bg-[#F5F2EA]/90 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6B705C]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#344E41]">Marketing Collaboration Hub</span>
            <span>·</span>
            <span>Real-time Workspace for Offline, Online, and Graphic Teams</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMembersModalOpen(true)}
              className="text-[#588157] hover:text-[#344E41] hover:underline font-medium"
            >
              จัดการสมาชิก ({members.length})
            </button>
            <span>·</span>
            <button
              onClick={() => setIsCampaignModalOpen(true)}
              className="text-[#588157] hover:text-[#344E41] hover:underline font-medium"
            >
              จัดการแคมเปญ ({campaignsList.length})
            </button>
            <span>·</span>
            <button
              onClick={() => setIsCodeModalOpen(true)}
              className="text-[#588157] hover:text-[#344E41] hover:underline font-medium"
            >
              ดูโค้ด Single-File HTML
            </button>
            <span>·</span>
            <button
              onClick={() => setIsConfigModalOpen(true)}
              className="text-[#B8860B] hover:text-[#8C6514] hover:underline font-medium"
            >
              ตั้งค่า Firebase
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        task={editingTask}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        defaultRole={taskModalDefaultRole}
        members={members}
      />

      <CampaignModal
        isOpen={isCampaignModalOpen}
        onClose={() => setIsCampaignModalOpen(false)}
        campaigns={campaignsList}
        activeCampaignId={campaign.id}
        onSelectCampaign={handleSelectCampaign}
        onSaveCampaignsList={handleSaveCampaignsList}
      />

      <TeamMembersModal
        isOpen={isMembersModalOpen}
        onClose={() => setIsMembersModalOpen(false)}
        members={members}
        onSaveMembers={handleSaveMembers}
      />

      <FirebaseSettingsModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        onConfigUpdated={() => setIsFirebaseLive(firebaseService.config.isConfigured)}
        onResetData={handleResetToDefaults}
        onClearAllData={handleClearAllData}
      />

      <CodeExportModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
      />

      <ActivityFeedModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        activities={activities}
        onDeleteActivity={handleDeleteActivity}
        onClearAllActivity={handleClearActivity}
      />

    </div>
  );
}
