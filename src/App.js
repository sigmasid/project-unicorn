import React, { Component } from 'react';
import './App.css';
import * as firebase from "firebase";
import firestore from "firebase/firestore";
import ReactGA from 'react-ga';
import { withStyles } from 'material-ui/styles';

import TopNav from './navs/topNav.js';
import BottomNav from './navs/bottomNav.js';
import Sidebar from './sidebar/sidebar.js';

import Methodology from './static/methodology.js';
import Terms from './static/terms.js';
import Contact from './static/contact.js';

import Stocks from './home/stocks.js';
import Startups from './home/startups.js';
import Sectors from './home/sectors.js';
import Markets from './home/markets.js';

import SectorDetail from './sectorDetail/sectorDetail.js';
import PublicCompanyDetail from './publicCompany/publicCompanyDetail.js';
import CompanyDetail from './companyDetail/companyDetail.js';

import ScrollToTop from './shared/scrollToTop.js';
import EmailSignup from './shared/emailCapture.js';
import EmailPopup from './shared/emailPopup.js';
import AllUnicorns from './allUnicorns.js';

import { MuiThemeProvider, createMuiTheme } from "material-ui/styles";
import {lightBlue, red} from 'material-ui/colors';
import {Helmet} from "react-helmet";
import Cookies from 'universal-cookie';
import io from 'socket.io-client';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom'

