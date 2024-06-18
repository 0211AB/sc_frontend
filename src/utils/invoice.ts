import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

const a: string[] = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
const b: string[] = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function inWords(num: number): string | undefined {
    // Convert the number to a string and check for overflow
    if ((num.toString()).length > 9) return 'overflow';

    // Pad the number with leading zeros and match it to the format
    let n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return; // Return undefined if the number doesn't match the pattern

    let str = '';

    // Process each part of the number and convert to words
    str += (Number(n[1]) !== 0) ? (a[Number(n[1])] || b[Number(n[1][0])] + ' ' + a[Number(n[1][1])]) + 'Crore ' : '';
    str += (Number(n[2]) !== 0) ? (a[Number(n[2])] || b[Number(n[2][0])] + ' ' + a[Number(n[2][1])]) + 'Lakh ' : '';
    str += (Number(n[3]) !== 0) ? (a[Number(n[3])] || b[Number(n[3][0])] + ' ' + a[Number(n[3][1])]) + 'Thousand ' : '';
    str += (Number(n[4]) !== 0) ? (a[Number(n[4])] || b[Number(n[4][0])] + ' ' + a[Number(n[4][1])]) + 'Hundred ' : '';
    str += (Number(n[5]) !== 0) ? ((str !== '') ? 'and ' : '') + (a[Number(n[5])] || b[Number(n[5][0])] + ' ' + a[Number(n[5][1])]) + 'only ' : '';

    return str;
}


