export const getWebClientId = (): string => {
    try { return (global as any).currentClientId }
    catch (e) { return null; }
}