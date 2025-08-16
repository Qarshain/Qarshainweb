export function formatSAR(amount: number, language: 'ar' | 'en' = 'en') {
  if (language === 'ar') {
    // For Arabic, use Arabic locale and Arabic word for Riyal
    return `${amount.toLocaleString('ar-SA')} ريال`;
  } else {
    // For English, use English locale and English abbreviation
    return `${amount.toLocaleString('en-US')} SAR`;
  }
}