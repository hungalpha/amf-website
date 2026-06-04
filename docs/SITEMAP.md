# APSE Website — Sitemap & Page Structure

Modeled on the strongest fabrication / pressure-vessel sites (Buckeye, Apache,
Springs Fab). Capability-driven, credibility-first, lead-gen oriented.

```
/  (Home)
├── Năng lực / Capabilities
│   ├── Bồn bể & Bồn chịu áp lực   (Tanks & Pressure Vessels)
│   ├── Thiết bị trao đổi nhiệt     (Heat Exchangers)
│   ├── Kết cấu thép                (Steel Structures)
│   ├── Hệ thống đường ống & Skid   (Piping & Skid Systems)
│   └── Thiết bị công nghệ          (Process Equipment)
├── Ngành / Industries
│   ├── Dầu khí & Hóa chất          (Oil, Gas & Chemical)
│   ├── Thực phẩm & Đồ uống         (Food & Beverage)
│   ├── Xử lý nước                  (Water Treatment)
│   └── Năng lượng                  (Power / Energy)
├── Dự án / Projects   (portfolio + case studies)
├── Quy trình & Chất lượng / Process & Quality
│   └── Chứng nhận: ASME U/R · ISO 9001 · ISO 3834 · AWS · PED
├── Về APSE / About
│   ├── Câu chuyện & Đội ngũ
│   └── Nhà xưởng & Thiết bị        (Facility & Equipment)
├── Tin tức / News  (optional, SEO)
└── Liên hệ / Contact
    └── Yêu cầu báo giá (RFQ)       ← persistent CTA, on every page
```

## Home page section order (built in index.html)

1. **Top bar** — phone, email, certifications quick-glance, language toggle
2. **Sticky header** — logo + nav + "Yêu cầu báo giá" button
3. **Hero** — headline, sub, dual CTA, key stats
4. **Trust / certification strip**
5. **Capabilities grid** — 5–6 cards, each linking to a capability page
6. **Why APSE** — value props + stats band
7. **Process** — Thiết kế → Chế tạo → Kiểm định → Bàn giao
8. **Industries served**
9. **Featured projects** — 3 cards
10. **CTA band** — request a quote
11. **Footer** — sitemap, contact, certs, copyright

## Build conventions
- Static HTML/CSS/JS (served by `python3 -m http.server`, matching `.claude/launch.json`).
- Design tokens in CSS variables (see MOODBOARD.md).
- Mobile-first, responsive grid.
- Vietnamese primary content, English-friendly technical terms (bilingual-ready).
