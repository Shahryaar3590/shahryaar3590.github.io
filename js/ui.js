// js/ui.js - مدیریت رابط کاربری

import { permissions, renderPermissions, probeAllPermissions } from './permissions.js';
import { handlePermAction, logMessage } from './apis.js';
import { exportStatus, showSystemInfo, getCanvasFingerprint, getAudioFingerprint } from './report.js';

export function setupEventListeners() {
    // دکمه‌های مجوزها
    document.getElementById('reqGeo')?.addEventListener('click', () => handlePermAction('geolocation'));
    document.getElementById('reqCam')?.addEventListener('click', () => handlePermAction('camera'));
    document.getElementById('reqMic')?.addEventListener('click', () => handlePermAction('microphone'));
    document.getElementById('readClip')?.addEventListener('click', () => handlePermAction('clipboardRead'));
    document.getElementById('writeClip')?.addEventListener('click', () => handlePermAction('clipboardWrite'));
    document.getElementById('openFile')?.addEventListener('click', () => handlePermAction('filesystem'));
    document.getElementById('reqNotif')?.addEventListener('click', () => handlePermAction('notifications'));
    document.getElementById('reqMotion')?.addEventListener('click', () => handlePermAction('motion'));
    document.getElementById('captureScreen')?.addEventListener('click', () => handlePermAction('screenCapture'));
    document.getElementById('webShare')?.addEventListener('click', () => handlePermAction('webShare'));
    document.getElementById('reqWake')?.addEventListener('click', () => handlePermAction('wakeLock'));
    document.getElementById('vibrate')?.addEventListener('click', () => handlePermAction('vibration'));
    document.getElementById('reqBluetooth')?.addEventListener('click', () => handlePermAction('bluetooth'));
    document.getElementById('reqUSB')?.addEventListener('click', () => handlePermAction('usb'));
    document.getElementById('reqSerial')?.addEventListener('click', () => handlePermAction('serial'));
    document.getElementById('reqWebAuthn')?.addEventListener('click', () => handlePermAction('webauthn'));
    document.getElementById('reqPayment')?.addEventListener('click', () => handlePermAction('payment'));
    document.getElementById('reqLock')?.addEventListener('click', () => handlePermAction('locks'));
    document.getElementById('sendBeacon')?.addEventListener('click', () => handlePermAction('beacon'));
    document.getElementById('getCred')?.addEventListener('click', () => handlePermAction('credentials'));
    
    // ذخیره فایل
    document.getElementById('saveFile')?.addEventListener('click', async () => {
        if (window.showSaveFilePicker) {
            try {
                const handle = await window.showSaveFilePicker({ suggestedName: 'privacy-report.txt' });
                const w = await handle.createWritable();
                await w.write('گزارش محرمانگی نمونه');
                await w.close();
                logMessage('file saved');
            } catch (e) {
                logMessage('file save cancelled/failed');
            }
        } else {
            const blob = new Blob(['گزارش نمونه']);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'report.txt';
            a.click();
            URL.revokeObjectURL(url);
            logMessage('download fallback');
        }
    });
    
    // نمایش اعلان
    document.getElementById('showNotif')?.addEventListener('click', () => {
        if (Notification && Notification.permission === 'granted') {
            new Notification('نمونه اعلان', { body: 'این یک اعلان تستی است.' });
        } else {
            alert('ابتدا مجوز اعلان را بدهید.');
        }
    });
    
    // نمایش ذخیره‌سازی
    document.getElementById('showStorage')?.addEventListener('click', () => {
        logMessage('localStorage:', Object.fromEntries(Object.entries(localStorage)));
        try {
            const req = indexedDB.open('privacy_demo', 1);
            req.onsuccess = e => {
                const db = e.target.result;
                const tx = db.transaction('items', 'readonly');
                const store = tx.objectStore('items');
                const r = store.getAll();
                r.onsuccess = () => logMessage('indexedDB items:', r.result);
            };
            req.onerror = () => logMessage('indexedDB open failed');
        } catch (e) {
            logMessage('indexedDB error', e);
        }
    });
    
    // پاک‌سازی ذخیره‌سازی
    document.getElementById('clearStorage')?.addEventListener('click', () => {
        localStorage.clear();
        const d = indexedDB.deleteDatabase('privacy_demo');
        d.onsuccess = () => logMessage('localStorage and indexedDB cleared');
        d.onerror = () => logMessage('failed to delete indexedDB');
    });
    
    // سنسور حرکت
    document.getElementById('stopMotion')?.addEventListener('click', () => {
        window.removeEventListener('deviceorientation', motionHandler);
        logMessage('motion stopped');
    });
    
    // اثر انگشت
    document.getElementById('showFP')?.addEventListener('click', async () => {
        const c = getCanvasFingerprint();
        const a = await getAudioFingerprint();
        logMessage('CanvasFP:', c);
        logMessage('AudioFP:', a);
    });
    
    // توقف ضبط صفحه
    document.getElementById('stopScreen')?.addEventListener('click', () => {
        logMessage('Stop screen capture: stop tracks where active');
    });
    
    // آزادسازی WakeLock
    document.getElementById('releaseWake')?.addEventListener('click', () => {
        if (window._wakeLock) {
            window._wakeLock.release();
            window._wakeLock = null;
            logMessage('WakeLock released (manual)');
            permissions.wakeLock = 'unknown';
            renderPermissions();
        }
    });
    
    // ذخیره Credential
    document.getElementById('storeCred')?.addEventListener('click', async () => {
        try {
            if (navigator.credentials && navigator.credentials.store) {
                const cred = new PasswordCredential({ id: 'user@example.com', password: 'sample' });
                await navigator.credentials.store(cred);
                logMessage('Credential stored (sample)');
            } else {
                logMessage('Credential API unsupported');
            }
        } catch (e) {
            logMessage('storeCred failed', e);
        }
    });
    
    // راهنمای Service Worker
    document.getElementById('swGuide')?.addEventListener('click', () => {
        alert('برای Background Sync و Push نیاز به Service Worker و endpoint سرور دارید. معمولاً باید فایل sw.js را در ریشهٔ سایت تعریف کنید و از PushManager.subscribe در Service Worker استفاده کنید. این پنل فقط راهنما نمایش می‌دهد.');
    });
    
    // دکمه‌های صادرات
    document.getElementById('exportBtn')?.addEventListener('click', exportStatus);
    document.getElementById('exportAll')?.addEventListener('click', exportStatus);
    
    // پاک‌سازی محلی
    document.getElementById('clearAllLocal')?.addEventListener('click', () => {
        localStorage.clear();
        indexedDB.deleteDatabase('privacy_demo');
        logMessage('Cleared local storage and tried to delete indexedDB');
    });
    
    // راهنمای لغو مجوزها
    document.getElementById('revokeInstructions')?.addEventListener('click', () => {
        alert('برای لغو مجوزها: روی قفل کنار آدرس سایت در مرورگر کلیک کنید، یا به settings > site permissions بروید. جاوااسکریپت معمولاً مجوزها را مستقیماً revoke نمی‌کند.');
    });
    
    // رویداد سفارشی برای دکمه‌های مجوزها
    window.addEventListener('permAction', (e) => {
        handlePermAction(e.detail);
    });
}

// تابع مدیریت حرکت
function motionHandler(e) {
    logMessage('deviceorientation alpha/beta/gamma:', e.alpha, e.beta, e.gamma);
}

export function initMotionListener() {
    window.addEventListener('deviceorientation', motionHandler);
}
