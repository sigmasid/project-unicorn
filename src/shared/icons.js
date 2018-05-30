import React from 'react';

import TopStoriesIcon from '@material-ui/icons/Whatshot';
import MarketsIcon from '@material-ui/icons/MultilineChart';
import TechnologyIcon from '@material-ui/icons/PhoneIphone';
import RetailIcon from '@material-ui/icons/ShoppingCart';
import ServicesIcon from '@material-ui/icons/RoomService';
import FinancialsIcon from '@material-ui/icons/LocalAtm';
import MediaIcon from '@material-ui/icons/Subscriptions';
import HealthcareIcon from '@material-ui/icons/Healing';
import RealEstateIcon from '@material-ui/icons/Home';
import IndustrialsIcon from '@material-ui/icons/LocationCity';

export default function getLogo (type) {
  switch (type) {
    case 'top stories': return <TopStoriesIcon />;
	case 'markets': return <MarketsIcon />;
    case 'technology': return <TechnologyIcon />;
    case 'retail': return <RetailIcon />;
    case 'media & telecom': return <MediaIcon />;
    case 'financials': return <FinancialsIcon />;
    case 'services': return <ServicesIcon />;
    case 'healthcare': return <HealthcareIcon />;    
    case 'real estate': return <RealEstateIcon />;    
    case 'industrials': return <IndustrialsIcon />;    
    default: return <TopStoriesIcon />
  }
}