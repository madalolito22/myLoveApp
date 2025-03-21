
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
    'index.csr.html': {size: 39576, hash: '12d88c35b221751c356027a824cd9db188a2d7db1bb9e20ecdb586f41e9a7db4', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 33130, hash: '67c1ad2a115a71af54165c361ce64482907a1672072aa5c56981efd64213a3e0', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'myLoveApp/index.html': {size: 52247, hash: 'ef8f8391d7b24807923ad851709281e230d6158a3d631698aaaba58b9f386651', text: () => import('./assets-chunks/myLoveApp_index_html.mjs').then(m => m.default)},
    'myLoveApp/calendar/index.html': {size: 104028, hash: '4b2d1e02534dd5043fffab64cf83dcc22935e68ffce1cb6952d2d46b532f47e8', text: () => import('./assets-chunks/myLoveApp_calendar_index_html.mjs').then(m => m.default)},
    'styles-KSGJMKDI.css': {size: 11028, hash: 'xkNZEM2rl/E', text: () => import('./assets-chunks/styles-KSGJMKDI_css.mjs').then(m => m.default)}
  },
};
