import axios from 'axios';
import React, { Component } from 'react';
import { AiFillEye, AiOutlineFolderView } from 'react-icons/ai';
import ClaimFormPopup from '../../../../components/ClaimFormPopup';
import TableComp from '../../../../components/TableComp';
import { API_HOST, CLAIM_STATUS, HEADERS } from '../../../../constants';
import styles from './styles.module.css';
import FilterComp from '../../../../components/FilterComp';
import CustomSelect from '../../../../components/CustomSelect';
class ClaimInvoice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableData: [],
            showClaimPopupForm: false,
            formData: {},
            orderId: '',
            insuranceTotalValue: 0,
            claimDescription: ''
        }
        this.filterList = [
            { label: 'Order ID', value: 'orderId' },
        ]
        this.allTableData = []
        this.columns = [
            {
                Header: 'S/N',
                accessor: '',
                Cell: ({ row }) => <span className={styles.viewDetails}>{parseInt(row.id) + 1}</span>
            },
            {
                Header: 'Order ID',
                accessor: 'orderId'
            },
            {
                Header: 'Sender Name',
                accessor: 'senderName'
            },
            {
                Header: 'Description',
                accessor: 'claimDescription'
            },
            {
                Header: 'No. of Parcels',
                accessor: 'noOfParcels'
            },
            {
                Header: 'Amount',
                accessor: 'amount'
            },
            {
                Header: 'Claim Status',
                accessor: 'claimStatus',
                Cell: ({ row }) => {
                    return (
                        <CustomSelect
                            name={'claimStatus'}
                            options={CLAIM_STATUS}
                            value={row.original.claimStatus}
                            onChange={(e) => this.handleClaimStatus(e, row.original)}
                            isSearchable={false}
                            menuPlacement={'auto'}
                            customStyles={{singleValue: 
                                (provided) => ({
                                  ...provided,
                                  color: row.original.claimStatus && row.original.claimStatus.color
                                })
                              }}
                        />)
                }
            },
            {
                Header: 'Action',
                accessor: '-',
                Cell: ({ row }) => {
                    return <div className={styles.viewDetails}>
                        {/* <button onClick={() => { this.setState({ showClaimPopupForm: true, orderId: row.original.orderId, insuranceTotalValue: row.original.insuranceTotalValue, formData: row.original.claimDetails }) }}>
                            View Details
                        </button> */}
                        <span title='View Insurance Claim'
                            onClick={() => {
                                this.setState({ showClaimPopupForm: true, orderId: row.original.orderId, insuranceTotalValue: row.original.insuranceTotalValue, formData: row.original.claimDetails })
                            }}>
                            <AiOutlineFolderView style={{ color: 'var(--primary-color)', fontSize: '22px' }} />
                        </span>
                    </div>
                }
            },

        ]
    }

    componentDidMount() {
        axios.get(`${API_HOST}/api/orderDetails/claims`, HEADERS)
            .then((res) => {
                if (res) {
                    let tableData = []
                    res && res.data.filter(claimStatus => true).map(item => {
                        tableData.push(this.getFormatedObj(item))
                    })
                    this.allTableData = tableData
                    this.setState({ tableData })
                }
            }).catch((error) => {
                console.log(error)
            })
    }

    handleClaimStatus = (e, rowObj) => {
        axios.put(`${API_HOST}/api/orderDetails/claimStatus/${rowObj.orderId}`, { claimStatus: e }, HEADERS)
            .then((res) => {
                const item = res.data;
                const data = this.getFormatedObj(item)
                const index = this.state.tableData.indexOf(rowObj)
                let tableData = [...this.state.tableData]
                tableData[index] = data;
                this.allTableData = tableData
                this.setState({ tableData })
            }).catch((error) => {
                console.log(error)
            })
    }

    handleFilterApply = (filtered) => {
        this.setState({ tableData: filtered })
    }
    handleFilterClear = () => {
        this.setState({ tableData: this.allTableData })
    }

    getFormatedObj = (item) => {
        return {
            ...item,
            senderName: `${item.senderName}`,
            receiverName: `${item.receiverName}`,
            orderId: item.orderId,
            insuranceTotalValue: item.insuranceTotalValue,
            noOfParcels: item.numberOfParcel,
            amount: item.insuranceTotalValue,
            claimStatus: item.claimStatus,
            claimDescription: item.claimDetails && item.claimDetails.claimDescription,
            claimDetails: item.claimDetails
        }
    }

    render() {
        const { tableData, formData, showClaimPopupForm, orderId, insuranceTotalValue, claimDescription } = this.state

        return (
            <div className={styles.ordersContainer}>
                <FilterComp
                    tableData={this.allTableData}
                    filterList={this.filterList}
                    claimStatusList={CLAIM_STATUS}
                    handleFilterApply={this.handleFilterApply}
                    handleFilterClear={this.handleFilterClear}
                    isDateRequired={false}
                />
                <div className={styles.tabelWrapper}>
                    <TableComp
                        data={tableData}
                        columns={this.columns} />
                </div>
                {showClaimPopupForm &&
                    <ClaimFormPopup
                        orderId={orderId}
                        insuranceTotalValue={insuranceTotalValue}
                        claimDescription={claimDescription}
                        formData={formData}
                        handleCancel={() => this.setState({ showClaimPopupForm: false })}
                        // isEditValid={viewNEditDetailsData && viewNEditDetailsData.status && viewNEditDetailsData.status.label === 'Order Placed'}
                        editDisabled={true}
                        isAdmin={true} />}
            </div>
        );
    }
}

export default ClaimInvoice;