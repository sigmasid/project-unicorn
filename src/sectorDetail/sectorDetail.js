import React from 'react';
import { withStyles } from 'material-ui/styles';
import * as firebase from "firebase";
import firestore from "firebase/firestore";

import SectorCard from './sectorCard.js';
import SectorStats from './sectorStats.js';
import CompanyComps from '../companyDetail/companyComps.js';
import SimilarStartups from '../companyDetail/similarStartups.js';
import ErrorMessage from '../shared/errorMessage.js';
import {Helmet} from "react-helmet";

//const util = require('util'); //print an object

const styles = theme => ({
});

class SectorDetails extends React.Component {
  constructor (props) {
    super(props);

    var sectorID = (props.match.params.sectorid).replace(/-/g, " ");

    this.state = {
      isLoading: true,
      selectedMetric: 'rev',
      selectedYear: 'cy1',
      sectorID: sectorID
    }

    this.setValuation = this.setValuation.bind(this);
    this.setMultiples = this.setMultiples.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.getComps = this.getComps.bind(this);

    if (sectorID !== undefined) {
      this.getCategory(sectorID);
    }
  }

  componentWillReceiveProps(nextProps) {
    var sectorID = (nextProps.match.params.sectorid).replace(/-/g," ");
    
    if (sectorID !== this.props.sectorID) {
      this.getCategory(sectorID);
    }
  }

  getCategory(sectorID) {
    var db = firebase.firestore();
    var sectorRef = db.collection('categories').doc(sectorID);
    return sectorRef.get()
    .then(doc => {
      if (doc.exists) {
        var sector = doc.data();
        var category = sector.type !== undefined ? Object.keys(sector.type)[0] : undefined;

        this.setState({
          sector: sector,
          sectorID: sectorID,
          selectedCategory: category,
          error: undefined
        })

        if (category !== undefined) {
          this.getComps(category);
        }
      } else {
        this.setState({
          error: 'invalid'
        })
      } 
    })
    .catch(err => {
      this.setState({
        error: 'invalid'
      })
    });    
  }

  handleDelete = comp => () => {
    //handle comp delete
    const compToDelete = this.state.compSet.indexOf(comp);
    var compCopy = this.state.compSet.slice();
    compCopy.splice(compToDelete, 1);
    
    this.setState({ 
      compSet: compCopy
    });
  };

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
    })
    .catch(err => {
      this.setState({ 
        compSet: undefined, 
        selectedCategory: undefined
      });
    });
  }

  handleChange(name, value) {
    this.setState({
      [name]: value
    });
  };

  setValuation(valuation) {
		this.setState({ puEstimate: valuation });
  }

  setMultiples(low, high) {
  	this.setState({
    	lowMultiple: low,
    	highMultiple: high
  	});
  }

 render() {
    const { sector, compSet, selectedCategory, error } = this.state;

    if (error) {
      return (<ErrorMessage message="Sorry, we are not tracking this sector yet! Please try another" />);
    }

    return (
    <div>
      <Helmet>
        <title>{this.state.sectorID.toProperCase()}</title>
        <meta name="description" content={"Valuation & Operating Analysis  for " + this.state.sectorID.toProperCase()} />          
      </Helmet>
      <SectorCard sector={sector} 
                  categories={!sector ? undefined : sector.type} 
                  handleDelete={this.handleDelete}
                  updateCompSet={this.getComps}
                  selectedCategory={selectedCategory}
                  />

      <SectorStats compSet={compSet} />

    	<CompanyComps title={"Valuation Statistics"}
                    compSet={compSet} 
                    setMultiple={this.setMultiples} 
                    selectedMetric={this.state.selectedMetric} 
                    selectedYear={this.state.selectedYear} 
                    selectedCategory={selectedCategory}
                    handleChange={this.handleChange} 
                    />

      <SimilarStartups category={selectedCategory}
                       title='Selected Startups'
                    />                    
    </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(SectorDetails);