import React from 'react';
import { Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import logo from '../../../images/estolink_logo.jpg'
import { INVOICE_STATUS } from '../../../constants';

const styles = StyleSheet.create({
    titleContainer: {
        marginTop: 40,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    titleContainer1: {
        marginTop: 40,
        flexDirection: 'column',
        justifyContent: 'flex-end'
    },
    reportTitle: {
        color: '#D3D3D3',
        letterSpacing: 0,
        fontSize: 22,
        textTransform: 'uppercase',
        fontFamily: 'Helvetica-Bold',
        marginTop: 12
    },
    number: {
        color: '#000',
        fontSize: 25,
    },
    logo: {
        width: 130,
        height: 45,
    },
    invoiceStatus: {
        color: '#d3d3d3',
        fontSize: 25,
        fontFamily: 'Helvetica-Bold',
        transform: 'rotate(-45deg)',
        transformOrigin: '-70 20',

    },
});

const InvoiceTitle = ({ invoiceNumber }) => (
    <View style={styles.titleContainer1}>
        <View style={styles.titleContainer}>
            <Image style={styles.logo} src={logo} />
            <Text style={styles.reportTitle}>INVOICE: <Text style={styles.number}>{invoiceNumber.invoiceNumber}</Text></Text>
        </View>

        {/* UNCOMMENT FOR INVOICE STATUS DIAGONALLY TAG IN INVOICE PDF */}
        {/* <Text style={styles.invoiceStatus}>{invoiceNumber.invoiceStatus}</Text> */}
    </View>
);

export default InvoiceTitle