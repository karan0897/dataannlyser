# 📊 Data Analyzer

**Data Analyzer** is a web-based application to **clean, analyze, and visualize Excel/CSV data**.  
It allows users to remove nulls, remove duplicates, and generate charts like Bar, Histogram, and Pie from numeric data.

---

## 🛠 Features

- Upload Excel (`.xlsx`) or CSV (`.csv`) files
- **Data Cleaning**:
  - Remove Null Values (Rows/Columns)
  - Remove Duplicates (Rows/Columns)
- **Data Analysis**:
  - Generate Charts: Bar Graph, Histogram, Pie Chart
- Download cleaned files and charts
- Live preview of charts in the browser
- Supports **single action at a time**: either clean or analyze

---

## 💻 Tech Stack

- **Frontend**: HTML, CSS, JavaScript  
- **Backend**: Python (`Flask`)  
- **Charts**: Matplotlib  
- **Server Communication**: Fetch API  
- **CORS Enabled** for cross-origin requests

---

## 📂 Folder Structure

dataannlyser/
├── client/
│   └── src/
│       ├── index.html      # Main HTML file
│       ├── style.css       # Styles
│       └── script.js       # Frontend JS
├── python-api/
│   ├── app.py              # Flask backend
│   ├── uploads/            # Temporary uploaded files (auto-clear on new upload)
│   ├── cleaned/            # Cleaned output files
│   └── charts/             # Generated chart images
├── server/
│   └── uploads/            # Node.js server uploads (if used)
├── venv/                   # Python virtual environment
└── README.md



---

## ⚡ How to Run

### 1. Backend (Python Flask)
```bash
cd python-api
python -m venv venv        # Create virtual environment (if not exists)
venv\Scripts\activate      # Windows
# source venv/bin/activate  # Linux/macOS
pip install -r requirements.txt
python app.py


