const movie = JSON.parse(sessionStorage.getItem('selectedMovie'));
const posterBase = "https://image.tmdb.org/t/p/w500";

if (movie) {
    document.getElementById("moviePoster").src = posterBase + movie.Poster || '/assets/images/default-movie.png';
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