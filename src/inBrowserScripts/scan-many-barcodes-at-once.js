// paste any number of item or location barcodes in this array to scan them by in-browser script much faster and get records on the UI
const barcodes = [
    "cdf4663a-0acb-46b9-a4dd-fc838f42892d",
    "28bad776-8bdd-4505-81da-7cc654e79726",
    "3bb4e8a3-b3a7-4e45-8d62-bb357e666713",
    "3e42dbf1-49a4-4273-a037-b65dda204526",
];


function setNativeValue(element, value) {
    const valueSetter = Object.getOwnPropertyDescriptor(
        element.__proto__,
        'value'
    ).set;
    valueSetter.call(element, value);
}

async function enterBarcodesOneByOne(barcodes, delayMs = 400) {
    const input = document.querySelector('#barcodeEntryFieldId');

    if (!input) {
        console.error('❌ Input not found:', inputSelector);
        return;
    }

    for (const barcode of barcodes) {
        input.focus();

        // Clear previous value
        setNativeValue(input, '');
        input.dispatchEvent(new Event('input', { bubbles: true }));

        // Set new barcode
        setNativeValue(input, String(barcode));
        input.dispatchEvent(new Event('input', { bubbles: true }));

        // Press ENTER
        input.dispatchEvent(
            new KeyboardEvent('keydown', {
                bubbles: true,
                cancelable: true,
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13
            })
        );

        console.log(`✔️ Submitted barcode: ${barcode}`);

        // Wait before next barcode
        await new Promise(r => setTimeout(r, delayMs));
    }

    console.log('✅ All barcodes processed');
}

// Run it
enterBarcodesOneByOne(barcodes);