import axios from "axios"
import { getToken } from "../../../auth/utils"

const api_url = process.env.REACT_APP_API_URL

export const getWorkflowList = async (dispatch) => {
  try {
    const res = await axios.get(`${api_url}/workflow/fetch/list`, { 
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    })
    dispatch({ type: "GET_WORK_FLOW_Data", payload: res.data })
  } catch (e) {
    console.log(e)
  }
}

export const getWorkflowById = async (dispatch, id) => {
  try {
    dispatch({ type: "WORK_FLOW_LOADING", payload: true })
    const res = await axios.get(`${api_url}/workflow/fetch/${id}`, { 
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    })
    if (res) {
      dispatch({ type: "GET_WORK_FLOW_DATA_BY_ID", payload: res.data })
      dispatch({ type: "WORK_FLOW_LOADING", payload: false })
    }
  } catch (e) {
    console.log(e)
  }
}

export const addWorkFlowDetail = async (dispatch, workflow) => {
  try {
    const res = await axios.post(`${api_url}/workflow/upsert`, workflow, { 
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`, 
      },
    })
    // TODO display successfully message
    // dispatch({ type: "ADD_WORK_FLOW_DATA", payload: res.data.data })
  } catch (e) {
    console.log(e)
  }
}

export const editWorkFlowDetail = async (dispatch, workflow) => {
  try {
    const res = await axios.post(`${api_url}/workflow/upsert`, workflow, { 
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    })
    // TODO display successfully updation message
    // dispatch({ type: "EDIT_WORK_FLOW_DATA", payload: res.data.data })
  } catch (e) {
    console.log(e)
  }
}

export const deleteWorkFlowDetail = async (dispatch, body) => {
  try {
    const res = await axios.post(`${api_url}/workflow/delete`, body, { 
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    })
    // TODO display successfully updation message
    // dispatch({ type: "EDIT_WORK_FLOW_DATA", payload: res.data.data })
    dispatch({ type: "DELETE_WORK_FLOW_DATA", payload: body.ids })
  } catch (e) {
    console.log(e)
  }
}
