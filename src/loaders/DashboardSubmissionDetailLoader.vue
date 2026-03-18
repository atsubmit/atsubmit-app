<script setup lang="ts">
import Layout from "@/layouts/AuthedLayout.vue";
import DashboardSubmissionDetailPage from "@/pages/DashboardSubmissionDetailPage.vue";

const props = defineProps<{
    submission: any;
}>();
</script>

<template>
    <Layout>
        <DashboardSubmissionDetailPage v-bind="props" />
    </Layout>
</template>
