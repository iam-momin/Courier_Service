import React, { Component } from 'react';
import styles from './styles.module.css'
import Button from '../../../src/components/Button';
import {IoCheckmarkDoneOutline} from 'react-icons/io5'
import {ImCross, ImCheckmark} from 'react-icons/im'
import Alert from 'react-bootstrap/Alert'

class SuccessPopup extends Component {
    static propTypes = {
        type: "",
        message: "",
        title: '',
        show: false
    };

    setShow(h) {
        this.show = h
    }

    render() {
        const { successText, errorText, isSuccess, onClick } = this.props
        return (
            <div className={styles.successContainer}>
                <div className={styles.successBody}>
                    {isSuccess ? <span className={styles.checkIcon}>
                        <ImCheckmark style={{ color: 'white', fontSize: '30px' }} />
                    </span>
                    : <span className={styles.crossIcon}>
                        <ImCross style={{ color: 'white', fontSize: '30px' }} />
                    </span>}
                    <div className={styles.bodyText}>{isSuccess ? successText : errorText}</div>
                    <Button text={'OK'} classes={isSuccess ? 'primary' : 'secondary danger'} className={styles.okBtn} onClick={onClick} />
                </div>
            </div>
        );
    }
}

export default SuccessPopup;