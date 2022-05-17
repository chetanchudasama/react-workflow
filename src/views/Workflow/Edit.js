import React, { useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import {
  editWorkFlowDetail,
  getWorkflowById,
} from "../../redux/actions/workflow"
import { useDispatch, useSelector } from "react-redux"
import Workflow from "../../components/workflow/Workflow"

const Edit = () => {
  const { id } = useParams()
  const { workflowDetail, isLoading } = useSelector((state) => state.workflow)
  const [isShownOpenSuccessDialog, setIsShownOpenSuccessDialog] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const dispatch = useDispatch()
  const history = useHistory()

  useEffect(() => {
    getWorkflowById(dispatch, id)
    setIsMounted(true)
  }, [id])

  const handleUpdationWorkflowData = (workFlowDetail) => {
    workFlowDetail["_id"] = id
    editWorkFlowDetail(dispatch, workFlowDetail)
    setIsShownOpenSuccessDialog(true)
  }

  const handleBackToList = () => {
    setIsShownOpenSuccessDialog(false)
    history.push("/")
  }

  const resetWorkflow = () => {
    setIsShownOpenSuccessDialog(false)
    //TODO: flow not discuss 
  }

  return (
    <>
      {id ? (
        <>
          {isMounted && !isLoading && (
            <Workflow
              workFlowId={id}
              isShownOpenSuccessDialog={isShownOpenSuccessDialog}
              workFlowData={JSON.parse(JSON.stringify(workflowDetail))}
              handleUpdationWorkflowData={handleUpdationWorkflowData}
              handleBackToList={handleBackToList}
              resetWorkflow={resetWorkflow}
            />
          )}
        </>
      ) : (
        <>
          <h3> No workflow id selected </h3>
        </>
      )}
    </>
  )
}

export default Edit
