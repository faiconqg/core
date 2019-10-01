import React from 'react'
import DataGridToolbar from './DataGridToolbar'
import { observer, Model } from './../../api'
import { AppStore } from './../../stores'
import { withStyles, CircularProgress, TablePagination, Paper } from '@material-ui/core'
import { AgGridReact } from 'ag-grid-react'
import agGridTranslation from './../../resources/agGridTranslation.json'
import BooleanRenderer from './renderers/BooleanRenderer'
import ImageRenderer from './renderers/ImageRenderer'
import CurrencyFormatter from './formatters/CurrencyFormatter'
import DateFormatter from './formatters/DateFormatter'
import DateTimeFormatter from './formatters/DateTimeFormatter'
import PercentageFormatter from './formatters/PercentageFormatter'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-material.css'
import cs from 'classnames'

const formatters = {
  currency: CurrencyFormatter,
  date: DateFormatter,
  dateTime: DateTimeFormatter,
  percentage: PercentageFormatter
}

const styles = theme => ({
  root: {
    borderRadius: 6,
    display: 'flex',
    flexDirection: 'column',
    flex: 1
    //marginTop: theme.spacing.unit * 3,
  },
  wrap: {
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    paddingRight: 4,
    borderTopColor: theme.palette.grey[300],
    borderTopStyle: 'solid',
    fontSize: 12,
    borderTopWidth: 1
  },
  rowCount: {
    marginLeft: 3
  },
  statusBar: {
    paddingLeft: 10,
    paddingRight: 10,
    height: 38,
    display: 'flex'
  },
  statusBarInner: { flex: 1, display: 'flex', alignItems: 'center' },
  right: { justifyContent: 'flex-end' },
  progress: {
    color: theme.palette.grey[500]
  },
  paginationInfo: {
    display: 'flex',
    alignItems: 'center'
  },
  // table: {
  //   // minWidth: 1020
  // },
  tableWrapper: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  }
  // summary: {
  //   background: theme.palette.grey[200],
  //   fontWeight: 700
  // }
})

const rendererContainerStyle = { height: '100%', width: '100%', display: 'flex', alignItems: 'center' }

export default
@withStyles(styles)
@observer
class DataGrid extends React.Component {
  state = {
    orderBy: this.props.orderBy,
    page: this.props.page || 0,
    rowsPerPage: this.props.rowsPerPage || 10
  }

  componentDidMount() {
    // LegacyCampaigns.models.map(item => {
    //   return console.log(item.get('camp_nome'))
    // })
  }

  handleRequestSort = (event, property) => {
    const orderBy = property
    let order = 'asc'

    if (this.state.orderBy === property && this.state.order === 'asc') {
      order = 'desc'
    }
    this.setState({ order, orderBy })
    this.props.onRequestSort && this.props.onRequestSort(order, orderBy)
  }

  handleSelectAllClick = (event, checked) => {
    if (checked) {
      this.setState({ selected: this.props.rows.map(n => n.id) })
      return
    }
    this.setState({ selected: [] })
  }

  handleClick = (id, data) => {
    if (this.props.onItemClick) {
      this.props.onItemClick(id, data)
    }
  }

