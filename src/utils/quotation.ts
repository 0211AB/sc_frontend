import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { palaBase64 } from '../fonts/pala';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
(<any>pdfMake).vfs['Pala.ttf'] = palaBase64

export const createQuotation = (details: any, selectedOptions: any[]) => {
    (<any>pdfMake).fonts = {
        Roboto: {
            normal: 'Roboto-Regular.ttf',
            bold: 'Roboto-Medium.ttf',
            italics: 'Roboto-Italic.ttf',
            bolditalics: 'Roboto-MediumItalic.ttf'
        }, Pala: {
            normal: 'Pala.ttf',
            bold: 'Pala.ttf',
            italics: 'Pala.ttf',
            bolditalics: 'Pala.ttf'
        }
    };

    const tableBody = [
        [
            { text: 'S.No.', alignment: 'center', bold: true },
            { text: 'HSN Code', alignment: 'center', bold: true },
            { text: 'Item', alignment: 'center', bold: true },
            { text: 'Quantity (Units)', alignment: 'center', bold: true },
            { text: 'Unit Price (Rs.)', alignment: 'center', bold: true },
            { text: 'Tax Rate (%)', alignment: 'center', bold: true }
        ]
    ];

    selectedOptions.forEach((option: any, index: number) => {
        tableBody.push([
            { text: (index + 1).toString(), alignment: 'center', bold: false },
            { text: option.hsn_code ? option.hsn_code : '-', alignment: 'center', bold: false },
            { text: option.name, alignment: 'center', bold: false },
            { text: option.quantity.toString(), alignment: 'center', bold: false },
            { text: option.rate.toString(), alignment: 'center', bold: false },
            { text: option.gst.toString(), alignment: 'center', bold: false }
        ]);
    });


    var dd: any = {
        info: {
            title: `Quotation_${details.company}`,
            author: 'Saraff Creations',
            subject: details.subject,
        },
        content: [
            {
                image: 'header',
                width: 515,
                alignment: 'center'
            },
            {
                alignment: 'justify',
                columns: [
                    {
                        width: 350,
                        text: `\nRef : ${details.ref}\n\nTo,\n ${details.company} ${details.address_line_1 !== '' ? `\n` + details.address_line_1 + ',' : ''} ${details.address_line_2 !== '' ? `\n` + details.address_line_2 + ',' : ''} ${details.address_line_3 !== '' ? `\n` + details.address_line_3 + ',' : ''} ${details.address_line_4 !== '' ? `\n` + details.address_line_4 + ',' : ''} \n\n Dear ${details.dear ? details.dear : 'Sir'},`
                    },
                    {
                        text: `\nDate : ${details.date}`,
                        alignment: 'center'
                    }
                ]
            },
            {
                text: `Subject: ${details.subject}`,
                alignment: 'center',
                decoration: 'underline'
            },
            {
                text: `\n${details.introduction}`,
            },
            {
                style: 'productTable',
                table: {
                    widths: [30, 70, 200, '*', '*', '*'],
                    body: tableBody
                }
            },
            {
                text: 'Terms And Conditions:',
                decoration: 'underline',
                fontSize: 9,
            },
            {
                ul: details.terms.split('\n'),
                fontSize: 9
            },
            {
                text: `\n${details.conclusion} \n\nRegards \nFor Saraff Creations \nSd/- \n${details.name} \n(Authorised Signatory) \n${details.details}`
            }
        ],
        styles: {
            header: {
                fontSize: 20,
                bold: true
            },
            subheader: {
                fontSize: 15,
                bold: true
            },
            quote: {
                italics: true
            },
            small: {
                fontSize: 8
            },
            productTable: {
                margin: [0, 5, 0, 15]
            }
        },
        defaultStyle: {
            columnGap: 20,
            font: 'Pala',
            fontSize: 11
        },
        footer: {
            text: '____________________________________________________________________________________________________________________\nRegd. Office: 689/690 Double Storey, Second Floor, New Rajinder Nagar, New Delhi – 110060\nMobile: 0091-99991 58468; E-mail: gsaraff@outlook.com; GSTN - 07APYPC9410P1Z5',
            alignment: 'center',
            fontSize: 10,
            color: 'gray'
        },
        images: {
            header: 'data:image/png;base64,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',
        },
    }

    pdfMake.createPdf(dd, undefined, pdfMake.fonts).download(`Quotation_${details.company}`);
}

