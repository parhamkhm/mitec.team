const FA = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];

export const toFa = (input) => String(input ?? '').replace(/\d/g, (d) => FA[+d]);
export const toEn = (input) => String(input ?? '').replace(/[۰-۹]/g, (d) => String(FA.indexOf(d)));

export const faNumber = (n) => toFa(Number(n).toLocaleString('en-US'));

// Tomans, shortened: 38000000 -> «۳۸ میلیون تومان»
export const faToman = (n) => toFa(Math.round(n / 1e6)) + ' میلیون تومان';
