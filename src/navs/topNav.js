import React from 'react';
import PropTypes from 'prop-types';
import * as firebase from "firebase";
import firestore from "firebase/firestore";
import classNames from 'classnames';

import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import SearchIcon from 'material-ui-icons/Search';
import CloseIcon from 'material-ui-icons/Close';
import ExploreIcon from 'material-ui-icons/Explore';

import SearchBar from 'material-ui-search-bar';
import Paper from 'material-ui/Paper';
import Grow from 'material-ui/transitions/Grow';
import Avatar from 'material-ui/Avatar';
import { Link } from 'react-router-dom';
import { MenuItem, MenuList} from 'material-ui/Menu';
import { findDOMNode } from 'react-dom';
import 'typeface-roboto';

//const util = require('util') //print an object

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
    marginRight: 50,
    marginLeft: 50,
    [theme.breakpoints.down('md')]: {
      width: '100%',
      marginRight: 0,
      marginLeft: 0
    },
  },
  mobileSearch: {
    display: 'none'
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

function getSuggestions(value, index) {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;
  
  return inputLength === 0
    ? []
    : index.filter(result => {
        const keep =
          count < 5 && result.label.toLowerCase().slice(0, inputLength) === inputValue;

        if (keep) {
          count += 1;
        }

        return keep;
      });
}

function RenderSuggestionsContainer(props) {
  const { results, anchorEl, handleClose, classes } = props;
  if (results === undefined || results.length === 0) {
    return null;
  }

  return (
    <Grow in={Boolean(anchorEl)} id="menu-list" style={{ transformOrigin: '0 0 0' }}>
    <Paper>
      <MenuList
        role="menu"
        className={classes.suggestionsList}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        { results !== undefined ? 
            results.map(function(result, index) {
              return <MenuItem component={Link} to={'/c/'+result.key} key={index} onClick={handleClose}>{result.label}</MenuItem>
            }) : null }
      </MenuList>
    </Paper>
    </Grow>
  );
}

class TopNav extends React.Component {
  state = {
    anchorEl: null,
    searchOpen: false
  };

  handleChange = (value) => {
    if (this.state.index === undefined) {
      var db = firebase.firestore();
      db.collection('indices').doc('private').get().then(doc => {
        let index = [];
        var tickers = doc.data().tickers;

        Object.keys(tickers).map(function(key) {
          var current = {};
          current.key = key;
          current.label = tickers[key];
          index.push(current);
          return null;
        });

        getSuggestions(value, index)
        this.setState({
          index: index,
          anchorEl: findDOMNode(!this.state.searchOpen ? this.button : this.mobileSearch),
          results: getSuggestions(value, index),
          searchText: value
        });
        return null;
      })
      .catch(err => {
        this.setState({ 
          unicornList: undefined
        });
      }); 
    } else {
      getSuggestions(value, this.state.index)
      this.setState({
        anchorEl: findDOMNode(this.button),
        results: getSuggestions(value, this.state.index),
        searchText: value
      });
      return null;
    }
  };

  handleClose = () => {
    this.setState({
      anchorEl: null,
      results: undefined,
      searchText: ''
    });
  }

  showSearch = () => {
    this.setState({
      searchOpen: !this.state.searchOpen 
    });
  }

  button = null;
  mobileSearch = null;

  render() {
    const { classes } = this.props;
    const { searchOpen } = this.state;

    return (
    <AppBar className={classNames(classes.appBar, this.props.open && classes.appBarShift)}>
      <Toolbar className={classes.toolbar}>
        <div className={classes.desktopMenu}>
          <IconButton onClick={this.props.handleDrawerOpen} color="inherit" aria-label="open drawer" >
            <Avatar alt="Project Unicorn" className={classNames(classes.avatar, classes.bigAvatar)}><span className={classes.emoji} role="img" aria-label="Company Logo">🦄</span></Avatar>
          </IconButton>
          <Button aria-label="leaderboard" component={Link} to={'/'}  className={classes.navButton} color="default" size="large">
            Leaderboard
          </Button>
          <Button aria-label="explore" component={Link} to={'/explore'} className={classes.navButton} color="default" size="large">
            Explore
          </Button>
          <div className={classes.searchSuggestions}>
            <SearchBar
              ref={node => { this.button = node;}}
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
            <RenderSuggestionsContainer results={this.state.results} anchorEl={this.state.anchorEl} handleClose={this.handleClose} classes={classes} />
          </div>           
        </div>
        <div className={classes.mobileMenu}>
          <IconButton color="inherit" aria-label="home" size="large" className={ classes.mobileButton } component={Link} to={'/'} >
            <Avatar alt="Project Unicorn" className={classNames(classes.avatar, classes.bigAvatar)}><span className={classes.emoji} role="img" aria-label="Company Logo">🦄</span></Avatar>
          </IconButton>        
          <IconButton color="inherit" aria-label="explore" size="large" className={classNames(classes.mobileButton )} component={Link} to={'/explore'} >
            <ExploreIcon />
          </IconButton>
          <IconButton color="inherit" aria-label="search" size="large" className={classNames(classes.mobileButton )} onClick={this.showSearch}>
            {searchOpen ? <CloseIcon /> : <SearchIcon />}
          </IconButton>
        </div>
      </Toolbar>
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
        <RenderSuggestionsContainer results={this.state.results} anchorEl={this.state.anchorEl} handleClose={this.handleClose} classes={classes} />
      </div>
    </AppBar>
    );
  }
}

TopNav.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TopNav);