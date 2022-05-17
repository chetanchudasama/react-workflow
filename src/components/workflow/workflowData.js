import { v4 as uuidv4 } from "uuid"
import { CheckCircle, Target, Code } from 'react-feather'

export const ModuleData = () => {
  return {
    type: 'CHECKBOX',
    id: uuidv4(),
    text: "",
    tempText: "",
    isCompleted: false,
    fontColor: 'black',
    highlightColor: '',
    tags: [],
    prevTags: [],
    comments: [
      {
        text: "",
        commentedBy: 'system',
        time: ""
      }
    ],
    children: [
      {
        id: uuidv4(),
        text: "",
        tempText: "",
        isCompleted: false,
        type: 'CHECKBOX',
        fontColor: 'black',
        highlightColor: '',
        tags: [],
        prevTags: [],
        comments: [
          {
            text: "",
            commentedBy: 'system',
            time: ""
          }
        ],
      },
      {
        id: uuidv4(),
        text: "",
        tempText: "",
        isCompleted: false,
        type: 'CHECKBOX',
        fontColor: 'black',
        highlightColor: '',
        tags: [],
        prevTags: [],
        comments: [
          {
            text: "",
            commentedBy: 'system',
            time: ""
          }
        ],
      },
    ],
  }
}

export const TaskData = () => {
  return {
      id: uuidv4(),
      text: "",
      tempText: "",
      isCompleted: false,
      type: 'CHECKBOX',
      fontColor: 'black',
      highlightColor: '',
      tags: [],
      prevTags: [],
      comments: [
          {
              text: "",
              commentedBy: 'system',
              time: ""
          }
      ],
  }
}

export const StatusFlowOption = () => {
  return [
    { value: 'Review', label: 'Review' },
    { value: 'Approved', label: 'Approved' },
    { value: 'InProgress', label: 'InProgress' },
  ]
}

export const AssignedOption = () => {
  return [
      { value: 'System', label: 'System' },
      { value: 'Test', label: 'Test' },
  ]
}

export const SelectTypeOption = () => {
  return [
    { key: "CHECKBOX", name: "CheckBox", icon: () => <CheckCircle /> }, 
    { key: "BULLET", name: "Bullet", icon: () => <Target /> }, 
    { key: "PARAGRAPH", name: "Paragraph", icon: () => <Code /> }
  ]
}