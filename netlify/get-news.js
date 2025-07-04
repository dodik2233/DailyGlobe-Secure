// netlify/functions/get-news.js
const fetch = require('node-fetch'); // Используем node-fetch для запросов в Node.js среде

// API-ключ будет браться из переменных окружения Netlify,
// которые мы настроим позже. Это безопасно!
const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

// Это основная функция, которую будет вызывать Netlify Function
exports.handler = async function(event, context) {
    // Получаем код страны из запроса от вашего сайта (например, ?country=us)
    const countryCode = event.queryStringParameters.country || 'us'; // По умолчанию 'us'

    // Проверяем, что API-ключ установлен (это важно для отладки)
    if (!NEWS_API_KEY) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'API key is not configured in Netlify environment variables.' }),
        };
    }

    try {
        // Делаем запрос к NewsAPI.org, используя наш секретный ключ
        const response = await fetch(`${NEWS_API_BASE_URL}/top-headlines?country=${countryCode}&apiKey=${NEWS_API_KEY}`);
        const data = await response.json(); // Парсим JSON-ответ от NewsAPI

        // Отправляем ответ обратно вашему сайту
        return {
            statusCode: 200, // Успешный статус
            headers: {
                "Content-Type": "application/json",
                // Эти заголовки разрешают вашему сайту получать данные от функции
                "Access-Control-Allow-Origin": "*", // Разрешает запросы с любого домена (для простоты). В реальном проекте можно указать конкретный домен вашего сайта.
                "Access-Control-Allow-Methods": "GET",
                "Access-Control-Allow-Headers": "Content-Type",
            },
            body: JSON.stringify(data), // Преобразуем данные в строку JSON
        };
    } catch (error) {
        console.error('Ошибка при получении новостей через функцию Netlify:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Произошла ошибка на сервере при получении новостей.' }),
        };
    }
};