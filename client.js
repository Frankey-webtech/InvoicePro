const {
    checkSubscription
} = require("./subscriptionHelper");

Parse.Cloud.define("createClient", async (request) => {

    const user = request.user;

    if (!user) {

        throw new Error("User not authenticated.");

    }
    
    await checkSubscription(user);
    
    if (

    user.get("maxClients") !== -1 &&

    user.get("clientCount") >= user.get("maxClients")

) {

    throw "You have reached the maximum number of clients allowed by your current subscription. Upgrade your plan to continue.";

}

    const {

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

    } = request.params;

    if (!contactPerson) {

        throw new Error("Client name is required.");

    }
    


const duplicateQuery =
new Parse.Query("Clients");

duplicateQuery.equalTo(
    "user",
    user
);

if(clientEmail){

    duplicateQuery.equalTo(
        "clientEmail",
        clientEmail
    );

}else{

    duplicateQuery.equalTo(
        "contactPerson",
        contactPerson
    );

    duplicateQuery.equalTo(
        "companyName",
        companyName || ""
    );

}

const existingClient =
await duplicateQuery.first({

    useMasterKey:true

});

if(existingClient){

    throw new Error(
        "A client with these details already exists."
    );

}

    // ==========================
    // PLAN LIMIT
    // ==========================

    const maxClients = user.get("maxClients");

    const clientCount = user.get("clientCount") || 0;

    if (
        maxClients !== -1 &&
        clientCount >= maxClients
    ) {

        throw new Error(
            "You've reached your client limit. Upgrade your plan."
        );

    }

    // ==========================
    // CREATE CLIENT
    // ==========================

    const client = new Parse.Object("Clients");

    client.set("user", user);

    client.set(
        "contactPerson",
        contactPerson || ""
    );

    client.set(
        "companyName",
        companyName || ""
    );

    client.set(
        "clientEmail",
        clientEmail || ""
    );

    client.set(
        "clientPhone",
        clientPhone || ""
    );

    client.set(
        "clientTaxId",
        clientTaxId || ""
    );

    client.set(
    "billingAddressLine1",
    billingAddressLine1 || ""
);

client.set(
    "billingAddressLine2",
    billingAddressLine2 || ""
);

client.set(
    "billingCityStateZip",
    billingCityStateZip || ""
);

client.set(
    "billingCountry",
    billingCountry || ""
);

    client.set(
        "status",
        status || "Active"
    );
    
    if(clientImage){

    client.set(
        "clientImage",
        clientImage
    );

}

    client.set(
        "outstandingBalance",
        0
    );

    client.set(
        "totalInvoices",
        0
    );

    await client.save(null, {

        useMasterKey: true

    });

    // ==========================
    // UPDATE USER COUNT
    // ==========================

    user.increment("clientCount");

    await user.save(null, {

        useMasterKey: true

    });

    return {

        success: true,

        clientId: client.id,

        message:
            "Client created successfully."

    };

});

Parse.Cloud.define("getClients", async (request) => {

    const user = request.user;

    if (!user) {

        throw new Error("User not authenticated.");

    }

    const {

        search = "",

        status = "all",

        sort = "newest",

        page = 1,

        limit = 10

    } = request.params;

    const query = new Parse.Query("Clients");

    query.equalTo("user", user);

    // ==========================
    // STATUS FILTER
    // ==========================

    if (status !== "all") {

        query.equalTo(
            "status",
            status.charAt(0).toUpperCase() +
            status.slice(1)
        );

    }

    // ==========================
    // SORT
    // ==========================

    switch (sort) {

        case "name":

            query.ascending("contactPerson");

            break;

        case "balance":

    break;

        default:

            query.descending("createdAt");

    }

    // ==========================
    // SEARCH
    // ==========================

    if (search.trim()) {

        const nameQuery =
        new Parse.Query("Clients");

        nameQuery.equalTo("user", user);

        nameQuery.matches(
            "contactPerson",
            new RegExp(search, "i")
        );

        const companyQuery =
        new Parse.Query("Clients");

        companyQuery.equalTo("user", user);

        companyQuery.matches(
            "companyName",
            new RegExp(search, "i")
        );

        const emailQuery =
        new Parse.Query("Clients");

        emailQuery.equalTo("user", user);

        emailQuery.matches(
            "clientEmail",
            new RegExp(search, "i")
        );

        query._orQuery([
            nameQuery,
            companyQuery,
            emailQuery
        ]);

    }

    // ==========================
    // TOTAL RECORDS
    // ==========================

    const totalRecords =
    await query.count({

        useMasterKey: true

    });

let clients;

if (sort === "balance") {

    clients =
        await query.find({

            useMasterKey: true

        });

} else {

    query.skip(
        (page - 1) * limit
    );

    query.limit(limit);

    clients =
        await query.find({

            useMasterKey: true

        });

}
    
    const invoiceBalances = {};

if (clients.length) {

    const invoiceQuery =
        new Parse.Query("Invoices");

    invoiceQuery.equalTo(
        "user",
        user
    );

    invoiceQuery.containedIn(
        "client",
        clients
    );

    const invoices =
        await invoiceQuery.find({
            useMasterKey: true
        });

    invoices.forEach(invoice => {

        const client =
            invoice.get("client");

        if (!client) {
            return;
        }

        const clientId =
            client.id;

        const status =
            invoice.get("status") || "";

        const amount =
            Number(
                invoice.get("totalAmount")
            ) || 0;

        if (
            status !== "Paid" &&
            status !== "Cancelled" &&
            status !== "Draft"
        ) {

            invoiceBalances[clientId] =
                (invoiceBalances[clientId] || 0) +
                amount;

        }

    });

}
    
    const estimateCounts = {};

if (clients.length) {

    const estimateQuery =
        new Parse.Query("Estimates");

    estimateQuery.equalTo(
        "user",
        user
    );

    estimateQuery.containedIn(
        "client",
        clients
    );

    const estimates =
        await estimateQuery.find({

            useMasterKey: true

        });

    estimates.forEach(estimate => {

        const client =
            estimate.get("client");

        if (!client) {
            return;
        }

        const clientId =
            client.id;

        estimateCounts[clientId] =
            (estimateCounts[clientId] || 0) + 1;

    });

}
    
    const invoiceCounts = {};

if (clients.length) {

    const invoiceQuery =
        new Parse.Query("Invoices");

    invoiceQuery.equalTo(
        "user",
        user
    );

    invoiceQuery.containedIn(
        "client",
        clients
    );

    const invoices =
        await invoiceQuery.find({

            useMasterKey: true

        });

    invoices.forEach(invoice => {

        const client =
            invoice.get("client");

        if (!client) {
            return;
        }

        const clientId =
            client.id;

        invoiceCounts[clientId] =
            (invoiceCounts[clientId] || 0) + 1;

    });

}

if (sort === "balance") {

    clients.sort((a, b) => {

        const balanceA =
            invoiceBalances[a.id] || 0;

        const balanceB =
            invoiceBalances[b.id] || 0;

        return balanceB - balanceA;

    });

    const start =
        (page - 1) * limit;

    clients =
        clients.slice(
            start,
            start + limit
        );

}


    const results = [];

    clients.forEach(client => {

        results.push({

            objectId:
            client.id,

            contactPerson:
            client.get("contactPerson"),
            
            clientImageUrl:
client.get("clientImage")
    ? client.get("clientImage").url()
    : null,

            companyName:
            client.get("companyName"),

            clientEmail:
            client.get("clientEmail"),

            clientPhone:
            client.get("clientPhone"),

            outstandingBalance:
invoiceBalances[client.id] || 0,

            totalInvoices:
invoiceCounts[client.id] || 0,

totalEstimates:
estimateCounts[client.id] || 0,

            status:
            client.get("status") || "Active",
            
            clientTaxId:
client.get("clientTaxId") || "",

billingAddressLine1:
client.get("billingAddressLine1") || "",

billingAddressLine2:
client.get("billingAddressLine2") || "",

billingCityStateZip:
client.get("billingCityStateZip") || "",

billingCountry:
client.get("billingCountry") || ""

        });

    });

    return {

        currencySymbol:
        user.get("currencySymbol") || "$",

        totalRecords,

        currentPage: page,

        totalPages: Math.ceil(
            totalRecords / limit
        ),

        clients: results

    };

});

