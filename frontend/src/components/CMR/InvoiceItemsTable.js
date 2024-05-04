import { StyleSheet, View } from '@react-pdf/renderer';
import React from 'react';
import TabularView from './TabularView';

const styles = StyleSheet.create({
  tableContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
    //borderTop: 1
  },
});

const InvoiceItemsTable = ({ invoice }) => {
  return (
    <View style={styles.tableContainer}>
      <TabularView items={invoice} />
    </View>)
};

export default InvoiceItemsTable
