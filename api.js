if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("/service-worker.js", {
    scope: "/"
})
            .then(() => {
                console.log("Service Worker registered successfully.");
            })
            .catch(error => {
                console.error(
                    "Service Worker registration failed:",
                    error
                );
            });
    });
}

if (!window.Parse) {
  console.error("Parse SDK not loaded!");
} else {
  console.log("Parse SDK Loaded");
Parse.initialize(
    "CHXrQck3aaULy1aZuPeRpHfhvbw386HOpjDa1XWF",
    "RPe3sQfHFnzuIn9KfOt1vYtb5JKAgPaByaNvH9yk"
    
);

Parse.serverURL = "https://parseapi.back4app.com/";
console.log("Parse ready:", typeof Parse);
}


(function () {

    function getStoredUser() {

        const storageSources = [
            window.localStorage,
            window.sessionStorage
        ];

        const possibleKeys = [
            "user",
            "currentUser",
            "loggedInUser",
            "userData",
            "profile",
            "currentUserData"
        ];

        for (const storage of storageSources) {

            for (const key of possibleKeys) {

                try {

                    const value =
                        storage.getItem(key);

                    if (!value) {
                        continue;
                    }

                    const parsed =
                        JSON.parse(value);

                    if (
                        parsed &&
                        (
                            parsed.id ||
                            parsed.objectId ||
                            parsed.userId ||
                            parsed.email ||
                            parsed.username
                        )
                    ) {

                        return parsed;

                    }

                } catch (error) {

                }

            }

        }

        return null;

    }

    async function getLoggedInUser() {

        try {

            if (
                typeof Parse !== "undefined" &&
                Parse.User &&
                typeof Parse.User.current === "function"
            ) {

                const currentUser =
                    Parse.User.current();

                if (currentUser) {

                    if (
                        typeof currentUser.isAuthenticated === "function"
                    ) {

                        const authenticated =
                            currentUser.isAuthenticated();

                        if (authenticated) {
                            return currentUser;
                        }

                    } else {

                        return currentUser;

                    }

                }

            }

        } catch (error) {

        }

        return getStoredUser();

    }

    function getUserValue(user, keys) {

        for (const key of keys) {

            let value = "";

            try {

                if (
                    user &&
                    typeof user.get === "function"
                ) {

                    value =
                        user.get(key);

                } else if (user) {

                    value =
                        user[key];

                }

            } catch (error) {

                value = "";

            }

            if (
                value !== undefined &&
                value !== null &&
                String(value).trim()
            ) {

                return String(value).trim();

            }

        }

        return "";

    }

    function getInitial(user) {

        const fullName =
            getUserValue(
                user,
                [
                    "fullName",
                    "name",
                    "username"
                ]
            );

        const email =
            getUserValue(
                user,
                [
                    "email"
                ]
            );

        const source =
            fullName ||
            email ||
            "U";

        const words =
            source
                .trim()
                .split(/\s+/)
                .filter(Boolean);

        if (words.length >= 2) {

            return (
                words[0].charAt(0) +
                words[1].charAt(0)
            ).toUpperCase();

        }

        return source
            .charAt(0)
            .toUpperCase();

    }

    function getProfileImage(user) {

        let image = "";

        try {

            if (
                user &&
                typeof user.get === "function"
            ) {

                const profileImage =
                    user.get("profileImage");

                if (
                    profileImage &&
                    typeof profileImage.url === "function"
                ) {

                    image =
                        profileImage.url() || "";

                } else if (
                    typeof profileImage === "string"
                ) {

                    image =
                        profileImage;

                }

            } else if (user) {

                image =
                    user.profileImage ||
                    user.profileImageUrl ||
                    "";

            }

        } catch (error) {

            image = "";

        }

        return image;

    }

    function createProfileButton(user) {

        const profileImage =
            getProfileImage(user);

        const initial =
            getInitial(user);

        const profileButton =
            document.createElement("button");

        profileButton.type =
            "button";

        profileButton.className =
            "header-profile-btn";

        profileButton.setAttribute(
            "aria-label",
            "Profile"
        );

        if (profileImage) {

            const image =
                document.createElement("img");

            image.src =
                profileImage;

            image.alt =
                "Profile";

            image.className =
                "header-profile-image";

            image.onerror =
                function () {

                    profileButton.innerHTML =
                        "";

                    const initialElement =
                        document.createElement("span");

                    initialElement.className =
                        "header-profile-initial";

                    initialElement.textContent =
                        initial;

                    profileButton.appendChild(
                        initialElement
                    );

                };

            profileButton.appendChild(
                image
            );

        } else {

            const initialElement =
                document.createElement("span");

            initialElement.className =
                "header-profile-initial";

            initialElement.textContent =
                initial;

            profileButton.appendChild(
                initialElement
            );

        }

        profileButton.addEventListener(
            "click",
            function () {

                window.location.href =
                    "profile.html";

            }
        );

        return profileButton;

    }

    function updateHeader(user) {

        const loginButton =
            document.querySelector(
                ".login-btn"
            );

        const nextButton =
            document.querySelector(
                ".header-buttons .primary-btn"
            );

        const headerButtons =
            document.querySelector(
                ".header-buttons"
            );

        if (!headerButtons) {
            return;
        }

        if (!user) {

            if (loginButton) {

                loginButton.textContent =
                    "Login";

                loginButton.href =
                    "login.html";

                loginButton.style.display =
                    "";

            }

            if (nextButton) {

                nextButton.textContent =
                    "Next";

                nextButton.href =
                    "features.html";

                nextButton.style.display =
                    "";

            }

            return;

        }

        if (loginButton) {

            const profileButton =
                createProfileButton(user);

            loginButton.replaceWith(
                profileButton
            );

        } else {

            const existingProfile =
                headerButtons.querySelector(
                    ".header-profile-btn"
                );

            if (!existingProfile) {

                const profileButton =
                    createProfileButton(user);

                headerButtons.insertBefore(
                    profileButton,
                    headerButtons.firstChild
                );

            }

        }

        if (nextButton) {

            nextButton.textContent =
                "Dashboard";

            nextButton.href =
                "dashboard.html";

            nextButton.style.display =
                "";

        }

    }

    async function initializeSharedHeader() {

        try {

            const user =
                await getLoggedInUser();

            updateHeader(user);

        } catch (error) {

            updateHeader(null);

        }

    }

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeSharedHeader
        );

    } else {

        initializeSharedHeader();

    }

})();

