
import { PDFDownloadLink } from "@react-pdf/renderer";
import CommercialInvoiceGenerator from '../../../../components/CommercialInvoice/CommercialInvoiceGenerator'
import axios from 'axios';
import React, { Component } from 'react';
import styles from './styles.module.css'
import TableComp from '../../../../components/TableComp'
import { API_HOST, COMMERCIAL_FORM_STATUS, COMMERCIAL_FORM_STATUS_STYLE, getDD_MM_YYYY, HEADERS, ORDER_STATUS, ORDER_STATUS_STYLE } from '../../../../constants';
import CommercialFormPopup from '../../../../components/CommercialFormPopup'
import { AiOutlineFolderView } from 'react-icons/ai';
import { MdOutlineSimCardDownload } from 'react-icons/md'
import { BiCommentError } from 'react-icons/bi'
import { withRouter } from "react-router";
import FilterComp from "../../../../components/FilterComp";
import { GrInProgress } from 'react-icons/gr'
import SuccessPopup from "../../../../components/SuccessPopup";
import DownloadPDF from "../../../../components/DownloadPDF";

class CommercialInvoice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableData: [],
            showCommercialFormPopup: false,
            formData: {},
            showSuccessPopup: false,
            isSuccess: false,
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
                Header: 'Submission Date',
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
                Header: 'Commercial Invoice',
                accessor: 'commercialinvoice'
            },
            {
                Header: 'Value',
                accessor: 'totalCost'
            },
            {

                Header: 'Form Status',
                accessor: 'formStatus',
                // Cell: ({ row }) => <span style={{color: row.original.status ? row.original.status.color : ''}}>{row.original.orderStatus}</span>
                Cell: ({ row }) => <span style={COMMERCIAL_FORM_STATUS_STYLE(row.original.status)}>{row.original.orderStatus}</span>

                // Header: 'Order Status',
                // accessor: 'orderStatus',
                // Cell: ({ row }) => <span style={ORDER_STATUS_STYLE(row.original.status)}>{row.original.orderStatus}</span>
            },
            {
                Header: 'Action',
                accessor: 'label',
                Cell: ({ row }) => {
                    const { showCommercialFormPopup, } = this.state
                    return <div className={styles.viewDetails}>
                        <span title='View/Edit Commercial Invoice' className={'icon'} onClick={() => this.setState({ showCommercialFormPopup: true, formData: row.original })} >
                            <AiOutlineFolderView style={{ color: 'var(--primary-color)', fontSize: '22px' }} />
                        </span>

                        {row.original.signatureDataArray ?
                            <span id={row.original.orderId} className={'icon'} onClick={() => this.setState({ toDownload: row.original.orderId })} title='Download Commercial Invoice' >
                                <MdOutlineSimCardDownload style={{ color: 'var(--primary-color)', fontSize: '18px' }} />
                                {this.state.toDownload !== '' && !document.querySelector(`#${this.state.toDownload} a`) && this.state.toDownload === row.original.orderId ?
                                    <DownloadPDF document={<CommercialInvoiceGenerator invoiceData={row.original} />} fileName={'_Estolink_Commercial_Invoice'} data={row.original}
                                        handleFunction={this.handlePDFDownload} /> : ''}
                            </span>
                            : <span title='Complete the form to download!' className={'icon'}><BiCommentError style={{ color: 'var(--primary-color)', fontSize: '22px' }} /></span>}

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
        this.getCommercialInvoices()
    }

    getCommercialInvoices = () => {
        axios.get(`${API_HOST}/api/customInvoice/me`, HEADERS).then((res) => {
            if (res) {
                let tableData = []
                res && res.data.map(item => {
                    tableData.push({
                        ...item,
                        date: getDD_MM_YYYY(new Date(item.createdAt)),
                        commercialinvoice: item.signatureDataArray ? "Generated" : "Not Generated",
                        totalCost: `${item.currency.symbol}${item.totalValueOfGoods}`,
                        orderStatus: item.status && item.status.label || '-',
                    })
                })
                if (this.props.history.location.state && this.props.history.location.state.showCommercialFormPopup && tableData) {
                    this.setState({ showCommercialFormPopup: true, formData: tableData[0] })
                }
                this.allTableData = tableData
                this.setState({ tableData })
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    handleSubmit = (payload) => {
        if (payload.orderId)
            axios.put(`${API_HOST}/api/customInvoice/${payload.orderId}`, {...payload, status: COMMERCIAL_FORM_STATUS[0]}, HEADERS).then((res) => {
                if (res) {
                    this.setState({ showCommercialFormPopup: false, showSuccessPopup: true, isSuccess: true })
                    this.getCommercialInvoices()
                }
            }).catch((error) => {
                this.setState({ submitRes: error.response, showSuccessPopup: true, isSuccess: false })
            })
    }
    handleFilterApply = (filtered) => {
        this.setState({ tableData: filtered })
    }
    handleFilterClear = () => {
        this.setState({ tableData: this.allTableData })
    }
    render() {
        const { tableData, formData, showCommercialFormPopup, showSuccessPopup, isSuccess } = this.state
        return (
            <div className={styles.container}>
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
                {showCommercialFormPopup && <CommercialFormPopup
                    formData={formData}
                    handleClose={() => { this.setState({ showCommercialFormPopup: false }) }}
                    handleSubmit={this.handleSubmit} />}
                {showSuccessPopup &&
                    <SuccessPopup
                        isSuccess={isSuccess}
                        successText={'Order updated successful'}
                        errorText={'Failed please try again'}
                        onClick={() => this.setState({ showSuccessPopup: false, isSuccess: false })}
                    />
                }
            </div>
        );
    }
}

export default withRouter(CommercialInvoice);