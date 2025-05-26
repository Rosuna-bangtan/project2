document.addEventListener("DOMContentLoaded", () => {
    const filterButton = document.getElementById("filterButton");
    const genreFilter = document.getElementById("genreFilter");
    const typeFilter = document.getElementById("typeFilter");
    const statusFilter = document.getElementById("statusFilter");
    const animeList = document.getElementById("animeList");

    // Function to fetch Anime data
    async function fetchAnimeData() {
        const response = await fetch('https://api.jikan.moe/v4/anime');
        if (!response.ok) {
            throw new Error("Failed to fetch data");
        }
        return await response.json();
    }

    // Function to render Anime list with images based on filter criteria
    function renderAnime(anime) {
        animeList.innerHTML = ''; // Clear previous results
        anime.forEach(animeItem => {
            const animeDiv = document.createElement("div");
            animeDiv.className = "anime-item";
            animeDiv.innerHTML = `
                <img src="${animeItem.images.jpg.image_url}" alt="${animeItem.title}">
                <h3>${animeItem.title}</h3>
                <p>Type: ${animeItem.type}</p>
                <p>Status: ${animeItem.status}</p>
                <p>Genres: ${animeItem.genres.map(genre => genre.name).join(", ")}</p>
            `;
            animeList.appendChild(animeDiv);
        });
    }

    // Function to apply filters and display the results
    async function applyFilters() {
        try {
            const data = await fetchAnimeData();
            const filteredAnime = data.data.filter(anime => {
                const genreMatch = genreFilter.value ? anime.genres.some(genre => genre.name === genreFilter.value) : true;
                const typeMatch = typeFilter.value ? anime.type === typeFilter.value : true;
                const statusMatch = statusFilter.value ? anime.status === statusFilter.value : true;
                return genreMatch && typeMatch && statusMatch;
            });
            renderAnime(filteredAnime);
        } catch (error) {
            console.error(error);
        }
    }

    filterButton.addEventListener("click", applyFilters);
});