Meteor.startup(function() {
    map = L.map('map').setView([1.3569, 103.7779], 12);

    L.Icon.Default.imagePath = "/images"

    // two bases
    standardLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    transportLayer = L.tileLayer('http://{s}.tile.opencyclemap.org/transport/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    });


    // calculate
    var max = 0
    for (var i = 0; i < MP14_SUBZONE_WEB_PL.features.length; i++) {
        var subzone_name = MP14_SUBZONE_WEB_PL.features[i].properties.SUBZONE_N;
        for (var j = 0; j < FEMALES.length; j++) {
            if (FEMALES[j].subzone.toLowerCase() == subzone_name.toLowerCase()) {
                MP14_SUBZONE_WEB_PL.features[i].properties.total_female = FEMALES[j].total;

                if (FEMALES[j].total > max) {
                    max = FEMALES[j].total;
                };

                MP14_SUBZONE_WEB_PL.features[i].properties.female_40_44 = FEMALES[j]["40_44"];
                MP14_SUBZONE_WEB_PL.features[i].properties.female_45_49 = FEMALES[j]["45_49"];
                MP14_SUBZONE_WEB_PL.features[i].properties.female_50_54 = FEMALES[j]["50_54"];
                MP14_SUBZONE_WEB_PL.features[i].properties.female_55_59 = FEMALES[j]["55_59"];
                MP14_SUBZONE_WEB_PL.features[i].properties.female_60_65 = FEMALES[j]["60_65"];
                MP14_SUBZONE_WEB_PL.features[i].properties.female_65_over = FEMALES[j]["65_over"];
                if (FEMALES[j].total != 0) {
                    
                    var sum = FEMALES[j]["40_44"] + FEMALES[j]["45_49"] + FEMALES[j]["50_54"] + FEMALES[j]["55_59"] + FEMALES[j]["60_65"] + FEMALES[j]["65_over"]
                    MP14_SUBZONE_WEB_PL.features[i].properties.density = sum / FEMALES[j].total;
                    // console.log(MP14_SUBZONE_WEB_PL.features[i].properties.density)

                } else {
                    MP14_SUBZONE_WEB_PL.features[i].properties.density = 0;
                }

            }
        };
    };

    // load zones
    subzones = L.geoJson(MP14_SUBZONE_WEB_PL, {
        style: style
    });
    zones = L.geoJson(MP14_REGION_WEB_PL);

    // load breast screen center
    centers = L.geoJson(BREASTSCREEN, {
        onEachFeature: function(feature, layer) {
            layer.bindPopup(feature.properties.NAME)
        }
    });

    plot_psm(max);


    // final step
    // layer control there, so has to load there
    // layer control there is because of ajax issue
    load_mrt();

    function getColor(d) {
        return d > 0.70 ? '#800026' :
            d > 0.65 ? '#BD0026' :
            d > 0.60 ? '#E31A1C' :
            d > 0.55 ? '#FC4E2A' :
            d > 0.50 ? '#FD8D3C' :
            d > 0.45 ? '#FEB24C' :
            d > 0.40 ? '#FED976' :
            '#FFEDA0';
    };

    function style(feature) {
        return {
            fillColor: getColor(feature["properties"]["density"]),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
    };
    // var max = calculatePinP(BREASTSCREEN, subzones);
    // marker_center(MP14_SUBZONE_WEB_PL, map, max);
});