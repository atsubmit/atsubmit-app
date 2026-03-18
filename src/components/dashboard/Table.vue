<script setup lang="ts">
defineProps<{
    headers: string[];
}>();
</script>

<template>
    <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
            <thead>
                <tr class="border-b border-border">
                    <th
                        v-for="(header, i) in headers"
                        :key="i"
                        class="px-4 py-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider"
                    >
                        {{ header }}
                    </th>
                </tr>
            </thead>

            <tbody class="divide-y divide-border">
                <slot></slot>
            </tbody>
        </table>
    </div>
</template>
