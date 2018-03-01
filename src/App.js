import React, { Component } from 'react';
import './App.css';
import * as firebase from "firebase";
import firestore from "firebase/firestore";
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';

import Tickers from './sidebar/companyTickers.js';
import TopNav from './navs/topNav.js';
import BottomNav from './navs/bottomNav.js';
import Methodology from './static/methodology.js';
import Contact from './static/contact.js';
import CompanyDetail from './companyDetail/companyDetail.js';
import SectorDetail from './sectorDetail/sectorDetail.js';
import Home from './home/home.js';
import Loading from './shared/loading.js';

import { MuiThemeProvider, createMuiTheme } from "material-ui/styles";
import {lightBlue, orange, red} from 'material-ui/colors';
import {Helmet} from "react-helmet";

//import newCompanies from './new-cos.json';
//import foreignIndex from './foreign_public_index.json';
//import createPalette from 'material-ui/styles';
//import categoryIndex from './categories.json';

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
    width: '100%',
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    minHeight: '80vh',
    [theme.breakpoints.up('md')]: {
      padding: 24
    },
    height: 'calc(100% - 56px)',
    marginTop: 56,
    [theme.breakpoints.up('sm')]: {
      height: 'calc(100% - 64px)',
      marginTop: 64,
    },
  },
  'contentShift': {
    width: '100%'
  },
  'contentShift-right': {
    width: 'calc(100% - 300px)'
  }
});

class App extends Component {
  constructor (props) {
    super(props);

    this.state = {
      open: false
    };

    this.getUnicorns();
    //this.updatePublic();
    //this.updateCompanies();
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  updateCompanies = () => {
    /**
    var db = firebase.firestore();
    var batch = db.batch();
    
    newCompanies.forEach(function (company, i) {
      var publicRef = db.collection('public').doc(company.ticker.toLowerCase());
      let categories = {};
      var catArray = company.categories.split(', ');
      
      catArray.forEach(function (cat, i) {
        categories[cat] = true;
      });

      company.category = categories;
      delete company.categories;
      batch.set(publicRef, company); 
    });
    
    batch.commit()
    .then(function () {
      console.log("commit successful")
    }).catch(function(error) {
      console.log('error updating'+error);
    }); **/
  }

  changeTicker = (oldTickers, newTickers) => {
    //this.changeTicker(["swx:abbn"],["abb"]);
    var db = firebase.firestore();
    var docRef = db.collection("public");

    oldTickers.forEach(function(element, i) {
      docRef.doc(element).get().then(function(doc) {
        var newRef = db.collection("public").doc(newTickers[i]);
        newRef.set(doc.data());

        }).catch(function(error) {
          console.log("Error getting document:", error);
        });
      });
  }

  updatePublic = () => {
    /**
    var db = firebase.firestore();
    var batch = db.batch();
    //var privateIndexRef = db.collection('indices').doc('categories').set(categoryIndex);

    publics.forEach(function (company, i) {
      var publicRef = db.collection('public').doc(company.ticker.toLowerCase());
      //let categories = {};
      //var catArray = unicorn.categories.split(', ');
      
      //catArray.forEach(function (cat, i) {
      //  categories[cat] = true;
      //});

      //unicorn.category = categories;
      //delete unicorn.categories;
      batch.set(publicRef, company); 
    });
    
    batch.commit()
    .then(function () {
      console.log("commit successful")
    }).catch(function(error) {
      console.log('error updating'+error);
    }); **/
  }

  setFeatured = (tickers) => {
    this.setState({
      featuredTickers: tickers
    })
  }

  getUnicorns = () => {
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

  render() {
    const { open } = this.state;
    const { classes } = this.props;

    return (
      <Router>
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
              <main
                className={classNames(classes.content, classes[`content-right`], {
                  [classes.contentShift]: open,
                  [classes[`contentShift-right`]]: open,
                })}
              >
                <Switch>
                  <Route exact path="/" render={(props) => (this.state.featuredTickers !== undefined ? <Home setFeatured={this.setFeatured} featuredTickers={this.state.featuredTickers} /> : <Loading /> )} />
                  <Route exact path="/methodology" component={Methodology}/>
                  <Route exact path="/contact" component={Contact}/>                  
                  <Route path="/c/:cid" component={CompanyDetail} />
                  <Route path="/s/:sectorid" component={SectorDetail} />
                </Switch>
              </main>
              <Tickers open={this.state.open} handleDrawerClose={this.handleDrawerClose} tickers={this.state.featuredTickers || undefined } />
            </div>
            <BottomNav />
          </div>
        </MuiThemeProvider>
      </Router>
    );
  }
}

export default withStyles(styles)(App);