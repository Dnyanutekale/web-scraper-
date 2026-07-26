from flask import Flask, render_template, request, jsonify
import requests
from bs4 import BeautifulSoup
import traceback
import cloudscraper

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/scrape', methods=['POST'])
def scrape():
    data = request.json
    url = data.get('url')
    selector = data.get('selector')

    if not url:
        return jsonify({'error': 'URL is required.'}), 400

    try:
        # Use cloudscraper to bypass anti-bot protections like Cloudflare
        scraper = cloudscraper.create_scraper()
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = scraper.get(url, headers=headers, timeout=15)
        response.raise_for_status()
        
        # Parse HTML
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Find elements
        if selector:
            elements = soup.select(selector)
            # Extract text from elements
            results = [el.get_text(strip=True) for el in elements]
        else:
            # If no selector provided, just return the title
            title = soup.title.string if soup.title else 'No title found'
            results = [title]
        
        return jsonify({'results': results})
    
    except requests.exceptions.RequestException as e:
        return jsonify({'error': f'Failed to fetch URL: {str(e)}'}), 400
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
