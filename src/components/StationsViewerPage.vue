<template>

<div style="display: flex;">
    <Itinerary></Itinerary>
    <MapTesla @stationInfo="stationInfoChange"/>
    <StationInformations :buttonData="buttonData" />
</div>
</template>

<script>
import MapTesla from './MapTesla.vue'
import StationInformations from './StationInformations.vue'
import Itinerary from './Itinerary.vue'

export default {
    name: "station-viewer",
    components: {
        MapTesla,
        StationInformations,
        Itinerary
    },
    data() {
        return {
            buttonData: null
        };
    },
    methods: {
        stationInfoChange(data) {
            this.buttonData = data;
        }
    }
}
</script>

<style scoped>

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}
</style>
