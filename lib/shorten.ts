import tinyUrl from 'tinyurl';

export async function shortenURL(url:string) {
    return new Promise((resolve, reject) => {
        tinyUrl.shorten(url, (shortURL) => {
            if (shortURL) {
                resolve(shortURL);
            } else {
                reject(new Error('Failed to shorten URL!'));
            }
        });
    })
}