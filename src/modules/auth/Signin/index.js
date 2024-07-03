import React from 'react';
import SigninJwtAuth from './SigninJwtAuth';
import Card from '@material-ui/core/Card';
import Box from '@material-ui/core/Box';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import {makeStyles} from '@material-ui/core/styles';
import {Fonts} from '../../../shared/constants/AppEnums';
import { MessageView } from '@crema';
import { useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  imgRoot: {
    cursor: 'pointer',
    display: 'inline-block',
    width: 280
  },
  cardRoot: {
    maxWidth: '36rem',
    width: '100%',
    overflow: 'hidden',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    position: 'relative',
    paddingTop: 20,
    [theme.breakpoints.up('xl')]: {
      paddingTop: 32,
    },
    '&:before': {
      content: "''",
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      width: 130,
      height: 9,
      borderBottomRightRadius: 80,
      borderBottomLeftRadius: 80,
      marginRight: 'auto',
      marginLeft: 'auto',
      backgroundColor: theme.palette.primary.main,
    },
  },
  muiTabsFull: {
    marginLeft: 0,
    marginRight: 0,
    borderBottom: `1px solid ${theme.palette.grey[300]}`,
    '& .MuiTabs-flexContainer': {
      '& .MuiTab-root': {
        flex: 1,
      },
    },
  },
  muiTab: {
    fontWeight: Fonts.MEDIUM,
    fontSize: 16,
    paddingBottom: 16,
    paddingTop: 16,
    marginLeft: 8,
    marginRight: 8,
    color: theme.palette.text.secondary,
  },
  textUppercase: {
    textTransform: 'uppercase',
  },
  back: {
    position: 'fixed',
    width: 900,
    height: 900,
    borderRadius: 1000,
    top: -90,
    left: -50,
    backgroundColor: theme.palette.background.default,
    transform: [
      {rotate: '-70deg'}
    ]
  },
  color: {
    backgroundColor: theme.palette.primary.main
  }
}));

const Signin = (props) => {
  const classes = useStyles(props);
  const { error } = useSelector(({ common }) => common);

  return (
    <Box style={{
      backgroundImage: 'url(/assets/images/Imagen1.png)',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat'
    }} flex={1} display='flex' flexDirection='column' justifyContent='center'>
      <Box mb={{xs: 6, md: 8, xl: 18}} textAlign='center'>
        <img
          className={classes.imgRoot}
          src='/assets/images/logoSmart3.png'
          alt='crema-logo'
        />
      </Box>

      <Box
        display='flex'
        flexDirection='column'
        justifyContent='center'
        alignItems='center'>
        <Card className={classes.cardRoot}>
          <Box px={{xs: 6, sm: 10, xl: 15}}>
            <Box
              component='h2'
              mb={{xs: 3, xl: 6}}
              color='text.primary'
              fontWeight={Fonts.REGULAR}
              fontSize={{xs: 24, xl: 26}}>
              <IntlMessages id='common.login' />
            </Box>
          </Box>
          <>
            <SigninJwtAuth />
          </>
        </Card>
      </Box>

      <MessageView
        variant={'error'}
        message={error}
      />
    </Box>
  );
};

export default Signin;
