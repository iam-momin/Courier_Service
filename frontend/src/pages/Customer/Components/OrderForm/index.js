import axios from 'axios';
import { parseInt } from 'lodash';
import React, { Component } from 'react';
import Resizer from "react-image-file-resizer";
import { withRouter } from 'react-router';
import Button from '../../../../components/Button';
import { CalculatorComp } from '../../../../components/CalculatorComp';
import { OrderFormComp } from '../../../../components/OrderFormComp';
import SuccessPopup from '../../../../components/SuccessPopup';
import { API_HOST, CALCULATE, CONVERT_ORDER_TO_CMR, GET_VOLUME, HEADERS, INVOICE_STATUS, ORDER_DETAILS_OBJ, ORDER_STATUS, PARCELPOINT_DATA, SORT_OBJ } from '../../../../constants';
// import Calculator from '../Calculator';
import styles from './styles.module.css';


class OrderForm extends Component {
    constructor(props) {
        super(props)
        const { userInfo } = props
        this.state = {
            firstName: userInfo && userInfo.firstname || '',
            lastName: userInfo && userInfo.lastname || '',
            email: userInfo && userInfo.email || '',
            collectionAddress1: userInfo && userInfo.address1 || '',
            collectionAddress2: userInfo && userInfo.address2 || '',
            collectionCity: userInfo && userInfo.city || '',
            collectionZipCode: userInfo && userInfo.postalCode || '',
            senderName: userInfo && userInfo.name || '',
            senderPhone: userInfo && [userInfo.phoneNo] || [''],
            deliveryAddress1: '',
            deliveryAddress2: '',
            deliveryCity: '',
            deliveryZipCode: '',
            receiverName: '',
            receiverPhone: [''],
            preferredDate: '',
            insuranceRequired: 'No',
            additionalServices: [
                { id: 1, label: 'TOP parcel', isChecked: false, cost: 0 },
                { id: 2, label: 'Packing', isChecked: false, cost: 0 },
                { id: 3, label: 'Photo on delivery', isChecked: false, cost: 0 },
                { id: 4, label: 'Signature on delivery', isChecked: false, cost: 0 },
                { id: 5, label: 'Cash payments on collection/delivery', isChecked: false, cost: 0 },
                { id: 6, label: 'Invoice for a company', isChecked: false, cost: 0 },
                { id: 7, label: 'ID check on delivery', isChecked: false, cost: 0 }],
            submitRes: {},
            companyDetails: '',
            insuranceDetails: [{}],
            totalAmount: '',
            insuranceTotalValue: 0,
            insurancePremium: 0,
            parcelImages: [],
            fromParcelPointList: [],
            toParcelPointList: [],
            fromParcelPoint: {},
            toParcelPoint: {},
            showCollectionAddress: true,
            showReceiverAddress: true,
            showAddionalDropdown: false,
            invoiceStatus: INVOICE_STATUS[0],
            // calculator
            parcelDetailsList: [],
            weight: '',
            volume: '',
            length: '',
            width: '',
            height: '',
            inputValues: { weight: 0, volume: 0, length: 0, width: 0, height: 0, isChecked: false },
            totals: { weight: 0, volume: 0, length: 0, width: 0, height: 0 },
            isEditing: false,
            from: userInfo && userInfo.country || '',
            to: '',
            expectedCost: 0,
            fromOptions: [],
            toOptions: [],
            invoiceCurrency: userInfo && userInfo.preferredCurrency || { currency: "EUR", iso: "EU", symbol: "€", baseVal: 1.17 },
            // invoiceCurrency: { currency: "EUR", iso: "EU", symbol: "€", baseVal: 1.17 },
            numberOfParcel: 0,
            fromParcelPointRadio: 1,
            toParcelPointRadio: 1,
            showSuccessPopup: false,
            isSuccess: false,
            declaration: false,
            parcelPdf: {},
            totalInvoiceAmount: 0,
            cashPaymentOn: null,
            instructionsForCashHandling: ''
        }
        this.currency = [{ currency: "EUR", iso: "EU", symbol: "€", baseVal: 1.17 },
        { currency: "GBP", iso: "UK", symbol: "£", baseVal: 0.85 },]//1
        this.AddressOrParcelPoint = [{ label: 'Address', id: 0 }, { label: 'Parcel Point', id: 1 }]

        this.editingItem = { weight: 0, height: 0, width: 0, length: 0, height: 0 }
        this.dropdownData = []
        this.insuranceRequiredList = [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]
        this.signPad = ''
        this.currentDate = `${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`
        this.parcelPointData = []
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { userInfo, DROPDOWN_DATA, PARCELPOINT_DATA } = nextProps
        const { invoiceCurrency } = this.state
        if (JSON.stringify(userInfo) !== JSON.stringify(this.props.userInfo) && userInfo) {
            if (PARCELPOINT_DATA) {
                const invoiceCurrency = userInfo.preferredCurrency
                this.parcelPointData = PARCELPOINT_DATA && PARCELPOINT_DATA.map(point => {
                    const baseValue = invoiceCurrency.currency === point.currency ? 1 : invoiceCurrency.baseVal
                    return { ...point, label: `${point.parcelPoint.toUpperCase()} - ${invoiceCurrency.symbol}${(point.cost * baseValue).toFixed(2)}`, value: point._id };
                })
            }
            this.setState({
                firstName: userInfo.firstname || '',
                lastName: userInfo.lastname || '',
                email: userInfo.email,
                collectionAddress1: userInfo.address1,
                collectionAddress2: userInfo.address2,
                collectionCity: userInfo.city,
                collectionZipCode: userInfo.postalCode,
                senderName: userInfo.name,
                senderPhone: [userInfo.phoneNo],
                invoiceCurrency: userInfo.preferredCurrency,
                from: userInfo.country,
            })
            this.handleFromDropdown(userInfo.country)
        }

        if (JSON.stringify(DROPDOWN_DATA) !== JSON.stringify(this.props.DROPDOWN_DATA) && DROPDOWN_DATA) {
            this.dropdownData = DROPDOWN_DATA
            let dropdownData = DROPDOWN_DATA.map(item => {
                return { label: item.from.toUpperCase(), value: item.from }
            })
            this.setState({ fromOptions: dropdownData, toOptions: dropdownData })
        }

        if (JSON.stringify(PARCELPOINT_DATA) !== JSON.stringify(this.props.PARCELPOINT_DATA) && PARCELPOINT_DATA) {
            this.parcelPointData = PARCELPOINT_DATA && PARCELPOINT_DATA.map(point => {
                const baseValue = invoiceCurrency.currency === point.currency ? 1 : invoiceCurrency.baseVal
                return { ...point, label: `${point.parcelPoint.toUpperCase()} - ${invoiceCurrency.symbol}${(point.cost * baseValue).toFixed(2)}`, value: point._id };
            })
            // this.handleParcelPointCurrency(invoiceCurrency)
        }
    }

