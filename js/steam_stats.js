document.addEventListener('DOMContentLoaded', () => {
    const STEAM_API_KEY = '054B17E9DD877057D92003D57A188D9C'; // Замените на ваш Steam API ключ
    const STEAM_ID_64 = '76561199131765029'; // Замените на 17-значный SteamID64 пользователя
    const GAME_STATS_ELEMENT = document.querySelector('.data-card .game'); // Селектор для вашей карточки игры

    if (!GAME_STATS_ELEMENT) {
        console.error("Элемент для игровой статистики не найден.");
        return;
    }

    const gameNameElement = GAME_STATS_ELEMENT.querySelector('.game-info__name');
    const gamePlatformElement = GAME_STATS_ELEMENT.querySelector('.game-info__platform');
    const gameCoverElement = GAME_STATS_ELEMENT.querySelector('.game-cover img');
    const gameHoursElement = GAME_STATS_ELEMENT.querySelector('.hours');
    const gameHoursTextElement = GAME_STATS_ELEMENT.querySelector('.hours-text');

    // Функция для получения недавно сыгранных игр
    function fetchSteamRecentGames() {
        // IPlayerService/GetRecentlyPlayedGames - дает данные по последним играм
        // IPlayerService/GetOwnedGames - дает список всех игр и общее время игры
        const url = `https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v1/?key=${STEAM_API_KEY}&steamid=${STEAM_ID_64}&format=json&count=1`; // Получаем 1 последнюю игру

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data && data.response && data.response.games && data.response.games.length > 0) {
                    const game = data.response.games[0];
                    const gameName = game.name;
                    const playtimeMinutes = game.playtime_2weeks; // Время игры за последние 2 недели
                    const playtimeHours = (playtimeMinutes / 60).toFixed(1); // Конвертируем в часы

                    // URL для изображения обложки игры (Steam Store API)
                    const gameCoverUrl = `https://cdn.akamai.steamstatic.com/steam/apps/${game.appid}/header.jpg`;

                    gameCoverElement.src = gameCoverUrl;
                    gameNameElement.textContent = gameName;
                    gamePlatformElement.textContent = 'Steam'; // Или 'PC'

                    gameHoursElement.textContent = playtimeHours;
                    gameHoursTextElement.textContent = 'HOURS (2 WEEKS)';

                    // Также можно получить общее время игры, если нужно, используя GetOwnedGames
                    // Для этого потребуется еще один запрос или другой метод.

                } else {
                    console.log("Нет данных о недавно сыгранных играх Steam. Профиль приватный или нет игр.");
                    gameNameElement.textContent = 'Нет данных о играх';
                    gamePlatformElement.textContent = '';
                    gameCoverElement.src = 'placeholder-game.png'; // Заглушка для обложки
                    gameHoursElement.textContent = '';
                    gameHoursTextElement.textContent = '';
                }
            })
            .catch(error => {
                console.error('Ошибка при получении данных Steam:', error);
                gameNameElement.textContent = 'Ошибка загрузки игр';
                gamePlatformElement.textContent = '';
                gameCoverElement.src = 'placeholder-game.png'; // Заглушка
                gameHoursElement.textContent = '';
                gameHoursTextElement.textContent = '';
            });
    }

    fetchSteamRecentGames();
    setInterval(fetchSteamRecentGames, 60000 * 5); // Обновляем каждые 5 минут
});