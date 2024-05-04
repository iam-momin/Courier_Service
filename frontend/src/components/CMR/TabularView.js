import { StyleSheet, Text, View } from '@react-pdf/renderer';
import { getDD_MM_YYYY } from '../../constants';

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'stretch',
        height: 60,
        flexGrow: 1,
        // borderBottom: 1,
        borderRight: 1,
        borderLeft: 1,
        borderTop: 1
    },
    left: {
        width: '50%',
        textAlign: 'left',
        padding: 3,
        borderRight: 1,
        fontSize: 8
    },
    leftData: {
        fontSize: 10,
        padding: 3
    },
    right: {
        width: '50%',
        textAlign: 'left',
        padding: 3,
        fontSize: 8
    },
    rightData: {
        fontSize: 7,
        padding: 3
    },
    rightDataAddress: {
        fontSize: 10
    },
    sn: {
        padding: 3,
    },
    cmr: {
        alignSelf: 'flex-end',
        fontSize: 10,
        fontWeight: 'extrabold',
        border: 1,
        borderRadius: 25,
        padding: 2
    },
    rightBlank: {
        width: '50%',
        textAlign: 'left',
        padding: 3,
        fontSize: 8,
        color: '#fff',
        borderTopColor: '#fff'
    },
    blank: {
        color: '#fff',
        padding: 3
    },
    row5: {
        flexDirection: 'row',
        alignItems: 'stretch',
        height: 60,
        flexGrow: 1,
        // borderBottom: 1,
        borderRight: 1,
        borderLeft: 1,
        //borderTop: 1

    },
    left5: {
        width: '50%',
        textAlign: 'left',
        padding: 3,
        borderRight: 1,
        fontSize: 8,
        borderTop: 1
    },
    sn5: {
        padding: 3,
        borderTop: 1
    },
    row6: {
        flexDirection: 'row',
        alignItems: 'stretch',
        height: 130,
        flexGrow: 1,
        // borderBottom: 1,
        borderRight: 1,
        borderLeft: 1,
        borderTop: 1
    },
    colmns: {
        flexDirection: 'row',
        width: '20%',
        textAlign: 'left',
        padding: 3,
        fontSize: 6.5,
        flexGrow: 1
    },
    colmns_: {
        flexDirection: 'row',
        width: '15%',
        textAlign: 'left',
        padding: 3,
        fontSize: 6.5,
        //flexGrow: 1
    },
    colmns5: {
        flexDirection: 'row',
        width: '15%',
        //textAlign: 'left',
        padding: 3,
        fontSize: 6.5,
        borderLeft: 1,
        //alignSelf: 'stretch'
        flexGrow: 1,
    },
    colmns6: {
        flexDirection: 'row',
        width: '15%',
        //textAlign: 'left',
        padding: 3,
        fontSize: 6.5,
        borderLeft: 1,
        //alignSelf: 'stretch'
        flexGrow: 1,
    },
    colmns7: {
        flexDirection: 'row',
        width: '15%',
        //textAlign: 'left',
        padding: 3,
        fontSize: 6.5,
        borderLeft: 1,
        //alignSelf: 'stretch'
        flexGrow: 1,
    },
    snColumns: {
        paddingRight: 3
    },
    insideRow6_1: {
        flexDirection: 'row',
        alignItems: 'stretch',
        width: '100%',
        flexGrow: 1,
    },
    insideRow6_2: {
        //borderLeft: 1
    },
    insideRow6_1_1: {
        flexDirection: 'row',
        alignSelf: 'stretch',
        //borderTop: 1,
        height: 130,
        //width: '110%'
    },
    insideRow6_1_2: {
        flexDirection: 'row',
        alignSelf: 'stretch',
        borderTop: 1,
        height: 35,
        //width: '110%'
    },
    colmns_b: {
        flexDirection: 'row',
        //width: '15%',
        flexGrow: 1,
        textAlign: 'left',
        padding: 3,
        fontSize: 6.5
    },
    row8: {
        flexDirection: 'row',
        width: '100%',
        flexGrow: 1,
        height: 120,
        borderRight: 1,
        //borderLeft: 1
        fontSize: 6
    },
    row8_col1: {
        width: '55%',
        borderTop: 1,
        borderLeft: 1,
    },
    row8_col2: {
        width: '45%',
        borderTop: 1,
        //borderLeft: 1,
        flexDirection: 'row',
        flexGrow: 1
    },
    row8_col2_: {
        width: '25%',
        borderLeft: 1,
        padding: 3
    }

});

