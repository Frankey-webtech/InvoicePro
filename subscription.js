const currentUser = Parse.User.current();

if (!currentUser) {
    window.location.href = "login.html";
}

const subscriptionState = {

    // Current subscription from backend
    currentPlan: "Free",
    currentPrice: 0,
    currentBilling: "",
    currentStatus: "",

    // Selected plan before payment
    selectedPlan: null,
    selectedPrice: 0,
    selectedBilling: "",

    // Payment
    paymentMethod: "Card",

    // Auto renewal
    autoRenew: false,

    // Currency
    currencyCode: "",
    currencySymbol: "",

    // Payment Reference
    paymentReference: "",

    // Prevent duplicate clicks
    processing: false

};

const faqQuestions = document.querySelectorAll(

        ".faq-question"

    );

const subscriptionStatus =
    document.getElementById("subscriptionStatus");

const currentPlanName =
    document.getElementById("currentPlanName");

const currentPlanPrice =
    document.getElementById("currentPlanPrice");

const currentPlanBilling =
    document.getElementById("currentPlanBilling");

const maxInvoices =
    document.getElementById("maxInvoices");

const maxEstimates =
    document.getElementById("maxEstimates");

const maxClients =
    document.getElementById("maxClients");

const freePlanCard =
    document.getElementById("freePlanCard");

const starterPlanCard =
    document.getElementById("starterPlanCard");

const businessPlanCard =
    document.getElementById("businessPlanCard");

const enterprisePlanCard =
    document.getElementById("enterprisePlanCard");

const freePlanButton =
    document.getElementById("freePlanButton");

const starterPlanButton =
    document.getElementById("starterPlanButton");

const businessPlanButton =
    document.getElementById("businessPlanButton");

const enterprisePlanButton =
    document.getElementById("enterprisePlanButton");

const freePlanPrice =
    document.getElementById("freePlanPrice");

const starterPlanPrice =
    document.getElementById("starterPlanPrice");

const businessPlanPrice =
    document.getElementById("businessPlanPrice");

const enterprisePlanPrice =
    document.getElementById("enterprisePlanPrice");

const cardPaymentMethod =
    document.getElementById("cardPaymentMethod");

const paypalPaymentMethod =
    document.getElementById("paypalPaymentMethod");

const cardRadio =
    document.getElementById("cardRadio");

const paypalRadio =
    document.getElementById("paypalRadio");

const saveCard =
    document.getElementById("saveCard");

const summaryPlanName =
    document.getElementById("summaryPlanName");

const summaryBillingCycle =
    document.getElementById("summaryBillingCycle");

const summaryPlanPrice =
    document.getElementById("summaryPlanPrice");

const summaryTotalPrice =
    document.getElementById("summaryTotalPrice");

const subscribeButton =
    document.getElementById("subscribeButton");

async function loadCurrentSubscription() {

    try {

        const response =
            await Parse.Cloud.run(
                "getCurrentSubscription"
            );

        if (!response.success) {

            throw new Error(
                "Unable to load subscription."
            );

        }

        subscriptionState.currentPlan =
            response.plan;

        subscriptionState.currentPrice =
            response.planPrice;

        subscriptionState.currentBilling =
            response.planBilling;

        subscriptionState.currentStatus =
            response.subscriptionStatus;

        subscriptionState.currencyCode =
            response.currencyCode;

        subscriptionState.currencySymbol =
            response.currencySymbol;

        subscriptionState.selectedPlan =
            response.plan;

        subscriptionState.selectedPrice =
            response.planPrice;

        subscriptionState.selectedBilling =
            response.planBilling;

        subscriptionState.autoRenew =
            false;

        currentPlanName.textContent =
            response.plan;

        currentPlanPrice.textContent =
            formatMoney(response.planPrice);

        currentPlanBilling.textContent =
            response.planBilling;

        subscriptionStatus.textContent =
            response.subscriptionStatus;

        maxInvoices.textContent =
            response.maxInvoices === -1
                ? "Unlimited"
                : response.maxInvoices;

        maxEstimates.textContent =
            response.maxEstimates === -1
                ? "Unlimited"
                : response.maxEstimates;

        maxClients.textContent =
            response.maxClients === -1
                ? "Unlimited"
                : response.maxClients;

        summaryPlanName.textContent =
            response.plan;

        summaryBillingCycle.textContent =
            response.planBilling;

        summaryPlanPrice.textContent =
            formatMoney(response.planPrice);

        summaryTotalPrice.textContent =
            formatMoney(response.planPrice);

        saveCard.checked = false;

        updateCurrentPlanUI(
            response.plan
        );

    }

    catch (error) {

        console.error(error);

        showError(

            error.message ||

            "Unable to load subscription."

        );

    }

}