  handleSelect = (event, id) => {
    const { selected } = this.state
    const selectedIndex = selected.indexOf(id)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1))
    }

    this.setState({ selected: newSelected })
  }

  handleChangePage = (event, page) => {
    this.setState({ page })
    this.props.onChangePage && this.props.onChangePage(page)
  }

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value })
    this.props.onChangeRowsPerPage && this.props.onChangeRowsPerPage(event.target.value)
  }

  resolveLabel = (formatter, numeric, replaceBlank) => params => {
    let returnValue = this.itemToLabel(params)
    if (returnValue === null || returnValue === undefined) {
      returnValue = replaceBlank
    }
    if (numeric) {
      returnValue = parseFloat(returnValue || 0)
    }
    if (formatter) {
      if (typeof formatter === 'string') {
        formatter = formatters[formatter]
      }
      returnValue = formatter(returnValue)
    }
    return returnValue
  }

  itemToLabel = params => {
    if (params.column.colDef.label) {
      return params.column.colDef.label
    } else if (params.data) {
      if (params.data.hasOwnProperty('g')) {
        return params.data.g(params.column.colDef.field)
      } else {
        return params.data[params.column.colDef.field]
      }
    } else {
      return ''
    }
  }

  resolveRender = (render, renderer) => {
    if (render) {
      return params => {
        // TODO: Verificar se serve para todos os casos
        if (params.node.rowPinned === 'bottom' && String(params.value).length === 0) {
          return <div>''</div>
        }
        return (
          <div style={rendererContainerStyle}>
            {render(
              // params.column.colDef.field
              //   ? params.data.g(params.column.colDef.field)
              //   : null,
              params.value,
              params.column.colDef.field,
              params.data
            )}
          </div>
        )
      }
    } else if (renderer) {
      return params => {
        if (params.node.rowPinned === 'bottom' && String(params.value).length === 0) {
          return ''
        }
        switch (renderer) {
          case 'boolean':
            return (
              <div style={rendererContainerStyle}>
                <BooleanRenderer {...params} />
              </div>
            )
          case 'image':
            return (
              <div style={rendererContainerStyle}>
                <ImageRenderer {...params} />
              </div>
            )
          default:
            return null
        }
      }
    }
  }

  getRowClass = params => {
    // if (params.node.rowIndex % 2 === 0) {
    if (params.node.rowPinned === 'bottom') {
      return this.props.classes.summary
    }
  }

  getColumns = columns => {
    return columns
      .filter(column => {
        const { visible = true } = column.props
        return visible
      })
      .map(column => {
        const { title, field, visible, formatter, numeric, render, children, renderer, replaceBlank, formula, format, ...props } = column.props
        return {
          headerName: title,
          field: field || '',
          tooltipField: field || '',
          children: children && this.getColumns(children),
          cellRendererFramework: this.resolveRender(render, renderer),
          valueGetter: this.resolveLabel(formatter, numeric, replaceBlank),
          ...props
        }
      })
  }

  autosizeColumnsIfNeeded = () => {
    let availableWidth = this.api['gridPanel'].getBodyClientRect().width
    let columns = this.api['gridPanel']['columnController'].getAllDisplayedColumns()
    let usedWidth = this.api['gridPanel']['columnController'].getWidthOfColsInList(columns)

    if (usedWidth < availableWidth) {
      this.api.sizeColumnsToFit()
    }
  }

  deepColumns = (children, prefix = '') =>
    children.reduce((ac, item) => {
      if (item.props.children) {
        return ac.concat(this.deepColumns(item.props.children, item.headerName))
      } else {
        item = Object.assign({}, item)
        item.headerName = prefix + ' ' + item.headerName
        return ac.concat([item])
      }
    }, [])

  resolveSummary = params => {
    if (this.props.clientSide) {
      let summary = new Model()
      const fields = this.deepColumns(this.props.children).concat(this.props.fieldsToSummary.map(props => ({ props })))
      fields.forEach(column => {
        const { field, numeric } = column.props
        if (numeric) {
          summary.set({ [field]: 0 })
        }
      })
      this.props.rows.forEach(row => {
        fields.forEach(column => {
          const { field, numeric } = column.props
          if (numeric) {
            summary.set({ [field]: summary.get(field) + row.g(field) + 0 })
          }
        })
      })
      fields.forEach(column => {
        const { field, first, average } = column.props
        if (average) {
          summary.set({ [field]: summary.get(field) / this.props.rows.length })
        }
        if (first) {
          summary.set({
            [field]: this.props.rows.length ? this.props.rows[0].g(field) : ''
          })
        }
      })
      // this.props.fieldsToSummary &&
      //   this.props.fieldsToSummary.forEach(field => summary.set({ [field]: 0 }))
      return [summary]
    }
  }

  onGridReady = params => {
    this.api = params.api
    this.columnApi = params.columnApi
    this.autosizeColumnsIfNeeded()
    // if (this.props.orderBy) {
    //   const splitedSort = this.props.orderBy ? this.props.orderBy.split(' ') : null
    //   if (splitedSort) {
    //     if (splitedSort.length > 1) {
    //       this.api.setSortModel([{ colId: splitedSort[0], sort: splitedSort[1] }])
    //     } else {
    //       this.api.setSortModel([{ colId: splitedSort[0] }])
    //     }
    //   }
    // }
    // this.api.updateRowData()
  }

  render() {
    const {
      classes,
      rows,
      titleBar,
      busy,
      children,
      controlBar,
      clientSide,
      statusRight,
      statusLeft,
      rowCount,
      title,
      busyCount,
      disablePaper,
      disableSummary,
      onSortChanged,
      minHeight = 'auto'
    } = this.props
    const { rowsPerPage, page } = this.state /* Fiz isso pra tirar os warnings... Espero não ferir ninguém */
    // const { order, orderBy, rowsPerPage, page } = this.state
    //const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage)

    const Container = disablePaper ? Div : Paper

    return (
      <Container className={classes.root} square style={{ minHeight: minHeight }}>
        <DataGridToolbar busy={busy} title={title} titleBar={titleBar} controlBar={controlBar} />
        <div
          className={cs(
            classes.tableWrapper,
            {
              [classes.tablePagination]: !clientSide
            },
            'ag-theme-material'
          )}
        >
          <AgGridReact
            // listening for events
            reactNext={true}
            onSortChanged={onSortChanged}
            onRowClicked={params => this.handleClick(params.data.id, params.data)}
            onGridReady={this.onGridReady}
            rowData={rows.toJS ? rows.toJS() : rows}
            pinnedBottomRowData={disableSummary ? null : this.resolveSummary()}
            rowSelection="multiple"
            enableRangeSelection
            columnDefs={this.getColumns(children)}
            localeText={agGridTranslation}
            getRowClass={this.getRowClass}
            defaultColDef={{
              filter: clientSide,
              sortable: true,
              resizable: true
            }}
            //pagination={!clientSide}
            // dateComponentFramework={DateComponent}
            // defaultColDef={{
            //     headerComponentFramework: SortableHeaderComponent,
            //     headerComponentParams: {
            //         menuIcon: 'fa-bars'
            //     }
            // }}
          />
        </div>
        {/*}
            <Table className={classes.table}>
              <DataGridHeader
                fixedColumn={fixedColumn}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={this.handleSelectAllClick}
                onRequestSort={this.handleRequestSort}
                rowCount={rowCount}
                columns={columns}
                checkbox={checkbox}
              />
            {rows.map(n => {
                return (
                  <TableRow
                    hover={true}
                    onClick={event => this.handleClick(event, n.id)}
                    role={checkbox && 'checkbox'}
                    tabIndex={-1}
                    key={n.id}
                  >
                    {columns.props.children.map((item, index) =>
                      React.cloneElement(item, {
                        key: index,
                        row: n,
                        fixed: index < fixedColumn
                      })
                    )}
                  </TableRow>
                )
              })}*/}
        {clientSide ? (
          <div className={cs(classes.wrap, classes.statusBar)}>
            <div className={classes.statusBarInner}>{statusLeft}</div>
            <div className={cs(classes.statusBarInner, classes.right)}>
              {statusRight}
              {`${rows.length} ${rows.length === 1 ? 'linha' : 'linhas'}`}
            </div>
          </div>
        ) : (
          <TablePagination
            classes={{ toolbar: classes.wrap }}
            component="div"
            count={rowCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
            labelRowsPerPage={AppStore.windowWidth > 360 ? 'Linhas por página' : null}
            labelDisplayedRows={({ from, to, count }) => {
              return (
                <div className={classes.paginationInfo}>
                  <span>{`${from}-${to} de`}</span>
                  <span className={classes.rowCount}>
                    {busyCount || (busy && rowCount === 0) ? <CircularProgress size={14} className={classes.progress} /> : count}
                  </span>
                </div>
              )
            }}
          />
        )}
      </Container>
    )
  }
}

const Div = ({ square, ...props }) => <div {...props} />
