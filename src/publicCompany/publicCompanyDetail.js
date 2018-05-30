import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import CompanyCard from './publicCompanyCard.js';
import StockChart from './publicStockCharts.js';
import CompanyNews from './publicCompanyNews.js';
import CompanyFinancials from './publicFinancials.js';
import CompanyComps from './publicCompanyComps.js';
import KeyStats from './publicKeyStats.js';

import ErrorMessage from '../shared/errorMessage.js';
import {Helmet} from "react-helmet";
import ReactGA from 'react-ga';
import fetch from 'node-fetch';
import { multipleYear } from '../shared/sharedFunctions.js';
import { Route, Link } from 'react-router-dom';
import Loading from '../shared/loading.js';

//const util = require('util'); //print an object
const moment = require('moment');
const quarterlyMetrics = [{name: 'totalRevenue', title: "Revenue"}, {name: 'grossProfit', title: "Gross Profit"}, {name: 'operatingIncome', title: "Operating Income"}, {name: 'netIncome', title: "Net Income"}];
const annualMetrics = [{name: 'rev', title: "Revenue"}, {name: 'ebitda', title: "EBITDA"}, {name: 'eps', title: "EPS"}];

const styles = theme => ({
  mobileNav: {
    [theme.breakpoints.up('lg')]: {
      display: 'none'
    }
  }
});

class CompanyDetails extends React.Component {
  constructor (props) {
    super(props);

    const chartDurations = ["1d","1w","1m","3m","6m","1y","2y","5y"];

    this.getCompany = this.getCompany.bind(this);
    this.changeDuration = this.changeDuration.bind(this);
    this.filterData = this.filterData.bind(this);
    this.fetchStockPriceData = this.fetchStockPriceData.bind(this);
    this.addComp = this.addComp.bind(this);
    this.getComps = this.getComps.bind(this);    
    this.deleteComp = this.deleteComp.bind(this);
    this.getCompanyDetail = this.getCompanyDetail.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getFinancials = this.getFinancials.bind(this);

    this.state = {
      selectedDuration: '1m',
      fetchedDuration: '3m', //fetched duration in weeks
      chartDurations: chartDurations,
      mobileIndex: 0
    }
  }

  componentDidMount() {
    var { socket } = this.props;

    var ticker = this.props.match.params.ticker;

    if (ticker) {
      this.getCompany(ticker); //from IEX
      this.getCompanyDetail(ticker); //from Firebase

      socket.on('connect', () => {
        socket.emit('subscribe', ticker.toLowerCase());
      });

      socket.on('message', message => {
        var obj = JSON.parse(message);
        this.setState({priceObj: obj});
      });

      socket.on('disconnect');
    }
  }

  componentWillUnmount() {
    this.props.socket.emit('unsubscribe', this.state.ticker.toLowerCase());
  }


  componentWillReceiveProps(nextProps) {
    var ticker = nextProps.match.params.ticker;

    if (ticker !== this.props.match.params.ticker) {

      this.props.socket.emit('unsubscribe', this.state.ticker.toLowerCase());

      this.props.socket.emit('subscribe', ticker.toLowerCase());

      this.getCompany(ticker);

      this.getCompanyDetail(ticker); //from Firebase
    }
  }

  getCompany(_ticker) {
    var url = 'https://api.iextrading.com/1.0/stock/market/batch?symbols='+_ticker+'&types=quote,chart,relevant,news,stats,financials,company&range=1m';
    //fetch the iex data + check if data exists from firebase
    var self = this;

    fetch(url)
    .then(res => res.json())
    .then((json) => {
      var ticker = _ticker.toUpperCase();
      var company = json[ticker];

      var prices = {};
      prices[ticker] = {};
      prices[ticker]['chart'] = company.chart;

      self.setState({company: company.quote,
                     description: company.company,
                     stats: company.stats,
                     ticker: ticker,
                     allTickers: [ticker],
                     news: company.news,      
                     stockPriceData: prices,
                     quarterlyFinancials: company.financials.financials && company.financials.financials.reverse(),
                     relevant: company.relevant,
                     stockData: self.filterData('1m', prices),
                    });
    })
    .catch(function(err) {
      self.setState({error: err});
    });
  }

  getFinancials(type, metric) {
    if (type === 'quarterly') {
      var { quarterlyFinancials } = this.state;

      if (!quarterlyFinancials) { return {} };

      var _financials = Object.keys(quarterlyFinancials).map( obj => { 
        var reportDate = moment(quarterlyFinancials[obj].reportDate);
        var label = 'CQ' + reportDate.quarter() + " " + reportDate.year();
        return { label: label, value: quarterlyFinancials[obj][metric] }
      });

      this.setState({ selectedQuarterlyFinancials: _financials });
    } else {
      var { companyDetail } = this.state;

      this.setState({ selectedAnnualFinancials: companyDetail 
        ? multipleYear.map( obj => { 
          var subscript = metric+"_"+obj.value;
          return { label: obj.label, value: companyDetail[subscript] }}) 
        : undefined})
    }
  }

