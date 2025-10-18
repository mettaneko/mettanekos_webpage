window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loadingScreen');
    const video = document.getElementById('bgVideo');
    const volumeBtn = document.querySelector('.volume-btn');

    // Небольшая задержка для "эффекта загрузки"
    setTimeout(() => {
        loadingScreen.classList.add('hidden');

        // Попытка включить видео со звуком
        video.muted = false;
        video.play().catch(() => {
            // Если браузер не даёт autoplay со звуком — включаем без звука
            video.muted = true;
            video.play();
            
            // Обновляем состояние кнопки после мьюта
            updateVolumeButtonState(volumeBtn, video);
        });
    }, 1200);

    // Обработчик нажатия на кнопку
    if (volumeBtn) {
        volumeBtn.addEventListener('click', () => {
            // Инвертируем состояние мьюта
            video.muted = !video.muted;
            
            // Обновляем состояние кнопки
            updateVolumeButtonState(volumeBtn, video);
        });
    }

    // Функция обновления состояния кнопки
    function updateVolumeButtonState(button, videoElement) {
        if (!button || !videoElement) return;
        
        // Добавляем/удаляем класс для визуального отражения состояния
        button.classList.toggle('is-muted', videoElement.muted);
        
        // Обновляем атрибут aria-label для доступности
        button.setAttribute('aria-label', videoElement.muted ? 'Unmute' : 'Mute');
    }
});
