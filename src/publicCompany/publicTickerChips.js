import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Chip from 'material-ui/Chip';
import Paper from 'material-ui/Paper';
import { colorsArray } from '../shared/sharedFunctions.js';
import CloseIcon from 'material-ui-icons/Cancel';
import IconButton from 'material-ui/IconButton';

const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    padding: 20,
  },
  chip: {
    margin: theme.spacing.unit / 2,
  },
  closeButton: {
    color: 'white',
    width: 24,
    marginRight: 5
  }
});

class TickerArray extends React.Component {
  handleDelete = data => () => {
    if (data === this.props.chipData[0]) {
      alert('sorry! cannot delete the original company');
    } else {
      this.props.deleteComp(data);
    }
  };

  render() {
    const { classes, chipData } = this.props;
    var deleteIcon = <IconButton className={classes.closeButton}><CloseIcon /></IconButton>

    if (!chipData) {
      return null;
    }

    return (
      <Paper className={classes.root}>
        {chipData.map((data, index) => {
          return (
            <Chip
              key={data}
              label={data.toUpperCase()}
              onDelete={this.handleDelete(data)}
              style={{backgroundColor: colorsArray[index], color: 'white'}}
              deleteIcon={deleteIcon}
              className={classes.chip}
            />
          );
        })}
      </Paper>
    );
  }
}

TickerArray.propTypes = {
  classes: PropTypes.object.isRequired,
  deleteComp: PropTypes.func.isRequired
};

export default withStyles(styles)(TickerArray);