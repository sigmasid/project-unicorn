import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import ListItemText from '@material-ui/core/ListItemText';

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';

import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';

import classNames from 'classnames';
import Divider from '@material-ui/core/Divider';
import Loading from '../shared/loading.js';

import { Link } from 'react-router-dom'

//const util = require('util'); //print an object

const styles = theme => ({
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

class SectorMenu extends React.Component {
  state = {open: false, techOpen: false};

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!prevProps.sectors && this.props.sectors) {
      this.setState({fetching: undefined});
    }

    if (!prevProps.techSectors && this.props.techSectors) {
      this.setState({fetchingTech: undefined});
    }    
  }

  createPath = (match, _path) => {
    var path = _path && _path.replace(/ /g,'-');
    var detailedPath = match.params.detail;

    if (detailedPath && path) {
      return `../sectors/${path}`
    } else if (path) {
      return `./sectors/${path}`
    } else if (detailedPath && !path) {
      return `../${match.params.ticker}`
    } else {
      return `./${match.params.ticker}`
    }
  }

  handleExpandTech = (bool) => {
    if (bool && !this.props.techSectors) {
      this.props.getTechSectors();
      //fetch the sector list
      this.setState({techOpen: bool, fetchingTech: true })
    } else {
      this.setState({techOpen: bool })
    }
  }

  handleExpand = (bool) => {
    if (bool && !this.props.sectors) {
      this.props.getSectors();
      //fetch the sector list
      this.setState({open: bool, fetching: true })
    } else {
      this.setState({open: bool })
    }
  }

  render() {
    const { classes, match, sectors, techSectors } = this.props;
    const { open, techOpen, fetching, fetchingTech } = this.state;

    var detailedPath = match.params.detail;

    return (
      <div className={classes.root}>
          <MenuList className={classes.childList}>
            { detailedPath && 
              <MenuItem className={classNames(classes.menuItem,classes.nested)} key='selected' component={Link} to={this.createPath(match)} selected={detailedPath && true} >
                <ListItemText inset primary={detailedPath.replace(/-/g,' ').toProperCase()} classes={{ primary: classes.primary }} />
              </MenuItem> 
            }
            <MenuItem className={classNames(classes.menuItem,classes.nested)} key='technology' onClick={() => this.handleExpandTech(!this.state.techOpen)} >
              <ListItemText inset primary="Tech" classes={{ primary: classes.primary }} />
              {techOpen ? <ExpandLess /> : <ExpandMore />}
            </MenuItem>
            {fetchingTech && <Loading />}
            <Collapse in={techOpen} timeout="auto" unmountOnExit>            
              {techSectors && techSectors.map(sector => {
                if (sector === detailedPath) { return null }; //dont repeat the one that's already select in explore list
                return(
                <MenuItem className={classNames(classes.menuItem,classes.nested)} onClick={() => this.handleExpandTech(false)} key={sector} component={Link} to={this.createPath(match, sector.toLowerCase())} selected={detailedPath === sector.toLowerCase()}>
                  <ListItemText inset primary={sector.toProperCase()} classes={{ primary: classes.primary }} />
                </MenuItem>)
              })}
              <Divider />
            </Collapse>            
            <MenuItem className={classNames(classes.menuItem,classes.nested)} key='explore' onClick={() => this.handleExpand(!open)} >
              <ListItemText inset primary="Non Tech" classes={{ primary: classes.primary }} />
              {open ? <ExpandLess /> : <ExpandMore />}
            </MenuItem>
            {fetching && <Loading />}
            <Collapse in={open} timeout="auto" unmountOnExit>            
              {sectors && sectors.map(sector => {
                if (sector === detailedPath || sector === 'technology') { return null }; //dont repeat the one that's already select in explore list
                
                return(
                <MenuItem className={classNames(classes.menuItem,classes.nested)} onClick={() => this.handleExpand(false)} key={sector} component={Link} to={this.createPath(match, sector.toLowerCase())} selected={detailedPath === sector.toLowerCase()}>
                  <ListItemText inset primary={sector.toProperCase()} classes={{ primary: classes.primary }} />
                </MenuItem>)
              })}
              <Divider />
            </Collapse>
          </MenuList>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(SectorMenu);