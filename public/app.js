const docList = document.getElementById("docList");
const template = document.getElementById("row");
const searchInput = document.getElementById("search");
const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const docFrame = document.getElementById("docFrame");

let allFiles = [];

// Detect if running on localhost
const isLocalhost = location.hostname === "localhost" || location.hostname === "127.0.0.1";

function fmtSize(bytes) {
    const units = ["B", "KB", "MB", "GB"];
    let i = 0, n = bytes;
    while (n >= 1024 && i < units.length - 1) { n /= 1024; i++; }
    return `${n.toFixed(n < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
}

function fmtDate(ms) { return new Date(ms).toLocaleString(); }

function render(files) {
    docList.innerHTML = "";
    if (files.length === 0) {
        docList.innerHTML = '<li class="empty">No documents found.</li>';
        return;
    }
    files.forEach(f => {
        const node = template.content.cloneNode(true);
        const link = node.querySelector(".doc-link");
        const open = node.querySelector(".open");
        const deleteBtn = node.querySelector(".delete");

        node.querySelector(".ext").textContent = f.ext;
        node.querySelector(".size").textContent = fmtSize(f.size);
        node.querySelector(".updated").textContent = `Updated ${fmtDate(f.updated)}`;

        link.textContent = f.name;
        link.href = f.url;
        open.textContent = "Open";

        // Open in iframe for docx/xlsx on public URLs
        open.addEventListener("click", e => {
            e.preventDefault();
            if (!isLocalhost && (f.ext === "DOCX" || f.ext === "XLSX")) {
                docFrame.src =
                    `https://docs.google.com/gview?url=${location.origin}${f.url}&embedded=true`;
                window.scrollTo({ top: document.getElementById("preview").offsetTop, behavior: "smooth" });
            } else {
                // Fallback: open in new tab
                window.open(f.url, "_blank");
            }
        });

        deleteBtn.addEventListener("click", async () => {
            if (!confirm(`Delete "${f.name}"?`)) return;
            await fetch(`/docs/${encodeURIComponent(f.name)}`, { method: "DELETE" });
            await loadList();
        });

        docList.appendChild(node);
    });
}

async function loadList() {
    const res = await fetch("/list");
    allFiles = await res.json();
    applyFilter();
}

function applyFilter() {
    const q = searchInput.value.trim().toLowerCase();
    const filtered = q ? allFiles.filter(f => f.name.toLowerCase().includes(q)) : allFiles;
    render(filtered);
}

searchInput.addEventListener("input", applyFilter);

async function uploadFile(file) {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.ok) loadList();
}

dropZone.addEventListener("click", () => fileInput.click());
dropZone.addEventListener("dragover", e => { e.preventDefault(); dropZone.classList.add("hover"); });
dropZone.addEventListener("dragleave", () => dropZone.classList.remove("hover"));
dropZone.addEventListener("drop", async e => {
    e.preventDefault(); dropZone.classList.remove("hover");
    for (const f of e.dataTransfer.files) await uploadFile(f);
});

fileInput.addEventListener("change", async () => {
    for (const f of fileInput.files) await uploadFile(f);
    fileInput.value = "";
});

uploadBtn.addEventListener("click", async () => {
    if (fileInput.files.length === 0) return alert("Select files first!");
    for (const f of fileInput.files) await uploadFile(f);
    fileInput.value = "";
    loadList();
});

document.addEventListener("DOMContentLoaded", loadList);