    componentDidMount() {
        const { DROPDOWN_DATA, PARCELPOINT_DATA, history } = this.props
        const { invoiceCurrency, from } = this.state
        this.dropdownData = DROPDOWN_DATA
        let dropdownData = DROPDOWN_DATA.map(item => {
            return { label: item.from.toUpperCase(), value: item.from }
        })
        if (history.location.state && history.location.state.firstName) {
            this.parcelPointData = PARCELPOINT_DATA
            this.setState((ORDER_DETAILS_OBJ({ viewNEditDetailsData: history.location.state })),
                () => this.setState({ fromOptions: dropdownData, toOptions: dropdownData, fromParcelPointList: this.getParcelPointList(this.state.from), toParcelPointList: this.getParcelPointList(this.state.to) }))
            this.calculateTotal()
            history.push({ state: null })

        } else {
            this.setState({ fromOptions: dropdownData, toOptions: dropdownData, },
                () => {
                    this.handleParcelPointCurrency(invoiceCurrency);
                    this.handleFromDropdown(from)
                })

            this.parcelPointData = PARCELPOINT_DATA
        }

    }

    calculateTotal = () => {
        const { parcelDetailsList } = this.props.history.location.state || {}
        let weight = 0, volume = 0;
        parcelDetailsList && parcelDetailsList.map(item => {
            weight += parseFloat(item.weight);
            volume += GET_VOLUME(item.length, item.width, item.height)
        })
        console.log(parcelDetailsList, weight, volume);
        this.setState({ totals: { weight, volume } }, this.handleCalculate)
    }

