let invoices = [];
let currentPage = 1;
let totalPages = 1;
let totalRecords = 0;
const pageLimit = 10;
let invoiceSearchTimeout;
let editingInvoice = false;
let editingInvoiceId = null;
let selectedInvoice = null;
let selectedInvoiceClient = null;
let selectedInvoiceItems = [];
let invoiceCurrencyCode = "";
let invoiceCurrencySymbol = "$";
let invoicePaymentDetails = {};

const DEFAULT_PROFILE_IMAGE = "logo.png";

const totalInvoicesCount =
    document.getElementById("totalInvoicesCount");

const totalInvoicesGrowth =
    document.getElementById("totalInvoicesGrowth");

const draftInvoicesCount =
    document.getElementById("draftInvoicesCount");

const draftInvoicesGrowth =
    document.getElementById("draftInvoicesGrowth");

const paidInvoicesCount =
    document.getElementById("paidInvoicesCount");

const paidInvoicesGrowth =
    document.getElementById("paidInvoicesGrowth");

const pendingInvoicesCount =
    document.getElementById("pendingInvoicesCount");

const pendingInvoicesGrowth =
    document.getElementById("pendingInvoicesGrowth");

const overdueInvoicesCount =
    document.getElementById("overdueInvoicesCount");

const overdueInvoicesGrowth =
    document.getElementById("overdueInvoicesGrowth");

const filterInvoicesBtn =
    document.getElementById("filterInvoicesBtn");

const exportInvoicesBtn =
    document.getElementById("exportInvoicesBtn");
    
const userFullName = document.getElementById("profileName");
    
const closeInvoicePreviewBtn =
    document.getElementById(
        "closeInvoicePreviewBtn"
    );
    
const previewBusinessName =
    document.getElementById("previewBusinessName");
    
const invoiceTableSearch =
    document.getElementById("invoiceTableSearch");

const statusFilter =
    document.getElementById("statusFilter");

const dateFilter =
    document.getElementById("dateFilter");

const sortFilter =
    document.getElementById("sortFilter");
    
const invoicePreviewOverlay =
    document.getElementById("invoicePreviewOverlay");

const invoicePreviewModal =
    document.getElementById("invoicePreviewModal");

const createInvoiceButton =
    document.getElementById("createInvoiceButton");

const invoiceTableBody =
    document.getElementById("invoiceTableBody");

const statusDropdown =
    document.getElementById("statusDropdown");

const emptyInvoiceState =
    document.getElementById("emptyInvoiceState");

const emptyCreateInvoiceBtn =
    document.getElementById("emptyCreateInvoiceBtn");

const paginationStart =
    document.getElementById("paginationStart");

const paginationEnd =
    document.getElementById("paginationEnd");

const paginationTotal =
    document.getElementById("paginationTotal");

const previousPageBtn =
    document.getElementById("previousPageBtn");

const paginationPages =
    document.getElementById("paginationPages");

const nextPageBtn =
    document.getElementById("nextPageBtn");

const createInvoiceOverlay =
    document.getElementById("createInvoiceOverlay");

const createInvoiceModal =
    document.getElementById("createInvoiceModal");

const closeCreateInvoiceButton =
    document.getElementById("closeCreateInvoiceButton");

const invoiceIdInput =
    document.getElementById("invoiceIdInput");

const invoiceTitleInput =
    document.getElementById("invoiceTitleInput");

const invoiceProjectNameInput =
    document.getElementById("invoiceProjectNameInput");

const invoiceReferenceNumberInput =
    document.getElementById("invoiceReferenceNumberInput");

const invoicePurchaseOrderInput =
    document.getElementById("invoicePurchaseOrderInput");

const invoiceNumberInput =
    document.getElementById("invoiceNumberInput");

const invoiceCurrencyInput =
    document.getElementById("invoiceCurrencyInput");

const invoiceClientInput =
    document.getElementById("invoiceClientInput");

const invoiceIssueDateInput =
    document.getElementById("invoiceIssueDateInput");

const invoiceDueDateInput =
    document.getElementById("invoiceDueDateInput");

const invoicePaymentTermsInput =
    document.getElementById("invoicePaymentTermsInput");

const addInvoiceItemButton =
    document.getElementById("addInvoiceItemButton");

const invoiceItemsContainer =
    document.getElementById("invoiceItemsContainer");

const invoiceTaxInput =
    document.getElementById("invoiceTaxInput");

const invoiceDiscountInput =
    document.getElementById("invoiceDiscountInput");

const invoiceShippingInput =
    document.getElementById("invoiceShippingInput");

const invoiceSubtotal =
    document.getElementById("invoiceSubtotal");

const invoiceGrandTotal =
    document.getElementById("invoiceGrandTotal");

const invoicePaymentStatusInput =
    document.getElementById("invoicePaymentStatusInput");

const paymentAccountName =
    document.getElementById("paymentAccountName");

const paymentBankName =
    document.getElementById("paymentBankName");

const paymentProvider =
    document.getElementById("paymentProvider");

const paymentMethod =
    document.getElementById("paymentMethod");

const paymentAccountNumber =
    document.getElementById("paymentAccountNumber");

const paymentReference =
    document.getElementById("paymentReference");
    
const profileImage = document.getElementById("profileImage");

const paymentDueDays =
    document.getElementById("paymentDueDays");

const paymentInstructions =
    document.getElementById("paymentInstructions");

const invoicePaymentStatusSelect =
    document.getElementById("invoicePaymentStatusSelect");

const invoiceNotesInput =
    document.getElementById("invoiceNotesInput");

const invoiceTermsInput =
    document.getElementById("invoiceTermsInput");

const invoiceSignatureNameInput =
    document.getElementById("invoiceSignatureNameInput");

const invoiceSignatureTitleInput =
    document.getElementById("invoiceSignatureTitleInput");

const invoiceSignatureImageInput =
    document.getElementById("invoiceSignatureImageInput");

const invoiceSignaturePreview =
    document.getElementById("invoiceSignaturePreview");

const cancelInvoiceButton =
    document.getElementById("cancelInvoiceBtn");

const saveInvoiceDraftButton =
    document.getElementById("saveInvoiceDraftButton");

const saveInvoiceButton =
    document.getElementById("saveInvoiceButton");

const invoicePreviewCard =
    document.getElementById("invoicePreviewCard");

const refreshPreviewBtn =
    document.getElementById("refreshPreviewBtn");

const printPreviewBtn =
    document.getElementById("printPreviewBtn");

const fullscreenPreviewBtn =
    document.getElementById("fullscreenPreviewBtn");

const previewZoomSelect =
    document.getElementById("previewZoomSelect");

const invoicePaper =
    document.getElementById("invoicePaper");

const previewCompanyLogo =
    document.getElementById("previewCompanyLogo");

const invoiceCompanyName =
    document.getElementById("invoiceCompanyName");

const previewBusinessAddress1 =
    document.getElementById("previewBusinessAddress1");

const previewBusinessAddress2 =
    document.getElementById("previewBusinessAddress2");

const previewBusinessPhone =
    document.getElementById("previewBusinessPhone");

const previewBusinessEmail =
    document.getElementById("previewBusinessEmail");

const previewBusinessWebsite =
    document.getElementById("previewBusinessWebsite");

const previewInvoiceTitle =
    document.getElementById("previewInvoiceTitle");

const previewInvoiceNumber =
    document.getElementById("previewInvoiceNumber");

const previewInvoiceDate =
    document.getElementById("previewInvoiceDate");

const previewDueDate =
    document.getElementById("previewDueDate");

const previewCustomerName =
    document.getElementById("previewCustomerName");

const previewCustomerCompany =
    document.getElementById("previewCustomerCompany");

const previewCustomerEmail =
    document.getElementById("previewCustomerEmail");

const previewCustomerPhone =
    document.getElementById("previewCustomerPhone");

const previewCustomerAddress1 =
    document.getElementById("previewCustomerAddress1");

const previewCustomerAddress2 =
    document.getElementById("previewCustomerAddress2");

const previewCustomerCity =
    document.getElementById("previewCustomerCity");

const previewCustomerCountry =
    document.getElementById("previewCustomerCountry");

const previewDetailsInvoiceNumber =
    document.getElementById("previewDetailsInvoiceNumber");

const previewDetailsIssueDate =
    document.getElementById("previewDetailsIssueDate");

const previewDetailsDueDate =
    document.getElementById("previewDetailsDueDate");

const previewInvoiceStatus =
    document.getElementById("previewInvoiceStatus");

const previewPaymentTerms =
    document.getElementById("previewPaymentTerms");

const previewCurrency =
    document.getElementById("previewCurrency");

const previewPurchaseOrder =
    document.getElementById("previewPurchaseOrder");

const previewReference =
    document.getElementById("previewReference");

const previewProjectName =
    document.getElementById("previewProjectName");

const previewItemsBody =
    document.getElementById("previewItemsBody");

const previewSubtotal =
    document.getElementById("previewSubtotal");

const previewDiscount =
    document.getElementById("previewDiscount");

const previewTax =
    document.getElementById("previewTax");

const previewShipping =
    document.getElementById("previewShipping");

const previewGrandTotal =
    document.getElementById("previewGrandTotal");

const previewDiscountRow =
    document.getElementById("previewDiscountRow");

const previewTaxRow =
    document.getElementById("previewTaxRow");

const previewShippingRow =
    document.getElementById("previewShippingRow");

const previewPaymentAccountName =
    document.getElementById("previewPaymentAccountName");

const previewPaymentBankName =
    document.getElementById("previewPaymentBankName");

const previewPaymentAccountNumber =
    document.getElementById("previewPaymentAccountNumber");

const previewPaymentProvider =
    document.getElementById("previewPaymentProvider");

const previewNotesSection =
    document.getElementById("previewNotesSection");

const previewNoteLine1 =
    document.getElementById("previewNoteLine1");

const previewTermsSection =
    document.getElementById("previewTermsSection");

const previewTerms =
    document.getElementById("previewTerms");

const previewSignatureName =
    document.getElementById("previewSignatureName");

const previewSignatureTitle =
    document.getElementById("previewSignatureTitle");

const previewSignatureImage =
    document.getElementById("previewSignatureImage");

const cancelInvoiceBtn =
    document.getElementById("cancelInvoiceButton");

const saveDraftBtn =
    document.getElementById("saveDraftBtn");

const downloadPdfBtn =
    document.getElementById("downloadPdfButton");

const sendInvoiceBtn =
    document.getElementById("sendInvoiceButton");

const saveInvoiceBtn =
    document.getElementById("saveInvoiceButton");

const pageLoadingOverlay =
    document.getElementById("pageLoadingOverlay");

const invoiceResultOverlay =
    document.getElementById("invoiceResultOverlay");

const invoiceResultTitle =
    document.getElementById("invoiceResultTitle");

const invoiceResultMessage =
    document.getElementById("invoiceResultMessage");

const invoiceResultButton =
    document.getElementById("invoiceResultButton");

const toastContainer =
    document.getElementById("toastContainer");

const profileMenuButton =
    document.getElementById("profileMenuButton");

const profileDropdown =
    document.getElementById("profileDropdown");

const createInvoiceTitle =
    document.getElementById("createInvoiceTitle");

const createInvoiceSubtitle =
    document.getElementById("createInvoiceSubtitle");
    
const invoiceExportWrapper =
    document.getElementById("invoiceExportWrapper");

const invoiceExportMenu =
    document.getElementById("invoiceExportMenu");

const exportInvoicesPdfBtn =
    document.getElementById("exportInvoicesPdfBtn");

const exportInvoicesExcelBtn =
    document.getElementById("exportInvoicesExcelBtn");

const exportInvoicesCsvBtn =
    document.getElementById("exportInvoicesCsvBtn");
    
const previewStatusBadge =
    document.getElementById("previewStatusBadge");
    
const invoiceLimitOverlay =
    document.getElementById("invoiceLimitOverlay");

const invoiceLimitModal =
    document.getElementById("invoiceLimitModal");

const invoiceLimitTitle =
    document.getElementById("invoiceLimitTitle");

const invoiceLimitMessage =
    document.getElementById("invoiceLimitMessage");

const invoiceLimitButton =
    document.getElementById("invoiceLimitButton");
    
const invoicePreviewState = {
    userProfile: null,
    initialized: false };

async function loadInvoiceStatistics() {
    try {
        const result =
            await Parse.Cloud.run(
                "getInvoiceStatistics"
            );

        totalInvoicesCount.textContent =
            result.totalInvoices || 0;

        draftInvoicesCount.textContent =
            result.draftInvoices || 0;

        paidInvoicesCount.textContent =
            result.paidInvoices || 0;

        pendingInvoicesCount.textContent =
            result.pendingInvoices || 0;

        overdueInvoicesCount.textContent =
            result.overdueInvoices || 0;

        totalInvoicesGrowth.textContent =
            `${Number(result.totalGrowth || 0).toFixed(1)}%`;

        draftInvoicesGrowth.textContent =
            `${Number(result.draftGrowth || 0).toFixed(1)}%`;

        paidInvoicesGrowth.textContent =
            `${Number(result.paidGrowth || 0).toFixed(1)}%`;

        pendingInvoicesGrowth.textContent =
            `${Number(result.pendingGrowth || 0).toFixed(1)}%`;

        overdueInvoicesGrowth.textContent =
            `${Number(result.overdueGrowth || 0).toFixed(1)}%`;
    } catch (error) {
        console.error(
            "Invoice Statistics Error:",
            error
        );
        showToast(
    "Unable to load invoice statistics.",
    "error"
);
    }
}

async function loadInvoices() {
    try {
        const result = await Parse.Cloud.run(
            "getInvoices",
            {
                page: currentPage,
                limit: pageLimit,
                search: invoiceTableSearch.value.trim(),
                status: statusFilter.value,
                date: dateFilter.value,
                sort: sortFilter.value
            }
        );

        invoices = result.invoices || [];
        totalPages = result.totalPages || 1;
        totalRecords = result.totalRecords || 0;

        renderInvoiceTable();
        updateInvoiceTableState();
    } catch (error) {
        console.error(
            "Invoice Load Error:",
            error
        );
        showToast(
    "Unable to load invoices.",
    "error"
);

        invoices = [];
        totalPages = 1;
        totalRecords = 0;

        renderInvoiceTable();
        updateInvoiceTableState();
    }
}

