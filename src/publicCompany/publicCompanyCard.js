import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardHeader } from 'material-ui/Card';
import Loading from '../shared/loading.js';
import Avatar from 'material-ui/Avatar';
import { Element } from '../shared/sharedFunctions.js';
import classNames from 'classnames';

import pink from 'material-ui/colors/pink';
import green from 'material-ui/colors/green';

//const util = require('util'); //print an object
const moment = require('moment');

const styles = theme => ({
  card: {
    margin: 20
  },
  header: {
    textAlign: 'left',
    maxWidth: '60%',
    [theme.breakpoints.down('md')]: {
      maxWidth: '100%',
      paddingRight: 0
    }
  },
  sectionLeft: {
    display: 'flex'
  },
  priceContainer: {
    display: 'flex',
    marginLeft: 'auto',
    padding: 24,
    alignItems: 'center',
    textAlign: 'center'
  },
  typography: {
    fontWeight: 800
  },
  lastPrice: {
    paddingRight: 48,
    [theme.breakpoints.down('md')]: {
      paddingRight: 24
    }
  },
  priceChange: {
    paddingRight: 24,
    [theme.breakpoints.down('md')]: {
      paddingRight: 12
    }
  },
  tileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 0,
    alignSelf: 'center',
    [theme.breakpoints.down('md')]: {
      width: 75,
      height: 75,
      marginLeft: 10
    },
    color: 'white',
    backgroundColor: 'black'
  },
  positiveChange: {
    color: green[500],
    fontWeight: 300    
  },
  negativeChange: {
    color: pink[500],
    fontWeight: 300    
  }  
});

function PriceQuote(props) {
  const { classes, company, lastPrice, lastUpdate} = props;
  var priceChangePercent = company.changePercent * 100;

  return (
    <div className={classes.priceContainer}>
      <div className={classes.lastPrice}>
        <Element value={lastPrice} label={lastUpdate} classes={classes} elementClass={priceChangePercent > 0 ? classes.positiveChange : classes.negativeChange} prefix="$" />
      </div>
      <div className={classes.priceChange}>
        <Element value={priceChangePercent} label="Change Today" classes={classes} elementClass={priceChangePercent > 0 ? classes.positiveChange : classes.negativeChange} suffix="%" prefix={priceChangePercent > 0 ? '+' : ''} /> 
      </div>
    </div>
  );
}


class CompanyIntro extends React.Component {
  render() {
    const { classes, company, priceObj } = this.props;
    if (company === undefined) {
      return <Loading />
    }

    var formattedTime = moment((priceObj && priceObj.time) || company.latestUpdate).format('MMM DD, h:mm a');

    return (
    <Card className={classes.card}>
      <div className={classes.sectionLeft}>
        <Avatar className={classes.tileAvatar}>{company.symbol}</Avatar>
        <CardHeader title={company.companyName.toProperCase()} subheader={company.description} classes={{root: classes.header}} />
        <PriceQuote lastPrice={(priceObj && priceObj.price) || company.latestPrice} lastUpdate={formattedTime} company={company} classes={classes} />
      </div>
    </Card>
    );
  }
}

CompanyIntro.propTypes = {
  classes: PropTypes.object.isRequired
};


export default withStyles(styles, { withTheme: true })(CompanyIntro);