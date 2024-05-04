import { StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';

const styles = StyleSheet.create({
  head: {
    marginTop: 5,
    display: 'flex',
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 11,
    border: 2,
    borderColor: "#000",
  },
  title: {
    flexDirection: 'column',
    paddingBottom: 1,
    fontFamily: 'Helvetica-Bold',
  },
  from: {
    flexDirection: "column",
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  address: {
    fontSize: 10,
  }
});

const SenderInfo = ({ senderData }) => (
  <View style={styles.head}>
    <View style={styles.from}>
      <Text style={styles.title}>From</Text>
      <Text>{senderData.senderName}</Text>
      <Text>{senderData.senderAddress}</Text>
      <Text>{senderData.senderPostal}</Text>
      <Text>{senderData.senderCountry}</Text>
      <Text>{senderData.senderPhone}</Text>
    </View>
    {/* <View style={styles.address}>
      <Text>Estolink Ltd</Text>
      <Text>info@estolink.com</Text>
      <Text>www.estolink.com</Text>
      <Text>EST +372 51903111</Text>
      <Text>GB +44 7900033300</Text>
    </View> */}
  </View>

);

export default SenderInfo
