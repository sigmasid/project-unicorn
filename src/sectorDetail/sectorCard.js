import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardHeader, CardContent } from 'material-ui/Card';
import Loading from '../shared/loading.js';
import SectorChips from './sectorChips.js';
import Avatar from 'material-ui/Avatar';
import classNames from 'classnames';
import grey from 'material-ui/colors/grey';

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
    backgroundColor: grey[100],
    margin: '0 auto'
  },
  chips: {
    maxWidth: '50%'
  }
});

function SectorCard(props) {
  const { classes, sector, categories, selectedCategory, updateCompSet } = props;

  if (sector === undefined) {
    return <Loading />
  }

  return (
    <div>
      <Card className={classes.card}>
        <div className={classes.logoWrapper}>
          <Avatar alt="Sector Logo" className={classNames(classes.avatar, classes.tileAvatar)}><span className={classes.emoji} alt="sector logo">{sector.logo}</span></Avatar>
        </div>
        <CardHeader 
          title={sector.name.toProperCase()}
          subheader={sector.description}
          className={classes.header}             
        />
        <CardContent className={classes.content}>
          { categories !== undefined ? 
              <SectorChips  categories={categories} 
                            selectedCategory={selectedCategory}
                            updateCompSet={updateCompSet}
                            className={classes.chips} /> : 
              <Loading /> }
        </CardContent>
      </Card>
    </div>
  );
}

SectorCard.propTypes = {
  classes: PropTypes.object.isRequired,
  handleDelete: PropTypes.func.isRequired
};


export default withStyles(styles, { withTheme: true })(SectorCard);