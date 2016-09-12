var coordtransform = require('coordtransform');

// from turf-meta https://github.com/Turfjs/turf/tree/master/packages/turf-meta

/**
 * Iterate over coordinates in any GeoJSON object, similar to
 * Array.forEach.
 *
 * @param {Object} layer any GeoJSON object
 * @param {Function} callback a method that takes (value)
 * @param {boolean=} excludeWrapCoord whether or not to include
 * the final coordinate of LinearRings that wraps the ring in its iteration.
 */
function coordEach(layer, callback, excludeWrapCoord) {
  var i, j, k, g, l, geometry, stopG, coords,
    geometryMaybeCollection,
    wrapShrink = 0,
    isGeometryCollection,
    isFeatureCollection = layer.type === 'FeatureCollection',
    isFeature = layer.type === 'Feature',
    stop = isFeatureCollection ? layer.features.length : 1;
  for (i = 0; i < stop; i++) {
    geometryMaybeCollection = (isFeatureCollection ? layer.features[i].geometry :
      (isFeature ? layer.geometry : layer));
    isGeometryCollection = geometryMaybeCollection.type === 'GeometryCollection';
    stopG = isGeometryCollection ? geometryMaybeCollection.geometries.length : 1;

    for (g = 0; g < stopG; g++) {
      geometry = isGeometryCollection ?
        geometryMaybeCollection.geometries[g] : geometryMaybeCollection;
      coords = geometry.coordinates;

      wrapShrink = (excludeWrapCoord &&
          (geometry.type === 'Polygon' || geometry.type === 'MultiPolygon')) ?
        1 : 0;
      if (geometry.type === 'Point') {
        callback(coords);
      } else if (geometry.type === 'LineString' || geometry.type === 'MultiPoint') {
        for (j = 0; j < coords.length; j++) callback(coords[j]);
      } else if (geometry.type === 'Polygon' || geometry.type === 'MultiLineString') {
        for (j = 0; j < coords.length; j++)
          for (k = 0; k < coords[j].length - wrapShrink; k++)
            callback(coords[j][k]);
      } else if (geometry.type === 'MultiPolygon') {
        for (j = 0; j < coords.length; j++)
          for (k = 0; k < coords[j].length; k++)
            for (l = 0; l < coords[j][k].length - wrapShrink; l++)
              callback(coords[j][k][l]);
      } else if (geometry.type === 'GeometryCollection') {
        for (j = 0; j < geometry.geometries.length; j++)
          coordEach(geometry.geometries[j], callback, excludeWrapCoord);
      } else {
        throw new Error('Unknown Geometry Type');
      }
    }
  }
}
/**
 * [transformGeoJSON description] 批量对geojson进行坐标转换
 * @param  {[type]} originGeoJSON [description] 原始的geojson对象
 * @param  {[type]} type          [description] 转换类型
 * @return {[type]}               [description] 返回转换后的geojson
 */
function transformGeoJSON(originGeoJSON, type) {
  var types = ['bd09togcj02', 'gcj02tobd09', 'wgs84togcj02', 'gcj02towgs84'];
  var originGeoJSON_clone = JSON.parse(JSON.stringify(originGeoJSON));
  if (types.indexOf(type) !== -1) {
    coordEach(originGeoJSON_clone, function(coord) {
      var after_coord = coordtransform[type](coord[0], coord[1]);
      coord[0] = +after_coord[0].toFixed(6);
      coord[1] = +after_coord[1].toFixed(6);
    });
    return originGeoJSON_clone;
  } else {
    throw Error("type shoule be one of ['bd09togcj02', 'gcj02tobd09', 'wgs84togcj02', 'gcj02towgs84']");
  }
}

module.exports = transformGeoJSON;
