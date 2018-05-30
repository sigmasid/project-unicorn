import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import classNames from 'classnames';

const styles = {
  row: {
    display: 'flex',
    justifyContent: 'center',
  },
  smallAvatar: {
    width: 30,
    height: 30,
  },
};

function CompanyIcon(props) {
  const { classes } = props;
  return (
    <div className={classes.row}>
      <Avatar alt="Remy Sharp" src={props.src} className={classNames(classes.avatar, classes.smallAvatar)} />
    </div>
  );
}

CompanyIcon.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CompanyIcon);