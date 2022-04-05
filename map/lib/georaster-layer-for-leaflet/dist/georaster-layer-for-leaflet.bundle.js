"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("regenerator-runtime/runtime");

var L = _interopRequireWildcard(require("leaflet"));

var _chromaJs = _interopRequireDefault(require("chroma-js"));

var _isUTM = _interopRequireDefault(require("utm-utils/src/isUTM"));

var _getProjString = _interopRequireDefault(require("utm-utils/src/getProjString"));

var _proj4FullyLoaded = _interopRequireDefault(require("proj4-fully-loaded"));

var _geoExtent = require("geo-extent");

var _snapBbox = _interopRequireDefault(require("snap-bbox"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

var EPSG4326 = 4326;
var PROJ4_SUPPORTED_PROJECTIONS = new Set([3785, 3857, 4269, 4326, 900913, 102113]);
var MAX_NORTHING = 1000;
var MAX_EASTING = 1000;
var ORIGIN = [0, 0];

var log = function log(obj) {
  return console.log("[georaster-layer-for-leaflet] ", obj);
}; // figure out if simple CRS
// even if not created with same instance of LeafletJS


var isSimpleCRS = function isSimpleCRS(crs) {
  var _crs$transformation, _crs$transformation2, _crs$transformation3, _crs$transformation4;

  return crs === L.CRS.Simple || !crs.code && crs.infinite && (crs === null || crs === void 0 ? void 0 : (_crs$transformation = crs.transformation) === null || _crs$transformation === void 0 ? void 0 : _crs$transformation._a) === 1 && (crs === null || crs === void 0 ? void 0 : (_crs$transformation2 = crs.transformation) === null || _crs$transformation2 === void 0 ? void 0 : _crs$transformation2._b) === 0 && (crs === null || crs === void 0 ? void 0 : (_crs$transformation3 = crs.transformation) === null || _crs$transformation3 === void 0 ? void 0 : _crs$transformation3._c) === -1 && (crs === null || crs === void 0 ? void 0 : (_crs$transformation4 = crs.transformation) === null || _crs$transformation4 === void 0 ? void 0 : _crs$transformation4._d) === 0;
};

var GeoRasterLayer = L.GridLayer.extend({
  options: {
    updateWhenIdle: true,
    updateWhenZooming: false,
    keepBuffer: 25,
    resolution: Math.pow(2, 5),
    debugLevel: 0
  },
  initialize: function initialize(options) {
    var _this = this;

    try {
      if (options.georasters) {
        this.georasters = options.georasters;
      } else if (options.georaster) {
        this.georasters = [options.georaster];
      } else {
        throw new Error("You initialized a GeoRasterLayer without a georaster or georasters value.");
      }

      if (this.sourceType === "url") {
        options.updateWhenIdle = false;
        options.updateWhenZooming = true;
        options.keepBuffer = 16;
      }

      if (options.resampleMethod) {
        this.resampleMethod = options.resampleMethod;
      }
      /*
          Unpacking values for use later.
          We do this in order to increase speed.
      */


      var keys = ["height", "width", "noDataValue", "palette", "pixelHeight", "pixelWidth", "projection", "sourceType", "xmin", "xmax", "ymin", "ymax"];

      if (this.georasters.length > 1) {
        keys.forEach(function (key) {
          if (_this.same(_this.georasters, key)) {
            _this[key] = _this.georasters[0][key];
          } else {
            throw new Error("all GeoRasters must have the same " + key);
          }
        });
      } else if (this.georasters.length === 1) {
        keys.forEach(function (key) {
          _this[key] = _this.georasters[0][key];
        });
      }

      this._cache = {
        innerTile: {},
        tile: {}
      };
      this.extent = new _geoExtent.GeoExtent([this.xmin, this.ymin, this.xmax, this.ymax], {
        srs: this.projection
      }); // used later if simple projection

      this.ratio = this.height / this.width;
      this.debugLevel = options.debugLevel;
      if (this.debugLevel >= 1) log({
        options: options
      });

      if (this.georasters.every(function (georaster) {
        return _typeof(georaster.values) === "object";
      })) {
        this.rasters = this.georasters.reduce(function (result, georaster) {
          // added double-check of values to make typescript linter and compiler happy
          if (georaster.values) {
            result = result.concat(georaster.values);
            return result;
          }
        }, []);
        if (this.debugLevel > 1) console.log("this.rasters:", this.rasters);
      }

      this.chroma = _chromaJs.default;
      this.scale = _chromaJs.default.scale(); // could probably replace some day with a simple
      // (for let k in options) { this.options[k] = options[k]; }
      // but need to find a way around TypeScript any issues

      L.Util.setOptions(this, options);
      /*
          Caching the constant tile size, so we don't recalculate everytime we
          create a new tile
      */

      var tileSize = this.getTileSize();
      this.tileHeight = tileSize.y;
      this.tileWidth = tileSize.x;

      if (this.georasters.length > 1 && !options.pixelValuesToColorFn) {
        throw "you must pass in a pixelValuesToColorFn if you are combining rasters";
      } // total number of bands across all georasters


      this.numBands = this.georasters.reduce(function (total, g) {
        return total + g.numberOfRasters;
      }, 0);
      if (this.debugLevel > 1) console.log("this.numBands:", this.numBands); // in-case we want to track dynamic/running stats of all pixels fetched

      this.currentStats = {
        mins: new Array(this.numBands),
        maxs: new Array(this.numBands),
        ranges: new Array(this.numBands)
      };

      if (this.georasters.length === 1 && this.georasters[0].sourceType === "url" && this.georasters[0].numberOfRasters === 1 && !options.pixelValuesToColorFn) {
        this.calcStats = true;
      } // if you haven't specified a pixelValuesToColorFn
      // and the image is YCbCr, add a function to convert YCbCr


      this.checkIfYCbCr = new Promise( /*#__PURE__*/function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(resolve) {
          var _this$georasters$0$_g, _image$fileDirectory, image;

          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (!_this.options.pixelValuesToColorFn) {
                    _context.next = 2;
                    break;
                  }

                  return _context.abrupt("return", resolve(true));

                case 2:
                  if (!(_this.georasters.length === 1 && _this.georasters[0].numberOfRasters === 3)) {
                    _context.next = 7;
                    break;
                  }

                  _context.next = 5;
                  return (_this$georasters$0$_g = _this.georasters[0]._geotiff) === null || _this$georasters$0$_g === void 0 ? void 0 : _this$georasters$0$_g.getImage();

                case 5:
                  image = _context.sent;

                  if ((image === null || image === void 0 ? void 0 : (_image$fileDirectory = image.fileDirectory) === null || _image$fileDirectory === void 0 ? void 0 : _image$fileDirectory.PhotometricInterpretation) === 6) {
                    _this.options.pixelValuesToColorFn = function (values) {
                      var r = Math.round(values[0] + 1.402 * (values[2] - 0x80));
                      var g = Math.round(values[0] - 0.34414 * (values[1] - 0x80) - 0.71414 * (values[2] - 0x80));
                      var b = Math.round(values[0] + 1.772 * (values[1] - 0x80));
                      return "rgb(".concat(r, ",").concat(g, ",").concat(b, ")");
                    };
                  }

                case 7:
                  return _context.abrupt("return", resolve(true));

                case 8:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }());
    } catch (error) {
      console.error("ERROR initializing GeoTIFFLayer", error);
    }
  },
  getRasters: function getRasters(options) {
    var _this2 = this;

    var innerTileTopLeftPoint = options.innerTileTopLeftPoint,
        heightOfSampleInScreenPixels = options.heightOfSampleInScreenPixels,
        widthOfSampleInScreenPixels = options.widthOfSampleInScreenPixels,
        zoom = options.zoom,
        numberOfSamplesAcross = options.numberOfSamplesAcross,
        numberOfSamplesDown = options.numberOfSamplesDown,
        ymax = options.ymax,
        xmin = options.xmin;
    if (this.debugLevel >= 1) console.log("starting getRasters with options:", options); // called if georaster was constructed from URL and we need to get
    // data separately for each tile
    // aka 'COG mode'

    /*
      This function takes in coordinates in the rendered image inner tile and
      returns the y and x values in the original raster
    */

    var rasterCoordsForTileCoords = function rasterCoordsForTileCoords(h, w) {
      var xInMapPixels = innerTileTopLeftPoint.x + w * widthOfSampleInScreenPixels;
      var yInMapPixels = innerTileTopLeftPoint.y + h * heightOfSampleInScreenPixels;
      var mapPoint = L.point(xInMapPixels, yInMapPixels);
      if (_this2.debugLevel >= 1) log({
        mapPoint: mapPoint
      });

      var _this2$getMap$unproje = _this2.getMap().unproject(mapPoint, zoom),
          lat = _this2$getMap$unproje.lat,
          lng = _this2$getMap$unproje.lng;

      if (_this2.projection === EPSG4326) {
        return {
          y: Math.round((ymax - lat) / _this2.pixelHeight),
          x: Math.round((lng - xmin) / _this2.pixelWidth)
        };
      } else if (_this2.getProjector()) {
        /* source raster doesn't use latitude and longitude,
           so need to reproject point from lat/long to projection of raster
        */
        var _this2$getProjector$i = _this2.getProjector().inverse([lng, lat]),
            _this2$getProjector$i2 = _slicedToArray(_this2$getProjector$i, 2),
            x = _this2$getProjector$i2[0],
            y = _this2$getProjector$i2[1];

        if (x === Infinity || y === Infinity) {
          if (_this2.debugLevel >= 1) console.error("projector converted", [lng, lat], "to", [x, y]);
        }

        return {
          y: Math.round((ymax - y) / _this2.pixelHeight),
          x: Math.round((x - xmin) / _this2.pixelWidth)
        };
      } else {
        return null;
      }
    }; // careful not to flip min_y/max_y here


    var topLeft = rasterCoordsForTileCoords(0, 0);
    var bottomRight = rasterCoordsForTileCoords(numberOfSamplesDown, numberOfSamplesAcross);
    var getValuesOptions = {
      bottom: bottomRight === null || bottomRight === void 0 ? void 0 : bottomRight.y,
      height: numberOfSamplesDown,
      left: topLeft === null || topLeft === void 0 ? void 0 : topLeft.x,
      right: bottomRight === null || bottomRight === void 0 ? void 0 : bottomRight.x,
      top: topLeft === null || topLeft === void 0 ? void 0 : topLeft.y,
      width: numberOfSamplesAcross
    };

    if (!Object.values(getValuesOptions).every(isFinite)) {
      console.error("getRasters failed because not all values are finite:", getValuesOptions);
    } else {
      // !note: The types need confirmation - SFR 2021-01-20
      return Promise.all(this.georasters.map(function (georaster) {
        return georaster.getValues(_objectSpread(_objectSpread({}, getValuesOptions), {}, {
          resampleMethod: _this2.resampleMethod || "bilinear"
        }));
      })).then(function (valuesByGeoRaster) {
        return valuesByGeoRaster.reduce(function (result, values) {
          result = result.concat(values);
          return result;
        }, []);
      });
    }
  },
  createTile: function createTile(coords, done) {
    /* This tile is the square piece of the Leaflet map that we draw on */
    var tile = L.DomUtil.create("canvas", "leaflet-tile"); // we do this because sometimes css normalizers will set * to box-sizing: border-box

    tile.style.boxSizing = "content-box";
    var context = tile.getContext("2d"); // note that we aren't setting the tile height or width here
    // drawTile dynamically sets the width and padding based on
    // how much the georaster takes up the tile area

    return this.drawTile({
      tile: tile,
      coords: coords,
      context: context,
      done: done
    });
  },
  drawTile: function drawTile(_ref2) {
    var _this3 = this;

    var tile = _ref2.tile,
        coords = _ref2.coords,
        context = _ref2.context,
        done = _ref2.done;

    try {
      var _this$debugLevel = this.debugLevel,
          debugLevel = _this$debugLevel === void 0 ? 0 : _this$debugLevel;
      if (debugLevel >= 2) console.log("starting drawTile with", {
        tile: tile,
        coords: coords,
        context: context,
        done: done
      });
      var error;
      var zoom = coords.z; // stringified hash of tile coordinates for caching purposes

      var cacheKey = [coords.x, coords.y, coords.z].join(",");
      if (debugLevel >= 2) log({
        cacheKey: cacheKey
      });
      var mapCRS = this.getMapCRS();
      if (debugLevel >= 2) log({
        mapCRS: mapCRS
      });
      var inSimpleCRS = isSimpleCRS(mapCRS);
      if (debugLevel >= 2) log({
        inSimpleCRS: inSimpleCRS
      }); // Unpacking values for increased speed

      var rasters = this.rasters,
          xmin = this.xmin,
          xmax = this.xmax,
          ymin = this.ymin,
          ymax = this.ymax;
      var rasterHeight = this.height;
      var rasterWidth = this.width;
      var extentOfLayer = new _geoExtent.GeoExtent(this.getBounds(), {
        srs: inSimpleCRS ? "simple" : 4326
      });
      if (debugLevel >= 2) log({
        extentOfLayer: extentOfLayer
      });
      var pixelHeight = inSimpleCRS ? extentOfLayer.height / rasterHeight : this.pixelHeight;
      var pixelWidth = inSimpleCRS ? extentOfLayer.width / rasterWidth : this.pixelWidth;
      if (debugLevel >= 2) log({
        pixelHeight: pixelHeight,
        pixelWidth: pixelWidth
      }); // these values are used, so we don't try to sample outside of the raster

      var xMinOfLayer = this.xMinOfLayer,
          xMaxOfLayer = this.xMaxOfLayer,
          yMinOfLayer = this.yMinOfLayer,
          yMaxOfLayer = this.yMaxOfLayer;

      var boundsOfTile = this._tileCoordsToBounds(coords);

      if (debugLevel >= 2) log({
        boundsOfTile: boundsOfTile
      });
      var code = mapCRS.code;
      if (debugLevel >= 2) log({
        code: code
      });
      var extentOfTile = new _geoExtent.GeoExtent(boundsOfTile, {
        srs: inSimpleCRS ? "simple" : 4326
      });
      if (debugLevel >= 2) log({
        extentOfTile: extentOfTile
      }); // create blue outline around tiles

      if (debugLevel >= 4) {
        if (!this._cache.tile[cacheKey]) {
          this._cache.tile[cacheKey] = L.rectangle(extentOfTile.leafletBounds, {
            fillOpacity: 0
          }).addTo(this.getMap()).bindTooltip(cacheKey, {
            direction: "center",
            permanent: true
          });
        }
      }

      var extentOfTileInMapCRS = inSimpleCRS ? extentOfTile : extentOfTile.reproj(code);
      if (debugLevel >= 2) log({
        extentOfTileInMapCRS: extentOfTileInMapCRS
      });
      var extentOfInnerTileInMapCRS = extentOfTileInMapCRS.crop(inSimpleCRS ? extentOfLayer : this.extent);
      if (debugLevel >= 2) console.log("[georaster-layer-for-leaflet] extentOfInnerTileInMapCRS", extentOfInnerTileInMapCRS.reproj(inSimpleCRS ? "simple" : 4326));
      if (debugLevel >= 2) log({
        coords: coords,
        extentOfInnerTileInMapCRS: extentOfInnerTileInMapCRS,
        extent: this.extent
      }); // create blue outline around tiles

      if (debugLevel >= 4) {
        if (!this._cache.innerTile[cacheKey]) {
          var ext = inSimpleCRS ? extentOfInnerTileInMapCRS : extentOfInnerTileInMapCRS.reproj(4326);
          this._cache.innerTile[cacheKey] = L.rectangle(ext.leafletBounds, {
            color: "#F00",
            dashArray: "5, 10",
            fillOpacity: 0
          }).addTo(this.getMap());
        }
      }

      var widthOfScreenPixelInMapCRS = extentOfTileInMapCRS.width / this.tileWidth;
      var heightOfScreenPixelInMapCRS = extentOfTileInMapCRS.height / this.tileHeight;
      if (debugLevel >= 3) log({
        heightOfScreenPixelInMapCRS: heightOfScreenPixelInMapCRS,
        widthOfScreenPixelInMapCRS: widthOfScreenPixelInMapCRS
      }); // expand tile sampling area to align with raster pixels

      var oldExtentOfInnerTileInRasterCRS = inSimpleCRS ? extentOfInnerTileInMapCRS : extentOfInnerTileInMapCRS.reproj(this.projection);
      var snapped = (0, _snapBbox.default)({
        bbox: oldExtentOfInnerTileInRasterCRS.bbox,
        // pad xmax and ymin of container to tolerate ceil() and floor() in snap()
        container: inSimpleCRS ? [extentOfLayer.xmin, extentOfLayer.ymin - 0.25 * pixelHeight, extentOfLayer.xmax + 0.25 * pixelWidth, extentOfLayer.ymax] : [xmin, ymin - 0.25 * pixelHeight, xmax + 0.25 * pixelWidth, ymax],
        debug: debugLevel >= 2,
        origin: inSimpleCRS ? [extentOfLayer.xmin, extentOfLayer.ymax] : [xmin, ymax],
        scale: [pixelWidth, -pixelHeight] // negative because origin is at ymax

      });
      var extentOfInnerTileInRasterCRS = new _geoExtent.GeoExtent(snapped.bbox_in_coordinate_system, {
        srs: inSimpleCRS ? "simple" : this.projection
      });
      var gridbox = snapped.bbox_in_grid_cells;
      var snappedSamplesAcross = Math.abs(gridbox[2] - gridbox[0]);
      var snappedSamplesDown = Math.abs(gridbox[3] - gridbox[1]);
      var rasterPixelsAcross = Math.ceil(oldExtentOfInnerTileInRasterCRS.width / pixelWidth);
      var rasterPixelsDown = Math.ceil(oldExtentOfInnerTileInRasterCRS.height / pixelHeight);
      var resolution = this.options.resolution;
      var layerCropExtent = inSimpleCRS ? extentOfLayer : this.extent;
      var recropTileOrig = oldExtentOfInnerTileInRasterCRS.crop(layerCropExtent); // may be null

      var maxSamplesAcross = 1;
      var maxSamplesDown = 1;

      if (recropTileOrig !== null) {
        var recropTileProj = inSimpleCRS ? recropTileOrig : recropTileOrig.reproj(code);
        var recropTile = recropTileProj.crop(extentOfTileInMapCRS);

        if (recropTile !== null) {
          maxSamplesAcross = Math.ceil(resolution * (recropTile.width / extentOfTileInMapCRS.width));
          maxSamplesDown = Math.ceil(resolution * (recropTile.height / extentOfTileInMapCRS.height));
        }
      }

      var overdrawTileAcross = rasterPixelsAcross < maxSamplesAcross;
      var overdrawTileDown = rasterPixelsDown < maxSamplesDown;
      var numberOfSamplesAcross = overdrawTileAcross ? snappedSamplesAcross : maxSamplesAcross;
      var numberOfSamplesDown = overdrawTileDown ? snappedSamplesDown : maxSamplesDown;
      if (debugLevel >= 3) console.log("[georaster-layer-for-leaflet] extent of inner tile before snapping " + extentOfInnerTileInMapCRS.reproj(inSimpleCRS ? "simple" : 4326).bbox.toString()); // Reprojecting the bounding box back to the map CRS would expand it
      // (unless the projection is purely scaling and translation),
      // so instead just extend the old map bounding box proportionately.

      {
        var oldrb = new _geoExtent.GeoExtent(oldExtentOfInnerTileInRasterCRS.bbox);
        var newrb = new _geoExtent.GeoExtent(extentOfInnerTileInRasterCRS.bbox);
        var oldmb = new _geoExtent.GeoExtent(extentOfInnerTileInMapCRS.bbox);

        if (oldrb.width !== 0 && oldrb.height !== 0) {
          var n0 = (newrb.xmin - oldrb.xmin) / oldrb.width * oldmb.width;
          var n1 = (newrb.ymin - oldrb.ymin) / oldrb.height * oldmb.height;
          var n2 = (newrb.xmax - oldrb.xmax) / oldrb.width * oldmb.width;
          var n3 = (newrb.ymax - oldrb.ymax) / oldrb.height * oldmb.height;

          if (!overdrawTileAcross) {
            n0 = Math.max(n0, 0);
            n2 = Math.min(n2, 0);
          }

          if (!overdrawTileDown) {
            n1 = Math.max(n1, 0);
            n3 = Math.min(n3, 0);
          }

          var newbox = [oldmb.xmin + n0, oldmb.ymin + n1, oldmb.xmax + n2, oldmb.ymax + n3];
          extentOfInnerTileInMapCRS = new _geoExtent.GeoExtent(newbox, {
            srs: extentOfInnerTileInMapCRS.srs
          });
        }
      } // create outline around raster pixels

      if (debugLevel >= 4) {
        if (!this._cache.innerTile[cacheKey]) {
          var _ext = inSimpleCRS ? extentOfInnerTileInMapCRS : extentOfInnerTileInMapCRS.reproj(4326);

          this._cache.innerTile[cacheKey] = L.rectangle(_ext.leafletBounds, {
            color: "#F00",
            dashArray: "5, 10",
            fillOpacity: 0
          }).addTo(this.getMap());
        }
      }

      if (debugLevel >= 3) console.log("[georaster-layer-for-leaflet] extent of inner tile after snapping " + extentOfInnerTileInMapCRS.reproj(inSimpleCRS ? "simple" : 4326).bbox.toString()); // Note that the snapped "inner" tile may extend beyond the original tile,
      // in which case the padding values will be negative.
      // we round here because sometimes there will be slight floating arithmetic issues
      // where the padding is like 0.00000000000001

      var padding = {
        left: Math.round((extentOfInnerTileInMapCRS.xmin - extentOfTileInMapCRS.xmin) / widthOfScreenPixelInMapCRS),
        right: Math.round((extentOfTileInMapCRS.xmax - extentOfInnerTileInMapCRS.xmax) / widthOfScreenPixelInMapCRS),
        top: Math.round((extentOfTileInMapCRS.ymax - extentOfInnerTileInMapCRS.ymax) / heightOfScreenPixelInMapCRS),
        bottom: Math.round((extentOfInnerTileInMapCRS.ymin - extentOfTileInMapCRS.ymin) / heightOfScreenPixelInMapCRS)
      };
      if (debugLevel >= 3) log({
        padding: padding
      });
      var innerTileHeight = this.tileHeight - padding.top - padding.bottom;
      var innerTileWidth = this.tileWidth - padding.left - padding.right;
      if (debugLevel >= 3) log({
        innerTileHeight: innerTileHeight,
        innerTileWidth: innerTileWidth
      });

      if (debugLevel >= 4) {
        var xMinOfInnerTileInMapCRS = extentOfTileInMapCRS.xmin + padding.left * widthOfScreenPixelInMapCRS;
        var yMinOfInnerTileInMapCRS = extentOfTileInMapCRS.ymin + padding.bottom * heightOfScreenPixelInMapCRS;
        var xMaxOfInnerTileInMapCRS = extentOfTileInMapCRS.xmax - padding.right * widthOfScreenPixelInMapCRS;
        var yMaxOfInnerTileInMapCRS = extentOfTileInMapCRS.ymax - padding.top * heightOfScreenPixelInMapCRS;
        log({
          xMinOfInnerTileInMapCRS: xMinOfInnerTileInMapCRS,
          yMinOfInnerTileInMapCRS: yMinOfInnerTileInMapCRS,
          xMaxOfInnerTileInMapCRS: xMaxOfInnerTileInMapCRS,
          yMaxOfInnerTileInMapCRS: yMaxOfInnerTileInMapCRS
        });
      }

      var canvasPadding = {
        left: Math.max(padding.left, 0),
        right: Math.max(padding.right, 0),
        top: Math.max(padding.top, 0),
        bottom: Math.max(padding.bottom, 0)
      };
      var canvasHeight = this.tileHeight - canvasPadding.top - canvasPadding.bottom;
      var canvasWidth = this.tileWidth - canvasPadding.left - canvasPadding.right; // set padding and size of canvas tile

      tile.style.paddingTop = canvasPadding.top + "px";
      tile.style.paddingRight = canvasPadding.right + "px";
      tile.style.paddingBottom = canvasPadding.bottom + "px";
      tile.style.paddingLeft = canvasPadding.left + "px";
      tile.height = canvasHeight;
      tile.style.height = canvasHeight + "px";
      tile.width = canvasWidth;
      tile.style.width = canvasWidth + "px";
      if (debugLevel >= 3) console.log("setting tile height to " + canvasHeight + "px");
      if (debugLevel >= 3) console.log("setting tile width to " + canvasWidth + "px"); // set how large to display each sample in screen pixels

      var heightOfSampleInScreenPixels = innerTileHeight / numberOfSamplesDown;
      var heightOfSampleInScreenPixelsInt = Math.ceil(heightOfSampleInScreenPixels);
      var widthOfSampleInScreenPixels = innerTileWidth / numberOfSamplesAcross;
      var widthOfSampleInScreenPixelsInt = Math.ceil(widthOfSampleInScreenPixels);
      var map = this.getMap();
      var tileSize = this.getTileSize(); // this converts tile coordinates (how many tiles down and right)
      // to pixels from left and top of tile pane

      var tileNwPoint = coords.scaleBy(tileSize);
      if (debugLevel >= 4) log({
        tileNwPoint: tileNwPoint
      });
      var xLeftOfInnerTile = tileNwPoint.x + padding.left;
      var yTopOfInnerTile = tileNwPoint.y + padding.top;
      var innerTileTopLeftPoint = {
        x: xLeftOfInnerTile,
        y: yTopOfInnerTile
      };
      if (debugLevel >= 4) log({
        innerTileTopLeftPoint: innerTileTopLeftPoint
      }); // render asynchronously so tiles show up as they finish instead of all at once (which blocks the UI)

      setTimeout( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var tileRasters, noDataValue, bandIndex, min, max, band, rowIndex, row, columnIndex, value, _loop, h, _ret;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                tileRasters = null;

                if (rasters) {
                  _context2.next = 7;
                  break;
                }

                _context2.next = 5;
                return _this3.getRasters({
                  innerTileTopLeftPoint: innerTileTopLeftPoint,
                  heightOfSampleInScreenPixels: heightOfSampleInScreenPixels,
                  widthOfSampleInScreenPixels: widthOfSampleInScreenPixels,
                  zoom: zoom,
                  pixelHeight: pixelHeight,
                  pixelWidth: pixelWidth,
                  numberOfSamplesAcross: numberOfSamplesAcross,
                  numberOfSamplesDown: numberOfSamplesDown,
                  ymax: ymax,
                  xmin: xmin
                });

              case 5:
                tileRasters = _context2.sent;

                if (tileRasters && _this3.calcStats) {
                  noDataValue = _this3.noDataValue;

                  for (bandIndex = 0; bandIndex < tileRasters.length; bandIndex++) {
                    min = _this3.currentStats.mins[bandIndex];
                    max = _this3.currentStats.maxs[bandIndex];
                    band = tileRasters[bandIndex];

                    for (rowIndex = 0; rowIndex < band.length; rowIndex++) {
                      row = band[rowIndex];

                      for (columnIndex = 0; columnIndex < row.length; columnIndex++) {
                        value = row[columnIndex];

                        if (value !== noDataValue) {
                          if (min === undefined || value < min) min = value;
                          if (max === undefined || value > max) max = value;
                        }
                      }
                    }

                    _this3.currentStats.mins[bandIndex] = min;
                    _this3.currentStats.maxs[bandIndex] = max;
                    _this3.currentStats.ranges[bandIndex] = max - min;
                  }
                }

              case 7:
                _context2.next = 9;
                return _this3.checkIfYCbCr;

              case 9:
                _loop = function _loop(h) {
                  var yCenterInMapPixels = yTopOfInnerTile + (h + 0.5) * heightOfSampleInScreenPixels;
                  var latWestPoint = L.point(xLeftOfInnerTile, yCenterInMapPixels);

                  var _map$unproject = map.unproject(latWestPoint, zoom),
                      lat = _map$unproject.lat;

                  if (lat > yMinOfLayer && lat < yMaxOfLayer) {
                    var _ret2 = function () {
                      var yInTilePixels = Math.round(h * heightOfSampleInScreenPixels) + Math.min(padding.top, 0);
                      var yInRasterPixels = 0;

                      if (inSimpleCRS || _this3.projection === EPSG4326) {
                        yInRasterPixels = Math.floor((yMaxOfLayer - lat) / pixelHeight);
                      }

                      var _loop2 = function _loop2(w) {
                        var latLngPoint = L.point(xLeftOfInnerTile + (w + 0.5) * widthOfSampleInScreenPixels, yCenterInMapPixels);

                        var _map$unproject2 = map.unproject(latLngPoint, zoom),
                            xOfLayer = _map$unproject2.lng;

                        if (xOfLayer > xMinOfLayer && xOfLayer < xMaxOfLayer) {
                          var xInRasterPixels = 0;

                          if (inSimpleCRS || _this3.projection === EPSG4326) {
                            xInRasterPixels = Math.floor((xOfLayer - xMinOfLayer) / pixelWidth);
                          } else if (_this3.getProjector()) {
                            var inverted = _this3.getProjector().inverse({
                              x: xOfLayer,
                              y: lat
                            });

                            var yInSrc = inverted.y;
                            yInRasterPixels = Math.floor((ymax - yInSrc) / pixelHeight);
                            if (yInRasterPixels < 0 || yInRasterPixels >= rasterHeight) return "continue";
                            var xInSrc = inverted.x;
                            xInRasterPixels = Math.floor((xInSrc - xmin) / pixelWidth);
                            if (xInRasterPixels < 0 || xInRasterPixels >= rasterWidth) return "continue";
                          }

                          var values = null;

                          if (tileRasters) {
                            // get value from array specific to this tile
                            values = tileRasters.map(function (band) {
                              return band[h][w];
                            });
                          } else if (rasters) {
                            // get value from array with data for entire raster
                            values = rasters.map(function (band) {
                              return band[yInRasterPixels][xInRasterPixels];
                            });
                          } else {
                            done && done(Error("no rasters are available for, so skipping value generation"));
                            return {
                              v: {
                                v: {
                                  v: void 0
                                }
                              }
                            };
                          } // x-axis coordinate of the starting point of the rectangle representing the raster pixel


                          var x = Math.round(w * widthOfSampleInScreenPixels) + Math.min(padding.left, 0); // y-axis coordinate of the starting point of the rectangle representing the raster pixel

                          var y = yInTilePixels; // how many real screen pixels does a pixel of the sampled raster take up

                          var width = widthOfSampleInScreenPixelsInt;
                          var height = heightOfSampleInScreenPixelsInt;

                          if (_this3.options.customDrawFunction) {
                            _this3.options.customDrawFunction({
                              values: values,
                              context: context,
                              x: x,
                              y: y,
                              width: width,
                              height: height,
                              rasterX: xInRasterPixels,
                              rasterY: yInRasterPixels,
                              sampleX: w,
                              sampleY: h,
                              sampledRaster: tileRasters
                            });
                          } else {
                            var color = _this3.getColor(values);

                            if (color && context) {
                              context.fillStyle = color;
                              context.fillRect(x, y, width, height);
                            }
                          }
                        }
                      };

                      for (var w = 0; w < numberOfSamplesAcross; w++) {
                        var _ret3 = _loop2(w);

                        if (_ret3 === "continue") continue;
                        if (_typeof(_ret3) === "object") return _ret3.v;
                      }
                    }();

                    if (_typeof(_ret2) === "object") return _ret2.v;
                  }
                };

                h = 0;

              case 11:
                if (!(h < numberOfSamplesDown)) {
                  _context2.next = 18;
                  break;
                }

                _ret = _loop(h);

                if (!(_typeof(_ret) === "object")) {
                  _context2.next = 15;
                  break;
                }

                return _context2.abrupt("return", _ret.v);

              case 15:
                h++;
                _context2.next = 11;
                break;

              case 18:
                _context2.next = 23;
                break;

              case 20:
                _context2.prev = 20;
                _context2.t0 = _context2["catch"](0);
                error = _context2.t0;

              case 23:
                done && done(error, tile);

              case 24:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[0, 20]]);
      })), 0); // return the tile so it can be rendered on screen

      return tile;
    } catch (error) {
      done && done(error, tile);
    }
  },
  // copied from Leaflet with slight modifications,
  // including removing the lines that set the tile size
  _initTile: function _initTile(tile) {
    L.DomUtil.addClass(tile, "leaflet-tile");
    tile.onselectstart = L.Util.falseFn;
    tile.onmousemove = L.Util.falseFn; // update opacity on tiles in IE7-8 because of filter inheritance problems

    if (L.Browser.ielt9 && this.options.opacity < 1) {
      L.DomUtil.setOpacity(tile, this.options.opacity);
    } // without this hack, tiles disappear after zoom on Chrome for Android
    // https://github.com/Leaflet/Leaflet/issues/2078


    if (L.Browser.android && !L.Browser.android23) {
      tile.style.WebkitBackfaceVisibility = "hidden";
    }
  },
  // method from https://github.com/Leaflet/Leaflet/blob/bb1d94ac7f2716852213dd11563d89855f8d6bb1/src/layer/ImageOverlay.js
  getBounds: function getBounds() {
    this.initBounds();
    return this._bounds;
  },
  getMap: function getMap() {
    return this._map || this._mapToAdd;
  },
  getMapCRS: function getMapCRS() {
    var _this$getMap;

    return ((_this$getMap = this.getMap()) === null || _this$getMap === void 0 ? void 0 : _this$getMap.options.crs) || L.CRS.EPSG3857;
  },
  // add in to ensure backwards compatability with Leaflet 1.0.3
  _tileCoordsToNwSe: function _tileCoordsToNwSe(coords) {
    var map = this.getMap();
    var tileSize = this.getTileSize();
    var nwPoint = coords.scaleBy(tileSize);
    var sePoint = nwPoint.add(tileSize);
    var nw = map.unproject(nwPoint, coords.z);
    var se = map.unproject(sePoint, coords.z);
    return [nw, se];
  },
  _tileCoordsToBounds: function _tileCoordsToBounds(coords) {
    var _this$_tileCoordsToNw = this._tileCoordsToNwSe(coords),
        _this$_tileCoordsToNw2 = _slicedToArray(_this$_tileCoordsToNw, 2),
        nw = _this$_tileCoordsToNw2[0],
        se = _this$_tileCoordsToNw2[1];

    var bounds = new L.LatLngBounds(nw, se);

    if (!this.options.noWrap) {
      var crs = this.getMap().options.crs;
      bounds = crs.wrapLatLngBounds(bounds);
    }

    return bounds;
  },
  _isValidTile: function _isValidTile(coords) {
    var crs = this.getMapCRS();

    if (!crs.infinite) {
      // don't load tile if it's out of bounds and not wrapped
      var globalBounds = this._globalTileRange;

      if (!crs.wrapLng && (coords.x < globalBounds.min.x || coords.x > globalBounds.max.x) || !crs.wrapLat && (coords.y < globalBounds.min.y || coords.y > globalBounds.max.y)) {
        return false;
      }
    }

    var bounds = this.getBounds();

    if (!bounds) {
      return true;
    }

    var x = coords.x,
        y = coords.y,
        z = coords.z; // not sure what srs should be here when simple crs

    var layerExtent = new _geoExtent.GeoExtent(bounds, {
      srs: 4326
    });

    var boundsOfTile = this._tileCoordsToBounds(coords); // check given tile coordinates


    if (layerExtent.overlaps(boundsOfTile)) return true; // if not within the original confines of the earth return false
    // we don't want wrapping if using Simple CRS

    if (isSimpleCRS(crs)) return false; // width of the globe in tiles at the given zoom level

    var width = Math.pow(2, z); // check one world to the left

    var leftCoords = L.point(x - width, y);
    leftCoords.z = z;

    var leftBounds = this._tileCoordsToBounds(leftCoords);

    if (layerExtent.overlaps(leftBounds)) return true; // check one world to the right

    var rightCoords = L.point(x + width, y);
    rightCoords.z = z;

    var rightBounds = this._tileCoordsToBounds(rightCoords);

    if (layerExtent.overlaps(rightBounds)) return true;
    return false;
  },
  getColor: function getColor(values) {
    var _this4 = this;

    if (this.options.pixelValuesToColorFn) {
      return this.options.pixelValuesToColorFn(values);
    } else {
      var numberOfValues = values.length;
      var haveDataForAllBands = values.every(function (value) {
        return value !== undefined && value !== _this4.noDataValue;
      });

      if (haveDataForAllBands) {
        if (numberOfValues == 1) {
          var value = values[0];

          if (this.palette) {
            var _this$palette$value = _slicedToArray(this.palette[value], 4),
                r = _this$palette$value[0],
                g = _this$palette$value[1],
                b = _this$palette$value[2],
                a = _this$palette$value[3];

            return "rgba(".concat(r, ",").concat(g, ",").concat(b, ",").concat(a / 255, ")");
          } else if (this.georasters[0].mins) {
            var _this$georasters$ = this.georasters[0],
                mins = _this$georasters$.mins,
                ranges = _this$georasters$.ranges;
            return this.scale((values[0] - mins[0]) / ranges[0]).hex();
          } else if (this.currentStats.mins) {
            var min = this.currentStats.mins[0];
            var range = this.currentStats.ranges[0];
            return this.scale((values[0] - min) / range).hex();
          }
        } else if (numberOfValues === 2) {
          return "rgb(".concat(values[0], ",").concat(values[1], ",0)");
        } else if (numberOfValues === 3) {
          return "rgb(".concat(values[0], ",").concat(values[1], ",").concat(values[2], ")");
        } else if (numberOfValues === 4) {
          return "rgba(".concat(values[0], ",").concat(values[1], ",").concat(values[2], ",").concat(values[3] / 255, ")");
        }
      }
    }
  },

  /**
   * Redraws the active map tiles updating the pixel values using the supplie callback
   */
  updateColors: function updateColors(pixelValuesToColorFn) {
    var _this5 = this;

    var _ref4 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      debugLevel: -1
    },
        _ref4$debugLevel = _ref4.debugLevel,
        debugLevel = _ref4$debugLevel === void 0 ? -1 : _ref4$debugLevel;

    if (!pixelValuesToColorFn) {
      throw new Error("Missing pixelValuesToColorFn function");
    } // if debugLevel is -1, set it to the default for the class


    if (debugLevel === -1) debugLevel = this.debugLevel;
    if (debugLevel >= 1) console.log("Start updating active tile pixel values"); // update option to ensure correct colours at other zoom levels.

    this.options.pixelValuesToColorFn = pixelValuesToColorFn;
    var tiles = this.getActiveTiles();

    if (!tiles) {
      console.error("No active tiles available");
      return this;
    }

    if (debugLevel >= 1) console.log("Active tiles fetched", tiles);
    tiles.forEach(function (tile) {
      var coords = tile.coords,
          el = tile.el;

      _this5.drawTile({
        tile: el,
        coords: coords,
        context: el.getContext("2d")
      });
    });
    if (debugLevel >= 1) console.log("Finished updating active tile colours");
    return this;
  },
  getTiles: function getTiles() {
    // transform _tiles object collection into an array
    return Object.values(this._tiles);
  },
  getActiveTiles: function getActiveTiles() {
    var _this6 = this;

    var tiles = this.getTiles(); // only return valid tiles

    return tiles.filter(function (tile) {
      return _this6._isValidTile(tile.coords);
    });
  },
  isSupportedProjection: function isSupportedProjection() {
    if (this._isSupportedProjection === undefined) {
      var projection = this.projection;

      if ((0, _isUTM.default)(projection)) {
        this._isSupportedProjection = true;
      } else if (PROJ4_SUPPORTED_PROJECTIONS.has(projection)) {
        this._isSupportedProjection = true;
      } else if (typeof _proj4FullyLoaded.default === "function" && "EPSG:".concat(projection) in _proj4FullyLoaded.default.defs) {
        this._isSupportedProjection = true;
      } else if (typeof proj4 === "function" && typeof proj4.defs !== "undefined" && "EPSG:".concat(projection) in proj4.defs) {
        this._isSupportedProjection = true;
      } else {
        this._isSupportedProjection = false;
      }
    }

    return this._isSupportedProjection;
  },
  getProjectionString: function getProjectionString(projection) {
    if ((0, _isUTM.default)(projection)) {
      return (0, _getProjString.default)(projection);
    }

    return "EPSG:".concat(projection);
  },
  initBounds: function initBounds(options) {
    if (!options) options = this.options;

    if (!this._bounds) {
      var debugLevel = this.debugLevel,
          height = this.height,
          width = this.width,
          projection = this.projection,
          xmin = this.xmin,
          xmax = this.xmax,
          ymin = this.ymin,
          ymax = this.ymax; // check if map using Simple CRS

      if (isSimpleCRS(this.getMapCRS())) {
        if (height === width) {
          this._bounds = L.latLngBounds([ORIGIN, [MAX_NORTHING, MAX_EASTING]]);
        } else if (height > width) {
          this._bounds = L.latLngBounds([ORIGIN, [MAX_NORTHING, MAX_EASTING / this.ratio]]);
        } else if (width > height) {
          this._bounds = L.latLngBounds([ORIGIN, [MAX_NORTHING * this.ratio, MAX_EASTING]]);
        }
      } else if (projection === EPSG4326) {
        if (debugLevel >= 1) console.log("georaster projection is in ".concat(EPSG4326));
        var minLatWest = L.latLng(ymin, xmin);
        var maxLatEast = L.latLng(ymax, xmax);
        this._bounds = L.latLngBounds(minLatWest, maxLatEast);
      } else if (this.getProjector()) {
        if (debugLevel >= 1) console.log("projection is UTM or supported by proj4");
        var bottomLeft = this.getProjector().forward({
          x: xmin,
          y: ymin
        });

        var _minLatWest = L.latLng(bottomLeft.y, bottomLeft.x);

        var topRight = this.getProjector().forward({
          x: xmax,
          y: ymax
        });

        var _maxLatEast = L.latLng(topRight.y, topRight.x);

        this._bounds = L.latLngBounds(_minLatWest, _maxLatEast);
      } else {
        if (typeof _proj4FullyLoaded.default !== "function") {
          throw "You are using the lite version of georaster-layer-for-leaflet, which does not support rasters with the projection ".concat(projection, ".  Please try using the default build or add the projection definition to your global proj4.");
        } else {
          throw "GeoRasterLayer does not provide built-in support for rasters with the projection ".concat(projection, ".  Add the projection definition to your global proj4.");
        }
      } // these values are used so we don't try to sample outside of the raster


      this.xMinOfLayer = this._bounds.getWest();
      this.xMaxOfLayer = this._bounds.getEast();
      this.yMaxOfLayer = this._bounds.getNorth();
      this.yMinOfLayer = this._bounds.getSouth();
      options.bounds = this._bounds;
    }
  },
  getProjector: function getProjector() {
    if (this.isSupportedProjection()) {
      if (!_proj4FullyLoaded.default && !proj4) {
        throw "proj4 must be found in the global scope in order to load a raster that uses this projection";
      }

      if (!this._projector) {
        var projString = this.getProjectionString(this.projection);
        if (this.debugLevel >= 1) log({
          projString: projString
        });
        var proj4Lib;

        if (projString.startsWith("EPSG")) {
          if (typeof proj4 === "function" && typeof proj4.defs === "function" && projString in proj4.defs) {
            proj4Lib = proj4;
          } else if (typeof _proj4FullyLoaded.default === "function" && typeof _proj4FullyLoaded.default.defs === "function" && projString in _proj4FullyLoaded.default.defs) {
            proj4Lib = _proj4FullyLoaded.default;
          } else {
            throw "[georaster-layer-for-leaflet] projection not found in proj4 instance";
          }
        } else {
          if (typeof proj4 === "function") {
            proj4Lib = proj4;
          } else if (typeof _proj4FullyLoaded.default === "function") {
            proj4Lib = _proj4FullyLoaded.default;
          } else {
            throw "[georaster-layer-for-leaflet] projection not found in proj4 instance";
          }
        }

        this._projector = proj4Lib(projString, "EPSG:".concat(EPSG4326));
        if (this.debugLevel >= 1) console.log("projector set");
      }

      return this._projector;
    }
  },
  same: function same(array, key) {
    return new Set(array.map(function (item) {
      return item[key];
    })).size === 1;
  }
});
/* eslint-disable @typescript-eslint/no-explicit-any */

if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") {
  window["GeoRasterLayer"] = GeoRasterLayer;
}

if (typeof self !== "undefined") {
  self["GeoRasterLayer"] = GeoRasterLayer;
}
/* eslint-enable @typescript-eslint/no-explicit-any */


var _default = GeoRasterLayer; // Explicitly exports public types

exports.default = _default;
