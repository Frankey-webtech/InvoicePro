document.addEventListener(
    "click",
    function(event){

        const sendButton =
            event.target.closest(
                ".send-client-invoice-button"
            );

        if(!sendButton){
            return;
        }

        const invoiceId =
            sendButton.dataset.id;

        if(!invoiceId){

            showToast(
                "Invoice ID is missing.",
                "error"
            );

            return;
        }

        openSendInvoiceModal(
            invoiceId
        );

    }
);


async function openSendInvoiceModal(
    invoiceId
){

    try{

        showLoader();

        const result =
            await Parse.Cloud.run(
                "getInvoiceDetails",
                {
                    invoiceId:
                        invoiceId
                }
            );

        if(
            !result ||
            !result.invoice
        ){

            throw new Error(
                "Unable to load invoice details."
            );

        }

        const invoice =
            result.invoice;

        const client =
            result.client || {};

        const items =
            Array.isArray(
                result.items
            )
                ? result.items
                : [];

        const paymentDetails =
            result.paymentDetails ||
            invoice.paymentDetails ||
            {};

        const currencySymbol =
            result.currencySymbol ||
            invoice.currencySymbol ||
            "";

        const clientName =
            client.contactPerson ||
            client.companyName ||
            invoice.contactPerson ||
            invoice.companyName ||
            "Client";

        const clientEmail =
            client.clientEmail ||
            invoice.clientEmail ||
            "";

        setSendInvoiceText(
            "sendInvoiceClientName",
            clientName
        );
        
        if (sendInvoiceClientImage) {

    if (client.clientImageUrl) {

        sendInvoiceClientImage.src =
            client.clientImageUrl;

        sendInvoiceClientImage.style.display =
            "block";

        if (sendInvoiceClientImageFallback) {

            sendInvoiceClientImageFallback.style.display =
                "none";

        }

    } else {

        sendInvoiceClientImage.removeAttribute(
            "src"
        );

        sendInvoiceClientImage.style.display =
            "none";

        if (sendInvoiceClientImageFallback) {

            sendInvoiceClientImageFallback.style.display =
                "block";

        }

    }

}

        setSendInvoiceText(
            "sendInvoiceClientEmail",
            clientEmail || "-"
        );

        setSendInvoiceText(
            "sendInvoiceNumber",
            invoice.invoiceNumber || "-"
        );

        setSendInvoiceText(
            "sendInvoiceTitle",
            invoice.invoiceTitle ||
            invoice.projectName ||
            "Invoice"
        );

        setSendInvoiceText(
            "sendInvoiceIssueDate",
            formatInvoiceDate(
                invoice.issueDate
            )
        );

        setSendInvoiceText(
            "sendInvoiceDueDate",
            formatInvoiceDate(
                invoice.dueDate
            )
        );

        setSendInvoiceText(
            "sendInvoicePaymentTerms",
            invoice.paymentTerms || "-"
        );

        setSendInvoiceText(
            "sendInvoiceCurrency",
            invoice.currencyCode
                ? invoice.currencyCode +
                  " (" +
                  currencySymbol +
                  ")"
                : currencySymbol || "-"
        );

        setSendInvoiceText(
            "sendInvoicePaymentStatus",
            invoice.status || "Draft"
        );

        setSendInvoiceText(
            "sendInvoiceAmount",
            formatInvoiceMoney(
                invoice.totalAmount,
                currencySymbol
            )
        );

        renderSendInvoiceItems(
            items,
            currencySymbol
        );

        setSendInvoiceText(
            "sendInvoiceSubtotal",
            formatInvoiceMoney(
                invoice.subtotal,
                currencySymbol
            )
        );

        setSendInvoiceText(
            "sendInvoiceTax",
            formatInvoiceMoney(
                invoice.tax,
                currencySymbol
            )
        );

        setSendInvoiceText(
            "sendInvoiceDiscount",
            formatInvoiceMoney(
                invoice.discount,
                currencySymbol
            )
        );

        setSendInvoiceText(
            "sendInvoiceShipping",
            formatInvoiceMoney(
                invoice.shipping,
                currencySymbol
            )
        );

        setSendInvoiceText(
            "sendInvoiceGrandTotal",
            formatInvoiceMoney(
                invoice.totalAmount,
                currencySymbol
            )
        );

        populateSendInvoicePayment(
            paymentDetails
        );

        setSendInvoiceText(
            "sendInvoiceNotes",
            invoice.notes || "-"
        );

        setSendInvoiceText(
            "sendInvoiceTerms",
            invoice.termsConditions || "-"
        );

        setSendInvoiceText(
            "sendInvoiceSignatureName",
            invoice.signatureName || "-"
        );

        setSendInvoiceText(
            "sendInvoiceSignatureTitle",
            invoice.signatureTitle || "-"
        );

        const signatureImage =
            document.getElementById(
                "sendInvoiceSignatureImage"
            );

        if(signatureImage){

            if(invoice.signatureImage){

                signatureImage.src =
                    invoice.signatureImage;

                signatureImage.style.display =
                    "block";

            }else{

                signatureImage.removeAttribute(
                    "src"
                );

                signatureImage.style.display =
                    "none";

            }

        }

        updateSendInvoiceSectionVisibility(
            "sendInvoicePaymentSection",
            hasPaymentDetails(
                paymentDetails
            )
        );

        updateSendInvoiceSectionVisibility(
            "sendInvoiceNotesSection",
            !!(
                invoice.notes &&
                String(
                    invoice.notes
                ).trim()
            )
        );

        updateSendInvoiceSectionVisibility(
            "sendInvoiceTermsSection",
            !!(
                invoice.termsConditions &&
                String(
                    invoice.termsConditions
                ).trim()
            )
        );

        updateSendInvoiceSectionVisibility(
            "sendInvoiceSignatureSection",
            !!(
                invoice.signatureName ||
                invoice.signatureTitle ||
                invoice.signatureImage
            )
        );

        const message =
            document.getElementById(
                "sendInvoiceMessage"
            );

        if(message){

            message.value = "";

        }

        const modal =
            document.getElementById(
                "sendInvoiceModal"
            );

        if(!modal){

            throw new Error(
                "Send invoice modal was not found."
            );

        }

        modal.dataset.invoiceId =
            invoiceId;

        const overlay =
            document.getElementById(
                "sendInvoiceOverlay"
            );

        if(overlay){

            overlay.classList.add(
                "show"
            );

        }

        modal.classList.add(
            "show"
        );

        document.body.classList.add(
            "send-invoice-modal-open"
        );

    }

    catch(error){

        console.error(
            "Open Send Invoice Error:",
            error
        );

        showToast(
            error.message ||
            "Unable to load invoice.",
            "error"
        );

    }

    finally{

        hideLoader();

    }

}


