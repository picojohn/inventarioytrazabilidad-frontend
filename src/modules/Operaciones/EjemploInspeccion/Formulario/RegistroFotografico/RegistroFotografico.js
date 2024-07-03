import React, {useState} from 'react';
import {Box, IconButton, Tooltip, Typography, useTheme} from '@material-ui/core';
import {Add, AddAPhoto, Delete, Edit, Visibility} from '@material-ui/icons';
import {DataGrid, esES} from '@mui/x-data-grid';
import {useStyles} from 'shared/styles/commonStyles';
import AddPhoto from './AddPhoto';

export const rows = [
  {
    id: 1,
    foto_evidencia: "Equipo Inspeccion",
    numero_fotos: "1",
    nombre_archivo: ["cedula-pp.jpg"],
  },
  {
    id: 2,
    foto_evidencia: "Conductor",
    numero_fotos: "1",
    nombre_archivo: [],
  },
  {
    id: 3,
    foto_evidencia: "Vehiculo",
    numero_fotos: "2",
    nombre_archivo: ["Cam-Cia.jpg", "Cam-Cia2.jpg"],
  },
  {
    id: 4,
    foto_evidencia: "Exterior Contenedor",
    numero_fotos: "4",
    nombre_archivo: ["cedula-pp.pdf"],
  },
];

const RegistroFotografico = ({title}) => {
  const [registroFoto, setRegistroFoto] = useState();
  const [seeForm, setSeeForm] = useState(false);
  const [selectedRegistro, setSelectedRegistro] = useState();
  const classes = useStyles({vp: 0});
  const theme = useTheme();

  const handleAddInspector = () => {
    setSelectedRegistro();
    setSeeForm(true);
  }

  const handleDeleteRegistro = () => {
    setSeeForm(false);
  }

  const handleChangePhotos = (id) => {
    setSeeForm(true);
    setSelectedRegistro(id);
  }

  const handleOnClose = () => {
    setSeeForm(false);
    setSelectedRegistro();
  }

  const columns = [
    {
      field: 'acciones',
      headerName: 'Acciones',
      headerAlign: 'center',
      minWidth: 150,
      sortable: false,
      disableColumnMenu: true,
      align: 'center',
      renderCell: (params) => (
        <>
          <Tooltip title={'Añadir Foto'}>
            <IconButton
              onClick={() => handleChangePhotos(params.id)}
            >
              <AddAPhoto
                className={`${classes.generalIcons} ${classes.visivilityIcon}`}
                style={{color: theme.palette.primary.main}}
              />
            </IconButton>
          </Tooltip>
          <Tooltip title={'Eliminar'}>
            <IconButton
              onClick={() => handleDeleteRegistro(params.id)}
            >
              <Delete
                className={`${classes.generalIcons} ${classes.visivilityIcon}`}
                style={{color: theme.palette.redBottoms}}
              />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
    {
      field: 'foto_evidencia',
      headerName: 'Foto evidencia',
      minWidth: 200,
      flex: 2,
    },
    {
      field: 'numero_fotos',
      headerName: 'Número',
      type: 'number',
      minWidth: 200,
      flex: 1,
    },
    {
      field: 'nombre_archivo',
      headerName: 'Nombre Archivo',
      minWidth: 200,
      flex: 2,
      renderCell: (params) => (
        <Typography>{params.row.nombre_archivo.join(", ")}</Typography>
      ),
    },
  ];

  return (
    <>
      <DataGrid
        rows={rows}
        columns={columns}
        density='compact'
        autoHeight={true}
        localeText={esES.props?.MuiDataGrid.localeText}
        disableSelectionOnClick
      />
      {seeForm && (
        <AddPhoto 
          selectedRegistro={selectedRegistro} 
          handleOnClose={handleOnClose} 
          open={seeForm}
          classes={classes}
        />
      )}
    </>
  );
};

export default RegistroFotografico;
