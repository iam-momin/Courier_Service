
import axios from 'axios';
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import Button from '../../components/Button';
import Input from '../../components/Input';
import SuccessPopup from '../../components/SuccessPopup';
import { API_HOST } from '../../constants';
import styles from './styles.module.css'
import Loader from "react-js-loader";
import { BiArrowBack } from 'react-icons/bi';

class Password extends Component {
    constructor(props){
        super(props)
        this.state = {
            showPasswords: true,
            showLoader: false,
            showSuccessPopup: false,
            email: '',
            newPassword: '',
            confirmPassword: '',
            warningMsg: null,
            successMsg: '',
            errorMsg: '',
        }

    }
    UNSAFE_componentWillMount(){
        const query = new URLSearchParams(this.props.history.location.search).getAll('token')
        this.setState({showPasswords: query.length === 1})
    }

    regexPassValidation = (pass1, pass2) => {
        var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        const isValid = re.test(pass1)
        if (pass1 === pass2 || !isValid) {
            !isValid && this.setState({ warningMsg: "Inavlid password" })
            return isValid;
        } else {
            this.setState({ warningMsg: "Confirm password is not matching" })
        }

    }
    handleResetPassword=async ()=>{
        const {newPassword, confirmPassword} = this.state
        if(this.regexPassValidation(newPassword, confirmPassword)){
            const query = new URLSearchParams(this.props.history.location.search)
            this.setState({showLoader: true})
            const res = await axios.put(`${API_HOST}/api/resetPassword`,{password: newPassword, userId: query.get('id'), token: query.get('token')})
            .then((response) => {
                this.setState({showSuccessPopup: true, isSuccess: true, successMsg: 'Password updated successfully', showLoader: false})
            }).catch((error) => {
                this.setState({showSuccessPopup: true, isSuccess: false, errorMsg: 'Something went wrong', showLoader: false})
            })
            console.log(res);
        }
    }
    handleSendEmail=(e)=>{
        const { email } = this.state
        var re = /\S+@\S+\.\S+/;
        if (re.test(email)) {
            this.setState({showLoader: true})
            axios.get(`${API_HOST}/api/resetPassword/email/${email.toLocaleLowerCase()}`).then((response) => {
                this.setState({showSuccessPopup: true, isSuccess: true, successMsg: 'Email sent successfully', showLoader: false})
            }).catch((error) => {
                this.setState({showSuccessPopup: true, isSuccess: false, errorMsg: 'Invalid email address', showLoader: false})
            });
        } else {
            this.setState({ warningMsg: 'Please enter correct email format.' })
        }
    }
    render() {
        const {showPasswords, email, warningMsg, showSuccessPopup, isSuccess, successMsg, errorMsg, showLoader, newPassword, confirmPassword} = this.state
        return (
            <div className={styles.container}>
                <div className={styles.wrapper}>
                    <div className={styles.header}>
                        <BiArrowBack style={{ fontSize: '30px', cursor: 'pointer' }} onClick={() => this.props.history.push({pathname: '/login'})} />
                        <h4>Reset Password</h4>
                    </div>
                    {showPasswords 
                    ? <>
                        
                        <p>Enter your new password</p>
                        <Input type={'password'}
                            label={'New Password'}
                            value={newPassword}
                            onChange={(e, val)=> this.setState({newPassword: val, warningMsg: null})} />
                        <Input type={'password'}
                            label={'Confirm Password'}
                            value={confirmPassword}
                            onChange={(e, val)=> this.setState({confirmPassword: val, warningMsg: null})}/>
                        {warningMsg && <span className={styles.warningMsg}>{warningMsg}</span>}
                        <Button text={'Reset'}
                            classes={'primary'}
                            onClick={this.handleResetPassword} />
                    </>
                    : <>
                        <p>Enter your registered email</p>
                        <Input
                            label={'Email'}
                            value={email}
                            errorLabel={warningMsg}
                            onChange={(e, val)=> this.setState({email: val, warningMsg: null})}
                         />
                         {warningMsg && <span className={styles.warningMsg}>{warningMsg}</span>}
                        <Button text={'Next'}
                            classes={'primary'}
                            onClick={this.handleSendEmail} />
                    </>
                }</div>
                {showSuccessPopup && 
                <SuccessPopup 
                    isSuccess={isSuccess}
                    successText={successMsg}
                    errorText={errorMsg}
                    onClick={() => this.setState({ showSuccessPopup: false, isSuccess: false })}
                    />}
                {showLoader && <div className={styles.loader}><Loader type="spinner-circle" bgColor={"#000"} title={"Sending..."} color={'#000'} size={80}  /></div>}
            </div>
        );
    }
}

export default withRouter(Password);