import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';

import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';

import SectorsIcon from '@material-ui/icons/Dashboard';
import MarketsIcon from '@material-ui/icons/Equalizer';
import TrendingIcon from '@material-ui/icons/Whatshot';
import StartupsIcon from '@material-ui/icons/ChildCare';
import NewsIcon from '@material-ui/icons/Comment';

import { Link } from 'react-router-dom'

//const util = require('util'); //print an object

const styles = theme => ({
  mainMenu: {
    width: 'auto'
  },
  menuItem: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& $primary, & $icon': {
        color: theme.palette.common.white,
      },
    }
  },
  selectedMenuItem: {
    backgroundColor: theme.palette.primary.main,
  },
  primary: {},
  icon: {}
});

class MobileBar extends React.Component {
  render() {
    const {classes, menuOpen, toggleDrawer} = this.props;
    
    return(
      <Drawer anchor="top" open={menuOpen} onClose={toggleDrawer(false)} classes={{ paper: classes.root }}>
        <MenuList className={classes.mainMenu} >
          <MenuItem button component={Link} to={'/trending'} key={'stocks'} classes={{root: classes.menuItem, selected: classes.selectedMenuItem}} >
            <ListItemIcon className={classes.icon}>
              <TrendingIcon />
            </ListItemIcon>
            <ListItemText primary="Trending" classes={{ primary: classes.primary }} />
          </MenuItem>
          <MenuItem button component={Link} to={'/markets'} key={'markets'} classes={{root: classes.menuItem, selected: classes.selectedMenuItem}} >
            <ListItemIcon className={classes.icon}>
              <MarketsIcon />
            </ListItemIcon>
            <ListItemText primary="Markets" classes={{ primary: classes.primary }} />
          </MenuItem>
          <MenuItem button component={Link} to={'/sectors'} key={'sectors'} classes={{root: classes.menuItem, selected: classes.selectedMenuItem}} >
            <ListItemIcon className={classes.icon}>
              <SectorsIcon />
            </ListItemIcon>      
            <ListItemText primary="Sectors" classes={{ primary: classes.primary }}  />
          </MenuItem>
          <MenuItem button component={Link} to={'/startups'} key={'startups'} classes={{root: classes.menuItem, selected: classes.selectedMenuItem}} >
            <ListItemIcon className={classes.icon}>
              <StartupsIcon />
            </ListItemIcon>      
            <ListItemText primary="Startups" classes={{ primary: classes.primary }}  />
          </MenuItem>
          <MenuItem button component={Link} to={'/news'} key={'news'} classes={{root: classes.menuItem, selected: classes.selectedMenuItem}} >
            <ListItemIcon className={classes.icon}>
              <NewsIcon />
            </ListItemIcon>      
            <ListItemText primary="News" classes={{ primary: classes.primary }}  />
          </MenuItem>   
        </MenuList>
        <Divider />
      </Drawer>
    );
  }
};

MobileBar.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(MobileBar);