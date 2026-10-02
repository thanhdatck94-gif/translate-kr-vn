# Ứng Dụng Dịch Hội Thoại Trực Tiếp (Tiếng Hàn ⇄ Tiếng Việt / Tiếng Anh)
### Live Meeting Translator (Mobile First & PWA)

Ứng dụng hỗ trợ thông dịch viên và người tham gia cuộc họp trực tiếp giữa tiếng Hàn và tiếng Việt / tiếng Anh trong thời gian thực. Được thiết kế tối ưu hiển thị trên màn hình điện thoại (Mobile First) và hỗ trợ cài đặt dạng PWA (Thêm vào Màn hình chính).

---

## 🌟 Tính Năng Chính Theo Yêu Cầu

1. **Lắng nghe & Dịch cuộc họp trực tiếp (Real-time Live Subtitles)**:
   - Khi bấm **"BẬT HỘI THOẠI"**, micro sẽ kích hoạt lắng nghe liên tục.
   - Hiển thị tức thì các từ/câu tiếng Hàn đang được đối tác phát âm theo thời gian thực (Interim results).
   - Ngay bên dưới câu tiếng Hàn là bản dịch chuẩn xác bằng **Tiếng Việt 🇻🇳** hoặc **Tiếng Anh 🇬🇧** (chuyển đổi nhanh bằng 1 chạm ở góc trên).

2. **Chế độ 2 chiều – "Tôi là người nói" (Việt ➔ Hàn)**:
   - Dễ dàng chuyển đổi chỉ bằng 1 chạm:
     - 🇰🇷 **Đối tác nói**: Micro nghe tiếng Hàn ➔ Dịch ra Tiếng Việt / Anh.
     - 🇻🇳 **Tôi là người nói**: Micro nghe tiếng Việt ➔ Dịch ra Tiếng Hàn (한국어).
   - Có tích hợp nút **Loa phát âm thanh (TTS)** để phát câu dịch tiếng Hàn cho đối tác nghe trực tiếp trong phòng họp.

3. **Bảo mật tuyệt đối – Không lưu lại dữ liệu**:
   - Dữ liệu cuộc trò chuyện chỉ lưu tạm trong bộ nhớ RAM của ứng dụng.
   - Không lưu trữ vào Database, không ghi log máy chủ.
   - Có nút **"Xóa cuộc hội thoại"** để xóa trắng màn hình tức thì khi kết thúc cuộc họp.

4. **Tích hợp AI Thông Minh**:
   - Hỗ trợ **Google Gemini API** (`gemini-2.0-flash`, `gemini-1.5-flash`): Tốc độ phản hồi cực nhanh, chuẩn xác kính ngữ và thuật ngữ kinh doanh/hội họp.
   - Hỗ trợ **OpenAI API** (`gpt-4o-mini`, `gpt-4o`).
   - Có chế độ **Miễn phí dự phòng** (không bắt buộc phải có API key mới dùng được).

---

## 📱 Hướng Dẫn Cài Đặt & Mở Trên Điện Thoại

### 1. Truy cập từ điện thoại qua Wi-Fi
1. Đảm bảo điện thoại và máy tính kết nối vào **cùng một mạng Wi-Fi**.
2. Trên màn hình máy tính, ứng dụng đang chạy tại:
   - **Local (Máy tính):** `http://localhost:5173`
   - **Mạng Wi-Fi (Điện thoại):** `http://192.168.50.77:5173`
3. Hoặc nhấn vào biểu tượng **Mã QR (📱)** ở thanh tiêu đề trên máy tính và dùng Camera điện thoại để quét mở trực tiếp.

### 2. Cài đặt thành App trên Điện Thoại (PWA)
- **Trên iPhone (Safari):**
  1. Mở liên kết `http://192.168.50.77:5173` trên Safari.
  2. Bấm vào nút **Chia sẻ** (biểu tượng hình vuông có mũi tên lên).
  3. Chọn **"Thêm vào Màn hình chính" (Add to Home Screen)**.
- **Trên Android (Google Chrome):**
  1. Mở liên kết trên Chrome.
  2. Bấm vào dấu **3 chấm** ở góc trên bên phải.
  3. Chọn **"Cài đặt ứng dụng"** hoặc **"Thêm vào Màn hình chính"**.
- Sau khi thêm, icon ứng dụng sẽ xuất hiện trên màn hình điện thoại như một app native, chạy toàn màn hình không có thanh địa chỉ duyệt web.

---

## 🛠️ Hướng Dẫn Khởi Động Lại Ứng Dụng (Khi Cần)

Mở Terminal tại thư mục `c:\Users\DESKTOP-78\Desktop\Translate KR-VN`:

```bash
# Khởi chạy server phát sóng cho cả máy tính và điện thoại
npm.cmd run dev
```
