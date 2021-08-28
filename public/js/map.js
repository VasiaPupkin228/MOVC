window.onload = async ()=>{
        document.getElementById("map").style.height = document.documentElement.scrollHeight-document.getElementById("menu").scrollHeight+"px";
        document.getElementById("map").style.width = document.documentElement.scrollWidth+"px";
        window.addEventListener(`resize`, event => {
                document.getElementById("map").style.height = document.documentElement.scrollHeight-document.getElementById("menu").scrollHeight+"px";
                document.getElementById("map").style.width = document.documentElement.scrollWidth+"px";
        }, false);
        let movc = L.map('map').setView([53.19, 41.28], 6);
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
                maxZoom: 11,
                id: 'artegoser/ckql6k3xd2yqw17n2awmke9d5',
                tileSize: 512,
                zoomOffset: -1,
                accessToken: 'pk.eyJ1IjoiYXJ0ZWdvc2VyIiwiYSI6ImNrcDVhaHF2ejA2OTcyd3MxOG84bWRhOXgifQ.N3knNrPFIceTHVcIoPPcEQ'
        }).addTo(movc);
        var popup = L.popup();
        
        console.log("Получаю карту");
        let geo = await fetch("https://raw.githubusercontent.com/artegoser/MOVC/main/geo/geo.geojson");
        console.log("Получаю Страны MOVC");
        let coarray = await fetch("/api/countries");
        coarray = await coarray.json();
        let countries = {};
        for(let i = 0; i<coarray.length; i++) countries[coarray[i].idc] = coarray[i]; 
        geo = (await geo.json()).features;
        document.getElementById("map").classList.add("ghost");
        for(let i = 0; i<geo.length; i++){
                function onEachFeature(feature, layer) { 
                        if(feature.geometry.type==="Polygon")
                                layer.bindPopup(`
                                <div class="row" style="padding: 5px;">
                                        <div class="col-md-12 col-sm-12" style="padding: 0px;">
                                                <img class="w-100" src="${country.img}" style="border-radius: 20px 20px 0px 0px;">
                                        </div>
                                        <div class="col-md-12 col-sm-12 text-center" style="border-radius: 0px 0px 20px 20px; background-color: rgb(231, 231, 231)">
                                                <h5 class="card-title">
                                                        ${country.name}
                                                        <a href="/erth2#marks">
                                                ${ country.verified === true ?
                                                `<svg id="completely" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"></path>
                                                        <title>Соответствует стандартам ERTH2</title>
                                                </svg>`: ""}
                                                </a>
                                                </h5>
                                                <a href="countries/${country.idc}" class="btn btn-primary bordert mb-2" style="color:white;">Подробнее</a>
                                        </div>
                                </div>`);
                        else if(feature.geometry.type==="Point"){
                                if(feature.properties.type==="city"||feature.properties.type==="capital-city"){
                                        layer.bindPopup(`
                                                <h5 class="text-center">
                                                        ${feature.properties.name}
                                                </h5>
                                                Население:${feature?.properties?.amount ? feature.properties.amount : "Не указано"}
                                        `)
                                }
                        }
                }
                function cpoint(feature, latlng){
                        if(feature.properties.type==="city"){
                                let myIcon = L.icon({
                                        iconSize:     [12, 12],
                                        iconUrl: 'https://artegoser.github.io/movc/icons/city.png',
                                });
                                return L.marker(latlng, { icon: myIcon }).bindTooltip(feature.properties.name, 
                                {
                                        permanent: false, 
                                        direction: 'top'
                                });
                        } else if(feature.properties.type==="capital-city"){
                                let myIcon = L.icon({
                                        iconSize:     [16, 16],
                                        iconUrl: 'https://artegoser.github.io/movc/icons/capital.png',
                                });
                                return L.marker(latlng, { icon: myIcon }).bindTooltip(feature.properties.name, 
                                {
                                    permanent: false, 
                                    direction: 'top'
                                });
                        }
                        return L.marker(latlng)
                }
                document.getElementById("preloader").innerHTML = "Получаю: "+(geo[i].properties.name||geo[i].properties.Name);
                console.log("Получаю: "+(geo[i].properties.name||geo[i].properties.Name));
                let country;
                if(geo[i].geometry.type==="Polygon"){
                        country = countries[geo[i].properties.name]
                        if((!geo[i].properties.name)||!country){
                                console.error("Ошибка в получении: "+(geo[i].properties.name||geo[i].properties.Name));
                                continue;
                        }
                }
                L.geoJSON(geo[i],{
                        onEachFeature: onEachFeature,
                        pointToLayer: cpoint,
                        style:{
                                fillColor: geo[i].properties.fill,
                                color: geo[i].properties.stroke,
                                weight: 5,
                                opacity: 0.65
                        }
                }).addTo(movc);
        }
        document.getElementById("preloader").style.display = 'none';
        document.getElementById("map").classList.remove("ghost")
}