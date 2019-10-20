window.onload = () => {
    let method = 'dynamic';

    // if you want to statically add places, de-comment following line
    // method = 'static';

    if (method === 'static') {
        // setTimeout is a temporary fix
        setTimeout(() => {
            let places = staticLoadPlaces();
            renderPlaces(places);
        }, 3000);
    }

    if (method !== 'static') {

        // first get current user location
        return navigator.geolocation.getCurrentPosition(function (position) {

            // than use it to load from remote APIs some places nearby
            dynamicLoadPlaces(position.coords)
                .then((places) => {
                    renderPlaces(places);
                })
        },
            (err) => console.error('Error in retrieving position', err),
            {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 27000,
            }
        );
    }
};

function staticLoadPlaces() {
    return [
        { 
            name: "Nha Kasa",
            location: {
                lat: 14.922875, // add here latitude if using static data
                lng: -23.510755, // add here longitude if using static data
            }
        },
        {
            name: 'Vizinho 1',
            location: {
                lat: 14.922804,
                lng: -23.510796,
            }
        },
        { 
            name: 'Vizinho 2',
            location: {
                lat: 14.923011,
                lng: -23.510667,
            }
        },
        { 
            name: 'Vizinho 3',
            location: {
                lat: 14.922835,
                lng: -23.510819,
            }
        },
        { 
            name: 'Vizinho 4',
            location: {
                lat: 14.922938,
                lng: -23.510774,
            }
        },
        {
            name: 'Data Center Nosi',
            location: {
                lat: 14.926235,
                lng: -23.495920,
            }
        }
    ];
}

// getting places from REST APIs
function dynamicLoadPlaces(position) {
    let params = {
        radius: 300,    // search places not farther than this value (in meters)
        clientId: 'WR5QIK3GZIRXQWFULAKJ5SLO0BYGJNDAYW2RC035XTQV5V01',
        clientSecret: '',
        version: '20300101',    // foursquare versioning, required but unuseful for this demo
    };

    // CORS Proxy to avoid CORS problems
    let corsProxy = 'https://cors-anywhere.herokuapp.com/';

    // Foursquare API
    let endpoint = `${corsProxy}https://api.foursquare.com/v2/venues/search?intent=checkin
        &ll=${position.latitude},${position.longitude}
        &radius=${params.radius}
        &client_id=${params.clientId}
        &client_secret=${params.clientSecret}
        &limit=15
        &v=${params.version}`;
    return fetch(endpoint)
        .then((res) => {
            return res.json()
                .then((resp) => {
                    return resp.response.venues;
                })
        })
        .catch((err) => {
            console.error('Error with places API', err);
        })
};

function renderPlaces(places) {
    let scene = document.querySelector('a-scene');

    places.forEach((place) => {
        let latitude = place.location.lat;
        let longitude = place.location.lng;

        // add place name
        let text = document.createElement('a-link');
        text.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
        text.setAttribute('title', place.name);
        text.setAttribute('href', 'http://www.example.com/');
        text.setAttribute('scale', '20 20 20');

        text.addEventListener('loaded', () => {
            window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
        });

        scene.appendChild(text);
    });
}
