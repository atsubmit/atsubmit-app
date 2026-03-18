<script setup lang="ts">
import DashboardHeader from '@/components/dashboard/DashboardHeader.vue'
import Card from '@/components/dashboard/Card.vue'
import Table from '@/components/dashboard/Table.vue'
import { Filter, Download, MoreVertical, Shield, ChevronRight, ChevronLeft } from 'lucide-vue-next'
import type { DashboardSubmissionRow } from './DashboardSubmissionTable.types';

defineProps<{
    submissions: DashboardSubmissionRow[]
}>()

const emit = defineEmits<{
    (e: 'select', submission: DashboardSubmissionRow): void
}>()
</script>

<template>
    <div class="space-y-8 animate-in fade-in duration-500">
        <DashboardHeader
            title="Submissions"
            description="View and manage all data received through your forms."
        >
            <template #actions>
                <div class="flex items-center gap-3">
                    <button class="btn-secondary flex items-center gap-2 py-2">
                        <Filter :size="18" /> Filter
                    </button>
                    <button class="btn-secondary flex items-center gap-2 py-2">
                        <Download :size="18" /> Export CSV
                    </button>
                </div>
            </template>
        </DashboardHeader>

        <Card class="p-0">
            <Table :headers="['Form', 'Preview', 'Time', 'Status', 'Actions']">
                <tr
                    v-for="sub in submissions"
                    :key="sub.id"
                    class="hover:bg-muted/50 transition-colors cursor-pointer"
                    @click="emit('select', sub)"
                >
                    <td class="px-4 py-4 font-medium">
                        {{ sub.form }}
                    </td>

                    <td class="px-4 py-4 text-sm text-muted-foreground truncate max-w-[300px]">
                        {{
                            Object.entries(sub.data)
                                .map(([k, v]) => `${k}: ${v}`)
                                .join(', ')
                        }}
                    </td>

                    <td class="px-4 py-4 text-sm text-muted-foreground">
                        {{ sub.time }}
                    </td>

                    <td class="px-4 py-4">
                        <span
                            v-if="sub.spam"
                            class="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded-full w-fit"
                        >
                            <Shield :size="12" /> Spam
                        </span>
                        <span
                            v-else
                            class="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full w-fit"
                        >
                            <Shield :size="12" /> Safe
                        </span>
                    </td>

                    <td class="px-4 py-4">
                        <button class="p-2 rounded-lg hover:bg-muted text-muted-foreground">
                            <MoreVertical :size="18" />
                        </button>
                    </td>
                </tr>
            </Table>

            <div class="px-6 py-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
                <p>Showing 1-3 of 1,284 submissions</p>
                <div class="flex items-center gap-2">
                    <button class="p-1 rounded hover:bg-muted disabled:opacity-50" disabled>
                        <ChevronLeft :size="18" />
                    </button>
                    <button class="p-1 rounded hover:bg-muted">
                        <ChevronRight :size="18" />
                    </button>
                </div>
            </div>
        </Card>
    </div>
</template>