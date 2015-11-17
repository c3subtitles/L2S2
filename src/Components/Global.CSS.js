export default {
  html: {
    height: '100%',
    fontFamily: 'Roboto, sans-serif',
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    margin: 0,
    height: '100%',
  },
  '#l2s2': {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    '> div': {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
    },
  },
};
