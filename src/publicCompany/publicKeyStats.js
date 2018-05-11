import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import {lightBlue} from 'material-ui/colors';
import Card, { CardContent, CardHeader, CardActions } from 'material-ui/Card';
import NumberFormat from 'react-number-format';
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import ExpansionIcon from 'material-ui-icons/ExpandMore';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import Loading from '../shared/loading.js';

const util = require('util'); //print an object

const styles = theme => ({
  card: {
    margin: 20
  },
  changeInput: {
    color: lightBlue[500]
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


class KeyStats extends React.Component {
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

  render() {
    const { classes, quote } = this.props;
    if (!quote) {
      return <Loading />
    }

    var formattedMarketCap = quote && this.getMetric(quote.marketCap);
    
    return (
      <Card className={classes.card}>
        <CardHeader 
          title="Key Stats"
          subheader={quote.symbol+": "+quote.primaryExchange}
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
                <NumberFormat value={quote.latestVolume} displayType={'text'} thousandSeparator={true} className={classes.quoteValue} />
              </ListItemSecondaryAction>
              </ListItem>                
            <Divider />   
            <ListItem key={'avgVolume'} className={classes.listItem}>
              <ListItemText primary={"Avg Volume"} classes={{primary: classes.listLabel}} />
              <ListItemSecondaryAction>
                <NumberFormat value={quote.avgTotalVolume} displayType={'text'} thousandSeparator={true} className={classes.quoteValue} />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />                
            <ListItem key={'yearLow'} className={classes.listItem}>
              <ListItemText primary={"52 Week Low"} classes={{primary: classes.listLabel}}/>
              <ListItemSecondaryAction>
                <NumberFormat value={quote.week52Low} displayType={'text'} thousandSeparator={true} prefix={'$'} className={classes.quoteValue} />
              </ListItemSecondaryAction>                            
            </ListItem>
            <Divider />            
            <ListItem key={'yearHigh'} className={classes.listItem}>
              <ListItemText primary={"52 Week High"} classes={{primary: classes.listLabel}}/>
              <ListItemSecondaryAction>
                <NumberFormat value={quote.week52High} displayType={'text'} thousandSeparator={true} prefix={'$'} className={classes.quoteValue} />
              </ListItemSecondaryAction>
            </ListItem>             
          </List>
          <List className={classes.statsListRight}>
            <ListItem key={'previous'} className={classes.listItem}>
              <ListItemText primary={"Previous Close"} classes={{primary: classes.listLabel}} />
              <ListItemSecondaryAction>
                <NumberFormat value={quote.previousClose.toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} className={classes.quoteValue} />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            <ListItem key={'open'} className={classes.listItem}>
              <ListItemText primary={"Open"} classes={{primary: classes.listLabel}} />
              <ListItemSecondaryAction>
                <NumberFormat value={quote.open.toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} className={classes.quoteValue} />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />            
            <ListItem key={'todayLow'} className={classes.listItem}>
              <ListItemText primary={"Today's Low"} classes={{primary: classes.listLabel}}/>
              <ListItemSecondaryAction>
                <NumberFormat value={quote.low.toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} className={classes.quoteValue}/>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />            
            <ListItem key={'todayHigh'} className={classes.listItem}>
              <ListItemText primary={"Today's High"} classes={{primary: classes.listLabel}}/>
              <ListItemSecondaryAction>
                <NumberFormat value={quote.high.toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} className={classes.quoteValue} />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />            
            <ListItem key={'todayClose'} className={classes.listItem}>
              <ListItemText primary={"Close"} classes={{primary: classes.listLabel}}/>
              <ListItemSecondaryAction>
                <NumberFormat value={quote.close.toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} className={classes.quoteValue} />
              </ListItemSecondaryAction>
            </ListItem>                    
          </List>
        </CardContent>
        <CardActions className={classes.cardActions} >
          <IconButton aria-label="more" className={classes.button}>
            <ExpansionIcon />
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