<script setup lang="ts">
import DashboardHeader from "@/components/dashboard/DashboardHeader.vue";
import Card from "@/components/dashboard/Card.vue";
import Table from "@/components/dashboard/Table.vue";
import {
    Filter,
    Download,
    MoreVertical,
    Shield,
    ChevronRight,
    ChevronLeft,
} from "lucide-vue-next";
import type { DashboardSubmissionRow } from "./DashboardSubmissionPage.types";
import { computed, onBeforeMount, ref } from "vue";

const prosp = defineProps<{
    page?: number;
    itemPerPage?: number;
    totalItems?: number;
}>();

const submissions = ref<DashboardSubmissionRow[]>([]);
const page = ref(1);
const itemPerPage = ref(10);
const totalItems = ref(0);

const startPosition = computed(() => {
    if (totalItems.value === 0) return 0;
    return (page.value - 1) * itemPerPage.value + 1;
});

const endPosition = computed(() => {
    if (totalItems.value === 0) return 0;
    return Math.min(totalItems.value, page.value * itemPerPage.value);
});

const paginateFooter = computed(() => {
    if (totalItems.value === 0) {
        return "Showing 0 of 0 submissions";
    }
    return `Showing ${startPosition.value}-${endPosition.value} of ${totalItems.value} submissions`;
});
const hasPrev = computed(() => {
    return page.value > 1;
});

const totalPages = computed(() => {
    return Math.ceil(totalItems.value / itemPerPage.value);
});
const hasNext = computed(() => {
    return page.value < totalPages.value;
});

const visiblePages = computed(() => {
    const total = totalPages.value;
    const current = page.value;

    if (total <= 3) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }

    let start = current - 1;
    let end = current + 1;

    if (start < 1) {
        start = 1;
        end = 3;
    }

    if (end > total) {
        end = total;
        start = total - 2;
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

type PaginationItem = { type: "page"; value: number } | { type: "ellipsis" };

const paginationItems = computed<PaginationItem[]>(() => {
    const total = totalPages.value;
    const pages = visiblePages.value;

    if (total <= 3) {
        return pages.map((p) => ({ type: "page", value: p }));
    }

    const items: PaginationItem[] = [];

    const firstPage = pages[0];
    const lastPage = pages[pages.length - 1];

    if (typeof pages[0] === "number" && pages[0] > 1) {
        items.push({ type: "page", value: 1 });
    }

    if (typeof pages[0] === "number" && pages[0] > 2) {
        items.push({ type: "ellipsis" });
    }

    items.push(
        ...pages.map(
            (p) => ({ type: "page", value: p }) satisfies PaginationItem,
        ),
    );

    if (typeof lastPage === "number" && lastPage < total - 1) {
        items.push({ type: "ellipsis" });
    }

    if (typeof lastPage === "number" && lastPage < total) {
        items.push({ type: "page", value: total });
    }

    return items;
});

const getPage = () => {
    return fetch("/webapi/dashboard/submissions", {
        method: "GET",
    });
};

onBeforeMount(async () => {
    const result = await getPage();
});
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
                >
                    <a :href="`/dashboard/submission/${sub.id}`">
                        <td class="px-4 py-4 font-medium">
                            {{ sub.form }}
                        </td>

                        <td
                            class="px-4 py-4 text-sm text-muted-foreground truncate max-w-[300px]"
                        >
                            {{
                                Object.entries(sub.data)
                                    .map(([k, v]) => `${k}: ${v}`)
                                    .join(", ")
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
                            <button
                                class="p-2 rounded-lg hover:bg-muted text-muted-foreground"
                            >
                                <MoreVertical :size="18" />
                            </button>
                        </td>
                    </a>
                </tr>
            </Table>

            <div
                class="px-6 py-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground"
            >
                <p>{{ paginateFooter }}</p>
                <div class="flex items-center gap-2">
                    <button
                        class="p-1 rounded hover:bg-muted disabled:opacity-50"
                        :disabled="hasPrev"
                    >
                        <ChevronLeft :size="18" />
                    </button>
                    <template
                        v-for="item in paginationItems"
                        :key="item.type === 'page' ? item.value : 'dots'"
                    >
                        <button
                            v-if="item.type === 'page'"
                            class="px-2 py-1 rounded hover:bg-muted"
                            :class="{
                                'bg-muted font-medium': item.value === page,
                            }"
                            @click="page = item.value"
                        >
                            {{ item.value }}
                        </button>

                        <span v-else class="px-2">...</span>
                    </template>
                    <button
                        class="p-1 rounded hover:bg-muted"
                        :disabled="hasNext"
                    >
                        <ChevronRight :size="18" />
                    </button>
                </div>
            </div>
        </Card>
    </div>
</template>
