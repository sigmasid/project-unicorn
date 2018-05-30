import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';

import Loading from '../shared/loading.js';
import Avatar from '@material-ui/core/Avatar';
import { Element } from '../shared/sharedFunctions.js';

import pink from '@material-ui/core/colors/pink';
import green from '@material-ui/core/colors/green';
import Zoom from '@material-ui/core/Zoom';

//const util = require('util'); //print an object
const moment = require('moment');

const styles = theme => ({
  card: {
    margin: 20
  },
  header: {
    textAlign: 'left',
    maxWidth: '60%',
    paddingTop: 8,
    paddingBottom: 8,
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
        <Zoom in={lastPrice && true}>
          <Element value={lastPrice} label={lastUpdate} classes={classes} elementClass={priceChangePercent > 0 ? classes.positiveChange : classes.negativeChange} prefix="$" />
        </Zoom>
      </div>
      <div className={classes.priceChange}>
        <Element value={priceChangePercent} label="Change Today" classes={classes} elementClass={priceChangePercent > 0 ? classes.positiveChange : classes.negativeChange} suffix="%" prefix={priceChangePercent > 0 ? '+' : ''} /> 
      </div>
    </div>
  );
}


class CompanyIntro extends React.Component {
  render() {
    const { classes, company, priceObj, description } = this.props;
    if (company === undefined) {
      return <Loading />
    }

    var formattedTime = moment((priceObj && priceObj.time) || company.latestUpdate).format('MMM DD, h:mm a');

    return (
    <Card className={classes.card}>
      <div className={classes.sectionLeft}>
        <Avatar className={classes.tileAvatar}>{company.symbol}</Avatar>
        <CardHeader title={company.companyName.toProperCase()} subheader={description.description} classes={{root: classes.header}} />
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