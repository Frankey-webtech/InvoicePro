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

const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const menuToggle = document.getElementById("menuToggle");

/* ==========================================
   OPEN SIDEBAR
========================================== */

if (menuToggle) {

    menuToggle.addEventListener("click", () => {

        sidebar.classList.add("show");

        sidebarOverlay.classList.add("show");

    });

}

/* ==========================================
   CLOSE SIDEBAR
========================================== */

if (sidebarOverlay) {

    sidebarOverlay.addEventListener("click", () => {

        sidebar.classList.remove("show");

        sidebarOverlay.classList.remove("show");

    });

}

/* ==========================================
   SETTINGS DROPDOWN
========================================== */

const settingsToggle = document.getElementById("settingsToggle");

const settingsDropdown = document.getElementById("settingsDropdown");

if (settingsToggle && settingsDropdown) {

    settingsToggle.addEventListener("click", () => {

        settingsDropdown.classList.toggle("active");

    });

}

/* ==========================================
   KEEP SETTINGS OPEN
========================================== */

const activeDropdownItem = document.querySelector(".dropdown-item.active");

if (activeDropdownItem && settingsDropdown) {

    settingsDropdown.classList.add("active");

}

/* ==========================================
   CLOSE SIDEBAR AFTER CLICKING A LINK
   (Mobile Only)
========================================== */

const navLinks = document.querySelectorAll(

    ".nav-item, .dropdown-item"

);

navLinks.forEach(link => {

    link.addEventListener("click", () => {

        if (window.innerWidth <= 992) {

            sidebar.classList.remove("show");

            sidebarOverlay.classList.remove("show");

        }

    });

});

/* ==========================================
   RESET SIDEBAR WHEN RESIZING
========================================== */

window.addEventListener("resize", () => {

    if (window.innerWidth > 992) {

        sidebar.classList.remove("show");

        sidebarOverlay.classList.remove("show");

    }

});