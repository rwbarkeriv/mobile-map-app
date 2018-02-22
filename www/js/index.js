var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        this.receivedEvent('deviceready');
        initMap();
    },

    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);


        console.log('Received Event: ' + id);
    }
};

var map, marker, infoWindow;

function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 65.0121, lng: 25.4651},
        zoom: 6
    });

    var geocoder = new google.maps.Geocoder();

    document.getElementById('submit').addEventListener('click', function () {
        geocodeAddress(geocoder, map);
    });

    document.getElementById('calculate-distance').addEventListener('click', function () {
        calculateDistance(geocoder, map);
    });

    // document.getElementById('reverse-geocode').addEventListener('click', function () {
    //     geocodeLatLng(geocoder, map);
    // });


    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            map.setCenter(pos);

            if (marker && marker instanceof google.maps.Marker) {
                marker.setMap(null);
                marker = null;
            }

            marker = new google.maps.Marker({
                map: map,
                position: pos
            });

            var infowindow = new google.maps.InfoWindow({
                content: '<p>Coordinates:' + marker.getPosition() + '</p>'
            });

            google.maps.event.addListener(marker, 'click', function () {
                infowindow.open(map, marker);
            });

        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function geocodeAddress(geocoder, resultsMap) {
    var address = document.getElementById('address').value;

    geocoder.geocode({'address': address}, function (results, status) {
        if (status === 'OK') {
            resultsMap.setCenter(results[0].geometry.location);
            if (marker && marker instanceof google.maps.Marker) {
                marker.setMap(null);
                marker = null;
            }
            marker = new google.maps.Marker({
                map: resultsMap,
                position: results[0].geometry.location,
            });

            var infowindow = new google.maps.InfoWindow({
                content: '<p>Coordinates:' + marker.getPosition() + '</p>'
            });

            google.maps.event.addListener(marker, 'click', function () {
                infowindow.open(resultsMap, marker);
            });
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });

}

function calculateDistance(geocoder, resultsMap) {

    function findPointA(geocoder, resultsMap, callback) {
        var pointA = document.getElementById('point-a').value;
        geocoder.geocode({'address': pointA}, function (results, status) {
            if (status == 'OK') {
                resultsMap.setCenter(results[0].geometry.location);
                if (marker && marker instanceof google.maps.Marker) {
                    marker.setMap(null);
                    marker = null;
                }
                marker = new google.maps.Marker({
                    map: resultsMap,
                    position: results[0].geometry.location,
                });

                var infowindow = new google.maps.InfoWindow({
                    content: '<p>Coordinates:' + marker.getPosition() + '</p>'
                });

                google.maps.event.addListener(marker, 'click', function () {
                    infowindow.open(resultsMap, marker);
                });
                callback(results[0].geometry.location.lat(), results[0].geometry.location.lng())


            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }

    function findPointB(geocoder, resultsMap, callback) {
        var pointB = document.getElementById('point-b').value;
        geocoder.geocode({'address': pointB}, function (results, status) {
            if (status == 'OK') {
                resultsMap.setCenter(results[0].geometry.location);
                var marker = new google.maps.Marker({
                    map: resultsMap,
                    position: results[0].geometry.location
                });

                var infowindow = new google.maps.InfoWindow({
                    content: '<p>Coordinates:' + marker.getPosition() + '</p>'
                });

                google.maps.event.addListener(marker, 'click', function () {
                    infowindow.open(resultsMap, marker);
                });
                callback(results[0].geometry.location.lat(), results[0].geometry.location.lng())

            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }

    findPointA(geocoder, resultsMap, function (latPointA, lngPointA) {
        findPointB(geocoder, resultsMap, function (latPointB, lngPointB) {
            var pointA = new google.maps.LatLng(latPointA, lngPointA);
            var pointB = new google.maps.LatLng(latPointB, lngPointB);
            document.getElementById('distance-output').innerHTML = "<p>" + (google.maps.geometry.spherical.computeDistanceBetween(pointA, pointB) / 1000).toFixed(2) + " kilometers</p>";
        });
    })
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);


}

app.initialize();
