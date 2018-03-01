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
import WhatsHotIcon from 'material-ui-icons/Whatshot';
import SearchBar from 'material-ui-search-bar';
import Paper from 'material-ui/Paper';
import Grow from 'material-ui/transitions/Grow';
import Avatar from 'material-ui/Avatar';
import { Link } from 'react-router-dom';
import { MenuItem, MenuList} from 'material-ui/Menu';
import { findDOMNode } from 'react-dom';
import 'typeface-roboto';


//const util = require('util') //print an object
const drawerWidth = 240;

const styles = theme => ({
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0
    },
  },
  bigAvatar: {
    width: 60,
    height: 60,
    backgroundColor: 'white',
    [theme.breakpoints.down('sm')]: {
      width: 40,
      height: 40,
    },
  },
  emoji: {
    fontSize: '3rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '2rem'
    },
  },
  button: {
    marginRight: -10,
    marginLeft: 'auto',
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },
  hide: {
    display: 'none',
  },
  appBar: {
    position: 'absolute',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'

  },
  appBarShift: {
    marginRight: drawerWidth,
    width: `calc(100% - 240px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },
  searchSuggestions: {
    width: '60%',
    margin: '0 auto',
    [theme.breakpoints.down('sm')]: {
      width: '80%'
    },
  },
  suggestionsList: {
    position: 'absolute',
    top: '10px',
    width: '100%',
    boxShadow: '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
    background: theme.palette.common.white
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
          anchorEl: findDOMNode(this.button),
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

  button = null;

  render() {
    const { classes } = this.props;
    return (
    <AppBar className={classNames(classes.appBar, this.props.open && classes.appBarShift)}>
      <Toolbar >
        <IconButton component={Link} to={'/'} color="inherit" aria-label="open drawer" className={classNames(classes.menuButton, this.props.open )} >
          <Avatar alt="Project Unicorn" className={classNames(classes.avatar, classes.bigAvatar)}><span className={classes.emoji} role="img" aria-label="Company Logo">🦄</span></Avatar>
        </IconButton>
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
        <Button fab mini aria-label="whats-hot" onClick={this.props.handleDrawerOpen}  className={classes.button} color="secondary">
          <WhatsHotIcon />
        </Button>
      </Toolbar>
    </AppBar>
    );
  }
}

TopNav.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TopNav);