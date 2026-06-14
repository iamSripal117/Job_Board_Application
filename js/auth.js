// =====================================
// AUTHENTICATION SYSTEM
// =====================================

// =====================================
// REGISTER
// =====================================

const registerForm =
    document.getElementById(
        "registerForm"
    );

if(registerForm){

    registerForm.addEventListener(
        "submit",
        registerUser
    );

}

function registerUser(e){

    e.preventDefault();

    const name =
        document.getElementById(
            "registerName"
        ).value.trim();

    const email =
        document.getElementById(
            "registerEmail"
        ).value.trim();

    const password =
        document.getElementById(
            "registerPassword"
        ).value;

    const confirmPassword =
        document.getElementById(
            "confirmPassword"
        ).value;

    if(password !== confirmPassword){

        alert(
            "Passwords do not match"
        );

        return;
    }

    let users =
        JSON.parse(
            localStorage.getItem(
                "users"
            )
        ) || [];

    const existingUser =
        users.find(
            user =>
            user.email === email
        );

    if(existingUser){

        alert(
            "Email already registered"
        );

        return;
    }

    const newUser = {

        id: Date.now(),

        name,

        email,

        password,

        createdAt:
            new Date()
            .toLocaleString()

    };

    users.push(newUser);

    localStorage.setItem(

        "users",

        JSON.stringify(users)

    );

    alert(
        "Registration Successful"
    );

    window.location.href =
        "login.html";
}

// =====================================
// LOGIN
// =====================================

const loginForm =
    document.getElementById(
        "loginForm"
    );

if(loginForm){

    loginForm.addEventListener(
        "submit",
        loginUser
    );

}

function loginUser(e){

    e.preventDefault();

    const email =
        document.getElementById(
            "loginEmail"
        ).value.trim();

    const password =
        document.getElementById(
            "loginPassword"
        ).value;

    const users =
        JSON.parse(
            localStorage.getItem(
                "users"
            )
        ) || [];

    const user =
        users.find(

            user =>

            user.email === email &&
            user.password === password

        );

    if(!user){

        alert(
            "Invalid Email or Password"
        );

        return;
    }

    localStorage.setItem(

        "loggedInUser",

        JSON.stringify(user)

    );

    alert(
        "Login Successful"
    );

    window.location.href =
        "dashboard.html";
}

// =====================================
// GET CURRENT USER
// =====================================

function getCurrentUser(){

    return JSON.parse(

        localStorage.getItem(
            "loggedInUser"
        )

    );

}

// =====================================
// CHECK LOGIN
// =====================================

function isLoggedIn(){

    return !!localStorage.getItem(
        "loggedInUser"
    );

}

// =====================================
// PROTECT PAGE
// =====================================

function protectPage(){

    if(!isLoggedIn()){

        window.location.href =
            "login.html";

    }

}

// =====================================
// LOGOUT
// =====================================

function logout(){

    const confirmLogout =
        confirm(
            "Are you sure you want to logout?"
        );

    if(!confirmLogout){
        return;
    }

    localStorage.removeItem(
        "loggedInUser"
    );

    window.location.href =
        "index.html";
}

// =====================================
// AUTO REDIRECT
// =====================================

if(

    window.location.pathname
    .includes("login.html")

    &&

    isLoggedIn()

){

    window.location.href =
        "dashboard.html";

}

// =====================================
// GLOBAL FUNCTIONS
// =====================================

window.logout = logout;

window.protectPage = protectPage;

window.getCurrentUser =
    getCurrentUser;


// =====================================
// USER DATA STORAGE
// =====================================

function getUserData() {

    const currentUser =
        JSON.parse(
            localStorage.getItem(
                "loggedInUser"
            )
        );

    if (!currentUser) return null;

    const key =
        `userData_${currentUser.email}`;

    return JSON.parse(
        localStorage.getItem(key)
    ) || {

        email: currentUser.email,

        savedJobs: [],

        applications: [],

        recentJobs: [],

        resumeName: ""

    };

}

function saveUserData(data) {

    const currentUser =
        JSON.parse(
            localStorage.getItem(
                "loggedInUser"
            )
        );

    if (!currentUser) return;

    const key =
        `userData_${currentUser.email}`;

    localStorage.setItem(
        key,
        JSON.stringify(data)
    );

}

window.getUserData =
    getUserData;

window.saveUserData =
    saveUserData;    