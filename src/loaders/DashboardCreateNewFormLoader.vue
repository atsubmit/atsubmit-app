<script setup lang="ts">
import Layout from "@/layouts/AuthedLayout.vue";

import DashboardCreateNewFormPage from "@/pages/DashboardCreateNewFormPage.vue";

const props = defineProps<{}>();
</script>

<template>
    <Layout>
        <DashboardCreateNewFormPage v-bind="props" />
    </Layout>
</template>
