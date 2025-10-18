document.addEventListener('DOMContentLoaded', function() {
    const discordAvatar = document.getElementById('discordAvatar');
    // Обновите URL на ваш актуальный домен Vercel
    const API_URL = 'https://mettaneko-steam-proxy.vercel.app/api/discord-avatar'; 

    async function loadDiscordAvatar() {
        try {
            const response = await fetch(API_URL);
            
            if (!response.ok) {
                // Если статус не 200, читаем JSON для ошибки
                const errorData = await response.json().catch(() => ({ error: 'Unknown API Error' }));
                throw new Error('API request failed: ' + (errorData.error || response.statusText));
            }

            // Получаем JSON со ссылкой
            const data = await response.json(); 
            
            if (data.avatarUrl) {
                discordAvatar.src = data.avatarUrl;
                console.log('Discord аватар загружен:', data.avatarUrl);
                return;
            }
        } catch (error) {
            console.error('Ошибка при загрузке Discord аватара:', error);
            // В случае ошибки, скрыть аватар
            discordAvatar.style.display = 'none';
        }
    }
    
    loadDiscordAvatar();
    // Интервал для обновления (например, каждые 1 минут)
    setInterval(loadDiscordAvatar, 1 * 60 * 1000); 

});
