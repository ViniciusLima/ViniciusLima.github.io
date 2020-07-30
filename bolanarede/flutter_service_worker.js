'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "1b94a180e131813adbccc23b2cc5d11c",
"assets/FontManifest.json": "580ff1a5d08679ded8fcf5c6848cece7",
"assets/fonts/MaterialIcons-Regular.ttf": "56d3ffdef7a25659eab6a68a3fbfaf16",
"assets/icon/gol.png": "99d76ab9eabf793ed298fdf9b3f90111",
"assets/icon/logo.png": "cb422fdfca89fb613f3cc49d165a10bd",
"assets/NOTICES": "b74913dc49ce8252e2220dae9d9c4516",
"favicon.png": "88a1e9d1176dfd96e85c7ed77bff3cb2",
"icons/android-icon-144x144.png": "a886503822c0c6e524ab9b3e9f6e7245",
"icons/android-icon-192x192.png": "06e7469a5d8edc4f567946f6888f3015",
"icons/android-icon-36x36.png": "d0bab5363b8d19c9f04df8b49d5f8d37",
"icons/android-icon-48x48.png": "b9c52a91fcc403e52b3b46acf58abc05",
"icons/android-icon-72x72.png": "f6a3725ff8301bdbf982b45a6f88dae9",
"icons/android-icon-96x96.png": "0bf1c4d8100ec68e1e25c0f06c8dad9b",
"icons/apple-icon-114x114.png": "66dcca771f5ca5863d5bb2b3a7f749ff",
"icons/apple-icon-120x120.png": "031f20818ba42a044eb2a7d9426c4415",
"icons/apple-icon-144x144.png": "a886503822c0c6e524ab9b3e9f6e7245",
"icons/apple-icon-152x152.png": "02384c0b67738dbd3bdaae3639004c8f",
"icons/apple-icon-180x180.png": "0da0aa600a23897fc3a9e45743b22e1e",
"icons/apple-icon-57x57.png": "e1f9a7fb04ceb2bdae6905347340b219",
"icons/apple-icon-60x60.png": "e4bb17f1119827603201c7fee6d238cf",
"icons/apple-icon-72x72.png": "f6a3725ff8301bdbf982b45a6f88dae9",
"icons/apple-icon-76x76.png": "1f7769724ce0d52c3a7d89ffadd5c0e4",
"icons/apple-icon-precomposed.png": "a1d08b70ea7a252c50fcaed30fdb64ec",
"icons/apple-icon.png": "a1d08b70ea7a252c50fcaed30fdb64ec",
"icons/favicon-16x16.png": "88a1e9d1176dfd96e85c7ed77bff3cb2",
"icons/favicon-32x32.png": "3c3e317a2b212faa928a0a0a7571a10e",
"icons/favicon-96x96.png": "0bf1c4d8100ec68e1e25c0f06c8dad9b",
"icons/favicon.ico": "f3a968c87ad6889de397b9602674127d",
"icons/ms-icon-144x144.png": "a886503822c0c6e524ab9b3e9f6e7245",
"icons/ms-icon-150x150.png": "f04b88f9d0d3b8d88f9ab77567a27b07",
"icons/ms-icon-310x310.png": "f3ba50c98773f882cfceb5e86299084f",
"icons/ms-icon-70x70.png": "2e09ae99274ce40639c11ed65efba149",
"index.html": "79ccfeb63ff0d627760abbe96d8b14c6",
"/": "79ccfeb63ff0d627760abbe96d8b14c6",
"main.dart.js": "4f786debb3bc92d6b990ee629bc93aa2",
"manifest.json": "66f410c2c6b5d28a595953be34f8ef8b"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      // Provide a no-cache param to ensure the latest version is downloaded.
      return cache.addAll(CORE.map((value) => new Request(value, {'cache': 'no-cache'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');

      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }

      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#')) {
    key = '/';
  }
  // If the URL is not the RESOURCE list, skip the cache.
  if (!RESOURCES[key]) {
    return event.respondWith(fetch(event.request));
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache. Ensure the resources are not cached
        // by the browser for longer than the service worker expects.
        var modifiedRequest = new Request(event.request, {'cache': 'no-cache'});
        return response || fetch(modifiedRequest).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    return self.skipWaiting();
  }

  if (event.message === 'downloadOffline') {
    downloadOffline();
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey in Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
