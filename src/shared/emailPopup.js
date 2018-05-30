import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import * as firebase from "firebase";
import firestore from "firebase/firestore";
import Cookies from 'universal-cookie';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
  wrapper: {
    margin: theme.spacing.unit,
    position: 'relative',
  },
  buttonProgress: {
    color: theme.palette.primary.main,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
});

class EmailPopup extends React.Component {
  state = {
    open: this.props.open,
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.open !== prevProps.open) {
      this.setState({ open: this.props.open });
    }
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  handleEmailChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  handleSubmit = () => {
    var db = firebase.firestore();
    var emailRef = db.collection('signups');
    var self = this;

    if (!this.state.email) {
      this.setState({ error: true });
      return;
    } else {
      this.setState({ error:undefined, loading: true })
    }
    

    return emailRef.add({
      email: this.state.email,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
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
                open: false,
                success: undefined
              });
            }, 2000);
          },
        )
        const cookies = new Cookies();
        cookies.set('showEmailCapture', false, { path: '/' });
    })
    .catch( error => {
        // The document probably doesn't exist.
        self.setState({ error: error, loading: false });
    });
  }

  render() {
    const { classes } = this.props;
    const { loading, success } = this.state;

    var titleMessage = !success ? "Let's Stay in Touch?" : "Welcome Aboard!";
    var subtitleMessage = !success ? "We are building the definitive resource for tech stocks and startups. Join the list for latest releases & updates!" : "We will keep you posted on new releases & updates!";

    return (
      <div>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">{titleMessage}</DialogTitle>
          <DialogContent>
            <DialogContentText>{subtitleMessage}</DialogContentText>
            {!success && <TextField
              autoFocus
              margin="dense"
              error={this.state.error}
              id="name"
              label="Email Address"
              type="email"
              onChange={this.handleEmailChange('email')}
              fullWidth
            />}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary" disabled={this.state.loading || false}>
              Cancel
            </Button>
            <div className={classes.wrapper}>
              <Button onClick={this.handleSubmit} color="primary" disabled={this.state.loading || this.state.success || false}>
                Subscribe
              </Button>
              {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
            </div>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(EmailPopup);