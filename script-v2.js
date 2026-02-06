// اسکریپت جدید - script-v2.js

// متغیرهای global
let cameraStream = null;
let currentTheme = localStorage.getItem('theme') || 'light';

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded - starting initialization...");
    // تم تاریک
    initDarkMode();
    
    // بررسی مجوزها
    checkAllPermissions();
    console.log("Checking permissions...");
    
    // نمایش اطلاعات اولیه
    showSystemInfo();
    console.log("Showing system info...");
    
    // رویدادها
    document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);
    
    console.log('نسخه پیشرفته بارگذاری شد!');
});

// مدیریت تم تاریک
function initDarkMode() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateDarkModeButton();
}

function toggleDarkMode() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateDarkModeButton();
    showSuccess(`تم ${currentTheme === 'dark' ? 'تاریک' : 'روشن'} فعال شد`);
}

function updateDarkModeButton() {
    const button = document.getElementById('darkModeToggle');
    button.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
}

// بررسی مجوزها
async function checkAllPermissions() {
    const permissions = [
        { name: 'geolocation', description: 'موقعیت مکانی' },
        { name: 'camera', description: 'دوربین' },
        { name: 'microphone', description: 'میکروفون' },
        { name: 'notifications', description: 'اعلان‌ها' },
        { name: 'clipboard-read', description: 'خواندن کلیپ‌بورد' },
        { name: 'clipboard-write', description: 'نوشتن کلیپ‌بورد' }
    ];
    
    const permList = document.getElementById('permList');
    permList.innerHTML = '';
    
    for (const perm of permissions) {
        try {
            const result = await navigator.permissions.query({ name: perm.name });
            const statusText = getStatusText(result.state);
            
            const permItem = document.createElement('div');
            permItem.className = 'permission-item';
            permItem.innerHTML = `
                <div class="permission-name">${perm.description}</div>
                <div class="permission-status status-${result.state}">${statusText}</div>
            `;
            permList.appendChild(permItem);
        } catch (error) {
            console.log(`Permission ${perm.name} not supported`);
        }
    }
}

function getStatusText(state) {
    const statusMap = {
        'granted': 'مجاز',
        'denied': 'مسدود',
        'prompt': 'نیاز به تایید'
    };
    return statusMap[state] || state;
}

// درخواست موقعیت
async function requestGeo() {
    const button = event?.target || document.querySelector('[onclick="requestGeo()"]');
    const originalText = button.innerHTML;
    showLoading(button);
    
    if (!navigator.geolocation) {
        showError('مرورگر شما از موقعیت‌یابی پشتیبانی نمی‌کند');
        hideLoading(button, originalText);
        return;
    }
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            showSuccess(`موقعیت دریافت شد: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            hideLoading(button, originalText);
        },
        (error) => {
            const errorMessages = {
                1: 'دسترسی رد شد',
                2: 'موقعیت در دسترس نیست',
                3: 'زمان درخواست به پایان رسید'
            };
            showError(errorMessages[error.code] || 'خطا در دریافت موقعیت');
            hideLoading(button, originalText);
        },
        { enableHighAccuracy: true, timeout: 10000 }
    );
}

// درخواست کلیپ‌بورد
async function requestClipboard() {
    const button = event?.target || document.querySelector('[onclick="requestClipboard()"]');
    const originalText = button.innerHTML;
    showLoading(button);
    
    try {
        const text = await navigator.clipboard.readText();
        showSuccess(`محتویات کلیپ‌بورد: ${text.substring(0, 50)}...`);
    } catch (error) {
        showError('دسترسی به کلیپ‌بورد رد شد یا پشتیبانی نمی‌شود');
    } finally {
        hideLoading(button, originalText);
    }
}

// درخواست دوربین
async function requestCamera() {
    const button = event?.target || document.querySelector('[onclick="requestCamera()"]');
    const originalText = button.innerHTML;
    showLoading(button);
    
    try {
        if (cameraStream) {
            stopCamera();
        }
        
        const constraints = {
            video: {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                facingMode: "user"
            }
        };
        
        cameraStream = await navigator.mediaDevices.getUserMedia(constraints);
        const video = document.getElementById('cameraView');
        video.srcObject = cameraStream;
        
        showSuccess('دوربین فعال شد');
    } catch (error) {
        showError('دسترسی به دوربین رد شد یا پشتیبانی نمی‌شود');
    } finally {
        hideLoading(button, originalText);
    }
}

function stopCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
        document.getElementById('cameraView').srcObject = null;
        showSuccess('دوربین متوقف شد');
    }
}

// نمایش اطلاعات سیستم
    const data = collectAllData();
    
    switch(format) {
        case 'json':
            downloadJSON(data, 'browser-info.json');
            break;
        case 'txt':
            downloadTXT(data, 'browser-info.txt');
            break;
        case 'csv':
            downloadCSV(data, 'browser-info.csv');
            break;
    }
}

function collectAllData() {
    return {
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        permissions: getPermissionsStatus(),
        systemInfo: getSystemInfo()
    };
}

function getPermissionsStatus() {
    const permissions = [];
    const permItems = document.querySelectorAll('.permission-item');
    
    permItems.forEach(item => {
        const name = item.querySelector('.permission-name').textContent;
        const status = item.querySelector('.permission-status').textContent;
        permissions.push({ name, status });
    });
    
    return permissions;
}

function getSystemInfo() {
    return {
        platform: navigator.platform,
        language: navigator.language,
        screen: `${screen.width}x${screen.height}`,
        online: navigator.onLine,
        theme: currentTheme
    };
}

function downloadJSON(data, filename) {
    const json = JSON.stringify(data, null, 2);
    downloadFile(json, filename, 'application/json');
    showSuccess('فایل JSON دانلود شد');
}

function downloadTXT(data, filename) {
    let text = `گزارش اطلاعات مرورگر\n`;
    text += `تاریخ تولید: ${new Date().toLocaleString('fa-IR')}\n\n`;
    
    for (const [key, value] of Object.entries(data)) {
        if (typeof value === 'object') {
            text += `${key}:\n`;
            for (const [subKey, subValue] of Object.entries(value)) {
                text += `  ${subKey}: ${subValue}\n`;
            }
        } else {
            text += `${key}: ${value}\n`;
        }
    }
    
    downloadFile(text, filename, 'text/plain');
    showSuccess('فایل TXT دانلود شد');
}

function downloadCSV(data, filename) {
    let csv = 'کلید,مقدار\n';
    
    for (const [key, value] of Object.entries(data)) {
        if (typeof value === 'object') {
            csv += `${key},"${JSON.stringify(value).replace(/"/g, '""')}"\n`;
        } else {
            csv += `${key},"${value}"\n`;
        }
    }
    
    downloadFile(csv, filename, 'text/csv');
    showSuccess('فایل CSV دانلود شد');
}

