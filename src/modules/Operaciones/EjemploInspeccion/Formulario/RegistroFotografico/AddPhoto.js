import React from "react";
import { acceptStyle, activeStyle, baseStyle, rejectStyle } from "modules/Contenedores/Instalacion/InstalacionDetalle/InstalacionDetalleForm";
import { useMemo } from "react";
import { useState } from "react";
import Dropzone, { useDropzone } from "react-dropzone";
import { useDispatch } from "react-redux";
import { fetchError } from "redux/actions";
import { useEffect } from "react";
import { Box, Button, Dialog, Grid, Slide, TextField } from "@material-ui/core";
import { Scrollbar } from "@crema";
import { rows } from "./RegistroFotografico";
import IntlMessages from "@crema/utility/IntlMessages";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='down' ref={ref} {...props} />;
});

const AddPhoto = ({open, handleOnClose, classes, selectedRegistro}) => {
  const [fotos, setFotos] = useState();
  const [evidencias, setEvidencias] = useState();
  const dispatch = useDispatch();
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

  const setRegistro = () => {
    const reg = rows.find((row) => row.id === selectedRegistro);
    if(reg){
      setEvidencias(reg);
    }
  };

  useEffect(() => {
    setRegistro();
  },[])

  return (
    <Dialog
      open={open}
      onClose={handleOnClose}
      aria-labelledby='simple-modal-title'
      TransitionComponent={Transition}
      aria-describedby='simple-modal-description'
      className={classes.dialogBox}
      maxWidth={'sm'}
    >
      <Scrollbar style={{maxHeight: 600, minHeight: 200}}>
        <Box py={5} px={{xs: 5, lg: 8, xl: 10}}>
          <Grid container spacing={3} style={{ marginBottom: "16px"}}>
            <Grid item xs={6}>
              <TextField 
                value={evidencias?.foto_evidencia || ""}
                disabled
                label="Foto Evidencia"
                fullWidth
                size="small"
                />
            </Grid>
            <Grid item xs={6}>
              <TextField 
                value={evidencias?.numero_fotos || ""}
                disabled
                label="Número"
                fullWidth
                size="small"
              />
            </Grid>
          </Grid>
          <Dropzone
            onDrop={(acceptedFiles) => {
              if(acceptedFiles.length > (evidencias?.numero_fotos || 1)){
                dispatch(fetchError(`Solo puede cargar un máximo de ${evidencias?.numero_fotos || 1} archivos`));
                return;
              }
              if (acceptedFiles.length === 0) {
                dispatch(fetchError('Solo puede subir imágenes'));
              } else {
                setFotos(acceptedFiles);
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
                    if(files.length > (evidencias?.numero_fotos || 1)){
                      dispatch(fetchError(`Solo puede cargar un máximo de ${evidencias?.numero_fotos || 1} archivos`));
                      return;
                    }
                    if (files[0].type.includes('image')) {
                      setFotos(files);
                    } else {
                      dispatch(fetchError('Solo se aceptan imágenes'));
                    }
                  }}
                />
                <p>Arrastra una imagen o haz click para cargarla</p>
              </div>
            )}
          </Dropzone>
        </Box>
      </Scrollbar>
      <Box className={classes.bottomsGroup}>
        <Button
          className={`${classes.btnRoot} ${classes.btnPrymary}`}
          variant='contained'
          type='submit'>
          <IntlMessages id='boton.submit' />
        </Button>
        <Button
          className={`${classes.btnRoot} ${classes.btnSecundary}`}
          onClick={handleOnClose}>
          <IntlMessages id='boton.cancel' />
        </Button>
      </Box>
    </Dialog>
  )
};

export default AddPhoto;