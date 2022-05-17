import React, { Component } from "react"
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers"
import DateFnsUtils from "@date-io/date-fns"
import { createTheme, MuiThemeProvider } from '@material-ui/core'
import moment from "moment"

const customTheme = createTheme({
palette: {
  primary: {
    main: '#7ed321',
  },
},
})

class CustomDatepicker extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <>
      <MuiThemeProvider theme={customTheme}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
              label={this.props.label}
              placeholder="DD/MM/YYYY"
              inputVariant={this.props.inputVariant}
              value={this.props.value} 
              onChange={this.props.onChange}
              format={this.props?.format}
              clearable={this.props.clearable}
              fullWidth
              minDate={new Date()}
              error={this.props.isShownError && !moment(moment(this.props.value).format("YYYY-MM-DD")).isSameOrAfter(moment(new Date()).format("YYYY-MM-DD"))}
              helperText={this.props.isShownError && !moment(moment(this.props.value).format("YYYY-MM-DD")).isSameOrAfter(moment(new Date()).format("YYYY-MM-DD")) ? "Date should not be before minimal date" : ""}
            />
          </MuiPickersUtilsProvider>
        </MuiThemeProvider>
      </>
    )
  }
}
export default CustomDatepicker