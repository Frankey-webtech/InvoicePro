(function () {

    "use strict";

    let settingsUserProfile = null;
    let settingsBusinessProfile = null;
    let currentSubscriptionSettings = null;

    const $ = (id) => document.getElementById(id);

    const DEFAULT_PROFILE_IMAGE = "profile.png";

    const notificationSettingIds = [
        "invoicePaidNotification",
        "invoiceOverdueNotification",
        "invoiceViewedNotification",
        "estimateAcceptedNotification",
        "estimateRejectedNotification",
        "subscriptionNotification"
    ];

    const defaultNotificationSettings = {
        invoicePaidNotification: true,
        invoiceOverdueNotification: true,
        invoiceViewedNotification: true,
        estimateAcceptedNotification: true,
        estimateRejectedNotification: true,
        subscriptionNotification: true
    };

    function showToast(message, type = "info", duration = 3000) {

        const toastContainer = $("toastContainer");

        if (!toastContainer) {
            return;
        }

        const toast = document.createElement("div");

        toast.className = `toast ${type}`;

        const messageSpan = document.createElement("span");

        messageSpan.textContent = message;

        const closeSpan = document.createElement("span");

        closeSpan.className = "toastClose";

        closeSpan.innerHTML = "&times;";

        toast.appendChild(messageSpan);
        toast.appendChild(closeSpan);

        toastContainer.appendChild(toast);

        let removed = false;

        const removeToast = () => {

            if (removed) {
                return;
            }

            removed = true;

            toast.style.animation = "toastOut .3s forwards";

            setTimeout(() => {

                if (toast.parentNode) {
                    toast.remove();
                }

            }, 300);

        };

        closeSpan.addEventListener(
            "click",
            removeToast
        );

        setTimeout(
            removeToast,
            duration
        );
    }

    function setButtonLoading(button, loading, loadingText) {

        if (!button) {
            return;
        }

        if (loading) {

            if (!button.dataset.originalText) {
                button.dataset.originalText = button.textContent;
            }

            button.disabled = true;

            if (loadingText) {
                button.textContent = loadingText;
            }

        } else {

            button.disabled = false;

            if (button.dataset.originalText) {
                button.textContent = button.dataset.originalText;
                delete button.dataset.originalText;
            }

        }
    }

    function getErrorMessage(error, fallback) {

        if (!error) {
            return fallback;
        }

        if (typeof error === "string") {
            return error;
        }

        return (
            error.message ||
            error.error ||
            fallback
        );
    }

    function openModal(modal) {

        if (!modal) {
            return;
        }

        modal.classList.add("active");

        modal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "settings-modal-open"
        );
    }

    function closeModal(modal) {

        if (!modal) {
            return;
        }

        modal.classList.remove("active");

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "settings-modal-open"
        );
    }

    function openSecurityPasswordModal() {

        const modal =
            $("changePasswordModal");

        if (!modal) {
            return;
        }

        openModal(modal);

        const form =
            $("changePasswordForm");

        if (form) {
            form.reset();
        }

        setTimeout(() => {

            const currentPassword =
                $("currentPassword");

            if (currentPassword) {
                currentPassword.focus();
            }

        }, 100);
    }

    function closeSecurityPasswordModal() {

        const modal =
            $("changePasswordModal");

        closeModal(modal);

        const form =
            $("changePasswordForm");

        if (form) {
            form.reset();
        }
    }

    function initializePasswordModal() {

        const openButton =
            $("changePasswordButton");

        const closeButton =
            $("closeChangePasswordModal");

        const cancelButton =
            $("cancelChangePassword");

        const overlay =
            $("changePasswordModalOverlay");

        if (openButton) {

            openButton.addEventListener(
                "click",
                openSecurityPasswordModal
            );

        }

        if (closeButton) {

            closeButton.addEventListener(
                "click",
                closeSecurityPasswordModal
            );

        }

        if (cancelButton) {

            cancelButton.addEventListener(
                "click",
                closeSecurityPasswordModal
            );

        }

        if (overlay) {

            overlay.addEventListener(
                "click",
                closeSecurityPasswordModal
            );

        }

        const form =
            $("changePasswordForm");

        if (form) {

            form.addEventListener(
                "submit",
                handleChangePassword
            );

        }

        document
            .querySelectorAll(
                ".password-visibility-button"
            )
            .forEach((button) => {

                button.addEventListener(
                    "click",
                    function () {

                        const targetId =
                            this.dataset.target;

                        const input =
                            $(targetId);

                        if (!input) {
                            return;
                        }

                        const icon =
                            this.querySelector("i");

                        if (
                            input.type ===
                            "password"
                        ) {

                            input.type = "text";

                            if (icon) {
                                icon.className =
                                    "ri-eye-off-line";
                            }

                            this.setAttribute(
                                "aria-label",
                                "Hide password"
                            );

                        } else {

                            input.type = "password";

                            if (icon) {
                                icon.className =
                                    "ri-eye-line";
                            }

                            this.setAttribute(
                                "aria-label",
                                "Show password"
                            );

                        }

                    }
                );

            });
    }

    async function handleChangePassword(event) {

        event.preventDefault();

        const currentPassword =
            $("currentPassword")?.value.trim();

        const newPassword =
            $("newPassword")?.value || "";

        const confirmPassword =
            $("confirmPassword")?.value || "";

        if (
            !currentPassword ||
            !newPassword ||
            !confirmPassword
        ) {

            showToast(
                "Please fill in all required fields.",
                "error"
            );

            return;
        }

        if (newPassword.length < 8) {

            showToast(
                "Password must be at least 8 characters.",
                "error"
            );

            return;
        }

        if (newPassword !== confirmPassword) {

            showToast(
                "Passwords do not match.",
                "error"
            );

            return;
        }

        if (currentPassword === newPassword) {

            showToast(
                "Your new password must be different from your current password.",
                "error"
            );

            return;
        }

        const submitButton =
            $("submitChangePassword");

        setButtonLoading(
            submitButton,
            true,
            "Changing..."
        );

        try {

            const result =
                await Parse.Cloud.run(
                    "changeUserPassword",
                    {
                        currentPassword,
                        newPassword,
                        confirmPassword
                    }
                );

            showToast(
                result?.message ||
                "Password changed successfully. Please log in again.",
                "success",
                5000
            );

            closeSecurityPasswordModal();

        } catch (error) {

            console.error(
                "Password change failed:",
                error
            );

            showToast(
                getErrorMessage(
                    error,
                    "Unable to change your password."
                ),
                "error"
            );

        } finally {

            setButtonLoading(
                submitButton,
                false
            );

        }
    }

    async function loadSettingsUserProfile() {

        try {

            const result =
                await Parse.Cloud.run(
                    "getUserProfile"
                );

            if (
                !result ||
                !result.success ||
                !result.profile
            ) {

                throw new Error(
                    "Unable to load your profile."
                );

            }

            settingsUserProfile =
                result.profile;

            const accountName =
                $("settingsAccountName");

            if (accountName) {

                accountName.textContent =
                    settingsUserProfile.fullName ||
                    "Not available";

            }

            const accountEmail =
                $("settingsAccountEmail");

            if (accountEmail) {

                accountEmail.textContent =
                    settingsUserProfile.email ||
                    "Not available";

            }

            const accountId =
                $("settingsAccountId");

            if (accountId) {

                accountId.textContent =
                    settingsUserProfile.id ||
                    "Not available";

            }

            return settingsUserProfile;

        } catch (error) {

            console.error(
                "Settings profile loading failed:",
                error
            );

            showToast(
                getErrorMessage(
                    error,
                    "Unable to load your profile."
                ),
                "error"
            );

            return null;
        }
    }

    async function loadUserProfileImage() {

        try {

            const result =
                await Parse.Cloud.run(
                    "getUserProfile"
                );

            if (
                !result ||
                !result.success ||
                !result.profile
            ) {
                return;
            }

            const profile =
                result.profile;

            let imageURL =
                DEFAULT_PROFILE_IMAGE;

            if (profile.profileImage) {

                if (
                    typeof profile.profileImage ===
                    "string"
                ) {

                    imageURL =
                        profile.profileImage;

                } else if (
                    profile.profileImage.url
                ) {

                    imageURL =
                        typeof profile.profileImage.url ===
                        "function"
                            ? profile.profileImage.url()
                            : profile.profileImage.url;

                }

            }

            const profileImage =
                $("profileImage");

            const headerProfileImage =
                $("headerProfileImage");

            if (profileImage) {
                profileImage.src = imageURL;
            }

            if (headerProfileImage) {
                headerProfileImage.src = imageURL;
            }

        } catch (error) {

            console.error(
                "Profile image loading failed:",
                error
            );

        }
    }

    async function loadSettingsBusinessProfile() {

    try {

        const currentUser = Parse.User.current();

        if (!currentUser) {

            throw new Error(
                "You are not logged in."
            );

        }

        const BusinessProfile =
            Parse.Object.extend("BusinessProfile");

        const query =
            new Parse.Query(BusinessProfile);

        query.equalTo(
            "user",
            currentUser
        );

        const profile =
            await query.first();

        if (!profile) {

            settingsBusinessProfile = null;

            displaySettingsBusinessProfile(null);

            return null;
        }

        settingsBusinessProfile = {

            objectId:
                profile.id,

            businessName:
                profile.get("businessName") || "",

            businessEmail:
                profile.get("businessEmail") || "",

            businessPhone:
                profile.get("businessPhone") || "",

            businessWebsite:
                profile.get("businessWebsite") || "",

            businessAddress:
                profile.get("businessAddress") || "",

            businessTaxId:
                profile.get("businessTaxId") || "",

            registrationNumber:
                profile.get("registrationNumber") || "",

            invoicePrefix:
                profile.get("invoicePrefix") || "INV-",

            estimatePrefix:
                profile.get("estimatePrefix") || "EST-",

            logo:
                profile.get("logo") || null

        };

        displaySettingsBusinessProfile(
            settingsBusinessProfile
        );

        return settingsBusinessProfile;

    } catch (error) {

        console.error(
            "Business profile loading failed:",
            error
        );

        displaySettingsBusinessProfile(null);

        showToast(
            getErrorMessage(
                error,
                "Unable to load business information."
            ),
            "error"
        );

        return null;
    }
}

    function displaySettingsBusinessProfile(profile) {

    const businessName =
        $("settingsBusinessName");

    const businessEmail =
        $("settingsBusinessEmail");

    const businessPhone =
        $("settingsBusinessPhone");

    const businessWebsite =
        $("settingsBusinessWebsite");

    const businessAddress =
        $("settingsBusinessAddress");

    const businessId =
        $("settingsBusinessId");

    if (!profile) {

        if (businessName) {
            businessName.textContent = "Not Set";
        }

        if (businessEmail) {
            businessEmail.textContent = "Not Set";
        }

        if (businessPhone) {
            businessPhone.textContent = "Not Set";
        }

        if (businessWebsite) {
            businessWebsite.textContent = "Not Set";
        }

        if (businessAddress) {
            businessAddress.textContent = "Not Set";
        }

        if (businessId) {
            businessId.textContent = "Not Set";
        }

        return;
    }

    if (businessName) {

        businessName.textContent =
            profile.businessName ||
            "Not Set";

    }

    if (businessEmail) {

        businessEmail.textContent =
            profile.businessEmail ||
            "Not Set";

    }

    if (businessPhone) {

        businessPhone.textContent =
            profile.businessPhone ||
            "Not Set";

    }

    if (businessWebsite) {

        businessWebsite.textContent =
            profile.businessWebsite ||
            "Not Set";

    }

    if (businessAddress) {

        businessAddress.textContent =
            profile.businessAddress ||
            "Not Set";

    }

    if (businessId) {

        businessId.textContent =
            profile.businessTaxId ||
            "Not Set";

    }
}

    function getBusinessValue(field) {

    if (
        settingsBusinessProfile &&
        settingsBusinessProfile[field] !== undefined
    ) {

        return settingsBusinessProfile[field];

    }

    return "";
}

    async function updateBusinessField(field, value) {

    const data = {

        businessName:
            field === "businessName"
                ? value
                : getBusinessValue("businessName"),

        businessEmail:
            field === "businessEmail"
                ? value
                : getBusinessValue("businessEmail"),

        businessPhone:
            field === "businessPhone"
                ? value
                : getBusinessValue("businessPhone"),

        businessWebsite:
            field === "businessWebsite"
                ? value
                : getBusinessValue("businessWebsite"),

        businessAddress:
            field === "businessAddress"
                ? value
                : getBusinessValue("businessAddress"),

        businessTaxId:
            field === "businessTaxId"
                ? value
                : getBusinessValue("businessTaxId"),

        primaryColor:
            getBusinessValue("primaryColor") ||
            "#2563EB",

        secondaryColor:
            getBusinessValue("secondaryColor") ||
            "#FFFFFF"
    };

    if (!data.businessName.trim()) {

        showToast(
            "Business name is required.",
            "error"
        );

        return false;
    }

    try {

        await Parse.Cloud.run(
            "updateBusinessProfile",
            data
        );

        if (!settingsBusinessProfile) {
            settingsBusinessProfile = {};
        }

        settingsBusinessProfile[field] =
            value;

        displaySettingsBusinessProfile(
            settingsBusinessProfile
        );

        showToast(
            "Business information updated successfully.",
            "success"
        );

        return true;

    } catch (error) {

        console.error(
            "Business update failed:",
            error
        );

        showToast(
            getErrorMessage(
                error,
                "Unable to update business information."
            ),
            "error"
        );

        return false;
    }
}

    async function editBusinessField(field, label) {

        const currentValue =
            getBusinessValue(field);

        const value =
            window.prompt(
                `Enter your ${label}:`,
                currentValue
            );

        if (value === null) {
            return;
        }

        const cleanedValue =
            value.trim();

        if (
            field === "businessName" &&
            !cleanedValue
        ) {

            showToast(
                "Business name is required.",
                "error"
            );

            return;
        }

        await updateBusinessField(
            field,
            cleanedValue
        );
    }

    function initializeBusinessEditing() {

        const mappings = [

            [
                "editBusinessNameButton",
                "businessName",
                "business name"
            ],

            [
                "editBusinessEmailButton",
                "businessEmail",
                "business email"
            ],

            [
                "editBusinessPhoneButton",
                "businessPhone",
                "business phone number"
            ],

            [
                "editBusinessAddressButton",
                "businessAddress",
                "business address"
            ],

            [
                "editBusinessWebsiteButton",
                "businessWebsite",
                "business website"
            ],

            [
                "editBusinessIdButton",
                "businessTaxId",
                "business ID / Tax ID"
            ]

        ];

        mappings.forEach(
            ([buttonId, field, label]) => {

                const button =
                    $(buttonId);

                if (!button) {
                    return;
                }

                button.addEventListener(
                    "click",
                    () => {

                        editBusinessField(
                            field,
                            label
                        );

                    }
                );

            }
        );

        const logoButton =
            $("manageBusinessLogoButton");

        if (logoButton) {

            logoButton.addEventListener(
                "click",
                openBusinessLogoPicker
            );

        }
    }

    function openBusinessLogoPicker() {

        let input =
            $("settingsBusinessLogoFileInput");

        if (!input) {

            input =
                document.createElement("input");

            input.type = "file";

            input.id =
                "settingsBusinessLogoFileInput";

            input.accept =
                "image/jpeg,image/jpg,image/png,image/webp";

            input.style.display =
                "none";

            document.body.appendChild(
                input
            );

            input.addEventListener(
                "change",
                handleBusinessLogoUpload
            );
        }

        input.click();
    }

    async function handleBusinessLogoUpload(event) {

        const file =
            event.target.files?.[0];

        event.target.value = "";

        if (!file) {
            return;
        }

        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp"
        ];

        if (
            !allowedTypes.includes(
                file.type
            )
        ) {

            showToast(
                "Only JPG, JPEG, PNG and WEBP images are allowed.",
                "error"
            );

            return;
        }

        if (
            file.size >
            5 * 1024 * 1024
        ) {

            showToast(
                "Business logo must not be larger than 5MB.",
                "error"
            );

            return;
        }

        const button =
            $("manageBusinessLogoButton");

        setButtonLoading(
            button,
            true,
            "Uploading..."
        );

        try {

            const parseFile =
                new Parse.File(
                    file.name,
                    file,
                    file.type
                );

            await parseFile.save();

            const currentName =
                getBusinessValue(
                    "businessName"
                );

            if (!currentName) {

                throw new Error(
                    "Business name is required before uploading a logo."
                );
            }

            await Parse.Cloud.run(
                "updateBusinessProfile",
                {
                    businessName:
                        currentName,

                    businessEmail:
                        getBusinessValue(
                            "businessEmail"
                        ),

                    businessPhone:
                        getBusinessValue(
                            "businessPhone"
                        ),

                    businessWebsite:
                        getBusinessValue(
                            "businessWebsite"
                        ),

                    businessAddress:
                        getBusinessValue(
                            "businessAddress"
                        ),

                    taxId:
                        getBusinessValue(
                            "businessTaxId"
                        ),

                    businessLogo:
                        parseFile,

                    primaryColor:
                        getBusinessValue(
                            "primaryColor"
                        ) || "#2563EB",

                    secondaryColor:
                        getBusinessValue(
                            "secondaryColor"
                        ) || "#FFFFFF"
                }
            );

            if (!settingsBusinessProfile) {
                settingsBusinessProfile = {};
            }

            settingsBusinessProfile.businessLogo =
                parseFile.url();

            showToast(
                "Business logo updated successfully.",
                "success"
            );

        } catch (error) {

            console.error(
                "Business logo upload failed:",
                error
            );

            showToast(
                getErrorMessage(
                    error,
                    "Unable to update business logo."
                ),
                "error"
            );

        } finally {

            setButtonLoading(
                button,
                false
            );

        }
    }

    function loadNotificationSettings() {

        try {

            const saved =
                localStorage.getItem(
                    "invoiceProNotificationSettings"
                );

            const settings =
                saved
                    ? JSON.parse(saved)
                    : {
                        ...defaultNotificationSettings
                    };

            notificationSettingIds.forEach(
                (id) => {

                    const toggle =
                        $(id);

                    if (!toggle) {
                        return;
                    }

                    toggle.checked =
                        settings[id] !== undefined
                            ? Boolean(settings[id])
                            : true;

                }
            );

        } catch (error) {

            console.error(
                "Notification settings loading failed:",
                error
            );

        }
    }

    function saveNotificationSetting(
        id,
        value
    ) {

        try {

            const saved =
                localStorage.getItem(
                    "invoiceProNotificationSettings"
                );

            const settings =
                saved
                    ? JSON.parse(saved)
                    : {
                        ...defaultNotificationSettings
                    };

            settings[id] =
                Boolean(value);

            localStorage.setItem(
                "invoiceProNotificationSettings",
                JSON.stringify(settings)
            );

            showToast(
                value
                    ? "Notification enabled."
                    : "Notification disabled.",
                "success"
            );

        } catch (error) {

            console.error(
                "Notification setting save failed:",
                error
            );

            showToast(
                "Unable to save notification setting.",
                "error"
            );
        }
    }

    function initializeNotificationSettings() {

        notificationSettingIds.forEach(
            (id) => {

                const toggle =
                    $(id);

                if (!toggle) {
                    return;
                }

                toggle.addEventListener(
                    "change",
                    function () {

                        saveNotificationSetting(
                            id,
                            this.checked
                        );

                    }
                );

            }
        );
    }

    async function loadSubscriptionSettings() {

        try {

            const result =
                await Parse.Cloud.run(
                    "getCurrentSubscription"
                );

            if (
                !result ||
                !result.success
            ) {

                throw new Error(
                    "Unable to load subscription information."
                );
            }

            currentSubscriptionSettings =
                result;

            const currentPlan =
                $("settingsCurrentPlan");

            if (currentPlan) {

                currentPlan.textContent =
                    result.plan ||
                    "Free Plan";

            }

            const status =
                $("settingsSubscriptionStatus");

            if (status) {

                status.textContent =
                    result.subscriptionStatus ||
                    "Active";

            }

            const renewalDate =
                $("settingsRenewalDate");

            if (renewalDate) {

                if (result.renewalDate) {

                    const date =
                        new Date(
                            result.renewalDate
                        );

                    if (
                        !Number.isNaN(
                            date.getTime()
                        )
                    ) {

                        renewalDate.textContent =
                            date.toLocaleDateString(
                                undefined,
                                {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric"
                                }
                            );

                    } else {

                        renewalDate.textContent =
                            "No renewal date";

                    }

                } else {

                    renewalDate.textContent =
                        "No renewal date";

                }
            }

            const autoRenew =
                $("subscriptionAutoRenew");

            if (autoRenew) {

                const savedAutoRenew =
                    localStorage.getItem(
                        "invoiceProAutoRenew"
                    );

                if (
                    typeof result.autoRenew ===
                    "boolean"
                ) {

                    autoRenew.checked =
                        result.autoRenew;

                } else if (
                    savedAutoRenew !== null
                ) {

                    autoRenew.checked =
                        savedAutoRenew === "true";

                }

            }

        } catch (error) {

            console.error(
                "Subscription loading failed:",
                error
            );

            showToast(
                getErrorMessage(
                    error,
                    "Unable to load subscription information."
                ),
                "error"
            );
        }
    }

    function initializeAutoRenew() {

        const toggle =
            $("subscriptionAutoRenew");

        if (!toggle) {
            return;
        }

        toggle.addEventListener(
            "change",
            async function () {

                const value =
                    this.checked;

                try {

                    localStorage.setItem(
                        "invoiceProAutoRenew",
                        String(value)
                    );

                    try {

                        await Parse.Cloud.run(
                            "updateSubscriptionAutoRenew",
                            {
                                autoRenew: value
                            }
                        );

                    } catch (backendError) {

                        if (
                            !backendError ||
                            !backendError.message ||
                            !backendError.message
                                .toLowerCase()
                                .includes(
                                    "function not found"
                                )
                        ) {

                            throw backendError;

                        }
                    }

                    showToast(
                        value
                            ? "Auto-renew enabled."
                            : "Auto-renew disabled.",
                        "success"
                    );

                } catch (error) {

                    this.checked =
                        !value;

                    localStorage.setItem(
                        "invoiceProAutoRenew",
                        String(!value)
                    );

                    showToast(
                        getErrorMessage(
                            error,
                            "Unable to update auto-renew."
                        ),
                        "error"
                    );
                }
            }
        );
    }

    function initializeSubscriptionNavigation() {

        const button =
            $("manageSubscriptionButton");

        if (!button) {
            return;
        }

        button.addEventListener(
            "click",
            () => {

                window.location.href =
                    "subscription.html";

            }
        );
    }

    function initializeDeleteAccount() {

    const deleteButton =
        $("deleteAccountButton");

    const modal =
        $("deleteAccountModal");

    const closeButton =
        $("closeDeleteAccountModal");

    const cancelButton =
        $("cancelDeleteAccount");

    const overlay =
        $("deleteAccountModalOverlay");

    const confirmation =
        $("deleteAccountConfirmation");

    const password =
        $("deleteAccountPassword");

    const confirmButton =
        $("confirmDeleteAccount");

    if (deleteButton) {

        deleteButton.addEventListener(
            "click",
            () => {

                openModal(modal);

                if (confirmation) {
                    confirmation.value = "";
                }

                if (password) {
                    password.value = "";
                }

                if (confirmButton) {
                    confirmButton.disabled = true;
                }

                setTimeout(() => {

                    if (confirmation) {
                        confirmation.focus();
                    }

                }, 100);

            }
        );

    }

    if (closeButton) {

        closeButton.addEventListener(
            "click",
            () => closeModal(modal)
        );

    }

    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            () => closeModal(modal)
        );

    }

    if (overlay) {

        overlay.addEventListener(
            "click",
            () => closeModal(modal)
        );

    }

    if (password) {

    password.addEventListener(
        "input",
        function () {

            if (confirmButton) {

                confirmButton.disabled =
                    !this.value.trim();

            }

        }
    );

}

    if (confirmButton) {

        confirmButton.addEventListener(
            "click",
            handleDeleteAccount
        );

    }

}

