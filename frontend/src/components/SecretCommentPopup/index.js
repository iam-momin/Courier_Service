import { useState } from 'react';
import Button from '../Button';
import Textarea from '../Textarea';
import styles from './styles.module.css'

const SecretCommentPopup = ({handleCommentPopup, secretComment, onClose})=>{
  const [comment, setComment] = useState(secretComment)
  return (<div className={styles.secretCommentContainer}>
          <div>
              <div className={styles.header}>
                  <h4>Comment Section</h4>
              </div>
              <div className={styles.body}>
                  <Textarea rows={4} value={comment} onChange={(e)=> setComment(e.target.value)} />
              </div>
              <div className={styles.footer}>
                  <Button text='Cancel' classes={'secondary sm'} onClick={onClose} />
                  <Button text='Update' classes={'primary sm'} onClick={()=> handleCommentPopup(comment)} />
              </div>
          </div>
        </div>)
}

export default SecretCommentPopup;