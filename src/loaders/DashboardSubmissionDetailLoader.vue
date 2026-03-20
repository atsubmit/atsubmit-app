<script setup lang="ts">
import Layout from "@/layouts/AuthedLayout.vue";
import type { Submission } from "@/pages/DashboardSubmissionDetailPage.types";
import DashboardSubmissionDetailPage from "@/pages/DashboardSubmissionDetailPage.vue";

const props = defineProps<{
    submission: Submission & {
        form_slug: string;
        form_name: string;
    };
}>();
</script>

<template>
    <Layout>
        <DashboardSubmissionDetailPage v-bind="props" />
    </Layout>
</template>
