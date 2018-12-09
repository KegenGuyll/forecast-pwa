<template>
  <div class="container">
    <div class="row">
      <div class="col s12 m6 offset-m3">
        <div class="card blue-grey darken-3 " style="margin-top: 15vh;">
        <span class="right" style="padding-right:15px"><router-link to='/register'>Register</router-link></span>
          <div class="card-content white-text">
            <span class="card-title center">Login</span>
            <div class="row">
              <form class="col s12">
                <div class="row">
                  <div class="input-field col s12">
                    <input id="email" type="email" class="validate" v-model="email">
                    <label for="email">Email</label>
                    <span class="helper-text" data-error="wrong" data-success="right"></span>
                  </div>
                </div>
              </form>
            </div>
            <div class="row">
              <div class="input-field col s12">
                <input id="password" type="password" class="validate" v-model="password">
                <label for="password">Password</label>
              </div>
            </div>
          </div>
          <div class="card-action">
               <a  v-on:click="login" class="waves-effect waves-light btn">Login</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'
export default {
    name: 'login',
    props: [
    "isLoggedIn",
    "showlogin"
    ],
    data: function(){
        return {
            email: '',
            password: ''
        };
    },
    methods: {
        login: function(e){
            firebase.auth().signInWithEmailAndPassword(this.email, this.password)
            .then(user => {
                this.$router.go({path: this.$router.path})
            },
            err => {
                alert(err.message);
            })
            e.preventDefault();
        }
    }
}
</script>