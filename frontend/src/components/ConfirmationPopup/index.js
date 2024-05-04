import React, { Component } from 'react';
import Button from '../Button';
import styles from './styles.module.css';

class ConfirmationPopup extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    render() {
        const { header, text, saveText, cancelText, handleSave, handleCancel } = this.props
        return (
            <div className={styles.popupContainer}>
                <div className={styles.popupWrapper}>
                    <div className={styles.popupBody}>
                        <div className={styles.header}>{header || ''}</div>
                        <div className={styles.text}>{text || ''}</div>
                    </div>
                    <div className={styles.popupBtnWrapper}>
                        <Button text={cancelText || ''} classes={'secondary sm'} onClick={handleCancel} />
                        <Button text={saveText || ''} className={'primary sm'} onClick={handleSave} />
                    </div>
                </div>
            </div>
        );
    }
}

export default ConfirmationPopup;