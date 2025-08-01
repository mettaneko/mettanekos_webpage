document.addEventListener('DOMContentLoaded', () => {
    const selector = document.getElementById('linksSelector');
    const linksContentWrapper = document.querySelector('.links-content-wrapper');
    const linksContentInner = document.querySelector('.links-content-inner'); // !!! НОВЫЙ ЭЛЕМЕНТ !!!
    const categories = Array.from(document.querySelectorAll('.links-category')); // Преобразуем в массив для удобства

    let currentActiveCategoryIndex = 0; // Начинаем с первой категории (индекс 0)

    // Функция для обновления высоты wrapper'а
    function updateWrapperHeight() {
        // Убедимся, что текущая активная категория существует
        if (categories[currentActiveCategoryIndex]) {
            linksContentWrapper.style.height = `${categories[currentActiveCategoryIndex].scrollHeight}px`;
        }
    }

    // Инициализация высоты при загрузке
    updateWrapperHeight();
    // Обновляем высоту при изменении размера окна
    window.addEventListener('resize', updateWrapperHeight);

    selector.addEventListener('click', (event) => {
        event.preventDefault(); // Предотвращаем переход по ссылке
        const targetLink = event.target.closest('a');

        if (targetLink && !targetLink.classList.contains('active')) {
            const targetCategoryName = targetLink.dataset.target;
            const newCategory = document.getElementById(`${targetCategoryName}Buttons`);
            const newCategoryIndex = categories.indexOf(newCategory);

            if (newCategoryIndex !== -1 && newCategoryIndex !== currentActiveCategoryIndex) {
                // Удаляем активный класс со всех ссылок селектора
                selector.querySelectorAll('a').forEach(link => link.classList.remove('active'));
                // Добавляем активный класс на нажатую ссылку
                targetLink.classList.add('active');

                // Вычисляем новое смещение для links-content-inner
                // Смещение = -(индекс новой категории * 100%)
                linksContentInner.style.transform = `translateX(-${newCategoryIndex * 100}%)`;

                currentActiveCategoryIndex = newCategoryIndex; // Обновляем текущий индекс

                // Обновляем высоту wrapper'а после смены категории
                // Даем небольшую задержку, чтобы анимация сдвига началась, прежде чем высота изменится
                setTimeout(updateWrapperHeight, 100); // Можно поиграться с этим значением
            }
        }
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

});
   
   
   
   var n = localStorage.getItem('on_load_counter');

    if (n === null) {
        n = 0;
    }

    n++;

    localStorage.setItem("on_load_counter", n);

    document.getElementById('counter-digit').innerHTML = n;
