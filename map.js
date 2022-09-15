function initMap() {
  
    // The location of Geeksforgeeks office
    const gfg_office = {
        lat: 28.50231,
        lng: 77.40548
    };

    // Create the map, centered at gfg_office
    const map = new google.maps.Map(
            document.getElementById("map"), {

        // Set the zoom of the map
        zoom: 17.56,
        center: gfg_office,
    });
}