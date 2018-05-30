import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';

import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { findDOMNode } from 'react-dom';
import { Link } from 'react-router-dom';

import {pink, lightBlue} from '@material-ui/core/colors';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';

import Icon from '@material-ui/core/Icon';
import SvgIcon from '@material-ui/core/SvgIcon';
import NumberFormat from 'react-number-format';
import Tooltip from '@material-ui/core/Tooltip';

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
    color: theme.palette.primary.main,
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

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      ref={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value,
          },
        });
      }}
      thousandSeparator
    />
  );
}

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
};

const EqualIcon = props => (
  <SvgIcon {...props}>
    <path d="M19,10H5V8H19V10M19,16H5V14H19V16Z" />
  </SvgIcon>
);

class ValuationSummary extends React.Component {

  constructor (props) {
    super(props);
    const { multiple, metric } = props;

    this.state = {
      currentlyOpen: null,
      anchorEl: null,
      metric: metric || 0,
      multiple: multiple || 0
    };
  }

  componentWillReceiveProps(nextProps) {
    var shouldUpdate = (nextProps.multiple !== this.props.multiple) || (nextProps.metric !== this.props.metric);

    if (shouldUpdate) {
      this.setState({
        metric: nextProps.metric || 0,
        multiple: nextProps.multiple || 0
      });
    }
  }

  calcValuation(multiple, metric) {
    return (!isNaN(multiple) && !isNaN(metric)) ? (multiple * metric) : undefined;
  }

  handleChange = prop => event => {
    if (prop === 'metric') {
      this.props.setMetric(event.target.value);
    }

  	this.setState({
  		[prop]: event.target.value
  	})
  };

  reset = () => {

    this.setState({ 
      metric: this.props.metric,
      multiple: !isNaN(this.props.multiple) ? this.props.multiple : 0
    });
  }

  handleClickButton = (type) => {
    this.setState({
      currentlyOpen: type,
      anchorEl: type === 'metric' ? findDOMNode(this.metricButton) : findDOMNode(this.multipleButton)
    });
  };

  handleClose = () => {
    this.setState({
      currentlyOpen: null
    });
  };

  metricButton = null;
  multipleButton = null;

  helpLink = () => {
    return (this.state.currentlyOpen === 'metric' && this.props.source1) ? this.props.source1 : undefined;
  };

  render() {
    const { classes, selectedMetric, selectedYear, getCaption } = this.props;
    const { multiple, metric, currentlyOpen } = this.state;

    var valuation = multiple * parseValue(metric);

    var showEstimate =  <Popover
                          open={currentlyOpen !== null}
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
                          className={this.state.currentlyOpen === 'metric' ? classes.source : classes.multiples }
                        >
                          <div className={classes.sourceWrapper}>
                            <Typography className={classes.typography} color={'textSecondary'} variant={'caption'} gutterBottom={true} >{ getCaption(currentlyOpen, 'base') }</Typography>
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
          title="Valuation Assumptions"
          subheader="$ in M(illions) / B(illions)" 
          className={classes.header}
          action={
          <div className={classes.cardActionsXL}>
            <Button onClick={this.reset}>reset</Button>
          </div>
        }/>   
        <CardContent className={classes.content}>
          <div className={classes.cardActionsMD}>
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
			          <InputLabel htmlFor="amount">{getFormattedMetric(selectedMetric, selectedYear)}</InputLabel>
			          <Input
			            id="adornment-amount"
                  inputComponent={NumberFormatCustom}
			            value={ formatMetric(metric, true) }
			            onChange={this.handleChange('metric')}
                  className={classes.changeInput}
			            startAdornment={<InputAdornment position="start">$</InputAdornment>}
                  endAdornment={<InputAdornment position="end">{formatSuffix(parseValue(metric)) }</InputAdornment>}
			          />
			  	      <FormHelperText id="weight-helper-text" onClick={() => this.handleClickButton('metric')} ref={node => { this.metricButton = node;}} className={classes.sourceLink} >
                  {'where is this from?'}
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
			          <InputLabel htmlFor="amount">Base Case Multiple</InputLabel>
			          <Input
			            id="adornment-amount"
                  placeholder={multiple.toString()}
			            value={formatMultiple(multiple, true)}
			            onChange={this.handleChange('multiple')}
                  className={classes.changeInput}
			            endAdornment={<InputAdornment position="end">x</InputAdornment>}
			          /> 
				      	<FormHelperText id="weight-helper-text" onClick={() => this.handleClickButton('multiple')} ref={node => { this.multipleButton = node;}} className={classes.sourceLink}>
                  {'where is this from?'}
                </FormHelperText>
		        	</FormControl>
              </Tooltip>
	          </Grid>
	          <EqualIcon color="inherit" style={{ width: 36, height: 36 }} className={classes.mathSymbols} />
	          <Grid item md={4} xs={12}>
							<FormControl className={classes.formControl}>
			          <InputLabel htmlFor="amount">{"Implied Valuation"}</InputLabel>
			          <Input
			            id="adornment-amount"
			            disabled={true}
                  inputComponent={NumberFormatCustom}
			            value={ formatMetric(valuation) }
			            onChange={this.handleChange('amount')}
			            startAdornment={<InputAdornment position="start">$</InputAdornment>}
                  endAdornment={<InputAdornment position="end">{formatSuffix(valuation)}</InputAdornment>}
			          />
				      	<FormHelperText id="weight-helper-text">base case valuation</FormHelperText>
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