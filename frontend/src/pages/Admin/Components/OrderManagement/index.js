import axios from 'axios';
import React, { Component, Fragment } from 'react';
import styles from './styles.module.css'
import TableComp from '../../../../components/TableComp'
import { API_HOST, getDD_MM_YYYY, HEADERS, INVOICE_STATUS, ORDER_STATUS, DROPDOWN_DATA, PARCELPOINT_DATA } from '../../../../constants';
import Switch from "react-switch";
import FilterComp from '../../../../components/FilterComp';
import OrderFormPopup from '../../../../components/OrderFormPopup';
import { AiOutlineEdit, AiOutlineFolderView } from 'react-icons/ai';
import InvoiceGenerator from '../../../../components/Invoice/InvoiceContent/InvoiceGenerator';
import CMRGenerator from '../../../../components/CMR/CMRGenerator';
import { MdOutlineComment, MdOutlineSimCardDownload } from "react-icons/md";
import { PDFDownloadLink } from "@react-pdf/renderer";
import CustomSelect from '../../../../components/CustomSelect';
import { BiCommentError } from 'react-icons/bi'
import { IoMdPaper } from 'react-icons/io'
import { MdOutlineScheduleSend } from 'react-icons/md'
import { GrInProgress } from 'react-icons/gr'
import SuccessPopup from '../../../../components/SuccessPopup';
import Loader from "react-js-loader";
import Button from '../../../../components/Button';
import Input from '../../../../components/Input';
import { PDFViewer } from '@react-pdf/renderer'
import DownloadPDF from '../../../../components/DownloadPDF';
import { useModal } from 'react-hooks-use-modal';
import { IoMdCloseCircle } from 'react-icons/io';
import LabelGenerator from '../../../../components/ParcelLabel/LabelGenerator';
import Textarea from '../../../../components/Textarea';
import SecretCommentPopup from '../../../../components/SecretCommentPopup';

