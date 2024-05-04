

//import useState hook to create menu collapse state
import React, { Component } from "react";
import { AiOutlineMenu } from "react-icons/ai";
//import icons from react icons
import { FiLogOut } from "react-icons/fi";
import { MdManageAccounts } from "react-icons/md";
//import react pro sidebar components
import {
  Menu,
  MenuItem, ProSidebar, SidebarContent, SidebarFooter, SidebarHeader
} from "react-pro-sidebar";
import 'react-pro-sidebar/dist/css/styles.css';
import { withRouter } from 'react-router';
import { Link } from "react-router-dom";
import ConfirmationPopup from '../ConfirmationPopup';
import "./style.css";
import logo from '../../images/estolink_logo.png'
import classNames from "classnames";
import { FaRegUserCircle } from "react-icons/fa";


class SideNavBar extends Component {

  constructor(props) {
    super(props)
    this.state = {
      activeItem: 0,
      showConfirmationPopup: false
    }
  }

  //create a custom function that will change menucollapse state from false to true and true to false
  menuItemClick = (i) => {
    this.setState({ activeItem: i })
  }

  logout() {
    localStorage.clear();
    window.location.href = "/";
  }

  render() {
    const { activeItem, showConfirmationPopup } = this.state
    const { sideBarList, menuCollapse, menuIconClick, history, onSideBarHover, userName } = this.props

    return (
      <>
        <div id="header">
          <ProSidebar collapsed={menuCollapse} breakPoint={'sm'} toggled={menuCollapse ? '' : "true"} onMouseEnter={() => { onSideBarHover(false) }} onMouseLeave={() => { onSideBarHover(true) }}>
            <SidebarHeader>
              <div className={classNames('menuIcon', !menuCollapse && 'menuIcon2')}>
                {menuCollapse ? <AiOutlineMenu onClick={menuIconClick} />
                  : <div className={'menuHead'}>
                    <img src={logo} />
                    <hr />
                    <FaRegUserCircle style={{ color: '#05445E', fontSize: '20px' }} />
                    <span className={'userName'}>{userName}</span>
                  </div>}
              </div>
            </SidebarHeader>
            <SidebarContent>
              <Menu iconShape="square">
                {
                  sideBarList && sideBarList.map((item, i) => {
                    return <MenuItem key={i} active={item.linkTo.includes(history.location && history.location.pathname)} icon={item.icon} onClick={() => { menuIconClick(item); this.menuItemClick(0) }}>
                      <Link to={{ pathname: item.linkTo, state: { activeIndex: i } }}>{item.label}</Link>
                    </MenuItem>
                  })
                }
              </Menu>
            </SidebarContent>

            <SidebarFooter>
              <Menu iconShape="square">
                <MenuItem icon={<MdManageAccounts />} active={history.location && history.location.pathname.includes('profile')} onClick={() => { menuIconClick({ label: 'Account Settings' }) }}>
                  <Link to={{ pathname: history.location.pathname.replace(/[^/]*$/, 'profile') }}>Account Settings</Link>
                </MenuItem>
                <MenuItem icon={<FiLogOut />} onClick={() => this.setState({ showConfirmationPopup: true })} >Logout</MenuItem>
              </Menu>
            </SidebarFooter>
          </ProSidebar>
          {showConfirmationPopup && <ConfirmationPopup
            header={'Confirm'}
            text={'do you want to Logout?'}
            saveText={'Logout'}
            cancelText={'Cancel'}
            handleSave={this.logout}
            handleCancel={() => { this.setState({ showConfirmationPopup: false }) }}
          />}
        </div>
      </>
    );
  }
};

export default withRouter(SideNavBar);
