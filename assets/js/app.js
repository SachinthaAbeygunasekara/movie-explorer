const TMDB_KEY = "61167bb8f939b55724390c6e71df0753";
const API_KEY = "b8e38c0c";
const swiperWrapper = document.querySelector(".swiper-wrapper");
var swiper;

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
    swiperWrapper.appendChild(slide);
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
    new Swiper('.swiper', {
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