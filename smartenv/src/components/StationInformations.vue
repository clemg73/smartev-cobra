<template>
<div class="stationPart">
    <h1 v-if="buttonData" style="width: 20vw;text-align: start; margin: 0;color: white;">{{ buttonData.AddressInfo.Title }}</h1>
    <p v-if="buttonData" style="width: 20vw;text-align: start;font-weight: 500;color: lightgrey;">{{ buttonData.AddressInfo.AddressLine1 + ", "+buttonData.AddressInfo.Town + ", "+buttonData.AddressInfo.Postcode }}</p>

    <div v-if="buttonData" style="margin-top: 30px;">
        <div v-for="connection in buttonData.Connections" :key="connection.ID" class="connection">
            <div class="connectionImage"></div>
            <div style="" class="connectionContent">
                <p style="font-size: 13px;">{{ connection.ConnectionType.Title }}</p>
                <div v-if="connection.StatusType"><p>{{ connection.StatusType.Title }}</p></div>
                <p style="font-size: 10px;">{{ connection.PowerKW }}kW / {{ connection.CurrentType.Description }}</p>
            </div>
            <div class="connectionQuantity">
                <p>{{ connection.Quantity }}</p>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    name: "station-informations",
    props: {
        buttonData: Object
    },
}
</script>

<style>
* {
    margin: 0;
    padding: 0;
}
.stationPart{
    display: flex;
    flex-direction: column;
    align-items: start;
    width: 30vw;
    padding: 2vw;
    background-color: rgb(40, 40, 40);
}
.connection{
    display: flex; 
    margin-top: 20px; 
    background-color: rgb(23, 23, 23);
    width: 20vw;
    padding: 10px;
    border-radius: 5px;
    align-items: center;
    cursor: pointer;
    position: relative;
}
.connection:hover
{
    background-color: rgb(17, 17, 17);
}
.connectionImage{
    width: 50px;
    height: 50px;
    background-color: rgb(180, 128, 236); 
    border-radius: 3px;
    margin-right: 20px;
}
.connectionContent{
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}
.connectionContent p{
    color: white;
}
.connectionContent div{
    background-color: rgb(95, 158, 0);
    padding: 5px;
    border-radius: 5px;
    margin: 5px 0;
    width: 70px;
    display: flex;
    justify-content: center;
}
.connectionContent div p{
    font-size: 8px;
}
.connectionQuantity{
    position: absolute;
    top: -5px;
    right: -5px;
    height: 25px;
    width: 25px;
    border-radius: 15px;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
}
.connectionQuantity p
{
    font-weight: 700;
    font-size: 13px;
}
</style>
