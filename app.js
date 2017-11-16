var map, largeInfowindow, defaultIcon, bounds, highlightedIcon;
let searchedForText;
var markers = [];
var locations = [{
        title: 'Pashupati',
        location: {
            lat: 27.7105,
            lng: 85.3487
        }
    },
    {
        title: 'Bhaktapur, Nepal',
        location: {
            lat: 27.6721,
            lng: 85.4283
        }
    },
    {
        title: 'Patan',
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
        title: 'Budhanilkantha Mandir',
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
        title: 'Boudhanath Stupa',
        location: {
            lat: 27.7214,
            lng: 85.3619
        }
    },
    {
        title: 'Changu Narayan Temple',
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

    //when marker in the map is clicked
    markerClick: function(marker) {
        marker.addListener('click', function() {
            this.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                marker.setAnimation(null);
            }, 3000);
            populateInfoWindow(this, largeInfowindow);
            searchedForText = this.title;
            ViewModel.startFetch(marker); //startFetch() function is with which the data is extracted from wikipedia

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
        //infowindow.setContent('div'+ marker.title +'div');
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });
    }
}
//the following is the ViewModel in this knockoutjs framework
var ViewModel = {
    textt: ko.observable(),
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

        markers[index].setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            markers[index].setAnimation(null);
        }, 3000);


        populateInfoWindow(markers[index], largeInfowindow);
        searchedForText = place.title;
        ViewModel.startFetch(markers[index]);
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

    },

    /* #########fetching image from unsplash*/

    startFetch: function(marker) {
        fetch(`https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`, {
                headers: {
                    Authorization: 'Client-ID 2bf09a9320982ae6511f0558183ae40b0a498c1512ee2c28a7ee02e476eb3419'
                }
            }).then(response => response.json())
            .then(addImage)
            .catch(e => requestError(e, 'image'));

        //function call for fetch
        function addImage(data) {
            let htmlContent = '';
            const firstImage = data.results[0];

            if (firstImage) {
                htmlContent = `<figure>
                            <img src="${firstImage.urls.small}" alt="${searchedForText}">
                            <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
                        </figure>`;
            } else {
                htmlContent = 'Unfortunately, no image was returned for your search.';
            }

            largeInfowindow.setContent('<div>' + htmlContent + '</div>');

        }

        //catch function for image from unsplash
        function requestError(e, part) {
            console.log(e);
            largeInfowindow.setContent(`<p class="network-warning">Oh no! There was an error making a request.</p>`);
        }
    }

};

//if the map cannot be loaded
function noMap() {
    alert("the request to googleapis.com was unsuccessful, try again");
}


ViewModel.ram();
ViewModel.query.subscribe(ViewModel.search);

ko.applyBindings(ViewModel);