import { Image, StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';
import logo from '../../images/estolink_logo.jpg';

const styles = StyleSheet.create({
    head: {
        display: 'flex',
        padding: 5,
        flexDirection: 'row',
        fontSize: 10,
        justifyContent: 'space-between',
    },
    title: {
        flexDirection: 'column',
        marginTop: 9,
        fontFamily: 'Helvetica-Bold',
        fontSize: 18
    },
    to: {
        flexDirection: "column",
        fontSize: 9,
        fontFamily: 'Helvetica-Oblique',
    },
    logo: {
        width: 120,
        height: 40,
    },
});

const InvoiceTitle = ({ invoice }) => (
    <View style={styles.head}>
        <View style={styles.to}>
            <Text style={styles.title}>{invoice.invoiceNo}</Text>
        </View>
        <Image style={styles.logo} src={logo} />
    </View>
);

export default InvoiceTitle