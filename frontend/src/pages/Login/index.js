import React, { Component } from 'react';
import styles from './styles.module.css'
import axios from 'axios';
import { withRouter } from 'react-router-dom'
import Input from '../../components/Input';
import Button from '../../components/Button';
import { API_HOST, SET_HEADERS } from '../../constants';
import logo from '../../images/estolink_logo.png'

import { BiArrowBack } from 'react-icons/bi'
class Login extends Component {

    constructor(props) {
        super(props)
        this.state = {
            email: '',
            showEmailInput: true,
            isNewUser: false,
            regexError: null,
            matchPassError: null,
            wrongPassError: null,
            wrongEmail: null,
            showPassword: false
        }
    }

    handleContinue = () => {
        const { email } = this.state
        var re = /\S+@\S+\.\S+/;
        if (re.test(email)) {
            axios.get(`${API_HOST}/api/user/email=${email.toLocaleLowerCase()}`).then((response) => {
                // response.json()
                if (response.status === 200)
                    this.setState({ isNewUser: false, showEmailInput: false })
                else if (response.status === 202)
                    this.setState({ isNewUser: true, showEmailInput: false })
            })
                .then(function () {
                })
                .catch((error) => console.log(error));
        } else {
            this.setState({ wrongEmail: 'Please enter correct email format.' })
        }
    }

    handleCreate = () => {
        const { email, password, confirmPassword } = this.state

        if (this.regexPassValidation(password, confirmPassword)) {
            const params = JSON.stringify({ email: email.toLocaleLowerCase(), password: password, isAdmin: false })

            axios.post(`${API_HOST}/api/user`, params, {
                "headers": { "content-type": "application/json", }
            }).then((response) => {
                if (response) {
                    localStorage.setItem('token', response.data.token)
                    const redirect = response.data.isAdmin ? 'admin/' : '/customer/dashboard'
                    this.props.history.push(redirect)
                }
            }).catch(() => {

            }).then(() => {

            })
        }
    }

    handleLogin = () => {
        const { email, password } = this.state
        const params = JSON.stringify({ email: email.toLocaleLowerCase(), password: password })
        axios.post(`${API_HOST}/api/auth`, params, {
            "headers": { "content-type": "application/json", }
        }).then(response => {
            if (response) {
                localStorage.setItem('token', response.data.token)
                SET_HEADERS()
                const redirect = response.data.isAdmin ? 'admin/orders' : '/customer/dashboard'
                this.props.history.push(redirect)
            }
        }).catch(() => {
            this.setState({ wrongPassError: "Wrong password" })
        }).then(data => {
            console.log(data);
        })
    }

    regexPassValidation = (pass1, pass2) => {
        var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        const isValid = re.test(pass1)
        !isValid && this.setState({ matchPassError: "Inavlid password" })
        if (pass1 === pass2 || !isValid) {
            return isValid;
        } else {
            this.setState({ matchPassError: "Confirm password is not matching" })
        }

    }
    handleCalculator = () => {
        this.props.history.push('/calculator')
    }
    render() {
        const { showEmailInput, isNewUser, matchPassError, regexError, wrongPassError, email, password, confirmPassword, wrongEmail, showPassword } = this.state

        return (
            <div className={styles.mainContainer}>
                <div className={styles.leftContainer}>
                    <div className={styles.contentWrapper}>
                        <div className={styles.loginHeader}>
                            {!showEmailInput && <BiArrowBack style={{ fontSize: '30px' }} onClick={() => this.setState({ showEmailInput: true })} />}
                            <div>
                                <img src={logo} alt="Estolink" width="250" height="84"></img>
                            </div>

                        </div>
                        {showEmailInput && <><Input className={styles.emailInput}
                            label={"Email"}
                            type={'email'}
                            placeholder={'Enter your email'}
                            value={email}
                            minlength={5}
                            maxlength={32}
                            autoFocus={true}
                            onChange={(e) => {
                                this.setState({ email: e.target.value, wrongEmail: null })
                            }}
                            onEnter={this.handleContinue} />
                            {wrongEmail && <span className={styles.wrongEmail}>{wrongEmail}</span>}
                            <Button text={'Continue'} classes={'primary'} className={styles.continueBtn}
                                onClick={this.handleContinue} />
                            <span className={styles.calcText}>Here is our expected cost Calculator for your parcel.</span>
                            <Button text={'Calculate'} classes={'secondary'} className={styles.calculateBtn}
                                onClick={this.handleCalculator} /></>}
                        {!showEmailInput && (
                            isNewUser ? <>
                                {true && <span className={styles.passwordError}>
                                    {"Your password must have at least, 8 characters long, 1 uppercase, 1 lowercase, 1 number and 1 special character"}
                                </span>}
                                <Input className={styles.emailInput}
                                    label={"Password"}
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder={'Enter password'}
                                    errorLabel={regexError}
                                    value={password}
                                    autoFocus={true}
                                    onChange={(e) => {
                                        this.setState({ password: e.target.value, matchPassError: null })
                                    }}
                                    onEnter={this.handleCreate} />
                                <Input className={styles.emailInput}
                                    label={"Confirm Password"}
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder={'Confirm password'}
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        this.setState({ confirmPassword: e.target.value, matchPassError: null })
                                    }}
                                    onEnter={this.handleCreate} />
                                <span className={styles.showPassword}>
                                    <span>
                                        {matchPassError && <span className={styles.passwordError}>{matchPassError}</span>}
                                    </span>
                                    <span>
                                        <input type={'checkbox'} checked={showPassword} onChange={(e) => this.setState({ showPassword: !showPassword })} />
                                        <span>Show Password</span>
                                    </span>
                                </span>
                                <Button text={'Create'} classes={'primary'} className={styles.continueBtn}
                                    onClick={this.handleCreate} /></>
                                : <><Input className={styles.emailInput}
                                    label={"Password"}
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder={'Enter password'}
                                    errorLabel={wrongPassError}
                                    value={password}
                                    autoFocus={true}
                                    onChange={(e) => {
                                        this.setState({ password: e.target.value, wrongPassError: null })
                                    }}
                                    onEnter={this.handleLogin} />
                                    <span className={styles.showPassword}>
                                        <span>
                                            {wrongPassError && <span className={styles.passwordError}>{wrongPassError}</span>}
                                        </span>
                                        <span>
                                            <input type={'checkbox'} checked={showPassword} onChange={(e) => this.setState({ showPassword: !showPassword })} />
                                            <span>Show Password</span>
                                        </span>
                                    </span>
                                    <a href='/recover' className={styles.resetLink}>Forgot password?</a>
                                    <Button text={'Login'} classes={'primary'} className={styles.continueBtn}
                                        onClick={this.handleLogin} /></>
                        )}
                    </div>
                </div>
                {/* <div className={styles.rightContainer}>
                    <img src={image01} className={styles.image} />
                </div> */}
            </div>
        );
    }
}

export default withRouter(Login);