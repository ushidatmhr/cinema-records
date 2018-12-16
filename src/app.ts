import Vue from 'vue'
import App from './App.vue'
import firebase from 'firebase'

firebase.initializeApp({
    apiKey: "AIzaSyAHDqfsrgwtPkX2m1a4wtvNFBfCsy8OL4E",
    authDomain: "cinema-records.firebaseapp.com",
    projectId: "cinema-records"
});

new Vue({
    el: '#app',
    render: h => h(App)
});