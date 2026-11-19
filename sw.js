/* MFO-pro service worker. Change CACHE to the new version number with every release. */
const CACHE='mfo-pro-v2.0';
const FILES=['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/icon-maskable-512.png','./icons/apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith('mfo-pro-')&&x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const r=e.request,u=new URL(r.url);
 if(r.method!=='GET'||u.origin!==location.origin)return;
 if(r.mode==='navigate'||u.pathname.endsWith('/index.html')){
  e.respondWith(fetch(r).then(x=>{if(x.ok){const c=x.clone();caches.open(CACHE).then(h=>h.put('./index.html',c))}return x}).catch(()=>caches.match('./index.html')));
 }else{
  e.respondWith(caches.match(r).then(x=>x||fetch(r).then(y=>{if(y.ok){const c=y.clone();caches.open(CACHE).then(h=>h.put(r,c))}return y})));
 }
});
