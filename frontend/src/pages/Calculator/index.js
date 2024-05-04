import axios from 'axios';
import classNames from 'classnames';
import React, { Component } from 'react';
import CustomSelect from '../../components/CustomSelect';
import Input from '../../components/Input';
import { API_HOST, GET_VOLUME } from '../../constants';
import editImg from '../../images/im-edit-pencil.svg';
import trashImg from '../../images/im-trash.svg';
import styles from './styles.module.css';
// import {getAllInfoByISO} from 'iso-country-currency'

class Calculator extends Component {
    constructor(props) {
        super(props)
        this.state = {
            parcelDetailsList: [],
            weight: '',
            volume: '',
            length: '',
            width: '',
            height: '',
            inputValues: { weight: 0, volume: 0, length: 0, width: 0, height: 0 },
            totals: { weight: 0, volume: 0, length: 0, width: 0, height: 0 },
            isEditing: false,
            from: '',
            to: '',
            expectedCost: 0,
            fromOptions: [],
            toOptions: [],
            currency: { currency: "GBP", iso: "UK", symbol: "£", baseVal: 1 }
        }
        this.currency = [{ currency: "GBP", iso: "UK", symbol: "£", baseVal: 1 },//0.85
        { currency: "EUR", iso: "EU", symbol: "€", baseVal: 1.17 }]//1

        this.editingItem = { weight: 0, height: 0, width: 0, length: 0, height: 0 }


        this.dropdownData = []

    }


