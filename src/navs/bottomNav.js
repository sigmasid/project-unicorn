import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

import { Link } from 'react-router-dom';

const styles = theme => ({
  root: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  }
});

class LabelBottomNavigation extends React.Component {
  constructor (props) {
    super(props);

    this.state = { 
      value: '',
      emailCapture: true
    }
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <BottomNavigation value={value} onChange={this.handleChange} className={classes.root} showLabels>
        <BottomNavigationAction component={Link} to={'/methodology'} label="Methodology" value="methodology" />
        <BottomNavigationAction component={Link} to={'/terms'} label="Terms" value="terms" />
        <BottomNavigationAction component={Link} to={'/contact'} label="Contact" value="contact" />
        <BottomNavigationAction label="Signup" value="signup" onClick={() => this.props.handleEmailToggle(true)} />
      </BottomNavigation>
    );
  }
}

LabelBottomNavigation.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(LabelBottomNavigation);