import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel';
import Typography from 'material-ui/Typography';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import MethodologyItems from './methodology-items.js';

const styles = theme => ({
  root: {
    maxWidth: '800px',
    margin: '0 auto'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
});

const MethodologyDetail = (props) => props.items.map((item, index) => {
  return(
    <ExpansionPanel key={index}>
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
      <MethodologyDetail items={MethodologyItems} classes={classes} />
    </div>
  );
}

MethodologyPanes.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MethodologyPanes);