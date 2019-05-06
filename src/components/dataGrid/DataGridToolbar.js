import React from 'react'
import { Typography, Paper, withStyles, LinearProgress } from '@material-ui/core'
// import { lighten } from '@material-ui/core/styles/colorManipulator'
import { Divider } from 'components'

const styles = theme => ({
  root: {
    backgroundColor: '#f8f8f8',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0
  },
  flex: {
    display: 'flex',
    alignItems: 'center',
    padding: 10
  },
  decorator: {
    backgroundColor: theme.palette.primary.main,
    height: 2
  },
  progress: {
    height: 2
  },
  // highlight: {
  //   color: theme.palette.secondary.main,
  //   backgroundColor: lighten(theme.palette.secondary.light, 0.85),
  //   borderRadius: 6
  // },
  spacer: {
    flex: '1 1 100%'
  },
  actions: {
    color: theme.palette.text.secondary
  },
  title: {
    flex: '0 0 auto'
  },
  titleBar: {
    display: 'flex',
    alignItems: 'center'
  }
})

export default
@withStyles(styles)
class DataGridToolbar extends React.Component {
  state = {
    search: '',
    name: ['Processando', 'Aprovado', 'Rejeitado']
  }

  handleChange = event => {
    this.setState({ name: event.target.value })
  }

  render() {
    const { numSelected, classes, titleBar, controlBar, title, busy } = this.props
    return (
      <Paper className={classes.root} square>
        <div className={classes.flex}>
          <div className={classes.title}>
            {numSelected > 0 ? (
              <Typography color="inherit" variant="subheading">
                {`${numSelected} ${numSelected > 1 ? 'selecionados' : 'selecionado'}`}
              </Typography>
            ) : (
              <div className={classes.titleBar}>
                {title && title}
                {title && titleBar && <Divider />}
                {titleBar}
                {/*<FormControl className={classes.formControl}>
                  <InputLabel htmlFor="select-multiple-checkbox">
                    Status
                  </InputLabel>
                  <Select
                    multiple
                    value={this.state.name}
                    onChange={this.handleChange}
                    input={<Input id="select-multiple-checkbox" />}
                    renderValue={selected => selected.join(', ')}
                  >
                    {names.map(name => (
                      <MenuItem key={name} value={name}>
                        <Checkbox
                          checked={this.state.name.indexOf(name) > -1}
                        />
                        <ListItemText primary={name} />
                      </MenuItem>
                    ))}
                  </Select>
                  </FormControl>*/}
              </div>
            )}
          </div>
          <div className={classes.spacer} />
          <div className={classes.actions}>{controlBar}</div>
        </div>
        {busy ? <LinearProgress className={classes.progress} variant="query" /> : <div className={classes.decorator} />}
      </Paper>
    )
  }
}
