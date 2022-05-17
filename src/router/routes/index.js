// ** Routes Imports

import WorkflowRoutes from "./Workflow"
import ExtensionsRoutes from "./Extensions"

// ** Document title
const TemplateTitle = "%s - Workflow Template"

// ** Default Route
const DefaultRoute = "/workflow/list"

// ** Merge Routes
const Routes = [...ExtensionsRoutes, ...WorkflowRoutes]

export { DefaultRoute, TemplateTitle, Routes }
