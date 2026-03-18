<script setup lang="ts">
defineProps<{
    title: string;
    description?: string;
}>();
</script>

<template>
    <div
        class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
    >
        <div>
            <slot name="title">
                <h1 class="text-3xl font-bold tracking-tight">
                    {{ title }}
                </h1>
            </slot>

            <slot name="description">
                <p v-if="description" class="text-muted-foreground mt-1">
                    {{ description }}
                </p>
            </slot>
        </div>

        <div class="flex items-center gap-3">
            <slot name="actions" />
        </div>
    </div>
</template>
