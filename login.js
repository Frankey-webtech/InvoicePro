const toggleButtons = document.querySelectorAll(".toggle-password");

toggleButtons.forEach(button => {

    button.addEventListener("click", () => {

        const input = button.parentElement.querySelector("input");
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

const loginForm = document.getElementById("loginForm");
const loginBtn = document.getElementById("loginBtn");
const googleBtn = document.getElementById("googleBtn");

async function checkExistingLogin() {

    try {

        const currentUser = await Parse.User.currentAsync();

        if (currentUser) {

            window.location.replace("dashboard.html");

        }

    } catch (error) {

        console.error("Session check error:", error);

    }

}

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email =
        document.getElementById("email").value
            .trim()
            .toLowerCase();

    const password =
        document.getElementById("password").value;

    if (!email || !password) {

        alert("Please enter your email and password.");

        return;

    }

    loginBtn.disabled = true;

    loginBtn.innerHTML = "Logging In...";

    try {

        const user =
            await Parse.User.logIn(
                email,
                password
            );

        localStorage.setItem(
            "userId",
            user.id
        );

        localStorage.setItem(
            "fullName",
            user.get("fullName") || ""
        );

        localStorage.setItem(
            "email",
            user.get("email") || ""
        );

        localStorage.setItem(
            "country",
            user.get("country") || ""
        );

        localStorage.setItem(
            "currencyCode",
            user.get("currencyCode") || ""
        );

        localStorage.setItem(
            "currencySymbol",
            user.get("currencySymbol") || ""
        );

        localStorage.setItem(
            "userPlan",
            JSON.stringify({
                name: user.get("plan") || "",
                price: user.get("planPrice") || 0,
                billing: user.get("planBilling") || ""
            })
        );

        const loggedInUser =
            await Parse.User.currentAsync();

        if (!loggedInUser) {

            throw new Error(
                "Login succeeded, but your session could not be saved. Please try again."
            );

        }

        window.location.replace("dashboard.html");

    } catch (error) {

        console.error(
            "Login Error:",
            error
        );

        alert(
            error.message ||
            "Unable to log in."
        );

        loginBtn.disabled = false;

        loginBtn.innerHTML = "<span>Log In</span>";

    }

});

async function initializeGoogleLogin() {

    try {

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

        const hasAuth0Callback =
            window.location.search.includes("code=") &&
            window.location.search.includes("state=");

        if (hasAuth0Callback) {

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

const loggedInUser =
    await Parse.User.become(
        result.sessionToken
    );

if (!loggedInUser) {

    throw new Error(
        "Google login succeeded, but the InvoicePro session could not be created."
    );

}

const currentUser =
    await Parse.User.currentAsync();

if (!currentUser) {

    throw new Error(
        "Google login succeeded, but the InvoicePro session could not be restored."
    );

}

localStorage.setItem(
    "userId",
    currentUser.id
);

localStorage.setItem(
    "fullName",
    currentUser.get("fullName") || ""
);

localStorage.setItem(
    "email",
    currentUser.get("email") || ""
);

localStorage.setItem(
    "country",
    currentUser.get("country") || ""
);

localStorage.setItem(
    "currencyCode",
    currentUser.get("currencyCode") || ""
);

localStorage.setItem(
    "currencySymbol",
    currentUser.get("currencySymbol") || ""
);

localStorage.setItem(
    "userPlan",
    JSON.stringify({
        name:
            currentUser.get("plan") || "",
        price:
            currentUser.get("planPrice") || 0,
        billing:
            currentUser.get("planBilling") || ""
    })
);

window.location.replace(
    "dashboard.html"
);

return;

            } catch (error) {

                console.error(
                    "Google Login Error:",
                    error
                );

                if (typeof showToast === "function") {

                    showToast(
                        error.message ||
                        "Unable to log in with Google.",
                        "error"
                    );

                } else {

                    alert(
                        error.message ||
                        "Unable to log in with Google."
                    );

                }

            }

        }

        googleBtn.addEventListener(
            "click",
            async () => {

                try {

                    googleBtn.disabled = true;

                    googleBtn.innerHTML =
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

                    if (typeof showToast === "function") {

                        showToast(
                            error.message ||
                            "Unable to log in with Google.",
                            "error"
                        );

                    } else {

                        alert(
                            error.message ||
                            "Unable to log in with Google."
                        );

                    }

                    googleBtn.disabled = false;

                    googleBtn.innerHTML = `
                        <img src="google.svg" alt="Google">
                        Google
                    `;

                }

            }
        );

    } catch (error) {

        console.error(
            "Auth0 initialization error:",
            error
        );

    }

}

checkExistingLogin();
initializeGoogleLogin();