export const viewLiveQuotation = (details: any, selectedOptions: any[]) => {
    (<any>pdfMake).fonts = {
        Roboto: {
            normal: 'Roboto-Regular.ttf',
            bold: 'Roboto-Medium.ttf',
            italics: 'Roboto-Italic.ttf',
            bolditalics: 'Roboto-MediumItalic.ttf'
        }, Pala: {
            normal: 'Pala.ttf',
            bold: 'Pala.ttf',
            italics: 'Pala.ttf',
            bolditalics: 'Pala.ttf'
        }
    };

    const tableBody = [
        [
            { text: 'S.No.', alignment: 'center', bold: true },
            { text: 'HSN Code', alignment: 'center', bold: true },
            { text: 'Item', alignment: 'center', bold: true },
            { text: 'Quantity (Units)', alignment: 'center', bold: true },
            { text: 'Unit Price (Rs.)', alignment: 'center', bold: true },
            { text: 'Tax Rate (%)', alignment: 'center', bold: true }
        ]
    ];

    selectedOptions.forEach((option: any, index: number) => {
        tableBody.push([
            { text: (index + 1).toString(), alignment: 'center', bold: false },
            { text: option.hsn_code ? option.hsn_code : '-', alignment: 'center', bold: false },
            { text: option.name, alignment: 'center', bold: false },
            { text: option.quantity.toString(), alignment: 'center', bold: false },
            { text: option.rate.toString(), alignment: 'center', bold: false },
            { text: option.gst.toString(), alignment: 'center', bold: false }
        ]);
    });

    var dd: any = {
        content: [
            {
                image: 'header',
                width: 515,
                alignment: 'center'
            },
            {
                alignment: 'justify',
                columns: [
                    {
                        width: 350,
                        text: `\nRef : ${details.ref}\n\nTo,\n ${details.company} ${details.address_line_1 !== '' ? `\n` + details.address_line_1 + ',' : ''} ${details.address_line_2 !== '' ? `\n` + details.address_line_2 + ',' : ''} ${details.address_line_3 !== '' ? `\n` + details.address_line_3 + ',' : ''} ${details.address_line_4 !== '' ? `\n` + details.address_line_4 + ',' : ''} \n\n Dear ${details.dear ? details.dear : 'Sir'},`
                    },
                    {
                        text: `\nDate : ${details.date}`,
                        alignment: 'center'
                    }
                ]
            },
            {
                text: `Subject: ${details.subject}`,
                alignment: 'center',
                decoration: 'underline'
            },
            {
                text: `\n${details.introduction}`,
            },
            {
                style: 'productTable',
                table: {
                    widths: [30, 70, 200, '*', '*', '*'],
                    body: tableBody
                }
            },
            {
                text: 'Terms And Conditions:',
                decoration: 'underline',
                fontSize: 9,
            },
            {
                ul: details.terms.split('\n'),
                fontSize: 9
            },
            {
                text: `\n${details.conclusion} \n\nRegards \nFor Saraff Creations \nSd/- \n${details.name} \n(Authorised Signatory) \n${details.details}`
            }
        ],
        styles: {
            header: {
                fontSize: 20,
                bold: true
            },
            subheader: {
                fontSize: 15,
                bold: true
            },
            quote: {
                italics: true
            },
            small: {
                fontSize: 8
            },
            productTable: {
                margin: [0, 5, 0, 15]
            }
        },
        defaultStyle: {
            columnGap: 20,
            font: 'Pala',
            fontSize: 11
        },
        footer: {
            text: '____________________________________________________________________________________________________________________\nRegd. Office: 689/690 Double Storey, Second Floor, New Rajinder Nagar, New Delhi – 110060\nMobile: 0091-99991 58468; E-mail: gsaraff@outlook.com; GSTN - 07APYPC9410P1Z5',
            alignment: 'center',
            fontSize: 10,
            color: 'gray'
        },
        images: {
            header: 'data:image/png;base64,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',
        },
    }

    const pdfDocGenerator = pdfMake.createPdf(dd);
    pdfDocGenerator.getDataUrl((dataUrl: any) => {
        let element: HTMLElement | null = document.querySelector('#quotationIframeContainer');
        if (element) {
            element.innerHTML = "";
        }
        const iframe = document.createElement('iframe');
        iframe.src = dataUrl + '#toolbar=0&navpanes=0';
        element?.appendChild(iframe);
    });
}

