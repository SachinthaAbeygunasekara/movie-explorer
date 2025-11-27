const TMDB_KEY = "61167bb8f939b55724390c6e71df0753";
const API_KEY = "533f7764";
const swiperWrapper = document.querySelector(".swiper-wrapper");
var swiper;
const searchInput = document.getElementById("searchInput");
const movieList = document.getElementById("movies");
const clearButton = document.getElementById("clearSearchIcon");
const loader = document.querySelector(".searchLoaderWrapper");

let movieCache = [];

async function fetchMovieDetails(title) {
    try {
        const response = await fetch(
            `http://www.omdbapi.com/?apikey=${API_KEY}&t=${title}`
        );
        return await response.json();
    } catch (err) {
        console.error("Error fetching movie detail:", title, err);
        return null;
    }
}

function formatTime(runtimeStr) {
    if (!runtimeStr || runtimeStr === "N/A") return "N/A";

    const mins = parseInt(runtimeStr);

    if (isNaN(mins) || mins <= 0) return "-";

    const h = Math.floor(mins / 60);
    const m = mins % 60;

    return `${h > 0 ? h + "h " : ""}${m}m`;
}

function addMovieToSwiper(movie, poster) {
    const slide = document.createElement("div");
    slide.className = "swiper-slide";

    const card = document.createElement("div");
    card.className = "movie-card";

    const posterBase = "https://image.tmdb.org/t/p/w500";

    const runtimeFormatted = formatTime(movie.Runtime);
    const releaseYear = movie.Year ? movie.Year : "-";

    card.innerHTML = `
        <div class="rating-top">
            <span class="rating badge bg-dark">
                <i class="bi bi-star-fill text-warning"></i> ${movie.imdbRating || "-"}
            </span>
        </div>

        <img src="${poster !== 'N/A'
            ? posterBase + poster
            : 'assets/images/default-movie.png'
        }" alt="${movie.Title}">

        <div class="movie-info-overlay">
            <h3>${movie.Title}</h3>
            <div class="movie-meta d-flex flex-row gap-2">
                <span class="meta-item">${releaseYear}</span>
                <span class="meta-item">${runtimeFormatted}</span>
            </div>
        </div>
    `;

    slide.appendChild(card);

    if (typeof swiper !== 'undefined' && swiper) {
        swiper.appendSlide(slide);
    } else {
        swiperWrapper.appendChild(slide);
    }

    return slide;
}

function renderMoviesToSwiper(movieList, posterList) {

    movieList.forEach(movie => {
        let poster = movie.poster_path;

        for (let i = 0; i < posterList.length; i++) {
            const shortA = posterList[i].title.split(/[:,]/)[0].trim();
            const shortB = movie.Title.split(/[:,]/)[0].trim();

            if (shortA === shortB) {
                poster = posterList[i].posterPath;
                break;
            }
        }

        addMovieToSwiper(movie, poster);
    });

}

function initSwiper() {
    swiper = new Swiper('.swiper', {
        slidesPerView: 'auto',
        spaceBetween: 10,
        centeredSlides: true,
        loop: true,
        grabCursor: true,
        speed: 650,
        autoplay: {
            delay: 2500,
            disableOnInteraction: false
        },
        keyboard: {
            enabled: true,
            onlyInViewport: true
        }
    });

    swiper.on('touchEnd', () => {
        swiper.autoplay.start();
    });

    swiper.on('slideChangeTransitionEnd', () => {
        if (!swiper.animating && swiper.allowSlideNext) {
            swiper.autoplay.start();
        }
    });

    swiper.on('keyPress', () => {
        swiper.autoplay.start();
    });
}

async function loadPopularMovies() {

    let loading = document.getElementById("loading");

    swiperWrapper.innerHTML = "";
    const response = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_KEY}&language=en-US&page=1`
    );
    const data = await response.json();
    const moviesList = [];
    const posterList = [];

    for (const movie of data.results) {
        posterList.push({
            title: movie.title,
            posterPath: movie.poster_path
        });

        const movieData = await fetchMovieDetails(movie.title);

        if (movieData && movieData.Response !== "False") {
            moviesList.push(movieData);
        }
    }
    loading.classList.add("d-none");
    renderMoviesToSwiper(moviesList, posterList);
    initSwiper();
}

loadPopularMovies();

async function searchMovie(query) {
    if (query.length < 2) return; // avoid useless API calls

    try {
        const response = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`);
        const data = await response.json();

        movieCache = data.Search || [];
        updateDropdown(movieCache);

    } catch (err) {
        console.error("Error fetching movie detail:", query, err);
    } finally {
        loader.style.display = "none";
    }
}

function updateDropdown(list) {
    movieList.innerHTML = "";

    if (!list.length) {
        movieList.style.display = "none";
        return;
    }

    list.forEach(movie => {
        const li = document.createElement("li");
        li.classList.add("list-group-item", "d-flex", "align-items-center", "gap-2", "bg-transparent", "text-white", "border-0");

        li.innerHTML = `
        <img src="${(movie.Poster && movie.Poster !== 'N/A') ? movie.Poster : '/assets/images/default-movie.png'}"
            style="width:30px; height:40px; object-fit:cover;" onerror="this.src='/assets/images/default-movie.png';">
            <div>
                <div><strong>${movie.Title}</strong></div>
                <small>${movie.Year}</small>
            </div>
        `;

        li.onclick = () => {
            searchInput.value = movie.Title;
            movieList.style.display = "none";
            setSerachedMovieToSwiper(movie);
        };

        movieList.appendChild(li);
    });

    movieList.style.display = "block";
}

async function setSerachedMovieToSwiper(movie) {
    try {
        const omdbResponse = await fetch(
            `http://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}&plot=short`
        );
        const movieData = await omdbResponse.json();

        if (movieData.Response !== "True") {
            return;
        }

        const tmdbResponse = await fetch(
            `https://api.themoviedb.org/3/find/${movie.imdbID}?api_key=${TMDB_KEY}&external_source=imdb_id`
        );
        const tmdbData = await tmdbResponse.json();

        const posterUrl = tmdbData.movie_results?.[0]?.poster_path
            ? `https://image.tmdb.org/t/p/w500${tmdbData.movie_results[0].poster_path}`
            : tmdbData.tv_results?.[0]?.poster_path
                ? `https://image.tmdb.org/t/p/w500${tmdbData.tv_results[0].poster_path}`
                : "/assets/images/default-movie.png";

        const newSlide = addMovieToSwiper(movieData, posterUrl);

        if (swiper) {
            requestAnimationFrame(() => {
                swiper.slideToLoop(swiper.slides.length - 1, 400);
                swiper.autoplay.stop();
                // setTimeout(() => swiper.autoplay.start(), 5000);
                requestAnimationFrame(() => swiper.update());
            });
            searchInput.value = "";
            clearButton.classList.add("visually-hidden");
        }


    } catch (err) {
        console.error("Error fetching movie data:", err);
    }
}

searchInput.addEventListener("input", function () {
    if (this.value.trim() === '') {
        clearButton.classList.add("visually-hidden");
        movieList.style.display = "none";
        loader.style.display = "none";
    } else {
        clearButton.classList.remove("visually-hidden");
        loader.style.display = "flex";
        searchMovie(this.value);
    }

});

searchInput.addEventListener("change", function () {
    setSerachedMovieToSwiper(this.value);
});

searchInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        setSerachedMovieToSwiper(this.value);
    }
});

document.getElementById("clearSearch").addEventListener("click", function () {
    searchInput.value = "";
    loader.style.display = "none";
    movieList.style.display = "none";
});