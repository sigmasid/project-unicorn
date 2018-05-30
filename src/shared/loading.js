import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const styles = theme => ({
  progressWrapper: {
    minHeight: 300,
    display: 'flex',
    margin: '0 auto'
  },
  progress: {
    margin: '0 auto',
    alignSelf: 'center'
  }
});

function Loading(props) {
  const { classes } = props;
	return(
			<div className={classes.progressWrapper}>
				<CircularProgress className={classes.progress} size={50} />
			</div>
	);
}

Loading.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Loading);