function renderInvoiceTable() {
    invoiceTableBody.innerHTML = "";

    if (!invoices.length) {
        return;
    }

    invoices.forEach(invoice => {
        const row = document.createElement("tr");

        const status =
            invoice.status || "Draft";

        const statusClass =
            status.toLowerCase();

        const clientName =
            invoice.companyName ||
            invoice.contactPerson ||
            "No client";

        const clientInitials =
            getInvoiceClientInitials(
                clientName
            );

        const clientImageUrl =
            invoice.clientImageUrl || "";

        const clientAvatar =
            clientImageUrl
                ? `
                    <img
                        src="${escapeInvoiceHtml(clientImageUrl)}"
                        alt="${escapeInvoiceHtml(clientName)}"
                        class="client-table-image"
                    >
                `
                : `
<div class="client-table-avatar">
    ${
        clientImageUrl
            ? `
                <img
                    src="${escapeInvoiceHtml(clientImageUrl)}"
                    alt="${escapeInvoiceHtml(clientName)}"
                    class="client-table-image"
                >
            `
            : `
                <div class="client-table-initials">
                    ${clientInitials}
                </div>
            `
    }
</div> `;

        const currencySymbol =
            invoice.currencySymbol || "$";

        const totalAmount =
            Number(invoice.totalAmount) || 0;

        row.innerHTML = `
            <td>
                <div class="invoice-number-cell">
                    <strong>
                        ${escapeInvoiceHtml(
                            invoice.invoiceNumber ||
                            "—"
                        )}
                    </strong>
                    ${
                        invoice.invoiceTitle
                            ? `
                            <span>
                                ${escapeInvoiceHtml(
                                    invoice.invoiceTitle
                                )}
                            </span>
                            `
                            : ""
                    }
                </div>
            </td>

           <td>
    <div class="client-table-info">
        ${clientAvatar}

        <div class="client-table-details">
                        <span>
                            ${escapeInvoiceHtml(
                                clientName
                            )}
                        </span>

                        ${
                            invoice.clientEmail
                                ? `
                                <small>
                                    ${escapeInvoiceHtml(
                                        invoice.clientEmail
                                    )}
                                </small>
                                `
                                : ""
                        }
                    </div>
                </div>
            </td>

            <td>
                ${currencySymbol}${totalAmount.toLocaleString(
                    undefined,
                    {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }
                )}
            </td>

            <td>
    <span
        class="status-badge ${statusClass}"
        data-invoice-id="${invoice.objectId}">
        ${escapeInvoiceHtml(status)}
    </span>
</td>

            <td>
                ${formatInvoiceDate(
                    invoice.issueDate
                )}
            </td>

            <td>
                ${formatInvoiceDate(
                    invoice.dueDate
                )}
            </td>

            <td>
                <div class="table-actions">
                    <button
                        type="button"
                        class="action-btn view-btn"
                        data-invoice-id="${invoice.objectId}"
                        title="View">
                        <i class="ri-eye-line"></i>
                    </button>

                    <button
                        type="button"
                        class="action-btn edit-btn"
                        data-invoice-id="${invoice.objectId}"
                        title="Edit">
                        <i class="ri-edit-line"></i>
                    </button>
                    
                    <button
    type="button"
    class="action-btn duplicate-btn"
    data-invoice-id="${invoice.objectId}"
    title="Duplicate">
    <i class="ri-file-copy-line"></i>
</button>

                    <button
                        type="button"
                        class="action-btn delete-btn"
                        data-invoice-id="${invoice.objectId}"
                        title="Delete">
                        <i class="ri-delete-bin-line"></i>
                    </button>
                </div>
            </td>
        `;

        invoiceTableBody.appendChild(row);
    });
}

function updateInvoiceTableState() {
    const hasInvoices =
        invoices.length > 0;

    if (hasInvoices) {
        emptyInvoiceState.style.display =
            "none";
    } else {
        emptyInvoiceState.style.display =
            "flex";
    }

    const start =
        totalRecords === 0
            ? 0
            : (
                (currentPage - 1) *
                pageLimit
            ) + 1;

    const end =
        totalRecords === 0
            ? 0
            : Math.min(
                currentPage * pageLimit,
                totalRecords
            );

    paginationStart.textContent =
        start;

    paginationEnd.textContent =
        end;

    paginationTotal.textContent =
        totalRecords;

    renderInvoicePagination();
}

function getInvoiceClientInitials(name) {
    const value =
        (name || "")
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (!value.length) {
        return "?";
    }

    if (value.length === 1) {
        return value[0]
            .substring(0, 2)
            .toUpperCase();
    }

    return (
        value[0][0] +
        value[value.length - 1][0]
    ).toUpperCase();
}

