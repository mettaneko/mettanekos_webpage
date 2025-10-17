// Управление громкостью фонового видео
document.addEventListener('DOMContentLoaded', function() {
    const bgVideo = document.getElementById('bgVideo');
    const volumeToggle = document.getElementById('volumeToggle');
    const volumeCard = document.querySelector('.volume-card');
    
    // Загрузка сохраненных настроек
    function loadVolumeSettings() {
        const savedMuted = localStorage.getItem('bgVideoMuted');
        
        if (savedMuted !== null) {
            const isMuted = savedMuted === 'true';
            bgVideo.muted = isMuted;
            if (isMuted) {
                volumeCard.classList.add('volume-muted');
            } else {
                volumeCard.classList.remove('volume-muted');
            }
        } else {
            // Значение по умолчанию - звук выключен
            bgVideo.muted = true;
            volumeCard.classList.add('volume-muted');
            
            // Показываем анимацию для нового пользователя
            volumeCard.classList.add('volume-pulse');
            setTimeout(() => {
                volumeCard.classList.remove('volume-pulse');
            }, 6000);
        }
        
        // Размутируем видео для автовоспроизведения
        bgVideo.muted = true;
        setTimeout(() => {
            bgVideo.muted = localStorage.getItem('bgVideoMuted') === 'true';
        }, 1000);
    }
    
    // Сохранение настроек
    function saveVolumeSettings() {
        localStorage.setItem('bgVideoMuted', bgVideo.muted.toString());
    }
    
    // Обработчик переключения звука
    volumeToggle.addEventListener('click', function() {
        if (bgVideo.muted) {
            // Включаем звук
            bgVideo.muted = false;
            volumeCard.classList.remove('volume-muted');
        } else {
            // Выключаем звук
            bgVideo.muted = true;
            volumeCard.classList.add('volume-muted');
        }
        
        saveVolumeSettings();
        
        // Анимация нажатия
        if (window.innerWidth <= 768) {
            // Для мобильных - анимация с учетом transform: translateX(-50%)
            volumeCard.style.transform = 'translateX(-50%) scale(0.95)';
            setTimeout(() => {
                volumeCard.style.transform = 'translateX(-50%) scale(1)';
            }, 150);
        } else {
            // Для десктопа - обычная анимация
            volumeCard.style.transform = 'translateY(-2px) scale(0.95)';
            setTimeout(() => {
                volumeCard.style.transform = 'translateY(-2px) scale(1)';
            }, 150);
        }
    });
    
    // Сохраняем настройки при изменении громкости
    bgVideo.addEventListener('volumechange', function() {
        saveVolumeSettings();
    });
    
    // Инициализация
    loadVolumeSettings();
    
    // Обработка автовоспроизведения
    bgVideo.play().catch(function(error) {
        console.log('Автовоспроизведение заблокировано:', error);
    });
});