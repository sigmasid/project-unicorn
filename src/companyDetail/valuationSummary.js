import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Popover from 'material-ui/Popover';
import Typography from 'material-ui/Typography';
import { findDOMNode } from 'react-dom';
import { Link } from 'react-router-dom';

import {pink, lightBlue} from 'material-ui/colors';
import Grid from 'material-ui/Grid';
import Card, { CardContent, CardHeader } from 'material-ui/Card';
import Icon from 'material-ui/Icon';
import SvgIcon from 'material-ui/SvgIcon';
import NumberFormat from 'react-number-format';
import Tooltip from 'material-ui/Tooltip';

import { getFormattedMetric, formatMetric, formatSuffix, parseValue, formatMultiple } from '../shared/sharedFunctions.js';

//const util = require('util'); //print an object

const styles = theme => ({
  card: {
    margin: 20
  },
  changeInput: {
    color: lightBlue[500]
  },
  header: {
  	textAlign: 'left'
  },
  content: {
    textAlign: 'center'
  },
  info: {
    width: 15,
    height: 'auto'
  },
  cardActionsXL: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    },
  },
  cardActionsMD: {
    [theme.breakpoints.up('lg')]: {
      display: 'none'
    },
  },
  mathSymbols: {
  	display: 'flex',
  	alignItems: 'center',
  	alignSelf: 'center',
  	margin: '0 auto'
  },
  valItem: {
  	alignSelf: 'center'
  },
  source: {
    maxWidth: '50%'
  },
  sourceWrapper: {
    padding: '10px'
  },
  sourceLink: {
    color: theme.palette.primary.light,
    cursor: 'pointer' 
  },
  formControl: {
    margin: theme.spacing.unit * 2,
  },
  withoutLabel: {
    marginTop: theme.spacing.unit * 3,
  },
  inputLabelFocused: {
    color: pink[500],
  },
  inputInkbar: {
    '&:after': {
      backgroundColor: pink[500],
    },
  },
});

class NumberFormatCustom extends React.Component {
  render() {
    return (
      <NumberFormat
        {...this.props}
        onValueChange={values => {
          this.props.onChange({
            target: {
              value: values.value,
            },
          });
        }}
        thousandSeparator
      />
    );
  }
}

NumberFormatCustom.propTypes = {
  onChange: PropTypes.func.isRequired,
};

const EqualIcon = props => (
  <SvgIcon {...props}>
    <path d="M19,10H5V8H19V10M19,16H5V14H19V16Z" />
  </SvgIcon>
);

class ValuationSummary extends React.Component {

  constructor (props) {
    super(props);
    const { lowMultiple, highMultiple, metric, lastValuation } = props;

    this.state = {
      mode: 0,
      currentlyOpen: null,
      anchorEl: null,
      metric: metric || 0,
      lowMultiple: lowMultiple || 0,
      highMultiple: highMultiple || 0
    };

    this.props.setValuation(this.calcValuation(lowMultiple, highMultiple, metric), this.calcImpliedMetric(lowMultiple, highMultiple, lastValuation), this.calcMultipleMidpoint(lowMultiple, highMultiple));
  }

  componentWillReceiveProps(nextProps) {
    var shouldUpdate = false;

    if (nextProps.lowMultiple !== this.props.lowMultiple) {
      shouldUpdate = true;
    } else if (nextProps.highMultiple !== this.props.highMultiple) {
      shouldUpdate = true;      
    } else if (nextProps.metric !== this.props.metric) {
      shouldUpdate = true;      
    }

    if (shouldUpdate) {
      this.setState({
        metric: nextProps.metric || 0,
        lowMultiple: nextProps.lowMultiple || 0,
        highMultiple: nextProps.highMultiple || 0
      });

      this.props.setValuation(this.calcValuation(nextProps.lowMultiple, nextProps.highMultiple, nextProps.metric), this.calcImpliedMetric(nextProps.lowMultiple, nextProps.highMultiple, nextProps.lastValuation), this.calcMultipleMidpoint(nextProps.lowMultiple, nextProps.highMultiple));
    }
  }

  calcMultipleMidpoint(lowMultiple, highMultiple) {
    return (!isNaN(lowMultiple) && !isNaN(highMultiple)) ? ((parseFloat(lowMultiple) + parseFloat(highMultiple)) / 2).toFixed(1) : 0;
  }

  calcValuation(lowMultiple, highMultiple, metric) {
    var lowValuation = (!isNaN(lowMultiple) && !isNaN(metric)) ? (lowMultiple * metric) : 0;
    var highValuation = (!isNaN(highMultiple) && !isNaN(metric)) ? (highMultiple * metric) : 0;

    if (!isNaN(lowValuation) && !isNaN(highValuation)) {
      return (lowValuation + highValuation) / 2;
    }

    return undefined;
  }

