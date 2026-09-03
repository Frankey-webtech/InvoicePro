const paymentSummary =
document.querySelector(".payment-summary");

const historyTableBody =
document.querySelector(".history-table tbody");

const tableFooter =
document.querySelector(".table-footer");

const paymentModalOverlay =
document.querySelector(".paymentModalOverlay");

const paymentModal =
document.querySelector(".paymentModal");

const closePaymentModal =
document.querySelector(".closePaymentModal");

const closeBtn =
document.querySelector(".closeBtn");

const exportBtn =
document.querySelector(".export-btn");

const rowsPerPage =
document.getElementById("rowsPerPage");

const totalPayments =
document.querySelectorAll(".summary-text h2")[0];

const totalSpent =
document.querySelectorAll(".summary-text h2")[1];

const activePlan =
document.querySelectorAll(".summary-text h2")[2];

const renewalDateCard =
document.querySelectorAll(".summary-text h2")[3];

const renewalSmall =
document.querySelectorAll(".summary-text small")[3];

const providerLogo =
document.getElementById(
"paymentProviderLogo"
);

const providerName =
document.getElementById(
"providerName"
);

const paymentAmount =
document.querySelector(
".paymentAmount"
);

const paymentDescription =
document.querySelector(
".providerDetails p"
);

const successBadge =
document.querySelector(
".successBadge"
);

let payments = [];

let currentPayment = null;

let currentPage = 1;

let rows = 6;

document.addEventListener("DOMContentLoaded", async () => {

    try {

        await loadCurrentSubscription();

        await loadPaymentHistory();

    }

    catch (error) {

        console.error(error);

    }

});

async function loadCurrentSubscription() {

    try {

        const response =
        await Parse.Cloud.run(
            "getCurrentSubscription"
        );

        if (!response.success) return;
        
        activePlan.textContent =
        response.plan || "Free";

        if (response.renewalDate) {

            const renewal =
            new Date(response.renewalDate);

            renewalDateCard.textContent =
            renewal.toLocaleDateString(
                "en-US",
                {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                }
            );

            const today =
            new Date();

            const diff =
            Math.ceil(

                (renewal - today) /

                (1000 * 60 * 60 * 24)

            );

            renewalSmall.textContent =

                diff > 0

                ? `In ${diff} days`

                : "Expired";

        }

        else {

            renewalDateCard.textContent =
            "--";

            renewalSmall.textContent =
            "No renewal";

        }

    }

    catch (error) {

        console.error(

            "Subscription Error:",

            error

        );

    }

}

async function loadPaymentHistory() {

    try {

        const response =
        await Parse.Cloud.run(
            "getSubscriptionPayments"
        );

        if (!response.success) {

            return;

        }

        payments = response.payments || [];

        totalPayments.textContent =
        payments.length;

        let total = 0;

        payments.forEach(payment => {

            total += Number(
                payment.amount || 0
            );

        });

        const currency =

            payments.length

            ? payments[0].currency

            : "₦";

        totalSpent.textContent =

            currency +

            total.toLocaleString();

        renderPaymentTable();
        updateTableFooter();

    }

    catch (error) {

        console.error(

            "Payment History Error",

            error

        );

    }

}

function updateTableFooter() {

    const start =

        payments.length === 0

        ? 0

        : ((currentPage - 1) * rows) + 1;

    const end =

        Math.min(

            currentPage * rows,

            payments.length

        );

    document.querySelector(

        ".results-text"

    ).innerHTML =

        `Showing
        <strong>${start}</strong>
        to
        <strong>${end}</strong>
        of
        <strong>${payments.length}</strong>
        payments`;

}

function renderPaymentTable() {

    historyTableBody.innerHTML = "";

    const start =
        (currentPage - 1) * rows;

    const end =
        start + rows;

    const pagePayments =
        payments.slice(start, end);

    if (pagePayments.length === 0) {

        historyTableBody.innerHTML = `
            <tr>

                <td colspan="9"
                    style="
                    text-align:center;
                    padding:50px;
                    color:#94A3B8;
                    ">

                    No payment history found.

                </td>

            </tr>
        `;

        return;

    }

    pagePayments.forEach(payment => {

        const paymentDate =
            new Date(payment.paymentDate);

        const renewalDate =
            payment.renewalDate
            ? new Date(payment.renewalDate)
            : null;

        const providerLogo =

            payment.provider === "PayPal"

            ? "PayPal.png"

            : "Paystack.png";

        const shortReference =

            payment.reference.length > 18

            ? payment.reference.substring(0,18) + "..."

            : payment.reference;

        const row = document.createElement("tr");

        row.innerHTML = `

<td>

<div class="payment-date">

<strong>

${paymentDate.toLocaleDateString("en-US",{

month:"short",

day:"numeric",

year:"numeric"

})}

</strong>

<span>

${paymentDate.toLocaleTimeString([],{

hour:"2-digit",

minute:"2-digit"

})}

</span>

</div>

</td>


<td>

<div class="reference">

<span
class="reference-text"
title="${payment.reference}">

${shortReference}

</span>

<i
class="ri-file-copy-line copyReference"
data-reference="${payment.reference}">

</i>

</div>

</td>


<td>

<div class="provider">

<img src="${providerLogo}">

<div>

<strong>

${payment.provider}

</strong>

<span class="provider-badge">

${payment.paymentMethod}

</span>

</div>

</div>

</td>


<td>

${payment.plan}

</td>


<td>

<strong>

${payment.currency}${Number(payment.amount).toLocaleString()}

</strong>

</td>


<td>

${payment.billing}

</td>


<td>

<span class="status success">

<i class="ri-checkbox-circle-fill"></i>

${payment.status}

</span>

</td>


<td>

${renewalDate ?

renewalDate.toLocaleDateString("en-US",{

month:"short",

day:"numeric",

year:"numeric"

})

:

"--"

}

</td>


<td>

<button
class="view-btn"
data-id="${payment.id}">

<i class="ri-eye-line"></i>

View

</button>

</td>

`;

        historyTableBody.appendChild(row);

    });

    attachViewEvents();

    attachCopyEvents();

}

