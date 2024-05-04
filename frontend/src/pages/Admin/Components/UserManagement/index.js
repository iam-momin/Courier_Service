import axios from 'axios';
import React, { Component } from 'react';
import { FaRegUserCircle } from 'react-icons/fa';
import { API_HOST, HEADERS } from '../../../../constants';
import styles from './styles.module.css'
import Switch from "react-switch";
import ConfirmationPopup from '../../../../components/ConfirmationPopup';
import { ImCheckmark, ImCross } from 'react-icons/im';
import { MdEdit, MdOutlineClose, MdCheck } from 'react-icons/md';
import Input from '../../../../components/Input';
import Button from '../../../../components/Button';
import SuccessPopup from '../../../../components/SuccessPopup';
import CustomSelect from '../../../../components/CustomSelect';
import FilterComp from '../../../../components/FilterComp'

class UserManagement extends Component {
    constructor(props) {
        super(props)
        this.state = {
            users: [],
            showConfirmationpoup: false,
            userInfo: null,
            showEditPopup: '',
            email: '',
            phoneNo: '',
            address1: '',
            address2: '',
            city: '',
            postalCode: '',
            country: '',
            countryOptions: [],
            userId: '',
            showSuccessPopup: false,
            isSuccess: false,
            errorText: '',
            firstname: '',
            lastname: '',

        }
        this.filterList = [
            { label: 'Email', value: 'email' },
            { label: 'First Name', value: 'firstname' },
            { label: 'Last Name', value: 'lastname' },
        ]
        this.allUsers = []
    }
    componentWillMount() {
        this.getAllUsers()
        axios.get(`${API_HOST}/api/country`).then((res) => {
            if (res) {
                this.dropdownData = res.data
                let dropdownData = res.data && res.data.map(item => {
                    return { label: item.from.toUpperCase(), value: item.from.toLowerCase() }
                })
                this.setState({ countryOptions: dropdownData })
            }
        }).catch((error) => {

        })
    }

    getAllUsers = () => {
        axios.get(`${API_HOST}/api/user/allUsers`, HEADERS)
            .then(res => {
                this.allUsers = res.data
                this.setState({ users: res && res.data && res.data.filter(item => item._id !== this.props.userInfo._id) })
            }).catch(err => {
                console.log(err);
            })
    }

