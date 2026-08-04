---
title: Packet Sniffing với Airodump-ng
---

# Packet Sniffing với Airodump-ng

!!! note "Khái niệm"
    **Airodump-ng** là chương trình sniffing gói tin (packet sniffer) thuộc bộ công cụ bảo mật **aircrack-ng**, dùng để bắt toàn bộ gói tin Wi-Fi trong phạm vi phủ sóng.

Chương trình hiển thị chi tiết các mạng không dây xung quanh cùng danh sách client đang kết nối vào từng mạng.

!!! tip "Điểm đặc biệt"
    Airodump-ng bắt được gói tin **kể cả khi không gửi trực tiếp đến máy bạn** — không cần kết nối vào mạng mục tiêu, không cần biết password/key của mạng đó.

## Mục đích sử dụng

| Mục đích | Mô tả |
|---|---|
| Trinh sát mạng | Quét và hiển thị toàn bộ mạng Wi-Fi xung quanh khu vực |
| Thu thập thông số | Lấy MAC (BSSID), mã hóa, kênh hoạt động, ESSID |
| Tiền đề bẻ khóa | Thu thập đủ Data packets làm cơ sở crack WEP/WPA/WPA2 |

## Quy trình sử dụng

### Bước 1 — Bật chế độ Monitor
Card mạng bắt buộc phải ở **Monitor mode** (ví dụ tên card `mon0`).

### Bước 2 — Chạy lệnh bắt gói tin

```bash
airodump-ng <Tên_giao_diện_Monitor>
```

Ví dụ:

```bash
airodump-ng mon0
```

### Bước 3 — Đọc kết quả hiển thị

<!-- Thay bằng ảnh thật khi bạn upload, ví dụ: ![Airodump-ng output](../assets/img/airodump-output.png) -->
![Airodump-ng output](assets/img/airodump-output.png)

| Cột | Ý nghĩa |
|---|---|
| **BSSID** | Địa chỉ MAC của Access Point mục tiêu |
| **PWR** | Cường độ tín hiệu — càng cao càng tốt |
| **Beacons** | Khung tin quảng bá sự tồn tại mạng, kể cả mạng ẩn |
| **#Data** | Số gói tin dữ liệu đã bắt — thông số quan trọng nhất để crack |
| **CH** | Kênh (channel) mạng đang hoạt động |
| **MB** | Tốc độ truyền tải tối đa hỗ trợ |
| **ENC** | Chuẩn mã hóa: `WPA2` / `WPA` / `WEP` / `OPN` (mạng mở) |
| **CIPHER** | Thuật toán mã hóa (VD: `CCMP`, `WEP`) |
| **AUTH** | Phương thức xác thực: `PSK` hoặc `MGT` |
| **ESSID** | Tên hiển thị của mạng Wi-Fi |

### Bước 4 — Dừng quá trình

Chương trình chạy liên tục cho tới khi dừng thủ công:

```bash
Ctrl + C
```

!!! warning "Lưu ý"
    Toàn bộ quy trình **không cần kết nối Internet** hay kết nối vào bất kỳ mạng cục bộ nào — airodump-ng hoạt động độc lập ở tầng liên kết dữ liệu (Layer 2).

## Ứng dụng cho bước tiếp theo

Các thông số ở cột `ENC`, `CIPHER`, `AUTH` là dữ liệu quyết định phương thức tấn công phù hợp (WEP IV reuse, WPA handshake capture, PMKID attack...).

## Kết luận

Airodump-ng là công cụ sniffing mạnh mẽ để khám phá và phân tích chi tiết mọi mạng Wi-Fi xung quanh cùng client đang kết nối. Hiểu đúng ý nghĩa từng tham số (BSSID, PWR, ENC...) giúp thu thập đủ dữ liệu cần thiết cho bước kiểm thử xâm nhập hoặc bẻ khóa mật khẩu tiếp theo.