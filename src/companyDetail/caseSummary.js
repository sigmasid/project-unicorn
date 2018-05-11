import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardHeader, CardContent } from 'material-ui/Card';
import GridList, { GridListTile, GridListTileBar } from 'material-ui/GridList';
import NumberFormat from 'react-number-format';
import Avatar from 'material-ui/Avatar';
import classNames from 'classnames';
import Popover from 'material-ui/Popover';
import Typography from 'material-ui/Typography';
import { findDOMNode } from 'react-dom';
import { formatMetric, formatSuffix } from '../shared/sharedFunctions.js';
import { SnackbarContent } from 'material-ui/Snackbar';

//const util = require('util'); //print an object

const styles = theme => ({
  card: {
    margin: 20
  },
  header: {
  	textAlign: 'left'
  },
  titleBar: {
    background: 'none',
    textAlign: 'center',
    height: 100
  },
  title: {
    color: 'black',
    marginLeft: 0,
    marginRight: 0,
    whiteSpace: 'normal',
    lineHeight: 'inherit',
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.9rem'
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
    textAlign: 'center',
    width: '30%',
    [theme.breakpoints.down('md')]: {
      width: '75%'
    },
  },
  snackbar: {
    margin: '0 auto',
    marginTop: 30
  },
  gridList: {
    justifyContent: 'center'
  },
  tileWrapper: {
  	display: 'flex'
  },
  tileAvatar: {
    width: 100,
    height: 100,
    marginTop: 20,
    fontSize: '1.25rem',
    [theme.breakpoints.down('md')]: {
      width: 75,
      height: 75,
      fontSize: '1.0rem'
    },
    color: '#fff',
    backgroundColor: 'black',
    margin: '0 auto',
    alignSelf: 'center'
  },
  highlightTile: {
    width: 125,
    height: 125,
    marginTop: 0,
    fontSize: '1.25rem',
    [theme.breakpoints.down('md')]: {
      width: 90,
      height: 90,
      fontSize: '1.0rem' 
    },
  },
  valuationEmoji: {
  	fontSize: '2.5rem',
  	display: 'block',
  	paddingBottom: '0.25rem'
  }
});


class CaseSummary extends React.Component {
  constructor (props) {
    super(props);

    this.state = { 
      anchorEl: null,
      currentlyOpen: null,
    }

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleOpen = type => {
    this.setState({
      currentlyOpen: type,
      anchorEl: findDOMNode(type === 'bear' ? this.bearCaseButton : type === 'bull' ? this.bullCaseButton : this.baseCaseButton)
    });
  }

  handleClose = () => {
    this.setState({
      currentlyOpen: null,
      anchorEl: null
    });    
  }

  baseCaseButton = null;
  bearCaseButton = null;
  bullCaseButton = null;

  render() {
    const { classes, getEstimate, getName, getCaption, getPublicCaption, isPublic } = this.props;

    const bearEstimate = getEstimate('bear');
    const bullEstimate = getEstimate('bull');
    const baseEstimate = getEstimate('base');
  
    var showMethodology = <Popover 
  													open={this.state.currentlyOpen !== null} anchorEl={this.state.anchorEl} anchorReference='anchorEl' onClose={this.handleClose}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                            transformOrigin={{ vertical: 'bottom', horizontal: 'center'}}
                            elevation={2}
                            classes={{
                              paper: classes.sourceWrapper
                            }} >
                              <Typography className={classes.typography} color={'textSecondary'} variant={'caption'} gutterBottom={true} >
                                {getCaption('valuation',this.state.currentlyOpen)}
                              </Typography>
                        	</Popover>;
    
    var baseCaseTitle = <div><span className={classes.valuationEmoji} role="img" aria-label="base-valuation">🎯</span><span className={classes.compName}>Base Case</span></div>;
    var bullCaseTitle = <span><span className={classes.valuationEmoji} role="img" aria-label="bull-valuation">🐮</span><span className={classes.compName}>Bull Case</span></span>;
    var bearCaseTitle = <span><span className={classes.valuationEmoji} role="img" aria-label="bear-valuation">🐻</span><span className={classes.compName}>Bear Case</span></span>;


    var baseCaseName = <span className={classes.compName}>{getName('base').toProperCase()}</span>;
    var bullCaseName = <span className={classes.compName}>{getName('bull').toProperCase()}</span>;
    var bearCaseName = <span className={classes.compName}>{getName('bear').toProperCase()}</span>;

    return (
    <Card className={classes.card}>
	    <CardHeader 
	      title={ isPublic ? "Stock Price Scenarios" : "Valuation Scenarios" }
	      subheader= { isPublic ? "Share Price in $s" : "$ in M(illions) / B(illions)" }
	      className={classes.header}
	    /> 
	    <CardContent>
      <GridList cellHeight={window.innerWidth < 960 ? 200 : 250} className={classes.gridList} cols={window.innerWidth < 960 ? 3 : 6}>
        <GridListTile key={1} className={classes.statTile}>
        	<div className={classes.tileWrapper}>
          <Avatar className={classes.tileAvatar}>
            { bearEstimate ? <NumberFormat value={formatMetric(bearEstimate)} displayType={'text'} thousandSeparator={true} prefix={'$'} suffix={isPublic ? '' : formatSuffix(bearEstimate)}  /> : '-'}
          </Avatar>
          <GridListTileBar
            title={bearCaseTitle}
            subtitle={bearCaseName}
            id="bear"
            onClick={() => this.handleOpen('bear')}
            ref={node => { this.bearCaseButton = node;}}
            classes={{
              root: classes.titleBar,
              title: classes.title,
              subtitle: classes.subtitle
            }}
          />
          </div>
        </GridListTile>
        <GridListTile key={2} className={classes.statTile}>
        	<div className={classes.tileWrapper}>
          <Avatar className={classNames(classes.tileAvatar, classes.highlightTile)}>
            { baseEstimate ? <NumberFormat value={formatMetric(baseEstimate)} displayType={'text'} thousandSeparator={true} prefix={'$'} suffix={isPublic ? '' : formatSuffix(baseEstimate)}  /> : '-'}
          </Avatar>
          <GridListTileBar
            title={baseCaseTitle}
            subtitle={baseCaseName}
            id="base"
            ref={node => { this.baseCaseButton = node;}}
            onClick={() => this.handleOpen('base')}
            classes={{
              root: classes.titleBar,
              title: classes.title,
              subtitle: classes.subtitle
            }}
          />
          </div>
        </GridListTile>
        <GridListTile key={3} className={classes.statTile}>
        	<div className={classes.tileWrapper}>
          <Avatar className={classes.tileAvatar}>
            { bullEstimate ? <NumberFormat value={formatMetric(bullEstimate)} displayType={'text'} thousandSeparator={true} prefix={'$'} suffix={isPublic ? '' : formatSuffix(bullEstimate)}  /> : '-'}
          </Avatar>
          <GridListTileBar
            title={bullCaseTitle}
            subtitle={bullCaseName}
            id="bull"
            ref={node => { this.bullCaseButton = node;}}
            onClick={() => this.handleOpen('bull')}
            classes={{
              root: classes.titleBar,
              title: classes.title,
              subtitle: classes.subtitle
            }}
          />
          </div>
        </GridListTile>   
      </GridList>
      { showMethodology }
      { isPublic && <SnackbarContent className={classes.snackbar} message={getPublicCaption()} action={"💡"}/>}
    </CardContent>
   	</Card>
    );
  }
}

CaseSummary.propTypes = {
  classes: PropTypes.object.isRequired
};


export default withStyles(styles, { withTheme: true })(CaseSummary);