  changeDuration(duration) {

    if (duration.includes('d') && this.state.dayData) {
      //if it's one day - get intraday pricing
      this.setState({
        selectedDuration: duration,
        stockData: this.state.dayData
      });
    } else if (this.hasData(duration) && !duration.includes('d')) {
      this.setState({
        selectedDuration: duration,
        stockData: this.filterData(duration)
      });        
    } else {
      //don't have data - so refetch for all tickers currently selected
      this.fetchStockPriceData(this.state.allTickers.toString(), duration, duration);
    }
  }

  hasData(newDuration) {
    const { fetchedDuration } = this.state;
    const fetchedInt = parseInt(fetchedDuration, 10);
    const newInt = parseInt(newDuration, 10);

    const fetchedWeeks = fetchedDuration.includes('y') ? fetchedInt * 52 : (fetchedDuration.includes('m') ? fetchedInt * 4.35 : fetchedInt);    
    const newWeeks = newDuration.includes('y') ? newInt * 52 : (newDuration.includes('m') ? newInt * 4.35 : newInt);

    return fetchedWeeks >= newWeeks;
  }

  fetchStockPriceData(tickers, fetchDuration, selectDuration) {
    var url = 'https://api.iextrading.com/1.0/stock/market/batch?symbols='+tickers+'&types=chart&range='+fetchDuration;
    var self = this; 

    fetch(url)
    .then(res => res.json())
    .then(json => {
      selectDuration.includes('d')
        ? self.setState({selectedDuration: selectDuration, stockData: fetchDuration !== selectDuration ? this.filterData(selectDuration, json) : json, dayData: json, allTickers: tickers.split(',')})
        : self.setState({selectedDuration: selectDuration, stockData: fetchDuration !== selectDuration ? this.filterData(selectDuration, json) : json, stockPriceData: json, fetchedDuration: fetchDuration, allTickers: tickers.split(',')});        
    })
    .catch(function(err) {
      self.setState({error: err});
    });
  }

  filterData(duration, allData) {
    var durationInt = parseInt(duration, 10);
    var data = allData || this.state.stockPriceData;
    var subtractObj = {};

    if (duration.includes('d')) {
      subtractObj['days'] = durationInt;
    } else if (duration.includes('w')) {
      subtractObj['weeks'] = durationInt;
    } else if (duration.includes('m')) {
      subtractObj['months'] = durationInt;
    } else if (duration.includes('y')) {
      subtractObj['years'] = durationInt;
    }

    var filterDate = moment().subtract(subtractObj);
    var filteredDataObject = {};

    Object.keys(data).map(ticker => {
      var currentDataSet = data[ticker].chart;
      var filteredData = currentDataSet.filter(obj => {
        return moment(obj.date) > filterDate 
      });

      filteredDataObject[ticker] = {};
      filteredDataObject[ticker]['chart'] = filteredData;
      return null;
    });

    return filteredDataObject;
  }

  addComp(ticker) {
    const {allTickers} = this.state;
    allTickers.push(ticker);
    this.fetchStockPriceData(allTickers.toString(), this.state.fetchedDuration, this.state.selectedDuration);
  }

  deleteComp(ticker) {
    const { allTickers, stockPriceData, stockData, dayData } = this.state;

    const chipToDelete = allTickers.indexOf(ticker);
    allTickers.splice(chipToDelete, 1);

    delete stockPriceData[ticker.toUpperCase()];
    delete stockData[ticker.toUpperCase()];

    if (dayData && dayData[ticker]) {
      delete dayData[ticker];
    }

    this.setState({ allTickers: allTickers, stockPriceData: stockPriceData, dayData: dayData, stockData: stockData });
  }

  getCompanyDetail(ticker) {
    //check if comp detail is available - set flag, if not then comps will be from IEX data just for PE
    //else if available can use getComps

    this.props.getDoc('public', ticker)
    .then( doc =>  {
      if (doc && doc.category) {
        var category = doc.category;
        this.setState({ companyDetail: doc, selectedCategory: Object.keys(category)[0], selectedMetric: 'rev', selectedYear: 'cy1', category: category });
      } else if (doc.exists) {
        //found ticker but no categories
        this.setState({ companyDetail: doc, selectedMetric: 'rev', selectedYear: 'ltm' });        
      } else {
        //no matching ticker in firebase
        this.setState({ companyDetail: null, selectedMetric: 'rev', selectedYear: 'ltm' });
      }
    })
    .catch( err => {
      this.setState({ companyDetail: null, selectedMetric: 'rev', selectedYear: 'ltm' });              
    });
  }

  handleChange(name, value) {
    this.setState({
      [name]: value
    });
  };

