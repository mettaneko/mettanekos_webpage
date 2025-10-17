document.addEventListener('DOMContentLoaded', function() {
    const discordAvatar = document.getElementById('discordAvatar');
    // Используй URL твоей Vercel Function
    // Vercel Function теперь возвращает само изображение (MIME-тип image/png)
    const API_URL = 'https://mettaneko-steam-proxy.vercel.app/api/discord-avatar'; 

    async function loadDiscordAvatar() {
        try {
            const response = await fetch(API_URL);
            
            if (!response.ok) {
                // Если статус не 200, возможно, это ошибка JSON
                const errorData = await response.json().catch(() => ({ error: 'Unknown API Error' }));
                throw new Error('API request failed: ' + (errorData.error || response.statusText));
            }

            // Получаем ответ в виде Blob (двоичные данные)
            const imageBlob = await response.blob(); 
            
            // Создаем локальный URL для Blob, который можно использовать в src тега <img>
            const imageUrl = URL.createObjectURL(imageBlob); 
            
            discordAvatar.src = imageUrl;
            console.log('Discord аватар загружен (через конвертацию в PNG):', imageUrl);
            
        } catch (error) {
            console.error('Ошибка при загрузке Discord аватара:', error);
            // В случае ошибки, скрыть или показать стандартный аватар
            discordAvatar.style.display = 'none';
        }
    }
    
    loadDiscordAvatar();
    // Интервал для обновления (например, каждые 10 минут)
    setInterval(loadDiscordAvatar, 10 * 60 * 1000); 
});