import React from 'react';
import { X, Smartphone, Download, AlertTriangle, CheckCircle2, Share2, MoreVertical } from 'lucide-react';

export default function InstallGuideModal({
  isOpen,
  onClose,
  installPrompt,
  onTriggerInstall
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-5 shadow-2xl flex flex-col text-xs max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Cài Đặt Lên Màn Hình</h2>
              <p className="text-[11px] text-slate-400">Dùng độc lập như App thật</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action 1: If browser supports direct install prompt */}
        {installPrompt && (
          <div className="my-3 p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-2xl flex flex-col gap-2">
            <div className="flex items-center gap-2 text-emerald-300 font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Thiết bị hỗ trợ cài đặt trực tiếp!</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Nhấn nút bên dưới để hệ thống Android tự động cài đặt icon ứng dụng vào màn hình chính:
            </p>
            <button
              onClick={() => {
                onTriggerInstall();
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 active:scale-95 transition-all text-xs"
            >
              <Download className="w-4 h-4" />
              <span>Bấm vào đây để Cài Đặt Ngay</span>
            </button>
          </div>
        )}

        {/* Instructions */}
        <div className="py-2 space-y-3 text-slate-300">
          {/* Chrome Android guide */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl space-y-1.5">
            <span className="font-semibold text-indigo-300 flex items-center gap-1.5">
              <MoreVertical className="w-3.5 h-3.5 text-indigo-400" />
              <span>Cách 1: Cài đặt qua Menu Chrome</span>
            </span>
            <p className="text-[11px] leading-relaxed text-slate-300">
              1. Bấm vào biểu tượng <strong>3 dấu chấm</strong> ở góc trên bên phải màn hình Chrome.<br />
              2. Chọn <strong>"Cài đặt ứng dụng"</strong> (hoặc <strong>"Thêm vào Màn hình chính"</strong>).
            </p>
          </div>

          {/* Xiaomi special note */}
          <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-2xl space-y-2 text-amber-200">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-300 block">
                  Đặc biệt dành cho điện thoại Xiaomi / Redmi:
                </span>
                <p className="text-[11px] leading-relaxed text-slate-300 mt-1">
                  Nếu bạn bấm vào icon trên màn hình chính mà không thấy mở app, do Xiaomi mặc định chặn Chrome mở lối tắt. Hãy mở quyền chỉ trong 10 giây:
                </p>
              </div>
            </div>
            <div className="p-2 bg-slate-950/80 rounded-xl text-[11px] text-slate-300 space-y-1 font-mono">
              <div>1. Vào <strong>Cài đặt</strong> {'->'} <strong>Ứng dụng</strong> {'->'} <strong>Quản lý ứng dụng</strong>.</div>
              <div>2. Tìm chọn <strong>Chrome</strong> {'->'} bấm <strong>Quyền khác</strong>.</div>
              <div>3. Bật dấu tích xanh cho <strong>"Hiển thị cửa sổ pop-up khi chạy dưới nền"</strong> và <strong>"Lối tắt trên màn hình chính"</strong>.</div>
            </div>
          </div>

          {/* iPhone Safari guide */}
          <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-[11px] text-slate-400 flex items-center gap-2">
            <Share2 className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>
              <strong>iPhone (Safari):</strong> Bấm nút <strong>Chia sẻ</strong> (hình vuông mũi tên lên) {'->'} Chọn <strong>"Thêm vào MH chính"</strong>.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors text-xs"
          >
            Đã hiểu, đóng lại
          </button>
        </div>
      </div>
    </div>
  );
}
