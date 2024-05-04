import { StyleSheet, View } from '@react-pdf/renderer';
import React from 'react';
import ContentTableHeader from './ContentTableHeader';
import ItemsTableRow from './ItemsTableRow';

const styles = StyleSheet.create({
  tableContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 40,
    borderWidth: 1,
    borderColor: '#D3D3D3',
    borderRadius: '10px',
  },
});

const ContentItemsTable = ({ items }) => {
  return (
    <View style={styles.tableContainer}>
      <ContentTableHeader />
      {items.contents.map((item) => {
        return <ItemsTableRow items={item} />
      })}
    </View>)
};

export default ContentItemsTable