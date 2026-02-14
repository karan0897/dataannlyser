from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import pandas as pd
import os
import json
import datetime
import matplotlib.pyplot as plt
from werkzeug.utils import secure_filename

app = Flask(__name__)

CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
CLEANED_FOLDER = os.path.join(BASE_DIR, "cleaned")
CHART_FOLDER = os.path.join(BASE_DIR, "charts")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(CLEANED_FOLDER, exist_ok=True)
os.makedirs(CHART_FOLDER, exist_ok=True)

# ================= CLEANUP =================

def clear_folder(folder):
    for file in os.listdir(folder):
        path = os.path.join(folder, file)
        if os.path.isfile(path):
            os.remove(path)

# ================= PROCESS =================

@app.route("/process", methods=["POST"])
def process_file():

    clear_folder(UPLOAD_FOLDER)   # clear old uploads

    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    filename = secure_filename(file.filename)

    if filename == "":
        return jsonify({"error": "Invalid filename"}), 400

    timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
    saved_name = f"{timestamp}_{filename}"
    file_path = os.path.join(UPLOAD_FOLDER, saved_name)
    file.save(file_path)

    # Read file safely
    try:
        if filename.endswith(".csv"):
            df = pd.read_csv(file_path)
        else:
            df = pd.read_excel(file_path, engine="openpyxl")
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    remove_null = request.form.get("removeNull") == "true"
    remove_dup = request.form.get("removeDuplicate") == "true"
    mode = request.form.get("mode")

    # Cleaning
    if remove_null:
        df = df.dropna()

    if remove_dup:
        df = df.drop_duplicates()

    cleaned_filename = None
    chart_files = []

    # ========= CLEAN MODE =========
    if mode in ["clean", "both"]:
        cleaned_filename = f"{timestamp}_cleaned.csv"
        cleaned_path = os.path.join(CLEANED_FOLDER, cleaned_filename)
        df.to_csv(cleaned_path, index=False)

    # ========= ANALYSIS MODE =========
    if mode in ["analysis", "both"]:

        charts_requested = json.loads(request.form.get("charts", "[]"))
        numeric_df = df.select_dtypes(include="number")

        if not numeric_df.empty:

            for chart in charts_requested:

                plt.figure()

                try:
                    if chart == "bar":
                        numeric_df.sum().plot(kind="bar")

                    elif chart == "hist":
                        numeric_df.iloc[:, 0].plot(kind="hist")

                    elif chart == "pie":
                        numeric_df.iloc[:, 0].value_counts().plot(kind="pie")

                    else:
                        continue

                    chart_name = f"{chart}_{timestamp}.png"
                    chart_path = os.path.join(CHART_FOLDER, chart_name)

                    plt.savefig(chart_path)
                    plt.close()

                    chart_files.append(chart_name)

                except Exception as e:
                    print("Chart error:", e)
                    continue

    return jsonify({
        "cleaned_file": cleaned_filename,
        "charts": chart_files
    })

# ================= DOWNLOAD =================

@app.route("/download/<filename>")
def download(filename):

    cleaned_path = os.path.join(CLEANED_FOLDER, filename)
    chart_path = os.path.join(CHART_FOLDER, filename)

    if os.path.isfile(cleaned_path):
        return send_from_directory(CLEANED_FOLDER, filename, as_attachment=True)

    if os.path.isfile(chart_path):
        return send_from_directory(CHART_FOLDER, filename, as_attachment=True)

    return jsonify({"error": "File not found"}), 404


# ================= RUN =================

if __name__ == "__main__":
    app.run(port=5001, debug=True)
