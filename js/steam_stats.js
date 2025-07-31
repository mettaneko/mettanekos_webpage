import { STEAM_API_KEY, STEAM_ID_64 } from '../config'; // Убедитесь, что ваш config.js экспортирует эти переменные

// Разрешенные домены для CORS
const allowedOrigins = [
    'https://www.mettaneko.ru',
    'https://mettaneko.ru',
    // Добавьте другие домены, если ваш сайт доступен по другим URL
];

export default async function (request, response) {
    // Установка CORS заголовков
    const origin = request.headers.get('origin');
    if (allowedOrigins.includes(origin)) {
        response.headers.set('Access-Control-Allow-Origin', origin);
    }
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    // Обработка предварительных запросов OPTIONS (для CORS)
    if (request.method === 'OPTIONS') {
        return response.status(200).send('OK');
    }

    if (request.method !== 'GET') {
        return response.status(405).send('Method Not Allowed');
    }

    if (!STEAM_API_KEY || !STEAM_ID_64) {
        return response.status(500).json({ error: 'Steam API Key or Steam ID 64 not configured.' });
    }

    try {
        // !!! ИЗМЕНЕННЫЙ URL ДЛЯ GetOwnedGames !!!
        // Параметры:
        // include_appinfo=true - чтобы получить название игры и ссылку на обложку
        // include_played_free_games=true - если хотите учитывать free-to-play игры
        const steamApiUrl = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${STEAM_API_KEY}&steamid=${STEAM_ID_64}&format=json&include_appinfo=true&include_played_free_games=true`;

        const apiResponse = await fetch(steamApiUrl);

        if (!apiResponse.ok) {
            const errorText = await apiResponse.text();
            console.error(`Steam API Error: ${apiResponse.status} - ${errorText}`);
            return response.status(apiResponse.status).json({ error: `Steam API responded with status ${apiResponse.status}`, details: errorText });
        }

        const data = await apiResponse.json();

        // !!! ЛОГИКА СОРТИРОВКИ ДЛЯ ПОИСКА САМОЙ ПОСЛЕДНЕЙ ИГРЫ !!!
        if (data && data.response && data.response.games && data.response.games.length > 0) {
            // Сортируем игры по rtime_last_played (Unix-таймштамп последнего запуска) в порядке убывания
            const sortedGames = data.response.games.sort((a, b) => b.rtime_last_played - a.rtime_last_played);

            const latestGame = sortedGames[0]; // Самая последняя игра

            // Формируем объект ответа с нужными полями
            // Заметьте: playtime_2weeks больше не доступен, теперь используем playtime_forever
            const result = {
                response: {
                    games: [
                        {
                            appid: latestGame.appid,
                            name: latestGame.name,
                            playtime_forever: latestGame.playtime_forever, // Общее время в минутах
                            rtime_last_played: latestGame.rtime_last_played, // Таймштамп последнего запуска
                            img_icon_url: latestGame.img_icon_url, // Для иконки, если нужна
                            img_logo_url: latestGame.img_logo_url, // Для лого, если нужна
                            // Дополнительные поля, если нужны:
                            // has_community_visible_stats: latestGame.has_community_visible_stats
                        }
                    ]
                }
            };

            return response.status(200).json(result);
        } else {
            return response.status(200).json({ response: { games: [] } }); // Нет данных об играх
        }

    } catch (error) {
        console.error('Error fetching Steam data:', error);
        return response.status(500).json({ error: 'Failed to fetch data from Steam API.', details: error.message });
    }
}