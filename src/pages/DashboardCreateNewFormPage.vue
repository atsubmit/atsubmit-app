<script setup lang="ts">
import DashboardHeader from "@/components/dashboard/DashboardHeader.vue";
import Card from "@/components/dashboard/Card.vue";
import CopyInput from "@/components/dashboard/CopyInput.vue";
import CodeBlock from "@/components/dashboard/CodeBlock.vue";
import { computed, ref } from "vue";
import htmlForm from "./DashboardCreateNewFormPage.form.html?raw";

const formId = ref("f_new_form_id");
const endpoint = computed(() => `https://api.atsubmit.com/f/${formId.value}`);
const formCode = computed(() => htmlForm.replace("{{FORM_ID}}", formId.value));
</script>

<template>
    <div
        class="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500"
    >
        <DashboardHeader
            title="Create New Form"
            description="Set up a new endpoint to start receiving submissions."
        />

        <Card
            title="Form Setup"
            subtitle="Configure your form and connect it to your website."
        >
            <form class="space-y-8" action="/dashboard/forms/new" method="POST">
                <!-- Form name -->
                <div class="space-y-2">
                    <label class="text-sm font-medium">Form Name</label>

                    <input
                        type="text"
                        placeholder="e.g. Contact Sales"
                        class="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-apple-blue/50"
                        required
                    />

                    <p class="text-xs text-muted-foreground">
                        This is for your internal reference only.
                    </p>
                </div>

                <!-- Endpoint -->
                <CopyInput label="Your Unique Endpoint" :value="endpoint" />

                <!-- HTML Example -->
                <div class="space-y-2">
                    <label class="text-sm font-medium">HTML Example</label>

                    <CodeBlock :code="formCode" />

                    <p class="text-xs text-muted-foreground">
                        Copy this example and update the fields as needed.
                    </p>
                </div>

                <!-- actions -->
                <div class="pt-4 flex justify-end">
                    <button type="submit" class="btn-primary px-8">
                        Create Form
                    </button>
                </div>
            </form>
        </Card>
    </div>
</template>
