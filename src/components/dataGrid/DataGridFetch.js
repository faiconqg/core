import React from 'react'
import { withStyles, IconButton, CircularProgress, InputAdornment, FormControl, Input } from '@material-ui/core'
import { observer } from './../../api'
import DataGrid from './DataGrid'
import Search from '@material-ui/icons/Search'
import GetApp from '@material-ui/icons/GetApp'
import Sync from '@material-ui/icons/Sync'
import Clear from '@material-ui/icons/Clear'

const styles = theme => ({
  // root: {},
  tollbars: {
    display: 'flex',
    alignItems: 'center'
  },
  textField: {
    width: 200
  },
  progress: {
    color: theme.palette.grey[500]
  },
  progressContainer: {
    padding: 12
  }
})

export default
@withStyles(styles)
@observer
class DataGridFetch extends React.Component {
  constructor(params) {
    super(params)
    if (!this.props.store.pagination.orderBy) {
      this.props.store.pagination.orderBy = this.props.orderBy
    }
    if (!this.props.store.pagination.rowsPerPage) {
      this.props.store.pagination.rowsPerPage = this.props.rowsPerPage || 10
    }
    if (this.props.store.pagination.page === null) {
      this.props.store.pagination.page = this.props.page || 0
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (JSON.stringify(prevProps.filter) !== JSON.stringify(this.props.filter)) {
      this.refresh(true)
    }
  }

  componentDidMount() {
    this.refresh()
  }

  handleRefresh = event => {
    this.refresh(true)
  }

  handleExport = event => {
    let props = []
    if (this.props.children[0].props.hasOwnProperty('children')) {
      this.props.children.forEach(columns => {
        columns.props.children.forEach(children => {
          if (columns.props.title !== '') {
            //let newChildren = { ...children }
            let alterChildren = Object.assign({}, children, {
              props: { title: `${columns.props.title} - ${children.props.title}`, field: children.props.field, visible: children.props.visible }
            })
            children = alterChildren
          }
          props.push(children)
        })
      })
    } else {
      props = this.props.children
    }
    this.props.store.export(
      props
        .filter(column => {
          const { visible = true } = column.props
          return visible
        })
        .map(item => item.props),
      this.props.exportFile
    )
  }

  handleSort = e => {
    const sortModel = e.api.getSortModel()
    this.props.store.pagination.orderBy = sortModel.map(col => col.colId + ' ' + col.sort)
    this.refresh(true)
  }

  handleSearch = value => {
    this.props.store.pagination.search = value
    this.delayedRefresh()
  }

  handleRequestSort = (order, orderBy) => {
    this.props.store.pagination.order = order
    this.props.store.pagination.orderBy = orderBy
    this.refresh(true)
  }

  handleChangePage = page => {
    this.props.store.pagination.page = page
    this.refresh(true)
  }

  handleChangeRowsPerPage = rowsPerPage => {
    this.props.store.pagination.rowsPerPage = rowsPerPage
    this.refresh(true)
  }

  resolveSearch = () => {
    if (this.props.searchableFields && this.props.store.pagination.search && this.props.store.pagination.search.length > 0) {
      return {
        or: this.props.searchableFields.map(field => {
          let searchObject = { like: `%${this.props.store.pagination.search}%` }
          const splitedField = field.split('.').reverse()
          for (const subFeld of splitedField) {
            searchObject = { [subFeld]: searchObject }
          }
          return searchObject
        })
      }
    } else {
      return {}
    }
  }

  delayedRefresh = () => {
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => this.refresh(true), 300)
  }

  refresh = (force = false) => {
    if (this.props.store.isEmpty || force) {
      let query = this.props.store
        .where(this.resolveSearch(), true)
        .scope()
        .select(this.props.select)
        .where(this.props.filter)
      if (!this.props.clientSide) {
        query.limit(this.props.store.pagination.rowsPerPage).offset(this.props.store.pagination.page * this.props.store.pagination.rowsPerPage)
      }
      if (this.props.store.pagination.orderBy) {
        query.order(this.props.store.pagination.orderBy)
      }
      if (this.props.store.request) {
        this.props.store.request.abort()
      }
      query.all().then(() => {
        return this.props.store.fetchCount()
      })
    }
  }

  render() {
    const { classes, onItemClick, store, fixedColumn, controlBar, titleBar, showExport = true, ...props } = this.props

    const { orderBy, rowsPerPage, search, page } = this.props.store.pagination

    return (
      <DataGrid
        {...props}
        page={page}
        // onSortChanged={this.handleSort}
        onItemClick={onItemClick}
        rowCount={store.count}
        rowsPerPage={rowsPerPage}
        fixedColumn={fixedColumn}
        orderBy={orderBy}
        rows={store.models}
        onChangePage={this.handleChangePage}
        onChangeRowsPerPage={this.handleChangeRowsPerPage}
        busy={this.props.store.busy()}
        busyCount={this.props.store.busyCount()}
        titleBar={
          <div className={classes.tollbars}>
            <Search />
            <FormControl>
              <Input
                placeholder="Pesquisa"
                className={classes.textField}
                value={search}
                onChange={event => this.handleSearch(event.target.value)}
                endAdornment={
                  search && (
                    <InputAdornment position="end">
                      <IconButton onClick={() => this.handleSearch('')} alt="Limpar busca">
                        <Clear />
                      </IconButton>
                    </InputAdornment>
                  )
                }
              />
            </FormControl>

            {titleBar}
          </div>
        }
        controlBar={
          <div className={classes.tollbars}>
            {showExport &&
              (this.props.store.busyExport() ? (
                <div className={classes.progressContainer}>
                  <CircularProgress size={24} className={classes.progress} />
                </div>
              ) : (
                <>
                  <IconButton onClick={this.handleExport} alt="Exportar para XLS">
                    <GetApp />
                  </IconButton>
                  <IconButton onClick={this.handleRefresh} alt="Atualizar">
                    <Sync />
                  </IconButton>
                </>
              ))}
            {controlBar}
          </div>
        }
      />
    )
  }
}
