import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import { colorsArray } from '../shared/sharedFunctions.js';
import CloseIcon from '@material-ui/icons/Cancel';
import IconButton from '@material-ui/core/IconButton';
import ErrorMessage from '../shared/message.js';

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
  state = {
    error: undefined
  }

  handleDelete = data => () => {
    if (data === this.props.chipData[0]) {
      this.setState({ error: 'Sorry! Cannot delete the original ticker'});
    } else {
      this.props.deleteComp(data);
    }
  };

  handleClose = () => {
    this.setState({error: undefined});
  }

  render() {
    const { classes, chipData } = this.props;
    var deleteIcon = <IconButton className={classes.closeButton}><CloseIcon /></IconButton>

    if (!chipData || chipData.length === 1) {
      return null;
    }

    return (
      <Paper className={classes.root}>
        {this.state.error && <ErrorMessage text={this.state.error} handleClose={this.handleClose} open={this.state.error && true}  anchorV='top' anchorH='center'/>}
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