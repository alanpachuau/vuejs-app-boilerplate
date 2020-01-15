<template>
    <v-app>
        <v-container class="fill-height">
            <v-row justify="center" align-self="center">
                <v-col cols="12" sm="8" md="6" lg="4">
                    <v-card raised elevation="20" :loading="loading">
                        <v-card tile color="#33c466" height="100px" elevation="0">
                            <v-row justify="center" align-self="center" class="fill-height">
                                <v-icon size="70" class="white--text">mdi-account-circle-outline</v-icon>
                            </v-row>
                        </v-card>
                        <v-card-text class="px-10">
                            <p class="text-center grey--text">LOGIN</p>
                            <v-form>
                                <v-row>
                                    <v-col cols="12">
                                        <v-text-field
                                                :error-messages="emailErrors"
                                                @change="$v.form.email.$touch()"
                                                @blur="$v.form.email.$touch()"
                                                @keypress.enter="authenticate"
                                                v-model="form.email"
                                                prepend-icon="mdi-at"
                                                label="Email" />

                                        <v-text-field
                                                @keypress.enter="authenticate"
                                                :error-messages="passwordErrors"
                                                @change="$v.form.password.$touch()"
                                                @blur="$v.form.password.$touch()"
                                                v-model="form.password"
                                                :append-icon="showPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
                                                :type="showPassword ? 'text' : 'password'"
                                                @click:append="showPassword = !showPassword"
                                                prepend-icon="mdi-lock-smart"
                                                label="Password"/>
                                    </v-col>
                                </v-row>
                            </v-form>

                            <v-alert
                                    v-if="loginMessage.length"
                                    dense
                                    text
                                    type="error"
                            >
                                <span class="caption">{{ loginMessage }}</span>
                            </v-alert>
                        </v-card-text>
                        <v-card-actions class="px-10 pb-8">
                            <v-btn text color="secondary lighten-3" small to="/reset-password">
                                <v-icon small class="mr-1 orange--text">mdi-lock-reset</v-icon>
                                Reset Password
                            </v-btn>
                            <v-spacer></v-spacer>
                            <v-btn
                                    dark
                                    class="px-3"
                                    color="pink"
                                    @click="authenticate"
                                    tile
                            >
                                Sign In
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-app>
</template>

<script>
    import {validationMixin} from 'vuelidate'
    import {required, email} from 'vuelidate/lib/validators'
    import {mapActions, mapState} from "vuex";
    import {firebase} from '@/plugins/firebase'

    export default {
        mixins: [validationMixin],
        name: 'Login',
        data: () => ({
            showPassword: false,
            form: {
                email: '',
                password: '',
            },
            loginMessage: '',
        }),
        validations: {
            form: {
                email: {required, email},
                password: {required}
            }
        },
        computed: {
            ...mapState([
                'loading',
                'currentUser',
                'authenticated',
            ]),
            emailErrors() {
                const errors = []
                if (!this.$v.form.email.$dirty) return errors
                !this.$v.form.email.required && errors.push('Email is required')
                !this.$v.form.email.email && errors.push('Must be valid email address')
                return errors
            },
            passwordErrors() {
                const errors = []
                if (!this.$v.form.password.$dirty) return errors
                !this.$v.form.password.required && errors.push('Password is required')
                return errors
            },
        },
        created() {

        },
        methods: {
            ...mapActions([
                'startLoading',
                'stopLoading',
                'error',
                'success',
                'setCurrentUser',
                'setAuthenticated'
            ]),
            authenticate() {
                this.startLoading()

                this.$v.form.$touch()

                let self = this

                if (!this.$v.$invalid) {
                    firebase.auth().signInWithEmailAndPassword(this.form.email, this.form.password)
                        .catch(function (error) {
                            self.loginMessage = error.message
                            self.stopLoading()
                        })
                }
            },
        },
    }
</script>