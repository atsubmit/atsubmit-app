<script setup lang="ts">
import { ref } from "vue";
import Card from "./Card.vue";
import { useFormError } from "@/composition/useFormError";
import InputFieldError from "../InputFieldError.vue";
import InputField from "../InputField.vue";
import { User, Mail, Earth } from "lucide-vue-next";

const props = defineProps<{
    name: string;
    email: string;
    timezones: { label: string; id: string }[];
    timezone: string | null;
    error?: string | string[];
}>();

const selectedTimezone = ref(props.timezone || null);

const { msg, errors } = useFormError(props.error);
</script>

<template>
    <div class="space-y-8">
        <Card
            title="Personal Information"
            subtitle="Update your profile details and how others see you."
        >
            <InputFieldError v-if="msg" :error="msg" class="mt-4" />
            <form
                class="space-y-6"
                action="/dashboard/settings/profile"
                method="post"
            >
                <div class="grid md:grid-cols-2 gap-6">
                    <InputField
                        label="Full Name"
                        :icon="User"
                        :input="{
                            id: 'name',
                            type: 'text',
                            name: 'name',
                            value: name,
                            autocomplete: 'none',
                        }"
                        :error="errors.name"
                    />

                    <InputField
                        label="Email Address"
                        :icon="Mail"
                        :input="{
                            id: 'email',
                            type: 'email',
                            value: email,
                            readonly: true,
                            disabled: true,
                        }"
                    />
                </div>

                <InputField
                    label="Timezone"
                    :icon="Earth"
                    :input="{
                        id: 'timezone',
                        name: 'timezone',
                    }"
                    :error="errors.timezone"
                >
                    <template #default="{ classes, input }">
                        <select
                            :class="classes"
                            v-model="selectedTimezone"
                            v-bind="input"
                        >
                            <option v-if="!selectedTimezone" :value="null">
                                Not Selected
                            </option>
                            <option
                                v-for="item in timezones"
                                :key="item.id"
                                :value="item.id"
                            >
                                {{ item.label }}
                            </option>
                        </select>
                    </template>
                </InputField>

                <div class="pt-4">
                    <button class="btn-primary px-8">Save Changes</button>
                </div>
            </form>
        </Card>

        <Card title="Danger Zone" class="border-red-500/20">
            <div class="flex items-center justify-between">
                <div>
                    <h4 class="font-bold text-red-500">Delete Account</h4>
                    <p class="text-sm text-muted-foreground">
                        Permanently delete your account and all associated data.
                    </p>
                </div>

                <button
                    class="px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-all"
                >
                    Delete Account
                </button>
            </div>
        </Card>
    </div>
</template>
