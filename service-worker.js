// ============================================================
// OFFLINE APPLICATION CACHE
// ============================================================

const CACHE_PREFIX =
  "expense-tracker";

const CACHE_VERSION =
  "v1";

const CACHE_NAME =
  `${CACHE_PREFIX}-${CACHE_VERSION}`;

const APP_FILES = [
  "./",
  "./index.html",
  "./manifest.json",

  "./css/palettes.css",
  "./css/base.css",
  "./css/components.css",
  "./css/visual-styles.css",

  "./js/categories.js",
  "./js/storage.js",
  "./js/i18n.js",
  "./js/settings.js",
  "./js/history.js",
  "./js/copy-history.js",
  "./js/app.js"
];

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
          () => self.skipWaiting()
        )
    );
  }
);

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
          () => self.clients.claim()
        )
    );
  }
);

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
          (cachedResponse) =>
            cachedResponse ||
            fetch(request)
              .catch(() => {
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
              })
        )
    );
  }
);
