import React, { useState } from 'react';
import { X, Key, Cpu, CheckCircle2, AlertCircle, ExternalLink, ShieldAlert, Sparkles } from 'lucide-react';
import { translateText } from '../services/translator';

export default function SettingsModal({
  isOpen,
  onClose,
  config,
  onSaveConfig
}) {
  const [provider, setProvider] = useState(config.provider || 'gemini');
  const [apiKey, setApiKey] = useState(config.apiKey || '');
  const [model, setModel] = useState(config.model || 'gemini-2.0-flash');
  const [meetingContext, setMeetingContext] = useState(config.meetingContext || 'Thương mại và kinh doanh');
  const [showKey, setShowKey] = useState(false);
  const [testStatus, setTestStatus] = useState(null); // 'loading', 'success', 'error'
  const [testResult, setTestResult] = useState('');

  if (!isOpen) return null;

  const handleTestKey = async () => {
    if (provider !== 'free' && !apiKey.trim()) {
      setTestStatus('error');
      setTestResult('Vui lòng nhập API Key để kiểm tra.');
      return;
    }

    setTestStatus('loading');
    setTestResult('Đang gửi kiểm tra đến AI...');

    try {
      const res = await translateText({
        text: '안녕하세요. 오늘 회의에 참석해 주셔서 감사합니다.',
        sourceLang: 'ko',
        targetLang: 'vi',
        provider,
        apiKey,
        model,
        meetingContext
      });

      if (res && !res.startsWith('[Lỗi')) {
        setTestStatus('success');
        setTestResult(`Kết nối thành công! Bản dịch mẫu: "${res}"`);
      } else {
        setTestStatus('error');
        setTestResult(`Thử nghiệm thất bại: ${res}`);
      }
    } catch (err) {
      setTestStatus('error');
      setTestResult(`Lỗi kết nối: ${err.message}`);
    }
  };

  const handleSave = () => {
    onSaveConfig({
      provider,
      apiKey: apiKey.trim(),
      model,
      meetingContext
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-5 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Cấu hình Trí Tuệ Nhân Tạo</h2>
              <p className="text-[11px] text-slate-400">Tối ưu dịch thuật hội thoại chuyên sâu</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <div className="py-4 space-y-4 text-xs">
          {/* Provider Selection */}
          <div>
            <label className="font-semibold text-slate-300 block mb-1.5">
              Nhà cung cấp dịch thuật AI:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setProvider('gemini');
                  setModel('gemini-2.0-flash');
                }}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  provider === 'gemini'
                    ? 'border-indigo-500 bg-indigo-500/20 text-white font-bold'
                    : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="font-semibold">Gemini API</div>
                <div className="text-[10px] text-indigo-300 opacity-90">(Khuyên dùng)</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setProvider('openai');
                  setModel('gpt-4o-mini');
                }}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  provider === 'openai'
                    ? 'border-emerald-500 bg-emerald-500/20 text-white font-bold'
                    : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="font-semibold">OpenAI</div>
                <div className="text-[10px] text-emerald-300 opacity-90">(GPT-4o)</div>
              </button>

              <button
                type="button"
                onClick={() => setProvider('free')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  provider === 'free'
                    ? 'border-amber-500 bg-amber-500/20 text-white font-bold'
                    : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="font-semibold">Miễn phí</div>
                <div className="text-[10px] text-amber-300 opacity-90">(Google Web)</div>
              </button>
            </div>
          </div>

          {/* API Key Input */}
          {provider !== 'free' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-300 flex items-center gap-1">
                  <Key className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{provider === 'gemini' ? 'Google Gemini API Key' : 'OpenAI API Key'}:</span>
                </label>
                {provider === 'gemini' && (
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-indigo-400 hover:underline flex items-center gap-0.5"
                  >
                    Lấy key miễn phí <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={provider === 'gemini' ? 'AIzaSy...' : 'sk-...'}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 pr-16 font-mono text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded-md"
                >
                  {showKey ? 'Ẩn' : 'Hiện'}
                </button>
              </div>
            </div>
          )}

          {/* Model selection */}
          {provider !== 'free' && (
            <div>
              <label className="font-semibold text-slate-300 block mb-1 flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                <span>Mô hình AI (Model):</span>
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                {provider === 'gemini' ? (
                  <>
                    <option value="gemini-2.0-flash">Gemini 2.0 Flash (Tốc độ tức thì, rất chính xác)</option>
                    <option value="gemini-1.5-flash">Gemini 1.5 Flash (Tiết kiệm quota)</option>
                    <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                  </>
                ) : (
                  <>
                    <option value="gpt-4o-mini">GPT-4o Mini (Nhanh & kinh tế)</option>
                    <option value="gpt-4o">GPT-4o (Thông minh nhất)</option>
                  </>
                )}
              </select>
            </div>
          )}

          {/* Context / Prompt Tuning */}
          <div>
            <label className="font-semibold text-slate-300 block mb-1">
              Ngữ cảnh cuộc họp (Giúp AI chọn từ ngữ chuẩn xác):
            </label>
            <select
              value={meetingContext}
              onChange={(e) => setMeetingContext(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="Thương mại và kinh doanh">Đàm phán thương mại & Hợp đồng kinh doanh</option>
              <option value="Công nghệ thông tin và phát triển phần mềm">Công nghệ thông tin (IT / Phần mềm)</option>
              <option value="Sản xuất, nhà xưởng và chuỗi cung ứng">Sản xuất, Nhà xưởng & Chuỗi cung ứng</option>
              <option value="Xây dựng và kỹ thuật công trình">Xây dựng & Kỹ thuật</option>
              <option value="Giao tiếp thân mật thông thường">Giao tiếp thường nhật / Thân mật</option>
            </select>
          </div>

          {/* Test Status Banner */}
          {testStatus && (
            <div
              className={`p-3 rounded-xl border flex items-start gap-2 ${
                testStatus === 'success'
                  ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
                  : testStatus === 'loading'
                  ? 'bg-indigo-950/40 border-indigo-800/60 text-indigo-200'
                  : 'bg-rose-950/40 border-rose-800/60 text-rose-200'
              }`}
            >
              {testStatus === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />}
              {testStatus === 'error' && <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />}
              {testStatus === 'loading' && <div className="w-3.5 h-3.5 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin shrink-0 mt-0.5" />}
              <span className="leading-snug">{testResult}</span>
            </div>
          )}

          {/* Privacy Notice */}
          <div className="p-2.5 bg-slate-950/60 border border-slate-800/80 rounded-xl flex items-center gap-2 text-slate-400 text-[11px]">
            <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Ứng dụng không lưu lại bất kỳ bản ghi hội thoại nào trên máy chủ. Mọi cuộc trò chuyện chỉ hiển thị tạm thời trên màn hình hiện tại.
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
          <button
            type="button"
            onClick={handleTestKey}
            className="px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors text-xs"
          >
            Kiểm tra kết nối
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30 transition-all text-xs"
          >
            Lưu cài đặt
          </button>
        </div>
      </div>
    </div>
  );
}
