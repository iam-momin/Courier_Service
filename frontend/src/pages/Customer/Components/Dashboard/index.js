import axios from 'axios';
import React, { Component } from 'react';
import styles from './styles.module.css'
import TableComp from '../../../../components/TableComp'
import { API_HOST, getDD_MM_YYYY, HEADERS, INVOICE_STATUS, DROPDOWN_DATA, PARCELPOINT_DATA, ORDER_STATUS, ORDER_STATUS_STYLE, INVOICE_STATUS_STYLE } from '../../../../constants';
import { AiOutlineFolderView } from 'react-icons/ai';
import OrderFormPopup from '../../../../components/OrderFormPopup';
import FilterComp from '../../../../components/FilterComp';
import LabelGenerator from '../../../../components/ParcelLabel/LabelGenerator';
import DownloadPDF from '../../../../components/DownloadPDF';
import { MdOutlineSimCardDownload } from 'react-icons/md';
import InvoiceGenerator from '../../../../components/Invoice/InvoiceContent/InvoiceGenerator';
import { BiCommentError } from 'react-icons/bi';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableData: [],
            showViewNEditDetails: false,
            viewNEditDetailsData: {},
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
                Header: 'Order Status',
                accessor: 'orderStatus',
                Cell: ({ row }) => <span style={ORDER_STATUS_STYLE(row.original.status)}>{row.original.orderStatus}</span>
            },
            {
                Header: 'Date Placed',
                accessor: 'date'
            },
            {
                Header: 'No. of Parcels',
                accessor: 'numberOfParcel'
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
                Header: 'Amount',
                accessor: 'amount'
            },
            {
                Header: 'Payment Status',
                accessor: 'invoiceStatusColumn',
                Cell: ({ row }) => <span style={INVOICE_STATUS_STYLE(row.original.invoiceStatus)}>{row.original.invoiceStatusColumn}</span>
            },
            {
                Header: 'Action',
                accessor: '-',
                Cell: ({ row }) => {
                    return <div className={styles.viewDetails}>
                        {row.original.isInvoiceGenerated && row.original.isInvoiceGenerated ?
                            <span id={row.original.orderId} className={'icon'} onClick={() => this.setState({ toDownload: row.original.orderId })} title={'Download Invoice'} >
                                <MdOutlineSimCardDownload style={{ color: 'var(--primary-color)', fontSize: '18px' }} />
                                {this.state.toDownload !== '' && !document.querySelector(`#${this.state.toDownload} a`) && this.state.toDownload === row.original.orderId ?
                                    <DownloadPDF document={<InvoiceGenerator invoice={row.original} />} fileName={'_Invoice_Estolink'} data={row.original}
                                        handleFunction={this.handlePDFDownload} /> : ''}
                            </span>
                            : <span title='Invoice Not Generated' className={'icon'}><BiCommentError style={{ color: 'var(--primary-color)', fontSize: '18px' }} /></span>}

                        <span id={row.original.orderId} className={'icon'} onClick={() => this.setState({ toDownload: row.original.orderId })} title={'Download Label'}>
                            <MdOutlineSimCardDownload style={{ color: 'var(--primary-color)', fontSize: '18px' }} />
                            {this.state.toDownload !== '' && !document.querySelector(`#${this.state.toDownload} a`) && this.state.toDownload === row.original.orderId ?
                                <DownloadPDF document={<LabelGenerator labelData={row.original} />} fileName={'_Sticky_Label'} data={row.original}
                                    handleFunction={this.handlePDFDownload} /> : ''}
                        </span>

                        <span title='View/Edit Order' className={'icon'} onClick={() => { this.setState({ showViewNEditDetails: true, viewNEditDetailsData: row.original }) }} >
                            <AiOutlineFolderView style={{ color: 'var(--primary-color)', fontSize: '18px', cursor: 'pointer' }} />
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
        this.allTableData = [];
        this.loadingCount = 0
    }

    handlePDFDownload = () => {
        this.loadingCount += 1
        if (this.loadingCount === 1) this.setState({ isPdfGenerated: true })
    }
    componentDidUpdate() {
        if (this.state.isPdfGenerated) {
            this.timeOut = setTimeout(() => {
                document.querySelector(`#${this.state.toDownload} a`).click()
                this.setState({ toDownload: '' })
                this.loadingCount = 0
            }, 300)
            this.setState({ isPdfGenerated: false })
        }
    }

    UNSAFE_componentWillMount() {
        this.getOrderDetails(true)
    }
    handleDueDateCheck = (data) => {
        const orderIds = []
        data && data.map(item => {
            const splitted = item.dueDate ? item.dueDate.split('/') : []
            const dueDate = new Date(`${splitted[2]}-${splitted[1]}-${splitted[0]}`)
            const isValid = item.invoiceStatus && item.invoiceStatus.label === INVOICE_STATUS[0].label
            const isDateGreater = dueDate.getTime() <= new Date().getTime();
            if (isValid && isDateGreater) {
                orderIds.push(item.orderId)
            }

        })
        if (orderIds.length > 0) {
            axios.put(`${API_HOST}/api/orderDetails/dueDate/invoiceStatus`, { orderIds }, HEADERS)
                .then((res) => {
                    this.getOrderDetails()
                }).catch((error) => {
                    console.log(error)
                })
        }
    }

    getOrderDetails = (updateInvoiceStatus) => {
        axios.get(`${API_HOST}/api/orderDetails/me`, HEADERS).then((res) => {
            if (res) {
                let tableData = []
                res && res.data.filter(orderStatus => orderStatus.status.label !== "Delivered", invoiceStatus => invoiceStatus.status.label !== "Paid").map(item => {
                    tableData.push(this.getFormatedObj(item))
                })
                updateInvoiceStatus && this.handleDueDateCheck(tableData)
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
            fullSenderName: `${item.firstName} ${item.lastName}`,
            fullRecieverName: `${item.receiverName}`,
            invoiceStatusColumn: item.invoiceStatus.label,
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
        const { tableData, viewNEditDetailsData, showViewNEditDetails } = this.state

        return (
            <div className={styles.dashboardContainer}>
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
                    handleSubmitUpdate={this.handleSubmitUpdate} DROPDOWN_DATA={DROPDOWN_DATA} PARCELPOINT_DATA={PARCELPOINT_DATA} />} */}
                {showViewNEditDetails &&
                    <OrderFormPopup viewNEditDetailsData={viewNEditDetailsData}
                        onClose={() => this.setState({ showViewNEditDetails: false })}
                        isEditValid={viewNEditDetailsData && viewNEditDetailsData.status && viewNEditDetailsData.status.label === 'Order Placed'}
                        handleSubmitUpdate={this.handleSubmitUpdate} DROPDOWN_DATA={DROPDOWN_DATA} PARCELPOINT_DATA={PARCELPOINT_DATA} isAdmin={false} />}
            </div>
        );
    }
}

export default Dashboard;