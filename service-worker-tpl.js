self.addEventListener('fetch', event => {
  if (event.request.method != 'GET') return;

  event.respondWith(async function() {
    // Try to get the response from a cache.
    const cache = await caches.open('dynamic-v1');
    const cachedResponse = await cache.match(event.request);
    const useCacheWhenFailed = shouldUseCacheWhenFailed(event.request);

    if (cachedResponse && !useCacheWhenFailed) {
      // If we found a match in the cache, return it, but also
      // update the entry in the cache in the background.
      event.waitUntil(cache.add(event.request));
      return cachedResponse;
    }

    let response;
    try {
      response = await fetch(event.request);
    } catch (ex) {
      if (useCacheWhenFailed && cachedResponse) {
        return cachedResponse;
      }
      throw ex;
    }
    if (shouldCache(event.request)) {
      await cache.put(event.request, response.clone());
    }
    return response;
  }());
});

self.addEventListener('install', event => {
  // add caches
  return event.waitUntil(caches.open('dynamic-v1')
    .then((cache) => {
      return cache.addAll([
        '/'
      ]);
    }));
});

const SERVER_ADDRESS = '{{serverAddress}}';

const whitelist = [
  '/assets/',
  '/fonts/'
];
const useCacheWhenFailedList = [
  // first page of data
  new RegExp(`${SERVER_ADDRESS}/recent$`),
  // new RegExp(`${SERVER_ADDRESS}/topic?t=[0-9]*$`)
];
function shouldCache(request) {
  const origin = location.origin;
  for (let value of whitelist) {
    if (request.url.indexOf(origin + value) === 0) return true;
  }
  for (let reg of useCacheWhenFailedList) {
    if (reg.test(request.url)) return true;
  }
  return false;
}
function shouldUseCacheWhenFailed(request) {
  for (let reg of useCacheWhenFailedList) {
    if (reg.test(request.url)) return true;
  }
  return false;
}
