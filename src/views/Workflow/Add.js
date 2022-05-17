import React, { useState } from "react"
import Workflow from "../../components/workflow/Workflow"
import { addWorkFlowDetail } from "../../redux/actions/workflow"
import { useHistory } from "react-router-dom"
import { useDispatch } from "react-redux"

const Add = () => {
  const [workflowData, setWorkflowData] = useState({})
  const [isShownOpenSuccessDialog, setIsShownOpenSuccessDialog] = useState(false)
  const history = useHistory()
  const dispatch = useDispatch()


  const handleSubmitWorkflowData = (workFlowDetail) => {
    addWorkFlowDetail(dispatch, workFlowDetail)
    setWorkflowData(workFlowDetail)
    setIsShownOpenSuccessDialog(true)
  }

  const handleBackToList = () => {
    setIsShownOpenSuccessDialog(false)
    history.push("/")
  }

  const resetWorkflow = () => {
    setIsShownOpenSuccessDialog(false)
    setWorkflowData({})
  }

  return (
    <>
      <Workflow
        isShownOpenSuccessDialog={isShownOpenSuccessDialog}
        workFlowData={workflowData ? JSON.parse(JSON.stringify(workflowData)) : null}
        handleSubmitWorkflowData={handleSubmitWorkflowData}
        handleBackToList={handleBackToList}
        resetWorkflow={resetWorkflow}
      />
    </>
  )
}
export default Add
