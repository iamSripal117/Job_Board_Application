// =====================================
// JOBSPHERE STORAGE MANAGER
// =====================================

const StorageManager = {

    // =====================================
    // THEME
    // =====================================

    getTheme() {

        return localStorage.getItem("theme") || "light";

    },

    setTheme(theme) {

        localStorage.setItem("theme", theme);

    },

    // =====================================
    // SAVED JOBS
    // =====================================

    getSavedJobs() {

        return JSON.parse(
            localStorage.getItem("savedJobs")
        ) || [];

    },

    saveJob(jobId) {

        let jobs = this.getSavedJobs();

        if (!jobs.includes(jobId)) {

            jobs.push(jobId);

            localStorage.setItem(
                "savedJobs",
                JSON.stringify(jobs)
            );

            return true;
        }

        return false;
    },

    removeSavedJob(jobId) {

        let jobs = this.getSavedJobs();

        jobs = jobs.filter(
            id => Number(id) !== Number(jobId)
        );

        localStorage.setItem(
            "savedJobs",
            JSON.stringify(jobs)
        );

    },

    isJobSaved(jobId) {

        return this
            .getSavedJobs()
            .includes(jobId);

    },

    getSavedJobsCount() {

        return this.getSavedJobs().length;

    },

    // =====================================
    // APPLICATIONS
    // =====================================

    getApplications() {

        return JSON.parse(
            localStorage.getItem("applications")
        ) || [];

    },

    applyJob(jobId) {

        let applications =
            this.getApplications();

        const alreadyApplied =
            applications.some(
                item =>
                Number(item.jobId) ===
                Number(jobId)
            );

        if (alreadyApplied) {

            return false;
        }

        applications.push({

            jobId: jobId,

            appliedAt:
                new Date().toLocaleString()

        });

        localStorage.setItem(

            "applications",

            JSON.stringify(
                applications
            )
        );

        return true;
    },

    hasApplied(jobId) {

        return this
            .getApplications()
            .some(
                item =>
                Number(item.jobId) ===
                Number(jobId)
            );

    },

    getApplicationsCount() {

        return this
            .getApplications()
            .length;

    },

    // =====================================
    // RECENTLY VIEWED JOBS
    // =====================================

    getRecentlyViewedJobs() {

        return JSON.parse(
            localStorage.getItem(
                "recentJobs"
            )
        ) || [];

    },

    addRecentlyViewedJob(jobId) {

        let jobs =
            this.getRecentlyViewedJobs();

        jobs =
            jobs.filter(
                id =>
                Number(id) !==
                Number(jobId)
            );

        jobs.unshift(jobId);

        jobs = jobs.slice(0, 10);

        localStorage.setItem(

            "recentJobs",

            JSON.stringify(jobs)
        );

    },

    clearRecentlyViewedJobs() {

        localStorage.removeItem(
            "recentJobs"
        );

    },

    // =====================================
    // SELECTED JOB
    // =====================================

    setSelectedJob(jobId) {

        localStorage.setItem(
            "selectedJob",
            jobId
        );

    },

    getSelectedJob() {

        return localStorage.getItem(
            "selectedJob"
        );

    },

    clearSelectedJob() {

        localStorage.removeItem(
            "selectedJob"
        );

    },

    // =====================================
    // SEARCH KEYWORD
    // =====================================

    saveSearchKeyword(keyword) {

        localStorage.setItem(
            "jobSearchKeyword",
            keyword
        );

    },

    getSearchKeyword() {

        return localStorage.getItem(
            "jobSearchKeyword"
        ) || "";

    },

    clearSearchKeyword() {

        localStorage.removeItem(
            "jobSearchKeyword"
        );

    },

    // =====================================
    // DASHBOARD STATS
    // =====================================

    getDashboardStats() {

        return {

            totalSavedJobs:
                this.getSavedJobsCount(),

            totalApplications:
                this.getApplicationsCount(),

            recentlyViewed:
                this
                .getRecentlyViewedJobs()
                .length

        };

    },

    // =====================================
    // CLEAR EVERYTHING
    // =====================================

    clearAllData() {

        localStorage.removeItem(
            "savedJobs"
        );

        localStorage.removeItem(
            "applications"
        );

        localStorage.removeItem(
            "recentJobs"
        );

        localStorage.removeItem(
            "selectedJob"
        );

        localStorage.removeItem(
            "jobSearchKeyword"
        );

    }

};

// =====================================
// HELPER FUNCTIONS
// =====================================

function saveJob(jobId) {

    const success =
        StorageManager.saveJob(jobId);

    if (success) {

        if (typeof showToast === "function") {

            showToast(
                "Job saved successfully ⭐"
            );
        }

    } else {

        if (typeof showToast === "function") {

            showToast(
                "Job already saved"
            );
        }

    }
}

function applyJob(jobId) {

    const success =
        StorageManager.applyJob(jobId);

    if (success) {

        if (typeof showToast === "function") {

            showToast(
                "Application submitted 🚀"
            );
        }

    } else {

        if (typeof showToast === "function") {

            showToast(
                "Already applied"
            );
        }

    }
}

// =====================================
// GLOBAL ACCESS
// =====================================

window.StorageManager =
    StorageManager;

window.saveJob =
    saveJob;

window.applyJob =
    applyJob;