// import ViewNEditDetailsData from '../ViewNEditDetails'
class OrderManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableData: [],
            showViewNEditDetails: false,
            viewNEditDetailsData: {},
            orderStatus: null,
            isInvoiceGenerated: false,
            showLoader: false,
            showSuccessPopup: false,
            successMsg: '',
            errorMsg: '',
            warningMsg: null,
            showPartlyPopup: false,
            partlyAmount: 0,
            partlyPopupDetails: {},
            partlyAmountError: '',
            toDownload: '',
            isPdfGenerated: false,
            showCommentPopup: false,
            secretComment: '',
            activeRowData: null,
        }
        this.filterList = [
            { label: 'Order ID', value: 'orderId' },
            { label: 'From City', value: 'collectionCity' },
            { label: 'To City', value: 'deliveryCity' },
        ]
        this.allTableData = []
        this.page = 1;
        this.count = 0;
        this.columns = [
            // {
            //     Header: 'S/N',
            //     accessor: '',
            //     Cell: ({ row }) => <span className={styles.viewDetails}>{parseInt(row.id) + 1}</span>
            // },
            {
                Header: 'Order ID',
                accessor: 'orderId',
            },
            {
                Header: <AiOutlineEdit style={{ color: 'var(--white)', fontSize: '18px', cursor: 'pointer' }} />,
                accessor: 'edit',
                Cell: ({ row }) => <span title='View/Edit Order' className={'icon'} onClick={() => { this.setState({ showViewNEditDetails: true, viewNEditDetailsData: row.original }) }} >
                    <AiOutlineFolderView style={{ color: 'var(--primary-color)', fontSize: '18px', cursor: 'pointer' }} />
                </span>
            },
            {
                Header: 'Date Placed',
                accessor: 'date'
            },
            {
                Header: 'Owner',
                accessor: 'owner',
                // Cell: ({ row }) => {
                //     return <div>
                //         <label>{row.original.firstName} {row.original.lastName}</label><br></br>
                //         <a href={'tel:' + row.original.senderPhone} >{row.original.senderPhone}</a>
                //     </div>
                // }
            },
            // {
            //     Header: 'Order Status',
            //     accessor: 'orderStatus',
            //     Cell: ({ row }) => {
            //         return (
            //             <CustomSelect
            //                 name={'ostatus'}
            //                 options={ORDER_STATUS}
            //                 className={styles.dropdown}
            //                 value={row.original.status}
            //                 onChange={(e) => this.handleOrderStatus(e, row.original)}
            //                 isSearchable={false}
            //                 menuPlacement={'auto'}
            //                 customStyles={{
            //                     singleValue:
            //                         (provided) => ({
            //                             ...provided,
            //                             color: row.original.status && row.original.status.color
            //                         })
            //                 }}
            //             />)
            //     }
            // },
            {
                Header: 'Order Status',
                accessor: 'orderStatus',
                Cell: ({ row }) => {
                    return (
                        <CustomSelect
                            name={'ostatus'}
                            options={ORDER_STATUS}
                            className={styles.dropdown}
                            value={row.original.status}
                            onChange={(e) => this.handleOrderStatus(e, row.original)}
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
            },
            {
                Header: 'No. of Parcels',
                accessor: 'numberOfParcel'
            },
            {
                Header: 'Sender',
                accessor: 'senderName',
                Cell: ({ row }) => {
                    return <div>
                        <label>{row.original.senderName}</label><br></br>
                        <a href={'tel:' + row.original.senderPhone} >{row.original.senderPhone}</a>
                    </div>
                }
            },
            {
                Header: 'Collection Address',
                accessor: 'collectionCity',
                Cell: ({ row }) => {
                    return <div>
                        <a target="_blank" href={'https://www.google.com/maps/search/?api=1&query=' + row.original.collectionAddress1 + ', ' + row.original.collectionAddress2 + ', ' + row.original.collectionCity + '-' + row.original.collectionZipCode} >{row.original.collectionAddress1}, {row.original.collectionAddress2}, {row.original.collectionCity} - {row.original.collectionZipCode}</a>
                    </div>
                }
            },
            {
                Header: 'Delivery Address',
                accessor: 'deliveryCity',
                Cell: ({ row }) => {
                    return <div>
                        <a target="_blank" href={'https://www.google.com/maps/search/?api=1&query=' + row.original.deliveryAddress1 + ', ' + row.original.deliveryAddress2 + ', ' + row.original.deliveryCity + '-' + row.original.deliveryZipCode} >{row.original.deliveryAddress1}, {row.original.deliveryAddress2}, {row.original.deliveryCity} - {row.original.deliveryZipCode}</a>
                    </div>
                }
            },
            {
                Header: 'Receiver',
                accessor: 'receiverName',
                Cell: ({ row }) => {
                    return <div>
                        <label>{row.original.receiverName}</label><br></br>
                        <a href={'tel:' + row.original.receiverPhone} >{row.original.receiverPhone}</a>
                    </div>
                }
            },
            {
                Header: 'Payment Status',
                accessor: 'invoiceStatus',
                Cell: ({ row }) => {
                    return (
                        <CustomSelect
                            name={'istatus'}
                            options={INVOICE_STATUS}
                            className={styles.dropdown}
                            value={row.original.invoiceStatus}
                            onChange={(e) => this.handleInvoiceStatus(e, row.original)}
                            isSearchable={false}
                            menuPlacement={'auto'}
                            customStyles={{
                                singleValue:
                                    (provided) => ({
                                        ...provided,
                                        color: row.original.invoiceStatus && row.original.invoiceStatus.color
                                    }),
                                control: (base, state) => ({
                                    ...base,
                                    background: row.original.invoiceStatus ? `${row.original.invoiceStatus.backgroundColor} !important` : '',
                                    boxShadow: row.original.invoiceStatus.backgroundColor !== '#FFFFFF' ? "none !important" : '',
                                })
                            }}
                        />)
                }
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
                Header: 'Invoice',
                accessor: 'invoiceSwitch',
                Cell: ({ row }) => {
                    return <div>
                        <Switch
                            id={'invoiceSwitch'}
                            onChange={(e) => this.handleGenerateInvoiceSwitch(e, row.original)}
                            checked={row.original.isInvoiceGenerated}
                            borderRadius={2}
                        />
                    </div>
                }
            },
            {
                Header: 'Action',
                accessor: '-',
                Cell: ({ row }) => {
                    const [Modal, open, close, isOpen] = useModal('root', {
                        preventScroll: true,
                        closeOnOverlayClick: false
                    });

                    const { toDownload } = this.state
                    const data = row.original
                    return <div className={styles.viewDetails}>
                        {/* PDF VIEWER LIVE*/}

                        {/* <Fragment>
                            <PDFViewer width="800" height="600">
                                <InvoiceGenerator invoice={row.original} />
                            </PDFViewer>
                        </Fragment> */}

                        <span>
                            <IoMdPaper title='Preview Invoice' onClick={open} style={{ color: 'var(--primary-color)', fontSize: '18px', cursor: 'pointer' }} />
                            <Modal>
                                <Fragment>
                                    <PDFViewer width="800" height="600">
                                        <InvoiceGenerator invoice={row.original} />
                                    </PDFViewer>
                                    <IoMdCloseCircle
                                        style={{ color: 'red', fontSize: 28, verticalAlign: 'top', backgroundColor: 'white', borderRadius: 10 }}
                                        onClick={close} />
                                </Fragment>
                            </Modal>
                        </span>

                        {/* PDF VIEWER LIVE*/}


                        {/* <span title='View/Edit Order' className={'icon'} onClick={() => { this.setState({ showViewNEditDetails: true, viewNEditDetailsData: row.original }) }} >
                            <AiOutlineFolderView style={{ color: 'var(--primary-color)', fontSize: '18px', cursor: 'pointer' }} />
                        </span> */}

                        {/* INVOICE */}
                        {/* {row.original.isInvoiceGenerated && row.original.isInvoiceGenerated ?
                            <span id={`inv-${data.orderId}`} className={'icon'} onClick={() => this.setState({ toDownload: `inv-${data.orderId}` })} title={'Download Invoice'}>
                                <MdOutlineSimCardDownload style={{ color: 'var(--primary-color)', fontSize: '18px' }} />
                                {toDownload !== '' && !document.querySelector(`#${this.state.toDownload} a`) && toDownload === `inv-${data.orderId}` ?
                                    <DownloadPDF document={<InvoiceGenerator invoice={row.original} />} fileName={'_Invoice_Estolink'} data={data}
                                        handleFunction={this.handlePDFDownload} /> : ''}

                            </span>
                            : <span title='Invoice Not Generated' className={'icon'}><BiCommentError style={{ color: 'var(--primary-color)', fontSize: '18px' }} /></span>} */}

                        <span title='Send Payment Reminder' className={'icon'} onClick={(e) => this.handleSendEmailPaymentReminder(row.original.email, row.original.amount, row.original.firstName, row.original.orderId, row.original.invoiceDate)} >
                            <MdOutlineScheduleSend style={{ color: 'var(--primary-color)', fontSize: '18px', cursor: 'pointer' }} />
                        </span>


                        <span id={row.original.orderId} className={'icon'} onClick={() => this.setState({ toDownload: row.original.orderId })} title={'Download CMR'}>
                            <MdOutlineSimCardDownload style={{ color: 'var(--primary-color)', fontSize: '18px' }} />
                            {toDownload !== '' && !document.querySelector(`#${this.state.toDownload} a`) && this.state.toDownload === row.original.orderId ?
                                <DownloadPDF document={<CMRGenerator invoice={data} />} fileName={'_CMR'} data={data}
                                    handleFunction={this.handlePDFDownload} /> : ''}
                        </span>

                        <span id={row.original.orderId} className={'icon'} onClick={() => this.setState({ toDownload: row.original.orderId })} title={'Download Label'} >
                            <MdOutlineSimCardDownload style={{ color: 'var(--primary-color)', fontSize: '18px' }} />
                            {this.state.toDownload !== '' && !document.querySelector(`#${this.state.toDownload} a`) && this.state.toDownload === row.original.orderId ?
                                <DownloadPDF document={<LabelGenerator labelData={row.original} />} fileName={'_Sticky_Label'} data={row.original}
                                    handleFunction={this.handlePDFDownload} /> : ''}
                        </span>
                        <span>
                            <MdOutlineComment style={{ color: 'var(--primary-color)', fontSize: '18px', cursor: 'pointer' }} onClick={()=>{this.setState({showCommentPopup: !this.state.showCommentPopup, activeRowData: data, secretComment: data.secretComment})}} />
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
            console.log('j');
            this.timeOut = setTimeout(() => {
                document.querySelector(`#${this.state.toDownload} a`).click()
                this.setState({ toDownload: '' })
                this.loadingCount = 0
            }, 300)
            this.setState({ isPdfGenerated: false })
        }
    }
    componentWillUnmount() {
        clearTimeout(this.timeOut)
    }
    UNSAFE_componentWillMount() {
        this.getOrderDetails(true)
    }

    handleDueDateCheck = (data) => {
        const orderIds = []
        data && data.map(item => {
            if (item.isInvoiceGenerated) {
                const splitted = item.dueDate ? item.dueDate.split('/') : []
                const dueDate = new Date(`${splitted[2]}-${splitted[1]}-${splitted[0]}`)
                const isValid = item.invoiceStatus && item.invoiceStatus.label === INVOICE_STATUS[0].label
                const isDateGreater = dueDate.getTime() <= new Date().getTime();
                if (isValid && isDateGreater) {
                    orderIds.push(item.orderId)
                }
            }

        })
        if (orderIds.length > 0) {
            axios.put(`${API_HOST}/api/orderDetails/dueDate/invoiceStatus`, { orderIds }, HEADERS)
                .then(() => {
                    this.getOrderDetails()
                }).catch((error) => {
                    console.log(error)
                })
        }
    }
    getOrderDetails = (updateInvoiceStatus, filterData) => {
        let url = `${API_HOST}/api/orderDetails?`;
        let page = this.page
        if (filterData) {
            const { inputValue, dropdownValue, invoiceStatus, orderStatus, } = filterData
            if (inputValue !== '') url = url + `inputValue=${inputValue}&dropdownValue=${dropdownValue.value}&`;
            if (invoiceStatus && invoiceStatus.label) url = url + `invoiceStatus=${invoiceStatus.label}$`;
            if (orderStatus && orderStatus.label) url = url + `orderStatus=${orderStatus.label}&`;
            page = filterData.page
        }
        url = url + `page=${page}`
        console.log(url);
        axios.get(url, HEADERS).then((res) => {
            if (res) {
                let tableData = []
                res.data && res.data[0] && res.data[0].data.map(item => {
                    tableData.push(this.getFormatedObj(item))
                })
                if (res.data && res.data[0] && res.data[0].metadata) {
                    this.page = res.data && res.data[0] && res.data[0].metadata[0] && res.data[0].metadata[0].page;
                    this.count = res.data && res.data[0] && res.data[0].metadata.count;
                }
                this.allTableData = tableData
                updateInvoiceStatus && this.handleDueDateCheck(tableData)
                this.setState({ tableData })
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    handleOrderStatus = (e, rowObj) => {
        axios.put(`${API_HOST}/api/orderDetails/orderStatus/${rowObj.orderId}`, { status: e }, HEADERS).then((res) => {
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

    // do not delete this Func.
    handleInvoiceStatus = (e, rowObj) => {
        if (JSON.stringify(e) === JSON.stringify(INVOICE_STATUS[INVOICE_STATUS.length - 2]) || JSON.stringify(rowObj.invoiceStatus) === JSON.stringify(INVOICE_STATUS[INVOICE_STATUS.length - 2])) {
            this.setState({ showPartlyPopup: true, partlyPopupDetails: rowObj })
        } else {
            this.updateInvoiceStatus(e, e.label === "Paid" ? rowObj.totalInvoiceAmount : 0, rowObj)
        }
    }
    updateInvoiceStatus = (invoiceStatus, partlyAmount, rowObj) => {
        axios.put(`${API_HOST}/api/orderDetails/invoiceStatus/${rowObj.orderId}`, { invoiceStatus, partlyAmount: parseFloat(partlyAmount) }, HEADERS).then((res) => {
            const item = res.data;
            const data = this.getFormatedObj(item)
            const index = this.state.tableData.indexOf(rowObj)
            let tableData = [...this.state.tableData]
            tableData[index] = data;
            this.allTableData = tableData
            this.setState({ tableData, showPartlyPopup: false, partlyPopupDetails: {}, partlyAmountError: '' })
        }).catch((error) => {
            console.log(error)
        })
    }

    handleSendEmailPaymentReminder = (email, amount, name, orderId) => {
        var re = /\S+@\S+\.\S+/;
        if (re.test(email)) {
            this.setState({ showLoader: true })
            axios.get(`${API_HOST}/api/emailTriggers/paymentReminder/email=${email.toLocaleLowerCase()}&amount=${amount}&name=${name}&orderId=${orderId}`).then((response) => {
                this.setState({ showSuccessPopup: true, isSuccess: true, successMsg: 'Reminder sent successfully', showLoader: false })
            }).catch((error) => {
                this.setState({ showSuccessPopup: true, isSuccess: false, errorMsg: 'Something went wrong!', showLoader: false })
            });
        } else {
            this.setState({ warningMsg: 'Please enter correct email format.' })
        }
    }

    handleGenerateInvoiceSwitch = (e, rowObj) => {
        const iDate = new Date(Date.now())
        const invoiceDate = e ? `${iDate.getDate()}/${(iDate.getMonth() + 1).toString().length == 1 ? '0' + (iDate.getMonth() + 1) : (iDate.getMonth() + 1)}/${iDate.getFullYear()}` : "-"

        const date14 = new Date(Date.now() + 12096e5)
        const dueDate = e ? `${date14.getDate()}/${(date14.getMonth() + 1).toString().length == 1 ? '0' + (date14.getMonth() + 1) : (date14.getMonth() + 1)}/${date14.getFullYear()}` : "-"
        axios.put(`${API_HOST}/api/orderDetails/invoiceGenerate/${rowObj.orderId}`, { isInvoiceGenerated: e, invoiceDate, dueDate }, {
            "headers": {
                "content-type": "application/json",
                Authorization: localStorage.getItem('token')
            }
        }).then((res) => {
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

    handleFilterApply = (filtered, filterData) => {
        // this.setState({ tableData: filtered })
        this.getOrderDetails(false, filterData)
    }
    handleFilterClear = () => {
        this.setState({ tableData: this.allTableData })
    }

    getFormatedObj = (item) => {
        return {
            ...item,
            date: getDD_MM_YYYY(new Date(item.createdAt)),
            amount: `${item.invoiceCurrency.symbol}${parseFloat((item.totalInvoiceAmount)).toFixed(2)}`,
            paid: `${item.invoiceCurrency.symbol}${item.partlyAmount || 0}`,
            owner: `${item.firstName} ${item.lastName}`,
        }
    }

    handleSubmitUpdate = (data) => {
        const tableData = this.state.tableData
        this.setState({ tableData: tableData && tableData.map(item => item._id === data._id ? this.getFormatedObj(data) : item) })
    }

    handlePartlyPopup = () => {
        const { partlyAmount, partlyPopupDetails } = this.state;
        // if (parseFloat(partlyAmount) < 0) {
        //     this.setState({ partlyAmountError: "Amount can't be less than zero." })
        // } else if (parseFloat(partlyAmount) > parseFloat(partlyPopupDetails.totalInvoiceAmount)) {
        //     this.setState({ partlyAmountError: "Amount can't be more than total invoice amount." })
        // } else if (parseFloat(partlyAmount) < parseFloat(partlyPopupDetails.totalInvoiceAmount)) {
        //     this.updateInvoiceStatus(INVOICE_STATUS[INVOICE_STATUS.length - 1], partlyAmount, partlyPopupDetails)
        // } else if (parseFloat(partlyAmount) === parseFloat(partlyPopupDetails.totalInvoiceAmount)) {
        //     this.updateInvoiceStatus(INVOICE_STATUS[1], partlyAmount, partlyPopupDetails)
        // }

        if (parseFloat(partlyAmount) < parseFloat(partlyPopupDetails.totalInvoiceAmount)) {
            this.updateInvoiceStatus(INVOICE_STATUS[INVOICE_STATUS.length - 2], partlyAmount, partlyPopupDetails)
        } else if (parseFloat(partlyAmount) >= parseFloat(partlyPopupDetails.totalInvoiceAmount)) {
            this.updateInvoiceStatus(INVOICE_STATUS[1], partlyAmount, partlyPopupDetails)
        }

    }
    handleCommentPopup=(secretComment)=>{
        console.log("s", secretComment);
        const {activeRowData} = this.state
        axios.put(`${API_HOST}/api/orderDetails/secretComment/${activeRowData.orderId}`, { secretComment }, HEADERS).then((res) => {
            const item = res.data;
            const data = this.getFormatedObj(item)
            const index = this.state.tableData.indexOf(activeRowData)
            let tableData = [...this.state.tableData]
            tableData[index] = data;
            this.allTableData = tableData
            this.setState({ tableData, showCommentPopup: false })
        }).catch((error) => {
            console.log(error)
        })
    }
    render() {
        const { tableData, viewNEditDetailsData, showViewNEditDetails, isSuccess, successMsg, errorMsg, showLoader, warningMsg, showSuccessPopup, showPartlyPopup, partlyAmount, partlyPopupDetails, partlyAmountError, showCommentPopup, secretComment } = this.state

        return (
            <div className={styles.ordersContainer}>
                <FilterComp
                    tableData={this.allTableData}
                    filterList={this.filterList}
                    invoiceStatusList={INVOICE_STATUS}
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
                    <OrderManagementForm viewNEditDetailsData={viewNEditDetailsData}
                        onClose={() => this.setState({ showViewNEditDetails: false })} isEditValid={true}
                        handleSubmitUpdate={this.handleSubmitUpdate} DROPDOWN_DATA={DROPDOWN_DATA} PARCELPOINT_DATA={PARCELPOINT_DATA} />} */}
                {showViewNEditDetails &&
                    <OrderFormPopup viewNEditDetailsData={viewNEditDetailsData}
                        onClose={() => this.setState({ showViewNEditDetails: false })} isEditValid={true}
                        handleSubmitUpdate={this.handleSubmitUpdate} DROPDOWN_DATA={DROPDOWN_DATA} PARCELPOINT_DATA={PARCELPOINT_DATA} isAdmin={true} />}
                {showSuccessPopup &&
                    <SuccessPopup
                        isSuccess={isSuccess}
                        successText={successMsg}
                        errorText={errorMsg}
                        onClick={() => this.setState({ showSuccessPopup: false, isSuccess: false })}
                    />}
                {showLoader && <div className={styles.loader}><Loader type="spinner-circle" bgColor={"#000"} title={"Sending..."} color={'#000'} size={80} /></div>}
                {showPartlyPopup && <div className={styles.partlyContainer}>
                    <div>
                        <div className={styles.pHeader}>
                            <h4>Partly Paid Cost</h4>
                        </div>
                        <div className={styles.pBody}>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>Total Amount: </td>
                                        <td>{partlyPopupDetails.invoiceCurrency.symbol}{partlyPopupDetails.totalInvoiceAmount || 0}</td>
                                    </tr>
                                    <tr>
                                        <td>Amount Paid: </td>
                                        <td>{partlyPopupDetails.invoiceCurrency.symbol}{partlyPopupDetails.partlyAmount || 0}</td>
                                    </tr>
                                    <tr>
                                        <td>Remaining: </td>
                                        <td>{partlyPopupDetails.invoiceCurrency.symbol}{(partlyPopupDetails.totalInvoiceAmount - partlyPopupDetails.partlyAmount).toFixed(2) || 0}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <Input
                                type={'number'}
                                label={'Paid (previous pay + current pay)'}
                                placeholder={'Amount'}
                                value={partlyAmount}
                                onChange={(e, value) => {
                                    this.setState({ partlyAmount: value })
                                }}
                            />
                            <div className={styles.partlyAmountError}>{partlyAmountError}</div>
                        </div>
                        <div className={styles.pFooter}>
                            <Button text='Cancel' classes={'secondary sm'} onClick={() => this.setState({ showPartlyPopup: false })} />
                            <Button text='Update' classes={'primary sm'} onClick={this.handlePartlyPopup} />
                        </div>
                    </div>
                </div>}
                {showCommentPopup &&
                    <SecretCommentPopup
                        secretComment={secretComment}
                        onClose={() => this.setState({ showCommentPopup: false })}
                        handleCommentPopup={this.handleCommentPopup} 
                        />
                }
            </div>


        );
    }
}

export default OrderManagement;