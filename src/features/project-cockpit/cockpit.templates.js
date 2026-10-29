export const PROJECT_TEMPLATES = {
  website: {
    title: '🌐 ساخت سایت',
    tasks: [
      { title: 'تعریف نیازمندی‌ها', status: 'backlog' },
      { title: 'طراحی UI', status: 'backlog' },
      { title: 'انتخاب استک', status: 'backlog' },
      { title: 'ساخت صفحه اصلی', status: 'backlog' },
      { title: 'فرم تماس', status: 'backlog' },
      { title: 'تست', status: 'backlog' },
      {
        title: 'انتشار',
        status: 'backlog',
        isMilestone: true,
        end: new Date(Date.now() + 14 * 864e5).toISOString().slice(0, 10),
      },
    ],
  },
  video: {
    title: '🎬 ساخت ویدیو',
    tasks: [
      { title: 'نوشتن اسکریپت', status: 'backlog' },
      { title: 'استوری‌بورد', status: 'backlog' },
      { title: 'تصویر مرجع', status: 'backlog' },
      { title: 'تولید صحنه‌ها', status: 'backlog' },
      { title: 'صداگذاری', status: 'backlog' },
      {
        title: 'تدوین نهایی',
        status: 'backlog',
        isMilestone: true,
        end: new Date(Date.now() + 10 * 864e5).toISOString().slice(0, 10),
      },
    ],
  },
  mvp: {
    title: '📱 اپ MVP',
    tasks: [
      { title: 'مصاحبه کاربر', status: 'backlog' },
      { title: 'تعریف MVP', status: 'backlog' },
      { title: 'دیتابیس', status: 'backlog' },
      { title: 'API', status: 'backlog' },
      { title: 'توسعه', status: 'backlog' },
      { title: 'تست', status: 'backlog' },
      {
        title: 'انتشار',
        status: 'backlog',
        isMilestone: true,
        end: new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10),
      },
    ],
  },
  blank: { title: '📄 خالی', tasks: [] },
};