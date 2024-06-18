import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { palaBase64 } from '../fonts/pala';

pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.vfs['Pala.ttf'] = palaBase64

export const viewinTab = (details, selectedOptions) => {
    pdfMake.fonts = {
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
            { text: 'Item', alignment: 'center', bold: true },
            { text: 'Sale Price', alignment: 'center', bold: true },
            { text: 'Tax Included', alignment: 'center', bold: true }
        ]
    ];

    selectedOptions.forEach((option, index) => {
        tableBody.push([
            { text: (index + 1).toString(), alignment: 'center', bold: false },
            { text: option?.productRef?.name, alignment: 'center', bold: false },
            { text: option?.sale_price.toString(), alignment: 'center', bold: false },
            { text: option?.sale_price_inclusive_tax.toString(), alignment: 'center', bold: false },
        ]);
    });

    var dd= {
        content: [
            {
                alignment: 'center',
                columns: [
                    {
                        alignent: 'center',
                        text: `\n ${details?.company?.name} \n${details?.company?.address_line_1}\n ${new Date(details?.createdAt).toLocaleString()}\n\n`
                    }
                ]
            },
            {
                style: 'productTable',
                table: {
                    widths: [30, '*', '*', '*',],
                    body: tableBody
                }
            },
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
    }

    pdfMake.createPdf(dd, undefined, pdfMake.fonts).open();
}