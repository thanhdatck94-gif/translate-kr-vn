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