export const createInvoice = (details: any, selectedProducts: any[]) => {
    (<any>pdfMake).fonts = {
        Roboto: {
            normal: 'Roboto-Regular.ttf',
            bold: 'Roboto-Medium.ttf',
            italics: 'Roboto-Italic.ttf',
            bolditalics: 'Roboto-MediumItalic.ttf'
        }, CID: {
            normal: 'CID.ttf',
            bold: 'CID.ttf',
            italics: 'CID.ttf',
            bolditalics: 'CID.ttf'
        }
    };

    let columns: any[] = [];
    var totalAmountBeforeTax = 0;
    var addCGST = 0;
    var addSGST = 0;
    var addICGST = 0;
    var tax = 0;

    selectedProducts.forEach((product, index) => {
        columns.push(
            [{ text: (index + 1).toString(), fontSize: 10, alignment: 'center' },
            { text: product.name, fontSize: 10, colSpan: 2, alignment: 'center' },
            { text: '' },
            { text: product?.hsn_code?.toString(), fontSize: 10, alignment: 'center' },
            { text: product.quantity.toString(), fontSize: 10, alignment: 'center' },
            { text: product.rate.toString(), fontSize: 10, alignment: 'center' },
            { text: (Number(product.quantity) * Number(product.rate)).toFixed(2), fontSize: 10, alignment: 'center' },
            { text: details.isIGST === false ? (Number(product.gst / 2)).toFixed(2) : 0, fontSize: 10, alignment: 'center' },
            { text: details.isIGST === false ? (Number(product.gst / 200) * Number(product.quantity) * Number(product.rate)).toFixed(2) : 0, fontSize: 10, alignment: 'center' },
            { text: details.isIGST === false ? (Number(product.gst / 2)).toFixed(2) : 0, fontSize: 10, alignment: 'center' },
            { text: details.isIGST === false ? (Number(product.gst / 200) * Number(product.quantity) * Number(product.rate)).toFixed(2) : 0, fontSize: 10, alignment: 'center' },
            { text: details.isIGST === true ? (Number(product.gst)).toFixed(2) : 0, fontSize: 10, alignment: 'center' },
            { text: details.isIGST === true ? (Number(product.gst / 100) * Number(product.quantity) * Number(product.rate)).toFixed(2) : 0, fontSize: 10, alignment: 'center', colSpan: 2 },
            { text: '' }
            ]);
        addCGST += details.isIGST === false ? Number(product.gst / 200) * Number(product.quantity) * Number(product.rate) : 0;
        addSGST += details.isIGST === false ? Number(product.gst / 200) * Number(product.quantity) * Number(product.rate) : 0
        addICGST += details.isIGST === true ? Number(product.gst / 100) * Number(product.quantity) * Number(product.rate) : 0;
        totalAmountBeforeTax += Number(product.quantity) * Number(product.rate)
    });
    columns.push(
        [{ text: '', fontSize: 10, alignment: 'center' },
        { text: '', fontSize: 10, colSpan: 2, alignment: 'center' },
        { text: '' },
        { text: '', fontSize: 10, alignment: 'center' },
        { text: '', fontSize: 10, alignment: 'center' },
        { text: '', fontSize: 10, alignment: 'center' },
        { text: '', fontSize: 10, alignment: 'center' },
        { text: '', fontSize: 10, alignment: 'center' },
        { text: '', fontSize: 10, alignment: 'center' },
        { text: '', fontSize: 10, alignment: 'center' },
        { text: '', fontSize: 10, alignment: 'center' },
        { text: '', fontSize: 10, alignment: 'center' },
        { text: '', fontSize: 10, alignment: 'center', colSpan: 2 },
        { text: '' }
        ]);

    tax += addCGST + addICGST + addSGST;

    var dd: any = {
        // maximum 8 items in 1 PDF
        content: [
            {
                table: {
                    widths: [45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45],
                    heights: 10,
                    body: [
                        [
                            {
                                columns: [
                                    { text: 'TAX INVOICE', fontSize: 11, bold: true, alignment: 'right', margin: [0, 0, 2, 0] },
                                    { text: '(ORIGINAL FOR BUYER/ DUPLICATE FOR SUPPLIER/ TRIPLICATE FOR TRANSPORTER)', fontSize: 6, bold: true, alignment: 'left', margin: [0, 4, 0, 0] }
                                ],
                                colSpan: 14
                            },
                            {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}
                        ],
                        [
                            {
                                stack: [
                                    { text: 'SARAFF CREATIONS', fontSize: 19, bold: true },
                                    { text: 'Address: 689/690 Double Storey, Second Floor, New Rajinder Nagar, New Delhi – 110060 ', fontSize: 10.4 },
                                    { text: 'Mobile: 0091-99991 58468; E-mail: gsaraff@outlook.com', fontSize: 10.4 }
                                ],
                                alignment: 'center',
                                colSpan: 14
                            },
                            {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}
                        ],
                        [
                            { text: 'GSTIN -  07APYPC9410P1Z5', fontSize: 13, bold: true, colSpan: 14, alignment: 'center' },
                            {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}
                        ],
                        [
                            { text: 'RECEIPIENT DETAILS', fontSize: 10, bold: true, colSpan: 7 },
                            {}, {}, {}, {}, {}, {},
                            { text: 'INVOICE NO:', fontSize: 10, bold: true, colSpan: 2 }, {},
                            { text: details.number, fontSize: 10, colSpan: 5, alignment: 'left' },
                            {}, {}, {}, {}
                        ], [
                            { text: 'NAME', fontSize: 10, bold: true },
                            { text: details.name, fontSize: 10, colSpan: 6 }, {}, {}, {}, {}, {},
                            { text: 'INVOICE DATE', fontSize: 10, bold: true, colSpan: 2 }, {},
                            { text: details.date, fontSize: 10, colSpan: 5, alignment: 'left' },
                            {}, {}, {}, {}
                        ], [
                            { text: 'ADDRESS', fontSize: 10, bold: true },
                            { text: details.address, fontSize: 10, colSpan: 6 }, {}, {}, {}, {}, {},
                            { text: 'PLACE OF SUPPLY', fontSize: 10, bold: true, colSpan: 2 }, {},
                            { text: details.place_of_supply, fontSize: 10, colSpan: 5, alignment: 'left' },
                            {}, {}, {}, {}
                        ],
                        [
                            { text: 'STATE', fontSize: 10, bold: true },
                            { text: details.recipient_gst_state, fontSize: 10, colSpan: 2 }, {}, { text: 'STATE CODE', fontSize: 10, bold: true, colSpan: 2 }, {}, { text: details.recipient_gst_statecode, fontSize: 10, colSpan: 2 }, {},
                            { text: 'STATE', fontSize: 10, bold: true, colSpan: 2 }, {},
                            { text: details.place_of_supply_gst_state, fontSize: 10 }, { text: 'STATE CODE', fontSize: 10, bold: true, colSpan: 2 }, {}, { text: details.place_of_supply_gst_statecode, fontSize: 10, colSpan: 2 }, {},
                        ],
                        [
                            { text: 'GSTIN', fontSize: 10, bold: true },
                            { text: details.gst, fontSize: 10, colSpan: 2 }, {}, { text: 'PURCHASE ORDER NO', fontSize: 9, bold: true, colSpan: 2 }, {}, { text: details.purchase_order_number ? details.purchase_order_number : '---', fontSize: 10, colSpan: 2 }, {},
                            { text: 'TAX IS PAYABLE ON REVERSE CHARGE ', fontSize: 10, bold: true, colSpan: 4 }, {}, {}, {}, { text: details.can_reverse ? 'Yes' : 'No', fontSize: 10, colSpan: 3 }, {}, {}
                        ],
                        [
                            { text: 'S.NO', fontSize: 10, bold: true, rowSpan: 2, alignment: 'center' },
                            { text: 'ITEM', fontSize: 10, colSpan: 2, bold: true, rowSpan: 2, alignment: 'center' }, {}, { text: 'HSN', fontSize: 10, bold: true, rowSpan: 2, alignment: 'center' }, { text: 'QTY', fontSize: 10, bold: true, rowSpan: 2, alignment: 'center' }, { text: 'RATE', fontSize: 10, bold: true, rowSpan: 2, alignment: 'center' }, { text: 'AMOUNT', fontSize: 10, rowSpan: 2, bold: true },
                            { text: 'CGST', fontSize: 10, bold: true, colSpan: 2, alignment: 'center' }, {}, { text: 'SGST', fontSize: 10, bold: true, colSpan: 2, alignment: 'center' }, {}, { text: 'IGST', fontSize: 10, colSpan: 3, bold: true, alignment: 'center' }, {}, {}
                        ],
                        [
                            {},
                            {}, {}, {}, {}, {}, {},
                            { text: 'RATE', fontSize: 10, bold: true, alignment: 'center' }, { text: 'AMOUNT', fontSize: 10, bold: true, alignment: 'center' }, { text: 'RATE', fontSize: 10, bold: true, alignment: 'center' }, { text: 'AMOUNT', fontSize: 10, bold: true, alignment: 'center' }, { text: 'RATE', fontSize: 10, bold: true, alignment: 'center' }, { text: 'AMOUNT', fontSize: 10, bold: true, alignment: 'center', colSpan: 2 }, {}
                        ], ...columns,
                        [
                            {
                                stack: [
                                    { text: 'Please issue the Cheque/Payorder in the name of:\n ', fontSize: 10, },
                                    { text: 'SARAFF CREATIONS\n\n', fontSize: 10.4, bold: true },
                                    { text: 'For NEFT/ RTGS Transfer:\nName: Saraff Creations \nCanara Bank, Shaktinagar Branch \nA/c no. 1170201006652 \nIFSC: CNRB0001170 ', fontSize: 10 }
                                ],
                                alignment: 'left',
                                colSpan: 7,
                                rowSpan: 8
                            },
                            {}, {}, {}, {}, {}, {}, { text: 'Total Amount Before Tax', fontSize: 10, colSpan: 4 }, {}, {}, {}, { text: totalAmountBeforeTax.toFixed(2), fontSize: 10, colSpan: 3, alignment: 'center' }, {}, {}
                        ],
                        [{}, {}, {}, {}, {}, {}, {}, { text: 'Reverse Charge @ GST', fontSize: 10, colSpan: 4 }, {}, {}, {}, { text: '0', fontSize: 10, colSpan: 3, alignment: 'center' }, {}, {}],
                        [{}, {}, {}, {}, {}, {}, {}, { text: 'Add: CGST ', fontSize: 10, colSpan: 4 }, {}, {}, {}, { text: addCGST.toFixed(2), fontSize: 10, colSpan: 3, alignment: 'center' }, {}, {}],
                        [{}, {}, {}, {}, {}, {}, {}, { text: 'Add: SGST', fontSize: 10, colSpan: 4 }, {}, {}, {}, { text: addSGST.toFixed(2), fontSize: 10, colSpan: 3, alignment: 'center' }, {}, {}],
                        [{}, {}, {}, {}, {}, {}, {}, { text: 'Add: IGST', fontSize: 10, colSpan: 4 }, {}, {}, {}, { text: addICGST.toFixed(2), fontSize: 10, colSpan: 3, alignment: 'center' }, {}, {}],
                        [{}, {}, {}, {}, {}, {}, {}, { text: 'Total Tax Amount', fontSize: 10, colSpan: 4 }, {}, {}, {}, { text: tax.toFixed(2), fontSize: 10, colSpan: 3, alignment: 'center' }, {}, {}],
                        [{}, {}, {}, {}, {}, {}, {}, { text: 'Packaging/ Shipping/ Printing ', fontSize: 10, colSpan: 4 }, {}, {}, {}, { text: details.packaging ? Number(details.packaging).toFixed(2) : 0, fontSize: 10, colSpan: 3, alignment: 'center' }, {}, {}],
                        [{}, {}, {}, {}, {}, {}, {}, { text: 'Grand Total ', bold: true, fontSize: 10, colSpan: 4 }, {}, {}, {}, { text: Math.ceil(totalAmountBeforeTax + tax + Number(details.packaging ? details.packaging : 0)).toFixed(2), fontSize: 10, colSpan: 3, alignment: 'center', bold: true }, {}, {}],
                        [
                            {
                                columns: [
                                    { text: 'Amount in words:', bold: true, fontSize: 10, width: 90, },
                                    { text: inWords(Math.ceil(totalAmountBeforeTax + tax + Number(details.packaging ? details.packaging : 0))), fontSize: 10, width: '*' },
                                ],
                                id: 'break',
                                colSpan: 14
                            },
                            {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}
                        ],
                        [
                            {
                                stack: [
                                    { text: 'Terms & Conditions:', fontSize: 10, decoration: 'underline', bold: true },
                                    { text: 'Disputes, if any, arising out of the contract will be settled at New Delhi jurisdiction court only.  \n', fontSize: 10, },
                                    { text: 'All complaints must be presented within 10 days of the receipt of the material. ', fontSize: 10 }
                                ],
                                alignment: 'left',
                                colSpan: 7,
                                rowSpan: 1
                            },
                            {}, {}, {}, {}, {}, {}, {
                                image: 'signature',
                                height: 70,
                                alignment: 'center', colSpan: 7, rowSpan: 2
                            }, {}, {}, {}, {}, {}, {}
                        ],
                        [
                            {
                                text: 'E&O.E.',
                                alignment: 'center',
                                fontSize: '10',
                                colSpan: 7
                            },
                            {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}
                        ],
                    ]
                }
            }
        ],
        styles: {},
        pageOrientation: 'landscape',
        images: {
            signature: 'data:image/jpeg;base64,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',
        },
        pageBreakBefore: selectedProducts.length > 7 ? function (currentNode: any) {
            return currentNode.id === 'break';
        } : () => { }
    };

    pdfMake.createPdf(dd, undefined, pdfMake.fonts).download(`${details.number}_${details.name}`);
}

