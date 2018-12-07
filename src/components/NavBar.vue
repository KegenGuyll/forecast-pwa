<template>
<div>
    <div class="navbar-fixed">
    <nav>
      <div class="nav-wrapper black">
        <ul class="left">
          <li><input v-model="CityName" id="first_name2" type="text"  style="padding-left:10px;width: 500px;" @keyup.enter="search"></li>
          <li><i class="large material-icons" v-on:click="search" style="padding-left: 10px;">add</i></li>
        </ul>
        <ul class="right">
            <li v-if="!isLoggedIn" v-on:click="login"><router-link to=''>Login</router-link></li>
            <li v-if="!isLoggedIn" v-on:click="register"><router-link to=''>Register</router-link></li>
            <li v-if="isLoggedIn"><span id="logout" v-on:click="logout">Logout</span></li>
          </ul>
      </div>
    </nav>
    <weather :CityName="CityName" ref="search"></weather>
  </div>
</div>
</template>

<script>
import Weather from './Weather.vue';
export default {
  name: 'NavBar',
  data() {
    return {
      CityName: '',
    }
  },
  components : {
    Weather: Weather
  },
  methods : {

    search(){
      this.$refs.search.addWeather();
    },
    login(){
      this.$refs.login.login();
    },
    // register(){
    //   this.$refs.register.addWeather();
    // },
    // register(){
    //   this.$refs.logout.addWeather();
    // }

  }
}
</script>

<style>
i{
  cursor: pointer;
}
input:not([type]), input[type=text]:not(.browser-default), input[type=password]:not(.browser-default), input[type=email]:not(.browser-default), input[type=url]:not(.browser-default), input[type=time]:not(.browser-default), input[type=date]:not(.browser-default), input[type=datetime]:not(.browser-default), input[type=datetime-local]:not(.browser-default), input[type=tel]:not(.browser-default), input[type=number]:not(.browser-default), input[type=search]:not(.browser-default), textarea.materialize-textarea{
  background-color:rgba(204, 204, 204, 0.3);
  border-radius: 5px;

}

input:not([type]), input[type=text]:not(.browser-default), input[type=password]:not(.browser-default), input[type=email]:not(.browser-default), input[type=url]:not(.browser-default), input[type=time]:not(.browser-default), input[type=date]:not(.browser-default), input[type=datetime]:not(.browser-default), input[type=datetime-local]:not(.browser-default), input[type=tel]:not(.browser-default), input[type=number]:not(.browser-default), input[type=search]:not(.browser-default), textarea.materialize-textarea{
  border-bottom: none;
  margin-left:10px;
}
</style>
