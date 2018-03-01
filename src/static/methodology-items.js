const methodologyItems = [
  {
    question: 'What are puEstimates?',
    answer: 'A puEstimate gives an estimated market value for a private company using public market comparables. It\'s a bit like Zillow\'s Zestimate or Redfin price estimates, so you can use it as a starting point to think about a company\'s value.'
  },
  {
    question: 'How accurate are the estimates?',
    answer: 'Probably not very. For founders, VCs, employees, we hope this is a tool to at least get directional guidance on what public market investors expect and how Wall Street is likely to think about value in an IPO. For employees and senior executives it may provide a better more informed perspective of what you are signing up for.'
  },  
  {
    question: 'Why is this even needed?',
    answer: 'There is a pretty huge information asymmetry between public / private markets. Public markets tend to be more efficient albeit short sighted in determining valuations whereas private markets are way too static and rosy (mostly by design). Given the size of private unicorns, decacorns and eventual petacorns and beyond, the idea is that these \'startups\' are mature enough to warrant a public market lens for valuation.'
  },
  {
    question: 'What else do I need to know (aka caveats)?',
    answer: 'All companies are unique and given the lack of detailed financial information for private companies, it is hard to accurately ascribe value without accounting for accurate growth rates, profitability, market dynamics etc. And also, most wall street analysts are really bad at actually being able to predict future values'
  },
  {
    question: 'What is the source for estimates?',
    answer: 'For public companies, the estimates are wall street analyst consensus estimates. For private companies, estimates are just rumored / leaked numbers from press reports where available. If numbers are not available, we show an implied financial metric i.e. what the revenue will have to be (for a given year) to justify the companies last valuation round.'
  },
  {
    question: 'What does implied \'revenue\' or \'EBITDA\' mean?',
    answer: 'If estimates for private companies are not available (and they often are not), we show an implied financial metric i.e. what does the revenue have to be to justify the companies last valuation round based on public market comparables.'
  },
  {
    question: 'Company X is worth at least $100 billion and has a TAM of $100 trillion',
    answer: 'Nice.'
  },  
  {
    question: 'Company X is way superior than Public Company Y so should have a much higher multiple!',
    answer: 'Yes it probably should. Use the input box to enter any number you like.'
  },
  {
    question: 'Company X doen\'t have any public comps because it\'s completely revolutionary, disruptive etc.',
    answer: 'While there are revolutionary category defining companies, if the goal is to be public company investors are likely to try and put the company in a bucket that can be compared to others'
  },
];

export default methodologyItems;