import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';

import Loading from '../shared/loading.js';
import Avatar from '@material-ui/core/Avatar';
import NavigateNext from '@material-ui/icons/OpenInNew';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import Divider from '@material-ui/core/Divider';

const moment = require('moment');
var ReactGA = require('react-ga');
//const util = require('util'); //print an object

const styles = theme => ({
  card: {
    margin: 20
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
  avatar: {
    marginRight: 18,
    [theme.breakpoints.down('md')]: {
      display: 'none',
      marginRight: 0
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
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  newsLink: {
    color: theme.palette.primary.main
  },
  header: {
    textAlign: 'left'
  }
});

const NewsItems = (props) => {
  if (!props.news) {
    return <Loading />
  }

  return (
    <List className={props.classes.tickerList}>
      { props.news.map( (obj, index) => {
        return(
        <div key={index}>
        <ListItem key={index} className={props.classes.newsItem} >
          <Avatar className={props.classes.avatar}>{index + 1}</Avatar>
          <ListItemText className={props.classes.newsDetail} primary={obj.headline} secondary={obj.summary}  classes={{root: props.classes.newsDetails, secondary: props.classes.newsSecondary}}/>                
          <ListItemText primary={obj.source} secondary={moment(obj.datetime, moment.HTML5_FMT.DATETIME_LOCAL_SECONDS ).format("MMMM D - h:mma")} classes={{root: props.classes.newsSource, primary: props.classes.newsSourcePrimary }} />          
          <ListItemSecondaryAction>
            <ReactGA.OutboundLink eventLabel={obj.url} to={obj.url} target="_blank" className={props.classes.newsLink}>
              <NavigateNext className={props.classes.navigateNext} />
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




class CompanyNews extends React.Component {

  render() {
    const { classes, news } = this.props;
    if (!news) {
      return <Loading />
    }

    return (
    <Card className={classes.card}>
      <CardHeader title={"Recent News"} classes={{root: classes.header}} />
      <CardContent>
        <NewsItems news={news} classes={classes}/>
      </CardContent>
    </Card>
    );
  }
}

CompanyNews.propTypes = {
  classes: PropTypes.object.isRequired
};


export default withStyles(styles, { withTheme: true })(CompanyNews);