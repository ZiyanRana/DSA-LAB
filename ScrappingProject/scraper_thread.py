from PyQt5.QtCore import QThread, pyqtSignal
class ScrapingThread(QThread):
    progress_updated = pyqtSignal(int)
    status_updated = pyqtSignal(str)
    scraping_finished = pyqtSignal()  
    def __init__(self, scraper, url, max_items):
        super().__init__()
        self.scraper = scraper
        self.url = url
        self.max_items = max_items
    def run(self):
        self.scraper.set_callbacks(
            self.progress_updated.emit,
            self.status_updated.emit
        )
        self.scraper.start_scraping(self.url, self.max_items)
        self.scraping_finished.emit()
