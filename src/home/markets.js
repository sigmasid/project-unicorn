import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import ReactGA from 'react-ga';
import * as firebase from "firebase";
import firestore from "firebase/firestore";

import List from 'material-ui/List';
import ListSubheader from 'material-ui/List/ListSubheader';
import ExpansionPanel, { ExpansionPanelDetails, ExpansionPanelSummary } from 'material-ui/ExpansionPanel';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import classNames from 'classnames';

import { Link } from 'react-router-dom'
import ExpandMore from 'material-ui-icons/ExpandMore';
import DownIcon from 'material-ui-icons/KeyboardArrowDown';
import UpIcon from 'material-ui-icons/KeyboardArrowUp';


import pink from 'material-ui/colors/pink';
import green from 'material-ui/colors/green';
import fetch from 'node-fetch';

import Loading from '../shared/loading.js';
import NumberFormat from 'react-number-format';
import KeyStats from '../markets/marketsKeyStats.js';

const util = require('util'); //print an object

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
    var url = 'https://us-central1-project-unicorn-24dcc.cloudfunctions.net/getMarketData';
    var self = this;
    
    //var json = {"commodities":[{"name":"Gold","price":1314.5,"priceChange":-0.2,"percentChange":-0.0152,"expirationDate":"2018-06-27","contractDate":"2018-06"},{"name":"Brent Crude","price":58.87,"priceChange":-16,"percentChange":-21.3704,"expirationDate":"2018-05-30","contractDate":"2018-07"},{"name":"Light Crude","price":69.59,"priceChange":-0.13,"percentChange":-0.1865,"expirationDate":"2018-05-22","contractDate":"2018-06"},{"name":"Natural Gas","price":2.74,"priceChange":0.029,"percentChange":1.0697,"expirationDate":"2018-05-29","contractDate":"2018-06"}],"americas":{"timeStamp":"05-07-2018","securityQuotes":[{"priceChange":"46.828","ticker":"@CCO","percentChange":"0.6495","querySecurityId":"0P00001G7B","openPrice":"7241.822","dayLow":"7235.76","activityTimeUTC":"2018-05-07T19:31:06Z","fiftyTwoWeekLow":"5996.8149","exchangeActivityTimeLabel":"05/07/2018 15:31 PM EDT","volume":"0","marketPhase":"Open","price":"7256.445","yesterdayPrice":"7209.617","name":"NASDAQ Composite PR USD","exchange":"XNAS","currency":"USD","region":"USA","fiftyTwoWeekHigh":"7637.269","dayHigh":"7291.738"},{"priceChange":"45.92","ticker":"!DJI","percentChange":"0.1893","querySecurityId":"0P00001FJG","openPrice":"24317.66","dayLow":"24263.42","activityTimeUTC":"2018-05-07T19:31:05Z","fiftyTwoWeekLow":"20553.45","exchangeActivityTimeLabel":"05/07/2018 15:31 PM EDT","volume":"231741441","marketPhase":"Open","price":"24308.43","yesterdayPrice":"24262.51","name":"DJ Industrial Average PR USD","exchange":"DJI","currency":"USD","region":"USA","fiftyTwoWeekHigh":"26616.71","dayHigh":"24479.45"},{"priceChange":"5.7","ticker":"SPX","percentChange":"0.2140","querySecurityId":"0P00001G7J","openPrice":"2669.36","dayLow":"2664.7","activityTimeUTC":"2018-05-07T19:31:06Z","fiftyTwoWeekLow":"2352.72","exchangeActivityTimeLabel":"05/07/2018 15:31 PM EDT","volume":"1391858302","marketPhase":"Open","price":"2669.12","yesterdayPrice":"2663.42","name":"S&P 500 PR","exchange":"SPI","currency":"USD","region":"USA","fiftyTwoWeekHigh":"2872.87","dayHigh":"2683.35"}]},"global":{"timeStamp":"05-07-2018","securityQuotes":[{"priceChange":"45.64","ticker":"000001","percentChange":"1.4765","querySecurityId":"0P00006NNM","openPrice":"3094.8989","dayLow":"3091.6579","activityTimeUTC":"2018-05-07T07:00:22Z","fiftyTwoWeekLow":"3016.5305","exchangeActivityTimeLabel":"05/07/2018 03:00 AM EDT","volume":"138948186","marketPhase":"Closed","price":"3136.6448","yesterdayPrice":"3091.0048","name":"SSE Composite PR CNY","exchange":"XSHG","currency":"RMB","region":"CHN","fiftyTwoWeekHigh":"3587.0323","dayHigh":"3136.8363"},{"priceChange":"64.45","ticker":"UKX","percentChange":"0.8590","querySecurityId":"0P00001IS1","openPrice":"7502.69","dayLow":"7502.69","activityTimeUTC":"2018-05-04T15:35:29Z","fiftyTwoWeekLow":"6866.95","exchangeActivityTimeLabel":"05/04/2018 11:35 AM EDT","volume":"0","marketPhase":"Closed","price":"7567.14","yesterdayPrice":"7502.69","name":"FTSE 100 PR GBP","exchange":"XLON","currency":"GBP","region":"GBR","fiftyTwoWeekHigh":"7792.56","dayHigh":"7570.22"},{"priceChange":"-5.62","ticker":"100000018","percentChange":"-0.0250","querySecurityId":"0P00006MR4","openPrice":"22513.22","dayLow":"22350.91","activityTimeUTC":"2018-05-07T06:00:01Z","fiftyTwoWeekLow":"19239.52","exchangeActivityTimeLabel":"05/07/2018 02:00 AM EDT","volume":"0","marketPhase":"Closed","price":"22467.16","yesterdayPrice":"22472.78","name":"Nikkei 225 Average PR JPY","exchange":"XOSE","currency":"JPY","region":"JPN","fiftyTwoWeekHigh":"24129.34","dayHigh":"22513.48"},{"priceChange":"128.54","ticker":"DAX","percentChange":"1.0027","querySecurityId":"0P00001FKV","openPrice":"12827.43","dayLow":"12813.55","activityTimeUTC":"2018-05-07T15:45:00Z","fiftyTwoWeekLow":"11726.62","exchangeActivityTimeLabel":"05/07/2018 11:45 AM EDT","volume":"0","marketPhase":"Closed","price":"12948.14","yesterdayPrice":"12819.6","name":"FSE DAX TR EUR","exchange":"XETR","currency":"XXP","region":"DEU","fiftyTwoWeekHigh":"13596.89","dayHigh":"12961.05"},{"priceChange":"67.76","ticker":"HSI","percentChange":"0.2264","querySecurityId":"0P00001FL8","openPrice":"30102.06","dayLow":"29791.87","activityTimeUTC":"2018-05-07T08:08:58Z","fiftyTwoWeekLow":"24476.2","exchangeActivityTimeLabel":"05/07/2018 04:08 AM EDT","volume":"0","marketPhase":"Closed","price":"29994.26","yesterdayPrice":"29926.5","name":"Hang Seng HSI PR HKD","exchange":"XHKG","currency":"HKD","region":"HKG","fiftyTwoWeekHigh":"33484.08","dayHigh":"30138.33"}]}};
    //this.setState({data: json, currentData: self.getCurrentData(type, json), selectedType: type, timeStamp: this.getTimestamp(type, json)});

    var db = firebase.firestore();
    var companyRef = db.collection('markets').doc('pricing').get()
    .then(doc => {
      if (doc.exists) {
        var json = doc.data();
        self.setState({data: json, currentData: self.getCurrentData(type, json), selectedType: type, timeStamp: this.getTimestamp(type, json)});        
      }
    })
    .catch(err => {
      self.setState({
        error: true
      })
    });
    /**
    fetch(url)
    .then(res => res.json())
    .then(json => {
      this.setState({data: json, currentData: self.getCurrentData(type, json), selectedType: type, timeStamp: this.getTimestamp(type, json)});
    })
    .catch(function(err) {
      this.setState({error: err});
    }); **/ 
  }

  setCurrentData(type) {
    this.setState({selectedType: type, currentData: this.getCurrentData(type), timestamp: this.getTimestamp(type)});
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