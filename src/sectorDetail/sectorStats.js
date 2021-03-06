import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';

import NumberFormat from 'react-number-format';
import Loading from '../shared/loading.js';
import Avatar from '@material-ui/core/Avatar';
import { formatMetric, formatSuffix } from '../shared/sharedFunctions.js';

//const util = require('util'); //print an object

const styles = theme => ({
  card: {
    margin: 20
  },
  statTile: {
    margin: '0 auto',
    textAlign: 'center'
  },
  titleBar: {
    background: 'none',
    textAlign: 'center',
  },
  title: {
    color: 'black',
    whiteSpace: 'pre-wrap',
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.9rem',
      lineHeight: '20px'
    },
  },
  avatar: {
    width: 100,
    height: 100,
    color: '#fff',
    backgroundColor: 'black',
    margin: '0 auto',
    [theme.breakpoints.down('md')]: {
      width: 75,
      height: 75
    }
  }
});

const median = (values) => {
    values.sort(function(a,b){
    return a-b;
  });

  if(values.length ===0) return 0

  var half = Math.floor(values.length / 2);

  if (values.length % 2)
    return values[half];
  else
    return (values[half - 1] + values[half]) / 2.0;
}

const calcMultiples = (compSet) => {
  var revGrowth = [];
  var ebitdaMargin = [];
  var netMargin = [];
  var ltmRD = [];
  var totalRev = [];

  var sectorValues = {};

  //calc fwd rev growth, ebitda margin, r&d margin
  compSet.map(function(currentCompany) {
    var _totalRev = parseFloat(currentCompany.rev_cy1);
    var _revGrowth = parseFloat(currentCompany.rev_cy1) / parseFloat(currentCompany.rev_cy) - 1;
    var _ebitdaMargin = parseFloat(currentCompany.ebitda_cy1) / parseFloat(currentCompany.rev_cy1);
    var _netMargin = (parseFloat(currentCompany.eps_cy1) * parseFloat(currentCompany.shares_out)) / parseFloat(currentCompany.rev_cy1);
    var _ltmRD = parseFloat(currentCompany.ltm_rd) / parseFloat(currentCompany.ltm_rev);

    if (!isNaN(_revGrowth)) {
      revGrowth.push(_revGrowth);
    }

    if (!isNaN(_ebitdaMargin)) {
      ebitdaMargin.push(_ebitdaMargin);
    }

    if (!isNaN(_netMargin)) {
      netMargin.push(_netMargin);
    }

    if (!isNaN(_ltmRD)) {
      ltmRD.push(_ltmRD);
    }

    if (!isNaN(_totalRev)) {
      totalRev.push(_totalRev);
    }

    return null; 
  });

  sectorValues.revGrowth = median(revGrowth);
  sectorValues.ebitdaMargin = median(ebitdaMargin); 
  sectorValues.netMargin = median(netMargin);
  sectorValues.ltmRD = median(ltmRD);
  sectorValues.totalRev = totalRev.reduce(function(a, b) { return a + b; }, 0);

  return sectorValues;
}

const StatOutput = (classes, compSet) => {
  if (compSet === undefined) {
    return <Loading />
  }
  var sectorValues = calcMultiples(compSet);
  return(
  <CardContent>
    <GridList cellHeight={180} className={classes.gridList} cols={3}>
      <GridListTile key={1}>
        <Avatar className={ classes.avatar }>
          <NumberFormat value={ formatMetric(sectorValues.totalRev) } displayType={'text'} thousandSeparator={true} prefix={'$'} suffix={formatSuffix(sectorValues.totalRev)} />
        </Avatar>
        <GridListTileBar
          title="Total Rev"
          subtitle="CY2018E"
          classes={{
            root: classes.titleBar,
            title: classes.title,
            subtitle: classes.title
          }}       
        />
      </GridListTile>
      <GridListTile key={2} className={classes.statTile}>
        <Avatar className={ classes.avatar }><NumberFormat value={Math.round(sectorValues.revGrowth * 100)} displayType={'text'} suffix={'%'}/></Avatar>
        <GridListTileBar
          title={document.body.clientWidth > 600 ? "Forward Rev Growth %" : "Fwd Rev Growth"} 
          subtitle={document.body.clientWidth > 600 ? "CY2017 - CY2018E" : "CY17E - 18E"}
          classes={{
            root: classes.titleBar,
            title: classes.title,
            subtitle: classes.title
          }}
        />
      </GridListTile>
      <GridListTile key={3}>
        <Avatar className={ classes.avatar }><NumberFormat value={Math.round(sectorValues.netMargin * 100)} displayType={'text'} suffix={'%'}/></Avatar>
        <GridListTileBar
          title="Net Margin"
          subtitle="CY2018E"
          classes={{
            root: classes.titleBar,
            title: classes.title,
            subtitle: classes.title
          }}       
        />
      </GridListTile>      
    </GridList> 
  </CardContent>  
  )
}

function SectorStats(props) {
  const { classes, compSet } = props;

  return (
    <Card className={classes.card}>
      <CardHeader 
        title="Operating Statistics"
        subheader="Metrics for Companies in Comp Set"
        className={classes.header}             
      />
      {StatOutput(classes, compSet)}          
    </Card>
  );
}

SectorStats.propTypes = {
  classes: PropTypes.object.isRequired
};


export default withStyles(styles, { withTheme: true })(SectorStats);