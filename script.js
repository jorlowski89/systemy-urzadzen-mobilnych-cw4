window.addEventListener('load', () => {
  const status = document.getElementById('net-status');
  if (status) {
    status.textContent = navigator.onLine ? 'Online' : 'Offline';
    window.addEventListener('online', () => (status.textContent = 'Online'));
    window.addEventListener('offline', () => (status.textContent = 'Offline'));
  }
});
