import { StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';

const styles = StyleSheet.create({
  main: {
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  from: {
    marginTop: 2,
    paddingBottom: 1,
    fontFamily: 'Helvetica-Bold',
  },
  to: {
    marginTop: 2,
    paddingBottom: 1,
    fontFamily: 'Helvetica-Bold',
  },
  bankDetails: {
    marginTop: 2,
    paddingBottom: 1,
    fontFamily: 'Helvetica-Bold',
  },
  from_view: {
    marginLeft: '15%'
  }
});

const BillFromAndTo = ({ invoice }) => (
  <View style={styles.main}>
    <View >
      <Text style={styles.to}>To:</Text>
      {!invoice.additionalServices[5].isChecked ? <span>
        <Text>{invoice.fullSenderName}</Text>
        <Text>{invoice.collectionAddress1} {invoice.collectionAddress2}</Text>
        <Text>{invoice.fromCountry.label}</Text>
        <Text>{invoice.email}</Text>
        <Text>{invoice.senderPhone}</Text>
      </span> :
        <span>
          <Text>
            {invoice.companyDetails}
          </Text>
        </span>}
    </View>

    <View style={styles.from_view}>
      <Text style={styles.from}>From:</Text>
      <Text>ESTOLINK LIMITED</Text>
      <Text>40 Killowen Ave,</Text>
      <Text>Northolt UB5 4QT, UK</Text>
      <Text>Reg nr: 08848944</Text>
      <Text>info@estolink.com</Text>
      <Text>+44 7900033300</Text>
      <Text>+372 51903111</Text>
    </View>
    <View>
      <Text style={styles.bankDetails}>Bank Details:</Text>
      <Text>GBP transactions:</Text>
      <Text>Bank: Revolut Ltd</Text>
      <Text>Account number: 68269005</Text>
      <Text>Sort code: 040075</Text>

      <Text> </Text>

      <Text>EURO transactions:</Text>
      <Text>Bank: Revolut Ltd</Text>
      <Text>IBAN: GB94REVO00996947723629</Text>
      <Text>BIC: REVOGB21</Text>
    </View>
  </View>

);

export default BillFromAndTo