function attachCopyEvents() {

    document
    .querySelectorAll(".copyReference")
    .forEach(icon => {

        icon.onclick = async () => {

            await navigator.clipboard.writeText(

                icon.dataset.reference

            );

        };

    });

}

function attachViewEvents() {

    document
    .querySelectorAll(".view-btn")
    .forEach(button => {

        button.onclick = () => {

            const payment = payments.find(

                p => p.id === button.dataset.id

            );

            if (!payment) return;

            currentPayment = payment;

            openPaymentModal(payment);

            paymentModalOverlay.style.display = "flex";

        };

    });

}

function openPaymentModal(payment) {

    if (payment.provider === "PayPal") {

        providerLogo.src = "PayPal.png";

    }

    else {

        providerLogo.src = "Paystack.png";

    }

    providerName.textContent =
    payment.provider;

    paymentAmount.textContent =
    payment.currency +
    Number(payment.amount).toLocaleString();

    paymentDescription.textContent =
    payment.plan + " " +
    payment.billing +
    " Subscription";

    successBadge.innerHTML =

    `<i class="ri-check-line"></i>
    ${payment.status}`;

    const paymentDate =
    new Date(payment.paymentDate);

    const renewalDate =
    payment.renewalDate
    ? new Date(payment.renewalDate)
    : null;

    document.getElementById(
    "modalReference").textContent =
    payment.reference;

    document.getElementById(
    "modalTransactionId").textContent =
    payment.transactionId;

    document.getElementById(
    "modalPaymentProvider").textContent =
    payment.provider;

    document.getElementById(
    "modalPlan").textContent =
    payment.plan;

    document.getElementById(
    "modalBilling").textContent =
    payment.billing;

    document.getElementById(
    "modalPaymentMethod").textContent =
    payment.paymentMethod;

    document.getElementById(
    "modalCurrency").textContent =
    payment.currency;

    document.getElementById(
    "modalStatus").textContent =
    payment.status;

    document.getElementById(
    "modalPaymentDate").textContent =

    paymentDate.toLocaleDateString(
        "en-US",
        {
            month:"long",
            day:"numeric",
            year:"numeric"
        }
    );

    document.getElementById(
    "modalPaymentTime").textContent =

    paymentDate.toLocaleTimeString(
        [],
        {
            hour:"2-digit",
            minute:"2-digit"
        }
    );

    document.getElementById(
    "modalRenewalDate").textContent =

    renewalDate ?

    renewalDate.toLocaleDateString(
        "en-US",
        {
            month:"long",
            day:"numeric",
            year:"numeric"
        }
    )

    :

    "--";

    document.getElementById(
    "modalReceiptReference").textContent =
    payment.reference;

    document.getElementById(
    "modalReceiptPlan").textContent =
    payment.plan;

    document.getElementById(
    "modalReceiptAmount").textContent =

    payment.currency +
    Number(payment.amount).toLocaleString();

    document.getElementById(
    "modalReceiptProvider").textContent =
    payment.provider;

    document.getElementById(
    "modalReceiptDate").textContent =

    paymentDate.toLocaleDateString(
        "en-US",
        {
            month:"long",
            day:"numeric",
            year:"numeric"
        }
    );

    paymentModalOverlay.style.display =
    "flex";

}

function closePaymentModalFunction(){

    paymentModalOverlay.style.display = "none";

    currentPayment = null;

}

closePaymentModal.addEventListener(
"click",
()=>{

    closePaymentModalFunction();

});

closeBtn.addEventListener(
"click",
()=>{

    closePaymentModalFunction();

});

paymentModalOverlay.addEventListener(
"click",
(e)=>{


    if(
        e.target === paymentModalOverlay
    ){

        closePaymentModalFunction();

    }


});

document.addEventListener(
"keydown",
(e)=>{


    if(
        e.key === "Escape"
    ){

        closePaymentModalFunction();

    }


});

