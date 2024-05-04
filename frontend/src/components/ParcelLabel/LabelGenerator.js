import { Document, Page, StyleSheet } from '@react-pdf/renderer';
import React from 'react';
import Footer from './Footer';
import Header from './Header';
import ReceiverInfo from './ReceiverInfo';
import SenderInfo from './SenderInfo';

const styles = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        fontSize: 9,
        paddingTop: 5,
        paddingLeft: 5,
        paddingRight: 5,
        lineHeight: 1.2,
        flexDirection: 'column',
    },
    logo: {
        width: 130,
        height: 45,
    },
});

const LabelGenerator = ({ labelData }) => {
    const invoice = {
        invoiceNo: labelData.orderId,
    }
    const receiverData = {
        receiverName: labelData.receiverName,
        receiverAddress: labelData.deliveryAddress1 && labelData.deliveryAddress2 ? `${labelData.deliveryAddress1}, ${labelData.deliveryAddress2}` : "Parcel point",
        receiverPostal: labelData.deliveryZipCode ? labelData.deliveryZipCode : "",
        receiverCountry: labelData.toCountry.label,
        receiverPhone: labelData.receiverPhone
    }
    const senderData = {
        senderName: labelData.senderName,
        senderAddress: labelData.collectionAddress1 && labelData.collectionAddress2 ? `${labelData.collectionAddress1}, ${labelData.collectionAddress2}` : "Parcel point",
        senderPostal: labelData.collectionZipCode ? labelData.collectionZipCode : "",
        senderCountry: labelData.fromCountry.label,
        senderPhone: labelData.senderPhone
    }

    return (
        <Document>
            <Page size="A6" style={styles.page}>
                <Header invoice={invoice} />
                <ReceiverInfo receiverData={receiverData} />
                <SenderInfo senderData={senderData} />
                <Footer />
            </Page>
        </Document>
    )
};

export default LabelGenerator
