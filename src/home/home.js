import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemText, ListItemSecondaryAction } from 'material-ui/List';
import ListSubheader from 'material-ui/List/ListSubheader';
import Typography from 'material-ui/Typography';
import ImageAvatars from '../sidebar/companyIcon.js';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import classNames from 'classnames';

import { Link } from 'react-router-dom'
import NumberFormat from 'react-number-format';
import NavigateNext from 'material-ui-icons/NavigateNext';
import Loading from '../shared/loading.js';
import { formatMetric, formatSuffix } from '../shared/sharedFunctions.js';
import Moment from 'react-moment';

import * as firebase from "firebase";
import firestore from "firebase/firestore";
import ReactGA from 'react-ga';

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
  emoji: {
    fontSize: '1.5rem'
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
  subheaderText: {
    fontSize: '1rem',
    display: 'flex',
    justifyContent: 'space-between'
  },
  lists: {
    boxShadow: 'none',
    padding: 20
  },
  navigateNext: {
    color: theme.palette.primary
  },
  chipPaper: {
    display: 'flex',
    justifyContent: 'end',
    flexWrap: 'wrap',
    padding: theme.spacing.unit / 2,
    boxShadow: 'none',
    marginBottom: 10
  },
  selectedChip: {
    background: theme.palette.gradient,
    color: 'white',
    '&:hover, &:active, &:focus': {
      background: theme.palette.gradient,
      color: 'white',
      // Reset on mouse devices
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      }
    }
  },
  chip: {
    margin: theme.spacing.unit,
    fontSize: '1.0rem',
    borderRadius: 32,
    padding: theme.spacing.unit,
    backgroundColor: theme.palette.background.default,
    '&:hover, &:active, &:focus': {
      background: theme.palette.gradient,
      color: 'white',
      // Reset on mouse devices
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      }
    }
  },
  chipAvatar: {
    background: 'none',
    fontSize: '2rem'
  },
  leaderboardCompany: {
    maxWidth: '40%'
  },
  leaderboardValuation: {
    maxWidth: '30%',
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  subheaderDate: {
    marginLeft: 100,
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }    
  }
});

const UnicornLeaderboard = (classes, unicorns) => {
  if (unicorns === undefined) {
    return <Loading />
  }

  return (
    <List className={classes.tickerList} 
          subheader={<ListSubheader component="div" className={classes.subheaderText}>
                      <span className={classes.subheaderLeft}>Unicorn</span>
                      <span className={classes.subheaderDate}>Last Raise</span>
                      <span className={classes.subheaderRight}>Last Valuation</span>
                    </ListSubheader>
                    }>
      { Object.keys(unicorns).map(function(key) {
        var company = unicorns[key];
        var hq = (company.city ? company.city.toProperCase() : '') + (company.state ? ', ' + company.state.toUpperCase() : '');
        const lastValuationDate = company.lastValuationDate ? <Moment date={new Date(company.lastValuationDate - (25567 + 1))*86400*1000} format="MMM YYYY" /> : null;

        return(
        <ListItem button component={Link} to={'/c/'+company.ticker} key={key} >
          <ImageAvatars src={company.logo} />
          <ListItemText className={classes.leaderboardCompany} primary={company.name.toProperCase()} secondary={hq} />
          <ListItemText className={classes.leaderboardValuation} secondary={lastValuationDate} />
          <ListItemSecondaryAction>            
            <Button mini aria-label="lastValuation" component={Link} to={'/c/'+company.ticker} className={classes.button} color="primary">
              <NumberFormat value={formatMetric(company.lastValuation)} displayType={'text'} thousandSeparator={true} prefix={'$'} suffix={formatSuffix(company.lastValuation)} />
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
      selectedOrder: 'biggest',
    }

    this.getUnicorns = this.getUnicorns.bind(this);
    this.getUnicorns('biggest');
  }

  getUnicorns = (order) => {
    var db = firebase.firestore();
    var unicornsRef = db.collection('private').orderBy(this.getSortOrder(order), 'desc').limit(10);

    unicornsRef.get()
    .then(snapshot => {
        var unicorns = [];
        snapshot.forEach(doc => {
          unicorns.push(doc.data());
        });
        this.setState({
          selectedOrder: order,
          unicornList: unicorns
        });

        ReactGA.event({
          category: 'Leaderboard',
          action: 'Update Sort',
          label: order
        });
        
        if (order === 'biggest') {
          this.props.setFeatured(unicorns);
        }
    })
    .catch(err => {
      this.setState({ 
        unicornList: undefined
      });
    });
  }

  getSortOrder = (order) => {
    switch(order) {
    case 'biggest':
      return 'lastValuation';
    case 'latest':
      return 'lastValuationDate'
    default:
      return 'lastValuation';
    }
  }

  render() {
    const { classes, } = this.props;
    const { selectedOrder } = this.state;
    const orderOptions = [{name: 'biggest', emoji: "💪"}, {name: 'latest', emoji: "👶"}];

    const orderChips = <Paper className={classes.chipPaper}>
                          {orderOptions.map(obj => {
                            return (
                            <Chip key={obj.name} 
                                  onClick={() => this.getUnicorns(obj.name)} 
                                  label={obj.name.toProperCase()} 
                                  avatar={selectedOrder === obj.name ? <Avatar className={classes.chipAvatar}>{obj.emoji}</Avatar> : null}
                                  className={selectedOrder === obj.name ? classNames(classes.selectedChip, classes.chip) : classes.chip} />
                            );
                          })}
                        </Paper>
                      
    return (
      <div className={classes.root}>
        <Paper className={classes.header} >
          <Typography type="display3" className={classes.titleText}>
            Leaderboard
          </Typography>
          {orderChips}
        </Paper>
        <Paper className={classes.lists} >
          {UnicornLeaderboard(classes, this.state.unicornList)}
        </Paper>          
      </div>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);