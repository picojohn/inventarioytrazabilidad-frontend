import React, {useEffect, useState} from 'react';
import {Box, Button, Checkbox, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@material-ui/core';
import {Form} from 'formik';
import Scrollbar from '@crema/core/Scrollbar';
import IntlMessages from '@crema/utility/IntlMessages';
import {Fonts} from 'shared/constants/AppEnums';
import { onGetColeccionLigera as onGetListas } from 'redux/actions/ListaChequeoAction';
import MyTextField from 'shared/components/MyTextField';
import MyRadioField from 'shared/components/MyRadioField';
import MySelectField from 'shared/components/MySelectField';

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
  grid: {
    display: 'grid',
    gap: 20,
    gridTemplateColumns: '1fr 1fr'
  },
  fontBold: {
    fontWeight: 'bold',
  }
}));

const options = [
  {value: 'T', label: 'Transporte'},
  {value: 'C', label: 'Carga'},
];

const UnidadCreadorForm = (props) => {
  const {
    handleOnClose, 
    accion, 
    initialValues, 
    titulo,
    unidades,
    values,
    dispatch,
    listas,
    setFieldValue,
    selected,
    setSelected,
    formatoInspeccion
  } = props;

  const [disabled, setDisabled] = useState(false);
  useEffect(() => {
    if (accion === 'ver' || initialValues.estado === '0') {
      setDisabled(true);
    }
  }, [initialValues.estado, accion]);

  useEffect(() => {
    if(values.unidad_id){
      dispatch(onGetListas(values.unidad_id));
    }
  },[values.unidad_id]) // eslint-disable-line

  useEffect(() => {
    if(values.tipo_unidad && values.tipo_unidad !== initialValues.tipo_unidad){
      setFieldValue('unidad_id', '');
    }
  }, [values.tipo_unidad]) // eslint-disable-line

  const toogleCheck = (id) => {
    const newSelected = [...selected];
    const i = newSelected.findIndex((item) => item === id);
    if(i === -1){
      newSelected.push(id);
    } else {
      newSelected.splice(i, 1);
    }
    setSelected(newSelected);
  }
 
  const classes = useStyles(props);

  return (
    <Form className='' noValidate autoComplete='off'>
      <Scrollbar style={{maxHeight: 600}}>
        <Box py={5} px={{xs: 5, lg: 8, xl: 10}}>
          <Box
            component='h6'
            mb={{xs: 4, xl: 6}}
            fontSize={20}
            fontWeight={Fonts.MEDIUM}>
            {titulo}
          </Box>

          <Box px={{md: 5, lg: 8, xl: 10}}>
            <Box className={classes.grid}>
              <MyTextField
                className={classes.myTextField}
                label='Formato'
                name='formato'
                disabled
              />
              <MyTextField
                className={classes.myTextField}
                label='Clase Inspección'
                name='clase_inspeccion'
                disabled
              />
            </Box>
            <MyRadioField
              label='Tipo Unidad'
              name='tipo_unidad'
              required
              disabled={accion !== 'crear'}
              options={options}
            />
            {values.tipo_unidad &&  (
              <MySelectField
                className={classes.myTextField}
                label='Unidad'
                name='unidad_id'
                required
                options={unidades.filter((und) => und.indicativo_tipo_unidad === values.tipo_unidad && und.cliente_id === formatoInspeccion.cliente_id)}
                disabled={accion !== 'crear'}
              />
            )}
            {values.unidad_id && listas.length > 0 && (
              <TableContainer component={Paper}>
                <Table size='small' aria-label='a dense table'>
                  <TableHead>
                    <TableRow>
                        <TableCell padding='checkbox' className={classes.fontBold}>Seleccionar</TableCell>
                        <TableCell className={classes.fontBold}>Nombre</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {listas.filter((list) => accion === 'ver' ? selected.includes(list.id) : list.clase_inspeccion_id === formatoInspeccion.clase_inspeccion_id).map((row, index) => (
                      <TableRow key={index}>
                        <TableCell
                          align='center'
                          className={classes.acciones}
                        >
                          <Checkbox
                            checked={selected.includes(row.id)}
                            color='primary'
                            onClick={() => toogleCheck(row.id)}
                            disabled={disabled}
                            inputProps={{ 'aria-labelledby': index }}
                          />
                        </TableCell>
                        <TableCell scope='row'>{row.nombre}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </Box>
      </Scrollbar>
      <Box className={classes.bottomsGroup}>
        {accion !== 'ver' && (
          <Button
            className={`${classes.btnRoot} ${classes.btnPrymary}`}
            variant='contained'
            type='submit'>
            <IntlMessages id='boton.submit' />
          </Button>
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

export default UnidadCreadorForm;
