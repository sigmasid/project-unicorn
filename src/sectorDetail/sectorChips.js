import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Chip from 'material-ui/Chip';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import { CardActions } from 'material-ui/Card';

const styles = theme => ({
  root: {
    margin: '0 auto',
    height: 'auto',
    textAlign: 'center',
    display: 'block',
    maxWidth: '50%',
    [theme.breakpoints.down('md')]: {
      maxWidth: '100%'
    }
  },
  paper: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    padding: theme.spacing.unit / 2,
    boxShadow: 'none',
  },
  selectedChip: {
    background: theme.palette.gradient,
    color: 'white',
    margin: theme.spacing.unit,
    '&:hover, &:active, &:focus': {
      background: theme.palette.gradient,
      color: 'white',
      // Reset on mouse devices
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      }
    }
  },
  chip: {
    margin: theme.spacing.unit,
    '&:hover, &:active, &:focus': {
      background: theme.palette.gradient,
      color: 'white',
      // Reset on mouse devices
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      }
    }
  }
});

class ChipsArray extends React.Component {
  handleClick = category => {
    
    if (this.props.selectedCategory !== category) {
      this.props.updateCompSet(category);
    } 

    this.setState({ 
      selectedChip: undefined
    });
  };

  render() {
    const { classes, categories, handleDelete } = this.props;

    return (
      <CardActions className={classes.root}>
        <Typography type="subheading" color="textSecondary">Industry Sectors</Typography>
        <Paper className={classes.paper}>
          {Object.keys(categories).map(category => {
            return (
              <Chip key={category} onClick={() => this.handleClick(category)} label={category.toProperCase()} className={this.props.selectedCategory === category ? classes.selectedChip : classes.chip} />
            );
          })}
        </Paper>
      </CardActions>
    );
  }
}

ChipsArray.propTypes = {
  classes: PropTypes.object.isRequired,
  categories: PropTypes.object.isRequired,
  updateCompSet: PropTypes.func.isRequired
};

export default withStyles(styles)(ChipsArray);