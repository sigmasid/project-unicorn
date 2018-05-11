import React, { Component } from 'react'

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import Card, { CardContent, CardHeader } from 'material-ui/Card';
import Chip from 'material-ui/Chip';
import Paper from 'material-ui/Paper';
import Tabs, { Tab } from 'material-ui/Tabs';
import TextField from 'material-ui/TextField';
import { InputAdornment } from 'material-ui/Input';
import IconButton from 'material-ui/IconButton';
import AddIcon from 'material-ui-icons/AddCircle';

import Chart from './stockChart.js';
import TickersList from './publicTickerChips.js';
import Loading from '../shared/loading.js';
import { getDurationLabel } from '../shared/sharedFunctions.js';
import classNames from 'classnames';
import { findDOMNode } from 'react-dom';
import CloseIcon from 'material-ui-icons/Close';
import RenderSuggestionsContainer from '../shared/searchSuggestions.js';

const util = require('util'); //print an object

const styles = theme => ({
  card: {
    margin: 20
  },
  header: {
    textAlign: 'left',
    display: 'flex',
    [theme.breakpoints.down('md')]: {
      display: 'block'
    }
  },
  headerAction: {
    marginTop: 0,
    marginRight: 0
  },
  cardContent: {
    textAlign: 'center'
  },
  textField: {
    minWidth: 150,
   [theme.breakpoints.down('md')]: {
      width: '100%',
      marginTop: 20
    }
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
  footer: {
    padding: '2px 20px',
    display: 'block',
  },
  footerDivider: {
    width: '20%',
    marginBottom: 5
  },
  chipsContainer: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }    
  },  
  tabsContainer: {
    boxShadow: '0px 1px 5px 0px rgba(0, 0, 0, 0.0), 0px 2px 2px 0px rgba(0, 0, 0, 0.0), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
    [theme.breakpoints.up('lg')]: {
      display: 'none'
    }
  },
  searchSuggestions: {

  },
});

class StockChart extends Component {
  constructor (props) {
    super(props);

    this.state = { 
      anchorEl: null,
      searchText: ''   
    }

    this.createChartDurations = this.createChartDurations.bind(this);
    this.handleChange = this.handleChange.bind(this);    
  }

  componentWillReceiveProps(nextProps) {
    //
  }

  handleClick = duration => {
    if (this.props.selectedDuration !== duration) {
      this.props.changeDuration(duration);
    }
  };

  handleChangeDuration = (event, value) => {
    if (this.props.selectedDuration !== value) {
      this.props.changeDuration(value);
    }
    this.setState({ value });
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
      anchorEl: findDOMNode(this.searchBox),
      searchResults: this.props.getSuggestions(event.target.value),
    });
  };

  handleAddComp = (ticker) => {
    this.props.addComp(ticker);
    this.handleClose();
  }

  handleClose = () => {
    this.setState({
      anchorEl: null,
      searchResults: undefined,
      searchText: ''
    });
  }

  createChartDurations() {
  const { classes, chartDurations, selectedDuration } = this.props;

    if (!chartDurations) {
      return null;
    }

    var chips = chartDurations.map(function(key, index) {
      return (
          <Chip key={index} label={ getDurationLabel(key) } onClick={() => this.handleClick(key)} className={selectedDuration === key ? classNames(classes.chip, classes.selectedChip) : classes.chip} />
        );
      })
    return(<div className={classes.chipsContainer}>{chips}</div>); 
  }

  searchBox = null;

  render() {
    const { classes, chartData, selectedDuration, chipData, deleteComp } = this.props;
    const { searchResults, anchorEl } = this.state;
    console.log("search results are "+util.inspect(searchResults));

    const tabs = 
      <Paper className={classes.tabsContainer}>
        <Tabs
          value={selectedDuration}
          onChange={this.handleChangeDuration}
          indicatorColor="primary"
          textColor="primary"
          fullWidth
        >
          <Tab label="1D" value="1d" />
          <Tab label="1W" value="1w" />
          <Tab label="1M" value="1m"  />
          <Tab label="3M" value="3m" />
          <Tab label="6M" value="6m" />
          <Tab label="1Y" value="1y" />
          <Tab label="2Y" value="2y" />
          <Tab label="5Y" value="5y" />          
        </Tabs>
      </Paper>

    return(
    <Card className={classes.card} >
      <CardHeader 
        title={"Stock Price Performance"} 
        subheader={getDurationLabel(selectedDuration)} 
        classes={{root: classes.header, action: classes.headerAction}} 
        action={
          <div className={classes.searchSuggestions} ref={node => { this.searchBox = node;}}>
            <TextField
              label="Compare To"
              id="searchText"
              className={classes.textField}
              onChange={this.handleChange('searchText')}
              value={this.state.searchText}
              InputProps={{
                startAdornment: <InputAdornment position="start">Comp:</InputAdornment>,
                endAdornment: <InputAdornment position="end"><IconButton onClick={this.handleClose}>{anchorEl ? <CloseIcon /> : <AddIcon />}</IconButton></InputAdornment>,
              }}
          />
            <RenderSuggestionsContainer results={searchResults} anchorEl={anchorEl} handleClose={this.handleClose} handleSelect={this.handleAddComp} />          
          </div>           
        } />
      <CardContent className={classes.cardContent} >
        { tabs }
        { this.createChartDurations(classes) }
        { chartData && <Chart chartData={chartData} duration={selectedDuration} /> }
        { !chartData && <Loading /> }
      </CardContent>
      <TickersList chipData={chipData} deleteComp={deleteComp} />
    </Card>
    );
  }
}

StockChart.propTypes = {
  classes: PropTypes.object.isRequired,
  chartData: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(StockChart);