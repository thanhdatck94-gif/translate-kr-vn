import React, { useState, useEffect } from 'react';
import { X, FileText, Sparkles, Copy, Check, RotateCw, Globe2 } from 'lucide-react';
import { summarizeMeeting } from '../services/translator';

export default function MeetingSummaryModal({
  isOpen,
  onClose,
  messages,
  aiConfig
}) {
  const [summaryLang, setSummaryLang] = useState('vi'); // 'vi', 'ko', 'bilingual'
  const [summaryText, setSummaryText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchSummary = async (lang = summaryLang) => {
    if (!messages || messages.length === 0) return;
    setIsLoading(true);
    try {
      const res = await summarizeMeeting({
        messages,
        summaryLang: lang,
        provider: aiConfig.provider,
        apiKey: aiConfig.apiKey,
        model: aiConfig.model,
        meetingContext: aiConfig.meetingContext
      });
      setSummaryText(res);
    } catch (err) {
      setSummaryText(`[Lỗi khi tạo tóm tắt: ${err.message}]`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && messages.length > 0) {
      fetchSummary(summaryLang);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (!summaryText) return;
    navigator.clipboard?.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLangChange = (newLang) => {
    setSummaryLang(newLang);
    fetchSummary(newLang);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-5 shadow-2xl flex flex-col max-h-[90vh] text-xs">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                <span>Tóm Tắt Cuộc Họp</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-normal">
                  {messages.length} câu đàm thoại
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Tổng hợp ý chính & kết luận sau khi kết thúc hội thoại
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language selector for summary */}
        <div className="pt-3 pb-2 flex items-center justify-between gap-2">
          <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
            <Globe2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Ngôn ngữ tóm tắt:</span>
          </span>
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px]">
            <button
              onClick={() => handleLangChange('vi')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                summaryLang === 'vi'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🇻🇳 Tiếng Việt
            </button>
            <button
              onClick={() => handleLangChange('ko')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                summaryLang === 'ko'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🇰🇷 한국어
            </button>
            <button
              onClick={() => handleLangChange('bilingual')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                summaryLang === 'bilingual'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🇻🇳🇰🇷 Song ngữ
            </button>
          </div>
        </div>

        {/* Content Box */}
        <div className="flex-1 overflow-y-auto my-2 p-3.5 bg-slate-950 border border-slate-800 rounded-2xl">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center text-center gap-3 text-slate-400">
              <div className="relative flex items-center justify-center">
                <span className="animate-ping absolute inline-flex h-10 w-10 rounded-full bg-indigo-500 opacity-20" />
                <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
              </div>
              <div>
                <p className="font-semibold text-slate-200 text-xs">
                  AI đang phân tích và lập biên bản tóm tắt...
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Đang gom các thỏa thuận, ý chính và hành động tiếp theo
                </p>
              </div>
            </div>
          ) : (
            <div className="whitespace-pre-wrap leading-relaxed text-slate-200 text-xs font-sans">
              {summaryText}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
          <button
            onClick={() => fetchSummary(summaryLang)}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Tạo lại tóm tắt"
          >
            <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleCopy}
            disabled={isLoading || !summaryText}
            className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all text-xs"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Đã sao chép vào bộ nhớ tạm!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Sao chép bản tóm tắt (Gửi Zalo / Email)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
