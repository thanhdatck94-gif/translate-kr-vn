import React from 'react';
import { Mic, MicOff, ArrowRightLeft, Keyboard, Radio } from 'lucide-react';

export default function ControlBar({
  isListening,
  onToggleListen,
  speakerRole,
  onToggleSpeaker,
  onOpenManualInput
}) {
  const isPartner = speakerRole === 'partner';

  return (
    <div className="sticky bottom-0 z-30 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/80 px-3 py-3 safe-bottom">
      <div className="max-w-2xl mx-auto flex flex-col gap-2">
        {/* Status bar */}
        <div className="flex items-center justify-between px-1 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <Radio className={`w-3.5 h-3.5 ${isListening ? 'text-rose-500 animate-pulse' : 'text-slate-600'}`} />
            <span>
              Trạng thái:{' '}
              {isListening ? (
                <strong className="text-emerald-400">
                  Đang ghi âm và lắng nghe {isPartner ? 'tiếng Hàn 🇰🇷' : 'tiếng Việt 🇻🇳'}
                </strong>
              ) : (
                <span className="text-slate-500">Đang tạm dừng (Sẵn sàng)</span>
              )}
            </span>
          </div>

          <span className="text-[10px] text-slate-500">
            {isPartner ? 'Chế độ: Đối tác nói' : 'Chế độ: Tôi nói'}
          </span>
        </div>

        {/* Action Controls Row */}
        <div className="flex items-center gap-2">
          {/* 1. Quick Switch Speaker Button */}
          <button
            onClick={() => onToggleSpeaker(isPartner ? 'user' : 'partner')}
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all w-20 h-14 shrink-0 active:scale-95"
            title="Đổi người nói"
          >
            <ArrowRightLeft className="w-4 h-4 mb-0.5 text-indigo-400" />
            <span className="text-[10px] font-semibold">
              {isPartner ? 'Tôi nói' : 'Đối tác'}
            </span>
          </button>

          {/* 2. Main Large Microphone Toggle Button */}
          <button
            onClick={onToggleListen}
            className={`flex-1 h-14 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-300 shadow-xl active:scale-98 select-none ${
              isListening
                ? 'bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 text-white shadow-rose-600/30'
                : isPartner
                ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 text-white shadow-indigo-600/30 hover:brightness-110'
                : 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 text-white shadow-emerald-600/30 hover:brightness-110'
            }`}
          >
            {isListening ? (
              <>
                <div className="relative flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-white opacity-40"></span>
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                    <MicOff className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-sm tracking-wide">DỪNG LẮNG NGHE</div>
                  <div className="text-[10px] font-normal text-rose-100/90">
                    Chạm để tạm ngưng micro
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                  <Mic className="w-5 h-5 text-white animate-bounce" />
                </div>
                <div className="text-left">
                  <div className="text-sm tracking-wide">BẬT HỘI THOẠI</div>
                  <div className="text-[10px] font-normal text-white/80">
                    Lắng nghe và dịch tự động
                  </div>
                </div>
              </>
            )}
          </button>

          {/* 3. Keyboard input fallback */}
          <button
            onClick={onOpenManualInput}
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all w-14 h-14 shrink-0 active:scale-95"
            title="Nhập văn bản thủ công"
          >
            <Keyboard className="w-4 h-4 mb-0.5 text-amber-400" />
            <span className="text-[10px] font-semibold">Gõ</span>
          </button>
        </div>
      </div>
    </div>
  );
}
