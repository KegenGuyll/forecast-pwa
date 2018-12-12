<template>
  <div class="container">
    <div class="vld-parent">
      <loading :active.sync="isLoading" :is-full-page="fullPage"></loading>
    </div>
    <div class="row">
      <div class="col s12 m3" v-for="weather in searchWeatherData.list" v-bind:key="weather.id">
        <div class="card horizontal" v-for="details in weather.weather" v-bind:key="details" >
          <div class="card-image" style="padding-left: 2vw;padding-top: 17px;">
            <img v-bind:src="'https://openweathermap.org/img/w/' + details.icon + '.png'" style="height:60px; width:60px;">
            <span><strong>{{details.description}}</strong></span>
          </div>
          <div class="card-stacked">
            <div class="card-content">
              <ul>
                <li><span class="card-title" style="cursor: pointer;" v-on:click="addWeather(weather.id)" >Weather in {{weather.name}} <img :active="convertflag(weather.sys.country)" v-bind:src="'https://openweathermap.org/images/flags/' + flagicon + '.png'"></span></li>
                <li><div class="chip" style="color: rgb(255, 255, 255);background-color: #999999;">{{weather.main.temp_min}}K°</div><div class="chip" style="color: rgb(255, 255, 255);background-color: #FF9800;">{{weather.main.temp_max}}K°</div></li>
              </ul>
              <span v-on:click="directions(weather.coord.lat,weather.coord.lon)" style="color:#FF9800;cursor: pointer;"> [{{weather.coord.lat}},{{weather.coord.lon}}]</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row center">
      <div class="col s12 m6 offset-m3">
        <div class="card blue-grey darken-3" style="margin-top: 15vh;" v-if="CurrentLocation.name">
          <div class="card-content white-text">
            <span class="card-title">Weather in {{CurrentLocation.name}}</span>
            <span v-for="weather in CurrentLocation.weather" v-bind:key="weather.main">
              <img v-bind:src="'https://openweathermap.org/img/w/' + weather.icon + '.png'" style="height:60px; width:60px;">
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
      <div class="col s12 m4" v-for="(weather,index) in addWeatherData" v-bind:key="weather.name" v-if="weather.name">
        <div class="card blue-grey darken-3" style="margin-top: 15vh;">
          <i v-on:click="close(index,addWeatherData)" class="material-icons right orange-text">close</i>
          <div v-if="!weather.bookmarked" v-on:click="bookmark(weather)">
            <i class="material-icons left orange-text">bookmark_border</i>
          </div>
          <i v-else v-on:click="unbookmark(weather)" class="material-icons left orange-text">bookmark</i>
          <div class="card-content white-text">
            <span class="card-title">Weather in {{weather.name}}</span>
            <span v-for="weather in weather.weather" v-bind:key="weather.main">
              <img v-bind:src="'https://openweathermap.org/img/w/' + weather.icon + '.png'" style="height:60px; width:60px;">
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
      addWeatherData: [],
      searchWeatherData: [],
      flagicon: ''
    };
  },
  created() {
    this.$getLocation({
        enableHighAccuracy: true //defaults to false
      })
      .then(coordinates => {
        this.location = coordinates;
      })
      .then(() => {
        axios
          .get(
            "https://api.openweathermap.org/data/2.5/weather?lat=" +
            this.location.lat +
            "&lon=" +
            this.location.lng +
            "&APPID=" +
            apiKey
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
                this.pulledData(doc.data().CityId)
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
  methods: {
    convertTemp(k) {
      this.temp_fahrenheit.push(Math.floor(((k - 273.15) * 9) / 5 + 32));
      // this.temp_max_fahrenheit = Math.floor((temp_max - 273.15) * 9/5 + 32)
      // this.temp_min_fahrenheit = Math.floor((temp_min - 273.15) * 9/5 + 32)
    },
    search(){
      axios.get("https://api.openweathermap.org/data/2.5/find?q=" + this.CityName + "&type=accurate&mode=json&APPID=" + apiKey)
      .then(response => {
        this.searchWeatherData = response.data
      })
    },
    addWeather(id) {
      axios
        .get(
          "https://api.openweathermap.org/data/2.5/weather?id=" +
          id +
          "&APPID=" +
          apiKey
        )
        .then(response => {
          response.data.main.temp = this.convertTemp(response.data.main.temp);
          this.searchWeatherData = '';
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
      this.addWeatherData.splice(index, 1);
    },
    bookmark(weather) {
      const user = firebase.auth().currentUser;
      const uid = user.uid
      weather.bookmarked = true
      this.$forceUpdate();
      db.collection(uid).add({
        CityId: weather.id
      })
    },
    unbookmark(weather) {
      const user = firebase.auth().currentUser;
      const uid = user.uid
      weather.bookmarked = false
      this.$forceUpdate();
      db.collection(uid).where('CityId', '==', weather.id).get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            doc.ref.delete();
          })
        })
    },
    pulledData(CityId){
      axios.get("https://api.openweathermap.org/data/2.5/weather?id=" + CityId + "&APPID=" + apiKey)
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
    },
    convertflag(flag){
      var str = flag
      var res = str.toLowerCase();
      this.flagicon = res
    },
  directions(lat,lon){
    window.open('https://www.google.com/maps/search/?api=1&query=' + lat + ',' + lon)
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

i{
  cursor: pointer;
}
.chip{
  color: rgb(255, 255, 255);
  background-color: #999999;
}
</style>
