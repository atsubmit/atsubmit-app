<script setup lang="ts">
import DashboardHeader from "@/components/dashboard/DashboardHeader.vue";

import type {
    FormSettingsTab,
    FormSettingsTabId,
} from "./DashboardEditFormPage.types";

import { User, Shield, Globe, Bell } from "lucide-vue-next";
import { onMounted, useTemplateRef } from "vue";

const props = defineProps<{
    formId: string;
    tab: FormSettingsTabId;
}>();

const refAnchors = useTemplateRef("refAnchors");
const tabs: FormSettingsTab[] = [
    {
        id: "general",
        name: "General",
        href: `/dashboard/form/${props.formId}/general`,
        icon: User,
    },
    {
        id: "processing",
        name: "Processing",
        href: `/dashboard/form/${props.formId}/processing`,
        icon: Shield,
    },
    {
        id: "domains",
        name: "Domains",
        href: `/dashboard/form/${props.formId}/domains`,
        icon: Globe,
    },
    {
        id: "notifications",
        name: "Notifications",
        href: `/dashboard/form/${props.formId}/notifications`,
        icon: Bell,
    },
];

onMounted(() => {
    const anchors = refAnchors.value;
    if (anchors) {
        for (let index = 0; index < anchors.length; index++) {
            const element = anchors[index];
            if (element && element.getAttribute("href") === location.pathname) {
                element.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest", // prevents vertical scrolling
                    inline: "center", // horizontal positioning
                });
                break;
            }
        }
    }
});
</script>

<template>
    <div class="space-y-8 animate-in fade-in duration-500">
        <DashboardHeader
            title="Form Settings"
            description="Configure how this form receives submissions, filters spam, and sends notifications."
        />

        <div class="flex border-b border-border mb-8 overflow-x-auto">
            <a
                v-for="tab in tabs"
                ref="refAnchors"
                :key="tab.name"
                :href="tab.href"
                class="flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap"
                :class="
                    tab.id === props.tab
                        ? 'border-apple-blue text-apple-blue'
                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                "
            >
                <component :is="tab.icon" :size="18" />
                {{ tab.name }}
            </a>
        </div>

        <div class="max-w-4xl">
            <slot></slot>
        </div>
    </div>
</template>
