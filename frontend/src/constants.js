import axios from 'axios';
import io from 'socket.io-client';
let API = "";
let SOCKET_API = "";
if (process.env.NODE_ENV === "development") {
    API = "http://localhost:3001"
    SOCKET_API = "http://localhost:3001"
} else if (process.env.NODE_ENV === "production") {
    API = "https://pickupdrop.herokuapp.com"
    SOCKET_API = "https://pickupdrop.herokuapp.com"
}

export const API_HOST = API;
export const ORDER_STATUS = [
    { label: 'Order Placed', value: 'Order Placed', color: '#000000', backgroundColor: '#FFFFFF' },
    { label: 'Order Accepted', value: 'Order Accepted', color: '#000000', backgroundColor: '#FFFFFF' },
    { label: 'Order Delayed', value: 'Order Delayed', color: '#000000', backgroundColor: '#FFFFFF' },
    { label: 'Order Declined', value: 'Order Declined', color: '#EB4B00', backgroundColor: '#FFFFFF' },
    { label: 'Waiting Pickup', value: 'Waiting Pickup', color: '#000000', backgroundColor: '#FFFFFF' },
    { label: 'Collected', value: 'Collected', color: '#000000', backgroundColor: '#FFFFFF' },
    { label: 'In Warehouse', value: 'In Warehouse', color: '#000000', backgroundColor: '#FFFFFF' },
    { label: 'In Transit', value: 'In Transit', color: '#000000', backgroundColor: '#FFFFFF' },
    { label: 'In Customs', value: 'In Customs', color: '#F88017', backgroundColor: '#FFFFFF' },
    { label: 'Customs ERROR', value: 'Customs ERROR', color: '#000000', backgroundColor: ' #FF5A5F' }, //#F08080
    { label: 'In Parcelpoint', value: 'In Parcelpoint', color: '#000000', backgroundColor: '#FFFFFF' },
    { label: 'Out for Delivery', value: 'Out for Delivery', color: '#000000', backgroundColor: '#FFFFFF' },
    { label: 'Delivered', value: 'Delivered', color: '#000000', backgroundColor: '#64E986' },
    { label: 'Cancelled', value: 'Cancelled', color: '#EB4B00', backgroundColor: '#FFFFFF' },
    { label: 'Assigned to Partner', value: 'Assigned to Partner', color: '#000000', backgroundColor: '#FFFFFF' },
];
export const ORDER_STATUS_STYLE = (status) => {
    return { color: status ? status.color : '', backgroundColor: status ? status.backgroundColor : '', padding: '6px', borderRadius: '4px' }
}
export const INVOICE_STATUS_STYLE = (status) => {
    return { color: status ? status.color : '', backgroundColor: status ? status.backgroundColor : '', padding: '6px', borderRadius: '4px', fontWeight: 'bold' }
}
export const COMMERCIAL_FORM_STATUS_STYLE = (status) => {
    return { color: status ? status.color : '', backgroundColor: status ? status.backgroundColor : '', padding: '6px', borderRadius: '4px', fontWeight: 'bold' }
}
export const INVOICE_STATUS = [
    { label: 'Unpaid', value: 'Unpaid', color: '#000000', backgroundColor: '#FFFFFF' },
    { label: 'Paid', value: 'Paid', color: '#000000', backgroundColor: '#64E986' },
    { label: 'Overdue', value: 'Overdue', color: '#000000', backgroundColor: ' #FF5A5F' },
    { label: 'Partly Paid', value: 'partlypaid', color: '#F88017', backgroundColor: '#FFFFFF' },
    { label: 'Refunded', value: 'refunded', color: '#000000', backgroundColor: '#FFFFFF' },
];

export const CLAIM_STATUS = [
    { label: 'Claimed', value: 'Claimed', color: '#FFA500' },
    { label: 'Inprogress', value: 'InProgress', color: '#FFFF00' },
    { label: 'Resolved', value: 'Resolved', color: '#00FF00' },
    { label: 'Claim Rejected', value: 'rejected', color: '#FF0000' },
    { label: 'Unclaimed', value: 'UnClaimed', color: '#000000' },
];

export const COMMERCIAL_FORM_STATUS = [
    { label: 'Reviewed', value: 'Reviewed', color: '#F88017', backgroundColor: '#FFFFFF' },
    { label: 'Accepted', value: 'Accepted', color: '#000000', backgroundColor: '#64E986' },
    { label: 'Declined', value: 'Declined', color: '#000000', backgroundColor: '#FF5A5F' },
]

export const getDD_MM_YYYY = (d) => {
    var dd = d.getDate();
    var mm = d.getMonth() + 1;

    var yyyy = d.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    var finalDate = dd + '/' + mm + '/' + yyyy;
    return finalDate
}

