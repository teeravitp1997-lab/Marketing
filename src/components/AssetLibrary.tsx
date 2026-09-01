import React, { useState } from 'react';
import { 
  FolderGit2, 
  Plus, 
  ExternalLink, 
  Copy, 
  Check, 
  Trash2, 
  Edit3,
  Search
} from 'lucide-react';
import { AssetLink } from '../types';

interface AssetLibraryProps {
  assets: AssetLink[];
  onSaveAssets: (assets: AssetLink[], actionName?: string) => void;
}

export const AssetLibrary: React.FC<AssetLibraryProps> = ({
  assets,
  onSaveAssets,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssetId, setEditingAssetId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState<AssetLink['category']>('graphic_template');
  const [provider, setProvider] = useState<AssetLink['provider']>('Figma');
  const [description, setDescription] = useState('');
  const [fileType, setFileType] = useState('');

  const filteredAssets = assets.filter(asset => {
    const matchCategory = selectedCategory === 'all' || asset.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchQuery = !q || 
      asset.title.toLowerCase().includes(q) || 
      (asset.description && asset.description.toLowerCase().includes(q)) ||
      asset.provider.toLowerCase().includes(q);
    return matchCategory && matchQuery;
  });

  const handleCopyLink = (id: string, linkUrl: string) => {
    navigator.clipboard.writeText(linkUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenAdd = () => {
    setEditingAssetId(null);
    setTitle('');
    setUrl('');
    setCategory('graphic_template');
    setProvider('Figma');
    setDescription('');
    setFileType('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (asset: AssetLink) => {
    setEditingAssetId(asset.id);
    setTitle(asset.title);
    setUrl(asset.url);
    setCategory(asset.category);
    setProvider(asset.provider);
    setDescription(asset.description || '');
    setFileType(asset.fileType || '');
    setIsModalOpen(true);
  };

  const handleSaveAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    if (editingAssetId) {
      // Update existing asset
      const updatedList = assets.map(a => {
        if (a.id === editingAssetId) {
          return {
            ...a,
            title: title.trim(),
            url: url.trim(),
            category,
            provider,
            description: description.trim() || undefined,
            fileType: fileType.trim() || undefined,
            updatedAt: Date.now(),
            updatedBy: 'ทีมการตลาด',
          };
        }
        return a;
      });
      onSaveAssets(updatedList, `แก้ไขชิ้นงาน "${title.trim()}"`);
    } else {
      // Add new asset
      const newAsset: AssetLink = {
        id: 'asset-' + Date.now(),
        title: title.trim(),
        url: url.trim(),
        category,
        provider,
        description: description.trim() || undefined,
        fileType: fileType.trim() || undefined,
        updatedAt: Date.now(),
        updatedBy: 'ทีมการตลาด',
      };
      onSaveAssets([newAsset, ...assets], `เพิ่มชิ้นงาน "${newAsset.title}"`);
    }

    setIsModalOpen(false);
    setEditingAssetId(null);
  };

  const handleDeleteAsset = (id: string, assetTitle: string) => {
    if (confirm(`คุณต้องการลบชิ้นงาน "${assetTitle}" ออกจากคลังใช่หรือไม่?`)) {
      const remaining = assets.filter(a => a.id !== id);
      onSaveAssets(remaining, `ลบชิ้นงาน "${assetTitle}"`);
    }
  };

  return (
    <section className="bg-white border border-[#E8E2D2] rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8E2D2]">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#EDF3EB] border border-[#C5DCB7] flex items-center justify-center">
              <FolderGit2 className="w-4 h-4 text-[#588157]" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-[#344E41] tracking-tight">
              Shared Asset Library (คลังไฟล์ & ลิงก์ชิ้นงานสำคัญ)
            </h2>
          </div>
          <p className="text-xs text-[#6B705C] mt-1">
            ศูนย์รวม Brand Guideline, Template, Figma Canvas, และ Google Drive โฟลเดอร์ที่ทุกคนสามารถ เพิ่ม แก้ไข หรือลบร่วมกันได้แบบ Real-time
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#588157] hover:bg-[#476B46] text-white shadow-md shadow-[#588157]/20 transition active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>เพิ่มชิ้นงานใหม่</span>
        </button>
      </div>

      {/* Categories & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 custom-scrollbar">
          {[
            { key: 'all', label: 'ทั้งหมด (All Assets)' },
            { key: 'brand_guideline', label: 'Brand Guidelines' },
            { key: 'graphic_template', label: 'Graphic Templates' },
            { key: 'footage_photo', label: 'Footage & Photos' },
            { key: 'offline_print', label: 'Offline & Media Kit' },
            { key: 'online_ads', label: 'Online Ads & Canva' },
          ].map(cat => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                selectedCategory === cat.key
                  ? 'bg-[#344E41] text-white font-semibold shadow-xs'
                  : 'bg-[#F5F2EA] hover:bg-[#EAE5D9] text-[#3D4034]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-[#8D927E] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาลิงก์ชิ้นงาน..."
            className="w-full pl-8 pr-3 py-1.5 bg-[#FDFCF7] border border-[#D9D0BE] rounded-xl text-xs text-[#3D4034] placeholder-[#A5A58D] focus:outline-none focus:border-[#588157]"
          />
        </div>

      </div>

      {/* Asset Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
        {filteredAssets.length === 0 ? (
          <div className="col-span-full py-12 text-center text-[#8D927E] text-xs border border-dashed border-[#D9D0BE] rounded-2xl bg-[#FDFCF7] flex flex-col items-center justify-center gap-2">
            <FolderGit2 className="w-8 h-8 text-[#A5A58D]" />
            <p>ไม่พบชิ้นงานในหมวดหมู่นี้</p>
            <button
              onClick={handleOpenAdd}
              className="mt-1 px-3 py-1.5 rounded-lg bg-[#588157] text-white text-xs font-medium hover:bg-[#476B46] transition"
            >
              + เพิ่มชิ้นงานแรก
            </button>
          </div>
        ) : (
          filteredAssets.map(asset => (
            <div
              key={asset.id}
              className="bg-[#FDFCF7] border border-[#E8E2D2] hover:border-[#D0DEC9] rounded-xl p-4 flex flex-col justify-between space-y-3 transition shadow-xs hover:shadow-md group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    asset.provider === 'Figma' ? 'bg-[#FDF0EB] text-[#C85A32] border-[#F5D0C5]' :
                    asset.provider === 'Google Drive' ? 'bg-[#EDF3EB] text-[#2D5A34] border-[#C5DCB7]' :
                    asset.provider === 'Canva' ? 'bg-[#FEF8E7] text-[#8C6514] border-[#EEDFB4]' :
                    'bg-[#F5F2EA] text-[#6B705C] border-[#D9D0BE]'
                  }`}>
                    {asset.provider}
                  </span>

                  {asset.fileType && (
                    <span className="text-[10px] text-[#8D927E] font-mono bg-white px-1.5 py-0.5 rounded border border-[#E8E2D2]">
                      {asset.fileType}
                    </span>
                  )}
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-[#344E41] leading-snug group-hover:text-[#588157] transition">
                  {asset.title}
                </h4>

                {asset.description && (
                  <p className="text-[11px] text-[#6B705C] line-clamp-2 mt-1 leading-relaxed">
                    {asset.description}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#E8E2D2] flex items-center justify-between gap-2">
                <button
                  onClick={() => handleCopyLink(asset.id, asset.url)}
                  className="flex items-center gap-1 text-[11px] text-[#6B705C] hover:text-[#3D4034] px-2 py-1 rounded-lg hover:bg-[#F5F2EA] transition"
                  title="คัดลอกลิงก์"
                >
                  {copiedId === asset.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#588157]" />
                      <span className="text-[#588157] font-semibold">คัดลอกแล้ว!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>คัดลอก URL</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1">
                  {/* Edit Asset Button */}
                  <button
                    onClick={() => handleOpenEdit(asset)}
                    className="p-1.5 rounded-lg text-[#6B705C] hover:text-[#344E41] hover:bg-[#EDF3EB] transition"
                    title="แก้ไขข้อมูลชิ้นงานนี้"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete Asset Button */}
                  <button
                    onClick={() => handleDeleteAsset(asset.id, asset.title)}
                    className="p-1.5 rounded-lg text-[#8D927E] hover:text-[#E76F51] hover:bg-[#FDF0EB] transition"
                    title="ลบชิ้นงานนี้"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Open Link Button */}
                  <a
                    href={asset.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#EDF3EB] hover:bg-[#588157] text-[#2D5A34] hover:text-white border border-[#C5DCB7] transition shadow-xs ml-0.5"
                  >
                    <span>เปิดดู</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Asset Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#3D4034]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FDFCF7] border border-[#E8E2D2] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D2]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#EDF3EB] border border-[#C5DCB7] flex items-center justify-center">
                  <FolderGit2 className="w-4 h-4 text-[#588157]" />
                </div>
                <h3 className="text-base font-bold text-[#344E41]">
                  {editingAssetId ? 'แก้ไขข้อมูลชิ้นงาน (Edit Asset)' : 'เพิ่มชิ้นงานใหม่ใน Shared Library'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#6B705C] hover:text-[#3D4034] p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAsset} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-[#3D4034] mb-1">
                  ชื่อชิ้นงาน / ไฟล์ *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="เช่น Master Brand Guideline 2026, Figma Ads Banner"
                  className="w-full px-3 py-2 bg-white border border-[#D9D0BE] rounded-xl text-xs text-[#3D4034] placeholder-[#A5A58D] focus:outline-none focus:border-[#588157]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#3D4034] mb-1">
                  URL ลิงก์ไฟล์งาน *
                </label>
                <input
                  type="url"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://drive.google.com/... หรือ https://figma.com/..."
                  className="w-full px-3 py-2 bg-white border border-[#D9D0BE] rounded-xl text-xs text-[#3D4034] placeholder-[#A5A58D] focus:outline-none focus:border-[#588157]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#3D4034] mb-1">หมวดหมู่</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-[#D9D0BE] rounded-xl text-xs text-[#3D4034] focus:outline-none focus:border-[#588157]"
                  >
                    <option value="graphic_template">Graphic Template</option>
                    <option value="brand_guideline">Brand Guideline</option>
                    <option value="footage_photo">Footage & Photos</option>
                    <option value="offline_print">Offline Print / POSM</option>
                    <option value="online_ads">Online Ads Assets</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#3D4034] mb-1">บริการ (Provider)</label>
                  <select
                    value={provider}
                    onChange={(e) => setProvider(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-[#D9D0BE] rounded-xl text-xs text-[#3D4034] focus:outline-none focus:border-[#588157]"
                  >
                    <option value="Google Drive">Google Drive</option>
                    <option value="Figma">Figma</option>
                    <option value="Canva">Canva</option>
                    <option value="Dropbox">Dropbox</option>
                    <option value="OneDrive">OneDrive</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#3D4034] mb-1">ประเภทไฟล์ (Format)</label>
                  <input
                    type="text"
                    value={fileType}
                    onChange={(e) => setFileType(e.target.value)}
                    placeholder="เช่น .AI, .PSD, .SVG, RAW"
                    className="w-full px-3 py-2 bg-white border border-[#D9D0BE] rounded-xl text-xs text-[#3D4034] placeholder-[#A5A58D] focus:outline-none focus:border-[#588157]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#3D4034] mb-1">คำอธิบายย่อ</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="รายละเอียดเพิ่มเติม"
                    className="w-full px-3 py-2 bg-white border border-[#D9D0BE] rounded-xl text-xs text-[#3D4034] placeholder-[#A5A58D] focus:outline-none focus:border-[#588157]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#E8E2D2] flex items-center justify-between">
                {editingAssetId ? (
                  <button
                    type="button"
                    onClick={() => {
                      handleDeleteAsset(editingAssetId, title);
                      setIsModalOpen(false);
                    }}
                    className="px-3 py-2 text-xs text-[#E76F51] hover:bg-[#FDF0EB] rounded-xl border border-[#F5D0C5] transition flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>ลบชิ้นงานนี้</span>
                  </button>
                ) : <div />}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs bg-[#F5F2EA] text-[#3D4034] rounded-xl hover:bg-[#EAE5D9]"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold bg-[#588157] hover:bg-[#476B46] text-white rounded-xl shadow-md shadow-[#588157]/20"
                  >
                    {editingAssetId ? 'บันทึกการแก้ไข' : 'บันทึกชิ้นงาน'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
};

