<template>
  <div class="container">
    <div class="vld-parent">
      <loading :active.sync="isLoading" :is-full-page="fullPage"></loading>
    </div>
    <div class="row center">
      <div class="col s12 m6 offset-m3">
        <div class="card blue-grey darken-3" style="margin-top: 15vh;" v-if="weatherData.name">
          <div class="card-content white-text">
            <span class="card-title">
                Weather in {{weatherData.name}} 
            </span>
              <span v-for="weather in weatherData.weather" v-bind:key="weather.main">
                <img v-bind:src="'https://openweathermap.org/img/w/' + weather.icon + '.png'" style="height:60px; width:60px;" />
                <p>{{weather.description}}</p>
              </span>
          </div>
          <div class="card-action color-text orange">
          <span>Current temp. {{temp_fahrenheit}}F°</span>
        </div>
        </div>
      </div>
      <div class="col s12 m6 offset-m3">
        <div class="card blue-grey darken-3" style="margin-top: 15vh;" v-for="weather in addWeatherData" v-bind:key="weather.name" v-if="weather.name">
          <div class="card-content white-text">
            <span class="card-title">
                Weather in {{weather.name}} 
            </span>
              <span v-for="weather in weather.weather" v-bind:key="weather.main">
                <img v-bind:src="'https://openweathermap.org/img/w/' + weather.icon + '.png'" style="height:60px; width:60px;" />
                <p>{{weather.description}}</p>
              </span>
          </div>
          <div class="card-action color-text orange">
          <span>Current temp. {{temp_fahrenheit}}F°</span>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
const apiKey = '4d3e3b1b0437ed374e4b41c906b0da10'
export default {
  name: 'weather',
  props :[
    'CityName',
  ],
  data() {
    return {
        isLoading: true,
        fullPage: true,
        weatherData : [],
        location : {},
        temp_fahrenheit: [],
        temp_max_fahrenheit : '',
        temp_min_fahrenheit : '',
        addWeatherData : []
    }
  },
  created() {
    this.$getLocation({
        enableHighAccuracy: true, //defaults to false
    })
      .then(coordinates => {
        this.location = coordinates;
        console.log(coordinates);
      })
      .then(() => {
          axios.get("https://api.openweathermap.org/data/2.5/weather?lat=" + this.location.lat + "&lon=" + this.location.lng + "&APPID=" + apiKey + "")
            .then(response =>  {
                this.weatherData = response.data
                this.isLoading = false
                this.convertTemp(this.weatherData.main.temp)
            })
            .catch(e => {
              console.error(e);
            })
      })
  },
  components: {
      Loading
  },
  methods: { 
      convertTemp(k){
          this.temp_fahrenheit.push(Math.floor((k - 273.15) * 9/5 + 32))
          // this.temp_max_fahrenheit = Math.floor((temp_max - 273.15) * 9/5 + 32)
          // this.temp_min_fahrenheit = Math.floor((temp_min - 273.15) * 9/5 + 32)
      },
      addWeather(){
        console.log('active')
        axios.get("https://api.openweathermap.org/data/2.5/weather?q=" + this.CityName + "&APPID=" + apiKey)
        .then(response => {
          this.addWeatherData.push(response.data)
          this.addWeatherData.forEach(function(details){
           console.log(details.main.temp)
          })
        })
        .catch(e => {
          console.error(e)
        })
      }
  }
}
</script>

<style scoped>
.card .card-action:last-child {
    border-radius: 0 0 10px 10px;
}

.card{
  border-radius: 10px;
}

/* This is for documentation purposes and will not be needed in your application */
  #create .v-speed-dial {
    position: absolute;
  }

  #create .v-btn--floating {
    position: relative;
  }
  
  .centered {
  position: fixed;
  /* bring your own prefixes */
  transform: translate(-50%, -60%);
}
</style>
