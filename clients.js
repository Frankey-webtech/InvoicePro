let currentPage = 1;

let totalPages = 1;

let editingClientId = null;

let currentSendInvoiceId = null;

let currentSendInvoiceData = null;

let isEditingClient = false;

let searchTimeout;

let clientToDelete = null;

const rowsPerPage = 10;

const clientSearchInput =
document.getElementById("clientSearchInput");

let selectedClientForEstimateSend = null;

let clientEstimatesForSending = [];

let selectedEstimateForSending = null;

const profileImage = 
document.getElementById("profileImage");

const DEFAULT_PROFILE_IMAGE = 
     "profile.png";
     
     
const sendEstimateClientImage =
document.getElementById(
    "sendEstimateClientImage"
);

const sendEstimateClientImageFallback =
document.getElementById(
    "sendEstimateClientImageFallback"
);

const sendInvoiceClientImage =
document.getElementById(
    "sendInvoiceClientImage"
);

const sendInvoiceClientImageFallback =
document.getElementById(
    "sendInvoiceClientImageFallback"
);

const clientImageInput =
document.getElementById("clientImageInput");

const clientImagePreview =
document.getElementById("clientImagePreview");

const viewClientImage =
document.getElementById("viewClientImage");

const viewClientImageFallback =
document.getElementById("viewClientImageFallback");

let selectedClientImage = null;
 
const viewClientInvoicesCount =
document.getElementById(
    "viewClientInvoicesCount"
);

const sendEstimateOverlay = document.getElementById("sendEstimateOverlay");

const sendEstimateModal = document.getElementById("sendEstimateModal");

const closeSendEstimateButton = document.getElementById("closeSendEstimateButton");

const cancelSendEstimateButton = document.getElementById("cancelSendEstimateButton");

const confirmSendEstimateButton = document.getElementById("confirmSendEstimateButton");

const sendEstimateClientName = document.getElementById("sendEstimateClientName");

const sendEstimateClientEmail = document.getElementById("sendEstimateClientEmail");

const sendEstimateSelect = document.getElementById("sendEstimateSelect");

const previousPageButton =
document.getElementById("previousPageButton");

const nextPageButton =
document.getElementById("nextPageButton");

const pageOneButton =
document.getElementById("pageOneButton");

const pageTwoButton =
document.getElementById("pageTwoButton");

const pageThreeButton =
document.getElementById("pageThreeButton");

const totalClients =
document.getElementById("totalClientsValue");

const activeClients =
document.getElementById("activeClientsValue");

const inactiveClients =
document.getElementById("inactiveClientsValue");

const outstandingBalance =
document.getElementById("outstandingBalanceValue");

const sortClients =
document.getElementById("sortClients");

const statusFilter =
document.getElementById("statusFilter");

const clientsTableBody =
document.getElementById("clientsTableBody");

const addClientButton =
document.getElementById("addClientButton");

const createClientOverlay =
document.getElementById("createClientOverlay");

const createClientModal =
document.getElementById("createClientModal");

const closeClientModalButton =
document.getElementById("closeClientModalButton");

const cancelClientButton =
document.getElementById("cancelClientButton");

const saveClientButton =
document.getElementById("saveClientButton");

const clientModalTitle =
document.getElementById("clientModalTitle");

const contactPersonInput =
document.getElementById("contactPersonInput");

const companyNameInput =
document.getElementById("companyNameInput");

const clientEmailInput =
document.getElementById("clientEmailInput");

const clientPhoneInput =
document.getElementById("clientPhoneInput");

const clientTaxIdInput =
document.getElementById("clientTaxIdInput");

const billingAddressInput =
document.getElementById("billingAddressInput");

const billingAddressLine2Input =
document.getElementById("billingAddressLine2Input");

const billingCityStateZipInput =
document.getElementById("billingCityStateZipInput");

const billingCountryInput =
document.getElementById("billingCountryInput");

const viewTotalEstimatesCount =
document.getElementById(
    "viewTotalEstimatesCount"
);

const clientStatusInput =
document.getElementById("clientStatusInput");

const viewClientOverlay =
document.getElementById("viewClientOverlay");

const viewClientModal =
document.getElementById("viewClientModal");

const closeViewClientButton =
document.getElementById("closeViewClientButton");

const closeViewClientFooterButton =
document.getElementById("closeViewClientFooterButton");

const editViewedClientButton =
document.getElementById("editViewedClientButton");

const viewContactPerson =
document.getElementById("viewContactPerson");

const viewCompanyName =
document.getElementById("viewCompanyName");

const viewClientEmail =
document.getElementById("viewClientEmail");

const viewClientPhone =
document.getElementById("viewClientPhone");

const viewClientTaxId =
document.getElementById("viewClientTaxId");

const viewBillingAddressLine1 =
    document.getElementById(
        "viewBillingAddressLine1"
    );

const viewBillingAddressLine2 =
    document.getElementById(
        "viewBillingAddressLine2"
    );

const viewBillingCityStateZip =
    document.getElementById(
        "viewBillingCityStateZip"
    );

const viewBillingCountry =
    document.getElementById(
        "viewBillingCountry"
    );

const viewClientStatus =
document.getElementById("viewClientStatus");

const viewTotalInvoices =
document.getElementById("viewTotalInvoices");

const viewPaidInvoices = 
document.getElementById("viewPaidInvoices");

const viewPendingInvoices =
document.getElementById("viewPendingInvoices");

const viewOverdueInvoices =
document.getElementById("viewOverdueInvoices");

const viewTotalRevenue =
document.getElementById("viewTotalRevenue");

const viewLastInvoiceDate =
document.getElementById("viewLastInvoiceDate");

const viewOutstandingBalance =
document.getElementById("viewOutstandingBalance");

const toastContainer =
document.getElementById("toastContainer");

const pageLoader =
document.getElementById("pageLoader");

const deleteClientOverlay =
document.getElementById("deleteClientOverlay");

const deleteClientModal =
document.getElementById("deleteClientModal");

const confirmDeleteClient =
document.getElementById("confirmDeleteClient");

const cancelDeleteClient =
document.getElementById("cancelDeleteClient");

const startRecord =
document.getElementById("startRecord");

const endRecord =
document.getElementById("endRecord");

const totalRecords =
document.getElementById("totalRecords");

const exportClientsButton =
document.getElementById("exportClientsButton");

const exportMenu =
document.getElementById("exportMenu");

const exportCsvButton =
document.getElementById("exportCsvButton");

const exportExcelButton =
document.getElementById("exportExcelButton");

const sendEstimateSummary = 
document.getElementById("sendEstimateSummary");

const sendEstimateNumber =
document.getElementById("sendEstimateNumber");

const sendEstimateTitle =
document.getElementById("sendEstimateTitle");

const sendEstimateAmount = 
document.getElementById("sendEstimateAmount");

