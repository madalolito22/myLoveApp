
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/"
  },
  {
    "renderMode": 2,
    "route": "/calendar"
  },
  {
    "renderMode": 2,
    "redirectTo": "/",
    "route": "/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 39493, hash: 'eeee59afde6dcc832c5ffa005ef66c341d19aaabc0c8a634859326b8ce9cd24b', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 33047, hash: 'e3cd5185636638359fd825f42acfb9470ae568a8b14cc47e8fde1bf25ecd45a4', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'calendar/index.html': {size: 103945, hash: '7de0a3e6ebbd28548c33c15f3e78570268a3ed93b048e7ca408ee5bbc9c76fd1', text: () => import('./assets-chunks/calendar_index_html.mjs').then(m => m.default)},
    'index.html': {size: 52164, hash: 'ba2394e176750a5a4af4928947e88b095c726a2bbad962166a207f9cda087d5e', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-KSGJMKDI.css': {size: 11028, hash: 'xkNZEM2rl/E', text: () => import('./assets-chunks/styles-KSGJMKDI_css.mjs').then(m => m.default)}
  },
};
