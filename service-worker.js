const CACHE_NAME='zeka-meydani-v13-final';
self.addEventListener('install',event=>{event.waitUntil(self.skipWaiting())});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET') return;
  const url=new URL(req.url);
  if(url.origin!==self.location.origin) return;
  // Network-first: the live HTML is always preferred, preventing stale game versions.
  if(req.mode==='navigate' || url.pathname.endsWith('/index.html') || url.pathname.endsWith('/')){
    event.respondWith(fetch(req,{cache:'no-store'}).then(res=>{const copy=res.clone(); caches.open(CACHE_NAME).then(c=>c.put(req,copy)); return res}).catch(()=>caches.match(req)));
    return;
  }
  event.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(res=>{const copy=res.clone(); caches.open(CACHE_NAME).then(c=>c.put(req,copy)); return res})));
});
