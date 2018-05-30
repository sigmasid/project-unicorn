import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';

import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';

import ContactIcon from '@material-ui/icons/Send';
import TermsIcon from '@material-ui/icons/Help';

import SectorsIcon from '@material-ui/icons/Dashboard';
import MarketsIcon from '@material-ui/icons/Equalizer';
import TrendingIcon from '@material-ui/icons/Whatshot';
import StartupsIcon from '@material-ui/icons/ChildCare';
import NewsIcon from '@material-ui/icons/Comment';
import ReceiptIcon from '@material-ui/icons/Receipt';

import SignupIcon from '@material-ui/icons/Bookmark';
import CompanyDetailMenu from './companyMenu.js';
import SectorMenu from './sectorMenu.js';
import Hidden from '@material-ui/core/Hidden';

import { Route, Link } from 'react-router-dom'

//const util = require('util'); //print an object

const styles = theme => ({
  root: {
    marginTop: 56,  
    width: 240,
    [theme.breakpoints.up('md')]: {
      position: 'relative',
    },    
  },
  mainMenu: {
    marginTop: 16
  },
  menuItem: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& $primary, & $icon': {
        color: theme.palette.common.white,
      },
    },
    '&:active': {
      backgroundColor: theme.palette.primary.main      
    }
  },
  selectedMenuItem: {
    backgroundColor: theme.palette.primary.main,
  },
  primary: {},
  icon: {}
});

const BottomMenu = (props) => {
  var {classes, active} = props;

  return(
  <MenuList className={classes.bottomMenu}>
    <MenuItem button component={Link} to={'/methodology'} key={'methodology'} className={classes.menuItem} selected={active === 'methodology'}>
      <ListItemIcon className={classes.icon}>
        <TermsIcon />
      </ListItemIcon>      
      <ListItemText primary="Methodology" classes={{ primary: classes.primary }}  />
    </MenuItem>  
    <MenuItem button component={Link} to={'/terms'} key={'terms'} className={classes.menuItem} selected={active === 'terms'}>
      <ListItemIcon className={classes.icon}>
        <ReceiptIcon />
      </ListItemIcon>      
      <ListItemText primary="Terms" classes={{ primary: classes.primary }}  />
    </MenuItem>
    <MenuItem button component={Link} to={'/contact'} key={'contact'} className={classes.menuItem} selected={active === 'contact'}>
      <ListItemIcon className={classes.icon}>
        <ContactIcon />
      </ListItemIcon>
      <ListItemText primary="Contact" classes={{ primary: classes.primary }}  />
    </MenuItem>    
    <MenuItem button key={'signup'} className={classes.menuItem} onClick={props.showEmailCapture} >
      <ListItemIcon className={classes.icon}>
        <SignupIcon />
      </ListItemIcon>
      <ListItemText primary="Signup" classes={{ primary: classes.primary }} />
    </MenuItem>     
  </MenuList>
  );
}

class SideBar extends React.Component {
  render() {
    const {classes, match, sectors, getSectors, techSectors, getTechSectors, showEmailCapture} = this.props;
    var active = match.params.active;

    return(
      <Hidden mdDown implementation="css">
        <Drawer variant="permanent" open classes={{ paper: classes.root }}>
          <MenuList className={classes.mainMenu} >
            <Route path="/stocks/:ticker/:detail?" component={CompanyDetailMenu} exact={false} />
            <MenuItem button component={Link} to={'/trending'} key={'stocks'} classes={{root: classes.menuItem, selected: classes.selectedMenuItem}} selected={active === 'trending'}>
              <ListItemIcon className={classes.icon}>
                <TrendingIcon />
              </ListItemIcon>
              <ListItemText primary="Trending" classes={{ primary: classes.primary }} />
            </MenuItem>
            <MenuItem button component={Link} to={'/markets'} key={'markets'} classes={{root: classes.menuItem, selected: classes.selectedMenuItem}} selected={active === 'markets'}>
              <ListItemIcon className={classes.icon}>
                <MarketsIcon />
              </ListItemIcon>
              <ListItemText primary="Markets" classes={{ primary: classes.primary }} />
            </MenuItem>
            <MenuItem button component={Link} to={'/sectors'} key={'sectors'} classes={{root: classes.menuItem, selected: classes.selectedMenuItem}} selected={active === 'sectors' && match.isExact === true} >
              <ListItemIcon className={classes.icon}>
                <SectorsIcon />
              </ListItemIcon>      
              <ListItemText primary="Sectors" classes={{ primary: classes.primary }}  />
            </MenuItem>
            <Route path="/sectors/:detail" render={(props) => (<SectorMenu {...props}  open={active === 'sectors'} sectors={sectors} getSectors={getSectors} techSectors={techSectors} getTechSectors={getTechSectors}/>)} />
            <MenuItem button component={Link} to={'/startups'} key={'startups'} classes={{root: classes.menuItem, selected: classes.selectedMenuItem}} selected={active === 'startups'}>
              <ListItemIcon className={classes.icon}>
                <StartupsIcon />
              </ListItemIcon>      
              <ListItemText primary="Startups" classes={{ primary: classes.primary }}  />
            </MenuItem>
            <MenuItem button component={Link} to={'/news'} key={'news'} classes={{root: classes.menuItem, selected: classes.selectedMenuItem}} selected={active === 'news'}>
              <ListItemIcon className={classes.icon}>
                <NewsIcon />
              </ListItemIcon>      
              <ListItemText primary="News" classes={{ primary: classes.primary }}  />
            </MenuItem>   
          </MenuList>
          <Divider />
          <BottomMenu classes={classes} active={active} showEmailCapture={showEmailCapture} />
        </Drawer>
      </Hidden>
    );
  }
};

SideBar.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(SideBar);