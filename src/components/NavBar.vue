<template>
<div>
    <nav>
      <div class="nav-wrapper black">
        <ul class="left">
          <li><input v-model="CityName" id="first_name2" type="text"  style="padding-left:10px;width: 50vw;" @keyup.enter="search"></li>
          <li><i class="large material-icons" v-on:click="search" style="padding-left: 10px;">add</i></li>
        </ul>
        <ul class="right">
            <li v-if="isLoggedIn" style="padding-right:25px"><span id="logout" v-on:click="logout">Logout</span></li>
          </ul>
      </div>
    </nav>
    <weather :CityName="CityName" :isLoggedIn="isLoggedIn" ref="search"></weather>
</div>
</template>

<script>
import '../firebaseInit.js'
import firebase from 'firebase';
import Weather from './Weather.vue';
export default {
  name: 'NavBar',
  data() {
    return {
      CityName: '',
      isLoggedIn: false,
      currentUser: false
    }
  },
  components : {
    Weather: Weather,
  },
  created(){
    if(firebase.auth().currentUser){
      this.isLoggedIn = true;
      this.currentUser = firebase.auth().currentUser.email;
    }
  },
  methods : {

    search(){
      this.$refs.search.search();
      this.CityName = '';
    },
    logout: function() {
      firebase.auth().signOut().then(() => {
        this.$router.go({path: this.$router.path})
      })
    }
    
  }
}
</script>

<style scoped>
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
