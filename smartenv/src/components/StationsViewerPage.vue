<template>

    <div style="display: flex;">
        <Itinerary @itinerary="itineraryFunc"></Itinerary>
        <MapTesla @stationInfo="stationInfoChange"></MapTesla>
        <StationInformations :buttonData="buttonData" />
        <p>coucou{{ itineraryData }}</p>
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
                buttonData: null,
                itineraryData: null
            };
        },
        methods: {
            stationInfoChange(data) {
                this.buttonData = data;
            },
            itineraryFunc(data){
                this.itineraryData = data;
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
    margin: 0!important;
    padding: 0!important;
    width: 100vw!important;
}
    </style>