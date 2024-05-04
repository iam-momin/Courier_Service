const COUNTRY_PREFIXES = [
    { country: 'Estonia', value: 'ES' },
    { country: 'Finland', value: 'FL' },
    { country: 'Denmark', value: 'DK' },
    { country: 'Czech Republic', value: 'CZ' },
    { country: 'Luxemburg', value: 'LU' },
    { country: 'Austria', value: 'AU' },
    { country: 'Lithuania', value: 'LT' },
    { country: 'Lavtia', value: 'LV' },
    { country: 'Germany', value: 'DE' },
    { country: 'United Kingdom', value: 'GB' },
    { country: 'Belgium', value: 'BL' },
    { country: 'Holland', value: 'NL' },
    { country: 'Poland', value: 'PL' },
    { country: 'France', value: 'FR' },
];
exports.COUNTRY_PREFIXES = COUNTRY_PREFIXES

const INVOICE_STATUS = [
    { label: 'Unpaid', value: 'Unpaid', color: '#FFFF00' },
    { label: 'Paid', value: 'Paid', color: '#37D91E' },
    { label: 'Overdue', value: 'Overdue', color: '#D61331' },
    { label: 'Refunded', value: 'refunded', color: '#808080' },
    { label: 'Partly Paid', value: 'partlypaid', color: '#FFA500' },
];
exports.INVOICE_STATUS = INVOICE_STATUS