const global = {
    currentPage: window.location.pathname,
    api: {
        API_KEY: '2b17b1f036ab41bad6493f13efed0463',
        API_URL: 'https://api.themoviedb.org/3/'
    },
    search: {
        term: '',
        type: '',
        page: 1,
        totalPages: 1,
        totalResults: 0
    }
}

// get popular movies
async function getPopularMovies() {
    const { results } = await fetchApiData('movie/popular');
    results.forEach((movie) => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
        <a href="movie-details.html?${movie.id}">
        ${movie.poster_path
                ? `<img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}">`
                : `<img src="./img/no-image.jpg" alt="${movie.title}">`
            }    
        </a>
        <div class="card-content">
            <h3>${movie.title}</h3>
        </div>
        `;
        document.querySelector('#popular-movies').appendChild(div);

    })
}




async function getMovieDetails() {
    const movieId = window.location.search.split('?')[1];
    const movie = await fetchApiData(`movie/${movieId}`)
    console.log(movie);

    displayBackgroundImageDetails('movie', movie.backdrop_path)

    const div = document.createElement('div');
    div.innerHTML = `
    <div class="card-top-info">
    <div>
        <a href="movie-details.html?${movie.id}">
        ${movie.poster_path
            ? `<img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}">`
            : `<img src="./img/no-image.jpg" alt="${movie.title}">`
        } 
        </a>
    </div>
    <div>
        <h3>${movie.title}</h3>
        <p>
          <i class="fa-solid fa-star"></i> ${movie.vote_average.toFixed(1)} / 10
        </p>
        <p class="card-overview">
            ${movie.overview}
        </p>
        <h4>Genres</h4>
        <ul class="genre-list">
        ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
        </ul>
        <p>Language: ${movie.original_language}</p>
    </div>
    </div>
    <div class="card-bottom-info">
    <h4>Movie Info</h4>
    <ul>
        <li><span>Budget:</span> $${addCommasToNumber(movie.budget)}</li>
        <li><span>Runtime:</span> ${movie.runtime} minutes</li>
        <li><span>Status:</span> ${movie.status}</li>
    </ul>
    <h4>Production Company</h4>
    <p>${movie.production_companies.map((prod) => `${prod.name}`).join(', ')}</p>
    </div>
    `;

    document.querySelector('#movie-details').appendChild(div)
}

// get popular tv shows
async function getPopularTVShows() {
    const { results } = await fetchApiData('tv/popular');
    results.forEach((show) => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
        <a href="show-details.html?${show.id}">
        ${show.poster_path
                ? `<img src="https://image.tmdb.org/t/p/w500/${show.poster_path}" alt="${show.title}">`
                : `<img src="./img/no-image.jpg" alt="${show.name}">`
            }    
        </a>
        <div class="card-content">
            <h3>${show.name}</h3>
        </div>
        `;
        document.querySelector('#popular-shows').appendChild(div);

    })
}


// get show details
async function getShowDetails() {
    const showId = window.location.search.split('?')[1];
    const show = await fetchApiData(`tv/${showId}`)
    console.log(show);

    displayBackgroundImageDetails('show', show.backdrop_path)
    const div = document.createElement('div');
    div.innerHTML = `
    <div class="card-top-info">
    <div>
    <a href="show-details.html?${show.id}">
    ${show.poster_path
            ? `<img src="https://image.tmdb.org/t/p/w500/${show.poster_path}" alt="${show.name}">`
            : `<img src="./img/no-image.jpg" alt="${show.name}">`
        } 
    </a>
    </div>
    <div>
        <h3>${show.name}</h3>
        <p>
            Range: <i class="fa-solid fa-star"></i> ${show.vote_average.toFixed(1)} / 10
        </p>
        <p>${show.overview}</p>
        <h4>Genres</h4>
        <ul class="card-overview">
            ${show.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
        </ul>
        <p>Language: ${show.original_language}</p>
      
    </div>
</div>
<div class="card-bottom-info">
    <h4>Show Info</h4>
    <ul>
        <li><span>Last Air Date:</span> ${show.last_air_date}</li>
        <li><span>Number of Seasons:</span> ${show.number_of_seasons}</li>
        <li><span>Number of Episodes:</span> ${show.number_of_episodes}</li>
    </ul>
    <h4>Production Company</h4>
    <p>${show.production_companies.map((prod) => `${prod.name}`).join(', ')}</p>
</div>
    `;
    document.querySelector('#show-details').appendChild(div)
}

