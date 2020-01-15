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
    import axios from 'axios';
    import {appUsersIndex} from "@/plugins/algolia"

    export default {
        name: 'DeleteAppUser',
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
                'startLoading',
                'stopLoading',
                'error',
            ]),
            erase() {
                let self = this;
                self.loading = true;

                axios.post(self.functionUrl + '/eraseAppUser', {uid: self.deleteItem.data.id})
                    .then(() => {
                        appUsersIndex.deleteObject(self.deleteItem.data.id, (err) => {
                            if (err) throw err;

                            self.success("Deleted successfully")
                            self.loading = false;
                            self.dialog = false;
                            // console.log(content)
                        });
                    })
            },
        }
    }
</script>
