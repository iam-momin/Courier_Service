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
    description: {
        width: '60%',
        textAlign: 'left',
    },
    quantity: {
        width: '13%',
        textAlign: 'right',
    },
    rate: {
        width: '13%',
        textAlign: 'right',
        marginLeft: 5
    },
    total: {
        width: '14%',
        textAlign: 'right',
    },
});

const ItemsTableRow = ({ items }) => (
    <View style={styles.row}>
        <Text style={styles.description}>{items.itemDescription}</Text>
        <Text style={styles.quantity}>{items.quantity}</Text>
        <Text style={styles.rate}>{items.value}</Text>
        <Text style={styles.total}>{items.totalAmount}</Text>
    </View>
);

export default ItemsTableRow