const util = require('util'); //print an object
var myImage = require("./images/project-unicorn-social.jpg");
var pickBy = require('lodash.pickby');
//const url = 'https://ws-api.iextrading.com/1.0/last';
//const socket = io(url);

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
    type: 'light',
    light: '#9E9E9E'
  },
  overrides: {
    MuiTypography: {
      headline: {
        fontWeight: 300
      },
      subheading: {
        fontWeight: 300
      }
    },
  },
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
    marginTop: 64,
    paddingBottom: 64,
    flexGrow: 1,
    width: '100%',
  },
  closeButton: {
    color: 'white'
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

    const cookies = new Cookies();
    this.state = {
      open: false,
      showCapture: cookies.get('showEmailCapture') === undefined ? true : false,
      newUser: cookies.get('newUser'),
    };

    if (!cookies.get('newUser')) {
      cookies.set('newUser', false, { path: '/' });
    }

    this.handleEmailToggle = this.handleEmailToggle.bind(this);
    this.getIndex = this.getIndex.bind(this);
  }

  componentWillUnmount() {
    //socket.disconnect();
  }

  getIndex = () => {
    var db = firebase.firestore();
    var docRef = db.collection("indices").doc("tickers");

    return new Promise(function(resolve, reject) {
      docRef.get().then( doc =>  {
      if (doc.exists) {
        resolve(doc.data());
      }
      }).catch(function(error) {
        reject(error);
      });
    })
  }

  getSuggestions = (value) => {
    var { index, fetchingIndex } = this.state;
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    var self = this;

    if (inputLength === 0) {
      return {};
    } 

    if (!index && !fetchingIndex) {
      this.setState({ fetchingIndex: true });
      this.getIndex().then(function(index) {
        self.setState({index: index, fetchingIndex: false});
        return self.handleGetSuggestions(value, index)
      });
      return {"loading": {"name": "Searching..."}};
    } else if (!fetchingIndex) {
      return self.handleGetSuggestions(value, index)
    } else {
      return {"loading": {"name": "Searching..."}};
    }
  };

  handleGetSuggestions = (value, index) => {
    var limit = 5;
    var count = 0;
    const inputValue = value.trim().toLowerCase();

    return pickBy(index, function(obj) {
      const keep = count < limit && obj.name.toLowerCase().startsWith(inputValue);
      if (keep) {
        count += 1;
      }

      return keep; 
    });
  }

  handlePopupToggle = (toggle) => {
    this.setState({
      showPopup: toggle
    })
  }

  handleEmailToggle = (toggle) => {
    this.setState({
      showCapture: toggle
    })
  }

  getStartupIndex = (index) => {
    return pickBy(index, function(obj) {
     return obj.type === 'private'; 
    });
  }

  render() {
    const { newUser } = this.state;
    const { classes } = this.props;

    return (
    <Router>
      <ScrollToTop>
        <MuiThemeProvider theme={muiTheme}> 
          <div className={classes.root}>
            <Helmet defaultTitle="Project Unicorn" titleTemplate="%s | Project Unicorn">
              <meta name="description" content="Private Startup and Unicorn Valuations for Uber, Airbnb, Lyft, Palantir, WeWork, Spotify, Dropbox and Others. Explore Technology Sector Valuations and Operating Statistics for Internet, SaaS, Software, Hardware, eCommerce, Media, Financials, Advertising, Real Estate, Industrials and More!" />
              <meta property="og:type" content="website" />
              <meta property="og:image" content="https://firebasestorage.googleapis.com/v0/b/project-unicorn-24dcc.appspot.com/o/logos%2Fproject-unicorn-social.jpg?alt=media&token=9410d95d-8f5f-4838-9fc7-49f4c8f585b6"/>
              <meta property="og:url" content="http://projectunicorn.co"/>
              <meta property="og:description" content="Private Startup and Unicorn Valuations for Uber, Airbnb, Lyft, Palantir, WeWork, Spotify, Dropbox and Others. Explore Technology Sector Valuations and Operating Statistics for Internet, SaaS, Software, Hardware, eCommerce, Media, Financials, Advertising, Real Estate, Industrials and More!"/>
            </Helmet>
            <div className={classes.appFrame}>
              <TopNav title="" dataSource={this.state.searchResults} getSuggestions={this.getSuggestions} />
              <Route key={'sidebar'} component={Sidebar} path={'/:active'} />
              
              {/*() => <Sidebar open={this.state.open} handleDrawerClose={this.handleDrawerClose} tickers={featuredTickers || undefined } handleEmailToggle={this.handleEmailToggle} loadTrending={this.getUnicorns} />*/}
              <main className={classes.content}>
                <AnalyticsTracker />
                <EmailPopup open={newUser === undefined ? true : false} />
                <Switch>
                  <Redirect exact from='/' to='/trending' />
                  <Route exact path="/methodology" component={Methodology}/>

                  <Route exact path="/startups" component={Startups}/>                   
                  <Route exact path="/startups/all" render={(props) => (<AllUnicorns unicornList={this.getStartupIndex()} getSuggestions={this.getSuggestions} /> )} />                  
                  <Route path="/startups/:cid" component={CompanyDetail} />
                  
                  <Route exact path="/sectors" component={Sectors}/>
                  <Route path="/sectors/:sectorid" component={SectorDetail} />                                 
                  
                  <Route exact path="/trending" component={Stocks} />                                                   
                  <Route path="/stocks/:ticker" render={(props) => (<PublicCompanyDetail {...props} getSuggestions={this.getSuggestions} />)} /> 
                  {/** <Route path="/stocks/:ticker" render={(props) => (<PublicCompanyDetail {...props} socket={socket} getSuggestions={this.getSuggestions} />)} /> **/}

                  <Route exact path="/markets" component={Markets}/>                  
                  <Route exact path="/contact" component={Contact}/>       
                  <Route exact path="/terms" component={Terms}/>   
                  {/* <Route
                      exact
                      path="/stocks/:ticker"
                      render={({ match }) => { return <Redirect to={`/stocks/${match.params.ticker}/summary`} />;}}
                  /> */}
                </Switch>
              </main>
            </div>
            <EmailSignup showCapture={this.state.showCapture} handleEmailToggle={this.handleEmailToggle} newUser={newUser} />
            <BottomNav handleEmailToggle={this.handleEmailToggle} />
          </div>
        </MuiThemeProvider>
      </ScrollToTop>
    </Router>
    );
  }
}

export default withStyles(styles)(App);