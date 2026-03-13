<script setup lang="ts">
import { ref } from "vue";
import Card from "./Card.vue";
import type { NotificationFrequentRule } from "./DashboardNotificationSettings.types";
import Toggle from "./Toggle.vue";
import InputField from "../InputField.vue";
import InputBadge from "./InputBadge.vue";
import { useFormError } from "@/composition/useFormError";
import InputFieldError from "../InputFieldError.vue";
import { validateEmailFormat } from "@/utils/email";

const props = defineProps<{
    action: string;
    rules: NotificationFrequentRule[];

    enabled?: boolean;
    frequency?: string;
    email_owner: string;
    email_recipients?: string[];
    error?: string | string[];
}>();

const enabled = ref(!!props.enabled);
const frequency = ref<string[]>([...(props.frequency || "").split(/\s*,\s/)]);

const method = ref<string[]>(["email"]);
const methods = [
    {
        value: "email",
        label: "Email",
        disabled: true,
    },
    { value: "sms", label: "SMS (Coming soon)", disabled: true },
    {
        value: "in-app",
        label: "In-App Notification (Coming soon)",
        disabled: true,
    },
];

const emailRecipients = ref<string[]>(
    [...(props.email_recipients || [])].filter(Boolean),
);

const { msg, errors } = useFormError(props.error);
</script>

<template>
    <div class="space-y-8">
        <Card
            title="Email Notifications"
            subtitle="Configure how and when you receive email notifications. Form submissions are always received and stored."
        >
            <InputFieldError v-if="msg" :error="msg" class="mt-4" />
            <form class="space-y-8" method="POST" :action="action">
                <div class="flex items-start justify-between">
                    <div class="space-y-1">
                        <h4 class="font-bold">Enable Notifications</h4>
                        <p class="text-sm text-muted-foreground">
                            Turn all notification services on or off.
                        </p>
                    </div>

                    <Toggle
                        v-model="enabled"
                        :input="{
                            name: 'enabled',
                        }"
                    />
                </div>

                <template v-if="enabled">
                    <div class="space-y-4">
                        <h4 class="font-bold">Notification Rules</h4>

                        <div class="space-y-3">
                            <label
                                v-for="item in rules"
                                :key="item.label"
                                :class="[
                                    'flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer group',
                                    frequency.includes(item.id)
                                        ? 'border-apple-blue bg-apple-blue/5'
                                        : 'border-border hover:border-apple-blue/50',
                                ]"
                            >
                                <input
                                    v-if="item.selectable"
                                    type="checkbox"
                                    name="frequency"
                                    class="mt-1 text-apple-blue focus:ring-apple-blue"
                                    :value="item.id"
                                    disabled
                                    v-model="frequency"
                                />
                                <input
                                    v-else
                                    type="checkbox"
                                    disabled
                                    class="mt-1 text-apple-blue focus:ring-apple-blue"
                                />

                                <div class="grow">
                                    <div
                                        class="flex items-center justify-between"
                                    >
                                        <span class="font-bold">{{
                                            item.label
                                        }}</span>

                                        <span
                                            class="text-xs font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground"
                                        >
                                            {{ item.plan }}
                                        </span>
                                    </div>

                                    <p class="text-sm text-muted-foreground">
                                        {{ item.desc }}
                                    </p>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div :class="['space-y-8 transition-all']">
                        <!-- Notification Method -->
                        <div class="space-y-4">
                            <h4 class="font-bold">Notification Method</h4>

                            <div class="space-y-2">
                                <label
                                    v-for="item in methods"
                                    :class="[
                                        'flex items-start gap-4 p-4 rounded-xl border transition-all group',
                                        item.disabled
                                            ? 'border-border opacity-50 cursor-not-allowed bg-muted/40'
                                            : 'border-border hover:border-apple-blue/50 cursor-pointer',
                                    ]"
                                >
                                    <input
                                        type="checkbox"
                                        name="method"
                                        class="mt-1 text-apple-blue focus:ring-apple-blue"
                                        :value="item.value"
                                        :disabled="true"
                                        v-model="method"
                                    />

                                    <div class="grow">
                                        <div
                                            class="flex items-center justify-between"
                                        >
                                            <span class="font-bold">{{
                                                item.label
                                            }}</span>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <!-- Email Settings -->
                        <div
                            class="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300"
                        >
                            <div class="space-y-4">
                                <h4 class="font-bold">Recipient Fields</h4>

                                <div class="grid md:grid-cols-3 gap-4">
                                    <InputField
                                        class="space-y-2"
                                        label="To"
                                        :input="{
                                            id: 'email-owner',
                                            type: 'email',
                                            required: true,
                                            value: email_owner,
                                            disabled: true,
                                        }"
                                    />

                                    <InputField
                                        class="space-y-2"
                                        label="Other Recipients"
                                        :error="errors['email-recipients']"
                                    >
                                        <input
                                            type="hidden"
                                            name="email-recipients"
                                            :value="emailRecipients.join(',')"
                                        />
                                        <InputBadge
                                            class="w-full p-2"
                                            v-model="emailRecipients"
                                            :input="{
                                                type: 'email',
                                            }"
                                            :validate="validateEmailFormat"
                                        >
                                            <template #error="{ errors }">
                                                <template v-if="errors.length">
                                                    <InputFieldError
                                                        error="Please enter valid email addresses"
                                                    />
                                                    <InputFieldError
                                                        v-if="errors"
                                                        :error="errors"
                                                        class="mt-4"
                                                    />
                                                </template>
                                            </template>
                                        </InputBadge>
                                    </InputField>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>

                <div class="pt-4 border-t border-border">
                    <button type="submit" class="btn-primary px-8">
                        Save Notification Preferences
                    </button>
                </div>
            </form>
        </Card>
    </div>
</template>
