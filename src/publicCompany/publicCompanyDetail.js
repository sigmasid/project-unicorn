import React from 'react';
import { withStyles } from 'material-ui/styles';

import CompanyCard from './publicCompanyCard.js';
import StockChart from './publicStockCharts.js';
import CompanyNews from './publicCompanyNews.js';
import CompanyFinancials from './publicFinancials.js';
import KeyStats from './publicKeyStats.js';

import ErrorMessage from '../shared/errorMessage.js';
import {Helmet} from "react-helmet";
import ReactGA from 'react-ga';
import fetch from 'node-fetch';
import { createDate } from '../shared/sharedFunctions.js';
import { Route } from 'react-router-dom';

//import * as firebase from "firebase";
//import firestore from "firebase/firestore";
const util = require('util'); //print an object
const moment = require('moment');

const styles = theme => ({
});

class CompanyDetails extends React.Component {
  constructor (props) {
    super(props);
    var { socket } = props;

    var ticker = props.match.params.ticker;
    //var json = {"AMZN":{"quote":{"symbol":"AMZN","companyName":"Netflix Inc.","primaryExchange":"Nasdaq Global Select","sector":"Consumer Cyclical","calculationPrice":"tops","open":326,"openTime":1525786200117,"close":326.26,"closeTime":1525723200393,"high":327.348,"low":323.05,"latestPrice":324.355,"latestSource":"IEX real time price","latestTime":"2:54:12 PM","latestUpdate":1525805652337,"latestVolume":2619358,"iexRealtimePrice":324.355,"iexRealtimeSize":100,"iexLastUpdated":1525805652337,"delayedPrice":323.62,"delayedPriceTime":1525804902830,"previousClose":326.26,"change":-1.905,"changePercent":-0.00584,"iexMarketPercent":0.01808,"iexVolume":47358,"avgTotalVolume":11893560,"iexBidPrice":316.75,"iexBidSize":100,"iexAskPrice":325.31,"iexAskSize":100,"marketCap":140994704974,"peRatio":217.69,"week52High":338.82,"week52Low":144.25,"ytdChange":0.6226189884119958},"news":[{"datetime":"2018-05-08T12:55:00-04:00","headline":"Disney could avoid a bidding war with Comcast if it's willing to shed these Fox assets","source":"CNBC","url":"https://api.iextrading.com/1.0/stock/nflx/article/8460520124386704","summary":"No summary available.","related":"CMCSA,DIS,FOXA,NFLX,TWX"},{"datetime":"2018-05-08T11:50:05-04:00","headline":"Danger Zone: Investors Who Trust Wall Street","source":"SeekingAlpha","url":"https://api.iextrading.com/1.0/stock/nflx/article/8290244189087054","summary":"   Its no secret that Wall Street research is conflicted. For a  perfect example , look at the coverage of the Snap ( SNAP ) IPO. Eleven of the 12 analysts who initiated coverage prior to the IPO rated SNAP hold or sell. Post IPO, nine of the underwriting b…","related":"CON102,ENT10210,IPO,MED10210023,NASDAQ01,NFLX"},{"datetime":"2018-05-08T11:35:10-04:00","headline":"Long On Roku - Even If They Miss Q1 Earnings","source":"SeekingAlpha","url":"https://api.iextrading.com/1.0/stock/nflx/article/7286339834814623","summary":"   Roku ( ROKU ) stock prices have fluctuated wildly from being one of the hottest stocks in 2017 with a 400% return from the IPO price of $14 to a high in  December of $56 . From there, the streaming device maker saw shares drop 42% where its been range bound at $31-$34 per share. That i…","related":"AAPL,AMZN,BBY,CHTR,CMCSA,Computer Hardware,CON31167138,GOOGL,NASDAQ01,NFLX,NLSN,OTCBULLB,ROKU,SSNLF,T,Computing and Information Technology,WOMPOLIX"},{"datetime":"2018-05-08T11:01:54-04:00","headline":"Analyst suggests Microsoft will buy Netflix for content access","source":"SeekingAlpha","url":"https://api.iextrading.com/1.0/stock/nflx/article/8544928075454394","summary":"      Media Tech Capital Partners Porter Bibb  thinks  Microsoft (NASDAQ: MSFT ) will try to buy Netflix (NASDAQ: NFLX ) to get into streaming without having to directly acquire content.   More news on: Microsoft Corporation, Netflix, Inc., Tech stocks news, Stocks on the move,     Read m…","related":"APPSOFTW,MSFT,NASDAQ01,NFLX,SOF31165134,Computing and Information Technology"},{"datetime":"2018-05-08T09:19:00-04:00","headline":"Bold call: Microsoft will buy Netflix, longtime media analyst predicts","source":"CNBC","url":"https://api.iextrading.com/1.0/stock/nflx/article/6730388964003699","summary":"No summary available.","related":"MSFT,NFLX,T,TAP,TWX"}],"chart":[{"date":"2018-04-09","open":291.77,"high":299.55,"low":289.12,"close":289.93,"volume":9853564,"unadjustedVolume":9853564,"change":1.08,"changePercent":0.374,"vwap":294.8506,"label":"Apr 9","changeOverTime":0},{"date":"2018-04-10","open":297.68,"high":298.95,"low":291.69,"close":298.07,"volume":10719097,"unadjustedVolume":10719097,"change":8.14,"changePercent":2.808,"vwap":295.7598,"label":"Apr 10","changeOverTime":0.02807574242058423},{"date":"2018-04-11","open":302.8847,"high":311.64,"low":301.82,"close":303.67,"volume":14877429,"unadjustedVolume":14877429,"change":5.6,"changePercent":1.879,"vwap":306.4419,"label":"Apr 11","changeOverTime":0.04739074949125654},{"date":"2018-04-12","open":309.7187,"high":311.13,"low":306.75,"close":309.25,"volume":10249403,"unadjustedVolume":10249403,"change":5.58,"changePercent":1.838,"vwap":309.2966,"label":"Apr 12","changeOverTime":0.06663677439381917},{"date":"2018-04-13","open":317.29,"high":317.49,"low":308.23,"close":311.65,"volume":12046573,"unadjustedVolume":12046573,"change":2.4,"changePercent":0.776,"vwap":313.2644,"label":"Apr 13","changeOverTime":0.07491463456696433},{"date":"2018-04-16","open":315.99,"high":316.1,"low":304,"close":307.78,"volume":20307921,"unadjustedVolume":20307921,"change":-3.87,"changePercent":-1.242,"vwap":308.4709,"label":"Apr 16","changeOverTime":0.061566585037767615},{"date":"2018-04-17","open":329.66,"high":338.62,"low":323.77,"close":336.06,"volume":33866456,"unadjustedVolume":33866456,"change":28.28,"changePercent":9.188,"vwap":332.7648,"label":"Apr 17","changeOverTime":0.1591073707446625},{"date":"2018-04-18","open":336.3,"high":338.82,"low":331.1,"close":334.52,"volume":11221139,"unadjustedVolume":11221139,"change":-1.54,"changePercent":-0.458,"vwap":334.8069,"label":"Apr 18","changeOverTime":0.15379574380022756},{"date":"2018-04-19","open":332.88,"high":335.31,"low":326.77,"close":332.7,"volume":8438825,"unadjustedVolume":8438825,"change":-1.82,"changePercent":-0.544,"vwap":331.4239,"label":"Apr 19","changeOverTime":0.1475183665022591},{"date":"2018-04-20","open":332.22,"high":336.51,"low":326,"close":327.77,"volume":9158655,"unadjustedVolume":9158655,"change":-4.93,"changePercent":-1.482,"vwap":331.3843,"label":"Apr 20","changeOverTime":0.13051426206325656},{"date":"2018-04-23","open":329.1499,"high":331.22,"low":317.08,"close":318.69,"volume":8968015,"unadjustedVolume":8968015,"change":-9.08,"changePercent":-2.77,"vwap":323.3947,"label":"Apr 23","changeOverTime":0.09919635774152379},{"date":"2018-04-24","open":319.2168,"high":320.249,"low":302.31,"close":307.02,"volume":13893217,"unadjustedVolume":13893217,"change":-11.67,"changePercent":-3.662,"vwap":308.7764,"label":"Apr 24","changeOverTime":0.058945262649604986},{"date":"2018-04-25","open":306.37,"high":309.98,"low":292.615,"close":305.76,"volume":14919698,"unadjustedVolume":14919698,"change":-1.26,"changePercent":-0.41,"vwap":302.5626,"label":"Apr 25","changeOverTime":0.05459938605870377},{"date":"2018-04-26","open":310,"high":316.63,"low":305.58,"close":313.98,"volume":9266699,"unadjustedVolume":9266699,"change":8.22,"changePercent":2.688,"vwap":313.1808,"label":"Apr 26","changeOverTime":0.08295105715172632},{"date":"2018-04-27","open":316.25,"high":317.45,"low":306.5,"close":311.76,"volume":7074384,"unadjustedVolume":7074384,"change":-2.22,"changePercent":-0.707,"vwap":311.7064,"label":"Apr 27","changeOverTime":0.07529403649156688},{"date":"2018-04-30","open":311.07,"high":317.88,"low":310.118,"close":312.46,"volume":6088787,"unadjustedVolume":6088787,"change":0.7,"changePercent":0.225,"vwap":313.9786,"label":"Apr 30","changeOverTime":0.07770841237540087},{"date":"2018-05-01","open":310.36,"high":313.48,"low":306.69,"close":313.3,"volume":6036639,"unadjustedVolume":6036639,"change":0.84,"changePercent":0.269,"vwap":310.0528,"label":"May 1","changeOverTime":0.08060566343600181},{"date":"2018-05-02","open":311.65,"high":317.1,"low":310.4034,"close":313.36,"volume":5697120,"unadjustedVolume":5697120,"change":0.06,"changePercent":0.019,"vwap":314.4062,"label":"May 2","changeOverTime":0.08081260994033045},{"date":"2018-05-03","open":312.59,"high":312.59,"low":305.73,"close":311.69,"volume":6135828,"unadjustedVolume":6135828,"change":-1.67,"changePercent":-0.533,"vwap":309.6728,"label":"May 3","changeOverTime":0.0750525989031835},{"date":"2018-05-04","open":308.71,"high":320.98,"low":307.67,"close":320.09,"volume":8209513,"unadjustedVolume":8209513,"change":8.4,"changePercent":2.695,"vwap":316.4022,"label":"May 4","changeOverTime":0.10402510950919176},{"date":"2018-05-07","open":321.9947,"high":329.0234,"low":319.34,"close":326.26,"volume":7117823,"unadjustedVolume":7117823,"change":6.17,"changePercent":1.928,"vwap":325.7728,"label":"May 7","changeOverTime":0.12530610837098605}],"financials":{"symbol":"NFLX","financials":[{"reportDate":"2018-03-31","grossProfit":1504781000,"costOfRevenue":2196075000,"operatingRevenue":3700856000,"totalRevenue":3700856000,"operatingIncome":446578000,"netIncome":290124000,"researchAndDevelopment":300730000,"operatingExpense":1058203000,"currentAssets":7817576000,"totalAssets":20152797000,"totalLiabilities":null,"currentCash":2599477000,"currentDebt":null,"totalCash":2593666000,"totalDebt":null,"shareholderEquity":4020730000,"cashChange":-230495000,"cashFlow":-236757000,"operatingGainsLosses":41080000},{"reportDate":"2017-12-31","grossProfit":1178401000,"costOfRevenue":2107354000,"operatingRevenue":3285755000,"totalRevenue":3285755000,"operatingIncome":245303000,"netIncome":185517000,"researchAndDevelopment":273351000,"operatingExpense":933098000,"currentAssets":7669974000,"totalAssets":19012742000,"totalLiabilities":15430786000,"currentCash":2822795000,"currentDebt":null,"totalCash":2822795000,"totalDebt":null,"shareholderEquity":3581956000,"cashChange":1074145000,"cashFlow":-487957000,"operatingGainsLosses":25740000},{"reportDate":"2017-09-30","grossProfit":991879000,"costOfRevenue":1992980000,"operatingRevenue":2984859000,"totalRevenue":2984859000,"operatingIncome":208627000,"netIncome":129590000,"researchAndDevelopment":255236000,"operatingExpense":783252000,"currentAssets":6385348000,"totalAssets":16951540000,"totalLiabilities":13624179000,"currentCash":1746469000,"currentDebt":null,"totalCash":1746469000,"totalDebt":null,"shareholderEquity":3327361000,"cashChange":-182993000,"cashFlow":-419607000,"operatingGainsLosses":50830000},{"reportDate":"2017-06-30","grossProfit":883156000,"costOfRevenue":1902308000,"operatingRevenue":2785464000,"totalRevenue":2785464000,"operatingIncome":127807000,"netIncome":65600000,"researchAndDevelopment":267083000,"operatingExpense":755349000,"currentAssets":6700785000,"totalAssets":16517223000,"totalLiabilities":13404723000,"currentCash":1918777000,"currentDebt":null,"totalCash":2164902000,"totalDebt":null,"shareholderEquity":3112500000,"cashChange":829426000,"cashFlow":-534528000,"operatingGainsLosses":64220000}]}}};
    const chartDurations = ["1d","1w","1m","3m","6m","1y","2y","5y"];

    this.getCompany = this.getCompany.bind(this);
    this.changeDuration = this.changeDuration.bind(this);
    this.filterData = this.filterData.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.addComp = this.addComp.bind(this);
    this.deleteComp = this.deleteComp.bind(this);

    this.state = {
      ticker: ticker,
      selectedDuration: '1m',
      fetchedDuration: '3m',
      chartDurations: chartDurations,
      //company: json[ticker.toUpperCase()].quote,
      //news: json[ticker.toUpperCase()].news,      
      //stockPriceData: json,
      //financials: json,
      //chartData: this.filterData('1m', json),
    }

    /**
    socket.on('connect', () => {
      console.log("connected");
      socket.emit('subscribe', ticker.toLowerCase());
    });

    socket.on('message', message => {
      var obj = JSON.parse(message);
      this.setState({"priceObj": obj });
      console.log(util.inspect(obj));
    });

    socket.on('disconnect', () => console.log('Disconnected.'))

    if (ticker) {
      this.getCompany(ticker);
    }
    **/    
  }

