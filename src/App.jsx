import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header';
import SpeakerToggle from './components/SpeakerToggle';
import TranscriptList from './components/TranscriptList';
import ControlBar from './components/ControlBar';
import SettingsModal from './components/SettingsModal';
import PhoneConnectModal from './components/PhoneConnectModal';
import ManualInputModal from './components/ManualInputModal';
import { SpeechRecognitionService } from './services/speech';
import { translateText } from './services/translator';
import { AlertCircle } from 'lucide-react';

export default function App() {
  // 1. Core State
  // speakerRole: 'partner' (Hàn Quốc) hoặc 'user' (Việt Nam)
  const [speakerRole, setSpeakerRole] = useState('partner');
  // targetLang: 'vi' (Tiếng Việt) hoặc 'en' (Tiếng Anh) - áp dụng khi đối tác nói tiếng Hàn
  const [targetLang, setTargetLang] = useState('vi');
  // isListening: mic có đang hoạt động hay không
  const [isListening, setIsListening] = useState(false);
  // interimText: từ ngữ đang được nhận diện theo thời gian thực
  const [interimText, setInterimText] = useState('');
  // messages: danh sách các câu đàm thoại trong phiên họp (chỉ lưu trong RAM)
  const [messages, setMessages] = useState([]);
  
  // Font size state
  const [fontSize, setFontSize] = useState(17);

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPhoneConnectOpen, setIsPhoneConnectOpen] = useState(false);
  const [isManualInputOpen, setIsManualInputOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [installPrompt, setInstallPrompt] = useState(null);

  // Lắng nghe sự kiện trước khi cài đặt PWA (WebAPK)
  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallApp = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
    }
  };

  // AI Configuration state (chỉ lưu trong RAM hoặc sessionStorage)
  const [aiConfig, setAiConfig] = useState(() => {
    try {
      const saved = sessionStorage.getItem('meeting_ai_config');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return {
      provider: 'gemini',
      apiKey: '',
      model: 'gemini-2.0-flash',
      meetingContext: 'Thương mại và kinh doanh'
    };
  });

  // Lưu cấu hình vào sessionStorage (tự hủy khi đóng tab trình duyệt)
  const handleSaveConfig = (newConfig) => {
    setAiConfig(newConfig);
    try {
      sessionStorage.setItem('meeting_ai_config', JSON.stringify(newConfig));
    } catch (e) {
      // ignore
    }
  };

  // Ref lưu dịch vụ Speech
  const speechServiceRef = useRef(null);

  // Xử lý dịch câu sau khi kết thúc nhận diện giọng nói
  const handleTranslateSentence = useCallback(async (sentenceText, role) => {
    if (!sentenceText || !sentenceText.trim()) return;

    const isPartner = role === 'partner';
    const sourceLang = isPartner ? 'ko' : 'vi';
    const destLang = isPartner ? targetLang : 'ko';

    const messageId = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    const now = new Date();
    const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    // Kiểm tra chống trùng lặp / gom câu:
    // Nếu câu mới là bản đầy đủ hơn của câu trước đó (hoặc giống hệt)
    setMessages((prev) => {
      if (prev.length > 0) {
        const lastMsg = prev[prev.length - 1];
        if (lastMsg.speaker === role) {
          const lastClean = lastMsg.original.trim().toLowerCase();
          const currClean = sentenceText.trim().toLowerCase();
          // Nếu câu mới bao hàm câu cũ (ví dụ do ngắt quãng nhẹ) -> thay thế câu cũ bằng câu hoàn chỉnh
          if (currClean.startsWith(lastClean) || currClean === lastClean) {
            return prev.map((msg, idx) =>
              idx === prev.length - 1
                ? { ...msg, id: messageId, original: sentenceText, isTranslating: true, timestamp }
                : msg
            );
          }
        }
      }
      return [
        ...prev,
        {
          id: messageId,
          speaker: role,
          original: sentenceText,
          translated: '',
          isTranslating: true,
          timestamp
        }
      ];
    });

    try {
      const translatedResult = await translateText({
        text: sentenceText,
        sourceLang,
        targetLang: destLang,
        provider: aiConfig.provider,
        apiKey: aiConfig.apiKey,
        model: aiConfig.model,
        meetingContext: aiConfig.meetingContext
      });

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? { ...msg, translated: translatedResult, isTranslating: false }
            : msg
        )
      );
    } catch (err) {
      console.error('Translation error:', err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? { ...msg, translated: '[Lỗi khi dịch: ' + err.message + ']', isTranslating: false }
            : msg
        )
      );
    }
  }, [targetLang, aiConfig]);

  // Khởi tạo Speech Service một lần
  useEffect(() => {
    const service = new SpeechRecognitionService();
    speechServiceRef.current = service;

    if (!service.isSupported) {
      setErrorMessage(
        'Trình duyệt này không hỗ trợ Web Speech API. Vui lòng mở bằng Google Chrome hoặc Safari trên iPhone để dùng tính năng nhận diện giọng nói.'
      );
    }

    return () => {
      service.stop();
    };
  }, []);

  // Cập nhật silenceDelay và ngôn ngữ vào Speech Service
  useEffect(() => {
    if (speechServiceRef.current) {
      speechServiceRef.current.setSilenceDelay(aiConfig.silenceDelay || 1500);
    }
  }, [aiConfig.silenceDelay]);

  useEffect(() => {
    if (speechServiceRef.current) {
      const langCode = speakerRole === 'partner' ? 'ko-KR' : 'vi-VN';
      speechServiceRef.current.setLanguage(langCode);
    }
  }, [speakerRole]);

  // Bật / Dừng hội thoại
  const handleToggleListen = () => {
    const service = speechServiceRef.current;
    if (!service) return;

    if (isListening) {
      service.stop();
      setIsListening(false);
      setInterimText('');
    } else {
      setErrorMessage('');
      const langCode = speakerRole === 'partner' ? 'ko-KR' : 'vi-VN';

      service.start({
        lang: langCode,
        silenceDelay: aiConfig.silenceDelay || 1500,
        onInterimResult: (text) => {
          setInterimText(text);
        },
        onFinalResult: (finalText) => {
          setInterimText('');
          handleTranslateSentence(finalText, speakerRole);
        },
        onError: (err) => {
          console.warn('Speech error callback:', err);
          if (err === 'not-allowed') {
            setErrorMessage('Micro chưa được cấp quyền. Vui lòng cho phép trình duyệt truy cập micro trong cài đặt.');
            setIsListening(false);
          }
        },
        onStatusChange: (status) => {
          setIsListening(status);
        }
      });
      setIsListening(true);
    }
  };

  // Đổi vai người nói: Hàn Quốc ⇄ Việt Nam
  const handleToggleSpeaker = (newRole) => {
    if (newRole === speakerRole) return;
    setSpeakerRole(newRole);
    setInterimText('');

    // Nếu đang lắng nghe, chuyển ngôn ngữ ngay lập tức
    if (speechServiceRef.current) {
      const langCode = newRole === 'partner' ? 'ko-KR' : 'vi-VN';
      speechServiceRef.current.setLanguage(langCode);

      // Nếu đang chạy, khởi động lại luồng ngôn ngữ mới
      if (isListening) {
        speechServiceRef.current.stop();
        setTimeout(() => {
          speechServiceRef.current.start({
            lang: langCode,
            silenceDelay: aiConfig.silenceDelay || 1500,
            onInterimResult: (text) => setInterimText(text),
            onFinalResult: (finalText) => {
              setInterimText('');
              handleTranslateSentence(finalText, newRole);
            },
            onStatusChange: (status) => setIsListening(status)
          });
        }, 150);
      }
    }
  };

  // Xóa toàn bộ dữ liệu hội thoại (tuân thủ: không lưu lại dữ liệu)
  const handleClearHistory = () => {
    if (window.confirm('Bạn có chắc muốn xóa sạch toàn bộ nội dung hội thoại vừa dịch không?')) {
      setMessages([]);
      setInterimText('');
    }
  };

  // Nhập văn bản thủ công
  const handleSendManualText = (text) => {
    handleTranslateSentence(text, speakerRole);
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full max-w-lg mx-auto bg-slate-950 text-slate-100 font-sans shadow-2xl relative overflow-hidden select-none">
      {/* 1. Top Navigation Bar */}
      <Header
        targetLang={targetLang}
        setTargetLang={setTargetLang}
        fontSize={fontSize}
        setFontSize={setFontSize}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenPhoneConnect={() => setIsPhoneConnectOpen(true)}
        onClearHistory={handleClearHistory}
        hasMessages={messages.length > 0}
        installPrompt={installPrompt}
        onInstallApp={handleInstallApp}
      />

      {/* 2. Speaker Role Selector (🇰🇷 Đối tác vs 🇻🇳 Tôi) */}
      <SpeakerToggle
        speakerRole={speakerRole}
        onToggleSpeaker={handleToggleSpeaker}
        isListening={isListening}
      />

      {/* Error alert banner if any */}
      {errorMessage && (
        <div className="mx-3 my-1.5 p-3 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-200 text-xs flex items-start gap-2 shadow-lg">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
          <div className="flex-1">
            <p className="leading-snug">{errorMessage}</p>
          </div>
          <button
            onClick={() => setErrorMessage('')}
            className="text-rose-400 hover:text-white text-xs font-bold px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* 3. Central Live Meeting Transcripts Feed */}
      <TranscriptList
        messages={messages}
        interimText={interimText}
        speakerRole={speakerRole}
        isListening={isListening}
        fontSize={fontSize}
        targetLang={targetLang}
      />

      {/* 4. Bottom Control Bar with Mic Action */}
      <ControlBar
        isListening={isListening}
        onToggleListen={handleToggleListen}
        speakerRole={speakerRole}
        onToggleSpeaker={handleToggleSpeaker}
        onOpenManualInput={() => setIsManualInputOpen(true)}
      />

      {/* 5. Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={aiConfig}
        onSaveConfig={handleSaveConfig}
      />

      <PhoneConnectModal
        isOpen={isPhoneConnectOpen}
        onClose={() => setIsPhoneConnectOpen(false)}
      />

      <ManualInputModal
        isOpen={isManualInputOpen}
        onClose={() => setIsManualInputOpen(false)}
        speakerRole={speakerRole}
        onSendManualText={handleSendManualText}
      />
    </div>
  );
}
