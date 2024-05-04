import React, { Component } from 'react';
import styles from './styles.module.css'
import SideNavBar from '../../components/SideNavBar';
import OrderForm from './Components/OrderForm'
import { FaList, FaFileInvoice, FaCalculator } from "react-icons/fa";
import { FiHome, } from "react-icons/fi";
import { BsTruckFlatbed, BsChatLeftText } from "react-icons/bs";
import { AiOutlineMenu, AiOutlineFileProtect } from 'react-icons/ai';
import { MdAddchart } from 'react-icons/md';

import { withRouter } from 'react-router';
import Dashboard from './Components/Dashboard';
import AllOrders from './Components/AllOrders';
import Invoice from './Components/Invoice';
import Calculator from '../Calculator';
import Claims from './Components/Claims';
import CommercialInvoice from './Components/CommercialInvoice';
import axios from 'axios';
import { API_HOST, HEADERS, SOCKET, SOCKET_CONNECTION, DROPDOWN_DATA, PARCELPOINT_DATA } from '../../constants';
import CustomerProfile from './Components/Profile';
import _ from 'lodash';
import ChatComp from '../../components/ChatComp';
import Notify from '../../components/Notify';
import Header from '../../components/Header';

class Customer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      menuCollapse: true,
      currentPath: null,
      userList: {},
      chatList: [],
      showNotify: false,
      userInfo: null
    }

    this.sideBarList = [
      {
        label: 'Dashboard',
        linkTo: '/customer/dashboard',
        icon: <FiHome />,
      },
      {
        label: 'Place Order',
        linkTo: '/customer/new',
        icon: <MdAddchart />,
      },
      {
        label: 'My Orders',
        linkTo: '/customer/orders',
        icon: <FaList />,
      },
      {
        label: 'My Invoices',
        linkTo: '/customer/invoice',
        icon: <FaFileInvoice />,
      },
      {
        label: 'My Claims',
        linkTo: '../customer/claims',
        icon: <AiOutlineFileProtect />,
      },
      {
        label: 'Commercial Invoices',
        linkTo: '../customer/commercial',
        icon: <BsTruckFlatbed />,
      },
      {
        label: 'Calculator',
        linkTo: '../customer/calculator',
        icon: <FaCalculator />,
      },
      {
        label: 'Chats',
        linkTo: '../customer/chat',
        icon: <BsChatLeftText />,
      }
    ]
  }

  componentDidMount() {
    this.unlisten = this.props.history.listen((location, action) => {
      if (this.state.showNotify) this.handleNotify()
    });
    this.setState({ currentPath: this.sideBarList.find(item => item.linkTo === this.props.history.location.pathname) || { label: 'Account Settings' } })
  }
  componentWillUnmount() {
    this.unlisten()
    SOCKET.close && SOCKET.close();
  }

  UNSAFE_componentWillMount() {
    let token = localStorage.getItem('token')
    if (token) {
      axios.get(`${API_HOST}/api/auth`, HEADERS)
        .then(res => {
          this.setState({ userList: res.data })
          SOCKET_CONNECTION()
          this.getMyChat(token)
          if (res.data && res.data.firstname) {
            if (window.location.pathname === '/customer') window.location.href = '/customer/dashboard'
          } else {
            if (window.location.pathname !== '/customer/profile') window.location.href = '/customer/profile';
          }
          this.setState({ userInfo: res.data })
          this.setSocket(res.data)
        }).catch(() => {
          this.props.history.push('/')
        })
    } else {
      this.props.history.push('/')
    }
  }
  getMyChat = (token) => {
    axios.get(`${API_HOST}/api/chat/me`, HEADERS).then(res => {
      this.setState({ userList: { ...this.state.userList, chatList: res.data } })

    }).catch(() => {
      this.props.history.push('/')
    })
  }

  setSocket = (userList) => {
    const { chatList } = this.state
    SOCKET.on(userList.email, (payload) => {
      const userList = _.cloneDeep(this.state.userList)
      userList.chatList && userList.chatList.push(payload)
      this.setState({ userList })
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
    this.setState({ showNotify: window.location.pathname !== '/customer/chat' })
  }
  render() {
    const { menuCollapse, userList, chatList, showNotify, userInfo, currentPath } = this.state
    const { history } = this.props
    return (
      <div style={{ position: 'relative', height: '100%', width: '100%' }}>
        <div style={{ width: '20px', height: '20px', padding: '20px', position: 'absolute' }} onClick={this.menuIconClick}>
          <AiOutlineMenu />
        </div>
        <SideNavBar sideBarList={this.sideBarList} onSideBarHover={this.onSideBarHover} menuIconClick={this.menuIconClick} menuCollapse={menuCollapse} userName={userInfo && userInfo.firstname + " " + userInfo.lastname} />
        <Header mainText={'Customer'} subText={currentPath && currentPath.label} />
        <div className={styles.container} style={{ height: 'calc(100% - 60px)', width: '100%', padding: '0px 0px 0px 60px' }}>
          {history && history.location && history.location.pathname === '/customer/new' && <OrderForm userInfo={userInfo} DROPDOWN_DATA={DROPDOWN_DATA} PARCELPOINT_DATA={PARCELPOINT_DATA} />}
          {history && history.location && history.location.pathname === '/customer/dashboard' && <Dashboard />}
          {history && history.location && history.location.pathname === '/customer/orders' && <AllOrders />}
          {history && history.location && history.location.pathname === '/customer/invoice' && <Invoice />}
          {history && history.location && history.location.pathname === '/customer/calculator' && <Calculator />}
          {history && history.location && history.location.pathname === '/customer/claims' && <Claims />}
          {history && history.location && history.location.pathname === '/customer/commercial' && <CommercialInvoice />}
          {history && history.location && history.location.pathname === '/customer/chat' && <ChatComp userList={[userList]} chatList={chatList} handleSend={this.handleSend} isAdmin={false} socket={SOCKET} history={history} />}
          {history && history.location && history.location.pathname === '/customer/profile' && <CustomerProfile />}
        </div>
        {showNotify && <Notify pathname={'../customer/chat'} />}
      </div>
    );
  }
}

export default withRouter(Customer);