export let SOCKET = {}
export const SOCKET_CONNECTION = () => {
    SOCKET = io.connect(SOCKET_API, {
        auth: {
            token: localStorage.getItem('token')
        }
    })
}

export let HEADERS = {
    'headers': {
        "content-type": "application/json",
        Authorization: localStorage.getItem('token')
    }
}

export const SET_HEADERS = () => {
    HEADERS = {
        'headers': {
            "content-type": "application/json",
            Authorization: localStorage.getItem('token')
        }
    }
}

export const SORT_OBJ = (object) => {
    const keysList = Object.keys(object)
    const valuesList = Object.values(object)
    return Object.values(object).sort((a, b) => parseFloat(a.listOrder) - parseFloat(b.listOrder)).reduce(
        (obj, key) => {
            obj[keysList[valuesList.indexOf(key)]] = key;
            return obj;
        },
        {}
    );
}

export const CALCULATE = ({ totals, from, to, invoiceCurrency, fromParcelPoint, toParcelPoint, parcelDetailsList }) => {
    let result = 0
    let liter = (totals.volume * 1000)
    let perKg, perLiters = 0, kgThreshold, literTHreshold;
    if (to.label && from.label) {
        if (totals.weight > 0 && totals.volume > 0) {
            DROPDOWN_DATA && DROPDOWN_DATA.map(item => {
                if (from.label.toLowerCase() === item.from.toLowerCase()) {
                    if (item.to && item.to[to.value]) {
                        perKg = item.to[to.value].perKg;
                        perLiters = item.to[to.value].perLiter;
                        kgThreshold = item.to[to.value].kgThreshold
                        literTHreshold = item.to[to.value].literTHreshold
                    }
                }
            })
            if (totals.weight >= literTHreshold) {
                perLiters = perLiters / 2
            }
            if (totals.weight <= kgThreshold) {
                result = totals.weight * perKg + liter * perLiters
            } else {
                let discWeight = (totals.weight - kgThreshold) * (perKg - (perKg * 1 / 3))
                let weight = kgThreshold * perKg + discWeight
                result = weight + liter * perLiters
            }
            result = result * invoiceCurrency.baseVal
        }
        if (invoiceCurrency.currency === (fromParcelPoint && fromParcelPoint.currency)) {
            result += (fromParcelPoint.cost || 0)
        } else {
            result = result + ((fromParcelPoint.cost || 0) * invoiceCurrency.baseVal)
        }
        if (invoiceCurrency.currency === (toParcelPoint && toParcelPoint.currency)) {
            result += (toParcelPoint.cost || 0)
        } else {
            result = result + ((toParcelPoint.cost || 0) * invoiceCurrency.baseVal)
        }
        result += calculateTopParcel(parcelDetailsList)

        if (result >= 0) {
            return result.toFixed(2)
        }
    } else {
        return 0.00
    }
}

const calculateTopParcel = (parcelDetailsList) => {
    let weight = 0, volume = 0;
    parcelDetailsList && parcelDetailsList.map(item => {
        if (item.isChecked) {
            weight += parseFloat(item.weight)
            volume += GET_VOLUME(item.length, item.width, item.height)
        }
    })
    return (weight * 1.5) + (volume * 2)
}

export let DROPDOWN_DATA = []
axios.get(`${API_HOST}/api/country`).then((res) => {
    if (res) {
        DROPDOWN_DATA = res.data
    }
}).catch((error) => {

})

export let PARCELPOINT_DATA = []
axios.get(`${API_HOST}/api/parcelPoints`).then((res) => {
    if (res) {
        PARCELPOINT_DATA = res.data && res.data.map(item => {
            return { ...item, label: `${item.parcelPoint.toUpperCase()} - ${item.symbol}${item.cost}`, value: item._id }
        })
    }
}).catch((error) => {

})

export const GET_VOLUME = (l, w, h) => {
    return parseFloat(((l / 100) * (w / 100) * (h / 100)).toFixed(6))
}

export const currency = [{ currency: "EUR", iso: "EU", symbol: "€", baseVal: 1.1880634 },
{ currency: "GBP", iso: "UK", symbol: "£", baseVal: 0.84171323 },]

