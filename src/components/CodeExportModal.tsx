import React, { useState } from 'react';
import { 
  X, 
  Code2, 
  Copy, 
  Check, 
  Download, 
  FileCode, 
  Sparkles, 
  Layers,
  ExternalLink
} from 'lucide-react';
import { generateStandaloneHtml } from '../services/standaloneHtmlGenerator';

interface CodeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodeExportModal: React.FC<CodeExportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const htmlCode = generateStandaloneHtml();

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(htmlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([htmlCode], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'marketing-collaboration-hub.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#3D4034]/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FDFCF7] border border-[#E8E2D2] rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl my-6 flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E8E2D2] flex items-center justify-between bg-white flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#EDF3EB] border border-[#C5DCB7] flex items-center justify-center">
              <Code2 className="w-4 h-4 text-[#588157]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#344E41] flex items-center gap-2">
                โค้ด Single-File HTML (ฉบับเต็มสมบูรณ์ไม่มีตัดทอน)
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EDF3EB] text-[#2D5A34] border border-[#C5DCB7] font-medium">
                  CDN Ready
                </span>
              </h3>
              <p className="text-[11px] text-[#6B705C]">
                รวม HTML + Tailwind CSS (CDN) + Firebase Realtime Database SDK v9+ CDN ในไฟล์เดียว
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#588157] hover:bg-[#476B46] text-white shadow-md shadow-[#588157]/20 transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>คัดลอกโค้ดสำเร็จ!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>คัดลอก HTML ทั้งหมด</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white hover:bg-[#F5F2EA] text-[#3D4034] border border-[#D9D0BE] transition"
              title="ดาวน์โหลดเป็นไฟล์ .html"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ดาวน์โหลดไฟล์ .html</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#6B705C] hover:text-[#3D4034] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-[#F5F2EA] px-6 py-2.5 border-b border-[#E8E2D2] flex items-center justify-between text-xs text-[#6B705C] flex-shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#B8860B]" />
            <span>สามารถเปิดไฟล์ <code className="text-[#344E41] font-mono bg-white px-1 py-0.5 rounded border border-[#D9D0BE]">.html</code> นี้ในเบราว์เซอร์ได้ทันทีโดยไม่ต้องติดตั้ง node_modules เพิ่มเติม</span>
          </div>
          <span className="font-mono text-[11px] text-[#8D927E] hidden sm:block">
            {htmlCode.length.toLocaleString()} ตัวอักษร
          </span>
        </div>

        {/* Code Editor Preview */}
        <div className="flex-1 p-4 overflow-y-auto bg-[#313329] font-mono text-xs text-[#E8E2D2] custom-scrollbar select-text leading-relaxed">
          <pre className="whitespace-pre overflow-x-auto p-2">
            <code>{htmlCode}</code>
          </pre>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#E8E2D2] bg-[#F5F2EA] flex items-center justify-between text-xs text-[#6B705C] flex-shrink-0">
          <span>สร้างขึ้นตามข้อกำหนด: HTML, Tailwind CSS CDN, Firebase Realtime Database SDK v9+ CDN</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white border border-[#D9D0BE] text-[#3D4034] hover:bg-[#EAE5D9] text-xs font-medium transition"
          >
            ปิดหน้าต่าง
          </button>
        </div>

      </div>
    </div>
  );
};
