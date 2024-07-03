import React, {useEffect, useMemo} from 'react';
import {
  Box, 
  Button,
  makeStyles,
  Chip
} from '@material-ui/core';
import {Form} from 'formik';
import Scrollbar from '@crema/core/Scrollbar';
import IntlMessages from '@crema/utility/IntlMessages';
import MyTextField from 'shared/components/MyTextField';
import MySelectField from 'shared/components/MySelectField';
import Dropzone, { useDropzone } from 'react-dropzone';
import { fetchError } from 'redux/actions';
import MyAutocompleteSello from 'shared/components/MyAutoCompleteSello';
import { onGetRandomSeal } from 'redux/actions/SelloAction';
import HelpButton from 'shared/components/HelpButton';

const useStyles = makeStyles((theme) => ({
  bottomsGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    backgroundColor: 'white',
    paddingRight: '20px',
    position: 'sticky',
    left: 0,
    bottom: 0,
  },
  myTextField: {
    width: '100%',
    marginBottom: 0,
    [theme.breakpoints.up('xl')]: {
      marginBottom: 0,
    },
    height: '50px',
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
  pointer: {
    cursor: 'pointer',
  },
  inputs_2: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: 'repeat(2,1fr)',
    gap: '15px',
    marginBottom: 15,
  },
  createButton: {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    boxShadow:
      '0px 3px 5px -1px rgb(0 0 0 / 30%), 0px 6px 10px 0px rgb(0 0 0 / 20%), 0px 1px 18px 0px rgb(0 0 0 / 16%)',
    '&:hover': {
      backgroundColor: theme.palette.colorHover,
      cursor: 'pointer',
    },
  },
  flex: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  sealContainer: {
    // border: '1px solid black',
    // borderRadius: 10,
    padding: '0px 0px 5px 0px',
    marginBottom: 7
  },
  thumbInner: {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
  },
  thumb: {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    maxWidth: 150,
    maxHeight: 150,
    padding: 4,
    boxSizing: 'border-box'
  },
  thumbContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16
  },
  img: {
    display: 'block',
    width: 'auto',
    height: '100%'
  }
}));

export const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#ffffff',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out',
  height: '30px',
};

export const activeStyle = {
  borderColor: '#2196f3',
};
export const acceptStyle = {
  borderColor: '#00e676',
};
export const rejectStyle = {
  borderColor: '#ff1744',
};