function formatInvoiceDate(value) {
    if (!value) {
        return "—";
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "—";
    }

    return date.toLocaleDateString(
        undefined,
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}

function escapeInvoiceHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function applyInvoiceFilters() {
    currentPage = 1;
    loadInvoices();
}

function initializeInvoiceSearchFilterSort() {
    invoiceTableSearch.addEventListener(
        "input",
        () => {
            clearTimeout(
                invoiceSearchTimeout
            );

            invoiceSearchTimeout =
                setTimeout(() => {
                    currentPage = 1;
                    loadInvoices();
                }, 400);
        }
    );

    statusFilter.addEventListener(
        "change",
        () => {
            currentPage = 1;
            loadInvoices();
        }
    );

    dateFilter.addEventListener(
        "change",
        () => {
            currentPage = 1;
            loadInvoices();
        }
    );

    sortFilter.addEventListener(
        "change",
        () => {
            currentPage = 1;
            loadInvoices();
        }
    );
}

function initializeInvoiceFilterButton() {
    filterInvoicesBtn.addEventListener(
        "click",
        () => {
            statusFilter.focus();
        }
    );
}

function initializeInvoicePagination() {
    previousPageBtn.addEventListener(
        "click",
        () => {
            if (currentPage <= 1) {
                return;
            }

            currentPage--;
            loadInvoices();
        }
    );

    nextPageBtn.addEventListener(
        "click",
        () => {
            if (currentPage >= totalPages) {
                return;
            }

            currentPage++;
            loadInvoices();
        }
    );
}

function renderInvoicePagination() {
    paginationPages.innerHTML = "";

    if (totalPages <= 1) {
        previousPageBtn.disabled = true;
        nextPageBtn.disabled = true;
        return;
    }

    previousPageBtn.disabled =
        currentPage <= 1;

    nextPageBtn.disabled =
        currentPage >= totalPages;

    const pages = getInvoicePaginationPages();

    pages.forEach(page => {
        if (page === "...") {
            const span =
                document.createElement("span");

            span.className =
                "pagination-ellipsis";

            span.textContent = "...";

            paginationPages.appendChild(span);

            return;
        }

        const button =
            document.createElement("button");

        button.type = "button";
        button.className =
            "pagination-page";

        if (page === currentPage) {
            button.classList.add("active");
        }

        button.textContent = page;

        button.addEventListener(
            "click",
            () => {
                if (page === currentPage) {
                    return;
                }

                currentPage = page;
                loadInvoices();
            }
        );

        paginationPages.appendChild(button);
    });
}

function getInvoicePaginationPages() {
    if (totalPages <= 7) {
        return Array.from(
            {
                length: totalPages
            },
            (_, index) => index + 1
        );
    }

    const pages = [1];

    if (currentPage > 4) {
        pages.push("...");
    }

    const start =
        Math.max(
            2,
            currentPage - 1
        );

    const end =
        Math.min(
            totalPages - 1,
            currentPage + 1
        );

    for (
        let page = start;
        page <= end;
        page++
    ) {
        pages.push(page);
    }

    if (
        currentPage <
        totalPages - 3
    ) {
        pages.push("...");
    }

    pages.push(totalPages);

    return pages;
}

async function openCreateInvoiceModal() {
    editingInvoice = false;
    editingInvoiceId = null;
    selectedInvoice = null;
    selectedInvoiceClient = null;
    selectedInvoiceItems = [];
    invoicePaymentDetails = {};

    resetInvoiceModal();

    createInvoiceTitle.textContent =
        "Create Invoice";

    createInvoiceSubtitle.textContent =
        "Create a professional invoice for your client.";

    createInvoiceModal.classList.add(
    "show"
);

createInvoiceOverlay.classList.add(
    "show"
);

    document.body.classList.add(
        "modal-open"
    );

    await loadNextInvoiceNumber();
    await loadInvoicePaymentInformation();
}

function closeCreateInvoiceModal() {
    createInvoiceModal.classList.remove(
        "show"
    );

    createInvoiceOverlay.classList.remove(
        "show"
    );

    document.body.classList.remove(
        "modal-open"
    );
}

async function openEditInvoiceModal(invoiceId) {
    if (!invoiceId) {
        return;
    }

    try {
        editingInvoice = true;
        editingInvoiceId = invoiceId;
        selectedInvoice = null;
        selectedInvoiceClient = null;
        selectedInvoiceItems = [];
        invoicePaymentDetails = {};

        resetInvoiceModal();

        createInvoiceTitle.textContent =
            "Edit Invoice";

        createInvoiceSubtitle.textContent =
            "Update the invoice details for your client.";

        createInvoiceModal.classList.add(
    "show"
);

createInvoiceOverlay.classList.add(
    "show"
);

        document.body.classList.add(
            "modal-open"
        );

        const result =
            await Parse.Cloud.run(
                "getInvoiceDetails",
                {
                    invoiceId
                }
            );

        if (
    !result ||
    !result.invoice
) {
    throw new Error(
        result?.message ||
        "Unable to load invoice."
    );
    showToast("Unable to load invoice.")
}

        const invoice =
            result.invoice;
            
        invoice.items =
    (result.items || []).map(item => ({
        objectId:
            item.objectId || "",

        name:
            item.description || "",

        quantity:
            item.quantity ?? 1,

        rate:
            item.unitPrice ?? 0,

        total:
            item.total ?? 0
    }));

        selectedInvoice =
            invoice;

        await populateInvoiceForm(
            invoice
        );

        await loadInvoicePaymentInformation();

        updateInvoicePreview();

    } catch (error) {
        console.error(
            "Edit Invoice Error:",
            error
        );

        closeCreateInvoiceModal();

        console.log(
            error.message ||
            "Unable to load invoice for editing.",
            "error"
        );
    }
}

async function populateInvoiceForm(invoice) {
    invoiceIdInput.value =
        invoice.objectId || "";

    invoiceTitleInput.value =
        invoice.invoiceTitle || "";

    invoiceProjectNameInput.value =
        invoice.projectName || "";

    invoiceReferenceNumberInput.value =
        invoice.referenceNumber || "";

    invoicePurchaseOrderInput.value =
        invoice.purchaseOrderNumber ||
        invoice.purchaseOrder ||
        "";

    invoiceNumberInput.value =
        invoice.invoiceNumber || "";

    invoiceIssueDateInput.value =
        formatInvoiceDateInput(
            new Date(invoice.issueDate)
        );

    invoiceDueDateInput.value =
        formatInvoiceDateInput(
            new Date(invoice.dueDate)
        );

    invoicePaymentTermsInput.value =
        invoice.paymentTerms || "";

    invoiceTaxInput.value =
        invoice.taxPercent ?? 0;

    invoiceDiscountInput.value =
        invoice.discount ?? 0;

    invoiceShippingInput.value =
        invoice.shipping ?? 0;

    const status =
        invoice.status || "Pending";

    invoicePaymentStatusInput.value =
        status;

    invoicePaymentStatusSelect.value =
        status;

    invoiceNotesInput.value =
        invoice.notes || "";

    invoiceTermsInput.value =
        invoice.terms || "";

    invoiceSignatureNameInput.value =
        invoice.signatureName || "";

    invoiceSignatureTitleInput.value =
        invoice.signatureTitle || "";

    invoiceSignatureImageInput.value =
        "";

    invoiceSignaturePreview.src =
        invoice.signatureImageUrl || "";

    invoiceSignaturePreview.style.display =
        invoice.signatureImageUrl
            ? "block"
            : "none";

    await selectInvoiceCurrency(
        invoice.currencyCode ||
        invoice.currency ||
        ""
    );

    await loadInvoiceClients();

    selectInvoiceClient(
        invoice.clientId ||
        invoice.client?.objectId ||
        ""
    );

    invoiceItemsContainer.innerHTML =
        "";

    const items =
        Array.isArray(invoice.items)
            ? invoice.items
            : [];

    items.forEach(item => {
        addInvoiceItem();

        const rows =
            invoiceItemsContainer.querySelectorAll(
                ".invoice-item-row"
            );

        const row =
            rows[rows.length - 1];

        row.querySelector(
            ".invoice-item-name"
        ).value =
            item.name || "";

        row.querySelector(
            ".invoice-item-quantity"
        ).value =
            item.quantity ?? 1;

        row.querySelector(
            ".invoice-item-rate"
        ).value =
            item.rate ?? 0;

        updateInvoiceItemRowTotal(
            row
        );
    });

    updateInvoiceDueDateMinimum();

    calculateInvoiceTotals();

    updateInvoicePreview();
}

async function selectInvoiceCurrency(currencyCode) {
    if (!currencyCode) {
        invoiceCurrencyInput.value = "";
        updateInvoiceCurrencyDisplay();
        return;
    }

    const option =
        Array.from(
            invoiceCurrencyInput.options
        ).find(
            option =>
                option.value === currencyCode
        );

    if (option) {
        invoiceCurrencyInput.value =
            currencyCode;

        updateInvoiceCurrencyDisplay();
    }
}

async function viewInvoice(invoiceId) {
    if (!invoiceId) {
        return;
    }

    try {
        const result =
            await Parse.Cloud.run(
                "getInvoiceDetails",
                {
                    invoiceId
                }
            );
            result.invoice.clientImageUrl =
    result.client.clientImageUrl;

        if (
            !result ||
            !result.invoice
        ) {
            throw new Error(
                result?.message ||
                "Unable to load invoice."
            );
        }

        const invoice =
            result.invoice;

        const items =
            Array.isArray(result.items)
                ? result.items
                : [];

        selectedInvoice =
            invoice;

        selectedInvoiceItems =
            items;

        invoiceIdInput.value =
            invoice.objectId || invoiceId;

        invoiceTitleInput.value =
            invoice.invoiceTitle || "";

        invoiceProjectNameInput.value =
            invoice.projectName || "";

        invoiceReferenceNumberInput.value =
            invoice.referenceNumber || "";

        invoicePurchaseOrderInput.value =
            invoice.purchaseOrder || "";

        invoiceNumberInput.value =
            invoice.invoiceNumber || "";

        invoiceIssueDateInput.value =
            invoice.issueDate
                ? formatInvoiceDateInput(
                    new Date(
                        invoice.issueDate
                    )
                )
                : "";

        invoiceDueDateInput.value =
            invoice.dueDate
                ? formatInvoiceDateInput(
                    new Date(
                        invoice.dueDate
                    )
                )
                : "";

        invoicePaymentTermsInput.value =
            invoice.paymentTerms || "";

        invoicePaymentStatusInput.value =
            invoice.status || "Draft";

        if (
            invoicePaymentStatusSelect
        ) {
            invoicePaymentStatusSelect.value =
                invoice.status || "Draft";
        }

        invoiceTaxInput.value =
            invoice.taxPercent ?? 0;

        invoiceDiscountInput.value =
            invoice.discount ?? 0;

        invoiceShippingInput.value =
            invoice.shipping ?? 0;

        invoiceNotesInput.value =
            invoice.notes || "";

        invoiceTermsInput.value =
            invoice.termsConditions ||
            invoice.terms ||
            "";

        invoiceSignatureNameInput.value =
            invoice.signatureName || "";

        invoiceSignatureTitleInput.value =
            invoice.signatureTitle || "";

        invoicePaymentDetails =
            invoice.paymentDetails || {};

        await selectInvoiceCurrency(
            invoice.currencyCode ||
            invoice.currency ||
            ""
        );

        selectedInvoiceClient = {
            objectId:
                invoice.clientId ||
                invoice.client?.objectId ||
                "",

            contactPerson:
                invoice.contactPerson ||
                invoice.client?.contactPerson ||
                "",

            companyName:
                invoice.companyName ||
                invoice.client?.companyName ||
                "",

            clientEmail:
                invoice.clientEmail ||
                invoice.client?.clientEmail ||
                "",

            clientPhone:
                invoice.clientPhone ||
                invoice.client?.clientPhone ||
                "",

            billingAddressLine1:
                invoice.billingAddressLine1 ||
                invoice.client?.billingAddressLine1 ||
                "",

            billingAddressLine2:
                invoice.billingAddressLine2 ||
                invoice.client?.billingAddressLine2 ||
                "",

            billingCityStateZip:
                invoice.billingCityStateZip ||
                invoice.client?.billingCityStateZip ||
                "",

            billingCountry:
                invoice.billingCountry ||
                invoice.client?.billingCountry ||
                ""
        };

        invoiceClientInput.value =
            selectedInvoiceClient.objectId;

        invoiceItemsContainer.innerHTML =
            "";

        items.forEach(item => {
            addInvoiceItem();

            const rows =
                invoiceItemsContainer.querySelectorAll(
                    ".invoice-item-row"
                );

            const row =
                rows[rows.length - 1];

            row.querySelector(
                ".invoice-item-name"
            ).value =
                item.description || "";

            row.querySelector(
                ".invoice-item-quantity"
            ).value =
                item.quantity ?? 1;

            row.querySelector(
                ".invoice-item-rate"
            ).value =
                item.unitPrice ?? 0;

            updateInvoiceItemRowTotal(
                row
            );
        });

        updateInvoiceCurrencyDisplay();

        calculateInvoiceTotals();

        updateInvoicePreview();

openInvoicePreviewModal();

    } catch (error) {
        console.error(
            "View Invoice Error:",
            error
        );

        showToast(
            error.message ||
            "Unable to load invoice preview.",
            "error"
        );
    }
}

async function updateInvoiceStatus(invoiceId, status) {
    if (!invoiceId || !status) {
        return;
    }

    try {
        showLoading();

        const result =
            await Parse.Cloud.run(
                "updateInvoiceStatus",
                {
                    invoiceId,
                    status
                }
            );

        if (
            !result ||
            result.success === false
        ) {
            throw new Error(
                result?.message ||
                "Unable to update invoice status."
            );
        }

        const invoice =
            invoices.find(
                item =>
                    item.objectId ===
                    invoiceId
            );

        if (invoice) {
            invoice.status =
                status;
        }

        await loadInvoices();

        await loadInvoiceStatistics();

        showToast(
            result.message ||
            "Invoice status updated successfully.",
            "success"
        );

    } catch (error) {
        console.error(
            "Update Invoice Status Error:",
            error
        );

        showToast(
            error.message ||
            "Unable to update invoice status.",
            "error"
        );
    } finally {
        hideLoading();
    }
}

function selectInvoiceClient(clientId) {
    if (!clientId) {
        invoiceClientInput.value = "";
        selectedInvoiceClient = null;
        clearInvoiceClientPreview();
        return;
    }

    const option =
        Array.from(
            invoiceClientInput.options
        ).find(
            option =>
                option.value === clientId
        );

    if (!option) {
        invoiceClientInput.value = "";
        selectedInvoiceClient = null;
        clearInvoiceClientPreview();
        return;
    }

    invoiceClientInput.value =
        clientId;

    handleInvoiceClientSelection();
}

async function deleteInvoice(invoiceId) {
    if (!invoiceId) {
        return;
    }

    const invoice =
        invoices.find(
            item => item.objectId === invoiceId
        );

    if (!invoice) {
        return;
    }

    const confirmed =
        confirm(
            `Are you sure you want to delete invoice ${invoice.invoiceNumber || ""}?`
        );

    if (!confirmed) {
        return;
    }

    try {
        await Parse.Cloud.run(
            "deleteInvoice",
            {
                invoiceId
            }
        );

        invoices =
            invoices.filter(
                item =>
                    item.objectId !==
                    invoiceId
            );

        await loadInvoices();
        await loadInvoiceStatistics();
showToast(
    "Invoice deleted successfully.",
    "success"
);
    } catch (error) {
        console.error(
            "Delete Invoice Error:",
            error
        );
        showToast(
    error.message ||
    "Unable to delete invoice.",
    "error"
);

    }
}

function resetInvoiceModal() {
    invoiceIdInput.value = "";

    invoiceTitleInput.value = "";
    invoiceProjectNameInput.value = "";
    invoiceReferenceNumberInput.value = "";
    invoicePurchaseOrderInput.value = "";
    invoiceNumberInput.value = "";
    invoiceCurrencyInput.value = "";
    invoiceClientInput.value = "";
    const today = formatInvoiceDateInput(new Date());
    invoiceIssueDateInput.value = today;
    invoiceDueDateInput.value = today;
    invoicePaymentTermsInput.value = "";
    invoiceTaxInput.value = "0";
    invoiceDiscountInput.value = "0";
    invoiceShippingInput.value = "0";
    invoiceItemsContainer.innerHTML = "";
    invoicePaymentStatusInput.value = "Pending";
    invoicePaymentStatusSelect.value = "Pending";
    invoiceNotesInput.value = "";
    invoiceTermsInput.value = "";
    invoiceSignatureNameInput.value = "";
    invoiceSignatureTitleInput.value = "";
    invoiceSignatureImageInput.value = "";
    invoiceSignaturePreview.src = "";
    invoiceSignaturePreview.style.display = "none";
    invoiceSubtotal.textContent = "0.00";
    invoiceGrandTotal.textContent = "0.00";
    invoicePaymentDetails = {};
    saveInvoiceDraftButton.disabled = false;
    saveInvoiceButton.disabled = false;
}

async function loadNextInvoiceNumber() {
    try {
        const result =
            await Parse.Cloud.run(
                "getNextInvoiceNumber"
            );

        if (
            result &&
            result.success &&
            result.invoiceNumber
        ) {
            invoiceNumberInput.value =
                result.invoiceNumber;
        }
    } catch (error) {
        console.error(
            "Invoice Number Error:",
            error
        );
    }
}

async function loadInvoicePaymentInformation() {
    try {
        const response =
            await Parse.Cloud.run(
                "getUserProfile"
            );

        if (
            !response ||
            !response.success ||
            !response.profile
        ) {
            invoicePaymentDetails = {};

            displayInvoicePaymentInformation(
                {}
            );

            return;
        }

        const paymentDetails =
            response.profile.paymentDetails || {};

        invoicePaymentDetails = {
            paymentMethod:
                paymentDetails.paymentMethod || "",

            paymentProvider:
                paymentDetails.paymentProvider || "",

            bankName:
                paymentDetails.bankName || "",

            accountName:
                paymentDetails.accountName || "",

            accountNumber:
                paymentDetails.accountNumber || "",

            routingNumber:
                paymentDetails.routingNumber || "",

            swiftCode:
                paymentDetails.swiftCode || "",

            paymentLink:
                paymentDetails.paymentLink || "",

            paymentAccount:
                paymentDetails.paymentAccount || "",

            paymentTerms:
                paymentDetails.paymentTerms || "",

            paymentDueDays:
                paymentDetails.paymentDueDays || "",

            paymentInstructions:
                paymentDetails.paymentInstructions || ""
        };

        displayInvoicePaymentInformation(
            invoicePaymentDetails
        );
    } catch (error) {
        console.error(
            "Invoice Payment Information Error:",
            error
        );
        showToast(
    "Unable to load payment information.",
    "error"
);

        invoicePaymentDetails = {};

        displayInvoicePaymentInformation(
            {}
        );
    }
}

function initializeCreateInvoiceModal() {
    createInvoiceButton.addEventListener(
        "click",
        openCreateInvoiceModal
    );

    emptyCreateInvoiceBtn.addEventListener(
        "click",
        openCreateInvoiceModal
    );

    closeCreateInvoiceButton.addEventListener(
        "click",
        closeCreateInvoiceModal
    );

    cancelInvoiceButton.addEventListener(
        "click",
        closeCreateInvoiceModal
    );

    createInvoiceOverlay.addEventListener(
        "click",
        closeCreateInvoiceModal
    );
    
    initializeInvoiceSaveWorkflow();
}

function initializeInvoiceForm() {
    loadInvoiceCurrencies();
    initializeInvoiceDates();
    initializeInvoicePaymentTerms();
    initializeInvoiceSignature();
    initializeInvoiceStatusFields();

    invoiceCurrencyInput.addEventListener(
        "change",
        updateInvoiceCurrencyDisplay
    );
}

function loadInvoiceCurrencies() {
    invoiceCurrencyInput.innerHTML = `
        <option value="">
            Select currency
        </option>
    `;

    if (
        typeof currencyMap === "undefined" ||
        !currencyMap
    ) {
        return;
    }

    Object.entries(currencyMap)
        .sort(
            ([codeA], [codeB]) =>
                codeA.localeCompare(codeB)
        )
        .forEach(
            ([code, currency]) => {
                const option =
                    document.createElement(
                        "option"
                    );

                option.value = code;

                option.textContent =
                    `${code} ${currency.symbol}`;

                option.dataset.symbol =
                    currency.symbol;

                invoiceCurrencyInput.appendChild(
                    option
                );
            }
        );
}

function initializeInvoiceDates() {
    const today =
        formatInvoiceDateInput(
            new Date()
        );

    invoiceIssueDateInput.value =
        today;

    invoiceDueDateInput.value =
        today;

    invoiceIssueDateInput.addEventListener(
        "change",
        updateInvoiceDueDateMinimum
    );

    updateInvoiceDueDateMinimum();
}

function updateInvoiceDueDateMinimum() {
    if (!invoiceIssueDateInput.value) {
        invoiceDueDateInput.removeAttribute(
            "min"
        );

        return;
    }

    invoiceDueDateInput.min =
        invoiceIssueDateInput.value;

    if (
        invoiceDueDateInput.value &&
        invoiceDueDateInput.value <
            invoiceIssueDateInput.value
    ) {
        invoiceDueDateInput.value =
            invoiceIssueDateInput.value;
    }
}

function initializeInvoicePaymentTerms() {
    invoicePaymentTermsInput.addEventListener(
        "change",
        updateInvoiceDueDateFromTerms
    );
}

function updateInvoiceDueDateFromTerms() {
    const terms =
        invoicePaymentTermsInput.value;

    if (!terms) {
        return;
    }

    if (
        !invoiceIssueDateInput.value
    ) {
        invoiceIssueDateInput.value =
            formatInvoiceDateInput(
                new Date()
            );
    }

    const issueDate =
        new Date(
            `${invoiceIssueDateInput.value}T00:00:00`
        );

    let daysToAdd = 0;

    if (terms === "Net 7") {
        daysToAdd = 7;
    }

    if (terms === "Net 14") {
        daysToAdd = 14;
    }

    if (terms === "Net 30") {
        daysToAdd = 30;
    }

    if (terms === "Net 60") {
        daysToAdd = 60;
    }

    const dueDate =
        new Date(issueDate);

    dueDate.setDate(
        dueDate.getDate() +
        daysToAdd
    );

    invoiceDueDateInput.value =
        formatInvoiceDateInput(
            dueDate
        );

    updateInvoiceDueDateMinimum();
}

function initializeInvoiceSignature() {
    invoiceSignatureImageInput.addEventListener(
        "change",
        handleInvoiceSignatureChange
    );
}

function handleInvoiceSignatureChange() {
    const file =
        invoiceSignatureImageInput.files?.[0];

    if (!file) {
        invoiceSignaturePreview.src = "";
        invoiceSignaturePreview.style.display =
            "none";

        return;
    }

    const reader =
        new FileReader();

    reader.onload = event => {
        invoiceSignaturePreview.src =
            event.target.result;

        invoiceSignaturePreview.style.display =
            "block";
    };

    reader.readAsDataURL(file);
}

function initializeInvoiceStatusFields() {
    const allowedStatuses = [
        "Draft",
        "Pending",
        "Paid",
        "Overdue",
        "Cancelled"
    ];

    [
        invoicePaymentStatusInput,
        invoicePaymentStatusSelect
    ].forEach(select => {
        if (!select) {
            return;
        }

        Array.from(select.options).forEach(option => {
            if (!allowedStatuses.includes(option.value)) {
                option.remove();
            }
        });

        const currentValue = select.value;

        if (!allowedStatuses.includes(currentValue)) {
            select.value = "Pending";
        }
    });

    const synchronizeStatus = value => {
        const status = allowedStatuses.includes(value)
            ? value
            : "Pending";

        if (invoicePaymentStatusInput) {
            invoicePaymentStatusInput.value = status;
        }

        if (invoicePaymentStatusSelect) {
            invoicePaymentStatusSelect.value = status;
        }
    };

    if (invoicePaymentStatusSelect) {
        invoicePaymentStatusSelect.addEventListener(
            "change",
            () => {
                synchronizeStatus(
                    invoicePaymentStatusSelect.value
                );
            }
        );
    }

    if (invoicePaymentStatusInput) {
        invoicePaymentStatusInput.addEventListener(
            "change",
            () => {
                synchronizeStatus(
                    invoicePaymentStatusInput.value
                );
            }
        );
    }

    synchronizeStatus(
        invoicePaymentStatusSelect?.value ||
        invoicePaymentStatusInput?.value ||
        "Pending"
    );
}

function formatInvoiceDateInput(date) {
    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function validateInvoiceForm() {
    const clientId =
        invoiceClientInput.value;

    const issueDate =
        invoiceIssueDateInput.value;

    const dueDate =
        invoiceDueDateInput.value;

    const currencyCode =
        invoiceCurrencyInput.value;

    if (!clientId) {
        return {
            valid: false,
            message:
                "Please select a client."
        };
    }

    if (!issueDate) {
        return {
            valid: false,
            message:
                "Issue date is required."
        };
    }

    if (!dueDate) {
        return {
            valid: false,
            message:
                "Due date is required."
        };
    }

    if (
        new Date(dueDate) <
        new Date(issueDate)
    ) {
        return {
            valid: false,
            message:
                "Due date cannot be before the issue date."
        };
    }

    if (!currencyCode) {
        return {
            valid: false,
            message:
                "Please select the invoice currency."
        };
    }

    return {
        valid: true
    };
}

async function loadInvoiceClients() {
    try {
        const result =
            await Parse.Cloud.run(
                "getClients",
                {
                    search: "",
                    status: "active",
                    sort: "name",
                    page: 1,
                    limit: 100
                }
            );

        invoiceClientInput.innerHTML = `
            <option value="">
                Select Client
            </option>
        `;

        const clients =
            result.clients || [];

        clients.forEach(client => {
            const option =
                document.createElement(
                    "option"
                );

            option.value =
                client.objectId;

            option.textContent =
                client.contactPerson +
                (
                    client.companyName
                        ? ` (${client.companyName})`
                        : ""
                );

            option.dataset.contactPerson =
                client.contactPerson || "";

            option.dataset.companyName =
                client.companyName || "";

            option.dataset.email =
                client.clientEmail || "";

            option.dataset.phone =
                client.clientPhone || "";

            option.dataset.imageUrl =
                client.clientImageUrl || "";
                
            option.dataset.billingAddressLine1 =
                client.billingAddressLine1 || "";

            option.dataset.billingAddressLine2 =
                client.billingAddressLine2 || "";

            option.dataset.billingCityStateZip =
                client.billingCityStateZip || "";

            option.dataset.billingCountry =
                client.billingCountry || "";

            invoiceClientInput.appendChild(
                option
            );
        });
    } catch (error) {
        console.error(
            "Invoice Client Load Error:",
            error
        );
        showToast(
    "Unable to load clients.",
    "error"
);

        invoiceClientInput.innerHTML = `
            <option value="">
                Unable to load clients
            </option>
        `;
    }
}

function initializeInvoiceClientSelection() {
    invoiceClientInput.addEventListener(
        "change",
        handleInvoiceClientSelection
    );
}

function handleInvoiceClientSelection() {
    const clientId =
        invoiceClientInput.value;

    if (!clientId) {
        selectedInvoiceClient = null;

        clearInvoiceClientPreview();

        return;
    }

    const selectedOption =
        invoiceClientInput.options[
            invoiceClientInput.selectedIndex
        ];

    selectedInvoiceClient = {
    objectId: clientId,

    contactPerson:
        selectedOption.dataset
            .contactPerson || "",

    companyName:
        selectedOption.dataset
            .companyName || "",

    clientEmail:
        selectedOption.dataset
            .email || "",

    clientPhone:
        selectedOption.dataset
            .phone || "",

    clientImageUrl:
        selectedOption.dataset
            .imageUrl || "",

    billingAddressLine1:
        selectedOption.dataset
            .billingAddressLine1 || "",

    billingAddressLine2:
        selectedOption.dataset
            .billingAddressLine2 || "",

    billingCityStateZip:
        selectedOption.dataset
            .billingCityStateZip || "",

    billingCountry:
        selectedOption.dataset
            .billingCountry || ""
};

    updateInvoiceClientPreview(
        selectedInvoiceClient
    );
}

function updateInvoiceClientPreview(
    client
) {
    previewCustomerName.textContent =
        client.contactPerson ||
        "Client Name";

    previewCustomerCompany.textContent =
        client.companyName ||
        "Company Name";

    previewCustomerEmail.textContent =
        client.clientEmail ||
        "Client Email";

    previewCustomerPhone.textContent =
        client.clientPhone ||
        "Client Phone";
}

function clearInvoiceClientPreview() {
    previewCustomerName.textContent =
        "-";

    previewCustomerCompany.textContent =
        "-";

    previewCustomerEmail.textContent =
        "-";

    previewCustomerPhone.textContent =
        "-";

    previewCustomerAddress1.textContent =
        "-";

    previewCustomerAddress2.textContent =
        "-";

    previewCustomerCity.textContent =
        "-";

    previewCustomerCountry.textContent =
        "-";
}

function addInvoiceItem() {
    const row =
        document.createElement("div");

    row.className =
        "invoice-item-row";

    row.innerHTML = `
        <input
            type="text"
            class="invoice-item-name form-control"
            placeholder="Item name">

        <input
            type="number"
            class="invoice-item-quantity form-control"
            value="1"
            min="1"
            step="1">

        <input
            type="number"
            class="invoice-item-rate form-control"
            value="0"
            min="0"
            step="0.01">

        <input
            type="text"
            class="invoice-item-total form-control"
            value="${invoiceCurrencySymbol}0.00"
            readonly>

        <button
            type="button"
            class="remove-invoice-item">
            Remove
        </button>
    `;

    invoiceItemsContainer.appendChild(row);

    attachInvoiceItemEvents(row);

    calculateInvoiceTotals();
}

function attachInvoiceItemEvents(row) {
    const nameInput =
        row.querySelector(
            ".invoice-item-name"
        );

    const quantityInput =
        row.querySelector(
            ".invoice-item-quantity"
        );

    const rateInput =
        row.querySelector(
            ".invoice-item-rate"
        );

    const removeButton =
        row.querySelector(
            ".remove-invoice-item"
        );

    nameInput.addEventListener(
        "input",
        calculateInvoiceTotals
    );

    quantityInput.addEventListener(
        "input",
        () => {
            updateInvoiceItemRowTotal(
                row
            );
        }
    );

    rateInput.addEventListener(
        "input",
        () => {
            updateInvoiceItemRowTotal(
                row
            );
        }
    );

    removeButton.addEventListener(
        "click",
        () => {
            row.remove();

            calculateInvoiceTotals();
        }
    );
}

function updateInvoiceItemRowTotal(row) {
    const quantity =
        Number(
            row.querySelector(
                ".invoice-item-quantity"
            ).value
        ) || 0;

    const rate =
        Number(
            row.querySelector(
                ".invoice-item-rate"
            ).value
        ) || 0;

    const total =
        quantity * rate;

    row.querySelector(
        ".invoice-item-total"
    ).value =
        formatInvoiceMoney(total);

    calculateInvoiceTotals();
}

function calculateInvoiceSubtotal() {
    let subtotal = 0;

    const rows =
        invoiceItemsContainer.querySelectorAll(
            ".invoice-item-row"
        );

    rows.forEach(row => {
        const quantity =
            Number(
                row.querySelector(
                    ".invoice-item-quantity"
                ).value
            ) || 0;

        const rate =
            Number(
                row.querySelector(
                    ".invoice-item-rate"
                ).value
            ) || 0;

        subtotal +=
            quantity * rate;
    });

    return subtotal;
}

function calculateInvoiceTax(
    subtotal
) {
    const taxPercent =
        Number(
            invoiceTaxInput.value
        ) || 0;

    return (
        subtotal *
        (taxPercent / 100)
    );
}

function calculateInvoiceTotals() {
    const subtotal =
        calculateInvoiceSubtotal();

    const tax =
        calculateInvoiceTax(
            subtotal
        );

    const discount =
        Number(
            invoiceDiscountInput.value
        ) || 0;

    const shipping =
        Number(
            invoiceShippingInput.value
        ) || 0;

    const total =
        subtotal +
        tax +
        shipping -
        discount;

    invoiceSubtotal.textContent =
        formatInvoiceMoney(
            subtotal
        );

    invoiceGrandTotal.textContent =
        formatInvoiceMoney(
            Math.max(0, total)
        );

    updateAllInvoiceItemTotals();

    return {
        subtotal,
        taxPercent:
            Number(
                invoiceTaxInput.value
            ) || 0,
        tax,
        discount,
        shipping,
        totalAmount:
            Math.max(0, total)
    };
}

function refreshInvoicePreview() {
    try {
        updateAllInvoiceItemTotals();

        calculateInvoiceTotals();

        updateInvoicePreview();

        if (previewStatusBadge) {
            previewStatusBadge.textContent =
                "Updated";
        }

        setTimeout(() => {
            if (previewStatusBadge) {
                previewStatusBadge.textContent =
                    "Auto Updating";
            }
        }, 1500);

    } catch (error) {
        console.error(
            "Refresh Invoice Preview Error:",
            error
        );

        showToast(
            "Unable to refresh invoice preview.",
            "error"
        );
    }
}

function initializeInvoicePreviewRefresh() {
    if (!refreshPreviewBtn) {
        return;
    }

    refreshPreviewBtn.addEventListener(
        "click",
        refreshInvoicePreview
    );
}

function printInvoicePreview() {
    try {
        window.print();
    } catch (error) {
        console.error(
            "Print Invoice Preview Error:",
            error
        );
        
        showToast(
            "Unable to print invoice preview.",
            "error"
        );
    }
}

function updateAllInvoiceItemTotals() {
    const rows =
        invoiceItemsContainer.querySelectorAll(
            ".invoice-item-row"
        );

    rows.forEach(row => {
        const quantity =
            Number(
                row.querySelector(
                    ".invoice-item-quantity"
                ).value
            ) || 0;

        const rate =
            Number(
                row.querySelector(
                    ".invoice-item-rate"
                ).value
            ) || 0;

        const total =
            quantity * rate;

        row.querySelector(
            ".invoice-item-total"
        ).value =
            formatInvoiceMoney(
                total
            );
    });
}

function getInvoiceItems() {
    const rows =
        invoiceItemsContainer.querySelectorAll(
            ".invoice-item-row"
        );

    return Array.from(
        rows
    ).map(row => {
        const name =
            row.querySelector(
                ".invoice-item-name"
            ).value.trim();

        const quantity =
            Number(
                row.querySelector(
                    ".invoice-item-quantity"
                ).value
            ) || 0;

        const rate =
            Number(
                row.querySelector(
                    ".invoice-item-rate"
                ).value
            ) || 0;

        return {
            name,
            quantity,
            rate,
            amount:
                quantity * rate
        };
    });
}

function formatInvoiceMoney(
    amount
) {
    return (
        invoiceCurrencySymbol +
        Number(
            amount || 0
        ).toLocaleString(
            undefined,
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        )
    );
}

function initializeInvoiceItems() {
    addInvoiceItemButton.addEventListener(
        "click",
        addInvoiceItem
    );

    invoiceTaxInput.addEventListener(
        "input",
        calculateInvoiceTotals
    );

    invoiceDiscountInput.addEventListener(
        "input",
        calculateInvoiceTotals
    );

    invoiceShippingInput.addEventListener(
        "input",
        calculateInvoiceTotals
    );
}

function updateInvoiceCurrencyDisplay() {
    const option =
        invoiceCurrencyInput.options[
            invoiceCurrencyInput.selectedIndex
        ];

    invoiceCurrencyCode =
        invoiceCurrencyInput.value || "";

    invoiceCurrencySymbol =
        option?.dataset?.symbol ||
        "$";

    updateAllInvoiceItemTotals();

    calculateInvoiceTotals();
}

function displayInvoicePaymentInformation(
    paymentDetails
) {
    paymentAccountName.textContent =
        paymentDetails.accountName ||
        "-";

    paymentBankName.textContent =
        paymentDetails.bankName ||
        "-";

    paymentProvider.textContent =
        paymentDetails.paymentProvider ||
        "-";

    paymentMethod.textContent =
        paymentDetails.paymentMethod ||
        "-";

    paymentAccountNumber.textContent =
        paymentDetails.accountNumber ||
        "-";

    paymentReference.textContent =
        paymentDetails.paymentAccount ||
        paymentDetails.paymentLink ||
        "-";

    paymentDueDays.textContent =
        paymentDetails.paymentDueDays ||
        "-";

    paymentInstructions.textContent =
        paymentDetails.paymentInstructions ||
        "-";
}

function initializeInvoicePaymentInformation() {
    loadInvoicePaymentInformation();
}

function updateInvoiceBusinessPreview() {
    const profile =
        invoicePreviewState.userProfile;

    if (!profile) {
        return;
    }

    invoiceCompanyName.textContent =
        profile.businessName ||
        profile.companyName ||
        "Invoice Pro";

    previewBusinessName.textContent =
        profile.businessName ||
        profile.companyName ||
        "";

    previewBusinessAddress1.textContent =
        profile.businessAddress ||
        profile.businessAddressLine1 ||
        "";

    previewBusinessAddress2.textContent =
        profile.businessAddressLine2 ||
        "";

    previewBusinessPhone.textContent =
        profile.businessPhone ||
        profile.phone ||
        "";

    previewBusinessEmail.textContent =
        profile.businessEmail ||
        profile.email ||
        "";

    previewBusinessWebsite.textContent =
        profile.businessWebsite ||
        profile.website ||
        "";

    updateInvoiceBusinessLogo(
        profile
    );
}

function updateInvoiceBusinessLogo(profile) {
    const logo =
        document.getElementById(
            "previewCompanyLogo"
        );

    if (!logo) {
        return;
    }

    let logoUrl = "";

    const businessLogo =
        profile &&
        profile.businessLogo;

    if (
        businessLogo &&
        typeof businessLogo.url ===
            "function"
    ) {
        logoUrl =
            businessLogo.url();
    } else if (
        typeof businessLogo ===
        "string"
    ) {
        logoUrl =
            businessLogo;
    }

    if (logoUrl) {
        logo.src =
            logoUrl;

        logo.style.display =
            "block";
    } else {
        logo.removeAttribute(
            "src"
        );

        logo.style.display =
            "none";
    }
}

async function loadInvoicePreviewProfile() {
    const response =
        await Parse.Cloud.run(
            "getUserProfile"
        );

    if (
        !response ||
        !response.success ||
        !response.profile
    ) {
        invoicePreviewState.userProfile =
            null;

        return;
    }

    invoicePreviewState.userProfile =
        response.profile;
}

async function initializeInvoicePreview() {
    try {
        await loadInvoicePreviewProfile();

        updateInvoicePreview();

        invoicePreviewState.initialized =
            true;
    } catch (error) {
        console.error(
            "Invoice Preview Error:",
            error
        );
    }
}

function initializeInvoicePreviewModal() {
    if (
        closeInvoicePreviewBtn
    ) {
        closeInvoicePreviewBtn.addEventListener(
            "click",
            closeInvoicePreviewModal
        );
    }

    if (
        invoicePreviewOverlay
    ) {
        invoicePreviewOverlay.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    invoicePreviewOverlay
                ) {
                    closeInvoicePreviewModal();
                }

            }
        );
    }

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                invoicePreviewOverlay &&
                invoicePreviewOverlay.classList.contains(
                    "show"
                )
            ) {
                closeInvoicePreviewModal();
            }

        }
    );
}

