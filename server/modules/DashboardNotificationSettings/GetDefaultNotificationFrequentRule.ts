export interface NotificationFrequentRule {
    id: string;
    label: string;
    desc: string;
    plan: string;
    selectable: boolean;
}

export const NOTIFICATION_FREQUENT_RULES: NotificationFrequentRule[] = [
    {
        id: "immediately",
        label: "Immediately",
        desc: "Send an email for every new submission.",
        plan: "Pro",
        selectable: false,
    },
    {
        id: "hourly",
        label: "Hourly Digest",
        desc: "A summary of all submissions from the last hour.",
        plan: "Pro",
        selectable: false,
    },
    {
        id: "daily",
        label: "Daily Digest",
        desc: "A summary of all submissions from the last 24 hours.",
        plan: "Starter",
        selectable: false,
    },
    {
        id: "weekly",
        label: "Weekly Report",
        desc: "A summary of all submissions from the last week.",
        plan: "Free",
        selectable: true,
    },
    {
        id: "custom",
        label: "Custom",
        desc: "Receive notifications at a custom interval you define.",
        plan: "Pro",
        selectable: true,
    },
];