Parse.Cloud.define("getClientDetails", async (request) => {

        const user =
            request.user;

        if (!user) {

            throw new Error(
                "User not authenticated."
            );

        }

        const {
            clientId
        } = request.params;

        if (!clientId) {

            throw new Error(
                "Client ID is required."
            );

        }

        const clientQuery =
            new Parse.Query(
                "Clients"
            );

        clientQuery.equalTo(
            "user",
            user
        );

        const client =
            await clientQuery.get(
                clientId,
                {
                    useMasterKey: true
                }
            );

       const invoiceQuery =
    new Parse.Query(
        "Invoices"
    );

invoiceQuery.equalTo(
    "user",
    user
);

invoiceQuery.ascending(
    "issueDate"
);

const allInvoices =
    await invoiceQuery.find(
        {
            useMasterKey: true
        }
    );

const invoices =
    allInvoices.filter(
        invoice => {

            const invoiceClient =
                invoice.get("client");

            return (
                invoiceClient &&
                invoiceClient.id ===
                client.id
            );

        }
    );

        let totalInvoices = 0;

        let paidInvoices = 0;

        let pendingInvoices = 0;

        let overdueInvoices = 0;

        let totalRevenue = 0;

        let outstandingBalance = 0;

        let lastInvoiceDate = null;

        const today =
            new Date();

        for (
            const invoice of invoices
        ) {

            totalInvoices++;

            const status =
                invoice.get(
                    "status"
                ) || "";

            const amount =
                Number(
                    invoice.get(
                        "totalAmount"
                    )
                ) || 0;

            totalRevenue +=
                amount;

            if (
                status === "Paid"
            ) {

                paidInvoices++;

            }

            if (
    status === "Pending"
) {

    pendingInvoices++;

}

if (
    status !== "Paid" &&
    status !== "Cancelled" &&
    status !== "Draft"
) {

    outstandingBalance +=
        amount;

}

            const dueDate =
                invoice.get(
                    "dueDate"
                );

            if (
                dueDate &&
                dueDate < today &&
                status !== "Paid"
            ) {

                overdueInvoices++;

            }

            const issueDate =
                invoice.get(
                    "issueDate"
                );

            if (
                issueDate &&
                (
                    !lastInvoiceDate ||
                    issueDate >
                    lastInvoiceDate
                )
            ) {

                lastInvoiceDate =
                    issueDate;

            }

        }

        const estimateQuery =
            new Parse.Query(
                "Estimates"
            );

        estimateQuery.equalTo(
            "user",
            user
        );

        estimateQuery.equalTo(
            "client",
            client
        );

        estimateQuery.descending(
            "createdAt"
        );

        const estimates =
            await estimateQuery.find(
                {
                    useMasterKey: true
                }
            );

        const formattedEstimates =
            estimates.map(
                estimate => {

                    return {

                        objectId:
                            estimate.id,

                        estimateNumber:
                            estimate.get(
                                "estimateNumber"
                            ) || "",

                        title:
                            estimate.get(
                                "estimateTitle"
                            ) ||
                            estimate.get(
                                "title"
                            ) ||
                            "",

                        projectName:
                            estimate.get(
                                "projectName"
                            ) || "",

                        status:
                            estimate.get(
                                "status"
                            ) || "Draft",

                        grandTotal:
                            Number(
                                estimate.get(
                                    "grandTotal"
                                )
                            ) || 0,

                        issueDate:
                            estimate.get(
                                "issueDate"
                            ) || null,

                        expiryDate:
                            estimate.get(
                                "expiryDate"
                            ) || null,

                        sentAt:
                            estimate.get(
                                "sentAt"
                            ) || null

                    };

                }
            );
            
        const formattedInvoices =
            invoices.map(
        invoice => {

            return {

                objectId:
                    invoice.id,

                invoiceNumber:
                    invoice.get(
                        "invoiceNumber"
                    ) || "",

                invoiceTitle:
                    invoice.get(
                        "invoiceTitle"
                    ) || "",

                projectName:
                    invoice.get(
                        "projectName"
                    ) || "",

                status:
                    invoice.get(
                        "status"
                    ) || "Draft",

                totalAmount:
                    Number(
                        invoice.get(
                            "totalAmount"
                        )
                    ) || 0,

                issueDate:
                    invoice.get(
                        "issueDate"
                    ) || null,

                dueDate:
                    invoice.get(
                        "dueDate"
                    ) || null,

                sentAt:
                    invoice.get(
                        "sentAt"
                    ) || null

            };

        }
    );


        return {

            currencySymbol:
                user.get(
                    "currencySymbol"
                ) || "$",

            client: {

                objectId:
                    client.id,

                contactPerson:
                    client.get(
                        "contactPerson"
                    ),
                    
                clientImageUrl:
    client.get("clientImage")
        ? client.get("clientImage").url()
        : null,

                companyName:
                    client.get(
                        "companyName"
                    ),

                clientEmail:
                    client.get(
                        "clientEmail"
                    ),

                clientPhone:
                    client.get(
                        "clientPhone"
                    ),

                clientTaxId:
                    client.get(
                        "clientTaxId"
                    ),

                billingAddressLine1:
    client.get(
        "billingAddressLine1"
    ) || "",

billingAddressLine2:
    client.get(
        "billingAddressLine2"
    ) || "",

billingCityStateZip:
    client.get(
        "billingCityStateZip"
    ) || "",

billingCountry:
    client.get(
        "billingCountry"
    ) || "",

                status:
                    client.get(
                        "status"
                    ),

                totalInvoices,

                paidInvoices,

                pendingInvoices,

                overdueInvoices,

                totalRevenue,

                outstandingBalance,

                lastInvoiceDate,

                estimates:
    formattedEstimates,

invoices:
    formattedInvoices

            }

        };

    }
);

