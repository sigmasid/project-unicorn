import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardHeader, CardContent } from 'material-ui/Card';
import GridList, { GridListTile, GridListTileBar } from 'material-ui/GridList';
import NumberFormat from 'react-number-format';
import Loading from '../shared/loading.js';
import Avatar from 'material-ui/Avatar';
import { formatMetric, formatSuffix } from '../shared/sharedFunctions.js';

import { red, green, amber } from 'material-ui/colors';

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
    textAlign: 'center'
  },
  title: {
    color: 'black'
  },
  redAvatar: {
    width: 100,
    height: 100,
    color: '#fff',
    backgroundColor: red[500],
    margin: '0 auto'
  },
  amberAvatar: {
    width: 100,
    height: 100,
    color: '#fff',
    backgroundColor: amber[500],
    margin: '0 auto'
  },
  greenAvatar: {
    width: 100,
    height: 100,
    color: '#fff',
    backgroundColor: green[500],
    margin: '0 auto'
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
        <Avatar className={sectorValues.totalRev > 10000  ? classes.greenAvatar : sectorValues.totalRev > 1000 ? classes.amberAvatar : classes.redAvatar }>
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
        <Avatar className={ sectorValues.revGrowth > 0.1 ? classes.greenAvatar : sectorValues.revGrowth > 0.05 ? classes.amberAvatar : classes.redAvatar }><NumberFormat value={Math.round(sectorValues.revGrowth * 100)} displayType={'text'} suffix={'%'}/></Avatar>
        <GridListTileBar
          title="Forward Rev Growth %"
          subtitle="CY2017 - CY2018E"
          classes={{
            root: classes.titleBar,
            title: classes.title,
            subtitle: classes.title
          }}
        />
      </GridListTile>
      {/* 
      <GridListTile key={2}>
        <Avatar className={sectorValues.ebitdaMargin > 0.2 ? classes.greenAvatar : sectorValues.ebitdaMargin > 0.1 ? classes.amberAvatar : classes.redAvatar}><NumberFormat value={Math.round(sectorValues.ebitdaMargin * 100)} displayType={'text'} suffix={'%'}/></Avatar>
        <GridListTileBar
          title="EBITDA Margin"
          subtitle="CY2018E"
          classes={{
            root: classes.titleBar,
            title: classes.title,
            subtitle: classes.title
          }}       
        />
      </GridListTile> */}
      <GridListTile key={3}>
        <Avatar className={ sectorValues.netMargin > 0.05 ? classes.greenAvatar : sectorValues.netMargin > 0 ? classes.amberAvatar : classes.redAvatar }><NumberFormat value={Math.round(sectorValues.netMargin * 100)} displayType={'text'} suffix={'%'}/></Avatar>
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
      {/* 
      <GridListTile key={4}>
        <Avatar className={ sectorValues.ltmRD > 0.1 ? classes.redAvatar : sectorValues.ltmRD > 0.05 ? classes.amberAvatar : classes.greenAvatar }><NumberFormat value={Math.round(sectorValues.ltmRD * 100)} displayType={'text'} suffix={'%'}/></Avatar>
        <GridListTileBar
          title="R&D Margin"
          subtitle="LTM"
          classes={{
            root: classes.titleBar,
            title: classes.title,
            subtitle: classes.title
          }}
        />
      </GridListTile>
      */}        
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
        subheader="Median Stats for Public Companies"
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