<template>
    <v-layout column>
        <v-list>
            <v-list-item>
                <v-list-item-icon>
                    <v-img
                            :src="require('../../assets/logo.svg')"
                            contain
                            height="100%"
                            width="50px"
                    ></v-img>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title>MTKP</v-list-item-title>
                    <v-list-item-subtitle>Admin Panel</v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list
                dense
                nav
                rounded
        >
<!--            <v-list-item link to="/dashboard">-->
<!--                <v-list-item-icon>-->
<!--                    <v-icon>mdi-view-dashboard-outline</v-icon>-->
<!--                </v-list-item-icon>-->

<!--                <v-list-item-content>-->
<!--                    <v-list-item-title>Dashboard</v-list-item-title>-->
<!--                </v-list-item-content>-->
<!--            </v-list-item>-->
            <v-list-item link to="/">
                <v-list-item-icon>
                    <v-icon>mdi-account-circle-outline</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                    <v-list-item-title>Profile</v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <v-list-item link to="/app-users">
                <v-list-item-icon>
                    <v-icon>mdi-account-multiple-outline</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                    <v-list-item-title>App Users</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item link to="/administrators">
                <v-list-item-icon>
                    <v-icon>mdi-shield-account</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                    <v-list-item-title>Administrators</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-layout>
</template>

<script>
    export default {
        name: "AdminNav"
    }
</script>

<style scoped>

</style>