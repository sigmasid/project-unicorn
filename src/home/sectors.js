import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom'
import classNames from 'classnames';
import {Helmet} from "react-helmet";

import Loading from '../shared/loading.js';
import Icons from '../shared/icons.js';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import NavigateNext from '@material-ui/icons/NavigateNext';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';

import ReactGA from 'react-ga';

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
    background: 'white',
    color: 'black',
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

const SectorDetail = (classes, selectedSector, selectedSectorName) => {
  if (!selectedSector) {
    return <Loading />
  }

  return (
    <List className={classes.tickerList}>
      { Object.keys(selectedSector).map(function(sector) {

        var sectorLink = selectedSectorName === 'technology' ? sector.replace(/ /g,"-") : selectedSectorName.replace(/ /g,"-");
        var selectedSectorLink = selectedSectorName === 'technology' ? undefined : sector;
        var chipsOpen = selectedSectorName === 'technology' ? true : false;
        
        return(
        <Link to={{ pathname: '/sectors/'+sectorLink, state: { selectedCategory: selectedSectorLink, chipsOpen: chipsOpen } }} key={sector} className={classes.link} >
          <ListItem button key={sector} >
            <Avatar className={classes.avatar}>{typeof selectedSector[sector].logo === 'string' ? selectedSector[sector].logo : sector.charAt(0).toUpperCase()}</Avatar>
            <ListItemText primary={sector.toProperCase()} />
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

const SectorChips = (props) => {
  var {classes, sectors, handleChange, selectedSectorName } = props;

  return(
    <Paper className={classes.paper}>
    {sectors.map(sector => {
      return (
        <Chip key={sector} 
              onClick={() => handleChange(sector)} 
              label={sector.toProperCase()} 
              avatar={selectedSectorName === sector ? <Avatar className={classes.chipAvatar}>{Icons(sector)}</Avatar> : null}
              className={selectedSectorName === sector ? classNames(classes.selectedChip, classes.chip) : classes.chip} />
      );
    })}
  </Paper>
  );
}

class Sectors extends React.Component {
  state = {};

  constructor (props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.getSectorDetail = this.getSectorDetail.bind(this);
    //this.getIndices = this.getIndices.bind(this);

    if (!props.sectors) {
      props.getSectors();
    } else {
      this.getSectorDetail(props.sectors[0]);
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!prevProps.sectors && this.props.sectors) {
      this.getSectorDetail(this.props.sectors[0]);
    }
  }

  handleChange = (sectorName) => {
    if (this.state.selectedSectorName !== sectorName) {
      this.getSectorDetail(sectorName);
    }
  };

  getSectorDetail = (type) => {
    var self = this;

    this.props.getDoc('categories', type)
    .then( obj => {
      self.setState({  selectedSector: obj.type, selectedSectorName: type });
      ReactGA.event({
        category: 'Sectors',
        action: 'Selected Category',
        label: type
      });
    })
    .catch(err => {
      self.setState({ 
        selectedSector: undefined,
        selectedSectorName: undefined,
        error: err
      });
    });
  }

  render() {
    const { classes, sectors, sectorsObj } = this.props;
    const { selectedSector, selectedSectorName } = this.state;

    return (
      <div className={classes.root}>
        <Helmet>
          <title>Sector Watch</title>
          <meta name="description" content={"Get detailed valuation and financial analysis for top technology and non-technology sectors"} />          
        </Helmet>       
        <Paper className={classes.header} >
          <Typography variant="display3" className={classes.titleText}>
            Sectors
          </Typography>
          { sectors && <SectorChips classes={classes} sectors={sectors} handleChange={this.handleChange} selectedSectorName={selectedSectorName} sectorsObj={sectorsObj} />}
        </Paper>

        <Paper className={classes.lists} >
          { SectorDetail(classes, selectedSector, selectedSectorName) }
        </Paper>          
      </div>
    );
  }
}

Sectors.propTypes = {
  classes: PropTypes.object.isRequired,
  sectors: PropTypes.array,
  sectorsObj: PropTypes.object
};

export default withStyles(styles)(Sectors);