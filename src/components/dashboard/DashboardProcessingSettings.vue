<script setup lang="ts">
import { BotOff, List } from "lucide-vue-next";
import InputField from "../InputField.vue";
import Card from "./Card.vue";
import { useFormError } from "@/composition/useFormError";
import InputFieldError from "../InputFieldError.vue";
import { computed, ref } from "vue";
import Toggle from "./Toggle.vue";
import CodeBlock from "./CodeBlock.vue";

const props = defineProps<{
    action: string;

    enabled: boolean;
    name: string;
    hiddenStyle: string;
    hiddenClassName: string;

    error?: string | string[];
}>();

const enabled = ref(!!props.enabled);
const inputName = ref(props.name || "");
const hiddenStyle = ref(props.hiddenStyle || null);
const hiddenClassName = ref(props.hiddenClassName || "");

const html = computed(() => {
    const input = document.createElement("input");

    input.name = inputName.value || "";

    let html = "";
    if (hiddenStyle.value === "type") {
        input.type = "hidden";

        html = input.outerHTML;
    } else if (hiddenStyle.value === "display") {
        input.style.display = "none";
        input.type = "text";

        html = input.outerHTML;
    } else if (hiddenStyle.value === "visibility") {
        input.style.visibility = "hidden";
        input.type = "text";

        html = input.outerHTML;
    } else if (hiddenStyle.value === "classname") {
        input.className = hiddenClassName.value;
        input.type = "text";

        const style = document.createElement("style");
        style.appendChild(
            document.createTextNode(
                `.${hiddenClassName.value} {display: none}`,
            ),
        );
        html = [
            //
            style.outerHTML,
            input.outerHTML,
        ].join("\n");
    }
    return html;
});
const { msg, errors } = useFormError(props.error);
</script>

<template>
    <div class="space-y-8">
        <Card
            title="Submission Processing"
            subtitle="Configure how we handle incoming data."
        >
            <InputFieldError v-if="msg" :error="msg" class="mt-4" />
            <form :action="action">
                <div class="space-y-8">
                    <div class="flex items-start justify-between">
                        <div class="space-y-1">
                            <h4 class="font-bold">Honeypot Protection</h4>
                            <p class="text-sm text-muted-foreground">
                                Add a hidden field to your forms to catch
                                automated bots.
                            </p>
                        </div>

                        <Toggle
                            v-model="enabled"
                            :input="{
                                name: 'enabled',
                            }"
                        />
                    </div>

                    <div v-if="enabled" class="grid md:grid-cols-2 gap-6">
                        <InputField
                            label="Honeypot Field Name"
                            :icon="BotOff"
                            :input="{
                                id: 'name',
                                type: 'text',
                                name: 'name',
                                autocomplete: 'none',
                                required: true,
                            }"
                            :error="errors.name"
                        >
                            <template #default="{ classes, input }">
                                <input
                                    :class="classes"
                                    v-bind="input"
                                    v-model="inputName"
                                />
                            </template>
                        </InputField>
                        <InputField
                            label="Hidden Style"
                            :icon="List"
                            :input="{
                                id: 'hiddenStyle',
                                name: 'hidden-style',
                                required: true,
                            }"
                            :error="errors['hidden-style']"
                        >
                            <template #default="{ classes, input }">
                                <select
                                    :class="classes"
                                    v-model="hiddenStyle"
                                    v-bind="input"
                                >
                                    <option v-if="!hiddenStyle" :value="null">
                                        Not Selected
                                    </option>
                                    <option value="type">
                                        Hidden Input (type="hidden")
                                    </option>
                                    <option value="display">
                                        Hide with CSS (display: none)
                                    </option>
                                    <option value="visibility">
                                        Hide with CSS (visibility: hidden)
                                    </option>
                                    <option value="classname">
                                        Hide with Custom Class (recommended)
                                    </option>
                                </select>
                            </template>
                        </InputField>
                    </div>
                    <div v-if="hiddenStyle === 'classname'">
                        <InputField
                            label="Honeypot ClassName Name"
                            :icon="BotOff"
                            :input="{
                                id: 'name',
                                type: 'text',
                                name: 'hidden-classname',
                                autocomplete: 'none',
                                required: true,
                            }"
                            :error="errors['hidden-classname']"
                        >
                            <template #default="{ classes, input }">
                                <input
                                    :class="classes"
                                    v-bind="input"
                                    v-model="hiddenClassName"
                                />
                            </template>
                        </InputField>
                    </div>

                    <CodeBlock v-if="html" :code="html"></CodeBlock>

                    <div class="pt-4 border-t border-border">
                        <button class="btn-primary px-8">
                            Update Processing Rules
                        </button>
                    </div>
                </div>
            </form>
        </Card>
    </div>
</template>

<style>
.code-block {
    background: #0d1117;
    border-radius: 8px;
    padding: 12px 16px;
    font-family: Consolas, Monaco, "Courier New", monospace;
    font-size: 14px;
    color: #c9d1d9;
    overflow-x: auto;
}

.code-block pre {
    margin: 0;
    white-space: pre;
}
</style>
