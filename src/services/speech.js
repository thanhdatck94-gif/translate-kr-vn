/**
 * Dịch vụ nhận diện giọng nói đa nền tảng (Web Speech API)
 * Tương thích Google Chrome, Android Chrome, Safari iOS
 */

export class SpeechRecognitionService {
  constructor() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.isSupported = !!SpeechRecognition;
    this.recognition = SpeechRecognition ? new SpeechRecognition() : null;
    this.isActive = false; // Người dùng bật chế độ lắng nghe hội thoại
    this.lang = 'ko-KR'; // Mặc định tiếng Hàn
    this.onInterimResult = null; // Callback khi đang nhận dạng từng từ
    this.onFinalResult = null; // Callback khi kết thúc 1 câu
    this.onError = null;
    this.onStatusChange = null;

    if (this.recognition) {
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;

      this.recognition.onstart = () => {
        if (this.onStatusChange) this.onStatusChange(true);
      };

      this.recognition.onresult = (event) => {
        let interimText = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            if (this.onFinalResult && transcript.trim()) {
              this.onFinalResult(transcript.trim());
            }
          } else {
            interimText += transcript;
          }
        }
        if (this.onInterimResult) {
          this.onInterimResult(interimText.trim());
        }
      };

      this.recognition.onerror = (event) => {
        // 'no-speech' thường xảy ra khi im lặng trong phòng họp, không phải lỗi nghiêm trọng
        if (event.error !== 'no-speech') {
          console.warn('Speech recognition event error:', event.error);
          if (this.onError) this.onError(event.error);
        }
      };

      this.recognition.onend = () => {
        // Nếu người dùng vẫn đang bật chế độ hội thoại, tự động kích hoạt lại mic
        // (Trình duyệt trên điện thoại thường ngắt kết nối sau vài giây im lặng)
        if (this.isActive) {
          try {
            setTimeout(() => {
              if (this.isActive) {
                this.recognition.start();
              }
            }, 250);
          } catch (e) {
            console.error('Không thể tự khởi động lại mic:', e);
          }
        } else {
          if (this.onStatusChange) this.onStatusChange(false);
        }
      };
    }
  }

  setLanguage(langCode) {
    // langCode: 'ko-KR' hoặc 'vi-VN'
    this.lang = langCode;
    if (this.recognition) {
      this.recognition.lang = langCode;
    }
  }

  start({ lang, onInterimResult, onFinalResult, onError, onStatusChange }) {
    if (!this.isSupported) {
      if (onError) onError('Trình duyệt chưa hỗ trợ Web Speech API. Vui lòng mở bằng Chrome hoặc Safari.');
      return;
    }

    this.onInterimResult = onInterimResult;
    this.onFinalResult = onFinalResult;
    this.onError = onError;
    this.onStatusChange = onStatusChange;
    this.isActive = true;

    if (lang) {
      this.setLanguage(lang);
    }

    try {
      this.recognition.start();
    } catch (e) {
      // Nếu recognition đã đang chạy
      console.warn('Recognition already started or starting:', e);
    }
  }

  stop() {
    this.isActive = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.warn('Error stopping recognition:', e);
      }
    }
    if (this.onStatusChange) this.onStatusChange(false);
  }
}
