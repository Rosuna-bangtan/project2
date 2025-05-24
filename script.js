const apiKey = 'sk-GCQc681a3e2f4c4f910260'; 
let allPlants = []; 
let currentPage = 1;
let isLoading = false;
const plantsPerPage = 30; // Number of plants to fetch per page

async function fetchPlants(url) {
    showLoading();
    try {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        const response = await fetch(url, requestOptions);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.text();
        const data = JSON.parse(result);

        return data;
    } catch (error) {
        console.error('Error fetching plants:', error);
        document.getElementById('plantList').innerHTML = '<li>Error loading plants.</li>';
        return null;
    } finally {
        hideLoading();
    }
}

function displayPlants(plants) {
    const plantList = document.getElementById('plantList');
    plantList.innerHTML = ''; 

    if (!plants || plants.length === 0) {
        plantList.innerHTML = '<li>No plants found.</li>';
        return;
    }

    plants.forEach(plant => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            ${plant.common_name} (${plant.scientific_name})
            <button onclick="showPlantDetails(${plant.id})">Details</button>
        `;
        plantList.appendChild(listItem);
    });
}

async function getAllPlants() {
    allPlants = [];
    currentPage = 1;
    await loadAllPlants();
}

async function loadAllPlants() {
    let hasMore = true;
    while (hasMore) {
        const url = `https://perenual.com/api/v2/species-list?key=${apiKey}&page=${currentPage}`;
        const data = await fetchPlants(url);

        if (data && data.data) {
            allPlants = allPlants.concat(data.data);
            if (data.data.length < plantsPerPage) {
                hasMore = false;
            } else {
                currentPage++;
            }
        } else {
            hasMore = false;
        }
    }
    displayPlants(allPlants);
}

function searchPlant() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    if (allPlants.length > 0) {
        // Filter from cached data
        const filteredPlants = allPlants.filter(plant =>
            plant.common_name.toLowerCase().includes(searchTerm) ||
            plant.scientific_name.toLowerCase().includes(searchTerm)
        );
        displayPlants(filteredPlants);
    } else {
        alert("Please load plants first by clicking 'Show All Plants'.");
    }
}

async function showPlantDetails(plantId) {
    showLoading();
    try {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        const response = await fetch(`https://perenual.com/api/v2/species/details/${plantId}?key=${apiKey}`, requestOptions);
        const result = await response.text();
        const plant = JSON.parse(result);

        if (plant && plant.id) {
            const plantDetailContent = document.getElementById('plantDetailContent');
            plantDetailContent.innerHTML = `
                <h3>${plant.common_name} (${plant.scientific_name})</h3>
                <p><strong>Family:</strong> ${plant.family}</p>
                <p><strong>Description:</strong> ${plant.description || 'No description available'}</p>
                ${plant.default_image?.regular_url ? `<img src="${plant.default_image.regular_url}" alt="${plant.common_name}" style="max-width: 200px;">` : '<p>No image available</p>'}
            `;
            document.getElementById('plantDetails').style.display = 'block';
        } else {
            document.getElementById('plantDetailContent').innerHTML = 'Plant details not found.';
            document.getElementById('plantDetails').style.display = 'block';
        }
    } catch (error) {
        console.error('Error fetching plant details:', error);
        document.getElementById('plantDetailContent').innerHTML = 'Error loading plant details.';
        document.getElementById('plantDetails').style.display = 'block';
    } finally {
        hideLoading();
    }
}

function sortByAlphabetical() {
    if (allPlants.length === 0) {
        alert("Please load plants first by clicking 'Show All Plants'.");
        return;
    }

    const sortedPlants = [...allPlants].sort((a, b) => {
        const nameA = a.common_name.toLowerCase();
        const nameB = b.common_name.toLowerCase();
        return nameA.localeCompare(nameB);
    });
    displayPlants(sortedPlants);
}

function sortByGenus() {
    if (allPlants.length === 0) {
        alert("Please load plants first by clicking 'Show All Plants'.");
        return;
    }

    const sortedPlants = [...allPlants].sort((a, b) => {
        const genusA = a.scientific_name[0].toLowerCase(); // Extract genus from scientific name
        const genusB = b.scientific_name[0].toLowerCase();
        return genusA.localeCompare(genusB);
    });
    displayPlants(sortedPlants);
}

function showLoading() {
    isLoading = true;
    document.getElementById('loadingIndicator').style.display = 'block';
}

function hideLoading() {
    isLoading = false;
    document.getElementById('loadingIndicator').style.display = 'none';
}

