const CACHE_NAME = "invoicepro-v2";

const OFFLINE_PAGE = "./offline.html";

const STATIC_ASSETS = [
    "./",
    "./index.html",
    "./manifest.json",
    "./icon-192.png",
    "./icon-512.png",
    "./offline.html"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(STATIC_ASSETS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys()
            .then(cacheNames =>
                Promise.all(
                    cacheNames
                        .filter(cacheName => cacheName !== CACHE_NAME)
                        .map(cacheName => caches.delete(cacheName))
                )
            )
            .then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", event => {
    const request = event.request;

    if (request.method !== "GET") {
        return;
    }

    const url = new URL(request.url);

    if (url.origin !== self.location.origin) {
        return;
    }

    if (request.mode === "navigate") {
        event.respondWith(
            fetch(request)
                .then(response => {
                    if (response && response.ok) {
                        const responseClone = response.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(request, responseClone);
                            });
                    }

                    return response;
                })
                .catch(() =>
                    caches.match(request)
                        .then(cachedResponse => {
                            if (cachedResponse) {
                                return cachedResponse;
                            }

                            return caches.match(OFFLINE_PAGE);
                        })
                )
        );

        return;
    }

    event.respondWith(
        caches.match(request)
            .then(cachedResponse => {
                const networkRequest = fetch(request)
                    .then(response => {
                        if (response && response.ok) {
                            const responseClone = response.clone();

                            caches.open(CACHE_NAME)
                                .then(cache => {
                                    cache.put(request, responseClone);
                                });
                        }

                        return response;
                    })
                    .catch(() => cachedResponse);

                return cachedResponse || networkRequest;
            })
    );
});

self.addEventListener("message", event => {
    if (!event.data) {
        return;
    }

    if (event.data.type === "SKIP_WAITING") {
        self.skipWaiting();
    }

    if (event.data.type === "CLEAR_CACHE") {
        event.waitUntil(
            caches.keys()
                .then(cacheNames =>
                    Promise.all(
                        cacheNames.map(cacheName => caches.delete(cacheName))
                    )
                )
        );
    }
});

self.addEventListener("push", event => {
    if (!event.data) {
        return;
    }

    let data;

    try {
        data = event.data.json();
    } catch (error) {
        data = {
            title: "Invoice Pro",
            body: event.data.text()
        };
    }

    const title = data.title || "Invoice Pro";

    const options = {
        body: data.body || "",
        icon: data.icon || "./icon-192.png",
        badge: data.badge || "./icon-192.png",
        data: data.data || {},
        tag: data.tag || "invoicepro-notification",
        renotify: Boolean(data.renotify),
        requireInteraction: Boolean(data.requireInteraction)
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener("notificationclick", event => {
    event.notification.close();

    const notificationData = event.notification.data || {};

    const targetUrl =
        notificationData.url ||
        notificationData.path ||
        "./";

    event.waitUntil(
        clients.matchAll({
            type: "window",
            includeUncontrolled: true
        })
        .then(clientList => {
            for (const client of clientList) {
                if ("focus" in client) {
                    if (targetUrl) {
                        client.navigate(targetUrl);
                    }

                    return client.focus();
                }
            }

            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});