    handleAddItem = () => {
        const { totals, inputValues, isEditing } = this.state
        let { weight, length, width, height } = inputValues;
        let parcelDetailsList = this.state.parcelDetailsList.slice()
        let newTotals = 0;
        weight = parseFloat(weight);
        length = parseFloat(length);
        width = parseFloat(width);
        height = parseFloat(height);
        if (isEditing) {
            let volume = GET_VOLUME(length, width, height) - GET_VOLUME(this.editingItem.length, this.editingItem.width, this.editingItem.height);
            let newInputValues = { ...inputValues, volume: GET_VOLUME(length, width, height) }
            weight -= this.editingItem.weight;
            length -= this.editingItem.length;
            width -= this.editingItem.width;
            height -= this.editingItem.height;
            newTotals = {
                weight: totals.weight + weight, volume: parseFloat(totals.volume) + parseFloat(volume),
                length: totals.length + length, width: totals.width + width,
                height: totals.height + height,
            }
            parcelDetailsList.unshift({ ...newInputValues, id: Math.random() * 1000000 })
        } else {
            let volume = GET_VOLUME(length, width, height)
            newTotals = {
                weight: totals.weight + weight, volume: parseFloat(totals.volume) + parseFloat(volume),
                length: totals.length + length, width: totals.width + width,
                height: totals.height + height,
            }
            parcelDetailsList.unshift({ ...inputValues, volume, id: Math.random() * 1000000 })
        }

        this.setState({
            parcelDetailsList, totals: newTotals, isEditing: false,
            inputValues: { weight: '', volume: '', length: '', width: '', height: '', isChecked: false }
        }, this.handleCalculate)
        document.getElementById('parcelDetails').setAttribute('style', 'box-shadow: none')

    }
    handleDelete = (targetIndex) => {
        let parcelDetailsList = this.state.parcelDetailsList.slice()
        let { weight, length, width, height, volume } = parcelDetailsList[targetIndex]
        let { totals } = this.state
        weight = totals.weight - weight
        length = totals.length - length
        width = totals.width - width
        height = totals.height - height
        volume = totals.volume - volume

        parcelDetailsList.splice(targetIndex, 1)
        this.setState({ parcelDetailsList, totals: { weight, length, width, height, volume } }, this.handleCalculate)
    }


    handleEdit = (item) => {
        const { weight, length, width, height } = item
        this.editingItem = { weight: parseFloat(weight), length: parseFloat(length), width: parseFloat(width), height: parseFloat(height) }
        let list = this.state.parcelDetailsList
        list.splice(list.indexOf(item), 1)
        this.setState({ inputValues: { ...item, volume: '' }, isEditing: true, parcelDetailsList: list })
    }

    isAllFieldsFilled = () => {
        const { inputValues } = this.state
        const { weight, length, width, height } = inputValues
        return weight == 0 || length == 0 || width == 0 || height == 0
    }

    handleCalculate = () => {
        this.setState({ expectedCost: CALCULATE(this.state) + this.getParcelPointCost('collection') + this.getParcelPointCost('receiver') }, this.handleTotalInvoiceAmount)

    }
    handleTotalInvoiceAmount = () => {
        const { expectedCost, insurancePremium, extraCost } = this.state
        this.setState({ totalInvoiceAmount: (parseFloat(expectedCost) + parseFloat(insurancePremium)).toFixed(2) })
    }

    isAnythingEmpty = () => {
        const { totals, from, to } = this.state
        return totals.weight == 0 || totals.volume == 0 || from == '' || to == ''
    }