export const viewLiveInvoice = (details: any, selectedProducts: any[]) => {
    (<any>pdfMake).fonts = {
        Roboto: {
            normal: 'Roboto-Regular.ttf',
            bold: 'Roboto-Medium.ttf',
            italics: 'Roboto-Italic.ttf',
            bolditalics: 'Roboto-MediumItalic.ttf'
        }, CID: {
            normal: 'CID.ttf',
            bold: 'CID.ttf',
            italics: 'CID.ttf',
            bolditalics: 'CID.ttf'
        }
    };

    let columns: any[] = [];
    var totalAmountBeforeTax = 0;
    var addCGST = 0;
    var addSGST = 0;
    var addICGST = 0;
    var tax = 0;

    selectedProducts.forEach((product, index) => {
        columns.push(
            [{ text: (index + 1).toString(), fontSize: 10, alignment: 'center' },
            { text: product.name, fontSize: 10, colSpan: 2, alignment: 'center' },
            { text: '' },
            { text: product?.hsn_code?.toString(), fontSize: 10, alignment: 'center' },
            { text: product.quantity.toString(), fontSize: 10, alignment: 'center' },
            { text: product.rate.toString(), fontSize: 10, alignment: 'center' },
            { text: (Number(product.quantity) * Number(product.rate)).toFixed(2), fontSize: 10, alignment: 'center' },
            { text: details.isIGST === false ? (Number(product.gst / 2)).toFixed(2) : 0, fontSize: 10, alignment: 'center' },
            { text: details.isIGST === false ? (Number(product.gst / 200) * Number(product.quantity) * Number(product.rate)).toFixed(2) : 0, fontSize: 10, alignment: 'center' },
            { text: details.isIGST === false ? (Number(product.gst / 2)).toFixed(2) : 0, fontSize: 10, alignment: 'center' },
            { text: details.isIGST === false ? (Number(product.gst / 200) * Number(product.quantity) * Number(product.rate)).toFixed(2) : 0, fontSize: 10, alignment: 'center' },
            { text: details.isIGST === true ? (Number(product.gst)).toFixed(2) : 0, fontSize: 10, alignment: 'center' },
            { text: details.isIGST === true ? (Number(product.gst / 100) * Number(product.quantity) * Number(product.rate)).toFixed(2) : 0, fontSize: 10, alignment: 'center', colSpan: 2 },
            { text: '' }
            ]);
        addCGST += details.isIGST === false ? Number(product.gst / 200) * Number(product.quantity) * Number(product.rate) : 0;
        addSGST += details.isIGST === false ? Number(product.gst / 200) * Number(product.quantity) * Number(product.rate) : 0
        addICGST += details.isIGST === true ? Number(product.gst / 100) * Number(product.quantity) * Number(product.rate) : 0;
        totalAmountBeforeTax += Number(product.quantity) * Number(product.rate)
    });

    columns.push(
        [{ text: '', fontSize: 10, alignment: 'center' },
        { text: '', fontSize: 10, colSpan: 2, alignment: 'center' },
        { text: '' },
        { text: '', fontSize: 10, alignment: 'center' },
        { text: '', fontSize: 10, alignment: 'center' },
        { text: '', fontSize: 10, alignment: 'center' },
        { text: '', fontSize: 10, alignment: 'center' },
        { text: '', fontSize: 10, alignment: 'center' },
        { text: '', fontSize: 10, alignment: 'center' },
        { text: '', fontSize: 10, alignment: 'center' },
        { text: '', fontSize: 10, alignment: 'center' },
        { text: '', fontSize: 10, alignment: 'center' },
        { text: '', fontSize: 10, alignment: 'center', colSpan: 2 },
        { text: '' }
        ]);

    tax += addCGST + addICGST + addSGST;

    var dd: any = {
        // maximum 8 items in 1 PDF
        content: [
            {
                table: {
                    widths: [45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45],
                    heights: 10,
                    body: [
                        [
                            {
                                columns: [
                                    { text: 'TAX INVOICE', fontSize: 11, bold: true, alignment: 'right', margin: [0, 0, 2, 0] },
                                    { text: '(ORIGINAL FOR BUYER/ DUPLICATE FOR SUPPLIER/ TRIPLICATE FOR TRANSPORTER)', fontSize: 6, bold: true, alignment: 'left', margin: [0, 4, 0, 0] }
                                ],
                                colSpan: 14
                            },
                            {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}
                        ],
                        [
                            {
                                stack: [
                                    { text: 'SARAFF CREATIONS', fontSize: 19, bold: true },
                                    { text: 'Address: 689/690 Double Storey, Second Floor, New Rajinder Nagar, New Delhi – 110060 ', fontSize: 10.4 },
                                    { text: 'Mobile: 0091-99991 58468; E-mail: gsaraff@outlook.com', fontSize: 10.4 }
                                ],
                                alignment: 'center',
                                colSpan: 14
                            },
                            {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}
                        ],
                        [
                            { text: 'GSTIN -  07APYPC9410P1Z5', fontSize: 13, bold: true, colSpan: 14, alignment: 'center' },
                            {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}
                        ],
                        [
                            { text: 'RECEIPIENT DETAILS', fontSize: 10, bold: true, colSpan: 7 },
                            {}, {}, {}, {}, {}, {},
                            { text: 'INVOICE NO:', fontSize: 10, bold: true, colSpan: 2 }, {},
                            { text: details.number, fontSize: 10, colSpan: 5, alignment: 'left' },
                            {}, {}, {}, {}
                        ], [
                            { text: 'NAME', fontSize: 10, bold: true },
                            { text: details.name, fontSize: 10, colSpan: 6 }, {}, {}, {}, {}, {},
                            { text: 'INVOICE DATE', fontSize: 10, bold: true, colSpan: 2 }, {},
                            { text: details.date, fontSize: 10, colSpan: 5, alignment: 'left' },
                            {}, {}, {}, {}
                        ], [
                            { text: 'ADDRESS', fontSize: 10, bold: true },
                            { text: details.address, fontSize: 10, colSpan: 6 }, {}, {}, {}, {}, {},
                            { text: 'PLACE OF SUPPLY', fontSize: 10, bold: true, colSpan: 2 }, {},
                            { text: details.place_of_supply, fontSize: 10, colSpan: 5, alignment: 'left' },
                            {}, {}, {}, {}
                        ],
                        [
                            { text: 'STATE', fontSize: 10, bold: true },
                            { text: details.recipient_gst_state, fontSize: 10, colSpan: 2 }, {}, { text: 'STATE CODE', fontSize: 10, bold: true, colSpan: 2 }, {}, { text: details.recipient_gst_statecode, fontSize: 10, colSpan: 2 }, {},
                            { text: 'STATE', fontSize: 10, bold: true, colSpan: 2 }, {},
                            { text: details.place_of_supply_gst_state, fontSize: 10 }, { text: 'STATE CODE', fontSize: 10, bold: true, colSpan: 2 }, {}, { text: details.place_of_supply_gst_statecode, fontSize: 10, colSpan: 2 }, {},
                        ],
                        [
                            { text: 'GSTIN', fontSize: 10, bold: true },
                            { text: details.gst, fontSize: 10, colSpan: 2 }, {}, { text: 'PURCHASE ORDER NO', fontSize: 9, bold: true, colSpan: 2 }, {}, { text: details.purchase_order_number ? details.purchase_order_number : '---', fontSize: 10, colSpan: 2 }, {},
                            { text: 'TAX IS PAYABLE ON REVERSE CHARGE ', fontSize: 10, bold: true, colSpan: 4 }, {}, {}, {}, { text: details.can_reverse ? 'Yes' : 'No', fontSize: 10, colSpan: 3 }, {}, {}
                        ],
                        [
                            { text: 'S.NO', fontSize: 10, bold: true, rowSpan: 2, alignment: 'center' },
                            { text: 'ITEM', fontSize: 10, colSpan: 2, bold: true, rowSpan: 2, alignment: 'center' }, {}, { text: 'HSN', fontSize: 10, bold: true, rowSpan: 2, alignment: 'center' }, { text: 'QTY', fontSize: 10, bold: true, rowSpan: 2, alignment: 'center' }, { text: 'RATE', fontSize: 10, bold: true, rowSpan: 2, alignment: 'center' }, { text: 'AMOUNT', fontSize: 10, rowSpan: 2, bold: true },
                            { text: 'CGST', fontSize: 10, bold: true, colSpan: 2, alignment: 'center' }, {}, { text: 'SGST', fontSize: 10, bold: true, colSpan: 2, alignment: 'center' }, {}, { text: 'IGST', fontSize: 10, colSpan: 3, bold: true, alignment: 'center' }, {}, {}
                        ],
                        [
                            {},
                            {}, {}, {}, {}, {}, {},
                            { text: 'RATE', fontSize: 10, bold: true, alignment: 'center' }, { text: 'AMOUNT', fontSize: 10, bold: true, alignment: 'center' }, { text: 'RATE', fontSize: 10, bold: true, alignment: 'center' }, { text: 'AMOUNT', fontSize: 10, bold: true, alignment: 'center' }, { text: 'RATE', fontSize: 10, bold: true, alignment: 'center' }, { text: 'AMOUNT', fontSize: 10, bold: true, alignment: 'center', colSpan: 2 }, {}
                        ], ...columns,
                        [
                            {
                                stack: [
                                    { text: 'Please issue the Cheque/Payorder in the name of:\n ', fontSize: 10, },
                                    { text: 'SARAFF CREATIONS\n\n', fontSize: 10.4, bold: true },
                                    { text: 'For NEFT/ RTGS Transfer:\nName: Saraff Creations \nCanara Bank, Shaktinagar Branch \nA/c no. 1170201006652 \nIFSC: CNRB0001170 ', fontSize: 10 }
                                ],
                                alignment: 'left',
                                colSpan: 7,
                                rowSpan: 8
                            },
                            {}, {}, {}, {}, {}, {}, { text: 'Total Amount Before Tax', fontSize: 10, colSpan: 4 }, {}, {}, {}, { text: totalAmountBeforeTax.toFixed(2), fontSize: 10, colSpan: 3, alignment: 'center' }, {}, {}
                        ],
                        [{}, {}, {}, {}, {}, {}, {}, { text: 'Reverse Charge @ GST', fontSize: 10, colSpan: 4 }, {}, {}, {}, { text: '0', fontSize: 10, colSpan: 3, alignment: 'center' }, {}, {}],
                        [{}, {}, {}, {}, {}, {}, {}, { text: 'Add: CGST ', fontSize: 10, colSpan: 4 }, {}, {}, {}, { text: addCGST.toFixed(2), fontSize: 10, colSpan: 3, alignment: 'center' }, {}, {}],
                        [{}, {}, {}, {}, {}, {}, {}, { text: 'Add: SGST', fontSize: 10, colSpan: 4 }, {}, {}, {}, { text: addSGST.toFixed(2), fontSize: 10, colSpan: 3, alignment: 'center' }, {}, {}],
                        [{}, {}, {}, {}, {}, {}, {}, { text: 'Add: IGST', fontSize: 10, colSpan: 4 }, {}, {}, {}, { text: addICGST.toFixed(2), fontSize: 10, colSpan: 3, alignment: 'center' }, {}, {}],
                        [{}, {}, {}, {}, {}, {}, {}, { text: 'Total Tax Amount', fontSize: 10, colSpan: 4 }, {}, {}, {}, { text: tax.toFixed(2), fontSize: 10, colSpan: 3, alignment: 'center' }, {}, {}],
                        [{}, {}, {}, {}, {}, {}, {}, { text: 'Packaging/ Shipping/ Printing ', fontSize: 10, colSpan: 4 }, {}, {}, {}, { text: details.packaging ? Number(details.packaging).toFixed(2) : 0, fontSize: 10, colSpan: 3, alignment: 'center' }, {}, {}],
                        [{}, {}, {}, {}, {}, {}, {}, { text: 'Grand Total ', bold: true, fontSize: 10, colSpan: 4 }, {}, {}, {}, { text: Math.ceil(totalAmountBeforeTax + tax + Number(details.packaging ? details.packaging : 0)).toFixed(2), fontSize: 10, colSpan: 3, alignment: 'center', bold: true }, {}, {}],
                        [
                            {
                                columns: [
                                    { text: 'Amount in words:', bold: true, fontSize: 10, width: 90, },
                                    { text: inWords(Math.ceil(totalAmountBeforeTax + tax + Number(details.packaging ? details.packaging : 0))), fontSize: 10, width: '*' },
                                ],
                                id: 'break',
                                colSpan: 14
                            },
                            {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}
                        ],
                        [
                            {
                                stack: [
                                    { text: 'Terms & Conditions:', fontSize: 10, decoration: 'underline', bold: true },
                                    { text: 'Disputes, if any, arising out of the contract will be settled at New Delhi jurisdiction court only.  \n', fontSize: 10, },
                                    { text: 'All complaints must be presented within 10 days of the receipt of the material. ', fontSize: 10 }
                                ],
                                alignment: 'left',
                                colSpan: 7,
                                rowSpan: 1
                            },
                            {}, {}, {}, {}, {}, {}, {
                                image: 'signature',
                                height: 70,
                                alignment: 'center', colSpan: 7, rowSpan: 2
                            }, {}, {}, {}, {}, {}, {}
                        ],
                        [
                            {
                                text: 'E&O.E.',
                                alignment: 'center',
                                fontSize: '10',
                                colSpan: 7
                            },
                            {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}
                        ],
                    ]
                }
            }
        ],
        styles: {},
        pageOrientation: 'landscape',
        images: {
            signature: 'data:image/jpeg;base64,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',
        },
        pageBreakBefore: columns.length > 5 ? function (currentNode: any) {
            return currentNode.id === 'break';
        } : () => { }
    };

    const pdfDocGenerator = pdfMake.createPdf(dd);
    try {
        pdfDocGenerator.getDataUrl((dataUrl: any) => {
            let element: HTMLElement | null = document.querySelector('#invoiceIframeContainer');
            if (element) {
                element.innerHTML = "";
            }
            const iframe = document.createElement('iframe');
            iframe.src = dataUrl + '#toolbar=0&navpanes=0';
            element?.appendChild(iframe);
        });
    } catch (e) {
        console.log(e)
    }
}

