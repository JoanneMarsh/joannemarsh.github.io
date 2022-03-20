//initiate map
mapboxgl.accessToken = 'pk.eyJ1Ijoiam9hbm5lbWFyc2giLCJhIjoiY2t6eTJoODRzMDdocTJubzZiMDZmb3BkOSJ9.4Chhhd6-q_YIYA9CILbUlA';
    
    //set bounds to the Lake District
    const bounds = [
      [-4.2, 53.99], //southwest coordinates
      [-2, 55.1] //northeast coordinates
    ];    
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/joannemarsh/cl0sb837i000d15nqt8dy6oze',
      center: [-3.206818, 54.552276], //starting position
      zoom: 9, //starting zoom
      maxBounds: bounds 
    });

//link to dataset
const data_url =
"https://api.mapbox.com/datasets/v1/joannemarsh/cl0n0dnbb039228o7wnsueq2o/features?access_token=pk.eyJ1Ijoiam9hbm5lbWFyc2giLCJhIjoiY2t6eTJoODRzMDdocTJubzZiMDZmb3BkOSJ9.4Chhhd6-q_YIYA9CILbUlA"

map.on('load', () => { 
map.addLayer({
    "id": "wainwrightsPoints",
    type: 'symbol',
    source: { type: 'geojson', data: data_url  },
    "layout": {
        "icon-image": "goal-mountain-svgrepo-com",
        "icon-size":['interpolate', ['linear'], ['zoom'], 9, 0.05, 12, 0.1, 14, 0.3],
        "icon-allow-overlap":true
    },
    "paint": {}
});
}); 

    //Navigation Controller
    map.addControl(new mapboxgl.NavigationControl());

//create label popup
var labelpopup = new mapboxgl.Popup({
    closeButton: false, className: "label-popup"
});

//on hover change cursor icon
map.on ("mousemove", 'wainwrightsPoints', function(e) {
    map.getCanvas().style.cursor = 'pointer';
    //show name label
          var feature = e.features[0];
        labelpopup.setLngLat(feature.geometry.coordinates)
            .setText(feature.properties.Name)
            .addTo(map);
});

//remove hover actions when mouse is moved away
map.on('mouseleave', 'wainwrightsPoints', function() {
        map.getCanvas().style.cursor = '';
        labelpopup.remove();
    });

//populate popup with point info
map.on("click", (event) => {
  const features = map.queryRenderedFeatures(event.point, {
    layers: ["wainwrightsPoints"]
  });
  if (!features.length) {
    return;
  }
  const feature = features[0];

  //Popup information
  const popup = new mapboxgl.Popup({ offset: [1, -15], className: "my-popup" })
    .setLngLat(feature.geometry.coordinates)
    .setHTML(
      `<h3>${feature.properties.Name}</h3><p> ${feature.properties.Metres} metres <span style = "font: 400 11px 'Ubuntu Mono';">(${feature.properties.Feet} feet)</span><p>Summit at ${feature.properties.Feature}</p><p><span style = "font: 400 11px 'Ubuntu Mono';">Part of the ${feature.properties.Area} collection </span></p>`
    )
    .addTo(map);
});

  //dropdown filtering
function myFilterFunction(levelFilter, lvlname) {
  if(levelFilter == 'any') {
    map.setFilter('wainwrightsPoints', null);
  }
  else{map.setFilter('wainwrightsPoints', ['==', 'HeightRank', levelFilter]);
       }
 document.getElementById('lvlselected').innerHTML = lvlname;
};