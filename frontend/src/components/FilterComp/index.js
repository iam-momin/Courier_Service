import React, { Component } from 'react';
import Input from '../Input';
import styles from './styles.module.css'
import Select from 'react-select'
import Button from '../Button';
import classNames from 'classnames';
import { FiFilter } from 'react-icons/fi'
import CustomSelect from '../CustomSelect';
import { MdOutlineArrowForwardIos } from 'react-icons/md';

class FilterComp extends Component {
    constructor(props){
        super(props);
        this.state = {
            dropdownValue: props.filterList[0],
            date: '',
            invoiceStatus: null,
            orderStatus: null,
            claimStatus: null,
            inputValue: '',
            page: 1,
            count: 2800,
        }
    }
    UNSAFE_componentWillReceiveProps(nextProps){
        const {page, count} = nextProps
        if(page !== this.props.page){
            this.setState({page})
        }
        if(count !== this.props.count){
            this.setState({count})
        }
    }
    handleFilterClear=()=>{
        this.setState({
            dropdownValue: this.props.filterList[0],
            date: '',
            invoiceStatus: null,
            orderStatus: null,
            claimStatus: null,
            inputValue: '',
        })
        this.props.handleFilterClear()
    }
    handleFilter=()=>{
        const parentEle = document.getElementById('filterContainer')
        const childArray = Array.from(parentEle.children)
        parentEle.style.display = parentEle.style.display == 'none' ? 'flex' : 'none'
        childArray && childArray.map(item=>{
            const val = item.id == 'allInputsNdropdown' ? 'flex' : 'inline-block'
            const display = item.style.display == 'none' ? val : 'none'; 
            item.style.display = display
        })
        // document.getElementById('aVerticalSeparator').style.display = 'none'

    }
    handleOrderStatus=(e)=>{
        this.setState({orderStatus: e}, this.callHandleApply)
    }
    handleClaimStatus=(e)=>{
        this.setState({claimStatus: e}, this.callHandleApply)
    }
    callHandleApply=()=>{
        const {dropdownValue, invoiceStatus, orderStatus, date, inputValue, claimStatus, page, count} = this.state
        const {tableData} = this.props
        const filtered = []
        tableData && tableData.map((item, i)=>{
            const input = inputValue.length == 0 ? true : item[dropdownValue && dropdownValue.value] && item[dropdownValue && dropdownValue.value].toLowerCase().includes(inputValue.toLowerCase())
            const created = date.length == 0 ? true : item.createdAt.includes(date)
            const isOrderStatus = !orderStatus ? true : item.status && item.status.label === orderStatus.label;
            const isIvoiceStatus = !invoiceStatus ? true : item.invoiceStatus && item.invoiceStatus.label === invoiceStatus.label;
            const isClaimStatus = !claimStatus ? true : item.claimStatus && item.claimStatus.label === claimStatus.label
            
            if(input && created && isOrderStatus && isIvoiceStatus && isClaimStatus){
                filtered.push(item)
            }
        })
        
        this.props.handleFilterApply(filtered, {inputValue, dropdownValue, date, invoiceStatus, orderStatus, page, count})
    }
    render() {
        const {dropdownValue, invoiceStatus, orderStatus, date, inputValue, claimStatus, page, count} = this.state
        const {filterList, invoiceStatusList, orderStatusList, handleFilterApply, claimStatusList, isDateRequired, showPagination} = this.props
        return (
            <div className={styles.container} >
                <button
                    className={styles.filterBtn}
                    onClick={this.handleFilter}>
                        <FiFilter style={{fontSize: '18px'}} /> Filter</button>
                <div className={styles.filterContainer} id={'filterContainer'}>
                    <div className={styles.allInputsNdropdown} id={'allInputsNdropdown'}>
                        <input 
                            placeholder={`Enter ${dropdownValue.label}` }
                            type={'text'}
                            className={styles.allInputs}
                            onChange={(e)=>this.setState({inputValue: e.target.value})}
                            value={inputValue}
                            onBlur={this.callHandleApply}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter')
                                    this.callHandleApply()
                            }}
                            />
                        {/* <div className={styles.aVerticalSeparator} id={'aVerticalSeparator'}></div> */}
                        <Select name={'inputDropDown'}
                            options={filterList || []}
                            className={classNames(styles.dropdown, styles.filterListDropdown)}
                            value={dropdownValue}
                            onChange={(e) => this.setState({dropdownValue: e}, this.callHandleApply)}
                            components={{
                                IndicatorSeparator: () => null
                            }}
                            isSearchable={false}
                        />
                        </div>
                    {/* <div className={styles.aVerticalSeparator} id={'aVerticalSeparator'}></div> */}
                    {isDateRequired && <Input 
                        type={'date'}
                        value={date}
                        className={styles.dateInput}
                        onChange={(e, val)=> {
                                if(val != date)
                                this.setState({date:val}, this.callHandleApply)
                            }}
                        />}
                    {invoiceStatusList && invoiceStatusList.length > 0 && 
                        <CustomSelect 
                            name={'invoiceStatusDropDown'}
                            placeholder={'Invoice status'}
                            options={invoiceStatusList}
                            className={classNames(styles.dropdown, styles.statusDropdown)}
                            value={invoiceStatus}
                            onChange={(e) => this.setState({invoiceStatus: e}, this.callHandleApply)}
                            components={{
                                IndicatorSeparator: () => null
                            }}
                            isClearable={true}
                            isSearchable={false}
                        />}
                    {orderStatusList && orderStatusList.length > 0 && 
                        <CustomSelect
                            name={'orderStatusDropDown'}
                            placeholder={"Order status"}
                            options={orderStatusList}
                            className={classNames(styles.dropdown, styles.statusDropdown)}
                            value={orderStatus}
                            onChange={this.handleOrderStatus}
                            components={{
                                IndicatorSeparator: () => null
                            }}
                            isClearable={true}
                            isSearchable={false}
                        />}
                    {claimStatusList && claimStatusList.length > 0 && 
                        <CustomSelect
                            name={'orderStatusDropDown'}
                            placeholder={"Order status"}
                            options={claimStatusList}
                            className={classNames(styles.dropdown, styles.statusDropdown)}
                            value={claimStatus}
                            onChange={this.handleClaimStatus}
                            components={{
                                IndicatorSeparator: () => null
                            }}
                            isClearable={true}
                            isSearchable={false}
                        />}
                    {/* <Button text={'Apply'}
                        className={styles.filteApplyBtn}
                        onClick={()=> handleFilterApply({inputValue, dropdownValue, date, invoiceStatus, orderStatus})}
                        /> */}
                    <Button text={'Clear'}
                        classes={'secondary sm'}
                        className={styles.filterClearBtn}
                        onClick={this.handleFilterClear}
                        />
                </div>
                {showPagination && <div className={styles.pagination}>
                        <span>{((page * 50) + 1) - 50} - {(page * 50)} of {count}</span>
                        <span className={styles.arrowIcon} 
                            onClick={()=>{this.setState({page: page + 1}, this.callHandleApply)}}>
                            <MdOutlineArrowForwardIos />
                        </span>
                        <span className={styles.arrowIcon} 
                            onClick={()=>{this.setState({page: page - 1}, this.callHandleApply)}}>
                            <MdOutlineArrowForwardIos />
                        </span>
                </div>}
                
            </div>
        );
    }
}

export default FilterComp;