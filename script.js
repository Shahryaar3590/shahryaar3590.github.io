const permsToCheck = [
  'geolocation', 'notifications', 'camera', 'microphone',
  'clipboard-read', 'clipboard-write', 'persistent-storage'
];

function log(msg) {
  console.log(msg);
}

async function probeAll() {
  const container = document.getElementById('permList');
  for (const name of permsToCheck) {
    try {
      const result = await navigator.permissions.query({ name });
      const div = document.createElement('div');
      div.textContent = `${name}: ${result.state}`;
      container.appendChild(div);
    } catch (e) {
      container.innerHTML += `<div>${name}: پشتیبانی نمی‌شود</div>`;
    }
  }
}

function requestGeo() {
  navigator.geolocation.getCurrentPosition(pos => log('موقعیت دریافت شد'));
}

function requestClipboard() {
  navigator.clipboard.readText().then(text => log('متن کلیپ‌بورد: ' + text));
}

function requestCamera() {
  navigator.mediaDevices.getUserMedia({ video: true }).then(stream => log('دوربین فعال شد'));
}

function exportStatus() {
  const data = {
    ua: navigator.userAgent,
    lang: navigator.language,
    ts: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'browser-permissions.json';
  a.click();
  URL.revokeObjectURL(url);
}

window.onload = probeAll;
