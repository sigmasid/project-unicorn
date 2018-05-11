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

const util = require('util'); //print an object

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
      if (doc.data()) {
        var sector = doc.data();
        var category = undefined;
        const hashParts = window.location.hash.split('#');

        if (hashParts.length > 1 && Object.keys(sector.type).includes(hashParts[1].replace('-', ' '))) {
          const hash = hashParts[1].replace('-', ' ');
          category = hash;
        } else if (this.props.location.state && this.props.location.state.selectedCategory) {
          category = this.props.location.state.selectedCategory
        } else {
          category = Object.keys(sector.type)[0];
        }

        this.setState({
          sector: sector,
          sectorID: sectorID,
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
          selectedCategoryName: category
        });
    })
    .catch(err => {
      this.setState({ 
        compSet: undefined, 
        selectedCategoryName: undefined,
        error: 'invalid'
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
    const { sector, compSet, selectedCategoryName, error, sectorID } = this.state;

    if (error) {
      return (<ErrorMessage message="Sorry, we are not tracking this sector yet! Please try another" />);
    }
    return (
    <div>
      <Helmet>
        <title>{sectorID.toProperCase()}</title>
        <meta name="description" content={"Valuation & Operating Analysis  for " + sectorID.toProperCase()} />          
      </Helmet>
      <SectorCard sector={sector} 
                  categories={!sector ? undefined : sector.type} 
                  handleDelete={this.handleDelete}
                  updateCompSet={this.getComps}
                  selectedCategoryName={selectedCategoryName}
                  chipsOpen={this.props.location.state ? this.props.location.state.chipsOpen : false}
                  />

      <SectorStats compSet={compSet} />

    	<CompanyComps title={"Valuation Statistics"}
                    compSet={compSet} 
                    setMultiple={this.setMultiples} 
                    selectedMetric={this.state.selectedMetric} 
                    selectedYear={this.state.selectedYear} 
                    selectedCategoryName={selectedCategoryName}
                    handleChange={this.handleChange} 
                    />

      <SimilarStartups category={selectedCategoryName}
                       title='Selected Startups'
                    />                    
    </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(SectorDetails);