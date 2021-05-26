window.onload = ()=>{
        document.getElementById("map").style.height = document.documentElement.scrollHeight-document.getElementById("menu").scrollHeight+"px"
        document.getElementById("map").style.width = document.documentElement.scrollWidth+"px"
        let mymap = L.map('map').setView([51.505, -0.09], 13);
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
                maxZoom: 18,
                id: 'mapbox/streets-v11',
                tileSize: 512,
                zoomOffset: -1,
                accessToken: 'pk.eyJ1IjoiYXJ0ZWdvc2VyIiwiYSI6ImNrcDVhaHF2ejA2OTcyd3MxOG84bWRhOXgifQ.N3knNrPFIceTHVcIoPPcEQ'
        }).addTo(mymap);
        var popup = L.popup();

        function onMapClick(e) {
                popup
                        .setLatLng(e.latlng)
                        .setContent("Ты кликнул по этим координатам " + e.latlng.toString())
                        .openOn(mymap);
        }

        mymap.on('click', onMapClick);
        
        let marker = L.marker([55.751285, 37.61877]).addTo(mymap);
        marker.bindPopup("<b>MOVC!</b><br>В разработке.").openPopup();
}