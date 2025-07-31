document.addEventListener('DOMContentLoaded', () => {
    // ВАЖНО: STEAM_API_KEY и STEAM_ID_64 больше НЕ нужны здесь,
    // так как они теперь безопасно хранятся на вашем прокси-сервере Vercel.
    // const STEAM_API_KEY = 'ВАШ_STEAM_API_КЛЮЧ';
    // const STEAM_ID_64 = 'ВАШ_STEAM_ID64';

    const GAME_STATS_ELEMENT = document.querySelector('.data-card .game'); // Селектор для вашей карточки игры

    // Проверка, что элемент для отображения статистики игры существует на странице
    if (!GAME_STATS_ELEMENT) {
        console.error("Элемент для игровой статистики не найден. Убедитесь, что на странице есть div с классом 'data-card' и вложенный div с классом 'game'.");
        return; // Прекращаем выполнение, если элемент не найден
    }

    // Получаем ссылки на элементы внутри карточки игры
    const gameNameElement = GAME_STATS_ELEMENT.querySelector('.game-info__name');
    const gamePlatformElement = GAME_STATS_ELEMENT.querySelector('.game-info__platform');
    const gameCoverElement = GAME_STATS_ELEMENT.querySelector('.game-cover img');
    const gameHoursElement = GAME_STATS_ELEMENT.querySelector('.hours');
    const gameHoursTextElement = GAME_STATS_ELEMENT.querySelector('.hours-text');
    
    // Функция для получения недавно сыгранных игр
    function fetchSteamRecentGames() {
        // !!! ОЧЕНЬ ВАЖНО: Замените 'https://ВАШЕ_ИМЯ_ПРОЕКТА.vercel.app' на РЕАЛЬНЫЙ URL вашего развернутого прокси-сервера на Vercel !!!
        // Например: 'https://mettaneko-steam-proxy-xyz123.vercel.app/api/steam/recent-games'
        const vercelProxyUrl = 'https://mettaneko-steam-proxy-50o1j80pc-mettanekos-projects.vercel.app/api/steam/recent-games'; 

        // Выполняем запрос к вашему Vercel прокси-серверу
        fetch(vercelProxyUrl)
            .then(response => {
                // Проверяем, был ли ответ успешным (статус 200-299)
                if (!response.ok) {
                    // Если ответ не ОК, выбрасываем ошибку с HTTP-статусом
                    // Пытаемся прочитать текст ошибки для лучшей диагностики
                    return response.text().then(text => {
                        throw new Error(`HTTP error! Status: ${response.status}, Message: ${text}`);
                    });
                }
                // Если ответ ОК, парсим его как JSON
                return response.json();
            })
            .then(data => {
                // Проверяем, есть ли данные о играх в ответе
                if (data && data.response && data.response.games && data.response.games.length > 0) {
                    const game = data.response.games[0]; // Берем последнюю сыгранную игру
                    const gameName = game.name;
                    const playtimeMinutes = game.playtime_2weeks; // Время игры за последние 2 недели в минутах
                    const playtimeHours = (playtimeMinutes / 60).toFixed(1); // Конвертируем в часы с одним знаком после запятой

                    // Формируем URL обложки игры (используем appid для получения обложки со Steam CDN)
                    const gameCoverUrl = `https://cdn.akamai.steamstatic.com/steam/apps/${game.appid}/header.jpg`;

                    // Обновляем HTML-элементы на странице
                    gameCoverElement.src = gameCoverUrl;
                    gameNameElement.textContent = gameName;
                    gamePlatformElement.textContent = 'Steam'; // Платформа всегда Steam
                    gameHoursElement.textContent = playtimeHours;
                    gameHoursTextElement.textContent = 'HOURS (2 WEEKS)';

                } else {
                    // Если данных о играх нет (например, профиль приватный, или нет недавно сыгранных игр)
                    console.log("Нет данных о недавно сыгранных играх Steam. Профиль приватный или нет игр за последние 2 недели.");
                    // Устанавливаем заглушки
                    gameNameElement.textContent = 'Нет данных о играх';
                    gamePlatformElement.textContent = '';
                    gameCoverElement.src = 'assets/placeholder-game.png'; // Убедитесь, что у вас есть такая заглушка
                    gameHoursElement.textContent = '';
                    gameHoursTextElement.textContent = '';
                }
            })
            .catch(error => {
                // Обработка любых ошибок, возникших при запросе или обработке данных
                console.error('Ошибка при получении данных Steam через прокси:', error);
                // Устанавливаем заглушки при ошибке
                gameNameElement.textContent = 'Ошибка загрузки игр';
                gamePlatformElement.textContent = '';
                gameCoverElement.src = 'assets/placeholder-game.png';
                gameHoursElement.textContent = '';
                gameHoursTextElement.textContent = '';
            });
    }

    // Вызываем функцию при загрузке страницы
    fetchSteamRecentGames();
    // Обновляем данные каждые 5 минут (300 000 миллисекунд)
    setInterval(fetchSteamRecentGames, 60000 * 5); 
});