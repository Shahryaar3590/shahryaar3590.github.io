// js/report.js - گزارش‌گیری و اطلاعات سیستم

import { logMessage } from './apis.js';

export function exportStatus() {
    const data = {
        meta: {
            ua: navigator.userAgent,
            lang: navigator.language,
            platform: navigator.platform,
            ts: new Date().toISOString()
        },
        localStorage: Object.fromEntries(Object.entries(localStorage))
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'browser-permissions.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    logMessage('Exported JSON');
}

export async function showSystemInfo() {
    const output = document.getElementById('infoOutput');
    if (!output) return;
    
    output.innerHTML = "<strong>در حال بررسی...</strong><br>";
    
    // اطلاعات پایه
    output.innerHTML += `🧠 User Agent: ${navigator.userAgent}<br>`;
    output.innerHTML += `🌐 زبان مرورگر: ${navigator.language}<br>`;
    output.innerHTML += `📱 پلتفرم: ${navigator.platform}<br>`;
    output.innerHTML += `📏 اندازه صفحه: ${window.innerWidth}x${window.innerHeight}<br>`;
    output.innerHTML += `📡 آنلاین هست؟ ${navigator.onLine ? "بله" : "خیر"}<br>`;
    
    // IP عمومی
    try {
        const ipRes = await fetch("https://api.ipify.org?format=json");
        const ipData = await ipRes.json();
        output.innerHTML += `🌍 IP عمومی: ${ipData.ip}<br>`;
    } catch {
        output.innerHTML += `🌍 IP عمومی: قابل دریافت نیست<br>`;
    }
    
    // اطلاعات باتری
    if ('getBattery' in navigator) {
        try {
            const battery = await navigator.getBattery();
            output.innerHTML += `🔋 شارژ باتری: ${Math.round(battery.level * 100)}%<br>`;
            output.innerHTML += `⚡ در حال شارژ: ${battery.charging ? "بله" : "خیر"}<br>`;
        } catch {
            output.innerHTML += `🔋 اطلاعات باتری: قابل دریافت نیست<br>`;
        }
    }
    
    // اطلاعات اتصال
    if ('connection' in navigator) {
        const conn = navigator.connection;
        output.innerHTML += `📶 نوع اتصال: ${conn.effectiveType}<br>`;
        output.innerHTML += `📥 سرعت تقریبی: ${conn.downlink} Mbps<br>`;
    } else {
        output.innerHTML += `📶 اطلاعات اتصال: قابل دریافت نیست<br>`;
    }
    
    // Canvas Fingerprint
    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = 'top';
        ctx.font = '16px sans-serif';
        ctx.fillStyle = '#f60';
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = '#069';
        ctx.fillText('FingerprintTest', 2, 15);
        ctx.fillStyle = 'rgba(102,204,0,0.7)';
        ctx.fillText('FingerprintTest', 4, 17);
        const fp = canvas.toDataURL().substring(0, 80);
        output.innerHTML += `🖼️ Canvas Fingerprint: ${fp}<br>`;
    } catch {
        output.innerHTML += `🖼️ Canvas Fingerprint: قابل دریافت نیست<br>`;
    }
}

export function getCanvasFingerprint() {
    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = 'top';
        ctx.font = '16px sans-serif';
        ctx.fillStyle = '#f60';
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = '#069';
        ctx.fillText('FingerprintTest', 2, 15);
        ctx.fillStyle = 'rgba(102,204,0,0.7)';
        ctx.fillText('FingerprintTest', 4, 17);
        return canvas.toDataURL().substring(0, 80);
    } catch (e) {
        return 'unknown';
    }
}

export async function getAudioFingerprint() {
    try {
        const audioCtx = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(1, 44100, 44100);
        const osc = audioCtx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(10000, audioCtx.currentTime);
        const comp = audioCtx.createDynamicsCompressor();
        osc.connect(comp);
        comp.connect(audioCtx.destination);
        osc.start(0);
        const buf = await audioCtx.startRendering();
        return buf.getChannelData(0).slice(0, 10).join(',');
    } catch (e) {
        return 'unknown';
    }
}
