import React from 'react';
import {Box, Tooltip} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';
import defaultConfig from '@crema/utility/ContextProvider/defaultConfig';

const AppLogoWhite = () => {
  const useStyles = makeStyles(() => ({
    logoRoot: {
      display: 'flex',
      flexDirection: 'row',
      cursor: 'pointer',
      alignItems: 'center',
    },
    logo: {
      height: 90,
      marginRight: 10,
    },
  }));
  const classes = useStyles();
  return (
    <Box className={classes.logoRoot}>
      <Hidden smUp>
        <Tooltip title={`Version ${defaultConfig.appVersion}`} placement='right' arrow style={{fontSize: 20}}>
          <img
            className={classes.logo}
            src={'/assets/images/logoSmart3.png'}
            alt='crema-logo'
          />
        </Tooltip>
      </Hidden>
      <Hidden xsDown>
        <Tooltip title={`Version ${defaultConfig.appVersion}`} placement='right' arrow style={{fontSize: 20}}>
          <img
            className={classes.logo}
            src={'/assets/images/logoSmart3.png'}
            alt='crema-logo'
          />
        </Tooltip>
      </Hidden>
    </Box>
  );
};

export default AppLogoWhite;
