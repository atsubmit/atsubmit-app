<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import DashboardHeader from "@/components/dashboard/DashboardHeader.vue";
import Card from "@/components/dashboard/Card.vue";
import {
    Bot,
    ChevronRight,
    Clock,
    Drill,
    Globe,
    Network,
    Shield,
} from "lucide-vue-next";
import type { Submission } from "./DashboardSubmissionDetailPage.types";
import Table from "@/components/dashboard/Table.vue";

const props = defineProps<{
    submission: Submission & {
        form_slug: string;
        form_name: string;
    };
}>();

type UAFlag = "tool" | "bot" | "crawler";
type UAFlagObject = {
    label: string;
    icon: any;
    style: string;
};

type ViewMode = "structured" | "raw";
const viewMode = ref<ViewMode>("structured");
const viewModes = ref<ViewMode[]>(["structured", "raw"]);
const normalizedHeader = ref<Record<string, string>>({});
const userAgent = ref("");
const uaFlags = ref<UAFlagObject[]>([]);
const uaFlagTool: UAFlagObject = {
    style: "bg-yellow-100 text-yellow-700",
    label: "Tools",
    icon: Drill,
};
const uaFlagBot: UAFlagObject = {
    style: "bg-red-100 text-red-700",
    label: "Bot",
    icon: Bot,
};
const uaFlagCrawler: UAFlagObject = {
    style: "bg-red-100 text-red-700",
    label: "Crawler",
    icon: Network,
};

const detectUAFlags = (ua: string): UAFlagObject[] => {
    if (!ua) {
        return [];
    }

    const _ua = ua.toLowerCase();
    const flags: UAFlagObject[] = [];

    // --- tools
    const tools = [
        "postman",
        "curl",
        "wget",
        "insomnia",
        "httpie",
        "node-fetch",
        "axios",
        "python",
    ];

    if (tools.some((t) => _ua.includes(t))) {
        flags.push(uaFlagTool);
    }

    // --- bots / crawlers
    const bots = [
        "googlebot",
        "bingbot",
        "yandex",
        "duckduckbot",
        "baiduspider",
        "slurp",
        "bot",
        "crawler",
        "spider",
    ];

    if (bots.some((b) => _ua.includes(b))) {
        flags.push(uaFlagBot);
    }

    // --- crawlers (more specific)
    if (_ua.includes("crawler") || _ua.includes("spider")) {
        flags.push(uaFlagCrawler);
    }

    return flags;
};

const normalizeHeader = (headers: Record<string, string | null>) => {
    const normalized: Record<string, string> = {};

    for (const key in headers) {
        const value = headers[key] || "";
        normalized[key.toLowerCase()] = Array.isArray(value)
            ? value[0]
            : String(value);
    }

    return normalized;
};

onMounted(() => {
    normalizedHeader.value = props.submission.raw_headers
        ? normalizeHeader(props.submission.raw_headers)
        : {};
    userAgent.value = normalizedHeader.value["user-agent"] || "";
    uaFlags.value = detectUAFlags(userAgent.value);
});
</script>

