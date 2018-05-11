import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import { CircularProgress } from 'material-ui/Progress';
import Snackbar from 'material-ui/Snackbar';
import * as firebase from "firebase";
import firestore from "firebase/firestore";
import ReactGA from 'react-ga';
import CheckIcon from 'material-ui-icons/Check';
import classNames from 'classnames';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 800,
    backgroundColor: theme.palette.background.paper,
    margin: '0 auto',
    marginTop: theme.spacing.unit * 3,
    [theme.breakpoints.down('md')]: {
      maxWidth: '100%',
      marginTop: 0
    }
  },
  header: {
    textAlign: 'left',
    padding: '20px 20px 0px 40px',
    boxShadow: 'none',
    [theme.breakpoints.down('md')]: {
      padding: '10px 10px 0px 20px'
    }
  },
titleText: {
    fontWeight: 800,
    color: 'black',
    marginBottom: 10
  },
  contactForm: {
    boxShadow: 'none',
    padding: 30,
    textAlign: 'center'
  },
  raisedButton: {
    color: 'white',
    marginTop: 30,
    padding: '10px 30px 10px 30px',
    backgroundColor: theme.palette.primary[300],
    boxShadow: theme.shadows[2],
    '&:active': {
      boxShadow: theme.shadows[8],
    },
    '&:hover': {
      backgroundColor: theme.palette.grey.A100,
      // Reset on mouse devices
      '@media (hover: none)': {
        backgroundColor: theme.palette.grey[300],
      }
    }
  },
  buttonProgress: {
    color: 'white',
    position: 'absolute',
    top: '50%',
    left: '10%',
    marginTop: -12,
    marginLeft: -12,
  },
  snackbar: {
    position: 'absolute',
  },
  snackbarContent: {
    width: '100%',
  },
});

class Contact extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
    	contactName: '',
    	contactEmail: '',
    	contactMessage: '',
    	contactNameValid: true,
    	contactEmailValid: true,
    	contactMessageValid: true
    }
    this.handleChange = this.handleChange.bind(this);
	}

	handleSubmit = () => {

		var isNameValid = this.state.contactName !== "";
		var isEmailValid = this.state.contactEmail !== "";
		var isMessageValid = this.state.contactMessage !== "";

		if (isNameValid && isEmailValid && isMessageValid) {
	    
	    var db = firebase.firestore();
	    var contactRef = db.collection('contact');
	    var self = this;

	    this.setState({ loading: true })

	    return contactRef.add({
	      name: this.state.contactName,
				email: this.state.contactEmail,
				message: this.state.contactMessage,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
	    })
	    .then(function() {
        ReactGA.event({
          category: 'Contact',
          action: 'Sent',
          label: 'Contact Request'
        });
	        self.setState(
	          { 
	            success: true, 
	            loading: false,
	            contactName: '',
	            contactEmail: '',
	            contactMessage: ''
	          },
	          () => {
	            self.timer = setTimeout(() => {
	              self.setState({
	                loading: false,
	                success: undefined
	              });
	            }, 2000);
	          },
	        )
	    })
	    .catch(function(error) {
        this.setState({
          loading: false,
          success: undefined
        });
	    });
	  } else {
			this.setState({
				contactNameValid: isNameValid,
				contactEmailValid: isEmailValid,
				contactMessageValid: isMessageValid
			});
		}
	}

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
      [name+'Valid']: event.target.value !== ""
    });
  };

	render() {
	  const { classes } = this.props;
	  const {contactEmail, contactName, contactMessage, contactNameValid, contactEmailValid, contactMessageValid, loading, success} = this.state;

	  return (
	    <div className={classes.root}>
        <Paper className={classes.header} >
          <Typography variant="display3" className={classes.titleText}>
            Contact
          </Typography>
          <Typography variant="caption" color={'textSecondary'} gutterBottom>
            suggestions, comments, contributions, hate mail etc.
          </Typography>
        </Paper>
        <Paper className={classes.contactForm} >       
	        <TextField
	        	error={!contactNameValid}
	          id="full-width"
	          label="Name"
	          InputLabelProps={{
	            shrink: true,
	          }}
	          placeholder="Project Unicorn"
	          fullWidth
	          margin="normal"
	          value={contactName}
	          helperText={!contactNameValid ? "enter a valid name" : null}
          	onChange={this.handleChange('contactName')}
	        />
	       <TextField
	        	error={!contactEmailValid}
	          id="full-width"
	          label="Email"
	          InputLabelProps={{
	            shrink: true,
	          }}
	          placeholder="next@unicorn.com"
	          fullWidth
	          margin="normal"
	          helperText={!contactEmailValid ? "enter a valid email" : null}
	          value={contactEmail}
          	onChange={this.handleChange('contactEmail')}
	        />
	        <TextField
	        	error={!contactMessageValid}
	          id="textarea"
	          label="Message"
	          placeholder="This service is amazing"
	          multiline
	          fullWidth
	          helperText={!contactMessageValid ? "say something first" : null}
	          className={classes.textField}
	          margin="normal"
	          value={contactMessage}
          	onChange={this.handleChange('contactMessage')}
	        />

          <Button size="large" className={classNames(classes.button, classes.raisedButton)} onClick={() => this.handleSubmit()} disabled={loading} >
		        Submit
          {loading && <CircularProgress size={24} className={classes.buttonProgress} color="inherit" />}
          {success && <CheckIcon size={24} className={classes.buttonProgress} color="inherit" />}
		      </Button>
          <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={success}
            autoHideDuration={4000}
            onClose={this.handleClose}
            SnackbarContentProps={{
              'aria-describedby': 'snackbar-fab-message-id',
              className: classes.snackbarContent,
            }}
            message={<span id="snackbar-fab-message-id">Thanks for contacting us! Talk soon.</span>}
            className={classes.snackbar}
          />
	      </Paper>    
	    </div>
	  );
	}

}

Contact.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Contact);