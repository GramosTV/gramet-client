export function formatURL(url: string): string {
    return url.replace(/\s+/g, '-').replace(/,/g, '').toLowerCase();
}