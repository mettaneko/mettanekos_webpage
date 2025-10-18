document.addEventListener('DOMContentLoaded', () => {
    const STEAM_ID = '76561199631936952';
    const STEAM_API_KEY = '7D72F6B0A7A4A9B2A6A6A6A6A6A6A6A6';
    
    // Находим элементы с проверкой
    const GAME_STATS_ELEMENT = document.querySelector('.data-card .game');
    const GAME_LINK_ELEMENT = document.querySelector('.game-link');

    console.log('Steam init - Game element:', GAME_STATS_ELEMENT, 'Game link:', GAME_LINK_ELEMENT);

    if (!GAME_STATS_ELEMENT) {
        console.log('Game stats element not found');
        return;
    }

    const gameNameElement = GAME_STATS_ELEMENT.querySelector('.game-info__name');
    const gamePlatformElement = GAME_STATS_ELEMENT.querySelector('.game-info__platform');
    const gameCoverElement = GAME_STATS_ELEMENT.querySelector('.game-cover img');
    const hoursElement = GAME_STATS_ELEMENT.querySelector('.hours');

    let currentGame = null;

    // Обработчик клика по карточке игры (только если элемент найден)
    if (GAME_LINK_ELEMENT) {
        GAME_LINK_ELEMENT.addEventListener('click', (event) => {
            event.preventDefault();
            
            if (currentGame && currentGame.name !== 'Failed to load Steam API') {
                // Открываем страницу игры в Steam
                openSteamGame(currentGame);
            } else {
                console.log('No valid game data available');
            }
        });
    } else {
        console.log('Game link element not found');
    }

    // Функция для открытия игры в Steam
    function openSteamGame(gameInfo) {
        if (gameInfo.steamUrl) {
            // Если есть прямой URL игры, используем его
            window.open(gameInfo.steamUrl, '_blank');
        } else if (gameInfo.appid) {
            // Если есть appid, создаем URL
            const steamUrl = `https://store.steampowered.com/app/${gameInfo.appid}`;
            window.open(steamUrl, '_blank');
        } else {
            // Если нет appid, ищем игру в магазине Steam
            const encodedGameName = encodeURIComponent(gameInfo.name);
            const steamStoreUrl = `https://store.steampowered.com/search/?term=${encodedGameName}`;
            window.open(steamStoreUrl, '_blank');
        }
    }

    function fetchSteamData() {
        const url = `https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v1/?key=${STEAM_API_KEY}&steamid=${STEAM_ID}&format=json`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data?.response?.games?.length > 0) {
                    const game = data.response.games[0];
                    const playtimeHours = Math.round(game.playtime_forever / 60);
                    
                    // Получаем дополнительную информацию об игре
                    fetchGameInfo(game.appid, playtimeHours);
                } else {
                    currentGame = null;
                    gameNameElement.textContent = 'NO DATA';
                    gamePlatformElement.textContent = '';
                    hoursElement.textContent = '';
                }
            })
            .catch(error => {
                console.error('Steam API error:', error);
                currentGame = null;
                gameNameElement.textContent = 'Failed to load Steam API';
                gamePlatformElement.textContent = '';
                hoursElement.textContent = '';
            });
    }

    function fetchGameInfo(appid, playtimeHours) {
        // Используем Steam Store API для получения информации об игре
        const storeUrl = `https://store.steampowered.com/api/appdetails?appids=${appid}`;

        fetch(storeUrl)
            .then(response => response.json())
            .then(data => {
                if (data[appid]?.success) {
                    const gameData = data[appid].data;
                    
                    currentGame = {
                        name: gameData.name,
                        appid: appid,
                        playtimeHours: playtimeHours,
                        steamUrl: `https://store.steampowered.com/app/${appid}`,
                        cover: gameData.header_image || 'assets/on_off.png'
                    };

                    // Обновляем UI
                    gameCoverElement.src = currentGame.cover;
                    gameNameElement.textContent = currentGame.name;
                    gamePlatformElement.textContent = 'Steam';
                    hoursElement.textContent = `${playtimeHours}h`;

                } else {
                    // Если не удалось получить данные об игре, используем базовую информацию
                    currentGame = {
                        name: `AppID: ${appid}`,
                        appid: appid,
                        playtimeHours: playtimeHours,
                        steamUrl: `https://store.steampowered.com/app/${appid}`,
                        cover: 'assets/on_off.png'
                    };

                    gameCoverElement.src = currentGame.cover;
                    gameNameElement.textContent = currentGame.name;
                    gamePlatformElement.textContent = 'Steam';
                    hoursElement.textContent = `${playtimeHours}h`;
                }
            })
            .catch(error => {
                console.error('Steam Store API error:', error);
                // Создаем базовую информацию об игре
                currentGame = {
                    name: `Game (${appid})`,
                    appid: appid,
                    playtimeHours: playtimeHours,
                    steamUrl: `https://store.steampowered.com/app/${appid}`,
                    cover: 'assets/on_off.png'
                };

                gameCoverElement.src = currentGame.cover;
                gameNameElement.textContent = currentGame.name;
                gamePlatformElement.textContent = 'Steam';
                hoursElement.textContent = `${playtimeHours}h`;
            });
    }

    // Инициализация
    fetchSteamData();
    setInterval(fetchSteamData, 300000); // Обновляем каждые 5 минут
});