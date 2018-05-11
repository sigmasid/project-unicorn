import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemText, ListItemSecondaryAction } from 'material-ui/List';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import classNames from 'classnames';

import { Link } from 'react-router-dom'
import NavigateNext from 'material-ui-icons/NavigateNext';
import Loading from '../shared/loading.js';

import * as firebase from "firebase";
import firestore from "firebase/firestore";
import ReactGA from 'react-ga';

const util = require('util'); //print an object

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
  lists: {
    boxShadow: 'none',
    padding: 20,
    [theme.breakpoints.down('md')]: {
      padding: 10
    }
  },
  navigateNext: {
    color: theme.palette.primary
  },
  paper: {
    display: 'flex',
    justifyContent: 'end',
    flexWrap: 'wrap',
    padding: theme.spacing.unit / 2,
    boxShadow: 'none',
  },
  avatar: {
    backgroundColor: theme.palette.background.default
  },
  chipAvatar: {
    background: 'none',
    fontSize: '2rem'
  },
  emoji: {
    fontSize: '1.5rem'
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
    },
    [theme.breakpoints.down('md')]: {
      margin: theme.spacing.unit / 2,
      padding: theme.spacing.unit / 2,
    }
  },
  link: {
    textDecoration: 'none'
  }
});

const Categories = (classes, selectedCategory, selectedCategoryName) => {
  if (!selectedCategory) {
    return <Loading />
  }

  return (
    <List className={classes.tickerList}>
      { Object.keys(selectedCategory).map(function(category) {

        var categoryLink = selectedCategoryName === 'technology' ? category.replace(/ /g,"-") : selectedCategoryName.replace(/ /g,"-");
        var selectedCategoryLink = selectedCategoryName === 'technology' ? undefined : category;
        var chipsOpen = selectedCategoryName === 'technology' ? true : false;
        
        return(
        <Link to={{ pathname: '/sectors/'+categoryLink, state: { selectedCategory: selectedCategoryLink, chipsOpen: chipsOpen } }} key={category} className={classes.link} >
          <ListItem button key={category} >
            <Avatar className={classes.avatar}>{typeof selectedCategory[category].logo === 'string' ? selectedCategory[category].logo : category.charAt(0).toUpperCase()}</Avatar>
            <ListItemText primary={category.toProperCase()} />
            <ListItemSecondaryAction>           
              <Button mini aria-label="expand" className={classes.button} color="primary">
                <NavigateNext color={'primary'} />
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
        </Link>
        )
      })
      }
    </List>
  );
}

const CategoryChips = (classes, categories, handleClick, selectedCategoryName, categoriesObj) => {
  return(
    <Paper className={classes.paper}>
    {categories.map(category => {
      return (
        <Chip key={category} 
              onClick={() => handleClick(category)} 
              label={category.toProperCase()} 
              avatar={selectedCategoryName === category ? <Avatar className={classes.chipAvatar}>{categoriesObj[category].logo}</Avatar> : null}
              className={selectedCategoryName === category ? classNames(classes.selectedChip, classes.chip) : classes.chip} />
      );
    })}
  </Paper>
  );
}

class Explore extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      value: 0
    }

    this.handleChange = this.handleChange.bind(this);
    this.getCategories = this.getCategories.bind(this);
    this.getIndices = this.getIndices.bind(this);

    this.getIndices();
  }

  handleChange = (category) => {
    if (this.state.selectedCategory !== category) {
      this.getCategories(category);
    }
  };

  getCategories = (type) => {
    var db = firebase.firestore();
    var catRef = db.collection('categories').doc(type);

    catRef.get()
    .then(doc => {
        var catObj = doc.data();
        this.setState({  selectedCategory: catObj.type, selectedCategoryName: type });
        ReactGA.event({
          category: 'Explore',
          action: 'Selected Category',
          label: type
        });
    })
    .catch(err => {
      this.setState({ 
        selectedCategory: undefined,
        selectedCategoryName: undefined
      });
    });
  }

  getIndices = (type, value) => {
    var db = firebase.firestore();
    var indicesRef = db.collection('indices').doc('sectors');

    indicesRef.get()
    .then(doc => {
        var catObj = doc.data();
        var sorted = Object.keys(catObj).sort(function(a, b) { return catObj[a].rank - catObj[b].rank  });
        this.setState({ categories: sorted,
                        categoriesObj: catObj,
                        selectedCategoryName: sorted[0]
                      });
        this.getCategories(sorted[0]);
    })
    .catch(err => {
      this.setState({ 
        categories: undefined
      });
    });
  }

  render() {
    const { classes } = this.props;
    const { categories, categoriesObj, selectedCategory, selectedCategoryName } = this.state;

    return (
      <div className={classes.root}>
        <Paper className={classes.header} >
          <Typography variant="display3" className={classes.titleText}>
            Sectors
          </Typography>
          { categories && CategoryChips(classes, categories, this.handleChange, selectedCategoryName, categoriesObj )}
        </Paper>

        <Paper className={classes.lists} >
          { Categories(classes, selectedCategory, selectedCategoryName) }
        </Paper>          
      </div>
    );
  }
}

Explore.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Explore);