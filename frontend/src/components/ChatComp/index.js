import React, { Component } from 'react';
import styles from './styles.module.css'
// import { DESKTOP_VIEW } from '../../constants'
import Input from '../Input';
import { FaRegUserCircle } from 'react-icons/fa';
import classNames from 'classnames';
import { IoClose, IoSend } from 'react-icons/io5';
import Loader from "react-js-loader";
class ChatComp extends Component {
    constructor(props) {
        super(props);
        const user = props.userList && props.userList.find(item => item.chatList && item.chatList.length > 0)
        this.state = {
            messageInput: '',
            searchVal: '',
            selectedUser: props.isAdmin ? user : props.userList[0],
            showMoreUsers: false,
            time: 0
        }
        this.timer = 0
    }

    componentDidMount() {
        this.scrollToTop()
        if (this.props.handleUserSelection)
            this.props.handleUserSelection(this.state.selectedUser)
        if (this.props.socket.disconnected !== undefined && this.props.socket.disconnected) {
            this.setLoaderTimer()
        }
    }
    setLoaderTimer = () => {
        clearInterval(this.timer)
        this.timer = setInterval(() => {
            this.setState({ time: this.state.time + 1 })
            if (this.state.time === 5) {
                this.setState({ time: 0 })
                clearInterval(this.timer)
            }
        }, 1000)
    }
    scrollToTop = () => {
        var objDiv = document.getElementById("chatBody");
        objDiv.scrollTop = objDiv.scrollHeight;
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        const { userList, isAdmin } = nextProps
        const { selectedUser } = this.state
        if (JSON.stringify(userList) !== JSON.stringify(this.props.userList)) {
            if (selectedUser) {
                this.setState({ selectedUser: isAdmin ? userList && userList.find(item => item._id === selectedUser._id) : userList[0] })
            } else {
                this.setState({ selectedUser: isAdmin ? nextProps.userList && nextProps.userList.find(item => item.chatList && item.chatList.length > 0) : userList[0] })
            }
            this.setState({}, this.scrollToTop)
        }
        if (JSON.stringify(userList) !== JSON.stringify(this.props.userList)) {
            this.setLoaderTimer()
        }
    }

    handleUserSearch = (e) => {
        this.setState({ searchVal: e.target.value })
    }
    handleSend = (e) => {
        const { messageInput, selectedUser } = this.state
        if (messageInput && messageInput.length) this.props.handleSend(e, messageInput, selectedUser)
        this.setState({ messageInput: '' })
    }
    formatAMPM = (date) => {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }
    sameDay = (d1, d2) => {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    }

    handleUserSelection = (item) => {
        this.setState({ selectedUser: item }, () => { this.scrollToTop(); this.props.handleUserSelection(item); })
    }
    handleShowMoreUsers = () => {
        const { selectedUser } = this.state
        const { userList } = this.props
        if (selectedUser && selectedUser.chatList.length === 0) {
            this.setState({ selectedUser: userList && userList.find(item => item.chatList.length > 0) })
        }
        this.setState({ showMoreUsers: !this.state.showMoreUsers })
    }
    render() {
        const { messageInput, selectedUser, searchVal, showMoreUsers, time } = this.state
        const { userList, chatList, isAdmin, handleSend, history, socket } = this.props
        return (
            <div className={styles.chatCompContainer}>
                <div className={styles.bodyWrapper}>
                    {isAdmin && <div className={styles.userListContainer} style={{ width: '30%'}}>
                        <Input
                            type={'text'}
                            placeholder={'Search'}
                            value={searchVal}
                            onChange={this.handleUserSearch}
                        />
                        <div className={styles.userListWrapper}>
                            {userList && userList.map((item, i) => {
                                const isSelected = selectedUser && selectedUser._id === item._id
                                const name = item.name && item.name.toLowerCase().includes(searchVal.toLowerCase())
                                const email = item.email && item.email.toLowerCase().includes(searchVal.toLowerCase())
                                if ((name || email) && (showMoreUsers || item.chatList.length > 0))
                                    return <div key={i} className={isSelected && styles.selected} onClick={() => { this.handleUserSelection(item) }} >
                                        <FaRegUserCircle style={{ color: '#05445E', fontSize: '24px' }} />
                                        <span className={styles.nameEmail}>
                                            <span>{item.firstname} {item.lastname}</span>
                                            <p>{item.email}</p>
                                        </span>
                                        {!item.isRead && <span className={styles.unread}></span>}
                                    </div>
                            })}
                        </div>
                        <span className={styles.moreUsers} onClick={this.handleShowMoreUsers}>
                            {showMoreUsers
                                ? <IoClose style={{ fontSize: '30px' }} />
                                : <h6>All Users</h6>}
                        </span>
                    </div>}
                    <div className={styles.chatContainer} style={{ width: isAdmin ? '70%' : '100%' }}>
                        <div className={styles.chatHeader}>
                            <FaRegUserCircle style={{ color: '#05445E', fontSize: '30px' }} />
                            <span>{isAdmin ? selectedUser && selectedUser.firstname + " " + selectedUser.lastname : "Estolink"}</span>
                        </div>
                        <div className={styles.chatBody} id={'chatBody'}>
                            {selectedUser && selectedUser.chatList && selectedUser.chatList.map((item, i) => {
                                const admin = item.isAdmin
                                let classes = !isAdmin ? admin ? styles.mleft : styles.mright : admin ? styles.mright : styles.mleft
                                const isDiff = selectedUser.chatList[i - 1] ? selectedUser.chatList[i - 1].isAdmin !== item.isAdmin : true;
                                const lastCreatedAt = selectedUser.chatList[i - 1] && new Date(selectedUser.chatList[i - 1].createdAt).toISOString().slice(0, 10)
                                const currCreatedAt = item && new Date(item.createdAt).toISOString().slice(0, 10)
                                // if(selectedUser.chatList[i+1] && this.sameDay(new Date(item.createdAt), new Date(selectedUser.chatList[i+1].createdAt)))
                                return (<React.Fragment key={i}>
                                    {lastCreatedAt !== currCreatedAt &&
                                        <div className={styles.strike}><span>{currCreatedAt}</span></div>}
                                    <div className={classNames(styles.messageWrapper, !isAdmin ? admin ? styles.mright : styles.mleft : admin ? styles.mleft : styles.mright)}>
                                        <div className={isDiff && styles.newTip}>
                                            <span>{item.message}</span>
                                            <span className={styles.date}>{this.formatAMPM(new Date(item.createdAt))}</span>
                                        </div>
                                    </div>

                                </React.Fragment>)

                            })}
                        </div>
                        <div className={styles.chatFooter}>
                            <Input type={'text'}
                                placeholder={'message'}
                                className={styles.messageInput}
                                value={messageInput}
                                onChange={(e) => this.setState({ messageInput: e.target.value })}
                                onEnter={(e) => {
                                    this.handleSend(e)
                                }} />
                            <span>
                                <IoSend style={{ color: 'var(--primary-color)', fontSize: '24px' }} onClick={this.handleSend} />
                            </span>
                        </div>
                    </div>
                </div>
                {history && history.location && history.location.pathname.includes('chat') && socket.disconnected &&
                    <div className={styles.loader}>
                        <div><Loader type="spinner-circle" bgColor={"#000"} title={"Connecting"} color={'#000'} size={80} /></div>
                        {time >= 5 && <div className={styles.loaderBtn}>
                            <button onClick={() => { history.goBack() }}>Go Back</button>
                            <button onClick={() => { window.location.reload(); }}>Reload</button>
                        </div>}
                    </div>
                }
            </div>
        );
    }
}

export default ChatComp;