
<template>
  <div class="home">
    <img alt="Ft_Transcendence_Logo" src="../assets/pp.gif" width="300" height="300">
    <h1>Welcolme to ft_transcendence</h1>


    <div class="card">

      <div class="button-guest">
        <button class="guest" @click="createGuest()">Login As a Guest</button>
      </div>

      <div class="button-login42">
        <button class="login42">Login with 42</button>
      </div>

    </div>
  </div>

</template>

<script lang="ts">
/* eslint-disable */ 
import router from '@/router';
import store from '@/store';

export default {

  name: 'HomeView',
  data: function () {
    return {
      login42: '',
      avatar42: '',
    }
  },
  methods: {
    // loginGuest: function(data:any) {
    //   console.log('login guest');
    //   store.dispatch('loginGuest', {
    //     login42: data.login42,
    //     avatar42: data.avatar42,
    //   }).then(function (response:any) {
    //     console.log('fin = ', response);
    //   }), function (error:any) {
    //     console.log('ERRRROOOOOR login Guest = ', error);
    //   }
    //   // this.createGuest();
    // },
    createGuest: function() {


      // Create random name
      let res = '';
      let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let charactersLengh = characters.length;
      for ( var i = 0; i < 10; i++)
        res += characters.charAt(Math.floor(Math.random() * charactersLengh));
      let avatar = 'https://cdn.intra.42.fr/users/medium_default.png';


      store.dispatch('createGuest', {
        login42: res,
        avatar42: avatar,
      }).then(function (response:any) {
        console.log('fin create= ', response);
        
        store.dispatch('loginGuest', {
          login42: res,
          avatar42: avatar,
        }).then(function (response:any) {
          console.log('fin fin= ', response);

          router.push('profil');
        }), function (error:any) {
          console.log('ERRRROOOOOR login Guest = ', error);
        }
      }), function (error:any) {
        console.log('ERRRROOOOOR create Guest = ', error);
      }

    }
    

  //   async _submitGuest(data: any) {

  //     try {

      
  //     const response = await axios.post(`http://localhost:3000/authentification/registerguest`, data)
      
  //     console.log(response);
     
  //     console.log('test = ', response.data);
  //     console.log('username = ', response.data.login42);
  //    } catch (error) {
  //     console.log('mince', error);
  //    }

  //    }
  }
}
 /* eslint-enable */
</script>

<style>
.button-guest {
    text-align: center;
    margin-left: auto;
    margin-right: auto;
    width: 100%;
    position: absolute;
    bottom: 300px;
  }
.button-login42 {
    text-align: center;
    margin-left: auto;
    margin-right: auto;
    width: 100%;
    position: absolute;
    bottom: 400;
}
</style>
