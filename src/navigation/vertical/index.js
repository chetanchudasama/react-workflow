import { Circle, FileText } from "react-feather"

const sideMenu = [
  {
    id: "workflow",
    title: "Workflow",
    icon: <FileText size={20} />,
    children: [
      {
        id: "list",
        title: "List",
        icon: <Circle size={20} />,
        navLink: "/workflow/list",
      },
      {
        id: "add",
        title: "Add",
        icon: <Circle size={20} />,
        navLink: "/workflow/add",
      },
      {
        id: "edit",
        title: "Edit",
        icon: <Circle size={20} />,
        navLink: "/workflow/edit",
      },
    ],
  },
]

export default sideMenu