async function startCardSubscription() {

    const response =

        await Parse.Cloud.run(

            "initializeCardSubscription",

            {

                plan:

                    subscriptionState.selectedPlan,

                autoRenew:

                    saveCard.checked

            }

        );

    if (!response.success) {

        throw new Error(

            response.message ||

            "Unable to initialize payment."

        );

    }

    subscriptionState.paymentReference =

        response.reference;

    window.location.href =

        response.authorizationUrl;

}

async function startPayPalSubscription() {

    const response =

        await Parse.Cloud.run(

            "initializePayPalSubscription",

            {

                plan:

                    subscriptionState.selectedPlan,

                autoRenew:

                    saveCard.checked

            }

        );

    if (!response.success) {

        throw new Error(

            response.message ||

            "Unable to initialize PayPal."

        );

    }

    subscriptionState.paymentReference =

        response.reference;

    window.location.href =

        response.authorizationUrl;

}

async function verifyPaystackPayment() {

    const params =

        new URLSearchParams(

            window.location.search

        );

    const reference =

        params.get("reference");

    if (!reference) {

        return;

    }

    try {

        setLoading(

            subscribeButton,

            true,

            "Verifying..."

        );

        const response =

            await Parse.Cloud.run(

                "verifyCardSubscription",

                {

                    reference

                }

            );

        if (!response.success) {

            throw new Error(

                response.message ||

                "Payment verification failed."

            );

        }

        showSuccess(

            "Subscription activated successfully."

        );

        await loadCurrentSubscription();

        window.history.replaceState(

            {},

            document.title,

            window.location.pathname

        );

    }

    catch (error) {

        console.error(error);

        showError(

            error.message ||

            "Unable to verify payment."

        );

    }

    finally {

        subscriptionState.processing = false;

        setLoading(

            subscribeButton,

            false

        );

    }

}

async function verifyPayPalPayment() {

    const params =

        new URLSearchParams(

            window.location.search

        );

    const orderId =

        params.get("token");

    const reference =

        params.get("reference");

    if (!orderId || !reference) {

        return;

    }

    try {

        setLoading(

            subscribeButton,

            true,

            "Verifying..."

        );

        const response =

            await Parse.Cloud.run(

                "verifyPayPalSubscription",

                {

                    orderId,

                    reference

                }

            );

        if (!response.success) {

            throw new Error(

                response.message ||

                "Unable to verify PayPal payment."

            );

        }

        showSuccess(

            "Subscription activated successfully."

        );

        await loadCurrentSubscription();

        window.history.replaceState(

            {},

            document.title,

            window.location.pathname

        );

    }

    catch (error) {

        console.error(error);

        showError(

            error.message ||

            "Unable to verify PayPal payment."

        );

    }

    finally {

        subscriptionState.processing = false;

        setLoading(

            subscribeButton,

            false

        );

    }

}

function formatMoney(amount) {

    if (amount === -1) {
        return "Unlimited";
    }

    const currency =
        subscriptionState.currencySymbol || "";

    return (
        currency +
        Number(amount).toLocaleString()
    );

}

function setLoading(button, loading, text = "Processing...") {

    if (!button) return;

    if (loading) {

        button.disabled = true;

        button.dataset.originalText =
            button.textContent;

        button.textContent = text;

    } else {

        button.disabled = false;

        button.textContent =
            button.dataset.originalText || "Submit";

    }

}

function showError(message) {

    alert(message);

}

function showSuccess(message) {

    alert(message);

}

function updateCurrentPlanUI(currentPlan) {

    const cards = [

        freePlanCard,

        starterPlanCard,

        businessPlanCard,

        enterprisePlanCard

    ];

    const buttons = [

        freePlanButton,

        starterPlanButton,

        businessPlanButton,

        enterprisePlanButton

    ];

    cards.forEach(card => {

        card.classList.remove(
            "current-plan-card"
        );

    });

    buttons.forEach(button => {

        button.classList.remove(
            "current-button"
        );

        button.disabled = false;

        button.textContent =
            "Choose " +
            button.id
                .replace("PlanButton", "");

    });

    switch (currentPlan) {

        case "Free":

            freePlanCard.classList.add(
                "current-plan-card"
            );

            freePlanButton.classList.add(
                "current-button"
            );

            freePlanButton.textContent =
                "Current Plan";

            freePlanButton.disabled = true;

            break;

        case "Starter":

            starterPlanCard.classList.add(
                "current-plan-card"
            );

            starterPlanButton.classList.add(
                "current-button"
            );

            starterPlanButton.textContent =
                "Current Plan";

            starterPlanButton.disabled = true;

            break;

        case "Business":

            businessPlanCard.classList.add(
                "current-plan-card"
            );

            businessPlanButton.classList.add(
                "current-button"
            );

            businessPlanButton.textContent =
                "Current Plan";

            businessPlanButton.disabled = true;

            break;

        case "Enterprise":

            enterprisePlanCard.classList.add(
                "current-plan-card"
            );

            enterprisePlanButton.classList.add(
                "current-button"
            );

            enterprisePlanButton.textContent =
                "Current Plan";

            enterprisePlanButton.disabled = true;

            break;

    }

}

