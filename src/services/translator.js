/**
 * Dịch thuật hội thoại trực tiếp bằng Gemini API, OpenAI API hoặc Miễn phí fallback
 */

export async function translateText({
  text,
  sourceLang, // 'ko', 'vi', 'en'
  targetLang, // 'vi', 'en', 'ko'
  provider = 'gemini', // 'gemini', 'openai', 'free'
  apiKey = '',
  model = 'gemini-2.0-flash',
  meetingContext = 'Thương mại và kinh doanh'
}) {
  if (!text || !text.trim()) return '';

  const langNames = {
    ko: 'Tiếng Hàn (Korean)',
    vi: 'Tiếng Việt (Vietnamese)',
    en: 'Tiếng Anh (English)'
  };

  const srcName = langNames[sourceLang] || sourceLang;
  const tgtName = langNames[targetLang] || targetLang;

  // Nếu người dùng chọn Gemini API và có API Key
  if (provider === 'gemini' && apiKey && apiKey.trim()) {
    try {
      const actualModel = model || 'gemini-2.0-flash';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${actualModel}:generateContent?key=${apiKey.trim()}`;

      const prompt = `Bạn là chuyên gia thông dịch viên trực tiếp trong cuộc họp hội đàm (${meetingContext}).
Nhiệm vụ: Dịch chính xác câu sau từ ${srcName} sang ${tgtName}.

Yêu cầu nghiêm ngặt:
1. Dịch chuẩn xác ngữ nghĩa, kính ngữ và ngữ phong giao tiếp trong cuộc họp chuyên nghiệp.
2. Giữ nguyên số liệu, tên riêng, thuật ngữ kỹ thuật/kinh doanh.
3. CHỈ TRẢ VỀ DUY NHẤT VĂN BẢN ĐÃ DỊCH, tuyệt đối không thêm lời chào, giải thích, phiên âm hay dấu ngoặc kép.

Câu cần dịch:
"${text.trim()}"`;

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 300
          }
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `Lỗi Gemini API (${res.status})`);
      }

      const data = await res.json();
      const translated = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (translated) {
        return cleanTranslation(translated);
      }
    } catch (err) {
      console.warn('Lỗi gọi Gemini API, chuyển sang dịch dự phòng:', err);
      // Fallback sang free translator nếu API lỗi
      return await fallbackTranslate(text, sourceLang, targetLang);
    }
  }

  // Nếu người dùng chọn OpenAI API và có API Key
  if (provider === 'openai' && apiKey && apiKey.trim()) {
    try {
      const actualModel = model || 'gpt-4o-mini';
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey.trim()}`
        },
        body: JSON.stringify({
          model: actualModel,
          messages: [
            {
              role: 'system',
              content: `Bạn là thông dịch viên cuộc họp trực tiếp. Hãy dịch câu từ ${srcName} sang ${tgtName}. Giữ chuẩn ngữ cảnh hội thoại công việc. CHỈ TRẢ VỀ DUY NHẤT BẢN DỊCH, không thêm giải thích.`
            },
            {
              role: 'user',
              content: text.trim()
            }
          ],
          temperature: 0.1,
          max_tokens: 300
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `Lỗi OpenAI API (${res.status})`);
      }

      const data = await res.json();
      const translated = data?.choices?.[0]?.message?.content?.trim();
      if (translated) {
        return cleanTranslation(translated);
      }
    } catch (err) {
      console.warn('Lỗi gọi OpenAI API, chuyển sang dịch dự phòng:', err);
      return await fallbackTranslate(text, sourceLang, targetLang);
    }
  }

  // Phương thức dịch dự phòng miễn phí (không cần API Key)
  return await fallbackTranslate(text, sourceLang, targetLang);
}

/**
 * Xóa các ký tự ngoặc kép thừa nếu AI bao quanh câu dịch
 */
function cleanTranslation(str) {
  let res = str.trim();
  if ((res.startsWith('"') && res.endsWith('"')) || (res.startsWith("'") && res.endsWith("'"))) {
    res = res.slice(1, -1).trim();
  }
  return res;
}

/**
 * Fallback miễn phí qua Google Translate endpoint
 */
async function fallbackTranslate(text, sourceLang, targetLang) {
  try {
    const sl = sourceLang === 'ko' ? 'ko' : sourceLang === 'vi' ? 'vi' : 'en';
    const tl = targetLang === 'ko' ? 'ko' : targetLang === 'vi' ? 'vi' : 'en';
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text.trim())}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error('Không thể kết nối dịch vụ dịch dự phòng');
    const data = await res.json();
    if (Array.isArray(data) && Array.isArray(data[0])) {
      return data[0].map(item => item[0]).join('').trim();
    }
    return 'Không thể dịch nội dung';
  } catch (err) {
    console.error('Fallback translation error:', err);
    return `[Lỗi dịch thuật: ${err.message}]`;
  }
}

