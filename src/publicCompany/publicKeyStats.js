import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import Divider from '@material-ui/core/Divider';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ExpandLess from '@material-ui/icons/ExpandLess';
import IconButton from '@material-ui/core/IconButton';
import Loading from '../shared/loading.js';

import NumberFormat from 'react-number-format';
//const util = require('util'); //print an object

const styles = theme => ({
  card: {
    margin: 20
  },
  header: {
  	textAlign: 'left'
  },
  content: {
    textAlign: 'center',
    alignItems: 'center',
    display: 'flex'
  },
  statsListLeft: {
    marginRight: 'auto',
    paddingRight: 15,
    width: '45%',
    [theme.breakpoints.up('xl')]: {
      width: '30%',
      marginLeft: 'auto',
      paddingRight: 20
    },
    [theme.breakpoints.down('md')]: {
      width: '50%'
    }
  },
  statsListRight: {
    marginLeft: 'auto',
    paddingLeft: 15,
    width: '45%',
    [theme.breakpoints.up('xl')]: {
      width: '30%',
      marginRight: 'auto',
      paddingLeft: 20
    },
    [theme.breakpoints.down('md')]: {
      width: '50%'
    }    
  },
  quoteValue: {
    color: 'black',
    fontWeight: 300
  },
  listItem: {
    paddingLeft: 0,
    paddingRight: 0
  },
  listLabel: {
    fontWeight: 300,
    color: 'rgba(0,0,0,0.54)'
  },
  cardActions: {
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column'
  },
  button: {
    backgroundColor: 'white'
  }
});

 const formatMetric = metric => {
  var returnObj = {};
  if (!metric) {
    return returnObj;
  }

  if (metric > 1000000000) {
    returnObj.value = (metric / 1000000000).toFixed(2);
    returnObj.suffix = 'B';
  } else if (metric > 1000000 || metric < -1000000) {
    returnObj.value = (metric / 1000000).toFixed(2);
    returnObj.suffix = 'M';
  } else {
    returnObj.value = metric.toFixed(2);
    returnObj.suffix = '';    
  }

  return returnObj;  
}

const ExpandedLeft = (props) => {
  var {stats, classes} = props;

  return (
    <div>
    <Divider />            
    <ListItem key={'day50MovingAvg'} className={classes.listItem}>
      <ListItemText primary={"50 Day Moving Avg"} classes={{primary: classes.listLabel}}/>
      <ListItemSecondaryAction>
        {stats.day50MovingAvg ? <NumberFormat value={stats.day50MovingAvg.toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} className={classes.quoteValue}/> : '-'}
      </ListItemSecondaryAction>
    </ListItem>
    <Divider />            
    <ListItem key={'day200MovingAvg'} className={classes.listItem}>
      <ListItemText primary={"200 Day Moving Avg"} classes={{primary: classes.listLabel}}/>
      <ListItemSecondaryAction>
        {stats.day200MovingAvg ? <NumberFormat value={stats.day200MovingAvg.toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} className={classes.quoteValue} /> : '-'}
      </ListItemSecondaryAction>
    </ListItem> 
    <Divider />            
    <ListItem key={'month1ChangePercent'} className={classes.listItem}>
      <ListItemText primary={"1 Month Change"} classes={{primary: classes.listLabel}}/>
      <ListItemSecondaryAction>
        {stats.month1ChangePercent ? <NumberFormat value={(stats.month1ChangePercent * 100).toFixed(2)} displayType={'text'} thousandSeparator={true} suffix={'%'} className={classes.quoteValue}/> : '-'}
      </ListItemSecondaryAction>
    </ListItem>
    <Divider />            
    <ListItem key={'ytdChangePercent'} className={classes.listItem}>
      <ListItemText primary={"YTD Change"} classes={{primary: classes.listLabel}}/>
      <ListItemSecondaryAction>
        {stats.ytdChangePercent ? <NumberFormat value={(stats.ytdChangePercent * 100).toFixed(2)} displayType={'text'} thousandSeparator={true} suffix={'%'} className={classes.quoteValue} /> : '-'}
      </ListItemSecondaryAction>
    </ListItem>
    <Divider />            
    <ListItem key={'year1ChangePercent'} className={classes.listItem}>
      <ListItemText primary={"1 Year Change"} classes={{primary: classes.listLabel}}/>
      <ListItemSecondaryAction>
        {stats.year1ChangePercent ? <NumberFormat value={(stats.year1ChangePercent * 100).toFixed(2)} displayType={'text'} thousandSeparator={true} suffix={'%'} className={classes.quoteValue} /> : '-' }
      </ListItemSecondaryAction>
    </ListItem>  
    </div>    
  );
}

