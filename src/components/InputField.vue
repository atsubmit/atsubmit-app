<template>
    <div>
        <label class="text-sm font-medium text-foreground" :for="input?.id">
            {{ label }}
        </label>

        <div class="relative flex items-center">
            <!-- prepend -->
            <div
                v-if="$slots.prepend || icon"
                class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground flex items-center"
            >
                <slot name="prepend">
                    <component v-if="icon" :is="icon" :size="18" />
                </slot>
            </div>

            <!-- input -->
            <slot
                :classes="[
                    'w-full py-2.5 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-apple-blue/50 transition-all',
                    $slots.prepend || icon ? 'pl-10' : 'pl-4',
                    $slots.append ? 'pr-10' : 'pr-4',
                ]"
                :input="input"
            >
                <input
                    v-bind="input"
                    class="w-full py-2.5 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-apple-blue/50 transition-all"
                    :class="[
                        $slots.prepend || icon ? 'pl-10' : 'pl-4',
                        $slots.append ? 'pr-10' : 'pr-4',
                    ]"
                />
            </slot>

            <!-- append -->
            <div
                v-if="$slots.append"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground flex items-center"
            >
                <slot name="append"></slot>
            </div>
        </div>

        <!-- errors -->
        <InputFieldError v-if="error" :error="error" class="mt-1" />
    </div>
</template>

<script setup lang="ts">
import type { InputHTMLAttributes } from "vue";
import InputFieldError from "./InputFieldError.vue";

defineProps<{
    label: string;
    icon?: any;
    input?: InputHTMLAttributes;
    error?: string | string[];
}>();
</script>
