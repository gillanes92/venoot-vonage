<template>
    <Panel :class="['flex justify-center select-none', { 'cursor-pointer': active }, size]" :fit="false" @click="emitClick">
        <slot />
    </Panel>
</template>

<script setup>
import { computed } from 'vue'
import Panel from '../Panels/Panel.vue'

const emit = defineEmits(['button-click'])
const props = defineProps({
    size: {
        type: String, default: 'base', validator: (value) => {
            return ['fit', 'xs', 'sm', 'base', 'lg, xl'].includes(value)
        }
    },
    active: { type: Boolean, default: true },
})

const size = computed(() => {
    switch (props.size) {
        case 'fit': return 'w-fit h-fit'
        case 'xs': return 'w-8 h-8'
        case 'sm': return 'w-12 h-12'
        case 'base': return 'w-16 h-16'
        case 'lg': return 'w-20 h-20'
        case 'xl': return 'w-24 h-24'
    }
})

const emitClick = () => {
    if (props.active) {
        emit('button-click')
    }
}
</script>
 
<style scoped></style>