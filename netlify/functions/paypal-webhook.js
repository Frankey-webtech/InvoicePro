exports.handler = async (event) => {

    if (event.httpMethod !== "POST") {

        return {
            statusCode: 405,
            body: "Method Not Allowed"
        };

    }

    try {

        const body =
            event.body || "";

        const webhookEvent =
            JSON.parse(body);

        const headers =
            event.headers || {};

        const getHeader = (name) => {

            const key =
                Object.keys(headers)
                    .find(
                        key =>
                            key.toLowerCase() ===
                            name.toLowerCase()
                    );

            return key
                ? headers[key]
                : "";
        };

        const transmissionId =
            getHeader(
                "paypal-transmission-id"
            );

        const transmissionTime =
            getHeader(
                "paypal-transmission-time"
            );

        const transmissionSig =
            getHeader(
                "paypal-transmission-sig"
            );

        const certUrl =
            getHeader(
                "paypal-cert-url"
            );

        const authAlgo =
            getHeader(
                "paypal-auth-algo"
            );

        if (
            !transmissionId ||
            !transmissionTime ||
            !transmissionSig ||
            !certUrl ||
            !authAlgo
        ) {

            return {
                statusCode: 400,
                body:
                    "Missing PayPal webhook headers."
            };

        }

        const credentials =
    Buffer
        .from(
            `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
        )
        .toString("base64");

const tokenResponse =
    await fetch(
        process.env.PAYPAL_API_BASE_URL +
        "/v1/oauth2/token",
        {

            method: "POST",

            headers: {

                Authorization:
                    `Basic ${credentials}`,

                "Content-Type":
                    "application/x-www-form-urlencoded",

                Accept:
                    "application/json"

            },

            body:
                "grant_type=client_credentials"

        }
    );

const tokenData =
    await tokenResponse.json();

if (
    !tokenResponse.ok ||
    !tokenData.access_token
) {

    throw new Error(
        "Unable to obtain PayPal access token."
    );

}

const accessToken =
    tokenData.access_token;

        const verifyResponse =
            await fetch(
                process.env.PAYPAL_API_BASE_URL +
                "/v1/notifications/verify-webhook-signature",
                {

                    method: "POST",

                    headers: {

                        Authorization:
                            `Bearer ${accessToken}`,

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        auth_algo:
                            authAlgo,

                        cert_url:
                            certUrl,

                        transmission_id:
                            transmissionId,

                        transmission_sig:
                            transmissionSig,

                        transmission_time:
                            transmissionTime,

                        webhook_id:
                            process.env.PAYPAL_WEBHOOK_ID,

                        webhook_event:
                            webhookEvent

                    })

                }
            );

        const verification =
            await verifyResponse.json();

        if (
            !verifyResponse.ok ||
            verification.verification_status !==
                "SUCCESS"
        ) {

            return {
                statusCode: 400,
                body:
                    "Invalid PayPal webhook signature."
            };

        }

        const parseResponse =
            await fetch(
                process.env.PARSE_SERVER_URL +
                "/functions/processPayPalWebhook",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "X-Parse-Application-Id":
                            process.env.PARSE_APP_ID,

                        "X-Parse-Master-Key":
                            process.env.PARSE_MASTER_KEY

                    },

                    body: JSON.stringify({

                        event:
                            webhookEvent

                    })

                }
            );

        const result =
            await parseResponse.json();

        if (!parseResponse.ok) {

            throw new Error(
                result.error ||
                "Unable to process PayPal webhook."
            );

        }

        return {

            statusCode: 200,

            body: JSON.stringify({
                success: true
            })

        };

    } catch (error) {

        console.error(
            "PayPal webhook error:",
            error
        );

        return {

            statusCode: 500,

            body:
                "Webhook processing failed."

        };

    }

};