const sendEstimateStatus =
document.getElementById("sendEstimateStatus");

const sendEstimateMessage = 
document.getElementById("sendEstimateMessage");

const exportPdfButton =
document.getElementById("exportPdfButton");

const notificationButton =
document.getElementById("notificationButton");

const notificationBadge =
document.getElementById("notificationBadge");

const sendInvoiceOverlay =
    document.getElementById("sendInvoiceOverlay");

const sendInvoiceModal =
    document.getElementById("sendInvoiceModal");

const closeSendInvoiceButton =
    document.getElementById("closeSendInvoiceButton");

const cancelSendInvoiceButton =
    document.getElementById("cancelSendInvoiceButton");

const confirmSendInvoiceButton =
    document.getElementById("confirmSendInvoiceButton");

const sendInvoiceClientName =
    document.getElementById("sendInvoiceClientName");

const sendInvoiceClientEmail =
    document.getElementById("sendInvoiceClientEmail");

const sendInvoiceNumber =
    document.getElementById("sendInvoiceNumber");

const sendInvoiceTitle =
    document.getElementById("sendInvoiceTitle");

const sendInvoiceIssueDate =
    document.getElementById("sendInvoiceIssueDate");

const sendInvoiceDueDate =
    document.getElementById("sendInvoiceDueDate");

const sendInvoicePaymentTerms =
    document.getElementById("sendInvoicePaymentTerms");

const sendInvoiceCurrency =
    document.getElementById("sendInvoiceCurrency");

const sendInvoicePaymentStatus =
    document.getElementById("sendInvoicePaymentStatus");

const sendInvoiceAmount =
    document.getElementById("sendInvoiceAmount");

const sendInvoiceItems =
    document.getElementById("sendInvoiceItems");

const sendInvoiceSubtotal =
    document.getElementById("sendInvoiceSubtotal");

const sendInvoiceTax =
    document.getElementById("sendInvoiceTax");

const sendInvoiceDiscount =
    document.getElementById("sendInvoiceDiscount");

const sendInvoiceShipping =
    document.getElementById("sendInvoiceShipping");

const sendInvoiceGrandTotal =
    document.getElementById("sendInvoiceGrandTotal");

const sendInvoicePaymentAccountName =
    document.getElementById(
        "sendInvoicePaymentAccountName"
    );

const sendInvoicePaymentBankName =
    document.getElementById(
        "sendInvoicePaymentBankName"
    );

const sendInvoicePaymentProvider =
    document.getElementById(
        "sendInvoicePaymentProvider"
    );

const sendInvoicePaymentMethod =
    document.getElementById(
        "sendInvoicePaymentMethod"
    );

const sendInvoicePaymentAccountNumber =
    document.getElementById(
        "sendInvoicePaymentAccountNumber"
    );

const sendInvoicePaymentReference =
    document.getElementById(
        "sendInvoicePaymentReference"
    );

const sendInvoicePaymentDueDays =
    document.getElementById(
        "sendInvoicePaymentDueDays"
    );

const sendInvoicePaymentInstructions =
    document.getElementById(
        "sendInvoicePaymentInstructions"
    );

const sendInvoiceNotes =
    document.getElementById(
        "sendInvoiceNotes"
    );

const sendInvoiceTerms =
    document.getElementById(
        "sendInvoiceTerms"
    );

const sendInvoiceSignatureName =
    document.getElementById(
        "sendInvoiceSignatureName"
    );

const sendInvoiceSignatureTitle =
    document.getElementById(
        "sendInvoiceSignatureTitle"
    );

const sendInvoiceSignatureImage =
    document.getElementById(
        "sendInvoiceSignatureImage"
    );

const sendInvoiceMessage =
    document.getElementById(
        "sendInvoiceMessage"
    );

function showLoader(){

    pageLoader.classList.add(
        "show"
    );

}

function hideLoader(){

    pageLoader.classList.remove(
        "show"
    );

}

function showToast(
message,
type="success"){

    const toast =
    document.createElement("div");

    toast.className =
    `toast ${type}`;

    toast.textContent =
    message;

    toastContainer.appendChild(
        toast
    );

    setTimeout(()=>{

        toast.remove();

    },3000);

}

function closeViewClientModal(){

    viewClientOverlay.classList.remove("show");

    viewClientModal.classList.remove("show");

}

function clearClientForm(){

    contactPersonInput.value = "";

    companyNameInput.value = "";

    clientEmailInput.value = "";

    clientPhoneInput.value = "";

    clientTaxIdInput.value = "";

    billingAddressInput.value = "";

billingAddressLine2Input.value = "";

billingCityStateZipInput.value = "";

billingCountryInput.value = "";

clientImageInput.value = "";

selectedClientImage = null;

resetClientImagePreview();

    clientStatusInput.value = "Active";

}

function openCreateClientModal(){

    editingClientId = null;

    isEditingClient = false;

    clearClientForm();

    clientModalTitle.textContent =
    "Add Client";

    saveClientButton.textContent =
    "Save Client";

    createClientOverlay.classList.add(
        "show"
    );

    createClientModal.classList.add(
        "show"
    );
    
    setTimeout(()=>{

    contactPersonInput.focus();

},100);

}

function closeCreateClientModal(){

    createClientOverlay.classList.remove(
        "show"
    );

    createClientModal.classList.remove(
        "show"
    );

}

function updatePagination(){

    previousPageButton.disabled =
    currentPage === 1;

    nextPageButton.disabled =
    currentPage >= totalPages;

    const pageButtons = [

        pageOneButton,

        pageTwoButton,

        pageThreeButton

    ];

    pageButtons.forEach(button=>{

        button.style.display = "none";

        button.classList.remove("active");

    });

    let startPage =
    Math.max(
        1,
        currentPage - 1
    );

    let endPage =
    Math.min(
        totalPages,
        startPage + 2
    );

    if(endPage - startPage < 2){

        startPage =
        Math.max(
            1,
            endPage - 2
        );

    }

    let index = 0;

    for(

        let page = startPage;

        page <= endPage;

        page++

    ){

        const button =
        pageButtons[index];

        button.style.display =
        "inline-flex";

        button.textContent =
        page;

        if(page === currentPage){

            button.classList.add(
                "active"
            );

        }

        index++;

    }

}

function getClientInitials(name){

    if(!name){

        return "?";

    }

    const words =
    name.trim().split(/\s+/);

    if(words.length === 1){

        return words[0]
        .charAt(0)
        .toUpperCase();

    }

    return (

        words[0].charAt(0) +

        words[words.length - 1].charAt(0)

    ).toUpperCase();

}

function closeDeleteClientModal(){

    deleteClientOverlay.classList.remove(
        "show"
    );

    deleteClientModal.classList.remove(
        "show"
    );

    clientToDelete = null;

}