    handleFromDropdown = (e, val) => {
        let toOptions = [], currency = {}
        this.dropdownData && this.dropdownData.map(item => {
            if (item.from && item.from.toLowerCase() === e.value.toLowerCase()) {
                const toObj = SORT_OBJ(item.to)
                let keys = Object.keys(toObj)
                if (keys) {
                    toOptions = keys && keys.map(key => {
                        return { label: key.toUpperCase(), value: key }
                    })
                }
            }
        })
        // if (e.label === "UK" || e.label === "UNITED KINGDOM") {
        //     this.currency = [{ currency: "GBP", iso: "UK", symbol: "£", baseVal: 1 },//0.85
        //     { currency: "EUR", iso: "EU", symbol: "€", baseVal: 1.17 }]//1

        //     this.setState({ currency: { currency: "GBP", iso: "UK", symbol: "£", baseVal: 1 } })
        // }
        // else {
        //     this.currency = [{ currency: "GBP", iso: "UK", symbol: "£", baseVal: 0.85 },//0.85
        //     { currency: "EUR", iso: "EU", symbol: "€", baseVal: 1 }]//1

        //     this.setState({ currency: { currency: "EUR", iso: "EU", symbol: "€", baseVal: 1 } })
        // }
        document.getElementsByClassName('deliveryCountryDropdown')[0].setAttribute('style', 'border: 1px solid red')
        this.setState({ from: e, to: '', toOptions, expectedCost: 0, fromParcelPointList: this.getParcelPointList(e), fromParcelPoint: {} }, this.handleCalculate)
    }
    handleToDropdown = (e, val) => {
        let fromOptions = []
        this.dropdownData && this.dropdownData.map(item => {
            if (item.from === e.label) {
                let keys = Object.keys(item.to)
                if (keys) {
                    fromOptions = keys && keys.map(key => {
                        return { label: key.toUpperCase(), value: key }
                    })
                }
            }
        })
        document.getElementsByClassName('deliveryCountryDropdown')[0].setAttribute('style', 'border: none')
        this.setState({ to: e, expectedCost: 0, toParcelPointList: this.getParcelPointList(e), toParcelPoint: {} }, this.handleCalculate)
    }
    getParcelPointList = (obj) => {
        let parcelPointList = []
        this.parcelPointData && this.parcelPointData.map(item => {
            if (item.country.toLowerCase() === (obj && obj.label.toLowerCase())) {
                parcelPointList.push(item)
            }
        })
        return parcelPointList;
    }
    getObjectIndex = (array, object, value) => {
        let index = -1
        array && array.map((item, i) => {
            if (item[value] === object[value]) {
                index = i
            }
        })
        return index
    }

    handleInvoiceCurrency = (item) => {
        this.handleParcelPointCurrency(item)
        this.handleInsuranceCurrency(item)
        this.setState({ invoiceCurrency: item, currency: item, }, this.handleCalculate)
    }
    handleSubmit = () => {
        let { firstName, lastName, email, senderPhone, collectionAddress1, collectionAddress2, collectionCity, collectionZipCode,
            deliveryAddress1, deliveryAddress2, deliveryCity, deliveryZipCode, receiverName, receiverPhone,
            numberOfParcel, parcelDetailsList, totals, from, to, preferredDate, invoiceCurrency, invoiceStatus,
            companyDetails, additionalServices, insuranceRequired, insuranceDetails, parcelImages, expectedCost,
            senderName, insuranceTotalValue, insurancePremium, fromParcelPoint, toParcelPoint, fromParcelPointRadio,
            toParcelPointRadio, totalInvoiceAmount, parcelPdf, collectionInstructions, deliveryInstructions, otherInformations } = this.state
        const isCashPaymentSelected = additionalServices.find(item => item.id === 5 && item.isChecked)
        const cashPaymentOn = isCashPaymentSelected ? this.state.cashPaymentOn : null
        const instructionsForCashHandling = isCashPaymentSelected ? this.state.instructionsForCashHandling : ''
        let insuranceDetail = {}, additionalObj = {}, collectionAddress = { fromParcelPoint }, receiverAddress = { toParcelPoint }, parcelPointObj = {}

        if (this.handleValidation()) {
            this.setState({ submitRes: { status: 400, data: { message: "Required fields can't be empty." } } })
            return
        }
        if (insuranceRequired === 'Yes') {
            if (insuranceDetails && insuranceDetails.length == 0) {
                this.setState({ submitRes: { status: 400, data: { message: "Please add parcel details..." } } })
                return
            }
            insuranceDetail = { insuranceDetails }
        }

        if (additionalServices && additionalServices[5] && additionalServices[5].isChecked) {
            if (companyDetails === '') {
                this.setState({ submitRes: { status: 400, data: { message: "Please add company details" } } })
                return
            }
            additionalObj = { companyDetails }
        }
        if (this.state.showCollectionAddress) {
            collectionAddress = { collectionAddress1, collectionAddress2, collectionCity, collectionZipCode, fromParcelPoint }
        }
        if (this.state.showReceiverAddress) {
            receiverAddress = { deliveryAddress1, deliveryAddress2, deliveryCity, deliveryZipCode, toParcelPoint }
        }

        let params = {
            customerId: "localStorage.getItem('token')", firstName, lastName, email, ...collectionAddress, ...receiverAddress,
            receiverName, receiverPhone, numberOfParcel, parcelDetailsList, allParcelDetailsSum: totals,
            fromCountry: from, toCountry: to, preferredDate, invoiceCurrency, ...additionalObj, ...insuranceDetail,
            additionalServices, insuranceRequired: insuranceRequired, parcelImages, status: ORDER_STATUS[0],
            expectedCost, senderName, senderPhone, insuranceTotalValue, insurancePremium, invoiceStatus, ...parcelPointObj,
            claimStatus: { label: 'Unclaimed', value: 'Unclaimed', color: '' }, claimDetails: {}, fromParcelPointRadio, toParcelPointRadio, totalInvoiceAmount, parcelPdf,
            collectionInstructions, deliveryInstructions, otherInformations, cashPaymentOn, instructionsForCashHandling
        }

        // var fortnightAway = new Date(Date. now() + 12096e5)

        axios.post(`${API_HOST}/api/orderDetails`, params, HEADERS).then((res) => {
            if (res) {
                if (res && res.status === 200 && res.status
                    && from.value.toLowerCase() === 'united kingdom'
                    || to.value.toLowerCase() === 'united kingdom') {
                    this.postCustomInvoice(res.data.orderId, params.status)
                }
                this.postCmr({ ...params, orderId: res.data.orderId })
                this.setState({ submitRes: res, showSuccessPopup: true, isSuccess: true })
            }
        }).catch((error) => {
            this.setState({ submitRes: error.response, showSuccessPopup: true, isSuccess: false })
        })
    }


