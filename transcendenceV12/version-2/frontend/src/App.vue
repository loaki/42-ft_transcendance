<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/game?id=1">Game</router-link>
  </nav>
  <div >
    <ChatComponent />
  </div>
  <router-view/>
</template>

<script>
// import ChatComponent from './components/ChatComponent.vue'
export default {
	name: 'App',
// 	components: {
//     ChatComponent
// }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}
</style>