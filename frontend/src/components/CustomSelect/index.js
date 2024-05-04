import React, { Fragment } from "react";
import Select, { components } from "react-select";
import "./styles.css";
import { MdOutlineArrowDropUp, MdOutlineArrowDropDown } from 'react-icons/md'
import { TiArrowSortedDown} from 'react-icons/ti'

export default function CustomSelect({name, label, id, options, className, value, onChange, isDisabled, isClearable, isSearchable, menuPlacement, customStyles, required}){
    return (
      <span className={'customDropdown'}>
        {label && label !== '' && <label>{label}{required && <sup style={{ color: '#eb4d4b', fontSize: '10px' }}>*</sup>}</label>}
        <Select
            name={name}
            id={id}
            options={options}
            className={className}
            value={value}
            onChange={onChange}
            components={{
                IndicatorSeparator: () => null,
                IndicatorsContainer: () => <TiArrowSortedDown style={{fontSize: '20px', color: '#000080'}} />,
                DropdownIndicator: () => <MdOutlineArrowDropUp />
            }}
            isDisabled={isDisabled}
            isClearable={isClearable}
            isSearchable={isSearchable}
            menuPlacement={menuPlacement}
            styles={customStyles}
        />
      </span>
    );
  };