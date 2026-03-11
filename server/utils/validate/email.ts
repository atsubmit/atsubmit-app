export const validateEmailFormat = (email: string) => {
    if (!email.includes('@')) return false;

    const [local, domain] = email.split('@');
    if (!local || !domain) return false;

    // local part
    const localRe = /^[A-Za-z0-9._%+-]+$/;
    if (!localRe.test(local)) return false;

    // domain part
    const domainRe = /^(?!-)([A-Za-z0-9-]{1,63})(?<!-)(\.[A-Za-z0-9-]{1,63})+$/;
    if (!domainRe.test(domain)) return false;

    return true;
};
