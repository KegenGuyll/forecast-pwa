<template>
  <div class="container">
    <div class="row">
      <div class="col s12 m6 offset-m3">
        <div class="card blue-grey darken-3 " style="margin-top: 15vh;">
        <span class="right" style="padding-right:10px"><router-link to='/login'>Login</router-link></span>
          <div class="card-content white-text">
            <span class="card-title center">Register</span>
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
               <a  v-on:click="register" class="waves-effect waves-light btn">Register</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase';



export default {
    name: 'register',
    data: function(){
        return {
            email: '',
            password: ''
        };
    },
    methods: {
        /* eslint-disable */
        register: function(e){
            firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
            .then(user => {
                this.$router.push('/');
            },
            err => {
                alert(err.message);
            })
            e.preventDefault();
        }
    }
}
</script>