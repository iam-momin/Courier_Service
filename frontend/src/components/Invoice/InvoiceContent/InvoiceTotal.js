import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  main: {
    fontSize: 9,
    width: '50%',
    flexDirection: 'column',
    color: 'black',
    marginTop: 20,
    border: "1px solid #D3D3D3",
    borderRadius: '10px',
    marginLeft: 'auto',
    marginRight: 0
  },
  data: {
    marginTop: 5,
    borderBottomColor: '#D3D3D3',
    borderBottomWidth: 1,
    paddingLeft: 5,
    paddingRight: 5,
    flexDirection: 'row',
    borderBottomRightRadius: '9px',
    borderBottomLeftRadius: '9px',
    justifyContent: 'space-between'

  },
  balance_due: {
    paddingTop: 5,
    paddingLeft: 5,
    paddingRight: 5,
    lineHeight: 2,
    borderBottomRightRadius: '9px',
    borderBottomLeftRadius: '9px',
    backgroundColor: '#D3D3D3',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  label: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    justifyContent: 'flex-start'
  },
});


const InvoiceTotal = ({ invoice }) => (
  <View style={styles.main}>
    <View style={styles.data}>
      <Text style={styles.label}>Total:</Text>
      <Text >{invoice.total}</Text>
    </View >
    <View style={styles.data}>
      <Text style={styles.label}>Amount Paid: </Text>
      <Text >{invoice.amountPaid}</Text>
    </View >
    <View style={styles.balance_due}>
      <Text style={styles.label}>Balance Due ({invoice.invoiceCurrency}):</Text>
      <Text >{invoice.balanceDue}</Text>
    </View >
  </View>
);

export default InvoiceTotal