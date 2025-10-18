// compact-player.js
document.addEventListener('DOMContentLoaded', function() {
    const compactPlayer = document.getElementById('compactPlayer');
    const closeBtn = document.getElementById('compactCloseBtn');
    const platformButtons = document.querySelectorAll('.platform-btn');
    
    let currentTrack = null;
    let isVisible = false;

    // Простая функция показа
    function showPlayer() {
        if (!compactPlayer) return;
        
        compactPlayer.classList.remove('hiding');
        compactPlayer.classList.add('active');
        isVisible = true;
        console.log('Player shown');
    }
    
    // Простая функция скрытия
    function hidePlayer() {
        if (!compactPlayer) return;
        
        compactPlayer.classList.remove('active');
        compactPlayer.classList.add('hiding');
        isVisible = false;
        console.log('Player hidden');
        
        // Убираем класс hiding после анимации
        setTimeout(() => {
            compactPlayer.classList.remove('hiding');
        }, 300);
    }
    
    // Переключение видимости
    function togglePlayer(trackInfo) {
        console.log('Toggle player called, isVisible:', isVisible);
        
        if (isVisible) {
            hidePlayer();
        } else {
            if (trackInfo) {
                updateTrackInfo(trackInfo);
            }
            showPlayer();
        }
    }
    
    // Обновление информации о треке
    function updateTrackInfo(track) {
        const trackNameElement = document.getElementById('compactTrackName');
        const artistNameElement = document.getElementById('compactArtistName');
        const albumCoverElement = document.getElementById('compactAlbumCover');
        
        if (trackNameElement) trackNameElement.textContent = track.name;
        if (artistNameElement) artistNameElement.textContent = track.artist;
        if (albumCoverElement) albumCoverElement.src = track.albumCover || 'assets/on_off.png';
        
        currentTrack = track;

    }

    function handlePlatformSelect(platform) {
        if (!currentTrack) return;
        
        const trackName = encodeURIComponent(currentTrack.name);
        const artistName = encodeURIComponent(currentTrack.artist);
        let url = '';
        
        switch(platform) {
            case 'vk':
                url = `https://vk.com/audio?q=${artistName} - ${trackName}`;
                break;
            case 'spotify':
                url = `https://open.spotify.com/search/${artistName} ${trackName}`;
                break;
            case 'youtube':
                url = `https://www.youtube.com/results?search_query=${artistName} - ${trackName}`;
                break;
            case 'lastfm':
                url = currentTrack.lastfmUrl || `https://www.last.fm/music/${artistName}/_/${trackName}`;
                break;
        }
        
        if (url) {
            window.open(url, '_blank');
        }
    }
    
    // Назначаем обработчики событий
    function initEventListeners() {
        // Кнопка закрытия
        if (closeBtn) {
            closeBtn.addEventListener('click', hidePlayer);
        }
        
        // Клик вне плеера
        if (compactPlayer) {
            compactPlayer.addEventListener('click', function(e) {
                if (e.target === compactPlayer) {
                    hidePlayer();
                }
            });
        }
        
        // Клавиша Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isVisible) {
                hidePlayer();
            }
        });
        
        // Кнопки платформ
        platformButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const platform = this.dataset.platform;
                handlePlatformSelect(platform);
            });
        });
    }
    
    // Инициализация
    initEventListeners();
    
    // Экспортируем функции
    window.compactPlayer = {
        show: showPlayer,
        hide: hidePlayer,
        open: function(trackInfo) {
            updateTrackInfo(trackInfo);
            showPlayer();
        },
        toggle: togglePlayer,
        updateTrack: updateTrackInfo,
        isVisible: () => isVisible
    };
    
    console.log('Compact player initialized');
});