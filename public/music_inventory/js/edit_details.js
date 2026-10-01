// =========================
// Tooltip initialization
// =========================
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
})

// =========================
// Smart tab initialization
// =========================
$(document).ready(function () {
    $('#smarttab').smartTab({
        orientation: 'vertical',
        transition: {
            animation: 'fade',
            speed: '400'
        }
    });
});

// =========================
// CloneData for Work Fields
// =========================
$('#add-more').cloneData({
    mainContainerId: 'main-container',  // container to hold duplicated form fields
    cloneContainer: 'container-item',   // element to be cloned
    maxLimit: 1,                        // maximum number of clones
    minLimit: 0,
    removeConfirm: true
});

// =========================
// Inline Editing with LocalStorage
// =========================

// Generic function to enable edit mode
function enableEdit(section) {
    document.getElementById(section + '_text').classList.add('d-none');
    document.getElementById(section + '_input').classList.remove('d-none');
    document.getElementById(section + '_edit_btn').classList.add('d-none');
    document.getElementById(section + '_save_btn').classList.remove('d-none');
}

// ====================
// Edit/Save logic for text fields
// ====================
function enableEdit(section) {
    document.getElementById(section + "_text").classList.add("d-none");
    document.getElementById(section + "_input").classList.remove("d-none");
    document.getElementById(section + "_edit_btn").classList.add("d-none");
    document.getElementById(section + "_save_btn").classList.remove("d-none");
}

function saveEdit(section) {
    let input = document.getElementById(section + "_input").value;
    document.getElementById(section + "_text").innerText = input;
    document.getElementById(section + "_text").classList.remove("d-none");
    document.getElementById(section + "_input").classList.add("d-none");
    document.getElementById(section + "_edit_btn").classList.remove("d-none");
    document.getElementById(section + "_save_btn").classList.add("d-none");

    // Save to localStorage
    localStorage.setItem(section, input);
}

// Load saved values from localStorage
window.addEventListener("DOMContentLoaded", () => {
    ["bio", "overview", "work", "places", "contact", "cv", "sessions"].forEach(section => {
        if (localStorage.getItem(section)) {
            let el = document.getElementById(section + "_text");
            if (el) el.innerText = localStorage.getItem(section);
            let input = document.getElementById(section + "_input");
            if (input) input.value = localStorage.getItem(section);
        }
    });
});


// ====================
// CloneData logic for Work and CV
// ====================
$(document).ready(function () {
    // Work section clone
    $("#work-add-more").cloneData({
        mainContainerId: "work-main-container",
        cloneContainer: "work-container-item",
        removeButtonClass: "remove-item",
        maxLimit: 0,
        minLimit: 0,
        removeConfirm: true
    });

    // CV section clone
    $("#cv-add-more").cloneData({
        mainContainerId: "cv-main-container",
        cloneContainer: "cv-container-item",
        removeButtonClass: "remove-item",
        maxLimit: 0,
        minLimit: 0,
        removeConfirm: true
    });

    // Save Work entries
    $(document).on("click", "#work-main-container .save-item", function () {
        let works = [];
        $("#work-main-container .work-container-item").each(function () {
            let job = $(this).find("input").val();
            let desc = $(this).find("textarea").val();
            works.push({ job, desc });
        });
        localStorage.setItem("work_entries", JSON.stringify(works));
        renderWork();
    });

    // Save CV entries
    $(document).on("click", "#cv-main-container .save-item", function () {
        let cvs = [];
        $("#cv-main-container .cv-container-item").each(function () {
            let title = $(this).find("input").val();
            let details = $(this).find("textarea").val();
            cvs.push({ title, details });
        });
        localStorage.setItem("cv_entries", JSON.stringify(cvs));
        renderCV();
    });

    // Load on page ready
    renderWork();
    renderCV();
});

// Render saved Work
function renderWork() {
    let works = JSON.parse(localStorage.getItem("work_entries")) || [];
    let container = $("#work_list");
    container.html("");
    works.forEach(w => {
        container.append(`<p><b>${w.job}</b>: ${w.desc}</p>`);
    });
}

// Render saved CV
function renderCV() {
    let cvs = JSON.parse(localStorage.getItem("cv_entries")) || [];
    let container = $("#cv_list");
    container.html("");
    cvs.forEach(c => {
        container.append(`<p><b>${c.title}</b>: ${c.details}</p>`);
    });
}


// Save changes and store in localStorage
//function saveEdit(section) {
    //let newText = document.getElementById(section + '_input').value;
    //localStorage.setItem(section + '_text', newText);

    //document.getElementById(section + '_text').innerText = newText;
    //document.getElementById(section + '_text').classList.remove('d-none');
    //document.getElementById(section + '_input').classList.add('d-none');
   // document.getElementById(section + '_edit_btn').classList.remove('d-none');
   // document.getElementById(section + '_save_btn').classList.add('d-none');
}

// Load saved data from localStorage when the page loads
//window.onload = function () {
    //let sections = ["overview", "work", "places", "contact", "cv", "sessions", "bio"];

    sections.forEach(function (section) {
       let saved = localStorage.getItem(section + '_text');
       if (saved && document.getElementById(section + '_text')) {
           document.getElementById(section + '_text').innerText = saved;
        }
    });
};
