import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import styles from './styles.module.css'

function TooltipComp({component='', text=''}) {
  const renderTooltip = (props) => (
    <Tooltip className={styles.tooltip} {...props}>
      {text}
    </Tooltip>
  );

  return (
      <OverlayTrigger
        delay={{  }}
        overlay={renderTooltip}
        placement="right"
      >
        {component}
      </OverlayTrigger>
  );
}

export default TooltipComp;