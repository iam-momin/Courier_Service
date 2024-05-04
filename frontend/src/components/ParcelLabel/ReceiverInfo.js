import { StyleSheet, Text, View } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    main: {
        marginTop: 10,
        padding: 5,
        display: 'flex',
        flexDirection: 'column',
        fontSize: 24,
        fontFamily: 'Helvetica-Bold',
        border: 2,
        borderColor: "#000",
    },
    to: {
        flexDirection: "column",
        fontSize: 22,
        fontFamily: 'Helvetica-Oblique',
    },
});

const ContentType = ({ receiverData }) => (
    <View style={styles.main}>
        <Text>To</Text>
        <View style={styles.to}>
            <Text>{receiverData.receiverName}</Text>
            <Text>{receiverData.receiverAddress}</Text>
            <Text>{receiverData.receiverPostal}</Text>
            <Text>{receiverData.receiverCountry}</Text>
            <Text>{receiverData.receiverPhone}</Text>
        </View>
    </View>
);

export default ContentType