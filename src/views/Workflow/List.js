import { useEffect, Fragment, useState, forwardRef, useCallback, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getWorkflowList, deleteWorkFlowDetail } from "../../redux/actions/workflow"
import { Link, useHistory } from "react-router-dom"
import styled from 'styled-components'
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
} from "reactstrap"
import BreadCrumbs from "../../@core/components/breadcrumbs"
import { Edit } from "react-feather"
import DataTable from 'react-data-table-component'
import moment from "moment"
import { updateLastActionTime } from "../../utility/Utils"

// ** Bootstrap Checkbox Component
const BootstrapCheckbox = forwardRef(({ onClick, ...rest }, ref) => (
  <div className='custom-control custom-checkbox'>
    <input type='checkbox' className='custom-control-input' ref={ref} {...rest} />
    <label className='custom-control-label' onClick={onClick} />
  </div>
))

const formatDate = (date) => {
  if (date) {
    return  moment(date).format('DD-MM-YYYY')
  } 
  return "-"
}

const TextField = styled.input`
  height: 32px;
  width: 200px;
  border-radius: 3px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border: 1px solid #7ed321;
  padding: 0 32px 0 16px;

  &:hover {
  cursor: pointer;
}
`

const List = () => {
  const history = useHistory()
  const [selectedRows, setSelectedRows] = useState([])
  const workflowList = useSelector((state) => state.workflow.workflowList)
  const dispatch = useDispatch()
  const [filterText, setFilterText] = useState('')
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false)
  const filteredItems = workflowList.filter(item => (item.workflowTitle && item.workflowTitle.toLowerCase().includes(filterText.toLowerCase())) ||
    (item.assignedTo && item.assignedTo.toLowerCase().includes(filterText.toLowerCase())) ||
    (item.status && item.status.toLowerCase().includes(filterText.toLowerCase())) ||
    (item.dueDate && formatDate(item.dueDate).includes(filterText)) ||
    item.progressPer === Number(filterText)
  )

  useEffect(() => {
    getWorkflowList(dispatch)
  }, [])

  const handleEditWorkflow = (id) => {
    updateLastActionTime()
    history.push(`edit/${id}`)
  }

  const handleRowSelected = useCallback(state => {
    setSelectedRows(state.selectedRows)
  }, [])

  const handleDelete = () => {
    updateLastActionTime()
    const deleteIdList = selectedRows.map(rowData => rowData._id)
    const reqPayload = {
      ids: deleteIdList
    }
    deleteWorkFlowDetail(dispatch, reqPayload)
  }

  // ** Table Common Column
  const columns = [
    {
      name: 'Project Title',
      selector: 'workflowTitle',
      sortable: true,
      responsive: true,
    },
    {
      name: 'End Date',
      selector: 'dueDate',
      sortable: true,
      minWidth: '150px',
      style: { "align-items": "end" },
      hide: 'md',
      cell: row => {
        return (
          <p>
            {formatDate(row?.dueDate)}
          </p>
        )
      }
    },
    {
      name: 'Assigned To',
      selector: 'assignedTo',
      sortable: true,
      minWidth: '150px',
      hide: 'md'
    },
    {
      name: 'Percent Complete',
      selector: 'progressPer',
      sortable: true,
      minWidth: '150px',
      hide: 'md'
    },
    {
      name: 'Status',
      selector: 'status',
      sortable: true,
      minWidth: '100px',
      hide: 'md',
      cell: row => {
        return (
        <Badge
          className="text-capitalize badge-glow"
          color={
            row.status === "Review" ? "success" : row.status === "Approved" ? "info" : "warning"
          }
        >
          {row?.status}
        </Badge>
        )
      }
    },
    {
      name: 'Action',
      allowOverflow: true,
      width: "100px",
      responsive: true,
      cell: row => {
        return (
          <Button
            color="white"
            className="btn-sm-block pe-auto"
            onClick={() => handleEditWorkflow(row._id)}
          >
            <Edit className="mr-50" size={15} />
          </Button>
        )
      }
    }
  ]

  const subHeaderComponentMemo = useMemo(() => {
    return (
      <div className="container">
        <div className="row position-md-relative">
          <div className="col-md-8">
          <Button
              tag={Link}
              to="/workflow/add"
              color="primary"
              className="btn-sm-block my-1 pe-auto"
              onClick={updateLastActionTime}
            >
              Add Workflow
            </Button>
            {selectedRows?.length > 0 &&
              <>
                <Button
                  color="danger"
                  className="btn-sm-block ml-md-1 my-1 pe-auto"
                  onClick={handleDelete}
                >
                  Delete
                </Button> 
            </>
            }
            </div>
            <div className="col-md-4 pt-2 text-right">
              <TextField
              id="search"
              className="custom-class"
              type="text"
              placeholder="Search"
              aria-label="Search Input"
              value={filterText}
              onChange={e => setFilterText(e.target.value)}
            />
          </div>
        </div>
      </div>
    )
  }, [filterText, resetPaginationToggle, selectedRows])

  return (
    <>
      <BreadCrumbs
        breadCrumbTitle="Home"
        breadCrumbParent="Workflow"
        breadCrumbActive="List"
      />
      <Card>
        <CardHeader className="pb-0">
          <CardTitle tag="h4">
            <p>Workflow List</p>
          </CardTitle>
        </CardHeader>
        <CardBody className="p-0">
          <Fragment>
            {subHeaderComponentMemo}
            <DataTable
              noHeader
              columns={columns}
              data={filteredItems}
              pagination
              paginationResetDefaultPage={resetPaginationToggle}
              selectableRows
              persistTableHead
              className='react-dataTable'
              selectableRowsComponent={BootstrapCheckbox}
              onSelectedRowsChange={handleRowSelected}
            />
          </Fragment>
        </CardBody>
      </Card>
    </>
  )
}

export default List
