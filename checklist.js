const STORAGE_KEY = "invoiceProLaunchChecklist";

const checklistData = {
    project: "InvoicePro",
    version: "1.0",
    phases: [
        {
            id: 1,
            name: "Dashboard",
            priority: "required",
            tasks: [
                "Dashboard loads correctly",
                "Revenue statistics",
                "Invoice statistics",
                "Client statistics",
                "Estimate statistics",
                "Recent invoices",
                "Recent activity",
                "Revenue/financial overview",
                "Dashboard responsive on mobile",
                "Loading/error states work correctly"
            ]
        },
        {
            id: 2,
            name: "Invoices",
            priority: "required",
            tasks: [
                "Invoice list",
                "Create invoice",
                "Edit invoice",
                "Save invoice",
                "Save as draft",
                "Delete invoice",
                "View invoice",
                "Invoice preview",
                "Invoice numbering",
                "Invoice dates",
                "Due dates",
                "Client selection",
                "Add invoice items",
                "Remove invoice items",
                "Quantity",
                "Unit price",
                "Subtotal calculation",
                "Discount",
                "Tax/VAT",
                "Shipping/extra fees",
                "Total calculation",
                "Payment method",
                "Payment status",
                "Invoice notes",
                "Invoice terms",
                "Search invoices",
                "Filter invoices",
                "Sort invoices",
                "Pagination",
                "Mark as paid",
                "Mark as overdue",
                "Duplicate invoice",
                "Print invoice",
                "Export/download PDF",
                "Send invoice by email",
                "Mobile responsiveness",
                "Proper error handling"
            ]
        },
        {
            id: 3,
            name: "Clients",
            priority: "required",
            tasks: [
                "Client list",
                "Add client",
                "Edit client",
                "Delete client",
                "View client modal",
                "Client details",
                "Client contact information",
                "Billing information",
                "Shipping information",
                "Client notes",
                "Client invoice history",
                "Client estimate history",
                "Client payment information",
                "Search clients",
                "Filter/sort clients",
                "Pagination",
                "Mobile responsiveness"
            ]
        },
        {
            id: 4,
            name: "Estimates",
            priority: "required",
            tasks: [
                "Estimate list",
                "Create estimate",
                "Edit estimate",
                "Save estimate",
                "Save as draft",
                "Delete estimate",
                "View estimate",
                "Estimate preview",
                "Estimate numbering",
                "Estimate dates",
                "Expiry dates",
                "Client selection",
                "Estimate items",
                "Quantity",
                "Unit price",
                "Discount",
                "Tax",
                "Total calculation",
                "Estimate notes",
                "Estimate terms",
                "Search estimates",
                "Filter estimates",
                "Sort estimates",
                "Pagination",
                "Mark accepted",
                "Mark rejected",
                "Mark expired",
                "Print estimate",
                "Export/download PDF",
                "Send estimate by email",
                "Convert estimate to invoice",
                "Mobile responsiveness"
            ]
        },
        {
            id: 5,
            name: "Invoice Templates",
            priority: "required",
            tasks: [
                "Template list",
                "Select invoice template",
                "Preview template",
                "Customize template",
                "Business logo",
                "Business information",
                "Colors",
                "Fonts",
                "Layout",
                "Invoice table style",
                "Footer",
                "Terms/notes",
                "Payment information",
                "Save template settings",
                "Apply template to invoices"
            ]
        },
        {
            id: 6,
            name: "Estimate Templates",
            priority: "required",
            tasks: [
                "Template list",
                "Select estimate template",
                "Preview template",
                "Customize template",
                "Business logo",
                "Business information",
                "Colors",
                "Fonts",
                "Layout",
                "Estimate table style",
                "Footer",
                "Terms/notes",
                "Payment information",
                "Save template settings",
                "Apply template to estimates"
            ]
        },
        {
            id: 7,
            name: "Business Profile",
            priority: "needed",
            tasks: [
                "Business name",
                "Business logo",
                "Business email",
                "Business phone",
                "Business address",
                "Country",
                "Currency",
                "Tax information",
                "Registration information",
                "Save/update business profile",
                "Validation",
                "Mobile responsiveness"
            ]
        },
        {
            id: 8,
            name: "User Profile",
            priority: "needed",
            tasks: [
                "Profile image",
                "Full name",
                "Email",
                "Personal information",
                "Change profile information",
                "Upload profile image",
                "Save changes",
                "Mobile responsiveness"
            ]
        },
        {
            id: 9,
            name: "Settings",
            priority: "needed",
            tasks: [
                "General settings",
                "Currency settings",
                "Invoice settings",
                "Estimate settings",
                "Default payment settings",
                "Invoice numbering settings",
                "Tax settings",
                "Notification settings",
                "Save settings",
                "Reset/default settings"
            ]
        },
        {
            id: 10,
            name: "Account Management",
            priority: "needed",
            tasks: [
                "Logout",
                "Change password",
                "Forgot password",
                "Reset password",
                "Email verification",
                "Account deletion",
                "Account confirmation before deletion",
                "Security settings"
            ]
        },
        {
            id: 11,
            name: "Reports",
            priority: "important",
            tasks: [
                "Reports dashboard",
                "Total revenue",
                "Paid invoices",
                "Unpaid invoices",
                "Overdue invoices",
                "Outstanding amount",
                "Revenue by month",
                "Revenue by client",
                "Invoice statistics",
                "Estimate statistics",
                "Tax summary",
                "Payment method breakdown",
                "Date filtering",
                "Export reports"
            ]
        },
        {
            id: 12,
            name: "Customer Payments",
            priority: "important",
            tasks: [
                "Payment list",
                "Record payment",
                "Edit payment",
                "Delete payment",
                "Payment amount",
                "Payment date",
                "Payment method",
                "Payment reference",
                "Link payment to invoice",
                "Link payment to client",
                "Outstanding balance",
                "Payment history"
            ]
        },
        {
            id: 13,
            name: "Expenses",
            priority: "important",
            tasks: [
                "Expense list",
                "Add expense",
                "Edit expense",
                "Delete expense",
                "Expense amount",
                "Expense date",
                "Expense category",
                "Vendor",
                "Description",
                "Receipt attachment",
                "Expense filtering",
                "Expense reports",
                "Profit calculation"
            ]
        },
        {
            id: 14,
            name: "Recurring Invoices",
            priority: "important",
            tasks: [
                "Create recurring invoice",
                "Select client",
                "Set amount/items",
                "Set frequency",
                "Start date",
                "End date",
                "Automatic invoice generation",
                "Automatic email sending",
                "Pause recurring invoice",
                "Resume recurring invoice",
                "Cancel recurring invoice",
                "Recurring invoice history"
            ]
        },
        {
            id: 15,
            name: "Invoice Reminders",
            priority: "important",
            tasks: [
                "Upcoming due-date reminder",
                "Due-date reminder",
                "Overdue reminder",
                "Automatic email reminders",
                "Reminder settings",
                "Enable/disable reminders"
            ]
        },
        {
            id: 16,
            name: "Notifications",
            priority: "important",
            tasks: [
                "Notification system",
                "Invoice paid notification",
                "Invoice overdue notification",
                "Estimate accepted notification",
                "Estimate rejected notification",
                "Subscription notification",
                "Payment notification",
                "Support notification",
                "Notification badge",
                "Mark as read",
                "Clear notifications"
            ]
        },
        {
            id: 17,
            name: "Subscription",
            priority: "later",
            tasks: [
                "Current subscription",
                "Current plan",
                "Subscription status",
                "Plan limits",
                "Free plan",
                "Starter plan",
                "Business plan",
                "Enterprise plan",
                "Plan comparison",
                "Upgrade plan",
                "Downgrade plan",
                "Subscription checkout",
                "Order summary",
                "Billing cycle",
                "Automatic renewal",
                "Cancel subscription",
                "Subscription expiration",
                "Automatic downgrade",
                "Subscription limit enforcement"
            ]
        },
        {
            id: 18,
            name: "Paystack",
            priority: "later",
            tasks: [
                "Initialize payment",
                "Card payment",
                "Verify transaction",
                "Subscription creation",
                "Recurring billing",
                "Payment webhook",
                "Payment success handling",
                "Payment failure handling",
                "Subscription renewal",
                "Subscription cancellation",
                "Environment variables",
                "Security checks",
                "Test payments",
                "Production payments"
            ]
        },
        {
            id: 19,
            name: "PayPal",
            priority: "later",
            tasks: [
                "PayPal checkout",
                "PayPal subscription",
                "PayPal plan configuration",
                "Access token",
                "Webhook verification",
                "Payment success handling",
                "Payment failure handling",
                "Subscription renewal",
                "Subscription cancellation",
                "Environment variables",
                "Test mode",
                "Production mode"
            ]
        },
        {
            id: 20,
            name: "Subscription History",
            priority: "later",
            tasks: [
                "Payment history",
                "Transaction reference",
                "Plan purchased",
                "Amount",
                "Payment method",
                "Payment date",
                "Payment status",
                "Invoice/receipt",
                "Search/filter history"
            ]
        },
        {
            id: 21,
            name: "FAQ",
            priority: "support",
            tasks: [
                "FAQ categories",
                "FAQ search",
                "Accordion questions",
                "Common invoice questions",
                "Payment questions",
                "Subscription questions"
            ]
        },
        {
            id: 22,
            name: "Support / Live Chat",
            priority: "support",
            tasks: [
                "Start conversation",
                "Send message",
                "Receive message",
                "Conversation history",
                "Unread messages",
                "Support status",
                "Admin support dashboard"
            ]
        },
        {
            id: 23,
            name: "Contact",
            priority: "support",
            tasks: [
                "Contact form",
                "Name",
                "Email",
                "Message",
                "Form validation",
                "Success/error messages"
            ]
        },
        {
            id: 24,
            name: "Public Website",
            priority: "support",
            tasks: [
                "Home",
                "Features",
                "Pricing",
                "About",
                "FAQ",
                "Contact",
                "Login",
                "Signup",
                "Responsive design",
                "SEO metadata",
                "Open Graph metadata"
            ]
        },
        {
            id: 25,
            name: "Legal Pages",
            priority: "support",
            tasks: [
                "Privacy Policy",
                "Terms of Service",
                "Refund Policy",
                "Cookie Policy"
            ]
        },
        {
            id: 26,
            name: "Customer Portal",
            priority: "future",
            tasks: [
                "Customer invoice viewing",
                "Download invoice",
                "View estimates",
                "Accept estimate",
                "Pay invoice",
                "Payment history",
                "Customer login"
            ]
        },
        {
            id: 27,
            name: "Team Members",
            priority: "future",
            tasks: [
                "Invite team member",
                "Remove team member",
                "Team member list",
                "Roles",
                "Permissions",
                "Admin access",
                "Staff access"
            ]
        },
        {
            id: 28,
            name: "API",
            priority: "future",
            tasks: [
                "API keys",
                "API documentation",
                "Invoice API",
                "Client API",
                "Payment API",
                "Webhooks",
                "API usage limits"
            ]
        },
        {
            id: 29,
            name: "Security",
            priority: "future",
            tasks: [
                "Two-factor authentication",
                "Login history",
                "Active sessions",
                "Session management",
                "Audit logs",
                "Security notifications"
            ]
        },
        {
            id: 30,
            name: "Integrations",
            priority: "future",
            tasks: [
                "Payment integrations",
                "Accounting integrations",
                "Email integrations",
                "Cloud storage",
                "Other business integrations"
            ]
        }
    ],
    finalLaunchChecklist: [
        "Authentication works",
        "Email verification works",
        "Password reset works",
        "Dashboard works",
        "Clients work",
        "Invoices work",
        "Estimates work",
        "Estimate → Invoice works",
        "Invoice PDF works",
        "Estimate PDF works",
        "Invoice email works",
        "Templates work",
        "Business Profile works",
        "Profile works",
        "Settings work",
        "Reports work",
        "Payment tracking works",
        "Subscription works",
        "Paystack works",
        "PayPal works",
        "Subscription limits work",
        "Subscription expiration works",
        "Account deletion works",
        "Support works",
        "Privacy Policy published",
        "Terms of Service published",
        "Refund Policy published",
        "Mobile testing completed",
        "Desktop testing completed",
        "Backend security checked",
        "Production environment variables configured",
        "Production payment testing completed",
        "Error handling checked",
        "Loading states checked",
        "Empty states checked",
        "Final UI/UX review completed"
    ]
};

