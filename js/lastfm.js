document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = '852bcf95c701d83a2c8c9bfd5a14bdcb'; 
    const USERNAME = 'mettaneko'; 
    const LIMIT = 1; 
    
    // Находим элементы с проверкой
    const MUSIC_STATS_ELEMENT = document.querySelector('.data-card .song'); 
    const SONG_LINK_ELEMENT = document.querySelector('.song-link'); 

    console.log('Last.fm init - Music element:', MUSIC_STATS_ELEMENT, 'Song link:', SONG_LINK_ELEMENT);

    if (!MUSIC_STATS_ELEMENT) {
        console.log('Music stats element not found');
        return;
    }

    const songNameElement = MUSIC_STATS_ELEMENT.querySelector('.song-info__name');
    const artistNameElement = MUSIC_STATS_ELEMENT.querySelector('.song-info__artist');
    const albumCoverElement = MUSIC_STATS_ELEMENT.querySelector('.album-cover img');
    const playsTextElement = MUSIC_STATS_ELEMENT.querySelector('.plays-text');
    const playsCountElement = MUSIC_STATS_ELEMENT.querySelector('.plays');

    let currentTrack = null;

    // Обработчик клика по карточке трека (только если элемент найден)
    if (SONG_LINK_ELEMENT) {
        SONG_LINK_ELEMENT.addEventListener('click', (event) => {
            event.preventDefault();
            
            if (currentTrack && currentTrack.name !== 'Failed to load Last.Fm' && currentTrack.name !== 'NO DATA') {
                // Переключаем отображение плеера
                toggleCompactPlayer(currentTrack);
            } else {
                console.log('No valid track data available');
            }
        });
    } else {
        console.log('Song link element not found');
    }

    // Функция для переключения compact player
    function toggleCompactPlayer(trackInfo) {
        console.log('toggleCompactPlayer called with:', trackInfo);
        
        if (window.compactPlayer && typeof window.compactPlayer.toggle === 'function') {
            window.compactPlayer.toggle(trackInfo);
        } else {
            console.error('Compact player not available');
            // Fallback
            const lastfmUrl = trackInfo.lastfmUrl || `https://www.last.fm/music/${encodeURIComponent(trackInfo.artist)}/_/${encodeURIComponent(trackInfo.name)}`;
            window.open(lastfmUrl, '_blank');
        }
    }

    function fetchLastFmData() {
        const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${USERNAME}&api_key=${API_KEY}&format=json&limit=${LIMIT}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data?.recenttracks?.track?.length > 0) {
                    const track = data.recenttracks.track[0];
                    const artist = track.artist['#text'];
                    const songName = track.name;
                    const albumCover = track.image.find(img => img.size === 'large' && img['#text'])?.['#text'] || 'assets/on_off.png';

                    // Создаем URL для Last.fm
                    const encodedArtist = encodeURIComponent(artist);
                    const encodedSongName = encodeURIComponent(songName);
                    const lastfmUrl = `https://www.last.fm/music/${encodedArtist}/_/${encodedSongName}`;

                    // Сохраняем текущий трек
                    currentTrack = {
                        name: songName,
                        artist: artist,
                        albumCover: albumCover,
                        lastfmUrl: lastfmUrl
                    };

                    // Обновляем UI
                    albumCoverElement.src = albumCover;
                    songNameElement.textContent = songName;
                    artistNameElement.textContent = artist;
                    
                    const isNowPlaying = track['@attr']?.nowplaying === 'true';
                    playsTextElement.textContent = isNowPlaying ? '● Now' : '● Last';
                    playsCountElement.textContent = '';

                } else {
                    currentTrack = null;
                    songNameElement.textContent = 'NO DATA';
                    artistNameElement.textContent = '';
                    playsTextElement.textContent = '';
                    playsCountElement.textContent = '';
                }
            })
            .catch(error => {
                console.error('Last.fm error:', error);
                currentTrack = null;
                songNameElement.textContent = 'Failed to load Last.Fm';
                artistNameElement.textContent = '';
                playsTextElement.textContent = '';
                playsCountElement.textContent = '';
            });
    }

    // Инициализация
    fetchLastFmData();
    setInterval(fetchLastFmData, 10000);
});