    getTotalValueFroInsurance = () => {
        const { insuranceDetails, insuranceRequired } = this.state
        let total = 0;
        insuranceDetails && insuranceDetails.map(item => {
            if (item.amount)
                total += parseInt(item.amount)
        })
        this.setState({ insuranceTotalValue: total, insurancePremium: insuranceRequired === "Yes" ? (((1 / 100) * total).toFixed(2) > 1 ? ((1 / 100) * total).toFixed(2) : 1) : 0 }, this.handleTotalInvoiceAmount)
    }
    handleParcelImages = (e) => {
        const { parcelImages } = this.state
        let files = e.target.files
        if (files && (files.length + parcelImages.length) > 3) {
            alert(`Cannot upload more than 3 images!`)
            return
        }
        for (let i = 0; i < (files && files.length); i++) {
            if (files[i])
                try {
                    Resizer.imageFileResizer(
                        e.target.files[i],
                        400,
                        400,
                        "JPEG",
                        20,
                        0,
                        (uri) => {
                            this.setState({ parcelImages: [...this.state.parcelImages, { file: files[i], data: uri }] })
                        },
                        "base64",
                        200,
                        200
                    );
                } catch (err) {
                    console.log(err);
                }
        }


        // this.setState({parcelImages: [...this.state.parcelImages, ...e]})
    }

