export function isValidImageUrl(url) {
    return typeof url === 'string' && /\.(jpg|jpeg|png)$/i.test(url)
}
