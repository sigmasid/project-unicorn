import React from 'react';
import { withStyles } from 'material-ui/styles';
import * as firebase from "firebase";
import firestore from "firebase/firestore";

import CompanyCard from './companyCard.js';
import ValuationSummary from './valuationSummary.js';
import CompanyComps from './companyComps.js';
import SimilarStartups from './similarStartups.js';
import ErrorMessage from '../shared/errorMessage.js';
import {Helmet} from "react-helmet";

//const util = require('util'); //print an object

const styles = theme => ({
});

class CompanyDetails extends React.Component {
  constructor (props) {
    super(props);

    var companyID = props.match.params.cid;

    this.state = {
      companyID: companyID,
      selectedMetric: 'rev',
      selectedYear: 'cy1'
    }

    this.setValuation = this.setValuation.bind(this);
    this.setMultiples = this.setMultiples.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getComps = this.getComps.bind(this);
    this.getCompany = this.getCompany.bind(this);

    if (companyID !== undefined) {
      this.getCompany(companyID);
    }
  }

  componentWillReceiveProps(nextProps) {
    var companyID = nextProps.match.params.cid;
    if (companyID !== this.state.companyID) {
      this.getCompany(companyID);
      window.scrollTo(0, 0);
    }
  }

  getCompany(id) {
    var db = firebase.firestore();
    var companyRef = db.collection('private').doc(id);

    companyRef.get()
    .then(doc => {
        if (doc.exists) {
          var company = doc.data();
          var category = company.category !== undefined ? Object.keys(company.category)[0] : undefined;

          this.setState({
            company: company,
            companyID: id,
            selectedCategory: category
          })

          if (category !== undefined) {
            this.getComps(category);
          }
        } else {
          this.setState({
            error: true
          })
        }
        return null;
    })
    .catch(err => {
      this.setState({
        error: true
      })
    });
  }

  getComps(category) {
    var db = firebase.firestore();
    var compsRef = db.collection('public').where('category.'+category, '==', true);

    compsRef.get()
    .then(snapshot => {
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

  handleChange(name, value) {
    this.setState({
      [name]: value
    });
  };

  setValuation(valuation, impliedMetric, multipleMidpoint) {
		this.setState({ puEstimate: valuation, impliedMetric: impliedMetric, multipleMidpoint: multipleMidpoint });
  }

  setMultiples(low, high) {
  	this.setState({
    	lowMultiple: low,
    	highMultiple: high
  	});
  }

  getMetric = () => {
  	if (this.state.company === undefined || this.state.company[this.state.selectedMetric+'_'+this.state.selectedYear] === undefined ) {
  		return undefined
  	}

  	return this.state.company[this.state.selectedMetric+'_'+this.state.selectedYear];
  }

 render() {
    const { company, selectedMetric, selectedYear, selectedCategory, error } = this.state;

    if (error) {
      return (<ErrorMessage message="Sorry! We are not tracking this startup yet. Send us an email or try another" />);
    }

    return (
    <div>
      <Helmet>
        <title>{!company ? "Valuation Analysis" : company.name}</title>
        <meta name="description" content={"Public Market Valuation Analysis" + !company ? "" : company.name} />          
      </Helmet>
    	<CompanyCard  company={company} 
                    puEstimate={this.state.puEstimate} 
                    impliedMetric={this.state.impliedMetric} 
                    selectedMetric={selectedMetric} 
                    selectedYear={selectedYear} 
                    metric={ this.getMetric() || undefined } 
                    multipleMidpoint={this.state.multipleMidpoint} 
                    selectedCategory={selectedCategory} />

      <ValuationSummary lowMultiple={ this.state.lowMultiple !== undefined ? this.state.lowMultiple.toFixed(1) : undefined }
                        highMultiple={ this.state.highMultiple !== undefined ? this.state.highMultiple.toFixed(1) : undefined } 
                        metric={ this.getMetric() || undefined } 
                        setValuation={this.setValuation} 
                        selectedMetric={selectedMetric} 
                        selectedYear={selectedYear}
                        lastValuation={!company ? undefined : company.lastValuation}
                        notes={!company ? undefined : company.notes } 
                        source1={!company ? undefined : company.source1 }
                        />

    	<CompanyComps compSet={this.state.compSet} 
                    setMultiple={this.setMultiples} 
                    selectedMetric={selectedMetric} 
                    selectedYear={selectedYear} 
                    selectedCategory={selectedCategory}
                    handleChange={this.handleChange} 
                    categories={!company ? undefined : company.category } 
                    updateCompSet={this.getComps}
                    />

      <SimilarStartups category={selectedCategory}
                       title='Private Comparables'
                    />                    
    </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(CompanyDetails);