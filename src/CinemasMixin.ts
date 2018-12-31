import Vue from 'vue'
import firebase from "firebase";
import "firebase/firestore";
import { Mixin } from "vue-mixin-decorator";

// API設定
firebase.initializeApp({
    apiKey: "AIzaSyAHDqfsrgwtPkX2m1a4wtvNFBfCsy8OL4E",
    authDomain: "cinema-records.firebaseapp.com",
    projectId: "cinema-records"
});

firebase.firestore().settings({
    timestampsInSnapshots: true
});

@Mixin
export default class CinemasMixin extends Vue {

    /** firebaseインスタンス */
    firebase = firebase;

    /** firestore取得 */
    collection() {
        // TODO
        return this.firebase.firestore().collection("cinemas");
    }
}