  calcImpliedMetric(lowMultiple, highMultiple, valuation) {
    var multipleMidpoint = (parseFloat(lowMultiple) + parseFloat(highMultiple)) / 2;
    return (valuation / multipleMidpoint);
  }

  handleChange = prop => event => {
    var metric = prop === 'metric' ? event.target.value : this.state.metric; //formatter addes a comma - remove that
    var lowMultiple = prop === 'lowMultiple' ? event.target.value : this.state.lowMultiple;
    var highMultiple = prop === 'highMultiple' ? event.target.value : this.state.highMultiple;

  	this.setState({
  		[prop]: event.target.value
  	})
    this.props.setValuation(this.calcValuation(lowMultiple, highMultiple, parseValue(metric)), 
                            this.calcImpliedMetric(lowMultiple, highMultiple, this.props.lastValuation), 
                            this.calcMultipleMidpoint(lowMultiple, highMultiple),
                            prop === 'metric' ? parseValue(metric) : this.state.metric);
  };

  reset = () => {
    this.setState({ 
      metric: this.props.metric,
      lowMultiple: !isNaN(this.props.lowMultiple) ? this.props.lowMultiple : 0,
      highMultiple: !isNaN(this.props.highMultiple) ? this.props.highMultiple : 0
    });
  }

  handleClickButton = (type) => {
    this.setState({
      currentlyOpen: type,
      anchorEl: (type === 'source' ? findDOMNode(this.sourceButton) : type === 'low' ? findDOMNode(this.lowButton) : findDOMNode(this.highButton))
    });
  };

  handleClose = () => {
    this.setState({
      currentlyOpen: null
    });
  };

  sourceButton = null;
  lowButton = null;
  highButton = null;

  changeMode = () => {
    this.setState({ 
      mode: this.state.mode === 0 ? 1 : 0
    });
  }

  helperText = () => {
    var lowMultipleText = "Median of the selected comp range";
    var highMultipleText = "Highest multiple from the selected comp range.";
    var sourceText = this.props.notes || (!this.props.metric ? "Sorry we don't have any estimates for this company" : undefined);

    return this.state.currentlyOpen === 'source' ? sourceText : (this.state.currentlyOpen === 'low' ? lowMultipleText : highMultipleText);
  }

  helpLink = () => {
    return (this.state.currentlyOpen === 'source' && this.props.source1) ? this.props.source1 : undefined;
  };

