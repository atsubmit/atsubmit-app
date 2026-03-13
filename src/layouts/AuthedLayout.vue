<script setup lang="ts">
import { ref } from "vue";
import {
    LayoutDashboard,
    Inbox,
    Settings,
    ChevronLeft,
    ChevronRight,
    Search,
    Bell,
    User,
    Menu,
    X,
    Form,
} from "lucide-vue-next";
import Layout from "@/layouts/Base.vue";
import DarkModeToggler from "@/components/DarkModeToggler.vue";

const isSidebarCollapsed = ref(false);
const isMobileMenuOpen = ref(false);

const navigation = [
    {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        name: "Forms",
        href: "/dashboard/forms",
        icon: Form,
    },
    {
        name: "Submissions",
        href: "/dashboard/submissions",
        icon: Inbox,
    },
    {
        name: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
        children: [
            { name: "Profile", href: "/dashboard/settings/profile" },
            { name: "Processing", href: "/dashboard/settings/processing" },
            { name: "Domains", href: "/dashboard/settings/domains" },
            {
                name: "Notifications",
                href: "/dashboard/settings/notifications",
            },
        ],
    },
];

function isActive(path: string) {
    return location.pathname === path;
}

function isParentActive(path: string) {
    return location.pathname.startsWith(path + "/");
}
</script>

<template>
    <Layout class="min-h-screen bg-background flex flex-col md:flex-row">
        <!-- Mobile Header -->
        <header
            class="md:hidden h-16 border-b border-border px-4 flex items-center justify-between sticky top-0 z-50 bg-background"
        >
            <div class="flex items-center gap-2">
                <div
                    class="w-8 h-8 bg-apple-blue rounded-lg flex items-center justify-center text-white"
                >
                    ✕
                </div>

                <span class="font-bold">AtSubmit</span>
            </div>

            <div class="mx-auto"></div>
            <DarkModeToggler />
            <button
                @click="isMobileMenuOpen = !isMobileMenuOpen"
                class="p-2 rounded-lg hover:bg-muted"
            >
                <X v-if="isMobileMenuOpen" :size="24" />
                <Menu v-else :size="24" />
            </button>
        </header>

        <!-- Sidebar -->
        <aside
            class="hidden md:flex flex-col border-r border-border bg-card transition-all duration-300 sticky top-0 h-screen"
            :class="isSidebarCollapsed ? 'w-20' : 'w-64'"
        >
            <div class="p-6 flex items-center justify-between">
                <a
                    v-if="!isSidebarCollapsed"
                    href="/dashboard"
                    class="flex items-center gap-2"
                >
                    <div
                        class="w-8 h-8 bg-apple-blue rounded-lg flex items-center justify-center text-white"
                    >
                        ✕
                    </div>

                    <span class="font-bold text-lg"> AtSubmit </span>
                </a>

                <div
                    v-else
                    class="w-8 h-8 bg-apple-blue rounded-lg flex items-center justify-center text-white mx-auto"
                >
                    ✕
                </div>
            </div>

            <nav class="grow px-3 space-y-1">
                <div v-for="item in navigation" :key="item.name">
                    <a
                        :href="item.href"
                        class="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group"
                        :class="
                            isActive(item.href) || isParentActive(item.href)
                                ? 'bg-apple-blue/10 text-apple-blue'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        "
                    >
                        <component :is="item.icon" :size="20" />

                        <span v-if="!isSidebarCollapsed" class="font-medium">
                            {{ item.name }}
                        </span>
                    </a>

                    <div
                        v-if="
                            (!isSidebarCollapsed &&
                                item.children &&
                                isActive(item.href)) ||
                            isParentActive(item.href)
                        "
                        class="ml-9 mt-1 space-y-1"
                    >
                        <a
                            v-for="child in item.children"
                            :key="child.name"
                            :href="child.href"
                            class="block px-3 py-1.5 text-sm rounded-lg"
                            :class="
                                isParentActive(child.href)
                                    ? 'text-apple-blue font-medium'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                            "
                        >
                            {{ child.name }}
                        </a>
                    </div>
                </div>
            </nav>

            <div class="p-4 border-t border-border">
                <button
                    @click="isSidebarCollapsed = !isSidebarCollapsed"
                    class="w-full flex items-center justify-center p-2 rounded-lg hover:bg-muted text-muted-foreground"
                >
                    <ChevronRight v-if="isSidebarCollapsed" :size="20" />

                    <div v-else class="flex items-center gap-2">
                        <ChevronLeft :size="20" />
                        <span>Collapse</span>
                    </div>
                </button>
            </div>
        </aside>

        <!-- Mobile Menu -->
        <div
            v-if="isMobileMenuOpen"
            class="md:hidden fixed inset-0 z-40 bg-background/10 backdrop-blur-sm"
            @click="isMobileMenuOpen = false"
        >
            <div
                class="fixed inset-y-0 left-0 p-6 pt-22 w-64 bg-card border-r border-border shadow-xl"
                @click.stop
            >
                <nav class="space-y-4">
                    <div v-for="item in navigation" :key="item.name">
                        <a
                            :href="item.href"
                            class="flex items-center gap-3 p-2 rounded-lg"
                            :class="
                                isActive(item.href) || isParentActive(item.href)
                                    ? 'bg-apple-blue/10 text-apple-blue'
                                    : ''
                            "
                            @click="isMobileMenuOpen = false"
                        >
                            <component :is="item.icon" :size="20" />

                            <span class="font-medium">
                                {{ item.name }}
                            </span>
                        </a>

                        <div v-if="item.children" class="ml-8 mt-2 space-y-2">
                            <a
                                v-for="child in item.children"
                                :key="child.name"
                                :href="child.href"
                                class="block text-sm text-muted-foreground"
                                @click="isMobileMenuOpen = false"
                            >
                                {{ child.name }}
                            </a>
                        </div>
                    </div>
                </nav>
            </div>
        </div>

        <!-- Main Area -->
        <main class="grow flex flex-col min-w-0">
            <header
                class="h-16 border-b border-border px-6 flex items-center justify-between sticky top-0 bg-background/10 backdrop-blur-md z-30"
            >
                <div class="flex items-center gap-4 grow max-w-xl">
                    <div class="relative w-full">
                        <Search
                            class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            :size="18"
                        />

                        <input
                            type="text"
                            placeholder="Search forms, submissions..."
                            class="w-full pl-10 pr-4 py-2 rounded-full bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-apple-blue/50 text-sm"
                        />
                    </div>
                </div>

                <div class="flex items-center gap-4">
                    <button
                        class="p-2 rounded-full hover:bg-muted text-muted-foreground relative"
                    >
                        <Bell :size="20" />

                        <span
                            class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background"
                        ></span>
                    </button>
                    <DarkModeToggler />

                    <div class="h-6 w-px bg-border mx-2"></div>

                    <div class="flex items-center gap-3">
                        <div class="text-right hidden sm:block">
                            <p class="text-sm font-medium">John Doe</p>

                            <p class="text-xs text-muted-foreground">
                                Personal Workspace
                            </p>
                        </div>

                        <button
                            class="w-10 h-10 rounded-full bg-apple-blue/10 text-apple-blue flex items-center justify-center border border-apple-blue/20"
                        >
                            <User :size="20" />
                        </button>
                    </div>
                </div>
            </header>

            <div class="p-6 md:p-10 max-w-7xl mx-auto w-full">
                <slot></slot>
            </div>
        </main>
    </Layout>
</template>
