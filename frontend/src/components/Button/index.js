import classNames from 'classnames';
import PropTypes from "prop-types";
import React from 'react';
import './styles.css';

function Button({text, className, onClick, disabled, color, bgColor, classes}){
    return (
        <button className={classNames('mainButton', className, classes,)} style={{color: color, background: bgColor}}
        onClick={onClick} disabled={disabled}>{text}</button>
    );
}

Button.propTypes = {
    text: PropTypes.string,
    className: PropTypes.string,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    classes: PropTypes.string
}

Button.defaultProps = {
    text: '',
    className: '',
    onClick: f => f,
    disabled: false,
    classes: ''
}

export default Button;