import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardContent, CardHeader } from 'material-ui/Card';
import NumberFormat from 'react-number-format';
import Loading from '../shared/loading.js';
import Avatar from 'material-ui/Avatar';
import classNames from 'classnames';
import Typography from 'material-ui/Typography';
import { findDOMNode } from 'react-dom';
import { formatMetric, formatSuffix } from '../shared/sharedFunctions.js';
//const util = require('util'); //print an object

const styles = theme => ({
  card: {
    margin: 20
  },
  logoWrapper: {
    paddingTop: 20,
    width: '100%',
    textAlign: 'center'
  },
  header: {
    textAlign: 'center',
    maxWidth: '50%',
    margin: '0 auto',
    [theme.breakpoints.down('md')]: {
      margin: '0 auto',
      maxWidth: '100%'
    }
  },
  title: {
    color: 'black',
    marginLeft: 0,
    marginRight: 0,
    whiteSpace: 'normal',
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.9rem',
      lineHeight: '20px'
    },
  },
  description: {
    textAlign: 'center',
    maxWidth: '50%',
    margin: '0 auto',
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%'
    }    
  },
  gridList: {
    justifyContent: 'center'
  },
  tileAvatar: {
    width: 100,
    height: 100,
    [theme.breakpoints.down('md')]: {
      width: 75,
      height: 75
    },
    color: 'black',
    backgroundColor: 'white',
    margin: '0 auto'
  }
});


class CompanyIntro extends React.Component {
  constructor (props) {
    super(props);

    this.state = { 
      anchorEl: null,
      currentlyOpen: null
    }

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleOpen = type => {
    this.setState({
      currentlyOpen: type,
      anchorEl: findDOMNode(type === 'estimate' ? this.estimateButton : this.impliedButton)
    });
  }

  handleClose = () => {
    this.setState({
      currentlyOpen: null,
      anchorEl: null
    });    
  }

  impliedButton = null;
  estimateButton = null;

  render() {
    const { classes, company } = this.props;
    const lastValuation = company !== undefined ? company.lastValuation : undefined;

    if (company === undefined) {
      return <Loading />
    }

    var lastValuationText = <span className={classes.description}>Last Round: <NumberFormat value={formatMetric(lastValuation)} displayType={'text'} thousandSeparator={true} prefix={'$'} suffix={formatSuffix(lastValuation)} /></span>;

    return (
    <div>
      <Card className={classes.card}>
        <div className={classes.logoWrapper}>
          <Avatar
              alt="Company Logo"
              src={company.logo}
              className={classNames(classes.avatar, classes.tileAvatar)}
            />
        </div>
        <CardHeader 
          title={company.name.toProperCase()}
          subheader={lastValuationText}
          className={classes.header}             
        />
        <CardContent>
          <Typography className={classes.description}>{company.description}</Typography>
        </CardContent>
      </Card>
    </div>
    );
  }
}

CompanyIntro.propTypes = {
  classes: PropTypes.object.isRequired
};


export default withStyles(styles, { withTheme: true })(CompanyIntro);