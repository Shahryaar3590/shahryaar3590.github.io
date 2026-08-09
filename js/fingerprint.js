// js/fingerprint.js - تشخیص اثر انگشت

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
