import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import Card, { CardContent, CardHeader } from 'material-ui/Card';
import NumberFormat from 'react-number-format';
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';

const util = require('util'); //print an object
const moment = require('moment');

const styles = theme => ({
  card: {
    marginLeft: 30,
    boxShadow: 'none',
    width: '100%',
    [theme.breakpoints.down('md')]: {
      marginLeft: 0
    }
  },
  header: {
  	textAlign: 'left',
    paddingBottom: 0
  },
  content: {
    textAlign: 'center',
    alignItems: 'center',
    display: 'flex',
    paddingTop: 0
  },
  statsListFull: {
    width: '100%'
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
  }
});


class MarketKeyStats extends React.Component {
  render() {
    const { classes, quote, type } = this.props;

    if (type === 'commodities') {      
      return (
        <Card className={classes.card}>
          <CardHeader 
            subheader={quote.exchangeActivityTimeLabel}
            className={classes.header}
          />
        <CardContent className={classes.content}>
          <List className={classes.statsListFull}>
            <ListItem key={'commodityPrice'} className={classes.listItem}>
              <ListItemText primary={"Last Price"} classes={{primary: classes.listLabel}} />
              <ListItemSecondaryAction className={classes.quoteValue}>
                <NumberFormat value={parseFloat(quote.price).toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={"$"} className={classes.quoteValue} />
              </ListItemSecondaryAction>              
            </ListItem>
            <Divider />
            <ListItem key={'contractDate'} className={classes.listItem}>
              <ListItemText primary={"Contract Date"} classes={{primary: classes.listLabel}} />
              <ListItemSecondaryAction className={classes.quoteValue}>{quote.contractDate}</ListItemSecondaryAction>              
            </ListItem>
            <Divider />            
            <ListItem key={'contractExpiration'} className={classes.listItem}>
              <ListItemText primary={"Contract Expiration"} classes={{primary: classes.listLabel}} />
              <ListItemSecondaryAction className={classes.quoteValue}>{quote.expirationDate}</ListItemSecondaryAction>              
            </ListItem>             
          </List>          
        </CardContent>
        </Card>
      )
    }

    var latestUpdate = <span>Last Update: {moment(new Date(quote.activityTimeUTC)).format('MMM DD, h:mm a')}</span>;

    return (
      <Card className={classes.card}>
        <CardHeader 
          subheader={latestUpdate}
          className={classes.header}
        />
        <CardContent className={classes.content}>
          <List className={classes.statsListLeft}>
            <ListItem key={'currency'} className={classes.listItem}>
              <ListItemText primary={"Currency"} classes={{primary: classes.listLabel}} />
              <ListItemSecondaryAction className={classes.quoteValue}>{quote.currency}</ListItemSecondaryAction>              
            </ListItem>
            <Divider />            
            <ListItem key={'volume'} className={classes.listItem}>
              <ListItemText primary={"Volume"} classes={{primary: classes.listLabel}}/>
              <ListItemSecondaryAction>
                <NumberFormat value={quote.volume} displayType={'text'} thousandSeparator={true} className={classes.quoteValue} />
              </ListItemSecondaryAction>
              </ListItem>                
            <Divider />   
            <ListItem key={'avgVolume'} className={classes.listItem}>
              <ListItemText primary={"52 Week Low"} classes={{primary: classes.listLabel}} />
              <ListItemSecondaryAction>
                <NumberFormat value={parseFloat(quote.fiftyTwoWeekLow).toFixed(2)} displayType={'text'} thousandSeparator={true} className={classes.quoteValue} />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />                
            <ListItem key={'yearLow'} className={classes.listItem}>
              <ListItemText primary={"52 Week High"} classes={{primary: classes.listLabel}}/>
              <ListItemSecondaryAction>
                <NumberFormat value={parseFloat(quote.fiftyTwoWeekHigh).toFixed(2)} displayType={'text'} thousandSeparator={true} className={classes.quoteValue} />
              </ListItemSecondaryAction>                            
            </ListItem>
          </List>
          <List className={classes.statsListRight}>
            <ListItem key={'previous'} className={classes.listItem}>
              <ListItemText primary={"Previous Close"} classes={{primary: classes.listLabel}} />
              <ListItemSecondaryAction>
                <NumberFormat value={parseFloat(quote.yesterdayPrice).toFixed(2)} displayType={'text'} thousandSeparator={true} className={classes.quoteValue} />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            <ListItem key={'open'} className={classes.listItem}>
              <ListItemText primary={"Open"} classes={{primary: classes.listLabel}} />
              <ListItemSecondaryAction>
                <NumberFormat value={parseFloat(quote.openPrice).toFixed(2)} displayType={'text'} thousandSeparator={true} className={classes.quoteValue} />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />            
            <ListItem key={'todayLow'} className={classes.listItem}>
              <ListItemText primary={"Today's Low"} classes={{primary: classes.listLabel}}/>
              <ListItemSecondaryAction>
                <NumberFormat value={parseFloat(quote.dayLow).toFixed(2)} displayType={'text'} thousandSeparator={true} className={classes.quoteValue}/>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />            
            <ListItem key={'todayHigh'} className={classes.listItem}>
              <ListItemText primary={"Today's High"} classes={{primary: classes.listLabel}}/>
              <ListItemSecondaryAction>
                <NumberFormat value={parseFloat(quote.dayHigh).toFixed(2)} displayType={'text'} thousandSeparator={true} className={classes.quoteValue} />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
       </CardContent>
      </Card>
    );
  }
}


MarketKeyStats.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MarketKeyStats);