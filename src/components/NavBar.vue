<template>
<div>
  <div class="navbar-fixed">
    <nav>
      <div class="nav-wrapper black">
        <div class="row">
          <div class="input-field col s6">
            <input v-model="CityName" id="first_name2" type="text" class="validate" style="padding-left:10px" @keyup.enter="search">
          </div>
          <i class="large material-icons" v-on:click="search">add</i>
        </div>
      </div>
    </nav>
  </div>
  <weather :CityName="CityName" ref="search"></weather>
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
    }

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
</style>
