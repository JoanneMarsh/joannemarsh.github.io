// define access token
mapboxgl.accessToken = 'pk.eyJ1Ijoiam9hbm5lbWFyc2giLCJhIjoiY2t6eTJoODRzMDdocTJubzZiMDZmb3BkOSJ9.4Chhhd6-q_YIYA9CILbUlA';

//create map
const map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/joannemarsh/cl089mru9008114ror2jcs9z2'
});

map.on('load', () => {
  
  const layers = [
  '<10',
  '20',
  '30',
  '40',
  '50',
  '60',
  '70',
  '80',
  '90',
  '100'
];
const colors = [
 "#67001f",
 "#b2182b",
 "#d6604d",
 "#f4a582",
 "#fddbc7",
 "#d1e5f0",
 "#92c5de",
 "#4393c3",
 "#2166ac",
 "#053061"
];
  
  // create legend
const legend = document.getElementById('legend');

layers.forEach((layer, i) => {
  const color = colors[i];
  const key = document.createElement('div');
  if(i <= 1 || i >= 8) {
    key.style.color = "white";
  }
  key.className = 'legend-key';
  key.style.backgroundColor = color;
  key.innerHTML = `${layer}`;
  legend.appendChild(key);
});
  
  map.addSource('hover', {
    type:'geojson',
    data:{type:'FeatureCollection', features: []}
  });
  
  map.addLayer({
    id: 'dz-hover',
    type: 'line',
    source: 'hover',
    layout: {},
    paint:{
      'line-color':'black',
      'line-width':4
    }
  });
  
  
  map.on('mousemove', (event) => {
  const dzone = map.queryRenderedFeatures(event.point, {
    layers: ['glasgowsimd']
  });
  document.getElementById('pd').innerHTML = dzone.length
    ? `<h3>${dzone[0].properties.DZName}</h3><p>Rank: <strong>${dzone[0].properties.Percentv2}</strong> %</p>`
    : `<p>Hover over a data zone!</p>`;
    map.getSource('hover').setData({
      type:'FeatureCollection',
      features: dzone.map(function(f){
                          return {type:'feature', geometry: f.geometry};
                          })
    });
});
  
  map.addControl(new mapboxgl.NavigationControl(), "top-left")
  map.addControl(
    new mapboxgl.GeolocateControl({
      positionOptions:{
        enableHighAccuracy: true
      },
      trackUserLocation:true,
      showUserHeading:true
    }), "top-left");
  
  const geocoder = new MapboxGeocoder({
    //initialise the geocoder
    accessToken: mapboxgl.accessToken, //set the access token
    mapboxgl:mapboxgl, //set the mapbox gl instance
    marker: false, //do not use the default marker style
    placeholder: "Search for places in Glasgow", //placeholder text for the search bar
    proximity: { longitude: 55.8642, latitude: 4.2518} //coordinates of Glasgow centre
  });
  
  
});