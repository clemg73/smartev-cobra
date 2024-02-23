<template>
  <div id="map-tesla"></div>
</template>

<script>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const API_KEY = "7d563b7b-c646-4bfc-bd61-e260939a27bf";

//function to get all charging stations of Tesla 
async function getStations(){
  let stations = [];

  try{
    const response = await fetch("https://api.openchargemap.io/v3/poi?maxresults=1000&countrycode=FR&key="+API_KEY, {
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

let markerSVG = "../assets/marker.svg" 

export default {
  name: "map-tesla",
  async mounted() {
    L.Icon.Default.imagePath = '../assets/';
    L.Icon.Default.prototype.options.iconUrl = markerSVG;
    
    // Créer une carte Leaflet et l'ajouter à l'élément avec l'id 'map'
    this.map = L.map('map-tesla').setView([45.780835, 4.8720641], 6);

    // Ajouter une couche de tuiles (par exemple OpenStreetMap) à la carte
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    const stations = await getStations();

    stations.forEach(station => {
      let lat = station.AddressInfo.Latitude;
      let lng = station.AddressInfo.Longitude;

      // Ajouter un marqueur à la carte
      let marker = L.marker([lat, lng]).addTo(this.map)
      marker.addEventListener("click", ()=>{
        // Récupère les infos d'un marqueur cliqué
        let stationInfo = stations.filter((station) => marker._latlng.lat == station.AddressInfo.Latitude && marker._latlng.lng == station.AddressInfo.Longitude)[0]
        this.$emit("stationInfo", stationInfo)
        console.log(stationInfo);
      })
    });
    
  }
}
</script>

<style>
#map-tesla {
  height: 100vh;
  width: 100vw;
}
</style>
