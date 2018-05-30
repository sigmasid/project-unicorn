import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {Helmet} from "react-helmet";

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';

import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MethodologyItems from './methodology-items.js';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 800,
    backgroundColor: theme.palette.background.paper,
    margin: '0 auto',
    marginTop: theme.spacing.unit * 3,
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
    padding: 20,
    [theme.breakpoints.down('md')]: {
      padding: 10
    }
  },
});

const MethodologyDetail = (props) => props.items.map((item, index) => {
  return(
    <ExpansionPanel key={index} className={props.classes.expansionPanel} >
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className={props.classes.heading} >{item.question}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Typography color='textSecondary'>
          {item.answer}
        </Typography>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
})

function MethodologyPanes(props) {
  const { classes } = props;
  return (
  <div className={classes.root}>
    <Helmet>
      <title>Methodology & FAQs</title>
      <meta name="description" content="How we calculate estimates and get our data" />          
    </Helmet>     
    <Paper className={classes.header} >
      <Typography variant="display3" className={classes.titleText}>
        FAQs
      </Typography>
    </Paper>
    <Paper className={classes.lists} >
      <MethodologyDetail items={MethodologyItems} classes={classes} />
    </Paper>
  </div>
  );
}

MethodologyPanes.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MethodologyPanes);