(function () {

    const theme =
        localStorage.getItem("invoiceProTheme");

    if (theme === "dark") {

        document.documentElement.setAttribute(
            "data-theme",
            "dark"
        );

    }

})();

document.addEventListener(
    "DOMContentLoaded",
    function() {
        
        const sidebar =
            document.getElementById("sidebar");
        
        const sidebarOverlay =
            document.getElementById("sidebarOverlay");
        
        const menuToggle =
            document.getElementById("menuToggle");
        
        const settingsToggle =
            document.getElementById("settingsToggle");
        
        const settingsDropdown =
            document.getElementById("settingsDropdown");
        
        if (!sidebar) {
            return;
        }
        
        function updateSidebarLayout() {
            
            if (window.innerWidth > 992) {
                
                sidebar.classList.add("show");
                
                if (sidebarOverlay) {
                    sidebarOverlay.classList.remove("show");
                }
                
                if (menuToggle) {
                    menuToggle.style.display = "none";
                }
                
            } else {
                
                sidebar.classList.remove("show");
                
                if (sidebarOverlay) {
                    sidebarOverlay.classList.remove("show");
                }
                
                if (menuToggle) {
                    menuToggle.style.display = "";
                }
                
            }
            
        }
        
        if (menuToggle) {
            
            menuToggle.addEventListener(
                "click",
                function() {
                    
                    sidebar.classList.add("show");
                    
                    if (sidebarOverlay) {
                        sidebarOverlay.classList.add("show");
                    }
                    
                }
            );
            
        }
        
        if (sidebarOverlay) {
            
            sidebarOverlay.addEventListener(
                "click",
                function() {
                    
                    sidebar.classList.remove("show");
                    
                    sidebarOverlay.classList.remove("show");
                    
                }
            );
            
        }
        
        if (
            settingsToggle &&
            settingsDropdown
        ) {
            
            settingsToggle.addEventListener(
                "click",
                function() {
                    
                    settingsDropdown.classList.toggle(
                        "active"
                    );
                    
                }
            );
            
        }
        
        const activeDropdownItem =
            document.querySelector(
                ".dropdown-item.active"
            );
        
        if (
            activeDropdownItem &&
            settingsDropdown
        ) {
            
            settingsDropdown.classList.add(
                "active"
            );
            
        }
        
        const navLinks =
            document.querySelectorAll(
                ".nav-item, .dropdown-item"
            );
        
        navLinks.forEach(
            function(link) {
                
                link.addEventListener(
                    "click",
                    function() {
                        
                        if (
                            window.innerWidth <= 992
                        ) {
                            
                            sidebar.classList.remove(
                                "show"
                            );
                            
                            if (sidebarOverlay) {
                                sidebarOverlay.classList.remove(
                                    "show"
                                );
                            }
                            
                        }
                        
                    }
                );
                
            }
        );
        
        window.addEventListener(
            "resize",
            updateSidebarLayout
        );
        
        updateSidebarLayout();
        
    }
);

document.addEventListener("DOMContentLoaded", async function () {

    try {

        const user = Parse.User.current();

        if (!user) {
            return;
        }

        const profileImage =
            user.get("profileImage");

        if (
            !profileImage ||
            typeof profileImage.url !== "function"
        ) {
            return;
        }

        const imageUrl =
            profileImage.url();

        if (!imageUrl) {
            return;
        }

        const profileImages =
            document.querySelectorAll(
                ".profile-avatar, .header-avatar img"
            );

        profileImages.forEach(function (image) {

            image.src = imageUrl;

        });

    } catch (error) {

        console.error(
            "Profile image load error:",
            error
        );

    }

});