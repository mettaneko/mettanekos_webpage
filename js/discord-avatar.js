document.addEventListener('DOMContentLoaded', function() {
    const discordAvatar = document.getElementById('discordAvatar');
    // Используй URL твоей Vercel Function
    const API_URL = 'https://mettaneko-steam-proxy.vercel.app/api/discord-avatar'; 

    async function loadDiscordAvatar() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error('API request failed');
            }
            const data = await response.json();
            
            if (data.avatarUrl) {
                discordAvatar.src = data.avatarUrl;
                console.log('Discord аватар загружен:', data.avatarUrl);
                return;
            }
        } catch (error) {
            console.error('Ошибка при загрузке Discord аватара:', error);
        }
        
        // В случае ошибки, скрыть или показать стандартный аватар
        discordAvatar.style.display = 'none';
    }
    
    loadDiscordAvatar();
    setInterval(loadDiscordAvatar, 5 * 60 * 1000); // Обновление каждые 5 минут
});