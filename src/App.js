import React, { Component } from 'react';
import './App.css';
import * as firebase from "firebase";
import ReactGA from 'react-ga';
import { withStyles } from '@material-ui/core/styles';

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
import News from './home/news.js';

import SectorDetail from './sectorDetail/sectorDetail.js';
import PublicCompanyDetail from './publicCompany/publicCompanyDetail.js';
import StartupDetail from './companyDetail/companyDetail.js';

import ScrollToTop from './shared/scrollToTop.js';
import EmailSignup from './shared/emailCapture.js';
import EmailPopup from './shared/emailPopup.js';
import AllUnicorns from './allUnicorns.js';

import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import {lightBlue, red} from '@material-ui/core/colors';
import {Helmet} from "react-helmet";
import Cookies from 'universal-cookie';
import io from 'socket.io-client';
import createHistory from "history/createBrowserHistory"

//import allTickers from './allTickers.json';

import {
  Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'

//const util = require('util'); //print an object
var config = {
  apiKey: "AIzaSyDqlpzydxlQyqhjWG5x4VWk8vK1Br4669Q",
  authDomain: "project-unicorn-24dcc.firebaseapp.com",
  databaseURL: "https://project-unicorn-24dcc.firebaseio.com",
  projectId: "project-unicorn-24dcc",
  storageBucket: "project-unicorn-24dcc.appspot.com",
  messagingSenderId: "13608224150"
};
firebase.initializeApp(config);
const firestore = firebase.firestore();
const settings = {timestampsInSnapshots: true};
firestore.settings(settings);

var myImage = require("./images/project-unicorn-social.jpg");
var pickBy = require('lodash.pickby');
const url = 'https://ws-api.iextrading.com/1.0/last';
const socket = io(url);

ReactGA.initialize('UA-115273593-1');

const history = createHistory();

const muiTheme = createMuiTheme({
  palette: {
    primary: {
      light: '#b3e5fc',
      main: lightBlue[500],
      dark: '#0277bd',
      contrastText: '#fff',
    },
    secondary: {
      light: '#eceff1',
      main: '#90a4ae',
      dark: '#0277bd',
      contrastText: '#fff',      
    },
    error: red,
    gradient: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
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
      initialHistoryLength: history.length
    };

    if (!cookies.get('newUser')) {
      cookies.set('newUser', false, { path: '/' });
    }

    this.handleEmailToggle = this.handleEmailToggle.bind(this);
    this.getIndex = this.getIndex.bind(this);
    this.getDoc = this.getDoc.bind(this);
    this.getQuery = this.getQuery.bind(this);

    //this.updateIndex();

  }

  componentWillUnmount() {
    socket.disconnect();
  }

  componentDidMount() {
    history.listen((location, action) => {
      this.setState({ currentHistoryLength: history.length});
    });
  }

  /**
  updateIndex() {
    var updateObj = {};
    allTickers.map(tickerObj => {
      var ticker = tickerObj.symbol.toLowerCase();
      delete tickerObj.symbol;
      updateObj[ticker] = tickerObj;
      return null;
    });

    var docRef = db.collection("indices").doc("tickers").set(updateObj, { merge: true })
    .then(function() {
        console.log("Document successfully written!");
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });
    //docRef.set({ updateObj });
    //console.log('all tickers is '+util.inspect(updateObj));
  } **/

  getDoc(collection, doc) {
    var docRef = firestore.collection(collection).doc(doc);

    return new Promise((resolve, reject) => {
      docRef.get().then( doc =>  {
        if (doc.exists) {
          resolve(doc.data());
        } else {
          reject();        
        }
      }).catch(function(error) {
        reject(error);
      });
    });
  }

  getQuery(collection, left, comparison, right) {
    var snapRef = firestore.collection(collection).where(left, comparison, right);

    return new Promise((resolve, reject) => {
      snapRef.get().then( snapshot =>  {
        resolve(snapshot);
      }).catch( error => {
        reject(error);
      });
    });
  }

  getIndex = () => {
    return new Promise((resolve, reject) => {
      this.getDoc('indices', 'tickers')
      .then( doc =>  {
        resolve(doc);
      }).catch( error => {
        reject(error);
      });
    })
  }

  getSuggestions = (value) => {
    var { index, fetchingIndex } = this.state;
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    var self = this;

    return new Promise((resolve, reject) => {
      if (inputLength === 0) {
        resolve({})
      } else if (!index && !fetchingIndex) {
        this.setState({ fetchingIndex: true });
        this.getIndex()
        .then(index => {
          self.setState({index: index, fetchingIndex: false});
          resolve(self.handleGetSuggestions(value, index));
        })
        .catch(err => {
          reject(err);
        });
        //resolve({"loading": {"name": "Searching..."}});
      } else if (index && !fetchingIndex) {
        resolve(self.handleGetSuggestions(value, index));
      } else {
        return {"loading": {"name": "Searching..."}};
        //resolve(self.getSuggestions(value));
      }
    })
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

  filterStartupIndex = () => {
    var self = this;
    var {index} = this.state;

    if (!index) {
      this.setState({ fetchingIndex: true });
      this.getIndex()
      .then(index => {
        self.setState({ index: index, 
                        fetchingIndex: false, 
                        startupIndex: pickBy(index, obj => { return obj.type === 'private' })
                      });        
      });
    } else {
      self.setState({ startupIndex: pickBy(index, obj => { return obj.type === 'private' })});
    }
  }

  setSectors = (sectors) => {
    this.setState({sectors: sectors})
  }

  setActive = (active) => {
    this.setState({active: active, menuItems: this.getSubItems(active) });
  }

  getSubItems = (active) => {
    var { sectors } = this.state;

    switch (active) {
      case 'sectors': return sectors;
      default: return {};
    }
    //return active items - switch for which one
  }

  getTechSectors = () => {
    var {techSectors} = this.state;
    
    if (!techSectors) {

      this.getDoc('categories', 'technology')
      .then(doc => {
          var obj = doc.type;
          var sorted = Object.keys(obj).sort((a, b) => { return obj[a].rank - obj[b].rank  });
          this.setState({ techSectors: sorted });
      })
      .catch(err => {
        this.setState({ techSectors: undefined });
      });
    }
  }

  getSectors = () => {
    var {sectors} = this.state;
    
    if (!sectors) {  
      this.getDoc('indices', 'sectors')
      .then(obj => {
          var sorted = Object.keys(obj).sort((a, b) => { return obj[a].rank - obj[b].rank  });
          this.setState({ sectors: sorted, sectorsObj: obj });
      })
      .catch(err => {
        this.setState({ sectors: undefined, sectorsObj: undefined });
      });
    }
  }

  render() {
    const { newUser, initialHistoryLength, currentHistoryLength } = this.state;
    const { classes } = this.props;

    return (
    <Router history={history}>
      <ScrollToTop>
        <MuiThemeProvider theme={muiTheme}> 
          <div className={classes.root}>
            <Helmet titleTemplate="%s | pu" defaultTitle="Project Unicorn">
              <meta name="description" content="Private Startup and Unicorn Valuations for Uber, Airbnb, Lyft, Palantir, WeWork, Spotify, Dropbox and Others. Explore Technology Sector Valuations and Operating Statistics for Internet, SaaS, Software, Hardware, eCommerce, Media, Financials, Advertising, Real Estate, Industrials and More!" />
              <meta property="og:type" content="website" />
              <meta property="og:image" content="https://firebasestorage.googleapis.com/v0/b/project-unicorn-24dcc.appspot.com/o/logos%2Fproject-unicorn-social.jpg?alt=media&token=9410d95d-8f5f-4838-9fc7-49f4c8f585b6"/>
              <meta property="og:url" content="http://projectunicorn.co"/>
              <meta property="og:description" content="Private Startup and Unicorn Valuations for Uber, Airbnb, Lyft, Palantir, WeWork, Spotify, Dropbox and Others. Explore Technology Sector Valuations and Operating Statistics for Internet, SaaS, Software, Hardware, eCommerce, Media, Financials, Advertising, Real Estate, Industrials and More!"/>
            </Helmet>
            <div className={classes.appFrame}>
              <TopNav title="" dataSource={this.state.searchResults} getSuggestions={this.getSuggestions} />
              <Route key={'sidebar'} path={'/:active'} render={(props) => (<Sidebar {...props} sectors={this.state.sectors} getSectors={() => this.getSectors()} techSectors={this.state.techSectors} getTechSectors={() => this.getTechSectors()} showEmailCapture={this.handleEmailToggle} />)} />
              
              {/*() => <Sidebar open={this.state.open} handleDrawerClose={this.handleDrawerClose} tickers={featuredTickers || undefined } handleEmailToggle={this.handleEmailToggle} loadTrending={this.getUnicorns} />*/}
              <main className={classes.content}>
                <AnalyticsTracker />
                <EmailPopup open={ !newUser && (currentHistoryLength > initialHistoryLength) } />
                <Switch>
                  <Redirect exact from='/' to='/trending' />

                  <Route exact path="/startups" component={Startups}/>                   
                  <Route exact path="/startups/all" render={ props => (<AllUnicorns getStartupIndex={() => this.filterStartupIndex()} getSuggestions={this.getSuggestions} startupIndex={this.state.startupIndex} /> )} />                  
                  <Route path="/startups/:cid" render={(props) => (<StartupDetail {...props} getDoc={this.getDoc} getQuery={this.getQuery} />)}/>
                  
                  <Route exact path="/sectors" render={(props) => (<Sectors {...props} getDoc={this.getDoc} getSectors={() => this.getSectors()} sectors={this.state.sectors} sectorsObj={this.state.sectorsObj} />)}/>
                  <Route path="/sectors/:sectorid" render={(props) => (<SectorDetail {...props} getDoc={this.getDoc} getQuery={this.getQuery}  />)} />                                 
                  
                  <Route exact path="/trending" component={Stocks} />                                                   
                  {/** <Route path="/stocks/:ticker" render={(props) => (<PublicCompanyDetail {...props} getSuggestions={this.getSuggestions} />)} /> **/}
                  <Route path="/stocks/:ticker" render={(props) => (<PublicCompanyDetail {...props} getDoc={this.getDoc} socket={socket} getSuggestions={this.getSuggestions} getQuery={this.getQuery} />)} />

                  <Route exact path="/news" render={(props) => (<News {...props} getSectors={() => this.getSectors()} sectors={this.state.sectors} sectorsObj={this.state.sectorsObj} />)}/>              
                  <Route exact path="/markets" render={(props) => (<Markets {...props} getDoc={this.getDoc} />)} />                  
                  <Route exact path="/contact" component={Contact}/>       
                  <Route exact path="/terms" component={Terms}/>  
                  <Route exact path="/methodology" component={Methodology}/>
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