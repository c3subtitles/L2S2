// @flow
export default {
  html: {
    height: '100%',
    fontFamily: 'Roboto, sans-serif',
  },
  body: {
    display: 'flex',
    WebkitFlexDirection: 'column',
    flexDirection: 'column',
    height: '100%',
    margin: 0,
    overflow: 'hidden',
  },
  '#l2s2': {
    display: 'flex',
    WebkitDisplay: '-webkit-flex',
    WebkitFlexDirection: 'column',
    flexDirection: 'column',
    WebkitFlex: '1 1 0',
    flex: '1 1 0',
    '> div > div': {
      WebkitFlex: '1 1 0',
      flex: '1 1 0',
      display: 'flex',
      WebkitDisplay: 'webkit-flex',
      WebkitFlexDirection: 'column',
      flexDirection: 'column',
    },
  },
};
