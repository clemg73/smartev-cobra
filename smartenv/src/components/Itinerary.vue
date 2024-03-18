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
    <button @click="computeItinerary()">Search</button>
    <p>{{ itinerary }}</p>

</div>
</template>

    
    
<script>
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
            itinerary: ""
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
        async computeItinerary(){
            console.log(this.addressStart.place_name)
            if(this.addressStart.place_name != undefined && this.addressEnd.place_name != undefined)
            {
                const startPoint = `${this.addressStart.center[0]},${this.addressStart.center[1]}`;
                const endPoint = `${this.addressEnd.center[0]},${this.addressEnd.center[1]}`;
    
                try {
                    const response = await fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${startPoint};${endPoint}?access_token=${access_token}`, {
                        method: "GET"
                    });
    
                    if (!response.ok) {
                        throw new Error('Erreur lors de la récupération de l itinéraire.');
                    }
    
                    this.itinerary = await response.json();
                } catch (error) {
                    console.error('Erreur lors de la récupération de l itineraire:', error);
                    return [];
                }
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
    width: 20vw;
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
h4{
    color: white;
    font-size: 13px;
    margin-bottom: 10px;
    font-weight: 400;
}
button{
    background-color: rgb(0, 0, 0);
    border-radius: 5px;
    color: White;
    width: 90%;
    padding: 10px;
    border:none;
    margin-top: 20px;
    cursor: pointer;
}
button:hover{
    background-color: rgb(71, 71, 71);
}
</style>
