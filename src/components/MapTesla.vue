<template>
  <l-map ref="map" id="map" :zoom="zoom" :center="center">
    <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
    <l-marker v-for="(marker, index) in markers" @click="$emit('stationInfo', marker)" :key="index" :lat-lng="[marker.AddressInfo.Latitude, marker.AddressInfo.Longitude]" >
    </l-marker>
  </l-map>
</template>

<script>
import {LMap, LTileLayer, LMarker} from 'vue3-leaflet';

const API_KEY = "7d563b7b-c646-4bfc-bd61-e260939a27bf";
const zoom = 15;

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

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker  
  },
  data () {
    return {
      url: 'https:{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution:
        '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      zoom: zoom,
      center: [51.505, -0.159],
      markerPos: [51.505, -0.159],
      markers: [],
    };
  },
  async mounted(){
    await this.callGetStations();
  },
  methods: {
    async callGetStations(){
      try{
        const stations = getStations()
        this.markers = stations
      }
      catch(err){
        console.error("Problème pour récupérer les données : " + err)
      }
    },

    checkBounds(bounds){
      console.log(bounds);
    }
  }
}

</script>

<style scoped>
#map {
  height: 100vh!important;
  width: 100vw!important;
}
</style>