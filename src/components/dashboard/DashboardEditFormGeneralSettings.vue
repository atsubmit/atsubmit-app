<script setup lang="ts">
import { ref } from "vue";
import Card from "@/components/dashboard/Card.vue";
import Toggle from "@/components/dashboard/Toggle.vue";
import { RefreshCw, Eye, EyeOff, Copy, Check } from "lucide-vue-next";
import InputField from "../InputField.vue";
import { useFormError } from "@/composition/useFormError";
import InputFieldError from "../InputFieldError.vue";
import { useClipboardMap } from "@/utils/clipboard";
import FormField from "../FormField.vue";
import { doFetch } from "@/utils/request";

const props = defineProps<{
    action: string;
    refreshToken: string;

    slug: string;
    endpointUrl: string;
    name: string;
    isActive: boolean;
    submitToken: string;

    error?: string | string[];
}>();

const { msg, errors } = useFormError(props.error);

const formName = ref(props.name);
const isActive = ref(props.isActive);

const { copied, copy } = useClipboardMap();

const token = ref(props.submitToken || "");
const showToken = ref(false);
const tokenChangeSuccess = ref(false);
let tokenChangeTimeoutId = 0;
const tokenError = ref("");
async function regenerateToken() {
    if (
        confirm(
            "Are you sure you want to regenerate the submit token? Your old token will stop working immediately.",
        )
    ) {
        clearTimeout(tokenChangeTimeoutId);
        try {
            const response = await doFetch(props.refreshToken, {
                method: "POST",
            });
            if (response.ok) {
                const json = await response.json();
                token.value = json.token;
                tokenChangeSuccess.value = true;
                clearTimeout(tokenChangeTimeoutId);
                tokenChangeTimeoutId = window.setTimeout(() => {
                    tokenChangeSuccess.value = false;
                }, 5000);
            }
        } catch (error) {
            console.error(error);
            tokenError.value = "Failed to regenerate token. Please try again.";
        }
    }
}
</script>

<template>
    <Card
        title="General"
        subtitle="Basic identity and connectivity settings for your form."
    >
        <InputFieldError v-if="msg" :error="msg" class="mt-4" />
        <div class="space-y-6">
            <form class="space-y-6" method="POST" :action="action">
                <div class="flex items-start justify-between">
                    <div class="space-y-1">
                        <h4 class="font-bold">Active</h4>
                        <p class="text-sm text-muted-foreground">
                            Accepting new submissions.
                        </p>
                    </div>

                    <Toggle
                        v-model="isActive"
                        :input="{
                            name: 'active',
                        }"
                    />
                </div>

                <template v-if="isActive">
                    <InputField
                        label="Form Name"
                        hint="Used to identify this form in your dashboard."
                        :input="{
                            type: 'text',
                            name: 'name',
                            required: true,
                        }"
                        :error="errors.name"
                    >
                        <template #default="{ classes, input }">
                            <input
                                :class="classes"
                                v-bind="input"
                                v-model="formName"
                            />
                        </template>
                    </InputField>

                    <InputField
                        label="Endpoint URL"
                        hint="Send your POST requests to this URL."
                        :input="{
                            type: 'text',
                            readonly: true,
                            value: endpointUrl,
                        }"
                    >
                        <template #append>
                            <button
                                type="button"
                                class="px-3 py-2 rounded-lg bg-transparent font-medium hover:opacity-90 transition-all flex items-center gap-2"
                                :class="[
                                    copied.endpointUrl
                                        ? 'text-green-500 '
                                        : 'text-white',
                                ]"
                                @click="copy('endpointUrl', endpointUrl)"
                            >
                                <Check v-if="copied.endpointUrl" :size="16" />
                                <Copy v-else :size="16" />
                            </button>
                        </template>
                    </InputField>
                </template>

                <div class="pt-4 border-t border-border">
                    <button type="submit" class="btn-primary px-8">
                        Save General Settings
                    </button>
                </div>
            </form>

            <div v-if="isActive" class="pt-6 border-t border-border space-y-4">
                <div>
                    <h4 class="font-bold">API Access</h4>
                    <p class="text-sm text-muted-foreground">
                        Credentials used for authenticated submissions.
                    </p>
                </div>

                <FormField
                    label="Submit Token"
                    hint="Include this token when sending authenticated requests."
                    :error="tokenError"
                >
                    <template #message="{ error }">
                        <InputFieldError
                            v-if="error"
                            :error="error"
                            class="mt-1"
                        />
                        <template v-if="tokenChangeSuccess">
                            <p class="text-sm text-green-500">
                                Submit token regenerated successfully.
                            </p>
                            <p class="text-sm text-yellow-500">
                                Your previous token is no longer valid.
                            </p>
                        </template>
                    </template>

                    <div class="flex gap-2">
                        <div class="relative grow">
                            <input
                                type="text"
                                :value="
                                    showToken
                                        ? token
                                        : `${token.slice(0, 5)}${'•'.repeat(5)}${token.slice(-5)}`
                                "
                                readonly
                                disabled
                                class="w-full px-4 py-2 rounded-lg bg-muted border border-border font-mono text-sm focus:outline-none pr-10"
                                autocomplete="none"
                            />

                            <button
                                type="button"
                                @click="showToken = !showToken"
                                class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                <EyeOff v-if="showToken" :size="16" />
                                <Eye v-else :size="16" />
                            </button>
                        </div>

                        <button
                            type="button"
                            class="px-4 py-2 rounded-lg border border-border hover:bg-muted flex items-center gap-2 text-sm font-medium"
                            :class="[
                                copied.token ? 'text-green-500 ' : 'text-white',
                            ]"
                            @click="copy('token', token)"
                        >
                            <template v-if="copied.token">
                                <Check :size="16" />
                                Copied
                            </template>
                            <template v-else>
                                <Copy :size="16" />
                                Copy
                            </template>
                        </button>

                        <button
                            type="button"
                            @click="regenerateToken"
                            class="px-4 py-2 rounded-lg border border-border hover:bg-muted flex items-center gap-2 text-sm font-medium"
                        >
                            <RefreshCw :size="16" />
                            Regenerate
                        </button>
                    </div>
                </FormField>
            </div>
        </div>
    </Card>
</template>
