import { Select } from '@material-ui/core'
import classNames from 'classnames'
import Input from '../Input'
import styles from './styles.module.css'
import { Form, FormControl } from 'react-bootstrap';
import { IoMdCloseCircle } from 'react-icons/io'
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from 'react-icons/md';
import CustomSelect from '../CustomSelect'
import Button from '../Button'
import { currency } from '../../constants';
import Textarea from '../Textarea';
import TooltipComp from '../TooltipComp';
import { ImCross } from 'react-icons/im';
import FileResizer from 'react-image-file-resizer';
import ReactSignatureCanvas from 'react-signature-canvas';
import { useEffect } from 'react';
import InputPlus from '../InputPlus';

export function OrderFormComp({ state, handleFromDropdown, handleToDropdown, handleStateUpdate, handleInvoiceCurrency,
    handleParcelImages, handleParcelPointRadio, getTotalValueFroInsurance, handlePDFUpload, handleAdditionalCost, handleTotalInvoiceAmount, isAdmin }) {

    const { firstName, lastName, email, preferredDate, invoiceCurrency, from, fromOptions, showCollectionAddress,
        collectionAddress1, collectionAddress2, collectionCity, collectionZipCode, senderName, senderPhone,
        toOptions, to, showReceiverAddress, deliveryAddress1, deliveryAddress2, deliveryCity, deliveryZipCode,
        receiverName, receiverPhone, numberOfParcel, parcelImages, insuranceRequired, cashCollectionRequired, insuranceDetails, 
        insuranceTotalValue, insurancePremium, additionalServices, showAddionalDropdown, companyDetails, isReadOnly, parcelPdf, extraCost,
        collectionInstructions, deliveryInstructions, otherInformations, cashPaymentOn, instructionsForCashHandling, photoOnDelivery, signatureOnDelivery, unexpectedCost } = state

    // const isReadOnly = false
    const AddressOrParcelPoint = [{ label: 'Address', id: 0 }, { label: 'Parcel Point', id: 1 }]
    // const currency = [{ currency: "EUR", iso: "EU", symbol: "€", baseVal: 1.1880634 },
    // { currency: "GBP", iso: "UK", symbol: "£", baseVal: 0.84171323 },]
    const insuranceRequiredList = [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]
    
    const cashPaymentList = [
        { id: 1, label: "Cash collection on collection", value: "Cash collection on collection" },
        { id: 2, label: "Cash collection on delivery", value: "Cash collection on delivery" },
        { id: 3, label: "Cash payment on collection", value: "Cash payment on collection" },
        { id: 4, label: "Cash payment on delivery", value: "Cash payment on delivery" },
    ]

    const fullWidth = { gridColumn: '1 / 3' }
    let signPad;

    useEffect(()=>{
        if(signPad){
            signPad.fromDataURL(signatureOnDelivery)
            signPad.off();
        }
    },[])
    useEffect(()=>{
        if(signPad){
            if(isReadOnly){
                signPad.off();
            }else if(isAdmin){
                signPad.on()
            }
        }
    }, [isReadOnly])

    const getParcelPointAddress = (key) => {
        const { to, from, fromParcelPointRadio, toParcelPointRadio } = state
        let country = {}, radio = 0, label = 'fromToParcelPoint';
        switch (key) {
            case 'collection':
                country = from;
                radio = fromParcelPointRadio
                label = 'fromParcelPoint'
                break
            case 'receiver':
                country = to;
                radio = toParcelPointRadio
                label = 'toParcelPoint'
                break;
            default:
                break;
        }
        const value = country.value && country.value.toLowerCase()
        if (value === 'united kingdom' || value === 'uk') {
            return <>
                <span>
                    <table className={styles.addressTable}>
                        <tr>
                            <th className={styles.addressTable}>Address</th>
                        </tr>
                        <tr>
                            <td className={styles.addressTable}>London parcelpoint fee is £1 per parcel.<br />Address: 40 Killowen Ave, Northolt UB5 4QT, UK.<br />Open Everyday 10am - 8pm.</td>
                        </tr>
                    </table>
                </span>
            </>

        } else if (value === 'estonia') {
            return <>
                <span>
                    <table className={styles.addressTable}>
                        <tr>
                            {(!isReadOnly || radio === 1) && <th className={styles.addressTable}><input type={'radio'} name={label}
                                checked={radio === 1} disabled={isReadOnly}
                                onChange={() => handleParcelPointRadio(key, 1)} />Address 1</th>}
                            {(!isReadOnly || radio === 2) && <th className={styles.addressTable}><input type={'radio'} name={label}
                                checked={radio === 2} disabled={isReadOnly}
                                onChange={() => handleParcelPointRadio(key, 2)} />Address 2</th>}
                        </tr>
                        <tr>
                            {(!isReadOnly || radio === 1) && <td className={styles.addressTable}>Estonia parcelpoint is free.<br />Address: Riia 104, Tartu 50411, Estonia.<br />Prearranged opening times only.</td>}
                            {(!isReadOnly || radio === 2) && <td className={styles.addressTable}>Estonia parcelpoint is free.<br />Address: Betooni 6/1Tallinn 11415.<br />Prearranged opening times only.</td>}
                        </tr>
                    </table>
                </span>
            </>
        } else if (value === 'germany') {
            return <>
                <span>
                    <table className={styles.addressTable}>
                        <tr>
                            <th className={styles.addressTable}>Address</th>
                        </tr>
                        <tr>
                            <td className={styles.addressTable}>Germany parcelpoint fee is €1 per parcel.<br />Address: Belgische Str. 2, 15234 Frankfrut (Oder).<br />Open 24/7.</td>
                        </tr>
                    </table>
                </span>
            </>
        } else {
            return <>
                <span>
                    <table className={styles.addressTable}>
                        <tr>
                            <td className={styles.addressTable}>{country.value ? `We have no parcelpoints in ${country.label}.` : 'Please select the counrty.'}</td>
                        </tr>
                    </table>
                </span>
            </>
        }
    }

    const getInputOrSpan = (label, id, placeholder, required, value, key) => {
        return isReadOnly ?
            <span className={styles.readOnlySpan}>
                <label htmlFor='a'>{label}</label><br />
                <span id='a'>{value}</span>
            </span>
            : <Input
                label={label}
                id={id}
                required={required}
                placeholder={placeholder}
                value={value}
                onChange={(e, val) => {
                    handleStateUpdate({ [key]: val })
                }} />
    }
    const handleParcelPointHighlight = (key, value) => {
        if (key === 'from') {
            document.getElementsByClassName('fromParcelPointDropdown')[0] && document.getElementsByClassName('fromParcelPointDropdown')[0].setAttribute('style', `border: ${value ? '1px solid red' : 'none'}`)
        } else if (key === 'to') {
            document.getElementsByClassName('toParcelPointDropdown')[0] && document.getElementsByClassName('toParcelPointDropdown')[0].setAttribute('style', `border: ${value ? '1px solid red' : 'none'}`)
        }

    }
    const handleAdditionalCheckbox = (item) => {
        let list = []
        additionalServices && additionalServices.map((val, i) => {
            if (val.id === item.id) {
                list.push({ ...val, isChecked: !item.isChecked })
            } else {
                list.push(val)
            }
        })
        handleStateUpdate({ additionalServices: list, })
    }
    const getCashPaymentHTML = () => {
        const isCashPaymentSelected = additionalServices.find(item => item.id === 5 && item.isChecked)
        return !isCashPaymentSelected ? ''
            : <>
                <div id={'cashPaymentRadioBtn'} className={classNames(styles.radioBtn, styles.cashPaymentRadioBtn)}>
                    <label>{"Cash payments on collection/delivery"}<sup>*</sup></label>
                    {cashPaymentList && cashPaymentList.map((item, i) => {
                        return <div key={i}>
                            <input disabled={isReadOnly} type={'radio'} name={"cashPaymentOn"} value={item.label}
                                checked={item.label === (cashPaymentOn && cashPaymentOn.label)}
                                onChange={() => handleStateUpdate({ cashPaymentOn: item })} />{item.label}
                        </div>
                    })}
                </div>
                <div>
                    {isReadOnly ?
                        <span className={styles.readOnlySpan}>
                            <label htmlFor='a'>{"Instructions for cash handling"}</label><br />
                            <span id='a'>{instructionsForCashHandling || "-"}</span>
                        </span>
                        : <span>
                            <label>{"Instructions for cash handling"}</label>
                            <Textarea
                                id={'instructionsForCashHandling'}
                                value={instructionsForCashHandling}
                                onChange={(e) => handleStateUpdate({ instructionsForCashHandling: e.target.value })}
                                rows={3}
                                cols={2}
                                readOnly={isReadOnly}
                            />
                        </span>}
                </div>
                <div style={fullWidth} className={styles.note}>Note: All product purchases must be paid for in advance. The customer will be charged for any currency exchange and ATM fees.</div>
            </>

    }
    const handleImgResizer=(e)=>{
        let files = e.target.files
        if (files && (files.length + photoOnDelivery.length) > 2) {
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
                            handleStateUpdate({ photoOnDelivery: [...photoOnDelivery, { file: files[i], data: uri }] })
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
    return <div className={classNames(styles.container, { [styles.viewFormContainer]: isReadOnly })}>
        {getInputOrSpan('First Name', 'firstName', 'First Name', true, firstName, 'firstName')}
        {getInputOrSpan('Last Name', 'lastName', 'Last Name', true, lastName, 'lastName')}
        {getInputOrSpan('Invoice Email', 'invoiceMail', 'Invoice Email', true, email, 'email')}

        <Input
            tooltipText={"Enter suggested pickup date(It won't be exact as entered, may vary subject to availability)"}
            label={"Preferred Collection Date (subject to availability)"}
            id={'preferredCollectionDate'}
            placeholder={'DD/MM/YYYY'}
            type={"date"}
            value={preferredDate.split('T')[0] || preferredDate}
            readOnly={isReadOnly}
            onChange={(e, val) => {
                handleStateUpdate({ preferredDate: val })
            }} />
        {!isReadOnly && <span className={classNames(styles.currencyExchange, styles.invoiceCurrency, styles.radioBtn)}>
            <div>{"Invoice Currency"}<sup>*</sup></div>
            {currency && currency.map((item, i) => {
                return <span key={i}><input type={'radio'} name={"invoiceCurrency"} value={item.currency}
                    checked={item.currency === (invoiceCurrency && invoiceCurrency.currency)}
                    onChange={() => handleInvoiceCurrency({ ...item })} />{item.currency}</span>
            })}
        </span>}

        <h3 style={fullWidth}>Collection Address</h3>
        {!isReadOnly ?
            <CustomSelect
                required={true}
                label={'Collection Country'}
                name={'from'}
                options={fromOptions || []}
                value={from}
                onChange={handleFromDropdown}
            />
            : <Input
                label={'From Country'}
                value={from && from.label}
                readOnly={isReadOnly}
            />}
        {!isReadOnly ? <span className={styles.radioBtn}>
            <div>{"Collection Location?"}</div>
            {AddressOrParcelPoint && AddressOrParcelPoint.map((item, i) => {
                return <span key={i}><input type={'radio'} name={"collectionRadio"} value={item.label}
                    checked={showCollectionAddress ? item.id == 0 : item.id == 1}
                    onChange={() => handleStateUpdate({ showCollectionAddress: item.id === 0 },
                        () => handleParcelPointHighlight('from', item.id === 0))} />
                    {item.label}
                </span>
            })}
        </span> : <span></span>}

        {showCollectionAddress && <>
            {getInputOrSpan('Address 1', 'collectionAddress1', 'Address line 1', true, collectionAddress1, 'collectionAddress1')}
            {getInputOrSpan('Address 2', 'collectionAddress2', 'Address line 2', false, collectionAddress2, 'collectionAddress2')}
            {getInputOrSpan('City', 'collectionCity', 'City', true, collectionCity, 'collectionCity')}
            {getInputOrSpan('Postal Code', 'collectionPostalCode', 'Postal Code', from && from.label && from.label.toLowerCase() === 'united kingdom', collectionZipCode, 'collectionZipCode')}

        </>}
        {!showCollectionAddress && from !== false && <div style={fullWidth}>
            {getParcelPointAddress('collection')}
        </div>}
        <InputPlus label={"Sender's Phone no."} isReadOnly={isReadOnly} values={senderPhone} max={3} handleOnChange={(array)=>{handleStateUpdate({senderPhone: array})}} />
        {/* {getInputOrSpan("Sender's Phone no.", 'sendersPhoneNo', "Sender's Phone no.", true, senderPhone, 'senderPhone')} */}
        {getInputOrSpan("Sender's Name", 'sendersName', "Sender's Name", true, senderName, 'senderName')}
        {isReadOnly ?
            <span className={styles.readOnlySpan}>
                <label htmlFor='colIns'>{"Collection Instructions"}</label><br />
                <span id='colIns'>{collectionInstructions}</span>
            </span>
            : <div>
                <label>{"Collection Instructions"}</label>
                <Textarea
                    id={'collectionInstructions'}
                    value={collectionInstructions}
                    onChange={(e) => handleStateUpdate({ collectionInstructions: e.target.value })}
                    rows={3}
                    cols={2}
                    readOnly={isReadOnly}
                />
            </div>}
        <h3 style={fullWidth}>{'Receiver Address'}</h3>
        {!isReadOnly ?
            <CustomSelect
                required={true}
                label={'Delivery Country'}
                name={'to'}
                options={toOptions || []}
                className={classNames('deliveryCountryDropdown')}
                value={to}
                onChange={handleToDropdown}
            />
            : <Input
                label={'To Country'}
                value={to && to.label}
                readOnly={isReadOnly}
            />}
        {!isReadOnly ? <span className={styles.radioBtn}>
            <div>{"Receiver Location?"}</div>
            {AddressOrParcelPoint && AddressOrParcelPoint.map((item, i) => {
                return <span key={i}><input type={'radio'} name={"receiverRadio"} value={item.label}
                    checked={showReceiverAddress ? item.id == 0 : item.id == 1}
                    onChange={() => handleStateUpdate({ showReceiverAddress: item.id === 0 },
                        () => handleParcelPointHighlight('to', item.id === 0))} />
                    {item.label}
                </span>
            })}
        </span> : <span></span>}

        {showReceiverAddress && <>
            {getInputOrSpan('Address 1', 'receiverAddress1', 'Address line 1', true, deliveryAddress1, 'deliveryAddress1')}
            {getInputOrSpan('Address 2', 'receiverAddress2', 'Address line 2', false, deliveryAddress2, 'deliveryAddress2')}
            {getInputOrSpan('City', 'receiverCity', 'City', true, deliveryCity, 'deliveryCity')}
            {getInputOrSpan('Postal Code', 'receiverPostalCode', 'Postal Code', to && to.label && to.label.toLowerCase() === 'united kingdom', deliveryZipCode, 'deliveryZipCode')}

        </>}
        {!showReceiverAddress && to !== false && <div style={fullWidth}>
            {getParcelPointAddress('receiver')}
        </div>}
        <InputPlus label={"Receiver's Phone no."} isReadOnly={isReadOnly}  values={receiverPhone} max={3} handleOnChange={(array)=>{console.log(array); handleStateUpdate({receiverPhone: array})}} />
        {/* {getInputOrSpan("Receiver's Phone no.", 'receiversPhoneNo', "Receiver's Phone no.", true, receiverPhone, 'receiverPhone')} */}
        {getInputOrSpan("Receiver's Name", 'receiversName', "Receiver's Name", true, receiverName, 'receiverName')}
        {isReadOnly ?
            <span className={styles.readOnlySpan}>
                <label htmlFor='delIns'>{"Delivery Instructions"}</label><br />
                <span id='delIns'>{deliveryInstructions}</span>
            </span>
            : <div>
                <label>{"Delivery Instructions"}</label>
                <Textarea
                    id={'deliveryInstructions'}
                    value={deliveryInstructions}
                    onChange={(e) => handleStateUpdate({ deliveryInstructions: e.target.value })}
                    rows={3}
                    cols={2}
                    readOnly={isReadOnly}
                />
            </div>}
        <Input
            tooltipText={"enter no. of parcels"}
            id={'numberOfParcels'}
            label={"No. of Expected Parcels"}
            value={numberOfParcel}
            placeholder={"0"}
            readOnly={isReadOnly}
            type={"number"}
            onChange={(e, val) => {
                handleStateUpdate({ numberOfParcel: val })
            }} />
        {isReadOnly ?
            <span className={styles.readOnlySpan}>
                <label htmlFor='otherInfo'>{"Other Informations"}</label><br />
                <span id='otherInfo'>{otherInformations}</span>
            </span>
            : <div>
                <label>{"Other Informations"}</label>
                <Textarea
                    id={'otherInformations'}
                    value={otherInformations}
                    onChange={(e) => handleStateUpdate({ otherInformations: e.target.value })}
                    rows={3}
                    cols={2}
                    readOnly={isReadOnly}
                />
            </div>}
        <span></span>
        {!isReadOnly && <span>
            <Form.Group controlId="formFileSm" className="mb-3 fileUpload img">
                <Form.Label>Upload Parcel Images (max 3)</Form.Label>
                <input className={styles.fileUpload} type="file" accept="image/apng, image/avif, image/jpeg, image/png, image/svg+xml, image/webp" multiple onChange={(e) => handleParcelImages(e)} />
            </Form.Group>
        </span>}
        {!isReadOnly && <span>
            <Form.Group controlId="formFileSm" className="mb-3 fileUpload pdf">
                <Form.Label>Upload Parcel PDF (&lt;500KB)</Form.Label>
                <input type="file" accept="application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,text/plain, application/pdf" label="aaaa" onChange={handlePDFUpload}
                    onClick={e => e.target.value = null} />
            </Form.Group>
        </span>}
        {parcelImages && parcelImages.length > 0 ? <div>
            <div>Parcel Images</div>
            <div className={styles.parcelImg}>
                {parcelImages && parcelImages.map((item, i) => {
                    return <div key={i}>
                        {!isReadOnly && <IoMdCloseCircle
                            style={{ color: 'red', fontSize: 30, }}
                            disable
                            onClick={() => {
                                let list = [...parcelImages]
                                list.splice(i, 1);
                                handleStateUpdate({ parcelImages: list })
                            }} />}
                        {/* <span title={item.name}>{item.name}</span> */}
                        <img src={item.data} alt=""
                            style={{ width: '80px', height: '80px' }}
                            onClick={() => {
                                handleStateUpdate({ showImageViewer: true, currentImage: i })
                            }} />
                    </div>
                })}
            </div></div> : <div></div>}
        {parcelPdf && parcelPdf.fileData ? <div>
            {!isReadOnly && <IoMdCloseCircle
                style={{ color: 'red', fontSize: 30, }}
                disable
                onClick={() => { handleStateUpdate({ parcelPdf: {} }) }} />}
            <a href={parcelPdf.fileData} download={parcelPdf.fileName}>Download {parcelPdf.fileName}</a>
        </div> : <div></div>}


        {/* ========== I n s u r a n c e =========== */}
        {isReadOnly && insuranceRequired === 'No' ?
            <span>{'No insurance Details'} </span>
            : <span className={styles.radioBtn}>
                <div>{"Insurance Required?"}<sup> (optional)</sup></div>
                {insuranceRequiredList && insuranceRequiredList.map((item, i) => {
                    return <span key={i}><input disabled={isReadOnly} type={'radio'} name={"insurance"} value={item.label}
                        checked={item.label === insuranceRequired}
                        onChange={() => handleStateUpdate({ insuranceRequired: item.label }, getTotalValueFroInsurance)} />{item.label}</span>
                })}
            </span>}
        {insuranceRequired === "Yes" && <span style={fullWidth} className={styles.insuranceDetails}>
            <h4>{"Insurance Details"}</h4>
            <span className={styles.insuranceDetailsRowWrapper}>
                <span className={styles.insuranceDetailsRow}>
                    <span>{'Item description'}<sup>*</sup></span>
                    <span>{'Value'}({invoiceCurrency && invoiceCurrency.symbol})<sup>*</sup></span>
                    <span></span>
                </span>
                {insuranceDetails && insuranceDetails.map((item, i) => {
                    return (
                        <span key={i} className={styles.insuranceDetailsRow}>

                            <Input
                                id={`description${i}`}
                                value={item['itemDescription']}
                                readOnly={isReadOnly}
                                onChange={(e, val) => {
                                    let list = [...insuranceDetails]
                                    list[i]['itemDescription'] = val
                                    handleStateUpdate({ insuranceDetails: list })
                                }} />
                            <Input
                                id={`amount${i}`}
                                type={'number'}
                                min={"0"}
                                value={item['amount']}
                                readOnly={isReadOnly}
                                onChange={(e, val) => {
                                    let list = [...insuranceDetails]
                                    list[i]['amount'] = val
                                    let totalAmount = val * item['quantity']
                                    list[i]['totalAmount'] = totalAmount
                                    handleStateUpdate({ insuranceDetails: list }, getTotalValueFroInsurance)
                                }} />
                            {!isReadOnly && i !== 0 ? <ImCross
                                style={{ color: 'red', fontSize: 30, }}
                                disable
                                onClick={() => {
                                    let list = [...insuranceDetails]
                                    list.splice(i, 1);
                                    handleStateUpdate({ insuranceDetails: list }, getTotalValueFroInsurance)
                                }} />
                                : <span style={{ width: '30px' }}></span>}
                        </span>
                    )
                })}
            </span>
            {!isReadOnly && <Button classes={'primary'} text={'Add Item'} onClick={() => {
                handleStateUpdate({ insuranceDetails: [...insuranceDetails, {}] }, getTotalValueFroInsurance)
            }} />}

            <h6>{'1% of total amount to be paid as premium (Minimum amount €/£ 1.00)'}</h6>
            <span className={styles.dateTotalPremium}>
                <span>
                    <label>{'Total value'}({invoiceCurrency && invoiceCurrency.symbol})</label>
                    <div>{invoiceCurrency && invoiceCurrency.symbol}{insuranceTotalValue}</div>
                </span>
                <span>
                    <label>{'Premium'}({invoiceCurrency && invoiceCurrency.symbol})</label>
                    <div>{invoiceCurrency && invoiceCurrency.symbol}{insurancePremium}</div>
                </span>
                <span>
                    <label></label>
                    <div><a href="https://www.estolink.com/insurance/terms" target="_blank">Terms of Insurance</a></div>
                </span>
            </span>
        </span>
        }


        {/* ========== Additional Services ============ */}
        <div style={fullWidth} className={styles.additionalServices}>
            <label>{"Additional Services"}</label>
            {!isReadOnly ? <><div className={styles.additionalServicesDropdown} onClick={() => { handleStateUpdate({ showAddionalDropdown: !showAddionalDropdown }) }}>
                <span>{'Select'}</span>
                {showAddionalDropdown ? <MdOutlineKeyboardArrowUp /> : <MdOutlineKeyboardArrowDown />}
            </div>
                {showAddionalDropdown && (!isAdmin ? <div className={styles.serviceDropdownContent}>
                    {additionalServices && additionalServices.map((item, i) => {
                        return <div onClick={() => {
                            handleAdditionalCheckbox(item)
                        }}>
                            <input type={'checkbox'} checked={item.isChecked} />
                            <span>{item.label}</span>
                            {/* <span>{invoiceCurrency.symbol} {item.cost}</span> */}
                        </div>
                    })}
                </div>
                    : <div className={classNames(styles.adminServiceDropdown, styles.serviceDropdownContent)}>
                        {additionalServices.map((item, i) => {
                            return <div key={i} >
                                <span>
                                    <input type={'checkbox'} checked={item.isChecked} onChange={() => handleAdditionalCheckbox(item)} /></span>
                                <span>{item.label}</span>
                                <input
                                    placeholder={'Enter cost'}
                                    className={styles.additionCostInput}
                                    type={'number'}
                                    checked={item.isChecked}
                                    value={item.cost}
                                    onChange={(e) => handleAdditionalCost(i, e.target.value)}
                                />
                            </div>
                        })}
                    </div>)}</> :
                <ul>
                    {additionalServices && additionalServices.map((item, i) => {
                        if (item.isChecked)
                            return <li key={i}>{item.label}</li>
                    })}
                </ul>}

        </div>
        {getCashPaymentHTML()}
        {additionalServices && additionalServices[5] && additionalServices[5].isChecked && (isReadOnly
                ? <span className={styles.readOnlySpan}>
                    <label htmlFor='a'>{"Company Details"}</label><br />
                    <span id='a'>{companyDetails}</span>
                </span>
                : <div className={styles.companyDetails}>
                    <label>{"Company Details"}<sup>*</sup></label>
                    <Textarea
                        id={'companyDetails'}
                        value={companyDetails}
                        onChange={(e) => handleStateUpdate({ companyDetails: e.target.value })}
                        rows={3}
                        cols={2}
                        readOnly={isReadOnly}
                    />
        </div>)}
        {additionalServices && additionalServices[2] && additionalServices[2].isChecked && 
        <div>
            <label>Photo on delivery</label>
            {isAdmin && !isReadOnly && 
                <span>
                    <Form.Group controlId="formFileSm" className="mb-3 fileUpload img">
                        {/* <Form.Label>Photo on delivery</Form.Label> */}
                        <input className={styles.fileUpload} type="file" accept="image/apng, image/avif, image/jpeg, image/png, image/svg+xml, image/webp" multiple onChange={handleImgResizer} />
                    </Form.Group>
                </span>}
                {photoOnDelivery && photoOnDelivery.length > 0 ? <div>
                    
                    <div className={styles.parcelImg}>
                        {photoOnDelivery && photoOnDelivery.map((item, i) => {
                            return <div key={i}>
                                {!isReadOnly && <IoMdCloseCircle
                                    style={{ color: 'red', fontSize: 30, }}
                                    disable
                                    onClick={() => {
                                        let list = [...photoOnDelivery]
                                        list.splice(i, 1);
                                        handleStateUpdate({ photoOnDelivery: list })
                                    }} />}
                                {/* <span title={item.name}>{item.name}</span> */}
                                <img src={item.data} alt=""
                                    style={{ width: '80px', height: '80px' }}
                                    onClick={() => {
                                        handleStateUpdate({ showImageViewer: true, currentImage: i })
                                    }} />
                            </div>
                        })}
                    </div>
                </div> 
                : <div>No photo is uploaded</div>}
        </div>}
        {additionalServices && additionalServices[3] && additionalServices[3].isChecked && 
            <span className={styles.signatureWrapper}>
                <label id={"signaturePad"}>{"Signature On Delivery "}<sup style={{ color: '#eb4d4b', fontSize: '10px' }}>*</sup></label>
                <ReactSignatureCanvas id={'signaturePad'} canvasProps={{ width: 350, height: 220, className: 'sigCanvas' }} ref={(e) => signPad = e} onEnd={() => handleStateUpdate({ signatureOnDelivery: signPad && signPad.toDataURL('image/png')})} />
                {!isReadOnly && isAdmin && <Button text={'Clear'} classes={'secondary sm'} onClick={() => { signPad && signPad.clear(); handleStateUpdate({ signatureOnDelivery: '' }) }} />}

            </span> 
        }
        {isAdmin && <div style={fullWidth} className={styles.extraCost}>
            <h5 style={{ width: '100%' }}>Unexpected Cost</h5>
            {isReadOnly ? getInputOrSpan('Message', 'unexpectedCostMessage', 'message', false, unexpectedCost.message, '')
                : <Input type={'text'}
                    placeholder={'message'}
                    label={'Message'}
                    value={unexpectedCost.message}
                    onChange={(e) => { handleStateUpdate({ unexpectedCost: { ...unexpectedCost, message: e.target.value } }) }} />}

            {isReadOnly ? getInputOrSpan('Cost', 'unexpectedCost', 'cost', false, unexpectedCost.cost, '')
                : <Input type={'number'}
                    placeholder={'cost'}
                    label={'Cost'}
                    value={unexpectedCost.cost}
                    onChange={(e) => { handleStateUpdate({ unexpectedCost: { ...unexpectedCost, cost: e.target.value } }, handleTotalInvoiceAmount) }} />}


        </div>}
        {/* {
            additionalServices && additionalServices[4] && additionalServices[4].isChecked && (isReadOnly
                ? <span className={styles.readOnlySpan}>
                    <label htmlFor='a'>{"Cash Selection"}</label><br />
                </span>
                : <div className={styles.companyDetails}>
                    <label>{"Cash Selection"}<sup>*</sup></label><br />
                    {cashPaymentList && cashPaymentList.map((item, i) => {
                        return <span key={i}><input type={'radio'} name={"cashCollectionRadio"} value={item.label}
                            checked={item.value == cashCollectionRequired} />
                            <span>  </span>{item.label}
                            <br />
                        </span>
                    })}
                    <b>Note:</b><label className={styles.instructionLabel}>(All product purchases must be paid for in advance. The customer will be charged for any currency exchange and ATM fees.)</label>
                    <div>
                        <label>{"Instructions for cash handling"}</label>
                        <Textarea
                            id={'instructionsForCashHandling'}
                            value={instructionsForCashHandling}
                            onChange={(e) => handleStateUpdate({ instructionsForCashHandling: e.target.value })}
                            rows={1}
                            cols={1}
                            readOnly={isReadOnly}
                        />
                    </div>
                </div>)
        } */}
        {isAdmin &&
            <div style={fullWidth} className={styles.extraCost}>
                <h5 style={{ width: '100%' }}>Extra Cost</h5>
                {isReadOnly ? getInputOrSpan('Message', 'extraCostMessage', 'message', false, extraCost.message, '')
                    : <Input type={'text'}
                        placeholder={'message'}
                        label={'Message'}
                        value={extraCost.message}
                        onChange={(e) => { handleStateUpdate({ extraCost: { ...extraCost, message: e.target.value } }) }} />}

                {isReadOnly ? getInputOrSpan('Cost', 'extraCost', 'cost', false, extraCost.cost, '')
                    : <Input type={'number'}
                        placeholder={'cost'}
                        label={'Cost'}
                        value={extraCost.cost}
                        onChange={(e) => { handleStateUpdate({ extraCost: { ...extraCost, cost: e.target.value } }, handleTotalInvoiceAmount) }} />}


            </div>}
    </div >
}