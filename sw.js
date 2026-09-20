const VERSION="0.0.16";
const CACHE="megalife-"+VERSION;
const CORE=["./","./index.html","./styles.css","./app.js","./manifest.json","./icon.svg"];
self.addEventListener("install",event=>{event.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith("megalife-")&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET") return;
  event.respondWith(fetch(event.request,{cache:"no-store"}).then(response=>{
    if(response.ok){const copy=response.clone();caches.open(CACHE).then(c=>c.put(event.request,copy));}
    return response;
  }).catch(()=>caches.match(event.request).then(r=>r||caches.match("./index.html"))));
});
