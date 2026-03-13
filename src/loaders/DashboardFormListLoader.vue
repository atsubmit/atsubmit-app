<script setup lang="ts">
import Layout from "@/layouts/AuthedLayout.vue";

import DashboardFormListPage from "@/pages/DashboardFormListPage.vue";

const props = defineProps<{}>();
</script>

<template>
    <Layout>
        <DashboardFormListPage v-bind="props" />
    </Layout>
</template>
