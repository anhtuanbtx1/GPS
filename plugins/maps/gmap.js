/* eslint-disable unicorn/prefer-includes */
/* eslint-disable no-lone-blocks */
/* eslint-disable no-use-before-define */
/* eslint-disable no-redeclare */
/* eslint-disable no-shadow-restricted-names */
/* eslint-disable no-useless-call */
/* eslint-disable no-empty */
/* eslint-disable prefer-const */
/* eslint-disable camelcase */
/* eslint-disable object-shorthand */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-var */


var gsn = {};

(function ($, undefined) {
    if (gsn === undefined) {
        gsn = {};
    }
    gsn.maps = {
        _providerName: "",
        _currentProvider: null,
        _defaultOptions: {
            latitude: defaultLocationMapBacNinh.lat,
            longitude: defaultLocationMapBacNinh.long,
            zoom: 15,
            minZoom: 10,
            maxZoom: 15
        },
        _options: {},
        _layers: [],
        _circle: {},
        _listSOS: {},

        initialize: function (type, options) {
            this._options = $.extend({}, this._defaultOptions, options);
            this._providerName = type;
            this._currentProvider = this._providers[type];
            return this._currentProvider.initialize(this._options);
        },

        getLayer: function (layerName) {
            return this._layers[layerName];
        },
        clearLayer: function (layerName) {
            this._layers[layerName] = [];
        },
        registerMarkerTypes: function (images) {
            this._currentProvider.registerMarkerTypes(images);
        },
        registerCircle: function (name, lon, lat, r) {

            this._circle[name] = {
                center: new google.maps.LatLng(lat, lon),
                population: r
            };

        },
        clearCircle: function (name) {

            this._listSOS[name] = name;

        },
        cityCircleArray: {},

        drawCircle: function (mapObj, cl) {

            var cityCircle;

            for (var city in this.cityCircleArray) {
                if (city != null)
                    this.cityCircleArray[city].setVisible(false);
            }

            if (cl === 0) {
                for (var city in this._circle) {

                    if (this._listSOS[city] == null) {
                        var populationOptions = {
                            strokeColor: '#0192FF',
                            strokeOpacity: 0.35,
                            strokeWeight: 2,
                            fillColor: '#0192FF',
                            fillOpacity: 0.35,
                            map: mapObj,
                            center: this._circle[city].center,
                            radius: this._circle[city].population / 20
                        };

                        cityCircle = new google.maps.Circle(populationOptions);

                        this.cityCircleArray[city] = cityCircle;
                    }
                } 
            }
            else {
                for (var city in this._circle) {
                    if (this._listSOS[city] == null) {
                     
                        var populationOptions = {
                            strokeColor: '#FF0000',
                            strokeOpacity: 0.35,
                            strokeWeight: 2,
                            fillColor: '#FF0000',
                            fillOpacity: 0.35,
                            map: mapObj,
                            center: this._circle[city].center,
                            radius: this._circle[city].population / 20
                        };
                        cityCircle = new google.maps.Circle(populationOptions);
                        this.cityCircleArray[city] = cityCircle;
                    }
                } 
            }

        },
        goto: function (lat, lng) {
            this._currentProvider.goto(lat, lng);
        },
        hideInfo: function (id) {
            this._currentProvider.hideInfo(id);
        },
        showInfo: function (content, lat, lng) {
            var infoContainer = '<div>' + content + '</div>';
            this._currentProvider.showInfo(infoContainer, lat, lng);
        },

        setInfoPosition: function (lat, lng) {
            this._currentProvider.setInfoPosition(lat, lng);
        },

      

        showMarker: function (layerName, id, options) {
            var defaultOptions = {
                title: '',
                image: null,
                lat: 0,
                lng: 0
            };
            var layer = this._layers[layerName];
            if (layer === undefined) {
                layer = this._layers[layerName] = {};
            }
            var marker = layer[id];
            if (marker === undefined) {
                marker = layer[id] = options;
            }
            else if (options !== undefined) {
                $.extend(marker, defaultOptions, options);
            }
            this._currentProvider.showMarker(marker);
        },
        clearMarkers: function () {
            this._currentProvider.clearMarkers();
        },
        hideMarkers: function (layerName) {
            this._currentProvider.hideMarker(layerName);
        },
        addPopupClick: function () {
            this._currentProvider.addPopupClick();
        },
        getMarkerAnchor: function (layerName, id) {

            var layer = this._layers[layerName];
            if (layer === undefined) {
                return null;
            }
            var marker = layer[id];
            if (marker === undefined) {
                return null;
            }
            return this._currentProvider.getMarkerAnchor(marker);
        },

        showRoute: function (name, wayPoints) {
            return this._currentProvider.showRoute(name, wayPoints);
        },

        hideRoute: function (name) {
            return this._currentProvider.hideRoute(name);

        },

        hideAllRoutes: function () {
            return this._currentProvider.hideAllRoutes();
        },

        setCenter: function (lat, lng, zoom) {
            return this._currentProvider.setCenter(lat, lng, zoom);
        },

        getBounds: function () { return this._currentProvider.getBounds() },

        checkMapBounds: function (lat, long) { return this._currentProvider.checkMapBounds(lat, long) },

        getAddress: function (lat, lng, dvAddress) {
            this._currentProvider.getAddress(lat, lng, dvAddress);
        },

        getAddressAutocompleteSearch: function (input, eventHandle) { // return obj= {lat:x, lon:x, address:""}

            return this._currentProvider.getAddressAutocompleteSearch(input, eventHandle);
        },

      
        getAddress2: function (lat, lng, dvAddress) {
            var point = new google.maps.LatLng(lat, lng);
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({ latLng: point }, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    if (results[0]) {
                        dvAddress.html(results[0].formatted_address);
                    }
                    else
                        dvAddress.html("[Không tìm thấy]");

                } 
                else
                    dvAddress.html("[Không tìm thấy]");
            });
        } 
    };
   
    gsn.maps._providers = {
        google: {
            _map: null,
            _infoWindow: null,
            _markerImages: {},
            _markerListCategory: [],
            _listMarker: [],
            _drawingManager: null,
            _listDrawShapes: [],
            _shapeCircle: null,
            _listMarkerCluster: [],
            _routes: {},
            _addr: "",
            _lastIndexOfMarker: 0,
            _maxZindex: 100010,
            _minZindexMarker: 99999999,
            _maxZindexMarker: 0,

            initialize: function (options) {
                var latlng = new google.maps.LatLng(options.latitude, options.longitude);
                var myOptions = {
                    zoom: options.zoom,
                    center: latlng,
                    mapTypeId: 'GTEL Map',
                    zoomControl: true,
                    zoomControlOptions: {
                        position: google.maps.ControlPosition.RIGHT_BOTTOM
                    },
                    panControl: true,
                    panControlOptions: {
                        position: google.maps.ControlPosition.RIGHT_BOTTOM
                    },
                    locationControl: false,
                    mapTypeControl: true,
                    streetViewControl: false,
                    mapTypeControlOptions: {
                        mapTypeIds: mapTypeIds,
                        position: google.maps.ControlPosition.TOP_LEFT,
                        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
                    },
                };
                this._map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
                ///

                var mapTypeIds = [];
                //            	for(var type in google.maps.MapTypeId) {
                //                	mapTypeIds.push(google.maps.MapTypeId[type]);
                //            	}

                mapTypeIds.push(google.maps.MapTypeId.ROADMAP);
                mapTypeIds.push(google.maps.MapTypeId.SATELLITE);
                mapTypeIds.push(google.maps.MapTypeId.HYBRID);
                mapTypeIds.push("OSM");

                this._map.mapTypes.set("OSM", new google.maps.ImageMapType({
                    getTileUrl: function (coord, zoom) {

                        return "http://tile.openstreetmap.org/" + zoom + "/" + coord.x + "/" + coord.y + ".png";
                    },
                    tileSize: new google.maps.Size(256, 256),
                    name: "OSM",
                    maxZoom: 21
                }));

                mapTypeIds.push("GTEL Map");
                this._map.mapTypes.set("GTEL Map", new google.maps.ImageMapType({
                   

                    getTileUrl: function(a, c) { return "https://map.gtel.vn/rtiles/basic/" + c + "/" + a.x + "/" + a.y + ".png" },
                    tileSize: new google.maps.Size(256, 256),
                    name: "GTEL Map",
                    maxZoom: 17
                }));

                this._map.mapTypeControlOptions.mapTypeIds = mapTypeIds;

                // mode
                try {
                    var styles = {
                        default: [
                            {
                                elementType: "labels.icon",
                                stylers: [{ visibility: "off" }],
                            }
                        ],
                        silver: [
                            {
                                elementType: "geometry",
                                stylers: [{ color: "#f5f5f5" }],
                            },
                            {
                                elementType: "labels.icon",
                                stylers: [{ visibility: "off" }],
                            },
                            {
                                elementType: "labels.text.fill",
                                stylers: [{ color: "#616161" }],
                            },
                            {
                                elementType: "labels.text.stroke",
                                stylers: [{ color: "#f5f5f5" }],
                            },
                            {
                                featureType: "administrative.land_parcel",
                                elementType: "labels.text.fill",
                                stylers: [{ color: "#bdbdbd" }],
                            },
                            {
                                featureType: "poi",
                                elementType: "geometry",
                                stylers: [{ color: "#eeeeee" }],
                            },
                            {
                                featureType: "poi",
                                elementType: "labels.text.fill",
                                stylers: [{ color: "#757575" }],
                            },
                            {
                                featureType: "poi.park",
                                elementType: "geometry",
                                stylers: [{ color: "#e5e5e5" }],
                            },
                            {
                                featureType: "poi.park",
                                elementType: "labels.text.fill",
                                stylers: [{ color: "#9e9e9e" }],
                            },
                            {
                                featureType: "road",
                                elementType: "geometry",
                                stylers: [{ color: "#ffffff" }],
                            },
                            {
                                featureType: "road.arterial",
                                elementType: "labels.text.fill",
                                stylers: [{ color: "#757575" }],
                            },
                            {
                                featureType: "road.highway",
                                elementType: "geometry",
                                stylers: [{ color: "#dadada" }],
                            },
                            {
                                featureType: "road.highway",
                                elementType: "labels.text.fill",
                                stylers: [{ color: "#616161" }],
                            },
                            {
                                featureType: "road.local",
                                elementType: "labels.text.fill",
                                stylers: [{ color: "#9e9e9e" }],
                            },
                            {
                                featureType: "transit.line",
                                elementType: "geometry",
                                stylers: [{ color: "#e5e5e5" }],
                            },
                            {
                                featureType: "transit.station",
                                elementType: "geometry",
                                stylers: [{ color: "#eeeeee" }],
                            },
                            {
                                featureType: "water",
                                elementType: "geometry",
                                stylers: [{ color: "#c9c9c9" }],
                            },
                            {
                                featureType: "water",
                                elementType: "labels.text.fill",
                                stylers: [{ color: "#9e9e9e" }],
                            },
                        ],

                        night: [
                            { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
                            { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
                            { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
                            {
                                featureType: "administrative.locality",
                                elementType: "labels.text.fill",
                                stylers: [{ color: "#d59563" }],
                            },
                            {
                                featureType: "poi",
                                elementType: "labels.text.fill",
                                stylers: [{ color: "#d59563" }],
                            },
                            {
                                featureType: "poi.park",
                                elementType: "geometry",
                                stylers: [{ color: "#263c3f" }],
                            },
                            {
                                featureType: "poi.park",
                                elementType: "labels.text.fill",
                                stylers: [{ color: "#6b9a76" }],
                            },
                            {
                                featureType: "road",
                                elementType: "geometry",
                                stylers: [{ color: "#38414e" }],
                            },
                            {
                                featureType: "road",
                                elementType: "geometry.stroke",
                                stylers: [{ color: "#212a37" }],
                            },
                            {
                                featureType: "road",
                                elementType: "labels.text.fill",
                                stylers: [{ color: "#9ca5b3" }],
                            },
                            {
                                featureType: "road.highway",
                                elementType: "geometry",
                                stylers: [{ color: "#746855" }],
                            },
                            {
                                featureType: "road.highway",
                                elementType: "geometry.stroke",
                                stylers: [{ color: "#1f2835" }],
                            },
                            {
                                featureType: "road.highway",
                                elementType: "labels.text.fill",
                                stylers: [{ color: "#f3d19c" }],
                            },
                            {
                                featureType: "transit",
                                elementType: "geometry",
                                stylers: [{ color: "#2f3948" }],
                            },
                            {
                                featureType: "transit.station",
                                elementType: "labels.text.fill",
                                stylers: [{ color: "#d59563" }],
                            },
                            {
                                featureType: "water",
                                elementType: "geometry",
                                stylers: [{ color: "#17263c" }],
                            },
                            {
                                featureType: "water",
                                elementType: "labels.text.fill",
                                stylers: [{ color: "#515c6d" }],
                            },
                            {
                                featureType: "water",
                                elementType: "labels.text.stroke",
                                stylers: [{ color: "#17263c" }],
                            },
                        ],

                        retro: [
                            { elementType: "geometry", stylers: [{ color: "#ebe3cd" }] },
                            { elementType: "labels.text.fill", stylers: [{ color: "#523735" }] },
                            { elementType: "labels.text.stroke", stylers: [{ color: "#f5f1e6" }] },
                            {
                                featureType: "administrative",
                                elementType: "geometry.stroke",
                                stylers: [{ color: "#c9b2a6" }],
                            },
                            {
                                featureType: "administrative.land_parcel",
                                elementType: "geometry.stroke",
                                stylers: [{ color: "#dcd2be" }],
                            },
                            {
                                featureType: "administrative.land_parcel",
                                elementType: "labels.text.fill",
                                stylers: [{ color: "#ae9e90" }],
                            },
                            {
                                featureType: "landscape.natural",
                                elementType: "geometry",
                                stylers: [{ color: "#dfd2ae" }],
                            },
                            {
                                featureType: "poi",
                                elementType: "geometry",
                                stylers: [{ color: "#dfd2ae" }],
                            },
                            {
                                featureType: "poi",
                                elementType: "labels.text.fill",
                                stylers: [{ color: "#93817c" }],
                            },
                            {
                                featureType: "poi.park",
                                elementType: "geometry.fill",
                                stylers: [{ color: "#a5b076" }],
                            },
                            {
                                featureType: "poi.park",
                                elementType: "labels.text.fill",
                                stylers: [{ color: "#447530" }],
                            },
                            {
                                featureType: "road",
                                elementType: "geometry",
                                stylers: [{ color: "#f5f1e6" }],
                            },
                            {
                                featureType: "road.arterial",
                                elementType: "geometry",
                                stylers: [{ color: "#fdfcf8" }],
                            },
                            {
                                featureType: "road.highway",
                                elementType: "geometry",
                                stylers: [{ color: "#f8c967" }],
                            },
                            {
                                featureType: "road.highway",
                                elementType: "geometry.stroke",
                                stylers: [{ color: "#e9bc62" }],
                            },
                            {
                                featureType: "road.highway.controlled_access",
                                elementType: "geometry",
                                stylers: [{ color: "#e98d58" }],
                            },
                            {
                                featureType: "road.highway.controlled_access",
                                elementType: "geometry.stroke",
                                stylers: [{ color: "#db8555" }],
                            },
                            {
                                featureType: "road.local",
                                elementType: "labels.text.fill",
                                stylers: [{ color: "#806b63" }],
                            },
                            {
                                featureType: "transit.line",
                                elementType: "geometry",
                                stylers: [{ color: "#dfd2ae" }],
                            },
                            {
                                featureType: "transit.line",
                                elementType: "labels.text.fill",
                                stylers: [{ color: "#8f7d77" }],
                            },
                            {
                                featureType: "transit.line",
                                elementType: "labels.text.stroke",
                                stylers: [{ color: "#ebe3cd" }],
                            },
                            {
                                featureType: "transit.station",
                                elementType: "geometry",
                                stylers: [{ color: "#dfd2ae" }],
                            },
                            {
                                featureType: "water",
                                elementType: "geometry.fill",
                                stylers: [{ color: "#b9d3c2" }],
                            },
                            {
                                featureType: "water",
                                elementType: "labels.text.fill",
                                stylers: [{ color: "#92998d" }],
                            },
                        ],

                        hiding: [
                            {
                                featureType: "poi.business",
                                stylers: [{ visibility: "off" }],
                            },
                            {
                                featureType: "transit",
                                elementType: "labels.icon",
                                stylers: [{ visibility: "off" }],
                            },
                        ],
                    };
                    var styleControl = document.getElementById("style-selector-control")
                    this._map.controls[google.maps.ControlPosition.TOP_LEFT].push(styleControl);
                    var styleSelector = document.getElementById("style-selector");
                    this._map.setOptions({ styles: styles[styleSelector.value] });

                    $(styleSelector).on("change", function () {
                        let value = $(styleSelector).val();
                        gsn.maps._providers.google._map.setOptions({ styles: styles[value] });
                    })
                  
                } catch { }

               
                try {
                    var markerControl = document.getElementById("markerControl");
                    this._map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(markerControl);

                } catch { }

                // search adress
                try {
                    var divsearch = document.getElementById("searchAdress");
                    this._map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(divsearch);
                    var input = document.getElementById("inputSearchAdress");
                    var searchBox = new google.maps.places.SearchBox(input);
                    this._map.addListener("bounds_changed", () => {
                        searchBox.setBounds(this._map.getBounds());
                    });
                    let markersSearchAdress = [];
                    searchBox.addListener("places_changed", () => {

                        const places = searchBox.getPlaces();

                        if (places.length === 0) {
                            return;
                        }

                        // Clear out the old markers.
                        markersSearchAdress.forEach((marker) => {
                            marker.setMap(null);
                        });
                        markersSearchAdress = [];

                        

                        places.forEach((place) => {
                            if (!place.geometry || !place.geometry.location) {
                                console.log("Returned place contains no geometry");
                                return;
                            }

                            const icon = {
                                url: place.icon,
                                size: new google.maps.Size(36, 36),
                                origin: new google.maps.Point(0, 0),
                                anchor: new google.maps.Point(17, 34),
                                scaledSize: new google.maps.Size(25, 25),
                            };

                            // Create a marker for each place.
                            let markeritem = new google.maps.Marker({
                                map,
                                icon,
                                title: place.name,
                                position: place.geometry.location,
                            })
                            markersSearchAdress.push(markeritem);
                            {
                                markeritem.addListener("click", () => {
                                    let placeItem = place;
                                    let lat = placeItem.geometry.location.lat();
                                    let lng = placeItem.geometry.location.lng();
                                    // eslint-disable-next-line spaced-comment
                                    //let typeResource = "conganphuong";
                                    console.log("search", tapstripTracking)
                                    let typeResource = tapstripTracking;
                                    gsn.maps._providers.google.functionFindResourceWhenSearch2(lat, lng, typeResource, placeItem, radius = 5);
                                });
                            }
                           
                        });

                       
                        {
                            let place = places[0];
                            let lat = place.geometry.location.lat();
                            let lng = place.geometry.location.lng();
                            console.log("search", tapstripTracking)
                            let typeResource = tapstripTracking;
                            gsn.maps._providers.google.functionFindResourceWhenSearch2(lat, lng, typeResource, place, radius = 5);
                        }
                        // gsn.maps._providers.google._map.fitBounds(bounds);
                    });

                    setTimeout(() => {
                        var pacContainer = document.querySelector(".pac-container");
                        this._map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(pacContainer);
                    }, 1000);
                } catch { }


                //  draw 
                try {
                    let divdrawShapes = document.getElementById("drawShapes");
                    this._map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(divdrawShapes);
                } catch { }
                return this._map;
            },

            check_is_in_or_out: function (marker, circle) {
                try {
                   
                    return circle.getBounds().contains(marker.position);
                } catch {
                    return google.maps.geometry.poly.containsLocation(marker.getPosition(), circle);
                }
            },

            createDrawing: function () {

                this._drawingManager = new google.maps.drawing.DrawingManager({
                    drawingMode: google.maps.drawing.OverlayType.CIRCLE,
                    drawingControl: true,
                    drawingControlOptions: {
                        position: google.maps.ControlPosition.TOP_CENTER,
                        drawingModes: [
                          
                            google.maps.drawing.OverlayType.CIRCLE,
                            google.maps.drawing.OverlayType.POLYGON,
                           
                            google.maps.drawing.OverlayType.RECTANGLE,
                        ],
                    },
                  
                    rectangleOptions: {
                        fillColor: "red",
                        fillOpacity: 0.3,
                        strokeWeight: 1,
                        strokeColor: "red",
                        clickable: false,
                        editable: false,
                        zIndex: 1,
                    },
                    polygonOptions: {
                        fillColor: "red",
                        fillOpacity: 0.3,
                        strokeWeight: 1,
                        strokeColor: "red",
                        clickable: false,
                        editable: false,
                        zIndex: 1,
                    },
                    circleOptions: {
                        fillColor: "red",
                        fillOpacity: 0.3,
                        strokeWeight: 1,
                        strokeColor: "red",
                        clickable: false,
                        editable: false,
                        zIndex: 1,
                    },
                });
                this._drawingManager.setMap(this._map);

                this._drawingManager.addListener('overlaycomplete', function (event) {
                    let listMarkerInShape = []
                    let thiss = gsn.maps._providers.google;
                    if (thiss._listDrawShapes.length > 0) {
                        thiss._listDrawShapes[0].overlay.setMap(null);
                        thiss._listDrawShapes = [];
                    }

                    thiss._listDrawShapes.push(event)
                    let objects = event.overlay;

                    let boundsDraw;
                    if (event.type === "circle" || event.type === "rectangle")
                        boundsDraw = objects.getBounds()
                    else if (event.type === "polygon") {
                       
                        boundsDraw = new google.maps.LatLngBounds();
                    }

                    console.log("draw", tapstripTracking)
                    let name = "";
                    if (tapstripTracking === "conganphuong") name = "Danh sách Lực lượng";
                    else if (tapstripTracking === "cbcs") name = "Danh sách Cán bộ chiến sỹ";
                    else name = "Danh sách Thiết bị"
                   
                    let listMakerDevice;
                    if (tapstripTracking === "conganphuong")
                        listMakerDevice = thiss._listMarker.filter(e => e.category === tapstripTracking);
                    else if (tapstripTracking === "cbcs")
                        listMakerDevice = thiss._listMarker.filter(e => e.category.includes(tapstripTracking));
                    else 
                        listMakerDevice = thiss._listMarker.filter(e => listCategoryOfDevice.includes(e.category));

                    listMarkerInShape = [];
                    $.each(listMakerDevice, function (index, itemmarker) {
                        if (itemmarker.visible === true && thiss.check_is_in_or_out(itemmarker, objects)) {
                            boundsDraw.extend(itemmarker.position);
                            listMarkerInShape.push(itemmarker);
                        }
                    });
                  
                    let content = gsn.info.getInfoTextCategory(tapstripTracking, listMarkerInShape, { name: name, type: "draw" });

                    let posPopupx, posPopupy;
                    if (event.type === "circle") {
                        posPopupx = objects.center.lat();
                        posPopupy = objects.center.lng();
                    } else if (event.type === "rectangle") {
                        posPopupx = listMarkerInShape[0].position.lat();
                        posPopupy = listMarkerInShape[0].position.lng();;
                    } else if (event.type === "polygon") {
                        posPopupx = listMarkerInShape[0].position.lat();
                        posPopupy = listMarkerInShape[0].position.lng();;
                    }
                    thiss.showInfo(content, posPopupx, posPopupy);

                    thiss.activeElementSelectCategoryKendoInPopup(listMarkerInShape, posPopupx, posPopupy, objects, "draw");
                    thiss.activeElementInputCategoryKendoInPopup();

                    thiss._map.fitBounds(boundsDraw);
                  

                });
            },

            cleanDraw: function () {
                if (this._listDrawShapes.length > 0) {

                    this._listDrawShapes.forEach(function (e) {
                        e.overlay.setMap(null);
                    })
                    this._listDrawShapes = [];
                }
            },


            findResourcebyCategory: function (lat, lng, typeResource, radius = 1) { 

                let listMarkerInShape = []
                let thiss = gsn.maps._providers.google;
                let latlng = new google.maps.LatLng(lat, lng);

                if (thiss._shapeCircle != null)
                    thiss._shapeCircle.setMap(null);

                thiss._shapeCircle = new google.maps.Circle({
                    fillColor: "#ebb70e",
                    fillOpacity: 0.3,
                    strokeWeight: 1,
                    strokeColor: "#ebb70e",
                    clickable: false,
                    editable: false,
                    zIndex: 1,
                    map: thiss._map,
                    center: latlng,
                    radius: Number(radius) * 1000,
                });
                let boundsDraw = thiss._shapeCircle.getBounds()
                thiss._map.fitBounds(boundsDraw);
                return listMarkerInShape;
            },

            functionFindResourceWhenSearch: function (lat, lng, typeResource, place, radius = 5) {

                let listMarkerInShape = gsn.maps._providers.google.findResourcebyCategory(lat, lng, typeResource, radius);


                let content = gsn.info.getInfoTextCheckResourceInRadius(place, listMarkerInShape);
                gsn.maps._providers.google.showInfo(content, lat, lng);

            },

            functionFindResourceWhenSearch2: function (lat, lng, typeResource, place = null, radius = 5) {
                let thiss = gsn.maps._providers.google;
                let name = "";
               

                let listMarkerInShape = thiss.findResourcebyCategory(lat, lng, typeResource, radius);
                let content = gsn.info.getInfoTextCategory(typeResource, listMarkerInShape, { name: name });

                thiss.showInfo(content, lat, lng, false);
                thiss.activeElementSelectCategoryKendoInPopup(listMarkerInShape, lat, lng, thiss._shapeCircle);
               

            },

           

           
            registerMarkerTypes: function (images) {
                for (var key in images) {
                    this._markerImages[key] = new google.maps.MarkerImage(images[key],
                        new google.maps.Size(32, 32),
                        new google.maps.Point(0, 0),
                        new google.maps.Point(15, 15)
                    );
                }
            },

            goto: function (lat, lng) {
                this._map.panTo(new google.maps.LatLng(lat, lng));
            },

            showInfo: function (content, lat, lng, zoom = true) {
                var anchor = null;
                if (lng === undefined) {
                    anchor = lat;
                }
                this.hideInfo();
                if (!this._infoWindow) {
                    this._infoWindow = new google.maps.InfoWindow({
                        content: content
                    });
                }
                else {
                    this._infoWindow.setContent(content);
                }
                if (!anchor) {
                    this._infoWindow.setPosition(new google.maps.LatLng(lat, lng));
                }
                if (zoom) {
                    this._map.setZoom(18);
                    this._map.setZoom(17);
                }
                this.goto(lat, lng);
                this._infoWindow.open(this._map, anchor);
            },

            changePositionInfo: function (lat, lng,) {
                if (this.checkInfo())
                    this._infoWindow.setPosition(new google.maps.LatLng(lat, lng));
            },

            hideInfo: function () {
                if (this._infoWindow) {
                    this._infoWindow.close();
                }
            },

            checkInfo: function () {
                if (this._infoWindow) return true;
                return false;
            },

            boundByCategory: function (listCategoryToBound) {
                var listMarker = this._listMarker;
                if (listMarker.length !== 0 && listMarker.length > 0) {
                    var bounds = new google.maps.LatLngBounds();
                    for (i = 0; i < listMarker.length; i++) {
                        if (listCategoryToBound.includes(listMarker[i].category)) {
                            if (listMarker[i].visible === true)
                                bounds.extend(listMarker[i].position);
                        }
                    }
                    this._map.fitBounds(bounds);
                }
            },

            setInfoPosition: function (lat, lng) {
                var anchor = null;
                if (lng === undefined) {
                    anchor = lat;
                }
                if (!anchor) {
                    this._infoWindow.setPosition(new google.maps.LatLng(lat, lng));
                }
            },

            getListMarkersByCategoryInShape: function (typeCategory, shape, bound = false) { // get list marker  in shape and bound 

                let boundsDraw;
                if (bound) {
                    try {
                        boundsDraw = shape.getBounds();
                    } catch {
                        boundsDraw = new google.maps.LatLngBounds();
                    }
                }

                let thiss = gsn.maps._providers.google;

                if (bound) thiss._map.fitBounds(boundsDraw);
                return listMarkerInShape;
            },

            findMarkerByCoordinates: function (lat, lng) {
                lat = Number(lat);
                lng = Number(lng);
                let res = this._listMarker.filter(e => e.position.lat() === lat && e.position.lng() === lng)[0];
                return res;
            },

            setZIndexForMarker: function (marker) {
                this._lastIndexOfMarker = marker.zIndex;
                marker.zIndex = this._maxZindex;

            },

            filterMarkersByCategory: function (listItemCategory) { 

                this._listMarkerCluster.forEach(e => {
                    if (this._markerListCategory.includes(e.category)) {
                        this.updateMarkerInMarkerCluster(e.category);
                    }
                    else {
                        this.removeMarkerInMarkerCluster(e.category);
                    }
                })


             
            },

            updateMarkerInMarkerCluster: function (category) {
                if (category) {
                    let thiss = gsn.maps._providers.google;
                    let markerCluster = thiss._listMarkerCluster.find(e => e.category === category);
                    if (markerCluster) {
                        let listMarkerDisplay = thiss._listMarker.filter(e => e.category === category);

                        if (listMarkerDisplay && listMarkerDisplay.length > 0) {
                            markerCluster.removeMarkers(markerCluster.markers_, false);
                            markerCluster.clearMarkers();
                            markerCluster.addMarkers(listMarkerDisplay, false);
                        }
                    }

                }
            },

            removeMarkerInMarkerCluster: function (category) {
                if (category) {
                    let thiss = gsn.maps._providers.google; 
                    let markerCluster = thiss._listMarkerCluster.find(e => e.category === category);
                    if (markerCluster && markerCluster.markers_.length > 0) {


                     
                        markerCluster.removeMarkers(markerCluster.markers_, false);
                    }

                }
            },

            checkCategoryInListMaker: function (categoryItem) {
                if (this._markerListCategory.includes(categoryItem)) return true;
                return false;
            },

            changeZindex: function (layerClick) {
                let obj = this._listMarker.filter(e => e.layer === layerClick);
                if (obj.length === 0) {
                    console.log("Lỗi không tìm thấy layer hàm ChangeZindex");
                }
                else {
                    let objMaxCurren = this._listMarker.filter(e => e.zIndex === (this._maxZindexMarker + 1));

                    let zindexlayerclick = obj[0].zIndex;
                    for (let i = 0; i < obj.length; i++) {
                        obj[i].zIndex = this._maxZindexMarker + 1;
                      
                    }
                    for (let i = 0; i < objMaxCurren.length; i++) {
                        objMaxCurren[i].zIndex = zindexlayerclick;
                    }
                }
            },

            showMarker: function (marker) {
                var gMarker = marker._instance;
                if (gMarker === undefined) {
                    if (!this.checkCategoryInListMaker(marker.category)) { 
                        this._markerListCategory.push(marker.category);
                    }
                    var CheckMarkerHasExist = this._listMarker.filter(e => e.category === marker.category && e.id === marker.id)[0]
                    if (CheckMarkerHasExist) { // check marker has in list marker
                        return;
                    }
                    if (this._minZindexMarker > marker.zIndex)
                        this._minZindexMarker = marker.zIndex;

                    if (this._maxZindexMarker < marker.zIndex)
                        this._maxZindexMarker = marker.zIndex;
                    marker._instance = gMarker = new google.maps.Marker({
                        category: marker.category,
                        zIndex: marker.zIndex,
                        uid: marker.uid,
                        id: marker.id,
                        layer: marker.layer,
                        optimized: false,

                    });
                    var self = this;
                    google.maps.event.addListener(gMarker, 'click', function (event) {
                        if (typeof (marker.click) === 'function') {
                            marker.click.call(marker);
                        }
                    });
                    google.maps.event.addListener(gMarker, 'dragend', function (event) {
                        if (typeof (marker.dragend) === 'function') {
                            marker.dragend.call(marker);
                        }
                    });
                }
                if (marker.draggable)
                    gMarker.draggable = true;
                gMarker.setTitle(marker.name);
               
                let srcimg = (marker.icon === "" ? 'content/images/icons/camera-red.png' : marker.icon);
                gMarker.setIcon({
                    url: srcimg,
                    scaledSize: new google.maps.Size(32, 32),
                });
                gMarker.setPosition(new google.maps.LatLng(marker.lat, marker.lng));
                gMarker.setMap(this._map);

                this._listMarker.push(gMarker);

                gMarker.addListener("click", (e) => {

                    if (marker.layer === "alarm") { $("#tabstrip-tab-1").click(); }
                    else if (marker.layer === "device") { $("#tabstrip-tab-3").click(); }
                    else if (marker.layer === "resource") { $("#tabstrip-tab-4").click(); }
                    else if (marker.layer === "cbcs") { $("#tabstrip-tab-5").click(); }
                    else if (marker.layer === "phuongtien") { $("#tabstrip-tab-6").click(); }

                    let scroll = $("#" + marker.layer + "Grid");
                    let row = scroll.data("kendoGrid").tbody.find("tr[id=" + marker.id + "]");
                    row.click();
                    setTimeout(function () {
                        try {
                            let scrollContentOffset = scroll.find("tbody").offset().top;
                            let selectContentOffset = row.offset().top;
                            let distance = selectContentOffset - scrollContentOffset;

                            scroll.find(".k-grid-content").animate({
                                scrollTop: distance - 85
                            }, 1400);
                        }
                        catch {

                        }
                    }, 300)
                });

            },

            addPopupClick: function () {
            },

            addMarkerIntoClusterer: function (category, imagePath, zIndex) { 

                for (let i = 0; i < category.length; i++) {
                    let listMarker = this._listMarker.filter(e => e.category === category[i]);

                    // Options to pass along to the marker clusterer
                    const clusterOptions = {
                        gridSize: 80,
                        maxZoom: 15,
                        zIndex: zIndex[i],
                        styles: [
                            {
                                width: 50,
                                height: 50,
                                url: imagePath[i], 
                                textColor: '#ffffff',
                                textSize: 18,
                                backgroundPosition: "center",
                                zIndex: zIndex[i],
                                category: category[i],
                            },
                        ],
                    };

                   
                    let checkMarkerCluster = this._listMarkerCluster.find(el => category[i] === (el.category));
                    if (checkMarkerCluster) {
                        this.updateMarkerInMarkerCluster(category[i]);
                    }
                    else {
                        // Add a marker clusterer to manage the markers.
                        let markerClusterer = new MarkerClusterer(this._map, listMarker, clusterOptions);
                        markerClusterer.category = category[i];
                        this._listMarkerCluster.push(markerClusterer);

                    }

                }
            },

            hideMarker_google: function (layerName, id) {
                var layer = gsn.maps._layers[layerName];
                if (layer !== undefined) {
                    var marker = layer[id];
                    if (marker !== undefined) {
                        this.hideMarker(marker);
                    }
                }
            },

            hideMarker_layer: function (layerName) {

                var layer = gsn.maps._layers[layerName];
                if (layer !== undefined) {
                    for (var id in layer) {
                        this.hideMarker_google(layerName, id);
                    }
                }
            },

            clearMarkers: function () {

            },
            clearMarkersByCListCategory: function (listCategoty) { 

                listCategoty.forEach(e => {
                    if (this._markerListCategory.includes(e)) {
                        this.removeMarkerInMarkerCluster(e);
                    }
                })

                let listMarkerClear = this._listMarker.filter(e => listCategoty.includes(e.category));
                for (let i = 0; i < listMarkerClear.length; i++) {
                    listMarkerClear[i].setMap(null)
                }
                let listMarkerAlive = this._listMarker.filter(e => !listCategoty.includes(e.category));
                this._listMarker = listMarkerAlive;
            },

            hideMarker: function (marker) {

                var ocom = new CommonFuntion();

                if (ocom.isNullOrEmpty(marker.click))
                    this.hideMarker_layer(marker);

                var gMarker = marker._instance;
                if (gMarker !== undefined) {
                    gMarker.setMap(null);
                }
            },

            getMarkerAnchor: function (marker) {
                return marker._instance;
            },

            showRoute: function (name, wayPoints) {

                this.hideRoute(name);
                var coords = [];
                for (var i = 0; i < wayPoints.length; i++) {
                    coords.push(new google.maps.LatLng(wayPoints[i][0], wayPoints[i][1]));

                }
                var route = new google.maps.Polyline({
                    path: coords,
                    strokeColor: "blue",
                    strokeOpacity: 0.5,
                    strokeWeight: 4
                });

                route.setMap(this._map);
                this._routes[name] = route;
            },

            hideRoute: function (name) {
                var route = this._routes[name];
                if (route) {
                    route.setMap(null);
                    this._routes[name] = null;
                    route = null;
                }
            },

            hideAllRoutes: function () {
                for (var key in this._routes) {
                    this.hideRoute(key);
                }
            },

            setCenter: function (lat, lng, zoom) {
                this._map.setCenter(new google.maps.LatLng(lat, lng));
            },

            checkMapBounds: function (lat, lng) {
                var MapBound = this._map.getBounds();
                if (lat > MapBound.getNorthEast().lat()) return false;
                if (lat < MapBound.getSouthWest().lat()) return false;
                if (lng > MapBound.getNorthEast().lng()) return false;
                if (lng < MapBound.getSouthWest().lng()) return false;
                return true;
            },

            getAddressAutocompleteSearch: function (input, place_changed) { // return obj= {lat:x, lon:x, address:""}

                var autocomplete = new google.maps.places.Autocomplete(input);
                autocomplete.bindTo('bounds', map);
                autocomplete.setTypes([]);

                var that = this;
                google.maps.event.clearListeners(autocomplete, 'place_changed');
                google.maps.event.addListener(autocomplete, 'place_changed', function () {

                    var place = autocomplete.getPlace();
                    if (!place.geometry) {
                        return null;
                    }

                    var address = '';
                    if (place.address_components) {

                        address = [
                            (place.address_components[0] && place.address_components[0].short_name || ''),
                            (place.address_components[1] && place.address_components[1].short_name || ''),
                            (place.address_components[2] && place.address_components[2].short_name || '')
                        ].join(' ');

                    }

                    var obj = { lat: place.geometry.location.lat(), lon: place.geometry.location.lng(), address: address }

                    var ocom = new CommonFuntion();
                    if (ocom.isNullOrEmpty(place_changed) === false)
                        place_changed(obj);

                }); 
            },
            getAddress: function (lat, lng, dvAddress) {

                var ocom = new CommonFuntion();
                if (ocom.isNullOrEmpty(this._addr)) {
                    var point = new google.maps.LatLng(lat, lng);
                    var geocoder = new google.maps.Geocoder();
                    geocoder.geocode({ latLng: point }, function (results, status) {
                        if (status === google.maps.GeocoderStatus.OK) {
                            if (results[0]) {
                                // dvAddress.html(results[0].formatted_address);
                                $(dvAddress.selector).html(results[0].formatted_address)
                            }
                        }
                    });
                }
                else {
                    dvAddress.html(this._addr);
                    this._addr = "";
                }
            } 

        },
        OpenLayer: {
            _map: null,
            _infoWindow: null,
            _markerImages: {},
            _routes: {},
            _Markers: null,
            _MarkerArray: {},
            _MarkerSelected: null,
            _Zoom: 15,
            _C_LAYER_ROUTE: 0,
            _mapId: "map_canvas",

            initialize: function (options) {

                OpenLayers.Popup.FramedCloud.prototype.autoSize = false;
                OpenLayers.ProxyHost = "/proxy/?url=";

                this.AddLayer();

                // marker obj
                this._Markers = new OpenLayers.Layer.Markers("Marker", { 'displayInLayerSwitcher': false });
                this._map.addLayer(this._Markers);

                this._map.setCenter(this.getLonLat(options.longitude, options.latitude), options.zoom);

                this._Zoom = options.zoom;
                return this._map;
            }, 
            getLonLat: function (lon, lat) {
                var ll = new OpenLayers.LonLat(lon, lat)
                    .transform(new OpenLayers.Projection("EPSG:4326"),
                        this._map.getProjectionObject());
                return ll;
            }, 
            defindRoute: function () {

                var vector = new OpenLayers.Layer.Vector("Simple Geometry",
                    { attribution: "GSTC" });

                // style the vectorlayer
                var styleMap = new OpenLayers.StyleMap({
                    'default': new OpenLayers.Style({
                        strokeColor: "#0033ff",
                        strokeWidth: 4,
                        strokeOpacity: 0.5
                    })
                });

                // the vectorlayer
                var vectorlayer = new OpenLayers.Layer.Vector('Vectorlayer', {
                    isBaseLayer: false,
                    displayInLayerSwitcher: false,
                    styleMap: styleMap
                });

                return vectorlayer;
            }, 
            AddLayer: function () {

                this._map = new OpenLayers.Map({
                    div: this._mapId,
                    projection: "EPSG:900913",
                    allOverlays: false,
                    controls:
                        [
                            new OpenLayers.Control.Navigation(),
                            new OpenLayers.Control.LayerSwitcher()
                        ]
                    
                });

                var vectorlayer = this.defindRoute();

                var osm = new OpenLayers.Layer.OSM("OSM");
                var gmap = new OpenLayers.Layer.Google("Bản đồ", { numZoomLevels: this._Zoom, visibility: true });
                var gsat = new OpenLayers.Layer.Google("Vệ tinh", { type: google.maps.MapTypeId.SATELLITE, numZoomLevels: this._Zoom });
                this._map.addLayers([vectorlayer, osm, gmap, gsat]);

                var panel = new OpenLayers.Control.PanZoomBar();
                panel.reDrawHandle = function (div) {
                    div.style.left = "";
                    div.style.right = "4%";
                    div.style.top = "55%";
                }
                this._map.addControl(panel);

            }, 
            registerMarkerTypes: function (images) {
                for (var key in images) {
                    this._markerImages[key] = images[key];
                }
            }, 

            goto: function (lat, lng, bConvert) {

                var lonlat = null;
                if (bConvert)
                    lonlat = new OpenLayers.LonLat(lng, lat);
                else
                    lonlat = this.getLonLat(lng, lat);
                this._map.panTo(lonlat);
            }, 
            showRoute: function (name, wayPoints) {

                if (wayPoints == null || wayPoints.length === 0)
                    return;

                var vectorlayer = this._map.layers[this._C_LAYER_ROUTE];
                if (vectorlayer === undefined)
                    vectorlayer = this.defindRoute();
                else
                    vectorlayer.removeAllFeatures();

                var lineStr = "LINESTRING(";
              
                for (var i = 0; i < wayPoints.length; i++) {
                    var point = new OpenLayers.Geometry.Point(wayPoints[i][1], wayPoints[i][0]); 
                    point = point.transform(new OpenLayers.Projection("EPSG:4326"), this._map.getProjectionObject());
                    lineStr += point.x + " " + point.y + ",";
                }
                if (wayPoints.length > 0) {
                    lineStr = lineStr.substr(0, lineStr.length - 1);
                }
                lineStr += ")";

                var original = OpenLayers.Geometry.fromWKT(lineStr);
                vectorlayer.addFeatures([new OpenLayers.Feature.Vector(original)]);
                var maxExtent = vectorlayer.getDataExtent();
                this._map.layers[this._C_LAYER_ROUTE] = vectorlayer;
                vectorlayer.redraw();
                this._map.maxExtent = maxExtent;

                if (wayPoints.length > 0) {
                    var lonlat = this.getLonLat(wayPoints[0][1], wayPoints[0][0]);
                }

            }, 
            hideAllRoutes: function () {
                this.hideRoute("");
            },
            hideRoute: function (name) {
                var vectorlayer = this._map.layers[this._C_LAYER_ROUTE];
                vectorlayer.removeAllFeatures();
            },
            hideInfo: function (id) {

                var ocom = new CommonFuntion();
                for (var i = 0; i < this._map.popups.length; i++) {

                    if (ocom.isNullOrEmpty(id) === false) {
                        if (this._map.popups[i].id === id) {
                            this._map.popups[i].hide();
                            return;
                        }
                    }
                    else 
                        this._map.popups[i].hide();
                }

            }, 
            setInfoPosition: function (lat, lng) {
            },


            hideMarker: function (marker, bConvert) {

                var lonlat = null;
                if (bConvert) 
                    lonlat = marker.lonlat;
                else
                    lonlat = this.getLonLat(marker.lng, marker.lat); // Class khác gọi vào

                var mk = this.getMarkerAnchor(lonlat.lon, lonlat.lat);
                if (mk == null)
                    return;

                this._Markers.removeMarker(mk);
              
                this._MarkerArray[mk.lonlat.lon + ":" + mk.lonlat.lat] = null; 
                var t = "";
            }, 
            clearMarkers: function () {
                this._Markers.clearMarkers();
                this._MarkerArray = {};
            }, 
          

            hideMarkers: function (typeName) {

                var ocom = new CommonFuntion();

                if (!typeName) {
                    this._Markers.clearMarkers();
                    this._MarkerArray = {};
                }
                if (typeName) {

                    for (var x in this._MarkerArray) {
                        var marker = this._MarkerArray[x];
                        if (ocom.isNullOrEmpty(marker) === false && marker.icon.url === this._markerImages[typeName])
                            this.hideMarker(marker, true);
                    }
                }
            }, 
            showMarkersType: function (typeName) {
                
                var ocom = new CommonFuntion();

                if (typeName != null && typeName.length) { // Array

                    for (var i = 0; i < typeName.length; i++)
                        typeName[i] = this._markerImages[typeName[i]];

                    for (var x in this._MarkerArray) {
                        if (ocom.isNullOrEmpty(x) === false) {
                            var marker = this._MarkerArray[x];
                            // ko có trong ds các kiểu input
                            if (ocom.isNullOrEmpty(marker) === false && typeName.indexOf(marker.icon.url) === -1)
                                this.hideMarker(marker, true);

                        } 
                    } 
                }
                else if (typeName) {

                    for (var x in this._MarkerArray) {
                        var marker = this._MarkerArray[x];
                        if (ocom.isNullOrEmpty(x) === false) {
                            if (ocom.isNullOrEmpty(marker) === false && marker.icon.url !== this._markerImages[typeName])
                                this.hideMarker(marker, true);
                        } 
                    } 
                }
            }, 

         
            showMarker: function (marker) {


                if (marker.hideAll) {
                    this.hideMarkers();
                }

                if (marker.showType) {
                    this.showMarkersType(marker.showType);
                }

                if (marker.showTypes) {
                    this.showMarkersType(marker.showTypes);
                }
                if (marker.deleteEnd) {

                    var ocom = new CommonFuntion();
                    if (this._Markers.markers.length > 0) {
                        var mk = this._Markers.markers[this._Markers.markers.length - 1];
                        if (ocom.isNullOrEmpty(mk) === false)
                            this.hideMarker(mk, true);
                    }
                }

                var lon = marker.lng;
                var lat = marker.lat;

                var lonLat = this.getLonLat(lon, lat);
                var feature = new OpenLayers.Feature(this._Markers, lonLat);
                feature.closeBox = true;
                feature.popupClass = OpenLayers.Popup.FramedCloud;
                feature.data.popupContentHTML = marker.popupContentHTML;
                feature.data.overflow = "auto";

                var marker1 = feature.createMarker();
                marker1.index = marker.index;

                marker1.icon.url = this._markerImages[marker.type];
                marker1.icon.size.w = 30;
                marker1.icon.size.h = 30;

                var map_gstc = this;
                var s_index = marker1.index;

                var markerClick = function (evt) {

                    this.popup = this.createPopup(this.closeBox);
                    map_gstc._map.addPopup(this.popup, true);

                    if (showAddress_journey) // hàm này khai báo trong live và trong Review.
                        showAddress_journey(s_index);
                    else
                        map_gstc.getAddress(lat, lon, marker.divInfoAddress);

                    this.popup.show();
                    OpenLayers.Event.stop(evt);
                };
                marker1.events.register("mousedown", feature, markerClick);

                this._Markers.addMarker(marker1);
                this._MarkerArray[lonLat.lon + ":" + lonLat.lat] = marker1;
                // this.getAddress(lat, lon, marker.divInfoAddress);

            }, 
            getMarkerAnchor: function (lon, lat) {

                if (lon.popupContentHTML) {
                    // class gsn.maps truyền xuống
                    var marker = lon;
                    return marker;
                }

                // truyền đầy đủ thì chỉ có open layer dùng.
                if (this._MarkerArray == null)
                    return null;

                var lonlat = lon + ":" + lat;
                for (var ll in this._MarkerArray) {

                    if (ll === lonlat) {
                        return this._MarkerArray[ll];
                    }
                }

                return null;
            }, 

            moveToMarkerSelected: function () {
                if (this._MarkerSelected == null)
                    return;
                var lonlat = new OpenLayers.LonLat(this._MarkerSelected.lonlat.lon, this._MarkerSelected.lonlat.lat);
                this._map.panTo(lonlat);
            }, 
            showInfo: function (html, lat, lon) {

                if (lat.popupContentHTML) {
                    // class gsn.maps truyền xuống
                    var marker1 = lat;
                    html = marker1.popupContentHTML;
                    lon = marker1.lng;
                    lat = marker1.lat;
                }

                var lonlat = this.getLonLat(lon, lat);
                var feature = new OpenLayers.Feature(this._Markers, lonlat);

                feature.closeBox = true;
                feature.popupClass = OpenLayers.Popup.FramedCloud;
                feature.data.popupContentHTML = html;
                feature.data.overflow = "auto";
                var marker = feature.createMarker();
                var popup = feature.createPopup(feature.closeBox);
                this._map.addPopup(popup, true);
                this._map.setCenter(lonlat, this._Zoom);
                popup.show();
            }, 

            getAddress_google: function (lat, lng, dvAddress) {

                var point = new google.maps.LatLng(lat, lng);
                var geocoder = new google.maps.Geocoder();
                geocoder.geocode({ latLng: point }, function (results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                        if (results[0]) {
                            dvAddress.html(results[0].formatted_address);
                        }
                    } 
                }); 

            }, 

          
            getAddress: function (lat, lon, dvAddress, bOpenLayer) {

                var ocom = new CommonFuntion();
                if (ocom.isNullOrEmpty(bOpenLayer)) {
                    this.getAddress_google(lat, lon, dvAddress);
                    return;
                }

                var url = "http://nominatim.openstreetmap.org/reverse?format=json&lat=" + lat + "&lon=" + lon + "&zoom=27&addressdetails=1";
                open_gstc = this;
                $.ajax(
                    {
                        type: 'post',
                        dataType: 'json',
                        data: {},
                        url: url,
                        success: function (req) { open_gstc._getAddressOK(req, dvAddress); },
                        error: function (req) { open_gstc._getAddressERROR(req, dvAddress) }
                    }); 

            },

            _getAddressOK: function (result, dvAddress) {
              
               

            }, 

            _getAddressERROR: function (result, dvAddressID) {

            }, 
          
            setCenter: function (lat, lng, zoom) {

                this._Zoom = zoom;
                var lonlat = this.getLonLat(lng, lat);
                this._map.panTo(lonlat);
            }, 
          

            getBounds: function () { },
            checkMapBounds: function (lat, lng) { return false; }
        }, 
       
        GmapOpenLayer: {
            _map: null,
            _infoWindow: null,
            _markerImages: {},
            _routes: {},
            _Markers: null,
            _MarkerArray: {},
            _MarkerSelected: null,
            _View: null,
            _Zoom: 12,
            _C_LAYER_ROUTE: 0,
            _mapId: "map_canvas",

            initialize: function (options) {
              
                this._map = new ol.Map({
                    target: this._mapId,
                    controls: ol.control.defaults().extend([
                        new ol.control.ScaleLine({
                            units: "degrees"
                        }),
                        new ol.control.FullScreen()
                    ]),
                    zIndex: 0,
                  

                });
              

                this._View = new ol.View({
                    center: ol.proj.fromLonLat([options.longitude, options.latitude]),
                    zoom: options.zoom
                });

                this._map.setView(this._View);

            
                olms(
                    this._map,
                    'lib/openlayer/gmapstyle/style.json'
                ).then(function (map) {
                  
                    this._map = map;
                });
             

                this._Zoom = options.zoom;

                return this._map;
            }, 
           
            getLonLat: function (lon, lat) {
              
                var ll = ol.proj.fromLonLat([lon, lat]);
                return ll;
            },
          
            defindRoute: function () {

                var vector = new OpenLayers.Layer.Vector("Simple Geometry",
                    { attribution: "GSTC" });

                // style the vectorlayer
                var styleMap = new OpenLayers.StyleMap({
                    'default': new OpenLayers.Style({
                        strokeColor: "#0033ff",
                        strokeWidth: 4,
                        strokeOpacity: 0.5
                    })
                });

                // the vectorlayer
                var vectorlayer = new OpenLayers.Layer.Vector('Vectorlayer', {
                    isBaseLayer: false,
                    displayInLayerSwitcher: false,
                    styleMap: styleMap
                });

                return vectorlayer;
            }, 
           
            AddLayer: function () {

                this._map = new OpenLayers.Map({
                    div: this._mapId,
                    projection: "EPSG:900913",
                    allOverlays: false,
                    controls:
                        [
                            new OpenLayers.Control.Navigation(),
                            new OpenLayers.Control.LayerSwitcher()
                        ]
                    
                });

                var vectorlayer = this.defindRoute();

                var osm = new OpenLayers.Layer.OSM("OSM");
                var gmap = new OpenLayers.Layer.Google("Bản đồ", { numZoomLevels: this._Zoom, visibility: true });
                var gsat = new OpenLayers.Layer.Google("Vệ tinh", { type: google.maps.MapTypeId.SATELLITE, numZoomLevels: this._Zoom });
                this._map.addLayers([vectorlayer, osm, gmap, gsat]);

                var panel = new OpenLayers.Control.PanZoomBar();
                panel.reDrawHandle = function (div) {
                    div.style.left = "";
                    div.style.right = "4%";
                    div.style.top = "55%";
                }
                this._map.addControl(panel);

            },
          
            registerMarkerTypes: function (images) {
                for (var key in images) {
                    this._markerImages[key] = images[key];
                }
            }, 
           

            goto: function (lat, lng, bConvert) {

                var lonlat = null;
                if (bConvert)
                    lonlat = new OpenLayers.LonLat(lng, lat);
                else
                    lonlat = this.getLonLat(lng, lat);
                this._map.panTo(lonlat);
            },
         

            showRoute: function (name, wayPoints) {

                if (wayPoints == null || wayPoints.length === 0)
                    return;

                var vectorlayer = this._map.layers[this._C_LAYER_ROUTE];
                if (vectorlayer === undefined)
                    vectorlayer = this.defindRoute();
                else
                    vectorlayer.removeAllFeatures();

                var lineStr = "LINESTRING(";
               
                for (var i = 0; i < wayPoints.length; i++) {
                    var point = new OpenLayers.Geometry.Point(wayPoints[i][1], wayPoints[i][0]); 
                    point = point.transform(new OpenLayers.Projection("EPSG:4326"), this._map.getProjectionObject());
                    lineStr += point.x + " " + point.y + ",";
                }
                if (wayPoints.length > 0) {
                    lineStr = lineStr.substr(0, lineStr.length - 1);
                }
                lineStr += ")";

                var original = OpenLayers.Geometry.fromWKT(lineStr);
                vectorlayer.addFeatures([new OpenLayers.Feature.Vector(original)]);
                var maxExtent = vectorlayer.getDataExtent();
                this._map.layers[this._C_LAYER_ROUTE] = vectorlayer;
                vectorlayer.redraw();
                this._map.maxExtent = maxExtent;

                if (wayPoints.length > 0) {
                    var lonlat = this.getLonLat(wayPoints[0][1], wayPoints[0][0]);
                }

            }, 
           
            hideAllRoutes: function () {
                this.hideRoute("");
            },
            hideRoute: function (name) {
                var vectorlayer = this._map.layers[this._C_LAYER_ROUTE];
                vectorlayer.removeAllFeatures();
            },
            hideInfo: function (id) {

                var ocom = new CommonFuntion();
                for (var i = 0; i < this._map.popups.length; i++) {

                    if (ocom.isNullOrEmpty(id) === false) {
                        if (this._map.popups[i].id === id) {
                            this._map.popups[i].hide();
                            return;
                        }
                    }
                    else // hide All
                        this._map.popups[i].hide();
                } 

            }, 
           

            setInfoPosition: function (lat, lng) {
            },


            hideMarker: function (marker, bConvert) {

                var lonlat = null;
                if (bConvert) 
                    lonlat = marker.lonlat;
                else
                    lonlat = this.getLonLat(marker.lng, marker.lat); // Class khác gọi vào

                var mk = this.getMarkerAnchor(lonlat.lon, lonlat.lat);
                if (mk == null)
                    return;

                this._Markers.removeMarker(mk);
              
                this._MarkerArray[mk.lonlat.lon + ":" + mk.lonlat.lat] = null; 
                var t = "";
            }, 
           
            clearMarkers: function () {
                this._Markers.clearMarkers();
                this._MarkerArray = {};
            }, 
          

            hideMarkers: function (typeName) {

                var ocom = new CommonFuntion();

                if (!typeName) {
                    this._Markers.clearMarkers();
                    this._MarkerArray = {};
                }
                if (typeName) {

                    for (var x in this._MarkerArray) {
                        var marker = this._MarkerArray[x];
                        if (ocom.isNullOrEmpty(marker) === false && marker.icon.url === this._markerImages[typeName])
                            this.hideMarker(marker, true);
                    }
                }
            },
           
            showMarkersType: function (typeName) {

                var ocom = new CommonFuntion();

                if (typeName != null && typeName.length) { // Array

                    for (var i = 0; i < typeName.length; i++)
                        typeName[i] = this._markerImages[typeName[i]];

                    for (var x in this._MarkerArray) {
                        if (ocom.isNullOrEmpty(x) === false) {
                            var marker = this._MarkerArray[x];
                            // ko có trong ds các kiểu input
                            if (ocom.isNullOrEmpty(marker) === false && typeName.indexOf(marker.icon.url) === -1)
                                this.hideMarker(marker, true);

                        } // if x
                    } // for 
                }
                else if (typeName) {// 1 pt

                    for (var x in this._MarkerArray) {
                        var marker = this._MarkerArray[x];
                        if (ocom.isNullOrEmpty(x) === false) {
                            if (ocom.isNullOrEmpty(marker) === false && marker.icon.url !== this._markerImages[typeName])
                                this.hideMarker(marker, true);
                        } // if x
                    } // for 
                }
            },

           
            showMarker: function (marker) {

                let lon = marker.lng;
                let lat = marker.lat;
               

                const iconFeature = new ol.Feature({
                    geometry: new ol.geom.Point(ol.proj.fromLonLat([lon, lat])),
                    type: 'click',
                  
                    index: marker.index,
                    uid: marker.uid,
                    layer: marker.layer,
                })
                let srcimg = (marker.icon === "" ? 'content/images/icons/camera-red.png' : marker.icon);
                const iconStyle = new ol.style.Style({
                    image: new ol.style.Icon({
                        anchor: [0.5, 0.5],
                        size: [32, 32],
                      
                        opacity: 1,
                        scale: 1,
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'pixels',
                        src: srcimg,
                    })
                });

                iconFeature.setStyle(iconStyle);

                var vectorSource = new ol.source.Vector({});

                vectorSource.addFeature(iconFeature);

                var iconLayer = new ol.layer.Vector({
                    source: vectorSource
                });

                iconLayer.setZIndex(500000);
                // this._map.fit(vectorSource.getGeometry())
                this._map.addLayer(iconLayer);

            }, 
            addPopupClick: function () {

             
                popup.setOffset([0, 0]);
                this._map.addOverlay(popup);

                this._map.on('click', function (evt) {
                    var f = map.forEachFeatureAtPixel(
                        evt.pixel,
                        function (ft, layer) { return ft; }
                    );
                    if (f && f.get('type') === 'click') {
                        var geometry = f.getGeometry();
                        var coord = geometry.getCoordinates();

                     

                        let layer = f.get('layer');
                        let uid = f.get('uid');

                        if (layer === "alarm") { $("#tabstrip-tab-1").click(); }
                        else if (layer === "device") { $("#tabstrip-tab-2").click(); }
                        else if (layer === "resource") { $("#tabstrip-tab-3").click(); }

                        let scroll = $("#" + layer + "Grid");
                        let row = scroll.data("kendoGrid").tbody.find("tr[data-uid='" + uid + "']");
                        row.click();
                      
                        setTimeout(function () {
                            try {
                                let scrollContentOffset = scroll.find("tbody").offset().top;
                                let selectContentOffset = row.offset().top;
                                let distance = selectContentOffset - scrollContentOffset;

                                scroll.find(".k-grid-content").animate({
                                    scrollTop: distance - 85
                                }, 1400);
                            }
                            catch {

                            }
                        }, 300)


                    } else { popup.hide(); }

                });

                map.on('pointermove', function (event) {
                    if (map.hasFeatureAtPixel(event.pixel)) {
                        map.getViewport().style.cursor = 'pointer';
                    } else {
                        map.getViewport().style.cursor = 'inherit';
                    }
                });
            },
           
            getMarkerAnchor: function (lon, lat) {

                if (lon.popupContentHTML) {
                    // class gsn.maps truyền xuống
                    var marker = lon;
                    return marker;
                }

                // truyền đầy đủ thì chỉ có open layer dùng.
                if (this._MarkerArray == null)
                    return null;

                var lonlat = lon + ":" + lat;
                for (var ll in this._MarkerArray) {

                    if (ll === lonlat) {
                        return this._MarkerArray[ll];
                    }
                }

                return null;
            }, 
         

            moveToMarkerSelected: function () {
                if (this._MarkerSelected == null)
                    return;
                var lonlat = new OpenLayers.LonLat(this._MarkerSelected.lonlat.lon, this._MarkerSelected.lonlat.lat);
                this._map.panTo(lonlat);
            }, 
          

            showInfo: function (html, lat, lon) {

                if (lat.popupContentHTML) {
                    // class gsn.maps truyền xuống
                    var marker1 = lat;
                    html = marker1.popupContentHTML;
                    lon = marker1.lng;
                    lat = marker1.lat;
                }

                var lonlat = this.getLonLat(lon, lat);
                var feature = new OpenLayers.Feature(this._Markers, lonlat);

                feature.closeBox = true;
                feature.popupClass = OpenLayers.Popup.FramedCloud;
                feature.data.popupContentHTML = html;
                feature.data.overflow = "auto";
                var marker = feature.createMarker();
                var popup = feature.createPopup(feature.closeBox);
                this._map.addPopup(popup, true);
                this._map.setCenter(lonlat, this._Zoom);
                popup.show();
            }, 
           

            getAddress_google: function (lat, lng, dvAddress) {

                var point = new google.maps.LatLng(lat, lng);
                var geocoder = new google.maps.Geocoder();
                geocoder.geocode({ latLng: point }, function (results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                        if (results[0]) {
                            dvAddress.html(results[0].formatted_address);
                        }
                    } 
                }); 

            }, 

          
            getAddress: function (lat, lon, dvAddress, bOpenLayer) {

                var ocom = new CommonFuntion();
                if (ocom.isNullOrEmpty(bOpenLayer)) {
                    this.getAddress_google(lat, lon, dvAddress);
                    return;
                }

                var url = "http://nominatim.openstreetmap.org/reverse?format=json&lat=" + lat + "&lon=" + lon + "&zoom=27&addressdetails=1";
                open_gstc = this;
                $.ajax(
                    {
                        type: 'post',
                        dataType: 'json',
                        data: {},
                        url: url,
                        success: function (req) { open_gstc._getAddressOK(req, dvAddress); },
                        error: function (req) { open_gstc._getAddressERROR(req, dvAddress) }
                    });

            },

            _getAddressOK: function (result, dvAddress) {
              

            }, 

            _getAddressERROR: function (result, dvAddressID) {

            },
          
            setCenter: function (lat, lng, zoom) {
               

                this._Zoom = zoom;
                this.panTo(lat, lng, zoom);
            }, 
          
            panTo: function (lat, lng, zoom) {
                const view = this._View;

                function flyTo(location, done, zoom) {
                    const duration = 1500;
                    let parts = 2;
                    let called = false;
                    function callback(complete) {
                        --parts;
                        if (called) {
                            return;
                        }
                        if (parts === 0 || !complete) {
                            called = true;
                            done(complete);
                        }
                    }
                    view.animate(
                        {
                            center: location,
                            duration: duration,
                        },
                        callback
                    );
                    view.animate(
                        {
                            zoom: zoom - 2,
                            duration: duration / 2,
                        },
                        {
                            zoom: zoom,
                            duration: duration / 2,
                        },
                        callback
                    );
                }

                var location = ol.proj.fromLonLat([lng, lat]);
                flyTo(location, function () { }, 15);

            }, 
            getBounds: function () { },
            checkMapBounds: function (lat, lng) { return false; }
        }, 
        other: {
            initialize: function () {
                return {};
            },
            registerMarkerTypes: function (images) {
            },
            goto: function (lat, lng) {
            },
            showInfo: function (content, lat, lng) {
            },
            hideInfo: function () {
            },
            setInfoPosition: function (lat, lng) {
            },
            showMarker: function (marker) {
            },
            getMarkerAnchor: function (marker) {
            },
            setCenter: function (lat, lng, zoom) { },
            getBounds: function () { },
            checkMapBounds: function (lat, lng) { }
        }
    };
})(jQuery);

