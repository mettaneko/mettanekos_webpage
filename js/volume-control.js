document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('bgVideo');
    const volumeToggle = document.getElementById('volumeToggle');
    
    // 1. Инициализация состояния
    // Устанавливаем класс кнопки в соответствии с начальным состоянием видео.
    if (video.muted) {
        volumeToggle.classList.add('is-muted');
    } else {
        volumeToggle.classList.remove('is-muted');
    }

    // 2. Обработчик клика
    volumeToggle.addEventListener('click', function() {
        // Переключаем состояние mute
        video.muted = !video.muted;
        
        // Обновляем класс кнопки в соответствии с новым состоянием
        if (video.muted) {
            volumeToggle.classList.add('is-muted'); // Кнопка "Выключено"
        } else {
            volumeToggle.classList.remove('is-muted'); // Кнопка "Включено"
        }
    });
});