import axios from 'axios';
import React, { Component } from 'react';
import { IoIosRemoveCircle } from 'react-icons/io';
import { ImCross } from 'react-icons/im';
import ReactSignatureCanvas from 'react-signature-canvas';
import Switch from "react-switch";
import { API_HOST, HEADERS } from '../../constants';
import Button from '../Button';
import ConfirmationPopup from '../ConfirmationPopup';
import Input from '../Input';
import Textarea from '../Textarea';
import styles from './styles.module.css';

class CommercialFormPopup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            content: {},
            contentsDetails: [{ itemDescription: '', quantity: 1, value: '' }],
            totalValueOfGoods: 0,
            email: '',
            senderName: '',
            receiverName: '',
            senderAddress: '',
            receiverAddress: '',
            content: null,
            numberOfParcels: 0,
            originOfGoods: null,
            insuredFor: 0,
            signatureDataArray: '',
            totalWeight: 0,
            orderId: '',
            editDisabled: false,
            showConfirmationpoup: false,
            isAppliedForRelief: false,
            importDeclaration: {}
        }

        this.contentList = [
            { label: 'Gift', id: 1 },
            { label: 'Documents', id: 2 },
            { label: 'Sale of Goods', id: 3 },
            { label: 'Other (relocation)', id: 4 },
        ]
        this.originList = [{ label: 'GB', id: 1 }, { label: 'Other', id: 2, inputValue: '' }]
        this.originList = [{ label: 'GB', id: 1 }, { label: 'Other', id: 2, inputValue: '' }]
        this.importDecList = [{ label: 'Will do myself', id: 1 }, { label: 'Will hire an agent', id: 2 }]
        this.currentDate = `${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`
    }

    componentDidMount() {
        const { formData, isUserAdmin } = this.props
        const disableCutomerEdit = isUserAdmin ? false : formData.editDisabled
        this.setFormState(formData)
        const allInputs = Array.from(document.querySelectorAll('#commercialFormPopup input'))
        allInputs && allInputs.map(item => {
            if (item.id !== 'disabledInput') item.disabled = disableCutomerEdit
        })
        if (disableCutomerEdit) this.signPad.off()
    }
    setFormState = (formData) => {
        const { content, contents, email, senderName, receiverName, senderAddress, receiverAddress,
            numberOfParcels, originOfGoods, insuredFor, signatureDataArray, totalWeight, totalValueOfGoods,
            editDisabled, orderId, isAppliedForRelief, importDeclaration } = formData || {}
        this.setState({
            contentsDetails: contents && contents.length > 0 ? contents : [{ itemDescription: '', quantity: 1, value: '' }],
            totalValueOfGoods: totalValueOfGoods || 0,
            email: email,
            senderName: senderName,
            receiverName: receiverName,
            senderAddress: senderAddress,
            receiverAddress: receiverAddress,
            content: content || null,
            numberOfParcels: numberOfParcels,
            originOfGoods: originOfGoods || null,
            insuredFor: insuredFor || 0,
            signatureDataArray: signatureDataArray || '',
            totalWeight: totalWeight || 0,
            orderId: orderId,
            editDisabled,
            isAppliedForRelief: isAppliedForRelief,
            importDeclaration: importDeclaration || {}

        })
        this.signPad.fromDataURL(signatureDataArray)
    }
    handleContent = (item) => {
        this.setState({ content: item, isAppliedForRelief: '', importDeclaration: {} })
    }
    getPercentageVal = (val) => {
        return val ? (1 / 100) * val : 0
    }
    handleValidation = () => {
        const { content, originOfGoods, contentsDetails, isAppliedForRelief, importDeclaration, signatureDataArray } = this.state
        const { isUserAdmin } = this.props
        const validationList = [
            { id: 'sendersName', isRequired: true, },
            { id: 'receiversName', isRequired: true },
            { id: 'senderAddress', isRequired: true },
            { id: 'receiverAddress', isRequired: true },
            { id: 'numberOfParcels', isRequired: false },
            { id: 'insuredFor', isRequired: true },
            { id: 'signaturePad', isRequired: !isUserAdmin, stateName: signatureDataArray },
            { id: 'content', isRadio: true, isRequired: true, stateName: content },
            { id: 'originOfGoods', isRadio: true, isRequired: true, stateName: originOfGoods },
            { id: '', isList: true, isRequired: true, stateName: contentsDetails },
        ]
        let isEmpty = false
        validationList.map(item => {
            var re = /\S+@\S+\.\S+/;
            if (item.isList) {
                item.stateName && item.stateName.length > 0 && item.stateName.map((item2, i) => {
                    (!item2.itemDescription || item2.itemDescription === '') ?
                        document.getElementById(`description${i}`).setAttribute('style', 'border: 1px solid red')
                        : document.getElementById(`description${i}`).setAttribute('style', 'border: none')
                    !item2.quantity ?
                        document.getElementById(`quantity${i}`).setAttribute('style', 'border: 1px solid red')
                        : document.getElementById(`quantity${i}`).setAttribute('style', 'border: none')
                    !item2.value ?
                        document.getElementById(`value${i}`).setAttribute('style', 'border: 1px solid red')
                        : document.getElementById(`value${i}`).setAttribute('style', 'border: none')
                    if ((!item2.itemDescription || item2.itemDescription === '') || !item2.quantity || !item2.value) {
                        isEmpty = true
                    }

                })
            } else
                if (item.isRadio) {
                    if (item.stateName && item.stateName.label) {
                        if (item.id, document.getElementById(item.id)) {
                            document.getElementById(item.id).setAttribute('style', 'box-shadow: none')
                        }
                    } else {
                        if (item.id, document.getElementById(item.id)) {
                            document.getElementById(item.id).setAttribute('style', 'border: 1px solid red', 'border-radius: 4px')
                        }
                        isEmpty = true
                    }
                } else
                    if ((item.stateName === '') || (item.stateName && item.stateName.length === 0) || (document.getElementById(item.id) && document.getElementById(item.id).value === '') || (item.isEmail && !re.test(document.getElementById(item.id).value))) {
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
                            document.getElementsByClassName(item.id)[0].setAttribute('style', 'box-shadow: none')
                        }
                    }
        })
        if (content && content.id === 4) {
            if (isAppliedForRelief === '') {
                isEmpty = true
                document.getElementById('relief').setAttribute('style', 'border: 1px solid red')
            } else {
                document.getElementById('relief').setAttribute('style', 'border: none')
                if (isAppliedForRelief) {
                    if (importDeclaration && !importDeclaration.label) {
                        isEmpty = true
                        document.getElementById('whodoes').setAttribute('style', 'border: 1px solid red')
                    } else {
                        document.getElementById('whodoes').setAttribute('style', 'border: none')
                    }
                }
            }
        }
        return isEmpty

    }
    getTotalValueForGoods = () => {
        const { contentsDetails } = this.state
        let total = 0;
        contentsDetails && contentsDetails.map(item => {
            if (item.value)
                total += parseInt(item.totalAmount)
        })
        this.setState({ totalValueOfGoods: total })
    }

    handleDisableEdit = () => {
        const { editDisabled } = this.state
        const { formData } = this.props
        axios.put(`${API_HOST}/api/customInvoice/disableEdit/${formData && formData.orderId}`, { editDisabled: !editDisabled }, HEADERS)
            .then((res) => {
                this.setFormState(res && res.data)
                this.setState({ showConfirmationpoup: false })
            }).catch((error) => {
                console.log(error)
            })
    }
    render() {
        const { content, contentsDetails, totalValueOfGoods, email, senderName, receiverName, senderAddress, receiverAddress, numberOfParcels,
            insuredFor, totalWeight, originOfGoods, editDisabled, showConfirmationpoup, orderId, isAppliedForRelief, importDeclaration } = this.state
        const { handleSubmit, handleClose, formData, isUserAdmin } = this.props
        const { currency } = formData
        const disableCutomerEdit = isUserAdmin ? false : editDisabled
        return (
            <div className={styles.mainContainer}>
                <div className={styles.bodayContainer}>
                    <div className={styles.heading}>Commercial Form: {orderId}</div>
                    <div className={styles.bodaySubContainer} id={'commercialFormPopup'}>
                        {isUserAdmin ? <div className={styles.disableSwitch}>
                            <label htmlFor={'disbaleSwitch'}>Disable Edit&emsp;</label>
                            <Switch id={'disableSwitch'}
                                onChange={() => { this.setState({ showConfirmationpoup: true, }) }}
                                checked={editDisabled}
                                borderRadius={2}
                            // onColor={'#00FF80'} 
                            />
                        </div>
                            : disableCutomerEdit && <p className={styles.warning}>Edit is diabled. please contact us for any query.</p>}
                        <div className={styles.disableSwitch}></div>
                        <Input
                            disable
                            required
                            id={'orderId'}
                            label={'Order ID'}
                            value={orderId}
                        />
                        <div />
                        <Input
                            id={'sendersName'}
                            label={"Sender's name:"}
                            required
                            value={senderName}
                            onChange={(_e, val) => {
                                this.setState({ senderName: val })
                            }}
                        />
                        <Input
                            id={'receiversName'}
                            label={"Receiver's name:"}
                            required
                            value={receiverName}
                            onChange={(_e, val) => {
                                this.setState({ receiverName: val })
                            }}
                        />
                        <span>
                            <label>Sender's address:<sup style={{ color: '#eb4d4b', fontSize: '10px' }}>*</sup></label>
                            <Textarea
                                id={'senderAddress'}
                                value={senderAddress}
                                onChange={(e, _val) => {
                                    this.setState({ senderAddress: e.target.value })
                                }}
                                disabled={disableCutomerEdit} />
                        </span>
                        <span>
                            <label>Receiver's address:<sup style={{ color: '#eb4d4b', fontSize: '10px' }}>*</sup></label>
                            <Textarea
                                id={'receiverAddress'}
                                value={receiverAddress}
                                onChange={(e, _val) => {
                                    this.setState({ receiverAddress: e.target.value })
                                }}
                                disabled={disableCutomerEdit} />
                        </span>
                        <Input
                            type={'number'}
                            label={"Number of parcels:"}
                            id={'numberOfParcels'}
                            value={numberOfParcels}
                            onChange={(_e, val) => {
                                this.setState({ numberOfParcels: val })
                            }}
                        />
                        <span className={styles.twoInputContainer}>
                            <Input
                                type={'number'}
                                label={"Insured for €:"}
                                id={'insuredFor'}
                                required
                                value={`${insuredFor}`}
                                onChange={(_e, val) => {
                                    this.setState({ insuredFor: val })
                                }}
                            />
                            <Input
                                type={'number'}
                                label={"Total weight kg:"}
                                id={'totalWeight'}
                                value={totalWeight}
                                onChange={(_e, val) => {
                                    this.setState({ totalWeight: val })
                                }}
                            />
                        </span>

                        <span className={styles.twoInputContainer}>
                            {<span id={'content'}>
                                <div>{"Content"}<sup style={{ color: '#eb4d4b', fontSize: '10px' }}>*</sup></div>
                                {this.contentList && this.contentList.map((item, _i) => {
                                    return <span className={styles.radioBtnWrapper}><input type={'radio'} name={"content"} value={item.currency} id={item.label}
                                        checked={content && content.id === item.id}
                                        onChange={() => this.handleContent(item)} />
                                        <label htmlFor={item.label}>{item.label}</label></span>
                                })}
                            </span>}
                            {<span id={'originOfGoods'}>
                                <div>{"Origin of Goods:"}<sup style={{ color: '#eb4d4b', fontSize: '10px' }}>*</sup></div>
                                {this.originList && this.originList.map((item, _i) => {
                                    return <span className={styles.radioBtnWrapper}><input type={'radio'} name={"originOfGoods"} value={item.label} id={item.label}
                                        checked={originOfGoods && originOfGoods.id === item.id}
                                        onChange={() => { this.setState({ originOfGoods: item }) }} />
                                        {item.id !== 2 ? <label for={item.label}>{item.label}</label> :
                                            <Input placeholder={item.label}
                                                value={originOfGoods && originOfGoods.inputValue}
                                                disable={originOfGoods && originOfGoods.id !== 2 || originOfGoods === null}
                                                onChange={(_e, val) => {
                                                    this.setState({ originOfGoods: { ...originOfGoods, inputValue: val } })
                                                }} />}</span>
                                })}
                            </span>}
                        </span>
                        {content && content.id === 1 && <p>Customs info: Gift - private person to another private person - VAT is payable to Customs when value is 45€ or more. Additionaly, Customs duty is payable when the value is 500€ or more. Duty depends on the nature of goods. Option Gift does not apply when at least one party is a registered company.</p>}
                        {content && content.id === 2 && <p>Customs info: Documents - VAT is payable to Customs. Also Customs duty is payable when the value is 150€ or more. Duty depends on the nature of goods.</p>}
                        {content && content.id === 3 && <p>Customs info: Sale of Goods - VAT is payable to Customs. Also Customs duty is payable when the value is 150€ or more.  Duty depends on the nature of goods.</p>}
                        {content && content.id === 4 && <p>Customs info: Relocation - 100% Tax relief might be applicable upon proof of residency, otherwise VAT is payable to Customs. Also, Customs duty is payable when the value is 500€ or more.  Duty depends on the nature of goods.</p>}
                        <div></div>
                        {content && content.id === 4 && <span id={'relief'}>
                            <div>Will apply for tax relief?</div>
                            <span className={styles.radioBtnWrapper}>
                                <input type={'radio'}
                                    name={"relief"}
                                    value={"Yes"}
                                    id={'reliefYes'}
                                    checked={isAppliedForRelief == true}
                                    onChange={() => this.setState({ isAppliedForRelief: true, importDeclaration: {} })} />
                                <label htmlFor={'reliefYes'}>{'Yes'}</label>
                            </span>
                            <span className={styles.radioBtnWrapper}>
                                <input type={'radio'}
                                    name={"relief"}
                                    value={"No"}
                                    id={'reliefNo'}
                                    checked={isAppliedForRelief === false}
                                    onChange={() => this.setState({ isAppliedForRelief: false, importDeclaration: {} })} />
                                <label htmlFor={'reliefNo'}>{'No'}</label>
                            </span>
                        </span>}
                        {isAppliedForRelief && <span id={'whodoes'}>
                            <div>Tax relief? Who does the import declaration?</div>
                            {this.importDecList.map(item => {
                                return <>
                                    <span className={styles.radioBtnWrapper}>
                                        <input type={'radio'}
                                            name={"whodoes"}
                                            id={item.label}
                                            checked={importDeclaration.label == item.label}
                                            onChange={() => this.setState({ importDeclaration: item })} />
                                        <label htmlFor={item.label}>{item.label}</label>
                                    </span>
                                </>
                            })}

                            {/* <span className={styles.radioBtnWrapper}>
                                <input type={'radio'} 
                                    name={"whodoes"}
                                    id={'willHireAnAgent'}
                                    checked={isAppliedForRelief}
                                    onChange={() => this.setState({isAppliedForRelief: true})} />
                                <label htmlFor={'willHireAnAgent'}>{'Will hire an agent'}</label>
                            </span> */}
                        </span>}
                        <p>EstoLink will count and weigh all your parcels to give the most accurate information to Customs.</p>
                        {<span className={styles.contentsDetails}>
                            <h4>{"Contents"}<sup style={{ color: '#eb4d4b', fontSize: '10px' }}> </sup></h4>
                            <span className={styles.insuranceDetailsRowWrapper}>
                                <span className={styles.insuranceDetailsRow}>
                                    <span></span>
                                    <span>{'Item description'} <sup style={{ color: '#eb4d4b', fontSize: '10px' }}>*</sup></span>
                                    <span>{'Quantity'}</span>
                                    <span>{'Value'}({currency && currency.symbol}) <sup style={{ color: '#eb4d4b', fontSize: '10px' }}>*</sup></span>
                                    <span>{'Total Amount'}({currency && currency.symbol})</span>
                                </span>
                                {contentsDetails && contentsDetails.map((item, i) => {
                                    return (
                                        <span className={styles.insuranceDetailsRow}>
                                            {i !== 0 && !disableCutomerEdit ? <ImCross
                                                style={{ color: '#C60000', fontSize: 30, padding: '6px' }}
                                                disable
                                                onClick={() => {
                                                    let list = [...contentsDetails]
                                                    list.splice(i, 1);
                                                    this.setState({ contentsDetails: list }, this.getTotalValueForGoods)
                                                }} />
                                                : <span style={{ width: '30px' }}></span>}
                                            <Input
                                                id={`description${i}`}
                                                value={item['itemDescription'] || ''}
                                                onChange={(_e, val) => {
                                                    let list = [...contentsDetails]
                                                    list[i]['itemDescription'] = val
                                                    this.setState({ contentsDetails: list })
                                                }}
                                                disable={disableCutomerEdit} />
                                            <Input
                                                id={`quantity${i}`}
                                                type={'number'}
                                                min={"0"}
                                                value={item['quantity'] || ''}
                                                onChange={(_e, val) => {
                                                    let list = [...contentsDetails]
                                                    list[i]['quantity'] = val
                                                    let totalAmount = val * item['value']
                                                    list[i]['totalAmount'] = totalAmount
                                                    this.setState({ contentsDetails: list }, this.getTotalValueForGoods)
                                                }}
                                                disable={disableCutomerEdit} />
                                            <Input
                                                id={`value${i}`}
                                                type={'number'}
                                                min={"0"}
                                                value={item['value'] || ''}
                                                onChange={(_e, val) => {
                                                    let list = [...contentsDetails]
                                                    list[i]['value'] = val
                                                    let totalAmount = val * item['quantity']
                                                    list[i]['totalAmount'] = totalAmount
                                                    this.setState({ contentsDetails: list }, this.getTotalValueForGoods)
                                                }}
                                                disable={disableCutomerEdit} />
                                            <Input
                                                id={'disabledInput'}
                                                value={`${item.totalAmount || 0}`}
                                                disable
                                            />
                                        </span>
                                    )
                                })}
                            </span>
                            <span>
                                {!disableCutomerEdit &&
                                    <Button text={'Add Item'} classes={'primary sm'}
                                        onClick={() => {
                                            this.setState({ contentsDetails: [...contentsDetails, { itemDescription: '', quantity: 1, value: '' }] }, this.getTotalValueForGoods)
                                        }} />}
                            </span>
                            <span className={styles.exampleWrapper}>
                                <text>Examples:</text>
                                <text>Description: Baby toys, quantity: 5, value: 10, Item total: 50</text>
                                <text>Description: Trousers, quantity: 3, value: 20, Item total: 60</text>
                                <text>Description: Shoes, quantity: 11, value: 15, Item total: 165</text>
                                <text>Description: Handbags, quantity: 4, value: 25, Item total: 100</text>
                                <text>Description: Winter jackets, quantity: 2, value: 30, Item total: 60</text>
                                <br></br>
                                <i>DO NOT list multiple items or contents of one box in one line. Add more lines for different products.</i>
                            </span>

                            {/* <h6>{'1% of total amount to be paid as premium (Minimum amount €/£ 1.00)'}</h6> */}
                            <div className={styles.signatureContainer}>
                                <span className={styles.signatureWrapper}>
                                    <label id={"signaturePad"}>{"Signature Pad "}<sup style={{ color: '#eb4d4b', fontSize: '10px' }}>*</sup></label>
                                    <ReactSignatureCanvas id={'signaturePad'} canvasProps={{ width: 250, height: 150, className: 'sigCanvas' }} ref={(e) => this.signPad = e} onEnd={() => this.setState({ signatureDataArray: this.signPad && this.signPad.toDataURL('image/png') })} />
                                    {!disableCutomerEdit && <Button text={'Clear'} classes={'secondary sm'} onClick={() => { this.signPad && this.signPad.clear(); this.setState({ signatureDataArray: '' }) }} />}

                                </span>
                                <span className={styles.dateTotalPremium}>
                                    <span>
                                        <label>{'Date'}</label>
                                        <div>{this.currentDate}</div>
                                    </span>
                                    <span>
                                        <label>{'Total Value'}({currency && currency.symbol})</label>
                                        <div>{currency && currency.symbol}{totalValueOfGoods}</div>
                                    </span>
                                    {/* <span>
                                        <label>{'Premium'}({currency && currency.symbol})</label>
                                        <div>{currency && currency.symbol}{this.getPercentageVal(totalValueOfGoods)}</div>
                                    </span> */}
                                </span>
                            </div>
                        </span>}
                        <p>I, the undersigned ( {senderName} ), whose address is given on the item, certify that the particulars given in this declaration are correct and that this item does not contain any dangerous article or articles prohibited by legislation or by postal or customs regulations.</p>

                    </div>
                    <div className={styles.btnContainer}>
                        <Button text={'Close'} classes={'secondary'} onClick={handleClose} />
                        {!disableCutomerEdit && <Button text={'Submit'} classes={'primary'}
                            onClick={() => {
                                if (!this.handleValidation())
                                    handleSubmit({ content, contents: contentsDetails, totalValueOfGoods, senderName, email, receiverName, senderAddress, receiverAddress, numberOfParcels, insuredFor, totalWeight, originOfGoods, status: formData.status, currency: formData.currency, orderId: formData.orderId, signatureDataArray: this.signPad && this.signPad.toDataURL('image/png'), editDisabled, isAppliedForRelief, importDeclaration })
                            }} />}
                    </div>
                </div>
                {showConfirmationpoup &&
                    <ConfirmationPopup
                        header={'Confirm'}
                        text={'Are you sure you want to disable edit.'}
                        saveText={'Yes'}
                        cancelText={'No'}
                        handleSave={this.handleDisableEdit}
                        handleCancel={() => {
                            this.setState({ showConfirmationpoup: false })
                        }}
                    />
                }
            </div>
        );
    }
}

export default CommercialFormPopup;