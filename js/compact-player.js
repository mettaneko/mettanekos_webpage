class CompactMusicPlayer {
    constructor() {
        this.player = document.getElementById('compactPlayer');
        this.audio = document.getElementById('compactAudioPlayer');
        this.closeBtn = document.getElementById('compactCloseBtn');
        this.playPauseBtn = document.getElementById('compactPlayPauseBtn');
        this.volumeBtn = document.getElementById('compactVolumeBtn');
        this.progressBar = document.getElementById('compactProgressBar');
        this.progress = document.getElementById('compactProgress');
        this.currentTimeEl = document.getElementById('compactCurrentTime');
        this.durationEl = document.getElementById('compactDuration');
        
        this.playIcon = this.playPauseBtn.querySelector('.play-icon');
        this.pauseIcon = this.playPauseBtn.querySelector('.pause-icon');
        this.volumeOnIcon = this.volumeBtn.querySelector('.volume-on-icon');
        this.volumeOffIcon = this.volumeBtn.querySelector('.volume-off-icon');
        
        this.isPlaying = false;
        this.currentTrack = null;
        this.demoInterval = null;
        
        // Твой существующий Vercel прокси URL
        // Замени на твой реальный домен Vercel
        this.VERCEL_PROXY_URL = 'https://mettaneko-steam-proxy.vercel.app/api/deezer';
        
        this.init();
    }
    
    init() {
        // Обработчики событий
        this.closeBtn.addEventListener('click', () => this.close());
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.volumeBtn.addEventListener('click', () => this.toggleMute());
        this.progressBar.addEventListener('click', (e) => this.setProgress(e));
        
        // События аудио элемента
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.onTrackEnd());
        this.audio.addEventListener('error', (e) => this.onAudioError(e));
        this.audio.addEventListener('canplay', () => this.onAudioCanPlay());
        
        console.log('Compact player initialized with proxy:', this.VERCEL_PROXY_URL);
    }
    
    open(trackInfo) {
        console.log('Opening player with track:', trackInfo);
        
        this.currentTrack = trackInfo;
        
        // Обновляем информацию о треке
        document.getElementById('compactTrackName').textContent = trackInfo.name;
        document.getElementById('compactArtistName').textContent = trackInfo.artist;
        document.getElementById('compactAlbumCover').src = trackInfo.albumCover;
        
        // Останавливаем текущее воспроизведение
        this.stopAudio();
        
        // Загружаем аудио через Vercel прокси
        this.loadAudioViaProxy(trackInfo.artist, trackInfo.name);
        
        // Показываем плеер
        this.player.classList.remove('hiding');
        this.player.classList.add('active');
    }
    
    async loadAudioViaProxy(artist, trackName) {
        this.showNotification('🔍 Поиск трека...');
        
        try {
            const proxyUrl = `${this.VERCEL_PROXY_URL}?artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(trackName)}`;
            
            console.log('Fetching from proxy:', proxyUrl);
            
            const response = await fetch(proxyUrl);
            
            if (!response.ok) {
                throw new Error(`Proxy responded with status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success && data.preview) {
                console.log('Audio URL found:', data.preview);
                this.audio.src = data.preview;
                this.audio.load();
                this.showNotification('🎵 Трек найден! Загрузка...');
                
                // Обновляем обложку если есть из Deezer
                if (data.cover && data.cover !== 'assets/on_off.png') {
                    document.getElementById('compactAlbumCover').src = data.cover;
                }
            } else {
                console.log('Track not found in response:', data);
                this.showNotification('❌ Трек не найден. Демо-режим.');
                this.setupVisualDemo();
            }
        } catch (error) {
            console.error('Proxy fetch error:', error);
            this.showNotification('⚠️ Ошибка загрузки. Демо-режим.');
            this.setupVisualDemo();
        }
    }
    
    onAudioCanPlay() {
        this.showNotification('✅ Трек готов к воспроизведению');
        this.updateDuration();
    }
    
    setupVisualDemo() {
        // Настраиваем визуальное демо
        this.demoDuration = 30;
        this.demoCurrentTime = 0;
        this.durationEl.textContent = this.formatTime(this.demoDuration);
        this.currentTimeEl.textContent = '0:00';
        this.progress.style.width = '0%';
    }
    
    // ... остальные методы без изменений (play, pause, togglePlayPause и т.д.) ...
    
    showNotification(message) {
        console.log('Player:', message);
        
        // Создаем красивое уведомление
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--card-background);
            color: var(--text-color);
            padding: 10px 20px;
            border-radius: 12px;
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255,255,255,0.2);
            z-index: 1002;
            font-size: 14px;
            white-space: nowrap;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
}

// Глобальная инициализация
let compactPlayer;

document.addEventListener('DOMContentLoaded', () => {
    compactPlayer = new CompactMusicPlayer();
    window.compactPlayer = compactPlayer;
    console.log('Compact player ready');
});