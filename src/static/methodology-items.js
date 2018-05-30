const methodologyItems = [
  {
    question: 'Why did you create this?',
    answer: 'I wanted an easy to use reference tool for valuations of technology companies - public and private. And with horrible new Google Finance, I decided to expand the scope a bit and create a fast, simple to use tool to browse companies, see the charts and also get unique valuation and comparables analysis that is surprisingly hard to find.'
  },
  {
    question: 'Which companies are covered?',
    answer: 'We have data on most US publicly traded stocks and more detailed data and refined valuation analysis on most technology companies. For startups, we included most private unicorns (mostly US) and other companies where we selectively had numbers available.'
  },
  {
    question: 'How do you estimate valuations for private companies?',
    answer: 'Wall Street investors typically look for the best comps for any company and assign a premium or discount relative to the peers. We used a similar approach to show 3 valuation scenarios that give a range of estimated public market valuations (downside, base and upside). For some of the unicorns, we used specific public companies that we thought were the best comps. For example, if you think Uber is strictly a marketplace destinated for domination, you would likely use our "bull" case and rumored Uber financials to triangulate an upside valuation. It\'s a bit like Zillow\'s Zestimate or Redfin price estimates, so you can use it as a starting point to think about a company\'s value.'
  },
  {
    question: 'How accurate are the estimates / company financials?',
    answer: 'For private companies probably not very. For founders, VCs, employees, and anyone looking to better understand startups, this is a good tool to at least get directional guidance on how public market investors are likely to think about value. For employees and senior executives it may provide an informed perspective of a startup\'s potential and what you are signing up for.'
  },  
  {
    question: 'Why are some international and other big startups missing from the list?',
    answer: 'For companies that focus on deep tech (Magic Leap for example), traditional financial analysis is pointless as value is driven by transformative potential of technology. Or in other cases like SpaceX, the TAM is so big that any financial analysis would not reflect true market value. For international companies, while we have added some companies, we just don\'t have a deep enough understanding of the companies and market to be able to offer fair valuation analyses.'
  }, 
  {
    question: 'How should I think about private / public company valuations?',
    answer: 'Given private valuations are static, they don\'t always reflect current market sentiment which often creates big asymmetry between public / private markets. For example, SaaS companies have outperformed other sectors while ad tech has fallen out of favor in public markets but that is not readily evident in some ad tech valuations from 2015 / 2016 vintage. Public markets tend to be more efficient albeit short sighted re: valuations whereas private markets are much more static and aspirational (by design). Given the size of private unicorns, decacorns and eventual petacorns, the idea is that these \'startups\' are mature enough to be evaluated using a public market lens.'
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
    question: 'Startup X is worth at least $100 billion and has a TAM of $100 trillion',
    answer: 'Nice.'
  },  
  {
    question: 'Startup X is way superior than Public Company Y so should have a much higher multiple!',
    answer: 'Yes it probably should. Use the input box to enter any number you like.'
  }
];

export default methodologyItems;