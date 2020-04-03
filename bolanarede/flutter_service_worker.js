'use strict';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "/assets\AssetManifest.json": "99914b932bd37a50b983c5e7c90ae93b",
"/assets\FontManifest.json": "580ff1a5d08679ded8fcf5c6848cece7",
"/assets\fonts\MaterialIcons-Regular.ttf": "56d3ffdef7a25659eab6a68a3fbfaf16",
"/assets\LICENSE": "863f86a2f5cf451d6fade527b497bad5",
"/favicon.png": "5dcef449791fa27946b3d35ad8803796",
"/icons\Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"/icons\Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"/index.html": "c75b23920032e0a85e3d90d0312ef0f2",
"/main.dart.js": "e4927cd449dff77176f8b3c61d803681",
"/manifest.json": "2740554587450e9491c3a6f13d83b097"
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
        return fetch(event.request, {
          credentials: 'include'
        });
      })
  );
});
