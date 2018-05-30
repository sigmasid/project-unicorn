import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import SectorCard from './sectorCard.js';
import SectorStats from './sectorStats.js';
import CompanyComps from '../companyDetail/companyComps.js';
import SimilarStartups from '../companyDetail/similarStartups.js';
import ErrorMessage from '../shared/errorMessage.js';
import {Helmet} from "react-helmet";

//const util = require('util'); //print an object

const styles = theme => ({
  root: {
    maxWidth: '100%'
  }
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

    return this.props.getDoc('categories',sectorID)
    .then(sector => {

      var category = undefined;
      const hashParts = window.location.hash.split('#');
      var sectorTypes = sector.type;

      var sorted = Object.keys(sectorTypes).sort((a, b) => { 
        return sectorTypes[a].rank ? sectorTypes[a].rank - sectorTypes[b].rank : sectorTypes[a];
      });

      if (hashParts.length > 1 && Object.keys(sector.type).includes(hashParts[1].replace('-', ' '))) {
        const hash = hashParts[1].replace('-', ' ');
        category = hash;
      } else if (this.props.location.state && this.props.location.state.selectedCategory) {
        category = this.props.location.state.selectedCategory
      } else {
        category = sorted[0];
      }

      this.setState({
        sector: sector,
        sorted: sorted,
        sectorID: sectorID,
        error: undefined
      })

      if (category !== undefined) {
        this.getComps(category);
      }
    })
    .catch(err => {
      this.setState({
        error: err
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

    this.props.getQuery('public','category.'+category,'==', true)
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
        error: err
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
    const { classes, location } = this.props;
    const { sector, compSet, selectedCategoryName, error, sectorID, sorted } = this.state;

    if (error) {
      return (<ErrorMessage message="Sorry, we are not tracking this sector yet! Please try another" />);
    }
    return (
    <div className={classes.root} >
      <Helmet>
        <title>{sectorID.toProperCase()}</title>
        <meta name="description" content={"Valuation & Operating Analysis  for " + sectorID.toProperCase()} />          
      </Helmet>
      <SectorCard sector={sector} 
                  categories={sector && sector.type} 
                  handleDelete={this.handleDelete}
                  updateCompSet={this.getComps}
                  selectedCategoryName={selectedCategoryName}
                  sorted={sorted}
                  chipsOpen={location.state ? location.state.chipsOpen : false}
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
                       getQuery={this.props.getQuery}
                    />                    
    </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(SectorDetails);