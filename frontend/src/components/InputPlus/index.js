import Input from '../Input'
import styles from './styles.module.css'
import { HiPlus } from 'react-icons/hi'
import { useEffect, useState } from 'react'
import classNames from 'classnames'

const InputPlus=function({label, max=3, values=[], handleOnChange, isReadOnly=false}){
  const [currIndex, setCurrIndex] = useState(values.length - 1)
  const [maxArray, setMaxArray] = useState([])
  const [disablePlusIcon, setDisablePlusIcon] = useState(values.length == 0)
  useEffect(()=>{
    handleMaxArray()
  }, [])
  const handleMaxArray = function(){
    let arr = []
    for(let i=0; i <= currIndex; i++){
      arr[i]=i
    }
    setMaxArray(arr)
    setCurrIndex(currIndex+1)
    setDisablePlusIcon(max === currIndex+1)
  }
  const onChange=(index, val)=>{
    let newValues = values;
    newValues[index] = val;
    setDisablePlusIcon(val.length === 0 || currIndex === max)
    handleOnChange(newValues)
  }
  return <div className={styles.inputPlusContainer}>
    {isReadOnly ?
    <span className={styles.readOnlySpan}>
        <label htmlFor='a'>{label}</label><br />
        {values.map((item, i)=>{
          return <span key={i} id='a'>{item}</span>
        })}
        
    </span>
    : <>
      <label>{label}</label>
      {maxArray.map((i)=>{
        return <div key={i}>
          <Input value={values[i]} onChange={(e, val)=>onChange(i, val)} />
          {i === 0 && <span className={classNames(styles.plusIcon, {[styles.disablePlusIcon]: disablePlusIcon})} onClick={()=> handleMaxArray()}>
            <HiPlus style={{ fontSize: '24px', }} />
          </span>}
        </div>
        
      })}
    </>}
  </div>
}

export default InputPlus;