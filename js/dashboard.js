// =====================================
// USER DASHBOARD
// =====================================

let allJobs = [];

protectPage();

document.addEventListener(
    "DOMContentLoaded",
    initDashboard
);

const currentUser =
    getCurrentUser();

if(currentUser){

    document.getElementById(
        "userName"
    ).textContent =
        currentUser.name;

    document.getElementById(
        "userEmail"
    ).textContent =
        currentUser.email;

}

// =====================================
// INITIALIZE
// =====================================

document.addEventListener(
    "DOMContentLoaded",
    initDashboard
);

async function initDashboard() {

    await loadJobs();

    loadStats();

    loadSavedJobs();

    loadApplications();

    loadRecentJobs();

    loadRecommendedJobs();

    setupResumeUpload();

    calculateProfileCompletion();

    setupClearButtons();
}

// =====================================
// LOAD JOBS
// =====================================

async function loadJobs() {

    try {

        const response =
            await fetch(
                "data/jobs.json"
            );

        const jsonJobs =
            await response.json();

        const customJobs =
            JSON.parse(
                localStorage.getItem(
                    "customJobs"
                )
            ) || [];

        allJobs = [
            ...jsonJobs,
            ...customJobs
        ];

    }

    catch(error){

        console.error(
            "Error loading jobs:",
            error
        );

    }

}

// =====================================
// STATS
// =====================================

function loadStats() {

    const savedJobs =
        JSON.parse(
            localStorage.getItem(
                "savedJobs"
            )
        ) || [];

    const applications =
        JSON.parse(
            localStorage.getItem(
                "applications"
            )
        ) || [];

    const recentJobs =
        JSON.parse(
            localStorage.getItem(
                "recentJobs"
            )
        ) || [];

    document.getElementById(
        "savedJobsCount"
    ).textContent =
        savedJobs.length;

    document.getElementById(
        "applicationsCount"
    ).textContent =
        applications.length;

    document.getElementById(
        "recentJobsCount"
    ).textContent =
        recentJobs.length;
}

// =====================================
// SAVED JOBS
// =====================================

function loadSavedJobs() {

    const container =
        document.getElementById(
            "savedJobsList"
        );

    const savedJobs =
        JSON.parse(
            localStorage.getItem(
                "savedJobs"
            )
        ) || [];

    if(savedJobs.length === 0){

        container.innerHTML = `
            <div class="empty-state">
                No Saved Jobs
            </div>
        `;

        return;
    }

    container.innerHTML = "";

    savedJobs.forEach(jobId => {

        const job =
            allJobs.find(
                item =>
                Number(item.id) ===
                Number(jobId)
            );

        if(!job) return;

        container.innerHTML += `

            <div class="saved-job-item">

                <h4>
                    ${job.title}
                </h4>

                <p>
                    ${job.company}
                </p>

            </div>

        `;

    });

}

// =====================================
// APPLICATIONS
// =====================================

function loadApplications() {

    const container =
        document.getElementById(
            "applicationsList"
        );

    const applications =
        JSON.parse(
            localStorage.getItem(
                "applications"
            )
        ) || [];

    if(applications.length === 0){

        container.innerHTML = `
            <div class="empty-state">
                No Applications Yet
            </div>
        `;

        return;
    }

    container.innerHTML = "";

    applications.forEach(app => {

        const job =
            allJobs.find(
                item =>
                Number(item.id) ===
                Number(app.jobId)
            );

        if(!job) return;

        container.innerHTML += `

            <div class="application-item">

                <h4>
                    ${job.title}
                </h4>

                <p>
                    ${job.company}
                </p>

                <p>
                    Applied:
                    ${
                        app.appliedAt ||
                        app.appliedDate
                    }
                </p>

            </div>

        `;

    });

}

// =====================================
// RECENT JOBS
// =====================================

function loadRecentJobs() {

    const container =
        document.getElementById(
            "recentJobsList"
        );

    const recentJobs =
        JSON.parse(
            localStorage.getItem(
                "recentJobs"
            )
        ) || [];

    if(recentJobs.length === 0){

        container.innerHTML = `
            <div class="empty-state">
                No Recently Viewed Jobs
            </div>
        `;

        return;
    }

    container.innerHTML = "";

    recentJobs.forEach(jobId => {

        const job =
            allJobs.find(
                item =>
                Number(item.id) ===
                Number(jobId)
            );

        if(!job) return;

        container.innerHTML += `

            <div class="recent-job-item">

                <h4>
                    ${job.title}
                </h4>

                <p>
                    ${job.company}
                </p>

            </div>

        `;

    });

}

