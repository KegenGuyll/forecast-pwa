<template>
  <div class="container">
    <div class="vld-parent">
      <loading :active.sync="isLoading" :is-full-page="fullPage"></loading>
    </div>
    <div class="row center">
      <div class="col s12 m6 offset-m3">
        <div class="card blue-grey darken-3" style="margin-top: 15vh;" v-if="CurrentLocation.name">
          <div class="card-content white-text">
            <span class="card-title">Weather in {{CurrentLocation.name}}</span>
            <span v-for="weather in CurrentLocation.weather" v-bind:key="weather.main">
              <img
                v-bind:src="'https://openweathermap.org/img/w/' + weather.icon + '.png'"
                style="height:60px; width:60px;"
              >
              <p>{{weather.description}}</p>
            </span>
          </div>
          <div class="card-action color-text orange">
            <span>Current temp. {{temp_fahrenheit[0]}}F°</span>
          </div>
        </div>
      </div>
      </div>
      <div class="row center">
        <div class="col s12 m4"   v-for="(weather,index) in addWeatherData" v-bind:key="weather.name" v-if="weather.name">
        <div  class="card blue-grey darken-3" style="margin-top: 15vh;" >
          <i v-on:click="close(index,addWeatherData)" class="material-icons right orange-text">close</i> 
          <div v-if="!weather.bookmarked" v-on:click="bookmark(weather)" >
            <i class="material-icons left orange-text">bookmark_border</i>
          </div>
          <i v-else v-on:click="unbookmark(weather)" class="material-icons left orange-text">bookmark</i>
          <div class="card-content white-text">
            <span class="card-title">Weather in {{weather.name}}</span>
            <span v-for="weather in weather.weather" v-bind:key="weather.main">
              <img
                v-bind:src="'https://openweathermap.org/img/w/' + weather.icon + '.png'"
                style="height:60px; width:60px;"
              >
              <p>{{weather.description}}</p>
            </span>
          </div>
          <div class="card-action color-text orange">
            <span>Current temp. {{temp_fahrenheit[index+1]}}F°</span>
          </div>
        </div>
      </div>
      </div>
  </div>
</template>

<script>
import db from '../firebaseInit'
import firebase from 'firebase'
import axios from "axios";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
const apiKey = "4d3e3b1b0437ed374e4b41c906b0da10";
export default {
  name: "weather",
  props: [
    "CityName",
    "isLoggedIn"
  ],
  data() {
    return {
      isLoading: true,
      fullPage: true,
      CurrentLocation: [],
      location: {},
      temp_fahrenheit: [],
      temp_max_fahrenheit: "",
      temp_min_fahrenheit: "",
      addWeatherData: []
    };
  },
  created() {
    this.$getLocation({
        enableHighAccuracy: true //defaults to false
      })
      .then(coordinates => {
        this.location = coordinates;
        console.log(coordinates);
      })
      .then(() => {
        axios
          .get(
            "https://api.openweathermap.org/data/2.5/weather?lat=" +
            this.location.lat +
            "&lon=" +
            this.location.lng +
            "&APPID=" +
            apiKey +
            ""
          )
          .then(response => {
            const user = firebase.auth().currentUser;
            const uid = user.uid
            this.CurrentLocation = response.data;
            this.isLoading = false;
            this.convertTemp(this.CurrentLocation.main.temp);
            db.collection(uid).get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                console.log(doc.data().CityName)
                this.pulledData(doc.data().CityName)
              })
            })
          })
          .catch(e => {
            console.error(e);
          });
      });
  },
  components: {
    Loading
  },
  watch: {

  },
  methods: {
    convertTemp(k) {
      this.temp_fahrenheit.push(Math.floor(((k - 273.15) * 9) / 5 + 32));
      // this.temp_max_fahrenheit = Math.floor((temp_max - 273.15) * 9/5 + 32)
      // this.temp_min_fahrenheit = Math.floor((temp_min - 273.15) * 9/5 + 32)
    },
    addWeather() {
      axios
        .get(
          "https://api.openweathermap.org/data/2.5/weather?q=" +
          this.CityName +
          "&APPID=" +
          apiKey
        )
        .then(response => {
          response.data.main.temp = this.convertTemp(response.data.main.temp);
          var index = this.addWeatherData.push(response.data) - 1
          var bookmarked = {
            bookmarked: false
          }
          Object.assign(this.addWeatherData[index], bookmarked)
        })
        .catch(e => {
          console.error(e);
        });
    },
    close(addWeatherData, index) {
      index -= index
      this.addWeatherData.splice(index, 1);
    },
    bookmark(weather) {
      const user = firebase.auth().currentUser;
      const uid = user.uid
      weather.bookmarked = true
      this.$forceUpdate();
      db.collection(uid).add({
        CityName: weather.name
      })
    },
    unbookmark(weather) {
      const user = firebase.auth().currentUser;
      const uid = user.uid
      weather.bookmarked = false
      this.$forceUpdate();
      db.collection(uid).where('CityName', '==', weather.name).get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            doc.ref.delete();
          })
        })
    },
    login() {
      console.log('login')
    },
    pulledData(CityName){
      axios.get("https://api.openweathermap.org/data/2.5/weather?q=" + CityName + "&APPID=" + apiKey)
      .then(response => {
          response.data.main.temp = this.convertTemp(response.data.main.temp);
          var index = this.addWeatherData.push(response.data) - 1
          var bookmarked = {
            bookmarked: true
          }
          Object.assign(this.addWeatherData[index], bookmarked)
        })
        .catch(e => {
          console.error(e);
        });
    }
  }
};
</script>

<style scoped>
.card .card-action:last-child {
  border-radius: 0 0 10px 10px;
}

.card {
  border-radius: 10px;
}
</style>
