const estimatePreviewState = {

    initialized: false,

    userProfile: null,

    template: null,

    currencyCode: "USD",

    currencySymbol: "$",

    logoUrl: "",

    primaryColor: "#2563EB",

    secondaryColor: "#FFFFFF",

    estimate: null

};

const estimatePreviewElements = {

    paper: document.getElementById("estimatePaper"),

    title: document.getElementById("estimatePreviewTitle"),

    number: document.getElementById("estimatePreviewNumber"),

    companyName: document.getElementById("estimateCompanyName"),

    logo: document.getElementById("estimateCompanyLogo"),

    itemsTable: document.getElementById("estimateItemsTableBody"),

    subtotal: document.getElementById("previewSubtotal"),

    grandTotal: document.getElementById("estimatePreviewGrandTotal")

};

const printEstimateButton =
document.getElementById(
    "printEstimateButton"
);

if (printEstimateButton) {

    printEstimateButton.addEventListener(
        "click",
        printEstimatePreview
    );

}

const downloadEstimatePdfButton =
document.getElementById(
    "downloadEstimatePdfButton"
);

const signatureImageInput =
    document.getElementById("signatureImageInput");

const signaturePreview =
    document.getElementById("signaturePreview");

if (downloadEstimatePdfButton) {

    downloadEstimatePdfButton.addEventListener(
    "click",
    () => {

        exportEstimatesPdf(
            estimateId
        );

    }
);

}

async function initializeEstimatePreview() {

    try {


        await loadEstimatePreviewProfile();

        await loadEstimatePreviewTemplate();

        initializeEstimatePreviewDefaults();
        
        updateEstimateBusinessPreview();

        registerEstimatePreviewListeners();
        
        applyEstimateTemplate();

        estimatePreviewState.initialized = true;

    }

    catch (error) {

        console.error(error);

        showToast(
            error.message || error,
            "error"
        );

    }

}

async function loadEstimatePreviewProfile() {

    const response =
    await Parse.Cloud.run(
        "getUserProfile"
    );

    if (!response.success) {

        throw "Unable to load profile.";

    }

    const profile =
    response.profile;

    estimatePreviewState.userProfile =
    profile;

    estimatePreviewState.currencyCode =
    profile.currencyCode || "USD";

    estimatePreviewState.currencySymbol =
    profile.currencySymbol || "$";

    estimatePreviewState.logoUrl =
    profile.businessLogo
    ? profile.businessLogo
    : "";

    estimatePreviewState.primaryColor =
    profile.primaryColor || "#2563EB";

    estimatePreviewState.secondaryColor =
    profile.secondaryColor || "#FFFFFF";

}

async function loadEstimatePreviewTemplate() {

    const response =
    await Parse.Cloud.run(
        "getEstimateTemplate"
    );

    if (
        response.success &&
        response.exists
    ) {

        estimatePreviewState.template =
        response.settings || {};

    }

    else {

        estimatePreviewState.template = {};

    }

}

function formatDate(date) {

    if (!date) {
        return "-";
    }

    const parsedDate =
        new Date(date);

    if (isNaN(parsedDate.getTime())) {
        return "-";
    }

    return parsedDate.toLocaleDateString();
}

function initializeEstimatePreviewDefaults() {

    const profile =
    estimatePreviewState.userProfile;

    customerNotesInput.value =
    profile.defaultInvoiceNotes || "";

    estimateTermsInput.value =
    profile.defaultInvoiceTerms || "";

    estimateTaxInput.value =
    profile.defaultTaxPercentage || 0;

}

function updateEstimatePreview() {

    updateEstimateHeaderPreview();

    updateEstimateDetailsPreview();

    updateEstimateNotesPreview();

    updateEstimateSignaturePreview();

}

