<template>
    <v-app>
        <v-container class="fill-height">
            <v-row justify="center" align-self="center">
                <v-col md="5">
                    <v-card raised elevation="20" :loading="loading">
                        <v-card tile color="#33c466" height="140px" elevation="0">
                            <v-row justify="center" align-self="center" class="fill-height">
                                <v-icon size="70" class="white--text">mdi-account-circle-outline</v-icon>
                            </v-row>
                        </v-card>
                        <v-card-text class="px-10">
                            <v-form v-if="!resetSent">
                                <v-row>
                                    <v-col cols="12">
                                        <v-text-field
                                                :error-messages="emailErrors"
                                                @change="$v.form.email.$touch()"
                                                @blur="$v.form.email.$touch()"
                                                @keypress.enter="authenticate"
                                                v-model="form.email"
                                                prepend-icon="mdi-at"
                                                label="Email"/>

                                    </v-col>
                                </v-row>
                            </v-form>

                            <v-alert
                                    v-if="message.length"
                                    dense
                                    text
                                    type="error"
                            >
                                <span class="caption">{{ message }}</span>
                            </v-alert>
                        </v-card-text>
                        <v-card-actions class="px-10 pb-8" v-if="!resetSent">
                            <v-btn text color="secondary lighten-3" small to="/login">
                                <v-icon small class="mr-1 orange--text">mdi-arrow-left</v-icon>
                                Back to Login
                            </v-btn>
                            <v-spacer></v-spacer>
                            <v-btn
                                    dark
                                    class="px-3"
                                    color="pink"
                                    @click="sendResetLink"
                                    tile
                            >
                                Reset Password
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
    import axios from 'axios';

    export default {
        mixins: [validationMixin],
        name: 'Login',
        data: () => ({
            showPassword: false,
            form: {
                email: '',
            },
            message: '',
            resetSent: false,
        }),
        validations: {
            form: {
                email: {required, email},
            }
        },
        computed: {
            ...mapState([
                'loading',
                'functionUrl'
            ]),
            emailErrors() {
                const errors = []
                if (!this.$v.form.email.$dirty) return errors
                !this.$v.form.email.required && errors.push('Email is required')
                !this.$v.form.email.email && errors.push('Must be valid email address')
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
            ]),
            sendResetLink() {
                this.startLoading()

                this.$v.form.$touch()

                let self = this

                if (!this.$v.$invalid) {

                    axios.post(self.functionUrl + '/sendResetPasswordLink', this.form)
                        .then(() => {
                            self.$v.$reset()
                            self.stopLoading()
                            self.resetSent = true
                            self.message = 'Password reset link sent to email. Please check your email.'
                        })
                }
            },
        },
    }
</script>