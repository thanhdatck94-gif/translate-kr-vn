import React, { useState } from 'react';
import { X, Send, Sparkles } from 'lucide-react';

export default function ManualInputModal({
  isOpen,
  onClose,
  speakerRole,
  onSendManualText
}) {
  const [text, setText] = useState('');
  const isPartner = speakerRole === 'partner';

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendManualText(text.trim());
    setText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-4 shadow-2xl flex flex-col text-xs">
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-lg">{isPartner ? '🇰🇷' : '🇻🇳'}</span>
            <div>
              <h2 className="text-sm font-bold text-white">
                Nhập văn bản {isPartner ? 'Tiếng Hàn' : 'Tiếng Việt'}
              </h2>
              <p className="text-[10px] text-slate-400">
                {isPartner ? 'Gõ hoặc dán câu tiếng Hàn của đối tác' : 'Gõ câu tiếng Việt của bạn để dịch sang tiếng Hàn'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-3 flex flex-col gap-2.5">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder={
              isPartner
                ? 'Ví dụ: 오늘 회의 일정을 확인해 주시겠습니까?'
                : 'Ví dụ: Chúng tôi đồng ý với các điều khoản này.'
            }
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none text-xs leading-relaxed"
            autoFocus
          />

          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>Dịch tức thì qua AI</span>
            <span>{text.length} ký tự</span>
          </div>

          <button
            type="submit"
            disabled={!text.trim()}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-indigo-600/30"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Dịch & Đưa vào hội thoại</span>
          </button>
        </form>
      </div>
    </div>
  );
}