function updateEstimatePaymentPreview() {

    const paymentDetails =
    selectedEstimate?.paymentDetails || {};

setPreviewText(
    "previewPaymentProvider",
    paymentDetails.paymentProvider,
    "-"
);

setPreviewText(
    "previewPaymentMethod",
    paymentDetails.paymentMethod,
    "-"
);

const paymentReference =
    [
        paymentDetails.accountName
            ? `<strong>Account Name:</strong> ${paymentDetails.accountName}`
            : "",
        paymentDetails.bankName
            ? `<strong>Bank Name:</strong> ${paymentDetails.bankName}`
            : "",
        paymentDetails.accountNumber
            ? `<strong>Account Number:</strong> ${paymentDetails.accountNumber}`
            : "",
        paymentDetails.routingNumber
            ? `<strong>Routing Number:</strong> ${paymentDetails.routingNumber}`
            : "",
        paymentDetails.swiftCode
            ? `<strong>SWIFT Code:</strong> ${paymentDetails.swiftCode}`
            : "",
        paymentDetails.paymentAccount
            ? `<strong>Payment Account:</strong> ${paymentDetails.paymentAccount}`
            : "",
        paymentDetails.paymentLink
            ? `<strong>Payment Link:</strong> ${paymentDetails.paymentLink}`
            : ""
    ]
    .filter(Boolean)
    .join("<br><br>");

document.getElementById(
    "previewPaymentReference"
).innerHTML =
    paymentReference || "-";

    setPreviewText(
        "previewPaymentStatus",
        paymentDetails.paymentStatus,
        "Pending"
    );
    
    setPreviewText(
    "previewPaymentStatus",
    paymentDetails.paymentStatus || "Pending",
    "Pending"
);

}

function updateEstimateHeaderPreview() {

    setPreviewText(
        "estimatePreviewTitle",
        estimateTitleInput.value,
        "ESTIMATE"
    );

    setPreviewText(
        "estimatePreviewProjectName",
        projectNameInput.value,
        "-"
    );

    setPreviewText(
        "estimatePreviewNumber",
        estimateNumberInput.value,
        "-"
    );

}

function updateEstimateDetailsPreview() {

    setPreviewText(
        "estimatePreviewReference",
        referenceNumberInput.value,
        "-"
    );

    setPreviewText(
        "estimatePreviewPurchaseOrder",
        purchaseOrderInput.value,
        "-"
    );

    setPreviewText(
        "estimatePreviewIssueDate",
        formatPreviewDate(
            estimateIssueDateInput.value
        ),
        "-"
    );

    setPreviewText(
        "estimatePreviewExpiryDate",
        formatPreviewDate(
            estimateExpiryDateInput.value
        ),
        "-"
    );

}

function updateEstimateNotesPreview() {

    setPreviewText(
        "estimatePreviewNotes",
        customerNotesInput.value,
        "No notes."
    );

    setPreviewText(
        "estimatePreviewTerms",
        estimateTermsInput.value,
        "No terms."
    );

    setPreviewText(
        "estimatePreviewValidity",
        validityMessageInput.value,
        ""
    );
    
    updateEstimateSignaturePreview();

}

function updateEstimateSignaturePreview() {

    setPreviewText(
        "estimatePreviewSignatureName",
        signatureNameInput.value,
        ""
    );

    setPreviewText(
        "estimatePreviewSignatureTitle",
        signatureTitleInput.value,
        ""
    );

    const previewImage =
        document.getElementById(
            "estimatePreviewSignatureImage"
        );

    if (!previewImage) {
        return;
    }

    if (
        signatureImageInput &&
        signatureImageInput.files &&
        signatureImageInput.files.length > 0
    ) {

        const file =
            signatureImageInput.files[0];

        if (!file.type.startsWith("image/")) {

            previewImage.style.display = "none";

            return;

        }

        const reader =
            new FileReader();

        reader.onload =
            function(event) {

                previewImage.src =
                    event.target.result;

                previewImage.style.display =
                    "block";

            };

        reader.readAsDataURL(file);

    }

}

