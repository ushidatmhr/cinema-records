import Vue from 'vue'
import App from './App.vue'
import * as firebase from 'firebase'
import * as firestor from 'firebase/firestore'


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
        }
    }
});


new Vue({
    el: '#app',
    render: h => h(App)
});
