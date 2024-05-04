import { Checkbox } from '@material-ui/core'
import classNames from 'classnames'
import editImg from '../../images/im-edit-pencil.svg'
import trashImg from '../../images/im-trash.svg'
import Button from '../Button'
import CustomSelect from '../CustomSelect'
import Input from '../Input'
import styles from './styles.module.css'
export function CalculatorComp({
    parcelDetailsList, totals, showCollectionAddress, showReceiverAddress, inputValues, invoiceCurrency,
    fromParcelPoint, toParcelPoint, expectedCost, insuranceRequired, insurancePremium, fromParcelPointList, toParcelPointList,
    isAllFieldsFilled, handleAddItem, handleDelete, handleEdit, handletopParcelCheck, getParcelPointCost, handleSetInputValues,
    handleCalculate, handleFromParcelPoint, handleToParcelPoint, isReadOnly, handleDecleration, isNewForm, totalInvoiceAmount,
    extraCost, addServicesCost
}) {
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
    return <div className={classNames(styles.calculator, { [styles.viewFormContainer]: isReadOnly })}>
        <div className={styles.container}>
            <h4>{isReadOnly ? 'Parcel Details' : 'Enter Parcel Details'}</h4>
            <div className={styles.parcelDetails} id={'parcelDetails'}>
                {isReadOnly
                    ? <table className={styles.parcelDetailsTableView}>
                        <thead>
                            <tr className={styles.inputRow}>
                                <th>Top Parcel</th>
                                {columns && columns.map((item, i) => {
                                    return <th key={item.accesor}>
                                        {item.header}
                                    </th>
                                })}
                            </tr>
                        </thead>
                        <tbody className={parcelDetailsList.length > 5 ? styles.tbodyScroll : ''}>
                            {parcelDetailsList && parcelDetailsList.map((item, i) => {
                                return <tr key={i}>
                                    <td><Checkbox color='success' checked={item.isChecked} disabled={true} /></td>
                                    <td>{item.weight}</td>
                                    <td>{item.length}</td>
                                    <td>{item.width}</td>
                                    <td>{item.height}</td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                    : <table className={styles.parcelDetailsTable}>
                        <thead>
                            <tr className={styles.inputRow}>
                                <th>Top Parcel</th>
                                {columns && columns.map((item, i) => {
                                    return <th key={item.accesor}>
                                        <Input
                                            label={item.header}
                                            regex={/^\d*\.?\d*$/}
                                            placeholder={item.placeholder}
                                            errorLabel={'Invalid input'}
                                            onChange={(e, val) => handleSetInputValues(val, item)}
                                            value={inputValues[item.accesor]}
                                            disable={item.accesor === 'volume'}
                                        />
                                    </th>
                                })}
                                <th className={styles.addBtn}>
                                    <Button classes={'primary sm'} text={'Add Item'} onClick={handleAddItem} />
                                </th>
                            </tr>
                        </thead>
                        <tbody className={parcelDetailsList.length > 5 ? styles.tbodyScroll : ''}>
                            {parcelDetailsList && parcelDetailsList.map((item, i) => {
                                return <tr key={i}>
                                    <td>
                                        <Checkbox color='success' checked={item.isChecked} onChange={(e, isChecked) => handletopParcelCheck(e, isChecked, i)} />
                                    </td>
                                    <td>{item.weight}</td>
                                    <td>{item.length}</td>
                                    <td>{item.width}</td>
                                    <td>{item.height}</td>
                                    <td>
                                        <span onClick={() => handleDelete(i)}>
                                            <img src={trashImg} />
                                        </span>
                                        <span onClick={() => handleEdit(item, i)}>
                                            <img src={editImg} />
                                        </span>

                                    </td>
                                </tr>
                            })}
                        </tbody>
                    </table>}
            </div>
            {isNewForm && <div className={styles.declaration} id="declaration">
                <input type="checkbox" id="declaration1" name="declaration" style={{ margin: '4px' }} onChange={handleDecleration} ></input>
                <label htmlFor="declaration1"> I agree to the <a target="_blank" href="https://www.estolink.com/terms">Terms and conditions</a> of EstoLink transport services.<sup style={{ color: '#eb4d4b', fontSize: '10px' }}>*</sup></label>
            </div>}

            <div className={styles.totalContainer}>
                <h4>Sum of all parcel details</h4>
                <div className={styles.totalWrapper}>
                    <div className={styles.totalWeight}>
                        <span>Total Weight</span>
                        <span>{totals.weight} {totals.weight != 0 && <label>kg</label>}</span>
                    </div>
                    <div className={styles.totalVolume}>
                        <span>Total Volume</span>
                        <span>{totals.volume && parseFloat(totals.volume).toFixed(3)} {totals.volume != 0 && <label>m<sup style={{ color: '#000' }}>3</sup></label>}</span>
                    </div>
                </div>
            </div>

            {(showCollectionAddress || showReceiverAddress) && <div className={styles.addressContainer}>
                <h4>Select Location</h4>
                <div className={styles.dropdownWrapper}>
                    {isReadOnly ?
                        <Input
                            label={'From Location: '}
                            value={fromParcelPoint && fromParcelPoint.label}
                            readOnly={isReadOnly}
                        />
                        : <span className={!showCollectionAddress && styles.disable}>
                            {showCollectionAddress && <CustomSelect
                                label={'From Location:'}
                                name={'fromParcelPoint'}
                                options={fromParcelPointList}
                                className={classNames(styles.dropdown, 'fromParcelPointDropdown')}
                                isDisabled={!showCollectionAddress}
                                value={fromParcelPoint}
                                onChange={handleFromParcelPoint}
                            />}
                        </span>}
                    {isReadOnly ?
                        <Input
                            label={'To Location: '}
                            value={toParcelPoint && toParcelPoint.label}
                            readOnly={isReadOnly}
                        />
                        : <span className={!showReceiverAddress && styles.disable}>
                            {showReceiverAddress && <CustomSelect
                                label={'To Location:'}
                                name={'toParcelPoint'}
                                className={'toParcelPointDropdown'}
                                options={toParcelPointList}
                                isDisabled={!showReceiverAddress}
                                value={toParcelPoint}
                                onChange={handleToParcelPoint}
                            />}
                        </span>}
                </div>
            </div>}

            <div className={styles.calculateWrapper}>
                <h4>Calculated the expected cost</h4>
                {' '}
                <table className={styles.costTable}>
                    <tbody>
                        <tr>
                            <td>Expected Cost for all parcels: </td>
                            <td>{invoiceCurrency && invoiceCurrency.symbol} <strong style={{ fontSize: '24px' }}>{parseFloat(expectedCost)}</strong>{" "}{invoiceCurrency && invoiceCurrency.currency}</td>
                        </tr>
                        {insuranceRequired && insuranceRequired === "Yes" && <tr>
                            <td>Insurance Premium: </td>
                            <td>{invoiceCurrency && invoiceCurrency.symbol} <strong style={{ fontSize: '24px' }}>{insurancePremium}</strong>{" "}{invoiceCurrency && invoiceCurrency.currency}</td>
                        </tr>}
                        <tr>
                            <td>Expected Total Amount: </td>
                            <td>{invoiceCurrency && invoiceCurrency.symbol}: <strong style={{ fontSize: '24px' }}>{totalInvoiceAmount}</strong>{" "}{invoiceCurrency && invoiceCurrency.currency}</td>
                        </tr>

                    </tbody>
                </table>
            </div>
        </div>
    </div>
}