function updateInvoiceHeaderPreview() {
    previewInvoiceTitle.textContent =
        invoiceTitleInput.value.trim() ||
        "INVOICE";

    previewInvoiceNumber.textContent =
        invoiceNumberInput.value ||
        "INV-000001";

    previewInvoiceDate.textContent =
        formatInvoicePreviewDate(
            invoiceIssueDateInput.value
        );

    previewDueDate.textContent =
        formatInvoicePreviewDate(
            invoiceDueDateInput.value
        );
}

function updateInvoiceDetailsPreview() {
    previewDetailsInvoiceNumber.textContent =
        invoiceNumberInput.value ||
        "INV-000001";

    previewDetailsIssueDate.textContent =
        formatInvoicePreviewDate(
            invoiceIssueDateInput.value
        );

    previewDetailsDueDate.textContent =
        formatInvoicePreviewDate(
            invoiceDueDateInput.value
        );

    previewInvoiceStatus.textContent =
        invoicePaymentStatusInput.value ||
        "Pending";

    previewPaymentTerms.textContent =
        invoicePaymentTermsInput.value ||
        "-";

    previewCurrency.textContent =
    invoiceCurrencyCode ||
    invoiceCurrencyInput.value ||
    "-";

    previewPurchaseOrder.textContent =
        invoicePurchaseOrderInput.value ||
        "-";

    previewReference.textContent =
        invoiceReferenceNumberInput.value ||
        "-";

    previewProjectName.textContent =
        invoiceProjectNameInput.value ||
        "-";
}