async function handleDeleteAccount() {

    const password =
        $("deleteAccountPassword");

    const confirmButton =
        $("confirmDeleteAccount");

    if (
        !password ||
        !password.value.trim()
    ) {

        showToast(
            "Please enter your current password.",
            "error"
        );

        return;

    }

    setButtonLoading(
        confirmButton,
        true,
        "Deleting..."
    );

    try {

        const result =
            await Parse.Cloud.run(
                "deleteAccount",
                {
                    password:
                        password.value
                }
            );

        showToast(
            result?.message ||
            "Your account has been deleted successfully.",
            "success",
            5000
        );

        closeModal(
            $("deleteAccountModal")
        );

        setTimeout(() => {

            window.location.href =
                "login.html";

        }, 1500);

    }

    catch (error) {

        console.error(
            "Account deletion failed:",
            error
        );

        showToast(
            getErrorMessage(
                error,
                "Unable to delete your account."
            ),
            "error"
        );

        setButtonLoading(
            confirmButton,
            false
        );

    }

}

    async function exportAccountData() {

        const button =
            $("exportAccountDataButton");

        setButtonLoading(
            button,
            true,
            "Exporting..."
        );

        try {

            const profile =
                settingsUserProfile ||
                await loadSettingsUserProfile();

            let business =
                settingsBusinessProfile;

            if (!business) {

                business =
                    await loadSettingsBusinessProfile();

            }

            const exportData = {

                exportedAt:
                    new Date().toISOString(),

                account: {

                    id:
                        profile?.id || "",

                    fullName:
                        profile?.fullName || "",

                    email:
                        profile?.email || "",

                    country:
                        profile?.country || "",

                    currencyCode:
                        profile?.currencyCode || "",

                    currencySymbol:
                        profile?.currencySymbol || "",

                    plan:
                        profile?.plan || "",

                    planPrice:
                        profile?.planPrice ?? "",

                    planBilling:
                        profile?.planBilling || "",

                    subscriptionStatus:
                        profile?.subscriptionStatus || ""

                },

                business:
                    business || {},

                notifications:
                    getStoredNotificationSettings(),

                subscription:
                    currentSubscriptionSettings || null

            };

            const blob =
                new Blob(
                    [
                        JSON.stringify(
                            exportData,
                            null,
                            2
                        )
                    ],
                    {
                        type:
                            "application/json"
                    }
                );

            const url =
                URL.createObjectURL(blob);

            const anchor =
                document.createElement("a");

            anchor.href =
                url;

            anchor.download =
                `invoicepro-account-data-${new Date()
                    .toISOString()
                    .slice(0, 10)}.json`;

            document.body.appendChild(
                anchor
            );

            anchor.click();

            anchor.remove();

            URL.revokeObjectURL(url);

            showToast(
                "Your account data has been exported.",
                "success"
            );

        } catch (error) {

            console.error(
                "Account data export failed:",
                error
            );

            showToast(
                getErrorMessage(
                    error,
                    "Unable to export your account data."
                ),
                "error"
            );

        } finally {

            setButtonLoading(
                button,
                false
            );
        }
    }

    function getStoredNotificationSettings() {

        try {

            const saved =
                localStorage.getItem(
                    "invoiceProNotificationSettings"
                );

            return saved
                ? JSON.parse(saved)
                : {
                    ...defaultNotificationSettings
                };

        } catch (error) {

            return {
                ...defaultNotificationSettings
            };
        }
    }

    function initializeExportData() {

        const button =
            $("exportAccountDataButton");

        if (!button) {
            return;
        }

        button.addEventListener(
            "click",
            exportAccountData
        );
    }

    function initializePrivacyInformation() {

        const button =
            $("privacyInformationButton");

        if (!button) {
            return;
        }

        button.addEventListener(
            "click",
            () => {

                showToast(
                    "InvoicePro uses your account, business and invoice information to provide the invoicing services available in your account.",
                    "info",
                    6000
                );

            }
        );
    }

    function initializeBusinessSettingsState() {

        if (!window.currentBusinessSettings) {

            window.currentBusinessSettings = {};

        }

        const profile =
            settingsUserProfile;

        window.currentBusinessSettings =
            {

                ...window.currentBusinessSettings,

                businessName:
                    profile?.businessName ||
                    "",

                businessEmail:
                    profile?.businessEmail ||
                    "",

                businessPhone:
                    profile?.businessPhone ||
                    "",

                businessWebsite:
                    profile?.businessWebsite ||
                    "",

                businessAddress:
                    profile?.businessAddress ||
                    "",

                taxId:
                    profile?.taxId ||
                    "",

                businessLogo:
                    profile?.businessLogo ||
                    "",

                primaryColor:
                    profile?.primaryColor ||
                    "#2563EB",

                secondaryColor:
                    profile?.secondaryColor ||
                    "#FFFFFF"

            };
    }

    function initializeKeyboardControls() {

        document.addEventListener(
            "keydown",
            function (event) {

                if (event.key !== "Escape") {
                    return;
                }

                const passwordModal =
                    $("changePasswordModal");

                const deleteModal =
                    $("deleteAccountModal");

                if (
                    passwordModal &&
                    passwordModal.classList.contains(
                        "active"
                    )
                ) {

                    closeSecurityPasswordModal();

                    return;
                }

                if (
                    deleteModal &&
                    deleteModal.classList.contains(
                        "active"
                    )
                ) {

                    closeModal(
                        deleteModal
                    );

                }

            }
        );
    }

    async function initializeSettingsPage() {

        try {

            await loadSettingsUserProfile();

            initializeBusinessSettingsState();

            await loadSettingsBusinessProfile();

            loadNotificationSettings();

            initializeNotificationSettings();

            await loadSubscriptionSettings();

            initializeAutoRenew();

            initializeSubscriptionNavigation();

            initializeBusinessEditing();

            initializePasswordModal();

            initializeDeleteAccount();

            initializeExportData();

            initializePrivacyInformation();

            initializeKeyboardControls();

            await loadUserProfileImage();

            console.log(
                "Settings page initialized successfully."
            );

        } catch (error) {

            console.error(
                "Settings initialization failed:",
                error
            );
        }
    }

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeSettingsPage
        );

    } else {

        initializeSettingsPage();

    }

})();