Parse.Cloud.define("updateClient", async (request) => {

    const user = request.user;

    if (!user) {

        throw new Error("User not authenticated.");

    }
    
    await checkSubscription(user);

    const {

        clientId,

        contactPerson,

        companyName,

        clientEmail,
        
        clientImage,

        clientPhone,

        clientTaxId,

        billingAddress,
        
        billingAddressLine1,
        
        billingAddressLine2,
        
        billingCityStateZip,
        
        billingCountry,

        status

    } = request.params;

    if (!clientId) {

        throw new Error("Client ID is required.");

    }

    if (!contactPerson) {

        throw new Error("Client name is required.");

    }
    
const duplicateQuery =
new Parse.Query("Clients");

duplicateQuery.equalTo(
    "user",
    user
);

if(clientEmail){

    duplicateQuery.equalTo(
        "clientEmail",
        clientEmail
    );

}else{

    duplicateQuery.equalTo(
        "contactPerson",
        contactPerson
    );

    duplicateQuery.equalTo(
        "companyName",
        companyName || ""
    );

}

const duplicates =
await duplicateQuery.find({

    useMasterKey:true

});

const existingClient =
duplicates.find(client=>

    client.id !== clientId

);

if(existingClient){

    throw new Error(
        "Another client with these details already exists."
    );

}

    const query = new Parse.Query("Clients");

    query.equalTo("user", user);

    const client = await query.get(clientId, {

        useMasterKey: true

    });

    client.set(
        "contactPerson",
        contactPerson || ""
    );

    client.set(
        "companyName",
        companyName || ""
    );

    client.set(
        "clientEmail",
        clientEmail || ""
    );

    client.set(
        "clientPhone",
        clientPhone || ""
    );

    client.set(
        "clientTaxId",
        clientTaxId || ""
    );

    client.set(
    "billingAddressLine1",
    billingAddressLine1 || ""
);

client.set(
    "billingAddressLine2",
    billingAddressLine2 || ""
);

client.set(
    "billingCityStateZip",
    billingCityStateZip || ""
);

client.set(
    "billingCountry",
    billingCountry || ""
);

    client.set(
        "status",
        status || "Active"
    );
    
    if(clientImage){

    client.set(
        "clientImage",
        clientImage
    );

}
    
    await client.save(null, {

        useMasterKey: true

    });
    
    return {

        success: true,

        message: "Client updated successfully."

    };

});

Parse.Cloud.define("deleteClient", async (request) => {

    const user = request.user;

    if (!user) {

        throw new Error("User not authenticated.");

    }

    const { clientId } = request.params;

    if (!clientId) {

        throw new Error("Client ID is required.");

    }

    const query = new Parse.Query("Clients");

    query.equalTo("user", user);

    const client = await query.get(clientId, {

        useMasterKey: true

    });

    await client.destroy({

        useMasterKey: true

    });

    const currentCount =
    user.get("clientCount") || 0;

    if(currentCount > 0){

        user.increment(
            "clientCount",
            -1
        );

        await user.save(null,{

            useMasterKey:true

        });

    }

    return{

        success:true,

        message:
        "Client deleted successfully."

    };

});

