# ARCHITECTURE — Prompt Command Center

> این سند قانون اساسی پروژه است. هر تغییر در آن فقط با یک ADR جدید مجاز است.

## اصول ثابت

1. **Open/Closed Principle:** افزودن قابلیت = کد جدید، نه تغییر کد قدیمی.
2. **Feature Isolation:** Featureها هرگز از هم import نمی‌کنند.
3. **Single Responsibility:** هر ماژول فقط یک دلیل برای تغییر.
4. **Functional Core:** منطق تصمیم‌گیری در توابع خالص، جدا از DOM.
5. **Design Tokens First:** هیچ رنگی خارج از توکن‌ها نوشته نمی‌شود.

## ADR-0001 — Feature-Based با ESM
**وضعیت:** ✅ تأییدشده
**تصمیم:** ساختار پوشه بر اساس Feature، با ESM به‌عنوان سیستم ماژول.
**قانون:** Feature A → Feature B ممنوع. Feature → shared مجاز. shared → Feature ممنوع.

## ADR-0002 — Design Tokens سه‌سطحی
**وضعیت:** ✅ تأییدشده
**تصمیم:** سه سطح توکن: Primitive → Alias → Semantic.
**قانون:** کامپوننت‌ها فقط از سطح Semantic استفاده می‌کنند.

## ADR-0003 — Web Components بومی
**وضعیت:** ✅ تأییدشده
**تصمیم:** Custom Elements + Shadow DOM + `BaseComponent` مشترک.
**قانون:** هر کامپوننت یک `customElements.define` دارد.

## ADR-0004 — Plugin Registry
**وضعیت:** ✅ تأییدشده
**تصمیم:** هر Plugin خودش را با `registerPlugin(id, plugin)` ثبت می‌کند.
**قانون:** افزودن Plugin جدید = فایل جدید در `plugins/`، هسته دست‌نخورده.

## ADR-0005 — Functional Core + Imperative Shell
**وضعیت:** ✅ تأییدشده
**تصمیم:** منطق در `pure.js` (توابع خالص)، Viewها فقط نمایش.
**قانون:** هیچ Viewی منطق تصمیم‌گیری ندارد.

## ADR-0006 — IndexedDB با `idb`
**وضعیت:** ✅ تأییدشده
**تصمیم:** IndexedDB با wrapper `idb` (Promise-based).
**قانون:** `db.js` تنها نقطه‌ی تماس با IndexedDB است.

## ADR-0007 — نقشه‌ی ابزارهای بصری
**وضعیت:** ✅ تأییدشده
**تصمیم:** هر کتابخانه فقط یک مسئولیت:
- **Mermaid** → دیاگرام، WBS، تایم‌لاین
- **jsMind** → مایندمپ
- **JSGantt** → گانت
- **Chart.js** → نمودار عددی
- **SortableJS** → Drag & Drop کانبان

## مدل داده‌ی واحد

| موجودیت | جایگاه | مصرف‌کننده |
|---|---|---|
| `Prompt` | IndexedDB v3 | کتابخانه، سازنده، حافظه، آزمایشگاه |
| `Project` | IndexedDB v3 | کابین پروژه |
| `Task` | IndexedDB v3 | کانبان، گانت، WBS، نقاط عطف |
| `Keyword` | `knowledge.data.js` | بانک کلمات، ماشین ترکیب |
| `ModelDialect` | `knowledge.data.js` | سازنده، نقشه‌ی گویش |