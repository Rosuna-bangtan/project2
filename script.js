document.getElementById('random-quote-button').addEventListener('click', fetchRandomQuote);
document.getElementById('add-quote-button').addEventListener('click', addUserQuote);

const userQuotes = [];

// Function to fetch a random quote from an external API
async function fetchRandomQuote() {
    try {
        const response = await fetch('https://quotes-api-self.vercel.app/quote');
        const data = await response.json();
        document.getElementById('quote-display').innerText = `"${data.quote}" - ${data.author}`;
    } catch (error) {
        document.getElementById('quote-display').innerText = "Failed to fetch a random quote.";
        console.error('Error fetching random quote:', error);
    }
}

// Function to add a user quote
function addUserQuote() {
    const quoteInput = document.getElementById('user-quote-input');
    const quoteValue = quoteInput.value.trim();

    if (quoteValue) {
        userQuotes.push(quoteValue);
        displayUserQuotes();
        quoteInput.value = '';
    } else {
        alert("Please enter a quote.");
    }
}

// Function to display user quotes
function displayUserQuotes() {
    const userQuotesList = document.getElementById('user-quotes-list');
    userQuotesList.innerHTML = '';
    userQuotes.forEach(quote => {
        const li = document.createElement('li');
        li.innerText = quote;
        userQuotesList.appendChild(li);
    });
}