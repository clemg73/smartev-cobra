<template>
  <StationViewerPage/>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />

</template>

<script>
import StationViewerPage from './components/StationsViewerPage.vue'


export default {
  name: 'App',
  components: {
    StationViewerPage
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

body {
    font-family: 'Roboto', sans-serif;
}
</style>
