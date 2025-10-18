
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loadingScreen');
    const video = document.getElementById('bgVideo');

    // Небольшая задержка для "эффекта загрузки"
    setTimeout(() => {
        loadingScreen.classList.add('hidden');

        // Попытка включить видео со звуком
        video.muted = false;
        video.play().catch(() => {
            // Если браузер не даёт autoplay со звуком — включаем без звука
            video.muted = true;
            video.play();
        });
    }, 1200);
});