const InstalacionDetalleForm = (props) => {
  const {
    titulo,
    values,
    operacionesEmbarque,
    contenedores,
    lugares,
    zonas,
    productos,
    cliente,
    readSeal,
    onReadSeal,
    onUnreadSeal,
    dispatch,
    setFieldValue,
    handleSubmit,
    sellos,
    images,
    setImages,
    url
  } = props;

  const classes = useStyles(props);
  const {
    isDragActive, 
    isDragAccept, 
    isDragReject,
  } = useDropzone();
  const style = useMemo(() => ({
    ...baseStyle,
    ...(isDragActive ? activeStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {}),
  }),
    [
      isDragActive,
      isDragAccept,
      isDragReject
    ]
  );

  const thumbs = images.map((img) => (
    <div className={classes.thumb} key={img.name}>
      <div className={classes.thumbInner}>
        <img
          src={img.preview}
          alt='thumb'
          className={classes.img}
          // Revoke data uri after image is loaded
          onLoad={() => { URL.revokeObjectURL(img.preview) }}
        />
      </div>
    </div>
  ))

  const assingRandomSeal = (producto_id) => {
    dispatch(onGetRandomSeal(producto_id));
  }

  const sealList = readSeal.map((seal, index) => {
    return (
      <Chip
        key={index} 
        label={seal.serial}
        style={{
          margin: '2px 2px',
          backgroundColor: 'transparent',
          color: 'black',
          border: '1px solid black'
        }}
        onDelete={() => onUnreadSeal(seal.id)}
      />
    );
  })

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => images.forEach(file => URL.revokeObjectURL(file.preview));
  }, []); // eslint-disable-line

  const setFiles = (acceptedFiles) => {
    setImages(acceptedFiles.map(photo => Object.assign(photo, {
      ...photo,
      preview: URL.createObjectURL(photo)
    })))
  }

  const onEnterSerial = (data) => {
    onReadSeal(data.cliente_id, data.producto_id, data.serial);
    setFieldValue('serial', '');
  }

  return (
    <Form encType='multipart/form-data'>
      <Scrollbar style={{maxHeight: 1200}}>
        <Box py={5} px={{xs: 5, lg: 8, xl: 10}}>
          <Box 
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Box
              component='h6'
              mb={{xs: 2, xl: 4}}
              fontSize={20}
              fontWeight='bold'>
              {titulo}
            </Box>
            <HelpButton url={url} />
          </Box>

          <Box px={{md: 5, lg: 8, xl: 10}}>
            <Box className={classes.inputs_2}>
              {cliente.indicativo_operaciones_embarque === 'S' && 
                <MySelectField
                  className={classes.myTextField}
                  label='Operacion Embarque'
                  name='operacion_embarque_id'
                  options={operacionesEmbarque}
                />
              }
              {cliente.indicativo_instalacion_contenedor === 'S' && 
                <MySelectField
                  className={classes.myTextField}
                  label='Contenedor'
                  name='contenedor_id'
                  options={contenedores}
                />
              }
              {cliente.indicativo_documento_referencia === 'S' && 
                <MyTextField
                  className={classes.myTextField}
                  label='Documento Referencia'
                  name='documento_referencia'
                />
              }
            </Box>
            <Box className={classes.inputs_2}>
              {cliente.indicativo_registro_lugar_instalacion === 'S' && 
                <MySelectField
                  className={classes.myTextField}
                  label='Lugar Instalación'
                  name='lugar_instalacion_id'
                  options={lugares.filter((place) => place.indicativo_lugar_instalacion === 'S')}
                />
              }
              {cliente.indicativo_registro_zona_instalacion === 'S' && 
                <MySelectField
                  className={classes.myTextField}
                  label='Zona Instalación'
                  name='zona_instalacion_id'
                  options={zonas}
                />
              }
            </Box>
            <Box className={classes.inputs_2}>  
              <MySelectField
                className={classes.myTextField}
                label='Producto'
                name='producto_id'
                options={productos}
              />
              <Box className={classes.inputs_2}>
                <MyAutocompleteSello
                  className={classes.myTextField}
                  label='Serial'
                  name='serial'
                  onKeyDown={(e) => {
                    if(e.key === 'Enter' && values.serial.length > 0){
                      onEnterSerial(values);
                    }
                  }}
                  options={sellos.filter((sello) => sello.producto_id === parseInt(values.producto_id) && !readSeal.some((s) => s.id === sello.id))}
                />
                {cliente.indicativo_asignacion_serial_automatica === 'S' &&
                  <Box 
                    style={{
                      display: 'flex',
                      alignItems: 'end'
                    }}
                  >
                    <Button
                      className={`${classes.btnRoot} ${classes.btnPrymary}`}
                      onClick={() => {
                        if(values.producto_id === '') {
                          dispatch(fetchError('Debe seleccionar un producto'));
                          return;
                        }
                        assingRandomSeal(values.producto_id);
                      }}
                      variant='contained'
                    >
                      Asignar Sello Automático
                    </Button>
                  </Box>
                }
              </Box>
            </Box>
            { readSeal.length > 0 &&
              <Box className={classes.sealContainer}>
                {sealList}
              </Box>
            }
            <Box className={classes.inputs_2}>
              <Box className={classes.flex}>
                <Box
                  component='h6'
                  fontSize={20}
                  fontWeight='bold'>
                  Evidencias:
                </Box>
              </Box>
              <Box className={classes.bottomsGroup}>
                <Button
                  className={`${classes.btnRoot} ${classes.btnPrymary}`}
                  onClick={handleSubmit}
                  variant='contained'>
                  <IntlMessages id='boton.install' />
                </Button>
              </Box>
            </Box>
            <Dropzone
              onDrop={(acceptedFiles) => {
                if(acceptedFiles.length > 3){
                  dispatch(fetchError('Solo puede cargar un máximo de 3 archivos'));
                  return;
                }
                if (acceptedFiles.length === 0) {
                  dispatch(fetchError('Solo puede subir imágenes'));
                } else {
                  setFieldValue('evidencias', acceptedFiles);
                  setFiles(acceptedFiles);
                }
              }}
              maxFiles={3}
              accept='.APNG,.AVIF,.GIF,.JPEG,.JPG,.PNG,.SVG,.WebP,.BMP,.ICO,.TIFF'>
              {({getRootProps, getInputProps}) => (
                <div {...getRootProps({style})}>
                  <input
                    {...getInputProps()}
                    name='evidencias'
                    type='file'
                    id='evidencias'
                    onChange={(e) => {
                      const files = Array.prototype.slice.call(e.target.files);
                      if(files.length > 3){
                        dispatch(fetchError('Solo puede cargar un máximo de 3 archivos'));
                        return;
                      }
                      if (files[0].type.includes('image')) {
                        setFieldValue('evidencias', files);
                        setFiles(files);
                      } else {
                        dispatch(fetchError('Solo se aceptan imágenes'));
                      }
                    }}
                  />
                  <p>Arrastra una imagen o haz click para cargarla</p>
                </div>
              )}
            </Dropzone>
            <div className={classes.thumbContainer}>
                {thumbs}
            </div>
          </Box>
        </Box>
      </Scrollbar>
    </Form>
  );
};

export default InstalacionDetalleForm;
