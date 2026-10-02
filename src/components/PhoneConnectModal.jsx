import React, { useState, useEffect } from 'react';
import { X, Smartphone, Wifi, Copy, Check, Share2, PlusSquare } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function PhoneConnectModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const [mobileUrl, setMobileUrl] = useState('');

  useEffect(() => {
    // Lấy hostname hiện tại hoặc IP nội bộ
    const host = window.location.hostname;
    const port = window.location.port ? `:${window.location.port}` : '';
    const protocol = window.location.protocol;
    
    // Nếu đang chạy ở localhost thì ưu tiên IP LAN 192.168.50.77
    let finalHost = host;
    if (host === 'localhost' || host === '127.0.0.1') {
      finalHost = '192.168.50.77';
    }
    setMobileUrl(`${protocol}//${finalHost}${port}`);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyUrl = () => {
    navigator.clipboard?.writeText(mobileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-5 shadow-2xl flex flex-col text-xs">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Mở trên Điện Thoại</h2>
              <p className="text-[11px] text-slate-400">Dùng trong cuộc họp mọi lúc</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Code section */}
        <div className="py-4 flex flex-col items-center justify-center">
          <div className="p-4 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-3">
            {mobileUrl && (
              <QRCodeSVG
                value={mobileUrl}
                size={180}
                level="M"
                includeMargin={false}
              />
            )}
          </div>
          <p className="text-center text-slate-400 text-[11px]">
            Dùng <strong>Camera điện thoại</strong> quét mã QR này
          </p>

          {/* URL box */}
          <div className="mt-3 w-full bg-slate-950 border border-slate-800 rounded-xl p-2 flex items-center justify-between gap-2">
            <span className="font-mono text-[11px] text-indigo-300 truncate">
              {mobileUrl}
            </span>
            <button
              onClick={handleCopyUrl}
              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors shrink-0"
              title="Sao chép liên kết"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-2 border-t border-slate-800 pt-3 text-slate-300">
          <div className="flex items-start gap-2">
            <Wifi className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <span>
              <strong>Bước 1:</strong> Kết nối điện thoại vào cùng mạng <strong>Wi-Fi</strong> với máy tính.
            </span>
          </div>

          <div className="flex items-start gap-2">
            <Share2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Bước 2:</strong> Mở link bằng <strong>Safari (iPhone)</strong> hoặc <strong>Chrome (Android)</strong>. Cấp quyền Micro khi được hỏi.
            </span>
          </div>

          <div className="flex items-start gap-2">
            <PlusSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>Bước 3 (Thành App):</strong> Bấm <strong>Chia sẻ / Menu 3 chấm</strong> {'->'} Chọn <strong>"Thêm vào Màn hình chính"</strong> để dùng toàn màn hình như ứng dụng cài đặt!
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 mt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
          >
            Đã hiểu, đóng lại
          </button>
        </div>
      </div>
    </div>
  );
}
