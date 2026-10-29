let deferredPrompt = null;

export function setupInstallPrompt({ onAvailable, onInstalled } = {}) {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    onAvailable?.(() => promptInstall());
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    onInstalled?.();
  });
}

export async function promptInstall() {
  if (!deferredPrompt) return false;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  deferredPrompt = null;
  return outcome === 'accepted';
}

export function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );
}