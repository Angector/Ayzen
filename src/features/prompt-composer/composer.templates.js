export const TEMPLATES = [
  {
    id: 'slct-image',
    title: 'عکس — فرمول SLCT',
    kind: 'image',
    model: 'Flux',
    fields: [
      { key: 'subject', label: 'سوژه', placeholder: 'زن ۳۰ ساله با کاردیگان کرم، در حال خواندن کتاب' },
      { key: 'lighting', label: 'نورپردازی', placeholder: 'نور صبح از سمت چپ، سایه‌های گرم' },
      { key: 'camera', label: 'دوربین', placeholder: 'مدیوم کلوزآپ، ۸۵mm، عمق میدان کم' },
      { key: 'technical', label: 'تکنیکال', placeholder: 'Leica M6، Portra 400، 4K' },
    ],
    template: `Subject: {{subject}}
Lighting: {{lighting}}
Camera: {{camera}}
Technical: {{technical}}`,
    hint: 'SLCT: Subject → Lighting → Camera → Technical. هر بخش را دقیق پر کن.',
  },
  {
    id: 'portrait-flux',
    title: 'پرتره سینمایی — Flux',
    kind: 'image',
    model: 'Flux',
    fields: [
      { key: 'subject', label: 'سوژه', placeholder: 'مرد ۴۰ ساله، ریش کوتاه، کت چرمی' },
      { key: 'lighting', label: 'نور', placeholder: 'Rembrandt lighting، rim light' },
      { key: 'camera', label: 'دوربین', placeholder: 'close-up، 50mm، f/1.4' },
      { key: 'technical', label: 'تکنیکال', placeholder: 'shot on Arri Alexa، cinematic' },
    ],
    template: `Cinematic portrait of {{subject}}.
{{lighting}}.
{{camera}}, shallow depth of field.
{{technical}}.`,
    hint: 'Flux به مشخصات دوربین و فیلم واقعی خوب پاسخ می‌دهد.',
  },
  {
    id: 'aesthetic-mj',
    title: 'پرتره زیبایی‌شناسانه — Midjourney',
    kind: 'image',
    model: 'Midjourney V7',
    fields: [
      { key: 'subject', label: 'سوژه', placeholder: 'دختر با موهای بلوند، لباس سفید' },
      { key: 'mood', label: 'حال‌وهوا', placeholder: 'ethereal, dreamlike, soft' },
      { key: 'palette', label: 'پالت رنگ', placeholder: 'pastel palette, soft pink and blue' },
      { key: 'params', label: 'پارامترها', placeholder: '--ar 4:5 --stylize 250' },
    ],
    template: `{{subject}}, {{mood}}, {{palette}}, cinematic lighting, shallow depth of field, 85mm lens {{params}}`,
    hint: 'Midjourney به زبان زیبایی‌شناسانه بهتر از مشخصات فنی پاسخ می‌دهد.',
  },
  {
    id: 'product-studio',
    title: 'عکس محصول — استودیویی',
    kind: 'image',
    model: 'Flux',
    fields: [
      { key: 'product', label: 'محصول', placeholder: 'بطری شیشه‌ای سرم کهربایی' },
      { key: 'surface', label: 'سطح', placeholder: 'میز مرمری' },
      { key: 'lighting', label: 'نور', placeholder: 'softbox از بالا-چپ، fill از راست' },
      { key: 'camera', label: 'دوربین', placeholder: 'macro، 100mm، f/8' },
    ],
    template: `Product photography of {{product}} on {{surface}}.
Lighting: {{lighting}}, subtle rim light.
Camera: {{camera}}, focus stacked.
Style: commercial, clean background.`,
    hint: 'برای محصول، نور و سطح را دقیق مشخص کن.',
  },
  {
    id: 'video-kling',
    title: 'ویدیو — Kling (چهاربخشی)',
    kind: 'video',
    model: 'Kling',
    fields: [
      { key: 'subject', label: 'سوژه', placeholder: 'زنی با بارانی قرمز بلند' },
      { key: 'action', label: 'اکشن', placeholder: 'سریع از میان باران نئونی راه می‌رود' },
      { key: 'scene', label: 'صحنه', placeholder: 'کوچه باریک توکیو در شب، آسفالت خیس' },
      { key: 'style', label: 'سبک', placeholder: 'tracking shot، نور سدیم، moody' },
    ],
    template: `Subject: {{subject}}
Action: {{action}}
Scene: {{scene}}
Style: {{style}}`,
    hint: 'Kling: فقط یک حرکت دوربین در هر کلیپ. حرکت‌های هم‌زمان باعث مورفینگ می‌شوند.',
  },
  {
    id: 'video-veo',
    title: 'ویدیو — Veo (با صدا)',
    kind: 'video',
    model: 'Veo',
    fields: [
      { key: 'scene', label: 'صحنه', placeholder: 'خیابان بارانی در شب، نئون' },
      { key: 'action', label: 'اکشن', placeholder: 'مردی چترش را پایین می‌آورد' },
      { key: 'camera', label: 'دوربین', placeholder: 'tracking shot از ارتفاع شانه' },
      { key: 'audio', label: 'صدا', placeholder: 'صدای باران، موسیقی ambient' },
    ],
    template: `{{scene}}. {{action}}.
Camera: {{camera}}.
Audio: {{audio}}.
No subtitles, no text overlay.`,
    hint: 'Veo به بلوک صوتی جداگانه خوب پاسخ می‌دهد. حتماً Audio را پر کن.',
  },
  {
    id: 'dev-bootstrap',
    title: 'شروع پروژه — Bootstrap',
    kind: 'development',
    model: 'Lovable / Bolt',
    fields: [
      { key: 'product', label: 'نام محصول', placeholder: 'یک اپ مدیریت وظایف' },
      { key: 'user', label: 'کاربر هدف', placeholder: 'تیم‌های کوچک' },
      { key: 'problem', label: 'مشکل', placeholder: 'پراکندگی وظایف' },
      { key: 'features', label: 'ویژگی‌های MVP', placeholder: '۱. ساخت وظیفه ۲. تخصیص ۳. وضعیت' },
    ],
    template: `یک {{product}} بساز که به {{user}} کمک می‌کند {{problem}} را حل کند.
MVP: {{features}}.
لازم نیست: احراز هویت پیشرفته، پرداخت.
Data: جدول tasks (id, title, status, assignee).
UI: مینیمال تاریک، رنگ اصلی آبی.`,
    hint: 'لیست کردن «لازم نیست» از تولید کد اضافی جلوگیری می‌کند.',
  },
  {
    id: 'dev-debug',
    title: 'دیباگ گام‌به‌گام',
    kind: 'development',
    model: 'Cursor',
    fields: [
      { key: 'error', label: 'خطا', placeholder: 'TypeError: cannot read property...' },
      { key: 'context', label: 'زمینه', placeholder: 'React 19، Vite' },
      { key: 'expected', label: 'انتظار', placeholder: 'دکمه کلیک شود و API صدا زده شود' },
      { key: 'actual', label: 'واقعیت', placeholder: 'صفحه سفید می‌شود' },
    ],
    template: `خطا: {{error}}
زمینه: {{context}}
انتظار: {{expected}}
واقعیت: {{actual}}
علت ریشه‌ای را توضیح بده، راه‌حل بده، و بگو چطور تأیید کنم.`,
    hint: 'هرچه context دقیق‌تر، پاسخ دقیق‌تر.',
  },
];