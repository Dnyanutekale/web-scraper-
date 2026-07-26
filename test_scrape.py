import requests

try:
    response = requests.post(
        'http://127.0.0.1:5000/scrape',
        json={'url': 'https://example.com', 'selector': 'h1'},
        timeout=10
    )
    print("Status Code:", response.status_code)
    print("Response JSON:", response.json())
except Exception as e:
    print("Error:", str(e))
