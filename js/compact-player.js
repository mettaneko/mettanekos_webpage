class CompactMusicPlayer {
    constructor() {
        this.player = document.getElementById('compactPlayer');
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
        this.isMuted = false;
        
        this.init();
    }
    
    init() {
        this.closeBtn.addEventListener('click', () => this.close());
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.volumeBtn.addEventListener('click', () => this.toggleMute());
        this.progressBar.addEventListener('click', (e) => this.setProgress(e));
        
        console.log('🎵 Compact player initialized - Visual Demo Mode');
    }
    
    open(trackInfo) {
        console.log('🎵 Opening player with track:', trackInfo);
        
        this.currentTrack = trackInfo;
        
        // Обновляем информацию о треке
        document.getElementById('compactTrackName').textContent = trackInfo.name;
        document.getElementById('compactArtistName').textContent = trackInfo.artist;
        document.getElementById('compactAlbumCover').src = trackInfo.albumCover;
        
        // Останавливаем текущее воспроизведение
        this.stopAudio();
        
        // Настраиваем демо-режим
        this.setupDemoMode();
        
        // Показываем плеер
        this.player.classList.remove('hiding');
        this.player.classList.add('active');
        
        this.showNotification('🎵 Демо-режим. Нажми Play для визуального воспроизведения');
    }
    
    stopAudio() {
        console.log('⏹️ Stopping audio playback');
        this.pause();
        this.stopDemoProgress();
        this.demoCurrentTime = 0;
    }
    
    setupDemoMode() {
        // Устанавливаем случайную длительность трека от 2 до 4 минут
        this.demoDuration = Math.floor(Math.random() * 120) + 120; // 2-4 минуты
        this.demoCurrentTime = 0;
        this.durationEl.textContent = this.formatTime(this.demoDuration);
        this.currentTimeEl.textContent = '0:00';
        this.progress.style.width = '0%';
        
        console.log(`⏱️ Demo track duration: ${this.formatTime(this.demoDuration)}`);
    }
    
    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    play() {
        console.log('▶️ Starting playback');
        this.isPlaying = true;
        this.updatePlayButton();
        this.startDemoProgress();
        this.showNotification('▶️ Воспроизведение');
    }
    
    pause() {
        if (this.isPlaying) {
            console.log('⏸️ Pausing playback');
            this.stopDemoProgress();
            this.isPlaying = false;
            this.updatePlayButton();
            this.showNotification('⏸️ Пауза');
        }
    }
    
    startDemoProgress() {
        this.stopDemoProgress();
        
        this.demoInterval = setInterval(() => {
            if (this.demoCurrentTime < this.demoDuration) {
                this.demoCurrentTime++;
                this.updateDemoProgress();
                
                // Случайное событие - "буферизация"
                if (Math.random() < 0.01) { // 1% chance
                    this.simulateBuffering();
                }
            } else {
                this.onTrackEnd();
            }
        }, 1000);
    }
    
    simulateBuffering() {
        console.log('📥 Simulating buffering...');
        this.showNotification('📥 Буферизация...');
        
        // Временно останавливаем прогресс на 2 секунды
        this.stopDemoProgress();
        setTimeout(() => {
            if (this.isPlaying) {
                this.startDemoProgress();
                this.showNotification('✅ Буферизация завершена');
            }
        }, 2000);
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
        
        // Обновляем длительность на случай если она изменилась
        this.durationEl.textContent = this.formatTime(this.demoDuration);
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        this.updateVolumeButton();
        this.showNotification(this.isMuted ? '🔇 Звук выключен' : '🔊 Звук включен');
        console.log(this.isMuted ? '🔇 Muted' : '🔊 Unmuted');
    }
    
    setProgress(e) {
        if (!this.isPlaying) return;
        
        const rect = this.progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        
        this.demoCurrentTime = Math.floor(percent * this.demoDuration);
        this.updateDemoProgress();
        
        console.log(`⏩ Seeking to: ${this.formatTime(this.demoCurrentTime)}`);
        this.showNotification(`⏩ Перемотка: ${this.formatTime(this.demoCurrentTime)}`);
    }
    
    onTrackEnd() {
        console.log('⏹️ Track ended');
        this.isPlaying = false;
        this.updatePlayButton();
        this.stopDemoProgress();
        this.demoCurrentTime = 0;
        this.updateDemoProgress();
        
        this.showNotification('✅ Трек завершен');
        
        // Автопереход на "следующий трек" через 3 секунды
        setTimeout(() => {
            if (this.player.classList.contains('active')) {
                this.showNotification('🔄 Автопереход на следующий трек...');
                this.restartPlayback();
            }
        }, 3000);
    }
    
    restartPlayback() {
        this.stopAudio();
        this.setupDemoMode();
        this.play();
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
        if (this.isMuted) {
            this.volumeOnIcon.style.display = 'none';
            this.volumeOffIcon.style.display = 'block';
        } else {
            this.volumeOnIcon.style.display = 'block';
            this.volumeOffIcon.style.display = 'none';
        }
    }
    
    close() {
        console.log('❌ Closing player');
        this.player.classList.add('hiding');
        setTimeout(() => {
            this.player.classList.remove('active');
            this.stopAudio();
        }, 300);
        this.showNotification('👋 Плеер закрыт');
    }
    
    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    
    showNotification(message) {
        console.log('💬 Player:', message);
        
        // Удаляем старое уведомление если есть
        const oldNotification = document.querySelector('.player-notification');
        if (oldNotification) {
            oldNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = 'player-notification';
        notification.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--card-background);
            color: var(--text-color);
            padding: 12px 24px;
            border-radius: 16px;
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255,255,255,0.3);
            z-index: 1002;
            font-size: 14px;
            font-weight: 600;
            white-space: nowrap;
            box-shadow: 0 8px 32px rgba(0,0,0,0.4);
            animation: slideUp 0.3s ease-out;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideDown 0.3s ease-in';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 3000);
    }
}

// Добавляем CSS анимации для уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes slideDown {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
        }
    }
`;
document.head.appendChild(style);

let compactPlayer;
document.addEventListener('DOMContentLoaded', () => {
    compactPlayer = new CompactMusicPlayer();
    window.compactPlayer = compactPlayer;
    console.log('🎵 Compact player ready - Visual Demo Mode Active');
});