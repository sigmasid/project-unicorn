const methodologyItems = [
  {
    question: 'What are puEstimates?',
    answer: 'A puEstimate gives an estimated market value for a private company using public market comparables for a given category. For example, if you think Uber is a digital marketplace, you can use our public comparables and rumored Uber financials to triangulate a valuation for the company. It\'s a bit like Zillow\'s Zestimate or Redfin price estimates, so you can use it as a starting point to think about a company\'s value.'
  },
  {
    question: 'How accurate are pu estimates / company financials?',
    answer: 'Probably not very. For founders, VCs, employees, we hope this is a tool to at least get directional guidance on what public market investors expect and how Wall Street is likely to think about value in an IPO. For employees and senior executives it may provide a better more informed perspective of what you are signing up for.'
  },  
  {
    question: 'Why did you create this?',
    answer: 'It started with a simple bet. Is Stripe worth $50B? And while we are pretty huge fans of Stripe as a Company, there really was no way to compare valuations and see public comparables. So we hope this is an easy to use tool to compare valuations and get smarter on what\'s drives value.'
  },
  {
    question: 'How should I think about private / public company valutions?',
    answer: 'There is a pretty huge information asymmetry between public / private market valuations. Public markets tend to be much more efficient albeit short sighted re: valuations whereas private markets are way too static and aspirational (mostly by design). Given the size of private unicorns, decacorns and eventual petacorns, the idea is that these \'startups\' are mature enough to be evaluated using a public market lens. And since many unicorns are starting to go public, this tool should also be helpful when thinking about likely public market outcomes'
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
    question: 'What does implied \'revenue\' or \'EBITDA\' mean?',
    answer: 'Implied financial metrics show what revenue or financial metric is implied by companies last valuation round based on public market comparables. For example, if you believe Uber is a logistics company and similar comparables trade at a 2.0x revenue multiple, then we can use that to imply what Uber\'s revenue needs to be this year to justify it\'s valuation'
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