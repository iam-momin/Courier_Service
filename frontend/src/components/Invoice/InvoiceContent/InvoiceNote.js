import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  note: {
    fontSize: 9,
    width: '90%',
    position: 'absolute',
    bottom: 0,
    margin: 10,
    alignSelf: 'center'
  },
});


const InvoiceNote = () => (
  <View style={styles.note}>
    <Text>The Revolut bank account is free of charges and European banks do not charge any fee for Euro transactions.</Text>
  </View>
);

export default InvoiceNote