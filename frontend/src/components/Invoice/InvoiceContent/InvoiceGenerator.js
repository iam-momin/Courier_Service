import { Document, Page, StyleSheet } from '@react-pdf/renderer';
import React from 'react';
import BillFromAndTo from './BillFromAndTo';
import InvoiceDate from './InvoiceDate';
import InvoiceItemsTable from './InvoiceItemsTable';
import InvoiceNote from './InvoiceNote';
import InvoiceTitle from './InvoiceTitle';
import InvoiceTotal from './InvoiceTotal';

const styles = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        fontSize: 9,
        paddingTop: 10,
        paddingLeft: 50,
        paddingRight: 50,
        lineHeight: 1.2,
        flexDirection: 'column',
    },
});

const InvoiceGenerator = ({ invoice }) => {
    const invoiceNumber = {
        invoiceNumber: invoice.orderId,
        invoiceStatus: invoice.invoiceStatus.label
    }
    const invoiceTotal = {
        total: invoice.totalInvoiceAmount,
        amountPaid: invoice.partlyAmount,
        balanceDue: (invoice.totalInvoiceAmount - invoice.partlyAmount).toFixed(2),
        invoiceCurrency: `${invoice.invoiceCurrency.currency}`,
    }

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <InvoiceTitle invoiceNumber={invoiceNumber} />
                <BillFromAndTo invoice={invoice} />
                <InvoiceDate invoice={invoice} />
                <InvoiceItemsTable invoice={invoice} />
                <InvoiceTotal invoice={invoiceTotal} />
                <InvoiceNote />
            </Page>
        </Document>
    )
};

export default InvoiceGenerator