  render() {
    const { classes, selectedMetric, selectedYear } = this.props;
    const { lowMultiple, highMultiple, mode, metric } = this.state;

    var lowValue = mode === 0 ? lowMultiple * parseValue(metric) : this.props.lastValuation / highMultiple;
    var highValue = mode === 0 ? highMultiple * parseValue(metric) : this.props.lastValuation / lowMultiple;
    var firstValue = mode === 0 ? metric : this.props.lastValuation.toFixed(1) ;

    var showEstimate =  <Popover
                          open={this.state.currentlyOpen !== null}
                          anchorEl={this.state.anchorEl}
                          anchorReference='anchorEl'
                          onClose={this.handleClose}
                          anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                          }}
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                          }}
                          elevation={2}
                          className={this.state.currentlyOpen === 'source' ? classes.source : classes.multiples }
                        >
                          <div className={classes.sourceWrapper}>
                            <Typography className={classes.typography} color={'textSecondary'} variant={'caption'} gutterBottom={true} >{ this.helperText() }</Typography>
                            {this.helpLink() ? 
                              <Typography className={classes.typography} color={'secondary'} variant={'caption'} component={Link} to={this.props.source1} target="_blank">
                                Reference
                              </Typography> : null
                            }
                          </div>
                        </Popover>
    return (
      <Card className={classes.card}>
        <CardHeader 
          title={this.state.mode === 0 ? "Valuation Summary" : "Implied Metrics"}
          subheader="$ in M(illions) / B(illions)" 
          className={classes.header}
          action={
          <div className={classes.cardActionsXL}>
            <Button onClick={this.changeMode} >{mode === 0 ? "show implied metrics" : "show valuation summary"}</Button>
            <Button onClick={this.reset}>reset</Button>
          </div>
        }/>   
        <CardContent className={classes.content}>
          <div className={classes.cardActionsMD}>
            <Button onClick={this.changeMode} >{mode === 0 ? "show implied metrics" : "show valuation summary"}</Button>
            <Button onClick={this.reset}>reset</Button>
          </div>
	        <Grid container spacing={24} className={classes.content}>
	          <Grid item md={3} xs={12} className={classes.valItem}>
                <Tooltip
                  id="tooltip-icon"
                  title="enter millions or billions as decimals"
                  enterDelay={300}
                  leaveDelay={300}
                  placement="top-start"
                >
	            <FormControl className={classes.formControl}>
			          <InputLabel htmlFor="amount">{mode === 0 ? getFormattedMetric(selectedMetric, selectedYear) : "Last Valuation"}</InputLabel>
			          <Input
			            id="adornment-amount"
                  disabled={mode === 0 ? false : true }
                  inputComponent={NumberFormatCustom}
			            value={ formatMetric(firstValue, true) }
			            onChange={mode === 0 ? this.handleChange('metric') : null}
                  className={classes.changeInput}
			            startAdornment={<InputAdornment position="start">$</InputAdornment>}
                  endAdornment={<InputAdornment position="end">{formatSuffix(parseValue(firstValue)) }</InputAdornment>}
			          />
			  	      <FormHelperText id="weight-helper-text" onClick={() => this.handleClickButton('source')} ref={node => { this.sourceButton = node;}} className={classes.sourceLink} >
                  {mode === 0 ? 'where is this from?' : this.props.lastValuationDate}
                </FormHelperText>
                { showEstimate }
			        </FormControl>
              </Tooltip>
	          </Grid>
	          <Icon color="inherit" style={{ fontSize: 36 }} className={classes.mathSymbols} >close</Icon>
	          <Grid item md={4} xs={12}>
                <Tooltip
                  id="tooltip-icon"
                  title="enter multiple to update valuation"
                  enterDelay={300}
                  leaveDelay={300}
                  placement="top-start"
                >
			    		<FormControl className={classes.formControl}>
			          <InputLabel htmlFor="amount">Comps Multiple Range</InputLabel>
			          <Input
			            id="adornment-amount"
                  placeholder={lowMultiple.toString()}
			            value={formatMultiple(lowMultiple, true)}
			            onChange={this.handleChange('lowMultiple')}
                  className={classes.changeInput}
			            endAdornment={<InputAdornment position="end">x</InputAdornment>}
			          /> 
				      	<FormHelperText id="weight-helper-text" onClick={() => this.handleClickButton('low')} ref={node => { this.lowButton = node;}} className={classes.sourceLink}>
                  median
                </FormHelperText>
		        	</FormControl>
              </Tooltip>
              <Tooltip
                id="tooltip-icon"
                title="enter multiple to update valuation"
                enterDelay={300}
                leaveDelay={300}
                placement="top-start"
              >
			    		<FormControl className={classes.formControl}>
			          <Input
			            id="adornment-amount"
                  placeholder={highMultiple.toString()}
			            value={ formatMultiple(highMultiple, true) }
			            onChange={this.handleChange('highMultiple')}
                  className={classes.changeInput}
			            endAdornment={<InputAdornment position="end">x</InputAdornment>}
			          />
				      	<FormHelperText id="weight-helper-text" onClick={() => this.handleClickButton('high')} ref={node => { this.highButton = node;}} className={classes.sourceLink}>
                  high
                </FormHelperText>
		        	</FormControl>
              </Tooltip>
	          </Grid>
	          <EqualIcon color="inherit" style={{ width: 36, height: 36 }} className={classes.mathSymbols} />
	          <Grid item md={4} xs={12}>
							<FormControl className={classes.formControl}>
			          <InputLabel htmlFor="amount">{mode === 0 ? "Implied Valuation Range" : "Implied " + getFormattedMetric(this.props.selectedMetric, this.props.selectedYear)}</InputLabel>
			          <Input
			            id="adornment-amount"
			            disabled={true}
                  inputComponent={NumberFormatCustom}
			            value={ formatMetric(lowValue) }
			            onChange={this.handleChange('amount')}
			            startAdornment={<InputAdornment position="start">$</InputAdornment>}
                  endAdornment={<InputAdornment position="end">{formatSuffix(lowValue)}</InputAdornment>}
			          />
				      	<FormHelperText id="weight-helper-text">median</FormHelperText>
		        	</FormControl>
							<FormControl className={classes.formControl}>
			          <Input
			            id="adornment-amount"
			            disabled={true}
			            value={formatMetric(highValue)}
                  inputComponent={NumberFormatCustom}
			            onChange={this.handleChange('amount')}
			            startAdornment={<InputAdornment position="start">$</InputAdornment>}
                  endAdornment={<InputAdornment position="end">{formatSuffix(highValue)}</InputAdornment>}
			          />
				      	<FormHelperText id="weight-helper-text">high</FormHelperText>
		        	</FormControl>
	          </Grid>    
	        </Grid>
       </CardContent>
      </Card>
    );
  }
}


ValuationSummary.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ValuationSummary);