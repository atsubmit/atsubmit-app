import type { AsyncComponentLoader } from "vue";

export const PageLoadingViewAsyncLoader = () =>
    import("@/loaders/Loads/PageLoadingLoader.vue");
export const PageLoadFailViewAsyncLoader = () =>
    import("@/loaders/Loads/PageLoadFailLoader.vue");
export const Error404ViewAsyncLoader = () =>
    import("@/loaders/Error/404Loader.vue");
export const Error500ViewAsyncLoader = () =>
    import("@/loaders/Error/500Loader.vue");
export const ErrorViewAsyncLoader = () =>
    import("@/loaders/Error/HttpStatusLoader.vue");

export const HomeLoader = () => import("@/loaders/HomeLoader.vue");
export const LoginLoader = () => import("@/loaders/LoginLoader.vue");
export const SignUpLoader = () => import("@/loaders/SignUpLoader.vue");
export const ForgotPasswordLoader = () =>
    import("@/loaders/ForgotPasswordLoader.vue");
export const ForgotPasswordSubmittedLoader = () =>
    import("@/loaders/ForgotPasswordSubmittedLoader.vue");
export const ResetPasswordLoader = () =>
    import("@/loaders/ResetPasswordLoader.vue");
export const ResetPasswordSuccessLoader = () =>
    import("@/loaders/ResetPasswordSuccessLoader.vue");
export const ResetPasswordUsedLoader = () =>
    import("@/loaders/ResetPasswordUsedLoader.vue");

const DashboardLoader = () => import("@/loaders/DashboardLoader.vue");
const DashboardSettingsLoader = () =>
    import("@/loaders/DashboardProfileSettingsLoader.vue");
const DashboardProcessingSettingsLoader = () =>
    import("@/loaders/DashboardProcessingSettingsLoader.vue");
const DashboardDomainsSettingsLoader = () =>
    import("@/loaders/DashboardDomainSettingsLoader.vue");
const DashboardNotificationsSettingsLoader = () =>
    import("@/loaders/DashboardNotificationSettingsLoader.vue");

const DashboardFormListLoader = () =>
    import("@/loaders/DashboardFormListLoader.vue");
const DashboardCreateNewFormLoader = () =>
    import("@/loaders/DashboardCreateNewFormLoader.vue");
const DashboardEditFormGeneralSettingsLoader = () =>
    import("@/loaders/DashboardEditFormGeneralSettingsLoader.vue");
const DashboardEditFormProcessingSettingsLoader = () =>
    import("@/loaders/DashboardEditFormProcessingSettingsLoader.vue");
const DashboardEditFormDomainSettingsLoader = () =>
    import("@/loaders/DashboardEditFormDomainSettingsLoader.vue");
const DashboardEditFormNotificationSettingsLoader = () =>
    import("@/loaders/DashboardEditFormNotificationSettingsLoader.vue");

const DashboardSubmissionListLoader = () =>
    import("@/loaders/DashboardSubmissionListLoader.vue");
const DashboardSubmissionDetailLoader = () =>
    import("@/loaders/DashboardSubmissionDetailLoader.vue");


export const HTTP_STATUS_MAP: Record<string, AsyncComponentLoader> = {
    "404": Error404ViewAsyncLoader,
    "500": Error500ViewAsyncLoader,
};

/**
 * key has:
 * - no front slash
 * - no tail slash
 */
export const PATH_MAP: Record<string, AsyncComponentLoader> = {
    "": HomeLoader,
    login: LoginLoader,
    signup: SignUpLoader,
    "forgot-password": ForgotPasswordLoader,
    "forgot-password-submitted": ForgotPasswordSubmittedLoader,
    "reset-password": ResetPasswordLoader,
    "reset-password-used": ResetPasswordUsedLoader,
    "reset-password-success": ResetPasswordSuccessLoader,

    dashboard: DashboardLoader,

    "dashboard/settings": DashboardSettingsLoader,
    "dashboard/settings/profile": DashboardSettingsLoader,
    "dashboard/settings/processing": DashboardProcessingSettingsLoader,
    "dashboard/settings/domains": DashboardDomainsSettingsLoader,
    "dashboard/settings/notifications": DashboardNotificationsSettingsLoader,

    "dashboard/forms": DashboardFormListLoader,
    "dashboard/forms/new": DashboardCreateNewFormLoader,
    "dashboard/form/:id": DashboardEditFormGeneralSettingsLoader,
    "dashboard/form/:id/general": DashboardEditFormGeneralSettingsLoader,
    "dashboard/form/:id/processing": DashboardEditFormProcessingSettingsLoader,
    "dashboard/form/:id/domains": DashboardEditFormDomainSettingsLoader,
    "dashboard/form/:id/notifications":
        DashboardEditFormNotificationSettingsLoader,

    "dashboard/submissions": DashboardSubmissionListLoader,
    "dashboard/submission/:id": DashboardSubmissionDetailLoader,
};