export const viewinTab = (details: any, selectedOptions: any[]) => {
    (<any>pdfMake).fonts = {
        Roboto: {
            normal: 'Roboto-Regular.ttf',
            bold: 'Roboto-Medium.ttf',
            italics: 'Roboto-Italic.ttf',
            bolditalics: 'Roboto-MediumItalic.ttf'
        }, Pala: {
            normal: 'Pala.ttf',
            bold: 'Pala.ttf',
            italics: 'Pala.ttf',
            bolditalics: 'Pala.ttf'
        }
    };

    const tableBody = [
        [
            { text: 'S.No.', alignment: 'center', bold: true },
            { text: 'HSN Code', alignment: 'center', bold: true },
            { text: 'Item', alignment: 'center', bold: true },
            { text: 'Quantity (Units)', alignment: 'center', bold: true },
            { text: 'Unit Price (Rs.)', alignment: 'center', bold: true },
            { text: 'Tax Rate (%)', alignment: 'center', bold: true }
        ]
    ];

    selectedOptions.forEach((option: any, index: number) => {
        tableBody.push([
            { text: (index + 1).toString(), alignment: 'center', bold: false },
            { text: option.hsn_code ? option.hsn_code : '-', alignment: 'center', bold: false },
            { text: option.name, alignment: 'center', bold: false },
            { text: option.quantity.toString(), alignment: 'center', bold: false },
            { text: option.rate.toString(), alignment: 'center', bold: false },
            { text: option.gst.toString(), alignment: 'center', bold: false }
        ]);
    });

    var dd: any = {
        content: [
            {
                image: 'header',
                width: 515,
                alignment: 'center'
            },
            {
                alignment: 'justify',
                columns: [
                    {
                        width: 350,
                        text: `\nRef : ${details.ref}\n\nTo,\n ${details.company} ${details.address_line_1 !== '' ? `\n` + details.address_line_1 + ',' : ''} ${details.address_line_2 !== '' ? `\n` + details.address_line_2 + ',' : ''} ${details.address_line_3 !== '' ? `\n` + details.address_line_3 + ',' : ''} ${details.address_line_4 !== '' ? `\n` + details.address_line_4 + ',' : ''} \n\n Dear ${details.dear ? details.dear : 'Sir'},`
                    },
                    {
                        text: `\nDate : ${details.date}`,
                        alignment: 'center'
                    }
                ]
            },
            {
                text: `Subject: ${details.subject}`,
                alignment: 'center',
                decoration: 'underline'
            },
            {
                text: `\n${details.introduction}`,
            },
            {
                style: 'productTable',
                table: {
                    widths: [30, 70, 200, '*', '*', '*'],
                    body: tableBody
                }
            },
            {
                text: 'Terms And Conditions:',
                decoration: 'underline',
                fontSize: 9,
            },
            {
                ul: details.terms.split('\n'),
                fontSize: 9
            },
            {
                text: `\n${details.conclusion} \n\nRegards \nFor Saraff Creations \nSd/- \n${details.name} \n(Authorised Signatory) \n${details.details}`
            }
        ],
        styles: {
            header: {
                fontSize: 20,
                bold: true
            },
            subheader: {
                fontSize: 15,
                bold: true
            },
            quote: {
                italics: true
            },
            small: {
                fontSize: 8
            },
            productTable: {
                margin: [0, 5, 0, 15]
            }
        },
        defaultStyle: {
            columnGap: 20,
            font: 'Pala',
            fontSize: 11
        },
        footer: {
            text: '____________________________________________________________________________________________________________________\nRegd. Office: 689/690 Double Storey, Second Floor, New Rajinder Nagar, New Delhi – 110060\nMobile: 0091-99991 58468; E-mail: gsaraff@outlook.com; GSTN - 07APYPC9410P1Z5',
            alignment: 'center',
            fontSize: 10,
            color: 'gray'
        },
        images: {
            header: 'data:image/png;base64,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',
        },
    }

    pdfMake.createPdf(dd, undefined, pdfMake.fonts).open();
}