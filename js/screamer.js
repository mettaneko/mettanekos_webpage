// js/screamer.js
class Screamer {
    constructor() {
        this.screamer = document.getElementById('screamer');
        this.screamerVideo = document.getElementById('screamerVideo');
        this.screamerSound = document.getElementById('screamerSound');
        this.isActive = false;
        this.triggers = ['click', 'mousemove', 'keydown', 'scroll', 'touchstart'];
        this.triggerProbability = 0.003;
        this.minTimeBetweenScreamers = 30000;
        this.lastScreamerTime = 0;
        this.userHasClicked = false;
        
        // Переменные для управления фоновой музыкой
        this.backgroundVideo = document.getElementById('bgVideo');
        this.wasBackgroundMuted = false;
        this.backgroundVolume = 1;
        
        this.init();
    }

    init() {
        this.screamer.style.display = 'none';
        
        document.addEventListener('click', (e) => {
            if (!this.userHasClicked) {
                this.userHasClicked = true;
                console.log('First click detected, screamer can now trigger');
                return;
            }
            this.handleUserAction(e);
        });
        
        this.triggers.filter(trigger => trigger !== 'click').forEach(trigger => {
            document.addEventListener(trigger, (e) => {
                if (this.userHasClicked) {
                    this.handleUserAction(e);
                }
            });
        });

        // ИЗМЕНЕНИЕ: при клике на скример перезагружаем страницу
        this.screamer.addEventListener('click', () => {
            location.reload();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isActive) {
                this.hideScreamer();
            }
        });
    }

    handleUserAction(event) {
        if (this.isActive || !this.userHasClicked) return;
        
        const currentTime = Date.now();
        if (currentTime - this.lastScreamerTime < this.minTimeBetweenScreamers) return;
        
        if (Math.random() < this.triggerProbability) {
            this.triggerScreamer();
        }
    }

    triggerScreamer() {
        this.isActive = true;
        this.lastScreamerTime = Date.now();
        
        // Сохраняем состояние фоновой музыки
        this.saveBackgroundAudioState();
        
        // Выключаем фоновую музыку
        this.muteBackgroundAudio();
        
        document.body.style.overflow = 'hidden';
        
        this.screamer.style.display = 'flex';
        setTimeout(() => {
            this.screamer.style.opacity = '1';
        }, 10);
        
        this.screamerVideo.currentTime = 0;
        this.screamerVideo.play().catch(e => console.log('Video play failed:', e));
        
        this.screamerSound.currentTime = 0;
        this.screamerSound.play().catch(e => console.log('Audio play failed:', e));
        
        setTimeout(() => {
            this.hideScreamer();
        }, 5000);
    }

    hideScreamer() {
        this.screamer.style.opacity = '0';
        
        this.screamerVideo.pause();
        this.screamerSound.pause();
        this.screamerSound.currentTime = 0;
        
        setTimeout(() => {
            this.screamer.style.display = 'none';
            this.isActive = false;
            
            // Восстанавливаем скролл
            document.body.style.overflow = '';
            
            // Восстанавливаем фоновую музыку
            this.restoreBackgroundAudio();
            
            console.log('Screamer hidden, all interactions and audio restored');
        }, 500);
    }

    // Сохраняем состояние фонового аудио
    saveBackgroundAudioState() {
        if (this.backgroundVideo) {
            this.wasBackgroundMuted = this.backgroundVideo.muted;
            this.backgroundVolume = this.backgroundVideo.volume;
            console.log('Background audio state saved:', {
                muted: this.wasBackgroundMuted,
                volume: this.backgroundVolume
            });
        }
    }

    // Выключаем фоновую музыку
    muteBackgroundAudio() {
        if (this.backgroundVideo) {
            this.backgroundVideo.muted = true;
            console.log('Background audio muted');
        }
        
        // Также ищем другие возможные аудио элементы на странице
        const otherAudioElements = document.querySelectorAll('audio');
        otherAudioElements.forEach(audio => {
            if (audio !== this.screamerSound) {
                audio.muted = true;
            }
        });
    }

    // Восстанавливаем фоновую музыку
    restoreBackgroundAudio() {
        if (this.backgroundVideo) {
            this.backgroundVideo.muted = this.wasBackgroundMuted;
            this.backgroundVideo.volume = this.backgroundVolume;
            console.log('Background audio restored:', {
                muted: this.wasBackgroundMuted,
                volume: this.backgroundVolume
            });
        }
        
        // Восстанавливаем другие аудио элементы
        const otherAudioElements = document.querySelectorAll('audio');
        otherAudioElements.forEach(audio => {
            if (audio !== this.screamerSound) {
                audio.muted = false;
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Screamer();
});