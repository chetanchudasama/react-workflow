// ** React Imports
import { useEffect } from "react"
import { NavLink } from "react-router-dom"

// ** Third Party Components
import { Disc, X, Circle } from "react-feather"

// ** Config
import themeConfig from "@configs/themeConfig"

const VerticalMenuHeader = (props) => {
  // ** Props
  const {
    menuCollapsed,
    setMenuCollapsed,
    setMenuVisibility,
    setGroupOpen,
    menuHover
  } = props

  // ** Reset open group
  useEffect(() => {
    if (!menuHover && menuCollapsed) setGroupOpen([])
  }, [menuHover, menuCollapsed])

  // ** Menu toggler component
  const Toggler = () => {
    if (!menuCollapsed) {
      return (
        <Disc
          size={20}
          data-tour="toggle-icon"
          className="text-primary toggle-icon d-none d-xl-block"
          onClick={() => setMenuCollapsed(true)}
        />
      )
    } else {
      return (
        <Circle
          size={20}
          data-tour="toggle-icon"
          className="text-primary toggle-icon d-none d-xl-block"
          onClick={() => setMenuCollapsed(false)}
        />
      )
    }
  }

  return (
    <div className="navbar-header" style={{ height: "auto"}}>
      <ul className="nav navbar-nav flex-row">
        <li className="nav-item mr-auto text-center" style={{ width: "100%"}}>
          <NavLink to="/" className="navbar-brand">
            <span className="brand-logo" style={{ width: "100%"}}>
              <img src={themeConfig.app.appLogoImage} alt="logo" height={40} width={50} />
            </span>
          </NavLink>
          <br />
          <h2 className="brand-text mb-0">{themeConfig.app.appName}</h2>
        </li>
      </ul>
    </div>
  )
}

export default VerticalMenuHeader
