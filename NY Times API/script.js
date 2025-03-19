const API_KEY = 'IUawKEz0NahgX6hZGEeFjCMnjuJIVGPg';  // Your API key
const API_URL = `https://api.nytimes.com/svc/topstories/v2/home.json?api-key=${API_KEY}`;

async function fetchNews() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        displayNews(data.results);
    } catch (error) {
        console.error("Error fetching news:", error);
    }
}

function displayNews(articles) {
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = '';  // Clear previous results

    articles.slice(0, 10).forEach(article => {  // Show top 10 articles
        const newsElement = document.createElement('div');
        newsElement.classList.add('news-article');

        newsElement.innerHTML = `
            <h3>${article.title}</h3>
            <p>${article.abstract}</p>
            <a href="${article.url}" target="_blank">Read More</a>
        `;

        if (article.multimedia && article.multimedia.length > 0) {
            const imgElement = document.createElement('img');
            imgElement.src = article.multimedia[0].url;
            newsElement.appendChild(imgElement);
        }

        newsContainer.appendChild(newsElement);
    });
}
