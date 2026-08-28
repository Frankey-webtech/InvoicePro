const toggleButtons = document.querySelectorAll(".toggle-password");

toggleButtons.forEach(button => {

    button.addEventListener("click", () => {

        const input = button.previousElementSibling;
        const icon = button.querySelector("i");

        if (input.type === "password") {

            input.type = "text";

            icon.classList.remove("ri-eye-line");

            icon.classList.add("ri-eye-off-line");

            button.setAttribute("aria-label", "Hide password");

        } else {

            input.type = "password";

            icon.classList.remove("ri-eye-off-line");

            icon.classList.add("ri-eye-line");

            button.setAttribute("aria-label", "Show password");

        }

    });

});

const currentUser = Parse.User.current();

if (currentUser) {

    window.location.href = "dashboard.html";

}

const loginForm = document.getElementById("loginForm");

const loginBtn = document.getElementById("loginBtn");

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value.trim().toLowerCase();

    const password = document.getElementById("password").value;

    if (!email || !password) {

        alert("Please enter your email and password.");

        return;

    }

    loginBtn.disabled = true;

    loginBtn.textContent = "Logging In...";

    try {

        const user = await Parse.User.logIn(email, password);

        localStorage.setItem("userId", user.id);

        localStorage.setItem("fullName", user.get("fullName"));

        localStorage.setItem("email", user.get("email"));

        localStorage.setItem("country", user.get("country"));

        localStorage.setItem("currencyCode", user.get("currencyCode"));

        localStorage.setItem("currencySymbol", user.get("currencySymbol"));

        localStorage.setItem("userPlan", JSON.stringify({

            name: user.get("plan"),

            price: user.get("planPrice"),

            billing: user.get("planBilling")

        }));

        window.location.href = "dashboard.html";

    } catch (error) {

        alert(error.message);

        loginBtn.disabled = false;

        loginBtn.textContent = "Log In";

    }

});

const googleBtn =
    document.getElementById("googleBtn");

const auth0Client =
    await auth0.createAuth0Client({
        domain:
            "dev-2tvu028qm4wmvd0l.us.auth0.com",

        clientId:
            "LpoyuFK4GqAA6gzsVzu2yxGarfb8mXs6",

        authorizationParams: {
            redirect_uri:
                window.location.origin +
                "/dashboard.html"
        }
    });

async function handleGoogleLogin() {

    const hasAuth0Callback =
        window.location.search.includes("code=") &&
        window.location.search.includes("state=");

    if (!hasAuth0Callback) {
        return;
    }

    try {

        const callbackResult =
            await auth0Client.handleRedirectCallback();

        const auth0User =
            await auth0Client.getUser();

        if (
            !auth0User ||
            !auth0User.email
        ) {

            throw new Error(
                "Unable to retrieve your Google account."
            );

        }

        const appState =
            callbackResult.appState || {};

        if (appState.mode !== "login") {

            throw new Error(
                "Invalid Google login request."
            );

        }

        const result =
            await Parse.Cloud.run(
                "loginGoogleUser",
                {
                    email:
                        auth0User.email
                }
            );

        if (
            !result ||
            !result.sessionToken
        ) {

            throw new Error(
                "Unable to log you in with Google."
            );

        }

        await Parse.User.become(
            result.sessionToken
        );

        window.history.replaceState(
            {},
            document.title,
            "dashboard.html"
        );

        window.location.href =
            "dashboard.html";

    } catch (error) {

        console.error(
            "Google Login Error:",
            error
        );

        showToast(
            error.message ||
            "Unable to log in with Google.",
            "error"
        );

    }

}

googleBtn.addEventListener(
    "click",
    async () => {

        try {

            googleBtn.disabled = true;

            googleBtn.textContent =
                "Connecting...";

            await auth0Client.loginWithRedirect({

                authorizationParams: {

                    connection:
                        "google-oauth2"

                },

                appState: {

                    mode:
                        "login"

                }

            });

        } catch (error) {

            console.error(error);

            showToast(
                error.message,
                "error"
            );

            googleBtn.disabled = false;

            googleBtn.innerHTML = `
                <i class="ri-google-fill"></i>
                Google
            `;

        }

    }
);

handleGoogleLogin();