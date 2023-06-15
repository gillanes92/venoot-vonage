<template>
    <button :class="size" :disabled="!active">
        <Panel :class="['h-full', innerClasses]" :fit="false" @click="emitClick">
            <Spinner v-if="loading" class="mt-0.5 mr-1" />
            <slot />
        </Panel>
    </button>
</template>

<script setup>
import { computed } from 'vue'
import Spinner from '../Spinners/Spinner.vue'
import Panel from '../Panels/Panel.vue'

const emit = defineEmits(['button-click'])
const props = defineProps({
    size: {
        type: String, default: 'base', validator: (value) => {
            return ['fit', 'xs', 'sm', 'base', 'lg, xl'].includes(value)
        }
    },
    innerClasses: { type: String, default: ''},
    active: { type: Boolean, default: true },
    loading: { type: Boolean, default: false },
})

const size = computed(() => {
    switch (props.size) {
        case 'fit': return 'h-fit'
        case 'xs': return 'h-6'
        case 'sm': return 'h-8'
        case 'base': return 'h-10'
        case 'lg': return 'h-12'
        case 'xl': return 'h-14'
    }
})

const emitClick = () => {
    if (props.active) {
        emit('button-click')
    }
}
</script>

<style scoped></style>