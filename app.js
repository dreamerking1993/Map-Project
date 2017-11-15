var map, largeInfowindow, defaultIcon, bounds, highlightedIcon;
var textbox = document.getElementById("textbox");
var tempscript = null,
    minchars, maxchars, attempts;
let searchedForText;
var markers = [];
var locations = [{
        title: 'Pashupatinath Temple',
        location: {
            lat: 27.7105,
            lng: 85.3487
        }
    },
    {
        title: 'Bhaktapur Durbar Square',
        location: {
            lat: 27.6721,
            lng: 85.4283
        }
    },
    {
        title: 'Patan Durbar Square',
        location: {
            lat: 27.6727,
            lng: 85.3253
        }
    },
    {
        title: 'Kathmandu Durbar Square',
        location: {
            lat: 27.7043,
            lng: 85.3074
        }
    },
    {
        title: 'Sundarijal',
        location: {
            lat: 27.7909,
            lng: 85.4272
        }
    },
    {
        title: 'Budhanilkantha Temple',
        location: {
            lat: 27.7654,
            lng: 85.3653
        }
    },
    {
        title: 'Swayambhunath',
        location: {
            lat: 27.7148,
            lng: 85.2903
        }
    },
    {
        title: 'Boudhanat',
        location: {
            lat: 27.7214,
            lng: 85.3619
        }
    },
    {
        title: 'Changu Narayan',
        location: {
            lat: 27.7162,
            lng: 85.4278
        }
    }
];

var styles = [{
    featureType: 'water',
    stylers: [{
        color: '#19a0d8'
    }]
}, {
    featureType: 'administrative',
    elementType: 'labels.text.stroke',
    stylers: [{
            color: '#ffffff'
        },
        {
            weight: 6
        }
    ]
}, {
    featureType: 'administrative',
    elementType: 'labels.text.fill',
    stylers: [{
        color: '#e85113'
    }]
}, {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{
            color: '#efe9e4'
        },
        {
            lightness: -40
        }
    ]
}, {
    featureType: 'transit.station',
    stylers: [{
            weight: 9
        },
        {
            hue: '#e85113'
        }
    ]
}, {
    featureType: 'road.highway',
    elementType: 'labels.icon',
    stylers: [{
        visibility: 'off'
    }]
}, {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{
        lightness: 100
    }]
}, {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{
        lightness: -100
    }]
}, {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{
            visibility: 'on'
        },
        {
            color: '#f0e4d3'
        }
    ]
}, {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [{
            color: '#efe9e4'
        },
        {
            lightness: -25
        }
    ]
}];
/* Respnsive, the menu bar dosen't appear on smaller screens*/
if ($(window).width() > 1150) {
    $('.container .options-box').removeClass('hideMenu');
} else {
    $('.container .options-box').addClass('hideMenu');
}

//initMap is the callback function of the asyncrhronous request made on HTML file
function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 27.723875,
            lng: 85.357847
        },
        zoom: 13,
        styles: styles,
        //mapTypeControl: false            
    });


    largeInfowindow = new google.maps.InfoWindow();
    defaultIcon = makeMarkerIcon('0091ff');
    highlightedIcon = makeMarkerIcon('FF0000');

    bounds = new google.maps.LatLngBounds();

    placeMarker(ViewModel.locationList());

    // Extend the boundaries of the map for each marker and display the marker
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);


}
//puts marker on the assigned locations, and makes an array of the markers
function placeMarker(place) {
    markers = [];
    for (var i = 0; i < place.length; i++) {
        var position = place[i].location;
        var title = place[i].title;
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            icon: defaultIcon,
            id: i
        });
        // Push the marker to our array of markers.
        markers.push(marker);
        bounds.extend(markers[i].position);

        MarkerProp.markerMouseOver(marker);

        MarkerProp.markerMouseOut(marker);

        MarkerProp.markerClick(marker);

    }
}
//when marker in the map is clicked
var MarkerProp = {
    markerMouseOver: function(marker) {
        marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon); //highlights marker when the cursor touches the marker
        });

    },

    markerMouseOut: function(marker) {
        marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon); //marker color bck to default when the cursor leaves
        });

    },


    markerClick: function(marker) {
        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
            searchedForText = this.title;
            startFetch(100, 200); //startFetch() function is with which the data is extracted from wikipedia

        });
    }
};

