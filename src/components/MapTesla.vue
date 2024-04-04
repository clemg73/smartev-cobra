<template>
    <div id="map" ref="mapContainer"></div>
</template>
  
<script>
    import { ref, onMounted } from 'vue';
    import L from 'leaflet';

    import 'leaflet/dist/leaflet.css';
    import 'leaflet.markercluster/dist/MarkerCluster.css';
    import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
    import 'leaflet.markercluster/dist/leaflet.markercluster.js';
    
    const API_KEY = "7d563b7b-c646-4bfc-bd61-e260939a27bf";

    export default {
        name: 'MapTesla',
        setup(props, context) {
            const mapContainer = ref(null);
            const center = ref([46.821445, 2.454638])
            const zoom = ref(6)
            let markers = []

            const url = 'https:{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
            const attribution = '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors'

            //function to get all charging stations of Tesla 
            async function getStations(){
                let stations = [];

                try{
                    const response = await fetch("https://api.openchargemap.io/v3/poi?maxresults=20000&countrycode=FR&key="+API_KEY, {
                    method: "GET"
                    });

                    if(!response.ok){
                    throw new Error('Erreur lors de la récupération des données des stations.');
                    }

                    stations = await response.json();
                    return stations;
                }
                catch(error){
                    console.error('Erreur lors de la récupération des données des stations:', error);
                    return [];
                }

            }

            async function callGetStations(){
                try{
                    let stations = await getStations()  
                    markers = stations
                    console.log(stations);
                }
                catch(err){
                    console.error("Problème pour récupérer les données : " + err)
                }     
            }

            onMounted(async () => {
                await callGetStations();
                let map = L.map(mapContainer.value).setView(center.value, zoom.value);
                
                console.log(map);

                L.tileLayer(url, {
                    attribution: attribution,
                    maxZoom: 18,
                }).addTo(map);
        
                const markersGroup = L.markerClusterGroup({
                    spiderfyOnMaxZoom: true,
                    showCoverageOnHover: false,
                    zoomToBoundsOnClick: true,
                    chunkedLoading: true
                });

                markers.forEach(markerObject => {
                    let Latitude = markerObject.AddressInfo.Latitude;
                    let Longitude = markerObject.AddressInfo.Longitude;
                    
                    const marker = L.marker(L.latLng(Latitude, Longitude));
                    marker.bindPopup("Lat : " + Latitude +", Long : " + Longitude);
                    markersGroup.addLayer(marker);

                    marker.addEventListener('click', (event)=>{
                        console.log("Lat : " + event.latlng.lat + ", Long : " + event.latlng.lng);
                        context.emit("stationInfo", markerObject)
                    })
                });
        
                map.addLayer(markersGroup);


                // var latlngs = [
                //     [[45.51, -122.68],
                //     [37.77, -122.43],
                //     [34.04, -118.2]],
                //     [[40.78, -73.91],
                //     [41.83, -87.62],
                //     [32.76, -96.72]]
                // ];

                // var polyline = L.polyline(latlngs, {color: 'red'}).addTo(map);

                // // zoom the map to the polyline
                // map.fitBounds(polyline.getBounds());
                
            });
        
            return {
                mapContainer,
            };
        }
    };
</script>

<style scoped>
#map {
  height: 100vh!important;
  width: 50vw!important;
}
</style>