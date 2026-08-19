(function () {

    "use strict";

    let pricingData = null;

    const $ = (id) =>
        document.getElementById(id);

    function showElement(element) {

        if (!element) {
            return;
        }

        element.classList.add("is-visible");

    }

    function hideElement(element) {

        if (!element) {
            return;
        }

        element.classList.remove("is-visible");

    }

    function setLocationStatus(
        icon,
        message
    ) {

        const status =
            $("pricingLocationStatus");

        const text =
            $("pricingLocationText");

        if (!status || !text) {
            return;
        }

        const statusIcon =
            status.querySelector("i");

        if (statusIcon) {
            statusIcon.className = icon;
        }

        text.textContent = message;

    }

    function showToast(
        title,
        message
    ) {

        const toast =
            $("pricingToast");

        const toastTitle =
            $("pricingToastTitle");

        const toastMessage =
            $("pricingToastMessage");

        if (!toast) {
            return;
        }

        if (toastTitle) {
            toastTitle.textContent = title;
        }

        if (toastMessage) {
            toastMessage.textContent = message;
        }

        toast.classList.add(
            "is-visible"
        );

        window.clearTimeout(
            window.pricingToastTimer
        );

        window.pricingToastTimer =
            window.setTimeout(
                () => {

                    toast.classList.remove(
                        "is-visible"
                    );

                },
                5000
            );

    }

    function formatPrice(
        price,
        currencyCode,
        currencySymbol
    ) {

        if (
            typeof price !== "number" ||
            !Number.isFinite(price)
        ) {
            return `${currencySymbol}0`;
        }

        if (price === 0) {
            return `${currencySymbol}0`;
        }

        try {

            const formatted =
                new Intl.NumberFormat(
                    undefined,
                    {
                        style: "currency",
                        currency: currencyCode,
                        currencyDisplay: "symbol",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2
                    }
                ).format(price);

            return formatted;

        } catch (error) {

            return `${currencySymbol}${price.toLocaleString()}`;

        }

    }

    function getBillingText(
        plan,
        currencySymbol
    ) {

        if (
            plan.billing === "Forever"
        ) {
            return "Free forever";
        }

        return `${currencySymbol}${Number(
            plan.price
        ).toLocaleString()} billed monthly`;

    }

    function renderPlans() {

        const grid =
            $("pricingGrid");

        if (
            !grid ||
            !pricingData
        ) {
            return;
        }

        const {
            currencyCode,
            currencySymbol,
            plans
        } = pricingData;

        const planOrder = [
            "Free",
            "Starter",
            "Business",
            "Enterprise"
        ];

        grid.innerHTML = "";

        planOrder.forEach(
            (planKey) => {

                const plan =
                    plans[planKey];

                if (!plan) {
                    return;
                }

                const card =
                    document.createElement(
                        "article"
                    );

                card.className =
                    "pricing-plan-card";

                if (plan.popular) {

                    card.classList.add(
                        "pricing-plan-popular"
                    );

                }

                const popularBadge =
                    plan.popular
                        ? `
                            <div class="pricing-popular-badge">
                                <i class="ri-star-fill"></i>
                                <span>Most Popular</span>
                            </div>
                        `
                        : "";

                const features =
                    Array.isArray(
                        plan.features
                    )
                        ? plan.features
                        : [];

                const featureMarkup =
                    features
                        .map(
                            (feature) => `
                                <li class="pricing-plan-feature">
                                    <i class="ri-check-line"></i>
                                    <span>${feature}</span>
                                </li>
                            `
                        )
                        .join("");

                const price =
                    formatPrice(
                        plan.price,
                        currencyCode,
                        currencySymbol
                    );

                const period =
                    plan.billing === "Forever"
                        ? "Forever"
                        : "/month";

                const billingText =
                    getBillingText(
                        plan,
                        currencySymbol
                    );

                card.innerHTML = `
                    ${popularBadge}

                    <div class="pricing-plan-icon">
                        <i class="${plan.icon}"></i>
                    </div>

                    <div class="pricing-plan-header">

                        <h3>
                            ${plan.name}
                        </h3>

                        <p class="pricing-plan-description">
                            ${plan.description}
                        </p>

                    </div>

                    <div class="pricing-plan-price">

                        <span class="pricing-plan-price-amount">
                            ${price}
                        </span>

                        <span class="pricing-plan-price-period">
                            ${period}
                        </span>

                    </div>

                    <div class="pricing-plan-billing">
                        ${billingText}
                    </div>

                    <div class="pricing-plan-divider"></div>

                    <div class="pricing-plan-includes">
                        ${plan.includes}
                    </div>

                    <ul class="pricing-plan-features">
                        ${featureMarkup}
                    </ul>

                    <button
                        type="button"
                        class="pricing-plan-button"
                        data-plan="${plan.name}"
                    >
                        ${
                            plan.name === "Free"
                                ? "Get started"
                                : `Choose ${plan.name}`
                        }
                    </button>
                `;

                grid.appendChild(card);

            }
        );

        bindPlanButtons();

    }

    function bindPlanButtons() {

        const buttons =
            document.querySelectorAll(
                ".pricing-plan-button"
            );

        buttons.forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        const planName =
                            button.dataset.plan;

                        handlePlanSelection(
                            planName
                        );

                    }
                );

            }
        );

    }

    function handlePlanSelection(
        planName
    ) {

        if (!planName) {
            return;
        }

        const encodedPlan =
            encodeURIComponent(
                planName
            );

        window.location.href =
            `signup.html?plan=${encodedPlan}`;

    }

    async function loadPricing(
        latitude,
        longitude
    ) {

        if (
            typeof Parse === "undefined"
        ) {
            throw new Error(
                "Parse SDK is not available."
            );
        }

        const result =
            await Parse.Cloud.run(
                "getPublicPricing",
                {
                    latitude,
                    longitude
                }
            );

        if (
            !result ||
            !result.country ||
            !result.countryCode ||
            !result.currencyCode ||
            !result.currencySymbol ||
            !result.plans
        ) {
            throw new Error(
                "Invalid pricing information received."
            );
        }

        pricingData =
            result;

        const countryElement =
            $("pricingCountry");

        if (countryElement) {
            countryElement.textContent =
                result.country;
        }

        const currencyElement =
            $("pricingCurrency");

        if (currencyElement) {

            currencyElement.textContent =
                `${result.currencySymbol} ${result.currencyCode}`;

        }

        renderPlans();

    }

    function showPricing() {

        hideElement(
            $("pricingLoadingSection")
        );

        hideElement(
            $("pricingLocationSection")
        );

        showElement(
            $("pricingContent")
        );

        if (pricingData) {

            setLocationStatus(
                "ri-map-pin-check-line",
                `${pricingData.country} · ${pricingData.currencyCode}`
            );

        }

    }

    function showLocationRequest() {

        hideElement(
            $("pricingLoadingSection")
        );

        hideElement(
            $("pricingContent")
        );

        showElement(
            $("pricingLocationSection")
        );

        setLocationStatus(
            "ri-map-pin-line",
            "Location permission required"
        );

    }

    function showLoading() {

        hideElement(
            $("pricingLocationSection")
        );

        hideElement(
            $("pricingContent")
        );

        showElement(
            $("pricingLoadingSection")
        );

        setLocationStatus(
            "ri-loader-4-line",
            "Determining your location..."
        );

    }

    function handleLocationError(
        error
    ) {

        let message =
            "We couldn't access your location. Please enable location permission and try again.";

        if (error) {

            if (
                error.code ===
                error.PERMISSION_DENIED
            ) {

                message =
                    "Location permission was denied. Please enable location access for this site and try again.";

            } else if (
                error.code ===
                error.POSITION_UNAVAILABLE
            ) {

                message =
                    "Your location could not be determined. Please make sure location services are turned on.";

            } else if (
                error.code ===
                error.TIMEOUT
            ) {

                message =
                    "Location detection took too long. Please try again.";

            }

        }

        const errorElement =
            $("pricingLocationError");

        if (errorElement) {
            errorElement.textContent =
                message;
        }

        showLocationRequest();

    }

    function requestLocation() {

        const errorElement =
            $("pricingLocationError");

        if (errorElement) {
            errorElement.textContent = "";
        }

        if (
            !navigator.geolocation
        ) {

            if (errorElement) {

                errorElement.textContent =
                    "Location services are not supported by this browser.";

            }

            showLocationRequest();

            return;

        }

        showLoading();

        navigator.geolocation.getCurrentPosition(
            async (position) => {

                try {

                    const latitude =
                        position.coords.latitude;

                    const longitude =
                        position.coords.longitude;

                    await loadPricing(
                        latitude,
                        longitude
                    );

                    showPricing();

                } catch (error) {

                    const pricingError =
                        $("pricingLocationError");

                    if (pricingError) {

                        pricingError.textContent =
                            error.message ||
                            "Unable to load pricing for your location.";

                    }

                    showLocationRequest();

                }

            },
            (error) => {

                handleLocationError(
                    error
                );

            },
            {
                enableHighAccuracy: false,
                timeout: 15000,
                maximumAge: 300000
            }
        );

    }

    function initializeMobileNavigation() {

        const menuButton =
            $("pricingMenuButton");

        const navigation =
            $("pricingMobileNavigation");

        if (
            !menuButton ||
            !navigation
        ) {
            return;
        }

        menuButton.addEventListener(
            "click",
            () => {

                const isOpen =
                    navigation.classList.toggle(
                        "is-open"
                    );

                const icon =
                    menuButton.querySelector(
                        "i"
                    );

                if (!icon) {
                    return;
                }

                icon.className =
                    isOpen
                        ? "ri-close-line"
                        : "ri-menu-line";

            }
        );

    }

    function initializeToast() {

        const closeButton =
            $("pricingToastClose");

        const toast =
            $("pricingToast");

        if (
            !closeButton ||
            !toast
        ) {
            return;
        }

        closeButton.addEventListener(
            "click",
            () => {

                toast.classList.remove(
                    "is-visible"
                );

            }
        );

    }

    function initialize() {

        initializeMobileNavigation();

        initializeToast();

        const locationButton =
            $("enableLocationButton");

        if (locationButton) {

            locationButton.addEventListener(
                "click",
                requestLocation
            );

        }

        showLocationRequest();

    }

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initialize
        );

    } else {

        initialize();

    }

})();