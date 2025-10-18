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
        
        // Пока используем демо-режим, пока не настроим прокси
        this.VERCEL_PROXY_URL = 'https://mettaneko-steam-proxy.vercel.app/api/zaycev';
        
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
        
        console.log('Compact player initialized');
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
        
        // Пока используем демо-режим
        this.setupDemoMode();
        
        // Показываем плеер
        this.player.classList.remove('hiding');
        this.player.classList.add('active');
        
        this.showNotification('🎵 Демо-режим. Нажми Play для визуального воспроизведения');
    }
    
    setupDemoMode() {
        // Настраиваем демо-режим с визуальным воспроизведением
        this.demoDuration = 180; // 3 минуты
        this.demoCurrentTime = 0;
        this.durationEl.textContent = this.formatTime(this.demoDuration);
        this.currentTimeEl.textContent = '0:00';
        this.progress.style.width = '0%';
    }
    
    stopAudio() {
        // Останавливаем все воспроизведение
        this.pause();
        this.audio.src = '';
        this.audio.load();
        this.stopDemoProgress();
        this.demoCurrentTime = 0;
    }
    
    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    play() {
        if (this.audio.src) {
            // Реальное аудио
            this.audio.play().then(() => {
                this.isPlaying = true;
                this.updatePlayButton();
                this.showNotification('Воспроизведение');
            }).catch(error => {
                console.error('Play error:', error);
                this.startDemoPlayback();
            });
        } else {
            // Демо-режим
            this.startDemoPlayback();
        }
    }
    
    startDemoPlayback() {
        this.isPlaying = true;
        this.updatePlayButton();
        this.startDemoProgress();
        this.showNotification('Демо-воспроизведение');
    }
    
    pause() {
        if (this.isPlaying) {
            if (this.audio.src) {
                this.audio.pause();
            }
            this.stopDemoProgress();
            
            this.isPlaying = false;
            this.updatePlayButton();
            this.showNotification('Пауза');
        }
    }
    
    startDemoProgress() {
        this.stopDemoProgress();
        
        this.demoInterval = setInterval(() => {
            if (this.demoCurrentTime < this.demoDuration) {
                this.demoCurrentTime++;
                this.updateDemoProgress();
            } else {
                this.onTrackEnd();
            }
        }, 1000);
    }
    
    stopDemoProgress() {
        if (this.demoInterval) {
            clearInterval(this.demoInterval);
            this.demoInterval = null;
        }
    }
    
    updateDemoProgress() {
        const progressPercent = (this.demoCurrentTime / this.demoDuration) * 100;
        this.progress.style.width = `${progressPercent}%`;
        this.currentTimeEl.textContent = this.formatTime(this.demoCurrentTime);
    }
    
    toggleMute() {
        this.audio.muted = !this.audio.muted;
        this.updateVolumeButton();
        this.showNotification(this.audio.muted ? '🔇 Звук выключен' : '🔊 Звук включен');
    }
    
    setProgress(e) {
        if (!this.isPlaying) return;
        
        const rect = this.progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        
        if (this.audio.src && this.audio.duration > 0) {
            // Реальное аудио
            this.audio.currentTime = percent * this.audio.duration;
        } else {
            // Демо аудио
            this.demoCurrentTime = Math.floor(percent * this.demoDuration);
            this.updateDemoProgress();
        }
    }
    
    onTrackEnd() {
        this.isPlaying = false;
        this.updatePlayButton();
        this.stopDemoProgress();
        
        if (this.audio.src) {
            this.audio.currentTime = 0;
            this.progress.style.width = '0%';
            this.currentTimeEl.textContent = '0:00';
        } else {
            this.demoCurrentTime = 0;
            this.updateDemoProgress();
        }
        
        this.showNotification('Трек завершен');
    }
    
    onAudioError(e) {
        console.error('Audio error:', e);
        this.showNotification('Ошибка аудио, переключаюсь в демо-режим');
        this.setupDemoMode();
    }
    
    onAudioCanPlay() {
        this.showNotification('Аудио готово к воспроизведению');
        this.updateDuration();
    }
    
    updateDuration() {
        if (this.audio.duration > 0) {
            this.durationEl.textContent = this.formatTime(this.audio.duration);
        } else if (this.demoDuration) {
            this.durationEl.textContent = this.formatTime(this.demoDuration);
        }
    }
    
    updateProgress() {
        if (this.audio.src && this.audio.duration > 0) {
            const currentTime = this.audio.currentTime;
            const duration = this.audio.duration;
            const progressPercent = (currentTime / duration) * 100;
            this.progress.style.width = `${progressPercent}%`;
            this.currentTimeEl.textContent = this.formatTime(currentTime);
        }
    }
    
    updatePlayButton() {
        if (this.isPlaying) {
            this.playIcon.style.display = 'none';
            this.pauseIcon.style.display = 'block';
        } else {
            this.playIcon.style.display = 'block';
            this.pauseIcon.style.display = 'none';
        }
    }
    
    updateVolumeButton() {
        if (this.audio.muted) {
            this.volumeOnIcon.style.display = 'none';
            this.volumeOffIcon.style.display = 'block';
        } else {
            this.volumeOnIcon.style.display = 'block';
            this.volumeOffIcon.style.display = 'none';
        }
    }
    
    close() {
        this.player.classList.add('hiding');
        setTimeout(() => {
            this.player.classList.remove('active');
            this.stopAudio();
        }, 300);
    }
    
    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    
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