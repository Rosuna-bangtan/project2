document.addEventListener("DOMContentLoaded", () => {
    const factButton = document.getElementById("factButton");
    const factDisplay = document.getElementById("factDisplay");
    const animeSelector = document.getElementById("animeSelector");

    // Function to fetch fun facts for the selected anime
    async function fetchFunFact(animeName) {
        try {
            const response = await fetch(`https://anime-facts-rest-api.herokuapp.com/api/v1/${animeName}`);
            if (!response.ok) {
                throw new Error('Failed to fetch fun fact.');
            }
            const data = await response.json();

            // Check if there are facts available for the anime
            if (data && data.data.length > 0) {
                const randomFact = data.data[Math.floor(Math.random() * data.data.length)];
                displayFact(randomFact);
            } else {
                factDisplay.innerHTML = 'No facts found for the selected anime.';
            }
        } catch (error) {
            console.error('Error:', error);
            factDisplay.innerHTML = 'Error fetching fun fact. Please try again later.';
        }
    }

    // Function to display the fetched fun fact
    function displayFact(fact) {
        factDisplay.innerHTML = `<strong>Fact:</strong> ${fact.fact}`;
    }

    // Event listener for the button
    factButton.addEventListener("click", () => {
        const selectedAnime = animeSelector.value;
        fetchFunFact(selectedAnime);
    });
});