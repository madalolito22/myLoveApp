
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
    'index.csr.html': {size: 39585, hash: 'df89ce3fb3841d8ea3129f7043e6bd106ba08b6cb84987de2572a191cd86ffbb', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 33139, hash: 'e00d63da61c648b7ca5bb5c3fb56e75950e4bd1a07862cfdfdc74cb1134ab924', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'myLoveApp/index.html': {size: 52253, hash: 'be3c558cdb5ac74f1935784a7ee39e451d8df1045daba8b4cf336a07b86a2099', text: () => import('./assets-chunks/myLoveApp_index_html.mjs').then(m => m.default)},
    'myLoveApp/calendar/index.html': {size: 104034, hash: 'f1bce2efed9691fcfb342e31af9d536a3527c4aa6a18cd8b97ed30d51c7128db', text: () => import('./assets-chunks/myLoveApp_calendar_index_html.mjs').then(m => m.default)},
    'styles-KSGJMKDI.css': {size: 11028, hash: 'xkNZEM2rl/E', text: () => import('./assets-chunks/styles-KSGJMKDI_css.mjs').then(m => m.default)}
  },
};
