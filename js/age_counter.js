document.addEventListener('DOMContentLoaded', () => {
    // --- Код для счетчика лет ---
    const birthDate = new Date('2009-05-29'); // !!! ВАЖНО: Замените на вашу дату рождения (ГГГГ-ММ-ДД) !!!

    function calculateAge() {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();

        // Если текущий месяц меньше месяца рождения, или месяцы совпадают, но день меньше дня рождения
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--; // Уменьшаем возраст на 1, так как день рождения в этом году еще не наступил
        }
        return age;
    }

    const ageElement = document.getElementById('ageCounter');
    if (ageElement) {
        ageElement.textContent = calculateAge();
    }
    // --- Конец кода для счетчика лет ---


    // Ваши существующие слушатели событий и функции:
    const selector = document.getElementById('linksSelector');
    const linksContentInner = document.querySelector('.links-content-inner');
    const categories = Array.from(document.querySelectorAll('.links-category'));

    let currentActiveCategoryIndex = 0;

    selector.addEventListener('click', (event) => {
        event.preventDefault();
        const targetLink = event.target.closest('a');

        if (targetLink && !targetLink.classList.contains('active')) {
            const targetCategoryName = targetLink.dataset.target;
            const newCategory = document.getElementById(`${targetCategoryName}Buttons`);
            const newCategoryIndex = categories.indexOf(newCategory);

            if (newCategoryIndex !== -1 && newCategoryIndex !== currentActiveCategoryIndex) {
                selector.querySelectorAll('a').forEach(link => link.classList.remove('active'));
                targetLink.classList.add('active');

                linksContentInner.style.transform = `translateX(-${newCategoryIndex * 100}%)`;

                currentActiveCategoryIndex = newCategoryIndex;
            }
        }
    });
});