function registerEstimatePreviewListeners() {

    const controls = [

        estimateTitleInput,

        projectNameInput,

        estimateNumberInput,

        referenceNumberInput,

        purchaseOrderInput,

        estimateIssueDateInput,

        estimateExpiryDateInput,

        customerNotesInput,

        estimateTermsInput,

        validityMessageInput,

        signatureNameInput,

        signatureTitleInput

    ];

    controls.forEach(control => {

        if (!control) return;

        control.addEventListener("input", updateEstimatePreview);

        control.addEventListener("change", updateEstimatePreview);

    });

    if (signatureImageInput) {

        signatureImageInput.addEventListener(
            "change",
            updateEstimateSignatureImagePreview
        );

    }
    
    estimateClientInput.addEventListener(
    "change",
    updateEstimateClientPreview
);

estimateTaxInput.addEventListener(
    "input",
    updateEstimateTotalsPreview
);

estimateDiscountInput.addEventListener(
    "input",
    updateEstimateTotalsPreview
);

estimateShippingInput.addEventListener(
    "input",
    updateEstimateTotalsPreview
);

    updateEstimatePreview();

}

function updateEstimateSignatureImagePreview() {

    if (!signatureImageInput || !signaturePreview) {
        return;
    }

    const file = signatureImageInput.files[0];

    if (!file) {

        signaturePreview.src = "";
        signaturePreview.style.display = "none";

        return;
    }

    if (!file.type.startsWith("image/")) {

        signatureImageInput.value = "";
        signaturePreview.src = "";
        signaturePreview.style.display = "none";

        return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {

        signaturePreview.src = event.target.result;
        signaturePreview.style.display = "block";

    };

    reader.readAsDataURL(file);
}

function setPreviewText(
    id,
    value,
    fallback = ""
) {

    const element =
    document.getElementById(id);

    if (!element) return;

    element.textContent =
        value && value.trim()
        ? value
        : fallback;

}

function formatPreviewDate(value) {

    if (!value) {

        return "";

    }

    return new Date(value)
        .toLocaleDateString(
            undefined,
            {

                year: "numeric",

                month: "long",

                day: "numeric"

            }

        );

}

function updateEstimateBusinessPreview() {

    const profile =
        estimatePreviewState.userProfile;

    if (!profile) {
        return;
    }

    setPreviewText(
        "previewCompanyName",
        profile.businessName ||
        profile.companyName ||
        profile.name,
        "Invoice Pro"
    );

    setPreviewText(
        "previewCompanyAddress",
        profile.businessAddress ||
        profile.address ||
        "",
        ""
    );

    setPreviewText(
        "previewCompanyPhone",
        profile.businessPhone ||
        profile.phone ||
        "",
        ""
    );

    setPreviewText(
        "previewCompanyEmail",
        profile.businessEmail ||
        profile.email ||
        "",
        ""
    );

    setPreviewText(
        "previewCompanyWebsite",
        profile.businessWebsite ||
        profile.website ||
        "",
        ""
    );

    updateEstimateCompanyLogo(profile);

}

function updateEstimateCompanyLogo(profile) {

    const logo =
        document.getElementById(
            "previewCompanyLogo"
        );

    if (!logo) {
        return;
    }

    let logoUrl =
        estimatePreviewState.logoUrl || "";

    if (!logoUrl && profile) {

        const businessLogo =
            profile.businessLogo;

        if (
            businessLogo &&
            typeof businessLogo.url === "function"
        ) {

            logoUrl =
                businessLogo.url();

        }

        else if (
            typeof businessLogo === "string"
        ) {

            logoUrl =
                businessLogo;

        }

    }

    if (logoUrl) {

        logo.src =
            logoUrl;

        logo.style.display =
            "block";

    }

    else {

        logo.removeAttribute(
            "src"
        );

        logo.style.display =
            "none";

    }

}

function applyEstimateBrandColors(profile) {

    const paper =
        document.getElementById(
            "estimatePaper"
        );

    if (!paper) {

        return;

    }

    paper.style.setProperty(

        "--estimate-primary",

        profile.primaryColor || "#2563EB"

    );

    paper.style.setProperty(

        "--estimate-secondary",

        profile.secondaryColor || "#FFFFFF"

    );

}

function refreshEstimateBusinessPreview() {

    updateEstimateBusinessPreview();

}

estimatePreviewState.clients = [];

function setEstimatePreviewClients(clients) {

    estimatePreviewState.clients =
        Array.isArray(clients)
        ? clients
        : [];

}

function updateEstimateClientPreview() {

    const clientId =
        estimateClientInput.value;

    const client =
        estimatePreviewState.clients.find(
            item => {

                return (
                    item.objectId === clientId ||
                    item.id === clientId
                );

            }
        );

    if (!client) {

        clearEstimateClientPreview();

        return;

    }
    
    

    setPreviewText(
        "estimatePreviewClientName",

        client.contactPerson ||
        client.contactName ||
        client.fullName ||
        client.name,

        "-"
    );

    setPreviewText(
        "estimatePreviewCompany",

        client.companyName,

        "-"
    );

    setPreviewText(
        "estimatePreviewClientEmail",

        client.clientEmail ||
        client.email ||
        client.contactEmail,

        "-"
    );

    setPreviewText(
        "estimatePreviewClientPhone",

        client.clientPhone ||
        client.phone ||
        client.contactPhone,

        "-"
    );

    setPreviewText(
        "estimatePreviewClientAddress",

        client.clientAddress ||
        client.address ||
        client.businessAddress,

        "-"
    );

}

function clearEstimateClientPreview() {

    const ids = [

        "estimatePreviewClientName",

        "estimatePreviewCompany",

        "estimatePreviewClientEmail",

        "estimatePreviewClientPhone",

        "estimatePreviewClientAddress"

    ];

    ids.forEach(id => {

        setPreviewText(
            id,
            "",
            "-"
        );

    });

}

estimatePreviewState.items = [];

function setEstimatePreviewItems(items) {

    estimatePreviewState.items = Array.isArray(items)
        ? items
        : [];

    updateEstimateItemsPreview();

}

function updateEstimateItemsPreview() {

    const tbody =
        document.getElementById(
            "previewItemsBody"
        );

    if (!tbody) {

        console.warn(
            "previewItemsBody was not found."
        );

        return;

    }

    tbody.innerHTML = "";

    const items =
        Array.isArray(estimatePreviewState.items)
            ? estimatePreviewState.items
            : [];

    if (items.length === 0) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="empty-items-row">

                    No items added yet.

                </td>

            </tr>

        `;

        return;

    }

    items.forEach((item, index) => {

        const quantity =
            Number(item.quantity) || 0;

        const unitPrice =
            Number(
                item.rate ??
                item.unitPrice ??
                0
            );

        const description =
            item.itemName ??
            item.description ??
            "-";

        const total =
            Number(
                item.total ??
                (quantity * unitPrice)
            );

        const row =
            document.createElement("tr");

        row.innerHTML = `

            <td class="item-number">
                ${index + 1}
            </td>

            <td class="item-description">
                ${description}
            </td>

            <td>
                ${quantity}
            </td>

            <td>
                ${formatEstimateMoney(unitPrice)}
            </td>

            <td class="amount-column">
                ${formatEstimateMoney(total)}
            </td>

        `;

        tbody.appendChild(row);

    });

}

function formatEstimateMoney(amount) {

    return `${estimatePreviewState.currencySymbol}${Number(amount || 0).toLocaleString(
        undefined,
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    )}`;

}

function updateEstimateTotalsPreview() {

    const items =
        Array.isArray(estimatePreviewState.items)
            ? estimatePreviewState.items
            : [];

    let subtotal = 0;

    items.forEach(item => {

        const quantity =
            Number(item.quantity) || 0;

        const unitPrice =
            Number(
                item.rate ??
                item.unitPrice ??
                0
            );

        subtotal +=
            quantity * unitPrice;

    });

    const taxPercent =
        Number(
            estimateTaxInput.value
        ) || 0;

    const discount =
        Number(
            estimateDiscountInput.value
        ) || 0;

    const shipping =
        Number(
            estimateShippingInput.value
        ) || 0;

    const taxAmount =
        subtotal *
        (taxPercent / 100);

    const grandTotal =
        subtotal +
        taxAmount +
        shipping -
        discount;

    setPreviewText(
        "previewSubtotal",
        formatEstimateMoney(subtotal),
        formatEstimateMoney(0)
    );

    setPreviewText(
        "previewTax",
        formatEstimateMoney(taxAmount),
        formatEstimateMoney(0)
    );

    setPreviewText(
        "previewDiscount",
        formatEstimateMoney(discount),
        formatEstimateMoney(0)
    );

    setPreviewText(
        "previewShipping",
        formatEstimateMoney(shipping),
        formatEstimateMoney(0)
    );

    setPreviewText(
        "previewGrandTotal",
        formatEstimateMoney(
            Math.max(grandTotal, 0)
        ),
        formatEstimateMoney(0)
    );

}

function applyEstimateTemplate() {

    const paper =
        document.getElementById("estimatePaper");

    if (!paper) {

        return;

    }

    const settings =
        estimatePreviewState.template || {};

    // ======================================
    // COLORS
    // ======================================

    paper.style.backgroundColor =
        settings.backgroundColor || "#FFFFFF";

    paper.style.color =
        settings.textColor || "#111827";

    paper.style.setProperty(
        "--estimate-accent-color",
        settings.accentColor || "#2563EB"
    );

    // ======================================
    // TYPOGRAPHY
    // ======================================

    paper.style.fontFamily =
        settings.fontFamily || "Inter";

    paper.style.fontSize =
        `${settings.fontSize || 16}px`;

    paper.style.fontWeight =
        settings.fontWeight || "400";

    paper.style.lineHeight =
        settings.lineHeight || 1.5;

    paper.style.letterSpacing =
        `${settings.letterSpacing || 0}px`;

    paper.style.textTransform =
        settings.textTransform || "none";

    paper.style.borderRadius =
        `${settings.borderRadius || 0}px`;

    paper.style.padding =
        `${settings.padding || 40}px`;

    paper.style.width =
        `${settings.width || 100}%`;

    // ======================================
    // BORDER
    // ======================================

    paper.style.border =
        settings.borderEnabled
        ? `${settings.borderWidth || 1}px ${settings.borderStyle || "solid"} ${settings.borderColor || "#D9E2EC"}`
        : "none";

    // ======================================
    // SHADOW
    // ======================================

    paper.style.boxShadow =
        settings.shadowEnabled
        ? `0 0 ${settings.shadowBlur || 12}px rgba(0,0,0,.15)`
        : "none";

    // ======================================
    // ALIGNMENT
    // ======================================

    paper.style.textAlign =
        settings.textAlign || "left";

    // ======================================
    // VISIBILITY
    // ======================================

    toggleEstimateSection(
        "estimateHeaderSelection",
        settings.showEstimateTitle
    );

    toggleEstimateSection(
        "estimateCompanySelection",
        settings.showCompanyInfo
    );

    toggleEstimateSection(
        "estimateCustomerSelection",
        settings.showCustomerInfo
    );

    toggleEstimateSection(
        "estimateItemsSelection",
        settings.showItemsTable
    );

    toggleEstimateSection(
        "estimateTotalsSelection",
        settings.showGrandTotal
    );

    toggleEstimateSection(
        "estimateNotesSelection",
        settings.showNotes
    );

    toggleEstimateSection(
        "estimateFooterSelection",
        settings.showFooter
    );

    toggleEstimateElement(
        "estimateCompanyLogo",
        settings.showLogo
    );

    toggleEstimateElement(
        "estimateCompanyAddress",
        settings.showCompanyAddress
    );

    toggleEstimateElement(
        "estimateCompanyPhone",
        settings.showCompanyPhone
    );

    toggleEstimateElement(
        "estimateCompanyEmail",
        settings.showCompanyEmail
    );

}

function toggleEstimateSection(id, visible) {

    const element =
        document.getElementById(id);

    if (!element) {

        return;

    }

    element.style.display =
        visible === false
        ? "none"
        : "";

}

function toggleEstimateElement(id, visible) {

    const element =
        document.getElementById(id);

    if (!element) {

        return;

    }

    element.style.display =
        visible === false
        ? "none"
        : "";

}

let estimateTemplateSaveTimeout = null;

let estimateTemplateSaving = false;

function queueEstimateTemplateSave(section) {

    clearTimeout(
        estimateTemplateSaveTimeout
    );

    estimateTemplateSaveTimeout =
        setTimeout(() => {

            saveEstimateTemplate(section);

        }, 600);

}

async function saveEstimateTemplate(section = "general") {

    if (estimateTemplateSaving) {

        return;

    }

    estimateTemplateSaving = true;

    try {

        await Parse.Cloud.run(

            "saveEstimateTemplate",

            {

                templateName: "Default",

                section,

                settings:
                estimatePreviewState.template

            }

        );

    }

    catch (error) {

        console.error(error);

        showToast(

            error.message || error,

            "error"

        );

    }

    finally {

        estimateTemplateSaving = false;

    }

}

function updateEstimateTemplateSetting(
    key,
    value,
    section = "general"
) {

    estimatePreviewState.template[key] =
        value;

    applyEstimateTemplate();

    queueEstimateTemplateSave(section);

}

function getEstimatePreviewElement() {

    return document.getElementById(
        "estimatePaper"
    );

}

function prepareEstimatePreviewForExport() {

    const paper =
        getEstimatePreviewElement();

    if (!paper) {

        return null;

    }

    paper.classList.add(
        "estimate-export-mode"
    );

    return paper;

}

function restoreEstimatePreviewAfterExport() {

    const paper =
        getEstimatePreviewElement();

    if (!paper) {

        return;

    }

    paper.classList.remove(
        "estimate-export-mode"
    );

}

async function exportEstimatesPdf(estimateId){

    try{

        const preview =
            document.getElementById(
                "estimatePreviewPanel"
            );

        if(!preview){

            showToast(
                "Estimate preview could not be found.",
                "error"
            );

            return;

        }

        // Load the exact estimate being exported
        const result =
            await loadEstimateDetails(
                estimateId
            );

        if(!result){

            showToast(
                "Could not load the selected estimate.",
                "error"
            );

            return;

        }

        // Populate the preview with the selected estimate
        populateEstimatePreview();

        // Wait for fonts before printing
        await document.fonts.ready;


        prepareEstimatePreviewForExport();

        window.addEventListener(
            "afterprint",
            () => {

                restoreEstimatePreviewAfterExport();

                if(
                    typeof exportMenu !==
                    "undefined" &&
                    exportMenu
                ){

                    exportMenu.classList.remove(
                        "show"
                    );

                }

            },
            { once: true }
        );

        window.print();

    }
    catch(error){

        console.error(error);

        restoreEstimatePreviewAfterExport();

        showToast(
            error.message,
            "error"
        );

    }

}

function populateEstimatePreview() {

    if (!selectedEstimate) {
        return;
    }

    const estimate =
        selectedEstimate;

    const client =
        selectedEstimateClient;
        
    
    estimatePreviewState.currencyCode =
        estimate.currencyCode || "USD";

    estimatePreviewState.currencySymbol =
        estimate.currencySymbol || "$";

    setPreviewText(
        "previewCurrency",
        estimate.currencyCode &&
        estimate.currencySymbol
            ? `${estimate.currencyCode} (${estimate.currencySymbol})`
            : "USD ($)"
    );

    setPreviewText(
        "previewHeaderEstimateNumber",
        estimate.estimateNumber,
        "EST-000001"
    );

    setPreviewText(
        "previewHeaderIssueDate",
        formatPreviewDate(
            estimate.issueDate
        ),
        "-"
    );

    setPreviewText(
        "previewHeaderExpiryDate",
        formatPreviewDate(
            estimate.expiryDate
        ),
        "-"
    );

    setPreviewText(
        "previewEstimateNumber",
        estimate.estimateNumber,
        "EST-000001"
    );

    setPreviewText(
        "previewEstimateTitle",
        estimate.estimateTitle ||
        "ESTIMATE",
        "ESTIMATE"
    );

    setPreviewText(
        "estimatePreviewPurchaseOrder",
        estimate.purchaseOrder,
        "-"
    );

    setPreviewText(
        "estimatePreviewReference",
        estimate.referenceNumber,
        "-"
    );

    setPreviewText(
        "estimatePreviewProjectName",
        estimate.projectName,
        "-"
    );

    const statusElement =
        document.getElementById(
            "previewEstimateStatus"
        );

    if (statusElement) {

        const status =
            estimate.status || "Draft";

        statusElement.textContent =
            status;

        statusElement.className =
            `estimate-status ${status.toLowerCase()}`;

    }

    setPreviewText(
        "previewIssueDate",
        formatPreviewDate(
            estimate.issueDate
        ),
        "-"
    );

    setPreviewText(
        "previewExpiryDate",
        formatPreviewDate(
            estimate.expiryDate
        ),
        "-"
    );

    updateEstimateBusinessPreview();
    
    setPreviewText(
    "previewSalesRepresentative",
    selectedEstimateCompany?.salesRepresentative,
    "-"
);

    if (client) {

        setPreviewText(
            "previewClientName",
            client.contactPerson,
            "-"
        );

        setPreviewText(
            "previewClientCompany",
            client.companyName,
            "-"
        );

        setPreviewText(
    "previewClientAddress",
    [
        client.billingAddressLine1,
        client.billingAddressLine2,
        client.billingCityStateZip,
        client.billingCountry
    ]
    .filter(Boolean)
    .join("\n"),
    "-"
);

        setPreviewText(
            "previewClientEmail",
            client.clientEmail,
            "-"
        );

        setPreviewText(
            "previewClientPhone",
            client.clientPhone,
            "-"
        );
        
        const clientImage =
    document.getElementById(
        "estimatePreviewClientImage"
    );

if (clientImage) {

    if (client.clientImageUrl) {

        clientImage.src =
            client.clientImageUrl;

        clientImage.style.display =
            "block";

    } else {

        clientImage.removeAttribute(
            "src"
        );

        clientImage.style.display =
            "none";
            
            const clientImage =
    document.getElementById(
        "estimatePreviewClientImage"
    );

if (clientImage) {

    clientImage.removeAttribute(
        "src"
    );

    clientImage.style.display =
        "none";

}

    }

}

        setPreviewText(
            "estimatePreviewClientName",
            client.contactPerson,
            "-"
        );

        setPreviewText(
            "estimatePreviewCompany",
            client.companyName,
            "-"
        );

        setPreviewText(
            "estimatePreviewClientEmail",
            client.clientEmail,
            "-"
        );

        setPreviewText(
            "estimatePreviewClientPhone",
            client.clientPhone,
            "-"
        );

        setPreviewText(
    "estimatePreviewBillingAddressLine1",
    client.billingAddressLine1,
    "-"
);

setPreviewText(
    "estimatePreviewBillingAddressLine2",
    client.billingAddressLine2,
    "-"
);

setPreviewText(
    "estimatePreviewBillingCityStateZip",
    client.billingCityStateZip,
    "-"
);

setPreviewText(
    "estimatePreviewBillingCountry",
    client.billingCountry,
    "-"
);

        setPreviewText(
            "previewClientShipName",
            client.contactPerson,
            "-"
        );

        setPreviewText(
    "previewClientShipAddress",
    [
        client.billingAddressLine1,
        client.billingAddressLine2,
        client.billingCityStateZip,
        client.billingCountry
    ]
    .filter(Boolean)
    .join("\n"),
    "-"
);

    } else {

        setPreviewText(
            "previewClientName",
            "",
            "-"
        );

        setPreviewText(
            "previewClientCompany",
            "",
            "-"
        );

        setPreviewText(
    "previewClientAddress",
    [
        client.billingAddressLine1,
        client.billingAddressLine2,
        client.billingCityStateZip,
        client.billingCountry
    ]
    .filter(Boolean)
    .join("\n"),
    "-"
);

        setPreviewText(
            "previewClientEmail",
            "",
            "-"
        );

        setPreviewText(
            "previewClientPhone",
            "",
            "-"
        );

        setPreviewText(
            "estimatePreviewClientName",
            "",
            "-"
        );

        setPreviewText(
            "estimatePreviewCompany",
            "",
            "-"
        );

        setPreviewText(
            "estimatePreviewClientEmail",
            "",
            "-"
        );

        setPreviewText(
            "estimatePreviewClientPhone",
            "",
            "-"
        );

        setPreviewText(
            "estimatePreviewBillingAddress",
            "",
            "-"
        );

        setPreviewText(
            "previewClientShipName",
            "",
            "-"
        );

        setPreviewText(
    "previewClientShipAddress",
    [
        client.billingAddressLine1,
        client.billingAddressLine2,
        client.billingCityStateZip,
        client.billingCountry
    ]
    .filter(Boolean)
    .join("\n"),
    "-"
);

    }

    setEstimatePreviewItems(
        Array.isArray(
            selectedEstimateItems
        )
            ? selectedEstimateItems
            : []
    );

    updateEstimateSavedTotalsPreview(
        estimate
    );

    updateEstimatePaymentPreview();

    setPreviewText(
        "estimatePreviewNotes",
        estimate.notes,
        "No notes."
    );

    setPreviewText(
        "estimatePreviewTerms",
        estimate.terms,
        "No terms available."
    );

    setPreviewText(
        "estimatePreviewValidity",
        estimate.validityMessage,
        ""
    );

    setPreviewText(
        "estimatePreviewSignatureName",
        estimate.signatureName,
        ""
    );

    setPreviewText(
    "estimatePreviewSignatureTitle",
    estimate.signatureTitle
        ? ` (${estimate.signatureTitle})`
        : "",
    ""
);

    const signatureImage =
        document.getElementById(
            "estimatePreviewSignatureImage"
        );

    if (signatureImage) {

        if (estimate.signatureImage) {

            signatureImage.src =
                estimate.signatureImage;

            signatureImage.style.display =
                "block";

        } else {

            signatureImage.removeAttribute(
                "src"
            );

            signatureImage.style.display =
                "none";

        }

    }

}

function updateEstimateSavedTotalsPreview(estimate) {

    if (!estimate) {

        return;

    }

    setPreviewText(
        "previewSubtotal",
        formatEstimateMoney(
            estimate.subtotal || 0
        ),
        formatEstimateMoney(0)
    );

    setPreviewText(
        "previewTax",
        formatEstimateMoney(
            estimate.taxAmount || 0
        ),
        formatEstimateMoney(0)
    );

    setPreviewText(
        "previewDiscount",
        formatEstimateMoney(
            estimate.discount || 0
        ),
        formatEstimateMoney(0)
    );

    setPreviewText(
        "previewShipping",
        formatEstimateMoney(
            estimate.shipping || 0
        ),
        formatEstimateMoney(0)
    );

    setPreviewText(
        "previewGrandTotal",
        formatEstimateMoney(
            estimate.grandTotal || 0
        ),
        formatEstimateMoney(0)
    );

}

function updateEstimateSignaturePreview() {

    const signatureImage =
        document.getElementById(
            "estimatePreviewSignatureImage"
        );

    const signatureName =
        document.getElementById(
            "estimatePreviewSignatureName"
        );

    const signatureTitle =
        document.getElementById(
            "estimatePreviewSignatureTitle"
        );

    if (!signatureImage) {
        return;
    }

    const signatureUrl =
        selectedEstimate?.signatureImage ||
        "";

    if (signatureUrl) {

        signatureImage.src =
            signatureUrl;

        signatureImage.style.display =
            "block";

    } else {

        signatureImage.src =
            "";

        signatureImage.style.display =
            "none";

    }

    setPreviewText(
        "estimatePreviewSignatureName",
        selectedEstimate?.signatureName,
        ""
    );

    setPreviewText(
        "estimatePreviewSignatureTitle",
        selectedEstimate?.signatureTitle,
        ""
    );

}

