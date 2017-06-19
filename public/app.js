window.onload = function() {
  let coords = {
    // latitude: 37.8610858,
    // longitude: -122.2695871
    latitude: -31.563910,
    longitude: 147.154312
  };

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(p => initMap(p.coords));
  }

  initMap(coords);
  initAuth();
};

function initAuth() {
  var config = {
    callbacks: {
      signInSuccess: function(user, cred, redir) {
        console.log(user, cred, redir);
      }
    },
    signInOptions: [
      // Leave the lines as is for the providers you want to offer your users.
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.PhoneAuthProvider.PROVIDER_ID
    ],
    // Terms of service url.
    tosUrl: "http://google.com"
  };

  // Initialize the FirebaseUI Widget using Firebase.
  var ui = new firebaseui.auth.AuthUI(firebase.auth());
  // The start method will wait until the DOM is loaded.
  if (!isLoggedIn()) {
    ui.start("#firebaseui-auth-container", config);
  }

  firebase.auth().onAuthStateChanged(updateUserStatus);
}

function updateUserStatus(user) {
  if (user != null) {
    document.getElementById("firebaseui-auth-container").innerHTML =
      "Signed in as" + (user.displayName || user.phoneNumber);
  }
}
function isLoggedIn() {
  return firebase.auth().currentUser != null;
}

function createGathering() {
  // Insert into gatherings
  
  // Then make sure to insert into geofire!
  
}

function searchByUser(user) {
  //db.ref('gatherings').orderByChild('user').equalTo(user).once('value').then(d => console.table(d.val()))
  // But use orderBy and equalTO
}

function searchByLocation() {
  // Need to use geofire
}

function initMap(coords) {
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 10,
    center: { lat: coords.latitude, lng: coords.longitude }
  });

  var markers = locations.map(function(location, i) {
    var infowindow = new google.maps.InfoWindow({
      content: "test"
    });
    var marker = new google.maps.Marker({
      position: location,
      title: "test",
      map: map
    });
    marker.addListener("click", function() {
      infowindow.open(map, marker);
    });

    return marker;
  });

  // Add a marker clusterer to manage the markers.
  var markerCluster = new MarkerClusterer(map, markers, {
    imagePath: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m"
  });
}
var locations = [
  { lat: -33.718234, lng: 150.363181 },
  { lat: -33.727111, lng: 150.371124 },
  { lat: -33.848588, lng: 151.209834 },
  { lat: -33.851702, lng: 151.216968 },
  { lat: -34.671264, lng: 150.863657 },
  { lat: -35.304724, lng: 148.662905 },
  { lat: -36.817685, lng: 175.699196 },
  { lat: -36.828611, lng: 175.790222 },
  { lat: -37.750000, lng: 145.116667 },
  { lat: -37.759859, lng: 145.128708 },
  { lat: -37.765015, lng: 145.133858 },
  { lat: -37.770104, lng: 145.143299 },
  { lat: -37.773700, lng: 145.145187 },
  { lat: -37.774785, lng: 145.137978 },
  { lat: -37.819616, lng: 144.968119 },
  { lat: -38.330766, lng: 144.695692 },
  { lat: -39.927193, lng: 175.053218 },
  { lat: -41.330162, lng: 174.865694 },
  { lat: -42.734358, lng: 147.439506 },
  { lat: -42.734358, lng: 147.501315 },
  { lat: -42.735258, lng: 147.438000 },
  { lat: -43.999792, lng: 170.463352 }
];