<template>
    <div class="space-y-8 animate-in slide-in-from-right-4 duration-500">
        <div
            class="flex flex-col items-start sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground mb-4"
        >
            <button class="hover:text-foreground">Submissions</button>
            <div class="flex items-center">
                <ChevronRight :size="14" />
                <span class="text-foreground font-medium">
                    {{ submission.id }}
                </span>
            </div>
        </div>

        <DashboardHeader title="Submission Details">
            <template #description>
                <p class="text-muted-foreground mt-1">
                    <span>Receive new submission for form </span>
                    <a
                        :href="`/dashboard/form/${submission.form_slug}`"
                        class="underline text-blue-500"
                        >{{ submission.form_name }}</a
                    >
                </p>
            </template>
            <template #actions>
                <div
                    class="lg:hidden w-full flex items-center gap-2 bg-muted rounded-apple-lg border border-border overflow-hidden"
                >
                    <button
                        v-for="mode in viewModes"
                        :key="mode"
                        @click="viewMode = mode"
                        :class="[
                            'px-3 py-4 text-lg font-medium rounded-md transition-all capitalize w-1/2',
                            viewMode === mode
                                ? 'bg-card shadow-sm'
                                : 'text-muted-foreground',
                        ]"
                    >
                        {{ mode === "structured" ? "Structured" : "Raw Data" }}
                    </button>
                </div>
            </template>
        </DashboardHeader>

        <div class="grid lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 space-y-8">
                <Card title="Form Data">
                    <div v-if="viewMode === 'structured'" class="space-y-6">
                        <div
                            v-for="(value, key) in submission.payload"
                            :key="key"
                            class="border-b border-border pb-4 last:border-0 last:pb-0"
                        >
                            <label
                                class="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block"
                            >
                                {{ key }}
                            </label>
                            <p class="text-lg">{{ value }}</p>
                        </div>
                    </div>

                    <pre
                        v-else
                        class="whitespace-break-spaces p-4 rounded-lg bg-muted font-mono text-sm overflow-x-auto"
                        >{{ submission.raw_body }}
                    </pre>
                </Card>

                <Card title="Headers">
                    <div v-if="viewMode === 'structured'" class="space-y-6">
                        <div
                            v-for="(value, key) in submission.raw_headers"
                            :key="key"
                            class="border-b border-border pb-4 last:border-0 last:pb-0"
                        >
                            <label
                                class="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block"
                            >
                                {{ key }}
                            </label>
                            <p class="text-lg">{{ value }}</p>
                        </div>
                    </div>

                    <pre
                        v-else
                        class="whitespace-break-spaces p-4 rounded-lg bg-muted font-mono text-sm overflow-x-auto"
                        >{{ submission.raw_headers }}
                    </pre>
                </Card>
            </div>

            <div class="space-y-8">
                <div
                    class="hidden lg:flex items-center gap-2 bg-muted rounded-apple-lg border border-border overflow-hidden"
                >
                    <button
                        v-for="mode in viewModes"
                        :key="mode"
                        @click="viewMode = mode"
                        :class="[
                            'px-3 py-4 text-lg font-medium rounded-md transition-all capitalize w-1/2',
                            viewMode === mode
                                ? 'bg-card shadow-sm'
                                : 'text-muted-foreground',
                        ]"
                    >
                        {{ mode === "structured" ? "Structured" : "Raw Data" }}
                    </button>
                </div>

                <Card title="Metadata">
                    <div class="space-y-4">
                        <div class="flex items-center gap-3 text-sm">
                            <Clock :size="16" class="text-muted-foreground" />
                            <span class="text-muted-foreground">Received:</span>
                            <span class="font-medium">{{
                                new Date(submission.created_at).toLocaleString()
                            }}</span>
                        </div>

                        <div class="flex items-center gap-3 text-sm">
                            <Globe :size="16" class="text-muted-foreground" />
                            <span class="text-muted-foreground"
                                >IP Address:</span
                            >
                            <span class="font-medium">{{
                                submission.ip_address
                            }}</span>
                        </div>

                        <div class="flex items-center gap-3 text-sm">
                            <Shield :size="16" class="text-muted-foreground" />
                            <span class="text-muted-foreground">Spam:</span>
                            <span class="font-medium text-yellow-500"
                                >Unscored</span
                            >
                        </div>

                        <div class="pt-4 border-t border-border">
                            <label
                                class="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block"
                            >
                                User Agent
                            </label>
                            <p
                                class="text-xs text-muted-foreground leading-relaxed"
                            >
                                {{ userAgent }}
                            </p>
                            <div>
                                <template
                                    v-for="(flag, index) in uaFlags"
                                    :key="index"
                                >
                                    <div
                                        class="inline-flex flex-row items-center px-2 py-0.5 text-xs rounded-md"
                                        :class="[flag.style]"
                                    >
                                        <template v-if="flag.icon">
                                            <component
                                                :is="flag.icon"
                                                :size="14"
                                            />
                                            <div class="pr-1"></div>
                                        </template>
                                        {{ flag.label }}
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    </div>
</template>
