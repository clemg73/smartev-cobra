<template>
<div id="side">
    <h4>Modèle</h4>
    <select name="pets" id="pet-select">
        <option value="">--Please choose an option--</option>
        <option value="model3">Model 3 Grande Autonomie</option>
        <option value="zoe">Renault Zoé</option>
    </select>
    <br>
    <br>
    <h4>Départ</h4>
    <div class="start input">
        <input v-model="addressStart.place_name" type="text" placeholder="Entrez votre adresse de départ">
        <ul>
            <li v-for="address in addressStartAutoCompletion" :key="address" @click="addressStart=address; addressStartNoLoop=true; addressStartAutoCompletion=[]" class="place">{{ address.place_name }}</li>
        </ul>
    </div>
    <br>
    <h4>Arrivée</h4>
    <div class="end input">
        <input v-model="addressEnd.place_name" type="text" placeholder="Entrez votre adresse de fin">
        <ul>
            <li v-for="address in addressEndAutoCompletion" :key="address" @click="addressEnd=address; addressEndNoLoop=true; addressEndAutoCompletion=[]" class="place">{{ address.place_name }}</li>
        </ul>
    </div>
    <button @click="itineraryFirst()">Search</button>
    <button @click="computePointWithKmClick(200)">Calc max</button>
    <p>{{ itinerary }}</p>
    <p>{{ max }}</p>

</div>
</template>

<script>
import * as geolib from 'geolib';
import {
    computePointWithKm
} from '@/utils/steps'; // Assurez-vous de spécifier le bon chemin

const access_token = "pk.eyJ1IjoiY2xlbWciLCJhIjoiY2xndHcxamU2MXdwZDNjbXRnM2RtM25rZyJ9.ajTLZlHD4s8h30zdqJ1tEg"

async function autocomplete(address) {
    let places = [];

    try {
        const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${access_token}`, {
            method: "GET"
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des adresses.');
        }

        places = await response.json();
        return places;
    } catch (error) {
        console.error('Erreur lors de la récupération des adresses:', error);
        return [];
    }

}

export default {

    name: "itinerary-side",
    data() {
        return {
            addressStart: {},
            addressStartAutoCompletion: '',
            addressStartNoLoop: false,
            addressEnd: {},
            addressEndAutoCompletion: '',
            addressEndNoLoop: false,
            itinerary: "",
            max: {}
        };
    },
    mounted() {
        this.$watch('addressStart.place_name', async (newValue) => {
            if (this.addressStartNoLoop) {
                this.addressStartNoLoop = false
            } else {
                let places = await autocomplete(newValue);
                this.addressStartAutoCompletion = []
                places.features.forEach(element => {
                    this.addressStartAutoCompletion.push(element)
                });
            }
        });
        this.$watch('addressEnd.place_name', async (newValue) => {
            if (this.addressEndNoLoop) {
                this.addressEndNoLoop = false
            } else {
                let places = await autocomplete(newValue);
                this.addressEndAutoCompletion = []
                places.features.forEach(element => {
                    this.addressEndAutoCompletion.push(element)
                });
            }
        });
    },
    methods: {
        async computePointWithKmClick(km) {
            let points = [{"latitude":this.addressStart.center[1],"longitude":this.addressStart.center[0]}]

            let min = 0
            let temp_nextPoint = null
            let distanceFinal = null
            let i = 0
            while (distanceFinal/1000 > km || distanceFinal == null){
                const startPoint = `${points[i]["longitude"]},${points[i]["latitude"]}`;
                const endPoint = `${this.addressEnd.center[0]},${this.addressEnd.center[1]}`;
                let iti = await this.computeItinerary(startPoint, endPoint)
                console.log(iti)
                this.max = computePointWithKm(iti.routes[0].geometry.coordinates, km)
                console.log(this.max)
                let nearPoints = await this.getNearPoints(this.max["latitude"], this.max["longitude"])
                console.log(nearPoints)
    
                min = km * 1000
                temp_nextPoint = null
                for (const element of nearPoints) {
                    console.log(points[i]["latitude"]);
                    let test = await this.computeItinerary(`${points[i]["longitude"]},${points[i]["latitude"]}`, `${element.AddressInfo.Longitude},${element.AddressInfo.Latitude}`);
                    console.log(min);
                    console.log(test.routes[0].distance);
                    if (test.routes[0].distance < min) {
                        min = test.routes[0].distance;
                        temp_nextPoint = element;
                    }
                }

                points.push({"borneId":temp_nextPoint.ID,"latitude":temp_nextPoint.AddressInfo.Latitude, "longitude": temp_nextPoint.AddressInfo.Longitude})
                console.log(points)

                distanceFinal = geolib.getDistance({ latitude: temp_nextPoint.AddressInfo.Latitude, longitude: temp_nextPoint.AddressInfo.Longitude },{ latitude: this.addressEnd.center[1], longitude: this.addressEnd.center[0] });
                i++
                console.log(distanceFinal)
            }

            points.push({"latitude":this.addressEnd.center[1],"longitude":this.addressEnd.center[0]})
            console.log(points)

        },
        async itineraryFirst() {
            console.log(this.addressStart.place_name)
            if (this.addressStart.place_name != undefined && this.addressEnd.place_name != undefined) {
                const startPoint = `${this.addressStart.center[0]},${this.addressStart.center[1]}`;
                const endPoint = `${this.addressEnd.center[0]},${this.addressEnd.center[1]}`;

                this.itinerary = await this.computeItinerary(startPoint, endPoint)
            }
        },
        async computeItinerary(startPoint, endPoint) {
            try {
                const response = await fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${startPoint};${endPoint}?geometries=geojson&access_token=${access_token}`, {
                    method: "GET"
                });

                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération de l itinéraire.');
                }

                return await response.json();
            } catch (error) {
                console.error('Erreur lors de la récupération de l itineraire:', error);
                return [];
            }
        },
        async getNearPoints(lat, long) {
            try {
                const response = await fetch(`https://api.openchargemap.io/v3/poi/?output=json&latitude=${lat}&longitude=${long}&distance=10&distanceunit=km&maxresults=5&key=29674b4a-741f-4dd2-8b14-bba674d9cb13`, {
                    method: "GET"
                });

                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des points de recharge.');
                }

                return await response.json();
            } catch (error) {
                console.error('Erreur lors de la récupération des point de recharge:', error);
                return [];
            }
        }
    }
};
</script>

<style>
input[type=text] {
    width: 84%;
    height: 25px;
    border: none;
    padding: 5px 20px;
    color: white;
    background-color: transparent;
}

#side {
    width: 35vw;
    padding: 15px;
    background-color: rgb(40, 40, 40);
}

.place {
    cursor: pointer;
}

.place:hover {
    background-color: rgb(27, 27, 27);
}

.input {
    background-color: rgb(0, 0, 0);
    width: 90%;
    border-radius: 5px;

}

ul {
    list-style-type: none;

}

li {
    color: white;
    font-size: 10px;
    padding: 15px;
}

select {
    background-color: rgb(0, 0, 0);
    border: none;
    width: 90%;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    color: white;
    padding: 11px;
}

h4 {
    color: white;
    font-size: 13px;
    margin-bottom: 10px;
    font-weight: 400;
}

button {
    background-color: rgb(0, 0, 0);
    border-radius: 5px;
    color: White;
    width: 90%;
    padding: 10px;
    border: none;
    margin-top: 20px;
    cursor: pointer;
}

button:hover {
    background-color: rgb(71, 71, 71);
}
</style>
