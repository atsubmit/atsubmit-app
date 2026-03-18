<script setup lang="ts">
import DashboardHeader from "@/components/dashboard/DashboardHeader.vue";
import Card from "@/components/dashboard/Card.vue";
import Table from "@/components/dashboard/Table.vue";
import {
    Filter,
    Download,
    Shield,
    ChevronRight,
    ChevronLeft,
    ShieldQuestionMark,
} from "lucide-vue-next";
import type {
    Badge,
    DashboardSubmissionItem,
    DashboardSubmissionRow,
    HeaderPreview,
} from "./DashboardSubmissionPage.types";
import { computed, onMounted, ref } from "vue";

const prosp = defineProps<{
    page?: number;
    itemPerPage?: number;
    totalItems?: number;
}>();

const submissions = ref<DashboardSubmissionRow[]>([]);
const pageNUmber = ref(1);
const itemPerPage = ref(10);
const totalItems = ref(0);

const startPosition = computed(() => {
    if (totalItems.value === 0) return 0;
    return (pageNUmber.value - 1) * itemPerPage.value + 1;
});

const endPosition = computed(() => {
    if (totalItems.value === 0) return 0;
    return Math.min(totalItems.value, pageNUmber.value * itemPerPage.value);
});

const paginateFooter = computed(() => {
    if (totalItems.value === 0) {
        return "Showing 0 of 0 submissions";
    }
    return `Showing ${startPosition.value}-${endPosition.value} of ${totalItems.value} submissions`;
});
const hasPrev = computed(() => {
    return pageNUmber.value > 1;
});

const totalPages = computed(() => {
    return Math.ceil(totalItems.value / itemPerPage.value);
});
const hasNext = computed(() => {
    return pageNUmber.value < totalPages.value;
});

const visiblePages = computed(() => {
    const total = totalPages.value;
    const current = pageNUmber.value;

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

    if (typeof firstPage === "number" && firstPage > 1) {
        items.push({ type: "page", value: 1 });
    }

    if (typeof firstPage === "number" && firstPage > 2) {
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

const buildSubmissionSummary = (
    headers: Record<string, any>,
): HeaderPreview => {
    // normalize
    const normalized: Record<string, string> = {};

    for (const key in headers) {
        const v = headers[key];
        normalized[key.toLowerCase()] = Array.isArray(v) ? v[0] : String(v);
    }

    const get = (k: string) => normalized[k];

    const ua = get("user-agent") || "";

    const contentTypeBadges: Badge[] = [];
    const contentType = get("content-type") || "";

    if (contentType.includes("application/json")) {
        contentTypeBadges.push({
            label: "JSON",
            tone: "blue",
            hint: "application/json",
        });
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
        contentTypeBadges.push({
            label: "Form",
            tone: "green",
            hint: "application/x-www-form-urlencoded",
        });
    } else if (contentType.includes("multipart/form-data")) {
        contentTypeBadges.push({
            label: "Multipart",
            tone: "yellow",
            hint: "multipart/form-data",
        });
    } else {
        contentTypeBadges.push({
            label: "Other",
            tone: "gray",
            hint: contentType,
        });
    }

    return {
        ua,
        contentTypeBadges: contentTypeBadges,
    };
};

const getPage = async () => {
    const page = pageNUmber.value;
    const ipp = itemPerPage.value;

    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("ipp", ipp.toString());

    submissions.value = [];

    const result = await fetch(`/webapi/dashboard/submissions?${params}`, {
        method: "GET",
    });

    if (result.ok) {
        const json: unknown = await result.json();
        if (json && typeof json === "object") {
            if ("items" in json && !!json.items && Array.isArray(json.items)) {
                const items: DashboardSubmissionItem[] = json.items;
                submissions.value = items.map((item) => {
                    const submittedAt = new Date(
                        item.created_at,
                    ).toLocaleString();
                    const submittedAtUTC = new Date(
                        item.created_at,
                    ).toUTCString();
                    return {
                        id: item.id,
                        detailHref: `/dashboard/submission/${item.id}`,

                        submittedAt: submittedAt,
                        submittedAtUTC: submittedAtUTC,
                        formHref: `/dashboard/form/${item.endpoint_slug}`,
                        formName: item.form_name,

                        preview: item.raw_headers
                            ? buildSubmissionSummary(item.raw_headers)
                            : null,

                        spamScore: item.spam_score,
                        spamReasons: item.spam_reasons,
                        spamCheckedAt: item.spam_checked_at,
                    } satisfies DashboardSubmissionRow;
                });
            }

            if ("total" in json && typeof json.total === "number") {
                totalItems.value = json.total;
            }
        }
    }
};

onMounted(async () => {
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
            <Table :headers="['Id', 'Time', 'Form', 'Preview', 'Status']">
                <tr
                    v-for="(item, index) in submissions"
                    :key="index"
                    class="hover:bg-muted/50 transition-colors cursor-pointer"
                >
                    <td class="px-4 py-4 font-medium">
                        <a
                            :href="item.detailHref"
                            class="underline text-blue-500"
                        >
                            <span>#</span>
                            <span>{{ item.id.slice(0, 8) }}</span>
                        </a>
                    </td>

                    <td class="px-4 py-4 text-sm text-muted-foreground">
                        <p :title="item.submittedAtUTC">
                            {{ item.submittedAt }}
                        </p>
                    </td>

                    <td class="px-4 py-4 font-medium">
                        <a
                            :href="item.formHref"
                            class="underline text-blue-500"
                        >
                            {{ item.formName }}
                        </a>
                    </td>

                    <td
                        class="px-4 py-4 text-sm text-muted-foreground truncate max-w-75"
                    >
                        <div
                            v-if="item.preview"
                            class="p-3 rounded-lg space-y-2 text-sm"
                        >
                            <!-- User Agent -->
                            <div
                                class="flex-1 min-w-0"
                                :title="item.preview.ua"
                            >
                                <span class="text-gray-500 font-bold shrink-0"
                                    >User Agent:</span
                                >
                                <p class="text-sm">
                                    {{ item.preview.ua }}
                                </p>
                            </div>

                            <!-- Content Type -->
                            <div class="flex gap-2 items-center">
                                <span class="text-gray-500 font-bold shrink-0"
                                    >Content Type:</span
                                >

                                <div class="flex flex-wrap gap-1">
                                    <span
                                        v-for="b in item.preview
                                            .contentTypeBadges"
                                        :key="b.label"
                                        class="px-2 py-0.5 text-xs rounded-md"
                                        :class="{
                                            'bg-blue-100 text-blue-700':
                                                b.tone === 'blue',
                                            'bg-green-100 text-green-700':
                                                b.tone === 'green',
                                            'bg-yellow-100 text-yellow-700':
                                                b.tone === 'yellow',
                                            'bg-red-100 text-red-700':
                                                b.tone === 'red',
                                            'bg-gray-100 text-gray-700':
                                                b.tone === 'gray',
                                        }"
                                        :title="b.hint"
                                    >
                                        {{ b.label }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </td>

                    <td class="px-4 py-4">
                        <template v-if="typeof item.spamScore === 'number'">
                            <span
                                v-if="item.spamScore"
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
                        </template>
                        <span
                            v-else
                            class="flex items-center gap-1 text-xs font-bold text-yellow-500 bg-emerald-500/10 px-2 py-1 rounded-full w-fit"
                        >
                            <ShieldQuestionMark :size="12" /> Unscored
                        </span>
                    </td>

                    <td class="px-4 py-4"></td>
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
                                'bg-muted font-medium':
                                    item.value === pageNUmber,
                            }"
                            @click="pageNUmber = item.value"
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
