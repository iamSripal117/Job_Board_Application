// =====================================
// JOBSPHERE - JOBS PAGE SCRIPT
// =====================================

let allJobs = [];
let filteredJobs = [];


if(!localStorage.getItem("loggedInUser")){

    window.location.href =
        "login.html";
}

// =====================================
// INITIALIZE
// =====================================

document.addEventListener("DOMContentLoaded", () => {

    loadJobs();

    const searchInput =
        document.getElementById("searchInput");

    const locationFilter =
        document.getElementById("locationFilter");

    const jobTypeFilter =
        document.getElementById("jobTypeFilter");

    const experienceFilter =
        document.getElementById("experienceFilter");

    if (searchInput) {
        searchInput.addEventListener("input", filterJobs);
    }

    if (locationFilter) {
        locationFilter.addEventListener("change", filterJobs);
    }

    if (jobTypeFilter) {
        jobTypeFilter.addEventListener("change", filterJobs);
    }

    if (experienceFilter) {
        experienceFilter.addEventListener("change", filterJobs);
    }
});

// =====================================
// LOAD JOBS
// =====================================

async function loadJobs() {

    try {

        const container =
            document.getElementById("jobsContainer");

        if (container) {
            showLoader("jobsContainer");
        }

        const response =
            await fetch("data/jobs.json");

        const jobs =
            await response.json();

        const customJobs =
    JSON.parse(
        localStorage.getItem("customJobs")
    ) || [];

        allJobs = [
            ...jobs,
            ...customJobs
        ];

        filteredJobs = allJobs;

        setTimeout(() => {

            renderJobs(filteredJobs);

            applyStoredSearch();

        }, 500);

    } catch (error) {

        console.error(
            "Failed to load jobs:",
            error
        );

        document.getElementById(
            "jobsContainer"
        ).innerHTML = `
            <h2 style="text-align:center;">
                Failed to load jobs
            </h2>
        `;
    }
}

// =====================================
// APPLY SEARCH FROM HOMEPAGE
// =====================================

function applyStoredSearch() {

    const keyword =
        localStorage.getItem(
            "jobSearchKeyword"
        );

    if (!keyword) return;

    const searchInput =
        document.getElementById(
            "searchInput"
        );

    searchInput.value = keyword;

    filterJobs();

    localStorage.removeItem(
        "jobSearchKeyword"
    );
}

// =====================================
// FILTER JOBS
// =====================================

function filterJobs() {

    const searchValue =
        document
        .getElementById("searchInput")
        .value
        .toLowerCase();

    const location =
        document
        .getElementById("locationFilter")
        .value;

    const type =
        document
        .getElementById("jobTypeFilter")
        .value;

    const experience =
        document
        .getElementById("experienceFilter")
        .value;

    filteredJobs =
        allJobs.filter(job => {

            const matchesSearch =

                job.title
                .toLowerCase()
                .includes(searchValue)

                ||

                job.company
                .toLowerCase()
                .includes(searchValue);

            const matchesLocation =
                !location ||
                job.location === location;

            const matchesType =
                !type ||
                job.type === type;

            const matchesExperience =
                !experience ||
                job.experience === experience;

            return (
                matchesSearch &&
                matchesLocation &&
                matchesType &&
                matchesExperience
            );

        });

    renderJobs(filteredJobs);
}

// =====================================
// RENDER JOBS
// =====================================

function renderJobs(jobs) {

    const container =
        document.getElementById(
            "jobsContainer"
        );

    const jobCount =
        document.getElementById(
            "jobCount"
        );

    if (!container) return;

    container.innerHTML = "";

    if (jobCount) {
        jobCount.textContent =
            jobs.length;
    }

    if (jobs.length === 0) {

        container.innerHTML = `
            <div style="
                grid-column:1/-1;
                text-align:center;
                padding:40px;
            ">
                <h2>No jobs found</h2>
            </div>
        `;

        return;
    }

    jobs.forEach(job => {

        const card =
            document.createElement("div");

        card.className =
            "job-card";

        card.innerHTML = `

            <h3>
                ${job.title}
            </h3>

            <p>
                ${job.company}
            </p>

            <div class="tags">

                <span>
                    ${job.location}
                </span>

                <span>
                    ${job.type}
                </span>

                <span>
                    ${job.experience}
                </span>

            </div>

            <div class="salary">
                ${job.salary}
            </div>

            <p style="
                margin-top:15px;
                min-height:60px;
            ">
                ${job.description}
            </p>

            <div class="job-actions">

                <button
                    class="apply-btn"
                    onclick="viewJobDetails(${job.id})"
                >
                    View Details
                </button>

                <button
                    class="save-btn"
                    onclick="saveJob(${job.id})"
                >
                    <i class="fa-regular fa-bookmark"></i>
                </button>

            </div>

        `;

        container.appendChild(card);

    });
}

// =====================================
// VIEW DETAILS
// =====================================

function viewJobDetails(jobId) {

    localStorage.setItem(
        "selectedJob",
        jobId
    );

    window.location.href =
        "job-details.html";
}

// =====================================
// APPLY JOB
// =====================================

function applyForJob(jobId) {

    let applications =
        JSON.parse(
            localStorage.getItem(
                "applications"
            )
        ) || [];

    const alreadyApplied =
        applications.some(
            item =>
            item.jobId === jobId
        );

    if (alreadyApplied) {

        showToast(
            "Already Applied"
        );

        return;
    }

    applications.push({

        jobId,

        appliedDate:
            new Date()
            .toLocaleString()

    });

    localStorage.setItem(

        "applications",

        JSON.stringify(
            applications
        )
    );

    showToast(
        "Application Submitted 🚀"
    );
}

// =====================================
// GET JOB BY ID
// =====================================

function getJobById(id) {

    return allJobs.find(

        job =>

        Number(job.id) ===
        Number(id)

    );
}

// =====================================
// SAVED JOBS
// =====================================

function getSavedJobs() {

    return JSON.parse(

        localStorage.getItem(
            "savedJobs"
        )

    ) || [];

}

// =====================================
// REMOVE SAVED JOB
// =====================================

function removeSavedJob(jobId) {

    let savedJobs =
        getSavedJobs();

    savedJobs =
        savedJobs.filter(

            id =>

            Number(id) !==
            Number(jobId)

        );

    localStorage.setItem(

        "savedJobs",

        JSON.stringify(
            savedJobs
        )
    );

    showToast(
        "Removed from Saved Jobs"
    );
}

// =====================================
// RECENTLY VIEWED JOBS
// =====================================

function addRecentlyViewed(jobId) {

    let recentJobs =
        JSON.parse(

            localStorage.getItem(
                "recentJobs"
            )

        ) || [];

    recentJobs =
        recentJobs.filter(
            id => id !== jobId
        );

    recentJobs.unshift(jobId);

    recentJobs =
        recentJobs.slice(0, 5);

    localStorage.setItem(

        "recentJobs",

        JSON.stringify(
            recentJobs
        )
    );
}

// =====================================
// EXPORT FUNCTIONS
// =====================================

window.viewJobDetails =
    viewJobDetails;

window.applyForJob =
    applyForJob;

window.removeSavedJob =
    removeSavedJob;

window.addRecentlyViewed =
    addRecentlyViewed;