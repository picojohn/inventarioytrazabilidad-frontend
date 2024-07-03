import React from 'react';
import { Box, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts';
import { COLORS } from 'shared/constants/Constantes';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '15px 0px',
    gap: 10,
    paddingBottom: 15,
  },
  fontBold: {
    fontWeight: 'bold'
  }
}));

// const data = [
//   { name: 'Itagui', kit: 20,	sello_adhesivo_pequeño: 862,	sello_botella: 755,	sello_guayita_corto_30_cm: 79,	sello_guayita_largo: 63,	sello_guayita_tipo_botella: 672,	sello_plastico: 1645, sello_plastico_2: 1645, sello_plastico_3: 1645,	total: 4096,},
//   { name: 'Cali', kit: 0,	sello_adhesivo_pequeño: 110,	sello_botella: 106,	sello_guayita_corto_30_cm: 0,	sello_guayita_largo: 0,	sello_guayita_tipo_botella: 52,	sello_plastico: 604, sello_plastico_2: 604, sello_plastico_3: 604,	total: 872,},
//   { name: 'Desp int', kit: 0,	sello_adhesivo_pequeño: 0,	sello_botella: 0,	sello_guayita_corto_30_cm: 0,	sello_guayita_largo: 0,	sello_guayita_tipo_botella: 0,	sello_plastico: 736, sello_plastico_2: 736, sello_plastico_3: 736,	total: 736,},
//   { name: 'Rio Negro Group Seb', kit: 0,	sello_adhesivo_pequeño: 0,	sello_botella: 0,	sello_guayita_corto_30_cm: 0,	sello_guayita_largo: 0,	sello_guayita_tipo_botella: 0,	sello_plastico: 600, sello_plastico_2: 600, sello_plastico_3: 600,	total: 600,},
//   { name: 'Manizales', kit: 13,	sello_adhesivo_pequeño: 7,	sello_botella: 0,	sello_guayita_corto_30_cm: 0,	sello_guayita_largo: 0,	sello_guayita_tipo_botella: 0,	sello_plastico: 349, sello_plastico_2: 349, sello_plastico_3: 349,	total: 369,},
//   { name: 'Dosquebradas', kit: 0,	sello_adhesivo_pequeño: 4,	sello_botella: 3,	sello_guayita_corto_30_cm: 0,	sello_guayita_largo: 0,	sello_guayita_tipo_botella: 1,	sello_plastico: 153, sello_plastico_2: 153, sello_plastico_3: 153,	total: 161,},
//   { name: 'Rio Negro', kit: 0,	sello_adhesivo_pequeño: 48,	sello_botella: 52,	sello_guayita_corto_30_cm: 0,	sello_guayita_largo: 0,	sello_guayita_tipo_botella: 46,	sello_plastico: 15, sello_plastico_2: 15, sello_plastico_3: 15,	total: 161,},
//   { name: 'Barbosa', kit: 0,	sello_adhesivo_pequeño: 0,	sello_botella: 0,	sello_guayita_corto_30_cm: 0,	sello_guayita_largo: 0,	sello_guayita_tipo_botella: 0,	sello_plastico: 28, sello_plastico_2: 28, sello_plastico_3: 28,	total: 28,},
//   { name: 'Paraguachon', kit: 0,	sello_adhesivo_pequeño: 0,	sello_botella: 4,	sello_guayita_corto_30_cm: 0,	sello_guayita_largo: 0,	sello_guayita_tipo_botella: 0,	sello_plastico: 4, sello_plastico_2: 4, sello_plastico_3: 4,	total: 8,},
// ];

const InstalacionesXLugarXProducto = (props) => {
  const {
    data,
  } = props;

  const classes = useStyles(props);
  const keys = Object.keys(data[0]);

  return (
    <Box className={classes.container}>
      <Box>
        <TableContainer component={Paper}>
          <Table size='small' aria-label='a dense table'>
            <TableHead>
              <TableRow>
                {keys.map((item, index) => {
                  return (
                    <TableCell key={index} className={classes.fontBold} align={!!!index?'left':'right'}>
                      {!!!index ? 'Almacén' : item}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  {keys.map((k, index) => (
                    <TableCell 
                      key={index} 
                      component='th' 
                      scope='row' 
                      align={!!!index?'left':'right'}
                    >
                      {row[k]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <BarChart
        width={1200}
        height={400}
        data={data}
        margin={{
          top: 10,
          right: 30, 
          left: 0,
          bottom: 0
        }}
      >
        <CartesianGrid strokeDasharray='3 3'/>
        <XAxis 
          dataKey='name' 
          angle={-30} 
          textAnchor='end' 
          height={100}
          allowDataOverflow
          interval={0}
        />
        <YAxis
          domain={
            [0, dataMax => parseInt(dataMax*1.1)]
          }
        />
        <Tooltip/>
        <Legend 
          verticalAlign='middle' 
          layout='vertical' 
          align='right'
          wrapperStyle={{
            paddingLeft: 8
          }}
        />
        {keys.slice(1, keys.length-1).map((k, index) => (
          <Bar key={index} dataKey={k} fill={COLORS[index]}/>
        ))}
      </BarChart> 
    </Box>
  );
};

export default InstalacionesXLugarXProducto;
