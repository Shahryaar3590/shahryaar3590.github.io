// js/permissions.js - مدیریت مجوزها

export const permissions = {
    geolocation: 'unknown',
    camera: 'unknown',
    microphone: 'unknown',
    notifications: 'unknown',
    clipboardRead: 'unknown',
    clipboardWrite: 'unknown',
    filesystem: 'unknown',
    motion: 'unknown',
    storagePersistent: 'unknown',
    screenCapture: 'unknown',
    webShare: 'unknown',
    wakeLock: 'unknown',
    vibration: 'unknown',
    bluetooth: 'unknown',
    usb: 'unknown',
    serial: 'unknown',
    webauthn: 'unknown',
    payment: 'unknown',
    locks: 'unknown',
    beacon: 'unknown',
    credentials: 'unknown'
};

export async function checkPermission(name) {
    try {
        if (!navigator.permissions) return 'unsupported';
        const status = await navigator.permissions.query({ name });
        return status.state;
    } catch (e) {
        return 'unsupported';
    }
}

export async function probeAllPermissions() {
    // فقط مجوزهایی که در navigator.permissions پشتیبانی می‌شوند
    const permNames = [
        'geolocation', 
        'camera', 
        'microphone', 
        'notifications',
        'clipboard-read',  // ← فقط این نسخه
        'clipboard-write'  // ← فقط این نسخه
    ];
    
    for (const name of permNames) {
        const state = await checkPermission(name);
        // نگاشت به کلیدهای ساده‌تر
        if (name === 'clipboard-read') {
            permissions.clipboardRead = state;
        } else if (name === 'clipboard-write') {
            permissions.clipboardWrite = state;
        } else {
            permissions[name] = state;
        }
    }
    
    // سایر قابلیت‌ها
    if (navigator.storage && navigator.storage.persisted) {
        permissions.storagePersistent = await navigator.storage.persisted() ? 'granted' : 'denied';
    }
    
    permissions.filesystem = (window.showOpenFilePicker || window.showSaveFilePicker) ? 'available' : 'unsupported';
    permissions.screenCapture = (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) ? 'available' : 'unsupported';
    permissions.webShare = (navigator.share) ? 'available' : 'unsupported';
    permissions.wakeLock = (navigator.wakeLock) ? 'available' : 'unsupported';
    permissions.bluetooth = (navigator.bluetooth) ? 'available' : 'unsupported';
    permissions.usb = (navigator.usb) ? 'available' : 'unsupported';
    permissions.serial = (navigator.serial) ? 'available' : 'unsupported';
    permissions.webauthn = (window.PublicKeyCredential) ? 'available' : 'unsupported';
    permissions.payment = (window.PaymentRequest) ? 'available' : 'unsupported';
    permissions.locks = (navigator.locks) ? 'available' : 'unsupported';
    permissions.beacon = (navigator.sendBeacon) ? 'available' : 'unsupported';
    permissions.credentials = (navigator.credentials) ? 'available' : 'unsupported';
    permissions.motion = (typeof DeviceMotionEvent !== 'undefined') ? 'available' : 'unsupported';
    
    return permissions;
}

export function renderPermissions(maskSensitive = false) {
    const permList = document.getElementById('permList');
    if (!permList) return;
    
    permList.innerHTML = '';
    for (const [key, state] of Object.entries(permissions)) {
        const row = document.createElement('div');
        row.className = 'perm';
        
        const displayState = maskSensitive && ['clipboardRead', 'clipboardWrite', 'filesystem'].includes(key) 
            ? '🔒 مخفی' 
            : state;
        
        row.innerHTML = `
            <div class="meta">
                <span class="chip ${state === 'granted' || state === 'available' ? 'granted' : 'denied'}">
                    ${key.charAt(0).toUpperCase()}
                </span>
                <div>
                    <strong>${key}</strong>
                    <div style="font-size:12px;color:${state === 'granted' || state === 'available' ? '#bfe6d8' : 'var(--muted)'}">
                        ${displayState}
                    </div>
                </div>
            </div>
            <button onclick="window.dispatchEvent(new CustomEvent('permAction', {detail: '${key}'}))">
                عملیات
            </button>
        `;
        permList.appendChild(row);
    }
}
