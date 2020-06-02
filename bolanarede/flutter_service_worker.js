'use strict';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "1b94a180e131813adbccc23b2cc5d11c",
"assets/FontManifest.json": "580ff1a5d08679ded8fcf5c6848cece7",
"assets/fonts/MaterialIcons-Regular.ttf": "56d3ffdef7a25659eab6a68a3fbfaf16",
"assets/icon/gol.png": "99d76ab9eabf793ed298fdf9b3f90111",
"assets/icon/logo.png": "cb422fdfca89fb613f3cc49d165a10bd",
"assets/LICENSE": "9c3974dfbe9be3714e8a9bed90d34bda",
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
"index.html": "3267aabfec589475d2985c19d83f8787",
"/": "3267aabfec589475d2985c19d83f8787",
"main.dart.js": "5c5e853dd1a27238d8bf115870e0dc47",
"manifest.json": "66f410c2c6b5d28a595953be34f8ef8b"
};

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheName) {
      return caches.delete(cacheName);
    }).then(function (_) {
      return caches.open(CACHE_NAME);
    }).then(function (cache) {
      return cache.addAll(Object.keys(RESOURCES));
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
