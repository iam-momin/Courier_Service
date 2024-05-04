import { Document, Page, StyleSheet } from '@react-pdf/renderer';
import React from 'react';
import ContentItemsTable from './ContentItemsTable';
import ContentType from './ContentType';
import CustomerInfo from './CustomerInfo';
import Header from './Header';
import SignatureDateTotal from './SignatureDateTotal';

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
    logo: {
        width: 140,
        height: 50,
    },
});

const CommercialInvoiceGenerator = ({ invoiceData }) => {
    let d = new Date(invoiceData.updatedAt)
    let date = `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`
    const data = {
        signatureDataArray: invoiceData.signatureDataArray ? invoiceData.signatureDataArray : "",
        date: date,
        amount: invoiceData.totalValueOfGoods,
        senderName: invoiceData.senderName,
    }
    const id = {
        orderId: invoiceData.orderId,
    }
    const customerInfo = {
        senderName: invoiceData.senderName,
        senderAddress: invoiceData.senderAddress,
        receiverName: invoiceData.receiverName,
        receiverAddress: invoiceData.receiverAddress
    }
    const content = {
        content: invoiceData.content,
        numberOfParcels: invoiceData.numberOfParcels,
        originOfGoods: invoiceData.originOfGoods,
        insuredFor: invoiceData.insuredFor,
        totalWeight: invoiceData.totalWeight
    }
    const items = {
        contents: invoiceData.contents
    }

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Header id={id} />
                <CustomerInfo customerInfo={customerInfo} style={styles.billfromandto} />
                <ContentType content={content} />
                <ContentItemsTable items={items} />
                <SignatureDateTotal data={data} />
            </Page>
        </Document>
    )
};

export default CommercialInvoiceGenerator
