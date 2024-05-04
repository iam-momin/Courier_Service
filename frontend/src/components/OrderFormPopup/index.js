import axios from 'axios';
import React, { Component } from 'react';
import FileResizer from 'react-image-file-resizer';
import { API_HOST, CALCULATE, GET_VOLUME, HEADERS, ORDER_DETAILS_OBJ, SORT_OBJ } from '../../constants';
import Button from '../Button';
import { CalculatorComp } from '../CalculatorComp';
import ConfirmationPopup from '../ConfirmationPopup';
import { OrderFormComp } from '../OrderFormComp';
import SuccessPopup from '../SuccessPopup';
import ImageViewer from 'react-simple-image-viewer';
import styles from './styles.module.css'
import { withRouter } from 'react-router';

class OrderFormPopup extends Component {
    constructor(props) {
        super(props)

        const viewNEditDetailsData = props.viewNEditDetailsData || {}
        this.state = {
            isReadOnly: true,
            ...ORDER_DETAILS_OBJ(props),
            fromOptions: [],
            toOptions: [],
            invoiceStatus: viewNEditDetailsData.invoiceStatus,
            isEditValid: props.isEditValid,
            isReadOnly: true,
            showSuccessPopup: false,
            isSuccess: false,
            showImageViewer: false,
            currentImage: 0,
            addServicesCost: 0
        }

        this.editingItem = { weight: 0, height: 0, width: 0, length: 0, height: 0 }
        this.dropdownData = []
        this.signPad = ''
        this.currentDate = `${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`
        this.parcelPointData = []
    }

