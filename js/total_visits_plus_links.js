document.addEventListener('DOMContentLoaded', () => {
/// --- Код для счетчика посещений hitscounter.dev ---
const counterElement = document.getElementById('totalVisitsCount');

if (counterElement) {
    // !!! ВАЖНО: Замените 'your_unique_id' на уникальное имя для вашего сайта
    // (например, ваше_имя_пользователя.github.io).
    const uniqueId = 'mettaneko.ru'; 
    const apiUrl = `https://hitscounter.dev/hit?url=${uniqueId}`;

    async function updateVisitCounter() {
        try {
            // hitscounter.dev API возвращает только картинку, поэтому мы не можем получить число
            // напрямую через fetch как в предыдущем сервисе.
            // Вместо этого мы используем подход с созданием изображения,
            // которое обновляется автоматически.
            const img = new Image();
            img.onload = () => {
                // Картинка загрузилась, но мы все равно не можем получить значение.
                // Этот сервис больше подходит для отображения счетчика в виде картинки (SVG).
                // Для отображения числа как текста лучше использовать hits.donaldzou.dev.
                // Здесь мы просто будем считать, что все работает, но без обновления текста.
            };
            img.onerror = () => {
                counterElement.textContent = 'Ошибка';
                console.error('hitscounter.dev: Failed to load image counter');
            };
            img.src = apiUrl;

            // Чтобы получить только число, этот сервис не предоставляет простого JSON-API.
            // Поэтому предыдущий вариант (hits.donaldzou.dev) лучше подходит для вашей задачи.
            // Если вы хотите просто добавить "бейджик" с числом, вы можете использовать
            // следующий HTML-код вместо JavaScript:
            // <img src="https://hitscounter.dev/hit?url=your_unique_id" alt="Hits">
            // Но это не позволит вам стилизовать число так же, как "AGE".

            // Чтобы все-таки отобразить число, как в предыдущих примерах,
            // hitscounter.dev не подходит, потому что он возвращает SVG-изображение, а не просто число.
            // Поэтому я настоятельно рекомендую использовать `hits.donaldzou.dev`, как было показано ранее.

        } catch (error) {
            counterElement.textContent = 'Ошибка';
            console.error('hitscounter.dev Error:', error);
        }
    }
    // Мы не вызываем функцию, потому что она не будет работать так, как вы хотите.
}
// --- Конец кода для счетчика посещений ---
// --- Конец кода для счетчика посещений ---
// --- Конец кода для счетчика посещений ---
    // --- Конец кода для счетчика посещений ---


    // Ваши существующие слушатели событий и функции links-section:
    
});