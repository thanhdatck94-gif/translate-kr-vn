/**
 * Dịch vụ nhận diện giọng nói thông minh (Smart Debounced Speech Recognition)
 * Tự động gom câu, khử trùng lặp (đặc biệt trên Android Chrome) và chỉ chốt dịch khi có điểm ngắt câu (khoảng lặng)
 */

export class SpeechRecognitionService {
  constructor() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.isSupported = !!SpeechRecognition;
    this.recognition = SpeechRecognition ? new SpeechRecognition() : null;
    this.isActive = false;
    this.lang = 'ko-KR';

    // Callbacks
    this.onInterimResult = null; // Hiển thị câu đang nói theo thời gian thực
    this.onFinalResult = null;   // Chỉ gọi khi người nói đã kết thúc câu (ngắt giọng)
    this.onError = null;
    this.onStatusChange = null;

    // Buffer và debounce timer
    this.sentenceBuffer = '';
    this.silenceTimer = null;
    this.silenceDelay = 1400; // Thời gian khoảng lặng (ms) để xác định điểm ngắt câu (1.4 giây)

    if (this.recognition) {
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;

      this.recognition.onstart = () => {
        if (this.onStatusChange) this.onStatusChange(true);
      };

      this.recognition.onresult = (event) => {
        let currentInterim = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            // Gom câu thông minh (tránh Android Chrome lặp lại phần đầu câu)
            this.sentenceBuffer = this.mergeTranscript(this.sentenceBuffer, transcript);
          } else {
            currentInterim += transcript;
          }
        }

        // Tạo câu đang nói hoàn chỉnh để hiển thị trực tiếp cho người dùng thấy
        const liveDisplay = currentInterim
          ? this.mergeTranscript(this.sentenceBuffer, currentInterim)
          : this.sentenceBuffer;

        if (this.onInterimResult) {
          this.onInterimResult(liveDisplay.trim());
        }

        // Reset bộ đếm khoảng lặng (Silence Debounce)
        // Mỗi khi người nói phát âm từ mới, gia hạn thời gian
        this.resetSilenceTimer();
      };

      this.recognition.onerror = (event) => {
        if (event.error !== 'no-speech') {
          console.warn('Speech recognition error:', event.error);
          if (this.onError) this.onError(event.error);
        }
      };

      this.recognition.onend = () => {
        // Nếu ngắt do trình duyệt nhưng người dùng vẫn đang bật hội thoại
        if (this.isActive) {
          try {
            setTimeout(() => {
              if (this.isActive) {
                this.recognition.start();
              }
            }, 200);
          } catch (e) {
            console.error('Lỗi khi tự khởi động lại mic:', e);
          }
        } else {
          // Nếu tắt, chốt nốt câu còn trong buffer nếu có
          this.flushBuffer();
          if (this.onStatusChange) this.onStatusChange(false);
        }
      };
    }
  }

  /**
   * Thuật toán ghép và khử trùng lặp câu (khắc phục triệt để lỗi của Android Chrome)
   */
  mergeTranscript(existing, incoming) {
    if (!existing || !existing.trim()) return (incoming || '').trim();
    if (!incoming || !incoming.trim()) return existing.trim();

    const exClean = existing.trim();
    const inClean = incoming.trim();
    const exLower = exClean.toLowerCase();
    const inLower = inClean.toLowerCase();

    // Trường hợp 1: Android Chrome gửi lại toàn bộ câu từ đầu cộng thêm từ mới
    if (inLower.startsWith(exLower) || inLower.includes(exLower)) {
      return inClean;
    }

    // Trường hợp 2: Câu mới là một phần đã có sẵn
    if (exLower.endsWith(inLower) || exLower.includes(inLower)) {
      return exClean;
    }

    // Trường hợp 3: Nối tiếp thông thường
    return `${exClean} ${inClean}`;
  }

  /**
   * Reset bộ đếm thời gian im lặng
   */
  resetSilenceTimer() {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
    }

    this.silenceTimer = setTimeout(() => {
      // Khi đã im lặng đủ độ trễ (1.4s), chốt câu và gửi dịch 1 lần duy nhất
      this.flushBuffer();
    }, this.silenceDelay);
  }

  /**
   * Chốt câu và gửi sang bộ dịch
   */
  flushBuffer() {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }

    const completed = this.sentenceBuffer.trim();
    if (completed) {
      if (this.onFinalResult) {
        this.onFinalResult(completed);
      }
      this.sentenceBuffer = '';
      if (this.onInterimResult) {
        this.onInterimResult('');
      }
    }
  }

  setSilenceDelay(ms) {
    this.silenceDelay = ms || 1400;
  }

  setLanguage(langCode) {
    this.lang = langCode;
    if (this.recognition) {
      this.recognition.lang = langCode;
    }
  }

  start({ lang, silenceDelay, onInterimResult, onFinalResult, onError, onStatusChange }) {
    if (!this.isSupported) {
      if (onError) onError('Trình duyệt chưa hỗ trợ Web Speech API. Vui lòng mở bằng Chrome hoặc Safari.');
      return;
    }

    this.onInterimResult = onInterimResult;
    this.onFinalResult = onFinalResult;
    this.onError = onError;
    this.onStatusChange = onStatusChange;
    this.sentenceBuffer = '';
    this.isActive = true;

    if (silenceDelay) {
      this.silenceDelay = silenceDelay;
    }

    if (lang) {
      this.setLanguage(lang);
    }

    try {
      this.recognition.start();
    } catch (e) {
      console.warn('Recognition already started or starting:', e);
    }
  }

  stop() {
    this.isActive = false;
    this.flushBuffer();
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
