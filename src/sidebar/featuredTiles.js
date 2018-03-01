import React from 'react';
import { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import ImageAvatars from './companyIcon.js';
import { Link } from 'react-router-dom';
//const util = require('util'); //print an object

var featuredTiles = (tickers) => Object.keys(tickers).map((item, index) => {
  var currentTile = tickers[item];
  return(
    <ListItem button component={Link} to={'/c/'+currentTile.ticker} key={index}>
      <ListItemIcon>
        <ImageAvatars src={currentTile.logo} />
      </ListItemIcon>
      <ListItemText primary={currentTile.name} />
    </ListItem>   
  )
})

export default featuredTiles;