    handleValidation = () => {
        const { showCollectionAddress, showReceiverAddress, to, from, additionalServices, fromParcelPoint, toParcelPoint, insuranceRequired, insuranceDetails, declaration, cashPaymentOn } = this.state
        const isCashOnDelevery = additionalServices.find(item => item.id === 5 && item.isChecked)
        const validationList = [
            { id: 'firstName', isRequired: true },
            { id: 'lastName', isRequired: true },
            { id: 'invoiceMail', isRequired: true, isEmail: true },
            { id: 'collectionCountryDropdown', isRequired: true, stateName: from },
            { id: 'collectionAddress1', isRequired: showCollectionAddress, min: 3 },
            { id: 'collectionCity', isRequired: showCollectionAddress },
            { id: 'collectionPostalCode', isRequired: (showCollectionAddress && (from && from.label && from.label.toLowerCase() === 'united kingdom')) },
            { id: 'sendersPhoneNo', isRequired: true },
            { id: 'sendersName', isRequired: true, min: 3 },
            { id: 'deliveryCountryDropdown', isRequired: true, stateName: to },
            { id: 'receiverAddress1', isRequired: showReceiverAddress, min: 3 },
            { id: 'receiverCity', isRequired: showReceiverAddress },
            { id: 'receiverPostalCode', isRequired: (showReceiverAddress && (to && to.label && to.label.toLowerCase() === 'united kingdom')) },
            { id: 'receiversPhoneNo', isRequired: true },
            { id: 'receiversName', isRequired: true },
            { id: 'numberOfParcels', isRequired: false },
            { id: 'companyDetails', isRequired: additionalServices && additionalServices[5] && additionalServices[5].isChecked },
            { id: 'declaration', isRequired: true, stateName: declaration ? 'a' : '' },
            { id: 'cashPaymentRadioBtn', isRequired: isCashOnDelevery && !cashPaymentOn, stateName: cashPaymentOn ? cashPaymentOn : '' },

        ]
        let isEmpty = false
        validationList.map(item => {
            var re = /\S+@\S+\.\S+/;
            if ((item.stateName === '') || (document.getElementById(item.id) && document.getElementById(item.id).value === '') || (item.isEmail && !re.test(document.getElementById(item.id).value))) {
                if (item.isRequired) {
                    if (item.id, document.getElementById(item.id)) {
                        document.getElementById(item.id).setAttribute('style', 'border: 1px solid red')
                    } else if (document.getElementsByClassName(item.id).length > 0) {
                        document.getElementsByClassName(item.id)[0].setAttribute('style', 'border: 1px solid red')
                    }
                    isEmpty = true
                }
            } else {
                if (document.getElementById(item.id)) {
                    document.getElementById(item.id).setAttribute('style', 'border: none')
                } else if (document.getElementsByClassName(item.id).length > 0) {
                    document.getElementsByClassName(item.id)[0].setAttribute('style', 'border: none')
                }
            }
        })
        if (insuranceRequired === 'Yes')
            insuranceDetails && insuranceDetails.length > 0 && insuranceDetails.map((item2, i) => {
                (!item2.itemDescription || item2.itemDescription === '') ?
                    document.getElementById(`description${i}`).setAttribute('style', 'box-shadow: 0 0 2px 1px red')
                    : document.getElementById(`description${i}`).setAttribute('style', 'box-shadow: 0 0 2px 0px #212224')
                !item2.amount ?
                    document.getElementById(`amount${i}`).setAttribute('style', 'box-shadow: 0 0 2px 1px red')
                    : document.getElementById(`amount${i}`).setAttribute('style', 'box-shadow: 0 0 2px 0px #212224')

                if ((!item2.itemDescription || item2.itemDescription === '') || !item2.amount) {
                    isEmpty = true
                }

            })
        return isEmpty

    }

