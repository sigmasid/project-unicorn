import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardContent, CardHeader } from 'material-ui/Card';
import GridList, { GridListTile, GridListTileBar } from 'material-ui/GridList';
import NumberFormat from 'react-number-format';
import Loading from '../shared/loading.js';
import Avatar from 'material-ui/Avatar';
import Moment from 'react-moment';
import classNames from 'classnames';
import Popover from 'material-ui/Popover';
import Typography from 'material-ui/Typography';
import { findDOMNode } from 'react-dom';
import { getFormattedMetric, formatMetric, formatSuffix } from '../shared/sharedFunctions.js';
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
  titleBar: {
    background: 'none',
    textAlign: 'center',
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
  subtitle: {
    color: theme.palette.primary.light,
    whiteSpace: 'normal',
    cursor: 'pointer'
  },
  subtitleNoLink: {
    color: 'rgba(0,0,0,0.54)',
    whiteSpace: 'normal'
  },
  sourceWrapper: {
    padding: '10px',
    maxWidth: '30%',
    textAlign: 'center'
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
    color: '#fff',
    backgroundColor: 'black',
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
    const { classes, company, puEstimate, impliedMetric, metric, multipleMidpoint, selectedCategory } = this.props;
    const lastValuation = company !== undefined ? company.lastValuation : undefined;

    const lastValuationDate = company !== undefined ? <Moment date={new Date(company.lastValuationDate - (25567 + 1))*86400*1000} format="MMM YYYY" /> : null;
    const puEstimateMethodology = "Valuation based on "+getFormattedMetric(this.props.selectedMetric, this.props.selectedYear)+" of $"+(formatMetric(metric))+formatSuffix(metric)+" and midpoint of "+selectedCategory+" comps of "+multipleMidpoint+"x (see details on estimate & mutliple ranges below)"
    const impliedMethodology = "What implied "+getFormattedMetric(this.props.selectedMetric, this.props.selectedYear)+" would need to be to justify current valuation of $"+formatMetric(lastValuation)+formatSuffix(lastValuation)+" based on midpoint of "+selectedCategory+" comps of "+multipleMidpoint+"x."

    if (company === undefined) {
      return <Loading />
    }
  
    var showMethodology = <Popover open={this.state.currentlyOpen !== null} anchorEl={this.state.anchorEl} anchorReference='anchorEl' onClose={this.handleClose}
                                  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                                  transformOrigin={{ vertical: 'bottom', horizontal: 'center'}}
                                  elevation={2}
                                  classes={{
                                    paper: classes.sourceWrapper
                                  }} >
                                    <Typography className={classes.typography} color={'textSecondary'} variant={'caption'} gutterBottom={true} >
                                      {this.state.currentlyOpen === 'estimate'  ? puEstimateMethodology : impliedMethodology }
                                    </Typography>
                        </Popover>;

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
          subheader={company.description}
          className={classes.header}             
        />
        <CardContent>
        <GridList cellHeight={window.innerWidth < 960 ? 150 : 180} className={classes.gridList} cols={window.innerWidth < 960 ? 3 : 6}>
          <GridListTile key={1} className={classes.statTile}>
            <Avatar className={classes.tileAvatar}>
              <NumberFormat value={formatMetric(lastValuation)} displayType={'text'} thousandSeparator={true} prefix={'$'} suffix={formatSuffix(lastValuation)} />
            </Avatar>
            <GridListTileBar
              title="Last Round"
              subtitle={lastValuationDate}
              classes={{
                root: classes.titleBar,
                title: classes.title,
                subtitle: classes.subtitleNoLink
              }}
            />
          </GridListTile>
          <GridListTile key={2} className={classes.statTile}>
            <Avatar className={classes.tileAvatar}>
              { puEstimate ? <NumberFormat value={formatMetric(puEstimate)} displayType={'text'} thousandSeparator={true} prefix={'$'} suffix={formatSuffix(puEstimate)}  /> : '-'}
            </Avatar>
            <GridListTileBar
              title="pu Estimate"
              id="estimate"
              ref={node => { this.estimateButton = node;}}
              subtitle={window.innerWidth < 960 ? "Learn More" : "how is this calculated?"}
              onClick={() => this.handleOpen('estimate')}
              classes={{
                root: classes.titleBar,
                title: classes.title,
                subtitle: classes.subtitle
              }}
            />
          </GridListTile>  
          <GridListTile key={3} className={classes.statTile}>
            <Avatar className={classes.tileAvatar}>
              { impliedMetric ? <NumberFormat value={formatMetric(impliedMetric)} displayType={'text'} thousandSeparator={true} prefix={'$'} suffix={formatSuffix(impliedMetric)}  /> : '-'}
            </Avatar>          
            <GridListTileBar
              title={"Implied "+getFormattedMetric(this.props.selectedMetric, this.props.selectedYear, true)}
              id="implied"
              ref={node => { this.impliedButton = node;}}
              subtitle={window.innerWidth < 960 ? "Learn More" : "how is this calculated?"}
              onClick={() => this.handleOpen('implied')}
              classes={{
                root: classes.titleBar,
                title: classes.title,
                subtitle: classes.subtitle
              }}
            />
          </GridListTile>
        </GridList>
        { showMethodology }
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