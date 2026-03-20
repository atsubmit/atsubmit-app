<script setup lang="ts">
import { CheckCircle2, ArrowRight, Sparkles } from "lucide-vue-next";
import { Motion } from "motion-v";
</script>

<template>
    <div class="min-h-[80vh] flex items-center justify-center px-4 py-20">
        <Motion
            :initial="{ opacity: 0, scale: 0.95 }"
            :animate="{ opacity: 1, scale: 1 }"
            :transition="{ duration: 0.5, ease: 'easeOut' }"
            class="max-w-md w-full text-center space-y-10"
        >
            <!-- Icon -->
            <div class="relative inline-block">
                <Motion
                    :initial="{ scale: 0, rotate: -20 }"
                    :animate="{ scale: 1, rotate: 0 }"
                    :transition="{
                        type: 'spring',
                        stiffness: 260,
                        damping: 20,
                        delay: 0.1,
                    }"
                    class="w-28 h-28 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 relative z-10"
                >
                    <CheckCircle2 :size="56" :stroke-width="2.5" />
                </Motion>

                <!-- Sparkles -->
                <Motion
                    :animate="{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }"
                    :transition="{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }"
                    class="absolute -top-2 -right-2 text-emerald-400"
                >
                    <Sparkles :size="24" />
                </Motion>

                <Motion
                    :animate="{ y: [0, 10, 0], opacity: [0.3, 0.8, 0.3] }"
                    :transition="{
                        duration: 4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 1,
                    }"
                    class="absolute -bottom-4 -left-4 text-emerald-300"
                >
                    <Sparkles :size="20" />
                </Motion>

                <div
                    class="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full -z-10"
                />
            </div>

            <!-- Text -->
            <div class="space-y-4">
                <Motion
                    :initial="{ opacity: 0, y: 10 }"
                    :animate="{ opacity: 1, y: 0 }"
                    :transition="{ delay: 0.3 }"
                    class="text-4xl font-bold tracking-tight text-foreground"
                >
                    All set — your email is confirmed
                </Motion>

                <Motion
                    :initial="{ opacity: 0, y: 10 }"
                    :animate="{ opacity: 1, y: 0 }"
                    :transition="{ delay: 0.4 }"
                    class="text-lg text-muted-foreground leading-relaxed px-4"
                >
                    Thanks for verifying your email. Your account is now fully
                    active and you're ready to start collecting submissions.
                </Motion>
            </div>

            <!-- Action -->
            <Motion
                :initial="{ opacity: 0, y: 20 }"
                :animate="{ opacity: 1, y: 0 }"
                :transition="{ delay: 0.5 }"
                class="pt-4"
            >
                <a
                    href="/dashboard"
                    class="btn-primary py-4 px-10 text-lg flex items-center justify-center gap-3 group shadow-lg shadow-apple-blue/20"
                >
                    Go to Dashboard
                    <ArrowRight
                        :size="20"
                        class="group-hover:translate-x-1 transition-transform"
                    />
                </a>
            </Motion>

            <!-- Footer -->
            <Motion
                :initial="{ opacity: 0 }"
                :animate="{ opacity: 1 }"
                :transition="{ delay: 0.7 }"
                class="space-y-2 pt-8"
            >
                <p class="text-sm text-muted-foreground">
                    Need help?
                    <a
                        href="/contact"
                        class="text-apple-blue hover:underline font-medium"
                    >
                        Contact support anytime </a
                    >.
                </p>
                <p class="text-xs text-muted-foreground/60">
                    Didn’t expect this? You can safely ignore this page.
                </p>
            </Motion>
        </Motion>
    </div>
</template>