function registerSendEstimateListeners() {
    
    if (sendEstimateSelect) {
        
        sendEstimateSelect.addEventListener(
            "change",
            handleSendEstimateSelection
        );
        
    }
    
    if (confirmSendEstimateButton) {
        
        confirmSendEstimateButton.addEventListener(
            "click",
            sendSelectedEstimate
        );
        
    }
    
    if (closeSendEstimateButton) {
        
        closeSendEstimateButton.addEventListener(
            "click",
            closeSendEstimateModal
        );
        
    }
    
    if (cancelSendEstimateButton) {
        
        cancelSendEstimateButton.addEventListener(
            "click",
            closeSendEstimateModal
        );
        
    }
    
    if (sendEstimateOverlay) {
        
        sendEstimateOverlay.addEventListener(
            "click",
            closeSendEstimateModal
        );
        
    }
    
}

function updateSelectedEstimateForSending() {
    
    if (!sendEstimateSelect) {
        
        return;
        
    }
    
    const estimateId =
        sendEstimateSelect.value;
    
    selectedEstimateForSending =
        clientEstimatesForSending.find(
            estimate =>
            estimate.objectId === estimateId
        );
    
    if (!selectedEstimateForSending) {
        
        clearSelectedEstimateForSending();
        
        return;
        
    }
    
    const estimate =
        selectedEstimateForSending;
    
    if (sendEstimateNumber) {
        
        sendEstimateNumber.textContent =
            estimate.estimateNumber || "-";
        
    }
    
    if (sendEstimateTitle) {
        
        sendEstimateTitle.textContent =
            estimate.title ||
            estimate.projectName ||
            "-";
        
    }
    
    if (sendEstimateAmount) {
        
        const currencySymbol =
            estimate.currencySymbol ||
            (
                typeof estimatePreviewState !== "undefined" &&
                estimatePreviewState.currencySymbol
            ) ||
            "$";
        
        sendEstimateAmount.textContent =
            currencySymbol +
            Number(
                estimate.grandTotal || 0
            ).toLocaleString(
                undefined,
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            );
        
    }
    
    if (sendEstimateStatus) {
        
        sendEstimateStatus.textContent =
            estimate.status ||
            "Draft";
        
    }
    
    if (sendEstimateSummary) {
        
        sendEstimateSummary.style.display =
            "block";
        
    }
    
}

function handleSendEstimateSelection() {
    
    updateSelectedEstimateForSending();
    
}

function clearSelectedEstimateForSending() {
    
    selectedEstimateForSending = null;
    
    
    if (sendEstimateNumber) {
        
        sendEstimateNumber.textContent =
            "-";
        
    }
    
    
    if (sendEstimateTitle) {
        
        sendEstimateTitle.textContent =
            "-";
        
    }
    
    
    if (sendEstimateAmount) {
        
        sendEstimateAmount.textContent =
            "-";
        
    }
    
    
    if (sendEstimateStatus) {
        
        sendEstimateStatus.textContent =
            "-";
        
    }
    
    
    if (sendEstimateSummary) {
        
        sendEstimateSummary.style.display =
            "none";
        
    }
    
}

function closeSendEstimateModal() {
    
    if (sendEstimateOverlay) {
        
        sendEstimateOverlay.classList.remove(
            "show"
        );
        
    }
    
    if (sendEstimateModal) {
        
        sendEstimateModal.classList.remove(
            "show"
        );
        
    }
    
    selectedClientForEstimateSend = null;
    
    clientEstimatesForSending = [];
    
    selectedEstimateForSending = null;
    
}

function renderClientEstimates(
    estimates,
    currencySymbol
) {

    const container =
        document.getElementById(
            "viewClientEstimatesList"
        );

    const totalElement =
        document.getElementById(
            "viewTotalEstimates"
        );

    if (!container) {
        return;
    }

    if (!Array.isArray(estimates)) {
        estimates = [];
    }

    if (totalElement) {

        totalElement.textContent =
            estimates.length;

    }

    if (estimates.length === 0) {

        container.innerHTML =
            '<div class="client-empty-estimates">' +

                '<i class="ri-file-list-3-line"></i>' +

                '<p>' +
                    'No estimates for this client.' +
                '</p>' +

            '</div>';

        return;
    }

    container.innerHTML =
        estimates.map(
            function (estimate) {

                const amount =
                    Number(
                        estimate.grandTotal || 0
                    ).toLocaleString(
                        undefined,
                        {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        }
                    );

                const status =
                    estimate.status ||
                    "Draft";

                const sent =
                    !!estimate.sentAt;

                let sendArea = "";

                if (sent) {

                    sendArea =
                        '<span class="estimate-sent-label">' +
                            'Sent' +
                        '</span>';

                } else {

                    sendArea =
                        '<button ' +
                            'type="button" ' +
                            'class="send-client-estimate-button" ' +
                            'data-id="' +
                                (estimate.objectId || "") +
                            '">' +

                            '<i class="ri-send-plane-line"></i>' +

                            'Send Estimate' +

                        '</button>';

                }

                return (

                    '<div ' +
                        'class="client-estimate-card" ' +
                        'data-id="' +
                            (estimate.objectId || "") +
                        '">' +

                        '<div class="client-estimate-info">' +

                            '<strong>' +
                                (
                                    estimate.estimateNumber ||
                                    "-"
                                ) +
                            '</strong>' +

                            '<span>' +
                                (
                                    estimate.title ||
                                    estimate.projectName ||
                                    "Estimate"
                                ) +
                            '</span>' +

                        '</div>' +

                        '<div class="client-estimate-amount">' +

                            (currencySymbol || "") +
                            amount +

                        '</div>' +

                        '<span ' +
                            'class="status-badge ' +
                                status
                                    .toLowerCase()
                                    .replace(/\s+/g, "-") +
                            '">' +

                            status +

                        '</span>' +

                        sendArea +

                    '</div>'

                );

            }
        ).join("");

    const sendButtons =
        container.querySelectorAll(
            ".send-client-estimate-button"
        );

    sendButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const estimateId =
                        button.dataset.id;

                    if (!estimateId) {
                        return;
                    }

                    openSendEstimateModal(
                        estimateId
                    );

                }
            );

        }
    );

}

