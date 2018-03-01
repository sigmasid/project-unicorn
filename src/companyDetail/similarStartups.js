import React from 'react';
import * as firebase from "firebase";
import firestore from "firebase/firestore";
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardContent, CardHeader } from 'material-ui/Card';
import NumberFormat from 'react-number-format';
import Loading from '../shared/loading.js';
import GridList, { GridListTile, GridListTileBar } from 'material-ui/GridList';
import { Link } from 'react-router-dom';

//const util = require('util'); //print an object

const styles = theme => ({
  card: {
    margin: 20
  },
  tileBar: {
    height: '100%',
    marginTop: '10px',
    alignSelf: 'start',
    alignItems: 'start'
  }
});

class SimilarStartups extends React.Component {
  constructor (props) {
    super(props);
    this.state = { compSet: undefined };

    var category = props.category;
    this.getCategory = this.getCategory.bind(this);

    if (category !== undefined) {
      this.getCategory(category);
    }
  }

  componentWillReceiveProps(nextProps) {
    var category = nextProps.category;
    if (category !== this.state.category) {
      this.getCategory(category);
    }
  }

  getCategory(category) {
    var db = firebase.firestore();
    var compsRef = db.collection('private').where('category.'+category, '==', true);

    compsRef.get()
    .then(snapshot => {
        var compsList = [];
        snapshot.forEach(doc => {
          compsList.push(doc.data());
        });
        this.setState({ 
          compSet: compsList, 
          category: category
        });
    })
    .catch(err => {
      this.setState({ 
        compSet: undefined, 
        category: undefined
      });
    });
  }

  getFormattedValuation = (valuation) => {
    if (!valuation) {
      return null;
    }
    
    const lastValuation = valuation >= 1000 ? (valuation / 1000).toFixed(1) : valuation;
    const suffix = valuation >= 1000 ? 'B' : 'M';    
    return(<NumberFormat value={lastValuation} displayType={'text'} thousandSeparator={true} prefix={'$'} suffix={suffix} />);
  }

  render() {
    const { classes, title, category } = this.props;

    return (
      <div>
        <Card className={classes.card}>
          <CardHeader 
            title={title || "Private Comparables"}
            subheader={category !== undefined ? category.toProperCase() : null}
            className={classes.header}             
          /> 
          <CardContent className={classes.content}>
          <GridList cellHeight={150} className={classes.gridList} cols={window.innerWidth < 960 ? 2 : 6}>
            { this.state.compSet !== undefined ? this.state.compSet.map(startup => (
            <GridListTile key={startup.ticker} className={classes.tile} component={Link} to={'/c/'+startup.ticker}>
              <img src={startup.logo} alt={startup.name} />
              <GridListTileBar
                className={classes.tileBar}
                title={startup.name}
                subtitle={<span>Last Round: {this.getFormattedValuation(startup.lastValuation)}</span>}
              />
            </GridListTile>
            )) : <Loading />} 
          </GridList>
          </CardContent>
        </Card>
      </div>
    );
  }
}

SimilarStartups.propTypes = {
  classes: PropTypes.object.isRequired
};


export default withStyles(styles, { withTheme: true })(SimilarStartups);