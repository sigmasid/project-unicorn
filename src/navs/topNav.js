import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';
import { findDOMNode } from 'react-dom';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import SearchIcon from 'material-ui-icons/Search';
import CloseIcon from 'material-ui-icons/Close';
import SearchBar from 'material-ui-search-bar';
import Avatar from 'material-ui/Avatar';

import MobileNav from './mobileNav.js';
import RenderSuggestionsContainer from '../shared/searchSuggestions.js';

const util = require('util') //print an object

const styles = theme => ({
  appBar: {
    position: 'absolute',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['left'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  },
  appBarShift: {
    left: 240,
    transition: theme.transitions.create(['left'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },
  toolbar: {
    [theme.breakpoints.up('md')]: {
      paddingLeft: 12
    }
  },
  desktopMenu: {
    display: 'flex',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },
  mobileMenu: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  },
  mobileButton: {
    width: 40,
    height: 40,
    color: 'white',
    fontSize: '2rem'
  },
  bigAvatar: {
    width: 50,
    height: 50,
    backgroundColor: 'white',
    [theme.breakpoints.down('md')]: {
      width: 40,
      height: 40,
    },
  },
  emoji: {
    fontSize: '2.25rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '2rem'
    },
  },
  navButton: {
    color: 'white',
    textTransform: 'none',
    fontSize: '1.15rem',
    fontWeight: 800,
    marginLeft: 20,
    marginRight: 20
  },
  searchSuggestions: {
    width: '50%',
    margin: '0 auto',
    [theme.breakpoints.down('md')]: {
      width: '100%',
      marginRight: 0,
      marginLeft: 0
    },
  },
  mobileSearch: {
    display: 'none'
  },
  menuItem: {
    height: 48
  },
  suggestionsList: {
    position: 'absolute',
    top: '10px',
    width: '100%',
    boxShadow: '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
    background: theme.palette.common.white,
    [theme.breakpoints.down('sm')]: {
      top: 0
    },
  }
});

class TopNav extends React.Component {
  state = {
    anchorEl: null,
    searchOpen: false,
    menuOpen: false
  };

  handleChange = (value) => {    
    this.setState({
      anchorEl: findDOMNode(this.button),
      results: this.props.getSuggestions(value),
      searchText: value
    });
    return null;
  };

  handleClose = () => {
    this.setState({
      anchorEl: null,
      results: undefined,
      searchText: ''
    });
  }

  toggleDrawer = () => {
    this.setState({
      menuOpen: !this.state.menuOpen
    });
  };

  showSearch = () => {
    this.setState({
      searchOpen: !this.state.searchOpen 
    });
  }

  button = null;
  mobileSearch = null;

  render() {
    const { classes  } = this.props;
    const { searchOpen, results, menuOpen } = this.state;

    return (
    <AppBar className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <div className={classes.desktopMenu}>
          <IconButton onClick={this.props.handleDrawerOpen} color="inherit" aria-label="open drawer" >
            <Avatar alt="Project Unicorn" className={classNames(classes.avatar, classes.bigAvatar)}><span className={classes.emoji} role="img" aria-label="Company Logo">🦄</span></Avatar>
          </IconButton>
          <div className={classes.searchSuggestions}>
            <SearchBar
              ref={node => { this.button = node;}}
              placeholder='Search Companies'
              onChange={ (value) => this.handleChange(value) }
              onRequestSearch={ this.handleChange.bind(null) }
              className={classes.searchBar}
              style={{
                margin: '0 auto',
                width: '100%'
              }}
              value={this.state.searchText}
            />
            <RenderSuggestionsContainer results={results} anchorEl={this.state.anchorEl} handleClose={this.handleClose} />
          </div>           
        </div>
        <div className={classes.mobileMenu}>
          <IconButton color="inherit" aria-label="home" size="large" className={ classes.mobileButton } onClick={() => this.toggleDrawer(true)} >
            <Avatar alt="Project Unicorn" className={classNames(classes.avatar, classes.bigAvatar)}><span className={classes.emoji} role="img" aria-label="Company Logo">🦄</span></Avatar>
          </IconButton>
          <IconButton color="inherit" aria-label="search" size="large" className={classNames(classes.mobileButton )} onClick={this.showSearch}>
            {searchOpen ? <CloseIcon /> : <SearchIcon />}
          </IconButton>
        </div>
      </Toolbar>
      <MobileNav menuOpen={menuOpen} toggleDrawer={() => this.toggleDrawer} />
      <div className={classNames(classes.searchSuggestions, !this.state.searchOpen && classes.mobileSearch)}>
        <SearchBar
          ref={node => { this.mobileSearch = node;}}
          placeholder='Search Unicorns'
          onChange={ (value) => this.handleChange(value) }
          onRequestSearch={ this.handleChange.bind(null) }
          className={classes.searchBar}
          style={{
            margin: '0 auto',
            width: '100%'
          }}
          value={this.state.searchText}
        />
        <RenderSuggestionsContainer results={this.state.results} anchorEl={this.state.anchorEl} handleClose={this.handleClose} />
      </div>
    </AppBar>
    );
  }
}

TopNav.propTypes = {
  classes: PropTypes.object.isRequired,
  getSuggestions: PropTypes.func.isRequired
};

export default withStyles(styles)(TopNav);