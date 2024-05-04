import axios from 'axios';
import React, { Component } from 'react';
import Input from '../../../../components/Input';
import { API_HOST, currency, HEADERS } from '../../../../constants';
import styles from './styles.module.css'
import Button from '../../../../components/Button';
import ChangePasswordPopup from '../../../../components/ChangePasswordPopup';
import SuccessPopup from '../../../../components/SuccessPopup';
import CustomSelect from '../../../../components/CustomSelect';

class CustomerProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            firstname: '',
            lastname: '',
            address1: '',
            address2: '',
            city: '',
            postalCode: '',
            phoneNo: '',
            country: null,
            preferredCurrency: null,
            countryList: [],
            showSuccessPopup: false
        }
        this.currency = currency
    }
    componentDidMount() {
        axios.get(`${API_HOST}/api/country`).then((res) => {
            if (res) {
                this.dropdownData = res.data
                let dropdownData = res.data && res.data.map(item => {
                    return { label: item.from.toUpperCase(), value: item.from.toLowerCase() }
                })
                this.setState({ countryList: dropdownData })
            }
        }).catch(() => {

        })
        axios.get(`${API_HOST}/api/user`, HEADERS)
            .then((res) => {
                if (res && res.data && res.data.email) {
                    this.setStateWithUserData(res.data)
                }
            }).catch(() => {

            })
    }
    setStateWithUserData = (data) => {
        const { email, firstname, lastname, address1, address2, city, postalCode, phoneNo, country, preferredCurrency } = data || {}
        this.setState({
            email: email || '',
            firstname: firstname || '',
            lastname: lastname || '',
            address1: address1 || '',
            address2: address2 || '',
            city: city || '',
            postalCode: postalCode || '',
            phoneNo: phoneNo || '',
            country: country || null,
            preferredCurrency: preferredCurrency || null,
            errorMessage: ''
        })

    }

    handleUpdate = () => {
        const { email, firstname, lastname, address1, address2, city, postalCode, phoneNo, country, preferredCurrency } = this.state
        const payload = { email, firstname, lastname, address1, address2, city, postalCode, phoneNo, country, preferredCurrency }
        if (this.handleValidation()) return;
        axios.put(`${API_HOST}/api/user/profile`, payload, HEADERS)
            .then((res) => {
                this.setState({ showSuccessPopup: true, isSuccess: res.status == 200 })
            }).catch(() => {
                this.setState({ showSuccessPopup: true, isSuccess: false })
            })
    }

    handleValidation = () => {
        const { firstname, lastname, address1, address2, city, postalCode, phoneNo, country, preferredCurrency } = this.state
        const validationList = [
            { id: 'firstname', required: true, stateName: firstname, min: 3 },
            { id: 'lastname', required: true, stateName: lastname, min: 3 },
            { id: 'address1', required: true, stateName: address1, min: 3 },
            // { id: 'address2', required: true, stateName: address2, min: 3 },
            { id: 'city', required: true, stateName: city, min: 3 },
            // { id: 'postalCode', required: true, stateName: postalCode, min: 3 },
            { id: 'phoneNo', required: true, stateName: phoneNo, min: 3 },
            { id: 'country', required: true, stateName: country },
            { id: 'preferredCurrrency', required: true, stateName: preferredCurrency },
        ]
        let isEmpty = false;
        const errorMessage = "Required fields can't be empty and length must be greater than 3."
        validationList.map((item) => {
            const element = document.getElementById(item.id)
            if (item.stateName === null || item.stateName.length < item.min) {
                element && element.setAttribute('style', 'box-shadow: 0 0 2px 1px red')
                isEmpty = true
            } else {
                element && element.setAttribute('style', 'box-shadow: 0 0 2px 0px #212224')
            }
        })
        this.setState({ errorMessage: isEmpty ? errorMessage : '' })
        return isEmpty;

    }
    render() {
        const { email, firstname, lastname, address1, address2, city, postalCode, phoneNo, country, preferredCurrency, countryList, errorMessage, showChangePassPopup, showSuccessPopup, isSuccess } = this.state
        return (
            <div className={styles.container}>
                <div>
                    <div className={styles.email}>
                        <span>Email: </span>
                        <span> {email}</span>
                    </div>
                    <div className={styles.changePassword}>
                        <Button text={'Change Password'}
                            classes={'secondary sm'}
                            onClick={() => {
                                this.setState({ showChangePassPopup: true })
                            }} />
                        <a href='/recover' className={styles.resetLink}>Forgot password?</a>
                    </div>
                    <Input
                        required
                        id={'firstname'}
                        label={'First Name'}
                        placeholder={'First Name'}
                        onChange={(e, val) => {
                            this.setState({ firstname: val })
                        }}
                        value={firstname}
                    />
                    <Input
                        required
                        id={'lastname'}
                        label={'Last Name'}
                        placeholder={'Last Name'}
                        onChange={(e, val) => {
                            this.setState({ lastname: val })
                        }}
                        value={lastname}
                    />
                    <CustomSelect
                        required
                        label={'Country'}
                        id={'country'}
                        options={countryList}
                        value={country}
                        onChange={(e) => { this.setState({ country: e }) }}
                    />
                    <Input
                        required
                        id={'address1'}
                        label={'Address 1'}
                        placeholder={'Address 1'}
                        onChange={(e, val) => {
                            this.setState({ address1: val })
                        }}
                        value={address1}
                    />
                    <Input
                        id={'address2'}
                        label={'Address 2'}
                        placeholder={'Address 2'}
                        onChange={(e, val) => {
                            this.setState({ address2: val })
                        }}
                        value={address2}
                    />
                    <Input
                        required
                        id={'city'}
                        label={'City'}
                        placeholder={'City'}
                        onChange={(e, val) => {
                            this.setState({ city: val })
                        }}
                        value={city}
                    />
                    <Input
                        id={'postalCode'}
                        label={'Postal Code'}
                        placeholder={'Postal Code'}
                        onChange={(e, val) => {
                            this.setState({ postalCode: val })
                        }}
                        value={postalCode}
                    />
                    <Input
                        required
                        id={'phoneNo'}
                        label={'Phone No.'}
                        placeholder={'Phone No.'}
                        onChange={(e, val) => {
                            this.setState({ phoneNo: val })
                        }}
                        value={phoneNo}
                    />
                    <span className={styles.preferredCurrency}>
                        <div>{"Preferred Currency"}<sup style={{ color: '#eb4d4b', fontSize: '10px' }}>*</sup></div>
                        {this.currency && this.currency.map((item, i) => {
                            return <span key={i}><input type={'radio'} firstname={"preferredCurrency"} value={item.currency}
                                checked={item.currency === (preferredCurrency && preferredCurrency.currency)}
                                onChange={() => { this.setState({ preferredCurrency: item }) }} />{item.currency}</span>
                        })}
                        {/*todo check if empty checkbox*/}
                    </span>
                    <div>
                        <Button
                            text={'Update Profile'}
                            classes={'primary'}
                            className={styles.updateBtn}
                            onClick={() => {
                                this.handleUpdate()
                            }}
                        />
                        <span className={styles.errorMessage}>{errorMessage}</span>
                    </div>

                </div>
                {showChangePassPopup && <ChangePasswordPopup handleCancel={() => { this.setState({ showChangePassPopup: false }) }} />}
                {showSuccessPopup &&
                    <SuccessPopup
                        isSuccess={isSuccess}
                        successText={'Profile updated successful'}
                        errorText={'Failed please try again'}
                        onClick={() => {
                            this.setState({ showSuccessPopup: false, isSuccess: true })
                            window.location.reload();
                        }}
                    />
                }

            </div>
        );
    }
}

export default CustomerProfile;