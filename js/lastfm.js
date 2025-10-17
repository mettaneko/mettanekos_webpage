document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = '852bcf95c701d83a2c8c9bfd5a14bdcb'; // Замените на ваш API ключ
    const USERNAME = 'mettaneko'; // Замените на ваше имя пользователя Last.fm
    const LIMIT = 1; // Количество треков для отображения (берем только последний)
    const MUSIC_STATS_ELEMENT = document.querySelector('.data-card .song'); // Селектор для вашей карточки музыки
    const SONG_LINK_ELEMENT = document.querySelector('.song-link'); // Селектор для ссылки на трек

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
                    const albumCover = track.image.find(img => img.size === 'large' && img['#text']) ? track.image.find(img => img.size === 'large')['#text'] : 'placeholder-album.png';

                    albumCoverElement.src = albumCover;
                    songNameElement.textContent = songName;
                    artistNameElement.textContent = artist;
                    
                    // --- НОВЫЙ КОД ДЛЯ ССЫЛКИ НА ПОИСК ВК ---
                    if (SONG_LINK_ELEMENT) {
                        // Формируем поисковый запрос
                        const searchQuery = `${artist} - ${songName}`;
                        
                        // Создаем ссылку на поиск по аудиозаписям VK
                        const vkSearchUrl = `https://vk.com/audio?act=search&q=${encodeURIComponent(searchQuery)}`;
                        
                        // Устанавливаем ссылку на VK-поиск
                        SONG_LINK_ELEMENT.href = vkSearchUrl;
                    }
                    // ----------------------------------------

                    const isNowPlaying = track['@attr'] && track['@attr'].nowplaying === 'true';

                    if (isNowPlaying) {
                        playsTextElement.textContent = '● Now';
                        playsCountElement.textContent = '';
                        MUSIC_STATS_ELEMENT.classList.add('now-playing');
                    } else {
                        playsTextElement.textContent = '● Last';
                        playsCountElement.textContent = '';
                        MUSIC_STATS_ELEMENT.classList.remove('now-playing');
                    }

                } else {
                    console.log("Нет данных о последних треках.");
                    songNameElement.textContent = 'NO DATA';
                    artistNameElement.textContent = '';
                    playsTextElement.textContent = '';
                    playsCountElement.textContent = '';
                    MUSIC_STATS_ELEMENT.classList.remove('now-playing');
                    if (SONG_LINK_ELEMENT) {
                        SONG_LINK_ELEMENT.href = '#'; // Сброс ссылки при отсутствии данных
                    }
                }
            })
            .catch(error => {
                console.error('Ошибка при получении данных Last.fm:', error);
                songNameElement.textContent = 'Failed to load Last.Fm';
                artistNameElement.textContent = '';
                playsTextElement.textContent = '';
                playsCountElement.textContent = '';
                MUSIC_STATS_ELEMENT.classList.remove('now-playing');
                if (SONG_LINK_ELEMENT) {
                    SONG_LINK_ELEMENT.href = '#'; // Сброс ссылки при ошибке
                }
            });
    }

    fetchLastFmData();
    setInterval(fetchLastFmData, 10000); // Обновление каждые 10 секунд
});