/**
 * Tóm tắt toàn bộ cuộc hội thoại cuộc họp qua Gemini API hoặc OpenAI API
 */
export async function summarizeMeeting({
  messages,
  summaryLang = 'vi', // 'vi', 'ko', 'bilingual'
  provider = 'gemini',
  apiKey = '',
  model = 'gemini-2.0-flash',
  meetingContext = 'Thương mại và kinh doanh'
}) {
  if (!messages || messages.length === 0) {
    return 'Chưa có nội dung hội thoại để tóm tắt.';
  }

  // Chuẩn bị văn bản đàm thoại
  const transcriptLines = messages.map((m, idx) => {
    const role = m.speaker === 'partner' ? '🇰🇷 Đối tác Hàn Quốc' : '🇻🇳 Tôi (Việt Nam)';
    return `${idx + 1}. [${m.timestamp}] ${role}:\n   - Lời nói: "${m.original}"\n   - Dịch: "${m.translated || ''}"`;
  }).join('\n\n');

  const langInstruction = summaryLang === 'bilingual'
    ? 'Song ngữ (Tiếng Việt và Tiếng Hàn kèm theo)'
    : summaryLang === 'ko'
    ? 'Tiếng Hàn (한국어)'
    : 'Tiếng Việt';

  const systemInstruction = `Bạn là trợ lý thư ký hội nghị chuyên nghiệp. Hãy đọc toàn bộ biên bản đàm thoại sau đây giữa bên Hàn Quốc và bên Việt Nam (${meetingContext}) và lập bản tóm tắt cuộc họp ngắn gọn, súc tích bằng ${langInstruction}.

Bản tóm tắt PHẢI có cấu trúc rõ ràng sau:
📌 CHỦ ĐỀ CHÍNH CUỘC HỌP
💬 CÁC NỘI DUNG ĐÃ THẢO LUẬN
🤝 KẾT QUẢ / ĐIỂM ĐÃ THỐNG NHẤT
🎯 HÀNH ĐỘNG TIẾP THEO (Action Items - Nếu có)

Lưu ý:
- Trình bày dạng danh sách gạch đầu dòng ngắn gọn, chuyên nghiệp.
- Giữ chính xác số liệu, cam kết, thời hạn hoặc tên riêng nếu được nhắc đến.`;

  if (provider === 'gemini' && apiKey && apiKey.trim()) {
    try {
      const actualModel = model || 'gemini-2.0-flash';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${actualModel}:generateContent?key=${apiKey.trim()}`;

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: `${systemInstruction}\n\nBIÊN BẢN HỘI THOẠI:\n${transcriptLines}` }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 1200
          }
        })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || `Lỗi Gemini (${res.status})`);
      }

      const data = await res.json();
      return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'Không tạo được tóm tắt.';
    } catch (err) {
      console.warn('Lỗi gọi Gemini Summarize:', err);
      return `[Không thể tạo tóm tắt qua Gemini: ${err.message}]`;
    }
  }

  if (provider === 'openai' && apiKey && apiKey.trim()) {
    try {
      const actualModel = model || 'gpt-4o-mini';
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey.trim()}`
        },
        body: JSON.stringify({
          model: actualModel,
          messages: [
            { role: 'system', content: systemInstruction },
            { role: 'user', content: transcriptLines }
          ],
          temperature: 0.2,
          max_tokens: 1200
        })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || `Lỗi OpenAI (${res.status})`);
      }

      const data = await res.json();
      return data?.choices?.[0]?.message?.content?.trim() || 'Không tạo được tóm tắt.';
    } catch (err) {
      console.warn('Lỗi gọi OpenAI Summarize:', err);
      return `[Không thể tạo tóm tắt qua OpenAI: ${err.message}]`;
    }
  }

  // Nếu không có API Key, tóm tắt cơ bản dựa trên các câu đã có
  return `📌 TÓM TẮT CƠ BẢN (${messages.length} câu đàm thoại):\n` +
    messages.map((m, i) => `${i + 1}. [${m.speaker === 'partner' ? '🇰🇷 Hàn' : '🇻🇳 Việt'}] ${m.original} -> ${m.translated}`).join('\n') +
    '\n\n💡 Gợi ý: Hãy nhập Gemini API Key trong phần Cài đặt để AI tự động phân tích sâu các ý chính và hành động tiếp theo.';
}
