// js/apis.js - مدیریت APIهای مختلف

import { permissions, renderPermissions } from './permissions.js';

const logEl = document.getElementById('log');

export function logMessage(...args) {
    const s = args.map(a => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ');
    if (logEl) {
        logEl.textContent = new Date().toLocaleTimeString() + ' — ' + s + '                  ' + logEl.textContent;
    }
    console.log(s);
}

export async function handlePermAction(key) {
    try {
        switch(key) {
            case 'geolocation':
                navigator.geolocation.getCurrentPosition(
                    pos => {
                        logMessage('Geolocation:', pos.coords.latitude, pos.coords.longitude);
                        permissions.geolocation = 'granted';
                        renderPermissions();
                    },
                    err => {
                        logMessage('Geolocation denied');
                        permissions.geolocation = 'denied';
                        renderPermissions();
                    }
                );
                break;
                
            case 'camera':
                try {
                    const s = await navigator.mediaDevices.getUserMedia({ video: true });
                    logMessage('Camera stream started');
                    s.getTracks().forEach(t => t.stop());
                    permissions.camera = 'granted';
                    renderPermissions();
                } catch (e) {
                    logMessage('Camera denied');
                    permissions.camera = 'denied';
                    renderPermissions();
                }
                break;
                
            case 'microphone':
                try {
                    const s = await navigator.mediaDevices.getUserMedia({ audio: true });
                    logMessage('Microphone started');
                    s.getTracks().forEach(t => t.stop());
                    permissions.microphone = 'granted';
                    renderPermissions();
                } catch (e) {
                    logMessage('Microphone denied');
                    permissions.microphone = 'denied';
                    renderPermissions();
                }
                break;
                
            case 'clipboardRead':
                try {
                    const text = await navigator.clipboard.readText();
                    logMessage('Clipboard read:', text);
                    permissions.clipboardRead = 'granted';
                    renderPermissions();
                } catch (e) {
                    logMessage('Clipboard read failed');
                    permissions.clipboardRead = 'denied';
                    renderPermissions();
                }
                break;
                
            case 'clipboardWrite':
                try {
                    await navigator.clipboard.writeText('نمونه از رابط');
                    logMessage('Clipboard write OK');
                    permissions.clipboardWrite = 'granted';
                    renderPermissions();
                } catch (e) {
                    logMessage('Clipboard write failed');
                    permissions.clipboardWrite = 'denied';
                    renderPermissions();
                }
                break;
                
            case 'filesystem':
                if (window.showOpenFilePicker) {
                    try {
                        const [handle] = await window.showOpenFilePicker();
                        const file = await handle.getFile();
                        const text = await file.text();
                        logMessage('File opened, length:', text.length);
                        permissions.filesystem = 'granted';
                        renderPermissions();
                    } catch (e) {
                        logMessage('File open cancelled or denied');
                        permissions.filesystem = 'denied';
                        renderPermissions();
                    }
                } else {
                    logMessage('File System API unsupported');
                }
                break;
                
            case 'notifications':
                try {
                    const permission = await Notification.requestPermission();
                    permissions.notifications = permission;
                    renderPermissions();
                    logMessage('Notifications permission:', permission);
                } catch (e) {
                    logMessage('Notifications request failed');
                    permissions.notifications = 'denied';
                    renderPermissions();
                }
                break;
                
            case 'storagePersistent':
                if (navigator.storage && navigator.storage.persist) {
                    const ok = await navigator.storage.persist();
                    permissions.storagePersistent = ok ? 'granted' : 'denied';
                    renderPermissions();
                    logMessage('persistent storage:', ok);
                } else {
                    logMessage('Persistent Storage unsupported');
                }
                break;
                
            case 'screenCapture':
                try {
                    const s = await navigator.mediaDevices.getDisplayMedia({ video: true });
                    logMessage('Screen capture started');
                    s.getTracks().forEach(t => t.stop());
                    permissions.screenCapture = 'granted';
                    renderPermissions();
                } catch (e) {
                    logMessage('Screen capture failed/denied');
                    permissions.screenCapture = 'denied';
                    renderPermissions();
                }
                break;
                
            case 'webShare':
                try {
                    await navigator.share({ title: 'نمونه', text: 'اشتراک از طریق Web Share', url: location.href });
                    logMessage('Shared via Web Share');
                    permissions.webShare = 'granted';
                    renderPermissions();
                } catch (e) {
                    logMessage('Web Share cancelled/unsupported');
                    permissions.webShare = 'denied';
                    renderPermissions();
                }
                break;
                
            case 'wakeLock':
                try {
                    if (navigator.wakeLock) {
                        window._wakeLock = await navigator.wakeLock.request('screen');
                        logMessage('WakeLock acquired');
                        permissions.wakeLock = 'granted';
                        renderPermissions();
                        window._wakeLock.addEventListener('release', () => {
                            logMessage('WakeLock released');
                            permissions.wakeLock = 'unknown';
                            renderPermissions();
                        });
                    } else {
                        logMessage('WakeLock unsupported');
                        permissions.wakeLock = 'unsupported';
                        renderPermissions();
                    }
                } catch (e) {
                    logMessage('WakeLock error', e);
                    permissions.wakeLock = 'denied';
                    renderPermissions();
                }
                break;
                
            case 'vibration':
                try {
                    if (navigator.vibrate) {
                        navigator.vibrate([200, 100, 200]);
                        logMessage('Vibration called');
                        permissions.vibration = 'granted';
                        renderPermissions();
                    } else {
                        logMessage('Vibration unsupported');
                        permissions.vibration = 'unsupported';
                        renderPermissions();
                    }
                } catch (e) {
                    logMessage('Vibration failed', e);
                    permissions.vibration = 'denied';
                    renderPermissions();
                }
                break;
                
            case 'bluetooth':
                try {
                    const device = await navigator.bluetooth.requestDevice({ acceptAllDevices: true });
                    logMessage('Bluetooth device:', device.name || 'unknown');
                    permissions.bluetooth = 'granted';
                    renderPermissions();
                } catch (e) {
                    logMessage('Bluetooth request cancelled/failed');
                    permissions.bluetooth = 'denied';
                    renderPermissions();
                }
                break;
                
            case 'usb':
                try {
                    const dev = await navigator.usb.requestDevice({ filters: [] });
                    logMessage('USB device:', dev.productName || 'unknown');
                    permissions.usb = 'granted';
                    renderPermissions();
                } catch (e) {
                    logMessage('USB request cancelled/failed');
                    permissions.usb = 'denied';
                    renderPermissions();
                }
                break;
                
            case 'serial':
                try {
                    const port = await navigator.serial.requestPort();
                    logMessage('Serial port acquired');
                    permissions.serial = 'granted';
                    renderPermissions();
                } catch (e) {
                    logMessage('Serial request cancelled/failed');
                    permissions.serial = 'denied';
                    renderPermissions();
                }
                break;
                
            case 'webauthn':
                try {
                    if (window.PublicKeyCredential) {
                        const challenge = Uint8Array.from(window.crypto.getRandomValues(new Uint8Array(32)));
                        const publicKey = {
                            challenge,
                            rp: { name: 'Example' },
                            user: { id: Uint8Array.from([1, 2, 3, 4]), name: 'user@example.com', displayName: 'User' },
                            pubKeyCredParams: [{ type: 'public-key', alg: -7 }]
                        };
                        const cred = await navigator.credentials.create({ publicKey });
                        logMessage('WebAuthn created:', !!cred);
                        permissions.webauthn = 'granted';
                        renderPermissions();
                    } else {
                        logMessage('WebAuthn unsupported');
                        permissions.webauthn = 'unsupported';
                        renderPermissions();
                    }
                } catch (e) {
                    logMessage('WebAuthn error', e);
                    permissions.webauthn = 'denied';
                    renderPermissions();
                }
                break;
                
            case 'payment':
                try {
                    if (window.PaymentRequest) {
                        const methodData = [{ supportedMethods: 'basic-card' }];
                        const details = { total: { label: 'Total', amount: { currency: 'USD', value: '0.01' } } };
                        const req = new PaymentRequest(methodData, details);
                        const resp = await req.show();
                        await resp.complete('fail');
                        logMessage('Payment dialog shown');
                        permissions.payment = 'granted';
                        renderPermissions();
                    } else {
                        logMessage('PaymentRequest unsupported');
                        permissions.payment = 'unsupported';
                        renderPermissions();
                    }
                } catch (e) {
                    logMessage('Payment failed/cancelled');
                    permissions.payment = 'denied';
                    renderPermissions();
                }
                break;
                
            case 'locks':
                try {
                    if (navigator.locks) {
                        await navigator.locks.request('demo-lock', async () => {
                            logMessage('lock held');
                            await new Promise(r => setTimeout(r, 500));
                        });
                        logMessage('Locks API used');
                        permissions.locks = 'granted';
                        renderPermissions();
                    } else {
                        logMessage('Locks unsupported');
                        permissions.locks = 'unsupported';
                        renderPermissions();
                    }
                } catch (e) {
                    logMessage('Locks error', e);
                    permissions.locks = 'denied';
                    renderPermissions();
                }
                break;
                
            case 'beacon':
                try {
                    const ok = navigator.sendBeacon && navigator.sendBeacon('/beacon-endpoint', JSON.stringify({ t: Date.now() }));
                    logMessage('sendBeacon result:', !!ok);
                    permissions.beacon = ok ? 'sent' : 'unsupported';
                    renderPermissions();
                } catch (e) {
                    logMessage('Beacon failed', e);
                    permissions.beacon = 'denied';
                    renderPermissions();
                }
                break;
                
            case 'credentials':
                try {
                    if (navigator.credentials) {
                        const c = await navigator.credentials.get({ password: true });
                        logMessage('Credential fetched:', !!c);
                        permissions.credentials = 'granted';
                        renderPermissions();
                    } else {
                        logMessage('Credentials unsupported');
                        permissions.credentials = 'unsupported';
                        renderPermissions();
                    }
                } catch (e) {
                    logMessage('Credentials error', e);
                    permissions.credentials = 'denied';
                    renderPermissions();
                }
                break;
                
            default:
                logMessage('Unknown action:', key);
        }
    } catch (e) {
        logMessage('action exception', e);
    }
}
