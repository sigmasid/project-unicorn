import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardContent, CardHeader } from 'material-ui/Card';
import Loading from '../shared/loading.js';
import Avatar from 'material-ui/Avatar';
import NavigateNext from 'material-ui-icons/OpenInNew';
import List, { ListItem, ListItemText, ListItemSecondaryAction } from 'material-ui/List';
import Divider from 'material-ui/Divider';

const moment = require('moment');
var ReactGA = require('react-ga');
const util = require('util'); //print an object

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
      paddingLeft: 0
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
    color: theme.palette.accent
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
      { props.news.map(function(obj, index) {
        return(
        <div key={index}>
        <ListItem key={index} className={props.classes.newsItem} >
          <Avatar className={props.classes.avatar}>{index + 1}</Avatar>
          <ListItemText className={props.classes.newsDetail} primary={obj.headline} secondary={obj.summary}  classes={{root: props.classes.newsDetails, secondary: props.classes.newsSecondary}}/>                
          <ListItemText primary={obj.source} secondary={moment(obj.datetime, moment.HTML5_FMT.DATETIME_LOCAL_SECONDS ).format("MMM DD - H:MMa")} classes={{root: props.classes.newsSource, primary: props.classes.newsSourcePrimary }} />          
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

    console.log("news is "+util.inspect(news));

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