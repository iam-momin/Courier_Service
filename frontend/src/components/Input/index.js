import classNames from 'classnames';
import PropTypes from "prop-types";
import React, { Component } from 'react';
import { MdOutlineInfo } from 'react-icons/md';
import TooltipComp from '../TooltipComp';
import styles from './styles.module.css';

class Input extends Component {
    static propTypes = {
        className: PropTypes.string,
        label: PropTypes.string,
        placeholder: PropTypes.string,
        type: PropTypes.string,
        errorLabel: PropTypes.string,
        onChange: PropTypes.func,
        regex: PropTypes.object,
        autoFocus: PropTypes.bool
    };

    static defaultProps = {
        className: '',
        label: '',
        placeholder: '',
        type: '',
        min: '',
        errorLabel: '',
        onChange: f => f,
        regex: /.*/,
        autoFocus: false
    };

    constructor(props) {
        super(props)
        this.state = {
            showError: false
        }
    }
    getInfoTooltip=()=>{
        return <sup style={{fontSize: '12px'}}>
            <TooltipComp
                text={this.props.tooltipText}
                component={
                    <span>
                        <MdOutlineInfo />
                    </span>}/>
            </sup>
    }
    render() {
        const { className, label, placeholder, type, min, onChange, errorLabel, regex, value,
            onEnter, id, disable, required, minlength, maxlength, onFocus, onBlur, readOnly, autoFocus, tooltipText } = this.props
        const { showError } = this.state
        return (
            <span className={classNames(styles.wrapper, className)}>
                {label && <label>{label}{required && !readOnly && <sup>*</sup>} {tooltipText && this.getInfoTooltip()}</label>}
                <input type={type} min={min} placeholder={placeholder} onChange={(e) => {
                    if (regex.test(e.target.value)) {
                        onChange(e, e.target.value)
                        this.setState({ showError: false })
                    } else if (!showError) {
                        this.setState({ showError: true })
                    }
                }}
                    value={value || ''}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && onEnter)
                            onEnter(e)
                    }}
                    id={id}
                    disabled={disable}
                    minLength={minlength}
                    maxLength={maxlength}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    readOnly={readOnly}
                    autoFocus={autoFocus}
                />
                {showError && errorLabel && <span className={styles.errorLabel}>{errorLabel}</span>}
            </span>
        );
    }
}

export default Input;