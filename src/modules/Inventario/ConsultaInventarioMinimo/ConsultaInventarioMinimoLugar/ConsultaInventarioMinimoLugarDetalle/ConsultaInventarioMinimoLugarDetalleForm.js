import React, {useEffect, useState} from 'react';
import {Box, Button} from '@material-ui/core';
import {Form} from 'formik';
import {makeStyles} from '@material-ui/core/styles';
import Scrollbar from '@crema/core/Scrollbar';
import IntlMessages from '@crema/utility/IntlMessages';
import MyTextField from 'shared/components/MyTextField';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  bottomsGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingBottom: '20px',
    gap: '10px',
    backgroundColor: 'white',
    paddingRight: '20px',
    position: 'sticky',
    left: 0,
    bottom: 0,
  },
  myTextField: {
    width: '100%',
    marginBottom: 5,
    [theme.breakpoints.up('xl')]: {
      marginBottom: 5,
    },
    height: '60px',
  },
  red: {
    color:'red'
  },

  MySelectField: {
    width: 'auto',
    marginBottom: 16,
    [theme.breakpoints.up('xl')]: {
      marginBottom: 24,
    },
    color: theme.palette.primary.main,
    '&:target': {
      color: theme.palette.primary.main,
    },
  },
  btnRoot: {
    paddingLeft: 15,
    paddingRight: 15,
    color: 'white',
    '&:hover': {
      backgroundColor: theme.palette.colorHover,
      cursor: 'pointer',
    },
  },
  btnPrymary: {
    backgroundColor: theme.palette.primary.main,
  },
  btnSecundary: {
    backgroundColor: theme.palette.grayBottoms,
  },
  widthFull: {
    width: '100%',
  },
  pointer: {
    cursor: 'pointer',
  },
  inputs_2: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
  },
  seriales: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: 'repeat(18, 1fr)',
    gap: '10px',
  },
  serie: {
    textDecorationLine:'underline'
  },
}));

const ConsultaInventarioForm = (props) => {
  const {handleOnClose, accion, initialValues, titulo} = props;
  const [disabled, setDisabled] = useState(false);
  const [seriales, setSeriales] = useState([]);
  const [serialInicial, setSerialInicial] = useState('');
  useEffect(() => {
    if (accion === 'ver' || initialValues.estado === '0') {
      setDisabled(true);
    }
  }, [initialValues.estado, accion]);

  const classes = useStyles(props);

  useEffect(()=>{
    if (initialValues.seriales!==''&&initialValues.seriales!==undefined){
      const temp = initialValues.seriales.split(',');
      const indexStart = temp.findIndex(member=>serialInicial===member);
      if (indexStart!==undefined&indexStart!==''){
        setSeriales(temp.filter((member, index)=>index>=indexStart));
      }
    }
  },[initialValues.seriales,serialInicial])

  return (
    <Form className='' noValidate autoComplete='off'>
      <Scrollbar style={{maxHeight: 1200}}>
        <Box py={5} px={{xs: 5, lg: 8, xl: 10}}>
          <Box
            component='h6'
            mb={{xs: 4, xl: 6}}
            fontSize={20}
            fontWeight='bold'>
            {titulo}
          </Box>

          <Box px={{md: 5, lg: 8, xl: 10}}>
            <Box className={classes.inputs_2}>
              <MyTextField
                className={classes.myTextField}
                label='Lugar'
                name='lugar'
                disabled={disabled}
              />
              <MyTextField
                className={classes.myTextField}
                label='Usuario'
                name='usuario'
                disabled={disabled}
              />
            </Box>
            <Box className={classes.inputs_2}>
              <MyTextField
                className={classes.myTextField}
                label='Producto/Kit'
                name='nombre'
                disabled={disabled}
              />
              <MyTextField
                className={classes.myTextField}
                label='Cantidad'
                name='cantidad'
                disabled={disabled}
              />
            </Box>
            <Box className={classes.inputs_2}>
              <TextField
                className={classes.myTextField}
                label='Serie'
                name='serie'
                onChange={(e)=>{
                  setSerialInicial(e.target.value)
                }}
                value={serialInicial}
              />
            </Box>
            <Box className={classes.seriales}>
              {seriales.map((serie,index)=>{
                return(                
                  <Box component={'p'} key={index}  className={classes.serie}>
                    {serie}
                  </Box>
                )
              })}
          </Box>
          </Box>
        </Box>
      </Scrollbar>
      <Box className={classes.bottomsGroup}>
        {accion !== 'ver' ? (
          <Button
            className={`${classes.btnRoot} ${classes.btnPrymary}`}
            variant='contained'
            type='submit'>
            <IntlMessages id='boton.submit' />
          </Button>
        ) : (
          ''
        )}
        <Button
          className={`${classes.btnRoot} ${classes.btnSecundary}`}
          onClick={handleOnClose}>
          <IntlMessages id='boton.cancel' />
        </Button>
      </Box>
    </Form>
  );
};

export default ConsultaInventarioForm;
