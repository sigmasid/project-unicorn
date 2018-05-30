import React from 'react';
import classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import CompanyIcon from '@material-ui/icons/Highlight';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import Collapse from '@material-ui/core/Collapse';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';

import { Link } from 'react-router-dom'

//const util = require('util'); //print an object

const styles = theme => ({
  masterList: {
    paddingBottom: 0,
    paddingTop: 16
  },
  childList: {
    paddingTop: 8
  },
  menuItem: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& $primary, & $icon': {
        color: theme.palette.common.white,
      },
    },
  },
  primary: {},
  icon: {},
});

class CompanyDetailMenu extends React.Component {
  state = { open: true };

  handleClick = () => {
    this.setState({ open: !this.state.open });
  };

  createPath = (match, path) => {
    var detailedPath = match.params.detail;

    if (detailedPath && path) {
      return `../${match.params.ticker}/${path}`
    } else if (path) {
      return `./${match.params.ticker}/${path}`
    } else if (detailedPath && !path) {
      return `../${match.params.ticker}`
    } else {
      return `./${match.params.ticker}`
    }
  }

  render() {
    const { classes, match } = this.props;
    var detailedPath = match.params.detail;

    return (
      <div className={classes.root}>
        <MenuList className={classes.masterList}>
          <MenuItem onClick={this.handleClick}>
            <ListItemIcon><CompanyIcon /></ListItemIcon>
            <ListItemText primary="Company" />
            {this.state.open ? <ExpandLess /> : <ExpandMore />}
          </MenuItem>
        </MenuList>
        <Collapse in={this.state.open} timeout="auto" unmountOnExit>
          <MenuList className={classes.childList}>
            <MenuItem className={classNames(classes.menuItem,classes.nested)} component={Link} to={this.createPath(match)} selected={!detailedPath} >
              <ListItemText inset primary="Summary" classes={{ primary: classes.primary }} />
            </MenuItem>
            <MenuItem className={classNames(classes.menuItem,classes.nested)} component={Link} to={this.createPath(match, 'charts')} selected={detailedPath === 'charts'} >
              <ListItemText inset primary="Charts" classes={{ primary: classes.primary }}/>
            </MenuItem>            
            <MenuItem className={classNames(classes.menuItem,classes.nested)} component={Link} to={this.createPath(match, 'news')} selected={detailedPath === 'news'} >
              <ListItemText inset primary="News" classes={{ primary: classes.primary }}/>
            </MenuItem>
            <MenuItem className={classNames(classes.menuItem,classes.nested)} component={Link} to={this.createPath(match, 'financials')} selected={detailedPath === 'financials'}>
              <ListItemText inset primary="Financials" classes={{ primary: classes.primary }} />
            </MenuItem>
            <MenuItem className={classNames(classes.menuItem,classes.nested)} component={Link} to={this.createPath(match, 'valuation')} selected={detailedPath === 'valuation'}>
              <ListItemText inset primary="Valuation" classes={{ primary: classes.primary }}/>
            </MenuItem>
          </MenuList>
        </Collapse>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(CompanyDetailMenu);