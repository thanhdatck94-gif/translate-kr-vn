/**
 * Dịch vụ phát âm giọng nói (Text-To-Speech)
 * Giúp người dùng phát âm to câu tiếng Hàn khi người dùng chọn "Tôi là người nói"
 */

export function speakText(text, lang = 'ko-KR') {
  if (!('speechSynthesis' in window)) {
    console.warn('Thiết bị không hỗ trợ Text-to-Speech');
    return false;
  }

  // Dừng phát âm hiện tại nếu đang nói
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.95; // Tốc độ đàm thoại vừa phải trong cuộc họp
  utterance.pitch = 1.0;

  // Cố gắng tìm voice khớp với ngôn ngữ
  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find(v => v.lang.startsWith(lang.split('-')[0]));
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  window.speechSynthesis.speak(utterance);
  return true;
}
