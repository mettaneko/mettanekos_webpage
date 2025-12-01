// Load saved theme from localStorage
const savedTheme = localStorage.getItem("theme") || "default";
const savedMuted = localStorage.getItem("videoMuted") === "true";

document.documentElement.setAttribute("data-theme", savedTheme);

// Apply theme function
export function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    updateBackgroundVideo(theme);
}

// Theme list
const themes = ["default", "raven", "higuruma"];

// Cycle through themes
export function cycleTheme() {
    const current = document.documentElement.getAttribute("data-theme");
    const index = themes.indexOf(current);
    const next = themes[(index + 1) % themes.length];
    setTheme(next);
}

// Load saved video on page load
document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("themeToggle");
    if (btn) {
        btn.addEventListener("click", cycleTheme);
    }
    
    // Загружаем сохраненное видео при загрузке страницы
    loadSavedVideo();
});

function loadSavedVideo() {
    const savedTheme = localStorage.getItem("theme") || "default";
    const savedMuted = localStorage.getItem("videoMuted") === "true";
    const video = document.getElementById("bgVideo");
    if (!video) return;

    // Устанавливаем видео для сохраненной темы
    const source = video.querySelector("source");
    source.src = `../assets/${savedTheme}.mp4`;
    video.load();
    
    // Применяем сохраненное состояние звука
    video.muted = savedMuted;
    
    // Обновляем кнопку звука
    const volumeBtn = document.getElementById("volumeToggle");
    if (volumeBtn) {
        updateVolumeButton(volumeBtn, savedMuted);
    }
    
    // После загрузки страницы пытаемся воспроизвести
    setTimeout(() => {
        video.play().catch(() => {
            // Если автоплей заблокирован, пробуем с выключенным звуком
            video.muted = true;
            video.play();
        });
    }, 100);
}

function updateBackgroundVideo(theme) {
    const video = document.getElementById("bgVideo");
    if (!video) return;

    // Сохраняем текущее состояние звука
    const wasMuted = video.muted;
    
    // начинаем fade-out
    video.classList.add("fade-out");

    setTimeout(() => {
        // меняем видео после исчезновения
        const source = video.querySelector("source");
        source.src = `../assets/${theme}.mp4`;
        video.load();

        // Восстанавливаем состояние звука
        video.muted = wasMuted;
        
        video.play().catch(() => {});

        // плавно возвращаем после смены
        video.classList.remove("fade-out");
    }, 600);
}

function updateVolumeButton(button, isMuted) {
    if (isMuted) {
        button.classList.add("is-muted");
    } else {
        button.classList.remove("is-muted");
    }
}