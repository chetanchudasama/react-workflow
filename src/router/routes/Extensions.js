import { lazy } from "react"

const ExtensionsRoutes = [
  {
    path: "/login",
    component: lazy(() => import("../../views/Login")),
    layout: "BlankLayout"
  },
  {
    path: "/error",
    component: lazy(() => import("../../views/Error")),
    layout: "BlankLayout"
  }
]
export default ExtensionsRoutes
