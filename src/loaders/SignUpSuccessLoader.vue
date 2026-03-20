<script setup lang="ts">
import { CheckCircle2, PartyPopper, ArrowRight, Plus } from "lucide-vue-next";
import { Motion } from "motion-v";
</script>

<template>
    <div class="min-h-[80vh] flex items-center justify-center px-4 py-20">
        <Motion
            :initial="{ opacity: 0, y: 20 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.6, ease: 'easeOut' }"
            class="max-w-md w-full text-center space-y-8"
        >
            <!-- Success Icon -->
            <div class="relative inline-block">
                <Motion
                    :initial="{ scale: 0 }"
                    :animate="{ scale: 1 }"
                    :transition="{
                        type: 'spring',
                        stiffness: 260,
                        damping: 20,
                        delay: 0.2,
                    }"
                    class="w-24 h-24 bg-apple-blue/10 rounded-full flex items-center justify-center text-apple-blue relative z-10"
                >
                    <CheckCircle2 :size="48" :stroke-width="2.5" />
                </Motion>

                <!-- Decorative -->
                <Motion
                    :initial="{ opacity: 0 }"
                    :animate="{ opacity: [0, 1, 0] }"
                    :transition="{ duration: 2, repeat: Infinity, delay: 0.5 }"
                    class="absolute -top-4 -right-4 text-yellow-500"
                >
                    <PartyPopper :size="32" />
                </Motion>

                <div
                    class="absolute inset-0 bg-apple-blue/20 blur-3xl rounded-full -z-10 animate-pulse"
                />
            </div>

            <!-- Text -->
            <div class="space-y-4">
                <h1 class="text-4xl font-bold tracking-tight text-foreground">
                    Welcome aboard!
                </h1>
                <p class="text-lg text-muted-foreground leading-relaxed">
                    Hooray! You can now start managing your forms easily. Your
                    account is ready and waiting.
                </p>
            </div>

            <!-- Actions -->
            <div class="flex flex-col gap-3 pt-4">
                <a
                    href="/dashboard"
                    class="btn-primary py-3 px-8 text-lg flex items-center justify-center gap-2 group"
                >
                    Go to Dashboard
                    <ArrowRight
                        :size="20"
                        class="group-hover:translate-x-1 transition-transform"
                    />
                </a>

                <a
                    href="/dashboard/forms/new"
                    class="btn-secondary py-3 px-8 text-lg flex items-center justify-center gap-2"
                >
                    <Plus :size="20" />
                    Create Your First Form
                </a>
            </div>

            <!-- Footer -->
            <p class="text-sm text-muted-foreground pt-8">
                Need help getting started?
                <a href="/docs" class="text-apple-blue hover:underline">
                    documentation </a
                >.
            </p>
        </Motion>
    </div>
</template>
