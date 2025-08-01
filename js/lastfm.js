document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = '852bcf95c701d83a2c8c9bfd5a14bdcb'; // Замените на ваш API ключ
    const USERNAME = 'mettaneko'; // Замените на ваше имя пользователя Last.fm
    const LIMIT = 1; // Количество треков для отображения (берем только последний)
    const MUSIC_STATS_ELEMENT = document.querySelector('.data-card .song'); // Селектор для вашей карточки музыки

    if (!MUSIC_STATS_ELEMENT) {
        console.error("Элемент для музыкальной статистики не найден.");
        return;
    }

    const songNameElement = MUSIC_STATS_ELEMENT.querySelector('.song-info__name');
    const artistNameElement = MUSIC_STATS_ELEMENT.querySelector('.song-info__artist');
    const albumCoverElement = MUSIC_STATS_ELEMENT.querySelector('.album-cover img');
    const playsTextElement = MUSIC_STATS_ELEMENT.querySelector('.plays-text'); // Текст "PLAYS"
    const playsCountElement = MUSIC_STATS_ELEMENT.querySelector('.plays'); // Число прослушиваний

    function fetchLastFmData() {
        const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${USERNAME}&api_key=${API_KEY}&format=json&limit=${LIMIT}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.recenttracks && data.recenttracks.track && data.recenttracks.track.length > 0) {
                    const track = data.recenttracks.track[0];
                    const artist = track.artist['#text'];
                    const songName = track.name;
                    // Last.fm может не всегда возвращать большую обложку, добавьте запасной вариант
                    const albumCover = track.image.find(img => img.size === 'large' && img['#text']) ? track.image.find(img => img.size === 'large')['#text'] : 'placeholder-album.png'; // Замените на путь к заглушке

                    albumCoverElement.src = albumCover;
                    songNameElement.textContent = songName;
                    artistNameElement.textContent = artist;

                    // Проверяем, играет ли трек сейчас
                    const isNowPlaying = track['@attr'] && track['@attr'].nowplaying === 'true';

                    if (isNowPlaying) {
                        playsTextElement.textContent = '● Now';
                        playsCountElement.textContent = ''; // Очищаем количество прослушиваний, если трек играет
                        // Можно добавить анимацию или специальный стиль для "сейчас играет"
                        MUSIC_STATS_ELEMENT.classList.add('now-playing');
                    } else {
                        playsTextElement.textContent = '● Last';
                        // Для 'СЛУШАЛ' можно показать время, прошедшее с момента прослушивания,
                        // или количество прослушиваний, если вы используете getTopTracks.
                        // Если это просто последний трек и нет информации о playcount, можно оставить пустым
                        // или написать "Недавно".
                        playsCountElement.textContent = ''; // Для простоты оставляем пустым, если не хотим считать
                                                            // или отображать playcount конкретно этого трека
                        MUSIC_STATS_ELEMENT.classList.remove('now-playing');

                        // Если нужен более точный "слушал N минут назад" - потребуется дополнительная логика
                        // с timestamp трека (track.date.uts) и текущим временем.
                    }

                } else {
                    console.log("Нет данных о последних треках. Возможно, пользователь ничего не слушал или API вернул пустой ответ.");
                    songNameElement.textContent = 'NO DATA';
                    artistNameElement.textContent = '';
                    playsTextElement.textContent = '';
                    playsCountElement.textContent = '';
                    MUSIC_STATS_ELEMENT.classList.remove('now-playing');
                }
            })
            .catch(error => {
                console.error('Ошибка при получении данных Last.fm:', error);
                songNameElement.textContent = 'Failed to load Last.Fm';
                artistNameElement.textContent = '';
                playsTextElement.textContent = '';
                playsCountElement.textContent = '';
                MUSIC_STATS_ELEMENT.classList.remove('now-playing');
            });
    }

    // Загружаем данные сразу при загрузке страницы
    fetchLastFmData();

    // Обновляем данные каждые 30 секунд (или другой интервал)
    // Будьте осторожны с лимитами API: 30 секунд (30000 мс) - это 2 запроса в минуту, 120 запросов в час.
    // Если лимит 1000 запросов/час, это вполне безопасно.
    setInterval(fetchLastFmData, 10000);
});