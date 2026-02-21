import sys
from PyQt5.QtWidgets import QApplication
from gui import SimpleScraperGUI
def main():
    try:
        app = QApplication(sys.argv)
        window = SimpleScraperGUI()
        window.show()
        sys.exit(app.exec_())  
    except Exception as e:
        print(f"ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
if __name__ == "__main__":
    main()