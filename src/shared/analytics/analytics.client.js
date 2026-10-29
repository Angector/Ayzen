const ENDPOINT = '/api/analytics';
const QUEUE_KEY = 'pcc_analytics_queue';
const FLUSH_INTERVAL = 5000;

let queue = [];
try {
  queue = JSON.parse(sessionStorage.getItem(QUEUE_KEY) || '[]');
} catch {
  queue = [];
}

export function track(event, props = {}) {
  queue.push({
    event,
    props,
    ts: Date.now(),
    path: location.pathname,
  });
  try {
    sessionStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch {
    // sessionStorage ممکن است پر باشد — نادیده بگیر
  }
}

export function flush() {
  if (!queue.length) return;
  const payload = queue.splice(0, queue.length);
  try {
    sessionStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch {}

  // اگر endpoint وجود نداشت، بی‌صدا نادیده بگیر
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(ENDPOINT, JSON.stringify(payload));
    } else {
      fetch(ENDPOINT, {
        method: 'POST',
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // analytics نباید هیچ‌وقت اپ را بشکند
  }
}

setInterval(flush, FLUSH_INTERVAL);

window.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') flush();
});