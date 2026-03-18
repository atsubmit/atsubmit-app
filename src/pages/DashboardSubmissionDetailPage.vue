<script setup lang="ts">
import { ref } from "vue";
import DashboardHeader from "@/components/dashboard/DashboardHeader.vue";
import Card from "@/components/dashboard/Card.vue";
import { ChevronRight, Clock, Globe, Shield } from "lucide-vue-next";

const props = defineProps<{
    submission: any;
}>();

const viewMode = ref<"structured" | "json">("structured");
</script>

<template>
    <div class="space-y-8 animate-in slide-in-from-right-4 duration-500">
        <div class="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <button class="hover:text-foreground">Submissions</button>
            <ChevronRight :size="14" />
            <span class="text-foreground font-medium">
                {{ submission.id }}
            </span>
        </div>

        <DashboardHeader
            title="Submission Details"
            :description="`Received from ${submission.form} on ${submission.time}`"
        >
            <template #actions>
                <div class="flex items-center gap-2 bg-muted p-1 rounded-lg">
                    <button
                        @click="viewMode = 'structured'"
                        :class="[
                            'px-3 py-1.5 text-sm font-medium rounded-md transition-all',
                            viewMode === 'structured'
                                ? 'bg-card shadow-sm'
                                : 'text-muted-foreground',
                        ]"
                    >
                        Structured
                    </button>
                    <button
                        @click="viewMode = 'json'"
                        :class="[
                            'px-3 py-1.5 text-sm font-medium rounded-md transition-all',
                            viewMode === 'json'
                                ? 'bg-card shadow-sm'
                                : 'text-muted-foreground',
                        ]"
                    >
                        Raw JSON
                    </button>
                </div>
            </template>
        </DashboardHeader>

        <div class="grid lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 space-y-8">
                <Card title="Form Data">
                    <div v-if="viewMode === 'structured'" class="space-y-6">
                        <div
                            v-for="(value, key) in submission.data"
                            :key="key"
                            class="border-b border-border pb-4 last:border-0 last:pb-0"
                        >
                            <label
                                class="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block"
                            >
                                {{ key }}
                            </label>
                            <p class="text-lg">{{ value }}</p>
                        </div>
                    </div>

                    <pre
                        v-else
                        class="p-4 rounded-lg bg-muted font-mono text-sm overflow-x-auto"
                        >{{ JSON.stringify(submission.data, null, 2) }}
                    </pre>
                </Card>
            </div>

            <div class="space-y-8">
                <Card title="Metadata">
                    <div class="space-y-4">
                        <div class="flex items-center gap-3 text-sm">
                            <Clock :size="16" class="text-muted-foreground" />
                            <span class="text-muted-foreground">Received:</span>
                            <span class="font-medium">{{
                                submission.time
                            }}</span>
                        </div>

                        <div class="flex items-center gap-3 text-sm">
                            <Globe :size="16" class="text-muted-foreground" />
                            <span class="text-muted-foreground"
                                >IP Address:</span
                            >
                            <span class="font-medium">{{ submission.ip }}</span>
                        </div>

                        <div class="flex items-center gap-3 text-sm">
                            <Shield
                                :size="16"
                                :class="[
                                    submission.spam
                                        ? 'text-red-500'
                                        : 'text-emerald-500',
                                ]"
                            />
                            <span class="text-muted-foreground"
                                >Spam Score:</span
                            >
                            <span
                                :class="[
                                    'font-medium',
                                    submission.spam
                                        ? 'text-red-500'
                                        : 'text-emerald-500',
                                ]"
                            >
                                {{
                                    submission.spam
                                        ? "High (Blocked)"
                                        : "Low (Safe)"
                                }}
                            </span>
                        </div>

                        <div class="pt-4 border-t border-border">
                            <label
                                class="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block"
                            >
                                User Agent
                            </label>
                            <p
                                class="text-xs text-muted-foreground leading-relaxed"
                            >
                                {{ submission.userAgent }}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    </div>
</template>
