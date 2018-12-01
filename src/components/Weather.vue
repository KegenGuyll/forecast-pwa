<template>
  <div class="container">
    <div class="vld-parent">
      <loading :active.sync="isLoading" :is-full-page="fullPage"></loading>
    </div>
    <div class="row">
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
          <span>Current temp. {{this.temp_fahrenheit}}F°</span>
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
  data() {
    return {
        isLoading: true,
        fullPage: true,
        weatherData : [],
        location : {},
        temp_fahrenheit: '',
        temp_max_fahrenheit : '',
        temp_min_fahrenheit : '',
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
                this.convertTemp()
                console.log(this.weatherData.weather.description)
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
      convertTemp(){
          var temp = this.weatherData.main.temp
          var temp_max = this.weatherData.main.temp_max
          var temp_min = this.weatherData.main.temp_min
          this.temp_fahrenheit = Math.floor((temp - 273.15) * 9/5 + 32)
          this.temp_max_fahrenheit = Math.floor((temp_max - 273.15) * 9/5 + 32)
          this.temp_min_fahrenheit = Math.floor((temp_min - 273.15) * 9/5 + 32)
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
</style>
