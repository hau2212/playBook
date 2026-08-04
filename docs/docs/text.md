---
title: Test bài viết đầu tiên
date: 2026-08-04
---

# Reflected XSS trên module search

## Mô tả

Đây là bài viết test để kiểm tra MkDocs đã chạy đúng chưa. Nội dung này có thể xóa/sửa sau khi test xong.

## Root cause

Input từ tham số `q` trong URL search không được encode trước khi render ra HTML, dẫn đến payload JavaScript được thực thi trực tiếp trên trình duyệt nạn nhân.

## Proof of Concept

```html
<script>alert(document.cookie)</script>
```

## Danh sách kiểm tra

- [x] Xác định input point
- [x] Confirm reflected trong response
- [ ] Viết PoC hoàn chỉnh
- [ ] Đề xuất remediation

## Bảng tóm tắt

| Trường | Giá trị |
|---|---|
| CWE | CWE-79 |
| Severity | Medium |
| Status | Đang phân tích |

> **Note:** Đây chỉ là bài test, chưa phải bài viết thật.

Liên kết thử: [Trang chủ](index.md)