import { StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';

const styles = StyleSheet.create({
  main: {
    marginTop: 'auto',
    display: 'flex',
    flexDirection: 'column',
    fontSize: 8,
    alignContent: "center",
    fontFamily: 'Helvetica',
    marginBottom: 5
  },
  address: {
    border: 2,
    borderColor: "#000",
    marginBottom: 5,
    padding: 5,
    fontSize: 9
  },
  dec: {
    border: 2,
    borderColor: "#000",
    padding: '5 5 0 5',
    textAlign: 'center',
    alignItems: 'center',
    alignContent: 'center'
  }
});


const InvoiceTotal = ({ }) => (
  <View style={styles.main}>
    <View style={styles.address}>
      <Text>Estolink, 40 Killowen Ave, Northolt UB5 4QT, UK</Text>
      <Text>info@estolink.com, +447900033300</Text>
    </View>
    <Text style={styles.dec}>THIS IS AN AUTO GENERATED LABEL AND DOES NOT NEED SIGNATURE.</Text>
  </View>

);

export default InvoiceTotal