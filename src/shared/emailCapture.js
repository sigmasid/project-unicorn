import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import * as firebase from "firebase";
import firestore from "firebase/firestore";

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import ThumbsUpIcon from '@material-ui/icons/ThumbUp';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';

import Cookies from 'universal-cookie';

const styles = theme => ({
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
    whiteSpace: 'pre-wrap',
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

class EmailSignup extends React.Component {
  constructor (props) {
    super(props);
    const cookies = new Cookies();
    this.state = { 
      emailCapture: this.props.showCapture,
      message: cookies.get('newUser') !== 'true' ? "Welcome to Project Unicorn! Browse the leaderboard or explore a sector to see detailed valuations.\nAnd there's a lot more coming. Stay in touch!" : "There's a lot more coming. Stay in touch!"
    }
    //cookie values are string

    this.handleEmailSignup = this.handleEmailSignup.bind(this);
    this.handleEmailSignup = this.handleEmailSignup.bind(this);
  }

  handleEmailChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  toggleEmailCapture = (value) => {
    this.setState({ emailCapture: value });
  }

  handleEmailSignup = () => {
    var db = firebase.firestore();
    var emailRef = db.collection('signups');
    var self = this;

    this.setState({ loading: true })

    return emailRef.add({
      email: this.state.email,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
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
              self.props.handleEmailToggle(false);
            }, 2000);
          },
        )
        const cookies = new Cookies();
        cookies.set('showEmailCapture', false, { path: '/' });
    })
    .catch( error => {
        // The document probably doesn't exist.
        self.setState({ emailCapture: false, loading: false, error: error });
    });
  }

  timer = undefined;

  emailSignup = (classes, handleEmailToggle, message) => {

    return(
      <Paper className={classes.emailSignup} >
        <Button className={classes.emailCloseButton} onClick={() => handleEmailToggle(false)}>
          <CloseIcon />
        </Button>
        <Typography variant="subheading" gutterBottom className={classes.emailSignupText}>
          { this.state.success ? "Success! Thanks for signing up!" : message }
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

    return (
      <div className={classes.emailWrapper}> { this.props.showCapture && this.emailSignup(classes, this.props.handleEmailToggle, this.state.message) }</div>
    );
  }
}

export default withStyles(styles)(EmailSignup);