<template>
<div style="display: flex;flex-direction: column;align-items: start;">
    <h1 v-if="item.AddressInfo" style="width: 20vw;text-align: start; margin: 0;">{{ item.AddressInfo.Title }}</h1>
    <p v-if="item.AddressInfo" style="width: 20vw;text-align: start;font-weight: 500;color: lightgrey;">{{ item.AddressInfo.AddressLine1 + ", "+item.AddressInfo.Town + ", "+item.AddressInfo.Postcode }}</p>
</div>
</template>

<script>


export default {
    name: "station-informations",
    props: {
        buttonData: Object
    },
    data() {
        return {
            item: {},
        };
    },
    watch: {
        buttonData: function (nouvelleValeur, ancienneValeur) {
            console.log(ancienneValeur, 'à', nouvelleValeur, "  ::  ", Object.values(this.buttonData));
            this.loadJsonData(this.buttonData)
        }
    },
    methods: {
        loadJsonData(buttonData) {
            this.item = buttonData
        }
    }
}
</script>

<style>
* {
    margin: 0;
    padding: 0;
}
</style>