    componentDidMount() {
        const { DROPDOWN_DATA, PARCELPOINT_DATA, viewNEditDetailsData } = this.props
        this.dropdownData = DROPDOWN_DATA
        let dropdownData = DROPDOWN_DATA && DROPDOWN_DATA.map(item => {
            return { label: item.from.toUpperCase(), value: item.from }
        })
        this.setState({ fromOptions: dropdownData, toOptions: dropdownData })
        const invoiceCurrency = viewNEditDetailsData.invoiceCurrency
        this.parcelPointData = PARCELPOINT_DATA && PARCELPOINT_DATA.map(point => {
            const baseValue = invoiceCurrency.currency === point.currency ? 1 : invoiceCurrency.baseVal
            return { ...point, label: `${point.parcelPoint.toUpperCase()} - ${invoiceCurrency.symbol}${(point.cost * baseValue).toFixed(2)}`, value: point._id };
        })

        this.setOrderDetailsState(this.props)
        this.handleAddServicesCost()
        this.setState({ fromParcelPointList: this.getParcelPointList(this.state.from), toParcelPointList: this.getParcelPointList(this.state.to) })


    }
    setOrderDetailsState = (props) => {
        this.setState(ORDER_DETAILS_OBJ(props))
        this.calculateTotal()
    }
    calculateTotal = () => {
        const { parcelDetailsList } = this.props.viewNEditDetailsData || {}
        let weight = 0, volume = 0;
        parcelDetailsList && parcelDetailsList.map(item => {
            weight += parseFloat(item.weight);
            volume += GET_VOLUME(item.length, item.width, item.height)
        })
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
            inputValues: { weight: '', volume: '', length: '', width: '', height: '' }
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
        const { expectedCost, insurancePremium, extraCost, addServicesCost } = this.state
        this.setState({ totalInvoiceAmount: (parseFloat(expectedCost) + parseFloat(insurancePremium) + parseFloat(addServicesCost) + parseFloat(extraCost.cost || 0)).toFixed(2) || 0 })
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
        if (e.label === "UK" || e.label === "UNITED KINGDOM") {
            this.currency = [{ currency: "GBP", iso: "UK", symbol: "£", baseVal: 1 },//0.85
            { currency: "EUR", iso: "EU", symbol: "€", baseVal: 1.17 }]//1

            this.setState({ currency: { currency: "GBP", iso: "UK", symbol: "£", baseVal: 1 } })
        }
        else {
            this.currency = [{ currency: "GBP", iso: "UK", symbol: "£", baseVal: 0.85 },//0.85
            { currency: "EUR", iso: "EU", symbol: "€", baseVal: 1 }]//1

            this.setState({ invoiceCurrency: { currency: "EUR", iso: "EU", symbol: "€", baseVal: 1 } })
        }
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
        this.handleAddServicesCurrency(item)
        this.setState({ invoiceCurrency: item }, this.handleCalculate)
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
        const from = fromParcelPoint.label ? { ...fromParcelPoint, label: `${fromParcelPoint.parcelPoint.toUpperCase()} - ${item.symbol}${(fromParcelPoint.cost * frombaseValue).toFixed(2)}`, value: fromParcelPoint._id } : {};
        const to = toParcelPoint.label ? { ...toParcelPoint, label: `${toParcelPoint.parcelPoint.toUpperCase()} - ${item.symbol}${(toParcelPoint.cost * tobaseValue).toFixed(2)}`, value: toParcelPoint._id } : {};
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
    handleAddServicesCurrency = (currency) => {
        const { additionalServices } = this.state
        let newAdditionalServices = []
        additionalServices && additionalServices.map(item => {
            newAdditionalServices.push(item.isChecked && item.cost != '' ? { ...item, cost: (parseFloat(item.cost) * parseFloat(currency.baseVal)).toFixed(2) } : item)
        })
        this.setState({ additionalServices: newAdditionalServices }, this.handleAddServicesCost)
    }

    handleSubmit = () => {
        const oldData = this.props.viewNEditDetailsData
        let { firstName, lastName, email, senderPhone, collectionAddress1, collectionAddress2, collectionCity, collectionZipCode, deliveryAddress1,
            deliveryAddress2, deliveryCity, deliveryZipCode, receiverName, receiverPhone, numberOfParcel, parcelDetailsList, totals, from, to, preferredDate,
            invoiceCurrency, companyDetails, additionalServices, insuranceRequired, insuranceDetails, parcelImages, expectedCost, senderName, insuranceTotalValue,
            insurancePremium, fromParcelPoint, toParcelPoint, parcelPdf, extraCost, totalInvoiceAmount, collectionInstructions, deliveryInstructions, otherInformations, 
            photoOnDelivery, signatureOnDelivery, unexpectedCost } = this.state
        const isCashPaymentSelected = additionalServices.find(item => item.id === 5 && item.isChecked)
        const cashPaymentOn = isCashPaymentSelected ? this.state.cashPaymentOn : null
        const instructionsForCashHandling = isCashPaymentSelected ? this.state.instructionsForCashHandling : ''
        let insuranceDetail = {}, additionalObj = {}, collectionAddress = { fromParcelPoint }, receiverAddress = { toParcelPoint }, parcelPointObj = {}

        if (this.handleValidation()) {
            this.setState({ submitRes: { status: 400, data: { message: "Required fields can't be empty." } } })
            return
        }

        if (insuranceRequired === 'Yes') {//todo: if insurance is yes then parcel details are optional
            if (insuranceDetails && insuranceDetails.length == 0) {
                this.setState({ submitRes: { status: 400, data: { message: "Please add insurance details..." } } })
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
            customerId: localStorage.getItem('token'), firstName, lastName, email, ...collectionAddress, ...receiverAddress,
            receiverName, receiverPhone, numberOfParcel, parcelDetailsList, allParcelDetailsSum: totals, fromCountry: from, toCountry: to, 
            preferredDate, invoiceCurrency, ...additionalObj, ...insuranceDetail, additionalServices, insuranceRequired, parcelImages, expectedCost, 
            senderName, senderPhone, insuranceTotalValue, insurancePremium, ...parcelPointObj, claimStatus: this.props.viewNEditDetailsData.claimStatus, 
            claimDetails: this.props.viewNEditDetailsData.claimDetails, invoiceStatus: this.props.viewNEditDetailsData.invoiceStatus, parcelPdf, extraCost, 
            totalInvoiceAmount, collectionInstructions, deliveryInstructions, otherInformations, cashPaymentOn, instructionsForCashHandling, photoOnDelivery, 
            signatureOnDelivery, unexpectedCost
        }
        axios.put(`${API_HOST}/api/orderDetails/${this.props.viewNEditDetailsData._id}`, params, HEADERS).then((res) => {
            if (res) {
                const currCountry = (from.value.toLowerCase() === 'united kingdom' || to.value.toLowerCase() === 'united kingdom')
                const oldCountry = (oldData.fromCountry.value.toLowerCase() === 'united kingdom' || oldData.toCountry.value.toLowerCase() === 'united kingdom')
                if (res && res.status === 200 && res.data) {
                    // if(currCountry && !oldCountry)
                    //     this.updateCustomInvoice(res.data)
                    // else 
                    if (currCountry && !oldCountry)
                        this.postCustomInvoice(res.data.orderId, res.data.status)
                    else if (oldCountry && !currCountry)
                        this.deleteCustomInvoice(res.data.orderId)
                }
                this.setState({ submitRes: res, showSuccessPopup: true, isSuccess: true, isReadOnly: true })
                this.props.handleSubmitUpdate(res.data)
                this.props.onClose()
            }
        }).catch((error) => {
            console.log(error);
            this.setState({ submitRes: error.response, showSuccessPopup: false, isSuccess: false, })
        })
    }
    postCustomInvoice = (orderId, status) => {
        const { email, senderName, receiverName, numberOfParcel, totals, insurancePremium, invoiceCurrency,
            collectionAddress1, collectionAddress2, collectionCity, collectionZipCode,
            deliveryAddress1, deliveryAddress2, deliveryCity, deliveryZipCode, from, to } = this.state

        let senderAddress = '';
        let receiverAddress = '';
        // let signatureDataArray = ' ';
        if (collectionAddress1 !== '') {
            senderAddress = `${collectionAddress1}, ${collectionAddress2}, ${collectionCity} - ${collectionZipCode} - ${from}`
        } if (deliveryAddress1 !== '') {
            receiverAddress = `${deliveryAddress1}, ${deliveryAddress2}, ${deliveryCity} -  ${deliveryZipCode} - ${to}`
        }
        const payload = {
            email, senderName, receiverName, senderAddress, receiverAddress, content: {}, numberOfParcels: numberOfParcel,
            originOfGoods: {}, insuredFor: insurancePremium, totalWeight: totals.weight, contents: [],
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
    deleteCustomInvoice = (orderId) => {
        axios.delete(`${API_HOST}/api/customInvoice/${orderId}`, {}, HEADERS)
            .then((res) => {
            }).catch((error) => {
            })
    }
    updateCustomInvoice = (data) => {
        const { orderId } = data || {}
        const { collectionAddress1, collectionAddress2, collectionCity, collectionZipCode,
            deliveryAddress1, deliveryAddress2, deliveryCity, deliveryZipCode,
            email, senderName, receiverName, insurancePremium, totals, invoiceCurrency, numberOfParcel, status } = this.state

        let senderAddress = '';
        let receiverAddress = '';
        // let signatureDataArray = ' ';
        if (collectionAddress1 !== '') {
            senderAddress = `${collectionAddress1}, ${collectionAddress2}, ${collectionCity} - ${collectionZipCode}`
        } if (deliveryAddress1 !== '') {
            receiverAddress = `${deliveryAddress1}, ${deliveryAddress2}, ${deliveryCity} -  ${deliveryZipCode}`
        }

        const payload = {
            email, senderName, receiverName, senderAddress, receiverAddress, numberOfParcels: numberOfParcel,
            insuredFor: insurancePremium, totalWeight: totals.weight, orderId, currency: invoiceCurrency, status
        }
        if (orderId) {
            axios.put(`${API_HOST}/api/customInvoice/${orderId}`, payload, HEADERS)

        }
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
            return false
        }
        for (let i = 0; i < (files && files.length); i++) {
            if (files[i])
                try {
                    FileResizer.imageFileResizer(
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
    }

    handleValidation = () => {
        const { showCollectionAddress, showReceiverAddress, to, from, additionalServices, fromParcelPoint, toParcelPoint, insuranceRequired, insuranceDetails, cashPaymentOn } = this.state
        const isCashOnDelevery = additionalServices.find(item => item.id === 5 && item.isChecked)
        const validationList = [
            { id: 'firstName', isRequired: true, },
            { id: 'lastName', isRequired: true, },
            { id: 'invoiceMail', isRequired: true, isEmail: true },
            { id: 'preferredCollectionDate', isRequired: false },
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
                    document.getElementById(item.id).setAttribute('style', 'none')
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

    handleEditOrderDetails = () => {
        const { isReadOnly, from, to } = this.state
        if (!isReadOnly) {
            this.setState({ showEditDiscardChangesPopup: true })
        } else {
            this.handleFromDropdown(from)
            this.handleToDropdown(to)
            this.setState({ isReadOnly: false }, this.setOrderDetailsState(this.props))
        }
    }



    // TODO: remove
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

    handleAdditionalCost = (index, val) => {
        let additionalServices = [...this.state.additionalServices]
        if (additionalServices[index]) additionalServices[index].cost = val >= 0 ? val : 0
        this.setState({ additionalServices }, this.handleAddServicesCost)
    }
    handletopParcelCheck = (e, isChecked, index) => {
        let parcelDetailsList = [...this.state.parcelDetailsList]
        parcelDetailsList[index].isChecked = isChecked
        this.setState({ parcelDetailsList }, this.handleCalculate)
    }
    handleSetInputValues = (val, item) => {
        this.setState({ inputValues: { ...this.state.inputValues, [item.accesor]: val } })
    }
    handleFromParcelPoint = (e) => this.setState({ fromParcelPoint: e }, this.handleCalculate)
    handleToParcelPoint = (e) => this.setState({ toParcelPoint: e }, this.handleCalculate)
    handleStateUpdate = (stateObj, func) => {
        this.setState(stateObj, () => { func && func() })
    }
    handleClose = () => {
        if (!this.state.isReadOnly) {
            this.setState({ showEditDiscardChangesPopup: true })
        } else {
            this.props.onClose()
        }
    }
    handlePDFUpload = (event) => {
        let selectedFile = event.target.files;
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
    handleAddServicesCost = () => {
        const { additionalServices } = this.state
        let total = 0
        additionalServices && additionalServices.map(item => {
            if (item.isChecked && item.cost != '') {
                total += parseFloat(item.cost)
            }
        })
        this.setState({ addServicesCost: total.toFixed(2) }, this.handleTotalInvoiceAmount)
    }
    render() {
        const { isReadOnly, parcelDetailsList, totals, showCollectionAddress, showReceiverAddress, fromParcelPoint, toParcelPoint,
            currency, expectedCost, insuranceRequired, insurancePremium, showEditDiscardChangesPopup, parcelImages, currentImage,
            isSuccess, showSuccessPopup, showImageViewer, isEditValid, invoiceCurrency, totalInvoiceAmount, extraCost, additionalServices, addServicesCost } = this.state
        const { isAdmin } = this.props
        return (
            <div className={styles.container}>
                <div className={styles.warpper}>
                    <div className={styles.header}>
                        <h3>{'Order Form'}</h3>
                    </div>
                    <div className={styles.body}>
                        <div>
                            <OrderFormComp state={this.state}
                                handleFromDropdown={this.handleFromDropdown}
                                handleToDropdown={this.handleToDropdown}
                                handleStateUpdate={this.handleStateUpdate}
                                handleInvoiceCurrency={this.handleInvoiceCurrency}
                                handleParcelImages={this.handleParcelImages}
                                handleParcelPointRadio={this.handleParcelPointRadio}
                                getTotalValueFroInsurance={this.getTotalValueFroInsurance}
                                handlePDFUpload={this.handlePDFUpload}
                                handleAdditionalCost={this.handleAdditionalCost}
                                handleTotalInvoiceAmount={this.handleTotalInvoiceAmount}
                                isAdmin={isAdmin} />

                            <CalculatorComp parcelDetailsList={parcelDetailsList} totals={totals} showCollectionAddress={showCollectionAddress} showReceiverAddress={showReceiverAddress}
                                inputValues={this.state.inputValues} fromParcelPoint={fromParcelPoint} toParcelPoint={toParcelPoint} invoiceCurrency={invoiceCurrency} expectedCost={expectedCost}
                                insuranceRequired={insuranceRequired} insurancePremium={insurancePremium} fromParcelPointList={this.state.fromParcelPointList}
                                toParcelPointList={this.state.toParcelPointList} totalInvoiceAmount={totalInvoiceAmount} extraCost={extraCost} addServicesCost={addServicesCost}
                                isAllFieldsFilled={this.isAllFieldsFilled} handleAddItem={this.handleAddItem} handleDelete={this.handleDelete} handleSetInputValues={this.handleSetInputValues}
                                handleEdit={this.handleEdit} handletopParcelCheck={this.handletopParcelCheck} getParcelPointCost={this.getParcelPointCost} handleCalculate={this.handleCalculate}
                                handleFromParcelPoint={this.handleFromParcelPoint} handleToParcelPoint={this.handleToParcelPoint} isReadOnly={isReadOnly} />
                        </div>
                    </div>
                    <div className={styles.footer}>
                        {!isAdmin && isReadOnly && <Button classes={'secondary'} text={'Reorder'}
                            onClick={() => this.props.history.push({ pathname: `/customer/new`, state: this.props.viewNEditDetailsData })} />}
                        <Button classes={'secondary' + (isReadOnly ? '' : ' danger')} text={'Close'}
                            onClick={this.handleClose} />
                        {isEditValid && <Button classes={'primary'}
                            text={isReadOnly ? 'Edit' : 'Submit'}
                            onClick={() => {
                                if (isReadOnly) this.setState({ isReadOnly: !isReadOnly })
                                else this.handleSubmit()
                            }} />}
                    </div>
                </div>
                {showEditDiscardChangesPopup &&
                    <ConfirmationPopup
                        header={'Confirm'}
                        text={'Do you want to discard the changes?'}
                        saveText={'Discard'}
                        cancelText={'Cancel'}
                        handleSave={() => {
                            this.setState({ isReadOnly: !isReadOnly, showEditDiscardChangesPopup: false })
                            // this.setOrderDetailsState(this.props)
                            this.props.onClose()
                        }}
                        handleCancel={() => {
                            this.setState({ showEditDiscardChangesPopup: false })
                        }} />}
                {showSuccessPopup &&
                    <SuccessPopup
                        isSuccess={isSuccess}
                        successText={'Order updated successful'}
                        errorText={'Failed please try again'}
                        onClick={() => this.setState({ showSuccessPopup: false, isSuccess: true })}
                    />}
                {showImageViewer &&
                    <ImageViewer
                        src={parcelImages && parcelImages.map(item => item.data)}
                        currentIndex={currentImage}
                        disableScroll={false}
                        closeOnClickOutside={true}
                        onClose={() => this.setState({ showImageViewer: false, currentImage: 0 })}
                        isAdmin={true}
                    />}
            </div>
        );
    }
}

export default withRouter(OrderFormPopup);