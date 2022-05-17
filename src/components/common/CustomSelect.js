import React, { useState, useEffect } from 'react'
import Select from "react-select"

function CustomSelect(props) {
  // Declare a new state variable, which we'll call "count"
  const [option, setOption] = useState([]) 
  const [selectValue, setSelectValue] = useState() 
  const [manuallyTriggred, setManuallyTrigger] = useState(false) 

  useEffect(() => {  
    if (!props.cProps.editMode) {
      const objN = {}  
      objN[props.item.field] = (props.item.props && props.item.props.value) ?  props.item.props.value : ''
      props.cProps.handleEditValue(objN)
    } 
  }, [])
  useEffect(() => {
    if (props.existingValues && props.item.field in props.existingValues && !manuallyTriggred)  {
      if (props?.item?.props?.multiple) {  
        const existingValues = []
        props.existingValues[props.item.field].split(',').map((r) => {
          existingValues.push({
            label: r,
            value: r
          })
        })      
        setSelectValue(existingValues)      
      } else {
        const defaultValue = option.find((obj) => { return obj.value === props.existingValues[props.item.field] })      
        setSelectValue(defaultValue)      
      }      
    }
  }, [props, option])

  useEffect(() => {
   if (props.item.options) {
      setOption(props.item.options)
    } 
  }, [])
  
  function handleOptionChange(newValue) {
    setManuallyTrigger(true)
    if (!newValue) {
      props.cProps.handleEditValue({ [props.item.field] : null })
      setSelectValue(null)
    } else {
      if (props?.item?.props?.multiple) {            
        props.cProps.handleEditValue({ [props.item.field] : newValue.map((e) => e.value).join(',') })      
      } else {
        props.cProps.handleEditValue({ [props.item.field] : newValue.value })
      }    
      setSelectValue(option.find((obj) => { return obj.value === newValue.value }))
    }    
  }
  return (
    <Select
    className="React" 
    classNamePrefix="select" 
    onChange={(e) => handleOptionChange(e) }
    name={props.item.field} 
    id={props.item.field} 
    key={props.item.field} 
    options={option} 
    isMulti={props?.item?.props?.multiple}
    value={selectValue}
    isClearable={props.item.is_clearable}
    placeholder={props.cProps.placeholder}  />    
  )
}
export default CustomSelect

