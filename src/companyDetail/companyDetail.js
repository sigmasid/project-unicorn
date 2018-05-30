import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import * as firebase from "firebase";
import firestore from "firebase/firestore";
import CompanyCard from './companyCard.js';
import ValuationSummary from './valuationSummary.js';
import CompanyComps from './companyComps.js';
import CaseSummary from './caseSummary.js';
import SimilarStartups from './similarStartups.js';
import ErrorMessage from '../shared/errorMessage.js';
import {Helmet} from "react-helmet";
import ReactGA from 'react-ga';
import { calcMultiples, getCase, getFormattedMetric, formatMetric, formatSuffix, formatMultiple } from '../shared/sharedFunctions.js';

//const util = require('util'); //print an object

const styles = theme => ({
});

const sortCategories = (obj) => {
  //sorts the object and returns a sorted array
  return Object.keys(obj).sort(function(a,b){return obj[a]-obj[b]});
}

class CompanyDetails extends React.Component {
  constructor (props) {
    super(props);

    var companyID = props.match.params.cid;

    this.state = {
      companyID: companyID,
      selectedMetric: 'rev',
      selectedYear: 'cy1'
    }

    this.setMetric = this.setMetric.bind(this);
    this.setMultiple = this.setMultiple.bind(this);
    this.setMultipleRange = this.setMultipleRange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getComps = this.getComps.bind(this);
    this.getCompany = this.getCompany.bind(this);
    this.getCases = this.getCases.bind(this);
    this.getMultiple = this.getMultiple.bind(this);
    this.getEstimate = this.getEstimate.bind(this);
    this.getCaption = this.getCaption.bind(this);
    this.getPublicCaption = this.getPublicCaption.bind(this);
    this.getName = this.getName.bind(this);

    if (companyID !== undefined) {
      this.getCompany(companyID);
    }
  }

  componentWillReceiveProps(nextProps) {
    var companyID = nextProps.match.params.cid;
    if (companyID !== this.state.companyID) {
      this.getCompany(companyID);
    }
  }

  getCompany(id) {

    var self = this;

    this.props.getDoc('private', id)
    .then( company => {

      var category = company.category && sortCategories(company.category)[0];
      var valuationCaseTickers = company.cases;
      var isPublic = company.publicTicker;

      this.setState({
        company: company,
        companyID: id,
        selectedCategory: category,
        isPublic: isPublic
      })

      if (valuationCaseTickers) {
        this.getCases(valuationCaseTickers);
      }

      if (category) {
        this.getComps(category);
      }

      if (isPublic) {
        this.getPublicTicker(company.publicTicker)
      }

      ReactGA.event({
        category: 'Startups',
        action: 'Browse',
        label: id
      });
    })
    .catch(err => {
      self.setState({ 
        error: err
      });
    });
  }

  getPublicTicker(id) {

    this.props.getDoc('public', id)
    .then( obj => {
      this.setState({
        publicCompany: obj
      });
    })
  }

  getComps(category) {
    var db = firebase.firestore();
    var compsRef = db.collection('public').where('category.'+category, '==', true);

    compsRef.get()
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
  }

  getCases(valuationCaseTickers) {
    var db = firebase.firestore();
    //var self = this;

    Promise.all(
      Object.keys(valuationCaseTickers).map(currentCase => {
        return db.collection('public').doc(valuationCaseTickers[currentCase]).get();
      })
    ).then(results => {
      return results.map(doc => doc.data());
    }).then(cases => {
      //var baseCase = cases.filter((elem, index, array) => { return elem.ticker.toLowerCase() === valuationCases['bull']});
      this.setState({valuationCases: cases, valuationCaseTickers: valuationCaseTickers})
    });
  }

  handleChange(name, value) {
    this.setState({
      [name]: value
    });
  };

  setMetric(metric) {
		this.setState({ hardcodeMetric: metric });
  }

  setMultiple(base) {
    this.setState({
      baseMultiple: base
    });      
  }

  setMultipleRange(low, high) {
    if (low && high) {
      var valuationCases = [];
      var caseNames = ['comps median', 'puEstimate', 'comps high'];
      var tickersObj = {'bear': 'bear', 'base': 'base', 'bull': 'bull'};

      Object.keys(tickersObj).map((ticker, index) => {
        var currentCase = {}
        currentCase['name'] = caseNames[index];
        currentCase['ticker'] = ticker;
        currentCase['multiple'] = ticker === 'bear' ? low : (ticker === 'bull' ? high : (low + high) / 2);
        valuationCases.push(currentCase);
        return currentCase;
      });

      //if valuationCases are not coded then create valuationCases and use as low, mid, high
      if (!this.state.company.cases) {
        this.setState({
          valuationCases: valuationCases,
          valuationCaseTickers: tickersObj
        });
      }
    }
  }

  getMetric = () => {
    const { company, selectedMetric, selectedYear, publicCompany } = this.state;
    var _selectedMetric = selectedMetric === 'rev_growth' ? 'rev' : selectedMetric;
    
    if (publicCompany) {
      return (publicCompany[_selectedMetric+'_'+selectedYear]) || undefined
    }
  	return (company && company[_selectedMetric+'_'+selectedYear]) || undefined
  }