let completedTasks = loadProgress();

function loadProgress() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (!saved) {
            return {};
        }

        return JSON.parse(saved);
    } catch (error) {
        return {};
    }
}

function saveProgress() {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(completedTasks)
    );
}

function getTaskKey(type, phaseId, taskIndex) {
    return `${type}_${phaseId}_${taskIndex}`;
}

function renderChecklist() {
    const container = document.getElementById("checklistContainer");

    container.innerHTML = "";

    checklistData.phases.forEach(phase => {
        const phaseElement = document.createElement("section");

        phaseElement.className = "phase";
        phaseElement.dataset.phaseId = phase.id;

        const completed = phase.tasks.filter((task, index) => {
            return completedTasks[
                getTaskKey("phase", phase.id, index)
            ];
        }).length;

        phaseElement.innerHTML = `
            <button class="phase-header" type="button">
                <div class="phase-left">
                    <div class="phase-number">${phase.id}</div>

                    <div>
                        <div class="phase-name">
                            ${escapeHTML(phase.name)}
                            <span class="phase-priority">
                                ${escapeHTML(phase.priority)}
                            </span>
                        </div>
                    </div>
                </div>

                <div class="phase-progress">
                    <span class="phase-count">
                        ${completed}/${phase.tasks.length}
                    </span>
                    <span class="phase-arrow">⌄</span>
                </div>
            </button>

            <div class="phase-content">
                ${phase.tasks.map((task, index) => {
                    const key = getTaskKey("phase", phase.id, index);
                    const isCompleted = !!completedTasks[key];

                    return `
                        <label class="task ${isCompleted ? "completed" : ""}">
                            <input
                                type="checkbox"
                                class="task-checkbox"
                                data-key="${key}"
                                ${isCompleted ? "checked" : ""}
                            >

                            <span class="task-label">
                                ${escapeHTML(task)}
                            </span>
                        </label>
                    `;
                }).join("")}
            </div>
        `;

        container.appendChild(phaseElement);
    });

    renderFinalChecklist(container);
    updateProgress();
}

