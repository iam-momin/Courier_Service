import axios from 'axios';
import React, { Component } from 'react';
import styles from './styles.module.css'
import TableComp from '../../../../components/TableComp'
import { API_HOST, getDD_MM_YYYY, HEADERS, DROPDOWN_DATA, PARCELPOINT_DATA, ORDER_STATUS, ORDER_STATUS_STYLE } from '../../../../constants';
import { PDFDownloadLink } from "@react-pdf/renderer";
import LabelGenerator from '../../../../components/ParcelLabel/LabelGenerator'
// import CommercialInvoiceGenerator from '../../../../components/CommercialInvoice/CommercialInvoiceGenerator'
import { AiOutlineFolderView } from 'react-icons/ai';
import { MdOutlineSimCardDownload } from 'react-icons/md';
import OrderFormPopup from '../../../../components/OrderFormPopup';
import FilterComp from '../../../../components/FilterComp';
import { GrInProgress } from 'react-icons/gr'
import DownloadPDF from '../../../../components/DownloadPDF';

class AllOrders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableData: [],
            showViewNEditDetails: false,
            toDownload: '',
            isPdfGenerated: false
        }
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
                Header: 'Date Placed',
                accessor: 'date'
            },
            {
                Header: 'Sender Name',
                accessor: 'senderName'
            },
            {
                Header: 'Receiver Name',
                accessor: 'receiverName'
            },
            {
                Header: 'No. of Parcels',
                accessor: 'numberOfParcel'
            },
            {
                Header: 'Amount',
                accessor: 'amount'
            },
            {
                Header: 'Order Status',
                accessor: 'orderStatus',
                Cell: ({ row }) => <span style={ORDER_STATUS_STYLE(row.original.status)}>{row.original.orderStatus}</span>
            },
            {
                Header: 'Label',
                accessor: 'label_action',
                Cell: ({ row }) => {
                    return <div className={styles.viewDetails}>
                        <span id={row.original.orderId} className={'icon'} onClick={()=>this.setState({toDownload: row.original.orderId})} >
                            <MdOutlineSimCardDownload style={{ color: 'var(--primary-color)', fontSize: '18px' }} />
                            {this.state.toDownload !== '' && !document.querySelector(`#${this.state.toDownload} a`) && this.state.toDownload === row.original.orderId ?
                                <DownloadPDF document={<LabelGenerator labelData={row.original} />} fileName={'_Sticky_Label'} data={row.original} 
                                    handleFunction={this.handlePDFDownload} /> : ''}
                        </span>
                    </div>
                }
            },
            {
                Header: 'Action',
                accessor: 'view_action',
                Cell: ({ row }) => {
                    return <div className={styles.viewDetails}>
                        <span title='View/Edit Order' className={'icon'} onClick={() => { this.setState({ showViewNEditDetails: true, viewNEditDetailsData: row.original }) }} >
                            <AiOutlineFolderView style={{ color: 'var(--primary-color)', fontSize: '22px', cursor: 'pointer' }} />
                        </span>
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
        this.loadingCount = 0
    }
    handlePDFDownload=()=>{
        this.loadingCount += 1
        if(this.loadingCount === 1) this.setState({isPdfGenerated: true})
    }

    componentDidUpdate(){
        if(this.state.isPdfGenerated){
            this.timeOut = setTimeout(()=>{
                document.querySelector(`#${this.state.toDownload} a`).click()
                this.setState({toDownload: ''})
                this.loadingCount = 0 
            }, 300 )
            this.setState({isPdfGenerated: false})
        }
    }
    UNSAFE_componentWillMount() {
        this.getOrderDetails()
    }

    getOrderDetails = () => {
        axios.get(`${API_HOST}/api/orderDetails/me`, HEADERS).then((res) => {
            if (res) {
                let tableData = []
                res && res.data.map(item => {
                    tableData.push(this.getFormatedObj(item))
                })
                this.allTableData = tableData
                this.setState({ tableData })
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    handleSubmitUpdate = (data) => {
        const tableData = this.state.tableData
        this.setState({ tableData: tableData && tableData.map(item => item._id === data._id ? this.getFormatedObj(data) : item) })
    }
    getFormatedObj = (item) => {
        return {
            ...item,
            date: getDD_MM_YYYY(new Date(item.createdAt)),
            senderName: `${item.firstName} ${item.lastName}`,
            receiverName: `${item.receiverName}`,
            amount: `${item.invoiceCurrency.symbol}${parseFloat((item.totalInvoiceAmount)).toFixed(2)}`,
            orderStatus: item.status.label
        }
    }
    handleFilterApply = (filtered) => {
        this.setState({ tableData: filtered })
    }
    handleFilterClear = () => {
        this.setState({ tableData: this.allTableData })
    }
    render() {
        const { tableData, showViewNEditDetails, viewNEditDetailsData } = this.state
        return (
            <div className={styles.allOrdersContainer}>
                <FilterComp
                    tableData={this.allTableData}
                    filterList={this.filterList}
                    orderStatusList={ORDER_STATUS}
                    handleFilterApply={this.handleFilterApply}
                    handleFilterClear={this.handleFilterClear}
                    isDateRequired={true}
                />
                <div className={styles.tabelWrapper}>
                    <TableComp
                        data={tableData}
                        columns={this.columns} />
                </div>
                {/* {showViewNEditDetails && 
                    <ViewNEditDetailsData viewNEditDetailsData={viewNEditDetailsData} 
                    onClose={() => this.setState({ showViewNEditDetails: false })} 
                    isEditValid={viewNEditDetailsData && viewNEditDetailsData.status && viewNEditDetailsData.status.label === 'Order Placed'} 
                    handleSubmitUpdate={this.handleSubmitUpdate}
                    DROPDOWN_DATA={DROPDOWN_DATA} PARCELPOINT_DATA={PARCELPOINT_DATA} />} */}
                {showViewNEditDetails &&
                    <OrderFormPopup viewNEditDetailsData={viewNEditDetailsData}
                        onClose={() => this.setState({ showViewNEditDetails: false })}
                        isEditValid={viewNEditDetailsData && viewNEditDetailsData.status && viewNEditDetailsData.status.label === 'Order Placed'}
                        handleSubmitUpdate={this.handleSubmitUpdate}
                        DROPDOWN_DATA={DROPDOWN_DATA} PARCELPOINT_DATA={PARCELPOINT_DATA} isAdmin={false} />}
            </div>
        );
    }
}

export default AllOrders;