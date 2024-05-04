import axios from 'axios';
import React, { Component } from 'react';
import { BsChatLeftText } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import Button from '../../../../components/Button';
import ClaimFormPopup from '../../../../components/ClaimFormPopup';
import FilterComp from '../../../../components/FilterComp';
import TableComp from '../../../../components/TableComp';
import { API_HOST, CLAIM_STATUS, getDD_MM_YYYY, HEADERS, ORDER_STATUS } from '../../../../constants';
import styles from './styles.module.css';

class Claims extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableData: [],
            showClaimPopupForm: false,
            orderId: '',
            insuranceTotalValue: 10,
            formData: null,
            claimStatus: ''
        }
        this.columns = [
            {
                Header: 'S/N',
                accessor: '',
                Cell: ({ row }) => <span className={styles.viewDetails}>{parseInt(row.id )+ 1}</span>
            },
            {
                Header: 'Order ID',
                accessor: 'orderId'
            },
            {
                Header: 'Order Placed',
                accessor: 'date'
            },
            {
                Header: 'No. of Parcels',
                accessor: 'noOfParcels'
            },
            {
                Header: 'Transportation Cost',
                accessor: 'amount'
            },
            {
                Header: 'Insurance Amount',
                accessor: 'insuranceTotalValue'
            },
            {
                Header: 'Claim Status',
                accessor: 'claimStatus',
                Cell: ({ row }) => <span style={{color: row.original.claimStatusColor}}>{row.original.claimStatus}</span>
            },
            {
                Header: 'Insurance',
                accessor: '-',
                Cell: ({ row }) => {
                    return <div className={styles.viewDetails}>
                        <div className={styles.newClaimBtn}>
                            <Button id="claimBtn" text={'Claim'} classes={'primary sm'}
                                onClick={() =>
                                    this.setState({ showClaimPopupForm: true, orderId: row.original.orderId, insuranceTotalValue: row.original.insuranceTotalValue, formData: row.original.claimDetails, claimStatus: row.original.claimStatus })} />

                        </div>
                    </div>
                }
            },
        ]
        this.filterList = [
            { label: 'Order ID', value: 'orderId' },
            { label: 'From City', value: 'collectionCity' },
            { label: 'To City', value: 'deliveryCity' },
        ]
        this.allTableData = []
    }
    componentDidMount() {
        this.getAllOrderDetails()
    }
    getAllOrderDetails = () => {
        axios.get(`${API_HOST}/api/orderDetails/claims/me`, HEADERS).then((res) => {
            if (res) {
                let tableData = []
                res && res.data.map(item => {
                    tableData.push({
                        date: getDD_MM_YYYY(new Date(item.createdAt)),
                        senderName: `${item.firstName} ${item.lastName}`,
                        receiverName: `${item.receiverName}`,
                        orderId: item.orderId,
                        insuranceTotalValue: `${item.invoiceCurrency.symbol}${item.insuranceTotalValue}`,
                        noOfParcels: item.numberOfParcel,
                        amount: `${item.invoiceCurrency.symbol}${parseFloat((item.expectedCost) +
                            parseFloat((item.insuranceRequired === 'Yes' ? item.insurancePremium : (0.00))) +
                            parseFloat((item.additionalServices[0].isChecked ? item.additionalServices[0].cost : 0)) +
                            parseFloat((item.additionalServices[1].isChecked ? item.additionalServices[1].cost : 0)) +
                            parseFloat((item.additionalServices[2].isChecked ? item.additionalServices[2].cost : 0)) +
                            parseFloat((item.additionalServices[3].isChecked ? item.additionalServices[3].cost : 0)) +
                            parseFloat((item.additionalServices[4].isChecked ? item.additionalServices[4].cost : 0)) +
                            parseFloat((item.additionalServices[5].isChecked ? item.additionalServices[5].cost : 0))).toFixed(2)}`,
                        claimStatus: item.claimStatus.label,
                        claimDetails: item.claimDetails,
                        claimStatusColor: item.claimStatus && item.claimStatus.color,
                    })
                })
                this.allTableData = tableData
                this.setState({ tableData })
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    handleSubmit = () => {
        this.getAllOrderDetails()
        this.setState({ showClaimPopupForm: false })
    }
    handleFilterApply = (filtered) => {
        this.setState({ tableData: filtered })
    }
    handleFilterClear = () => {
        this.setState({ tableData: this.allTableData })
    }
    render() {
        const { tableData, showClaimPopupForm, orderId, insuranceTotalValue, formData, claimStatus } = this.state

        return (
            <div className={styles.container}>
                <FilterComp
                    tableData={this.allTableData}
                    filterList={this.filterList}
                    orderStatusList={ORDER_STATUS}
                    handleFilterApply={this.handleFilterApply}
                    handleFilterClear={this.handleFilterClear}
                    isDateRequired={false}
                />
                <div className={styles.tabelWrapper}>
                    <TableComp
                        data={tableData}
                        columns={this.columns} />
                </div>
                {showClaimPopupForm && <ClaimFormPopup
                    orderId={orderId}
                    insuranceTotalValue={insuranceTotalValue}
                    handleCancel={() => { this.setState({ showClaimPopupForm: false }) }}
                    handleSubmit={this.handleSubmit}
                    formData={formData}
                    editDisabled={claimStatus !== (CLAIM_STATUS[CLAIM_STATUS.length - 1] && CLAIM_STATUS[CLAIM_STATUS.length - 1].label)} />}
                <Link to={{ pathname: '../customer/chat' }} className={styles.toChat}>
                    <BsChatLeftText style={{ fontSize: '24px' }} />
                </Link>
            </div>
        );
    }
}

export default Claims;