function renderClientInvoices(
    invoices,
    currencySymbol
) {

    const container =
        document.getElementById(
            "viewClientInvoicesList"
        );

    const totalElement =
        document.getElementById(
            "viewClientInvoicesCount"
        );

    if (!container) {
        return;
    }

    if (!Array.isArray(invoices)) {
        invoices = [];
    }

    if (totalElement) {

        totalElement.textContent =
            invoices.length;

    }

    if (invoices.length === 0) {

        container.innerHTML =
            '<div class="client-empty-invoices">' +

                '<i class="ri-file-text-line"></i>' +

                '<p>' +
                    'No invoices for this client.' +
                '</p>' +

            '</div>';

        return;
    }

    container.innerHTML =
        invoices.map(
            function (invoice) {

                const amount =
                    Number(
                        invoice.totalAmount || 0
                    ).toLocaleString(
                        undefined,
                        {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        }
                    );

                const status =
                    invoice.status ||
                    "Draft";

                return (

                    '<div ' +
                        'class="client-invoice-card" ' +
                        'data-id="' +
                            (invoice.objectId || "") +
                        '">' +

                        '<div class="client-invoice-info">' +

                            '<strong>' +
                                (
                                    invoice.invoiceNumber ||
                                    "-"
                                ) +
                            '</strong>' +

                            '<span>' +
                                (
                                    invoice.invoiceTitle ||
                                    invoice.projectName ||
                                    "Invoice"
                                ) +
                            '</span>' +

                        '</div>' +

                        '<div class="client-invoice-amount">' +

                            (currencySymbol || "") +
                            amount +

                        '</div>' +

                       '<span ' +
    'class="status-badge ' +
        status
            .toLowerCase()
            .replace(/\s+/g, "-") +
    '">' +

    status +

'</span>' +

(
    invoice.sentAt
        ? '<span class="invoice-sent-label">Sent</span>'
        : '<button ' +
            'type="button" ' +
            'class="send-client-invoice-button" ' +
            'data-id="' +
                (invoice.objectId || "") +
            '">' +

            '<i class="ri-send-plane-line"></i>' +

            'Send Invoice' +

          '</button>'
) +

'</div>'

                );

            }
        ).join("");

}

function setClientImagePreview(url){

    if(!url){

        resetClientImagePreview();

        return;

    }

    clientImagePreview.innerHTML = `

        <img
        src="${url}"
        alt="Client Image">

    `;

}

function resetClientImagePreview(){

    clientImagePreview.innerHTML = `

        <i class="ri-user-line"></i>

    `;

}

function registerSendEstimateListeners() {
    
    if (sendEstimateSelect) {
        
        sendEstimateSelect.addEventListener(
            "change",
            handleSendEstimateSelection
        );
        
    }
    
    if (confirmSendEstimateButton) {
        
        confirmSendEstimateButton.addEventListener(
            "click",
            sendSelectedEstimate
        );
        
    }
    
    if (closeSendEstimateButton) {
        
        closeSendEstimateButton.addEventListener(
            "click",
            closeSendEstimateModal
        );
        
    }
    
    if (cancelSendEstimateButton) {
        
        cancelSendEstimateButton.addEventListener(
            "click",
            closeSendEstimateModal
        );
        
    }
    
    if (sendEstimateOverlay) {
        
        sendEstimateOverlay.addEventListener(
            "click",
            closeSendEstimateModal
        );
        
    }
    
}

async function openSendEstimateModal(estimateId) {
    
    try {
        
        showLoader();
        
        const result =
            await Parse.Cloud.run(
                "getEstimateDetails",
                {
                    estimateId: estimateId
                }
            );
        
        if (
            !result ||
            !result.estimate
        ) {
            
            throw new Error(
                "Unable to load estimate."
            );
            
        }
        
        const estimate =
            result.estimate;
        
        const client =
            result.client;
        
        if (!client) {
            
            throw new Error(
                "Client information is missing."
            );
            
        }
        
        if (!client.clientEmail) {
            
            throw new Error(
                "This client does not have an email address."
            );
            
        }
        
        selectedClientForEstimateSend =
            client;
        
        const clientResult =
            await Parse.Cloud.run(
                "getClientDetails",
                {
                    clientId: client.objectId
                }
            );
        
        if (
            !clientResult ||
            !clientResult.client
        ) {
            
            throw new Error(
                "Unable to load client estimates."
            );
            
        }
        
        const allEstimates =
            clientResult.client.estimates || [];
        
        clientEstimatesForSending =
            allEstimates.filter(
                item => !item.sentAt
            );
        
        if (
            clientEstimatesForSending.length === 0
        ) {
            
            throw new Error(
                "There are no unsent estimates available for this client."
            );
            
        }
        
        if (sendEstimateClientName) {
            
            sendEstimateClientName.textContent =
                client.contactPerson ||
                client.companyName ||
                "Client";
            
        }
        
        if (sendEstimateClientImage) {

    if (client.clientImageUrl) {

        sendEstimateClientImage.src =
            client.clientImageUrl;

        sendEstimateClientImage.style.display =
            "block";

        if (sendEstimateClientImageFallback) {

            sendEstimateClientImageFallback.style.display =
                "none";

        }

    } else {

        sendEstimateClientImage.removeAttribute(
            "src"
        );

        sendEstimateClientImage.style.display =
            "none";

        if (sendEstimateClientImageFallback) {

            sendEstimateClientImageFallback.style.display =
                "block";

        }

    }

}
        
        if (sendEstimateClientEmail) {
            
            sendEstimateClientEmail.textContent =
                client.clientEmail;
            
        }
        
        if (sendEstimateSelect) {
            
            sendEstimateSelect.innerHTML = `
                <option value="">
                    Select an estimate
                </option>
            `;
            
            clientEstimatesForSending.forEach(
                item => {
                    
                    const option =
                        document.createElement(
                            "option"
                        );
                    
                    option.value =
                        item.objectId;
                    
                    option.textContent =
                        `${item.estimateNumber || "Estimate"} — ${
                            item.title ||
                            item.projectName ||
                            "Untitled Estimate"
                        }`;
                    
                    sendEstimateSelect.appendChild(
                        option
                    );
                    
                }
            );
            
            const matchingEstimate =
                clientEstimatesForSending.find(
                    item =>
                    item.objectId === estimateId
                );
            
            if (matchingEstimate) {
                
                sendEstimateSelect.value =
                    estimateId;
                
                updateSelectedEstimateForSending();
                
            }
            else {
                
                clearSelectedEstimateForSending();
                
            }
            
        }
        
        /*if (sendEstimateMessage) {
            
            sendEstimateMessage.value =
                `Hello ${
                    client.contactPerson ||
                    client.companyName ||
                    "there"
                },

Thank you.`;
            
        }*/
        
        if (sendEstimateOverlay) {
            
            sendEstimateOverlay.classList.add(
                "show"
            );
            
        }
        
        if (sendEstimateModal) {
            
            sendEstimateModal.classList.add(
                "show"
            );
            
        }
        
    }
    catch (error) {
        
        console.error(
            "Open Send Estimate Error:",
            error
        );
        
        showToast(
            error.message ||
            "Unable to prepare estimate for sending.",
            "error"
        );
        
    }
    finally {
        
        hideLoader();
        
    }
    
}

