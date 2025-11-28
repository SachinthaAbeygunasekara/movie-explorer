const movie = JSON.parse(sessionStorage.getItem('selectedMovie'));
const posterBase = "https://image.tmdb.org/t/p/w500";
const TMDB_KEY = "61167bb8f939b55724390c6e71df0753";
const imdbID = movie.imdbID;

if (movie) {
    document.getElementById("moviePoster").src = posterBase + movie.Poster || './assets/images/default-movie.png';
    document.getElementById("movieTitle").textContent = movie.Title + ' (' + movie.Year + ')';
    document.getElementById("movieRuntime").textContent = formatTime(movie.Runtime);
    document.getElementById("movieGenre").textContent = movie.Genre;
    document.getElementById("movieDirector").textContent = movie.Director;
    document.getElementById("movieActors").textContent = movie.Actors;
    document.getElementById("moviePlot").textContent = movie.Plot;

    document.getElementById("movieRating").textContent = movie.imdbRating || "-";
    document.getElementById("movieMetascore").textContent = movie.Metascore || "-";
    document.getElementById("movieAwards").textContent = movie.Awards || "-";
    document.getElementById("movieBoxOffice").textContent = movie.BoxOffice || "-";
    document.getElementById("movieCountry").textContent = movie.Country || "-";
    document.getElementById("movieLanguage").textContent = movie.Language || "-";
    document.getElementById("movieReleased").textContent = movie.Released || "-";
    document.getElementById("movieWriter").textContent = movie.Writer || "-";
    document.getElementById("movieimdbVotes").textContent = movie.imdbVotes || "-";
}

async function fetchTMDBDetails(imdbID) {
    try {
        // fetch TMDBID
        const response = await fetch(`https://api.themoviedb.org/3/find/${imdbID}?api_key=${TMDB_KEY}&external_source=imdb_id`);
        const data = await response.json();

        if (!data.movie_results || data.movie_results.length === 0) {
            console.warn("No TMDB match found");
            fallbackWatchButton();
            return;
        }

        const movie = data.movie_results[0];
        const tmdbID = movie.id;

        // fetch movie details + videos + watch providers
        const movieResponse = await fetch(`https://api.themoviedb.org/3/movie/${tmdbID}?api_key=${TMDB_KEY}&append_to_response=videos,watch/providers`);
        const movieDetails = await movieResponse.json();

        const trailerElem = document.getElementById("movieTrailer");
        const trailer = movieDetails.videos.results.find(v => v.type === "Trailer" && v.site === "YouTube");

        if (trailer) {
            trailerElem.src = `https://www.youtube.com/embed/${trailer.key}`;
            trailerElem.style.display = "block";
        } else {
            trailerElem.style.display = "none";
        }

        const watchButton = document.getElementById("watchNowButton");
        const countryCode = navigator.language.slice(0, 2).toUpperCase(); // ex:- "US"
        const providerInfo = movieDetails["watch/providers"].results[countryCode];

        if (providerInfo && providerInfo.flatrate?.length > 0) {
            const firstProvider = providerInfo.flatrate[0];
            watchButton.href = providerInfo.link;
            watchButton.textContent = `Watch on ${firstProvider.provider_name}`;
            watchButton.style.display = "inline-block";
        } else {
            fallbackWatchButton(tmdbID);
        }

    } catch (err) {
        console.error("TMDB fetch error:", err);
        fallbackWatchButton();
    }
}

fetchTMDBDetails(movie.imdbID);

document.getElementById("backButton").addEventListener("click", () => {
    window.history.back();
});

function formatTime(runtimeStr) {
    if (!runtimeStr || runtimeStr === "N/A") return "N/A";

    const mins = parseInt(runtimeStr);

    if (isNaN(mins) || mins <= 0) return "-";

    const h = Math.floor(mins / 60);
    const m = mins % 60;

    return `${h > 0 ? h + "h " : ""}${m}m`;
}

function fallbackWatchButton(tmdbID = null) {
    const watchButton = document.getElementById("watchNowButton");
    if (tmdbID) {
        watchButton.href = `https://www.themoviedb.org/movie/${tmdbID}/watch`;
    } else {
        watchButton.href = "#";
    }
    watchButton.textContent = "Watch on TMDB";
    watchButton.style.display = "inline-block";
}