import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ReactGA from 'react-ga';
import classNames from 'classnames';
import NumberFormat from 'react-number-format';
import {Helmet} from "react-helmet";

import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';

import ExpandMore from '@material-ui/icons/ExpandMore';
import DownIcon from '@material-ui/icons/KeyboardArrowDown';
import UpIcon from '@material-ui/icons/KeyboardArrowUp';

import pink from '@material-ui/core/colors/pink';
import green from '@material-ui/core/colors/green';

import Loading from '../shared/loading.js';
import KeyStats from '../markets/marketsKeyStats.js';

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
  expandIcon: {
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
  subheaderRight: {
    paddingRight: 32    
  },
  name: {
    paddingLeft: 20,
    width: '70%',
    fontSize: '1rem',
    fontWeight: 300,
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down('md')]: {
      width: '50%'
    }     
  },
  nameSubheading: {
    fontSize: '0.875rem',
    fontWeight: 300
  },
  price: {
    width: '40%',
    textAlign: 'right',
    fontSize: '1rem',
    fontWeight: 300,
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down('md')]: {    
      '&:last-child': {
        paddingRight: 60      
      }
    }
  },
  panelSummaryRoot: {
    [theme.breakpoints.down('md')]: {
      padding: 0
    }    
  },
  panelRoot: {
    boxShadow: 'none',
    '&:before': {
      opacity: 0      
    },
    [theme.breakpoints.down('md')]: {
      padding: 0
    }
  },
  panelContent: {
    alignItems: 'center'
  },
  expansionDetails: {
    [theme.breakpoints.down('md')]: {    
      padding: '8px 8px 8px'
    }
  },
  avatar: {
    margin: 10,
  },
  pinkAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: pink[500],
  },
  greenAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: green[500],
  },
  positiveChange: {
    color: green[500]
  },
  negativeChange: {
    color: pink[500]
  }  
});

function getFormattedName(name) {
  var index = name.indexOf('PR') > 0 ? name.indexOf('PR') : name.indexOf('TR');
  return index !== -1 ? name.substring(0, index).toProperCase() : name.toProperCase();
}

const DataTable = (classes, data, type) => {
  if (!data) {
    return <Loading />
  }

  return (
    <List className={classes.tickerList}
          subheader={<ListSubheader component="div" className={classes.subheaderText}>
                      <span className={classes.subheaderLeft}>Index</span>
                      <span className={classes.subheaderRight}>Last / Change</span>
                    </ListSubheader>
                    }>
      { data.map(function(obj, index) {
        var momentumIcon = obj.priceChange > 0 ? <UpIcon /> : <DownIcon />;
        var formattedPrice = <NumberFormat value={parseFloat(obj.price).toFixed(2)} displayType={'text'} thousandSeparator={true} className={obj.price} prefix={type === 'commodities' ? '$' : ''} />;
        var formattedChange = <span><NumberFormat value={parseFloat(obj.priceChange).toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={obj.priceChange > 0 ? "+" : ""} className={obj.priceChange > 0 ? classes.positiveChange : classes.negativeChange} />&nbsp;&nbsp;<NumberFormat value={parseFloat(obj.percentChange).toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={obj.percentChange > 0 ? "(+" : "("} suffix={"%)"} className={obj.priceChange > 0 ? classes.positiveChange : classes.negativeChange}  /></span>

        return(
        <ExpansionPanel key={index} classes={{root: classes.panelRoot}} >
          <ExpansionPanelSummary expandIcon={<ExpandMore />} classes={{root: classes.panelSummaryRoot, content: classes.panelContent}}>
            <Avatar className={obj.priceChange > 0 ? classes.greenAvatar : classes.pinkAvatar}>{momentumIcon}</Avatar>
            <Typography className={classes.name}><span>{getFormattedName(obj.name)}</span><span className={classes.nameSubheading}>{obj.region}</span></Typography>
            <Typography className={classes.price}>{formattedPrice}{formattedChange}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.expansionDetails} >
            <KeyStats quote={obj} type={type} />
        </ExpansionPanelDetails>
        </ExpansionPanel>
        )
      })
      }
    </List>
  );
}

class Markets extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      selectedType: 'americas'
    }

    this.fetchData = this.fetchData.bind(this);
    this.setCurrentData = this.setCurrentData.bind(this);
  }

  componentDidMount() {
    this.fetchData('americas');    
  }

  fetchData(type) {
    var self = this;

    this.props.getDoc('markets', 'indices')
    .then( obj => {
      self.setState({ data: obj, currentData: self.getCurrentData(type, obj), selectedType: type, timeStamp: this.getTimestamp(type, obj)});              
    })
    .catch(err => {
      self.setState({ 
        error: err,
        currentData: undefined,
        selectedType: undefined
      });
    });
  }

  setCurrentData(type) {
    this.setState({selectedType: type, currentData: this.getCurrentData(type), timestamp: this.getTimestamp(type)});
    ReactGA.event({
      category: 'Markets',
      action: 'Selected Index',
      label: type
    });
  }

  getTimestamp(type, _data) {
    var data = _data ? _data : this.state.data;

    switch (type) {
      case 'americas': return data.americas.timeStamp;
      case 'global': return data.global.timeStamp;
      case 'commodities': return "";
      default: return "";
    }    
  }

  getCurrentData(type, _data) {
    var data = _data ? _data : this.state.data;

    switch (type) {
      case 'americas': return data.americas.securityQuotes;
      case 'global': return data.global.securityQuotes;
      case 'commodities': return data.commodities;
      default: return "";
    }
  }

  render() {
    const { classes } = this.props;
    const { selectedType, data, currentData } = this.state;
    const orderOptions = [{name: 'americas', emoji: "🌎"}, {name: 'global', emoji: "🌏"}, {name: 'commodities', emoji: "🛢️"}];

    const orderChips = <Paper className={classes.chipPaper}>
                          {orderOptions.map(obj => {
                            return (
                            <Chip key={obj.name} 
                                  onClick={() => this.setCurrentData(obj.name)} 
                                  label={obj.name.toProperCase()}
                                  avatar={selectedType === obj.name ? <Avatar className={classes.chipAvatar}>{obj.emoji}</Avatar> : null}
                                  className={selectedType === obj.name ? classNames(classes.selectedChip, classes.chip) : classes.chip} />
                            );
                          })}
                        </Paper>;

    return (
      <div className={classes.root}>
        <Helmet>
          <title>Markets Summary</title>
          <meta name="description" content={"U.S. and Global Indexes and Commodities Prices"} />          
        </Helmet>      
        <Paper className={classes.header} >
          <Typography variant="display3" className={classes.titleText}>
            Markets
          </Typography>
          {orderChips}
        </Paper>
        <Paper className={classes.lists} >
          { (!selectedType || !data) && <Loading /> }
          { (selectedType && data) && DataTable(classes, currentData, selectedType) }
        </Paper>          
      </div>
    );
  }
}

Markets.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Markets);