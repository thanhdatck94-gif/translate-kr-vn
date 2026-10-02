import React, { useState, useEffect } from 'react';
import { X, Smartphone, Globe, Wifi, Copy, Check, Share2, PlusSquare, Cloud, ExternalLink } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function PhoneConnectModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('cloud'); // 'cloud' hoặc 'wifi'
  const [copied, setCopied] = useState(false);
  const [customCloudUrl, setCustomCloudUrl] = useState(() => {
    return localStorage.getItem('meeting_cloud_app_url') || '';
  });
  const [localUrl, setLocalUrl] = useState('');

  useEffect(() => {
    const host = window.location.hostname;
    const port = window.location.port ? `:${window.location.port}` : '';
    const protocol = window.location.protocol;
    
    let finalHost = host;
    if (host === 'localhost' || host === '127.0.0.1') {
      finalHost = '192.168.50.77';
    }
    setLocalUrl(`${protocol}//${finalHost}${port}`);
  }, [isOpen]);

  if (!isOpen) return null;

  const currentDisplayUrl = activeTab === 'cloud' && customCloudUrl.trim()
    ? customCloudUrl.trim()
    : localUrl;

  const handleCopyUrl = (urlToCopy) => {
    navigator.clipboard?.writeText(urlToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveCloudUrl = (url) => {
    setCustomCloudUrl(url);
    localStorage.setItem('meeting_cloud_app_url', url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-5 shadow-2xl flex flex-col text-xs max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Dùng Trên Điện Thoại</h2>
              <p className="text-[11px] text-slate-400">Mọi lúc, mọi nơi khi đi họp</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 my-3">
          <button
            type="button"
            onClick={() => setActiveTab('cloud')}
            className={`flex-1 py-1.5 rounded-lg font-medium flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'cloud'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>Online 24/7 (Không cần máy tính)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('wifi')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'wifi'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wifi className="w-3.5 h-3.5" />
            <span>Wi-Fi nội bộ</span>
          </button>
        </div>

        {/* Content Tab 1: Cloud 24/7 */}
        {activeTab === 'cloud' && (
          <div className="space-y-3">
            <div className="p-3 bg-indigo-950/40 border border-indigo-800/40 rounded-xl text-slate-300 space-y-1.5">
              <span className="font-semibold text-indigo-300 block">
                ⚡ Cách đưa lên mạng miễn phí (Chỉ mất 30 giây):
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Thư mục <code className="text-amber-300 font-mono">dist</code> đã được tạo sẵn trên máy tính. Bạn chỉ cần kéo thả thư mục này lên dịch vụ hosting miễn phí để nhận đường link HTTPS vĩnh viễn:
              </p>
              <div className="pt-1 flex flex-col gap-1.5">
                <a
                  href="https://app.netlify.com/drop"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-indigo-700/50 text-indigo-300 hover:bg-slate-800 transition-colors"
                >
                  <span className="font-medium">1. Mở Netlify Drop (Kéo thả thư mục dist)</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>
                <a
                  href="https://vercel.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-700/60 text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  <span className="font-medium">2. Hoặc Vercel (Miễn phí 100%)</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>
              </div>
            </div>

            {/* Input Cloud URL */}
            <div>
              <label className="font-semibold text-slate-300 block mb-1">
                Dán đường link web của bạn vào đây (sau khi deploy):
              </label>
              <input
                type="url"
                value={customCloudUrl}
                onChange={(e) => handleSaveCloudUrl(e.target.value)}
                placeholder="https://ten-ung-dung.netlify.app"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono text-xs"
              />
            </div>

            {/* QR Code preview */}
            {customCloudUrl.trim() ? (
              <div className="py-2 flex flex-col items-center justify-center">
                <div className="p-3 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-2">
                  <QRCodeSVG
                    value={customCloudUrl.trim()}
                    size={160}
                    level="M"
                    includeMargin={false}
                  />
                </div>
                <p className="text-center text-slate-400 text-[11px]">
                  Quét mã QR bằng điện thoại để mở ứng dụng 24/7
                </p>
              </div>
            ) : null}
          </div>
        )}

        {/* Content Tab 2: Wi-Fi nội bộ */}
        {activeTab === 'wifi' && (
          <div className="space-y-3">
            <div className="py-2 flex flex-col items-center justify-center">
              <div className="p-3 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-2">
                <QRCodeSVG
                  value={localUrl}
                  size={160}
                  level="M"
                  includeMargin={false}
                />
              </div>
              <p className="text-center text-slate-400 text-[11px]">
                Quét bằng camera điện thoại khi dùng chung Wi-Fi
              </p>
              <div className="mt-2 w-full bg-slate-950 border border-slate-800 rounded-xl p-2 flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] text-indigo-300 truncate">
                  {localUrl}
                </span>
                <button
                  onClick={() => handleCopyUrl(localUrl)}
                  className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors shrink-0"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PWA Home Screen Instructions */}
        <div className="space-y-1.5 border-t border-slate-800 pt-3 text-slate-300">
          <div className="flex items-start gap-2">
            <PlusSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span className="leading-snug">
              <strong>Cài thành App di động:</strong> Mở link trên Safari/Chrome của điện thoại {'->'} Bấm <strong>Chia sẻ / Menu</strong> {'->'} Chọn <strong>"Thêm vào Màn hình chính"</strong> để dùng toàn màn hình không khác gì app tải từ App Store/CH Play!
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 mt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
          >
            Đóng lại
          </button>
        </div>
      </div>
    </div>
  );
}
