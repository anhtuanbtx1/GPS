<!-- eslint-disable vue/multi-word-component-names -->
<template>
<div modal="true">
    <div>
        <div v-if="visible" :data-modal="name" class="modal">
            <div aria-modal="true" data-reach-dialog-content="true" tabindex="-1" class="modal_mask">
                <div class="modal_body">
                    <slot :payload="payload">
                    </slot>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import VModal from './handle';


export default {
    props: {
        name: {
            type: String,
            required: true,
        }
    },
    data() {
        return {
            payload: null,
            visible: false
        }
    },
    beforeMount() {
      console.log("Enter Bus");
        VModal.EvenBus.$on('open', params => {
            if (this.name === params.name) {
                this.open(params)
            }
        })

        VModal.EvenBus.$on('close', params => {
            if (this.name === params.name) {
                this.close(params)
            }
        })

    },
    methods: {
        close(params) {
            this.visible = false
        },
        open(params) {
            this.visible = true
        },
    },
}
</script>
