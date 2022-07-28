<template>

    <div class="base">

        <h1>Profil utilisateur</h1>

        <p> Mes informations ... </p>

        <img src="https://cdn.intra.42.fr/users/medium_default.png">

        <div class="form-row">
            <button class="button" @click="logout()">
                Logout
            </button>
        </div>

    </div>
</template>


<script lang="ts">
import store from '@/store';
// import router from '@/router';

export default {
    name: 'ProfilView',
    mounted: function() { // quand la vie est charge
        console.log('cookie ? = ', store.state.user);
        // if (store.state.user.id == -1) {
        //     router.push('/');
        //     return ;
        // }
        // store.dispatch('getUserInfos');
        // store.state.user.
    },
    methods: {
        logout: function () {
            console.log("logout");
            // store.dispatch('logout');
            // router.push('/');
        }
    }
}
</script>


<style scoped>


</style>