async function sendSelectedEstimate() {
    
    if (!selectedClientForEstimateSend) {
        
        showToast(
            "Client information is missing.",
            "error"
        );
        
        return;
        
    }
    
    if (!selectedEstimateForSending) {
        
        showToast(
            "Please select an estimate.",
            "error"
        );
        
        return;
        
    }
    
    if (!selectedClientForEstimateSend.clientEmail) {
        
        showToast(
            "This client does not have an email address.",
            "error"
        );
        
        return;
        
    }
    
    const estimateId =
        selectedEstimateForSending.objectId;
    
    const message =
        sendEstimateMessage ?
        sendEstimateMessage.value.trim() :
        "";
    
    try {
        
        showLoader();
        
        if (confirmSendEstimateButton) {
            
            confirmSendEstimateButton.addEventListener(
                "click",
                confirmSendEstimate
            );
            
            confirmSendEstimateButton.disabled =
                true;
            
            confirmSendEstimateButton.textContent =
                "Sending...";
            
        }
        
        const result =
            await Parse.Cloud.run(
                "sendEstimateToClient",
                {
                    estimateId: estimateId,
                    message: message
                }
            );
        
        if (
            !result ||
            result.success !== true
        ) {
            
            throw new Error(
                result?.message ||
                "Unable to send estimate."
            );
            
        }
        
        showToast(
            result.message ||
            "Estimate sent successfully.",
            "success"
        );
        
        closeSendEstimateModal();
        
        if (selectedClientForEstimateSend?.objectId) {
            
            await openViewClientModal(
                selectedClientForEstimateSend.objectId
            );
            
        }
        
    }
    catch (error) {
        
        console.error(
            "Send Estimate Error:",
            error
        );
        
        showToast(
            error.message ||
            "Unable to send estimate.",
            "error"
        );
        
    }
    finally {
        
        hideLoader();
        
        if (confirmSendEstimateButton) {
            
            confirmSendEstimateButton.disabled =
                false;
            
            confirmSendEstimateButton.innerHTML = `
                <i class="ri-send-plane-line"></i>
                Send Estimate
            `;
            
        }
        
    }
    
}

async function confirmSendEstimate() {
    
    if (!selectedEstimateForSending) {
        
        showToast(
            "Please select an estimate to send.",
            "error"
        );
        
        return;
        
    }
    
    const estimateId =
        selectedEstimateForSending.objectId;
    
    if (!estimateId) {
        
        showToast(
            "Estimate ID is missing.",
            "error"
        );
        
        return;
        
    }
    
    const clientId =
        selectedClientForEstimateSend ?
        selectedClientForEstimateSend.objectId :
        null;
    
    if (!clientId) {
        
        showToast(
            "Client information is missing.",
            "error"
        );
        
        return;
        
    }
    
    const message =
        sendEstimateMessage ?
        sendEstimateMessage.value.trim() :
        "";
    
    try {
        
        if (confirmSendEstimateButton) {
            
            confirmSendEstimateButton.disabled =
                true;
            
            confirmSendEstimateButton.innerHTML =
                `
                    <i class="ri-loader-4-line ri-spin"></i>
                    Sending...
                `;
            
        }
        
        showLoader();
        
        const result =
            await Parse.Cloud.run(
                "sendEstimateToClient",
                {
                    
                    estimateId: estimateId,
                    
                    message: message
                    
                }
            );
        
        if (
            !result ||
            !result.success
        ) {
            
            throw new Error(
                result?.message ||
                "Unable to send estimate."
            );
            
        }
        
        showToast(
            result.message ||
            "Estimate sent successfully.",
            "success"
        );
        
        closeSendEstimateModal();
        
        await openViewClientModal(
            clientId
        );
        
    }
    
    catch (error) {
        
        console.error(
            "Confirm Send Estimate Error:",
            error
        );
        
        showToast(
            error.message ||
            "Unable to send estimate.",
            "error"
        );
        
    }
    
    finally {
        
        hideLoader();

        if (confirmSendEstimateButton) {
            
            confirmSendEstimateButton.disabled =
                false;
            
            confirmSendEstimateButton.innerHTML =
                `
                    <i class="ri-send-plane-line"></i>
                    Send Estimate
                `;
            
        }
        
    }
    
}

async function openViewClientModal(clientId){

    try{

        showLoader();

        

        const result =
            await Parse.Cloud.run(
                "getClientDetails",
                {
                    clientId: clientId
                }
            );

        console.log(
            "getClientDetails result:",
            result
        );

        if(!result){

            throw new Error(
                "No response received from getClientDetails."
            );

        }

        if(!result.client){

            throw new Error(
                "Client data is missing from getClientDetails response."
            );

        }

        const client =
            result.client;
            
            if(client.clientImageUrl){

    viewClientImage.src =
    client.clientImageUrl;

    viewClientImage.style.display =
    "block";

    viewClientImageFallback.style.display =
    "none";

}else{

    viewClientImage.removeAttribute(
        "src"
    );

    viewClientImage.style.display =
    "none";

    viewClientImageFallback.style.display =
    "flex";

}

        console.log(
            "Client:",
            client
        );

        viewContactPerson.textContent =
            client.contactPerson || "-";

        viewCompanyName.textContent =
            client.companyName || "-";

        viewClientEmail.textContent =
            client.clientEmail || "-";

        viewClientPhone.textContent =
            client.clientPhone || "-";

        viewClientTaxId.textContent =
            client.clientTaxId || "-";

viewBillingAddressLine1.textContent =
    client.billingAddressLine1 || "-";

viewBillingAddressLine2.textContent =
    client.billingAddressLine2 || "-";

viewBillingCityStateZip.textContent =
    client.billingCityStateZip || "-";

viewBillingCountry.textContent =
    client.billingCountry || "-";

        viewClientStatus.textContent =
            client.status || "-";

        viewTotalInvoices.textContent =
            client.totalInvoices ?? 0;
            
        viewTotalEstimatesCount.textContent =
    (client.estimates || []).length;

        viewPaidInvoices.textContent =
            client.paidInvoices ?? 0;

        viewPendingInvoices.textContent =
            client.pendingInvoices ?? 0;

        viewOverdueInvoices.textContent =
            client.overdueInvoices ?? 0;

        viewTotalRevenue.textContent =
            (result.currencySymbol || "") +
            Number(
                client.totalRevenue || 0
            ).toLocaleString();

        viewLastInvoiceDate.textContent =
            client.lastInvoiceDate
                ? new Date(
                    client.lastInvoiceDate
                  ).toLocaleDateString()
                : "-";

        viewOutstandingBalance.textContent =
            (result.currencySymbol || "") +
            Number(
                client.outstandingBalance || 0
            ).toLocaleString();

        editViewedClientButton.dataset.id =
            client.objectId;
            
            renderClientEstimates(
client.estimates || [],
result.currencySymbol || ""
);

            renderClientInvoices(
                client.invoices || [],
                result.currencySymbol || ""
            );

        viewClientOverlay.classList.add(
            "show"
        );

        viewClientModal.classList.add(
            "show"
        );

    }

    catch(error){

        console.error(
            "View Client Error:",
            error
        );

        showToast(
            error.message ||
            "Unable to load client details.",
            "error"
        );

    }

    finally{

        hideLoader();

    }

}