rowsPerPage.addEventListener(
"change",
function(){

    rows = Number(this.value);

    currentPage = 1;

    renderPaymentTable();

    updateTableFooter();

    updatePagination();

});

function updatePagination(){

    const totalPages =

        Math.max(
            1,
            Math.ceil(
                payments.length / rows
            )
        );

    const pageButtons =

        document.querySelectorAll(

            ".pagination .page-btn"

        );

    if(pageButtons.length < 4){

        return;

    }

    pageButtons[1].textContent =
    currentPage;

    pageButtons[2].textContent =

        currentPage < totalPages

        ? currentPage + 1

        : totalPages;

    pageButtons.forEach(button=>{

        button.classList.remove("active");

    });

    pageButtons[1].classList.add("active");

}

const pagination =

document.querySelector(".pagination");

pagination.addEventListener(
"click",
function(e){

    const button =

    e.target.closest(".page-btn");

    if(!button) return;

    const buttons =

    pagination.querySelectorAll(".page-btn");

    const totalPages =

    Math.max(
        1,
        Math.ceil(
            payments.length / rows
        )
    );

    if(button === buttons[0]){

        if(currentPage > 1){

            currentPage--;

            renderPaymentTable();

            updateTableFooter();

            updatePagination();

        }

        return;

    }

    if(button === buttons[3]){

        if(currentPage < totalPages){

            currentPage++;

            renderPaymentTable();

            updateTableFooter();

            updatePagination();

        }

        return;

    }

    if(button === buttons[1]){

        currentPage =

        Number(button.textContent);

        renderPaymentTable();

        updateTableFooter();

        updatePagination();

        return;

    }

    if(button === buttons[2]){

        currentPage =

        Number(button.textContent);

        renderPaymentTable();

        updateTableFooter();

        updatePagination();

    }

});

function updatePagination(){

    const totalPages =

    Math.max(
        1,
        Math.ceil(
            payments.length / rows
        )
    );

    const buttons =

    document.querySelectorAll(
        ".pagination .page-btn"
    );

    if(buttons.length < 4) return;

    buttons[1].textContent =
    currentPage;

    buttons[2].textContent =

    currentPage + 1 <= totalPages

    ? currentPage + 1

    : currentPage;

    buttons.forEach(btn=>{

        btn.classList.remove("active");

    });

    buttons[1].classList.add("active");

    buttons[0].disabled =
    currentPage === 1;

    buttons[3].disabled =
    currentPage === totalPages;

}

const receiptBtn =

document.querySelector(".receiptBtn");

receiptBtn.addEventListener(
"click",
downloadReceipt
);

function downloadReceipt(){

    const receiptWindow =

    window.open(
        "",
        "_blank",
        "width=800,height=900"
    );

    receiptWindow.document.write(`
<!DOCTYPE html>
<html>
<head>

<title>InvoicePro Receipt</title>

<style>

body{

font-family:Arial,sans-serif;
padding:40px;
background:#f6f8fb;

}

.receipt{

max-width:650px;
margin:auto;
background:#fff;
padding:35px;
border-radius:14px;
border:1px solid #e5e7eb;

}

h1{

margin:0;
font-size:28px;

}

h1 span{

color:#2563eb;

}

.row{

display:flex;
justify-content:space-between;
padding:12px 0;
border-bottom:1px solid #ececec;

}

.amount{

font-size:34px;
font-weight:700;
margin:20px 0;

}

.footer{

text-align:center;
margin-top:35px;
color:#666;

}

</style>

</head>

<body>

<div class="receipt">

<h1>Invoice<span>Pro</span></h1>

<p>Subscription Payment Receipt</p>

<div class="amount">

${document.querySelector(".paymentAmount").textContent}

</div>

<div class="row">
<span>Reference</span>
<strong>${modalReference.textContent}</strong>
</div>

<div class="row">
<span>Transaction ID</span>
<strong>${modalTransactionId.textContent}</strong>
</div>

<div class="row">
<span>Provider</span>
<strong>${modalPaymentProvider.textContent}</strong>
</div>

<div class="row">
<span>Plan</span>
<strong>${modalPlan.textContent}</strong>
</div>

<div class="row">
<span>Billing</span>
<strong>${modalBilling.textContent}</strong>
</div>

<div class="row">
<span>Payment Method</span>
<strong>${modalPaymentMethod.textContent}</strong>
</div>

<div class="row">
<span>Payment Date</span>
<strong>${modalPaymentDate.textContent}</strong>
</div>

<div class="row">
<span>Renewal Date</span>
<strong>${modalRenewalDate.textContent}</strong>
</div>

<div class="footer">

Thank you for subscribing to InvoicePro.

</div>

</div>

</body>
</html>
`);

    receiptWindow.document.close();

    receiptWindow.print();

}

const printBtn =
document.querySelector(".printBtn");

printBtn.addEventListener(
    "click",
    printReceipt
);

function printReceipt(){

    downloadReceipt();

}