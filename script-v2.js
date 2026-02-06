// اسکریپت ساده‌تر برای تست

console.log("Script loaded!");

// نمایش اطلاعات سیستم
function showSystemInfo() {
    console.log("showSystemInfo called");
    const info = {
        'مرورگر': navigator.userAgent.substring(0, 50) + '...',
        'سیستم عامل': navigator.platform,
        'زبان': navigator.language,
        'آنلاین': navigator.onLine ? 'بله' : 'خیر'
    };
    
    const output = document.getElementById('infoOutput');
    if (output) {
        let html = '';
        for (const [key, value] of Object.entries(info)) {
            html += `<strong>${key}:</strong> ${value}<br>`;
        }
        output.innerHTML = html;
        alert('اطلاعات سیستم نمایش داده شد!');
    } else {
        console.error("Element #infoOutput not found!");
    }
}

// بررسی مجوزهای ساده
function checkAllPermissions() {
    console.log("checkAllPermissions called");
    const permissions = ['geolocation', 'camera', 'microphone'];
    const permList = document.getElementById('permList');
    
    if (permList) {
        permList.innerHTML = permissions.map(perm => 
            `<div>${perm}: در حال بررسی...</div>`
        ).join('');
    }
}

// وقتی صفحه لود شد
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded");
    checkAllPermissions();
    showSystemInfo();
});

// دکمه‌های ساده
function requestGeo() {
    alert('درخواست موقعیت مکانی');
}

function requestCamera() {
    alert('درخواست دوربین');
}

function requestClipboard() {
    alert('درخواست کلیپ‌بورد');
}
