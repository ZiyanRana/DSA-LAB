import sys
import time
from pathlib import Path
from PyQt5.QtWidgets import (
    QApplication, QMainWindow, QVBoxLayout, QHBoxLayout,
    QWidget, QLabel, QPushButton, QLineEdit, QProgressBar,
    QTableWidget, QTableWidgetItem, QComboBox, QGroupBox
)
from PyQt5.QtCore import QTimer
sys.path.insert(0, str(Path(__file__).parent / "src"))
from sorting_algorithms import DataSorter
from scraper_core import SimpleWebScraper
from scraper_thread import ScrapingThread
class SimpleScraperGUI(QMainWindow):
    
    def __init__(self):
        super().__init__()
        self.setup_ui()
        self.setup_components()
        self.connect_signals()
    def setup_ui(self):
        self.setWindowTitle("Scrapping Project")
        self.setGeometry(100, 100, 1200, 800)
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        main_layout = QHBoxLayout(central_widget) 
        left_column = QVBoxLayout()
        right_column = QVBoxLayout()
        url_group = QGroupBox("")
        url_layout = QVBoxLayout(url_group)
        url_row = QHBoxLayout()
        url_row.addWidget(QLabel("Source:"))
        self.url_input = QLineEdit()
        self.url_input.setText("https://books.toscrape.com")
        self.url_input.setPlaceholderText("https://books.toscrape.com")
        url_row.addWidget(self.url_input)
        url_layout.addLayout(url_row)
        items_row = QHBoxLayout()
        items_row.addWidget(QLabel("Items to scrape:"))
        self.items_input = QLineEdit()
        self.items_input.setText("25000")
        self.items_input.setPlaceholderText("Minimum: 1000")
        items_row.addWidget(self.items_input)
        items_row.addWidget(QLabel("(min: 1000)"))
        url_layout.addLayout(items_row)
        left_column.addWidget(url_group)
        controls_group = QGroupBox("Controls")
        controls_layout = QVBoxLayout(controls_group)
        button_row1 = QHBoxLayout()
        self.start_btn = QPushButton("Start")
        self.pause_btn = QPushButton("Pause")
        self.resume_btn = QPushButton("Resume")
        button_row1.addWidget(self.start_btn)
        button_row1.addWidget(self.pause_btn)
        button_row1.addWidget(self.resume_btn)
        button_row2 = QHBoxLayout()
        self.restart_btn = QPushButton("Restart")
        self.stop_btn = QPushButton("Stop")
        button_row2.addWidget(self.restart_btn)
        button_row2.addWidget(self.stop_btn)
        self.pause_btn.setEnabled(False)
        self.resume_btn.setEnabled(False)
        self.restart_btn.setEnabled(False)
        self.stop_btn.setEnabled(False)
        controls_layout.addLayout(button_row1)
        controls_layout.addLayout(button_row2)
        self.progress_bar = QProgressBar()
        controls_layout.addWidget(self.progress_bar)
        self.status_label = QLabel("Ready")
        self.status_label.setWordWrap(True)
        controls_layout.addWidget(self.status_label)
        left_column.addWidget(controls_group)
        sort_group = QGroupBox("Multi-Level Sort")
        sort_layout = QVBoxLayout(sort_group)
        sort_grid = QHBoxLayout()
        col_layout = QVBoxLayout()
        col_layout.addWidget(QLabel("Columns:"))
        self.sort_column1 = QComboBox()
        self.sort_column2 = QComboBox()
        self.sort_column3 = QComboBox()
        col_layout.addWidget(self.sort_column1)
        col_layout.addWidget(self.sort_column2)
        col_layout.addWidget(self.sort_column3)
        order_layout = QVBoxLayout()
        order_layout.addWidget(QLabel("Order:"))
        self.sort_order1 = QComboBox()
        self.sort_order1.addItems(["Asc", "Desc"])
        self.sort_order2 = QComboBox()
        self.sort_order2.addItems(["None", "Asc", "Desc"])
        self.sort_order3 = QComboBox()
        self.sort_order3.addItems(["None", "Asc", "Desc"])
        order_layout.addWidget(self.sort_order1)
        order_layout.addWidget(self.sort_order2)
        order_layout.addWidget(self.sort_order3)
        sort_grid.addLayout(col_layout)
        sort_grid.addLayout(order_layout)
        sort_layout.addLayout(sort_grid)
        
        # Algorithm and button
        self.sort_algorithm = QComboBox()
        self.sort_algorithm.addItems(["Bubble", "Selection", "Insertion", "Merge", "Quick", "Heap"])
        self.sort_btn = QPushButton("Sort Data")
        sort_layout.addWidget(self.sort_algorithm)
        sort_layout.addWidget(self.sort_btn)
        
        left_column.addWidget(sort_group)
        
        # Compact Multi-Column Search
        search_group = QGroupBox("Multi-Column Search")
        search_layout = QVBoxLayout(search_group)
        
        # Search inputs in grid
        search_grid = QHBoxLayout()
        
        # Columns
        search_col_layout = QVBoxLayout()
        search_col_layout.addWidget(QLabel("Columns:"))
        self.search_column1 = QComboBox()
        self.search_column2 = QComboBox()
        self.search_column3 = QComboBox()
        search_col_layout.addWidget(self.search_column1)
        search_col_layout.addWidget(self.search_column2)
        search_col_layout.addWidget(self.search_column3)
        
        # Search texts
        search_text_layout = QVBoxLayout()
        search_text_layout.addWidget(QLabel("Search:"))
        self.search_text1 = QLineEdit()
        self.search_text1.setPlaceholderText("Text...")
        self.search_text2 = QLineEdit()
        self.search_text2.setPlaceholderText("Text...")
        self.search_text3 = QLineEdit()
        self.search_text3.setPlaceholderText("Text...")
        search_text_layout.addWidget(self.search_text1)
        search_text_layout.addWidget(self.search_text2)
        search_text_layout.addWidget(self.search_text3)
        
        # Operators
        op_layout = QVBoxLayout()
        op_layout.addWidget(QLabel("Op:"))
        op_layout.addWidget(QLabel(""))  # Spacer
        self.search_operator1 = QComboBox()
        self.search_operator1.addItems(["None", "AND", "OR", "NOT"])
        self.search_operator2 = QComboBox()
        self.search_operator2.addItems(["None", "AND", "OR", "NOT"])
        op_layout.addWidget(self.search_operator1)
        op_layout.addWidget(self.search_operator2)
        
        search_grid.addLayout(search_col_layout)
        search_grid.addLayout(search_text_layout)
        search_grid.addLayout(op_layout)
        search_layout.addLayout(search_grid)
        
        # Search buttons
        search_btn_layout = QHBoxLayout()
        self.search_btn = QPushButton("Search")
        self.clear_search_btn = QPushButton("Clear")
        search_btn_layout.addWidget(self.search_btn)
        search_btn_layout.addWidget(self.clear_search_btn)
        search_layout.addLayout(search_btn_layout)
        
        left_column.addWidget(search_group)
        main_layout.addLayout(left_column, 1)  
        data_group = QGroupBox("Scraped Data")
        data_layout = QVBoxLayout(data_group)
        
        self.data_table = QTableWidget()
        self.data_table.setAlternatingRowColors(True)
        self.data_table.verticalHeader().setVisible(False)  
        data_layout.addWidget(self.data_table)
        self.data_count_label = QLabel("Items: 0")
        data_layout.addWidget(self.data_count_label)
        
        right_column.addWidget(data_group)
        main_layout.addLayout(right_column, 2)
        
    def setup_components(self):
        self.scraper = SimpleWebScraper()
        self.data_sorter = DataSorter()
        self.scraping_thread = None
        self.current_data = []
        
    def connect_signals(self):
        self.start_btn.clicked.connect(self.start_scraping)
        self.pause_btn.clicked.connect(self.pause_scraping)
        self.resume_btn.clicked.connect(self.resume_scraping)
        self.restart_btn.clicked.connect(self.restart_scraping)
        self.stop_btn.clicked.connect(self.stop_scraping)
        self.sort_btn.clicked.connect(self.multi_level_sort)
        self.search_btn.clicked.connect(self.apply_search_filters)
        self.clear_search_btn.clicked.connect(self.clear_search_filters)
        
    def start_scraping(self):
        url = self.url_input.text().strip()
        if not url:
            self.status_label.setText("Please enter a URL!")
            return 
        items_text = self.items_input.text().strip()
        try:
            max_items = int(items_text)
            if max_items < 1000:
                self.status_label.setText("Minimum 1000 items required!")
                return
        except ValueError:
            self.status_label.setText("Please enter a valid number of items!")
            return
        self.current_data = []
        self.data_table.setRowCount(0)
        self.data_table.setColumnCount(0)
        self.start_btn.setEnabled(False)
        self.pause_btn.setEnabled(True)
        self.resume_btn.setEnabled(False)
        self.restart_btn.setEnabled(True)
        self.stop_btn.setEnabled(True)
        
        self.progress_bar.setValue(0)
        self.scraping_thread = ScrapingThread(self.scraper, url, max_items)
        self.status_label.setText(f"Starting to scrape {max_items:,} items...")
        self.scraping_thread.progress_updated.connect(self.update_progress)
        self.scraping_thread.status_updated.connect(self.update_status)
        self.scraping_thread.scraping_finished.connect(self.on_finished)
        self.scraping_thread.start()
        self.update_timer = QTimer()
        self.update_timer.timeout.connect(self.update_data)
        self.update_timer.start(2000)
        
    def pause_scraping(self):
        if self.scraper:
            self.scraper.pause_scraping()
            self.pause_btn.setEnabled(False)
            self.resume_btn.setEnabled(True)
            self.update_status("Paused")
            
    def resume_scraping(self):
        if self.scraper:
            self.scraper.resume_scraping()
            self.pause_btn.setEnabled(True)
            self.resume_btn.setEnabled(False)
            self.update_status("Resumed")
            
    def restart_scraping(self):
        if self.scraper:
            self.scraper.stop_scraping()
        self.reset_ui()
        QTimer.singleShot(1000, self.start_scraping)
        
    def stop_scraping(self):
        if self.scraper:
            self.scraper.stop_scraping()
        self.reset_ui()
        
    def reset_ui(self):
        self.start_btn.setEnabled(True)
        self.pause_btn.setEnabled(False)
        self.resume_btn.setEnabled(False)
        self.restart_btn.setEnabled(False)
        self.stop_btn.setEnabled(False)
        
        if hasattr(self, 'update_timer'):
            self.update_timer.stop()
            
    def update_progress(self, value):
        self.progress_bar.setValue(value)
        
    def update_status(self, status):
        self.status_label.setText(status)
        
    def update_data(self):
        data = self.scraper.get_scraped_data()
        if len(data) > len(self.current_data):
            self.current_data = data.copy()
            self.populate_table()
            
    def populate_table(self):
        if not self.current_data:
            return
        columns = list(self.current_data[0].keys())
        self.data_table.setColumnCount(len(columns))
        self.data_table.setHorizontalHeaderLabels(columns)
        self.data_table.setRowCount(len(self.current_data))
        for row, item in enumerate(self.current_data):
            for col, col_name in enumerate(columns):
                value = str(item.get(col_name, ''))
                self.data_table.setItem(row, col, QTableWidgetItem(value))
        self.data_count_label.setText(f"Items: {len(self.current_data)}")
        for combo in [self.sort_column1, self.sort_column2, self.sort_column3]:
            combo.clear()
            combo.addItems(columns)
        for combo in [self.search_column1, self.search_column2, self.search_column3]:
            combo.clear()
            combo.addItems(columns)
        
    def on_finished(self):
        self.reset_ui()
        if hasattr(self, 'update_timer'):
            self.update_timer.stop()
        self.update_data()
    def multi_level_sort(self):
        if not self.current_data:
            self.status_label.setText("No data to sort!")
            return
        column1 = self.sort_column1.currentText()
        order1 = self.sort_order1.currentText()
        column2 = self.sort_column2.currentText() if self.sort_order2.currentText() != "None" else None
        order2 = self.sort_order2.currentText() if self.sort_order2.currentText() != "None" else None
        column3 = self.sort_column3.currentText() if self.sort_order3.currentText() != "None" else None
        order3 = self.sort_order3.currentText() if self.sort_order3.currentText() != "None" else None
        algorithm = self.sort_algorithm.currentText()
        
        if not column1:
            self.status_label.setText("Please select at least primary sort column!")
            return
        try:
            algorithm_map = {
                "Bubble": "Bubble Sort",
                "Selection": "Selection Sort", 
                "Insertion": "Insertion Sort",
                "Merge": "Merge Sort",
                "Quick": "Quick Sort",
                "Heap": "Heap Sort"
            }
            
            algorithm_name = algorithm_map.get(algorithm, "Merge Sort")
            sorted_data = self.current_data.copy()
            total_time = 0
            if column3 and order3:
                reverse3 = (order3 == "Desc")
                sorted_data, time3 = self.data_sorter.sort_data(sorted_data, column3, algorithm_name, reverse3)
                total_time += time3
            if column2 and order2:
                reverse2 = (order2 == "Desc")
                sorted_data, time2 = self.data_sorter.sort_data(sorted_data, column2, algorithm_name, reverse2)
                total_time += time2
            reverse1 = (order1 == "Desc")
            sorted_data, time1 = self.data_sorter.sort_data(sorted_data, column1, algorithm_name, reverse1)
            total_time += time1
            self.current_data = sorted_data
            self.populate_table()
            sort_desc = f"{column1} ({order1})"
            if column2:
                sort_desc += f", {column2} ({order2})"
            if column3:
                sort_desc += f", {column3} ({order3})"
            
            self.status_label.setText(f"{algorithm} Sort: {sort_desc} in {total_time:.2f}ms")
            
        except Exception as e:
            self.status_label.setText(f"Sort error: {str(e)}")
    
    def get_sort_key(self, item, column):
        value = item.get(column, '')
        if isinstance(value, str):
            if value.replace('.', '').replace('-', '').replace('£', '').replace(',', '').isdigit():
                try:
                    return float(value.replace('£', '').replace(',', ''))
                except:
                    pass
            return value.lower()
        elif isinstance(value, (int, float)):
            return value
        else:
            return str(value).lower()
    def apply_search_filters(self):
        if not hasattr(self, 'original_data') or not self.original_data:
            self.original_data = self.current_data.copy()
        searches = []
        col1 = self.search_column1.currentText()
        text1 = self.search_text1.text().strip()
        if col1 and text1:
            searches.append((col1, text1, None))
        col2 = self.search_column2.currentText()
        text2 = self.search_text2.text().strip()
        op1 = self.search_operator1.currentText()
        if col2 and text2 and op1 != "None":
            searches.append((col2, text2, op1))
        col3 = self.search_column3.currentText()
        text3 = self.search_text3.text().strip()
        op2 = self.search_operator2.currentText()
        if col3 and text3 and op2 != "None":
            searches.append((col3, text3, op2))
        
        if not searches:
            self.status_label.setText("Please enter search criteria!")
            return
        
        try:
            filtered_data = []
            
            for item in self.original_data:
                include_item = self.evaluate_search_criteria(item, searches)
                if include_item:
                    filtered_data.append(item)
            
            self.current_data = filtered_data
            self.populate_table()
            
            search_desc = self.build_search_description(searches)
            self.status_label.setText(f"Filtered: {len(filtered_data)} items match '{search_desc}'")
            
        except Exception as e:
            self.status_label.setText(f"Search error: {str(e)}")
    
    def evaluate_search_criteria(self, item, searches):
        if not searches:
            return True
        col1, text1, _ = searches[0]
        result = self.item_matches_search(item, col1, text1)
        for i, (col, text, operator) in enumerate(searches[1:], 1):
            match = self.item_matches_search(item, col, text)
            
            if operator == "AND":
                result = result and match
            elif operator == "OR":
                result = result or match
            elif operator == "NOT":
                result = result and (not match)
        
        return result
    
    def item_matches_search(self, item, column, search_text):
        item_value = str(item.get(column, '')).lower()
        search_value = search_text.lower()
        return search_value in item_value
    
    def build_search_description(self, searches):
        if not searches:
            return ""
        
        desc = f"{searches[0][0]} contains '{searches[0][1]}'"
        
        for col, text, op in searches[1:]:
            desc += f" {op} {col} contains '{text}'"
        
        return desc
    
    def clear_search_filters(self):
        self.search_text1.clear()
        self.search_text2.clear()
        self.search_text3.clear()
        self.search_operator1.setCurrentText("None")
        self.search_operator2.setCurrentText("None")
        if hasattr(self, 'original_data') and self.original_data:
            self.current_data = self.original_data.copy()
            self.populate_table()
            self.status_label.setText(f"Filters cleared. Showing all {len(self.current_data)} items.")
        else:
            self.status_label.setText("No filters to clear.")
