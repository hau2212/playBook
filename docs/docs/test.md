---
title: Bài test toàn diện các tính năng của Markdown
description: File mẫu chứa tất cả các cú pháp Markdown từ cơ bản đến nâng cao (bao gồm sơ đồ Mermaid).
date: 2026-08-04
tags: [markdown, test, mermaid, tutorial]
---

# Tiêu đề cấp 1 (H1) - Tên bài viết chính
## Tiêu đề cấp 2 (H2) - Các mục lớn
### Tiêu đề cấp 3 (H3) - Các mục con
#### Tiêu đề cấp 4 (H4)
##### Tiêu đề cấp 5 (H5)
###### Tiêu đề cấp 6 (H6)

---

## 1. Định dạng văn bản cơ bản (Text Formatting)

Dưới đây là các cách nhấn mạnh văn bản thường dùng:
* **In đậm (Bold)**: Cấu hình `sysmon` cần được ưu tiên.
* *In nghiêng (Italic)*: Kiểm tra log trong *Event Viewer*.
* ***In đậm và in nghiêng (Bold & Italic)***: Cảnh báo ***nghiêm trọng***.
* ~~Gạch ngang (Strikethrough)~~: Tính năng này đã bị loại bỏ.
* <u>Gạch chân (Underline)</u> (Sử dụng thẻ HTML `<u>`).
* Đánh dấu code nội tuyến (Inline code): Sử dụng phím tắt `Ctrl + C` để thoát.

---

## 2. Trích dẫn (Blockquotes)

> Đây là một đoạn trích dẫn cơ bản. Thường dùng để trích dẫn lời nói hoặc định nghĩa.
>
> > Đây là trích dẫn lồng nhau (Nested Blockquote).
> > Bạn có thể sử dụng nó để biểu diễn các luồng trả lời email hoặc các cấp độ chú ý.

---

## 3. Danh sách (Lists)

### Danh sách không thứ tự (Unordered List)
* Hệ điều hành Linux
  * Ubuntu
  * CentOS
    * CentOS 7
    * CentOS 8
* Hệ điều hành Windows

### Danh sách có thứ tự (Ordered List)
1. Thu thập yêu cầu (Gathering Requirements)
2. Thiết kế hệ thống (System Design)
   1. Thiết kế cơ sở dữ liệu
   2. Thiết kế giao diện
3. Triển khai (Deployment)

### Danh sách công việc (Task List)
- [x] Cài đặt MkDocs Material
- [x] Cấu hình giao diện Dark Mode
- [ ] Kích hoạt plugin sơ đồ Mermaid
- [ ] Viết báo cáo thực nghiệm OWASP Top 10

---

## 4. Chèn Code (Code Blocks)

Hỗ trợ highlight cú pháp cho hầu hết các ngôn ngữ lập trình.

**Mã Python:**
```python
def tinh_tong(a, b):
    # Trả về tổng của 2 số
    return a + b

print("Kết quả:", tinh_tong(5, 10))

sequenceDiagram
    participant User
    participant Server
    participant Database

    User->>Server: Gửi yêu cầu Đăng nhập (POST /login)
    activate Server
    Server->>Database: Truy vấn tài khoản
    activate Database
    Database-->>Server: Trả về kết quả (Hợp lệ)
    deactivate Database
    Server-->>User: Trả về Token (200 OK)
    deactivate Server

graph TD;
    A[Bắt đầu] --> B{Kiểm tra thông tin};
    B -- Hợp lệ --> C[Ghi Log vào Splunk];
    B -- Không hợp lệ --> D[Cảnh báo Admin];
    C --> E[Kết thúc];
    D --> E;


    ## Thực nghiệm: Luồng phát hiện và cảnh báo bảo mật

Đoạn mã Python mô phỏng việc kiểm tra log từ hệ thống:

```python
def check_event_log(event_id):
    if event_id == 4688:
        return "Phát hiện tiến trình hệ thống mới"
    return "Trạng thái bình thường"
```

Sơ đồ cơ chế hoạt động Event-based phát hiện các vector tấn công web:

??? info "Bấm vào đây để xem sơ đồ kiến trúc Splunk ES (Ảnh cực lớn)"
    ```mermaid
    graph TD;
        A[Attacker] -->|Gửi request chứa payload| B(Web Server);
        B --> C{Thu thập Log Sysmon};
        C -->|Forward logs| D[Splunk Enterprise Security];
        D -->|Phân tích Event-based| E{Phát hiện OWASP SQLi / XSS?};
        E -- Có --> F[Kích hoạt Cảnh báo];
        E -- Không --> G[Lưu Log truy cập];
        F --> H[Hiển thị trên Dashboard];
    ```

<details>
  <summary><b>Nhấp để xem bộ ảnh chụp kết quả thực nghiệm OWASP Top 10</b></summary>
  
  <br>
  
  ![Ảnh thực nghiệm 1](link-anh-1.png)
  
  ![Ảnh thực nghiệm 2](link-anh-2.png)
  
</details>