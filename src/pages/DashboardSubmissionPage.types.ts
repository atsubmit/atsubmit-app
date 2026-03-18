export type DashboardSubmissionRow = {
    id: string
    form: string
    data: Record<string, any>
    time: string
    ip: string
    spam: boolean
    userAgent: string
}