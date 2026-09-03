async function loadAllUpcomingPayments() {

    const paymentsList =
        document.getElementById(
            "upcomingPaymentsList"
        );

    const paymentsCount =
        document.getElementById(
            "upcomingPaymentsCount"
        );

    const emptyState =
        document.getElementById(
            "upcomingPaymentsEmpty"
        );

    const errorState =
        document.getElementById(
            "upcomingPaymentsError"
        );

    const errorMessage =
        document.getElementById(
            "upcomingPaymentsErrorMessage"
        );

    if (!paymentsList) {
        return;
    }

    if (emptyState) {
        emptyState.style.display = "none";
    }

    if (errorState) {
        errorState.style.display = "none";
    }

    paymentsList.innerHTML = `

        <div class="upcomingPaymentLoading">

            <div class="upcomingPaymentLoadingIcon">
                <i class="ri-loader-4-line"></i>
            </div>

            <div>

                <h3>
                    Loading payments...
                </h3>

                <p>
                    Please wait while your upcoming payments are loaded.
                </p>

            </div>

        </div>

    `;

    try {

        const result =
            await Parse.Cloud.run(
                "upcomingPaymentReminder"
            );

        if (
            !result ||
            result.success !== true
        ) {
            throw new Error(
                "Unable to load upcoming payments."
            );
        }

        const invoices =
            Array.isArray(result.invoices)
                ? result.invoices
                : [];

        if (paymentsCount) {

            paymentsCount.textContent =
                `${invoices.length} ${invoices.length === 1 ? "Payment" : "Payments"}`;

        }

        if (invoices.length === 0) {

            paymentsList.innerHTML = "";

            if (emptyState) {
                emptyState.style.display = "block";
            }

            return;
        }

        paymentsList.innerHTML = "";

        invoices.forEach(invoice => {

            const title =
                invoice.invoiceTitle ||
                invoice.invoiceNumber ||
                "Upcoming Payment";

            const invoiceNumber =
                invoice.invoiceNumber ||
                "";

            const projectName =
                invoice.projectName ||
                invoice.companyName ||
                "";

            const contactPerson =
                invoice.contactPerson ||
                "";

            const amount =
                invoice.totalAmount != null
                    ? `${invoice.currencySymbol || invoice.currencyCode || ""}${Number(invoice.totalAmount).toLocaleString()}`
                    : "Amount unavailable";

            const reminderMessage =
                invoice.reminderMessage ||
                "";

            let dueDate = "";

            if (invoice.dueDate) {

                const date =
                    new Date(
                        invoice.dueDate
                    );

                if (
                    !Number.isNaN(
                        date.getTime()
                    )
                ) {

                    dueDate =
                        date.toLocaleDateString(
                            undefined,
                            {
                                day: "numeric",
                                month: "short",
                                year: "numeric"
                            }
                        );

                }

            }

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "upcomingPaymentCard";

            card.innerHTML = `

                <div class="upcomingPaymentIndicator"></div>

                <div class="upcomingPaymentMain">

                    <div class="upcomingPaymentTop">

                        <div>

                            <h3 class="upcomingPaymentTitle">
                                ${title}
                            </h3>

                            ${
                                invoiceNumber
                                    ? `
                                        <p class="upcomingPaymentInvoice">
                                            Invoice ${invoiceNumber}
                                        </p>
                                    `
                                    : ""
                            }

                        </div>

                        <div class="upcomingPaymentAmount">
                            ${amount}
                        </div>

                    </div>

                    <div class="upcomingPaymentDetails">

                        ${
                            projectName
                                ? `
                                    <span class="upcomingPaymentDetail">
                                        <i class="ri-briefcase-4-line"></i>
                                        ${projectName}
                                    </span>
                                `
                                : ""
                        }

                        ${
                            contactPerson
                                ? `
                                    <span class="upcomingPaymentDetail">
                                        <i class="ri-user-line"></i>
                                        ${contactPerson}
                                    </span>
                                `
                                : ""
                        }

                        ${
                            dueDate
                                ? `
                                    <span class="upcomingPaymentDetail">
                                        <i class="ri-calendar-line"></i>
                                        ${dueDate}
                                    </span>
                                `
                                : ""
                        }

                    </div>

                </div>

                ${
                    reminderMessage
                        ? `
                            <div class="upcomingPaymentReminder">
                                ${reminderMessage}
                            </div>
                        `
                        : ""
                }

            `;

            paymentsList.appendChild(
                card
            );

        });

    }
    catch (error) {

        console.error(
            "All Upcoming Payments Error:",
            error
        );

        paymentsList.innerHTML = "";

        if (paymentsCount) {
            paymentsCount.textContent =
                "Unable to load";
        }

        if (errorMessage) {

            errorMessage.textContent =
                error.message ||
                "Something went wrong while loading your upcoming payments.";

        }

        if (errorState) {
            errorState.style.display = "block";
        }

    }

}

const retryUpcomingPayments =
    document.getElementById(
        "retryUpcomingPayments"
    );

if (retryUpcomingPayments) {

    retryUpcomingPayments.addEventListener(
        "click",
        loadAllUpcomingPayments
    );

}