function setSendInvoiceText(
    id,
    value
){

    const element =
        document.getElementById(
            id
        );

    if(!element){
        return;
    }

    element.textContent =
        value === null ||
        value === undefined ||
        value === ""
            ? "-"
            : value;

}


function formatInvoiceDate(
    value
){

    if(!value){
        return "-";
    }

    const date =
        new Date(
            value
        );

    if(
        Number.isNaN(
            date.getTime()
        )
    ){

        return "-";

    }

    return date.toLocaleDateString(
        undefined,
        {
            year:
                "numeric",
            month:
                "short",
            day:
                "numeric"
        }
    );

}


function formatInvoiceMoney(
    value,
    currencySymbol
){

    const amount =
        Number(
            value || 0
        );

    return (
        currencySymbol || ""
    ) +
    amount.toLocaleString(
        undefined,
        {
            minimumFractionDigits:
                2,
            maximumFractionDigits:
                2
        }
    );

}


function renderSendInvoiceItems(
    items,
    currencySymbol
){

    const container =
        document.getElementById(
            "sendInvoiceItems"
        );

    if(!container){
        return;
    }

    if(
        !Array.isArray(items) ||
        !items.length
    ){

        container.innerHTML =
            `
            <div class="send-invoice-empty-items">
                No invoice items available.
            </div>
            `;

        return;

    }

    container.innerHTML =
        items.map(
            function(item, index){

                const description =
                    item.description ||
                    "Item";

                const quantity =
                    Number(
                        item.quantity || 0
                    );

                const unitPrice =
                    Number(
                        item.unitPrice || 0
                    );

                const total =
                    Number(
                        item.total ||
                        quantity * unitPrice
                    );

                return `
                    <div class="send-invoice-item-row">

                        <div class="send-invoice-item-number">
                            ${index + 1}
                        </div>

                        <div class="send-invoice-item-description">
                            ${escapeSendInvoiceHtml(
                                description
                            )}
                        </div>

                        <div class="send-invoice-item-quantity">
                            ${quantity}
                        </div>

                        <div class="send-invoice-item-price">
                            ${formatInvoiceMoney(
                                unitPrice,
                                currencySymbol
                            )}
                        </div>

                        <div class="send-invoice-item-total">
                            ${formatInvoiceMoney(
                                total,
                                currencySymbol
                            )}
                        </div>

                    </div>
                `;

            }
        ).join("");

}