// main image overlay for details page
function displayBackgroundImageDetails(type, backgroundImage) {
    const overlayDiv = document.createElement('div');
    overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${backgroundImage})`;
    overlayDiv.style.backgroundSize = 'cover';
    overlayDiv.style.backgroundPosition = 'no-repeat';
    overlayDiv.style.backgroundPosition = 'center';
    overlayDiv.style.width = '100vw'
    overlayDiv.style.height = '100vh';
    overlayDiv.style.zIndex = '-1';
    overlayDiv.style.position = 'absolute';
    overlayDiv.style.top = '0';
    overlayDiv.style.left = '0';
    overlayDiv.style.opacity = '0.1';

    if (type === 'movie') {
        document.querySelector('#movie-details').appendChild(overlayDiv);
    } else {
        document.querySelector('#show-details').appendChild(overlayDiv);
    }
}



async function search() {
    const query = window.location.search;
    const urlParam = new URLSearchParams(query);
    // console.log(urlParam);
    global.search.type = urlParam.get('type');
    global.search.term = urlParam.get('search-term');


    if (global.search.term !== '' && global.search.term !== null) {
        const { results, total_pages, page } = await fetchApiSearch();

        global.search.totalPages = total_pages;
        global.search.totalResults = results;
        global.search.page = page;

        displayResultsToDOM(results)
    } else {
        allertMsg('No recent searches')
    }
}



function displayPagesForTerms() {
    const div = document.createElement('div');
    div.classList.add('pages');
    div.innerHTML = `
    <div class="container">
    <button class="btn" id="prev">Prev</button>
    <button class="btn" id="next">Next</button>
    <div class="page-counter">${global.search.page} of ${global.search.totalPages}</div>
    </div>
    `;

    document.querySelector('.btn-pagination').appendChild(div)

    // to disable prev
    if (global.search.page === 1) {
        document.querySelector('#prev').disabled = true
    }

    if (global.search.page === global.search.totalPages) {
        document.querySelector('#next').disabled = true
    }

    document.querySelector('#next').addEventListener('click', async () => {
        global.search.page++;
        const { results, total_pages } = await fetchApiSearch();
        displayResultsToDOM(results)
    })

    document.querySelector('#prev').addEventListener('click', async () => {
        global.search.page--;
        const { results, total_pages } = await fetchApiSearch();
        displayResultsToDOM(results)
    })
}



function displayResultsToDOM(results) {

    document.querySelector('#search-results').innerHTML = '';
    document.querySelector('.btn-pagination').innerHTML = '';
    document.querySelector('#search-result-heading').innerHTML = '';

    results.forEach((result) => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
        <a href="${global.search.type}-details.html?${result.id}">
        ${result.poster_path
                ? `<img src="https://image.tmdb.org/t/p/w500/${result.poster_path}" 
                alt="${global.search.type === 'movie' ? result.title : result.name}">`
                : `<img src="./img/no-image.jpg" alt="${global.search.type === 'movie' ? result.title : result.name}">`
            }    
        </a>
        <div class="card-content">
            <h3>${global.search.type === 'movie' ? result.title : result.name}</h3>
        </div>
        `;

        document.querySelector('#search-result-heading').innerHTML = `
        <h2>${results.length} of ${global.search.totalPages} for ${global.search.term}</h2>`

        document.querySelector('#search-results').appendChild(div);
    });

    displayPagesForTerms();
}


// to make it function
function allertMsg(msg, className = 'error') {
    const alertElement = document.createElement('div');
    alertElement.classList.add('alert', className);
    alertElement.appendChild(document.createTextNode(msg));
    document.querySelector('.alert').appendChild(alertElement)
    setTimeout(() => alertElement.remove(), 3000)
}

//  fetch api search
async function fetchApiSearch() {
    const API_KEY = global.api.API_KEY;
    const API_URL = global.api.API_URL;

    const response = await fetch(`${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}&page=${global.search.page}`);
    const data = response.json();
    return data;
}


//  fetch api data
async function fetchApiData(endpoint) {
    const API_KEY = global.api.API_KEY;
    const API_URL = global.api.API_URL;

    const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);
    const data = response.json();
    return data;
}


function addCommasToNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// display swiper
async function displaySwiper() {
    const { results } = await fetchApiData('movie/now_playing');
    // console.log(results);
    results.forEach((movie) => {
        const divSwiper = document.createElement('div');
        divSwiper.classList.add('swiper-slide');
        divSwiper.innerHTML = `
        <a href="movie-details.html?${movie.id}">
        ${movie.poster_path
                ? `<img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}">`
                : `<img src="./img/no-image.jpg" alt="${movie.title}">`
            }    
        </a>
        <div class="card-content">
            <h3>${movie.title}</h3>
        </div> 
        `;
        document.querySelector('.swiper-wrapper').appendChild(divSwiper);
        initSwiper()
    })
}

async function displaySwiperForTVShows() {
    const { results } = await fetchApiData('tv/top_rated');
    // console.log(results);
    results.forEach((show) => {
        const divSwiper = document.createElement('div');
        divSwiper.classList.add('swiper-slide');
        divSwiper.innerHTML = `
        <a href="show-details.html?${show.id}">
        ${show.poster_path
                ? `<img src="https://image.tmdb.org/t/p/w500/${show.poster_path}" alt="${show.title}">`
                : `<img src="./img/no-image.jpg" alt="${show.name}">`
            }    
        </a>
        <div class="card-content">
            <h3>${show.name}</h3>
        </div>
        `;
        document.querySelector('.swiper-wrapper').appendChild(divSwiper);
        initSwiper()
    })
}


// swiper
function initSwiper() {
    const swiper = new Swiper('.swiper', {
        // Navigation arrows
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        slidesPerView: 1,
        spaceBetween: 30,
        freeMode: true,
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        breakpoints: {
            500: {
                slidesPerView: 2,
            },
            700: {
                slidesPerView: 3,
            },
            1200: {
                slidesPerView: 4,
            },
        },
    });
}



function init() {
    switch (global.currentPage) {
        case '/':
        case '/index.html': {
            displaySwiper();
            getPopularMovies();
            break;
        }
        case '/movie-details.html': {
            getMovieDetails();
            break;
        }
        case '/show-details.html': {
            getShowDetails();
            break;
        }
        case '/tv-shows.html': {
            displaySwiperForTVShows();
            getPopularTVShows();
            break;
        }
        case '/search.html': {
            search();
            break;
        }
    }
}

document.addEventListener('DOMContentLoaded', init)