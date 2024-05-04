import { BsChatLeftText } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import styles from './styles.module.css'
function Notify({pathname}){
    return <Link to={{pathname: pathname}} className={styles.notify}>
        <BsChatLeftText style={{fontSize: '24px'}} />
    </Link>
}

export default Notify;