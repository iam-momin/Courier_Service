import { StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';

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
    description: {
        width: '60%',
        textAlign: 'left',
        marginLeft:10,
    },
    quantity: {
        width: '13%',
        textAlign: 'right',
    },
    rate: {
        width: '13%',
        textAlign: 'right',
    }, 
    amount: {
        width: '14%',
        textAlign: 'right',
        marginRight:10
    },
    
});

const ContentTableHeader = () => (
    <View style={styles.container}>
        <Text style={styles.description}>Description</Text>
        <Text style={styles.quantity}>Quantity</Text>
        <Text style={styles.rate}>Value</Text>
        <Text style={styles.amount}>Item Total</Text>        
    </View>
);

export default ContentTableHeader