//creates marker with the specified color, this function is called either by defaultIcon or by highlightedIcon functions
function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21, 34));
    return markerImage;
}
//the following function is responsible for the infowindow that opens atop a marker
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        infowindow.setContent('<div>' + marker.title + '</div>');
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });
    }
}
//the following is the ViewModel in this knockoutjs framework
var ViewModel = {
    self: this,
    query: ko.observable(''),
    locationList: ko.observableArray([]),
    //for the hiding of menu
    hideSideBar: function() {
        $('.container .options-box').slideToggle('slow');
    },
    //highlights marker when the cursor touches the list item in the menu
    highlightMarker: function(place) {
        var index = locations.indexOf(place);
        markers[index].setIcon(highlightedIcon);
    },
    //marker color back to default
    defaultMarker: function(place) {
        var index = locations.indexOf(place);
        markers[index].setIcon(defaultIcon);
    },
    //creates the observable array of locations
    ram: function() {
        for (var j = 0; j < locations.length; j++) {
            this.locationList.push(locations[j]);
        }
    },
    //when a marker or the list item is clicked, this function is called
    popInfo: function(place) {
        var index = locations.indexOf(place);
        populateInfoWindow(markers[index], largeInfowindow);
        searchedForText = place.title;
        startFetch(100, 200);
    },
    //responsive for the filtering action
    search: function(value) {
        ViewModel.locationList.removeAll();
        for (var k = 0; k < locations.length; k++) {
            if (locations[k].title.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                ViewModel.locationList.push(locations[k]);
                markers[k].setVisible(true);
                largeInfowindow.close();
            } else {
                markers[k].setVisible(false);
            }
        }

    }

};

/* #########fetching data from wikipedia */

function startFetch(minimumCharacters, maximumCharacters, isRetry) {
    try {
        if (tempscript) {
            return;
        } // a fetch is already in progress
    } catch (e) {
        alert('There was an error with the call. Please refresh the page and try again to load Wikipedia data.');
    }
    if (!isRetry) {
        attempts = 0;
        minchars = minimumCharacters; // save params in case retry needed
        maxchars = maximumCharacters;
    }
    tempscript = document.createElement("script");
    tempscript.type = "text/javascript";
    tempscript.id = "tempscript";
    tempscript.src = "http://en.wikipedia.org/w/api.php" +
        "?action=query&prop=extracts&exintro=&explaintext=&titles=" + searchedForText + " " +
        "&exchars=" + maxchars + "&format=json&callback=onFetchComplete&requestid=" +
        Math.floor(Math.random() * 999999).toString();
    document.body.appendChild(tempscript);
    // onFetchComplete invoked when finished
    //https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=Kathmandu
}

function onFetchComplete(data) {
    document.body.removeChild(tempscript);
    tempscript = null;
    var s = getFirstProp(data.query.pages).extract;
    //if the location name clicked is not on wikipedia then..
    if (s === undefined) {
        //debugger
        textbox.value = 'search item not found';
    } else { //if the location name is found on wikipedia..
        s = htmlDecode(stripTags(s));
        if (s.length > minchars || attempts++ > 5) {
            textbox.value = s;

        } else {
            startFetch(0, 0, true); // retry
        }
    }
}

function getFirstProp(obj) {
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            return obj[i];
        }
    }  
}

function stripTags(s) {
    return s.replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+>/gi, "");
}

function htmlDecode(input) {
    var e = document.createElement("div");
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

/*############################################## */


ViewModel.ram();
ViewModel.query.subscribe(ViewModel.search);

ko.applyBindings(ViewModel);