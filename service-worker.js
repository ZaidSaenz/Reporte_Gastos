// ============================================================
// OFFLINE APPLICATION CACHE
// ============================================================
//
// Stores the essential application files so the expense
// tracker can continue working without an internet connection.
//
// Increase CACHE_VERSION whenever important files change:
//
// v1 -> v2 -> v3
//
// ============================================================

const CACHE_PREFIX =
  "expense-tracker";

const CACHE_VERSION =
  "v1";

const CACHE_NAME =
  `${CACHE_PREFIX}-${CACHE_VERSION}`;


// ============================================================
// APPLICATION FILES
// ============================================================
//
// Important:
//
// Every file listed here must exist. If one of them is missing,
// the service worker installation will fail.
//
// ============================================================

const APP_FILES = [
  "./",
  "./index.html",
  "./manifest.json",

  "./css/styles.css",

  "./js/categories.js",
  "./js/storage.js",
  "./js/history.js",
  "./js/copy-history.js",
  "./js/app.js"
];


// ============================================================
// INSTALL AND CACHE APPLICATION FILES
// ============================================================

self.addEventListener(
  "install",
  (event) => {
    event.waitUntil(
      caches
        .open(CACHE_NAME)
        .then(
          (cache) =>
            cache.addAll(APP_FILES)
        )
        .then(
          () =>
            self.skipWaiting()
        )
    );
  }
);


// ============================================================
// REMOVE OLD APPLICATION CACHE VERSIONS
// ============================================================

self.addEventListener(
  "activate",
  (event) => {
    event.waitUntil(
      caches
        .keys()
        .then(
          (cacheNames) =>
            Promise.all(
              cacheNames
                .filter(
                  (cacheName) =>
                    cacheName.startsWith(
                      `${CACHE_PREFIX}-`
                    ) &&
                    cacheName !== CACHE_NAME
                )
                .map(
                  (cacheName) =>
                    caches.delete(
                      cacheName
                    )
                )
            )
        )
        .then(
          () =>
            self.clients.claim()
        )
    );
  }
);


// ============================================================
// SERVE CACHED FILES WHEN OFFLINE
// ============================================================

self.addEventListener(
  "fetch",
  (event) => {
    const request =
      event.request;

    if (request.method !== "GET") {
      return;
    }

    const requestUrl =
      new URL(request.url);

    if (
      requestUrl.origin !==
      self.location.origin
    ) {
      return;
    }

    event.respondWith(
      caches
        .match(
          request,
          {
            ignoreSearch: true
          }
        )
        .then(
          (cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }

            return fetch(request)
              .catch(
                () => {
                  if (
                    request.mode ===
                    "navigate"
                  ) {
                    return caches.match(
                      "./index.html"
                    );
                  }

                  throw new Error(
                    "Resource unavailable while offline."
                  );
                }
              );
          }
        )
    );
  }
);