import pages from './Routers/pages.js';

console.log('pages router type:', typeof pages);
if (pages && pages.stack && Array.isArray(pages.stack)) {
  console.log('pages.stack.length =', pages.stack.length);
  pages.stack.forEach((layer, i) => {
    const routePath = layer.route ? layer.route.path : (layer.regexp && layer.regexp.source) || '<no-path>';
    console.log(i, 'layer.name=', layer.name, 'routePath=', routePath);
    if (layer.route && layer.route.stack) {
      console.log('  methods:', Object.keys(layer.route.methods));
    }
  });
} else {
  console.log('Router stack not available.');
}
