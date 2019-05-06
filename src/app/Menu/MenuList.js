import React from 'react'
import { observer } from './../../api'
import Page from './../../app/Page'
import { List, withStyles } from '@material-ui/core'
import Item from './Item'
import cs from 'classnames'

const styles = theme => ({
  root: {
    backgroundColor: 'transparent',
    overflow: 'auto'
  },
  // padding: {
  //   paddingTop: 0,
  //   paddingBottom: 0
  // },
  marginRoot: {
    marginBottom: 160
  }
})

export default
@withStyles(styles)
@observer
class MenuList extends Page {
  render() {
    const { onItemClick, items, path, parent, level, root, classes } = this.props

    return (
      <List
        classes={{
          root: cs(classes.root, root && classes.marginRoot)
        }}
      >
        {items.map(accessRoute => (
          <Item
            key={accessRoute.id}
            accessRoute={accessRoute.toJS ? accessRoute.toJS() : accessRoute}
            onItemClick={onItemClick}
            path={path}
            level={level}
            parent={parent}
          />
        ))}
      </List>
    )
  }
}
