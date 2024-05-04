import { StyleSheet, Text, View } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    main: {
        fontSize: 9,
        flexDirection: 'column',
        color: 'black',
        marginTop: 30,
        paddingLeft: 10,
        paddingRight: 10,
        border: "1px solid #D3D3D3",
        borderRadius: '10px',
    },
    issue_date: {
        marginTop: 5,
        borderBottomColor: '#D3D3D3',
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'

    },
    due_date: {
        marginTop: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomColor: '#D3D3D3',
        borderBottomWidth: 1,
    },
    over_due: {
        marginTop: 5,
        marginBottom: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    label: {
        fontSize: 9,
        fontFamily: 'Helvetica-Bold',
        justifyContent: 'flex-start'
    },
});

const InvoiceDate = ({ invoice }) => (
    <View style={styles.main}>
        <View style={styles.issue_date}>
            <Text style={styles.label}>Issue Date: </Text>
            <Text>{invoice.invoiceDate}</Text>
        </View >
        <View style={styles.due_date}>
            <Text style={styles.label}>Due Date: </Text>
            <Text>{invoice.dueDate}</Text>
        </View >
        <View style={styles.over_due}>
            <Text style={styles.label}>Overdue Interest 0.05% per day</Text>
        </View >
    </View>
);

export default InvoiceDate