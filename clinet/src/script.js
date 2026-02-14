const PYTHON_URL = "http://localhost:5001"; // Python backend URL

let mode = "";

// ---------------- MODE SELECT ----------------
function selectMode(selected) {
  mode = selected;
  document.getElementById("cleanOptions").classList.add("hidden");
  document.getElementById("analysisOptions").classList.add("hidden");

  if (mode === "clean") {
    document.getElementById("cleanOptions").classList.remove("hidden");
  } else if (mode === "analysis") {
    document.getElementById("analysisOptions").classList.remove("hidden");
  }
}

// ---------------- SHOW/HIDE OPTIONS ----------------
document.getElementById("removeNull").addEventListener("change", function () {
  document.getElementById("nullType").classList.toggle("hidden", !this.checked);
});
document.getElementById("removeDuplicate").addEventListener("change", function () {
  document.getElementById("dupType").classList.toggle("hidden", !this.checked);
});

// ---------------- SUBMIT FILE ----------------
function submitData() {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];
  if (!file) {
    alert("Please upload a file");
    return;
  }

  // Collect chart selections
  let charts = [];
  document.querySelectorAll(".chart:checked").forEach(c => charts.push(c.value));

  const formData = new FormData();
  formData.append("file", file);
  formData.append("mode", mode);
  formData.append("removeNull", document.getElementById("removeNull").checked);
  formData.append("nullType", document.getElementById("nullType").value);
  formData.append("removeDuplicate", document.getElementById("removeDuplicate").checked);
  formData.append("dupType", document.getElementById("dupType").value);
  formData.append("charts", JSON.stringify(charts));

  fetch(`${PYTHON_URL}/process`, { method: "POST", body: formData })
    .then(res => res.json())
    .then(data => {
      console.log("🔥 FRONTEND RECEIVED:", data);

      if (data.error) {
        alert(data.error);
        return;
      }

      // Show output section
      const outputSection = document.getElementById("outputSection");
      outputSection.style.display = "block";

      // Cleaned file button
      const downloadBtn = document.getElementById("downloadBtn");
      if (data.cleaned_file) {
        downloadBtn.style.display = "inline-block";
        downloadBtn.disabled = false;
        downloadBtn.textContent = "⬇ Download Cleaned File";
        downloadBtn.onclick = () => {
          window.open(`${PYTHON_URL}/download/${data.cleaned_file}`);
        };
      } else {
        downloadBtn.style.display = "none";
      }

      // Charts
      const chartsDiv = document.getElementById("chartsOutput");
      chartsDiv.innerHTML = "";

      if (data.charts && data.charts.length > 0) {
        data.charts.forEach(chartFile => {
          const container = document.createElement("div");
          container.className = "chart-container";

          const img = document.createElement("img");
          img.src = `${PYTHON_URL}/download/${chartFile}`;
          img.style.width = "100%";
          img.style.borderRadius = "8px";

          const btn = document.createElement("button");
          btn.textContent = "⬇ Download Chart";
          btn.className = "download-btn";
          btn.onclick = () => {
            window.open(`${PYTHON_URL}/download/${chartFile}`);
          };

          container.appendChild(img);
          container.appendChild(btn);
          chartsDiv.appendChild(container);
        });
      }
    })
    .catch(err => {
      console.error("❌ Error:", err);
      alert("Upload failed ❌\nError: " + err.message);
    });
}
