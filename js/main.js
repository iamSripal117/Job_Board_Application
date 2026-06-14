// ===============================
// JOBSPHERE MAIN JAVASCRIPT
// ===============================

// Wait until page loads
document.addEventListener("DOMContentLoaded", () => {

    initializeTheme();

});

// ===============================
// DARK MODE
// ===============================

const darkModeBtn = document.getElementById("darkModeBtn");

if (darkModeBtn) {

    darkModeBtn.addEventListener("click", () => {

        document.body.classList.toggle("dark");

        const isDark = document.body.classList.contains("dark");

        localStorage.setItem("theme", isDark ? "dark" : "light");

        updateThemeIcon(isDark);

        showToast(
            isDark
                ? "Dark Mode Enabled 🌙"
                : "Light Mode Enabled ☀️"
        );

    });

}

// ===============================
// INITIALIZE THEME
// ===============================

function initializeTheme() {

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {

        document.body.classList.add("dark");

        updateThemeIcon(true);

    } else {

        updateThemeIcon(false);

    }

}

// ===============================
// UPDATE ICON
// ===============================

function updateThemeIcon(isDark) {

    const icon = document.querySelector("#darkModeBtn i");

    if (!icon) return;

    if (isDark) {

        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");

    } else {

        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");

    }

}

// ===============================
// HERO SEARCH
// ===============================

function goToJobs() {

    const searchInput =
        document.getElementById("heroSearch");

    let keyword = "";

    if (searchInput) {

        keyword = searchInput.value.trim();

    }

    if (keyword !== "") {

        localStorage.setItem(
            "jobSearchKeyword",
            keyword
        );

    }

    window.location.href = "jobs.html";

}

// ===============================
// ENTER KEY SEARCH
// ===============================

const heroSearchInput =
    document.getElementById("heroSearch");

if (heroSearchInput) {

    heroSearchInput.addEventListener("keypress", e => {

        if (e.key === "Enter") {

            goToJobs();

        }

    });

}

// ===============================
// TOAST NOTIFICATION
// ===============================

function showToast(message) {

    const existingToast =
        document.querySelector(".toast");

    if (existingToast) {

        existingToast.remove();

    }

    const toast =
        document.createElement("div");

    toast.className = "toast";

    toast.innerText = message;

    document.body.appendChild(toast);

    setTimeout(() => {

        toast.style.opacity = "0";

        toast.style.transform =
            "translateY(20px)";

    }, 2500);

    setTimeout(() => {

        toast.remove();

    }, 3000);

}

// ===============================
// SAVE JOB
// ===============================

function saveJob(jobId) {

    let savedJobs =
        JSON.parse(
            localStorage.getItem("savedJobs")
        ) || [];

    if (savedJobs.includes(jobId)) {

        showToast("Job already saved");

        return;

    }

    savedJobs.push(jobId);

    localStorage.setItem(
        "savedJobs",
        JSON.stringify(savedJobs)
    );

    showToast("Job saved successfully ⭐");

}

// ===============================
// APPLY JOB
// ===============================

function applyJob(jobId) {

    let applications =
        JSON.parse(
            localStorage.getItem("applications")
        ) || [];

    const alreadyApplied =
        applications.some(
            app => app.jobId === jobId
        );

    if (alreadyApplied) {

        showToast("Already applied for this job");

        return;

    }

    applications.push({

        jobId: jobId,

        appliedAt:
            new Date().toLocaleString()

    });

    localStorage.setItem(
        "applications",
        JSON.stringify(applications)
    );

    showToast("Application submitted 🚀");

}

// ===============================
// GET SAVED JOBS COUNT
// ===============================

function getSavedJobsCount() {

    const savedJobs =
        JSON.parse(
            localStorage.getItem("savedJobs")
        ) || [];

    return savedJobs.length;

}

// ===============================
// GET APPLICATION COUNT
// ===============================

function getApplicationCount() {

    const applications =
        JSON.parse(
            localStorage.getItem("applications")
        ) || [];

    return applications.length;

}

// ===============================
// CLEAR ALL DATA
// ===============================

function clearAllData() {

    const confirmation =
        confirm(
            "Are you sure you want to clear all stored data?"
        );

    if (!confirmation) return;

    localStorage.removeItem("savedJobs");

    localStorage.removeItem("applications");

    localStorage.removeItem("jobSearchKeyword");

    showToast("All local data cleared");

}

// ===============================
// FORMAT DATE
// ===============================

function formatDate(dateString) {

    const date =
        new Date(dateString);

    return date.toLocaleDateString(
        "en-IN",
        {
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    );

}

// ===============================
// GENERATE UNIQUE ID
// ===============================

function generateId() {

    return (
        Date.now().toString() +
        Math.floor(Math.random() * 1000)
    );

}

// ===============================
// LOADER
// ===============================

function showLoader(containerId) {

    const container =
        document.getElementById(containerId);

    if (!container) return;

    container.innerHTML = "";

    for (let i = 0; i < 6; i++) {

        const skeleton =
            document.createElement("div");

        skeleton.className = "skeleton";

        container.appendChild(skeleton);

    }

}

function hideLoader(containerId) {

    const container =
        document.getElementById(containerId);

    if (!container) return;

    container.innerHTML = "";

}

// ===============================
// EXPORT TO WINDOW
// ===============================

window.showToast = showToast;
window.saveJob = saveJob;
window.applyJob = applyJob;
window.goToJobs = goToJobs;
window.clearAllData = clearAllData;



document.addEventListener(
    "DOMContentLoaded",
    updateNavbar
);

function updateNavbar(){

    const nav =
        document.getElementById(
            "navbarLinks"
        );

    if(!nav) return;

    const user =
        JSON.parse(
            localStorage.getItem(
                "loggedInUser"
            )
        );

    if(user){

    nav.innerHTML = `

        <li>
            <a href="index.html">
                Home
            </a>
        </li>

        <li>
            <a href="jobs.html">
                Jobs
            </a>
        </li>

        <li>
            <a href="dashboard.html">
                Dashboard
            </a>
        </li>

        <li class="user-profile">

            <div class="avatar">
                ${user.name.charAt(0).toUpperCase()}
            </div>

            <span>
                ${user.name}
            </span>

        </li>

        <li>
            <a href="#"
               onclick="logout()">
                Logout
            </a>
        </li>

    `;

    }else{

        nav.innerHTML = `

            <li>
                <a href="index.html">
                    Home
                </a>
            </li>

            <li>
                <a href="jobs.html">
                    Jobs
                </a>
            </li>

            <li>
                <a href="login.html">
                    Login
                </a>
            </li>

            <li>
                <a href="register.html">
                    Register
                </a>
            </li>

        `;

    }

}