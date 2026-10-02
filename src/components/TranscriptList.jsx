import React, { useEffect, useRef } from 'react';
import { Volume2, Copy, Check, Sparkles, MessageSquareQuote } from 'lucide-react';
import { speakText } from '../services/tts';

export default function TranscriptList({
  messages,
  interimText,
  speakerRole,
  isListening,
  fontSize = 18,
  targetLang
}) {
  const bottomRef = useRef(null);
  const [copiedId, setCopiedId] = React.useState(null);

  // Auto scroll to bottom on new message or interim change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, interimText]);

  const handleCopy = (id, text) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleSpeak = (text, lang) => {
    speakText(text, lang);
  };

  return (
    <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3 max-w-2xl mx-auto w-full">
      {messages.length === 0 && !interimText && (
        <div className="h-full min-h-[50vh] flex flex-col items-center justify-center text-center p-6 text-slate-500">
          <div className="w-16 h-16 rounded-full bg-slate-800/80 border border-slate-700/60 flex items-center justify-center mb-4 text-indigo-400">
            <MessageSquareQuote className="w-8 h-8" />
          </div>
          <h3 className="text-base font-semibold text-slate-300 mb-1">
            Chưa có hội thoại nào
          </h3>
          <p className="text-xs text-slate-400 max-w-xs leading-relaxed mb-4">
            Nhấn nút <strong className="text-indigo-400">"Bắt đầu hội thoại"</strong> ở bên dưới để micro lắng nghe tiếng Hàn và dịch sang tiếng {targetLang === 'vi' ? 'Việt' : 'Anh'} theo thời gian thực.
          </p>
          <div className="grid grid-cols-2 gap-2 text-left text-[11px] max-w-sm w-full bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
            <div className="p-2 rounded bg-slate-800/40">
              <span className="font-semibold text-indigo-300 block mb-0.5">🇰🇷 Khi đối tác nói:</span>
              <span className="text-slate-400">App nghe tiếng Hàn và hiển thị câu gốc kèm bản dịch tiếng Việt/Anh ngay bên dưới.</span>
            </div>
            <div className="p-2 rounded bg-slate-800/40">
              <span className="font-semibold text-emerald-300 block mb-0.5">🇻🇳 Khi bạn nói:</span>
              <span className="text-slate-400">Chọn "Tôi là người nói", app nghe tiếng Việt và dịch sang tiếng Hàn để đối tác đọc/nghe.</span>
            </div>
          </div>
        </div>
      )}

      {/* Render list of conversation turns */}
      {messages.map((item) => {
        const isPartner = item.speaker === 'partner';
        const ttsLang = isPartner ? (targetLang === 'vi' ? 'vi-VN' : 'en-US') : 'ko-KR';

        return (
          <div
            key={item.id}
            className={`rounded-2xl p-3.5 border transition-all duration-200 shadow-sm ${
              isPartner
                ? 'bg-slate-900/90 border-indigo-900/40 hover:border-indigo-800/60'
                : 'bg-slate-900/90 border-emerald-900/40 hover:border-emerald-800/60'
            }`}
          >
            {/* Card Header: Speaker badge & actions */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/60">
              <div className="flex items-center gap-2">
                <span className="text-base">
                  {isPartner ? '🇰🇷' : '🇻🇳'}
                </span>
                <span className="text-xs font-semibold tracking-wide text-slate-300">
                  {isPartner ? 'Đối tác Hàn Quốc' : 'Tôi (Người nói)'}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {item.timestamp}
                </span>
              </div>

              <div className="flex items-center gap-1">
                {/* Audio TTS button */}
                {item.translated && (
                  <button
                    onClick={() => handleSpeak(item.translated, ttsLang)}
                    className="p-1 hover:bg-slate-800 text-slate-400 hover:text-indigo-300 rounded transition-colors"
                    title="Phát âm thanh câu dịch"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                )}
                {/* Copy button */}
                <button
                  onClick={() => handleCopy(item.id, `${item.original}\n${item.translated || ''}`)}
                  className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition-colors"
                  title="Sao chép nội dung"
                >
                  {copiedId === item.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* 1. Original recognized speech text */}
            <div className="mb-2">
              <div className="text-[11px] font-medium text-slate-400 mb-0.5 flex items-center gap-1">
                <span>{isPartner ? 'Nguyên văn Tiếng Hàn:' : 'Nguyên văn Tiếng Việt:'}</span>
              </div>
              <p
                className="text-slate-100 font-medium leading-relaxed break-words"
                style={{ fontSize: `${fontSize}px` }}
              >
                {item.original}
              </p>
            </div>

            {/* 2. Translated text right underneath */}
            <div
              className={`rounded-xl p-2.5 mt-2 border ${
                isPartner
                  ? 'bg-indigo-950/40 border-indigo-800/40 text-indigo-100'
                  : 'bg-emerald-950/40 border-emerald-800/40 text-emerald-100'
              }`}
            >
              <div className="text-[11px] font-medium text-slate-400 mb-0.5 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  {isPartner
                    ? targetLang === 'vi'
                      ? 'Bản dịch Tiếng Việt:'
                      : 'Bản dịch Tiếng Anh:'
                    : 'Bản dịch Tiếng Hàn (한국어):'}
                </span>
                {item.isTranslating && (
                  <span className="text-[10px] text-amber-400 animate-pulse font-normal">
                    Đang dịch...
                  </span>
                )}
              </div>

              {item.isTranslating ? (
                <div className="flex items-center gap-2 py-1 text-slate-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                  <span className="text-xs italic">Đang phân tích và thông dịch trực tiếp...</span>
                </div>
              ) : (
                <p
                  className="font-semibold leading-relaxed break-words text-amber-200"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {item.translated}
                </p>
              )}
            </div>
          </div>
        );
      })}

      {/* Live Interim Transcript Card (Real-time listening feedback) */}
      {isListening && interimText && (
        <div className="rounded-2xl p-3.5 bg-slate-900/95 border-2 border-dashed border-indigo-500/60 shadow-lg shadow-indigo-500/10 animate-pulse">
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800/60">
            <div className="flex items-center gap-2">
              <span className="text-base">{speakerRole === 'partner' ? '🇰🇷' : '🇻🇳'}</span>
              <span className="text-xs font-semibold text-indigo-400">
                Đang nghe ({speakerRole === 'partner' ? 'Tiếng Hàn' : 'Tiếng Việt'})...
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span className="text-[10px] text-rose-400 font-medium">LIVE</span>
            </div>
          </div>
          <p
            className="text-slate-200 font-medium italic break-words"
            style={{ fontSize: `${fontSize}px` }}
          >
            "{interimText}"
          </p>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <span>Dừng nói để hoàn thành và dịch câu tự động...</span>
          </div>
        </div>
      )}

      <div ref={bottomRef} className="h-2" />
    </div>
  );
}
