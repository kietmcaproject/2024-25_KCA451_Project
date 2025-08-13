// let mapToken = process.env.MAP_TOKEN;
    mapboxgl.accessToken = mapToken;
    // console.log(mapToken);
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: "mapbox://styles/mapbox/streets-v12",
        // style: ""/css/style.css"
        center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom
    });

    // Create a default Marker and add it to the map.
    const marker = new mapboxgl.Marker({color: "red"})
        .setLngLat(listing.geometry.coordinates) //Listing.geometry.coordinates
        .setPopup(new mapboxgl.Popup({offset: 25}).setHTML(
            `<h4>${listing.title}</h4><p>The Exact Location will be nearby here.</p>`
        ))
    .addTo(map);