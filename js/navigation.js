document.addEventListener('DOMContentLoaded', () => {
    // Определяем порядок блоков для круговой навигации
    const pageOrder = ['profile','languages','projects', 'stats'];

    const pagesWrapper = document.querySelector('.pages-wrapper');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const allPages = document.querySelectorAll('.page');

    // Функция для переключения активного класса и обновления высоты
    const showPage = (pageId) => {
        allPages.forEach(page => {
            page.classList.remove('active');
        });

        const targetBlock = document.getElementById(pageId);
        if (targetBlock) {
            targetBlock.classList.add('active');
            pagesWrapper.style.minHeight = `${targetBlock.scrollHeight}px`;
        }
    };

    // Функция для обработки навигации по кругу
    const navigate = (direction) => {
        const currentPage = document.querySelector('.page.active');
        if (!currentPage) return;

        const currentPageId = currentPage.id;
        let currentIndex = pageOrder.indexOf(currentPageId);

        let newIndex;
        if (direction === 'next') {
            newIndex = (currentIndex + 1) % pageOrder.length;
        } else if (direction === 'prev') {
            newIndex = (currentIndex - 1 + pageOrder.length) % pageOrder.length;
        }

        const newPageId = pageOrder[newIndex];
        showPage(newPageId);
    };

    // Инициализируем первый блок и высоту при загрузке страницы
    showPage('profile');
    
    // Добавляем обработчики событий
    if (nextButton) {
        nextButton.addEventListener('click', (e) => {
            e.preventDefault();
            navigate('next');
        });
    }

    if (prevButton) {
        prevButton.addEventListener('click', (e) => {
            e.preventDefault();
            navigate('prev');
        });
    }

    // Добавляем обработчик на изменение размера окна
    window.addEventListener('resize', () => {
        const currentPage = document.querySelector('.page.active');
        if (currentPage) {
            pagesWrapper.style.minHeight = `${currentPage.scrollHeight}px`;
        }
    });
});