import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ReactGA from 'react-ga';
import {Helmet} from "react-helmet";

import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import classNames from 'classnames';

import { Link } from 'react-router-dom'
import DownIcon from '@material-ui/icons/KeyboardArrowDown';
import UpIcon from '@material-ui/icons/KeyboardArrowUp';


import pink from '@material-ui/core/colors/pink';
import green from '@material-ui/core/colors/green';
import fetch from 'node-fetch';

import Loading from '../shared/loading.js';
import NumberFormat from 'react-number-format';

import Gainers from '@material-ui/icons/TrendingUp';
import Losers from '@material-ui/icons/TrendingDown';
import Actives from '@material-ui/icons/CompareArrows';

//const util = require('util'); //print an object

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
  emoji: {
    fontSize: '1.5rem'
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
  subheaderText: {
    fontSize: '1rem',
    display: 'flex',
    justifyContent: 'space-between'
  },
  lists: {
    boxShadow: 'none',
    padding: 20
  },
  chipPaper: {
    display: 'flex',
    justifyContent: 'end',
    flexWrap: 'wrap',
    padding: theme.spacing.unit / 2,
    boxShadow: 'none',
    marginBottom: 10
  },
  selectedChip: {
    background: theme.palette.gradient,
    color: 'white',
    '&:hover, &:active, &:focus': {
      background: theme.palette.gradient,
      color: 'white',
      // Reset on mouse devices
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      }
    }
  },
  chip: {
    margin: theme.spacing.unit,
    fontSize: '1.0rem',
    borderRadius: 32,
    padding: theme.spacing.unit,
    backgroundColor: theme.palette.background.default,
    '&:hover, &:active, &:focus': {
      background: theme.palette.gradient,
      color: 'white',
      // Reset on mouse devices
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      }
    }
  },
  chipAvatar: {
    background: 'none',
    fontSize: '2rem'
  },
  name: {
    paddingLeft: 20,
    width: '70%',
    fontSize: '1rem',
    fontWeight: 300,
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down('md')]: {
      width: '50%'
    }     
  },
  nameSubheading: {
    fontSize: '0.875rem',
    fontWeight: 300
  },
  price: {
    width: '40%',
    textAlign: 'right',
    fontSize: '1rem',
    fontWeight: 300,
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down('md')]: {    
      '&:last-child': {
        paddingRight: 60      
      }
    }
  },
  menuRoot: {
    boxShadow: 'none',
    height: 'inherit',
    '&:before': {
      opacity: 0      
    },
    [theme.breakpoints.down('md')]: {
      padding: 10
    }
  },
  panelContent: {
    alignItems: 'center'
  },
  avatar: {
    margin: 10,
  },
  pinkAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: pink[500],
  },
  greenAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: green[500],
  },
  positiveChange: {
    color: green[500]
  },
  negativeChange: {
    color: pink[500]
  },
  svgIcon: {
    color: 'black'
  },
  avatarColor: {
    backgroundColor: 'white'
  }
});

