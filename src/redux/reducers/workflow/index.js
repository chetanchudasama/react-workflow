  // ** Initial State
  const initialState = {
    itemsRedux: [],
    isLoading: false,
    workflowList: [],
    workflowDetail: {}
  }

  const workFlowReducer = (state = initialState, action) => {
    switch (action.type) {
      case "GET_WORK_FLOW_Data":
        return { ...state, workflowList: action.payload }
      case "GET_WORK_FLOW_DATA_BY_ID":
        return { ...state, workflowDetail: action.payload }
      case "ADD_WORK_FLOW_DATA":
        return {
          ...state,
          workflowList: [...state.workflowList, action.payload]
        }
      case "EDIT_WORK_FLOW_DATA":
        return {
          ...state,
          workflowDetail: action.payload
        }
      case "DELETE_WORK_FLOW_DATA":
          return {
            ...state,
            workflowList: state.workflowList.filter((x) => { return !action.payload.includes(x._id) ? x : false })
          }
      default:
        return state
    }
  }

  export default workFlowReducer