  componentDidMount() {
    var { ticker } = this.state;

    if (ticker) {
      this.getCompany(ticker);
    }
  }

  componentWillUnmount() {
    this.props.socket.emit('unsubscribe', this.state.ticker.toLowerCase());
  }


  componentWillReceiveProps(nextProps) {
    var ticker = nextProps.match.params.ticker;
    if (ticker !== this.state.ticker) {
      this.getCompany(ticker);
    }
  }

  getCompany(_ticker) {
    var url = 'https://api.iextrading.com/1.0/stock/market/batch?symbols='+_ticker+'&types=quote,chart,relevant,news,stats,financials&range=1m';
    //console.log("company quote is "+util.inspect(json.quote));
    //this.setState({company: json.quote, stockPriceData: json.chart});

    fetch(url)
    .then(res => res.json())
    .then((json) => {
      var ticker = _ticker.toUpperCase();
      var company = json[ticker];
      var self = this;

      var prices = {};
      prices[ticker] = {};
      prices[ticker]['chart'] = company.chart;

      var financials = {};
      financials[ticker] = {};
      financials[ticker]['financials'] = company.financials;

      this.setState({company: company.quote,
                     allTickers: [ticker],
                     news: company.news,      
                     stockPriceData: prices,
                     financials: financials,
                     chartData: self.filterData('1m', prices),
                    });
    })
    .catch(function(err) {
      console.log("error is "+err);
      //this.setState({error: 'Invalid Ticker'});
    });
  }


