const SCRIPT_URL = "YOUR_SCRIPT_URL_HERE";

function login() {
    const email = document.getElementById("login-email").value;
    const pass = document.getElementById("login-password").value;

    fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({ action: "login", email: email, password: pass })
    })
    .then(r => r.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem("user", JSON.stringify(data.user));
            window.location.href = "dashboard.html";
        } else {
            document.getElementById("login-msg").innerText = data.message;
        }
    });
}

function signup() {
    const name = document.getElementById("signup-name").value;
    const email = document.getElementById("signup-email").value;
    const pass = document.getElementById("signup-password").value;

    fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({ action: "signup", name: name, email: email, password: pass })
    })
    .then(r => r.json())
    .then(data => {
        document.getElementById("signup-msg").innerText = data.message;
    });
}

function logout() {
    localStorage.removeItem("user");
    window.location.href = "login.html";
}
