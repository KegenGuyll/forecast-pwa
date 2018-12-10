// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import './plugins/vuetify'
import './plugins/vuetify'
import './plugins/vuetify'
import App from './App'
import router from './router'
import VueGeolocation from 'vue-browser-geolocation';
import firebase from 'firebase';






Vue.use(VueGeolocation);
Vue.config.productionTip = false


/* eslint-disable no-new */
let app;
firebase.auth().onAuthStateChanged(user => {
  if(!app){
    app = new Vue({
      router,
      render: h => h(App)
    }).$mount('#app')
  }
})
