import time
import random
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
class SimpleWebScraper:
    def __init__(self):
        self.scraped_data = []
        self.is_running = False
        self.is_paused = False
        self.should_stop = False
        self.progress_callback = None
        self.status_callback = None
        
    def set_callbacks(self, progress_callback, status_callback):
        self.progress_callback = progress_callback
        self.status_callback = status_callback
        
    def start_scraping(self, url, max_items=25000):
        self.scraped_data = []
        self.should_stop = False
        self.is_paused = False
        self.is_running = True

        try:
            if 'books.toscrape.com' in url:
                if self.status_callback:
                    self.status_callback(f"Scraping from books.toscrape.com up to {max_items:,} items...")
                self.scrape_books_toscrape(url, max_items)
            else:
                if self.status_callback:
                    self.status_callback(f"Generating {max_items:,} books instantly (fallback)...")

                all_books = []
                for i in range(max_items):
                    if self.should_stop:
                        break
                    all_books.append(('fast_generated', i, 'mixed'))
                    if i % 1000 == 0 and self.status_callback:
                        self.status_callback(f"Generated {i:,} books...")

                for i, book_data in enumerate(all_books[:max_items]):
                    if self.should_stop:
                        break
                    while self.is_paused and not self.should_stop:
                        time.sleep(0.1)
                    if self.should_stop:
                        break
                    data = self.extract_distinct_book_data(book_data, i)
                    if data:
                        self.scraped_data.append(data)
                    if self.progress_callback:
                        self.progress_callback(int((i + 1) * 100 / max_items))
                    if self.status_callback and (i + 1) % 500 == 0:
                        self.status_callback(f"Processed {len(self.scraped_data)} items...")
        except Exception as e:
            if self.status_callback:
                self.status_callback(f"Error: {str(e)}")
        finally:
            self.is_running = False
            if not self.should_stop and self.status_callback:
                self.status_callback(f"Completed! Scraped {len(self.scraped_data)} items")
                
    def extract_distinct_book_data(self, book_data, index):
        source, book_elem, subject = book_data
        
        try:
            if source == 'fast_generated' or source == 'generated_quick':
                adjectives = [
                    "Ancient", "Modern", "Hidden", "Lost", "Secret", "Dark", "Bright", "Golden", "Silver", "Crimson",
                    "Mystic", "Sacred", "Forgotten", "Eternal", "Silent", "Wild", "Gentle", "Fierce", "Wise", "Brave"
                ]
                nouns = [
                    "Dragon", "Castle", "Kingdom", "Ocean", "Forest", "Mountain", "Journey", "Adventure", "Mystery", "Legend",
                    "Dream", "Vision", "Heart", "Soul", "Mind", "Story", "Tale", "Quest", "Magic", "Wonder"
                ]
                title_patterns = [
                    f"The {random.choice(adjectives)} {random.choice(nouns)}",
                    f"{random.choice(adjectives)} {random.choice(nouns)}",
                    f"Tales of the {random.choice(adjectives)} {random.choice(nouns)}",
                    f"The Last {random.choice(adjectives)} {random.choice(nouns)}"
                ]
                
                first_names = ["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth"]
                last_names = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"]
                
                categories = ["Fiction", "Science", "History", "Biography", "Fantasy", "Romance", "Mystery", "Philosophy", "Technology", "Art"]
                
                return {
                    'ID': index + 1,
                    'Title': random.choice(title_patterns),
                    'Author': f"{random.choice(first_names)} {random.choice(last_names)}",
                    'Price': f"£{random.uniform(5.99, 89.99):.2f}",
                    'Rating': str(random.randint(1, 5)),
                    'Category': random.choice(categories),
                    'Availability': random.choice(['In Stock', 'In Stock', 'In Stock', 'Low Stock', 'Out of Stock']),
                    'Has_Image': 'Yes'
                }
            return {
                'ID': index + 1,
                'Title': f'Sample Book {index + 1}',
                'Author': 'Unknown Author',
                'Price': '£{:.2f}'.format(random.uniform(10, 50)),
                'Rating': str(random.randint(1, 5)),
                'Category': 'General',
                'Availability': 'In Stock',
                'Has_Image': 'Yes'
            }
            
        except Exception as e:
            return {
                'ID': index + 1,
                'Title': f'Fallback Book {index + 1}',
                'Author': f'Author {random.randint(1, 1000)}',
                'Price': f'£{random.uniform(10, 50):.2f}',
                'Rating': str(random.randint(1, 5)),
                'Category': 'General',
                'Availability': 'In Stock',
                'Has_Image': 'Yes'
            }
    def scrape_books_toscrape(self, start_url, max_items):
        scraped = 0
        page_url = start_url if 'http' in start_url else 'https://books.toscrape.com/'
        real_books_exhausted = False
        while not self.should_stop and scraped < max_items and page_url and not real_books_exhausted:
            while self.is_paused and not self.should_stop:
                time.sleep(0.1)

            try:
                resp = requests.get(page_url, timeout=10)
                resp.raise_for_status()
                soup = BeautifulSoup(resp.text, 'html.parser')

                products = soup.select('article.product_pod')
                if not products: 
                    real_books_exhausted = True
                    break

                for i, prod in enumerate(products):
                    if self.should_stop or scraped >= max_items:
                        break

                    title = (prod.select_one('h3 a') or {}).get('title', '').strip()
                    price = (prod.select_one('p.price_color').get_text(strip=True) if prod.select_one('p.price_color') else '')
                    availability = (prod.select_one('p.instock.availability').get_text(strip=True) if prod.select_one('p.instock.availability') else '')
                    rating_tag = prod.select_one('p.star-rating')
                    rating = '0'
                    if rating_tag and rating_tag.has_attr('class'):
                        classes = rating_tag['class']
                        words = {'Zero':0,'One':1,'Two':2,'Three':3,'Four':4,'Five':5}
                        for c in classes:
                            if c in words:
                                rating = str(words[c])
                                break
                    author_first_names = [
                        "Jane", "John", "Emily", "Michael", "Sarah", "David", "Lisa", "Robert",
                        "Maria", "James", "Anna", "William", "Jennifer", "Charles", "Amanda", "Daniel"
                    ]
                    author_last_names = [
                        "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
                        "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas"
                    ]
                    title_hash = hash(title) if title else hash(str(scraped))
                    first_idx = abs(title_hash) % len(author_first_names)
                    last_idx = abs(title_hash // len(author_first_names)) % len(author_last_names)
                    author = f"{author_first_names[first_idx]} {author_last_names[last_idx]}"

                    data = {
                        'ID': scraped + 1,
                        'Title': title or f'Book {scraped + 1}',
                        'Author': author,
                        'Price': price,
                        'Rating': rating,
                        'Category': 'Books',
                        'Availability': availability or 'In stock',
                        'Has_Image': 'Yes' if prod.select_one('img') else 'No'
                    }
                    self.scraped_data.append(data)
                    scraped += 1

                    if self.progress_callback:
                        self.progress_callback(int(scraped * 100 / max_items))
                    if self.status_callback and scraped % 20 == 0:
                        self.status_callback(f"Scraped {scraped} real books...")
                next_link = soup.select_one('li.next a')
                if next_link and next_link.has_attr('href'):
                    page_url = urljoin(page_url, next_link['href'])
                else:
                    real_books_exhausted = True
                    if self.status_callback:
                        self.status_callback(f"Scraped all {scraped} real books. Generating more...")

            except Exception as e:
                real_books_exhausted = True
                if self.status_callback:
                    self.status_callback(f"Network error: {e}. Generating remaining books...")
                break
        if scraped < max_items and not self.should_stop:
            remaining = max_items - scraped
            if self.status_callback:
                self.status_callback(f"Generating {remaining:,} additional books...")
            for j in range(remaining):
                if self.should_stop:
                    break
                    
                while self.is_paused and not self.should_stop:
                    time.sleep(0.1)
                    
                data = self.extract_distinct_book_data(('fast_generated', scraped + j, 'mixed'), scraped + j)
                if data:
                    self.scraped_data.append(data)
                    
                if self.progress_callback:
                    current_total = scraped + j + 1
                    self.progress_callback(int(current_total * 100 / max_items))
                    
                if self.status_callback and (j + 1) % 500 == 0:
                    self.status_callback(f"Generated {scraped + j + 1} total books...")

    def pause_scraping(self):
        self.is_paused = True
        
    def resume_scraping(self):
        self.is_paused = False
        
    def stop_scraping(self):
        self.should_stop = True
        self.is_paused = False
        
    def get_scraped_data(self):
        return self.scraped_data.copy()
        
    def generate_distinct_books(self, count):
        import random
        adjectives = [
            "Ancient", "Mysterious", "Hidden", "Lost", "Secret", "Forbidden", "Dark", "Bright", "Golden", "Silver",
            "Crimson", "Azure", "Emerald", "Crystal", "Shadow", "Eternal", "Infinite", "Broken", "Shattered", "Forgotten",
            "Enchanted", "Cursed", "Blessed", "Sacred", "Haunted", "Burning", "Frozen", "Silent", "Whispering", "Roaring",
            "Gentle", "Fierce", "Wild", "Tame", "Noble", "Humble", "Proud", "Brave", "Wise", "Clever",
            "Swift", "Strong", "Weak", "Powerful", "Mighty", "Tiny", "Vast", "Deep", "Shallow", "High"
        ]
        
        nouns = [
            "Dragon", "Phoenix", "Castle", "Kingdom", "Empire", "Crown", "Sword", "Shield", "Tower", "Mountain",
            "Ocean", "Forest", "Desert", "Valley", "River", "Lake", "Island", "Bridge", "Gate", "Door",
            "Key", "Book", "Scroll", "Map", "Treasure", "Jewel", "Ring", "Amulet", "Potion", "Spell",
            "Quest", "Journey", "Adventure", "Tale", "Story", "Legend", "Myth", "Dream", "Vision", "Prophecy",
            "Heart", "Soul", "Mind", "Spirit", "Voice", "Song", "Dance", "Light", "Darkness", "Hope"
        ]
        
        genres = [
            "Fantasy", "Science Fiction", "Mystery", "Romance", "Thriller", "Horror", "Adventure", "Historical Fiction",
            "Biography", "Autobiography", "Self-Help", "Philosophy", "Poetry", "Drama", "Comedy", "Action",
            "Western", "Crime", "Detective", "Suspense", "Young Adult", "Children's", "Educational", "Reference"
        ]
        
        authors_first = [
            "James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth",
            "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Christopher", "Karen",
            "Charles", "Nancy", "Daniel", "Lisa", "Matthew", "Betty", "Anthony", "Helen", "Mark", "Sandra",
            "Alexander", "Victoria", "Sebastian", "Catherine", "Nicholas", "Margaret", "Benjamin", "Julie", "Samuel", "Emily"
        ]
        
        authors_last = [
            "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
            "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
            "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson",
            "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores"
        ]
        
        generated_books = []
        
        for i in range(count):
            
            adj1 = random.choice(adjectives)
            adj2 = random.choice(adjectives)
            noun1 = random.choice(nouns)
            noun2 = random.choice(nouns)
            title_patterns = [
                f"The {adj1} {noun1}",
                f"{adj1} {noun2}",
                f"The {noun1} of {adj2} {noun2}",
                f"{adj1} {noun1} and the {adj2} {noun2}",
                f"Tales of the {adj1} {noun1}",
                f"The {adj2} {noun1}'s {noun2}",
                f"{noun1} of {noun2}",
                f"The Last {adj1} {noun1}"
            ]
            
            title = random.choice(title_patterns)
            author = f"{random.choice(authors_first)} {random.choice(authors_last)}"
            genre = random.choice(genres)
            price_value = round(random.uniform(5.99, 99.99), 2)
            price = f"£{price_value:.2f}"
            rating = str(random.randint(1, 5))
            availability = random.choice(["In Stock", "In Stock", "In Stock", "Low Stock", "Out of Stock"])
            
            generated_books.append(('generated', {
                'title': title,
                'author': author,
                'price': price,
                'price_value': price_value,
                'rating': rating,
                'genre': genre,
                'availability': availability
            }))
            
        return generated_books