function populateSendInvoicePayment(
    paymentDetails
){

    setSendInvoiceText(
        "sendInvoicePaymentAccountName",
        paymentDetails.accountName ||
        paymentDetails.account_name ||
        "-"
    );

    setSendInvoiceText(
        "sendInvoicePaymentBankName",
        paymentDetails.bankName ||
        paymentDetails.bank_name ||
        "-"
    );

    setSendInvoiceText(
        "sendInvoicePaymentProvider",
        paymentDetails.paymentProvider ||
        paymentDetails.provider ||
        "-"
    );

    setSendInvoiceText(
        "sendInvoicePaymentMethod",
        paymentDetails.paymentMethod ||
        paymentDetails.method ||
        "-"
    );

    setSendInvoiceText(
        "sendInvoicePaymentAccountNumber",
        paymentDetails.accountNumber ||
        paymentDetails.account_number ||
        "-"
    );

    setSendInvoiceText(
        "sendInvoicePaymentReference",
        paymentDetails.paymentReference ||
        paymentDetails.reference ||
        "-"
    );

    setSendInvoiceText(
        "sendInvoicePaymentDueDays",
        paymentDetails.paymentDueDays ||
        paymentDetails.dueDays ||
        "-"
    );

    setSendInvoiceText(
        "sendInvoicePaymentInstructions",
        paymentDetails.paymentInstructions ||
        paymentDetails.instructions ||
        "-"
    );

}


function hasPaymentDetails(
    paymentDetails
){

    if(
        !paymentDetails ||
        typeof paymentDetails !==
            "object"
    ){

        return false;

    }

    return Object.values(
        paymentDetails
    ).some(
        function(value){

            return (
                value !== null &&
                value !== undefined &&
                String(
                    value
                ).trim() !== ""
            );

        }
    );

}


function updateSendInvoiceSectionVisibility(
    id,
    visible
){

    const section =
        document.getElementById(
            id
        );

    if(!section){
        return;
    }

    section.style.display =
        visible
            ? ""
            : "none";

}


function escapeSendInvoiceHtml(
    value
){

    return String(
        value || ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


function closeSendInvoiceModal(){

    const modal =
        document.getElementById(
            "sendInvoiceModal"
        );

    const overlay =
        document.getElementById(
            "sendInvoiceOverlay"
        );

    if(modal){

        modal.classList.remove(
            "show"
        );

        delete modal.dataset.invoiceId;

    }

    if(overlay){

        overlay.classList.remove(
            "show"
        );

    }

    document.body.classList.remove(
        "send-invoice-modal-open"
    );

}


document.addEventListener(
    "click",
    function(event){

        if(
            event.target.closest(
                "#closeSendInvoiceButton"
            )
        ){

            closeSendInvoiceModal();

            return;

        }

        if(
            event.target.closest(
                "#cancelSendInvoiceButton"
            )
        ){

            closeSendInvoiceModal();

            return;

        }

        if(
            event.target.closest(
                "#sendInvoiceOverlay"
            )
        ){

            closeSendInvoiceModal();

            return;

        }

        const confirmButton =
            event.target.closest(
                "#confirmSendInvoiceButton"
            );

        if(confirmButton){

            sendInvoiceToClient(
                confirmButton
            );

        }

    }
);


async function sendInvoiceToClient(
    button
){

    const modal =
        document.getElementById(
            "sendInvoiceModal"
        );

    if(!modal){

        showToast(
            "Send invoice modal was not found.",
            "error"
        );

        return;

    }

    const invoiceId =
        modal.dataset.invoiceId;

    if(!invoiceId){

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

    if(button.disabled){

        return;

    }

    try{

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
                    invoiceId:
                        invoiceId,

                    message:
                        message
                }
            );

        if(
            !result ||
            result.success !== true
        ){

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

        if(sentButton){

            const parent =
                sentButton.parentElement;

            if(parent){

                sentButton.outerHTML =
                    `
                    <span class="invoice-sent-label">
                        Sent
                    </span>
                    `;

            }

        }

    }

    catch(error){

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


document.addEventListener(
    "keydown",
    function(event){

        if(
            event.key !== "Escape"
        ){

            return;

        }

        const modal =
            document.getElementById(
                "sendInvoiceModal"
            );

        if(
            modal &&
            modal.classList.contains(
                "show"
            )
        ){

            closeSendInvoiceModal();

        }

    }
);

const profileMenuButton =
document.getElementById("profileMenBtn");
console.log("hello:", profileMenuButton);


if(profileMenuButton){
profileMenuButton.addEventListener(
    "click",
    function (event) {

        event.stopPropagation();

        profileDropdown.classList.toggle(
            "show"
        );

    }
);
}

const profileDropdown =
document.getElementById("profileDropdown");
