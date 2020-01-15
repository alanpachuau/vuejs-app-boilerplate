<template>
    <v-card elevation="0" color="transparent">
        <v-row class="px-3 py-3">
            <v-col cols="12" md="8">
                <v-card elevation="0" color="transparent" tile>
                    <v-data-table
                            :headers="headers"
                            :items="items"
                            :search="search"
                            :loading="dataLoading"
                            loading-text="Loading... Please wait"
                            class="elevation-0"
                            hide-default-footer
                    >
                        <template v-slot:item.action="{ item }">
                            <v-btn color="primary lighten-2" x-small fab text dark @click="edit(item)">
                                <v-icon>mdi-lead-pencil</v-icon>
                            </v-btn>
                            <v-btn color="red lighten-2" x-small fab text dark @click="erase(item)">
                                <v-icon>mdi-delete</v-icon>
                            </v-btn>
                        </template>

                        <template v-slot:item.created="{item}">
                            {{ item.updated !== '' ? item.updated : item.created }}
                        </template>

                        <template v-slot:footer>
                            <v-divider v-show="!moreLoading"></v-divider>
                            <v-progress-linear
                                    v-show="moreLoading"
                                    indeterminate
                                    color="orange darken-1"
                                    height="2"
                            ></v-progress-linear>
                            <v-toolbar flat dense>
                                <v-subheader>Showing: {{ noMore ? 'All ' : '' }}{{ items.length }} Items</v-subheader>
                                <v-spacer></v-spacer>
                                <v-btn text rounded small color="primary" @click="more" :disabled="noMore">
                                    <v-icon>mdi-dots-horizontal</v-icon>
                                    More
                                </v-btn>
                            </v-toolbar>
                        </template>
                    </v-data-table>

                    <edit v-bind:editItem="editItem" v-on:edited="onEdited" />

                    <delete v-bind:deleteItem="deleteItem" v-on:erased="onErased" />

                </v-card>
            </v-col>
            <v-col cols="12" md="4">
                <new v-on:created="onCreated" />
            </v-col>
        </v-row>
    </v-card>
</template>

<script>
    import {mapState} from 'vuex'
    import {firestore} from '@/plugins/firebase'
    import {format} from 'date-fns'

    import New from '@/components/Admin/NewAdministrator.vue'
    import Edit from '@/components/Admin/EditAdministrator.vue'
    import Delete from '@/components/Admin/DeleteAdministrator.vue'

    export default {
        name: 'Administrators',
        components: {
            New,
            Edit,
            Delete,
        },
        data: () => ({
            items: [],
            editItem: null,
            deleteItem: null,
            lastItem: null,
            search: '',
            dataLoading: false,
            moreLoading: false,
            noMore: false,
            headers: [
                {
                    text: 'Name',
                    align: 'left',
                    sortable: false,
                    value: 'name',
                },
                {
                    text: 'Email',
                    align: 'left',
                    sortable: false,
                    value: 'email',
                },
                {
                    text: 'Last Updated',
                    align: 'left',
                    sortable: false,
                    value: 'created',
                },
                {text: 'Actions', value: 'action', sortable: false},
            ],
        }),
        computed: {
            ...mapState([
                'perPage',
            ])
        },
        created() {
            this.fetchData()
        },
        methods: {
            fetchData() {
                var self = this;
                self.dataLoading = true

                firestore.collection('users')
                    .where('role', '==', 'admin')
                    .orderBy('name', 'asc')
                    .limit(this.perPage)
                    .get()
                    .then(function (snapshot) {
                        self.items = []

                        snapshot.forEach((row) => {
                            self.items.push({
                                id: row.id,
                                name: row.data().name,
                                email: row.data().email,
                                created: row.data().created ? format(row.data().created, 'dd MMM yyyy') : '',
                                updated: row.data().updated ? format(row.data().updated, 'dd MMM yyyy') : '',
                            })

                            self.lastItem = row
                        })

                        self.dataLoading = false
                    })
            },
            more() {
                var self = this;
                self.moreLoading = true
                self.noMore = false

                firestore.collection('users')
                    .where('role', '==', 'admin')
                    .orderBy('name', 'asc')
                    .startAfter(self.lastItem)
                    .limit(this.perPage)
                    .get()
                    .then(function (snapshot) {
                        if (snapshot.empty) {
                            self.noMore = true
                        } else {
                            snapshot.forEach((row) => {
                                self.items.push({
                                    id: row.id,
                                    name: row.data().name,
                                    email: row.data().email,
                                    created: row.data().created ? format(row.data().created, 'dd MMM yyyy') : '',
                                    updated: row.data().updated ? format(row.data().updated, 'dd MMM yyyy') : '',
                                })

                                self.lastItem = row
                            })
                        }

                        self.moreLoading = false
                    })
            },
            edit(item) {
                this.editItem = {
                    data: item,
                    time: new Date().getTime()
                }
            },
            erase(item) {
                this.deleteItem = {
                    data: item,
                    time: new Date().getTime()
                }
            },
            onCreated(item) {
                if(item) {
                    this.fetchData()
                }
            },
            onErased(item) {
                if(item) {
                    this.fetchData()
                }
            },
            onEdited(item) {
                if(item) {
                    this.fetchData()
                }
            },
        },
    }
</script>