Parse.Cloud.define("getClientStatistics", async (request) => {

    const user = request.user;

    if (!user) {

        throw new Error("User not authenticated.");

    }

    const query = new Parse.Query("Clients");

    query.equalTo("user", user);

    const clients = await query.find({

        useMasterKey: true

    });

    let totalClients = 0;

    let activeClients = 0;

    let inactiveClients = 0;

    let outstandingBalance = 0;

    if (clients.length) {

        const invoiceQuery =
            new Parse.Query("Invoices");

        invoiceQuery.equalTo(
            "user",
            user
        );

        invoiceQuery.containedIn(
            "client",
            clients
        );

        const invoices =
            await invoiceQuery.find({

                useMasterKey: true

            });

        invoices.forEach(invoice => {

            const status =
                invoice.get("status") || "";

            const amount =
                Number(
                    invoice.get("totalAmount")
                ) || 0;

            if (
                status !== "Paid" &&
                status !== "Cancelled" &&
                status !== "Draft"
            ) {

                outstandingBalance += amount;

            }

        });

    }

    clients.forEach(client => {

        totalClients++;

        const status =
            client.get("status") || "Active";

        if (status === "Active") {

            activeClients++;

        } else {

            inactiveClients++;

        }

    });

    return {

        currencySymbol:
            user.get("currencySymbol") || "$",

        totalClients,

        activeClients,

        inactiveClients,

        outstandingBalance

    };

});

