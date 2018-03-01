import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import BottomNavigation, { BottomNavigationAction } from 'material-ui/BottomNavigation';
import { Link } from 'react-router-dom';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import DoneIcon from 'material-ui-icons/Done';
import CloseIcon from 'material-ui-icons/Close';
import ThumbsUpIcon from 'material-ui-icons/ThumbUp';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import IconButton from 'material-ui/IconButton';
import * as firebase from "firebase";
import firestore from "firebase/firestore";
import { CircularProgress } from 'material-ui/Progress';


const styles = theme => ({
  root: {
    width: 500,
  },
  emailSignup: {
    display: 'flex',
    height: 70,
    [theme.breakpoints.down('md')]: {
      padding: 10
    }
  },
  emailCloseButton: {
    padding: 10,
    [theme.breakpoints.down('md')]: {
      minWidth: 50
    }
  },
  emailSignupText: {
    alignSelf: 'center',
    marginBottom: 0,
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  formControl: {
    alignSelf: 'center',
    minWidth: 400,
    marginLeft: 'auto',
    paddingRight: 50,
    fontSize: '0.9rem',
    [theme.breakpoints.down('md')]: {
      minWidth: '70%',
    }
  },
  emailWrapper: {
    bottom: 0,
    position: 'fixed',
    width: '100%',
    background: '#fafafa',
    zIndex: 10000
  },
  signupButton: {
    background: 'black',
    color: 'white',
    width: 30,
    height: 30
  },
  buttonIcon: {
    width: '0.75rem',
    height: '0.75rem'
  },
  endAdornment: {
    marginBottom: 10
  },
  emailHelperText: {
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  }
});

class LabelBottomNavigation extends React.Component {
  constructor (props) {
    super(props);

    this.state = { 
      value: 'recents',
      emailCapture: true
    }

    this.handleEmailSignup = this.handleEmailSignup.bind(this);
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleEmailChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  handleEmailSignup = () => {
    var db = firebase.firestore();
    var emailRef = db.collection('signups');
    var self = this;

    this.setState({ loading: true })

    return emailRef.add({
      email: this.state.email
    })
    .then(function() {
        self.setState(
          { 
            success: true, 
            loading: false
          },
          () => {
            self.timer = setTimeout(() => {
              self.setState({
                loading: false,
                emailCapture: false,
                success: undefined
              });
            }, 2000);
          },
        )
    })
    .catch(function(error) {
        // The document probably doesn't exist.
        //self.setState({ emailCapture: false, loading: false });
        console.error("Error updating document: ", error);
    });
  }

  timer = undefined;

  toggleEmailCapture = (value) => {
    this.setState({ emailCapture: value });
  }

  emailSignup = (classes) => {
    return(
      <Paper className={classes.emailSignup} >
        <Button className={classes.emailCloseButton} onClick={() => this.toggleEmailCapture(false)}>
          <CloseIcon />
        </Button>
        <Typography variant="subheading" gutterBottom className={classes.emailSignupText}>
          { this.state.success ? "Success! Thanks for signing up!" : "There's a lot more coming. Stay in touch!" }
        </Typography>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="email">Email</InputLabel>
          <Input
            id="adornment-password"
            type={'text'}
            value={this.state.emailAddress}
            onChange={this.handleEmailChange('email')}
            endAdornment={
              <InputAdornment position="end" classes={{
                root: classes.endAdornment
              }} >
                <IconButton onClick={ () => this.handleEmailSignup() } className={classes.signupButton} >
                  {this.state.loading ? <CircularProgress size={25} className={classes.fabProgress} color={'white'} /> : (this.state.success ? <ThumbsUpIcon className={classes.buttonIcon} /> : <DoneIcon className={classes.buttonIcon} />) }
                </IconButton>
              </InputAdornment>
            }
          />
          <FormHelperText className={classes.emailHelperText}>Stay in the know!</FormHelperText>
        </FormControl>
      </Paper>

    );
  }

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div>
        <div className={classes.emailWrapper}> { this.state.emailCapture && this.emailSignup(classes) }</div>
        <BottomNavigation value={value} onChange={this.handleChange} className={classes.root} showLabels>
          <BottomNavigationAction component={Link} to={'/methodology'} label="Methodology" value="methodology" />
          <BottomNavigationAction label="Terms" value="terms" />
          <BottomNavigationAction component={Link} to={'/contact'} label="Contact" value="contact" />
          <BottomNavigationAction label="Signup" value="signup" onClick={() => this.toggleEmailCapture(true)} />
        </BottomNavigation>
      </div>
    );
  }
}

LabelBottomNavigation.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(LabelBottomNavigation);