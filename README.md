# 🎬 Movie Explorer (OMDb + TMDb)

A fully responsive movie discovery website built using **HTML**, **CSS**, and **JavaScript**, powered by the **OMDb API** and **TMDb API**. Users can search movies, browse by keywords, discover random movies, and view full details including plot, actors, ratings, posters, trailers, and streaming providers.

---

## 🌟 Features

### 🔍 Movie Search
Search movies by exact title and get detailed information.

### 🧩 Keyword-Based Search
Search movies by generic keywords (e.g., "love", "war", "batman") to browse multiple results.

### 🏠 Homepage
- Displays popular movies in a **Swiper.js carousel**.
- Poster, IMDb rating, release year, runtime displayed on hover.
- Click on a movie to go to the **Movie Details** page.

### 📄 Movie Details Page
- Title, Year, Language, Runtime, Genre, Director, Writer, Actors, Plot
- Poster
- IMDb Rating & Votes, Metascore
- Awards, Box Office, Country, Released Date
- **YouTube Trailer** embedded
- **Watch Now** button with streaming provider (if available)

---

## 🔗 APIs Used

### OMDb API
- Used for movie search, autocomplete, and detailed movie info.
- [OMDb API](https://www.omdbapi.com/)
- Requires an API key:
```http
https://www.omdbapi.com/?apikey=YOUR_API_KEY&t=Inception
```

### TMDb API
- Used for movie posters, trailers, and streaming providers.
- [TMDb API](https://www.themoviedb.org/documentation/api)
- Requires an API key:
```http
https://api.themoviedb.org/3/find/{imdbID}?api_key=YOUR_TMDB_KEY&external_source=imdb_id
```

---

## 🛠️ Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Bootstrap 5
- Swiper.js
- OMDb & TMDb APIs
- Git & GitHub
- GitHub Pages Deployment

---

## 📁 Project Structure

```
movie-explorer/
│── index.html                  # Homepage
│── movie-details.html          # Movie details page
│── assets/
│    ├── css/
│    │    └── style.css
│    ├── js/
│    │    ├── app.js
│    │    └── movie-details.js
│    ├── images/
│── README.md
```

---

## 🚀 Run Locally

1. Clone the repository:
```bash
git clone https://github.com/SachinthaAbeygunasekara/movie-explorer.git
```

2. Open the project folder.

3. Open `index.html` in your browser:
```bash
open index.html
```

---

## 🌍 GitHub Pages Deployment

1. Go to **Settings → Pages** in your repository.
2. Select:
   - **Branch:** main
   - **Folder:** root
3. Save.
4. Your website will be live at:
```
https://your-username.github.io/movie-explorer/
```

---

## 🖼️ Screenshots

### Homepage
<img width="1919" height="910" alt="image" src="https://github.com/user-attachments/assets/32eeba00-f48d-4f46-afa7-ff580cffa21c" />

### Search Results
<img width="1919" height="909" alt="image" src="https://github.com/user-attachments/assets/01686348-af1c-4184-9fdb-e940e4f45d96" />

### Movie Details Page
<img width="859" height="825" alt="image" src="https://github.com/user-attachments/assets/5593d3a4-9c11-49b1-9c81-21214ab2c3a8" />

---

## 🙌 Author

Created by **Sachintha**

---

## 📄 License

This project is for educational purposes only.