const ExpandedRight = (props) => {
  var {stats, classes} = props;

  return (
    <div>
    <Divider />            
    <ListItem key={'LTM revenue'} className={classes.listItem}>
      <ListItemText primary={"LTM Revenue"} classes={{primary: classes.listLabel}}/>
      <ListItemSecondaryAction>
        <NumberFormat value={formatMetric(stats.revenue).value} displayType={'text'} thousandSeparator={true} prefix={'$'} suffix={formatMetric(stats.revenue).suffix} className={classes.quoteValue}/>
      </ListItemSecondaryAction>
    </ListItem>
    <Divider />            
    <ListItem key={'LTM EBITDA'} className={classes.listItem}>
      <ListItemText primary={"LTM EBITDA"} classes={{primary: classes.listLabel}}/>
      <ListItemSecondaryAction>
        {stats.EBITDA ? <NumberFormat value={formatMetric(stats.EBITDA).value} displayType={'text'} thousandSeparator={true} prefix={'$'} suffix={formatMetric(stats.EBITDA).suffix} className={classes.quoteValue} /> : '-'}
      </ListItemSecondaryAction>
    </ListItem>
    <Divider />            
    <ListItem key={'LTM EPS'} className={classes.listItem}>
      <ListItemText primary={"LTM EPS"} classes={{primary: classes.listLabel}}/>
      <ListItemSecondaryAction>
        {stats.ttmEPS ? <NumberFormat value={formatMetric(stats.ttmEPS).value} displayType={'text'} thousandSeparator={true} prefix={'$'} className={classes.quoteValue} /> : '-' }
      </ListItemSecondaryAction>
    </ListItem>  
    <Divider />            
    <ListItem key={'cash'} className={classes.listItem}>
      <ListItemText primary={"Cash"} classes={{primary: classes.listLabel}}/>
      <ListItemSecondaryAction>
        { stats.cash ? <NumberFormat value={formatMetric(stats.cash).value} displayType={'text'} thousandSeparator={true} prefix={'$'} suffix={formatMetric(stats.cash).suffix} className={classes.quoteValue} /> : '-'}
      </ListItemSecondaryAction>
    </ListItem>
    <Divider />            
    <ListItem key={'debt'} className={classes.listItem}>
      <ListItemText primary={"Debt"} classes={{primary: classes.listLabel}}/>
      <ListItemSecondaryAction>
        { stats.debt ? <NumberFormat value={formatMetric(stats.debt).value} displayType={'text'} thousandSeparator={true} prefix={'$'} suffix={formatMetric(stats.debt).suffix} className={classes.quoteValue} /> : '-'}
      </ListItemSecondaryAction>
    </ListItem> 
    </div>    
  );
}


class KeyStats extends React.Component {
  constructor (props) {
    super(props);

    this.state = { 
      expanded: false
    }

    this.handleExpand = this.handleExpand.bind(this);
  }

  getMetric(value) {
    var formattedValue = {};

    if (value >= 100000000000) {
      formattedValue.value = Math.round(value / 1000000000);
      formattedValue.suffix = "B";      
    } else if (value >= 10000000000) {
      formattedValue.value = (value / 1000000000).toFixed(1);
      formattedValue.suffix = "B";
    } else if (value >= 1000000000) {
      formattedValue.value = (value / 1000000000).toFixed(2);
      formattedValue.suffix = "B";      
    } else if (value >= 100000000) {
      formattedValue.value = Math.round(value / 1000000);
      formattedValue.suffix = "M";
    } else if (value >= 10000000) {
      formattedValue.value = (value / 1000000).toFixed(2);
      formattedValue.suffix = "M";
    } else {
      formattedValue.value = value.toFixed(2);
      formattedValue.suffix = "";      
    }

    return formattedValue;
  }

