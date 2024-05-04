import { StyleSheet, Text, View } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        borderBottomColor: '#D3D3D3',
        borderBottomWidth: 2,
        borderBottomRightRadius: 9,
        borderBottomLeftRadius: 9,
        alignItems: 'center',
        height: 30,
        fontStyle: 'bold',
        padding: "20 20 15 15",
    },
    item: {
        width: '30%',
        textAlign: 'left',
        fontSize: 8,
    },
    description: {
        width: '60%',
        textAlign: 'left',
        fontSize: 9,
    },
    rate: {
        width: '15%',
        textAlign: 'right',
    },
    qty: {
        width: '10%',
        textAlign: 'right',
    },
    amount: {
        width: '15%',
        textAlign: 'right',
    },
});

const InvoiceTableRow = ({ items }) => (
    <View style={styles.row}>
        <Text style={styles.item}>{items.item}</Text>
        <Text style={styles.description}>{items.description}</Text>
        <Text style={styles.rate}>{items.rate}</Text>
        <Text style={styles.qty}>{items.quantity}</Text>
        <Text style={styles.amount}>{items.total}</Text>
    </View>
);

export default InvoiceTableRow