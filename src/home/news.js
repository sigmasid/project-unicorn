import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {Helmet} from "react-helmet";

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import classNames from 'classnames';
import Divider from '@material-ui/core/Divider';

import NavigateNext from '@material-ui/icons/OpenInNew';
import Loading from '../shared/loading.js';

import ReactGA from 'react-ga';
import Icons from '../shared/icons.js';

//const util = require('util'); //print an object
const moment = require('moment');
const he = require('he');

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
    backgroundColor: theme.palette.background.default,
    marginRight: 18,
    color: 'black',
    fontSize: '1rem',
    [theme.breakpoints.down('md')]: {
      display: 'none',
      marginRight: 0
    }
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
  },
  newsItem: {
    display: 'flex',
    paddingTop: 18,
    paddingBottom: 18,
    [theme.breakpoints.down('md')]: {
      paddingTop: 12,
      paddingBottom: 12,
      display: 'block'
    }
  },
  newsSource: {
    width: '10%',
    flex: '0 0 auto',
    [theme.breakpoints.down('md')]: {
      paddingLeft: 0,
      width: '100%'
    }    
  },
  newsDetails: {
    width: '70%',
    [theme.breakpoints.down('md')]: {
      width: '100%',
      paddingLeft: 0
    }

  },
  newsSourcePrimary: {
    [theme.breakpoints.down('md')]: {
      color: theme.palette.text.secondary
    }
  },
  newsSecondary: {
    maxHeight: '6em',
    overflow: 'hidden',
    display: '-webkit-box',
    webkitLineClamp: 3,
    webkitBoxOrient: 'vertical',
    textOverflow: 'ellipsis',
    [theme.breakpoints.down('md')]: {
      display: 'none'
    },
  },
  newsLink: {
    color: theme.palette.primary.main
  },
});


const FilterDescription = (description) => {
  var html = "<p>"+he.decode(description)+"</p>";
  var div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};

const NewsDetail = (props) => {
  var {classes, newsItems} = props;

  if (!newsItems) {
    return <Loading />
  }

  return (
    <List className={classes.tickerList}>
      { newsItems.map( (obj, index) => {

        return(
        <div key={index}>
        <ListItem key={index} className={classes.newsItem} >
          <Avatar className={classes.avatar}>{index + 1}</Avatar>
          <ListItemText className={classes.newsDetail} primary={obj.title} secondary={FilterDescription(obj.description)}  classes={{root: classes.newsDetails, secondary: classes.newsSecondary}}/>                
          <ListItemText primary={obj.source} secondary={moment(obj.created).format("MMMM D - h:mma")} classes={{root: classes.newsSource, primary: props.classes.newsSourcePrimary }} />          
          <ListItemSecondaryAction>
            <ReactGA.OutboundLink eventLabel={obj.link} to={obj.link} target="_blank" className={classes.newsLink}>
              <NavigateNext className={classes.navigateNext} />
            </ReactGA.OutboundLink>
          </ListItemSecondaryAction>
        </ListItem>
        <Divider />
        </div>
        )
      })
      }
    </List>
  )
};

const NewsChips = (props) => {
  var {classes, sectors, handleChange, selectedSectorName} = props;

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

class News extends React.Component {
  state = { };

  constructor (props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.getSectorNews = this.getSectorNews.bind(this);
    this.filterSectors = this.filterSectors.bind(this);
  }

  componentDidMount() {
    if (!this.props.sectorsObj) {
      this.props.getSectors();
    } else {
      this.filterSectors(this.props.sectorsObj);
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!prevProps.sectors && this.props.sectorsObj) {
      this.filterSectors(this.props.sectorsObj);
    }
  }

  handleChange = (sectorName) => {
    if (this.state.selectedSectorName !== sectorName) {
      this.getSectorNews(sectorName);
    }
  };

  filterSectors = (obj) => {
    //add top stories and markets to sectorsobj
    var sectorsObj = obj;

    sectorsObj['markets'] = { 'logo': '📈', 'rank': 0.5 }
    sectorsObj['top stories'] = { 'logo': '💯', 'rank': 0 }

    var sorted = Object.keys(sectorsObj).sort((a, b) => { return sectorsObj[a].rank - sectorsObj[b].rank  });
    this.setState({ sectors: sorted, sectorsObj: sectorsObj });
    this.handleChange(sorted[0]);
  };

  getSectorNews(type) {
    var category = type.toLowerCase();
    this.setState({loading: true, newsItems: undefined}); //maybe save to cache
    var self = this;

    var url = 'https://us-central1-project-unicorn-24dcc.cloudfunctions.net/getNews';
    fetch(url, { 
        method: 'POST',
        body:    category,
    })
    .then(res => res.json())
    .then(json => {
      self.setState({newsItems: json.items, selectedSectorName: type, loading: undefined});
    })
    .catch(err => {
      self.setState({error: err, newsItems: undefined, loading: undefined});
    }); 
  }

  render() {
    const { classes } = this.props;
    const { selectedSectorName, newsItems, sectors, sectorsObj } = this.state;

    return (
      <div className={classes.root}>
        <Helmet>
          <title>Market News</title>
          <meta name="description" content={"Discover top business and financial headlines by sector"} />          
        </Helmet>        
        <Paper className={classes.header} >
          <Typography variant="display3" className={classes.titleText}>
            News
          </Typography>
          { sectors && <NewsChips classes={classes} sectors={sectors} handleChange={this.handleChange} selectedSectorName={selectedSectorName} sectorsObj={sectorsObj} />}
        </Paper>

        <Paper className={classes.lists} >
          <NewsDetail classes={classes} newsItems={newsItems} />
        </Paper>          
      </div>
    );
  }
}

News.propTypes = {
  classes: PropTypes.object.isRequired,
  sectors: PropTypes.array,
  sectorsObj: PropTypes.object
};

export default withStyles(styles)(News);