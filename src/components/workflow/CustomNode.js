import React, { memo, useEffect, useState } from "react"
import CustomInput from "reactstrap/lib/CustomInput"
import FormGroup from "reactstrap/lib/FormGroup"
import MoreIcon from "../../assets/images/icons/more.png"
import ListGroupItem from "reactstrap/lib/ListGroupItem"
import { CirclePicker } from 'react-color'
import DropdownToggle from "reactstrap/lib/DropdownToggle"
import DropdownMenu from "reactstrap/lib/DropdownMenu"
import DropdownItem from "reactstrap/lib/DropdownItem"
import {  MessageCircle, List, Copy, Trash, CheckSquare, Compass } from 'react-feather'
import Dropdown from "reactstrap/lib/Dropdown"
import ContentEditable from "react-contenteditable"
import MenuDot from "../../assets/images/icons/menu-dot.svg"
import PlusIcon from "../../assets/images/icons/plus.svg"
import ListGroup from "reactstrap/lib/ListGroup"
import { useDispatch } from "react-redux"
import { SelectTypeOption } from "./workflowData"
import { position } from 'caret-pos'

const CustomNode = (props) => {
  const {
    item,
    index,
    globalTagList,
    id,
    hashTagPopUpId,
    checkboxCheck,
    updateSetId,
    caretPosition,
    internalCaretPosition,
    nodeString
  } = props

  const dispatch = useDispatch()

  useEffect(() => {
    const input = document.getElementById(`editable-${item.id}`)
    position(input, caretPosition)
  }, [caretPosition])

  const [dropdownOpenForTextType, setDropDownOpenForTextType] = useState(false)
  const [dropdownOpenForFontColor, setDropdownOpenForFontColor] = useState(false)
  const [dropdownOpenForHighLightColor, setDropdownOpenForHighLightColor] = useState(false)

  const inputStyleProperties = {
    color: item.fontColor,
    textDecoration: item.type === "BULLET" && item.isCompleted ? 'line-through' : "",
    textDecorationLine: item.highlightColor !== "" ? 'underline' : "none",
    textDecorationStyle: item.highlightColor !== "" ? 'solid' : "none",
    textDecorationColor: item.highlightColor,
    textDecorationThickness: '5px',
  }

  const toggleTextType = () => {
    setDropDownOpenForTextType(prevCheck => !prevCheck)
  }

  const onMouseEnterForTextType = () => {
    setDropDownOpenForTextType(true)
  }

  const onMouseLeaveForTextType = () => {
    setDropDownOpenForTextType(false)
  }

  const toggleFontColor = () => {
    setDropdownOpenForFontColor(prevCheck => !prevCheck)
  }

  const onMouseEnterForFontColor = () => {
    setDropdownOpenForFontColor(true)
  }

  const onMouseLeaveForFontColor = () => {
    setDropdownOpenForFontColor(false)
  }

  const toggleHighlightColor = () => {
    setDropdownOpenForHighLightColor(prevCheck => !prevCheck)
  }

  const onMouseEnterForHighlightColor = () => {
    setDropdownOpenForHighLightColor(true)
  }

  const onMouseLeaveForHighlightColor = () => {
    setDropdownOpenForHighLightColor(false)
  }

  const updateTextValue = (event, id) => {
    const input = document.getElementById(`editable-${item.id}`)
    const posValue = position(input)
    dispatch({ type: "UPDATE_WORKFLOW_ITEM", payload: { evt: event, currentLineId: id, caretPosition: posValue.pos }})
  }

  const onOpenComment = (item) => {
    dispatch({ type: "SHOWN_COMMENT_DIALOG", payload: item })
  }

  const handleAddModuleOrTask = (id) => {
    dispatch({ type: "ADD_MODULE_OR_TASK", payload: { currentLineId: id }})
    dispatch({ type: "CALCULATE_PROGRESS_OF_MODULE_AND_TASK" })
  }

  const handleDeleteModuleOrTask = (id) => {
    dispatch({ type: "DELETE_MODULE_OR_TASK", payload: { currentLineId: id }})
    dispatch({ type: "CALCULATE_PROGRESS_OF_MODULE_AND_TASK" })
  }

  const handleCopyModuleOrTask = (id) => {
    dispatch({ type: "COPY_MODULE_OR_TASK", payload: { currentLineId: id }})
    updateSetId(id)
    dispatch({ type: "CALCULATE_PROGRESS_OF_MODULE_AND_TASK" })
  }
  
  const onChangeType = (id, name) => {
    dispatch({ type: "CHANGE_TYPE", payload: { currentLineId: id, name }})
    updateSetId('')
    dispatch({ type: "CALCULATE_PROGRESS_OF_MODULE_AND_TASK" })
  }

  const changeColor = (color, id) => {
    dispatch({ type: "CHANGE_COLOR", payload: { currentLineId: id, color }})
  }
  
  const changeHighlightColor = (color, id) => {
    dispatch({ type: "CHANGE_HIGHLIGHT_COLOR", payload: { currentLineId: id, highlightColor: color }})
  }

  const handleKeyDown = (evt, id) => {
    if (evt.key === '#' || (evt.shiftKey && evt.key === '3')) {
      dispatch({ type: "HANDLE_HASH_POPUP", payload: { currentLineId: id }})
    }
    // hide the menu list when user pressed the space 
    if (evt.key === ' ') {
      dispatch({ type: "HANDLE_HASH_POPUP", payload: { currentLineId: '' }})
    }

    // double verify this code
    if (hashTagPopUpId && evt.key === 'Backspace' && nodeString.charAt(caretPosition - 1) === "#") {
      dispatch({ type: "HANDLE_HASH_POPUP", payload: { currentLineId: '' }})
    }

    if (hashTagPopUpId && evt.key === "ArrowLeft") {
      evt.preventDefault()
    }
  }

  const handleSelectedTag = (tag, id) => {
    dispatch({ type: "HANDLE_TAG_CLICK", payload: { currentLineId: id, tag, caretPosition } })
  }

  return (
    <>
      <div
        className="d-flex align-self-center align-items-center"
        style={{ paddingTop: "5px", paddingBottom: "5px" }}
        key={`xcvc-${item.id}`}
      >
        <div className="" key={`qwer-${item.id}`}>
          <img
            alt=""
            src={MenuDot}
            className="mw-50"
            role="button"
            style={{ width: "11px", height: "15px", marginRight: "3px", position: "relative", top: "-2px" }}
          />
        </div>
        <FormGroup style={{ marginBottom: "0px" }} key={`checkBox-${item.id}`}>
          {item.type === "CHECKBOX" ? (
            <CustomInput
              checked={item.isCompleted}
              type="checkbox"
              className="custom-control-Primary"
              id={`checkbox-${item.id}`}
              onClick={(e) => checkboxCheck(e, item.id)}
              onChange={(e) => {}}
            />

          ) : item.type === "BULLET" ? <div className="fullCircle pointer-cursor mr-1" onClick={() => checkboxCheck({ target: { checked: !item.isCompleted, type: "checkbox" } }, item.id)}></div>
          : ""
          }

        </FormGroup>
        <FormGroup style={{ marginBottom: "0px" }} className="w-100" key={`content-${item.id}`}>
            <ContentEditable
              key={item.id}
              id={`editable-${item.id}`}
              style={inputStyleProperties}
              className="editable"
              onKeyDown={(event) => handleKeyDown(event, item.id)}
              onChange={(event) => updateTextValue(event, item.id)}
              html={item.text}
              suppressContentEditableWarning={true}
              spellCheck={false}
            />
          {hashTagPopUpId === item.id ?
            <div
              className="pr-3 mt-2"
              style={{
                position: "absolute",
                zIndex: "9999999999999",
                padding: "0px 10px",
                backgroundColor: "white",
                width: "230px",
                height: "auto",
                maxHeight: "234px",
                overflowY: "auto",
                overflowX: "hidden"
              }}
            >
              <ListGroup style={{ width: "200px" }}>
                {globalTagList.length > 0 ? globalTagList.map((tag) => {
                  return (
                    <>
                      <ListGroupItem onClick={() => handleSelectedTag(tag, item.id)}>
                        <b> {tag} </b>
                      </ListGroupItem>
                    </>
                  )
                }) :
                  <>
                    <ListGroupItem>
                      No tag Founded
              </ListGroupItem>
                  </>
                }
              </ListGroup>
            </div> : <></>
          }
          {item.comments && item.comments.length > 0 && item.comments[0].text !== '' &&
            <div className="commnetBlock" onClick={(() => onOpenComment(item))}> <MessageCircle /> {item.comments.length}</div>
          }
        </FormGroup>
        <div className="img flex-row-reverse position-relative" key={`extra-${item.id}`}>
          <img
            alt="moreIcon"
            src={MoreIcon}
            style={{
              height: "20px",
              width: "20px",
              marginLeft: "10px",
              marginRight: "10px",
            }}
            onClick={() => updateSetId(item.id)}
          />
          <img
            alt="addIcon"
            src={PlusIcon}
            style={{
              height: "20px",
              width: "20px",
              marginLeft: "10px",
              marginRight: "10px",
            }}
            onClick={() => handleAddModuleOrTask(item.id)}
          />
          {id === item.id ? (
            <>
              <div
                className="delete dlt-btn shadow-sm pr-3 mt-2"
                style={{
                  position: "absolute",
                  zIndex: "9999999999999",
                  width: "auto",
                  right: "-28px",
                  border: 0
                }}
                key={`cosmdsaatic-${item.id}`}
              >
                <ListGroup style={{ width: "200px" }}>

                  <ListGroupItem>
                    <Dropdown
                      direction="right"
                      className="d-inline-block w-100"
                      onMouseOver={onMouseEnterForTextType}
                      onMouseLeave={onMouseLeaveForTextType}
                      isOpen={dropdownOpenForTextType}
                      toggle={toggleTextType}
                    >
                      <CheckSquare />
                      <DropdownToggle id="dropdownMenuButtonCheckbox" color="white" style={{ padding: "0px" }}>
                        {SelectTypeOption().map((sType) => {
                          if (sType.key === item.type) {
                            return (
                              sType.name
                            )
                          }
                        })}
                      </DropdownToggle>
                      <DropdownMenu aria-labelledby="dropdownMenuButton" key={`cosmaticMenu-${item.id}`}>
                        {SelectTypeOption().map((data, index) => {
                          if (data.key !== item.type) {
                            return (
                              <DropdownItem key={`cosmatic-${item.id}-${index}`} onClick={() => onChangeType(item.id, data.key, index)} className="flex justify-content-between w-100"><span className="mr-1">{data.icon()}</span>{data.name}</DropdownItem>
                            )
                          }
                        })}
                      </DropdownMenu>
                    </Dropdown>
                  </ListGroupItem>

                  <ListGroupItem>
                    <Dropdown
                      direction="right"
                      className="d-inline-block w-100"
                      onMouseOver={onMouseEnterForFontColor}
                      onMouseLeave={onMouseLeaveForFontColor}
                      isOpen={dropdownOpenForFontColor}
                      toggle={toggleFontColor}
                    >
                      <DropdownToggle id="dropdownMenuButtonCheckbox" color="white" style={{ padding: "0px" }}>
                        <List /> Font Color
                    </DropdownToggle>
                      <DropdownMenu aria-labelledby="dropdownMenuButton">
                        <div style={{ padding: "10px" }}>
                          <CirclePicker
                            onChange={(color) => changeColor(color, item.id)}
                            color="black"
                            circleSize={24}
                            circleSpacing={18}
                          />
                        </div>
                      </DropdownMenu>
                    </Dropdown>
                  </ListGroupItem>

                  <ListGroupItem>
                    <Dropdown
                      direction="right"
                      className="d-inline-block w-100"
                      onMouseOver={onMouseEnterForHighlightColor}
                      onMouseLeave={onMouseLeaveForHighlightColor}
                      isOpen={dropdownOpenForHighLightColor}
                      toggle={toggleHighlightColor}
                      style={{ padding: "0px" }}
                    >
                      <DropdownToggle id="dropdownMenuButtonCheckbox" color="white" style={{ padding: "0px" }}>
                        <Compass /> Highlight Color
                    </DropdownToggle>
                      <DropdownMenu aria-labelledby="dropdownMenuButton">
                        <div style={{ backgroundColor: "white", padding: "10px" }}>
                          <CirclePicker
                            onChange={(color) => changeHighlightColor(color, item.id)}
                            color="black"
                            circleSize={24}
                            circleSpacing={18}
                          />
                        </div>
                      </DropdownMenu>
                    </Dropdown>
                  </ListGroupItem>

                  <ListGroupItem className="pointer-cursor" onClick={() => handleCopyModuleOrTask(item.id)}><Copy /> Clone</ListGroupItem>
                  <ListGroupItem className="pointer-cursor" onClick={() => onOpenComment(item)}><MessageCircle /> Comment </ListGroupItem>
                  <ListGroupItem className="pointer-cursor" onClick={() => handleDeleteModuleOrTask(item.id)}>
                    <Trash />
                    Delete
                </ListGroupItem>
                </ListGroup>
              </div>
            </>
          ) : (
              ""
            )}
        </div>
      </div>

  </>
  )
}
// export default CustomNode
export default memo(CustomNode, (prevProps, nextProps) => {
  // Only re-render when `name' changes
  return prevProps.id === nextProps.id && prevProps.item.text === nextProps.item.text && JSON.stringify(prevProps.item) === JSON.stringify(nextProps.item)
  // return Object.keys(prevProps).length === Object.keys(nextProps).length  && prevProps.id === nextProps.id && prevProps.item.text === nextProps.item.text && JSON.stringify(prevProps.item) === JSON.stringify(nextProps.item)
})
