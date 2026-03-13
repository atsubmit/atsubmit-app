<script setup lang="ts">
import DashboardHeader from "@/components/dashboard/DashboardHeader.vue";
import Card from "@/components/dashboard/Card.vue";
import Table from "@/components/dashboard/Table.vue";
import { Copy, Eye, Edit2, Trash2, Plus } from "lucide-vue-next";

const forms = [
    {
        id: "f_123",
        name: "Contact Sales",
        endpoint: "https://api.atsubmit.com/f/f_123",
        submissions: 42,
        status: "active",
    },
    {
        id: "f_456",
        name: "Newsletter Signup",
        endpoint: "https://api.atsubmit.com/f/f_456",
        submissions: 128,
        status: "active",
    },
    {
        id: "f_789",
        name: "Job Application",
        endpoint: "https://api.atsubmit.com/f/f_789",
        submissions: 15,
        status: "inactive",
    },
    {
        id: "f_012",
        name: "Support Request",
        endpoint: "https://api.atsubmit.com/f/f_012",
        submissions: 8,
        status: "active",
    },
];
</script>

<template>
    <div class="space-y-8 animate-in fade-in duration-500">
        <DashboardHeader
            title="Forms"
            description="Manage your form endpoints and integration settings."
        >
            <template #actions>
                <a
                    href="/dashboard/forms/new"
                    class="btn-primary flex items-center gap-2"
                >
                    <Plus :size="18" />
                    Create Form
                </a>
            </template>
        </DashboardHeader>

        <Card class="p-0">
            <Table
                :headers="[
                    'Form Name',
                    'Endpoint',
                    'Submissions',
                    'Status',
                    'Actions',
                ]"
            >
                <tr
                    v-for="form in forms"
                    :key="form.id"
                    class="hover:bg-muted/50 transition-colors"
                >
                    <td class="px-4 py-4">
                        <div class="font-medium">
                            {{ form.name }}
                        </div>
                        <div class="text-xs text-muted-foreground font-mono">
                            {{ form.id }}
                        </div>
                    </td>

                    <td class="px-4 py-4">
                        <div class="flex items-center gap-2">
                            <code
                                class="text-xs bg-muted px-2 py-1 rounded border border-border"
                            >
                                {{ form.endpoint }}
                            </code>

                            <button
                                class="text-muted-foreground hover:text-apple-blue"
                            >
                                <Copy :size="14" />
                            </button>
                        </div>
                    </td>

                    <td class="px-4 py-4 text-sm font-medium">
                        {{ form.submissions }}
                    </td>

                    <td class="px-4 py-4">
                        <span
                            :class="[
                                'text-xs font-bold px-2 py-1 rounded-full',
                                form.status === 'active'
                                    ? 'bg-emerald-500/10 text-emerald-500'
                                    : 'bg-apple-gray/10 text-apple-gray',
                            ]"
                        >
                            {{ form.status }}
                        </span>
                    </td>

                    <td class="px-4 py-4">
                        <div class="flex items-center gap-2">
                            <button
                                class="p-2 rounded-lg hover:bg-muted text-muted-foreground"
                            >
                                <Eye :size="18" />
                            </button>

                            <button
                                class="p-2 rounded-lg hover:bg-muted text-muted-foreground"
                            >
                                <Edit2 :size="18" />
                            </button>

                            <button
                                class="p-2 rounded-lg hover:bg-muted text-red-500"
                            >
                                <Trash2 :size="18" />
                            </button>
                        </div>
                    </td>
                </tr>
            </Table>
        </Card>
    </div>
</template>
