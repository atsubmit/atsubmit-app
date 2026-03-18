<template>
    <div>
        <label
            class="text-sm font-medium dark:text-foreground/90"
            :class="[
                !!input?.disabled
                    ? 'text-muted-foreground dark:text-muted-foreground/80'
                    : 'text-foreground dark:text-foreground/80',
            ]"
            :for="input?.id"
        >
            {{ label }}
        </label>

        <div
            class="relative flex items-center"
            :class="{ 'opacity-60': input?.disabled }"
        >
            <!-- prepend -->
            <div
                v-if="$slots.prepend || icon"
                class="absolute left-3 top-1/2 -translate-y-1/2 flex items-center"
                :class="[
                    !!input?.disabled
                        ? 'text-muted-foreground dark:text-muted-foreground/80'
                        : 'text-foreground dark:text-foreground/80',
                ]"
            >
                <slot name="prepend">
                    <component v-if="icon" :is="icon" :size="18" />
                </slot>
            </div>

            <!-- input -->
            <slot
                :classes="[
                    ...inputClasses,
                    $slots.prepend || icon ? 'pl-10' : 'pl-4',
                    $slots.append ? 'pr-10' : 'pr-4',
                ]"
                :input="input"
            >
                <input
                    v-bind="input"
                    :class="[
                        ...inputClasses,
                        $slots.prepend || icon ? 'pl-10' : 'pl-4',
                        $slots.append ? 'pr-10' : 'pr-4',
                    ]"
                />
            </slot>

            <!-- append -->
            <div
                v-if="$slots.append"
                class="absolute right-px top-1/2 -translate-y-1/2 text-muted-foreground dark:text-muted-foreground/80 flex items-center"
            >
                <slot name="append"></slot>
            </div>
        </div>

        <!-- hint -->
        <slot name="hint">
            <div>
                <p v-if="hint" class="mt-1 text-xs text-muted-foreground">
                    {{ hint }}
                </p>
            </div>
        </slot>

        <!-- errors -->
        <InputFieldError v-if="error" :error="error" class="mt-1" />
    </div>
</template>

<script setup lang="ts">
import { computed, type InputHTMLAttributes } from "vue";
import InputFieldError from "./InputFieldError.vue";

const props = defineProps<{
    label: string;
    icon?: any;
    input?: InputHTMLAttributes;
    error?: string | string[];
    hint?: string;
}>();

const inputClasses = computed(() => [
    "w-full py-2.5 rounded-lg",

    "border border-foreground/50",
    "dark:border-foreground/50",

    "bg-muted text-foreground",
    "dark:bg-muted/50  dark:text-foreground",

    "placeholder:text-muted-foreground",

    "focus:outline-none focus:ring-2 focus:ring-apple-blue/50",

    "disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-muted/60",
]);
</script>
