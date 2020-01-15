<template>
    <v-dialog
            v-model="dialog"
            width="500"
            persistent
    >
        <v-card
                :loading="loading" elevation="0" tile>
            <v-card-title class="py-4 my-0 primary lighten-2">
                <v-icon color="white">mdi-account-edit</v-icon>
                <span class="caption text-right white--text pl-2">EDIT ADMINISTRATOR</span>
                <v-spacer/>
                <v-icon @click="dialog = false" color="white">mdi-close</v-icon>
            </v-card-title>

            <v-card-text class="pb-0">
                <v-form
                        ref="form"
                        v-model="valid"
                        lazy-validation
                >
                    <v-row class="px-3 pt-6">

                        <v-col cols="12">
                            <v-text-field
                                    :disabled="loading"
                                    :error-messages="nameErrors"
                                    @change="$v.form.name.$touch()"
                                    @blur="$v.form.name.$touch()"
                                    v-model="form.name"
                                    label="Full Name"/>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field
                                    :disabled="loading"
                                    :error-messages="emailErrors"
                                    @change="$v.form.email.$touch()"
                                    @blur="$v.form.email.$touch()"
                                    v-model="form.email"
                                    label="Email"/>
                        </v-col>

                        <v-col cols="12">
                            <v-text-field
                                    autocomplete="new-password"
                                    :disabled="loading"
                                    :error-messages="passwordErrors"
                                    @change="$v.form.password.$touch()"
                                    @blur="$v.form.password.$touch()"
                                    :append-icon="show1 ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
                                    :type="show1 ? 'text' : 'password'"
                                    @click:append="show1 = !show1"
                                    v-model="form.password"
                                    label="Password"/>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field
                                    :disabled="loading"
                                    :error-messages="repeatPasswordErrors"
                                    @change="$v.form.repeatPassword.$touch()"
                                    @blur="$v.form.repeatPassword.$touch()"
                                    :append-icon="show1 ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
                                    :type="show1 ? 'text' : 'password'"
                                    @click:append="show1 = !show1"
                                    v-model="form.repeatPassword"
                                    label="Repeat Password"/>
                        </v-col>

                    </v-row>
                </v-form>
            </v-card-text>

            <v-card-actions class="pb-6 px-7">
                <v-spacer></v-spacer>

                <v-btn
                        color="blue-grey lighten-1"
                        dark
                        @click="save"
                        small
                        rounded
                        class="px-5"
                >
                    <small>UPDATE</small>
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import {validationMixin} from 'vuelidate'
    import {required, maxLength, minLength, email, sameAs} from 'vuelidate/lib/validators'
    import axios from 'axios'

    export default {
        mixins: [validationMixin],
        name: 'EditAdministrator',
        props: {
            editItem: Object
        },
        validations: {
            form: {
                name: {required, maxLength: maxLength(100)},
                email: {required, email},
                password: {minLength: minLength(6)},
                repeatPassword: {
                    sameAsPassword: sameAs('password')
                },
            }
        },
        data() {
            return {
                dialog: false,
                loading: false,
                valid: false,
                changeImage: false,
                show1: false,
                form: {
                    id: '',
                    name: '',
                    email: '',
                    password: '',
                    repeatPassword: '',
                    role: 'admin',
                },
            }
        },
        watch: {
            editItem: function (obj) {
                this.dialog = true
                this.form.id = obj.data.id
                this.form.name = obj.data.name
                this.form.email = obj.data.email
            }
        },
        computed: {
            ...mapState([
                'functionUrl',
            ]),
            nameErrors() {
                const errors = []
                if (!this.$v.form.name.$dirty) return errors
                !this.$v.form.name.required && errors.push('Name is required.')
                !this.$v.form.name.maxLength && errors.push('Name must be at most 100 characters long')
                return errors
            },
            emailErrors() {
                const errors = []
                if (!this.$v.form.email.$dirty) return errors
                !this.$v.form.email.required && errors.push('Email is required.')
                !this.$v.form.email.email && errors.push('Email must be valid.')
                return errors
            },
            passwordErrors() {
                const errors = []
                if (!this.$v.form.password.$dirty) return errors
                !this.$v.form.password.minLength && errors.push('Password must be at least 6 characters.')
                return errors
            },
            repeatPasswordErrors() {
                const errors = []
                if (!this.$v.form.repeatPassword.$dirty) return errors
                !this.$v.form.repeatPassword.sameAsPassword && errors.push('Password not matching.')
                return errors
            },
        },
        methods: {
            ...mapActions([
                'success',
                'error',
            ]),
            save() {
                this.$v.form.$touch()

                if (this.$v.$invalid) {
                    this.error('Error')
                } else {
                    let self = this
                    self.loading = true;

                    axios.post(self.functionUrl + '/updateUser', this.form)
                        .then(() => {
                            self.$emit('edited', self.editItem)
                            self.$v.$reset()
                            self.$refs.form.reset()
                            self.success('Administrator updated')
                            self.dialog = false
                            self.loading = false;
                        })
                }
            },
        }
    }
</script>