function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// مدیریت notifications
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const colors = {
        success: '#48bb78',
        error: '#f56565',
        warning: '#ed8936',
        info: '#4299e1'
    };
    
    notification.style.background = colors[type] || colors.info;
    notification.textContent = message;
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

function showSuccess(message) {
    showNotification(`✅ ${message}`, 'success');
}

function showError(message) {
    showNotification(`❌ ${message}`, 'error');
}

function showWarning(message) {
    showNotification(`⚠️ ${message}`, 'warning');
}

// مدیریت loading
function showLoading(button) {
    button.setAttribute('data-original', button.innerHTML);
    button.innerHTML = '<span class="loader"></span> در حال پردازش...';
    button.disabled = true;
}

function hideLoading(button, originalText) {
    button.innerHTML = originalText || button.getAttribute('data-original');
    button.disabled = false;
}

// نمایش اطلاعات سیستم (نسخه بهبود یافته)
function showSystemInfo() {
    const info = {
        '👤 مرورگر': navigator.userAgent.split(') ')[0] + ')',
        '💻 سیستم عامل': navigator.platform,
        '🌍 زبان': navigator.language,
        '🍪 کوکی‌ها': navigator.cookieEnabled ? '✅ فعال' : '❌ غیرفعال',
        '📡 وضعیت اتصال': navigator.onLine ? '✅ آنلاین' : '❌ آفلاین',
        '🖥️ رزولوشن صفحه': `${screen.width} × ${screen.height} پیکسل`,
        '🎨 عمق رنگ': `${screen.colorDepth} بیت`,
        '⚡ هسته‌های CPU': navigator.hardwareConcurrency || 'نامشخص',
        '💾 حافظه (تقریبی)': (navigator.deviceMemory || 'نامشخص') + ' گیگابایت',
        '👆 صفحه لمسی': navigator.maxTouchPoints > 0 ? '✅ دارد' : '❌ ندارد',
        '🕐 منطقه زمانی': Intl.DateTimeFormat().resolvedOptions().timeZone,
        '📅 زمان محلی': new Date().toLocaleString('fa-IR'),
        '🔗 آدرس سایت': window.location.href
    };
    
    const output = document.getElementById('infoOutput');
    let html = '<div class="info-grid">';
    
    for (const [key, value] of Object.entries(info)) {
        html += `
            <div class="info-item">
                <span class="info-key">${key}</span>
                <span class="info-value">${value}</span>
            </div>
        `;
    }
    
    html += '</div>';
    output.innerHTML = html;
    showSuccess('✅ اطلاعات سیستم با موفقیت بارگذاری شد');
}

// اضافه کردن استایل برای نمایش بهتر
const style = document.createElement('style');
style.textContent = `
    .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 10px;
        margin-top: 15px;
    }
    .info-item {
        background: rgba(0,0,0,0.05);
        padding: 10px;
        border-radius: 8px;
        border-right: 4px solid #667eea;
    }
    .info-key {
        font-weight: bold;
        color: #4a5568;
        display: block;
    }
    .info-value {
        color: #2d3748;
        display: block;
        margin-top: 5px;
        word-break: break-all;
    }
`;
document.head.appendChild(style);