function updateInvoiceCustomerPreview() {
    const client =
        selectedInvoiceClient;

    if (!client) {
        clearInvoiceClientPreview();

        return;
    }

    previewCustomerName.textContent =
        client.contactPerson || "-";

    previewCustomerCompany.textContent =
        client.companyName || "-";

    previewCustomerEmail.textContent =
        client.clientEmail || "-";

    previewCustomerPhone.textContent =
        client.clientPhone || "-";

    previewCustomerAddress1.textContent =
        client.billingAddressLine1 || "-";

    previewCustomerAddress2.textContent =
        client.billingAddressLine2 || "-";

    previewCustomerCity.textContent =
        client.billingCityStateZip || "-";

    previewCustomerCountry.textContent =
        client.billingCountry || "-";
}

function updateInvoiceItemsPreview() {
    previewItemsBody.innerHTML = "";

    const items =
        getInvoiceItems();

    if (!items.length) {
        return;
    }

    items.forEach(item => {
        const row =
            document.createElement(
                "tr"
            );

        row.innerHTML = `
            <td>
                ${escapeInvoiceHtml(
                    item.name || "-"
                )}
            </td>

            <td>
                ${item.quantity}
            </td>

            <td>
                ${formatInvoiceMoney(
                    item.rate
                )}
            </td>

            <td>
                ${formatInvoiceMoney(
                    item.amount
                )}
            </td>
        `;

        previewItemsBody.appendChild(
            row
        );
    });
}

function updateInvoiceTotalsPreview() {
    const totals =
        calculateInvoiceTotals();

    previewSubtotal.textContent =
        formatInvoiceMoney(
            totals.subtotal
        );

    previewDiscount.textContent =
        formatInvoiceMoney(
            totals.discount
        );

    previewTax.textContent =
        formatInvoiceMoney(
            totals.tax
        );

    previewShipping.textContent =
        formatInvoiceMoney(
            totals.shipping
        );

    previewGrandTotal.textContent =
        formatInvoiceMoney(
            totals.totalAmount
        );

    previewDiscountRow.style.display =
        totals.discount > 0
            ? ""
            : "none";

    previewTaxRow.style.display =
        totals.tax > 0
            ? ""
            : "none";

    previewShippingRow.style.display =
        totals.shipping > 0
            ? ""
            : "none";
}

function updateInvoicePaymentPreview() {
    const payment =
        invoicePaymentDetails || {};

    previewPaymentAccountName.textContent =
        payment.accountName ||
        "-";

    previewPaymentBankName.textContent =
        payment.bankName ||
        "-";

    previewPaymentAccountNumber.textContent =
        payment.accountNumber ||
        "-";

    previewPaymentProvider.textContent =
        payment.paymentProvider ||
        "-";
}

function updateInvoiceNotesPreview() {
    previewNoteLine1.textContent =
        invoiceNotesInput.value.trim() ||
        "";

    previewTerms.textContent =
        invoiceTermsInput.value.trim() ||
        "";
}

function updateInvoiceSignaturePreview() {
    previewSignatureName.textContent =
        invoiceSignatureNameInput.value.trim() ||
        "";

    previewSignatureTitle.textContent =
        invoiceSignatureTitleInput.value.trim() ||
        "";

    const imageFile =
        invoiceSignatureImageInput.files?.[0];

    if (imageFile) {
        const reader =
            new FileReader();

        reader.onload = event => {
            previewSignatureImage.src =
                event.target.result;

            previewSignatureImage.style.display =
                "block";
        };

        reader.readAsDataURL(
            imageFile
        );

        return;
    }

    const savedSignatureUrl =
        invoiceSignaturePreview.dataset.savedUrl ||
        "";

    if (savedSignatureUrl) {
        previewSignatureImage.src =
            savedSignatureUrl;

        previewSignatureImage.style.display =
            "block";

        return;
    }

    previewSignatureImage.src = "";
    previewSignatureImage.style.display =
        "none";
}

function updateInvoicePreview() {
    updateInvoiceBusinessPreview();
    updateInvoiceHeaderPreview();
    updateInvoiceDetailsPreview();
    updateInvoiceCustomerPreview();
    updateInvoiceItemsPreview();
    updateInvoiceTotalsPreview();
    updateInvoicePaymentPreview();
    updateInvoiceNotesPreview();
    updateInvoiceSignaturePreview();
}

function initializeInvoicePreviewListeners() {
    [
        invoiceTitleInput,
        invoiceNumberInput,
        invoiceIssueDateInput,
        invoiceDueDateInput,
        invoicePaymentStatusInput,
        invoicePaymentTermsInput,
        invoiceCurrencyInput,
        invoicePurchaseOrderInput,
        invoiceReferenceNumberInput,
        invoiceProjectNameInput,
        invoiceNotesInput,
        invoiceTermsInput,
        invoiceSignatureNameInput,
        invoiceSignatureTitleInput
    ].forEach(input => {
        if (!input) {
            return;
        }

        input.addEventListener(
            "input",
            updateInvoicePreview
        );

        input.addEventListener(
            "change",
            updateInvoicePreview
        );
        
        
    });
    
if (sendInvoiceBtn) {
    sendInvoiceBtn.addEventListener(
        "click",
        async () => {
            if (
                !selectedInvoice ||
                !selectedInvoice.objectId
            ) {
                showToast(
                    "Invoice ID is missing.",
                    "error"
                );

                return;
            }

            await openSendInvoiceModal(
                selectedInvoice.objectId
            );
        }
    );
}
}

function formatInvoicePreviewDate(
    value
) {
    if (!value) {
        return "-";
    }

    const date =
        new Date(
            `${value}T00:00:00`
        );

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "-";
    }

    return date.toLocaleDateString(
        undefined,
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}

async function duplicateInvoice(invoiceId) {
    if (!invoiceId) {
        return;
    }

    try {
        const result =
            await Parse.Cloud.run(
                "duplicateInvoice",
                {
                    invoiceId
                }
            );

        if (
            !result ||
            !result.success
        ) {
            throw new Error(
                result?.message ||
                "Unable to duplicate invoice."
            );
        }

        await loadInvoices();
        await loadInvoiceStatistics();
showToast(
    "Invoice duplicated successfully.",
    "success"
);
    } catch (error) {
        console.error(
            "Duplicate Invoice Error:",
            error
        );
        showToast(
    error.message ||
    "Unable to duplicate invoice.",
    "error"
);
    }
}

async function downloadInvoicePdf() {
    if (!invoicePaper) {
        return;
    }

    try {
        if (typeof html2canvas === "undefined") {
            throw new Error(
                "PDF rendering library is not loaded."
            );
        }

        if (
            typeof window.jspdf === "undefined" ||
            !window.jspdf.jsPDF
        ) {
            throw new Error(
                "PDF library is not loaded."
            );
        }

        updateInvoicePreview();

        await new Promise(resolve =>
            setTimeout(resolve, 300)
        );

        const canvas =
            await html2canvas(
                invoicePaper,
                {
                    scale: 2,
                    useCORS: true,
                    allowTaint: false,
                    backgroundColor: "#ffffff",
                    logging: false,
                    imageTimeout: 15000
                }
            );

        const {
            jsPDF
        } = window.jspdf;

        const pdf =
            new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4"
            });

        const pageWidth =
            pdf.internal.pageSize.getWidth();

        const pageHeight =
            pdf.internal.pageSize.getHeight();

        const imageWidth =
            pageWidth;

        const imageHeight =
            canvas.height *
            imageWidth /
            canvas.width;

        const imageData =
            canvas.toDataURL(
                "image/jpeg",
                0.95
            );

        const totalPages =
            Math.ceil(
                imageHeight /
                pageHeight
            );

        for (
            let page = 0;
            page < totalPages;
            page++
        ) {
            if (page > 0) {
                pdf.addPage();
            }

            const position =
                -(page * pageHeight);

            pdf.addImage(
                imageData,
                "JPEG",
                0,
                position,
                imageWidth,
                imageHeight
            );
        }

        const invoiceNumber =
            invoiceNumberInput.value.trim() ||
            "invoice";

        const safeFileName =
            invoiceNumber.replace(
                /[^a-z0-9-_]/gi,
                "_"
            );

        pdf.save(
            `${safeFileName}.pdf`
        );
        
        showToast(
    "Invoice PDF generated successfully.",
    "success"
);

    } catch (error) {
        console.error(
            "Invoice PDF Error:",
            error
        );

        showToast(
    error.message ||
    "Unable to export the invoice as PDF.",
    "error"
);
    }
}

function initializeInvoiceTableActions() {
    document.addEventListener(
        "click",
        async event => {

            const statusButton =
                event.target.closest(
                    "#statusDropdown button[data-status]"
                );

            if (statusButton) {
                const invoiceId =
                    statusDropdown.dataset.invoiceId;

                const status =
                    statusButton.dataset.status;

                if (!invoiceId) {
                    return;
                }

                statusDropdown.classList.remove(
                    "active"
                );

                await updateInvoiceStatus(
                    invoiceId,
                    status
                );

                return;
            }

            const statusTrigger =
                event.target.closest(
                    ".status-badge"
                );

            if (statusTrigger) {
                const invoiceId =
                    statusTrigger.dataset.invoiceId;

                if (!invoiceId) {
                    return;
                }

                statusDropdown.dataset.invoiceId =
                    invoiceId;

                const rect =
                    statusTrigger.getBoundingClientRect();

                const dropdownWidth =
                    statusDropdown.offsetWidth || 130;

                const dropdownHeight =
                    statusDropdown.offsetHeight || 154;

                let left =
                    rect.left;

                let top =
                    rect.bottom + 6;

                if (
                    left + dropdownWidth >
                    window.innerWidth - 10
                ) {
                    left =
                        window.innerWidth -
                        dropdownWidth -
                        10;
                }

                if (
                    top + dropdownHeight >
                    window.innerHeight - 10
                ) {
                    top =
                        rect.top -
                        dropdownHeight -
                        6;
                }

                statusDropdown.style.position =
                    "fixed";

                statusDropdown.style.left =
                    `${Math.max(left, 10)}px`;

                statusDropdown.style.top =
                    `${Math.max(top, 10)}px`;

                statusDropdown.classList.add(
                    "active"
                );

                return;
            }

            const sendButton =
                event.target.closest(
                    ".send-client-invoice-button"
                );

            if (sendButton) {
                const invoiceId =
                    sendButton.dataset.id;

                await openSendInvoiceModal(
                    invoiceId
                );

                return;
            }

            const viewButton =
                event.target.closest(
                    ".view-btn"
                );

            if (viewButton) {
                const invoiceId =
                    viewButton.dataset.invoiceId;

                await viewInvoice(
                    invoiceId
                );

                return;
            }

            const editButton =
                event.target.closest(
                    ".edit-btn"
                );

            if (editButton) {
                const invoiceId =
                    editButton.dataset.invoiceId;

                openEditInvoiceModal(
                    invoiceId
                );

                return;
            }

            const deleteButton =
                event.target.closest(
                    ".delete-btn"
                );

            if (deleteButton) {
                const invoiceId =
                    deleteButton.dataset.invoiceId;

                await deleteInvoice(
                    invoiceId
                );

                return;
            }

            const duplicateButton =
                event.target.closest(
                    ".duplicate-btn"
                );

            if (duplicateButton) {
                const invoiceId =
                    duplicateButton.dataset.invoiceId;

                await duplicateInvoice(
                    invoiceId
                );
            }

            if (
                statusDropdown &&
                statusDropdown.classList.contains(
                    "active"
                ) &&
                !event.target.closest(
                    "#statusDropdown"
                ) &&
                !event.target.closest(
                    ".status-badge"
                )
            ) {
                statusDropdown.classList.remove(
                    "active"
                );
            }
        }
    );
}

