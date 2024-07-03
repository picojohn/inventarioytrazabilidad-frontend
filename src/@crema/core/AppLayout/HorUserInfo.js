import React, {useContext} from 'react';
import {useDispatch} from 'react-redux';
import {onJWTAuthSignout} from '../../../redux/actions';
import {useAuthUser} from '../../utility/AppHooks';
import AppContext from '../../utility/AppContext';
import {makeStyles, MenuItem, Menu, Box, Button} from '@material-ui/core';
import {orange} from '@material-ui/core/colors';
import {AuthType, Fonts} from '../../../shared/constants/AppEnums';
import Hidden from '@material-ui/core/Hidden';
import {Business, Person} from '@material-ui/icons';
import defaultConfig from '@crema/utility/ContextProvider/defaultConfig';

const useStyles = makeStyles((theme) => {
  return {
    userRoot: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      justifyContent: 'center',
    },
    avatar: {
      fontSize: 24,
      backgroundColor: orange[500],
    },
    userInfo: {
      width: 'calc(100% - 75px)',
    },
    pointer: {
      cursor: 'pointer',
    },
    userName: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      fontSize: 15,
      fontWeight: Fonts.MEDIUM,
      color: (props) =>
        props.bgType === 'colored' ? 'white' : theme.palette.text.primary,
    },
    logoutBtn: {
      backgroundColor: theme.palette.secondary.red,
      width: '90%',
      color: 'white',
      margin: '10px 10px',
      fontFamily: theme.typography.primaryFont,
      '&:hover': {
        backgroundColor: 'rgba(203,36,40,0.7)',
      },
    },
    btnContainer: {
      borderTop: '1px solid rgb(231,180,38)',
    },
  };
});

const HorUserInfo = ({bgType = 'colored'}) => {
  const {themeMode} = useContext(AppContext);
  const {theme} =  defaultConfig;
  const dispatch = useDispatch();
  const user = useAuthUser();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const classes = useStyles({themeMode, bgType});

  return (
    <Box py={2} pl={{xs: 2, sm: 3, md: 5}}>
      <Box className={classes.userRoot} display='flex' onClick={handleClick}>
        <Hidden mdDown>
          <Box
            display='flex'
            style={{justifyContent: 'space-evenly', alignItems: 'center'}}
            ml={3}
            className={classes.userName}>
            <Business
               style={{width: '50px', height: '50px', color: theme.palette.primary.main}}
            />
            <Box style={{color: theme.palette.primary.main}}>
              {user.asociado?.nombre??''}
              <Box fontSize={13} fontWeight={Fonts.LIGHT}>
                {user?.rol?.nombre??''}
              </Box>
            </Box>
            <Person
              style={{width: '50px', height: '50px', color: theme.palette.primary.main}}
            />
            <Box style={{color: theme.palette.primary.main}}>
              {user.displayName ? user.displayName : user.email}
              <Box fontSize={13} fontWeight={Fonts.LIGHT}>
                {user.identificacion_usuario}
              </Box>
            </Box>
          </Box>
        </Hidden>
      </Box>
      <Box className={classes.userInfo}>
        <Menu
          id='simple-menu'
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}>
          <MenuItem
            className={classes.font}
            style={{fontWeight: 'bold', color: 'black'}}
            disabled={true}>
            {user.displayName}
          </MenuItem>
          <MenuItem
            className={classes.font}
            style={{fontWeight: 'bold', color: 'black'}}
            disabled={true}>
            {user.correo_electronico}
          </MenuItem>
          <Box className={classes.btnContainer}>
            <Button
              className={classes.logoutBtn}
              onClick={() => {
                if (user && user.authType === AuthType.JWT_AUTH) {
                  dispatch(onJWTAuthSignout());
                }
              }}
              variant='contained'>
                Cerrar Sesión
            </Button>
          </Box>
        </Menu>
      </Box>
    </Box>
  );
};

export default HorUserInfo;
