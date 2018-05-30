import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {Helmet} from "react-helmet";

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Items from './terms.json';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 800,
    backgroundColor: theme.palette.background.paper,
    margin: '0 auto',
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
    [theme.breakpoints.down('md')]: {
      maxWidth: '100%',
      marginTop: 0
    }
  },
  header: {
    textAlign: 'left',
    padding: '20px 20px 0px 40px',
    boxShadow: 'none',
    [theme.breakpoints.down('md')]: {
      padding: '10px 10px 0px 20px'
    }
  },
  paper: {
    display: 'flex',
    justifyContent: 'end',
    flexWrap: 'wrap',
    padding: theme.spacing.unit / 2,
    boxShadow: 'none',
  },
  titleText: {
    fontWeight: 800,
    color: 'black',
    marginBottom: 10
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  expansionPanel: {
    boxShadow: 'none'
  },
  lists: {
    boxShadow: 'none',
    padding: '20px 20px 0px 40px',
    marginBottom: 30,
    [theme.breakpoints.down('md')]: {
      padding: 10
    }
  },
});

const termsWelcome = "WELCOME TO PROJECT UNICORN! WE ENCOURAGE YOU TO TAKE ADVANTAGE OF THE CONTENT AND FEATURES AVAILABLE ON PROJECTUNICORN.CO AND ALL PROJECT UNICORN-OWNED WEBSITES (EACH, A 'WEBSITE'). PLEASE READ THESE NON-NEGOTIABLE TERMS OF USE CAREFULLY BEFORE USING THE WEBSITE. BY CONTINUING TO USE THE WEBSITE, YOU (THE 'USER') AGREE TO BE BOUND BY THESE TERMS OF USE."

const TermsDetail = (props) => Object.keys(props.items).map((item, index) => {
  return(
    <Paper className={props.classes.paper} key={item}>
      <Typography variant="title" gutterBottom>{item}</Typography>
      <Typography variant="subheading" color="textSecondary" gutterBottom>{props.items[item]}</Typography>
    </Paper>
  )
})

function Terms(props) {
  const { classes } = props;
  return (
  <div className={classes.root}>
    <Helmet>
      <title>Terms & Conditions</title>
    </Helmet>   
    <Paper className={classes.header} >
      <Typography variant="display3" className={classes.titleText}>
        Terms & Conditions
      </Typography>
    </Paper>
    <Paper className={classes.lists} >
      <Typography variant="title" gutterBottom>{termsWelcome}</Typography>
      <TermsDetail classes={classes} items={Items} />
    </Paper>
  </div>
  );
}

Terms.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Terms);