function initializeInvoicePdfDownload() {
    if (!downloadPdfBtn) {
        return;
    }

    downloadPdfBtn.addEventListener(
        "click",
        downloadInvoicePdf
    );
}

function showToast(
    message,
    type = "info",
    duration = 3000
) {
    console.log(
        `[Toast: ${type}]`,
        message
    );

    if (!toastContainer) {
        return;
    }

    const toast =
        document.createElement("div");

    toast.className =
        `toast ${type}`;

    const messageElement =
        document.createElement("span");

    messageElement.textContent =
        message;

    const closeElement =
        document.createElement("span");

    closeElement.className =
        "toastClose";

    closeElement.innerHTML =
        "&times;";

    toast.appendChild(
        messageElement
    );

    toast.appendChild(
        closeElement
    );

    toastContainer.appendChild(
        toast
    );

    let removed = false;

    const removeToast = () => {
        if (removed) {
            return;
        }

        removed = true;

        toast.style.animation =
            "toastOut .3s forwards";

        setTimeout(() => {
            toast.remove();
        }, 300);
    };

    closeElement.addEventListener(
        "click",
        removeToast
    );

    setTimeout(
        removeToast,
        duration
    );
}

function openInvoicePreviewModal() {
    if (
        !invoicePreviewOverlay ||
        !invoicePreviewModal ||
        !invoicePreviewCard
    ) {
        return;
    }

    if (
        invoicePreviewCard.parentElement !==
        invoicePreviewModal
    ) {
        invoicePreviewModal.appendChild(
            invoicePreviewCard
        );
    }

    invoicePreviewOverlay.classList.add("show");

    document.body.classList.add(
        "invoice-preview-open"
    );
}

function closeInvoicePreviewModal() {
    if (!invoicePreviewOverlay) {
        return;
    }

    invoicePreviewOverlay.classList.remove(
        "show"
    );

    document.body.classList.remove(
        "invoice-preview-open"
    );
}

function getInvoiceExportData() {
    return invoices.map(invoice => {
        const totalAmount =
            Number(
                invoice.totalAmount
            ) || 0;

        return {
            Invoice:
                invoice.invoiceNumber || "",

            Title:
                invoice.invoiceTitle || "",

            Client:
                invoice.companyName ||
                invoice.contactPerson ||
                "",

            Email:
                invoice.clientEmail || "",

            Amount:
                totalAmount,

            Currency:
                invoice.currencyCode ||
                "",

            Status:
                invoice.status || "",

            IssueDate:
                formatInvoiceDate(
                    invoice.issueDate
                ),

            DueDate:
                formatInvoiceDate(
                    invoice.dueDate
                ),

            PaymentTerms:
                invoice.paymentTerms || "",

            Reference:
                invoice.referenceNumber || "",

            Project:
                invoice.projectName || ""
        };
    });
}

function exportInvoicesAsExcel() {
    try {
        if (
            typeof XLSX === "undefined"
        ) {
            throw new Error(
                "Excel export library is not loaded."
            );
        }

        if (!invoices.length) {
            showToast(
                "There are no invoices to export.",
                "info"
            );

            return;
        }

        const data =
            getInvoiceExportData();

        const worksheet =
            XLSX.utils.json_to_sheet(
                data
            );

        const workbook =
            XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Invoices"
        );

        XLSX.writeFile(
            workbook,
            "invoices.xlsx"
        );

        showToast(
            "Invoices exported as Excel successfully.",
            "success"
        );

    } catch (error) {
        console.error(
            "Invoice Excel Export Error:",
            error
        );

        showToast(
            error.message ||
            "Unable to export invoices as Excel.",
            "error"
        );
    }
}

function exportInvoicesAsCsv() {
    try {
        if (!invoices.length) {
            showToast(
                "There are no invoices to export.",
                "info"
            );

            return;
        }

        const data =
            getInvoiceExportData();

        const headers =
            Object.keys(
                data[0]
            );

        const csvRows =
            [
                headers.join(",")
            ];

        data.forEach(invoice => {
            const row =
                headers.map(header => {
                    const value =
                        invoice[header] ?? "";

                /*    return `"${String(value)
                        .replace(/"/g, '""')}`";*/
                });

            csvRows.push(
                row.join(",")
            );
        });

        const csv =
            csvRows.join("\n");

        const blob =
            new Blob(
                [csv],
                {
                    type:
                        "text/csv;charset=utf-8;"
                }
            );

        const url =
            URL.createObjectURL(
                blob
            );

        const link =
            document.createElement(
                "a"
            );

        link.href = url;

        link.download =
            "invoices.csv";

        document.body.appendChild(
            link
        );

        link.click();

        link.remove();

        URL.revokeObjectURL(
            url
        );

        showToast(
            "Invoices exported as CSV successfully.",
            "success"
        );

    } catch (error) {
        console.error(
            "Invoice CSV Export Error:",
            error
        );

        showToast(
            error.message ||
            "Unable to export invoices as CSV.",
            "error"
        );
    }
}

async function loadInvoiceForExport(
    invoice,
    items
) {
    selectedInvoice =
        invoice;

    selectedInvoiceItems =
        items;

    invoiceIdInput.value =
        invoice.objectId || "";

    invoiceTitleInput.value =
        invoice.invoiceTitle || "";

    invoiceProjectNameInput.value =
        invoice.projectName || "";

    invoiceReferenceNumberInput.value =
        invoice.referenceNumber || "";

    invoicePurchaseOrderInput.value =
        invoice.purchaseOrder || "";

    invoiceNumberInput.value =
        invoice.invoiceNumber || "";

    invoiceIssueDateInput.value =
        invoice.issueDate
            ? formatInvoiceDateInput(
                new Date(
                    invoice.issueDate
                )
            )
            : "";

    invoiceDueDateInput.value =
        invoice.dueDate
            ? formatInvoiceDateInput(
                new Date(
                    invoice.dueDate
                )
            )
            : "";

    invoicePaymentTermsInput.value =
        invoice.paymentTerms || "";

    invoicePaymentStatusInput.value =
        invoice.status || "Draft";

    if (
        invoicePaymentStatusSelect
    ) {
        invoicePaymentStatusSelect.value =
            invoice.status || "Draft";
    }

    invoiceTaxInput.value =
        invoice.taxPercent || 0;

    invoiceDiscountInput.value =
        invoice.discount || 0;

    invoiceShippingInput.value =
        invoice.shipping || 0;

    invoiceNotesInput.value =
        invoice.notes || "";

    invoiceTermsInput.value =
        invoice.termsConditions || "";

    invoiceSignatureNameInput.value =
        invoice.signatureName || "";

    invoiceSignatureTitleInput.value =
        invoice.signatureTitle || "";

    invoicePaymentDetails =
        invoice.paymentDetails || {};

    invoiceCurrencyCode =
        invoice.currencyCode || "USD";

    invoiceCurrencySymbol =
        invoice.currencySymbol || "$";

    selectedInvoiceClient = {
        objectId:
            invoice.clientId || "",

        contactPerson:
            invoice.contactPerson || "",

        companyName:
            invoice.companyName || "",

        clientEmail:
            invoice.clientEmail || "",

        clientPhone:
            invoice.clientPhone || "",

        billingAddressLine1:
            invoice.billingAddressLine1 || "",

        billingAddressLine2:
            invoice.billingAddressLine2 || "",

        billingCityStateZip:
            invoice.billingCityStateZip || "",

        billingCountry:
            invoice.billingCountry || ""
    };

    invoiceClientInput.value =
        selectedInvoiceClient.objectId;

    invoiceCurrencyInput.value =
        invoice.currencyCode || "";

    invoiceItemsContainer.innerHTML =
        "";

    items.forEach(
        item => {
            addInvoiceItem();

            const rows =
                invoiceItemsContainer.querySelectorAll(
                    ".invoice-item-row"
                );

            const row =
                rows[
                    rows.length - 1
                ];

            const nameInput =
                row.querySelector(
                    ".invoice-item-name"
                );

            const quantityInput =
                row.querySelector(
                    ".invoice-item-quantity"
                );

            const rateInput =
                row.querySelector(
                    ".invoice-item-rate"
                );

            if (nameInput) {
                nameInput.value =
                    item.description || "";
            }

            if (quantityInput) {
                quantityInput.value =
                    item.quantity || 1;
            }

            if (rateInput) {
                rateInput.value =
                    item.unitPrice || 0;
            }

            updateInvoiceItemRowTotal(
                row
            );
        }
    );

    updateInvoiceCurrencyDisplay();

    calculateInvoiceTotals();

    updateInvoicePreview();
}

async function exportInvoicesAsPdf() {
    if (!invoicePaper) {
        return;
    }

    try {
        if (
            typeof html2canvas === "undefined"
        ) {
            throw new Error(
                "PDF rendering library is not loaded."
            );
        }

        if (
            typeof window.jspdf === "undefined" ||
            !window.jspdf.jsPDF
        ) {
            throw new Error(
                "PDF library is not loaded."
            );
        }

        const firstPage =
            await Parse.Cloud.run(
                "getInvoices",
                {
                    page: 1,
                    limit: 100,
                    search: "",
                    status: "all",
                    date: "all",
                    sort: "newest"
                }
            );

        const allInvoices =
            firstPage.invoices || [];

        const totalRecords =
            Number(
                firstPage.totalRecords
            ) || 0;

        const totalPages =
            Math.ceil(
                totalRecords / 100
            );

        for (
            let page = 2;
            page <= totalPages;
            page++
        ) {
            const pageResult =
                await Parse.Cloud.run(
                    "getInvoices",
                    {
                        page,
                        limit: 100,
                        search: "",
                        status: "all",
                        date: "all",
                        sort: "newest"
                    }
                );

            if (
                Array.isArray(
                    pageResult.invoices
                )
            ) {
                allInvoices.push(
                    ...pageResult.invoices
                );
            }
        }

        if (!allInvoices.length) {
            showToast(
                "There are no invoices to export.",
                "info"
            );

            return;
        }

        const {
            jsPDF
        } = window.jspdf;

        const pdf =
            new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4"
            });

        const pageWidth =
            pdf.internal.pageSize.getWidth();

        const pageHeight =
            pdf.internal.pageSize.getHeight();

        for (
            let index = 0;
            index < allInvoices.length;
            index++
        ) {
            const invoice =
                allInvoices[index];

            const result =
                await Parse.Cloud.run(
                    "getInvoiceDetails",
                    {
                        invoiceId:
                            invoice.objectId
                    }
                );
                result.invoice.clientImageUrl =
    result.client.clientImageUrl;

            if (
                !result ||
                !result.invoice
            ) {
                continue;
            }

            await loadInvoiceForExport(
                result.invoice,
                result.items || []
            );

            updateInvoicePreview();

            await new Promise(
                resolve =>
                    setTimeout(
                        resolve,
                        300
                    )
            );

            const canvas =
                await html2canvas(
                    invoicePaper,
                    {
                        scale: 2,
                        useCORS: true,
                        allowTaint: false,
                        backgroundColor:
                            "#ffffff",
                        logging: false,
                        imageTimeout: 15000
                    }
                );

            const imageWidth =
                pageWidth;

            const imageHeight =
                canvas.height *
                imageWidth /
                canvas.width;

            const imageData =
                canvas.toDataURL(
                    "image/jpeg",
                    0.95
                );

            if (index > 0) {
                pdf.addPage();
            }

            let remainingHeight =
                imageHeight;

            let position = 0;

            let pageIndex = 0;

            while (
                remainingHeight > 0
            ) {
                if (
                    pageIndex > 0
                ) {
                    pdf.addPage();
                }

                pdf.addImage(
                    imageData,
                    "JPEG",
                    0,
                    position,
                    imageWidth,
                    imageHeight
                );

                remainingHeight -=
                    pageHeight;

                position -=
                    pageHeight;

                pageIndex++;
            }
        }

        pdf.save(
            "invoices.pdf"
        );

        showToast(
            `${allInvoices.length} invoices exported as one PDF successfully.`,
            "success"
        );

    } catch (error) {
        console.error(
            "Invoice List PDF Export Error:",
            error
        );

        showToast(
            error.message ||
            "Unable to export invoices as PDF.",
            "error"
        );
    }
}

function initializeInvoiceExport() {
    if (
        !exportInvoicesBtn ||
        !invoiceExportMenu
    ) {
        return;
    }

    exportInvoicesBtn.addEventListener(
        "click",
        event => {
            event.stopPropagation();

            invoiceExportMenu.classList.toggle(
                "active"
            );
        }
    );

    document.addEventListener(
        "click",
        event => {
            if (
                invoiceExportWrapper &&
                !invoiceExportWrapper.contains(
                    event.target
                )
            ) {
                invoiceExportMenu.classList.remove(
                    "active"
                );
            }
        }
    );

    exportInvoicesPdfBtn.addEventListener(
        "click",
        async () => {
            invoiceExportMenu.classList.remove(
                "active"
            );

            await exportInvoicesAsPdf();
        }
    );

    exportInvoicesExcelBtn.addEventListener(
        "click",
        () => {
            invoiceExportMenu.classList.remove(
                "active"
            );

            exportInvoicesAsExcel();
        }
    );

    exportInvoicesCsvBtn.addEventListener(
        "click",
        () => {
            invoiceExportMenu.classList.remove(
                "active"
            );

            exportInvoicesAsCsv();
        }
    );
}