async function openEditClientModal(clientId){

    try{

        const result =
        await Parse.Cloud.run(
        "getClientDetails",
        {

            clientId

        });

        const client =
        result.client;
        
        selectedClientImage = null;

clientImageInput.value = "";

setClientImagePreview(
    client.clientImageUrl || ""
);

        editingClientId =
        client.objectId;

        isEditingClient = true;

        contactPersonInput.value =
        client.contactPerson || "";

        companyNameInput.value =
        client.companyName || "";

        clientEmailInput.value =
        client.clientEmail || "";

        clientPhoneInput.value =
        client.clientPhone || "";

        clientTaxIdInput.value =
        client.clientTaxId || "";

        billingAddressInput.value =
client.billingAddressLine1 || "";

billingAddressLine2Input.value =
client.billingAddressLine2 || "";

billingCityStateZipInput.value =
client.billingCityStateZip || "";

billingCountryInput.value =
client.billingCountry || "";

        clientStatusInput.value =
        client.status || "Active";

        clientModalTitle.textContent =
        "Edit Client";

        saveClientButton.textContent =
        "Update Client";

        createClientOverlay.classList.add(
            "show"
        );

        createClientModal.classList.add(
            "show"
        );
        
        setTimeout(()=>{

    contactPersonInput.focus();

},100);

    }

    catch(error){

        showToast(
    error.message,
    "error"
);

    }

}

async function exportClients(){

    exportClientsButton.disabled = true;

    exportClientsButton.textContent =
    "Exporting...";

    try{
        
        showLoader();

        const result =
        await Parse.Cloud.run(
        "getClients",
        {

            search:
            clientSearchInput.value.trim(),

            status:
            statusFilter.value || "all",

            sort:
            sortClients.value,

            page: 1,

            limit: 100000

        });

        if(result.clients.length === 0){

            showToast("No clients to export.");

            return;

        }

        let csv =
"Contact Person,Company,Email,Phone,Invoices,Outstanding,Status\n";

        result.clients.forEach(client=>{

            csv += `"${client.contactPerson || ""}",`;

            csv += `"${client.companyName || ""}",`;

            csv += `"${client.clientEmail || ""}",`;

            csv += `"${client.clientPhone || ""}",`;

            csv += `"${client.totalInvoices}",`;

            csv += `"${client.outstandingBalance}",`;

            csv += `"${client.status}"\n`;

        });

        const blob =
        new Blob(
        [csv],
        {

            type:
            "text/csv"

        });

        const url =
        URL.createObjectURL(blob);

        const link =
        document.createElement("a");

        link.href = url;

        link.download =
        "clients.csv";

        document.body.appendChild(
            link
        );

        link.click();

        document.body.removeChild(
            link
        );

        URL.revokeObjectURL(url);
        
        exportMenu.classList.remove(
    "show"
);

    }

    catch(error){
        
        showLoader();

        showToast(
    error.message,
    "error"
);

    }

    finally{
        
        hideLoader();

        exportClientsButton.disabled =
        false;

        exportClientsButton.textContent =
        "Export";

    }

}

async function exportClientsToExcel(){

    try{
        
        showLoader();

        exportExcelButton.disabled = true;

        exportExcelButton.textContent =
        "Exporting...";

        const result =
        await Parse.Cloud.run(
        "getClients",
        {

            page: 1,

            limit: 100000,

            search:
            clientSearchInput.value.trim(),

            status:
            statusFilter.value || "all",

            sort:
            sortClients.value

        });

        const data = [];

        result.clients.forEach(client=>{

            data.push({

                "Contact Person":
                client.contactPerson,

                "Company":
                client.companyName,

                "Email":
                client.clientEmail,

                "Phone":
                client.clientPhone,

                "Invoices":
                client.totalInvoices,

                "Outstanding":
                client.outstandingBalance,

                "Status":
                client.status

            });

        });

        const worksheet =
        XLSX.utils.json_to_sheet(
            data
        );

        const workbook =
        XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(

            workbook,

            worksheet,

            "Clients"

        );

        XLSX.writeFile(

            workbook,

            "InvoicePro Clients.xlsx"

        );
        
        exportMenu.classList.remove("show");

    }

    catch(error){
        
        showLoader();

        showToast(
    error.message,
    "error"
);

    }

    finally{
        
        hideLoader();

        exportExcelButton.disabled =
        false;

        exportExcelButton.textContent =
        "Export Excel";

    }

}

async function exportClientsToPDF(){

    try{
        
        showLoader();

        exportPdfButton.disabled = true;

        exportPdfButton.textContent =
        "Exporting...";

        const result =
        await Parse.Cloud.run(
            "getClients",
            {

                page:1,

                limit:100000,

                search:
                clientSearchInput.value.trim(),

                status:
                statusFilter.value || "all",

                sort:
                sortClients.value

            }
        );

        const { jsPDF } = window.jspdf;

        const doc =
        new jsPDF();

        doc.setFontSize(20);

        doc.text(
            "InvoicePro Clients",
            14,
            18
        );

        doc.setFontSize(10);

        doc.text(

            "Generated: " +

            new Date().toLocaleString(),

            14,

            26

        );

        const rows = [];

        result.clients.forEach(client=>{

            rows.push([

                client.contactPerson,

                client.companyName || "-",

                client.clientEmail || "-",

                client.clientPhone || "-",

                client.totalInvoices,

                result.currencySymbol +

                Number(

                    client.outstandingBalance

                ).toLocaleString(),

                client.status

            ]);

        });

        doc.autoTable({

            startY:35,

            head:[[
                "Contact",
                "Company",
                "Email",
                "Phone",
                "Invoices",
                "Outstanding",
                "Status"
            ]],

            body:rows,

            styles:{

                fontSize:9

            },

            headStyles:{

                fillColor:[37,99,235]

            }

        });

        doc.save(
            "InvoicePro Clients.pdf"
        );

        exportMenu.classList.remove(
            "show"
        );

    }

    catch(error){
        
        showLoader();

        showToast(
    error.message,
    "error"
);

    }

    finally{
        
        hideLoader();

        exportPdfButton.disabled =
        false;

        exportPdfButton.textContent =
        "Export PDF";

    }

}

