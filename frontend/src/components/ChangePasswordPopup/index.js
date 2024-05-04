import axios from 'axios';
import React, { Component } from 'react';
import { API_HOST, HEADERS } from '../../constants';
import Button from '../Button';
import Input from '../Input';
import styles from './styles.module.css';

class ChangePasswordPopup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
            errorMsg: '',
        }
    }

    regexPassValidation = (pass1, pass2) => {
        var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        const isValid = re.test(pass1)
        !isValid && this.setState({ regexError: "Inavlid password" })
        if (pass1 === pass2) {
            this.setState({ errorMsg: isValid ? '' : "Your password must have at least, 8 characters long, 1 uppercase, 1 lowercase, 1 number and 1 special character" })
            return isValid;
        } else {
            this.setState({ errorMsg: "Confirm password is not matching" })
            return false;
        }

    }

    handleUpdate = () => {
        const { oldPassword, newPassword, confirmPassword } = this.state
        if (this.handleValidation()) return this.setState({ errorMsg: "Required fields can't be empty." })
        if (this.regexPassValidation(newPassword, confirmPassword)) {
            const payload = { oldPassword, newPassword }
            axios.put(`${API_HOST}/api/user/changePassword`, payload, HEADERS)
                .then(() => {
                    this.props.handleCancel()
                }).catch(() => {

                })
        }
    }

    handleValidation = () => {
        const { oldPassword, newPassword, confirmPassword } = this.state
        const validationList = [
            { id: 'oldPassword', stateName: oldPassword },
            { id: 'newPassword', stateName: newPassword },
            { id: 'confirmPassword', stateName: confirmPassword },
        ]
        let isEmpty = false
        validationList.map(item => {
            const element = document.getElementById(item.id)
            if (item.stateName.length === 0) {
                element && element.setAttribute('style', 'box-shadow: 0 0 2px 1px red')
                isEmpty = true
            } else {
                element && element.setAttribute('style', 'box-shadow: 0 0 2px 0px #212224')
            }
        })
        return isEmpty
    }

    render() {
        const { oldPassword, newPassword, confirmPassword, errorMsg } = this.state
        const { handleCancel } = this.props
        return (
            <div className={styles.passContainer}>
                <div className={styles.wrapper}>
                    <div className={styles.bodyContainer}>
                        <h3>Change Password</h3>
                        <Input
                            id={'oldPassword'}
                            label={'Old Password'}
                            placeholder={'Old Password'}
                            type={'password'}
                            value={oldPassword}
                            onChange={(e, val) => {
                                this.setState({ oldPassword: val })
                            }}
                        />
                        <Input
                            id={'newPassword'}
                            label={'New Password'}
                            placeholder={'New Password'}
                            type={'password'}
                            value={newPassword}
                            onChange={(e, val) => {
                                this.setState({ newPassword: val })
                            }}
                        />
                        <Input
                            id={'confirmPassword'}
                            label={'Confirm Password'}
                            placeholder={'Confirm Password'}
                            type={'password'}
                            value={confirmPassword}
                            onChange={(e, val) => {
                                this.setState({ confirmPassword: val })
                            }}
                        />
                        <span className={styles.errorMsg}>{errorMsg}</span>
                    </div>
                    <div className={styles.btnContainer}>
                        <Button text={'Cancel'}
                            classes={'secondary'}
                            onClick={() => {
                                handleCancel()
                            }} />
                        <Button text={'Update'}
                            classes={'primary'}
                            onClick={() => {
                                this.handleUpdate()
                            }} />
                    </div>
                </div>
            </div>
        );
    }
}

export default ChangePasswordPopup;