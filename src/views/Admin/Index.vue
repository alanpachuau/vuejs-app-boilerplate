<template>
    <div class="home">
        Admin Home
    </div>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        name: 'admin',
        data: () => ({}),
        computed: {
            ...mapState([
                'currentUser'
            ])
        },
        methods: {}
    }
</script>
