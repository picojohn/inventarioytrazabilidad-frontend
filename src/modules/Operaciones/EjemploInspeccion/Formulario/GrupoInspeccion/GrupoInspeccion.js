import React, {useState} from 'react';
import {Box, IconButton, Tooltip, useTheme} from '@material-ui/core';
import {Add, Delete, Edit, Visibility} from '@material-ui/icons';
import {DataGrid, esES} from '@mui/x-data-grid';
import {useStyles} from 'shared/styles/commonStyles';
import GrupoInspeccionForm from './GrupoInspeccionForm';

export const tiposDocumentoEx = [
  {
    id: 1,
    tipo_documento_codigo: 102,
    tipo_documento: 'Cédula Ciudadanía',
  },
  {
    id: 2,
    tipo_documento_codigo: 103,
    tipo_documento: 'Cédula Extranjería',
  },
];

export const rows = [
  {
    id: 1,
    tipo_documento_codigo: 102,
    tipo_documento: 'Cédula Ciudadanía',
    documento: '70123456',
    nombre: 'Luis Lopez',
    cargo: 'Inspector',
  },
  {
    id: 2,
    tipo_documento_codigo: 103,
    tipo_documento: 'Cédula Extranjería',
    documento: '43287',
    nombre: 'Marcos Jaramillo',
    cargo: 'Inspector',
  },
  {
    id: 3,
    tipo_documento_codigo: 102,
    tipo_documento: 'Cédula Ciudadanía',
    documento: '79543123',
    nombre: 'Anibal Jimenez',
    cargo: 'Auxiliar Logística',
  },
];

const GrupoInspeccion = ({title}) => {
  const [grupoInspeccion, setGrupoInspeccion] = useState();
  const [seeForm, setSeeForm] = useState(false);
  const [action, setAction] = useState("ver");
  const [selectedInspector, setSelectedInspector] = useState();
  const classes = useStyles({vp: 0});
  const theme = useTheme();

  const handleAddInspector = () => {
    setAction("crear");
    setSelectedInspector();
    setSeeForm(true);
  }

  const handleOnClose = () => {
    setSeeForm(false);
    setAction("ver");
    setSelectedInspector();
  }

  const handleEditInspector = (id) => {
    setSeeForm(true);
    setAction("editar");
    setSelectedInspector(id);
  }

  const handleViewInspector = (id) => {
    setSeeForm(true);
    setAction("ver");
    setSelectedInspector(id);
  }

  const handleDeleteInspector = (id) => {
    rows.filter((row) => row.id === id)
  }

  const columns = [
    {
      field: 'acciones',
      headerName: 'Acciones',
      headerAlign: 'center',
      minWidth: 200,
      sortable: false,
      disableColumnMenu: true,
      align: 'center',
      renderCell: (params) => (
        <>
          <Tooltip title={'Editar'}>
            <IconButton
              onClick={() => handleEditInspector(params.id)}
            >
              <Edit
                className={`${classes.generalIcons} ${classes.visivilityIcon}`}
                style={{color: theme.palette.primary.main}}
              />
            </IconButton>
          </Tooltip>
          <Tooltip title={'Ver'}>
            <IconButton
              onClick={() => handleViewInspector(params.id)} 
            >
              <Visibility
                className={`${classes.generalIcons} ${classes.visivilityIcon}`}
                style={{color: theme.palette.grayBottoms}}
              />
            </IconButton>
          </Tooltip>
          <Tooltip title={'Eliminar'}>
            <IconButton
              onClick={() => handleDeleteInspector(params.id)}
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
      field: 'tipo_documento',
      headerName: 'Tipo Documento',
      minWidth: 200,
      flex: 1,
    },
    {
      field: 'documento',
      headerName: 'Documento',
      headerAlign: 'right',
      align: 'right',
      minWidth: 200,
      flex: 1,
    },
    {
      field: 'nombre',
      headerName: 'Nombre',
      minWidth: 200,
      flex: 1,
    },
    {
      field: 'cargo',
      headerName: 'Cargo',
      minWidth: 200,
      flex: 1,
    },
  ];

  return (
    <Box>
      <Box sx={{display: "flex", justifyContent: "flex-end", mb: 2}}>
        <Tooltip
          title='Añadir Inspector'
          onClick={handleAddInspector}>
          <IconButton
            className={classes.createButton}
            aria-label='filter list'>
              <Add />
          </IconButton>
        </Tooltip>
      </Box>
      <DataGrid
        rows={rows}
        columns={columns}
        density='compact'
        autoHeight={true}
        localeText={esES.props?.MuiDataGrid.localeText}
        disableSelectionOnClick
      />
      {seeForm && (
        <GrupoInspeccionForm 
          handleOnClose={handleOnClose} 
          open={seeForm} 
          selectedInspector={selectedInspector} 
          action={action}
          title={title}
          classes={classes}
        />
      )}
    </Box>
  );
};

export default GrupoInspeccion;
