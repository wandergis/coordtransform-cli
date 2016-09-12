var transformGeoJSON = require('../index.js');
var anygeojson = { type: 'Point', coordinates: [118, 34] };
var result = transformGeoJSON(anygeojson, 'wgs84togcj02');
console.log(anygeojson);
console.log(result);