const DataTable = (classes, data, type) => {
  if (!data) {
    return <Loading />
  }

  return (
    <List className={classes.tickerList}
          subheader={<ListSubheader component="div" className={classes.subheaderText}>
                      <span className={classes.subheaderLeft}>Company</span>
                      <span className={classes.subheaderRight}>Last / Change</span>
                    </ListSubheader>
                    }>
      { data.map(function(obj, index) {
        var momentumIcon = obj.percentChange > 0 ? <UpIcon /> : <DownIcon />;
        var formattedPrice = <NumberFormat value={parseFloat(obj.lastPrice).toFixed(2)} displayType={'text'} thousandSeparator={true} className={obj.price} prefix={'$'} />;
        var formattedChange = <span><NumberFormat value={parseFloat(obj.priceChange).toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={obj.priceChange > 0 ? "+$" : "$"} className={obj.priceChange > 0 ? classes.positiveChange : classes.negativeChange} />&nbsp;&nbsp;<NumberFormat value={parseFloat(obj.percentChange).toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={obj.percentChange > 0 ? "(+" : "("} suffix={"%)"} className={obj.priceChange > 0 ? classes.positiveChange : classes.negativeChange}  /></span>

        return(
        <MenuItem key={index} classes={{root: classes.menuRoot}} component={Link} to={'/stocks/'+obj.ticker.toLowerCase()} >
          <Avatar className={obj.priceChange > 0 ? classes.greenAvatar : classes.pinkAvatar}>{momentumIcon}</Avatar>
          <Typography className={classes.name}><span>{obj.standardName}</span><span className={classes.nameSubheading}>{"Ticker: "+obj.ticker}</span></Typography>
          <Typography className={classes.price}>{formattedPrice}{formattedChange}</Typography>
        </MenuItem>
        )
      })
      }
    </List>
  );
}

class Markets extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      selectedType: 'gainers'
    }

    this.fetchData = this.fetchData.bind(this);
    this.setCurrentData = this.setCurrentData.bind(this);
  }

  componentDidMount() {
    this.fetchData('gainers');    
  }

  fetchData(type) {
    var url = 'https://us-central1-project-unicorn-24dcc.cloudfunctions.net/getMarketMovers';
    var self = this;
    //var json = {"gainers":[{"volume":16.464409,"priceChange":0.94,"ticker":"OPK","percentChange":29.1925,"standardName":"OPKO Health Inc","performanceId":"0P00000636","link":"/stocks/xnas/opk/quote.html","exchange":"XNAS","lastPrice":4.16},{"volume":1.293735,"priceChange":5.8,"ticker":"BCOR","percentChange":22.9249,"standardName":"Blucora Inc","performanceId":"0P000002VH","link":"/stocks/xnas/bcor/quote.html","exchange":"XNAS","lastPrice":31.1},{"volume":18.069417,"priceChange":8.84,"ticker":"TRIP","percentChange":22.7953,"standardName":"TripAdvisor Inc","performanceId":"0P0000UTBL","link":"/stocks/xnas/trip/quote.html","exchange":"XNAS","lastPrice":47.62},{"volume":4.784938,"priceChange":9.97,"ticker":"AAXN","percentChange":22.3292,"standardName":"Axon Enterprise Inc","performanceId":"0P000005BD","link":"/stocks/xnas/aaxn/quote.html","exchange":"XNAS","lastPrice":54.62},{"volume":27.373341,"priceChange":0.58,"ticker":"LC","percentChange":20.5674,"standardName":"LendingClub Corp","performanceId":"0P00014IFP","link":"/stocks/xnys/lc/quote.html","exchange":"XNYS","lastPrice":3.4},{"volume":9.253053,"priceChange":8.06,"ticker":"TWLO","percentChange":18.1736,"standardName":"Twilio Inc A","performanceId":"0P000186EL","link":"/stocks/xnys/twlo/quote.html","exchange":"XNYS","lastPrice":52.41},{"volume":10.775028,"priceChange":1.45,"ticker":"GPOR","percentChange":16.0221,"standardName":"Gulfport Energy Corp","performanceId":"0P000002JQ","link":"/stocks/xnas/gpor/quote.html","exchange":"XNAS","lastPrice":10.5},{"volume":0.49734,"priceChange":6.68,"ticker":"MAXR","percentChange":15.2651,"standardName":"Maxar Technologies Ltd","performanceId":"0P0000AXXE","link":"/stocks/xnys/maxr/quote.html","exchange":"XNYS","lastPrice":50.44},{"volume":1.851127,"priceChange":10.86,"ticker":"NEWR","percentChange":14.082,"standardName":"New Relic Inc","performanceId":"0P00015083","link":"/stocks/xnys/newr/quote.html","exchange":"XNYS","lastPrice":87.98},{"volume":1.095977,"priceChange":5.35,"ticker":"RGNX","percentChange":13.4931,"standardName":"Regenxbio Inc","performanceId":"0P00016NDY","link":"/stocks/xnas/rgnx/quote.html","exchange":"XNAS","lastPrice":45}],"losers":[{"volume":14.144628,"priceChange":-3.04,"ticker":"EXTR","percentChange":-25.8723,"standardName":"Extreme Networks Inc","performanceId":"0P0000021Y","link":"/stocks/xnas/extr/quote.html","exchange":"XNAS","lastPrice":8.71},{"volume":0.4314,"priceChange":-35.75,"ticker":"COKE","percentChange":-21.1714,"standardName":"Coca-Cola Bottling Co Consolidated","performanceId":"0P000001BV","link":"/stocks/xnas/coke/quote.html","exchange":"XNAS","lastPrice":133.11},{"volume":6.158725,"priceChange":-4.99,"ticker":"MXL","percentChange":-20.94,"standardName":"MaxLinear Inc A","performanceId":"0P0000NHEV","link":"/stocks/xnys/mxl/quote.html","exchange":"XNYS","lastPrice":18.84},{"volume":2.197362,"priceChange":-2.125,"ticker":"INOV","percentChange":-19.0583,"standardName":"Inovalon Holdings Inc","performanceId":"0P00015BGX","link":"/stocks/xnas/inov/quote.html","exchange":"XNAS","lastPrice":9.025},{"volume":3.572078,"priceChange":-7.7,"ticker":"MB","percentChange":-17.6,"standardName":"MINDBODY Inc A","performanceId":"0P000166ET","link":"/stocks/xnas/mb/quote.html","exchange":"XNAS","lastPrice":36.05},{"volume":8.654718,"priceChange":-23.075,"ticker":"MIDD","percentChange":-17.5302,"standardName":"The Middleby Corp","performanceId":"0P000003MU","link":"/stocks/xnas/midd/quote.html","exchange":"XNAS","lastPrice":108.555},{"volume":13.52249,"priceChange":-18.17,"ticker":"WB","percentChange":-14.1964,"standardName":"Weibo Corp ADR Class A","performanceId":"0P00012NEK","link":"/stocks/xnas/wb/quote.html","exchange":"XNAS","lastPrice":109.82},{"volume":25.111359,"priceChange":-0.455,"ticker":"KGC","percentChange":-11.0437,"standardName":"Kinross Gold Corp","performanceId":"0P0000035H","link":"/stocks/xnys/kgc/quote.html","exchange":"XNYS","lastPrice":3.665},{"volume":4.333171,"priceChange":-5.405,"ticker":"BECN","percentChange":-10.8425,"standardName":"Beacon Roofing Supply Inc","performanceId":"0P000000QK","link":"/stocks/xnas/becn/quote.html","exchange":"XNAS","lastPrice":44.445}],"actives":[{"volume":83.098543,"priceChange":-0.18,"ticker":"MDR","percentChange":-2.6393,"standardName":"McDermott International Inc","performanceId":"0P000003II","link":"/stocks/xnys/mdr/quote.html","exchange":"XNYS","lastPrice":6.64},{"volume":72.088114,"priceChange":0.79,"ticker":"BAC","percentChange":2.6395,"standardName":"Bank of America Corporation","performanceId":"0P000000PA","link":"/stocks/xnys/bac/quote.html","exchange":"XNYS","lastPrice":30.72},{"volume":54.376287,"priceChange":0.1,"ticker":"WFT","percentChange":3.0581,"standardName":"Weatherford International PLC","performanceId":"0P000005VP","link":"/stocks/xnys/wft/quote.html","exchange":"XNYS","lastPrice":3.37},{"volume":51.041716,"priceChange":-0.22,"ticker":"ABEV","percentChange":-3.5144,"standardName":"Ambev SA ADR","performanceId":"0P000001F0","link":"/stocks/xnys/abev/quote.html","exchange":"XNYS","lastPrice":6.04},{"volume":50.862478,"priceChange":0.35,"ticker":"GE","percentChange":2.4527,"standardName":"General Electric Co","performanceId":"0P000002DO","link":"/stocks/xnys/ge/quote.html","exchange":"XNYS","lastPrice":14.62},{"volume":49.586638,"priceChange":0.34,"ticker":"AMD","percentChange":2.9285,"standardName":"Advanced Micro Devices Inc","performanceId":"0P0000006A","link":"/stocks/xnas/amd/quote.html","exchange":"XNAS","lastPrice":11.95},{"volume":45.690761,"priceChange":0.13,"ticker":"CHK","percentChange":4.1534,"standardName":"Chesapeake Energy Corp","performanceId":"0P0000017Y","link":"/stocks/xnys/chk/quote.html","exchange":"XNYS","lastPrice":3.26},{"volume":43.674808,"priceChange":-0.21,"ticker":"F","percentChange":-1.8634,"standardName":"Ford Motor Co","performanceId":"0P0000029A","link":"/stocks/xnys/f/quote.html","exchange":"XNYS","lastPrice":11.06},{"volume":38.359757,"priceChange":1.26,"ticker":"PBR","percentChange":9.0844,"standardName":"Petroleo Brasileiro SA Petrobras ADR","performanceId":"0P000004BT","link":"/stocks/xnys/pbr/quote.html","exchange":"XNYS","lastPrice":15.13},{"volume":37.481736,"priceChange":-0.3,"ticker":"T","percentChange":-0.9464,"standardName":"AT&T Inc","performanceId":"0P00000031","link":"/stocks/xnys/t/quote.html","exchange":"XNYS","lastPrice":31.4}]};
    //this.setState({data: json, currentData: self.getCurrentData(type, json), selectedType: type});
    
    fetch(url)
    .then(res => res.json())
    .then(json => {
      self.setState({data: json, currentData: self.getCurrentData(type, json), selectedType: type });
    })
    .catch(function(err) {
      self.setState({error: err});
    }); 
  }

  setCurrentData(type) {
    this.setState({selectedType: type, currentData: this.getCurrentData(type)});
  }

  getCurrentData(type, _data) {
    var data = _data ? _data : this.state.data;

    switch (type) {
      case 'gainers': return data.gainers;
      case 'losers': return data.losers;
      case 'actives': return data.actives;
      default: return ''
    }
  }

  getEmoji(type) {
    const { classes } = this.props;

    switch (type) {
      case 'gainers': return <Gainers style={{ fontSize: 80 }} className={classes.svgIcon} />;
      case 'losers': return <Losers style={{ fontSize: 80 }} className={classes.svgIcon} />;
      case 'actives': return <Actives style={{ fontSize: 80 }} className={classes.svgIcon} />;
      default: return      
    }
  }

  render() {
    const { classes } = this.props;
    const { selectedType, data, currentData } = this.state;
    const orderOptions = [{name: 'gainers', emoji: "📈"}, {name: 'losers', emoji: "📉"}, {name: 'actives', emoji: "🎉"}];

    const orderChips = <Paper className={classes.chipPaper}>
                          {orderOptions.map(obj => {
                            return (
                            <Chip key={obj.name} 
                                  onClick={() => this.setCurrentData(obj.name)} 
                                  label={obj.name.toProperCase()}
                                  avatar={selectedType === obj.name ? <Avatar classes={{colorDefault: classes.avatarColor}}>{this.getEmoji(obj.name)}</Avatar> : null}
                                  className={selectedType === obj.name ? classNames(classes.selectedChip, classes.chip) : classes.chip} />
                            );
                          })}
                        </Paper>;

    return (
      <div className={classes.root}>
        <Helmet>
          <title>Trending Tickers</title>
          <meta name="description" content={"Top Gainers, Losers and Most Active U.S.Stocks"} />          
        </Helmet>
        <Paper className={classes.header} >
          <Typography variant="display3" className={classes.titleText}>
            {selectedType.toProperCase()}
          </Typography>
          {orderChips}
        </Paper>
        <Paper className={classes.lists} >
          { (!selectedType || !data) && <Loading /> }
          { (selectedType && data) && DataTable(classes, currentData, selectedType) }
        </Paper>          
      </div>
    );
  }
}

Markets.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Markets);