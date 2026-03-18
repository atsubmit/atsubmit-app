<script setup lang="ts">
import Layout from "@/layouts/AuthedLayout.vue";
import type { Submission } from "@/pages/DashboardSubmissionDetailPage.types";
import DashboardSubmissionDetailPage from "@/pages/DashboardSubmissionDetailPage.vue";

const props = defineProps<{
    submission: Submission;
}>();
</script>

<template>
    <Layout>
        <DashboardSubmissionDetailPage v-bind="props" />
    </Layout>
</template>
