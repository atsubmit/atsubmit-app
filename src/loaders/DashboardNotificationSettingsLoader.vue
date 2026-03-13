<script setup lang="ts">
import Layout from "@/layouts/AuthedLayout.vue";

import DashboardSettingsPage from "@/pages/DashboardSettingsPage.vue";
import NotificationSettings from "@/components/dashboard/DashboardNotificationSettings.vue";
import type { NotificationFrequentRule } from "@/components/dashboard/DashboardNotificationSettings.types";

const props = defineProps<{
    rules: NotificationFrequentRule[];

    enabled?: boolean;
    frequency?: string;
    email_owner: string;
    email_recipients?: string[];
    error?: string | string[];
}>();
</script>

<template>
    <Layout>
        <DashboardSettingsPage tab="notifications">
            <NotificationSettings
                action="/dashboard/settings/notifications"
                v-bind="props"
            />
        </DashboardSettingsPage>
    </Layout>
</template>