async function loadClients(){

    try{

        const result =
        await Parse.Cloud.run(
        "getClients",
        {

            search:
            clientSearchInput.value.trim(),

            status:
            statusFilter.value || "all",

            sort:
            sortClients.value,

            page:
            currentPage,

            limit:
            rowsPerPage

        });

        clientsTableBody.innerHTML = "";
        
        if(result.clients.length === 0){

    clientsTableBody.innerHTML = `

<tr>

<td colspan="7">

<div class="empty-state">

<i class="ri-user-search-line empty-state-icon"></i>

    <h3>
        No Clients Yet
    </h3>

    <p>
        You haven't added any clients yet.
        Start by creating your first client.
    </p>

    <button
    class="empty-state-btn"
    id="emptyStateAddClientButton">

        + Add Client

    </button>

</div>

</td>

</tr>

`;

    document
    .getElementById(
        "emptyStateAddClientButton"
    )
    .addEventListener(
        "click",
        openCreateClientModal
    );

} else {

    result.clients.forEach(client => {

        clientsTableBody.innerHTML += `

<tr>

<td>

<div class="client-info">

<div
    class="client-avatar"
    data-initial="${(
        client.contactPerson ||
        "C"
    ).charAt(0).toUpperCase()}"
>

    ${
        client.clientImageUrl
        ?
        `
        <img
        src="${client.clientImageUrl}"
        alt="${client.contactPerson || "Client"}">
        `
        :
        getClientInitials(
            client.contactPerson
        )
    }

</div>

    <div class="client-name-wrapper">

        <h4>
            ${client.contactPerson || "-"}
        </h4>

        <span>
            ${client.companyName || "-"}
        </span>

    </div>

</div>

</td>

<td>
${client.clientEmail || "-"}
</td>

<td>
${client.clientPhone || "-"}
</td>

<td>
${client.totalEstimates || 0}
</td>

<td>
${client.totalInvoices || 0}
</td>

<td>
${result.currencySymbol}${Number(
    client.outstandingBalance
).toLocaleString()}
</td>

<td>

<span class="status-badge ${client.status.toLowerCase()}">
${client.status}
</span>

</td>

<td>

<button
class="action-btn view-client-btn"
data-id="${client.objectId}">
    <i class="ri-eye-line"></i>
</button>

<button
class="action-btn edit-client-btn"
data-id="${client.objectId}">
    <i class="ri-edit-line"></i>
</button>

<button
class="action-btn delete-client-btn"
data-id="${client.objectId}">
    <i class="ri-delete-bin-line"></i>
</button>

</td>

</tr>

`;

    });

}

        totalRecords.textContent =
        result.totalRecords;
        
        totalPages = result.totalPages || 1;
        updatePagination();

        startRecord.textContent =
        result.totalRecords === 0
        ? 0
        : ((currentPage - 1) *
        rowsPerPage) + 1;

        endRecord.textContent =
        Math.min(
            currentPage *
            rowsPerPage,
            result.totalRecords
        );
        
document
.querySelectorAll(".edit-client-btn")
.forEach(button=>{

    
button.addEventListener(
        "click",
        ()=>{

            openEditClientModal(

                button.dataset.id

            );

        }
    );
});

document
.querySelectorAll(".delete-client-btn")
.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            clientToDelete =
                button.dataset.id;

            deleteClientOverlay.classList.add(
                "show"
            );

            deleteClientModal.classList.add(
                "show"
            );

        }
    );

});



           

document
.querySelectorAll(".view-client-btn")
.forEach(button=>{

    button.addEventListener(
    "click",
    ()=>{

        openViewClientModal(

            button.dataset.id

        );

    });

});

await loadClientStatistics();

    }

    catch(error){

        showToast(
    error.message,
    "error"
);

    }

}

async function loadClientStatistics(){

    try{

        const result =
        await Parse.Cloud.run(
            "getClientStatistics"
        );

        totalClients.textContent =
        result.totalClients;

        activeClients.textContent =
        result.activeClients;

        inactiveClients.textContent =
        result.inactiveClients;

        outstandingBalance.textContent =

        result.currencySymbol +

        Number(
            result.outstandingBalance
        ).toLocaleString();

    }

    catch(error){

        console.error(error);

    }

}

async function loadNotificationCount() {

    try {

        const result =
        await Parse.Cloud.run(
            "getNotificationCount"
        );

        if (result.unreadCount > 0) {

            notificationBadge.style.display =
                "flex";

            notificationBadge.textContent =
                result.unreadCount;

        }

        else {

            notificationBadge.style.display =
                "none";

        }

    }

    catch (error) {

        console.error(
            "Notification Error:",
            error
        );

        showToast(
            error.message ||
            "Unable to load notifications.",
            "error"
        );

    }

}

async function loadUserProfile() {

    try {

        const response = await Parse.Cloud.run(
            "getUserProfile"
        );

        if (!response.success) {

            throw new Error(
                "Unable to load profile."
            );

        }

        const profile = response.profile;

        let imageURL = DEFAULT_PROFILE_IMAGE;

        if (profile.profileImage) {

            if (typeof profile.profileImage === "string") {

                imageURL = profile.profileImage;

            } else if (profile.profileImage.url) {

                imageURL = profile.profileImage.url();

            }

        }

        profileImage.src = imageURL;
    }

    catch (error) {

        console.error(error);

        showToast(
            error.message || error, "error"
        );

    }

}

if (sendEstimateSelect) {
    
    sendEstimateSelect.addEventListener(
        "change",
        updateSelectedEstimateForSending
    );
    
}

exportClientsButton.addEventListener(
"click",
()=>{

    exportMenu.classList.toggle(
        "show"
    );

});

exportExcelButton.addEventListener(
"click",
exportClientsToExcel
);

exportPdfButton.addEventListener(
    "click",
    exportClientsToPDF
);

addClientButton.addEventListener(
    "click",
    openCreateClientModal
);

cancelDeleteClient.addEventListener(
"click",
closeDeleteClientModal
);

deleteClientOverlay.addEventListener(
"click",
closeDeleteClientModal
);

closeClientModalButton.addEventListener(
    "click",
    closeCreateClientModal
);

cancelClientButton.addEventListener(
    "click",
    closeCreateClientModal
);

createClientOverlay.addEventListener(
    "click",
    closeCreateClientModal
);

clientSearchInput.addEventListener(
"input",
()=>{

    clearTimeout(searchTimeout);

    searchTimeout =
    setTimeout(()=>{

        currentPage = 1;

        loadClients();

    },300);

});

statusFilter.addEventListener(
"change",
()=>{

    currentPage = 1;

    loadClients();

});

sortClients.addEventListener(
"change",
()=>{

    currentPage = 1;

    loadClients();

});

