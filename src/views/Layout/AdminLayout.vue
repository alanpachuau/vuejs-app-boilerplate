<template>
    <v-app>
        <v-navigation-drawer app fixed v-model="drawer">
            <MainNav/>
        </v-navigation-drawer>

        <v-app-bar
                color="blue-grey darken-2"
                app
                dark
                elevation="0"
        >
            <v-toolbar-title class="ml-0 pl-4">
                <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
                <span>{{ pageTitle }}</span>
            </v-toolbar-title>

            <v-spacer></v-spacer>

            <v-btn icon @click="signout">
                <v-icon>mdi-export</v-icon>
            </v-btn>

        </v-app-bar>

        <v-content>
            <v-container fluid>
                <router-view></router-view>
            </v-container>
        </v-content>

        <v-snackbar
                v-model="snackbar.show"
                :color="snackbar.color"
                :timeout="snackbar.timeout"
        >
            {{ snackbar.text }}

            <v-btn
                    dark
                    text
                    @click="hideSnackbar"
            >
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-snackbar>
    </v-app>
</template>

<script>
    import MainNav from '@/components/Admin/Nav.vue';
    import {mapState, mapActions} from 'vuex';
    import {firebase} from '@/plugins/firebase'

    export default {
        name: "AdminLayout",
        components: {
            MainNav
        },
        computed: {
            ...mapState([
                'snackbar',
                'loading'
            ]),
            pageTitle() {
                return this.$route.meta.title ? this.$route.meta.title : ''
            },
        },
        created() {
        },
        data: () => ({
            drawer: null,
            show: true,
        }),
        methods: {
            ...mapActions([
                'hideSnackbar',
                'setAuthenticated'
            ]),
            signout() {
                let self = this
                firebase.auth().signOut().then(function () {
                    self.setAuthenticated(false)
                    self.$router.replace('/login')
                })
            }
        }
    }
</script>

<style scoped>

</style>