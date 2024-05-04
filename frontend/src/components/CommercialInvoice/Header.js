import { Image, StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';
import logo from '../../images/estolink_logo.jpg';

const styles = StyleSheet.create({
    titleContainer: {
        marginTop: 40,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        padding: 10
    },
    title: {
        color: '#D3D3D3',
        letterSpacing: 0,
        fontSize: 22,
        textTransform: 'uppercase',
        fontFamily: 'Helvetica-Bold',
        marginTop: 12,
        marginLeft: 25
    },
    number: {
        color: '#000',
        fontSize: 25,
    },
    logo: {
        width: 130,
        height: 45,
    },
});

const InvoiceTitle = ({ id }) => (
    <View style={styles.titleContainer}>
        <Image style={styles.logo} src={logo} />
        <Text style={styles.title}>Commercial Invoice: {id.orderId}</Text>
    </View>
);

export default InvoiceTitle