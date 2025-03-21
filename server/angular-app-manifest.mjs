
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/myLoveApp"
  },
  {
    "renderMode": 2,
    "route": "/myLoveApp/calendar"
  },
  {
    "renderMode": 2,
    "redirectTo": "/myLoveApp",
    "route": "/myLoveApp/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 39503, hash: 'a508e8594448186f4fd5e88d32797c3a2eb64e2672f69aab85aed6cf59a212e0', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 33057, hash: '4559254d3215d4d96167a63f5291fd93277ef62315776b2b25cb8bf3068e3c03', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'myLoveApp/index.html': {size: 52174, hash: 'f90ff78c25bcc1faa9dbec0007919e977cae80d16afafe22119fc705578c4b43', text: () => import('./assets-chunks/myLoveApp_index_html.mjs').then(m => m.default)},
    'myLoveApp/calendar/index.html': {size: 103955, hash: '62dd8161ad196f9c3c1b7b470747be32201620ef4dcc2c5f6240f42c8dc0d270', text: () => import('./assets-chunks/myLoveApp_calendar_index_html.mjs').then(m => m.default)},
    'styles-KSGJMKDI.css': {size: 11028, hash: 'xkNZEM2rl/E', text: () => import('./assets-chunks/styles-KSGJMKDI_css.mjs').then(m => m.default)}
  },
};
