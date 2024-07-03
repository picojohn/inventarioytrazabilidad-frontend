import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import {toggleNavCollapsed} from '../../../../redux/actions';
import {useDispatch} from 'react-redux';
import Hidden from '@material-ui/core/Hidden';
import HorizontalNav from '../../Navigation/HorizontalNav';
import Box from '@material-ui/core/Box';
import useStyles from './AppHeader.style';
import HorUserInfo from '../HorUserInfo';
import AppLogoWhite from '../../../../shared/components/AppLogoWhite';

const AppHeader = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  return (
    <>
      <AppBar position='relative'>
        {/* <NotificationBar /> */}
        <Toolbar className={classes.headerMain}>
          <Box className={classes.headerContainer}>
            <Box className={classes.headerMainFlex}>
              <Hidden lgUp>
                <IconButton
                  edge='start'
                  className={classes.menuButton}
                  color='primary'
                  aria-label='open drawer'
                  onClick={() => dispatch(toggleNavCollapsed())}>
                  <MenuIcon className={classes.menuIconRoot} />
                </IconButton>
              </Hidden>
              <AppLogoWhite />
              <Box className={classes.grow} />
              <HorUserInfo />
            </Box>
          </Box>
        </Toolbar>
        <Hidden mdDown>
          <Box className={classes.headerNav}>
            <Box 
              className={classes.headerContainer} 
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                maxWidth: '100%'
              }}
            >
              <HorizontalNav />
            </Box>
          </Box>
        </Hidden>
      </AppBar>
    </>
  );
};
export default AppHeader;
