function log(msg) {
  console.log(msg);
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

async function showSystemInfo() {
  const output = document.getElementById('infoOutput');
  output.innerHTML = "<strong>در حال بررسی...</strong><br>";

  output.innerHTML += `🧠 User Agent: ${navigator.userAgent}<br>`;
  output.innerHTML += `🌐 زبان مرورگر: ${navigator.language}<br>`;
  output.innerHTML += `📱 پلتفرم: ${navigator.platform}<br>`;
  output.innerHTML += `📏 اندازه صفحه: ${window.innerWidth}x${window.innerHeight}<br>`;
  output.innerHTML += `📡 آنلاین هست؟ ${navigator.onLine ? "بله" : "خیر"}<br>`;

  try {
    const ipRes = await fetch("https://api.ipify.org?format=json");
    const ipData = await ipRes.json();
    output.innerHTML += `🌍 IP عمومی: ${ipData.ip}<br>`;
  } catch {
    output.innerHTML += `🌍 IP عمومی: قابل دریافت نیست<br>`;
  }

  if ('getBattery' in navigator) {
    try {
      const battery = await navigator.getBattery();
      output.innerHTML += `🔋 شارژ باتری: ${Math.round(battery.level * 100)}%<br>`;
      output.innerHTML += `⚡ در حال شارژ: ${battery.charging ? "بله" : "خیر"}<br>`;
    } catch {
      output.innerHTML += `🔋 اطلاعات باتری: قابل دریافت نیست<br>`;
    }
  }

  if ('connection' in navigator) {
    const conn = navigator.connection;
    output.innerHTML += `📶 نوع اتصال: ${conn.effectiveType}<br>`;
    output.innerHTML += `📥 سرعت تقریبی: ${conn.downlink} Mbps<br>`;
  } else {
    output.innerHTML += `📶 اطلاعات اتصال: قابل دریافت نیست<br>`;
  }

  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.fillText('FingerprintTest', 2, 15);
    const fp = canvas.toDataURL().substring(0, 80);
    output.innerHTML += `🖼️ Canvas Fingerprint: ${fp}<br>`;
  } catch {
    output.innerHTML += `🖼️ Canvas Fingerprint: قابل دریافت نیست<br>`;
  }
}