saveClientButton.addEventListener(
"click",
async()=>{

    const contactPerson =
    contactPersonInput.value.trim();

    const companyName =
    companyNameInput.value.trim();

    const clientEmail =
    clientEmailInput.value.trim();

    const clientPhone =
    clientPhoneInput.value.trim();

    const clientTaxId =
    clientTaxIdInput.value.trim();

    const billingAddressLine1 =
billingAddressInput.value.trim();

const billingAddressLine2 =
billingAddressLine2Input.value.trim();

const billingCityStateZip =
billingCityStateZipInput.value.trim();

const billingCountry =
billingCountryInput.value.trim();

    const status =
    clientStatusInput.value;

    if(!contactPerson){

        showToast(
        "Please enter the contact person."
        );

        contactPersonInput.focus();

        return;

    }
    
    if(clientEmail){

    const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailPattern.test(clientEmail)){

        showToast(
            "Please enter a valid email address.",
            "error"
        );

        clientEmailInput.focus();

        return;

    }

}
    
    if(clientPhone){

    const phonePattern =
    /^[0-9+\-\s()]{7,20}$/;

    if(!phonePattern.test(clientPhone)){

        showToast(
            "Please enter a valid phone number.",
            "error"
        );

        clientPhoneInput.focus();

        return;

    }

}
    
    if(contactPerson.length > 100){

    showToast(
        "Contact person name is too long.",
        "error"
    );

    contactPersonInput.focus();

    return;

}
    
    if(companyName.length > 120){

    showToast(
        "Company name is too long.",
        "error"
    );

    companyNameInput.focus();

    return;

}
    
    if(billingAddressLine1.length > 200){

    showToast(
        "Address Line 1 is too long.",
        "error"
    );

    billingAddressInput.focus();

    return;

}

if(billingAddressLine2.length > 200){

    showToast(
        "Address Line 2 is too long.",
        "error"
    );

    billingAddressLine2Input.focus();

    return;

}

if(billingCityStateZip.length > 200){

    showToast(
        "City, State / ZIP is too long.",
        "error"
    );

    billingCityStateZipInput.focus();

    return;

}

if(billingCountry.length > 100){

    showToast(
        "Country name is too long.",
        "error"
    );

    billingCountryInput.focus();

    return;

}
    
console.log("LINE 1:", billingAddressLine1);
console.log("LINE 2:", billingAddressLine2);
console.log("CITY STATE ZIP:", billingCityStateZip);
console.log("COUNTRY:", billingCountry);
    saveClientButton.disabled = true;

    saveClientButton.textContent =
    "Saving...";
    

    try{
        
        showLoader();
        
        let clientImage = null;

if(selectedClientImage){

    clientImage =
    new Parse.File(
        selectedClientImage.name,
        selectedClientImage
    );

    await clientImage.save();

}

        const result =
await Parse.Cloud.run(

    isEditingClient ?

    "updateClient"

    :

    "createClient",

    {

        clientId:
        editingClientId,

        contactPerson,

        companyName,

        clientEmail,

        clientPhone,

        clientTaxId,

        billingAddressLine1,

billingAddressLine2,

billingCityStateZip,

billingCountry,

clientImage,

status

    }

);

        showToast(
    result.message,
    "success"
);

        closeCreateClientModal();

       await loadClients();

    }

    catch(error){
        
        showLoader();

        showToast(
    error.message,
    "error"
);
    }

    finally{
        
        hideLoader();

        saveClientButton.disabled =
        false;

        saveClientButton.textContent =
isEditingClient
? "Update Client"
: "Save Client";

    }

});

previousPageButton.addEventListener(
"click",
()=>{

    if(currentPage > 1){

        currentPage--;

        loadClients();

    }

});

nextPageButton.addEventListener(
"click",
()=>{

    if(currentPage < totalPages){

        currentPage++;

        loadClients();

    }

});

closeViewClientButton.addEventListener(
"click",
closeViewClientModal
);

closeViewClientFooterButton.addEventListener(
"click",
closeViewClientModal
);

viewClientOverlay.addEventListener(
"click",
closeViewClientModal
);

editViewedClientButton.addEventListener(
"click",
()=>{

    closeViewClientModal();

    openEditClientModal(

        editViewedClientButton.dataset.id

    );

});

confirmDeleteClient.addEventListener(
    "click",
    async () => {

        if (!clientToDelete) {
            return;
        }

        confirmDeleteClient.disabled = true;

        try {

            showLoader();

            const result =
                await Parse.Cloud.run(
                    "deleteClient",
                    {
                        clientId:
                            clientToDelete
                    }
                );

            showToast(
                result.message,
                "success"
            );

            closeDeleteClientModal();

            await loadClients();

        }

        catch(error) {

            showToast(
                error.message,
                "error"
            );

        }

        finally {

            hideLoader();

            confirmDeleteClient.disabled =
                false;

        }

    }
);

exportCsvButton.addEventListener(
    "click",
    exportClients
);

clientImageInput.addEventListener(
    "change",
    () => {

        const file =
        clientImageInput.files[0];

        if (!file) {

            selectedClientImage = null;

            resetClientImagePreview();

            return;

        }

        if (!file.type.startsWith("image/")) {

            showToast(
                "Please select a valid image.",
                "error"
            );

            clientImageInput.value = "";

            selectedClientImage = null;

            resetClientImagePreview();

            return;

        }

        if (file.size > 5 * 1024 * 1024) {

            showToast(
                "Client image must be 5MB or smaller.",
                "error"
            );

            clientImageInput.value = "";

            selectedClientImage = null;

            resetClientImagePreview();

            return;

        }

        selectedClientImage = file;

        const reader =
        new FileReader();

        reader.onload = function(event){

            clientImagePreview.innerHTML = `

                <img
                src="${event.target.result}"
                alt="Client Image">

            `;

        };

        reader.readAsDataURL(file);

    }
);

document.addEventListener(
"keydown",
(event)=>{

    if(event.key === "Escape"){

        if(createClientModal.classList.contains("show")){

            closeCreateClientModal();

        }

        if(deleteClientModal.classList.contains("show")){

            closeDeleteClientModal();

        }

    }

});

document.addEventListener(
"keydown",
(event)=>{

    if(event.ctrlKey && event.key.toLowerCase() === "n"){

        event.preventDefault();

        openCreateClientModal();

    }

});

document.addEventListener(
    "click",
    function(e){

        if(window.innerWidth <= 1023){

            if(
                sidebar.classList.contains("show") &&
                !sidebar.contains(e.target) &&
                !menuToggle.contains(e.target)
            ){

                sidebar.classList.remove("show");
                sidebarOverlay.classList.remove("show");

            }

        }

    }
);

[
    contactPersonInput,
    companyNameInput,
    clientEmailInput,
    clientPhoneInput,
    clientTaxIdInput
].forEach(input=>{

    input.addEventListener(
    "keydown",
    (event)=>{

        if(event.key === "Enter"){

            event.preventDefault();

            saveClientButton.click();

        }

    });

});

[
    pageOneButton,
    pageTwoButton,
    pageThreeButton
].forEach(button=>{

    button.addEventListener(
    "click",
    ()=>{

        currentPage =
        Number(button.textContent);

        loadClients();

    });

});

    loadClients();
    
    loadNotificationCount();
    
    registerSendEstimateListeners();
    
    loadUserProfile();
    