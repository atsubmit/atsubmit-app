<script setup lang="ts">
import Layout from "@/layouts/AuthedLayout.vue";
import DashboardSubmissionPage from "@/pages/DashboardSubmissionPage.vue";

const props = defineProps<{}>();
</script>

<template>
    <Layout>
        <DashboardSubmissionPage v-bind="props" />
    </Layout>
</template>
