<template>
    <v-dialog
            color="pink"
            v-model="dialog"
            width="350"
    >
        <v-card
                :loading="loading">

            <v-card-text class="pb-4 pt-7 text-center">
                Confirm delete {{ deleteItem? '"' + deleteItem.data.name + '"':'' }}"?
            </v-card-text>

            <v-card-actions class="pb-4 px-4">
                <v-spacer/>
                <v-btn
                        color="grey"
                        dark
                        @click="dialog = false"
                        small
                        rounded
                        class="px-5"
                >
                    <small>CANCEL</small>
                </v-btn>

                <v-btn
                        color="red"
                        dark
                        @click="erase"
                        small
                        rounded
                        class="px-5"
                >
                    <small>DELETE</small>
                </v-btn>
                <v-spacer/>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import {mapState, mapActions} from 'vuex';
    import axios from 'axios'

    export default {
        name: 'DeleteAdministrator',
        props: {
            deleteItem: Object
        },
        data() {
            return {
                dialog: false,
                loading: false,
            }
        },
        watch: {
            deleteItem: function () {
                this.dialog = true
            }
        },
        computed: {
            ...mapState([
                'functionUrl',
            ]),
        },
        methods: {
            ...mapActions([
                'success',
                'error',
            ]),
            erase() {
                let self = this;
                self.loading = false;

                axios.post(self.functionUrl + '/eraseUser', {uid: self.deleteItem.data.id})
                    .then(() => {
                        self.success("Deleted successfully")
                        self.$emit('erased', self.deleteItem);
                        self.loading = false;
                        self.dialog = false
                    })
            },
        }
    }
</script>
