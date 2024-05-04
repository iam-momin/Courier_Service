import React, { Component } from 'react';
import styles from './styles.module.css'
import SideNavBar from '../../components/SideNavBar';
import { FaFileInvoiceDollar, FaUsersCog, } from "react-icons/fa";
import { FiHome, } from "react-icons/fi";
import { AiOutlineMenu, AiOutlineFileProtect } from 'react-icons/ai';
import { BsFileEarmarkSpreadsheet, BsTruckFlatbed } from 'react-icons/bs';

import { withRouter } from 'react-router';
import axios from 'axios';
import { API_HOST, HEADERS, SOCKET, SOCKET_CONNECTION } from '../../constants';
import OrderManagement from './Components/OrderManagement';
import UserManagement from './Components/UserManagement';
import ClaimInvoice from './Components/ClaimInvoice';
import CommercialInvoice from './Components/CommercialInvoice';
import CustomerProfile from '../Customer/Components/Profile';
import { BsChatLeftText } from 'react-icons/bs'
import _ from 'lodash';
import Notify from '../../components/Notify';
import ChatComp from '../../components/ChatComp';
import Header from '../../components/Header';
import CMR from '../Customer/Components/CMR';

class Admin extends Component {
  constructor(props) {
    super(props)
    this.state = {
      menuCollapse: true,
      currentPath: null,
      userInfo: null,
      users: null,
      userList: []
    }

    this.sideBarList = [
      {
        label: 'Manage Orders',
        linkTo: '/admin/orders',
        icon: <FiHome />,
      },
      {
        label: 'Claims',
        linkTo: '/admin/claims',
        icon: <AiOutlineFileProtect />,
      },
      {
        label: 'Commercial Invoices',
        linkTo: '/admin/commercialInvoice',
        icon: <BsTruckFlatbed />,
      },
      {
        label: 'Manage Users',
        linkTo: '/admin/userManagement',
        icon: <FaUsersCog />,
      },
      {
        label: 'CMR',
        linkTo: '../admin/cmr',
        icon: <BsFileEarmarkSpreadsheet />,
      },
      {
        label: 'Chats',
        linkTo: '/admin/chats',
        icon: <BsChatLeftText />,
      },

    ]
  }
  componentDidMount() {
    axios.get(`${API_HOST}/api/user/allUsers`, HEADERS)
      .then(res => {
        this.getChats()
        this.setSocket()
        this.setState({ users: res && [...res.data] })
      }).catch(err => {
        console.log(err);
      })
    this.unlisten = this.props.history.listen((location, action) => {
      if (this.state.showNotify) this.handleNotify()
    });
    this.setState({ currentPath: this.sideBarList.find(item => item.linkTo === this.props.history.location.pathname) || { label: 'Account Settings' } })
  }
  componentWillUnmount() {
    this.unlisten()
    SOCKET.close && SOCKET.close()
  }
  UNSAFE_componentWillMount() {
    let token = localStorage.getItem('token')
    if (token) {
      axios.get(`${API_HOST}/api/auth/admin`, HEADERS)
        .then(res => {
          SOCKET_CONNECTION()
          this.setState({ userInfo: res.data })
          // if (res.data && res.data.name) {
          //   if (window.location.pathname === '/customer') window.location.href = '/customer/dashboard'
          // } else {
          //   if (window.location.pathname !== '/customer/profile') window.location.href = '/customer/profile';
          // }
        }).catch(error => {
          this.props.history.push('/')
        })
    } else {
      this.props.history.push('/')
    }
  }

  getChats = () => {
    axios.get(`${API_HOST}/api/chat`, HEADERS)
      .then(res => {
        const userInfo = this.state.userInfo
        let userList = this.state.users.filter(item => item._id !== userInfo._id)
        userList && userList.map((item, i) => {
          userList[i].chatList = this.getUserChat(res.data, item._id)
        })
        let newUserList = []
        userList && userList.map((item, i) => {
          const lastChat = item.chatList
          if (lastChat && lastChat[lastChat.length - 1] && lastChat[lastChat.length - 1].isRead) {
            item.isRead = true
            newUserList.push(item)
          } else {
            item.isRead = lastChat && lastChat.length === 0
            newUserList.unshift(item)
          }
        })
        this.setState({ userList: newUserList })
      }).catch(() => {
        this.props.history.push('/')
      })
  }