  changeDuration(duration) {
    if (duration.includes('d') && this.state.dayData) {
      //if it's one day - get intraday pricing
      this.setState({
        selectedDuration: duration,
        chartData: this.state.dayData
      });
    } else if (duration.includes('m') || duration.includes('w') || (duration.includes('y') && parseInt(this.state.fetchedDuration, 10) >= parseInt(duration, 10))) {
      this.setState({
        selectedDuration: duration,
        chartData: this.filterData(duration)
      });        
    } else {
      //don't have data - so refetch for all tickers currently selected
      this.fetchData(this.state.allTickers.toString(), duration, duration);
    }
  }

  fetchData(tickers, fetchDuration, selectDuration) {
    var url = 'https://api.iextrading.com/1.0/stock/market/batch?symbols='+tickers+'&types=chart&range='+fetchDuration;
    var self = this; 

    fetch(url)
    .then(res => res.json())
    .then(json => {
      selectDuration.includes('d')
        ? self.setState({selectedDuration: selectDuration, chartData: fetchDuration !== selectDuration ? this.filterData(selectDuration, json) : json, dayData: json, allTickers: tickers.split(',')})
        : self.setState({selectedDuration: selectDuration, chartData: fetchDuration !== selectDuration ? this.filterData(selectDuration, json) : json, stockPriceData: json, fetchedDuration: fetchDuration, allTickers: tickers.split(',')});        
    })
    .catch(function(err) {
      console.log("error is "+err);
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
      var filteredData = currentDataSet.filter(obj => {return createDate(obj.date) > filterDate });
      filteredDataObject[ticker] = {};
      filteredDataObject[ticker]['chart'] = filteredData;
      return null;
    });

    return filteredDataObject;
  }

