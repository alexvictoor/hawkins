/* Service worker de Hawkins Révisions — engendré par scripts/paquet-unique.ts. */
const CACHE = 'hawkins-eeec8697ae30'
const RESSOURCES = [
  "./index.html",
  "./manifest.webmanifest",
  "./icones/demogorgon.svg",
  "./icones/favicon-16.png",
  "./icones/favicon-32.png",
  "./icones/icone-128.png",
  "./icones/icone-144.png",
  "./icones/icone-152.png",
  "./icones/icone-167.png",
  "./icones/icone-180.png",
  "./icones/icone-192.png",
  "./icones/icone-256.png",
  "./icones/icone-384.png",
  "./icones/icone-48.png",
  "./icones/icone-512.png",
  "./icones/icone-72.png",
  "./icones/icone-96.png",
  "./icones/masquable-192.png",
  "./icones/masquable-512.png"
]

// Tout est mis en cache à l'installation : l'application doit fonctionner dès
// la première coupure, sans avoir eu à être parcourue au préalable.
self.addEventListener('install', (evenement) => {
  evenement.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(RESSOURCES)).then(() => self.skipWaiting()))
})

self.addEventListener('activate', (evenement) => {
  evenement.waitUntil(
    caches
      .keys()
      .then((noms) => Promise.all(noms.filter((n) => n !== CACHE).map((n) => caches.delete(n))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (evenement) => {
  const requete = evenement.request
  if (requete.method !== 'GET') return

  // Une navigation hors ligne doit retomber sur le document, pas sur l'erreur
  // du navigateur : c'est ce qui distingue une application installée d'un
  // simple signet.
  if (requete.mode === 'navigate') {
    evenement.respondWith(
      fetch(requete).catch(() => caches.match('./index.html', { ignoreSearch: true })),
    )
    return
  }

  evenement.respondWith(
    caches.match(requete, { ignoreSearch: true }).then((enCache) => enCache ?? fetch(requete)),
  )
})
