export const SEED_PROMPTS = [
  // --- معماری (۵) ---
  {
    id: 'arch-001', builtin: true, category: 'architecture', model: 'Claude Code',
    title: 'طراحی معماری سیستم از صفر',
    tags: ['architecture', 'design', 'mermaid'],
    content: `نقش: معمار ارشد نرم‌افزار.
زمینه: در حال طراحی [نوع سیستم] با [تکنولوژی‌ها] هستیم.
وظیفه: معماری را با الگوی [CQRS/Event-Driven/...] طراحی کن.
خروجی: ۱) دیاگرام Mermaid  ۲) توضیح جریان داده  ۳) ملاحظات مقیاس‌پذیری.
محدودیت: از [تکنولوژی X] استفاده نکن.`,
    template: `نقش: معمار ارشد نرم‌افزار.
زمینه: در حال طراحی {{systemType}} با {{technologies}} هستیم.
وظیفه: معماری را با الگوی {{pattern}} طراحی کن.
خروجی: ۱) دیاگرام Mermaid  ۲) توضیح جریان داده  ۳) ملاحظات مقیاس‌پذیری.
محدودیت: از {{avoid}} استفاده نکن.`,
    variables: ['systemType', 'technologies', 'pattern', 'avoid'],
  },
  {
    id: 'arch-002', builtin: true, category: 'architecture', model: 'Claude Code',
    title: 'بازبینی معماری موجود',
    tags: ['review', 'architecture'],
    content: `نقش: reviewer معماری.
این معماری را نقد کن: [توضیح].
خروجی: لیست مشکلات به ترتیب اولویت + پیشنهاد اصلاح هر کدام.`,
    template: `نقش: reviewer معماری.
این معماری را نقد کن: {{description}}.
خروجی: لیست مشکلات به ترتیب اولویت + پیشنهاد اصلاح هر کدام.`,
    variables: ['description'],
  },
  {
    id: 'arch-003', builtin: true, category: 'architecture', model: 'Cursor',
    title: 'طراحی اسکیمای دیتابیس',
    tags: ['database', 'schema'],
    content: `نقش: معمار دیتابیس با تخصص در [PostgreSQL].
یک اسکیمای نرمال‌شده (3NF) برای [اپلیکیشن] طراحی کن.
شامل: ERD (Mermaid)، SQL DDL، ایندکس‌ها، و اسکریپت مهاجرت.`,
    template: `نقش: معمار دیتابیس با تخصص در {{db}}.
یک اسکیمای نرمال‌شده (3NF) برای {{app}} طراحی کن.
شامل: ERD (Mermaid)، SQL DDL، ایندکس‌ها، و اسکریپت مهاجرت.`,
    variables: ['db', 'app'],
  },
  {
    id: 'arch-004', builtin: true, category: 'architecture', model: 'Claude Code',
    title: 'برنامه‌ریزی فازی پیاده‌سازی',
    tags: ['planning', 'agentic'],
    content: `یک برنامه‌ی پیاده‌سازی فازی برای [ویژگی] ایجاد کن.
هر فاز: کوچک، قابل تست، مستقل.
برای هر فاز: فایل‌های درگیر، معیار موفقیت، و وابستگی‌ها.
قبل از شروع هر فاز، تأیید من را بگیر.`,
    template: `یک برنامه‌ی پیاده‌سازی فازی برای {{feature}} ایجاد کن.
هر فاز: کوچک، قابل تست، مستقل.
برای هر فاز: فایل‌های درگیر، معیار موفقیت، و وابستگی‌ها.
قبل از شروع هر فاز، تأیید من را بگیر.`,
    variables: ['feature'],
  },
  {
    id: 'arch-005', builtin: true, category: 'architecture', model: 'Claude Code',
    title: 'نقشه‌ی شعاع انفجار تغییر',
    tags: ['blast-radius', 'agentic'],
    content: `قبل از اعمال هر تغییر، نقشه‌ی شعاع انفجار را رسم کن:
کدام فایل‌ها، تست‌ها و ماژول‌ها تحت تأثیر قرار می‌گیرند؟
چه چیزهایی می‌توانند بشکنند؟
سپس تغییر را اعمال کن.`,
    template: `قبل از اعمال تغییر در {{target}}، نقشه‌ی شعاع انفجار را رسم کن:
کدام فایل‌ها، تست‌ها و ماژول‌ها تحت تأثیر قرار می‌گیرند؟
چه چیزهایی می‌توانند بشکنند؟
سپس تغییر را اعمال کن.`,
    variables: ['target'],
  },

  // --- عکس (۴) ---
  {
    id: 'img-001', builtin: true, category: 'image', model: 'Flux',
    title: 'پرتره سینمایی — فرمول SLCT',
    tags: ['portrait', 'cinematic', 'SLCT'],
    content: `Subject: [سن، ظاهر، لباس، حالت چهره].
Lighting: [نور طبیعی/استودیویی] از سمت [جهت].
Camera: [کلوزآپ/مدیوم] با [لنز]، عمق میدان کم.
Technical: shot on Leica M6, Portra 400.`,
    template: `Subject: {{subject}}.
Lighting: {{lighting}}.
Camera: {{camera}}, shallow depth of field.
Technical: shot on {{camera_body}}, {{film_stock}}.`,
    variables: ['subject', 'lighting', 'camera', 'camera_body', 'film_stock'],
  },
  {
    id: 'img-002', builtin: true, category: 'image', model: 'Midjourney V7',
    title: 'پرتره زیبایی‌شناسانه — Midjourney',
    tags: ['portrait', 'aesthetic'],
    content: `[سوژه]، ethereal, dreamlike, soft pastel palette, cinematic lighting, shallow depth of field, 85mm lens --ar 4:5 --stylize 250`,
    template: `{{subject}}, {{mood}}, {{palette}}, cinematic lighting, shallow depth of field, 85mm lens --ar {{aspect}} --stylize {{stylize}}`,
    variables: ['subject', 'mood', 'palette', 'aspect', 'stylize'],
  },
  {
    id: 'img-003', builtin: true, category: 'image', model: 'Ideogram V3',
    title: 'لوگو با متن — Ideogram',
    tags: ['logo', 'text', 'typography'],
    content: `Logo design for [برند]، minimal, geometric، the word "[متن]" in bold sans-serif, centered, white background.`,
    template: `Logo design for {{brand}}, {{style}}, the word "{{text}}" in bold sans-serif, centered, white background.`,
    variables: ['brand', 'style', 'text'],
  },
  {
    id: 'img-004', builtin: true, category: 'image', model: 'Flux',
    title: 'عکس محصول — استودیویی',
    tags: ['product', 'commercial'],
    content: `Subject: [محصول] on [سطح].
Lighting: softbox from top-left, fill from right, subtle rim light.
Camera: macro, 100mm, f/8, focus stacked.
Style: commercial product photography, clean background.`,
    template: `Subject: {{product}} on {{surface}}.
Lighting: softbox from top-left, fill from right, subtle rim light.
Camera: macro, {{lens}}, f/8, focus stacked.
Style: commercial product photography, clean background.`,
    variables: ['product', 'surface', 'lens'],
  },

  // --- ویدیو (۳) ---
  {
    id: 'vid-001', builtin: true, category: 'video', model: 'Kling',
    title: 'صحنه سینمایی — Kling',
    tags: ['cinematic', 'tracking'],
    content: `Subject: [کاراکتر با لباس مشخص].
Action: [یک اکشن مشخص].
Scene: [لوکیشن]، [زمان روز]، [آب‌وهوا].
Style: [نوع شات]، [نور]، [حال‌وهوا].`,
    template: `Subject: {{subject}}.
Action: {{action}}.
Scene: {{scene}}.
Style: {{style}}.`,
    variables: ['subject', 'action', 'scene', 'style'],
  },
  {
    id: 'vid-002', builtin: true, category: 'video', model: 'Veo',
    title: 'ویدیو با صدا — Veo',
    tags: ['audio', 'cinematic'],
    content: `[نثر سینمایی صحنه].
Camera: [حرکت دوربین].
Audio: [موسیقی/افکت].
SFX: [صدای محیط].
No subtitles, no text overlay.`,
    template: `{{scene}}.
Camera: {{camera}}.
Audio: {{audio}}.
SFX: {{sfx}}.
No subtitles, no text overlay.`,
    variables: ['scene', 'camera', 'audio', 'sfx'],
  },
  {
    id: 'vid-003', builtin: true, category: 'video', model: 'Seedance',
    title: 'ویدیو محصول — چندشات',
    tags: ['product', 'multi-shot'],
    content: `Shot 1: [نمای wide از محصول].
Shot 2: [کلوزآپ از جزئیات].
Shot 3: [استفاده‌ی کاربر].
Style: [نور]، [رنگ].
Reference: @Image1 as the product.`,
    template: `Shot 1: {{wide_shot}}.
Shot 2: {{closeup}}.
Shot 3: {{usage}}.
Style: {{lighting}}, {{colors}}.
Reference: @Image1 as the product.`,
    variables: ['wide_shot', 'closeup', 'usage', 'lighting', 'colors'],
  },

  // --- توسعه (۳) ---
  {
    id: 'dev-001', builtin: true, category: 'development', model: 'Lovable / Bolt',
    title: 'شروع پروژه — Bootstrap',
    tags: ['bootstrap', 'spec'],
    content: `یک [نام محصول] بساز که به [کاربر هدف] کمک می‌کند [مشکل] را حل کند.
MVP: ۱.[ویژگی۱] ۲.[ویژگی۲] ۳.[ویژگی۳].
لازم نیست: [موارد حذف‌شده].
Data: جدول [نام] با فیلدهای [لیست].
UI: [سبک]، رنگ اصلی [رنگ].`,
    template: `یک {{product}} بساز که به {{user}} کمک می‌کند {{problem}} را حل کند.
MVP: {{features}}.
لازم نیست: {{excluded}}.
Data: {{data}}.
UI: {{style}}, رنگ اصلی {{color}}.`,
    variables: ['product', 'user', 'problem', 'features', 'excluded', 'data', 'style', 'color'],
  },
  {
    id: 'dev-002', builtin: true, category: 'development', model: 'Cursor',
    title: 'دیباگ گام‌به‌گام',
    tags: ['debug', 'troubleshooting'],
    content: `خطا: [متن کامل خطا + stack trace].
زمینه: [زبان/فریم‌ورک، نسخه].
انتظار: [چه می‌خواستم].
واقعیت: [چه شد].
کد: [کد مرتبط].
علت ریشه‌ای را توضیح بده، راه‌حل بده، و بگو چطور تأیید کنم.`,
    template: `خطا: {{error}}.
زمینه: {{context}}.
انتظار: {{expected}}.
واقعیت: {{actual}}.
کد: {{code}}.
علت ریشه‌ای را توضیح بده، راه‌حل بده، و بگو چطور تأیید کنم.`,
    variables: ['error', 'context', 'expected', 'actual', 'code'],
  },
  {
    id: 'dev-003', builtin: true, category: 'development', model: 'Claude Code',
    title: 'بازبینی کد',
    tags: ['review', 'quality'],
    content: `نقش: مهندس ارشد [زبان].
کد زیر را بازبینی کن.
برای هر مسئله: شدت (بحرانی/عمده/جزئی)، خط، چرا مهم است، نسخه‌ی اصلاح‌شده.
کل فایل را بازنویسی نکن مگر ضروری باشد.`,
    template: `نقش: مهندس ارشد {{language}}.
کد زیر را بازبینی کن:
{{code}}
برای هر مسئله: شدت (بحرانی/عمده/جزئی)، خط، چرا مهم است، نسخه‌ی اصلاح‌شده.
کل فایل را بازنویسی نکن مگر ضروری باشد.`,
    variables: ['language', 'code'],
  },

  // --- پیشرفته (۲) ---
  {
    id: 'adv-001', builtin: true, category: 'advanced', model: 'General',
    title: 'زنجیره راستی‌آزمایی',
    tags: ['verification', 'meta'],
    content: `پاسخ قبلی خودت را نقد کن.
خطاها، فرض‌های نادرست و نقاط ضعف را لیست کن.
سپس نسخه‌ی اصلاح‌شده را بده.`,
    template: `پاسخ قبلی خودت را نقد کن.
خطاها، فرض‌های نادرست و نقاط ضعف را لیست کن.
سپس نسخه‌ی اصلاح‌شده را بده.`,
    variables: [],
  },
  {
    id: 'adv-002', builtin: true, category: 'advanced', model: 'General',
    title: 'قرارداد خروجی',
    tags: ['output-contract', 'format'],
    content: `خروجی را فقط به این فرمت بده:
{ "key1": "...", "key2": ["..."], "key3": 0 }
هیچ متن اضافه‌ای، هیچ توضیحی، فقط JSON معتبر.`,
    template: `خروجی را فقط به این فرمت بده:
{ "{{key1}}": "...", "{{key2}}": ["..."], "{{key3}}": 0 }
هیچ متن اضافه‌ای، هیچ توضیحی، فقط JSON معتبر.`,
    variables: ['key1', 'key2', 'key3'],
  },
];