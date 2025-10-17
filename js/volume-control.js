document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('bgVideo');
    const volumeToggle = document.getElementById('volumeToggle');

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