function printInvoicePreview() {
    try {
        window.print();
    } catch (error) {
        console.error(
            "Print Invoice Preview Error:",
            error
        );

        showToast(
            "Unable to print invoice preview.",
            "error"
        );
    }
}

function initializeInvoicePrint() {
    if (!printPreviewBtn) {
        return;
    }

    printPreviewBtn.addEventListener(
        "click",
        printInvoicePreview
    );
}

function toggleInvoicePreviewFullscreen() {
    if (!invoicePreviewCard) {
        return;
    }

    if (!document.fullscreenElement) {
        invoicePreviewCard
            .requestFullscreen()
            .catch(error => {
                console.error(
                    "Fullscreen Preview Error:",
                    error
                );

                showToast(
                    "Unable to enter fullscreen preview.",
                    "error"
                );
            });

        return;
    }

    document.exitFullscreen().catch(error => {
        console.error(
            "Exit Fullscreen Error:",
            error
        );
    });
}

function initializeInvoiceFullscreen() {
    if (!fullscreenPreviewBtn) {
        return;
    }

    fullscreenPreviewBtn.addEventListener(
        "click",
        toggleInvoicePreviewFullscreen
    );

    document.addEventListener(
        "fullscreenchange",
        () => {
            if (
                document.fullscreenElement ===
                invoicePreviewCard
            ) {
                fullscreenPreviewBtn.title =
                    "Exit Fullscreen";

                fullscreenPreviewBtn.innerHTML =
                    '<i class="ri-fullscreen-exit-line"></i>';
            } else {
                fullscreenPreviewBtn.title =
                    "Fullscreen Preview";

                fullscreenPreviewBtn.innerHTML =
                    '<i class="ri-fullscreen-line"></i>';
            }
        }
    );
}

function updateInvoicePreviewZoom() {
    if (
        !previewZoomSelect ||
        !invoicePaper
    ) {
        return;
    }

    const zoom =
        Number(
            previewZoomSelect.value
        ) || 100;

    invoicePaper.style.transform =
        `scale(${zoom / 100})`;

    invoicePaper.style.transformOrigin =
        "top center";

    const scale =
        zoom / 100;

    invoicePaper.style.marginBottom =
        `${(scale - 1) * 100}%`;
}

function initializeInvoicePreviewZoom() {
    if (!previewZoomSelect) {
        return;
    }

    previewZoomSelect.addEventListener(
        "change",
        updateInvoicePreviewZoom
    );

    updateInvoicePreviewZoom();
}

async function openSendInvoiceModal(invoiceId) {
    const modal =
        document.getElementById(
            "sendInvoiceModal"
        );

    if (!modal) {
        showToast(
            "Send invoice modal was not found.",
            "error"
        );

        return;
    }

    if (!invoiceId) {
        showToast(
            "Invoice ID is missing.",
            "error"
        );

        return;
    }

    try {
        const result =
    await Parse.Cloud.run(
        "getInvoiceDetails",
        {
            invoiceId
        }
    );

        if (
            !result ||
            !result.invoice
        ) {
            throw new Error(
                result?.message ||
                "Unable to load invoice details."
            );
        }

        const invoice =
            result.invoice;

        const items =
            result.items || [];

        modal.dataset.invoiceId =
            invoiceId;

        document.getElementById(
            "sendInvoiceClientName"
        ).textContent =
            invoice.companyName ||
            invoice.contactPerson ||
            "-";

        document.getElementById(
            "sendInvoiceClientEmail"
        ).textContent =
            invoice.clientEmail ||
            "-";
          
        const sendInvoiceClientImage =
    document.getElementById(
        "sendInvoiceClientImage"
    );

const sendInvoiceClientImageFallback =
    document.getElementById(
        "sendInvoiceClientImageFallback"
    );

const clientImageUrl =
    invoice.clientImageUrl ||
    (
        result.client &&
        result.client.clientImageUrl
    ) ||
    "";

if (sendInvoiceClientImage) {
    const clientImageContainer =
        sendInvoiceClientImage.parentElement;

    if (clientImageContainer) {
        clientImageContainer.style.overflow =
            "hidden";

        clientImageContainer.style.borderRadius =
            "50%";
    }

    sendInvoiceClientImage.style.width =
        "100%";

    sendInvoiceClientImage.style.height =
        "100%";

    sendInvoiceClientImage.style.objectFit =
        "cover";

    sendInvoiceClientImage.style.borderRadius =
        "50%";

    if (clientImageUrl) {
        sendInvoiceClientImage.src =
            clientImageUrl;

        sendInvoiceClientImage.style.display =
            "block";

        if (
            sendInvoiceClientImageFallback
        ) {
            sendInvoiceClientImageFallback.style.display =
                "none";
        }
    } else {
        sendInvoiceClientImage.removeAttribute(
            "src"
        );

        sendInvoiceClientImage.style.display =
            "none";

        if (
            sendInvoiceClientImageFallback
        ) {
            sendInvoiceClientImageFallback.style.display =
                "flex";
        }
    }
}

        document.getElementById(
            "sendInvoiceNumber"
        ).textContent =
            invoice.invoiceNumber ||
            "-";

        document.getElementById(
            "sendInvoiceTitle"
        ).textContent =
            invoice.invoiceTitle ||
            "-";

        document.getElementById(
            "sendInvoiceIssueDate"
        ).textContent =
            formatInvoiceDate(
                invoice.issueDate
            );

        document.getElementById(
            "sendInvoiceDueDate"
        ).textContent =
            formatInvoiceDate(
                invoice.dueDate
            );

        document.getElementById(
            "sendInvoicePaymentTerms"
        ).textContent =
            invoice.paymentTerms ||
            "-";

        document.getElementById(
            "sendInvoiceCurrency"
        ).textContent =
            invoice.currencyCode ||
            "-";

        document.getElementById(
            "sendInvoicePaymentStatus"
        ).textContent =
            invoice.status ||
            "-";
            
            const paymentDetails =
    result.paymentDetails ||
    invoice.paymentDetails ||
    {};

const sendInvoicePaymentAccountName =
    document.getElementById(
        "sendInvoicePaymentAccountName"
    );

if (sendInvoicePaymentAccountName) {
    sendInvoicePaymentAccountName.textContent =
        paymentDetails.accountName ||
        "-";
}

const sendInvoicePaymentBankName =
    document.getElementById(
        "sendInvoicePaymentBankName"
    );

if (sendInvoicePaymentBankName) {
    sendInvoicePaymentBankName.textContent =
        paymentDetails.bankName ||
        "-";
}

const sendInvoicePaymentProvider =
    document.getElementById(
        "sendInvoicePaymentProvider"
    );

if (sendInvoicePaymentProvider) {
    sendInvoicePaymentProvider.textContent =
        paymentDetails.paymentProvider ||
        "-";
}

const sendInvoicePaymentMethod =
    document.getElementById(
        "sendInvoicePaymentMethod"
    );

if (sendInvoicePaymentMethod) {
    sendInvoicePaymentMethod.textContent =
        paymentDetails.paymentMethod ||
        "-";
}

const sendInvoicePaymentAccountNumber =
    document.getElementById(
        "sendInvoicePaymentAccountNumber"
    );

if (sendInvoicePaymentAccountNumber) {
    sendInvoicePaymentAccountNumber.textContent =
        paymentDetails.accountNumber ||
        "-";
}

const sendInvoicePaymentReference =
    document.getElementById(
        "sendInvoicePaymentReference"
    );

if (sendInvoicePaymentReference) {
    sendInvoicePaymentReference.textContent =
        paymentDetails.paymentReference ||
        paymentDetails.referenceNumber ||
        paymentDetails.paymentAccount ||
        paymentDetails.paymentLink ||
        "-";
}

const sendInvoicePaymentDueDays =
    document.getElementById(
        "sendInvoicePaymentDueDays"
    );

if (sendInvoicePaymentDueDays) {
    const paymentTerms =
        paymentDetails.paymentTerms || "";

    const paymentDueDays =
        paymentDetails.paymentDueDays || "";

    const paymentTermsLabels = {
        due_on_receipt: "Due on Receipt",
        "7_days": "Due in 7 Days",
        "15_days": "Due in 15 Days",
        "30_days": "Due in 30 Days",
        "60_days": "Due in 60 Days",
        "90_days": "Due in 90 Days"
    };

    sendInvoicePaymentDueDays.textContent =
        paymentDueDays
            ? `Due in ${paymentDueDays} Days`
            : paymentTermsLabels[paymentTerms] ||
              "-";
}

const sendInvoicePaymentInstructions =
    document.getElementById(
        "sendInvoicePaymentInstructions"
    );

if (sendInvoicePaymentInstructions) {
    sendInvoicePaymentInstructions.textContent =
        paymentDetails.paymentInstructions ||
        "-";
}

        const currencySymbol =
            invoice.currencySymbol ||
            "";

        const totalAmount =
            Number(
                invoice.totalAmount
            ) || 0;

        document.getElementById(
            "sendInvoiceAmount"
        ).textContent =
            `${currencySymbol}${totalAmount.toLocaleString(
                undefined,
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            )}`;

        const itemsContainer =
            document.getElementById(
                "sendInvoiceItems"
            );

        itemsContainer.innerHTML =
            "";

        items.forEach(item => {
            const row =
                document.createElement(
                    "div"
                );

            row.className =
                "send-invoice-item";

            row.innerHTML =
                `
                <span>
                    ${item.description || "-"}
                </span>

                <span>
                    ${item.quantity || 0}
                </span>

                <strong>
                    ${currencySymbol}${(
                        Number(
                            item.total
                        ) || 0
                    ).toLocaleString(
                        undefined,
                        {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        }
                    )}
                </strong>
                `;

            itemsContainer.appendChild(
                row
            );
        });

        document.getElementById(
            "sendInvoiceSubtotal"
        ).textContent =
            `${currencySymbol}${(
                Number(
                    invoice.subtotal
                ) || 0
            ).toLocaleString(
                undefined,
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            )}`;

        document.getElementById(
            "sendInvoiceTax"
        ).textContent =
            `${currencySymbol}${(
                Number(
                    invoice.taxAmount
                ) || 0
            ).toLocaleString(
                undefined,
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            )}`;

        document.getElementById(
            "sendInvoiceDiscount"
        ).textContent =
            `${currencySymbol}${(
                Number(
                    invoice.discount
                ) || 0
            ).toLocaleString(
                undefined,
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            )}`;

        document.getElementById(
            "sendInvoiceShipping"
        ).textContent =
            `${currencySymbol}${(
                Number(
                    invoice.shipping
                ) || 0
            ).toLocaleString(
                undefined,
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            )}`;

        document.getElementById(
            "sendInvoiceGrandTotal"
        ).textContent =
            `${currencySymbol}${totalAmount.toLocaleString(
                undefined,
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            )}`;

        document.getElementById(
            "sendInvoiceNotes"
        ).textContent =
            invoice.notes ||
            "-";

        document.getElementById(
            "sendInvoiceTerms"
        ).textContent =
            invoice.termsConditions ||
            "-";

        document.getElementById(
            "sendInvoiceSignatureName"
        ).textContent =
            invoice.signatureName ||
            "-";

        document.getElementById(
            "sendInvoiceSignatureTitle"
        ).textContent =
            invoice.signatureTitle ||
            "-";

        const message =
            document.getElementById(
                "sendInvoiceMessage"
            );

        if (message) {
            message.value =
                "";
        }

        const sendButton =
            document.getElementById(
                "confirmSendInvoiceButton"
            );

        if (sendButton) {
            sendButton.disabled =
                false;

            sendButton.innerHTML =
                `
                <i class="ri-send-plane-line"></i>
                Send Invoice
                `;
        }

        modal.classList.add(
            "show"
        );

        const overlay =
            document.getElementById(
                "sendInvoiceOverlay"
            );

        if (overlay) {
            overlay.classList.add(
                "show"
            );
        }

    } catch (error) {
        console.error(
            "Open Send Invoice Modal Error:",
            error
        );

        showToast(
            error.message ||
            "Unable to prepare invoice for sending.",
            "error"
        );
    }
}

function closeSendInvoiceModal() {
    const modal =
        document.getElementById(
            "sendInvoiceModal"
        );

    const overlay =
        document.getElementById(
            "sendInvoiceOverlay"
        );

    if (modal) {
        modal.classList.remove(
            "show"
        );

        delete modal.dataset.invoiceId;
    }

    if (overlay) {
        overlay.classList.remove(
            "show"
        );
    }
}

async function sendInvoiceToClient(button) {
    const modal =
        document.getElementById(
            "sendInvoiceModal"
        );

    if (!modal) {
        showToast(
            "Send invoice modal was not found.",
            "error"
        );

        return;
    }

    const invoiceId =
        modal.dataset.invoiceId;

    if (!invoiceId) {
        showToast(
            "Invoice ID is missing.",
            "error"
        );

        return;
    }

    const messageElement =
        document.getElementById(
            "sendInvoiceMessage"
        );

    const message =
        messageElement
            ? messageElement.value.trim()
            : "";

    if (
        !button ||
        button.disabled
    ) {
        return;
    }

    try {
        button.disabled =
            true;

        const originalContent =
            button.innerHTML;

        button.dataset.originalContent =
            originalContent;

        button.innerHTML =
            `
            <i class="ri-loader-4-line ri-spin"></i>
            Sending...
            `;

        const result =
            await Parse.Cloud.run(
                "sendInvoiceToClient",
                {
                    invoiceId,
                    message
                }
            );

        if (
            !result ||
            result.success !== true
        ) {
            throw new Error(
                result &&
                result.message
                    ? result.message
                    : "Invoice could not be sent."
            );
        }

        closeSendInvoiceModal();

        showToast(
            result.message ||
            "Invoice sent successfully.",
            "success"
        );

        const sentButton =
            document.querySelector(
                '.send-client-invoice-button[data-id="' +
                invoiceId +
                '"]'
            );

        if (sentButton) {
            sentButton.outerHTML =
                `
                <span class="invoice-sent-label">
                    Sent
                </span>
                `;
        }

    } catch (error) {
        console.error(
            "Send Invoice Error:",
            error
        );

        showToast(
            error.message ||
            "Unable to send invoice.",
            "error"
        );

        button.disabled =
            false;

        button.innerHTML =
            button.dataset.originalContent ||
            `
            <i class="ri-send-plane-line"></i>
            Send Invoice
            `;
    }
}

