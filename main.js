(() => {
    const desktopViewNotice = document.getElementById("desktopViewNotice");
    const desktopViewUnderstood = document.getElementById("desktopViewUnderstood");

    if (!desktopViewNotice || !desktopViewUnderstood) return;

    const DESKTOP_WIDTH = 1024;

    function checkDesktopView() {
        if (window.innerWidth < DESKTOP_WIDTH) {
            desktopViewNotice.classList.add("show");
            document.body.style.overflow = "hidden";
        } else {
            desktopViewNotice.classList.remove("show");
            document.body.style.overflow = "";
        }
    }

    checkDesktopView();

    window.addEventListener("resize", checkDesktopView);

    desktopViewUnderstood.addEventListener("click", () => {
        desktopViewNotice.classList.remove("show");
        document.body.style.overflow = "";
    });
})();