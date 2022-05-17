import { lazy } from "react"

const WorkflowRoutes = [
  // Workflow
  {
    path: "/workflow/add",
    component: lazy(() => import("../../views/Workflow/Add")),
    exact: true,
  },
  {
    path: "/workflow/list",
    component: lazy(() => import("../../views/Workflow/List")),
  },
  {
    path: "/workflow/edit/:id?",
    component: lazy(() => import("../../views/Workflow/Edit")),
  },
]

export default WorkflowRoutes
