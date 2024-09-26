const socket = io(); //connecting socket user with the server

//finding that the browser is allowing the geolocation 
if (navigator.geolocation) {
    //live location of the user
    navigator.geolocation.watchPosition((position) => {
        //taking the latitude and longitude and then send it to the server
        const { latitude, longitude } = position.coords;
        socket.emit("send-location", { latitude, longitude });
    }, (error) => {
        // if any error find then give error 
        console.error("Geolocation error:", error);
    }, {
        // setting for the loaction
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000
    });
}
// leaflet used for the display of map
const map = L.map("map").setView([0, 0], 16);  // Initialize map view
//link for the map image display according to the loaction
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    // sania will show at bottom of the map as an attribute 
    attribution: "Sania"
}).addTo(map);//now the map image added to mapview which will show on the browser

map.invalidateSize();  // Ensure the map resizes correctly

const markers = {}; //empty object for the marker to show the location


//recieve data from the server
socket.on("recieve-location", (data) => {
    //id is the special of the user and its specific
    const { id, latitude, longitude } = data;
    //setview map view according to the location of the user
    map.setView([latitude, longitude]);
    //set the markers if the user already have then add it to the map or else create a new one (markers)
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});

// for handling the disconnection of the user
socket.on("user-disconnect", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});
