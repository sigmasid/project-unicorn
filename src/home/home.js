import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemText, ListItemSecondaryAction } from 'material-ui/List';
import Typography from 'material-ui/Typography';
import ImageAvatars from '../sidebar/companyIcon.js';
import Paper from 'material-ui/Paper';
import Tabs, { Tab } from 'material-ui/Tabs';
import Button from 'material-ui/Button';
import Avatar from 'material-ui/Avatar';

import { Link } from 'react-router-dom'
import NumberFormat from 'react-number-format';
import NavigateNext from 'material-ui-icons/NavigateNext';
import Loading from '../shared/loading.js';

import * as firebase from "firebase";
import firestore from "firebase/firestore";
//const util = require('util'); //print an object

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: theme.palette.background.paper,
    margin: '0 auto',
    marginTop: theme.spacing.unit * 3,
  },
  emoji: {
    fontSize: '1.5rem'
  },
  headerText: {
    textAlign: 'center',
    paddingTop: 20,
    boxShadow: 'none'    
  },
  lists: {
    boxShadow: 'none'
  },
  tabTitle: {
    textTransform: 'none'
  },
  navigateNext: {
    color: theme.palette.primary
  }
});

const Categories = (classes, categories) => {
  if (categories === undefined) {
    return <Loading />
  }

  return (
    <List className={classes.tickerList} >
      { Object.keys(categories).map(function(key) {
        var category = categories[key];

        return(
        <ListItem button component={Link} to={'/s/'+key} key={key} >
          <Avatar className={classes.avatar}>{key.charAt(0).toUpperCase()}</Avatar>
          <ListItemText primary={category.toProperCase()} />
          <ListItemSecondaryAction>           
            <Button mini aria-label="expand" component={Link} to={'/s/'+key} className={classes.button} color="primary">
              <NavigateNext color={'secondary'} />
            </Button>
          </ListItemSecondaryAction>
        </ListItem>
        )
      })
      }
    </List>
  );
}

const UnicornLeaderboard = (classes, unicorns) => {
  if (unicorns === undefined) {
    return <Loading />
  }

  return (
    <List className={classes.tickerList} >
      { Object.keys(unicorns).map(function(key) {
        var company = unicorns[key];
        var lastValuation = company.lastValuation !== undefined ? (company.lastValuation > 1000 ? company.lastValuation / 1000 : company.lastValuation) : undefined;
        var hq = (company.city !== undefined ? company.city.toProperCase() : '') + (company.state !== undefined ? ', ' + company.state.toUpperCase() : '');
        return(
        <ListItem button component={Link} to={'/c/'+company.ticker} key={key} >
          <ImageAvatars src={company.logo} />
          <ListItemText primary={company.name.toProperCase()} secondary={hq} />
          <ListItemSecondaryAction>            
            <Button mini aria-label="whats-hot" component={Link} to={'/c/'+company.ticker} className={classes.button} color="primary">
              <NumberFormat value={lastValuation.toFixed(1) || 0 } displayType={'text'} thousandSeparator={true} prefix={'$'} suffix={company.lastValuation > 1000 ? 'B' : 'M'} />
              &nbsp;&nbsp;
              <NavigateNext className={classes.navigateNext} />
            </Button>
          </ListItemSecondaryAction>
        </ListItem>
        )
      })
      }
    </List>
  );
}

class Home extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      value: 0,
      unicornList: this.props.featuredTickers || undefined
    }

    this.handleChange = this.handleChange.bind(this);
    this.getUnicorns = this.getUnicorns.bind(this);
    this.getCategories = this.getCategories.bind(this);

    //this.getUnicorns();
    //this.getCategories();
  }

  handleChange = (event, value) => {
    if (value === 1 && this.state.techCategories === undefined) {
      //get the tech categories
      this.getCategories('techCategories');
    } else if (value === 2 && this.state.newCategories === undefined) {
      //get the rest categories
      this.getCategories('newCategories');
    }
    this.setState({ value });
  };

  getUnicorns = () => {
    var db = firebase.firestore();
    var unicornsRef = db.collection('private').orderBy('lastValuation', 'desc').limit(10);

    unicornsRef.get()
    .then(snapshot => {
        var unicorns = [];
        snapshot.forEach(doc => {
          unicorns.push(doc.data());
        });
        this.setState({ 
          unicornList: unicorns
        });
        this.props.setFeatured(unicorns);
    })
    .catch(err => {
      this.setState({ 
        unicornList: undefined
      });
    });
  }

  getCategories = (type, value) => {
    var db = firebase.firestore();
    var unicornsRef = db.collection('indices').doc(type);

    unicornsRef.get()
    .then(doc => {
        var catObj = doc.data();
        type === 'techCategories' ? this.setState({ techCategories: catObj }) : this.setState({ newCategories: catObj });
    })
    .catch(err => {
      this.setState({ 
        categories: undefined
      });
    });
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Paper className={classes.headerText} >
          <Typography type="title" gutterBottom>
            Project Unicorn
          </Typography>
          <Typography type="caption" color={'textSecondary'} gutterBottom>
            (unicorns as observed out in the public)
          </Typography>
        </Paper>
        <Paper className={classes.lists} >
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label={<span><span className={classes.emoji} role="img" aria-label="Unicorn Leaderboard">🦄</span> Leaderboard</span>} className={classes.tabTitle} />
            <Tab label={<span><span className={classes.emoji} role="img" aria-label="Current Sectors">💰</span> Current</span>} className={classes.tabTitle}  />
            <Tab label={<span><span className={classes.emoji} role="img" aria-label="Future Sectors">💸</span> Future</span>} className={classes.tabTitle}  />
          </Tabs>
        </Paper>
        {this.state.value === 0 && UnicornLeaderboard(classes, this.state.unicornList)}
        {this.state.value === 1 && Categories(classes, this.state.techCategories)}
        {this.state.value === 2 && Categories(classes, this.state.newCategories)}              
      </div>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);