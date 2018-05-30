import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const styles = theme => ({
  close: {
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4,
  },
});

class Message extends React.Component {
  render() {
    const { classes, open, handleClose, text, anchorH, anchorV } = this.props;
    return (
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: anchorV,
            horizontal: anchorH,
          }}
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          SnackbarContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{text}</span>}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.close}
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </div>
    );
  }
}

Message.defaultProps = {
  anchorH: 'center',
  anchorV: 'bottom'
};

Message.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  anchorV: PropTypes.string,
  anchorH: PropTypes.string
};

export default withStyles(styles)(Message);