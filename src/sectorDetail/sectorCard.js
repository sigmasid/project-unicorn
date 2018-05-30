import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Loading from '../shared/loading.js';
import SectorChips from './sectorChips.js';

//const util = require('util'); //print an object

const styles = theme => ({
  card: {
    margin: 20
  },
  header: {
    textAlign: 'center',
    maxWidth: '50%',
    margin: '0 auto',
    [theme.breakpoints.down('md')]: {
      margin: '0 auto',
      maxWidth: '100%'
    }
  },
  emoji: {
    fontSize: '3.5rem'
  },
  logoWrapper: {
    paddingTop: 20,
    width: '100%',
    textAlign: 'center'
  },
  tileAvatar: {
    width: 100,
    height: 100,
    [theme.breakpoints.down('md')]: {
      width: 75,
      height: 75
    },
    color: '#fff',
    backgroundColor: theme.palette.background.default,
    margin: '0 auto'
  },
  title: {
    fontSize: '3.5rem',
    fontWeight: 800
  },
  changeSector: {
    boxShadow: 'none',
  },
  sectorText: {
    marginLeft: 'auto'
  }
});

function SectorCard(props) {
  const { classes, sector, categories, selectedCategoryName, updateCompSet, sorted } = props;

  if (!sector || !selectedCategoryName || !categories || !categories[selectedCategoryName]) {
    return <Loading />
  }

  return (
    <Card className={classes.card}>
      <div className={classes.logoWrapper}>
        <Avatar alt="Sector Logo" className={classNames(classes.avatar, classes.tileAvatar)}><span className={classes.emoji} alt="sector logo">{categories[selectedCategoryName].logo}</span></Avatar>
      </div>
      <CardHeader 
        title={selectedCategoryName.toProperCase()}
        subheader={(categories[selectedCategoryName].description && categories[selectedCategoryName].description) || (sector && sector.name.toProperCase())}
        classes={{
          root: classes.header,
          title: classes.title,
          subheader: classes.subtitle
        }}            
      />
      <CardContent className={classes.content}>
        <ExpansionPanel className={classes.changeSector} defaultExpanded={true} >
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <div className={classes.sectorText}><Typography className={classes.heading}>Change Subsector</Typography></div>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <SectorChips  categories={categories} 
                          sorted={sorted}
                          selectedCategoryName={selectedCategoryName}
                          updateCompSet={updateCompSet}
                          className={classes.chips} />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </CardContent>
    </Card>
  );
}

SectorCard.propTypes = {
  classes: PropTypes.object.isRequired,
  handleDelete: PropTypes.func.isRequired
};


export default withStyles(styles, { withTheme: true })(SectorCard);