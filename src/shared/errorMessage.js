import React from 'react'
import ErrorIcon from 'material-ui-icons/Error';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';

const styles = theme => ({
  root: {
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center'
  },
  errorWrapper: {
    margin: '0 auto',
    textAlign: 'center'    
  },
  error: {
    width: 100,
    height: 100,
    margin: '0 auto',
    alignSelf: 'center',
    color: theme.palette.accent,
    paddingBottom: 20
  }
});

function ErrorMessage(props) {
  const { classes, message } = props;
	return(
			<div className={classes.root}>
        <div className={classes.errorWrapper}>
  				<ErrorIcon className={classes.error} />
          <Typography variant="subheading" align="center" gutterBottom>
            { message || "Sorry there was an error" }
          </Typography>
        </div>
			</div>
	);
}

ErrorMessage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ErrorMessage);