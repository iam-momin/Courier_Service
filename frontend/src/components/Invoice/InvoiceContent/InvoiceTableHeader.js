import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderBottomColor: '#696969',
        backgroundColor: '#696969',
        borderBottomWidth: 1,
        borderTopRightRadius: 9,
        borderTopLeftRadius: 9,
        alignItems: 'center',
        height: 25,
        textAlign: 'center',
        fontStyle: 'bold',
        flexGrow: 1,
        color: '#FFF',
        fontFamily: 'Helvetica-Bold',
    },
    item: {
        width: '20%',
        textAlign: 'left',
    },
    description: {
        width: '60%',
        textAlign: 'center',
    },
    rate: {
        width: '15%',
        textAlign: 'center',
    },
    qty: {
        width: '10%',
        textAlign: 'center',
    },
    amount: {
        width: '15%',
        textAlign: 'center',
    },

});

const InvoiceTableHeader = () => (
    <View style={styles.container}>
        <Text style={styles.amount}>Item</Text>
        <Text style={styles.description}>Description</Text>
        <Text style={styles.rate}>Unit Cost</Text>
        <Text style={styles.qty}>Qty</Text>
        <Text style={styles.amount}>Total</Text>
    </View>
);

export default InvoiceTableHeader