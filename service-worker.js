/**
 * A tombstone for the service worker the 2020 Create React App build left behind.
 *
 * This app has no service worker and wants none. The problem is that the old one
 * is still registered in the browser of anyone who visited the React version:
 * deleting the file from the server does not unregister it, and a failed update
 * fetch leaves the existing worker in place, so those visitors would go on being
 * served a six-year-old app out of its cache no matter what is deployed here.
 *
 * A worker at the same URL is the one thing the browser will still fetch, so
 * this one takes the registration down with it and empties every cache on its
 * way out. It has to keep the old file's name and location to be found at all.
 *
 * Safe to delete once returning visitors have plausibly all been through — it is
 * only reachable by someone whose browser already knows this path.
 */

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(names.map(name => caches.delete(name)));
      await self.registration.unregister();

      // Reload whatever is open, which now has no worker in front of it.
      const clients = await self.clients.matchAll({ type: 'window' });
      for (const client of clients) client.navigate(client.url);
    })(),
  );
});
