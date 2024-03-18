<template>

<div style="display: flex;">
    <Itinerary></Itinerary>
    <MapTesla @stationInfo="stationInfoChange"></MapTesla>
    <StationInformations :buttonData="buttonData" />
</div>
</template>

<script>
import StationInformations from './StationInformations.vue'
import Itinerary from './Itinerary.vue'
import MapTesla from './MapTesla.vue';

export default {
    name: "station-viewer",
    components: {
        StationInformations,
        Itinerary,
        MapTesla
    },
    data() {
        return {
            buttonData: null
        };
    },
    methods: {
        stationInfoChange(data) {
            console.log(data);
            this.buttonData = data;
        }
    }
}
</script>

<style>

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin: 0!important;
    padding: 0!important;
    width: 100vw!important;
}
</style>
