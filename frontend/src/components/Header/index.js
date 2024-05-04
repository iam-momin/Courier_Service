import './styles.css'
import logo from '../../images/estolink_logo.png'
import PropTypes from "prop-types";
const Header=({mainText, subText})=>{
    return <header className={'mainHeader'} id={'mainHeader'}>
        <div className='left'>
            <img src={logo} />
            <h5>{mainText}&nbsp;&gt;&nbsp;</h5>
            <h5> {subText}</h5>
        </div>
        <div className='right'></div>
    </header>
}

export default Header;

Header.propTypes = {
    mainText: PropTypes.string,
    subText: PropTypes.string,
}

Header.defaultProps = {
    mainText: '',
    subText: '',
}