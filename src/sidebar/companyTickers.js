import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import classNames from 'classnames';
import List from 'material-ui/List';
import Divider from 'material-ui/Divider';
import ChevronRightIcon from 'material-ui-icons/ChevronRight';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';

import FeaturedTiles from './featuredTiles.js';

const drawerWidth = 240;

const styles = theme => ({
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },
  hide: {
    display: 'none',
  },
  drawerPaper: {
    position: 'relative',
    height: '100%',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    },
  },
  drawerPaperClose: {
    width: 60,
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  drawerInner: {
    // Make the items inside not wrap when transitioning:
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  }
});

class SideBar extends React.Component {
  render() {
    const { classes, open, handleDrawerClose } = this.props;

    return (
    <Drawer
      type="permanent"
      classes={{ paper: classNames(classes.drawerPaper, !open && classes.drawerPaperClose)}}
      open={open}
    >
      <div className={classes.drawerInner}>
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronRightIcon />
          </IconButton>
        </div>
        <Divider />
        <List className={classes.list}>{ this.props.tickers !== undefined ? FeaturedTiles(this.props.tickers) : null }</List>
      </div>
    </Drawer>
    );
  }
}

SideBar.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(SideBar);