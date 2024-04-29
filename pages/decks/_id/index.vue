<template>
<div>
    <div class="ct">
        <div class="a">
            <h3></h3>
            <a-button type="primary" @click.prevent="openModal">Create</a-button>
        </div>
        <ul></ul>
    </div>
    <v-modal name="test">
        <div>
            <h1>My test</h1>
            <a-button type="primary" style="background-color: brown;" @click.prevent="closeModal">Close</a-button>
        </div>
    </v-modal>
</div>
</template>

<script>
export default {
    methods: {
        openModal() {
            this.$modal.open({
                name: 'test'
            })
        },
        closeModal() {
            this.$modal.close({
                name: 'test'
            })
        }
    }
}
</script>
