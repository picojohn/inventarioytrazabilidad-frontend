import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import {
  useDispatch, useSelector,
} from 'react-redux';
import { Scrollbar } from '@crema';
import {
  onGetOrdenLectura,
  onReadKitInitial,
  onReadKit
} from 'redux/actions/SelloAction';
import { onGetColeccionLigera as onGetKits } from 'redux/actions/KitAction';
import LecturaKitForm from './LecturaKitForm';
import { Fonts } from 'shared/constants/AppEnums';
import { makeStyles } from '@material-ui/core/styles/index';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';

const validationSchema = yup.object({
  serie: yup.string().required('Requerido'),
});

const useStyles = makeStyles(
  (theme) => ({
    dialogBox: {
      position: 'relative',
      '& .MuiDialog-paperWidthSm': {
        maxWidth: 600,
        width: '100%',
        // maxHeight:'fit-content'
      },
      '& .MuiTypography-h6': {
        fontWeight: Fonts.LIGHT,
      },
    },
    marcoTabla: {
      backgroundColor: 'white',
      boxShadow: '0px 0px 5px 5px rgb(0 0 0 / 10%)',
      borderRadius: '4px',
      // paddingLeft: '15px',
      // paddingRight: '15px',
      marginBottom: '5px',
      marginTop: '5px',
      padding: '10px 0'
    },
    root: {
      width: '100%%',
      paddingTop: '20px',
    },
    table: {
      maxWidth: 700
    },
    table2: {
      maxWidth: 1000
    },
    tableHead: {
      fontWeight: 'bold',
      fontSize: '10px',
      backgroundColor: theme.palette.background.default
    },
    tableRow: {
      backgroundColor: theme.palette.background.default,
      fontSize: '10px',
    }
  })
);

let kitName = '';