  getMultiple = (type) => {
    const { selectedMetric, selectedYear, valuationCases, valuationCaseTickers } = this.state;
    var _selectedMetric = selectedMetric === 'rev_growth' ? 'rev' : selectedMetric;

    if (valuationCases && valuationCaseTickers) {
      var selectedCase = getCase(valuationCases, valuationCaseTickers, type);
      return calcMultiples(selectedCase, _selectedMetric, selectedYear);
    }
  }

  getEstimate = (type) => {
    const { company, isPublic, publicCompany } = this.state;

    var multiple = this.getMultiple(type);
    var metric = this.state.hardcodeMetric || this.getMetric();

    if (isPublic && publicCompany) {
      //return per share value implied by the enterprise value
      var enterprise_value = multiple * metric;

      var debt = (publicCompany.debt && parseFloat(publicCompany.debt)) || 0;
      var minority_int = (publicCompany.minority_int && parseFloat(company.minority_int)) || 0;
      var cash = (publicCompany.cash && parseFloat(company.cash)) || 0;
      var lt_invest = (publicCompany.lt_invest && parseFloat(company.lt_invest)) || 0;

      var equity_value = enterprise_value - debt - minority_int + cash + lt_invest;
      var share_price = equity_value / publicCompany.shares_out;

      return share_price;
    }

    return multiple * metric || undefined;
  }

  getCaption = (type, caseName) => {
    const { company, selectedMetric, selectedYear, selectedCategory, valuationCases, valuationCaseTickers } = this.state;
    var metric = this.getMetric();

    if (type === 'metric') {
      return (company && company.notes) || (!metric ? "Sorry we don't have any estimates for this company" : undefined);
    }

    var selectedCase = getCase(valuationCases, valuationCaseTickers, caseName);

    if (!selectedCase) {
      return undefined;
    }

    if (type === 'multiple') {
      return selectedCase.multiple ? (selectedCase.name.toProperCase() + (caseName === 'base' ? " of median and high multiples" : "") + " for " + selectedCategory.toProperCase()+" comps") : (selectedCase.name+"'s "+getFormattedMetric(selectedMetric, selectedYear)+" multiple");
    }

    var multiple = selectedCase.multiple || calcMultiples(selectedCase, selectedMetric, selectedYear);
    if (type === 'valuation') {
      return selectedCase.multiple ? 
              "Valuation based on "+getFormattedMetric(selectedMetric, selectedYear)+" of $"+(formatMetric(metric))+formatSuffix(metric)+" and " + selectedCategory.toProperCase() + " " + selectedCase.name.toProperCase() + (caseName === 'base' ? " (of median and high) of " : " multiple of ") +(formatMultiple(multiple))+"x" :
              "Valuation based on "+getFormattedMetric(selectedMetric, selectedYear)+" of $"+(formatMetric(metric))+formatSuffix(metric)+" and " + selectedCase.name.toProperCase() + "'s multiple of "+(formatMultiple(multiple))+"x";
    }
  }

  getPublicCaption = () => {
    const { publicCompany } = this.state;

    return publicCompany && (publicCompany.name + "'s current stock price is: $" + publicCompany.last_price.toFixed(2)); 
  }

  getName = (type) => {
    const { valuationCases, valuationCaseTickers } = this.state;
    var selectedCase = getCase(valuationCases, valuationCaseTickers, type);

    return selectedCase ? selectedCase.name : '';
  }

  render() {
    const { company, selectedMetric, selectedYear, selectedCategory, error, isPublic } = this.state;

    if (error) {
      return (<ErrorMessage message="Sorry! We are not tracking this startup yet. Send us an email or try another" />);
    }

    return (
    <div>
      <Helmet>
        <title>{!company ? "Valuation Analysis" : company.name}</title>
        <meta name="description" content={"Private Company Valuation Analysis" + !company ? "" : company.name} />          
      </Helmet>
    	<CompanyCard  company={company} />

      <CaseSummary  getEstimate={ this.getEstimate }
                    getCaption = { this.getCaption }
                    getName = { this.getName }
                    setMultiple={this.setMultiple}
                    getPublicCaption = { this.getPublicCaption }
                    isPublic={isPublic}
                    />

      <ValuationSummary multiple={ this.getMultiple('base') }
                        metric={ this.getMetric() } 
                        setMetric={this.setMetric} 
                        setMultiple={this.setMultiple} 
                        selectedMetric={selectedMetric} 
                        selectedYear={selectedYear}
                        getCaption={this.getCaption}
                        source1={!company ? undefined : company.source1 }
                        />

    	<CompanyComps compSet={this.state.compSet} 
                    setMultipleRange={this.setMultipleRange} 
                    selectedMetric={selectedMetric} 
                    selectedYear={selectedYear} 
                    selectedCategory={selectedCategory}
                    handleChange={this.handleChange} 
                    categories={!company ? undefined : sortCategories(company.category) } 
                    updateCompSet={this.getComps}
                    />

      <SimilarStartups category={selectedCategory}
                       title='Private Comparables'
                       getQuery={this.props.getQuery}
                    />                    
    </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(CompanyDetails);