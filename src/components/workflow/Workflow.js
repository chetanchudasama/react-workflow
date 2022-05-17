import React, { useState, useRef, useEffect } from "react"
import Nestable from "react-nestable"
import UncontrolledTooltip from "reactstrap/lib/UncontrolledTooltip"
import { Button, Progress, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap"
import Input from "reactstrap/lib/Input"
import BreadCrumbs from "../../@core/components/breadcrumbs"
import Avatar from "@components/avatar"
import defaultAvatar from "@src/assets/images/portrait/small/avatar-s-11.jpg"
import CustomDatepicker from "../common/Datepicker"
import CustomSelect from "../common/CustomSelect"
import moment from "moment"
import CustomNode from "./CustomNode"
import { AssignedOption, ModuleData, StatusFlowOption, TaskData } from "./workflowData"
import { useDispatch, useSelector } from "react-redux"
import { CheckCircle, Send } from "react-feather"
import { updateLastActionTime } from "../../utility/Utils"

const formatDate = (date) => {
  if (date) {
    return  moment(date).format('HH:mm:ss YYYY-MM-DD')
  } 
  return "-"
}

const Workflow = ({
  handleBackToList,
  resetWorkflow,
  isShownOpenSuccessDialog,
  workFlowId,
  workFlowData,
  handleSubmitWorkflowData,
  handleUpdationWorkflowData,
}) => {
  const [id, setId] = useState("")
  const [count, setCount] = useState(0)
  const [isOpen, setisopen] = useState(false)
  const [isOpenSuccessDialog, setIsOpenSuccessDialog] = useState(false)
  const [globalTagList, setGlobalTagList] = useState({})
  const [commentValue, setCommentValue] = useState("")
  const [items, setItems] = useState(
    workFlowData.children ? workFlowData.children : []
  )
  const [currentLineId, setCurrentLineId] = useState("")
  const [assigned, setAssigned] = useState(workFlowId ? workFlowData.assignedTo : "")
  const [dueDate, setDueDate] = useState(workFlowId ? workFlowData.dueDate : null)
  const [statusFlow, setStatus] = useState(workFlowId ? workFlowData.status : "")
  const [projectTitle, setProjectTitle] = useState(
    workFlowData.workflowTitle ? workFlowData.workflowTitle : ""
  )
  const [isSubmitButtonClicked, setIsSubmitButtonClicked] = useState(false)
  const [isShownCommentError, setIsShownCommentError] = useState(false)
  const dispatch = useDispatch()
  
  const { workflowItems, isShownCommentDialog, currentCommentValue, progress, globalTagListItems, hashTagPopUpId, caretPosition, internalCaretPosition, nodeString } = useSelector((state) => state.workflowEditor)

  useEffect(() => {
    dispatch({ type: "INITIAL_WORKFLOW_ITEM", payload: workFlowData.children ? workFlowData.children : [] })
    dispatch({ type: "INITIAL_SET_TAG_LIST", payload: workFlowData.tags ? workFlowData.tags : {} })
    dispatch({ type: "CALCULATE_PROGRESS_OF_MODULE_AND_TASK" })
  }, [workFlowData])

  useEffect(() => {
    if (workFlowId) {
      setAssigned(workFlowData.assignedTo)
      setDueDate(workFlowData.dueDate)
      setStatus(workFlowData.status)
      setProjectTitle(workFlowData.workflowTitle)
    }
  }, [workFlowId, workFlowData])

  useEffect(() => {
    if (globalTagListItems) {
      const values = Object.values(globalTagListItems)
      const tagList = [].concat(...values)
      const uniqueTag = [...new Set(tagList)]
      setGlobalTagList(uniqueTag)
    } else {
      setGlobalTagList([])
    } 
  }, [globalTagListItems])

  const assignedData = {
    field: "assignedTo",
    options: AssignedOption(),
    is_clearable: false
  }

  const statusData = {
    field: "status",
    options: StatusFlowOption(),
    is_clearable: false
  }

  useEffect(() => {
    setIsOpenSuccessDialog(isShownOpenSuccessDialog)
  }, [isShownOpenSuccessDialog])

  useEffect(() => {
    if (workFlowData && Object.keys(workFlowData).length === 0) {
      setItems([])
      setProjectTitle("")
      setDueDate(null)
      setAssigned("")
      setStatus("")
      setIsSubmitButtonClicked(false)
    }
  }, [workFlowData])

  // update the index value when user changes the order of task or module
  const updateWorkFlowPosition = (items) => {
    dispatch({ type: "UPDATE_WORKFLOW_POSITION", payload: items })
  }

  const addModule = () => {
    const localModuleData = ModuleData()
    // add module dispatch here
    dispatch({ type: "ADD_WORKFLOW_ITEM", payload: localModuleData })
    dispatch({ type: "CALCULATE_PROGRESS_OF_MODULE_AND_TASK" })   
    setCurrentLineId(localModuleData.id)
  }

  const checkboxCheck = (e, id) => {
    const { checked, type } = e.target
    const finalCount = type === "checkbox" && checked === true ? count + 1 : count - 1
    setCount(finalCount)
    dispatch({ type: "UPDATE_MODULE_OR_TASK_PROGRESS", payload: { currentLineId: id, value: checked }})
    dispatch({ type: "CALCULATE_PROGRESS_OF_MODULE_AND_TASK" })
  }

  const onChangeCommnet = (value) => {
    setCommentValue(value)
  }

  const changeAssing = (value) => {
    setAssigned(value)
  }

  const changeStatus = (value) => {
    setStatus(value)
  }

  const toggleCommentDialog = () => {
    dispatch({ type: "TOGGLE_COMMENT_DIALOG"})
    setIsShownCommentError(false)
    setCommentValue("")
  }

  const saveCommentValue = (id) => {
    if (!commentValue) {
      setIsShownCommentError(true)
      return
    }
    setIsShownCommentError(false)
    dispatch({ type: "ADD_COMMENT", payload: { commentValue, currentLineId: id }})
    setCommentValue("")
    setisopen((prevOpen) => !prevOpen)
    setId('')
  }

  const isEditMode = () => {
    return workFlowId && workFlowData?.children?.length > 0 
  }

  const handleWorkflowAction = () => {
    updateLastActionTime()
    const dueDateTemp = moment(dueDate).format("YYYY-MM-DD")
    const currentDate  = moment(new Date()).format("YYYY-MM-DD")
    const isFutureDate = moment(dueDateTemp).isSameOrAfter(currentDate)
    if (projectTitle && assigned && statusFlow && dueDate && isFutureDate) {
      const workflowDataTemp = {
        workflowTitle: projectTitle,
        progressPer: progress,
        dueDate,
        assignedTo: assigned,
        children: workflowItems,
        status: statusFlow,
        tags: globalTagListItems
      }
      if (isEditMode() > 0) {
        handleUpdationWorkflowData(workflowDataTemp)
        dispatch({ type: "EDIT_WORK_FLOW_DATA", payload: workflowDataTemp })
      } else {
        handleSubmitWorkflowData(workflowDataTemp)
      }
    } 
    setIsSubmitButtonClicked(true)
  }

  const updateSetId = (id) => {
    setId(id)
  }

  return (
    <>
      <BreadCrumbs
        breadCrumbTitle="Home"
        breadCrumbParent="Workflow"
        breadCrumbActive={`${isEditMode() ? "Edit" : "Add"}`}
      />
      <div className="container">
        <div className="row">
          <div className="col-md-8">
            <div className="flex-fill card shadow-sm h-auto bg-body rounded border-0">
              <div className="card-content collapse show" aria-expanded="true">
                <div className="card-body ">
                  <div className="d-flex">
                    <div
                      className="shadow-sm rounded d-flex"
                      style={{ width: "60px", height: "60px" }}
                    >
                      <img
                        alt=""
                        src="https://img.icons8.com/windows/32/000000/file.png"
                        className="h-auto w-auto m-auto"
                      />
                    </div>
                    <div className="w-100  ml-1">
                      <Input
                        type="input"
                        name="projectTitle"
                        value={projectTitle}
                        className="form-control p-0 border-0 shadow-none w-100"
                        id="project-title"
                        placeholder="Add a Project Title"
                        onChange={(e) => {
                          setProjectTitle(e.target.value)
                        }}
                      />
                      {isSubmitButtonClicked && !projectTitle && (
                        <span style={{ color: "red"}}>
                          Project title is required
                        </span>
                      )}
                      <Progress
                        className="progress-bar-warning w-50 mt-1"
                        value={progress}
                        id="workflowProgress"
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-4 pl-1 pt-1">
                    <CustomDatepicker
                        label="Due Date"
                        inputVariant="standard"
                        value={dueDate}
                        onChange={(date) => {
                            setDueDate(date)
                          }
                        }
                        format={'dd/MM/yyyy'}
                        isShownError={isSubmitButtonClicked}
                      />
                      {isSubmitButtonClicked && !dueDate && (
                        <span style={{ color: "red" }}>
                          Due Date is required
                        </span>
                      )}
                    </div>
                    <div className="col-md-4 pt-2">
                      <CustomSelect
                        item={assignedData}
                        existingValues={assigned ? { [assignedData.field]: assigned } : null}
                        cProps={{editMode: true, handleEditValue: (item) => { changeAssing(item[assignedData.field]) }, placeholder: "Select Assigned" }}
                      />
                      {isSubmitButtonClicked && !assigned && (
                        <span style={{ color: "red" }}>
                          Assigned To is required
                        </span>
                      )}
                    </div>
                    <div className="col-md-4 pt-2">
                      <CustomSelect
                        item={statusData}
                        existingValues={statusFlow ? { [statusData.field]: statusFlow } : null}
                        cProps={{editMode: true, handleEditValue: (item) => { changeStatus(item[statusData.field]) }, placeholder: "Select Status" }}
                      />
                      {isSubmitButtonClicked && !statusFlow && (
                        <span style={{ color: "red" }}>
                          Status is required
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 mb-5">
                  <Nestable
                    items={workflowItems}
                    renderItem={(arg) => {
                      return  (
                        <CustomNode
                          key={arg.item.id}
                          {...arg}
                          id={id}
                          globalTagList={globalTagList}
                          hashTagPopUpId={hashTagPopUpId}
                          checkboxCheck={checkboxCheck}
                          updateSetId={updateSetId}
                          caretPosition={caretPosition}
                          internalCaretPosition={internalCaretPosition}
                          nodeString={nodeString}
                        />
                      )
                    }}
                    maxDepth={2}
                    onChange={(arg) => updateWorkFlowPosition(arg.items)}
                    key='dsd'
                  />
                  </div>
                  <p className="text-center " onClick={addModule}>
                    <button className="btn btn-link bg-white text-secondary">
                      + Add Module
                    </button>
                  </p>
                  <Button.Ripple
                    color="primary"
                    type="submit"
                    onClick={() => handleWorkflowAction()}
                  >
                    {`${isEditMode() ? "Update" : "Submit"}`}
                  </Button.Ripple>
                </div>
              </div>
            </div>
          </div>
                      
          <div className="col-md-4">
            <div
              className="ml-md-2 p-1 flex-fill  card shadow-sm bg-body rounded border-0"
            >
              <p className="uppercase text-secondary p-1">History</p>
              <div className="border"></div>
              <p className="mt-2 p-1 font-weight-bold text-dark">Today</p>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isShownCommentDialog} centered toggle={toggleCommentDialog} >
        <ModalHeader>{currentCommentValue.text}</ModalHeader>
        <ModalBody>
          <div>
            {currentCommentValue?.comments?.map((comment) => (
              <>
              <div className="d-flex showCommnet">
                <div style={{ height: "40px"}}> 
                  {comment.text !== "" && (
                    <Avatar img={defaultAvatar} imgHeight="40" imgWidth="40" status="online" />
                  )}
                </div>
                <div className="commnetText"> {comment.text} </div>
              </div>
              <div className="comment-time"> {comment.time && formatDate(comment.time)} </div>
              </>
            ))}
          </div>
          <hr></hr>
          <div>
            <Input
              type="input"
              value={commentValue}
              placeholder="Type '@' to mantion or add a commnet"
              className="input-border"
              onChange={(e) => {
                onChangeCommnet(e.target.value)
              }}
            />
            {isShownCommentError && (
              <span style={{ color: "red" }}>
                Comment is required
              </span>
            )}
          </div>
        </ModalBody>
        <ModalFooter><Send onClick={() => saveCommentValue(currentCommentValue.id)} /></ModalFooter>
      </Modal>
      
      <Modal isOpen={isOpenSuccessDialog} centered>
        <ModalBody>
            <div className="text-center my-1">
                <CheckCircle size="80" color="#5cb85c" />
                <h1 className="my-2">Done</h1> 
                <div>
                  <Button.Ripple
                  color="primary"
                  type="button"
                  onClick={handleBackToList}
                  >
                    Back to List
                  </Button.Ripple>
                  <Button.Ripple
                    color="primary"
                    type="button"
                    onClick={resetWorkflow}
                    className="mx-1"
                    >
                      Close
                  </Button.Ripple>
                </div>
            </div>
        </ModalBody>
      </Modal>

      <UncontrolledTooltip placement="bottom" target="workflowProgress" style={{ width: "100px" }}>
        {progress}%
      </UncontrolledTooltip>
    </>
  )
}
export default Workflow
