<script setup lang="ts">
import type { InputHTMLAttributes } from "vue";
const model = defineModel({ type: Boolean, default: false });

defineProps<{
    input?: InputHTMLAttributes;
}>();
</script>

<template>
    <label class="inline-flex items-center cursor-pointer">
        <input
            type="checkbox"
            class="sr-only peer"
            v-model="model"
            v-bind="input"
        />

        <div
            :class="[
                'relative w-12 h-6 rounded-full',
                'bg-slate-300',
                'peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-apple-blue/50',

                'after:content-[\'\'] after:absolute after:top-1 after:start-1',
                'after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-all',
                'peer-checked:bg-apple-blue peer-checked:after:translate-x-6',
            ]"
        ></div>
    </label>
</template>
