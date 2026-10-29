export async function registerServiceWorker({ onUpdateAvailable } = {}) {
  if (!('serviceWorker' in navigator)) return null;

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });

    registration.update();

    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (!newWorker) return;

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          onUpdateAvailable?.(() => {
            newWorker.postMessage({ type: 'SKIP_WAITING' });
          });
        }
      });
    });

    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      location.reload();
    });

    return registration;
  } catch (err) {
    console.error('[pwa] registration failed', err);
    return null;
  }
}

export function watchConnectivity(onChange) {
  const emit = () => onChange?.(navigator.onLine);
  window.addEventListener('online', emit);
  window.addEventListener('offline', emit);
  emit();
}