import Prism from 'prismjs'
import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { Slate, Editable, withReact } from 'slate-react'
import { Text, createEditor } from 'slate'
import { withHistory } from 'slate-history'
import { css } from '@emotion/css'
import ListGroup from "reactstrap/lib/ListGroup"
import ListGroupItem from "reactstrap/lib/ListGroupItem"

// eslint-disable-next-line
(Prism.languages.markdown = Prism.languages.extend("markup", {})),
  Prism.languages.insertBefore("markdown", "prolog", {
    title: [
      {
        pattern: /(\w*)#+(\w*)/mg,
        lookbehind: true,
        alias: "important",
        inside: { punctuation: /#+|#+$/ },
      },
    ],
  })

const ContentEditable = ({ id, inputValue, customStyle, tagList, isActive, updateTextValue }) => {
 const [value, setValue] = useState([])
 const renderLeaf = useCallback(props => <Leaf {...props} />, [])
 const editor = useMemo(() => withHistory(withReact(createEditor())), [])
 const [isHashTag, setIsHashTag] = useState(false)

  useEffect(() => {
  const inputContent = [{ type: 'span', children: [{ text: inputValue ? inputValue : '' }]}]
  setValue(inputContent)
 }, [inputValue])

 const decorate = useCallback(([node, path]) => {
    const ranges = []

    if (!Text.isText(node)) {
      return ranges
    }

    const getLength = token => {
      if (typeof token === 'string') {
        return token.length
      } else if (typeof token.content === 'string') {
        return token.content.length
      } else {
        return token.content.reduce((l, t) => l + getLength(t), 0)
      }
    }

    const tokens = Prism.tokenize(node.text, Prism.languages.markdown)
    let start = 0

    for (const token of tokens) {
      const length = getLength(token)
      const end = start + length

      if (typeof token !== 'string') {
        ranges.push({
          [token.type]: true,
          anchor: { path, offset: start },
          focus: { path, offset: end },
        })
      }

      start = end
    }
    return ranges
  }, [])

 const updateInputValue = (value) => {
    setValue(value)
    updateTextValue(id, value[0].children[0].text)
 }

 const Leaf = ({ attributes, children, leaf }) => {
   setIsHashTag(leaf.title ?? false)
  return (
    <>
    <span
      {...attributes}
      className={css`
        ${leaf.title &&
          css`
            display: inline-block;
            font-weight: bold;
            font-size: 14px;
            color: blue;
          `}
      `}
    >
      {children}
    </span>
    </>
  )
}

const updateContentInput = (tag) => {
  console.log(tag)
  console.log(inputValue + tag)
  updateTextValue(id, (`${inputValue}${tag} `))
}

  return (
    <>
    {value.length > 0 &&
      <div key={id}>
        <Slate editor={editor} value={value} onChange={updateInputValue}>
          <Editable
            onKeyDown={event => {
              // prevent to enter key into text
              if (event.key === 'Enter') {
                event.preventDefault()
                return false
              }
            }}
            decorate={decorate}
            renderLeaf={renderLeaf}
            style={customStyle}
          />
        </Slate>
      </div>
  }
   {isHashTag && isActive &&
        <div
          className="pr-3 mt-2"
          style={{
            position: "absolute",
            zIndex: "9999999999999",
            padding: "5px 10px",
            backgroundColor: "white",
            width: "250px"
          }}
        >
        <ListGroup style={{ width: "200px" }}>
          {tagList.length > 0 ? tagList.map((tag) => {
            return (
              <>
                <ListGroupItem onClick={() => updateContentInput(tag)}>
                  <b> #{tag} </b>
                </ListGroupItem>
              </>
            )
          }) :
            <>
              <ListGroupItem>
                  No tag Founded
                </ListGroupItem>
            </>
          }
        </ListGroup>
      </div>
    }
  </>)
}

export default ContentEditable