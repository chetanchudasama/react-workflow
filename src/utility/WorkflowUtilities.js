export const GetIndexValueFromWorkflowData = (workflowData, currentLineId) => {
    for (let i = 0; i < workflowData.length; i++) {
        // find the taskIndex
        const taskIndex = workflowData[i].children.findIndex((x) => x.id === currentLineId)
        if (taskIndex !== -1) {
          // here return the moduleId and taskIndex 
          return { moduleIndex: i, taskIndex }
        } else if (workflowData[i] && workflowData[i].id === currentLineId) {
          // here return the moduleId 
          return { moduleIndex: i }
        }
    }
    return null
}

export const GetIdOfNodeFromObject = (workflowData) => {
  const nodeIdList = []
  if (workflowData) {
    nodeIdList.push(workflowData.id)
    for (let j = 0; j < workflowData.children.length; j++) {
      nodeIdList.push(workflowData.children[j].id)
    }
    return nodeIdList    
  } else {
    return nodeIdList
  }
}