import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import ListItemText from '@material-ui/core/ListItemText';

import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
  menuItem: {
    height: 48
  },
  suggestionsList: {
    position: 'absolute',
    top: '10px',
    width: '100%',
    boxShadow: '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
    background: theme.palette.common.white,
    [theme.breakpoints.down('sm')]: {
      top: 0
    },
  }
});

class RenderSuggestionsContainer extends React.Component {
  render() {
    const { results, anchorEl, handleClose, classes, handleSelect } = this.props;

    if (results === undefined || Object.keys(results).length === 0) {
      return null;
    }

    return (
      <Grow in={Boolean(anchorEl)} id="menu-list" style={{ transformOrigin: '0 0 0' }}>
      <Paper>
        <MenuList
          role="menu"
          className={classes.suggestionsList}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >{
            Object.keys(results).map((key, index) => {
              var result = results[key];
              var link = result.type === 'cs' ? ('/stocks/'+key) : '/startups/'+key;
              var ticker = result.type === 'cs' ? "Ticker: "+key.toUpperCase() : (result.type ? "(Private)" : "");

              if (handleSelect) {
              return (
                <MenuItem onClick={() => handleSelect(key)} key={index} className={classes.menuItem} disabled={key === 'loading'} >
                  {key === 'loading' && <CircularProgress className={classes.progress} />}
                  <ListItemText classes={{ primary: classes.primary }} primary={result.name} secondary={ticker} />
                </MenuItem>
                )
              } else {
              return (
                <MenuItem component={Link} to={link} key={index} onClick={handleClose} className={classes.menuItem} disabled={key === 'loading'} >
                  {key === 'loading' && <CircularProgress className={classes.progress} />}
                  <ListItemText classes={{ primary: classes.primary }} primary={result.name} secondary={ticker} />
                </MenuItem>
                )
              }
            })}
        </MenuList>
      </Paper>
      </Grow>
    );
  }
}

RenderSuggestionsContainer.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(RenderSuggestionsContainer);