    handleParcelPointCurrency = (item) => {
        const { fromParcelPointList, toParcelPointList, fromParcelPoint, toParcelPoint } = this.state
        const { PARCELPOINT_DATA } = this.props
        this.parcelPointData = PARCELPOINT_DATA && PARCELPOINT_DATA.map(point => {
            const baseValue = item.currency === point.currency ? 1 : item.baseVal
            return { ...point, label: `${point.parcelPoint.toUpperCase()} - ${item.symbol}${(point.cost * baseValue).toFixed(2)}`, value: point._id };
        })
        const frombaseValue = item.currency === fromParcelPoint.currency ? 1 : item.baseVal
        const tobaseValue = item.currency === toParcelPoint.currency ? 1 : item.baseVal
        const tempFromParcelPoint = fromParcelPointList && fromParcelPointList.map(point => {
            const baseValue = item.currency === point.currency ? 1 : item.baseVal
            return { ...point, label: `${point.parcelPoint.toUpperCase()} - ${item.symbol}${(point.cost * baseValue).toFixed(2)}`, value: point._id };
        })
        const tempToParcelPoint = toParcelPointList && toParcelPointList.map(point => {
            const baseValue = item.currency === point.currency ? 1 : item.baseVal
            return { ...point, label: `${point.parcelPoint.toUpperCase()} - ${item.symbol}${(point.cost * baseValue).toFixed(2)}`, value: point._id };
        })
        const from = fromParcelPoint.label ? { ...fromParcelPoint, label: `${fromParcelPoint.parcelPoint.toUpperCase()} - ${fromParcelPoint.symbol}${(fromParcelPoint.cost * frombaseValue).toFixed(2)}`, value: fromParcelPoint._id } : {};
        const to = toParcelPoint.label ? { ...toParcelPoint, label: `${toParcelPoint.parcelPoint.toUpperCase()} - ${toParcelPoint.symbol}${(toParcelPoint.cost * tobaseValue).toFixed(2)}`, value: toParcelPoint._id } : {};
        this.setState({ fromParcelPointList: tempFromParcelPoint, toParcelPointList: tempToParcelPoint, fromParcelPoint: from, toParcelPoint: to })
    }
    handleInsuranceCurrency = (currency) => {
        const { insuranceDetails } = this.state
        let newInsuranceDetails = []
        insuranceDetails && insuranceDetails.map(item => {
            newInsuranceDetails.push(item.amount ? { ...item, amount: (parseFloat(item.amount) * parseFloat(currency.baseVal)).toFixed(2) } : item)
        })
        this.setState({ insuranceDetails: newInsuranceDetails }, this.getTotalValueFroInsurance)
    }
    postCustomInvoice = (orderId, status) => {
        const { email, senderName, receiverName, numberOfParcel, totals, insuranceTotalValue, invoiceCurrency,
            collectionAddress1, collectionAddress2, collectionCity, collectionZipCode, insuranceRequired,
            deliveryAddress1, deliveryAddress2, deliveryCity, deliveryZipCode } = this.state

        let senderAddress = '';
        let receiverAddress = '';
        // let signatureDataArray = ' ';
        if (collectionAddress1 !== '') {
            senderAddress = `${collectionAddress1}, ${collectionAddress2}, ${collectionCity} - ${collectionZipCode}`
        } if (deliveryAddress1 !== '') {
            receiverAddress = `${deliveryAddress1}, ${deliveryAddress2}, ${deliveryCity} -  ${deliveryZipCode}`
        }
        const payload = {
            email, senderName, receiverName, senderAddress, receiverAddress, content: {}, numberOfParcels: numberOfParcel,
            originOfGoods: {}, insuredFor: insuranceRequired === 'Yes' ? insuranceTotalValue : 0, totalWeight: totals.weight, contents: [],
            totalValueOfGoods: 0, orderId, currency: invoiceCurrency, status
        }
        axios.post(`${API_HOST}/api/customInvoice`, payload, HEADERS).then((res) => {
            if (res) {
                this.props.history.push({ pathname: '/customer/commercial', state: { showCommercialFormPopup: true } })
            }
        }).catch((error) => {
            // this.setState({ submitRes: error.response })
        })

    }
    postCmr = (orderData) => {
        const payload = CONVERT_ORDER_TO_CMR(orderData)
        axios.post(`${API_HOST}/api/cmr`, payload, HEADERS).then((res) => {

        })
    }
    handleParcelPointRadio = (key, val) => {
        switch (key) {
            case 'collection':
                this.setState({ fromParcelPointRadio: val })
                break
            case 'receiver':
                this.setState({ toParcelPointRadio: val })
                break;
            default:
                break;
        }
    }
    getParcelPointCost = (key) => {
        const { to, from, showCollectionAddress, showReceiverAddress, numberOfParcel } = this.state
        let country = {}, costIsNotValid = false
        switch (key) {
            case 'collection':
                country = from;
                costIsNotValid = showCollectionAddress
                break
            case 'receiver':
                country = to;
                costIsNotValid = showReceiverAddress
                break;
            default:
                break;
        }
        const value = country.value && country.value.toLowerCase()
        if (!costIsNotValid && (value === 'united kingdom' || value === 'uk') || value === 'germany') {
            return parseInt(numberOfParcel)

        } else {
            return 0
        }

    }
    handletopParcelCheck = (e, isChecked, index) => {
        let parcelDetailsList = [...this.state.parcelDetailsList]
        parcelDetailsList[index].isChecked = isChecked
        this.setState({ parcelDetailsList }, this.handleCalculate)
    }
    handleSetInputValues = (val, item) => {
        this.setState({ inputValues: { ...this.state.inputValues, [item.accesor]: val } })
    }
    handleFromParcelPoint = (e) => {
        this.setState({ fromParcelPoint: e }, this.handleCalculate)
    }
    handleToParcelPoint = (e) => {
        this.setState({ toParcelPoint: e }, this.handleCalculate)
    }
    handleStateUpdate = (stateObj, func) => {
        this.setState(stateObj, () => { func && func() })
    }
    handleDecleration = (e) => {
        this.setState({ declaration: e.target.checked })
    }
    handlePDFUpload = (event) => {
        let selectedFile = event.target.files;
        console.log(selectedFile[0].size);
        if (selectedFile[0].size > 500000) {
            alert('File size must be less than 500KB')
            return false
        }
        let file = null;
        let fileName = "";
        if (selectedFile.length > 0) {
            let fileToLoad = selectedFile[0];
            fileName = fileToLoad.name;
            let fileReader = new FileReader();
            fileReader.onload = (fileLoadedEvent) => {
                file = fileLoadedEvent.target.result;
                this.setState({
                    parcelPdf: {
                        fileData: file,
                        fileName: fileName
                    }
                })
            };
            fileReader.readAsDataURL(fileToLoad);
        }


    }
    render() {
        const { firstName, lastName, email, collectionAddress1, collectionAddress2, collectionZipCode, deliveryAddress1, deliveryAddress2, collectionCity, deliveryCity, deliveryZipCode, senderName, senderPhone,
            parcelDetailsList, totals, expectedCost, fromOptions, toOptions, from, to, currency, numberOfParcel, receiverName, receiverPhone, invoiceCurrency, preferredDate, insuranceRequired, additionalServices,
            submitRes, companyDetails, itemDescription, amount, quantity, insuranceDetails, totalAmount, showAddionalDropdown, insuranceTotalValue, parcelImages, toParcelPoint, fromParcelPoint, insurancePremium,
            showReceiverAddress, showCollectionAddress, showSuccessPopup, isSuccess, totalInvoiceAmount } = this.state

        return (
            <div className={styles.orderForm}>
                <div className={styles.formContainer}>
                    <div>
                        <div>
                            <OrderFormComp state={this.state}
                                handleFromDropdown={this.handleFromDropdown}
                                handleToDropdown={this.handleToDropdown}
                                handleStateUpdate={this.handleStateUpdate}
                                handleInvoiceCurrency={this.handleInvoiceCurrency}
                                handleParcelImages={this.handleParcelImages}
                                handleParcelPointRadio={this.handleParcelPointRadio}
                                getTotalValueFroInsurance={this.getTotalValueFroInsurance}
                                handlePDFUpload={this.handlePDFUpload} />
                        </div>

                        <CalculatorComp parcelDetailsList={parcelDetailsList} totals={totals} showCollectionAddress={showCollectionAddress} showReceiverAddress={showReceiverAddress} inputValues={this.state.inputValues}
                            fromParcelPoint={fromParcelPoint} toParcelPoint={toParcelPoint} currency={currency} expectedCost={expectedCost} insuranceRequired={insuranceRequired} insurancePremium={insurancePremium}
                            fromParcelPointList={this.state.fromParcelPointList} toParcelPointList={this.state.toParcelPointList} invoiceCurrency={invoiceCurrency} totalInvoiceAmount={totalInvoiceAmount}
                            isAllFieldsFilled={this.isAllFieldsFilled} handleAddItem={this.handleAddItem} handleDelete={this.handleDelete} handleSetInputValues={this.handleSetInputValues}
                            handleEdit={this.handleEdit} handletopParcelCheck={this.handletopParcelCheck} getParcelPointCost={this.getParcelPointCost} handleCalculate={this.handleCalculate}
                            handleFromParcelPoint={this.handleFromParcelPoint} handleToParcelPoint={this.handleToParcelPoint} handleDecleration={this.handleDecleration} isNewForm={true} />

                        <div className={styles.submitBtn}>
                            <Button text={'Submit'} classes={'primary'} onClick={() => { this.handleSubmit() }} />
                            {submitRes && submitRes.status &&
                                <span className={styles.submitMsg} style={{ color: submitRes.status === 200 ? '#04d979' : '#CC3333', fontSize: submitRes.status === 200 ? '18px' : '16px', fontWeight: submitRes.status === 200 ? '600' : '500' }}>
                                    {submitRes.data.message || ''}</span>}
                        </div>
                    </div>
                </div>
                {showSuccessPopup &&
                    <SuccessPopup
                        isSuccess={isSuccess}
                        successText={'Order placed successful'}
                        errorText={'Failed please try again'}
                        onClick={() => this.setState({ showSuccessPopup: false, isSuccess: true })}
                    />
                }
            </div>
        );
    }
}

export default withRouter(OrderForm);
