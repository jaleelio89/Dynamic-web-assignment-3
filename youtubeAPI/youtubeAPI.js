const API_KEY = 'AIzaSyBzs-xFJ9LT8p3uc-cHp95dXZJSdSjI1Wo';
let nextPageToken = '';
let currentQuery = '';

const spinner = document.getElementById('spinner');
const suggestions = document.getElementById('suggestions');

document.getElementById('query').addEventListener('input', handleAutocomplete);

async function searchVideos() {
    const query = document.getElementById('query').value.trim();
    if (!query) {
        alert('Please enter a search term.');
        return;
    }
    currentQuery = query;
    nextPageToken = '';
    document.getElementById('video-container').innerHTML = '';
    await fetchVideos(query);
}

async function fetchVideos(query, pageToken = '') {
    try {
        toggleSpinner(true);
        const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=6&q=${encodeURIComponent(query)}&type=video&key=${API_KEY}&pageToken=${pageToken}`);
        const data = await res.json();
        renderVideos(data.items);
        nextPageToken = data.nextPageToken || '';
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (nextPageToken) {
            loadMoreBtn.style.display = 'inline-block';
        } else {
            loadMoreBtn.style.display = 'none';
        }
        toggleSpinner(false);
        smoothScroll();
    } catch (err) {
        console.error(err);
        alert('An error occurred while fetching videos.');
        toggleSpinner(false);
    }
}

function renderVideos(videos) {
    const container = document.getElementById('video-container');
    videos.forEach(item => {
        const videoId = item.id.videoId;
        const title = item.snippet.title;
        const channel = item.snippet.channelTitle;
        container.innerHTML += `
            <div class="video">
                <iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
                <h4>${title}</h4>
                <p>Channel: ${channel}</p>
            </div>
        `;
    });
}

async function loadMoreVideos() {
    if (nextPageToken) {
        await fetchVideos(currentQuery, nextPageToken);
    }
}

function toggleSpinner(show) {
    spinner.classList.toggle('hidden', !show);
}

function smoothScroll() {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });
}

async function handleAutocomplete(e) {
    const value = e.target.value.trim();
    if (!value) {
        suggestions.innerHTML = '';
        return;
    }
    const res = await fetch(`https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=${encodeURIComponent(value)}`);
    const data = await res.json();
    suggestions.innerHTML = '';
    data[1].forEach(suggestion => {
        const li = document.createElement('li');
        li.textContent = suggestion;
        li.onclick = () => {
            document.getElementById('query').value = suggestion;
            suggestions.innerHTML = '';
            searchVideos();
        };
        suggestions.appendChild(li);
    });
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.search')) {
        suggestions.innerHTML = '';
    }
});
