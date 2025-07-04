const newsContainer = document.getElementById('news-container');
const countrySelect = document.getElementById('country-select');

async function fetchNews(countryCode) {
    newsContainer.innerHTML = '<p>Загрузка новостей...</p>'; // Показываем индикатор загрузки
    try {
        const response = await fetch(`/.netlify/functions/get-news?country=${countryCode}`);
        const data = await response.json();

        if (data.status === 'ok' && data.articles.length > 0) {
    displayNews(data.articles);
} else {
    // Если API вернул ошибку или нет статей, отобразим соответствующее сообщение
    if (data.status === 'error' && data.message) {
        newsContainer.innerHTML = `<p>Ошибка API: ${data.message}</p>`; // Показываем сообщение об ошибке от NewsAPI
    } else {
        newsContainer.innerHTML = '<p>Не удалось загрузить новости для этой страны или новостей нет. Попробуйте другую.</p>';
    }
}
    } catch (error) {
        console.error('Ошибка при получении новостей:', error);
        newsContainer.innerHTML = '<p>Произошла ошибка при загрузке новостей. Пожалуйста, проверьте подключение к интернету или попробуйте позже.</p>';
    }
}

function displayNews(articles) {
    newsContainer.innerHTML = ''; // Очищаем контейнер перед добавлением новых новостей
    articles.forEach(article => {
        const newsItem = document.createElement('div');
        newsItem.classList.add('news-item');

        // Изображение
        const image = document.createElement('img');
        image.src = article.urlToImage || 'https://via.placeholder.com/400x200?text=No+Image'; // Заглушка
        image.alt = article.title || 'Новостное изображение';

        // Заголовок
        const title = document.createElement('h2');
        title.textContent = article.title || 'Без заголовка';

        // Описание
        const description = document.createElement('p');
        description.textContent = article.description || 'Нажмите "Читать полностью", чтобы узнать больше.';

        // Источник
        const source = document.createElement('p');
        source.classList.add('source');
        source.textContent = `Источник: ${article.source.name || 'Неизвестно'}`;

        // Ссылка
        const link = document.createElement('a');
        link.href = article.url;
        link.textContent = 'Читать полностью';
        link.target = '_blank'; // Открывать в новой вкладке
        link.rel = 'noopener noreferrer'; // Рекомендация безопасности для target="_blank"

        newsItem.appendChild(image);
        newsItem.appendChild(title);
        newsItem.appendChild(description);
        newsItem.appendChild(source);
        newsItem.appendChild(link);

        newsContainer.appendChild(newsItem);
    });
}

// Обработчик события для выбора страны
countrySelect.addEventListener('change', (event) => {
    const selectedCountry = event.target.value;
    fetchNews(selectedCountry);
});

// Загрузка новостей по умолчанию при первом открытии страницы
// Используем значение по умолчанию из <select> (например, 'us')
fetchNews(countrySelect.value);