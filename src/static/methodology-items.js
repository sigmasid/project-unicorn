const methodologyItems = [
  {
    question: 'What are valuation scenarios?',
    answer: 'Valuation scenarios give a range of estimated market values (downside, base and upside) for a private company using public market comparables. For some of the unicorns, we use specific publicly traded comparables to illustrate potential upside and downside scenarios. For example, if you think Uber is strictly a marketplace destinated for domination, you would likely use our "bull" case and rumored Uber financials to triangulate an upside valuation. It\'s a bit like Zillow\'s Zestimate or Redfin price estimates, so you can use it as a starting point to think about a company\'s value.'
  },
  {
    question: 'How accurate are the estimates / company financials?',
    answer: 'Probably not very. For founders, VCs, employees, and anyone looking to better understand startups, we hope this is a tool to at least get directional guidance on how public market investors are likely to think about value. For employees and senior executives it may provide an informed perspective of a startup\'s potential and what you are signing up for.'
  },  
  {
    question: 'Why did you create this?',
    answer: 'It started with a simple bet. Is Stripe worth $50B? And while we are pretty huge fans of Stripe as a Company, there\'s really was no way to compare valuations and see public comparables. So this is an easy to use tool to compare valuations and understand what\'s drives value.'
  },
  {
    question: 'Why are some international and other big startups missing from the list?',
    answer: 'For companies that focus on deep tech (Magic Leap for example), traditional financial analysis is fairly pointless as value is driven by transformative potential of technology. Or in other cases like SpaceX, the TAM is so big that any financial analysis would not reflect true market value. For international companies, while we have added some companies, we just don\'t have a deep enough understanding of the companies and market to be able to offer fair valuation analyses.'
  }, 
  {
    question: 'How should I think about private / public company valuations?',
    answer: 'Given private valuations are static, they don\'t always reflect current market sentiment which often creates big asymmetry between public / private markets. For example, SaaS companies have outperformed other sectors while ad tech has fallen out of favor in public markets. Public markets tend to be more efficient albeit short sighted re: valuations whereas private markets are much more static and aspirational (by design). Given the size of private unicorns, decacorns and eventual petacorns, the idea is that these \'startups\' are mature enough to be evaluated using a public market lens.'
  },
  {
    question: 'What else do I need to know (aka caveats)?',
    answer: 'All companies are unique and given the lack of detailed financial information for private companies, it is hard to accurately ascribe value without accounting for accurate growth rates, profitability, market dynamics etc. And also, most wall street analysts are really bad at actually being able to predict future metrics for companies they track (see Wall Street estimates for AMZN before ~2013)'
  },
  {
    question: 'What is the source for estimates?',
    answer: 'For public companies, the estimates are wall street analyst consensus estimates. For private companies, estimates are typically rumored / leaked numbers from press reports where available or an educated estimate based on operating metrics available. If numbers are not available, you can click to see implied financial metrics i.e. what the revenue will have to be (for a given year) based on the comps multiples and the companies last valuation round.'
  }, 
  {
    question: 'Company X is worth at least $100 billion and has a TAM of $100 trillion',
    answer: 'Nice.'
  },  
  {
    question: 'Company X is way superior than Public Company Y so should have a much higher multiple!',
    answer: 'Yes it probably should. Use the input box to enter any number you like.'
  }
];

export default methodologyItems;