import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import classNames from 'classnames';
import List from 'material-ui/List';
import { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import ChevronIcon from 'material-ui-icons/ChevronLeft';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import { Link } from 'react-router-dom';

import TrendingIcon from 'material-ui-icons/Whatshot';
import MethodologyIcon from 'material-ui-icons/Info';
import ContactIcon from 'material-ui-icons/Send';
import TermsIcon from 'material-ui-icons/Description';
import SignupIcon from 'material-ui-icons/Bookmark';

import FeaturedTiles from './featuredTiles.js';
import Tooltip from 'material-ui/Tooltip';

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

const bottomMenu = (classes, handleEmailToggle, showWhatsHot, loadTrending) => {
  return (
    <List className={classes.list}>
      { showWhatsHot && whatsHot(classes, loadTrending)}
      <ListItem button component={Link} to={'/methodology'} key={'methodology'}>
      <Tooltip id="tooltip-top" title="FAQs" placement="bottom">
        <ListItemIcon><MethodologyIcon /></ListItemIcon>
      </Tooltip>
        <ListItemText primary="Methodology" />
      </ListItem> 
      <ListItem button component={Link} to={'/terms'} key={'terms'}>
        <Tooltip id="tooltip-top" title="Terms" placement="bottom">
          <ListItemIcon><TermsIcon /></ListItemIcon>
        </Tooltip>
        <ListItemText primary="Terms" />
      </ListItem>
        <ListItem button component={Link} to={'/contact'} key={'contact'}>
        <Tooltip id="tooltip-top" title="Contact" placement="bottom">
          <ListItemIcon><ContactIcon /></ListItemIcon>
        </Tooltip>
        <ListItemText primary="Contact" />
      </ListItem>      
      <ListItem button onClick={handleEmailToggle} key={'signup'}>
        <Tooltip id="tooltip-top" title="Signup" placement="bottom">
          <ListItemIcon><SignupIcon /></ListItemIcon>
        </Tooltip>
        <ListItemText primary="Signup" />
      </ListItem>     
    </List>
  );
}

const whatsHot = (classes, loadTrending) => {
  return (
  <ListItem button onClick={loadTrending} key={'whatshot'}>
    <Tooltip id="tooltip-top" title="Trending" placement="bottom">
      <ListItemIcon><TrendingIcon /></ListItemIcon>
      </Tooltip>
      <ListItemText primary="Trending" />
  </ListItem> 
  );
}

class SideBar extends React.Component {
  render() {
    const { classes, open, handleDrawerClose, tickers, loadTrending } = this.props;
    return (
    <Drawer
      type="permanent"
      classes={{ paper: classNames(classes.drawerPaper, !open && classes.drawerPaperClose)}}
      open={open}
    >
      <div className={classes.drawerInner}>
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronIcon />
          </IconButton>
        </div>
        <Divider />
          {tickers ? <List className={classes.list}>{ FeaturedTiles(tickers) }</List> : null }
          {tickers && <Divider /> }
          {bottomMenu(classes, this.props.handleEmailToggle, tickers ? false : true, loadTrending)}
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