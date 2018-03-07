import React, { Component } from 'react';
import './App.css';
import * as firebase from "firebase";
import firestore from "firebase/firestore";
import ReactGA from 'react-ga';

import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';

import Sidebar from './sidebar/sidebar.js';
import TopNav from './navs/topNav.js';
import BottomNav from './navs/bottomNav.js';
import Methodology from './static/methodology.js';
import Contact from './static/contact.js';
import CompanyDetail from './companyDetail/companyDetail.js';
import SectorDetail from './sectorDetail/sectorDetail.js';
import Home from './home/home.js';
import Explore from './home/explore.js';
import ScrollToTop from './shared/scrollToTop.js';
import EmailSignup from './shared/emailCapture.js';

import { MuiThemeProvider, createMuiTheme } from "material-ui/styles";
import {lightBlue, red} from 'material-ui/colors';
import {Helmet} from "react-helmet";

import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'

const util = require('util'); //print an object

var config = {
  apiKey: "AIzaSyDqlpzydxlQyqhjWG5x4VWk8vK1Br4669Q",
  authDomain: "project-unicorn-24dcc.firebaseapp.com",
  databaseURL: "https://project-unicorn-24dcc.firebaseio.com",
  projectId: "project-unicorn-24dcc",
  storageBucket: "project-unicorn-24dcc.appspot.com",
  messagingSenderId: "13608224150"
};
firebase.initializeApp(config);

ReactGA.initialize('UA-115273593-1');

const muiTheme = createMuiTheme({
  palette: {
    primary: lightBlue,
    accent: lightBlue[500],
    error: red,
    gradient: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    type: 'light'
  }
})

String.prototype.toProperCase = function(opt_lowerCaseTheRest) {
  return (opt_lowerCaseTheRest ? this.toLowerCase() : this)
    .replace(/(^|[\s\xA0])[^\s\xA0]/g, function(s){ return s.toUpperCase(); });
};

const styles = theme => ({
  root: {
    width: '100%',
    zIndex: 1,
    overflow: 'hidden',
  },
  appFrame: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%',
  },
  content: {
    backgroundColor: theme.palette.background.default,
    minHeight: 'calc(100vh - 120px)',
    marginTop: 56,
    [theme.breakpoints.up('md')]: {
      width: 'calc(100% - 56px)',
      marginTop: 64,
      padding: 24
    },
    [theme.breakpoints.down('md')]: {
      width: '100%',
      marginTop: 64,
    }    
  },
  'contentShift': {
    width: '100%'
  },
  'contentShift-right': {
    width: 'calc(100% - 300px)'
  }
});

const AnalyticsTracker = () => {
  return <Route component={Analytics} />
}

class Analytics extends React.Component<RouteComponentProps<any>> {
  componentDidMount() {
    this.sendPageChange(this.props.location.pathname, this.props.location.search)
  }

  componentDidUpdate(prevProps: RouteComponentProps<any>) {
    if (this.props.location.pathname !== prevProps.location.pathname
      || this.props.location.search !== prevProps.location.search) {
      this.sendPageChange(this.props.location.pathname, this.props.location.search)
    }
  }

  sendPageChange(pathname: string, search: string = "") {
    const page = pathname + search
    ReactGA.set({page});
    ReactGA.pageview(page);
  }

  render() {
    return null
  }
}

class App extends Component {
  constructor (props) {
    super(props);

    this.state = {
      open: false,
      showCapture: true
    };

    this.handleEmailToggle = this.handleEmailToggle.bind(this);
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  setFeatured = (tickers) => {
    this.setState({
      featuredTickers: tickers
    })
  }

  getUnicorns = () => {
    if (this.state.featuredTickers) {
      return;
    }

    var db = firebase.firestore();
    var unicornsRef = db.collection('private').orderBy('lastValuation', 'desc').limit(10);

    return unicornsRef.get()
    .then(snapshot => {
        var unicorns = [];
        snapshot.forEach(doc => {
          unicorns.push(doc.data());
        });
        this.setState({ 
          featuredTickers: unicorns
        });
    })
    .catch(err => {
      this.setState({ 
        featuredTickers: undefined
      });
    });
  }

  handleEmailToggle = (toggle) => {
    this.setState({
      showCapture: toggle
    })
  }

  render() {
    const { open, featuredTickers } = this.state;
    const { classes } = this.props;

    return (
    <Router>
      <ScrollToTop>
        <MuiThemeProvider theme={muiTheme}> 
          <div className={classes.root}>
            <Helmet
              defaultTitle="Project Unicorn"
              titleTemplate="%s | Project Unicorn"
            >
              <meta name="description" content="Private Technology Startup Valuations & Public Market Valuation and Operating Statistics" />          
            </Helmet>
            <div className={classes.appFrame}>
              <TopNav title="" hidden={this.state.open} handleDrawerOpen={this.handleDrawerOpen} open={this.state.open} dataSource={this.state.searchResults} />
              <Sidebar open={this.state.open} handleDrawerClose={this.handleDrawerClose} tickers={featuredTickers || undefined } handleEmailToggle={this.handleEmailToggle} loadTrending={this.getUnicorns} />
              <main
                className={classNames(classes.content, classes[`content-right`], {
                  [classes.contentShift]: open,
                  [classes[`contentShift-right`]]: open,
                })}
              >
                <AnalyticsTracker />
                <Switch>
                  <Route exact path="/" render={(props) => (<Home setFeatured={this.setFeatured} featuredTickers={featuredTickers} />)} />
                  <Route exact path="/methodology" component={Methodology}/>
                  <Route exact path="/explore" component={Explore}/>                  
                  <Route exact path="/contact" component={Contact}/>                  
                  <Route path="/c/:cid" component={CompanyDetail} />
                  <Route path="/s/:sectorid" component={SectorDetail} />
                </Switch>
              </main>
            </div>
            <EmailSignup showCapture={this.state.showCapture} handleEmailToggle={this.handleEmailToggle} />
            <BottomNav handleEmailToggle={this.handleEmailToggle} />
          </div>
        </MuiThemeProvider>
      </ScrollToTop>
    </Router>
    );
  }
}

export default withStyles(styles)(App);