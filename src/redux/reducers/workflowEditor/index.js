import { ModuleData, TaskData } from "../../../components/workflow/workflowData"
import { GetIndexValueFromWorkflowData, GetIdOfNodeFromObject } from "../../../utility/WorkflowUtilities"
import { v4 as uuidv4 } from 'uuid'

  // ** Initial State
  const initialState = {
    workflowItems: [],
    isShownCommentDialog: false,
    currentCommentValue: {},
    previousChangeTypeList: [],
    progress: 0,
    globalTagListItems: {},
    hashTagPopUpId: '',
    caretPosition: 0,
    internalCaretPosition: 0,
    nodeString: ''
  }

  const updateModuleId = (copyItem, taskIndex) => {
    if (taskIndex !== undefined) {
      const tempTask = { ...copyItem.children[taskIndex] }
      tempTask.id = uuidv4()
      return tempTask
    } else {
      const tempModule = JSON.parse(JSON.stringify(copyItem))
      tempModule.id = uuidv4()
      for (const childrenData of tempModule.children) {
        childrenData.id = uuidv4()
      }
      return tempModule
    }
  }

  const removeTagItems = (textValue, caretPosition) => {
    if (textValue.charAt(caretPosition - 1) === "#") {
      const stringArray = textValue.split('')
      stringArray.splice(caretPosition - 1, 1)
      const removeText = stringArray.join('')
      return [removeText, 1]
    } else {
      const beforeCaretString = textValue.slice(0, caretPosition)
      const lastIndexOfHashTag = beforeCaretString.lastIndexOf("#")
      const removeText = textValue.slice(0, lastIndexOfHashTag) + textValue.slice(caretPosition)
      return [removeText, caretPosition - lastIndexOfHashTag]
    }
  }

  const workflowEditorReducer = (state = initialState, action) => {
    switch (action.type) {
      case "INITIAL_WORKFLOW_ITEM":
        return {
          ...state,
          workflowItems: action.payload
        }
      case 'INITIAL_SET_TAG_LIST':
        return {
          ...state,
          globalTagListItems: action.payload
        }
      case "ADD_WORKFLOW_ITEM":
         const globalTagListItemsTemp = { ...state.globalTagListItems }
         const getNodeIdList = GetIdOfNodeFromObject(action.payload)
         for (let i = 0; i < getNodeIdList.length; i++) {
          globalTagListItemsTemp[getNodeIdList[i]] = []
         }
          return {
            ...state,
            workflowItems: [...state.workflowItems, action.payload],
            globalTagListItems: globalTagListItemsTemp
        }
      case "UPDATE_WORKFLOW_ITEM":
        const workDataTemp = [...state.workflowItems]
        const globalTagListItemsTTT = { ...state.globalTagListItems }
        const caretPos = action.payload.caretPosition
        const newTag = []
        let hashTagPopUpIdTemp = state.hashTagPopUpId
        const test = action.payload.evt.currentTarget.innerText.replace(/#\w+/gm, function(match) {
          if (match) {
            const result = `<b>${match}</b>`
            return result
          }
        })
        // manage the tag list record
        const regex = /#\w+/gm
        const found = action.payload.evt.currentTarget.innerText.match(regex)
        if (found) {
          for (let i = 0; i < found.length; i++) {
             const tags = found[i]
             newTag.push(tags)
          }
        }
        const internalCaretPositionTT = action.payload.caretPosition + (7 * newTag.length)
        const normalString = action.payload.evt.currentTarget.innerText
        if (normalString.charAt(caretPos - 1) === "#" && !(normalString.charAt(caretPos) === '' || normalString.charAt(caretPos) === ' ')) {
          hashTagPopUpIdTemp = ""
        }
        globalTagListItemsTTT[action.payload.currentLineId] = newTag
        const currentIndex = GetIndexValueFromWorkflowData(workDataTemp, action.payload.currentLineId)
        if (currentIndex.hasOwnProperty("moduleIndex") && currentIndex.hasOwnProperty('taskIndex')) {
          workDataTemp[currentIndex.moduleIndex].children[currentIndex.taskIndex].text = test 
        } else if (currentIndex.hasOwnProperty("moduleIndex")) {
          workDataTemp[currentIndex.moduleIndex].text = test
        }
      return {
        ...state,
        workflowItems: workDataTemp,
        globalTagListItems: globalTagListItemsTTT,
        caretPosition: action.payload.caretPosition,
        internalCaretPosition: internalCaretPositionTT,
        hashTagPopUpId: hashTagPopUpIdTemp,
        nodeString: action.payload.evt.currentTarget.innerText        
        }
      case "SHOWN_COMMENT_DIALOG": 
        return {
          ...state,
          isShownCommentDialog: true,
          currentCommentValue: action.payload
        }
      case "HIDE_COMMENT_DIALOG": 
        return {
          ...state,
          isShownCommentDialog: false
        }
      case "TOGGLE_COMMENT_DIALOG":
        return {
          ...state,
          isShownCommentDialog: !state.isShownCommentDialog
        }
      case "ADD_COMMENT":
        const workflowData = JSON.parse(JSON.stringify(state.workflowItems))
        const currentIndexTemp = GetIndexValueFromWorkflowData(workflowData, action.payload.currentLineId)
        if (currentIndexTemp.hasOwnProperty("moduleIndex") && currentIndexTemp.hasOwnProperty('taskIndex')) {
          if (workflowData[currentIndexTemp.moduleIndex].children[currentIndexTemp.taskIndex].comments[0].text === "") {
            workflowData[currentIndexTemp.moduleIndex].children[currentIndexTemp.taskIndex].comments[0].text = action.payload.commentValue
            workflowData[currentIndexTemp.moduleIndex].children[currentIndexTemp.taskIndex].comments[0].time = new Date()
          } else {
            workflowData[currentIndexTemp.moduleIndex].children[currentIndexTemp.taskIndex].comments.push({
              text: action.payload.commentValue,
              commentedBy: 'system',
              time: new Date()
            })
          }
        } else if (currentIndexTemp.hasOwnProperty("moduleIndex")) {
          if (workflowData[currentIndexTemp.moduleIndex].comments[0].text === "") {
            workflowData[currentIndexTemp.moduleIndex].comments[0].text = action.payload.commentValue
            workflowData[currentIndexTemp.moduleIndex].comments[0].time = new Date()
          } else {
            workflowData[currentIndexTemp.moduleIndex].comments.push({
              text: action.payload.commentValue,
              commentedBy: 'system',
              time: new Date()
            })
          }
        }
        return {
          ...state,
          workflowItems: workflowData,
          isShownCommentDialog: false
        }
      case "ADD_MODULE_OR_TASK":
        const workDataT = [...state.workflowItems]
        const globalTagListItemsT = { ...state.globalTagListItems }
        const currentIndexObj = GetIndexValueFromWorkflowData(workDataT, action.payload.currentLineId)
        if (currentIndexObj.hasOwnProperty("moduleIndex") && currentIndexObj.hasOwnProperty('taskIndex')) {
          const taskObj = TaskData()
          globalTagListItemsT[taskObj.id] = []
          workDataT[currentIndexObj.moduleIndex].children.splice(currentIndexObj.taskIndex + 1, 0, taskObj)
        } else if (currentIndexObj.hasOwnProperty("moduleIndex")) {
          const moduleObj = ModuleData()
          const getNodeIdList = GetIdOfNodeFromObject(moduleObj)
          for (let i = 0; i < getNodeIdList.length; i++) {
            globalTagListItemsT[getNodeIdList[i]] = []
          }
          workDataT.splice(currentIndexObj.moduleIndex + 1, 0, moduleObj)
        }
        return {
          ...state,
          workflowItems: workDataT,
          globalTagListItems: globalTagListItemsT
        }
      case 'DELETE_MODULE_OR_TASK': 
        const workDataTT = [...state.workflowItems]
        let previousChangeTypeListT = [...state.previousChangeTypeList]
        const globalTagListItemsTT = { ...state.globalTagListItems }
        const currentIndexT = GetIndexValueFromWorkflowData(workDataTT, action.payload.currentLineId)
        if (currentIndexT.hasOwnProperty("moduleIndex") && currentIndexT.hasOwnProperty('taskIndex')) {
          const index = previousChangeTypeListT.indexOf(action.payload.currentLineId)
          if (index > -1) {
            previousChangeTypeListT.splice(index, 1)
          }
          // delete tag from global list
          delete globalTagListItemsTT[action.payload.currentLineId]
          workDataTT[currentIndexT.moduleIndex].children.splice(currentIndexT.taskIndex, 1)
        } else if (currentIndexT.hasOwnProperty("moduleIndex")) {
          let childIdList = []
          childIdList = workDataTT[currentIndexT.moduleIndex].children.filter((x) => x.id && x.isCompleted && x.type === "PARAGRAPH").map((y) => y.id)
          if (workDataTT[currentIndexT.moduleIndex].type === "PARAGRAPH" && workDataTT[currentIndexT.moduleIndex].isCompleted) {
            childIdList.push(workDataTT[currentIndexT.moduleIndex].id)
          }
          previousChangeTypeListT = previousChangeTypeListT.filter((item) => { return childIdList.indexOf(item) === -1 })
          
          // delete tag from global lists
          delete globalTagListItemsTT[action.payload.currentLineId]
          if (workDataTT[currentIndexT.moduleIndex].children.length  > 0) {
            for (let i = 0; i < workDataTT[currentIndexT.moduleIndex].children.length; i++) {
              delete globalTagListItemsTT[workDataTT[currentIndexT.moduleIndex].children[i].id]
            }
          }
          workDataTT.splice(currentIndexT.moduleIndex, 1)
        }
        return {
          ...state,
          workflowItems: workDataTT,
          previousChangeTypeList: previousChangeTypeListT,
          globalTagListItems: globalTagListItemsTT
        }
      case 'UPDATE_MODULE_OR_TASK_PROGRESS':
        const workDataTTT = [...state.workflowItems]
        const currentIndexTT = GetIndexValueFromWorkflowData(workDataTTT, action.payload.currentLineId)
        if (currentIndexTT.hasOwnProperty("moduleIndex") && currentIndexTT.hasOwnProperty('taskIndex')) {
          workDataTTT[currentIndexTT.moduleIndex].children[currentIndexTT.taskIndex].isCompleted = action.payload.value
        } else if (currentIndexTT.hasOwnProperty("moduleIndex")) {
          workDataTTT[currentIndexTT.moduleIndex].isCompleted = action.payload.value
        }
        return {
          ...state,
          workflowItems: workDataTTT
        }
      case 'COPY_MODULE_OR_TASK': 
        const workflowDetail = [...state.workflowItems]
        const previousChangeTypeListTT = [...state.previousChangeTypeList]
        const currentIndexData = GetIndexValueFromWorkflowData(workflowDetail, action.payload.currentLineId)
        if (currentIndexData.hasOwnProperty("moduleIndex") && currentIndexData.hasOwnProperty('taskIndex')) {
          const updateItemDetail = updateModuleId(workflowDetail[currentIndexData.moduleIndex], currentIndexData.taskIndex)
          if (updateItemDetail.type === "PARAGRAPH") {
            previousChangeTypeListTT.push(updateItemDetail.id)
          } 
          workflowDetail[currentIndexData.moduleIndex].children.push(updateItemDetail)
        } else if (currentIndexData.hasOwnProperty("moduleIndex")) {
          const moduleDetail = updateModuleId(workflowDetail[currentIndexData.moduleIndex])
          if (moduleDetail.type === "PARAGRAPH") {
            previousChangeTypeListTT.push(moduleDetail.id)
          }
          let childIdList = []
          childIdList = moduleDetail.children.filter((x) => x.isCompleted && x.type === "PARAGRAPH").map((y) => y.id)
          previousChangeTypeListTT.push(...childIdList)
          workflowDetail.push(moduleDetail)
        }
        return {
          ...state,
          workflowItems: workflowDetail,
          previousChangeTypeList: previousChangeTypeListTT
        }
      case 'CHANGE_TYPE':
        const workflowDetailO = [...state.workflowItems]
        const previousChangeTypeListTemp = [...state.previousChangeTypeList]
        const currentIndexO = GetIndexValueFromWorkflowData(workflowDetailO, action.payload.currentLineId)
        if (currentIndexO.hasOwnProperty("moduleIndex") && currentIndexO.hasOwnProperty('taskIndex')) {
          for (let j = 0; j < workflowDetailO[currentIndexO.moduleIndex].children.length; j++) {
            workflowDetailO[currentIndexO.moduleIndex].children[j].type = action.payload.name
            if (action.payload.name === "PARAGRAPH" && !previousChangeTypeListTemp.includes(workflowDetailO[currentIndexO.moduleIndex].children[j].id)) {
              workflowDetailO[currentIndexO.moduleIndex].children[j].isCompleted = true
              previousChangeTypeListTemp.push(workflowDetailO[currentIndexO.moduleIndex].children[j].id)
            } else if (action.payload.name !== "PARAGRAPH" && previousChangeTypeListTemp.includes(workflowDetailO[currentIndexO.moduleIndex].children[j].id)) {
              const index = previousChangeTypeListTemp.indexOf(workflowDetailO[currentIndexO.moduleIndex].children[j].id)
              if (index > -1) {
                previousChangeTypeListTemp.splice(index, 1)
              }
              workflowDetailO[currentIndexO.moduleIndex].children[j].isCompleted = false
            }
          }
        } else if (currentIndexO.hasOwnProperty("moduleIndex")) {
          workflowDetailO[currentIndexO.moduleIndex].type = action.payload.name
          if (action.payload.name === "PARAGRAPH" && !previousChangeTypeListTemp.includes(workflowDetailO[currentIndexO.moduleIndex].id)) {
            workflowDetailO[currentIndexO.moduleIndex].isCompleted = true
            previousChangeTypeListTemp.push(workflowDetailO[currentIndexO.moduleIndex].id)
          } else if (action.payload.name !== "PARAGRAPH" && previousChangeTypeListTemp.includes(workflowDetailO[currentIndexO.moduleIndex].id)) {
            const index = previousChangeTypeListTemp.indexOf(workflowDetailO[currentIndexO.moduleIndex].id)
            if (index > -1) {
              previousChangeTypeListTemp.splice(index, 1)
            }
            workflowDetailO[currentIndexO.moduleIndex].isCompleted = false
          }
        }
        return {
          ...state,
          workflowItems: workflowDetailO,
          previousChangeTypeList: previousChangeTypeListTemp
        }
        case 'CHANGE_COLOR': 
        const workflowDetailColor = [...state.workflowItems]
        const currentIndexC = GetIndexValueFromWorkflowData(workflowDetailColor, action.payload.currentLineId)
        if (currentIndexC.hasOwnProperty("moduleIndex") && currentIndexC.hasOwnProperty('taskIndex')) {
          workflowDetailColor[currentIndexC.moduleIndex].children[currentIndexC.taskIndex].fontColor = action.payload.color.hex
        } else if (currentIndexC.hasOwnProperty("moduleIndex")) {
          workflowDetailColor[currentIndexC.moduleIndex].fontColor = action.payload.color.hex
        }
        return {
          ...state,
          workflowItems: workflowDetailColor
        }
        case 'CHANGE_HIGHLIGHT_COLOR': 
        const workflowDetailHighlighColor = [...state.workflowItems]
        const currentIndexH = GetIndexValueFromWorkflowData(workflowDetailHighlighColor, action.payload.currentLineId)
        if (currentIndexH.hasOwnProperty("moduleIndex") && currentIndexH.hasOwnProperty('taskIndex')) {
          workflowDetailHighlighColor[currentIndexH.moduleIndex].children[currentIndexH.taskIndex].highlightColor = action.payload.highlightColor.hex
        } else if (currentIndexH.hasOwnProperty("moduleIndex")) {
          workflowDetailHighlighColor[currentIndexH.moduleIndex].highlightColor = action.payload.highlightColor.hex
        }
        return {
          ...state,
          workflowItems: workflowDetailHighlighColor
        }
        case 'UPDATE_WORKFLOW_POSITION':
          return {
            ...state,
            workflowItems: action.payload
          }
        case 'CALCULATE_PROGRESS_OF_MODULE_AND_TASK':
          const workflowDataItems = [...state.workflowItems]
          if (workflowDataItems && workflowDataItems.length === 0) {
            return { ...state, progress: 0}
          } else {
            const totalItem = workflowDataItems.map((item) => {
              return item.children.length
            })
          
            const totalCheckbox = totalItem.reduce((a, b) => a + b, 0)
        
            let count = 0
            for (let i = 0; i < workflowDataItems.length; i++) {
              if (workflowDataItems[i].isCompleted) {
                count += 1
              }
              for (let j = 0; j < workflowDataItems[i].children.length; j++)  {
                if (workflowDataItems[i].children[j].isCompleted) {
                  count += 1
                }
              }
            }
            return { ...state, progress: (((count / (workflowDataItems?.length + totalCheckbox)) * 100) ? ((count / (workflowDataItems?.length + totalCheckbox)) * 100).toFixed(0) : 0) }
          }
        case 'HANDLE_HASH_POPUP':
          return {
            ...state,
            hashTagPopUpId: action.payload.currentLineId
          }
        case 'HANDLE_TAG_CLICK':
          const workFlowRecord = [...state.workflowItems]
          let internalCaretPositionTemp =  state.internalCaretPosition
          const caretPositionValue = state.caretPosition
          const nodeStringTemp = state.nodeString
          const currentIndexWI = GetIndexValueFromWorkflowData(workFlowRecord, action.payload.currentLineId)
          if (currentIndexWI.hasOwnProperty("moduleIndex") && currentIndexWI.hasOwnProperty('taskIndex')) {
            const result = removeTagItems(nodeStringTemp, caretPositionValue)
            internalCaretPositionTemp =  caretPositionValue - result[1]
            const newString = [result[0].slice(0,  internalCaretPositionTemp), action.payload.tag, result[0].slice(internalCaretPositionTemp)].join('')
            const finalString = newString.replace(/#\w+/gm, function(match) {
              if (match) {
                const result = `<b>${match}</b>`
                return result
              }
            })
            workFlowRecord[currentIndexWI.moduleIndex].children[currentIndexWI.taskIndex].text = finalString
          } else if (currentIndexWI.hasOwnProperty("moduleIndex")) {
            const result = removeTagItems(nodeStringTemp, caretPositionValue)
            internalCaretPositionTemp =  caretPositionValue - result[1]
            const newString = [result[0].slice(0,  internalCaretPositionTemp), action.payload.tag, result[0].slice(internalCaretPositionTemp)].join('')
            const finalString = newString.replace(/#\w+/gm, function(match) {
              if (match) {
                const result = `<b>${match}</b>`
                return result
              }
            })
            workFlowRecord[currentIndexWI.moduleIndex].text = finalString
          }
          return {
            ...state,
            workflowItems: workFlowRecord,
            hashTagPopUpId: '',
          }
      default:
        return state
    }
  }

  export default workflowEditorReducer
