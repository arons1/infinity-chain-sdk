export const hasManager = (manager: any) => {
    return manager && typeof manager === 'object' ? !!manager.key : !!manager;
};