const InvoiceTableRow = ({ items }) => (
    <View>
        <View style={styles.row}>
            <Text style={styles.sn}>1</Text>
            <View style={styles.left}>
                <Text >Sender (Name, Address, Country)</Text>
                <Text style={styles.leftData}>{items.senderName},  {items.email ? (items.email + " -") : ""} {items.collectionAddress1 ? (items.collectionAddress1 + ",") : ""} {items.collectionAddress2 ? (items.collectionAddress2 + ",") : ""} {items.collectionCity ? (items.collectionCity + " -") : ""} {items.collectionZipCode ? (items.collectionZipCode + " -") : ""} {items.fromCountry.label}</Text>
            </View>
            <Text style={styles.sn}>{'>>'}</Text>
            <View style={styles.right}>
                <Text>INTERNATIONAL CONSIGNMENT NOTE  <Text style={{ fontSize: 14, fontWeight: 800, }}>  {items.orderId}</Text> </Text>
                <Text style={styles.cmr}>CMR</Text>
                <Text style={styles.rightData}>This carriage is subject, notwithstanding any
                    clause to the contrary, to the Convention on the
                    Contract for the international Carriage of goods by
                    road (CMR).
                </Text>
            </View>
        </View>


        <View>
            <View style={styles.row}>
                <Text style={styles.sn}>2</Text>
                <View style={styles.left}>
                    <Text >Consignee (Name, Address, Country)</Text>
                    <Text style={styles.leftData}>{items.receiverName} - {items.deliveryAddress1 ? (items.deliveryAddress1 + ",") : ""} {items.deliveryAddress2 ? (items.deliveryAddress2 + ",") : ""} {items.deliveryCity ? (items.deliveryCity + " -") : ""} {items.deliveryZipCode ? (items.deliveryZipCode + " -") : ""} {items.toCountry.label}</Text>
                </View>
                <Text style={styles.sn}>16</Text>
                <View style={styles.right}>
                    <Text >Carrier (Name, Address, Country)</Text>
                    <Text style={styles.rightDataAddress}>EstoLink Eesti OÜ, Riia 104, Tartu, 50411 Estonia,
                        +37251903111, info@estolink.com</Text>
                </View>
            </View>
        </View>


        <View>
            <View style={styles.row}>
                <Text style={styles.sn}>3</Text>
                <View style={styles.left}>
                    <Text >Place of delivery of the goods (place, country)</Text>
                    <Text style={styles.leftData}>{items.delivaryAddress1 ? (items.delivaryAddress1 + ",") : ""} {items.delivaryAddress2 ? (items.delivaryAddress2 + ",") : ""} {items.deliveryCity ? (items.deliveryCity + " -") : ""} {items.deliveryZipCode ? (items.deliveryZipCode + " -") : ""} {items.toCountry.label}</Text>
                </View>
                <Text style={styles.sn}>17</Text>
                <View style={styles.right}>
                    <Text >Successive carriers (Name, Address, Country)</Text>
                    {/* <Text style={styles.rightData}>fill required info</Text> */}
                </View>
            </View>
        </View>


        <View>
            <View style={styles.row}>
                <Text style={styles.sn}>4</Text>
                <View style={styles.left}>
                    <Text >Place and date of taking over the goods (Place , Country, Date)</Text>
                    <Text style={styles.leftData}>{items.collectionAddress1 ? (items.collectionAddress1 + ",") : ""} {items.collectionAddress2 ? (items.collectionAddress2 + ",") : ""} {items.collectionCity ? (items.collectionCity + " -") : ""} {items.collectionZipCode ? (items.collectionZipCode + " -") : ""} {items.fromCountry.label} - {getDD_MM_YYYY(new Date(items.preferredDate))}</Text>
                </View>
                <Text style={styles.sn}>18</Text>
                <View style={styles.right}>
                    <Text >Carrier's reservations and observations</Text>
                    {/* <Text style={styles.rightData}>Sender (NameData, AddressData, CountryData)</Text> */}
                </View>
            </View>
        </View>


        <View>
            <View style={styles.row5}>
                <Text style={styles.sn5}>5</Text>
                <View style={styles.left5}>
                    <Text >Documents attached</Text>
                    {/* <Text style={styles.leftData}>Sender (NameData, AddressData, CountryData)</Text> */}
                </View>
                <Text style={styles.blank}>__</Text>
                <View style={styles.rightBlank}>
                    <Text ></Text>
                    <Text ></Text>
                </View>
            </View>
        </View>



        <View style={styles.row6}>
            <View style={styles.insideRow6_1}>
                <View>
                    <View style={styles.insideRow6_1_1}>
                        <View style={styles.colmns_}>
                            <Text style={styles.snColumns}>6</Text>
                            <View >
                                <Text >Marks and Nos</Text>
                            </View>
                        </View>

                        <View style={styles.colmns_}>
                            <Text style={styles.snColumns}>7</Text>
                            <View >
                                <Text >Number of packages</Text>
                                <Text style={styles.leftData}>{items.numberOfParcel}</Text>
                            </View>
                        </View>

                        <View style={styles.colmns_}>
                            <Text style={styles.snColumns}>8</Text>
                            <View >
                                <Text >Method of packing</Text>
                            </View>
                        </View>

                        <View style={styles.colmns}>
                            <Text style={styles.snColumns}>9</Text>
                            <View >
                                <Text >Nature of the goods*</Text>
                            </View>
                        </View>
                    </View>


                    <View style={styles.insideRow6_1_2}>


                        <View style={styles.colmns_b}>
                            <Text style={styles.snColumns}></Text>
                            <View >
                                <Text >UN-Nr</Text>
                            </View>
                        </View>

                        <View style={styles.colmns_b}>
                            <Text style={styles.snColumns}></Text>
                            <View >
                                <Text >name s. nr. 9</Text>
                            </View>
                        </View>

                        <View style={styles.colmns_b}>
                            <Text style={styles.snColumns}></Text>
                            <View >
                                <Text >Hazard label sample no</Text>
                            </View>
                        </View>

                        <View style={styles.colmns_b}>
                            <Text style={styles.snColumns}></Text>
                            <View >
                                <Text >Pack. group</Text>
                            </View>
                        </View>


                    </View>
                </View>




                <View style={{ flexDirection: 'row' }}>
                    <View style={styles.colmns5}>
                        <Text style={styles.snColumns}>10</Text>
                        <View >
                            <Text >Statistical nr.</Text>
                        </View>
                    </View>

                    <View style={styles.colmns6}>
                        <Text style={styles.snColumns}>11</Text>
                        <View >
                            <Text >Gross weight kg</Text>
                            <Text style={styles.leftData}>{items.allParcelDetailsSum.weight} kg</Text>
                        </View>
                    </View>

                    <View style={styles.colmns7}>
                        <Text style={styles.snColumns}>12</Text>
                        <View >
                            <Text >Volume in m3</Text>
                            <Text style={styles.leftData}>{items.allParcelDetailsSum.volume} m3</Text>
                        </View>
                    </View>
                </View>


            </View>
        </View>



        <View style={styles.row8}>

            <View style={styles.row8_col1}>
                <View style={styles.colmns}>
                    <Text style={styles.snColumns}>13</Text>
                    <View >
                        <Text >Sender's instructions</Text>
                        <Text style={styles.leftData}>{items.collectionInstructions}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.row8_col2}>

                <View style={{ width: '25%' }}>
                    <View style={{ borderBottom: 1, borderLeft: 1, height: 15 }}>
                        <Text ><Text style={styles.sn}>19 </Text>To be paid by</Text>
                    </View>

                    <View style={{ borderLeft: 1, height: 15 }}>
                        <Text >Carriage</Text>
                    </View>

                    <View style={{ borderBottom: 1, borderLeft: 1, height: 15 }}>
                        <Text >Reductions</Text>
                    </View>

                    <View style={{ borderLeft: 1, height: 15 }}>
                        <Text >Balance</Text>
                    </View>

                    <View style={{ borderLeft: 1, height: 15 }}>
                        <Text >Supplement charges</Text>
                    </View>

                    <View style={{ borderLeft: 1, height: 15 }}>
                        <Text >Additional charges</Text>
                    </View>

                    <View style={{ borderBottom: 1, borderLeft: 1, height: 15 }}>
                        <Text >Miscellaneous</Text>
                    </View>

                    <View style={{ borderLeft: 1, height: 15 }}>
                        <Text >Total to be paid s</Text>
                    </View>
                </View>


                <View style={{ width: '25%' }}>
                    <View style={{ borderBottom: 1, borderLeft: 1, height: 15 }}>
                        <Text >Sender</Text>
                    </View>

                    <View style={{ borderBottom: 1, borderLeft: 1, height: 15 }}>
                        <Text ></Text>
                    </View>

                    <View style={{ borderBottom: 1, borderLeft: 1, height: 15 }}>
                        <Text ></Text>
                    </View>

                    <View style={{ borderBottom: 1, borderLeft: 1, height: 15 }}>
                        <Text ></Text>
                    </View>

                    <View style={{ borderBottom: 1, borderLeft: 1, height: 15 }}>
                        <Text ></Text>
                    </View>

                    <View style={{ borderBottom: 1, borderLeft: 1, height: 15 }}>
                        <Text ></Text>
                    </View>

                    <View style={{ borderBottom: 1, borderLeft: 1, height: 15 }}>
                        <Text ></Text>
                    </View>

                    <View style={{ borderLeft: 1, height: 15 }}>
                        <Text ></Text>
                    </View>
                </View>

                <View style={{ width: '25%' }}>
                    <View style={{ borderBottom: 1, borderLeft: 1, height: 15 }}>
                        <Text >Currency</Text>
                    </View>

                    <View style={{ borderBottom: 1, borderLeft: 1, height: 15, flexDirection: 'row', }}>
                        <Text style={{ borderRight: 1, width: '50%' }}></Text>
                        <Text style={{ width: '50%' }}></Text>
                    </View>

                    <View style={{ borderBottom: 1, borderLeft: 1, height: 15, flexDirection: 'row', }}>
                        <Text style={{ borderRight: 1, width: '50%' }}></Text>
                        <Text style={{ width: '50%' }}></Text>
                    </View>

                    <View style={{ borderBottom: 1, borderLeft: 1, height: 15, flexDirection: 'row', }}>
                        <Text style={{ borderRight: 1, width: '50%' }}></Text>
                        <Text style={{ width: '50%' }}></Text>
                    </View>

                    <View style={{ borderBottom: 1, borderLeft: 1, height: 15, flexDirection: 'row', }}>
                        <Text style={{ borderRight: 1, width: '50%' }}></Text>
                        <Text style={{ width: '50%' }}></Text>
                    </View>

                    <View style={{ borderBottom: 1, borderLeft: 1, height: 15, flexDirection: 'row', }}>
                        <Text style={{ borderRight: 1, width: '50%' }}></Text>
                        <Text style={{ width: '50%' }}></Text>
                    </View>

                    <View style={{ borderBottom: 1, borderLeft: 1, height: 15, flexDirection: 'row', }}>
                        <Text style={{ borderRight: 1, width: '50%' }}></Text>
                        <Text style={{ width: '50%' }}></Text>
                    </View>

                    <View style={{ borderLeft: 1, height: 15, flexDirection: 'row', }}>
                        <Text style={{ borderRight: 1, width: '50%' }}></Text>
                        <Text style={{ width: '50%' }}></Text>
                    </View>
                </View>

                <View style={{ width: '25%' }}>
                    <View style={{ borderBottom: 1, borderLeft: 1, height: 15 }}>
                        <Text >Consignee</Text>
                    </View>

                    <View style={{ borderBottom: 1, borderLeft: 1, height: 15 }}>
                        <Text ></Text>
                    </View>

                    <View style={{ borderBottom: 1, borderLeft: 1, height: 15 }}>
                        <Text ></Text>
                    </View>

                    <View style={{ borderBottom: 1, borderLeft: 1, height: 15 }}>
                        <Text ></Text>
                    </View>

                    <View style={{ borderBottom: 1, borderLeft: 1, height: 15 }}>
                        <Text ></Text>
                    </View>

                    <View style={{ borderBottom: 1, borderLeft: 1, height: 15 }}>
                        <Text ></Text>
                    </View>

                    <View style={{ borderBottom: 1, borderLeft: 1, height: 15 }}>
                        <Text ></Text>
                    </View>

                    <View style={{ borderLeft: 1, height: 15 }}>
                        <Text ></Text>
                    </View>
                </View>
            </View>






        </View>

        <View style={{ borderRight: 1, borderLeft: 1, borderTop: 1, width: '100%', height: 20, fontSize: 7 }}>
            <Text><Text style={styles.sn}>14 </Text>Cash on delivery</Text>
        </View>

        <View style={{ borderRight: 1, borderLeft: 1, borderTop: 1, width: '100%', height: 70, fontSize: 7, flexDirection: 'row' }}>
            <View style={{ width: '50%', }}>
                <View style={{ borderRight: 1, height: 50 }}>
                    <Text><Text style={styles.sn}>15 </Text>Instruction as to payement carriage</Text>
                    <Text> Frei/Carriage paid</Text>
                    <Text> Unfrei/Carriage forward</Text>
                </View>
                <View style={{ borderRight: 1, borderTop: 1, height: 50 }}>
                    <View>
                        <Text><Text style={styles.sn}>21 </Text>Established in    </Text>
                    </View>
                </View>
            </View>
            <View style={{ width: '50%', }}>
                <Text><Text style={styles.sn}>20 </Text>Special agreements</Text>
            </View>
        </View>

        <View style={{ borderRight: 1, borderLeft: 1, borderTop: 1, borderBottom: 1, fontSize: 7, flexDirection: 'row', }}>
            <View style={{ borderRight: 1, width: '33.3%', height: 60, fontSize: 7, padding: 5 }}>
                <Text style={styles.sn}>22 </Text>
                <Text style={{ marginBottom: 0, marginTop: 'auto' }}>Signature and stamp of the sender</Text>
            </View>


            <View style={{ borderRight: 1, width: '33.3%', height: 60, fontSize: 7, padding: 5 }}>
                <Text style={styles.sn}>23 </Text>
                <Text style={{ marginBottom: 0, marginTop: 'auto' }}>Signature and stamp of the carrier</Text>
            </View>


            <View style={{ width: '33.3%', height: 60, fontSize: 7, padding: 5 }}>
                <Text style={styles.sn}>24 </Text>
                <Text style={{ marginBottom: 0, marginTop: 'auto', }}>Signature and stamp of the consignee</Text>
            </View>
        </View>
    </View >
);

export default InvoiceTableRow