import { Image, StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';

const styles = StyleSheet.create({
  main: {
    marginTop: 15,
    padding: 5,
    display: 'flex',
    flexDirection: 'row',
    fontSize: 11,
    justifyContent: 'space-between',
    fontFamily: 'Helvetica-Bold',
  },
  signatureBox: {
    padding: 5,
    width: '60%',
    border: 1,
    borderColor: "#D3D3D3",
  },
  date: {
    padding: 5,
    width: '20%',
    marginLeft: 10
  },
  totalValueOfGoods: {
    padding: 5,
    width: '20%',
  },
  dateTag: {
    fontFamily: 'Helvetica',
    fontSize: 12,
  },
  totalValueOfGoodsTag: {
    fontFamily: 'Helvetica',
    fontSize: 12,
  },
  signatureImg: {
    width: 150,
    height: 60,
    marginLeft: 50
  },
  label: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    justifyContent: 'flex-start'
  },
  declarationText: {
    marginTop: 10,
    fontFamily: 'Helvetica',
    fontSize: 12,
    padding: 10
  },
});


const InvoiceTotal = ({ data }) => (
  <View>
    <View style={styles.main}>
      <View style={styles.signatureBox}>
        <Text style={styles.label}>Signature</Text>
        <Image style={styles.signatureImg} src={data.signatureDataArray} />
      </View >

      <View style={styles.date}>
        <Text style={styles.label}>Date:</Text>
        <Text style={styles.dateTag}>{data.date}</Text>
      </View >
      <View style={styles.totalValueOfGoods}>
        <Text style={styles.label}>Total value of Goods:</Text>
        <Text style={styles.totalValueOfGoodsTag}>{data.amount}</Text>
      </View >
    </View>

    <View style={styles.declarationText}>
      <Text>"I, the undersigned ({data.senderName}), whose address is given on the item, certify that the particulars given in this declaration are correct and that this item does not contain any dangerous article or articles prohibited by legislation or by postal or customs regulations."</Text>
    </View>

  </View>

);

export default InvoiceTotal