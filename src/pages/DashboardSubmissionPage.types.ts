export type DashboardSubmissionItem = {
    id: string;
    created_at: string;

    // form
    endpoint_slug: string;
    form_id: string;
    form_name: string;

    raw_headers: Record<string, string> | null;

    spam_score: number | null;
    spam_reasons: string[] | null;
    spam_checked_at: string | null;
};

export type Badge = {
    label: string;
    tone: "gray" | "blue" | "green" | "yellow" | "red";
    hint: string;
};
export type HeaderPreview = {
    ua: string;
    contentTypeBadges: Badge[];
};

export type DashboardSubmissionRow = {
    id: string;
    detailHref: string;

    submittedAt: string;
    submittedAtUTC: string;

    formHref: string;
    formName: string;

    preview: HeaderPreview | null;

    spamScore: number | null;
    spamReasons: string[] | null;
    spamCheckedAt: string | null;
};