  addComp(ticker) {
    const {allTickers} = this.state;
    allTickers.push(ticker);
    this.fetchData(allTickers.toString(), this.state.fetchedDuration, this.state.selectedDuration);
  }

  deleteComp(ticker) {
    const { allTickers, stockPriceData, chartData, dayData } = this.state;

    const chipToDelete = allTickers.indexOf(ticker);
    allTickers.splice(chipToDelete, 1);

    delete stockPriceData[ticker.toUpperCase()];
    delete chartData[ticker.toUpperCase()];

    if (dayData && dayData[ticker]) {
      delete dayData[ticker];
    }

    this.setState({ allTickers: allTickers, stockPriceData: stockPriceData, dayData: dayData, chartData: chartData });
  }

  render() {
    const { getSuggestions } = this.props;    
    const { company, chartData, chartDurations, selectedDuration, error, news, financials, priceObj } = this.state;

    if (error) {
      return (<ErrorMessage message="Sorry! We are not tracking this company yet." />);
    }

    return (
    <div>
      <Helmet>
        <title>{!company ? "Stock Analysis" : company.name}</title>
        <meta name="description" content={"Public Market Valuation Analysis" + !company ? "" : company.name} />          
      </Helmet>
      <CompanyCard company={company} priceObj={priceObj} />
        {/*<Redirect from={`/stocks/${match.params.ticker}`} to={`/stocks/${match.params.ticker}/summary`} />*/}
        <Route exact path="/stocks/:ticker" render={() => <KeyStats quote={company} /> } />
        <Route exact path="/stocks/:ticker/charts" render={() => <StockChart company={company} 
																												                    chartData={chartData} 
																												                    chartDurations={chartDurations} 
																												                    selectedDuration={selectedDuration} 
																												                    changeDuration={this.changeDuration} 
																												                    chipData={this.state.allTickers} 
																												                    addComp={this.addComp} 
                                                                            getSuggestions={getSuggestions}
																												                    deleteComp={this.deleteComp} 
                                                                            />}  />                 
        <Route exact path="/stocks/:ticker/news" render={() => <CompanyNews news={news} />}  />       
        <Route exact path="/stocks/:ticker/financials" render={() => <CompanyFinancials chartData={financials} />} />               
    </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(CompanyDetails);