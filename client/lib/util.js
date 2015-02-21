// More work on dynamic lengend needs to be done

psm = L.layerGroup();

plot_psm = function (max) {
    var data = MP14_SUBZONE_WEB_PL;
    L.geoJson(data, {
        onEachFeature: function(feature, layer) {

            
            // standarlize data
            var s_d = feature.properties.total_female / max * 30
            var center = layer.getBounds().getCenter();
            var mk = L.circleMarker(center, {
                radius: s_d,
                color: '#FE2E2E',
                fillOpacity: 0.3
            });

            psm.addLayer(mk);

            map.on('zoomend', function() {
                var currentZoom = map.getZoom();
                console.log(currentZoom);
                if (currentZoom > 12) {
                    mk.setRadius(s_d * Math.pow(1.2, currentZoom - 12));
                } else {
                    mk.setRadius(s_d * Math.pow(0.5, 12 - currentZoom));
                }
            });
        }
    });
}

calculatePinP = function(points, polygon) {
    var max = 0;
    for (var i = 0; i < points.features.length; i++) {
        var point = points.features[i].geometry.coordinates;
        var results = leafletPip.pointInLayer(point, polygon);
        if (results.length > 0) {
            var target_polygon = results[0];
            // console.log(target_polygon.feature.properties);
            if (target_polygon.feature.properties.count_value == undefined) {
                target_polygon.feature.properties.count_value = 1;
            } else {
                target_polygon.feature.properties.count_value += 1;
                var v = target_polygon.feature.properties.count_value
                if (v > max) {
                    max = v
                };
            }
        };
    };
    return max;
};


loadLayerControl = function() {
    //console.log(counter);
    if (counter == 5) {
        var baseMaps = {
            "Standard Map": standardLayer,
            "Transport Map": transportLayer
        };

        var overlayMaps = {
            // "District": choropeth,
            // "Transaction Volume": proportionalLayer,
            "MRT": mrt
                // "Education": markers
        };

        L.control.layers(baseMaps, overlayMaps, {
            collapsed: false,
            position: "topleft"
        }).addTo(map);
    }
};


remove_node = function (layers) {
    layers.eachLayer(function(layer) {
        if (layer.feature.type === "node") {
            layers.removeLayer(layer);
        };
    });
}
