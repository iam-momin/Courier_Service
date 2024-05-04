import axios from 'axios';
import React, { Component } from 'react';
import styles from './styles.module.css'
import TableComp from '../../../../components/TableComp'
import { API_HOST, COMMERCIAL_FORM_STATUS, getDD_MM_YYYY, HEADERS, ORDER_STATUS } from '../../../../constants';
import CommercialFormPopup from '../../../../components/CommercialFormPopup';
import { AiOutlineFolderView } from 'react-icons/ai';
import CommercialInvoiceGenerator from '../../../../components/CommercialInvoice/CommercialInvoiceGenerator'
import { PDFDownloadLink } from "@react-pdf/renderer";
import FilterComp from '../../../../components/FilterComp';
import { MdOutlineSimCardDownload } from 'react-icons/md'
import { BiCommentError } from 'react-icons/bi'
import SuccessPopup from '../../../../components/SuccessPopup';
import { GrInProgress } from 'react-icons/gr'
import { MdOutlineScheduleSend } from 'react-icons/md'
import Loader from "react-js-loader";
import DownloadPDF from '../../../../components/DownloadPDF';
import CustomSelect from '../../../../components/CustomSelect';


class CommercialInvoice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableData: [],
            showCommercialFormPopup: false,
            formData: {},
            showSuccessPopup: false,
            showLoader: false,
            isSuccess: false,
            successMsg: '',
            errorMsg: '',
            warningMsg: null,
            toDownload: '',
            isPdfGenerated: false
        }
        this.filterList = [
            { label: 'Order ID', value: 'orderId' },
            { label: 'From City', value: 'collectionCity' },
            { label: 'To City', value: 'deliveryCity' },
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
                accessor: 'totalCostwithCurrency'
            },
            // {
            //     Header: 'Order Status',
            //     accessor: 'orderStatus',
            //     Cell: ({ row }) => <span style={{color: row.original.status ? row.original.status.color : ''}}>{row.original.orderStatus}</span>
            // },
            {

                Header: 'Form Status',
                accessor: 'formStatus',
                Cell: ({ row }) => {
                    return (
                        <CustomSelect
                            name={'ostatus'}
                            options={COMMERCIAL_FORM_STATUS}
                            className={styles.dropdown}
                            value={row.original.status}
                            onChange={(e) => this.handleFormStatus(e, row.original)}
                            isSearchable={false}
                            menuPlacement={'auto'}
                            customStyles={{
                                singleValue:
                                    (provided) => ({
                                        ...provided,
                                        color: row.original.status && row.original.status.color
                                    }),
                                control: (base, state) => ({
                                    ...base,
                                    background: row.original.status ? `${row.original.status.backgroundColor} !important` : '',
                                    boxShadow: row.original.status.backgroundColor !== '#FFFFFF' ? "none !important" : '',
                                })
                            }}
                        />)
                }

                // Header: 'Order Status',
                // accessor: 'orderStatus',
                // Cell: ({ row }) => <span style={ORDER_STATUS_STYLE(row.original.status)}>{row.original.orderStatus}</span>
            },
            {
                Header: 'Action',
                accessor: '-',
                Cell: ({ row }) => {
                    return <div className={styles.viewDetails}>
                        {/* <button onClick={() => { this.setState({ showCommercialFormPopup: true, formData: row.original }) }}>
                            View Details
                        </button> */}
                        <span title='View/Edit Commercial Invoice'
                            className={'icon'}
                            onClick={() => {
                                this.setState({ showCommercialFormPopup: true, formData: row.original })
                            }}>
                            <AiOutlineFolderView style={{ color: 'var(--primary-color)', fontSize: '22px' }} />
                        </span>
                        {row.original.signatureDataArray ?
                            <span id={row.original.orderId} className={'icon'} onClick={() => this.setState({ toDownload: row.original.orderId })} title='Download Commercial Invoice' >
                                <MdOutlineSimCardDownload style={{ color: 'var(--primary-color)', fontSize: '18px' }} />
                                {this.state.toDownload !== '' && !document.querySelector(`#${this.state.toDownload} a`) && this.state.toDownload === row.original.orderId ?
                                    <DownloadPDF document={<CommercialInvoiceGenerator invoiceData={row.original} />} fileName={'Estolink_Commercial_Invoice'} data={row.original}
                                        handleFunction={this.handlePDFDownload} /> : ''}
                            </span>
                            : <span title='Complete the form to download!' className={'icon'}><BiCommentError style={{ color: 'var(--primary-color)', fontSize: '22px' }} /></span>}

                        <span title='Send Commercial Invoice Reminder' className={'icon'} onClick={(e) => this.handleSendEmailCIReminder(row.original.email, row.original.orderId)} >
                            <MdOutlineScheduleSend style={{ color: 'var(--primary-color)', fontSize: '22px', cursor: 'pointer' }} />
                        </span>
                    </div>
                }
            },

        ]
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

    handleSendEmailCIReminder = (email, orderId) => {
        console.log("hello" + email, orderId)
        var re = /\S+@\S+\.\S+/;
        if (re.test(email)) {
            this.setState({ showLoader: true })
            axios.get(`${API_HOST}/api/emailTriggers/ciReminder/email=${email.toLocaleLowerCase()}&orderId=${orderId}`).then((response) => {
                this.setState({ showSuccessPopup: true, isSuccess: true, successMsg: 'Reminder sent successfully', showLoader: false })
            }).catch((error) => {
                this.setState({ showSuccessPopup: true, isSuccess: false, errorMsg: 'Something went wrong!', showLoader: false })
            });
        } else {
            this.setState({ warningMsg: 'Please enter correct email format.' })
        }
    }

    componentDidMount() {
        axios.get(`${API_HOST}/api/customInvoice`, HEADERS)
            .then((res) => {
                if (res) {
                    let tableData = []
                    res && res.data.map(item => {
                        // let date = `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`
                        tableData.push(this.getFormatedObj(item))
                    })
                    this.allTableData = tableData
                    this.setState({ tableData })
                }
            }).catch((error) => {
                console.log(error)
            })
    }

    handleSubmit = (payload) => {
        if (payload.orderId)
            axios.put(`${API_HOST}/api/customInvoice/${payload.orderId}`, payload, HEADERS)
                .then((res) => {
                    if (res) {
                        this.setState({ showCommercialFormPopup: false, showSuccessPopup: true, isSuccess: true, successMsg: 'Updated successfully', showLoader: false })
                        this.handleTableDataUpdate(res.data)
                    }
                }).catch((error) => {
                    this.setState({ submitRes: error.response, showCommercialFormPopup: false, showSuccessPopup: true, isSuccess: false, successMsg: 'Failed please try again', showLoader: false })
                })
    }

    handleFilterApply = (filtered) => {
        this.setState({ tableData: filtered })
    }

    handleFilterClear = () => {
        this.setState({ tableData: this.allTableData })
    }

    handleTableDataUpdate = (data) => {
        const { tableData } = this.state

        const newObj = this.getFormatedObj(data)
        this.setState({ tableData: tableData && tableData.map(item => item._id === data._id ? newObj : item) })
    }
    getFormatedObj = (item) => {
        let d = new Date(item.createdAt)
        return {
            orderId: item.orderId,
            date: getDD_MM_YYYY(d),
            // fullSenderName: `${item.senderName}`,
            // fullRecieverName: `${item.receiverName}`,
            commercialinvoice: item.signatureDataArray ? "Generated" : "Not Generated",
            totalCostwithCurrency: item.totalValueOfGoods,
            orderStatus: item.status && item.status.label || '-',
            ...item,
        }
    }
    handleFormStatus=(e, rowObj)=>{
        axios.put(`${API_HOST}/api/customInvoice/formStatus/${rowObj.orderId}`, { status: e }, HEADERS)
        .then((res) => {
            if(res.data.status.label === COMMERCIAL_FORM_STATUS[1].label && !res.data.editDisabled){
                this.handleDisableEdit(true, rowObj)
            }else {
                const item = res.data;
                const data = this.getFormatedObj(item)
                const index = this.state.tableData.indexOf(rowObj)
                let tableData = [...this.state.tableData]
                tableData[index] = data;
                this.allTableData = tableData
                this.setState({ tableData })
            }
        }).catch((error) => {
            console.log(error)
        })
    }
    handleDisableEdit = (editDisabled, rowObj) => {
        const formData = rowObj
        axios.put(`${API_HOST}/api/customInvoice/disableEdit/${formData && formData.orderId}`, { editDisabled }, HEADERS)
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
    render() {
        const { tableData, formData, showCommercialFormPopup, showSuccessPopup, isSuccess, showLoader, successMsg, errorMsg, } = this.state
        return (
            <div className={styles.ordersContainer}>
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
                    handleSubmit={this.handleSubmit}
                    isUserAdmin={true} />}
                {showSuccessPopup &&
                    <SuccessPopup
                        isSuccess={isSuccess}
                        successText={successMsg}
                        errorText={errorMsg}
                        onClick={() => this.setState({ showSuccessPopup: false, isSuccess: false })}
                    />}
                {showLoader && <div className={styles.loader}><Loader type="spinner-circle" bgColor={"#000"} title={"Sending..."} color={'#000'} size={80} /></div>}
            </div>
        );
    }
}

export default CommercialInvoice;