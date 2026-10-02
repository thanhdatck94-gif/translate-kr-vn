import React from 'react';
import { Settings, QrCode, Trash2, ZoomIn, ZoomOut, ShieldCheck, FileText, Download } from 'lucide-react';

export default function Header({
  targetLang,
  setTargetLang,
  fontSize,
  setFontSize,
  onOpenSettings,
  onOpenPhoneConnect,
  onClearHistory,
  hasMessages,
  onOpenSummary,
  onOpenInstallGuide
}) {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-3 py-2.5 safe-top">
      <div className="max-w-2xl mx-auto flex items-center justify-between gap-2">
        {/* App Title & Privacy Badge */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-1">
              Live KR-VN <span className="text-xs px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-normal">Hội Thoại</span>
            </h1>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <ShieldCheck className="w-3 h-3 text-emerald-400 inline" />
            <span>Không lưu dữ liệu</span>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* 1. Tóm Tắt Cuộc Họp Button (Hiển thị khi đã có hội thoại) */}
          {hasMessages && (
            <button
              onClick={onOpenSummary}
              className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold rounded-lg text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all animate-bounce"
              title="Tóm tắt nội dung chính cuộc họp bằng AI"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Tóm tắt</span>
            </button>
          )}

          {/* 2. Cài Đặt App Button (Luôn hiển thị) */}
          <button
            onClick={onOpenInstallGuide}
            className="flex items-center gap-1 px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
            title="Cài đặt ứng dụng vào điện thoại"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Cài App</span>
          </button>

          {/* Target Language Toggle (when Korean is spoken) */}
          <div className="flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/60 text-xs">
            <button
              onClick={() => setTargetLang('vi')}
              className={`px-2 py-1 rounded-md font-medium transition-all ${
                targetLang === 'vi'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Dịch tiếng Hàn sang tiếng Việt"
            >
              🇻🇳 VI
            </button>
            <button
              onClick={() => setTargetLang('en')}
              className={`px-2 py-1 rounded-md font-medium transition-all ${
                targetLang === 'en'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Dịch tiếng Hàn sang tiếng Anh"
            >
              🇬🇧 EN
            </button>
          </div>

          {/* Font Size Adjuster */}
          <div className="flex items-center bg-slate-800/80 rounded-lg border border-slate-700/60 text-slate-300">
            <button
              onClick={() => setFontSize(prev => Math.max(14, prev - 2))}
              className="p-1.5 hover:bg-slate-700 rounded-l-lg text-slate-400 hover:text-white"
              title="Giảm kích thước chữ"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] px-1 font-mono text-slate-400">{fontSize}</span>
            <button
              onClick={() => setFontSize(prev => Math.min(26, prev + 2))}
              className="p-1.5 hover:bg-slate-700 rounded-r-lg text-slate-400 hover:text-white"
              title="Tăng kích thước chữ"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Clear button */}
          {hasMessages && (
            <button
              onClick={onClearHistory}
              className="p-1.5 bg-slate-800/80 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-slate-700/60 rounded-lg transition-colors"
              title="Xóa cuộc hội thoại"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 rounded-lg transition-colors"
            title="Cài đặt API AI"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