  handleChangeIndex = (event, value) => {
    this.setState({ mobileIndex: value });
  }

  getComps(category) {
    if (category) {

      this.props.getQuery('public','category.'+category, '==', true)
      .then(snapshot => {
          ReactGA.event({
            category: 'Company Detail',
            action: 'Get Comps',
            label: this.state.companyID + ' - ' + category
          });
          var compsList = [];
          snapshot.forEach(doc => {
            compsList.push(doc.data());
          });

          this.setState({ 
            compSet: compsList, 
            selectedCategory: category
          });
          return null;
      })
      .catch(err => {
        this.setState({ 
          compSet: undefined, 
          selectedCategory: undefined
        });
        return null;
      });
    } else if (this.state.relevant) {
      //no category so just get comps from IEX
      var tickers = this.state.relevant.symbols.toString();
      var url = 'https://api.iextrading.com/1.0/stock/market/batch?symbols='+tickers+'&types=stats,price';
      var self = this; 

      fetch(url)
      .then(res => res.json())
      .then(json => {
        var compSet = Object.keys(json).map(key => { 
          var data = json[key].stats;
          data.price = json[key].price;
          return data;
        });

        compSet.push(this.state.stats);

        self.setState({ 
          compSet: compSet
        });
      })
      .catch( err => {
        self.setState({error: err});
      });
    }
  }

  render() {
    const { getSuggestions, classes, match } = this.props;    
    const { company, description, ticker, companyDetail, stockData, chartDurations, error, news, priceObj, stats, compSet, selectedDuration, selectedMetric, selectedYear, selectedCategory } = this.state;
    if (error) {
      return (<ErrorMessage message="Sorry! We are not tracking this stock yet." />);
    }

    if (!company || companyDetail === undefined) {
      return (
        <div>
          <Helmet>
            <title>{ticker}</title>
            <meta name="description" content={"Public Market Valuation Analysis for " + ticker} />          
          </Helmet>
          <Loading />
        </div>
      )
    }

    return (
    <div>
      <Helmet>
        <title>{ ticker + ' | $'+((priceObj && priceObj.price) || company.latestPrice)}</title>
        <meta name="description" content={"Public Market Valuation Analysis" + !company ? "" : company.name} />          
      </Helmet>
      <div className={classes.mobileNav}>
        <AppBar position="static" color="default">
          <Tabs value={this.state.mobileIndex} onChange={this.handleChangeIndex} indicatorColor="primary" textColor="primary" fullWidth >
            <Tab label="Stats" component={Link} to={match.url}  />
            <Tab label="Charts" component={Link} to={match.url+"/charts"} />
            <Tab label="News" component={Link} to={match.url+"/news"} />          
            <Tab label="Valuation" component={Link} to={match.url+"/valuation"} />
          </Tabs>
        </AppBar>
      </div>
      <CompanyCard company={company} priceObj={priceObj} description={description} />
        {/*<Redirect from={`/stocks/${match.params.ticker}`} to={`/stocks/${match.params.ticker}/summary`} />*/}
        <Route exact path="/stocks/:ticker" render={() => <KeyStats quote={company} stats={stats} priceObj={priceObj} /> } />
        <Route exact path="/stocks/:ticker/charts" render={() => <StockChart company={company} 
																												                    chartData={stockData} 
																												                    chartDurations={chartDurations} 
																												                    selectedDuration={selectedDuration} 
																												                    changeDuration={this.changeDuration} 
																												                    chipData={this.state.allTickers} 
																												                    addComp={this.addComp} 
                                                                            getSuggestions={getSuggestions}
																												                    deleteComp={this.deleteComp} 
                                                                            />}  />                 
        <Route exact path="/stocks/:ticker/news" render={() => <CompanyNews news={news} />}  />       
        <Route exact path="/stocks/:ticker/financials" render={() => <CompanyFinancials quarterlyData={this.state.selectedQuarterlyFinancials}
                                                                                        annualData={this.state.selectedAnnualFinancials}
                                                                                        quarterlyMetrics={quarterlyMetrics} 
                                                                                        annualMetrics={annualMetrics}
                                                                                        updateData={this.getFinancials} /> } /> 
        <Route exact path="/stocks/:ticker/valuation" render={() => <CompanyComps updateCompSet={this.getComps}
                                                                                  compSet={compSet}
                                                                                  handleChange={this.handleChange} 
                                                                                  selectedMetric={selectedMetric} 
                                                                                  selectedYear={selectedYear} 
                                                                                  selectedCategory={selectedCategory}
                                                                                  selectedTicker={ticker}
                                                                                  selectedName={(companyDetail && companyDetail.name) || company.name}
                                                                                  categories={companyDetail && companyDetail.category} 
                                                                                  latestUpdate={!companyDetail && ((priceObj && priceObj.time) || company.latestUpdate)}
                                                                                  /> } />
    </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(CompanyDetails);