    componentDidMount() {
        // this.setState({fromOptions : this.allContriesDropdown, toOptions : this.allContriesDropdown})
        axios.get(`${API_HOST}/api/country`).then((res) => {//'http://localhost:3000/api/country'
            if (res) {
                this.dropdownData = res.data
                let dropdownData = res.data && res.data.map(item => {
                    return { label: item.from.toUpperCase(), value: item.from.toLowerCase() }
                })
                this.setState({ fromOptions: dropdownData, toOptions: dropdownData })
            }
        }).catch((error) => {

        })
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

    }
    handleDelete = (targetIndex) => {
        let parcelDetailsList = this.state.parcelDetailsList.slice()
        let { weight, length, width, height, volume } = parcelDetailsList[targetIndex]
        let { totals } = this.state
        weight = totals.weight - weight
        length = totals.length - length
        width = totals.width - width
        height = totals.length - length
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
        let { totals, from, to, currency } = this.state;
        let result = 0
        let liter = (totals.volume * 1000)
        let perKg, perLiters = 0, kgThreshold, literTHreshold;
        if (totals.weight > 0 && totals.volume > 0 && to.label && from.label) {
            this.dropdownData && this.dropdownData.map(item => {
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
            result = result * currency.baseVal
            if (result >= 0) {
                this.setState({ expectedCost: result.toFixed(2) })
            }
        }

    }

    isAnythingEmpty = () => {
        const { totals, from, to } = this.state
        return totals.weight == 0 || totals.volume == 0 || from == '' || to == ''
    }

    handleFromDropdown = (e, val) => {
        let toOptions = [], currency = {}
        this.dropdownData && this.dropdownData.map(item => {
            if (item.from && item.from.toLowerCase() === e.value.toLowerCase()) {
                let keys = Object.keys(item.to)
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

            this.setState({ currency: { currency: "EUR", iso: "EU", symbol: "€", baseVal: 1 } })
        }
        this.setState({ from: e, to: '', toOptions, expectedCost: 0 }, this.handleCalculate)
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

        this.setState({ to: e, expectedCost: 0 }, this.handleCalculate)
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

    handleCurrency = (val, e) => {
        let currency = {}
        this.currency && this.currency.map(item => {
            if (item.currency === val.target.value) {
                currency = item
            }
        })

        this.setState({ currency }, this.handleCalculate)

    }

    render() {
        const { parcelDetailsList, totals, expectedCost, fromOptions, toOptions, from, to, currency } = this.state

        const columns = [
            {
                header: 'Weight(kg)',
                accesor: 'weight',
                placeholder: 'Enter weight'
            }, {
                header: 'Length(cm)',
                accesor: 'length',
                placeholder: 'Enter length'
            }, {
                header: 'Width(cm)',
                accesor: 'width',
                placeholder: 'Enter width'
            }, {
                header: 'Height(cm)',
                accesor: 'height',
                placeholder: 'Enter height'
            },
        ]

        const options = [
            { label: 'UK', value: 'uk' },
            { label: 'FL', value: 'FL' },
            { label: 'EU', value: 'eu' },
        ]
        return (
            <div className={styles.mainContainer}>
                <div className={styles.container}>
                    <h3>Calculate Expected Cost</h3>
                    <h4>Enter Parcel Details</h4>
                    <div className={styles.parcelDetails}>
                        <table className={styles.parcelDetailsTable}>
                            <thead>
                                <tr className={styles.inputRow}>
                                    {columns && columns.map((item, i) => {
                                        return <th key={item.accesor}>
                                            <Input
                                                label={item.header}
                                                regex={/^\d*\.?\d*$/}
                                                placeholder={item.placeholder}
                                                errorLabel={'Invalid input'}
                                                onChange={(e, val) => {
                                                    this.setState({ inputValues: { ...this.state.inputValues, [item.accesor]: val } })
                                                }}
                                                value={this.state.inputValues[item.accesor]}
                                                disable={item.accesor === 'volume'}
                                                required={item.accesor !== 'volume'} />
                                        </th>
                                    })}
                                    <th>
                                        <span className={classNames(styles.addItem, this.isAllFieldsFilled() && styles.disableAdd)} onClick={this.handleAddItem}>
                                            Add Item
                                        </span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className={parcelDetailsList.length > 5 && styles.tbodyScroll}>
                                {parcelDetailsList && parcelDetailsList.map((item, i) => {
                                    return <tr>
                                        <td>{item.weight}</td>
                                        <td>{item.length}</td>
                                        <td>{item.width}</td>
                                        <td>{item.height}</td>
                                        {/* <td>{item.volume}</td> */}
                                        <td>
                                            <span onClick={() => this.handleDelete(i)}>
                                                <img src={trashImg} />
                                            </span>
                                            <span onClick={() => this.handleEdit(item, i)}>
                                                <img src={editImg} />
                                            </span>
                                        </td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className={styles.totalContainer}>
                        <h4>Sum of all parcel details</h4>
                        <div className={styles.totalWrapper}>
                            <div className={styles.totalWeight}>
                                <span>Total Weight</span>
                                <span>{totals.weight}</span>
                            </div>
                            <div className={styles.totalVolume}>
                                <span>Total Volume</span>
                                <span>{totals.volume && totals.volume.toFixed(3)}</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.addressContainer}>
                        <h4>Select Country</h4>
                        <div className={styles.dropdownWrapper}>
                            <span>
                                <CustomSelect
                                    label={'From'}
                                    name={'from'}
                                    options={fromOptions}
                                    className={styles.dropdown}
                                    value={from}
                                    onChange={this.handleFromDropdown}
                                />
                            </span>
                            <span>
                                <CustomSelect
                                    label={'To'}
                                    name={'to'}
                                    options={toOptions}
                                    value={to}
                                    onChange={this.handleToDropdown}
                                />
                            </span>
                        </div>
                    </div>
                    <div className={styles.currencyExchange}>
                        {this.currency && this.currency.map((item, i) => {
                            return <span><input type={'radio'} name={item.currency} value={item.currency}
                                checked={item.currency === (currency && currency.currency)}
                                onChange={this.handleCurrency} />{item.currency}</span>
                        })}


                    </div>
                    <div className={styles.calculateWrapper}>
                        <h4>Calculate the expected cost</h4>
                        {/* <Button text={'Calulate'}
                            onClick={()=>{
                                if(from && to)
                                    this.handleCalculate()
                            }}
                            disabled={false} /> */}
                        {' '}
                        <span>Expected Cost for all parcels is &nbsp;{currency && currency.symbol}: <strong style={{ fontSize: '24px' }}>{expectedCost}</strong>{" "}{currency && currency.currency}</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default Calculator;