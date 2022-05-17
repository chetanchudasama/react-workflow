// ** Redux Imports
import { combineReducers } from "redux"

// ** Reducers Imports
import auth from "./auth"
import navbar from "./navbar"
import layout from "./layout"
import workflow from "./workflow"
import workflowEditor from "./workflowEditor"

const rootReducer = combineReducers({
  auth,
  navbar,
  layout,
  workflow,
  workflowEditor
})

export default rootReducer
