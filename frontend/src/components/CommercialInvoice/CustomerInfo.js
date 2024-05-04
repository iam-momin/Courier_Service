import { StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';

const styles = StyleSheet.create({
  main: {
    marginTop: 15,
    padding: 5,
    display: 'flex',
    flexDirection: 'row',
    fontSize: 11,
    justifyContent: 'space-between'
  },
  sender: {
    flexDirection: 'column',
    marginTop: 10,
    paddingBottom: 1,
    fontFamily: 'Helvetica',
    borderRight:1,
    borderColor:"#D3D3D3",    
    width:"50%"
  },
  receiver: {
    flexDirection: 'column',
    marginTop: 10,
    paddingBottom: 1,
    fontFamily: 'Helvetica',
    width:"50%",
    alignContent:'flex-end'
  },
  nameTag: {
    padding: 5,
    fontFamily: 'Helvetica-Bold',
  },
  name: {
    fontFamily: 'Helvetica',
  },
  addressTag: {
    padding: 5,
    fontFamily: 'Helvetica-Bold',
  },
  address: {
    padding: 5,
    fontFamily: 'Helvetica',
  },
});

const CustomerInfo = ({ customerInfo }) => (
  <View style={styles.main}>
    <View style={styles.sender}>
      <Text style={styles.nameTag}>Sender's Name: <Text style={styles.name}>{customerInfo.senderName}</Text></Text>
      <Text style={styles.addressTag}>Sender's Address:</Text>
      <Text style={styles.address}>{customerInfo.senderAddress}</Text>
    </View>
    <View style={styles.receiver}>
      <Text style={styles.nameTag}>Receiver's Name: <Text style={styles.name}>{customerInfo.receiverName}</Text></Text>
      <Text style={styles.addressTag}>Receiver's Address:</Text>
      <Text style={styles.address}>{customerInfo.receiverAddress}</Text>
    </View>   
  </View>

);

export default CustomerInfo