Parse.Cloud.define(
"sendEstimateToClient",
async (request) => {

    const user = request.user;

    if (!user) {
        throw new Error("User not authenticated.");
    }

    const { estimateId, message } = request.params || {};

    if (!estimateId) {
        throw new Error("Estimate ID is required.");
    }

    const sendGridApiKey = process.env.SENDGRID_API_KEY;

    if (!sendGridApiKey) {
        throw new Error("SendGrid API key is not configured.");
    }

    const sendGridFromEmail = process.env.SENDGRID_FROM_EMAIL;

    if (!sendGridFromEmail) {
        throw new Error("SendGrid sender email is not configured.");
    }

    const estimateQuery = new Parse.Query("Estimates");

    estimateQuery.equalTo("user", user);
    estimateQuery.include("client");

    const estimate = await estimateQuery.get(
        estimateId,
        { useMasterKey: true }
    );

    if (!estimate) {
        throw new Error("Estimate not found.");
    }

    const client = estimate.get("client");

    if (!client) {
        throw new Error("Client not found.");
    }

    const clientEmail =
        client.get("clientEmail") ||
        estimate.get("clientEmail");

    if (!clientEmail) {
        throw new Error("This client does not have an email address.");
    }

    const contactPerson =
        client.get("contactPerson") ||
        estimate.get("contactPerson") ||
        client.get("companyName") ||
        estimate.get("companyName") ||
        "Client";

    const itemQuery = new Parse.Query("EstimateItems");

    itemQuery.equalTo("estimate", estimate);
    itemQuery.ascending("createdAt");

    const itemResults = await itemQuery.find({
        useMasterKey: true
    });

    const items = itemResults.map(item => ({
        objectId: item.id,
        description: item.get("description") || "",
        itemName: item.get("itemName") || "",
        name: item.get("name") || "",
        quantity: Number(item.get("quantity")) || 0,
        unitPrice: Number(item.get("unitPrice")) || 0,
        rate: Number(item.get("rate")) || 0,
        price: Number(item.get("price")) || 0,
        amount: Number(item.get("amount")) || 0,
        total: Number(item.get("total")) || 0
    }));

    const getFileUrl = file => {
        if (!file) {
            return "";
        }

        if (typeof file === "string") {
            return file;
        }

        if (typeof file.url === "function") {
            return file.url() || "";
        }

        return file.url || "";
    };

    const signatureImage = estimate.get("signatureImage");

    const profilePaymentDetails =
        user.get("paymentDetails") &&
        typeof user.get("paymentDetails") === "object"
            ? user.get("paymentDetails")
            : {};

    const estimatePaymentDetails =
        estimate.get("paymentDetails") &&
        typeof estimate.get("paymentDetails") === "object"
            ? estimate.get("paymentDetails")
            : {};

    const paymentDetails = {
        ...profilePaymentDetails,
        ...estimatePaymentDetails
    };

    const estimateData = {
        estimate: {
            objectId: estimate.id,
            estimateNumber: estimate.get("estimateNumber") || "",
            title: estimate.get("title") || "",
            estimateTitle: estimate.get("estimateTitle") || "",
            projectName: estimate.get("projectName") || "",
            referenceNumber: estimate.get("referenceNumber") || "",
            purchaseOrder: estimate.get("purchaseOrder") || "",
            issueDate: estimate.get("issueDate"),
            expiryDate: estimate.get("expiryDate"),
            status: estimate.get("status") || "Draft",
            currencyCode:
                estimate.get("currencyCode") ||
                user.get("currencyCode") ||
                "USD",
            currencySymbol:
                estimate.get("currencySymbol") ||
                user.get("currencySymbol") ||
                "$",
            subtotal: Number(estimate.get("subtotal")) || 0,
            taxPercent: Number(estimate.get("taxPercent")) || 0,
            taxAmount: Number(estimate.get("taxAmount")) || 0,
            tax: Number(estimate.get("tax")) || 0,
            discount: Number(estimate.get("discount")) || 0,
            shipping: Number(estimate.get("shipping")) || 0,
            grandTotal: Number(estimate.get("grandTotal")) || 0,
            totalAmount: Number(estimate.get("totalAmount")) || 0,
            contactPerson:
                estimate.get("contactPerson") ||
                client.get("contactPerson") ||
                "",
            companyName:
                estimate.get("companyName") ||
                client.get("companyName") ||
                "",
            clientEmail,
            clientPhone:
                estimate.get("clientPhone") ||
                client.get("clientPhone") ||
                "",
            billingAddress:
                estimate.get("billingAddress") ||
                client.get("billingAddress") ||
                "",
            billingAddressLine1:
                estimate.get("billingAddressLine1") ||
                client.get("billingAddressLine1") ||
                "",
            billingAddressLine2:
                estimate.get("billingAddressLine2") ||
                client.get("billingAddressLine2") ||
                "",
            billingCityStateZip:
                estimate.get("billingCityStateZip") ||
                client.get("billingCityStateZip") ||
                "",
            billingCountry:
                estimate.get("billingCountry") ||
                client.get("billingCountry") ||
                "",
            notes: estimate.get("notes") || "",
            terms:
                estimate.get("terms") ||
                estimate.get("termsConditions") ||
                "",
            termsConditions: estimate.get("termsConditions") || "",
            validityMessage: estimate.get("validityMessage") || "",
            signatureName: estimate.get("signatureName") || "",
            signatureTitle: estimate.get("signatureTitle") || "",
            signatureImage: getFileUrl(signatureImage),
            paymentDetails
        },

        client: {
            objectId: client.id,
            contactPerson: client.get("contactPerson") || "",
            companyName: client.get("companyName") || "",
            clientEmail,
            clientPhone: client.get("clientPhone") || "",
            clientTaxId: client.get("clientTaxId") || "",
            billingAddress: client.get("billingAddress") || "",
            billingAddressLine1: client.get("billingAddressLine1") || "",
            billingAddressLine2: client.get("billingAddressLine2") || "",
            billingCityStateZip: client.get("billingCityStateZip") || "",
            billingCountry: client.get("billingCountry") || ""
        },

        company: {
            businessName: user.get("businessName") || "InvoicePro",
            businessAddress: user.get("businessAddress") || "",
            businessPhone: user.get("businessPhone") || "",
            businessEmail: user.get("businessEmail") || "",
            businessLogo: getFileUrl(
                user.get("businessLogo") ||
                user.get("logo") ||
                user.get("logoImage")
            ),
            salesRepresentative:
                user.get("fullName") ||
                user.get("name") ||
                ""
        },

        user: {
            objectId: user.id,
            businessName: user.get("businessName") || "InvoicePro",
            fullName: user.get("fullName") || "",
            name: user.get("name") || "",
            email: user.get("email") || "",
            currencyCode: user.get("currencyCode") || "USD",
            currencySymbol: user.get("currencySymbol") || "$",
            businessAddress: user.get("businessAddress") || "",
            businessPhone: user.get("businessPhone") || "",
            businessEmail: user.get("businessEmail") || "",
            logo: getFileUrl(user.get("logo")),
            businessLogo: getFileUrl(user.get("businessLogo")),
            logoImage: getFileUrl(user.get("logoImage")),
            paymentDetails
        },

        items,

        currencySymbol:
            estimate.get("currencySymbol") ||
            user.get("currencySymbol") ||
            "$",

        currencyCode:
            estimate.get("currencyCode") ||
            user.get("currencyCode") ||
            "USD",

        message: message || ""
    };

    const EstimateEmailTemplate =
        require("./estimateEmailTemplate.js");

    if (
        !EstimateEmailTemplate ||
        typeof EstimateEmailTemplate.loadTemplateSections !== "function" ||
        typeof EstimateEmailTemplate.build !== "function"
    ) {
        throw new Error("Estimate email template is not configured correctly.");
    }

    let templateSections;

    try {
        templateSections =
            await EstimateEmailTemplate.loadTemplateSections(
                user
            );
    } catch (error) {
        console.error("Estimate template loading error:", error);
        throw new Error("Unable to load the saved estimate template.");
    }

    const renderedEmail =
        EstimateEmailTemplate.build(
            estimateData,
            templateSections
        );

    if (
        !renderedEmail ||
        !renderedEmail.html
    ) {
        throw new Error("Estimate email template did not return valid email content.");
    }

    let finalText =
        renderedEmail.text ||
        `Estimate ${estimateData.estimate.estimateNumber} from ${estimateData.company.businessName}`;

    let finalHtml =
        renderedEmail.html;

    if (message) {
        const escapedMessage =
            EstimateEmailTemplate.escape(message)
                .replace(/\r\n/g, "\n")
                .replace(/\r/g, "\n")
                .replace(/\n/g, "<br>");

        const htmlMessage = `
<div style="max-width:736px;margin:0 auto 18px;padding:20px;background:#ffffff;border-radius:10px;font-family:Arial,Helvetica,sans-serif;color:#334155;line-height:1.7;">
    ${escapedMessage}
</div>`;

        finalText =
            `${message}\n\n${finalText}`;

        finalHtml =
            finalHtml.replace(
                "<body>",
                `<body>${htmlMessage}`
            );
    }

    const estimateNumber =
        estimate.get("estimateNumber") || "Estimate";

    const businessName =
        user.get("businessName") || "InvoicePro";

    const sendGridData = {
        personalizations: [
            {
                to: [
                    {
                        email: clientEmail,
                        name: contactPerson
                    }
                ]
            }
        ],
        from: {
            email: sendGridFromEmail,
            name: businessName
        },
        subject:
            renderedEmail.subject ||
            `Estimate ${estimateNumber} from ${businessName}`,
        content: [
            {
                type: "text/plain",
                value: finalText
            },
            {
                type: "text/html",
                value: finalHtml
            }
        ]
    };

    let sendGridResponse;

    try {
        sendGridResponse =
            await fetch(
                "https://api.sendgrid.com/v3/mail/send",
                {
                    method: "POST",
                    headers: {
                        "Authorization":
                            `Bearer ${sendGridApiKey}`,
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify(sendGridData)
                }
            );
    } catch (error) {
        console.error("SendGrid connection error:", error);
        throw new Error("Unable to connect to SendGrid.");
    }

    if (!sendGridResponse.ok) {
        let errorText = "";

        try {
            errorText = await sendGridResponse.text();
        } catch (error) {
            errorText = "";
        }

        console.error("SendGrid error:", errorText);
        throw new Error("SendGrid could not send the estimate email.");
    }

    const sentAt = new Date();

    estimate.set("sentAt", sentAt);
    estimate.set("sentTo", clientEmail);
    estimate.set("lastSentAt", sentAt);
    estimate.increment("sendCount");

    await estimate.save(
        null,
        { useMasterKey: true }
    );

    return {
        success: true,
        message: "Estimate sent successfully.",
        estimateId: estimate.id,
        estimateNumber,
        sentTo: clientEmail,
        sentAt
    };
}
);

Parse.Cloud.define(
    "sendInvoiceToClient",
    async request => {

        const user = request.user;

        if (!user) {
            throw new Error("User not authenticated.");
        }

        const {
            invoiceId,
            message
        } = request.params || {};

        if (!invoiceId) {
            throw new Error("Invoice ID is required.");
        }

        const sendGridApiKey =
            process.env.SENDGRID_API_KEY;

        if (!sendGridApiKey) {
            throw new Error("SendGrid API key is not configured.");
        }

        const sendGridFromEmail =
            process.env.SENDGRID_FROM_EMAIL;

        if (!sendGridFromEmail) {
            throw new Error("SendGrid sender email is not configured.");
        }

        const invoiceQuery =
            new Parse.Query("Invoices");

        invoiceQuery.equalTo("user", user);
        invoiceQuery.include("client");

        const invoice =
            await invoiceQuery.get(
                invoiceId,
                {
                    useMasterKey: true
                }
            );

        if (!invoice) {
            throw new Error("Invoice not found.");
        }

        let client =
            invoice.get("client") || null;

        if (!client) {
            const clientId =
                invoice.get("clientId");

            if (clientId) {
                try {
                    const Client =
                        Parse.Object.extend("Clients");

                    const clientQuery =
                        new Parse.Query(Client);

                    client =
                        await clientQuery.get(
                            String(clientId),
                            {
                                useMasterKey: true
                            }
                        );
                } catch (error) {
                    client = null;
                }
            }
        }

        const getValue = (
            source,
            ...keys
        ) => {
            if (!source) {
                return "";
            }

            for (const key of keys) {
                const value =
                    typeof source.get === "function"
                        ? source.get(key)
                        : source[key];

                if (
                    value !== undefined &&
                    value !== null &&
                    String(value).trim() !== ""
                ) {
                    return value;
                }
            }

            return "";
        };

        const clientEmail =
            getValue(
                client,
                "clientEmail",
                "email"
            ) ||
            getValue(
                invoice,
                "clientEmail"
            );

        if (!clientEmail) {
            throw new Error(
                "This client does not have an email address."
            );
        }

        const contactPerson =
            getValue(
                client,
                "contactPerson"
            ) ||
            getValue(
                invoice,
                "contactPerson",
                "companyName"
            ) ||
            getValue(
                client,
                "companyName"
            ) ||
            "Client";

        const itemQuery =
            new Parse.Query("InvoiceItems");

        itemQuery.equalTo(
            "invoice",
            invoice
        );

        itemQuery.ascending("createdAt");

        const itemResults =
            await itemQuery.find({
                useMasterKey: true
            });

        const items =
            itemResults.map(
                item => ({
                    objectId: item.id,

                    description:
                        Number(item.get("quantity")) ||
                        item.get("description") ||
                        item.get("name") ||
                        "",

                    itemName:
                        item.get("itemName") ||
                        item.get("name") ||
                        "",

                    name:
                        item.get("name") ||
                        item.get("description") ||
                        "",

                    quantity:
                        Number(
                            item.get("quantity")
                        ) || 0,

                    unitPrice:
                        Number(
                            item.get("unitPrice")
                        ) ||
                        Number(
                            item.get("rate")
                        ) ||
                        0,

                    rate:
                        Number(
                            item.get("rate")
                        ) ||
                        Number(
                            item.get("unitPrice")
                        ) ||
                        0,

                    amount:
                        Number(
                            item.get("amount")
                        ) ||
                        Number(
                            item.get("total")
                        ) ||
                        0,

                    price:
                        Number(
                            item.get("price")
                        ) || 0,

                    total:
                        Number(
                            item.get("total")
                        ) ||
                        Number(
                            item.get("amount")
                        ) ||
                        0
                })
            );

        const getFileUrl = file => {
            if (!file) {
                return "";
            }

            if (
                typeof file.url === "function"
            ) {
                return file.url() || "";
            }

            return file.url || "";
        };

        const clientData = {
            objectId:
                client?.id || "",

            contactPerson:
                getValue(
                    client,
                    "contactPerson"
                ) ||
                getValue(
                    invoice,
                    "contactPerson"
                ) ||
                "",

            companyName:
                getValue(
                    client,
                    "companyName"
                ) ||
                getValue(
                    invoice,
                    "companyName"
                ) ||
                "",

            clientEmail,

            clientPhone:
                getValue(
                    client,
                    "clientPhone",
                    "phone"
                ) ||
                getValue(
                    invoice,
                    "clientPhone"
                ) ||
                "",

            clientTaxId:
                getValue(
                    client,
                    "clientTaxId"
                ) ||
                getValue(
                    invoice,
                    "clientTaxId"
                ) ||
                "",

            clientImageUrl:
                getFileUrl(
                    getValue(
                        client,
                        "clientImage"
                    )
                ) ||
                getValue(
                    client,
                    "clientImageUrl"
                ) ||
                getValue(
                    invoice,
                    "clientImageUrl"
                ) ||
                "",

            billingAddress:
                getValue(
                    client,
                    "billingAddress"
                ) ||
                getValue(
                    invoice,
                    "billingAddress"
                ) ||
                "",

            billingAddressLine1:
                getValue(
                    client,
                    "billingAddressLine1"
                ) ||
                getValue(
                    invoice,
                    "billingAddressLine1"
                ) ||
                "",

            billingAddressLine2:
                getValue(
                    client,
                    "billingAddressLine2"
                ) ||
                getValue(
                    invoice,
                    "billingAddressLine2"
                ) ||
                "",

            billingCityStateZip:
                getValue(
                    client,
                    "billingCityStateZip"
                ) ||
                getValue(
                    invoice,
                    "billingCityStateZip"
                ) ||
                "",

            billingCountry:
                getValue(
                    client,
                    "billingCountry"
                ) ||
                getValue(
                    invoice,
                    "billingCountry"
                ) ||
                ""
        };

        const signatureImage =
            invoice.get(
                "signatureImage"
            );

        const logoFile =
            user.get("businessLogo") ||
            user.get("logo") ||
            user.get("logoImage");

        const invoiceData = {
            invoice: {
                objectId:
                    invoice.id,

                invoiceNumber:
                    invoice.get(
                        "invoiceNumber"
                    ) || "",

                invoiceTitle:
                    invoice.get(
                        "invoiceTitle"
                    ) || "",

                projectName:
                    invoice.get(
                        "projectName"
                    ) || "",

                referenceNumber:
                    invoice.get(
                        "referenceNumber"
                    ) || "",

                purchaseOrder:
                    invoice.get(
                        "purchaseOrder"
                    ) || "",

                issueDate:
                    invoice.get(
                        "issueDate"
                    ),

                dueDate:
                    invoice.get(
                        "dueDate"
                    ),

                paymentTerms:
                    invoice.get(
                        "paymentTerms"
                    ) || "",

                status:
                    invoice.get(
                        "status"
                    ) || "Draft",

                currencyCode:
                    invoice.get(
                        "currencyCode"
                    ) ||
                    user.get(
                        "currencyCode"
                    ) ||
                    "USD",

                currencySymbol:
                    invoice.get(
                        "currencySymbol"
                    ) ||
                    user.get(
                        "currencySymbol"
                    ) ||
                    "$",

                subtotal:
                    Number(
                        invoice.get(
                            "subtotal"
                        )
                    ) || 0,

                taxPercent:
                    Number(
                        invoice.get(
                            "taxPercent"
                        )
                    ) || 0,

                taxAmount:
                    Number(
                        invoice.get(
                            "taxAmount"
                        )
                    ) ||
                    Number(
                        invoice.get(
                            "tax"
                        )
                    ) || 0,

                tax:
                    Number(
                        invoice.get(
                            "tax"
                        )
                    ) ||
                    Number(
                        invoice.get(
                            "taxAmount"
                        )
                    ) || 0,

                discount:
                    Number(
                        invoice.get(
                            "discount"
                        )
                    ) || 0,

                shipping:
                    Number(
                        invoice.get(
                            "shipping"
                        )
                    ) || 0,

                totalAmount:
                    Number(
                        invoice.get(
                            "totalAmount"
                        )
                    ) || 0,

                paymentDetails:
                    invoice.get(
                        "paymentDetails"
                    ) || {},

                contactPerson:
                    getValue(
                        invoice,
                        "contactPerson"
                    ) ||
                    clientData.contactPerson,

                companyName:
                    getValue(
                        invoice,
                        "companyName"
                    ) ||
                    clientData.companyName,

                clientEmail,

                clientPhone:
                    getValue(
                        invoice,
                        "clientPhone"
                    ) ||
                    clientData.clientPhone,

                clientTaxId:
                    getValue(
                        invoice,
                        "clientTaxId"
                    ) ||
                    clientData.clientTaxId,

                billingAddress:
                    getValue(
                        invoice,
                        "billingAddress"
                    ) ||
                    clientData.billingAddress,

                billingAddressLine1:
                    getValue(
                        invoice,
                        "billingAddressLine1"
                    ) ||
                    clientData.billingAddressLine1,

                billingAddressLine2:
                    getValue(
                        invoice,
                        "billingAddressLine2"
                    ) ||
                    clientData.billingAddressLine2,

                billingCityStateZip:
                    getValue(
                        invoice,
                        "billingCityStateZip"
                    ) ||
                    clientData.billingCityStateZip,

                billingCountry:
                    getValue(
                        invoice,
                        "billingCountry"
                    ) ||
                    clientData.billingCountry,

                notes:
                    invoice.get(
                        "notes"
                    ) || "",

                terms:
                    invoice.get(
                        "terms"
                    ) || "",

                termsConditions:
                    invoice.get(
                        "termsConditions"
                    ) ||
                    invoice.get(
                        "terms"
                    ) || "",

                signatureName:
                    invoice.get(
                        "signatureName"
                    ) || "",

                signatureTitle:
                    invoice.get(
                        "signatureTitle"
                    ) || "",

                signatureImage:
                    getFileUrl(
                        signatureImage
                    )
            },

            client: clientData,

            company: {
                businessName:
                    user.get(
                        "businessName"
                    ) ||
                    "InvoicePro",

                businessAddress:
                    user.get(
                        "businessAddress"
                    ) || "",

                businessPhone:
                    user.get(
                        "businessPhone"
                    ) || "",

                businessEmail:
                    user.get(
                        "businessEmail"
                    ) || "",

                businessLogo:
                    getFileUrl(
                        logoFile
                    ),

                salesRepresentative:
                    user.get(
                        "fullName"
                    ) ||
                    user.get(
                        "name"
                    ) ||
                    ""
            },

            user: {
                objectId:
                    user.id,

                businessName:
                    user.get(
                        "businessName"
                    ) ||
                    "InvoicePro",

                fullName:
                    user.get(
                        "fullName"
                    ) || "",

                name:
                    user.get(
                        "name"
                    ) || "",

                email:
                    user.get(
                        "email"
                    ) || "",

                currencyCode:
                    user.get(
                        "currencyCode"
                    ) ||
                    "USD",

                currencySymbol:
                    user.get(
                        "currencySymbol"
                    ) ||
                    "$",

                businessAddress:
                    user.get(
                        "businessAddress"
                    ) || "",

                businessPhone:
                    user.get(
                        "businessPhone"
                    ) || "",

                businessEmail:
                    user.get(
                        "businessEmail"
                    ) || "",

                logo:
                    getFileUrl(
                        user.get(
                            "logo"
                        )
                    ),

                businessLogo:
                    getFileUrl(
                        user.get(
                            "businessLogo"
                        )
                    ),

                logoImage:
                    getFileUrl(
                        user.get(
                            "logoImage"
                        )
                    )
            },

            items,

            paymentDetails:
                invoice.get(
                    "paymentDetails"
                ) || {},

            currencySymbol:
                invoice.get(
                    "currencySymbol"
                ) ||
                user.get(
                    "currencySymbol"
                ) ||
                "$",

            currencyCode:
                invoice.get(
                    "currencyCode"
                ) ||
                user.get(
                    "currencyCode"
                ) ||
                "USD",

            message:
                message || "",

            userParseObject:
                user
        };

        const InvoiceEmailTemplate =
            require(
                "./invoiceEmailTemplate.js"
            );

        if (
            !InvoiceEmailTemplate ||
            typeof InvoiceEmailTemplate.build !==
                "function"
        ) {
            throw new Error(
                "Invoice email template is not configured correctly."
            );
        }

        const renderedEmail =
            await InvoiceEmailTemplate.build(
                invoiceData
            );

        if (
            !renderedEmail ||
            !renderedEmail.html
        ) {
            throw new Error(
                "Invoice email template did not return valid email content."
            );
        }

        const finalText =
            renderedEmail.text ||
            `Invoice ${invoiceData.invoice.invoiceNumber} from ${invoiceData.company.businessName}`;

        const finalHtml =
            renderedEmail.html;

        const sendGridData = {
            personalizations: [
                {
                    to: [
                        {
                            email:
                                clientEmail,

                            name:
                                contactPerson
                        }
                    ]
                }
            ],

            from: {
                email:
                    sendGridFromEmail,

                name:
                    invoiceData.company.businessName
            },

            subject:
                renderedEmail.subject ||
                `Invoice ${invoiceData.invoice.invoiceNumber} from ${invoiceData.company.businessName}`,

            content: [
                {
                    type: "text/plain",
                    value: finalText
                },
                {
                    type: "text/html",
                    value: finalHtml
                }
            ]
        };

        let sendGridResponse;

        try {
            sendGridResponse =
                await fetch(
                    "https://api.sendgrid.com/v3/mail/send",
                    {
                        method: "POST",

                        headers: {
                            Authorization:
                                `Bearer ${sendGridApiKey}`,

                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                sendGridData
                            )
                    }
                );
        } catch (error) {
            console.error(
                "SendGrid connection error:",
                error
            );

            throw new Error(
                "Unable to connect to SendGrid."
            );
        }

        if (!sendGridResponse.ok) {
            let errorText = "";

            try {
                errorText =
                    await sendGridResponse.text();
            } catch (error) {
                errorText = "";
            }

            console.error(
                "SendGrid error:",
                errorText
            );

            throw new Error(
                "SendGrid could not send the invoice email."
            );
        }

        const sentAt =
            new Date();

        invoice.set(
            "sentAt",
            sentAt
        );

        invoice.set(
            "sentTo",
            clientEmail
        );

        invoice.set(
            "lastSentAt",
            sentAt
        );

        invoice.increment(
            "sendCount"
        );

        await invoice.save(
            null,
            {
                useMasterKey: true   }
        );

        return {
            success: true,

            message:
                "Invoice sent successfully.",

            invoiceId:
                invoice.id,

            invoiceNumber:
                invoiceData.invoice.invoiceNumber,

            sentTo:
                clientEmail,

            sentAt
        };
    }
);

Parse.Cloud.define(
    "getClientHistory",
    async (request) => {

        const user =
            request.user;

        if (!user) {

            throw new Error(
                "You must be logged in."
            );

        }

        const {
            clientId
        } = request.params;

        if (!clientId) {

            throw new Error(
                "Client ID is required."
            );

        }


        const clientQuery =
            new Parse.Query("Client");

        const client =
            await clientQuery.get(
                clientId,
                {
                    useMasterKey: false
                }
            );


        if (!client) {

            throw new Error(
                "Client not found."
            );

        }


        const clientPointer =
            client;


        const clientIdValue =
            client.id;


        const estimatePointerQuery =
            new Parse.Query("Estimate");

        estimatePointerQuery.equalTo(
            "client",
            clientPointer
        );


        const estimateClientIdQuery =
            new Parse.Query("Estimate");

        estimateClientIdQuery.equalTo(
            "clientId",
            clientIdValue
        );


        const estimateQuery =
            Parse.Query.or(
                estimatePointerQuery,
                estimateClientIdQuery
            );


        estimateQuery.descending(
            "createdAt"
        );


        const invoicePointerQuery =
            new Parse.Query("Invoice");

        invoicePointerQuery.equalTo(
            "client",
            clientPointer
        );


        const invoiceClientIdQuery =
            new Parse.Query("Invoice");

        invoiceClientIdQuery.equalTo(
            "clientId",
            clientIdValue
        );


        const invoiceQuery =
            Parse.Query.or(
                invoicePointerQuery,
                invoiceClientIdQuery
            );


        invoiceQuery.descending(
            "createdAt"
        );


        const [
            estimates,
            invoices
        ] =
            await Promise.all([
                estimateQuery.find({
                    useMasterKey: false
                }),
                invoiceQuery.find({
                    useMasterKey: false
                })
            ]);


        const clientData =
            client.toJSON();


        const estimateData =
            estimates.map(
                estimate =>
                    estimate.toJSON()
            );


        const invoiceData =
            invoices.map(
                invoice =>
                    invoice.toJSON()
            );


        return {

            success: true,

            client: clientData,

            estimates:
                estimateData,

            invoices:
                invoiceData,

            totalEstimates:
                estimateData.length,

            totalInvoices:
                invoiceData.length

        };

    }
);