function renderFinalChecklist(container) {
    const section = document.createElement("section");

    section.className = "final-section";

    section.innerHTML = `
        <h2 class="final-title">Final Launch Checklist</h2>

        <div class="final-checklist">
            ${checklistData.finalLaunchChecklist.map((task, index) => {
                const key = getTaskKey("final", 0, index);
                const isCompleted = !!completedTasks[key];

                return `
                    <label class="task ${isCompleted ? "completed" : ""}">
                        <input
                            type="checkbox"
                            class="task-checkbox"
                            data-key="${key}"
                            ${isCompleted ? "checked" : ""}
                        >

                        <span class="task-label">
                            ${escapeHTML(task)}
                        </span>
                    </label>
                `;
            }).join("")}
        </div>
    `;

    container.appendChild(section);
}

function updateProgress() {
    const allTasks = [];

    checklistData.phases.forEach(phase => {
        phase.tasks.forEach((task, index) => {
            allTasks.push(
                getTaskKey("phase", phase.id, index)
            );
        });
    });

    checklistData.finalLaunchChecklist.forEach((task, index) => {
        allTasks.push(
            getTaskKey("final", 0, index)
        );
    });

    const total = allTasks.length;

    const completed = allTasks.filter(key => {
        return completedTasks[key];
    }).length;

    const percentage = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    document.getElementById("progressPercentage").textContent =
        `${percentage}%`;

    document.getElementById("completedCount").textContent =
        completed;

    document.getElementById("totalCount").textContent =
        total;

    document.getElementById("progressFill").style.width =
        `${percentage}%`;

    updatePhaseCounts();
}

