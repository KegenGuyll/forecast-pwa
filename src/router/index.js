import Vue from 'vue'
import Router from 'vue-router'
import NavBar from '@/components/NavBar'
import login from '@/components/login'
import register from '@/components/register'
import '../firebaseInit';
import firebase from 'firebase'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'NavBar',
      component: NavBar,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: login,
      meta: {
        requiresGuest: true
      }
    },
    {
      path: '/register',
      name: 'register',
      component: register,
      meta: {
        requiresGuest: true
      }
    }
  ]
})


router.beforeEach(( to, from, next) => {
  //Check for requiedAuth guard
  if(to.matched.some(record => record.meta.requiresAuth)){
    //Check if NOT logged in 
    if (!firebase.auth().currentUser){
      //Go to login
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      }) 
    }
    else{
      //Proceed to the route
      next();
    }
  } else if(to.matched.some(record => record.meta.requiresGuest)){

    //Check if is logged in 
    if (firebase.auth().currentUser){
      //Go to login
      next({
        path: '/',
        query: {
          redirect: to.fullPath
        }
      }) 
    }
    else{
      //Proceed to the route
      next();
    }

  }
  else{
    next()
  }
})

export default router;