  getUserChat = (chatList, id) => {
    return chatList && chatList.filter((item) => {
      if (item.customerId === id) {
        return item
      }
    })
  }

  setSocket = () => {
    SOCKET.on('toAdmin', (payload) => {
      let userList = _.cloneDeep(this.state.userList)
      let userShift = null
      userList && userList.map((item, i) => {
        if (item._id === (payload && payload.customerId)) {
          userList[i].chatList.push(payload)
          userList[i].isRead = payload.isAdmin
          userShift = { index: i, item }
        }
      })
      if (userList && userShift) {
        userList.splice(userShift.index, 1)
        userList.unshift(userShift.item)
      }
      this.setState({ userList: userList, })
      this.handleNotify()
    })
  }

  handleSend = (e, message, user) => {
    e.preventDefault();
    SOCKET.emit('chat', { message, email: user.email, customerId: user._id })
  }

  menuIconClick = (item) => {
    this.setState({ menuCollapse: !this.state.menuCollapse, currentPath: item });
  };

  onSideBarHover = (val) => {
    this.setState({ menuCollapse: val });
  }

  handleNotify = () => {
    this.setState({ showNotify: window.location.pathname !== '/admin/chat' })
  }
  handleUserSelection = (item) => {
    const messageIds = []
    item && item.chatList && item.chatList.map((chat, i) => {
      if (!chat.isRead) {
        messageIds.push(chat._id)
        item.chatList[i].isRead = true
      }
    })
    if (messageIds && messageIds.length > 0) {
      axios.put(`${API_HOST}/api/chat/read`, { messageIds }, HEADERS)
        .then(res => {
          let userList = _.cloneDeep(this.state.userList)
          userList && userList.map((user, i) => {
            if (item._id === user._id) {
              userList[i] = item
              userList[i].isRead = true
            }
          })
          this.setState({ userList })
        }).catch(err => {
          console.log('err', err);
        })
    }
  }
  render() {
    const { menuCollapse, userInfo, users, userList, showNotify, currentPath } = this.state
    const { history } = this.props
    return (
      <div style={{ position: 'relative', height: '100%', width: '100%' }}>
        <div style={{ width: '20px', height: '20px', padding: '20px', position: 'absolute' }} onClick={this.menuIconClick}>
          <AiOutlineMenu />
        </div>
        <SideNavBar sideBarList={this.sideBarList} onSideBarHover={this.onSideBarHover} menuIconClick={this.menuIconClick} menuCollapse={menuCollapse} userName={userInfo && userInfo.firstname + " " + userInfo.lastname} />
        <Header mainText={'Admin'} subText={currentPath && currentPath.label} />
        <div className={styles.container} style={{ height: 'calc(100% - 60px)', width: '100%', paddingLeft: '65px' }}>
          {history && history.location && history.location.pathname === '/admin/orders' && <OrderManagement />}
          {history && history.location && history.location.pathname === '/admin/claims' && <ClaimInvoice />}
          {history && history.location && history.location.pathname === '/admin/commercialInvoice' && <CommercialInvoice />}
          {history && history.location && history.location.pathname === '/admin/profile' && <CustomerProfile />}
          {history && history.location && history.location.pathname === '/admin/userManagement' && <UserManagement userInfo={userInfo} />}
          {history && history.location && history.location.pathname === '/admin/cmr' && <CMR />}
          {history && history.location && history.location.pathname === '/admin/chats' &&
            <ChatComp userInfo={userInfo} userList={userList} handleSend={this.handleSend} isAdmin={true} handleUserSelection={this.handleUserSelection} socket={SOCKET} history={history} />}
        </div>
        {showNotify && <Notify pathname={'../admin/chat'} />}
      </div>
    );
  }
}

export default withRouter(Admin);