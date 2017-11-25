import Vue from 'vue'
import App from './App.vue'
import Menu from './Menu.vue'
import LoginModal from './LoginModal.vue'
import AddRecordModal from './AddRecordModal.vue'

import * as firebase from 'firebase'
import * as firestor from 'firebase/firestore'

Vue.component('Menu', Menu);
Vue.component('LoginModal', LoginModal);
Vue.component('AddRecordModal', AddRecordModal);

firebase.initializeApp({
    apiKey: "AIzaSyAHDqfsrgwtPkX2m1a4wtvNFBfCsy8OL4E",
    authDomain: "cinema-records.firebaseapp.com",
    projectId: "cinema-records"
});

Vue.mixin({
    methods: {
        firebase() {
            return firebase;
        },
        firestore() {
            return firebase.firestore();
        },
        Cinemas() {
            return firebase.firestore().collection(process.env.COLLECTION);
        }
    }
});


new Vue({
    el: '#app',
    render: h => h(App)
});
