import { List, Circle } from "react-feather"

const sideMenu = [
  {
    id: "workflow",
    title: "Workflow",
    icon: <List />,
    children: [
      {
        id: "list",
        title: "List",
        icon: <Circle />,
        navLink: "workflow/list",
      },
      {
        id: "add",
        title: "Add",
        icon: <Circle />,
        navLink: "workflow/add",
      },
      {
        id: "edit",
        title: "Edit",
        icon: <Circle />,
        navLink: "workflow/edit",
      },
    ],
  },
]

export default sideMenu
