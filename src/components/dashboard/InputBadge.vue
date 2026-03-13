<script setup lang="ts">
import { ref, computed } from "vue";
import { X } from "lucide-vue-next";
import type { InputHTMLAttributes } from "vue";
import InputFieldError from "../InputFieldError.vue";

interface Props {
    separator?: string | string[];
    validate?: (value: string) => boolean;
    input?: InputHTMLAttributes;
}

const props = withDefaults(defineProps<Props>(), {
    separator: () => [","],
});

const vModel = defineModel<string[]>({ default: [] });

const inputValue = ref("");
const inputRef = ref<HTMLInputElement | null>(null);

const errors = ref<string[]>([]);
const separators = computed(() =>
    Array.isArray(props.separator) ? props.separator : [props.separator],
);

function updateValue(items: string[]) {
    vModel.value = items;
}

function addItems(text: string) {
    const newItems = text
        .split(/[,\n\r]+/)
        .map((item) => item.trim())
        .filter((item) => item !== "" && !vModel.value.includes(item));

    if (newItems.length === 0) return;

    let validatedItems: string[];
    if (props.validate) {
        const invalidatedItems: string[] = [];
        validatedItems = [];
        for (let index = 0; index < newItems.length; index++) {
            const item = newItems[index];
            if (item) {
                if (props.validate(item)) {
                    validatedItems.push(item);
                } else {
                    invalidatedItems.push(item);
                }
            }
        }

        if (invalidatedItems.length) {
            const items = Array.from(new Set([...invalidatedItems]));
            errors.value = items;
        }
    } else {
        validatedItems = [...newItems];
    }

    if (validatedItems.length > 0) {
        updateValue(Array.from(new Set([...vModel.value, ...validatedItems])));
    }
}

function onFocus() {
    errors.value = [];
}

function onBlur() {
    if (inputValue.value.trim()) {
        addItems(inputValue.value);
        inputValue.value = "";
    }
}

function onKeyDown(e: KeyboardEvent) {
    if (props.input?.disabled) return;

    if (separators.value.includes(e.key) || e.key === "Enter") {
        e.preventDefault();

        if (inputValue.value.trim()) {
            addItems(inputValue.value);
            inputValue.value = "";
        }
    } else if (
        e.key === "Backspace" &&
        inputValue.value === "" &&
        vModel.value.length > 0
    ) {
        e.preventDefault();

        const raw = [...vModel.value];
        const popped = raw.pop();
        if (popped) {
            inputValue.value = popped;
            updateValue(raw);
        }
    }
}

function onPaste(e: ClipboardEvent) {
    if (props.input?.disabled) return;

    e.preventDefault();

    const pastedText = e.clipboardData?.getData("text") ?? "";
    addItems(pastedText);
}

function removeItem(index: number) {
    if (props.input?.disabled) return;

    const newValue = [...vModel.value];
    newValue.splice(index, 1);

    updateValue(newValue);
}

function focusInput() {
    inputRef.value?.focus();
}
</script>

<template>
    <div>
        <div
            :class="[
                'flex flex-wrap items-center gap-0.5 p-0.5 rounded-lg bg-muted border border-border transition-all focus-within:ring-2 focus-within:ring-apple-blue/50 focus-within:border-apple-blue/50',
                !!input?.disabled && 'opacity-50 cursor-not-allowed',
            ]"
            @click="focusInput"
        >
            <span
                v-for="(item, index) in vModel"
                :key="`${item}-${index}`"
                class="flex items-center gap-1.5 px-2 py-0.75 rounded-md bg-background border border-border text-sm font-medium animate-in fade-in scale-in-95 duration-200"
            >
                {{ item }}

                <button
                    type="button"
                    @click.stop="removeItem(index)"
                    class="p-0.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    :aria-label="`Remove ${item}`"
                >
                    <X :size="14" />
                </button>
            </span>

            <input
                ref="inputRef"
                v-model="inputValue"
                v-bind="input"
                @focus="onFocus"
                @blur="onBlur"
                @keydown="onKeyDown"
                @paste="onPaste"
                class="bg-transparent border-none focus:outline-none text-sm py-1 px-1.5"
            />
        </div>
        <slot name="error" :errors="errors">
            <InputFieldError
                v-if="errors.length"
                :error="errors"
                class="mt-4"
            />
        </slot>
    </div>
</template>
