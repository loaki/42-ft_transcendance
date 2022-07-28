/* eslint @typescript-eslint/no-var-requires: "off" */
/* eslint-disable */ 
import { createStore } from 'vuex'

// import Vue from 'vue'
// import Vuex from 'vuex'

// Vue.use(Vuex)

const axios = require('axios').default;

const instance = axios.create({
    baseURL: 'http://localhost:3000/'
})

// let user = localStorage.getItem('user');
// if (!user) {
//     user = {
//         id: -1,
//         login42: '',
//     };

// } else {
//     try {
//         user = JSON.parse(user);
//     } catch (err) {
//         user = {
//             id: -1,
//             login42: '',
//         };
//     }
    
// }

// Create a new store instance
const store = createStore({
    state: {
        status: '',
        user: {
            id: -1,
            login42: '',
        },
        userInfos: {
            id: -1,
            login42: '',
            avatar42: '',
            wins: 0,
            losses: 0,
            status: '',
            isTwoFactorAuthentificationEnabled: '',
        },
    },
    mutations: {
        setStatus: function (state, status) {
            state.status = status;
        },
        logUser: function (state, user) {
            localStorage.setItem('user', JSON.stringify(user));
            state.user = user;
        },
        userInfos: function (state, userInfos) {
            state.userInfos = userInfos;
        }
    },
    actions: {
        createGuest: ({commit}, userInfos) => {
            return new Promise((resolve, reject) => {
                commit;
                // console.log('create = ', userInfos);
                instance.post('/authentification/registerguest', userInfos)
                .then(function (response:any) {
                    // console.log('response create store = ', response);
                    commit('setStatus', 'created');
                    resolve(response);
                })
                .catch(function (error:any) {
                    console.log('error post = ', error);
                    commit('setStatus', 'error_create_guest');
                    reject(error);
                });
            })
        },
        loginGuest: ({commit}, userInfos) => {
            return new Promise((resolve, reject) => {
                commit('setStatus', 'loading');
                // console.log('ici = ', userInfos);
                instance.post('/authentification/login', userInfos)
                .then(function (response:any) {
                    // console.log('response login store = ', response);
                    commit('setStatus', 'login');
                    commit('logUser', response.data);
                    resolve(response);
                    console.log('token = ', response.header);
                    console.log('status; ', response.status);
                    console.log('response = ', response);
                    console.log('token = ', response.header.get('Authentication'));
                })
                .catch(function (error:any) {
                    console.log('error post = ', error);
                    commit('setStatus', 'error_login_guest');
                    reject(error);
                });
            })
        },
        getUserInfos: ({commit}) => {
            commit ;
            instance.get('/user/', {
                params: {
                    id: store.state.user.id
                }
            })
            .then( function (response:any) {
                console.log('return = ', response);
            })
        },
        logout: ({commit}) => {
            // instance.post('/authentification/logout');
            // localStorage.removeItem('user');
            commit;
            // const token = JSON.parse(sessionStorage.getItem)
            instance.get('/user/', {
                withCredentials: true,
                params: {
                    id: store.state.user.id
                }
            })
            .then( function (response:any) {
                console.log('return = ', response);
            })
        }
    }

})
export default store;
 /* eslint-enable */