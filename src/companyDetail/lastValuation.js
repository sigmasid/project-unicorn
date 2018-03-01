import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardContent, CardHeader } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import 'typeface-roboto';
import NumberFormat from 'react-number-format';
import ValuationSummary from './companyComps.js';

const pinterest = 
  {
    name: 'Pinterest',
    description: 'Amazing company to work for',
    logo: "https://i.pinimg.com/736x/92/fd/59/92fd59efefc446c7e858ebd16c53feba--pinterest-logo-png-pinterest-board.jpg",
    lastValuation: 5000
  };

const styles = theme => ({
  header: {
    textAlign: 'left'
  },
  card: {
    margin: 20
  },
  content: {
    alignItems: 'center'
  }
});

function CompanyValuation(props) {
  const { classes, theme } = props;

  return (
    <div>
      <Card className={classes.card}>
          <CardHeader title="Valuation Summary" subheader="$ in millions" className={classes.header} />   
          <CardContent className={classes.content}>
            <Grid container spacing={24} className={classes.content}>
              <Grid item xs={6}>
              <div className={classes.details}>
                <Typography type="display1" color="primary">Last Round</Typography>
                <Typography type="display3" color="textSecondary">
                  <NumberFormat value={pinterest.lastValuation} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                </Typography>
              </div>
              </Grid>
              <Grid item xs={6}>
              <div className={classes.details}>
              <CardContent className={classes.content}>
                <Typography type="display1" color="primary">pu Estimate</Typography>
                <Typography type="display3" color="textSecondary">
                  <NumberFormat value={pinterest.lastValuation} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                </Typography>
              </CardContent>
              </div>
              </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
}

CompanyValuation.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};


export default withStyles(styles, { withTheme: true })(CompanyValuation);