    updateUserList = (user) => {
        const users = [...this.state.users]
        this.setState({ users: users && users.map(item => item._id === user._id ? user : item) })
    }
    handleConfirm = () => {
        const { userInfo } = this.state
        const id = userInfo && userInfo._id
        const isAdmin = userInfo && userInfo.isAdmin
        axios.put(`${API_HOST}/api/user/admin/${id}`, { isAdmin: !isAdmin }, HEADERS)
            .then((res) => {
                this.updateUserList(res.data)
                this.setState({ showConfirmationpoup: false })
            }).catch(err => {
                this.setState({ showConfirmationpoup: false, showSuccessPopup: true, isSuccess: false, errorText: err.response.data })
            })
    }
    handleEditIcon = (user) => {
        const { email, phoneNo, address1, address2, city, postalCode, country, _id, firstname, lastname } = user
        this.setState({ showEditPopup: email, email, phoneNo, address1, address2, city, postalCode, country, userId: _id, firstname, lastname })
    }
    handleUpdate = () => {
        const { email, phoneNo, address1, address2, city, postalCode, country, userId, firstname, lastname } = this.state
        const body = { email, phoneNo, address1, address2, city, postalCode, country, firstname, lastname }
        axios.put(`${API_HOST}/api/user/userInfo/${userId}`, body, HEADERS)
            .then(res => {
                this.updateUserList(res.data)
                this.setState({ showEditPopup: false, showSuccessPopup: true, isSuccess: true })
            }).catch(err => {
                this.setState({ showSuccessPopup: true, isSuccess: false, errorText: err.response.data })
            })
    }
    handleFilterApply = (_, data) => {
        const { inputValue, dropdownValue } = data || {}
        const filtered = []
        this.allUsers && this.allUsers.map(item => {
            if (item[dropdownValue.value].toLowerCase().includes(inputValue.toLowerCase()))
                filtered.push(item)
        })
        this.setState({ users: filtered })
    }
    handleFilterClear = () => {
        this.setState({ users: this.allUsers })
    }
    render() {
        const { users, showConfirmationpoup, showEditPopup, showSuccessPopup,
            email, phoneNo, address1, address2, city, postalCode, country, countryOptions, firstname, lastname } = this.state
        return (
            <div className={styles.container}>
                <FilterComp
                    filterList={this.filterList}
                    handleFilterApply={this.handleFilterApply}
                    handleFilterClear={this.handleFilterClear}
                    isDateRequired={false} />
                <div className={styles.container2}>
                    <div className={styles.bodyContainer}>
                        {users && users.map((user, i) => {
                            return <div key={user.email} className={styles.cardContainer}>
                                <div className={styles.cardHeader}>
                                    <FaRegUserCircle style={{ color: '#05445E', fontSize: '24px' }} />
                                    <span>{user.firstname}{" "}{user.lastname}</span>
                                    {user.email !== "info@estolink.com" ? <span className={styles.editIcon} onClick={() => this.handleEditIcon(user)}>
                                        <MdEdit style={{ fontSize: '20px', }} />
                                    </span> : <span >Admin</span >}
                                </div>
                                <div className={styles.cardBody}>
                                    <div className={styles.address}>
                                        <div className={styles.emailNphone}>
                                            <div>
                                                <label htmlFor={'email'}>Email: &nbsp;</label>
                                                <span id={'email'}>{user.email}</span>
                                            </div>
                                            <div>
                                                <label htmlFor={'phoneNo'}>Phone No.: &nbsp;</label>
                                                <span onInvalid={'phoneNo'}>{user.phoneNo}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor={'address 1'}>Address 1: &nbsp;</label>
                                            <span onInvalid={'address 1'}>{user.address1}</span>
                                        </div>
                                        <div>
                                            <label htmlFor={'address 2'}>Address 2: &nbsp;</label>
                                            <span onInvalid={'address 2'}>{user.address2}</span>
                                        </div>
                                        <div className={styles.cityNCountry}>
                                            <div>
                                                <label htmlFor={'city'}>City: &nbsp;</label>
                                                <span id={'city'}>{user.city}</span>
                                            </div>
                                            <div>
                                                <label htmlFor={'postalCode'}>Postal Code.: &nbsp;</label>
                                                <span onInvalid={'postalCode'}>{user.postalCode}</span>
                                            </div>
                                            <div>
                                                <label htmlFor={'country'}>Coutry: &nbsp;</label>
                                                <span onInvalid={'country'}>{user.country && user.country.label.toLowerCase()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {this.props.userInfo && this.props.userInfo.email === "info@estolink.com" && <div className={styles.cardFooter}>
                                    <span>Make Admin</span>
                                    <Switch onChange={() => { this.setState({ showConfirmationpoup: true, userInfo: user }) }}
                                        checked={user.isAdmin}
                                        borderRadius={2}
                                        disabled={this.props.userInfo && this.props.userInfo.email !== "info@estolink.com" ? true : false}
                                        height={26}
                                    // onColor={'#00FF80'} 
                                    />
                                </div>}
                            </div>
                        })}
                    </div>

                </div>
                {showConfirmationpoup &&
                    <ConfirmationPopup
                        header={'Confirm'}
                        text={'Do you want to make this user admin?'}
                        saveText={'Yes'}
                        cancelText={'No'}
                        handleSave={this.handleConfirm}
                        handleCancel={() => {
                            this.setState({ showConfirmationpoup: false })
                        }}
                    />}
                {showSuccessPopup &&
                    <SuccessPopup
                        isSuccess={this.state.isSuccess}
                        successText={'User info updated successfully!'}
                        errorText={this.state.errorText}
                        onClick={() => this.setState({ showSuccessPopup: false, isSuccess: false })}
                    />
                }
                {showEditPopup &&
                    <div className={styles.popupContainer}>
                        <div className={styles.editPopupWrapper}>
                            <h4>Edit User Information</h4>
                            <div className={styles.editPopupBody}>
                                <div>
                                    <label htmlFor={'firstname'}>First Name: &nbsp;</label>
                                    <Input id={'firstname'} style={{ width: '70%' }} value={firstname} onChange={(e) => this.setState({ firstname: e.target.value })} />
                                </div>
                                <div>
                                    <label htmlFor={'lastname'}>Last Name: &nbsp;</label>
                                    <Input id={'lastname'} style={{ width: '50%' }} value={lastname} onChange={(e) => this.setState({ lastname: e.target.value })} />
                                </div>
                                <div>
                                    <label htmlFor={'email'}>Email: &nbsp;</label>
                                    <Input id={'email'} style={{ width: '70%' }} value={email} onChange={(e) => this.setState({ email: e.target.value })} />
                                </div>
                                <div>
                                    <label htmlFor={'phoneNo'}>Phone No.: &nbsp;</label>
                                    <Input id={'phoneNo'} style={{ width: '50%' }} value={phoneNo} onChange={(e) => this.setState({ phoneNo: e.target.value })} />
                                </div>
                                <div className={styles.col1n2}>
                                    <label htmlFor={'address1'}>Address 1: &nbsp;</label>
                                    <Input id={'address1'} style={{ width: '80%' }} value={address1} onChange={(e) => this.setState({ address1: e.target.value })} />
                                </div>
                                <div className={styles.col1n2}>
                                    <label htmlFor={'address2'}>Address 2: &nbsp;</label>
                                    <Input id={'address2'} style={{ width: '80%' }} value={address2} onChange={(e) => this.setState({ address2: e.target.value })} />
                                </div>
                                <div>
                                    <label htmlFor={'city'}>City: &nbsp;</label>
                                    <Input id={'city'} style={{ width: '70%' }} value={city} onChange={(e) => this.setState({ city: e.target.value })} />
                                </div>
                                <div>
                                    <label htmlFor={'postalCode'}>Zip Code.: &nbsp;</label>
                                    <Input id={'postalCode'} style={{ width: '50%' }} value={postalCode} onChange={(e) => this.setState({ postalCode: e.target.value })} />
                                </div>
                                <CustomSelect
                                    required={true}
                                    label={'Coutry:'}
                                    name={'country'}
                                    options={countryOptions}
                                    className={styles.dropdown}
                                    value={country}
                                    isSearchable={false}
                                    menuPlacement={'auto'}
                                    onChange={(e) => this.setState({ country: e })}
                                />
                            </div>
                            <div className={styles.popupFooter}>
                                <Button text={'Cancel'} classes={'secondary'} onClick={() => this.setState({ showEditPopup: false })} />
                                <Button text={'Update'} classes={'primary'} onClick={this.handleUpdate} />
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default UserManagement;