function initializeSendInvoiceModal() {
    const confirmButton =
        document.getElementById(
            "confirmSendInvoiceButton"
        );

    const closeButton =
        document.getElementById(
            "closeSendInvoiceButton"
        );

    const cancelButton =
        document.getElementById(
            "cancelSendInvoiceButton"
        );

    const overlay =
        document.getElementById(
            "sendInvoiceOverlay"
        );

    if (confirmButton) {
        confirmButton.addEventListener(
            "click",
            () => {
                sendInvoiceToClient(
                    confirmButton
                );
            }
        );
    }

    if (closeButton) {
        closeButton.addEventListener(
            "click",
            closeSendInvoiceModal
        );
    }

    if (cancelButton) {
        cancelButton.addEventListener(
            "click",
            closeSendInvoiceModal
        );
    }

    if (overlay) {
        overlay.addEventListener(
            "click",
            closeSendInvoiceModal
        );
    }
}

async function uploadInvoiceSignature() {
    const file =
        invoiceSignatureImageInput.files?.[0];

    if (!file) {
        return "";
    }

    const parseFile =
        new Parse.File(
            file.name,
            file
        );

    await parseFile.save();

    return parseFile;
}

function collectInvoiceSaveData(statusOverride) {
    const totals =
        calculateInvoiceTotals();

    const rawItems =
        getInvoiceItems();

    const items =
        rawItems.map(item => ({
            description:
                item.name,

            quantity:
                Number(item.quantity) || 0,

            unitPrice:
                Number(item.rate) || 0,

            total:
                Number(item.amount) || 0
        }));

    const client =
        selectedInvoiceClient || {};

    const selectedStatus =
        statusOverride ||
        invoicePaymentStatusSelect.value ||
        invoicePaymentStatusInput.value ||
        "Pending";

    const paymentDetails = {
        ...(invoicePaymentDetails || {})
    };

    return {
        clientId:
            invoiceClientInput.value,

        invoiceTitle:
            invoiceTitleInput.value.trim(),

        projectName:
            invoiceProjectNameInput.value.trim(),

        referenceNumber:
            invoiceReferenceNumberInput.value.trim(),

        purchaseOrder:
            invoicePurchaseOrderInput.value.trim(),

        issueDate:
            invoiceIssueDateInput.value,

        dueDate:
            invoiceDueDateInput.value,

        validityMessage:
            "",

        customerNotes:
            "",

        currencyCode:
            invoiceCurrencyInput.value,

        currencySymbol:
            invoiceCurrencySymbol,

        status:
            selectedStatus,

        contactPerson:
            client.contactPerson || "",

        companyName:
            client.companyName || "",

        clientEmail:
            client.clientEmail || "",

        clientPhone:
            client.clientPhone || "",

        clientTaxId:
            client.clientTaxId || "",

        billingAddress:
            [
                client.billingAddressLine1,
                client.billingAddressLine2,
                client.billingCityStateZip,
                client.billingCountry
            ]
                .filter(Boolean)
                .join(", "),

        billingAddressLine1:
            client.billingAddressLine1 || "",

        billingAddressLine2:
            client.billingAddressLine2 || "",

        billingCityStateZip:
            client.billingCityStateZip || "",

        billingCountry:
            client.billingCountry || "",

        items,

        subtotal:
            totals.subtotal,

        taxPercent:
            totals.taxPercent,

        tax:
            totals.tax,

        discount:
            totals.discount,

        shipping:
            totals.shipping,

        totalAmount:
            totals.totalAmount,

        paymentTerms:
            invoicePaymentTermsInput.value,

        paymentDetails,

        notes:
            invoiceNotesInput.value.trim(),

        termsConditions:
            invoiceTermsInput.value.trim(),

        signatureName:
            invoiceSignatureNameInput.value.trim(),

        signatureTitle:
            invoiceSignatureTitleInput.value.trim()
    };
}

async function saveInvoice(statusOverride) {
    const validation =
        validateInvoiceForm();

    if (!validation.valid) {
        showToast(
            validation.message,
            "error"
        );

        return;
    }

    const totals =
        calculateInvoiceTotals();

    const rawItems =
        getInvoiceItems();

    if (!rawItems.length) {
        showToast(
            "At least one invoice item is required.",
            "error"
        );

        return;
    }

    const invalidItem =
        rawItems.find(
            item =>
                !item.name ||
                Number(item.quantity) <= 0 ||
                Number(item.rate) < 0
        );

    if (invalidItem) {
        showToast(
            "Please complete all invoice items correctly.",
            "error"
        );

        return;
    }

    if (
        Number(totals.totalAmount) <= 0
    ) {
        showToast(
            "Invoice total must be greater than zero.",
            "error"
        );

        return;
    }

    const buttons = [
        saveInvoiceDraftButton,
        saveInvoiceButton
    ];

    buttons.forEach(
        button => {
            if (button) {
                button.disabled = true;
            }
        }
    );

    try {
        showLoading();

        const data =
            collectInvoiceSaveData(
                statusOverride
            );

        const signatureFile =
            await uploadInvoiceSignature();

        data.signatureImage =
            signatureFile;

        let result;

        if (
            editingInvoice &&
            editingInvoiceId
        ) {
            result =
                await Parse.Cloud.run(
                    "updateInvoice",
                    {
                        invoiceId:
                            editingInvoiceId,
                        ...data
                    }
                );
        } else {
            result =
                await Parse.Cloud.run(
                    "createInvoice",
                    data
                );
        }

        if (
            !result ||
            result.success === false
        ) {
            throw new Error(
                result?.message ||
                "Unable to save invoice."
            );
        }

        currentPage = 1;

        closeCreateInvoiceModal();

        resetInvoiceModal();

        await loadInvoices();

        await loadInvoiceStatistics();

        showToast(
            result.message ||
            (
                editingInvoice
                    ? "Invoice updated successfully."
                    : "Invoice created successfully."
            ),
            "success"
        );

        editingInvoice =
            false;

        editingInvoiceId =
            null;

        selectedInvoice =
            null;

        selectedInvoiceClient =
            null;

        selectedInvoiceItems =
            [];

    } catch (error) {
        console.error(
            "Save Invoice Error:",
            error
        );

        showToast(
            error.message ||
            "Unable to save invoice.",
            "error"
        );
        
        handleInvoiceBackendError(
    error,
    "Unable to save invoice."
);

    } finally {
        hideLoading();

        buttons.forEach(
            button => {
                if (button) {
                    button.disabled = false;
                }
            }
        );
    }
}

function initializeInvoiceSaveWorkflow() {
    if (saveInvoiceButton) {
    saveInvoiceButton.addEventListener(
        "click",
        async () => {
            await saveInvoice(
                "Pending"
            );
        }
    );
}

    if (saveInvoiceDraftButton) {
    saveInvoiceDraftButton.addEventListener(
        "click",
        async () => {
            await saveInvoiceDraft();
        }
    );
}
}

function collectInvoiceDraftData() {
    const totals = calculateInvoiceTotals();
    const rawItems = getInvoiceItems();
    const client = selectedInvoiceClient || {};

    const items = rawItems.map(item => ({
        description: item.name || "",
        quantity: Number(item.quantity) || 0,
        unitPrice: Number(item.rate) || 0,
        total: Number(item.amount) || 0
    }));

    return {
        clientId: invoiceClientInput.value || "",
        invoiceTitle: invoiceTitleInput.value.trim(),
        projectName: invoiceProjectNameInput.value.trim(),
        referenceNumber: invoiceReferenceNumberInput.value.trim(),
        purchaseOrder: invoicePurchaseOrderInput.value.trim(),
        issueDate: invoiceIssueDateInput.value || "",
        dueDate: invoiceDueDateInput.value || "",
        currencyCode: invoiceCurrencyInput.value || "",
        currencySymbol: invoiceCurrencySymbol || "$",
        status: "Draft",
        contactPerson: client.contactPerson || "",
        companyName: client.companyName || "",
        clientEmail: client.clientEmail || "",
        clientPhone: client.clientPhone || "",
        clientTaxId: client.clientTaxId || "",
        billingAddress: [
            client.billingAddressLine1,
            client.billingAddressLine2,
            client.billingCityStateZip,
            client.billingCountry
        ].filter(Boolean).join(", "),
        billingAddressLine1: client.billingAddressLine1 || "",
        billingAddressLine2: client.billingAddressLine2 || "",
        billingCityStateZip: client.billingCityStateZip || "",
        billingCountry: client.billingCountry || "",
        items,
        subtotal: Number(totals.subtotal) || 0,
        taxPercent: Number(totals.taxPercent) || 0,
        tax: Number(totals.tax) || 0,
        discount: Number(totals.discount) || 0,
        shipping: Number(totals.shipping) || 0,
        totalAmount: Number(totals.totalAmount) || 0,
        paymentTerms: invoicePaymentTermsInput.value || "",
        paymentDetails: {
            ...(invoicePaymentDetails || {})
        },
        notes: invoiceNotesInput.value.trim(),
        termsConditions: invoiceTermsInput.value.trim(),
        signatureName: invoiceSignatureNameInput.value.trim(),
        signatureTitle: invoiceSignatureTitleInput.value.trim()
    };
}

async function saveInvoiceDraft() {
    const buttons = [
        saveInvoiceDraftButton,
        saveInvoiceButton
    ];

    buttons.forEach(button => {
        if (button) {
            button.disabled = true;
        }
    });

    try {
        showLoading();

        const data = collectInvoiceDraftData();

        let result;

        if (editingInvoice && editingInvoiceId) {
            result = await Parse.Cloud.run(
                "updateInvoice",
                {
                    invoiceId: editingInvoiceId,
                    ...data
                }
            );
        } else {
            result = await Parse.Cloud.run(
                "createInvoice",
                data
            );
        }

        if (!result || result.success === false) {
            throw new Error(
                result?.message ||
                "Unable to save invoice draft."
            );
        }

        currentPage = 1;

        await loadInvoices();
        await loadInvoiceStatistics();

        closeCreateInvoiceModal();
        resetInvoiceModal();

        editingInvoice = false;
        editingInvoiceId = null;
        selectedInvoice = null;
        selectedInvoiceClient = null;
        selectedInvoiceItems = [];

        showToast(
            result.message ||
            "Invoice draft saved successfully.",
            "success"
        );

    } catch (error) {
        console.error(
            "Save Invoice Draft Error:",
            error
        );

        showToast(
            error.message ||
            "Unable to save invoice draft.",
            "error"
        );
        
        handleInvoiceBackendError(
    error,
    "Unable to save invoice draft"
);

    } finally {
        hideLoading();

        buttons.forEach(button => {
            if (button) {
                button.disabled = false;
            }
        });
    }
}

function isInvoiceLimitError(error) {
    const message =
        error?.message ||
        error?.error ||
        "";

    return message
        .toLowerCase()
        .includes(
            "invoice limit"
        );
}

function showInvoiceLimitModal() {
    if (!invoiceLimitOverlay) {
        return;
    }

    if (invoiceLimitTitle) {
        invoiceLimitTitle.textContent =
            "Invoice Limit Reached";
    }

    if (invoiceLimitMessage) {
        invoiceLimitMessage.textContent =
            "You've reached your invoice limit. Upgrade your plan.";
    }

    invoiceLimitOverlay.classList.add(
        "active"
    );

    if (invoiceLimitModal) {
        invoiceLimitModal.classList.add(
            "active"
        );
    }
}

function showLoading(message = "Please wait...") {
    const loadingOverlay = document.getElementById("loadingOverlay");
    const loadingText = document.querySelector(".loading-text");

    if (!loadingOverlay) return;

    if (loadingText) {
        loadingText.textContent = message;
    }

    loadingOverlay.classList.add("active");
}

function hideLoading() {
    const loadingOverlay = document.getElementById("loadingOverlay");

    if (!loadingOverlay) return;

    loadingOverlay.classList.remove("active");
}

function closeInvoiceLimitModal() {
    if (invoiceLimitOverlay) {
        invoiceLimitOverlay.classList.remove(
            "active"
        );
    }

    if (invoiceLimitModal) {
        invoiceLimitModal.classList.remove(
            "active"
        );
    }
}

function initializeInvoiceLimitModal() {
    if (invoiceLimitButton) {
        invoiceLimitButton.addEventListener(
            "click",
            () => {
                closeInvoiceLimitModal();

                window.location.href =
                    "subscription.html?section=subscription";
            }
        );
    }

    if (invoiceLimitOverlay) {
        invoiceLimitOverlay.addEventListener(
            "click",
            event => {
                if (
                    event.target ===
                    invoiceLimitOverlay
                ) {
                    closeInvoiceLimitModal();
                }
            }
        );
    }
}

function handleInvoiceBackendError(
    error,
    fallbackMessage
) {
    console.error(
        "Invoice Backend Error:",
        error
    );

    if (
        isInvoiceLimitError(error)
    ) {
        showInvoiceLimitModal();

        return true;
    }

    showToast(
        error?.message ||
        fallbackMessage ||
        "Something went wrong.",
        "error"
    );

    return false;
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
        
        userFullName.textContent =
            profile.fullName || "-";

    }

    catch (error) {

        console.error(error);

        showToast(
            
            error.message || error, "error"
        );

    }

}

async function initializeInvoicePage() {
    loadUserProfile();
    initializeCreateInvoiceModal();
    initializeInvoiceForm();
    initializeInvoiceClientSelection();
    initializeInvoiceItems();
    initializeInvoiceSearchFilterSort();

    if (filterInvoicesBtn) {
        initializeInvoiceFilterButton();
    }

    initializeInvoicePagination();
    initializeInvoiceTableActions();
    initializeInvoicePreviewListeners();
    initializeInvoicePreviewRefresh();
    initializeInvoicePdfDownload();
    initializeInvoiceExport();
    initializeInvoicePrint();
    initializeInvoiceFullscreen();
    initializeInvoicePreviewZoom();
    initializeInvoicePreviewModal();

    await loadInvoiceClients();
    await loadInvoiceStatistics();
    await loadInvoices();
    await initializeInvoicePreview();
    initializeSendInvoiceModal();
    showToast("Page Loaded Successfully");

}
document.addEventListener(
    "DOMContentLoaded",
    initializeInvoicePage
);