export default {
  html: {
    height: '100%',
    fontFamily: 'Roboto, sans-serif',
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    margin: 0,
    overflow: 'hidden',
  },
  '#l2s2': {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 0',
    '> div > div': {
      flex: '1 1 0',
      display: 'flex',
      flexDirection: 'column',
    },
  },
};
