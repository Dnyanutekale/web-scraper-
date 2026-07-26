document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('scrapeForm');
    const submitBtn = document.getElementById('submitBtn');
    const resultsCard = document.getElementById('resultsCard');
    const resultsContent = document.getElementById('resultsContent');
    const resultCount = document.getElementById('resultCount');
    const errorCard = document.getElementById('errorCard');
    const errorMessage = document.getElementById('errorMessage');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const url = document.getElementById('url').value;
        const selector = document.getElementById('selector').value;

        // Reset UI
        errorCard.style.display = 'none';
        resultsCard.style.display = 'none';
        resultsContent.innerHTML = '';
        
        // Set loading state
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');

        try {
            const response = await fetch('/scrape', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url, selector })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch data');
            }

            // Display results
            if (data.results && data.results.length > 0) {
                resultCount.textContent = `${data.results.length} item${data.results.length === 1 ? '' : 's'}`;
                
                data.results.forEach((item, index) => {
                    if (item.trim() === '') return; // Skip empty strings
                    const div = document.createElement('div');
                    div.className = 'result-item';
                    div.style.animationDelay = `${index * 0.05}s`;
                    div.textContent = item;
                    resultsContent.appendChild(div);
                });

                if (resultsContent.children.length === 0) {
                    const emptyDiv = document.createElement('div');
                    emptyDiv.className = 'result-item';
                    emptyDiv.textContent = 'No text content found for the given selector.';
                    resultsContent.appendChild(emptyDiv);
                    resultCount.textContent = '0 items';
                }
                
                resultsCard.style.display = 'block';
            } else {
                throw new Error('No data found for the given selector.');
            }
            
        } catch (error) {
            errorMessage.textContent = error.message;
            errorCard.style.display = 'block';
        } finally {
            // Remove loading state
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
        }
    });
});
