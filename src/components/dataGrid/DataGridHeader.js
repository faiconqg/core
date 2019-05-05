import React from 'react'
import { TableCell, TableHead, TableRow, TableSortLabel, Checkbox } from '@material-ui/core'

export default class DataGridHeader extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property)
  }

  render() {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, columns, fixedColumn, checkbox } = this.props

    return (
      <TableHead>
        <TableRow>
          {checkbox && (
            <TableCell padding="checkbox">
              <Checkbox indeterminate={numSelected > 0 && numSelected < rowCount} checked={numSelected === rowCount} onChange={onSelectAllClick} />
            </TableCell>
          )}
          {React.Children.map(
            columns.props.children,
            (column, index) => {
              column = column.props
              let style = {
                minWidth: column.width
              }
              if (index < fixedColumn) {
                style.position = 'absolute'
                style.left = index * 200
              }
              return (
                <TableCell key={index} align={column.numeric ? 'right' : null} style={style} sortDirection={orderBy === column.field ? order : false}>
                  <TableSortLabel
                    active={orderBy === column.field}
                    direction={order}
                    style={{ fontSize: 15, fontWeight: 400 }}
                    onClick={this.createSortHandler(column.field)}
                  >
                    {column.title}
                  </TableSortLabel>
                </TableCell>
              )
            },
            this
          )}
        </TableRow>
      </TableHead>
    )
  }
}
