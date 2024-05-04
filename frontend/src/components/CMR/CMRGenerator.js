import { Document, Page, StyleSheet } from '@react-pdf/renderer';
import React from 'react';
import InvoiceItemsTable from './InvoiceItemsTable';

const styles = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        fontSize: 9,
        paddingTop: 10,
        paddingLeft: 30,
        paddingRight: 30,
        lineHeight: 1.2,
        flexDirection: 'column',
    },
});

const InvoiceGenerator = ({ invoice }) => {

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <InvoiceItemsTable invoice={invoice} />
            </Page>
        </Document>
    )
};

export default InvoiceGenerator
