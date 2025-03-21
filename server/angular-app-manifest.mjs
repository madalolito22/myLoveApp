
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
    'index.csr.html': {size: 39502, hash: '34eb75a3423b4d2f85a75ca3e7046bd1f7fec9de2b8571aee4a39ee571e76840', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 33056, hash: 'd1d3beb34f77c431a2944d1a942722fa93868588601210ae7ecd1369b694998e', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'calendar/index.html': {size: 103951, hash: '9e21d98e1714793d1267fb2f6830b530cac50ec467e32b4091c86cb8f0cce443', text: () => import('./assets-chunks/calendar_index_html.mjs').then(m => m.default)},
    'index.html': {size: 52170, hash: 'b8d5f7a041eb7d6fd33d511b33d53e0068baf63155a0dee249b763fc706a9383', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-KSGJMKDI.css': {size: 11028, hash: 'xkNZEM2rl/E', text: () => import('./assets-chunks/styles-KSGJMKDI_css.mjs').then(m => m.default)}
  },
};
