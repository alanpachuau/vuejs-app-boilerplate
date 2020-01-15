<template>
    <v-app>
        <router-view v-if="!authenticating"></router-view>
        <v-container class="fill-height" v-show="authenticating">
            <v-row justify="center" align-self="center">
                <v-progress-circular
                        :size="140"
                        :width="2"
                        color="red darken-2"
                        indeterminate>
                    <span class="caption">loading...</span>
                </v-progress-circular>
            </v-row>
        </v-container>
    </v-app>
</template>

<script>
    import {firebase} from '@/plugins/firebase'
    import axios from 'axios'
    import {mapActions, mapState} from 'vuex'

    export default {
        name: 'App',
        data: () => ({
            authenticating: true,
        }),
        created() {
            this.watchAuth()
        },
        computed: {
            ...mapState([
                'authenticated',
                'functionUrl'
            ])
        },
        methods: {
            ...mapActions([
                'setCurrentUser',
                'setAuthenticated',
                'stopLoading',
                'startLoading',
                'error'
            ]),
            watchAuth() {
                let self = this

                firebase.auth().onAuthStateChanged(function (user) {
                    if (user) {
                        user.getIdTokenResult()
                            .then((tokenid) => {
                                if (typeof tokenid.claims.role === 'undefined') {
                                    firebase.auth().signOut().then(function () {

                                        axios.get(
                                            self.functionUrl + '/authenticate',
                                            {params: {uid: user.uid}})
                                            .then(response => {
                                                firebase.auth().signInWithCustomToken(response.data).catch(function (error) {
                                                    self.error('Login failed.', error)
                                                });
                                            })
                                    });
                                } else {
                                    self.setCurrentUser({
                                        uid: user.uid,
                                        email: user.email,
                                        name: tokenid.claims.name,
                                        role: tokenid.claims.role,
                                        isAdmin: tokenid.claims.isAdmin,
                                    })

                                    self.setAuthenticated(true)

                                    self.stopLoading()

                                    self.authenticating = false

                                    if (self.$router.currentRoute.name === 'login') {
                                        let redirect = self.$router.currentRoute.query.redirect
                                        if (tokenid.claims.isAdmin) self.$router.replace(redirect ? redirect : '/')

                                    }
                                }
                            })
                    } else {
                        self.authenticating = false
                    }
                });
            }
        }
    };
</script>