function updatePhaseCounts() {
    checklistData.phases.forEach(phase => {
        const phaseElement = document.querySelector(
            `.phase[data-phase-id="${phase.id}"]`
        );

        if (!phaseElement) {
            return;
        }

        const completed = phase.tasks.filter((task, index) => {
            return completedTasks[
                getTaskKey("phase", phase.id, index)
            ];
        }).length;

        const counter = phaseElement.querySelector(".phase-count");

        if (counter) {
            counter.textContent =
                `${completed}/${phase.tasks.length}`;
        }
    });
}

function escapeHTML(value) {
    const div = document.createElement("div");
    div.textContent = value;
    return div.innerHTML;
}

document.addEventListener("change", event => {
    if (!event.target.classList.contains("task-checkbox")) {
        return;
    }

    const checkbox = event.target;
    const key = checkbox.dataset.key;
    const task = checkbox.closest(".task");

    completedTasks[key] = checkbox.checked;

    if (checkbox.checked) {
        task.classList.add("completed");
    } else {
        task.classList.remove("completed");
    }

    saveProgress();
    updateProgress();
});

document.addEventListener("click", event => {
    const header = event.target.closest(".phase-header");

    if (!header) {
        return;
    }

    const phase = header.closest(".phase");

    if (phase) {
        phase.classList.toggle("open");
    }
});

document.getElementById("resetChecklistButton").addEventListener(
    "click",
    () => {
        const confirmed = confirm(
            "Reset all InvoicePro checklist progress?"
        );

        if (!confirmed) {
            return;
        }

        completedTasks = {};

        localStorage.removeItem(STORAGE_KEY);

        renderChecklist();
    }
);

renderChecklist();

const firstPhase = document.querySelector(".phase");

if (firstPhase) {
    firstPhase.classList.add("open");
}