export const getWebClientId = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('clientId');
}