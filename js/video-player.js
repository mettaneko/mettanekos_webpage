window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loadingScreen');
    const video = document.getElementById('bgVideo');

    // Проверяем, есть ли уже хэш (пользователь вернулся на страницу)
    if (window.location.hash) {
        // Если хэш уже есть, сразу скрываем плашку и запускаем видео
        loadingScreen.classList.add('hidden');
        startVideoPlayback();
    } else {
        // Если хэша нет, показываем плашку и ждем клика
        const startExperience = () => {
            // Добавляем хэш в URL
            window.location.hash = '#';
            loadingScreen.classList.add('hidden');
            startVideoPlayback();
            
            // Удаляем обработчики после первого клика
            document.removeEventListener('click', startExperience);
            loadingScreen.removeEventListener('click', startExperience);
        };

        // Добавляем обработчики клика
        document.addEventListener('click', startExperience);
        loadingScreen.addEventListener('click', startExperience);
    }

    // Функция для запуска видео
    function startVideoPlayback() {
        video.muted = false;
        video.play().catch((error) => {
            console.log('Autoplay with sound failed, trying muted:', error);
            video.muted = true;
            video.play().catch((error) => {
                console.log('Muted autoplay also failed:', error);
            });
        });
    }
});