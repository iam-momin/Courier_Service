import { StyleSheet, View } from '@react-pdf/renderer';
import React from 'react';
import InvoiceTableHeader from './InvoiceTableHeader';
import InvoiceTableRow from './InvoiceTableRow';

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

const InvoiceItemsTable = ({ invoice }) => {
  let extrCost = parseFloat(invoice.extraCost && invoice.extraCost.cost ? invoice.extraCost.cost : 0)
  const totalCalculated = parseFloat(parseFloat(invoice.expectedCost) + extrCost)

  const itemDetails = {
    item: "Transport",
    description: `Transport ${invoice.fromCountry.label}-${invoice.toCountry.label}, ${invoice.numberOfParcel}pc, ${invoice.allParcelDetailsSum.weight}kg`,
    rate: totalCalculated,
    quantity: 1,
    total: totalCalculated,
  }
  const insurance = {
    item: "Insurance",
    description: "Aviva insurance premium",
    rate: invoice.insuranceRequired === 'Yes' ? parseFloat(invoice.insurancePremium).toFixed(2) : (0.00).toFixed(2),
    quantity: 1,
    total: invoice.insuranceRequired === 'Yes' ? parseFloat(invoice.insurancePremium).toFixed(2) : (0.00).toFixed(2),
  }
  const topParcel = {
    item: "TOP Parcel",
    description: "Additional service",
    rate: `${parseFloat(invoice.additionalServices[0].cost).toFixed(2)}`,
    quantity: 1,
    total: `${parseFloat(invoice.additionalServices[0].cost).toFixed(2)}`,
  }
  const packing = {
    item: "Packing",
    description: "Additional service",
    rate: `${parseFloat(invoice.additionalServices[1].cost).toFixed(2)}`,
    quantity: 1,
    total: `${parseFloat(invoice.additionalServices[1].cost).toFixed(2)}`,
  }
  const photoOndelivery = {
    item: "Photo on delivery",
    description: "Additional service",
    rate: `${parseFloat(invoice.additionalServices[2].cost).toFixed(2)}`,
    quantity: 1,
    total: `${parseFloat(invoice.additionalServices[2].cost).toFixed(2)}`,
  }

  const signatureOndelivary = {
    item: "Signature on delivery",
    description: "Additional service",
    rate: `${parseFloat(invoice.additionalServices[3].cost).toFixed(2)}`,
    quantity: 1,
    total: `${parseFloat(invoice.additionalServices[3].cost).toFixed(2)}`,
  }
  const cashPaymentsOnCollection = {
    item: "Cash payments on collection/delivery",
    description: "Additional service",
    rate: `${parseFloat(invoice.additionalServices[4].cost).toFixed(2)}`,
    quantity: 1,
    total: `${parseFloat(invoice.additionalServices[4].cost).toFixed(2)}`,
  }
  const invoiceForACompany = {
    item: "Invoice for a company",
    description: "Additional service",
    rate: `${parseFloat(invoice.additionalServices[5].cost).toFixed(2)}`,
    quantity: 1,
    total: `${parseFloat(invoice.additionalServices[5].cost).toFixed(2)}`,
  }
  // const extraCost = {
  //   item: "Additional cost",
  //   description: invoice.extraCost && invoice.extraCost.message,
  //   rate: `${invoice.extraCost && parseFloat(invoice.extraCost.cost).toFixed(2)}`,
  //   quantity: 1,
  //   total: `${invoice.extraCost && parseFloat(invoice.extraCost.cost).toFixed(2)}`,
  // }

  return (
    <View style={styles.tableContainer}>
      <InvoiceTableHeader />
      <InvoiceTableRow items={itemDetails} />
      {invoice.insuranceDetails && invoice.insuranceRequired === 'Yes' && <InvoiceTableRow items={insurance} />}
      {invoice.additionalServices[0].isChecked && <InvoiceTableRow items={topParcel} />}
      {invoice.additionalServices[1].isChecked && <InvoiceTableRow items={packing} />}
      {invoice.additionalServices[2].isChecked && <InvoiceTableRow items={photoOndelivery} />}
      {invoice.additionalServices[3].isChecked && <InvoiceTableRow items={signatureOndelivary} />}
      {invoice.additionalServices[4].isChecked && <InvoiceTableRow items={cashPaymentsOnCollection} />}
      {invoice.additionalServices[5].isChecked && <InvoiceTableRow items={invoiceForACompany} />}
      {/* {invoice.extraCost && invoice.extraCost.message && invoice.extraCost.cost != 0 && <InvoiceTableRow items={extraCost} />} */}
    </View>)
};

export default InvoiceItemsTable
