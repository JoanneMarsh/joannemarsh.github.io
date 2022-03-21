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
  const levelsfells = map.queryRenderedFeatures( {
Layers: 'wainwrightsPoints'
});
  newfelltable(levelsfells);
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
   document.getElementById('lvlselected').innerHTML = lvlname;
  if(levelFilter == 'any') {
    map.setFilter('wainwrightsPoints', null);
    const levelsfells = map.queryRenderedFeatures( {
Layers: 'wainwrightsPoints'
});
    newfelltable(levelsfells);
  }
  else{map.setFilter('wainwrightsPoints', ['==', 'HeightRank', levelFilter]);
       const levelsfells = map.queryRenderedFeatures( {
Layers: 'wainwrightsPoints',
         Filter: ['==', 'HeightRank', levelFilter]
});
           newfelltable(levelsfells);
       };
};

 
//build table -- NEEDS WORK - DOESNT FILTER AS INTENDED - have to double click??
function newfelltable(levelsfells){
  var theTable = document.getElementById('fellsTableBody')
  theTable.innerHTML = '';
  for (let i = 0; i < levelsfells.length; i++) {
    if (levelsfells[i].properties.Name == undefined) {
      ;
    } else {
    var newRow = theTable.insertRow(theTable.length);
     var fellname = newRow.insertCell(0);
    var fellheight = newRow.insertCell(1);
    fellname.innerHTML = levelsfells[i].properties.Name;
      fellheight.innerHTML = parseInt(levelsfells[i].properties.Metres);
      const labelpopup = new mapboxgl.Popup({
closeButton: false, className: "label-popup"
});
      newRow.addEventListener('mouseover', () => {
// Highlight corresponding feature on the map
labelpopup
.setLngLat(levelsfells[i].geometry.coordinates)
.setText(levelsfells[i].properties.Name)
.addTo(map);
});
      newRow.addEventListener('mouseleave', () => {
// Highlight corresponding feature on the map
labelpopup.remove();
});
    };
} ;  
  sortTable(theTable);
  
  
  
};


function sortTable(table) {
  var rows, switching, i, x, y, shouldSwitch;
  switching = true;
  /*loop to continue until no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /*Loop through all table rows*/
    for (i = 0; i < (rows.length - 1); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("TD")[1];
      y = rows[i + 1].getElementsByTagName("TD")[1];
      //check if the two rows should switch place:
      if (Number(x.innerHTML) > Number(y.innerHTML)) {
        //if so, mark as a switch and break the loop:
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}

/* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
function openNav() {
  document.getElementById("mySidebar").style.width = "250px";
  document.getElementById("main").style.marginLeft = "250px";
  document.getElementById("levels").style.marginLeft = "250px";
}

/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
function closeNav() {
  document.getElementById("mySidebar").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
  document.getElementById("levels").style.marginLeft = "0";
}