function getPlanDetails() {

    const isNigeria =
        subscriptionState.currencyCode === "NGN";

    return {

        Free: {
            price: 0,
            billing: "Forever"
        },

        Starter: {
            price: isNigeria ? 2500 : 10,
            billing: "Monthly"
        },

        Business: {
            price: isNigeria ? 5000 : 20,
            billing: "Monthly"
        },

        Enterprise: {
            price: isNigeria ? 10000 : 30,
            billing: "Monthly"
        }

    };

}

function selectPlan(planName) {

    if (planName === subscriptionState.currentPlan) {

        return;

    }

    const plan =
    getPlanDetails()[planName];

    if (!plan) {

        return;

    }

    // Save state

    subscriptionState.selectedPlan = planName;

    subscriptionState.selectedPrice = plan.price;

    subscriptionState.selectedBilling = plan.billing;

    summaryPlanName.textContent =

        planName;

    summaryBillingCycle.textContent =

        plan.billing;

    summaryPlanPrice.textContent =

        formatMoney(plan.price);

    summaryTotalPrice.textContent =

        formatMoney(plan.price);


    updateSelectedPlanUI(planName);

}

function selectPaymentMethod(method) {

    subscriptionState.paymentMethod = method;

    if (method === "Card") {

        cardRadio.checked = true;

        paypalRadio.checked = false;

        cardPaymentMethod.classList.add(
            "selected-payment-method"
        );

        paypalPaymentMethod.classList.remove(
            "selected-payment-method"
        );

    } else {

        paypalRadio.checked = true;

        cardRadio.checked = false;

        paypalPaymentMethod.classList.add(
            "selected-payment-method"
        );

        cardPaymentMethod.classList.remove(
            "selected-payment-method"
        );

    }

}

function updateSelectedPlanUI(selectedPlan) {

    const cards = {

        Free: freePlanCard,

        Starter: starterPlanCard,

        Business: businessPlanCard,

        Enterprise: enterprisePlanCard

    };

    Object.values(cards).forEach(card => {

        card.classList.remove(

            "selected-plan"

        );

    });

    if (cards[selectedPlan]) {

        cards[selectedPlan].classList.add(

            "selected-plan"

        );

    }

}

starterPlanButton.addEventListener(

    "click",

    () => {

        selectPlan("Starter");

    }

);

businessPlanButton.addEventListener(

    "click",

    () => {

        selectPlan("Business");

    }

);

enterprisePlanButton.addEventListener(

    "click",

    () => {

        selectPlan("Enterprise");

    }

);

cardPaymentMethod.addEventListener(

    "click",

    () => {

        selectPaymentMethod("Card");

    }

);

paypalPaymentMethod.addEventListener(

    "click",

    () => {

        selectPaymentMethod("PayPal");

    }

);

cardRadio.addEventListener(

    "change",

    () => {

        selectPaymentMethod("Card");

    }

);

paypalRadio.addEventListener(

    "change",

    () => {

        selectPaymentMethod("PayPal");

    }

);

subscribeButton.addEventListener(

    "click",

    async () => {

        if (subscriptionState.processing) {

            return;

        }

        if (

            !subscriptionState.selectedPlan ||

            subscriptionState.selectedPlan === "Free"

        ) {

            showError(

                "Please select a paid subscription plan."

            );

            return;

        }

        subscriptionState.processing = true;

        setLoading(

            subscribeButton,

            true,

            "Redirecting..."

        );

        try {

            if (

                subscriptionState.paymentMethod ===

                "Card"

            ) {

                await startCardSubscription();

            }

            else if (

                subscriptionState.paymentMethod ===

                "PayPal"

            ) {

                await startPayPalSubscription();

            }

            else {

                throw new Error(

                    "Please select a payment method."

                );

            }

        }

        catch (error) {

            console.error(error);

            showError(

                error.message ||

                "Unable to start subscription."

            );

            subscriptionState.processing = false;

            setLoading(

                subscribeButton,

                false

            );

        }

    }

);

faqQuestions.forEach(question => {

    question.addEventListener(

        "click",

        () => {

            const faqItem =

                question.closest(

                    ".faq-item"

                );

            const isOpen =

                faqItem.classList.contains(

                    "active"

                );

            document

                .querySelectorAll(

                    ".faq-item"

                )

                .forEach(item => {

                    item.classList.remove(

                        "active"

                    );

                });

            if (!isOpen) {

                faqItem.classList.add(

                    "active"

                );

            }

        }

    );

});

document.addEventListener(

    "DOMContentLoaded",

    async () => {

        await loadCurrentSubscription();

        selectPaymentMethod("Card");

        await verifyPaystackPayment();

        await verifyPayPalPayment();

    }

);