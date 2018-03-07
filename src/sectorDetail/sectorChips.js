import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Chip from 'material-ui/Chip';
import Paper from 'material-ui/Paper';
import { CardActions } from 'material-ui/Card';
import classNames from 'classnames';
import Avatar from 'material-ui/Avatar';

const styles = theme => ({
  root: {
    margin: '0 auto',
    height: 'auto',
    textAlign: 'center',
    display: 'block',
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
    fontSize: '1.0rem',
    borderRadius: 32,
    padding: theme.spacing.unit,
    backgroundColor: theme.palette.background.default,
    '&:hover, &:active, &:focus': {
      background: theme.palette.gradient,
      color: 'white',
      // Reset on mouse devices
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      }
    }
  },
  chipAvatar: {
    background: 'none',
    fontSize: '1.5rem'
  }
});

class ChipsArray extends React.Component {
  handleClick = category => {
    
    if (this.props.selectedCategoryName !== category) {
      this.props.updateCompSet(category);
    } 

    this.setState({ 
      selectedChip: undefined
    });
  };

  render() {
    const { classes, categories, handleDelete, selectedCategoryName } = this.props;

    return (
      <CardActions className={classes.root}>
        <Paper className={classes.paper}>
          {Object.keys(categories).map(category => {
            return (
              <Chip key={category} 
                    onClick={() => this.handleClick(category)} 
                    label={category.toProperCase()} 
                    avatar={selectedCategoryName === category ? <Avatar className={classes.chipAvatar}>{typeof categories[category].logo === 'string' ? categories[category].logo : category.charAt(0).toUpperCase()}</Avatar> : null}
                    className={selectedCategoryName === category ? classNames(classes.selectedChip, classes.chip) : classes.chip} />
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