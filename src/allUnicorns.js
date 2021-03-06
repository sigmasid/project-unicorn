import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom'

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Loading from './shared/loading.js';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

//const util = require('util'); //print an object

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 800,
    backgroundColor: theme.palette.background.paper,
    margin: '0 auto',
    marginTop: theme.spacing.unit * 3,
    [theme.breakpoints.down('md')]: {
      maxWidth: '100%',
      marginTop: 0
    }
  },
  header: {
    textAlign: 'left',
    padding: '20px 20px 0px 40px',
    boxShadow: 'none',
    [theme.breakpoints.down('md')]: {
      padding: '10px 10px 0px 20px'
    }
  },
  titleText: {
    fontWeight: 800,
    color: 'black',
    marginBottom: 10
  },
  tickerList: {
    paddingTop: 20
  },
  lists: {
    boxShadow: 'none',
    padding: 20
  },
  leaderboardCompany: {
    maxWidth: '100%'
  },
  searchBar: {
    width: '100%'
  },
  searchSuggestions: {
    margin: '0 20 20 20'
  }
});

const UnicornLeaderboard = (classes, unicorns) => {
  if (unicorns === undefined) {
    return <Loading />
  }

  return (
    <List className={classes.tickerList} >
      { Object.keys(unicorns).map(function(key) {
        var obj = unicorns[key];

        return(
        <ListItem button component={Link} to={'/startups/'+key} key={key} >
          <ListItemText className={classes.leaderboardCompany} primary={obj.name.toProperCase()} />
        </ListItem>
        )
      })
      }
    </List>
  );
}

class AllUnicorns extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      results: undefined
    };
    
    if (!props.startupIndex) {
      props.getStartupIndex();
    }
  }

  handleChange = prop => event => {
    var value = event.target.value;

    if (value === '') {
      this.handleClose();
    } else {
      this.setState({
        results: this.props.getSuggestions(value, true),
        searchText: value
      });      
    }
  }

  handleClose = () => {
    this.setState({
      results: undefined,
      searchText: ''
    });
  }

  render() {
    const { classes, startupIndex } = this.props;
    const { results, searchText } = this.state;

    return (
      <div className={classes.root}>
        <Paper className={classes.header} >
          <Typography variant="display3" className={classes.titleText}>
            Unicorns List
          </Typography>
        </Paper>
        <Paper className={classes.lists} >
          <div className={classes.searchSuggestions}>
            <Input
              id="searchText"
              placeholder='Search Unicorns'
              className={classes.searchBar}
              variant="text"
              value={searchText || ''}
              onChange={ this.handleChange('searchText') }
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Search Unicorns"
                    onClick={results && (() => this.handleClose())}
                  >
                    {results ? <CloseIcon /> : <SearchIcon /> }
                  </IconButton>
                </InputAdornment>
              }
            />
          </div>
          { UnicornLeaderboard(classes, results || startupIndex) }
        </Paper>          
      </div>
    );
  }
}

AllUnicorns.propTypes = {
  classes: PropTypes.object.isRequired,
  startupIndex: PropTypes.object.isRequired
};

export default withStyles(styles)(AllUnicorns);