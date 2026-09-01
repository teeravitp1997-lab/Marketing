import React, { useState } from 'react';
import { 
  X, 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink, 
  Wifi, 
  WifiOff,
  Sparkles,
  Layers,
  Key,
  Globe
} from 'lucide-react';
import { FirebaseConfigState } from '../types';
import { firebaseService } from '../services/firebaseService';

interface FirebaseSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigUpdated: () => void;
  onResetData: () => void;
  onClearAllData?: () => void;
}

export const FirebaseSettingsModal: React.FC<FirebaseSettingsModalProps> = ({
  isOpen,
  onClose,
  onConfigUpdated,
  onResetData,
  onClearAllData,
}) => {
  const currentConfig = firebaseService.config;
  const [databaseURL, setDatabaseURL] = useState(currentConfig.databaseURL || '');
  const [apiKey, setApiKey] = useState(currentConfig.apiKey || '');
  const [projectId, setProjectId] = useState(currentConfig.projectId || '');
  const [appId, setAppId] = useState(currentConfig.appId || '');
  const [authDomain, setAuthDomain] = useState(currentConfig.authDomain || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!databaseURL.trim()) {
      alert('กรุณากรอก Firebase Database URL');
      return;
    }

    const newConfig: FirebaseConfigState = {
      apiKey: apiKey.trim(),
      authDomain: authDomain.trim(),
      databaseURL: databaseURL.trim(),
      projectId: projectId.trim(),
      storageBucket: '',
      messagingSenderId: '',
      appId: appId.trim(),
      isConfigured: true,
    };

    const success = firebaseService.initFirebase(newConfig);
    if (success) {
      setSaveSuccess(true);
      onConfigUpdated();
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 1200);
    }
  };

  const handleDisconnect = () => {
    firebaseService.disconnectFirebase();
    setDatabaseURL('');
    setApiKey('');
    setProjectId('');
    onConfigUpdated();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#3D4034]/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FDFCF7] border border-[#E8E2D2] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl my-8">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E8E2D2] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FEF8E7] border border-[#EEDFB4] flex items-center justify-center">
              <Database className="w-4 h-4 text-[#B8860B]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#344E41]">
                ตั้งค่า Firebase Realtime Database
              </h3>
              <p className="text-[11px] text-[#6B705C]">
                สำหรับเชื่อมต่อให้ทุกคนที่มีลิงก์เว็บนี้ ซิงค์ข้อมูลพร้อมกันแบบ Real-time
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
          
          {/* Status Banner */}
          <div className={`p-3.5 rounded-xl border flex items-start gap-3 text-xs ${
            currentConfig.isConfigured
              ? 'bg-[#EDF3EB] border-[#C5DCB7] text-[#2D5A34]'
              : 'bg-[#FEF8E7] border-[#EEDFB4] text-[#8C6514]'
          }`}>
            {currentConfig.isConfigured ? (
              <Wifi className="w-5 h-5 text-[#588157] flex-shrink-0 mt-0.5" />
            ) : (
              <Sparkles className="w-5 h-5 text-[#B8860B] flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-semibold text-[#344E41]">
                {currentConfig.isConfigured
                  ? 'สถานะ: เชื่อมต่อ Firebase Realtime Database แล้ว'
                  : 'สถานะ: ซิงค์ผ่าน Real-time Local Broadcast Channel (พร้อมใช้งานทันที)'}
              </p>
              <p className="mt-1 text-[#6B705C] leading-relaxed text-[11px]">
                {currentConfig.isConfigured
                  ? `กำลังรับส่งข้อมูลกับ ${currentConfig.databaseURL}`
                  : 'คุณสามารถทดสอบเปิด 2 แท็บเบราว์เซอร์พร้อมกันเพื่อดูการอัปเดตแบบเรียลไทม์ได้ทันที หรือใส่ Firebase Config ด้านล่างเพื่อเชื่อมต่อ Cloud'}
              </p>
            </div>
          </div>

          {/* Quick Guide */}
          <div className="p-3 bg-white border border-[#E8E2D2] rounded-xl space-y-1.5 text-xs text-[#3D4034]">
            <div className="font-semibold text-[#344E41] flex items-center justify-between">
              <span>วิธีเปิดใช้งาน Firebase Realtime Database (3 ขั้นตอน):</span>
              <a
                href="https://console.firebase.google.com"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-[#588157] hover:underline flex items-center gap-1 font-medium"
              >
                ไปที่ Console <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-[#6B705C] text-[11px]">
              <li>สร้างโปรเจกต์ &gt; เมนู <b>Build</b> &gt; <b>Realtime Database</b> &gt; กด Create Database</li>
              <li>เลือกแท็บ <b>Rules</b> แล้วตั้งค่า <code className="bg-[#F5F2EA] text-[#B8860B] px-1 py-0.5 rounded font-mono border border-[#E8E2D2]">".read": true, ".write": true</code></li>
              <li>คัดลอก <b>Database URL</b> (เช่น <code className="text-[#588157]">https://your-app-default-rtdb.firebaseio.com</code>) และ API Key มาวางด้านล่าง</li>
            </ol>
          </div>

          <form onSubmit={handleSave} className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-[#3D4034] mb-1">
                Database URL * (เช่น https://my-project-rtdb.firebaseio.com)
              </label>
              <input
                type="url"
                required
                value={databaseURL}
                onChange={(e) => setDatabaseURL(e.target.value)}
                placeholder="https://your-project-id-default-rtdb.firebaseio.com"
                className="w-full px-3 py-2 bg-white border border-[#D9D0BE] rounded-xl text-xs text-[#3D4034] placeholder-[#A5A58D] focus:outline-none focus:border-[#588157] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3D4034] mb-1">
                API Key (Web API Key)
              </label>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3 py-2 bg-white border border-[#D9D0BE] rounded-xl text-xs text-[#3D4034] placeholder-[#A5A58D] focus:outline-none focus:border-[#588157] font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#3D4034] mb-1">
                  Project ID
                </label>
                <input
                  type="text"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  placeholder="my-marketing-hub"
                  className="w-full px-3 py-2 bg-white border border-[#D9D0BE] rounded-xl text-xs text-[#3D4034] placeholder-[#A5A58D] focus:outline-none focus:border-[#588157] font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#3D4034] mb-1">
                  App ID (ถ้ามี)
                </label>
                <input
                  type="text"
                  value={appId}
                  onChange={(e) => setAppId(e.target.value)}
                  placeholder="1:123456789:web:abcdef"
                  className="w-full px-3 py-2 bg-white border border-[#D9D0BE] rounded-xl text-xs text-[#3D4034] placeholder-[#A5A58D] focus:outline-none focus:border-[#588157] font-mono"
                />
              </div>
            </div>

            {saveSuccess && (
              <div className="p-2.5 bg-[#EDF3EB] border border-[#C5DCB7] text-[#2D5A34] text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#588157]" />
                <span>บันทึกการเชื่อมต่อและเริ่มการซิงค์ข้อมูล Real-time สำเร็จ!</span>
              </div>
            )}

            <div className="pt-4 border-t border-[#E8E2D2] flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('คุณต้องการรีเซ็ตข้อมูลทั้งหมดกลับเป็นค่าเริ่มต้นตัวอย่างใช่หรือไม่?')) {
                      onResetData();
                      onClose();
                    }
                  }}
                  className="flex items-center gap-1 text-[11px] text-[#6B705C] hover:text-[#B8860B] hover:bg-[#F5F2EA] px-2.5 py-1.5 rounded-lg transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>รีเซ็ตข้อมูลตัวอย่าง</span>
                </button>

                {onClearAllData && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('คำเตือน: คุณต้องการล้างงานและชิ้นงานทั้งหมดเพื่อเริ่มต้นใหม่จากศูนย์ใช่หรือไม่?')) {
                        onClearAllData();
                        onClose();
                      }
                    }}
                    className="flex items-center gap-1 text-[11px] text-[#E76F51] hover:bg-[#FDF0EB] px-2.5 py-1.5 rounded-lg transition"
                  >
                    <span>ล้างข้อมูลทั้งหมด</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {currentConfig.isConfigured && (
                  <button
                    type="button"
                    onClick={handleDisconnect}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium text-[#E76F51] hover:bg-[#FDF0EB] border border-[#F5D0C5] transition"
                  >
                    ตัดการเชื่อมต่อ
                  </button>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#588157] hover:bg-[#476B46] text-white shadow-md shadow-[#588157]/20 transition"
                >
                  บันทึกและเชื่อมต่อ
                </button>
              </div>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
};
