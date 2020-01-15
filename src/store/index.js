import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        snackbar: {
            show: false,
            text: '',
            color: 'success',
            timeout: 4000
        },
        loading: false,
        perPage: 10,
        authenticated: false,
        currentUser: null,
        functionUrl: process.env.VUE_APP_FIREBASE_FUNCTION_URL,
        userTypes: ['Teacher', 'Student'],
    },
    mutations: {
        setSnackbar(state, payload) {
            state.snackbar.show = true
            state.snackbar.text = payload.text
            state.snackbar.color = payload.color
        },
        setLoading(state, loadingState) {
            state.loading = loadingState
        },
        setSnackbarVisibility(state, payload) {
            state.snackbar.show = payload
        },
        setAuthenticated(state, payload) {
            state.authenticated = payload
        },
        setCurrentUser(state, payload) {
            state.currentUser = payload
        }
    },
    actions: {
        startLoading(context) {
            context.commit('setLoading', true)
        },
        stopLoading(context) {
            context.commit('setLoading', false)
        },
        success(context, message) {
            context.commit('setSnackbar', {text: message, color: 'green lighten-2'})
        },
        error(context, message) {
            context.commit('setSnackbar', {text: message, color: 'error'})
        },
        pending(context, message) {
            context.commit('setSnackbar', {text: message, color: 'info'})
        },
        hideSnackbar(context) {
            context.commit('setSnackbarVisibility', false)
        },
        setAuthenticated(context, authState) {
            context.commit('setAuthenticated', authState)
        },
        setCurrentUser(context, user) {
            context.commit('setCurrentUser', user)
        }
    },
    modules: {}
})
