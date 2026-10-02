import React from 'react';
import { User, Users, ArrowRightLeft } from 'lucide-react';

export default function SpeakerToggle({ speakerRole, onToggleSpeaker, isListening }) {
  const isPartner = speakerRole === 'partner';

  return (
    <div className="px-3 pt-3 pb-1 max-w-2xl mx-auto w-full">
      <div className="bg-slate-900 p-1.5 rounded-2xl border border-slate-800 shadow-lg flex items-center gap-1.5 relative">
        {/* Button 1: Korean Partner */}
        <button
          onClick={() => onToggleSpeaker('partner')}
          className={`flex-1 py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 select-none ${
            isPartner
              ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <div className="flex items-center gap-1.5 font-medium text-xs sm:text-sm">
            <span className="text-base">🇰🇷</span>
            <span>Đối tác nói</span>
            <span className="hidden xs:inline text-[10px] opacity-80">(Hàn Quốc)</span>
          </div>
          {isPartner && isListening && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
          )}
        </button>

        {/* Quick swap button */}
        <button
          onClick={() => onToggleSpeaker(isPartner ? 'user' : 'partner')}
          className="p-1.5 text-slate-500 hover:text-slate-200 hover:bg-slate-800 rounded-full transition-colors"
          title="Đổi chiều đàm thoại"
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
        </button>

        {/* Button 2: I am speaker (Vietnamese) */}
        <button
          onClick={() => onToggleSpeaker('user')}
          className={`flex-1 py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 select-none ${
            !isPartner
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <div className="flex items-center gap-1.5 font-medium text-xs sm:text-sm">
            <span className="text-base">🇻🇳</span>
            <span>Tôi là người nói</span>
            <span className="hidden xs:inline text-[10px] opacity-80">(Việt Nam)</span>
          </div>
          {!isPartner && isListening && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
          )}
        </button>
      </div>

      {/* Mode Subtitle Description */}
      <div className="mt-1.5 px-1 flex items-center justify-between text-[11px] text-slate-400">
        <span>
          Đang lắng nghe:{' '}
          <strong className={isPartner ? 'text-indigo-400' : 'text-emerald-400'}>
            {isPartner ? 'Tiếng Hàn (한국어)' : 'Tiếng Việt'}
          </strong>
        </span>
        <span>
          Dịch sang:{' '}
          <strong className="text-amber-400">
            {isPartner ? 'Tiếng Việt / Anh' : 'Tiếng Hàn (한국어)'}
          </strong>
        </span>
      </div>
    </div>
  );
}