export const ORDER_DETAILS_OBJ = ({ viewNEditDetailsData }) => {
    const { firstName, lastName, email, collectionAddress1, collectionAddress2, collectionCity, collectionZipCode, senderName, senderPhone,
        deliveryAddress1, deliveryAddress2, deliveryCity, deliveryZipCode, receiverName, receiverPhone, preferredDate, insuranceRequired,
        additionalServices, companyDetails, insuranceDetails, insuranceTotalValue, insurancePremium, parcelImages, fromParcelPoint, toParcelPoint,
        parcelDetailsList, fromCountry, toCountry, expectedCost, invoiceCurrency, numberOfParcel, fromParcelPointRadio, toParcelPointRadio,
        parcelPdf, extraCost, totalInvoiceAmount, collectionInstructions, deliveryInstructions, otherInformations, cashPaymentOn, instructionsForCashHandling, 
        photoOnDelivery, signatureOnDelivery, unexpectedCost } = viewNEditDetailsData || {}
    return {
        firstName: firstName,
        lastName: lastName,
        email: email || '',
        collectionAddress1: collectionAddress1 || '',
        collectionAddress2: collectionAddress2 || '',
        collectionCity: collectionCity || '',
        collectionZipCode: collectionZipCode || '',
        senderName: senderName,
        senderPhone: typeof senderPhone === 'string' ? [senderPhone] : senderPhone,
        deliveryAddress1: deliveryAddress1 || '',
        deliveryAddress2: deliveryAddress2 || '',
        deliveryCity: deliveryCity || '',
        deliveryZipCode: deliveryZipCode || '',
        receiverName: receiverName,
        receiverPhone: typeof receiverPhone === 'string' ? [receiverPhone] : receiverPhone,
        preferredDate: preferredDate || '',
        insuranceRequired: insuranceRequired || '',
        additionalServices: additionalServices || [],
        submitRes: {},
        companyDetails: companyDetails || '',
        insuranceDetails: insuranceRequired === 'Yes' && insuranceDetails || [{}],
        totalAmount: '',
        insuranceTotalValue: insuranceRequired === 'Yes' && insuranceTotalValue || 0,
        insurancePremium: insuranceRequired === 'Yes' && insurancePremium || 0,
        parcelImages: parcelImages || [],
        fromParcelPointList: [],
        toParcelPointList: [],
        fromParcelPoint: fromParcelPoint || {},
        toParcelPoint: toParcelPoint || {},
        showCollectionAddress: collectionAddress1 !== '-' ? true : false,
        showReceiverAddress: deliveryAddress1 !== '-' ? true : false,
        showAddionalDropdown: false,
        parcelDetailsList: parcelDetailsList || [],
        weight: '',
        volume: '',
        length: '',
        width: '',
        height: '',
        inputValues: { weight: 0, volume: 0, length: 0, width: 0, height: 0 },
        totals: { weight: 0, volume: 0, length: 0, width: 0, height: 0 },
        isEditing: false,
        from: fromCountry || '',
        to: toCountry || '',
        expectedCost: expectedCost || 0,
        invoiceCurrency: invoiceCurrency,
        invoiceCurrency: invoiceCurrency,
        numberOfParcel: numberOfParcel,
        fromParcelPointRadio: fromParcelPointRadio,
        toParcelPointRadio: toParcelPointRadio,
        parcelPdf: parcelPdf || {},
        extraCost: extraCost || {},
        totalInvoiceAmount: totalInvoiceAmount || 0,
        collectionInstructions: collectionInstructions || '',
        deliveryInstructions: deliveryInstructions || '',
        otherInformations: otherInformations || '',
        cashPaymentOn,
        instructionsForCashHandling,
        photoOnDelivery: photoOnDelivery || [],
        signatureOnDelivery: signatureOnDelivery || '',
        unexpectedCost: unexpectedCost || {cost: 0, message: ''}
    }
}

export const CONVERT_ORDER_TO_CMR = (orderData) => {
    const { orderId, senderName, collectionAddress1, collectionAddress2, collectionCity, collectionZipCode,
        receiverName, deliveryAddress1, deliveryAddress2, deliveryCity, deliveryZipCode, fromCountry, toCountry,
        totals, numberOfParcel } = orderData
    const senderAddress = `${collectionAddress1}, ${collectionAddress2 ? ',' + collectionAddress2 : ''} ${collectionCity}, ${collectionZipCode}`;
    const receiverAddress = `${deliveryAddress1}, ${deliveryAddress2 ? ',' + deliveryAddress2 : ''} ${deliveryCity}, ${deliveryZipCode}`;
    const senderCountry = fromCountry;
    const receiverCountry = toCountry;
    const grossWeight = totals && totals.weight ? totals.weight : 0
    const volume = totals && totals.volume ? totals.volume : 0
    return { orderId, senderName, senderAddress, senderCountry, receiverName, receiverAddress, receiverCountry, grossWeight, volume, numberOfParcel }

}
export const MOBILE_VIEW = window.screen.width <= 600
export const DESKTOP_VIEW = window.screen.width >= 1024