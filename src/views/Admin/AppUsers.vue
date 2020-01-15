<template>
    <v-card elevation="0" color="transparent">
        <v-row class="px-3">
            <v-col cols="12">
                <v-card elevation="0" color="white" tile>
                    <v-card-title class="py-0">
                        <v-row>
                            <v-col cols="12" md="3">
                                <v-select
                                        @change="fetchData"
                                        single-line
                                        hide-details
                                        clearable
                                        :items="userTypes"
                                        label="User Type"
                                        v-model="userType"
                                ></v-select>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field
                                        @keyup="searchFilter"
                                        v-model="search"
                                        append-icon="mdi-magnify"
                                        label="Search"
                                        single-line
                                        hide-details
                                        clearable
                                        @click:clear="fetchData"
                                ></v-text-field>
                            </v-col>
                        </v-row>

                    </v-card-title>

                    <v-data-table
                            :headers="headers"
                            :items="items"
                            :loading="dataLoading"
                            loading-text="Loading... Please wait"
                            class="elevation-0"
                            hide-default-footer
                            :items-per-page="itemsPerPage"
                    >
                        <template v-slot:item.action="{ item }">
                            <v-btn color="red lighten-2" x-small fab text dark @click="erase(item)">
                                <v-icon>mdi-delete</v-icon>
                            </v-btn>
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

                    <delete-user v-bind:deleteItem="deleteItem"/>
                </v-card>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>
    import {mapState} from 'vuex'
    import {firestore} from '@/plugins/firebase'
    import {appUsersIndex} from '@/plugins/algolia'
    import DeleteUser from '@/components/Admin/DeleteAppUser.vue'

    export default {
        name: 'appUsers',
        components: {
            DeleteUser,
        },
        data: () => ({
            items: [],
            editItem: null,
            lastItem: null,
            deleteItem: null,
            search: '',
            userType: '',
            dataLoading: false,
            moreLoading: false,
            noMore: false,
            headers: [
                {
                    text: 'Name',
                    align: 'left',
                    sortable: true,
                    value: 'name',
                },
                {
                    text: 'Phone',
                    align: 'left',
                    sortable: false,
                    value: 'phone',
                },
                {
                    text: 'School',
                    align: 'left',
                    sortable: false,
                    value: 'school',
                },
                {
                    text: 'Last Logged In',
                    align: 'left',
                    sortable: false,
                    value: 'lastLoggedIn',
                },
                {
                    text: 'Type',
                    align: 'left',
                    sortable: false,
                    value: 'userType',
                },
                {text: '', value: 'action', sortable: false, align: 'right'},
            ],
            itemsPerPage: 0,
        }),
        computed: {
            ...mapState([
                'perPage',
                'userTypes'
            ])
        },
        created() {
            this.fetchData()
            this.itemsPerPage = this.perPage
        },
        methods: {
            fetchData() {
                var self = this;
                self.dataLoading = true
                self.noMore = false

                let q = firestore.collection('appUsers')

                if (self.userType) {
                    q = q.where('userType', '==', self.userType)
                }

                q.orderBy('name', 'asc')
                    .limit(this.perPage)
                    .get()
                    .then(function (snapshot) {
                        self.items = []
                        self.itemsPerPage = self.perPage

                        snapshot.forEach((row) => {
                            self.items.push({
                                objectID: row.id,
                                id: row.id,
                                name: row.data().name,
                                age: row.data().age,
                                classLevel: row.data().classLevel,
                                school: row.data().school,
                                subject: row.data().subject,
                                userType: row.data().userType,
                                phone: row.data().phone,
                                created: row.data().created,
                                lastLoggedIn: row.data().lastLoggedIn,
                            })

                            self.lastItem = row
                        })

                        self.saveIndex(self.items);

                        self.dataLoading = false
                    })
            },
            more() {
                var self = this;
                self.moreLoading = true
                self.noMore = false

                let q = firestore.collection('appUsers')

                if (self.userType) {
                    q = q.where('userType', '==', self.userType)
                }

                q.orderBy('name', 'asc')
                    .startAfter(self.lastItem)
                    .limit(this.perPage)
                    .get()
                    .then(function (snapshot) {
                        if (snapshot.empty) {
                            self.noMore = true
                        } else {
                            self.itemsPerPage += self.perPage

                            snapshot.forEach((row) => {
                                self.items.push({
                                    objectID: row.id,
                                    id: row.id,
                                    name: row.data().name,
                                    age: row.data().age,
                                    classLevel: row.data().classLevel,
                                    school: row.data().school,
                                    subject: row.data().subject,
                                    userType: row.data().userType,
                                    phone: row.data().phone,
                                    created: row.data().created,
                                    lastLoggedIn: row.data().lastLoggedIn,
                                })

                                self.lastItem = row
                            })

                            self.saveIndex(self.items);
                        }

                        self.moreLoading = false
                    })
            },
            erase(item) {
                this.deleteItem = {
                    data: item,
                    time: new Date().getTime()
                }
            },
            searchFilter() {
                let self = this
                if (this.search.length >= 2) {
                    this.items = []

                    let filters = this.category ? 'category:"' + this.category + '"' : ''

                    appUsersIndex.search({
                        query: this.search,
                        filters: filters,
                        hitsPerPage: 100,
                    }).then(function (response) {
                        self.noMore = true
                        self.itemsPerPage = response.nbHits

                        response.hits.forEach((hit) => {
                            self.items.push({
                                objectID: hit.objectId,
                                id: hit.objectId,
                                name: hit.name,
                                age: hit.age,
                                classLevel: hit.classLevel,
                                school: hit.school,
                                subject: hit.subject,
                                userType: hit.userType,
                                phone: hit.phone,
                                created: hit.created,
                                lastLoggedIn: hit.lastLoggedIn,
                            })
                        })
                    })
                }
            },
            saveIndex(records) {
                appUsersIndex
                    .saveObjects(records)
                    .then(() => {
                    })
                    .catch(error => {
                        self.error('Error when importing data into Algolia', error);
                        process.exit(1);
                    });
            }
        },
    }
</script>