export const viewinTab = (details: any, selectedProducts: any[]) => {
    (<any>pdfMake).fonts = {
        Roboto: {
            normal: 'Roboto-Regular.ttf',
            bold: 'Roboto-Medium.ttf',
            italics: 'Roboto-Italic.ttf',
            bolditalics: 'Roboto-MediumItalic.ttf'
        }, CID: {
            normal: 'CID.ttf',
            bold: 'CID.ttf',
            italics: 'CID.ttf',
            bolditalics: 'CID.ttf'
        }
    };

    let columns: any[] = [];
    var totalAmountBeforeTax = 0;
    var addCGST = 0;
    var addSGST = 0;
    var addICGST = 0;
    var tax = 0;

    selectedProducts.forEach((product, index) => {
        columns.push(
            [{ text: (index + 1).toString(), fontSize: 10, alignment: 'center' },
            { text: product.name, fontSize: 10, colSpan: 2, alignment: 'center' },
            { text: '' },
            { text: product?.hsn_code?.toString(), fontSize: 10, alignment: 'center' },
            { text: product.quantity.toString(), fontSize: 10, alignment: 'center' },
            { text: product.rate.toString(), fontSize: 10, alignment: 'center' },
            { text: (Number(product.quantity) * Number(product.rate)).toFixed(2), fontSize: 10, alignment: 'center' },
            { text: details.isIGST === false ? (Number(product.gst / 2)).toFixed(2) : 0, fontSize: 10, alignment: 'center' },
            { text: details.isIGST === false ? (Number(product.gst / 200) * Number(product.quantity) * Number(product.rate)).toFixed(2) : 0, fontSize: 10, alignment: 'center' },
            { text: details.isIGST === false ? (Number(product.gst / 2)).toFixed(2) : 0, fontSize: 10, alignment: 'center' },
            { text: details.isIGST === false ? (Number(product.gst / 200) * Number(product.quantity) * Number(product.rate)).toFixed(2) : 0, fontSize: 10, alignment: 'center' },
            { text: details.isIGST === true ? (Number(product.gst)).toFixed(2) : 0, fontSize: 10, alignment: 'center' },
            { text: details.isIGST === true ? (Number(product.gst / 100) * Number(product.quantity) * Number(product.rate)).toFixed(2) : 0, fontSize: 10, alignment: 'center', colSpan: 2 },
            { text: '' }
            ]);
        addCGST += details.isIGST === false ? Number(product.gst / 200) * Number(product.quantity) * Number(product.rate) : 0;
        addSGST += details.isIGST === false ? Number(product.gst / 200) * Number(product.quantity) * Number(product.rate) : 0
        addICGST += details.isIGST === true ? Number(product.gst / 100) * Number(product.quantity) * Number(product.rate) : 0;
        totalAmountBeforeTax += Number(product.quantity) * Number(product.rate)
    });

    columns.push(
        [{ text: '', fontSize: 10, alignment: 'center' },
        { text: '', fontSize: 10, colSpan: 2, alignment: 'center' },
        { text: '' },
        { text: '', fontSize: 10, alignment: 'center' },
        { text: '', fontSize: 10, alignment: 'center' },
        { text: '', fontSize: 10, alignment: 'center' },
        { text: '', fontSize: 10, alignment: 'center' },
        { text: '', fontSize: 10, alignment: 'center' },
        { text: '', fontSize: 10, alignment: 'center' },
        { text: '', fontSize: 10, alignment: 'center' },
        { text: '', fontSize: 10, alignment: 'center' },
        { text: '', fontSize: 10, alignment: 'center' },
        { text: '', fontSize: 10, alignment: 'center', colSpan: 2 },
        { text: '' }
        ]);

    tax += addCGST + addICGST + addSGST;

    var dd: any = {
        // maximum 8 items in 1 PDF
        content: [
            {
                table: {
                    widths: [45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45],
                    heights: 10,
                    body: [
                        [
                            {
                                columns: [
                                    { text: 'TAX INVOICE', fontSize: 11, bold: true, alignment: 'right', margin: [0, 0, 2, 0] },
                                    { text: '(ORIGINAL FOR BUYER/ DUPLICATE FOR SUPPLIER/ TRIPLICATE FOR TRANSPORTER)', fontSize: 6, bold: true, alignment: 'left', margin: [0, 4, 0, 0] }
                                ],
                                colSpan: 14
                            },
                            {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}
                        ],
                        [
                            {
                                stack: [
                                    { text: 'SARAFF CREATIONS', fontSize: 19, bold: true },
                                    { text: 'Address: 689/690 Double Storey, Second Floor, New Rajinder Nagar, New Delhi – 110060 ', fontSize: 10.4 },
                                    { text: 'Mobile: 0091-99991 58468; E-mail: gsaraff@outlook.com', fontSize: 10.4 }
                                ],
                                alignment: 'center',
                                colSpan: 14
                            },
                            {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}
                        ],
                        [
                            { text: 'GSTIN -  07APYPC9410P1Z5', fontSize: 13, bold: true, colSpan: 14, alignment: 'center' },
                            {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}
                        ],
                        [
                            { text: 'RECEIPIENT DETAILS', fontSize: 10, bold: true, colSpan: 7 },
                            {}, {}, {}, {}, {}, {},
                            { text: 'INVOICE NO:', fontSize: 10, bold: true, colSpan: 2 }, {},
                            { text: details.number, fontSize: 10, colSpan: 5, alignment: 'left' },
                            {}, {}, {}, {}
                        ], [
                            { text: 'NAME', fontSize: 10, bold: true },
                            { text: details.name, fontSize: 10, colSpan: 6 }, {}, {}, {}, {}, {},
                            { text: 'INVOICE DATE', fontSize: 10, bold: true, colSpan: 2 }, {},
                            { text: details.date, fontSize: 10, colSpan: 5, alignment: 'left' },
                            {}, {}, {}, {}
                        ], [
                            { text: 'ADDRESS', fontSize: 10, bold: true },
                            { text: details.address, fontSize: 10, colSpan: 6 }, {}, {}, {}, {}, {},
                            { text: 'PLACE OF SUPPLY', fontSize: 10, bold: true, colSpan: 2 }, {},
                            { text: details.place_of_supply, fontSize: 10, colSpan: 5, alignment: 'left' },
                            {}, {}, {}, {}
                        ],
                        [
                            { text: 'STATE', fontSize: 10, bold: true },
                            { text: details.recipient_gst_state, fontSize: 10, colSpan: 2 }, {}, { text: 'STATE CODE', fontSize: 10, bold: true, colSpan: 2 }, {}, { text: details.recipient_gst_statecode, fontSize: 10, colSpan: 2 }, {},
                            { text: 'STATE', fontSize: 10, bold: true, colSpan: 2 }, {},
                            { text: details.place_of_supply_gst_state, fontSize: 10 }, { text: 'STATE CODE', fontSize: 10, bold: true, colSpan: 2 }, {}, { text: details.place_of_supply_gst_statecode, fontSize: 10, colSpan: 2 }, {},
                        ],
                        [
                            { text: 'GSTIN', fontSize: 10, bold: true },
                            { text: details.gst, fontSize: 10, colSpan: 2 }, {}, { text: 'PURCHASE ORDER NO', fontSize: 9, bold: true, colSpan: 2 }, {}, { text: details.purchase_order_number ? details.purchase_order_number : '---', fontSize: 10, colSpan: 2 }, {},
                            { text: 'TAX IS PAYABLE ON REVERSE CHARGE ', fontSize: 10, bold: true, colSpan: 4 }, {}, {}, {}, { text: details.can_reverse ? 'Yes' : 'No', fontSize: 10, colSpan: 3 }, {}, {}
                        ],
                        [
                            { text: 'S.NO', fontSize: 10, bold: true, rowSpan: 2, alignment: 'center' },
                            { text: 'ITEM', fontSize: 10, colSpan: 2, bold: true, rowSpan: 2, alignment: 'center' }, {}, { text: 'HSN', fontSize: 10, bold: true, rowSpan: 2, alignment: 'center' }, { text: 'QTY', fontSize: 10, bold: true, rowSpan: 2, alignment: 'center' }, { text: 'RATE', fontSize: 10, bold: true, rowSpan: 2, alignment: 'center' }, { text: 'AMOUNT', fontSize: 10, rowSpan: 2, bold: true },
                            { text: 'CGST', fontSize: 10, bold: true, colSpan: 2, alignment: 'center' }, {}, { text: 'SGST', fontSize: 10, bold: true, colSpan: 2, alignment: 'center' }, {}, { text: 'IGST', fontSize: 10, colSpan: 3, bold: true, alignment: 'center' }, {}, {}
                        ],
                        [
                            {},
                            {}, {}, {}, {}, {}, {},
                            { text: 'RATE', fontSize: 10, bold: true, alignment: 'center' }, { text: 'AMOUNT', fontSize: 10, bold: true, alignment: 'center' }, { text: 'RATE', fontSize: 10, bold: true, alignment: 'center' }, { text: 'AMOUNT', fontSize: 10, bold: true, alignment: 'center' }, { text: 'RATE', fontSize: 10, bold: true, alignment: 'center' }, { text: 'AMOUNT', fontSize: 10, bold: true, alignment: 'center', colSpan: 2 }, {}
                        ], ...columns,
                        [
                            {
                                stack: [
                                    { text: 'Please issue the Cheque/Payorder in the name of:\n ', fontSize: 10, },
                                    { text: 'SARAFF CREATIONS\n\n', fontSize: 10.4, bold: true },
                                    { text: 'For NEFT/ RTGS Transfer:\nName: Saraff Creations \nCanara Bank, Shaktinagar Branch \nA/c no. 1170201006652 \nIFSC: CNRB0001170 ', fontSize: 10 }
                                ],
                                alignment: 'left',
                                colSpan: 7,
                                rowSpan: 8
                            },
                            {}, {}, {}, {}, {}, {}, { text: 'Total Amount Before Tax', fontSize: 10, colSpan: 4 }, {}, {}, {}, { text: totalAmountBeforeTax.toFixed(2), fontSize: 10, colSpan: 3, alignment: 'center' }, {}, {}
                        ],
                        [{}, {}, {}, {}, {}, {}, {}, { text: 'Reverse Charge @ GST', fontSize: 10, colSpan: 4 }, {}, {}, {}, { text: '0', fontSize: 10, colSpan: 3, alignment: 'center' }, {}, {}],
                        [{}, {}, {}, {}, {}, {}, {}, { text: 'Add: CGST ', fontSize: 10, colSpan: 4 }, {}, {}, {}, { text: addCGST.toFixed(2), fontSize: 10, colSpan: 3, alignment: 'center' }, {}, {}],
                        [{}, {}, {}, {}, {}, {}, {}, { text: 'Add: SGST', fontSize: 10, colSpan: 4 }, {}, {}, {}, { text: addSGST.toFixed(2), fontSize: 10, colSpan: 3, alignment: 'center' }, {}, {}],
                        [{}, {}, {}, {}, {}, {}, {}, { text: 'Add: IGST', fontSize: 10, colSpan: 4 }, {}, {}, {}, { text: addICGST.toFixed(2), fontSize: 10, colSpan: 3, alignment: 'center' }, {}, {}],
                        [{}, {}, {}, {}, {}, {}, {}, { text: 'Total Tax Amount', fontSize: 10, colSpan: 4 }, {}, {}, {}, { text: tax.toFixed(2), fontSize: 10, colSpan: 3, alignment: 'center' }, {}, {}],
                        [{}, {}, {}, {}, {}, {}, {}, { text: 'Packaging/ Shipping/ Printing ', fontSize: 10, colSpan: 4 }, {}, {}, {}, { text: details.packaging ? Number(details.packaging).toFixed(2) : 0, fontSize: 10, colSpan: 3, alignment: 'center' }, {}, {}],
                        [{}, {}, {}, {}, {}, {}, {}, { text: 'Grand Total ', bold: true, fontSize: 10, colSpan: 4 }, {}, {}, {}, { text: Math.ceil(totalAmountBeforeTax + tax + Number(details.packaging ? details.packaging : 0)).toFixed(2), fontSize: 10, colSpan: 3, alignment: 'center', bold: true }, {}, {}],
                        [
                            {
                                columns: [
                                    { text: 'Amount in words:', bold: true, fontSize: 10, width: 90, },
                                    { text: inWords(Math.ceil(totalAmountBeforeTax + tax + Number(details.packaging ? details.packaging : 0))), fontSize: 10, width: '*' },
                                ],
                                id: 'break',
                                colSpan: 14
                            },
                            {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}
                        ],
                        [
                            {
                                stack: [
                                    { text: 'Terms & Conditions:', fontSize: 10, decoration: 'underline', bold: true },
                                    { text: 'Disputes, if any, arising out of the contract will be settled at New Delhi jurisdiction court only.  \n', fontSize: 10, },
                                    { text: 'All complaints must be presented within 10 days of the receipt of the material. ', fontSize: 10 }
                                ],
                                alignment: 'left',
                                colSpan: 7,
                                rowSpan: 1
                            },
                            {}, {}, {}, {}, {}, {}, {
                                image: 'signature',
                                height: 70,
                                alignment: 'center', colSpan: 7, rowSpan: 2
                            }, {}, {}, {}, {}, {}, {}
                        ],
                        [
                            {
                                text: 'E&O.E.',
                                alignment: 'center',
                                fontSize: '10',
                                colSpan: 7
                            },
                            {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}
                        ],
                    ]
                }
            }
        ],
        styles: {},
        pageOrientation: 'landscape',
        images: {
            signature: 'data:image/jpeg;base64,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',
        },
        pageBreakBefore: columns.length > 5 ? function (currentNode: any) {
            return currentNode.id === 'break';
        } : () => { }
    };

    pdfMake.createPdf(dd, undefined, pdfMake.fonts).open();
}