// =====================================
// RECOMMENDED JOBS
// =====================================

function loadRecommendedJobs() {

    const container =
        document.getElementById(
            "recommendedJobs"
        );

    const applications =
        JSON.parse(
            localStorage.getItem(
                "applications"
            )
        ) || [];

    const appliedIds =
        applications.map(
            app => Number(app.jobId)
        );

    const recommended =
        allJobs
        .filter(
            job =>
            !appliedIds.includes(
                Number(job.id)
            )
        )
        .slice(0, 6);

    container.innerHTML = "";

    recommended.forEach(job => {

        container.innerHTML += `

            <div class="recommended-job-item">

                <h4>
                    ${job.title}
                </h4>

                <p>
                    ${job.company}
                </p>

                <p>
                    ${job.location}
                </p>

                <p>
                    ${job.salary}
                </p>

            </div>

        `;

    });

}

// =====================================
// RESUME UPLOAD
// =====================================

function setupResumeUpload() {

    const upload =
        document.getElementById(
            "resumeUpload"
        );

    const resumeName =
        document.getElementById(
            "resumeName"
        );

    const currentUser =
    JSON.parse(
        localStorage.getItem(
            "loggedInUser"
        )
    );

    const storedResume =
        localStorage.getItem(
            `resume_${currentUser.email}`
        );

    if(storedResume){

        resumeName.textContent =
            storedResume;
    }

    upload.addEventListener(
        "change",
        function(){

            if(
                !this.files.length
            ) return;

            const file =
                this.files[0];

            const currentUser =
                JSON.parse(
                    localStorage.getItem(
                        "loggedInUser"
                    )
                );

            localStorage.setItem(
                `resume_${currentUser.email}`,
                file.name
            );
            resumeName.textContent =
                file.name;

            calculateProfileCompletion();

            showToast(
                "Resume Uploaded"
            );

        }
    );

}

// =====================================
// PROFILE COMPLETION
// =====================================

function calculateProfileCompletion() {

    let score = 25;

    const savedJobs =
        JSON.parse(
            localStorage.getItem(
                "savedJobs"
            )
        ) || [];

    const applications =
        JSON.parse(
            localStorage.getItem(
                "applications"
            )
        ) || [];

    const resume =
        localStorage.getItem(
            "resumeName"
        );

    if(savedJobs.length > 0)
        score += 25;

    if(applications.length > 0)
        score += 25;

    if(resume)
        score += 25;

    document.getElementById(
        "profileCompletion"
    ).textContent =
        score + "%";

    document.getElementById(
        "profilePercentage"
    ).textContent =
        score + "%";

    document.getElementById(
        "profileProgressBar"
    ).style.width =
        score + "%";

}

// =====================================
// REFRESH
// =====================================

window.refreshDashboard =
    initDashboard;



function setupClearButtons(){

    document
    .getElementById(
        "clearSavedJobsBtn"
    )
    .addEventListener(
        "click",
        clearSavedJobs
    );

    document
    .getElementById(
        "clearApplicationsBtn"
    )
    .addEventListener(
        "click",
        clearApplications
    );

    document
    .getElementById(
        "clearRecentJobsBtn"
    )
    .addEventListener(
        "click",
        clearRecentJobs
    );

    document
    .getElementById(
        "clearResumeBtn"
    )
    .addEventListener(
        "click",
        clearResume
    );

}

function clearSavedJobs(){

    if(
    !confirm(
        "Are you sure?"
    )
    ){
        return;
    }

    localStorage.removeItem(
        "savedJobs"
    );

    showToast(
        "Saved Jobs Cleared"
    );

    initDashboard();
}

function clearApplications(){

    if(
    !confirm(
        "Are you sure?"
    )
    ){
        return;
    }

    localStorage.removeItem(
        "applications"
    );

    showToast(
        "Applications Cleared"
    );

    initDashboard();
}

function clearRecentJobs(){

    if(
    !confirm(
        "Are you sure?"
    )
    ){
        return;
    }

    localStorage.removeItem(
        "recentJobs"
    );

    showToast(
        "Recently Viewed Jobs Cleared"
    );

    initDashboard();
}

function clearResume(){

    if(
    !confirm(
        "Are you sure?"
    )
    ){
        return;
    }

    const currentUser =
    JSON.parse(
        localStorage.getItem(
            "loggedInUser"
        )
    );

    localStorage.removeItem(
        `resume_${currentUser.email}`
    );
    document.getElementById(
        "resumeName"
    ).textContent =
    "No Resume Uploaded";

    showToast(
        "Resume Removed"
    );

    calculateProfileCompletion();
}    
