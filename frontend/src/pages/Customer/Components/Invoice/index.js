
import { PDFDownloadLink } from "@react-pdf/renderer";
import axios from 'axios';
import React, { Component, Fragment } from 'react';
import InvoiceGenerator from '../../../../components/Invoice/InvoiceContent/InvoiceGenerator';
import TableComp from '../../../../components/TableComp';
import { API_HOST, getDD_MM_YYYY, HEADERS, INVOICE_STATUS_STYLE, ORDER_STATUS_STYLE } from '../../../../constants';
import styles from './styles.module.css';
import { MdOutlineSimCardDownload } from "react-icons/md";
import { BiCommentError } from 'react-icons/bi'
import { GrInProgress } from 'react-icons/gr'
import { PDFViewer } from '@react-pdf/renderer'
import DownloadPDF from "../../../../components/DownloadPDF";

class Invoice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableData: [],
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
                Header: 'Issue Date',
                accessor: 'invoiceDate'
            },
            {
                Header: 'Due Date',
                accessor: 'dueDate'
            },
            {
                Header: 'Sender Name',
                accessor: 'fullSenderName'
            },
            {
                Header: 'Receiver Name',
                accessor: 'fullRecieverName'
            },
            {
                Header: 'Payment Status',
                accessor: 'invoiceStatusColumn',
                Cell: ({ row }) => <span style={INVOICE_STATUS_STYLE(row.original.invoiceStatus)}>{row.original.invoiceStatusColumn}</span>
            },
            {
                Header: 'Amount',
                accessor: 'amount'
            },
            {
                Header: 'Paid',
                accessor: 'paid'
            },
            {
                Header: 'Order Status',
                accessor: 'orderStatus',
                Cell: ({ row }) => <span style={ORDER_STATUS_STYLE(row.original.status)}>{row.original.orderStatus}</span>
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
                            : <span title='Invoice Not Generated' className={'icon'}><BiCommentError style={{ color: 'var(--primary-color)', fontSize: '22px' }} /></span>}

                    </div>
                }
            },
        ]
        this.loadingCount = 0;
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

    componentDidMount() {
        axios.get(`${API_HOST}/api/orderDetails/me`, HEADERS).then((res) => {
            if (res) {
                let tableData = []
                res && res.data.map(item => {
                    //TODO: need to calculate dueDate as createdDate+14 TODO
                    tableData.push({
                        // date: getDD_MM_YYYY(new Date(item.createdAt)),
                        invoiceDate: item.invoiceDate ? item.invoiceDate : "-",
                        dueDate: getDD_MM_YYYY(new Date(item.createdAt)),
                        fullSenderName: `${item.firstName} ${item.lastName}`,
                        fullRecieverName: `${item.receiverName}`,
                        invoiceStatusColumn: item.invoiceStatus.label,
                        amount: `${item.invoiceCurrency.symbol}${parseFloat((item.totalInvoiceAmount)).toFixed(2)}`,
                        orderStatus: item.status.label,
                        paid: `${item.invoiceCurrency.symbol}${item.partlyAmount || 0}`,
                        ...item,
                    })
                })
                this.setState({ tableData })
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    render() {
        const { tableData, } = this.state
        return (
            <div className={styles.invoiceContainer}>
                <div className={styles.tabelWrapper}>
                    <TableComp
                        data={tableData}
                        columns={this.columns} />
                </div>
            </div>
        );
    }
}

export default Invoice;