import { StyleSheet, Text, View } from '@react-pdf/renderer';

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
    content: {
        flexDirection: 'column',
        marginTop: 10,
        padding: 5,
        fontFamily: 'Helvetica',
        borderLeft: 1,
        borderColor: "#D3D3D3",
    },
    noOfParcels: {
        flexDirection: 'column',
        marginTop: 10,
        padding: 5,
        fontFamily: 'Helvetica',
        borderLeft: 1,
        borderColor: "#D3D3D3",
    },
    originOfGoods: {
        flexDirection: 'column',
        marginTop: 10,
        padding: 5,
        fontFamily: 'Helvetica',
        borderLeft: 1,
        borderColor: "#D3D3D3",
    },
    insuredForAmout: {
        flexDirection: 'column',
        marginTop: 10,
        padding: 5,
        fontFamily: 'Helvetica',
        borderLeft: 1,
        borderColor: "#D3D3D3",
    },
    totalWeightKgTag: {
        flexDirection: 'column',
        marginTop: 10,
        padding: 5,
        fontFamily: 'Helvetica',
        borderRight: 1,
        borderColor: "#D3D3D3",
    },
    totalWeightKg: {
        borderBottom: 1,
        borderColor: "#D3D3D3",
    },
    contentTag: {
        fontFamily: 'Helvetica-Bold',
    },
    noOfParcelsTag: {
        fontFamily: 'Helvetica-Bold',
    },
    originOfGoodsTag: {
        fontFamily: 'Helvetica-Bold',
    },
    insuredForAmoutTag: {
        fontFamily: 'Helvetica-Bold',
    },
    totalWeightKgTag: {
        marginTop: 5,
        fontFamily: 'Helvetica-Bold',
    },
});

const ContentType = ({ content }) => (
    <View style={styles.main}>
        <View style={styles.content}>
            <Text style={styles.contentTag}>Content:</Text>
            <Text>{content.content && content.content.label}</Text>
        </View >
        <View style={styles.noOfParcels}>
            <Text style={styles.noOfParcelsTag}>No. of Parcels:</Text>
            <Text>{content.numberOfParcels}</Text>
        </View >
        <View style={styles.originOfGoods}>
            <Text style={styles.originOfGoodsTag}>Origin of Goods:</Text>
            <Text>{content.originOfGoods && content.originOfGoods.label}</Text>
        </View >
        <View style={styles.insuredForAmout}>
            <Text style={styles.insuredForAmoutTag}>Insured For Amount:</Text>
            <Text>{content.insuredFor}</Text>
            <Text style={styles.totalWeightKgTag}>Total weight kg:</Text>
            <Text>{content.totalWeight}</Text>
        </View >
    </View>
);

export default ContentType