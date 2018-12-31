import Vue from 'vue'
import App from './App.vue'
import Menu from './Menu.vue'
import AddRecordModal from './AddRecordModal.vue'
import LoginModal from "./LoginModal.vue"

Vue.component('Menu', Menu);
Vue.component('AddRecordModal', AddRecordModal);
Vue.component('LoginModal', LoginModal);

new Vue({
    el: '#app',
    render: h => h(App)
});