  handleExpand() {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  render() {
    const { classes, quote, stats, priceObj } = this.props;
    const { expanded } = this.state;

    if (!quote) {
      return <Loading />
    }

    var formattedMarketCap = quote && this.getMetric(quote.marketCap);
    
    return (
      <Card className={classes.card}>
        <CardHeader 
          title="Key Stats"
          subheader={quote.symbol+": "+quote.primaryExchange+(priceObj && priceObj.latestPrice ? " (IEX Realtime Price)" : "")}
          className={classes.header}
        />
        <CardContent className={classes.content}>
          <List className={classes.statsListLeft}>
            <ListItem key={'marketCap'} className={classes.listItem}>
              <ListItemText primary={"Market Cap"} classes={{primary: classes.listLabel}} />
              <ListItemSecondaryAction>
                <NumberFormat value={formattedMarketCap.value} displayType={'text'} thousandSeparator={true} prefix={'$'} suffix={formattedMarketCap.suffix} className={classes.quoteValue} />
              </ListItemSecondaryAction>              
            </ListItem>
            <Divider />            
            <ListItem key={'volume'} className={classes.listItem}>
              <ListItemText primary={"Volume"} classes={{primary: classes.listLabel}}/>
              <ListItemSecondaryAction>
                {quote.latestVolume ? <NumberFormat value={quote.latestVolume} displayType={'text'} thousandSeparator={true} className={classes.quoteValue} /> : '-'}
              </ListItemSecondaryAction>
              </ListItem>                
            <Divider />   
            <ListItem key={'avgVolume'} className={classes.listItem}>
              <ListItemText primary={"Avg Volume"} classes={{primary: classes.listLabel}} />
              <ListItemSecondaryAction>
                {quote.avgTotalVolume ? <NumberFormat value={quote.avgTotalVolume} displayType={'text'} thousandSeparator={true} className={classes.quoteValue} /> : '-'}
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />                
            <ListItem key={'yearLow'} className={classes.listItem}>
              <ListItemText primary={"52 Week Low"} classes={{primary: classes.listLabel}}/>
              <ListItemSecondaryAction>
                {quote.week52Low ? <NumberFormat value={ quote.week52Low.toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} className={classes.quoteValue} /> : '-'}
              </ListItemSecondaryAction>                            
            </ListItem>
            <Divider />            
            <ListItem key={'yearHigh'} className={classes.listItem}>
              <ListItemText primary={"52 Week High"} classes={{primary: classes.listLabel}}/>
              <ListItemSecondaryAction>
                {quote.week52High ? <NumberFormat value={quote.week52High.toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} className={classes.quoteValue} /> : '-'}
              </ListItemSecondaryAction>
            </ListItem>             
            {expanded && <ExpandedLeft stats={stats} classes={classes} />}            
          </List>
          <List className={classes.statsListRight}>
            <ListItem key={'previous'} className={classes.listItem}>
              <ListItemText primary={"Previous Close"} classes={{primary: classes.listLabel}} />
              <ListItemSecondaryAction>
                {quote.previousClose ? <NumberFormat value={quote.previousClose.toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} className={classes.quoteValue} /> : '-'}
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            <ListItem key={'open'} className={classes.listItem}>
              <ListItemText primary={"Open"} classes={{primary: classes.listLabel}} />
              <ListItemSecondaryAction>
                {quote.open ? <NumberFormat value={ quote.open.toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} className={classes.quoteValue} /> : '-'}
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />            
            <ListItem key={'todayLow'} className={classes.listItem}>
              <ListItemText primary={"Today's Low"} classes={{primary: classes.listLabel}}/>
              <ListItemSecondaryAction>
                {quote.low ? <NumberFormat value={quote.low.toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} className={classes.quoteValue}/> : '-'}
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />            
            <ListItem key={'todayHigh'} className={classes.listItem}>
              <ListItemText primary={"Today's High"} classes={{primary: classes.listLabel}}/>
              <ListItemSecondaryAction>
                {quote.high ? <NumberFormat value={ quote.high.toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} className={classes.quoteValue} /> : '-'}
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />            
            <ListItem key={'todayClose'} className={classes.listItem}>
              <ListItemText primary={"Close"} classes={{primary: classes.listLabel}}/>
              <ListItemSecondaryAction>
                {quote.close ? <NumberFormat value={ quote.close.toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} className={classes.quoteValue} /> : '-'}
              </ListItemSecondaryAction>
            </ListItem>  
            {expanded && <ExpandedRight stats={stats} classes={classes} />}                
          </List>
        </CardContent>
        <CardActions className={classes.cardActions} >
          <IconButton aria-label="more" className={classes.button} onClick={this.handleExpand}>
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </CardActions>    
      </Card>
    );
  }
}


KeyStats.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(KeyStats);