const LecturaKit = (props) => {
  const {
    updateColeccion,
    pedido,
    kit,
    showForm,
    productosS3
  } = props;

  const [tableRows, setTableRows] = useState([]);
  const [arrayBuild, setArrayBuild] = useState([]);
  const [arrayForRow, setArrayForRow] = useState([]);
  const dispatch = useDispatch();

  const classes = useStyles(props);

  const kits = useSelector(({kitReducer}) => kitReducer.ligera);
  const rows = useSelector(({selloReducer}) => selloReducer.ligera);
  const readTempSeal = useSelector(({selloReducer}) => selloReducer.readedRow);
  
  useEffect(() => {
    dispatch(onGetKits());
  },[]); // eslint-disable-line

  useEffect(() => {
    if(pedido?.numero_pedido && kit){
      dispatch(onGetOrdenLectura(pedido.numero_pedido, kit))
    }
  }, [pedido, kit]); // eslint-disable-line

  useEffect(() => {
    if(kits){
      const cKit = kits.find((k) => k.id === kit);
      if(cKit){
        kitName = cKit.nombre;
      }
    }
  },[kits]) // eslint-disable-line

  useEffect(() => {
    if(rows.length>0){
      setTableRows(rows);
      setArrayBuild(createArrayForRequest());
    }
  },[rows]); // eslint-disable-line

  useEffect(() => {
    if(readTempSeal){
      const newArrayForRow = [...arrayForRow];
      const index = newArrayForRow.findIndex((nA) => nA.id === readTempSeal.id);
      if(!~index){
        const index2 = tableRows.findIndex((tR) => tR.producto_s3_id === readTempSeal.producto_s3_id);
        const newTableRows = [...tableRows];
        const newRow = newTableRows[index2];
        newTableRows.splice(index2, 1, Object.assign(newRow, {
          leidos: parseInt(newRow.leidos)+1
        })) 
        setTableRows(newTableRows);
        newArrayForRow.push(readTempSeal);
        setArrayForRow(newArrayForRow);
        const newArrayBuild = [...arrayBuild];
        newArrayBuild.splice(0, 1);
        setArrayBuild(newArrayBuild);
      }
    }
  },[readTempSeal]) // eslint-disable-line

  useEffect(() => {
    if(tableRows){
      const {qts, read} = getTotals();
      if(read > 0 && qts === read){
        dispatch(onReadKit(arrayForRow, reinitilize, updateColeccion, voiceNot));
      }
    }
  },[tableRows]); // eslint-disable-line

  const voiceNot = (message) => {
    const msg = new SpeechSynthesisUtterance();
    msg.text = message;
    window.speechSynthesis.speak(msg);
  }

  const getName = (id) => {
    const producto = productosS3.find((ps3) => ps3.id === parseInt(id));
    if(producto){
      return producto.alias_producto;
    }
    return '';
  }

  const setList = () => {
    const list = arrayForRow.reduce((result, data, index) => {
      if(index){
        result.push(data.serial_empacado);
      }
      return result
    },[]);
    return list.join(', ');
  }

  const createArrayForRequest = () => {
    const rest = rows.reduce((result,data,index) => {
      if(!index){
        result.push(data.producto_s3_id);
      } else {
        const addToResult = Array(data.cantidad).fill(data.producto_s3_id);
        result = [...result, ...addToResult];
      }
      return result;
    }, []);
    return rest;
  }

  const getTotals = () => {
    const qts = tableRows.reduce((result, data) => {
      return result+data.cantidad
    }, 0);
    const read = tableRows.reduce((result, data) => {
      return result+parseInt(data.leidos)
    }, 0);
    return {
      qts,
      read
    }
  }

  const reinitilize = () => {
    setArrayBuild(createArrayForRequest());
    setArrayForRow([]);
    const newTableRows = [...tableRows];
    newTableRows.map((row) => {
      return row.leidos = 0;
    })
    setTableRows(newTableRows);
  }

  return (
    showForm && (
      <Box className={classes.marcoTabla}>
        <Scrollbar>
          <Formik
            initialStatus={true}
            enableReinitialize={true}
            validateOnBlur={false}
            initialValues={{
              // id: selectedRow?.id??'',
              producto_s3_id: '',
              numero_pedido: pedido?.numero_pedido??'',
              serie: '',
              articulo: '',
              tipo: 'K',
            }}
            validationSchema={validationSchema}
            onSubmit={
              (data, { setSubmitting }) => {
                setSubmitting(true);
                const cleanSerie = () => {
                  data.serie = '';
                }
                dispatch(onReadKitInitial(data, cleanSerie));
                setSubmitting(false);
              }
            }>{({ setFieldValue }) => (
                <Box
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center'
                  }}
                >
                  <Box>
                    <LecturaKitForm
                      setFieldValue={setFieldValue}
                      productosS3={productosS3}
                      arrayBuild={arrayBuild}
                    />
                    {arrayForRow.length > 0 && 
                    (
                      <TableContainer component={Paper}>
                        <Table size='small' className={classes.table2} aria-label="a dense table">
                          <TableHead>
                            <TableRow>
                              <TableCell className={classes.tableHead}>Serial</TableCell>
                              <TableCell className={classes.tableHead} align="left">Producto</TableCell>
                              <TableCell className={classes.tableHead} align="left">Series Kit</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow key={arrayForRow[0].id}>
                              <TableCell component="th" scope="arrayForRow[0]">{arrayForRow[0].serial_empacado}</TableCell>
                              <TableCell align="left">{getName(arrayForRow[0].producto_s3_id)}</TableCell>
                              <TableCell align="left">{setList()}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                  </Box>
                  <Box>
                    <h5>{kitName}</h5>
                    <TableContainer component={Paper}>
                      <Table size='small' className={classes.table} aria-label="a dense table">
                        <TableHead>
                          <TableRow style={{fontWeight: 'bold'}}>
                            <TableCell className={classes.tableHead}>Producto</TableCell>
                            <TableCell className={classes.tableHead} align="right">Cantidad</TableCell>
                            <TableCell className={classes.tableHead} align="right">Leídos</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {tableRows.map((row, index) => {
                            return (
                              <TableRow key={index}>
                                <TableCell className={classes.tableRow} component="th" scope="row">{getName(row.producto_s3_id)}</TableCell>
                                <TableCell className={classes.tableRow} align="right">{row.cantidad}</TableCell>
                                <TableCell className={classes.tableRow} align="right">{row.leidos}</TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </Box>
            )}
          </Formik>
        </Scrollbar>
      </Box>
    )
  );
};

export default LecturaKit;
