import React from 'react';
import { Box, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { PieChart, Legend, Tooltip, Pie, Cell } from 'recharts';
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
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
    }
  },
  fontBold: {
    fontWeight: 'bold'
  }
}));

const RADIAN = Math.PI / 180;

const calcPosition = (radius, middleAngle, cx, cy) => {
  let x,y = 0;
  if (middleAngle <= 90) {
    x = cx + radius * Math.cos(middleAngle * RADIAN);
    y = cy - radius * Math.sin(middleAngle * RADIAN);
  } else if (middleAngle <= 180) {
    x = cx - radius * Math.sin((middleAngle - 90) * RADIAN);
    y = cy - radius * Math.cos((middleAngle - 90) * RADIAN);
  } else if (middleAngle <= 270) {
    x = cx - radius * Math.cos((middleAngle - 180) * RADIAN);
    y = cy + radius * Math.sin((middleAngle - 180) * RADIAN);
  } else {
    x = cx + radius * Math.sin((middleAngle - 270) * RADIAN);
    y = cy + radius * Math.cos((middleAngle - 270) * RADIAN);
  }
  return {x, y};
};

// const data = [
//   { name: 'Kit Migracion 072022', value: 33},
//   { name: 'Sello Adhesivo Pequeño', value: 1031},
//   { name: 'Sello Botella', value: 920},
//   { name: 'Sello Guayita Corto 30 cm', value: 79},
//   { name: 'Sello Guayita Largo', value: 63},
//   { name: 'Sello Guayita tipo botella', value: 771},
//   { name: 'Sello Plástico', value: 4134},
// ];

const InstalacionesPorProducto = (props) => {
  const {
    data
  } = props;

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = outerRadius * 0.8;
    const otherRadius = outerRadius * 1.32;
    const {x, y} = calcPosition(radius, midAngle, cx, cy);
    const {x: x2, y: y2} = calcPosition(otherRadius, midAngle, cx, cy);
    const addY = index%2===0?8:-8;
    return (
      <>
        <text
          x={x}
          y={y-addY}
          fill='white'
          textAnchor={'middle'}
          dominantBaseline='central'
          style={{fontSize: 14}}>
          {`${data[index].value}`}
        </text>
        {/* <text
          x={x2}
          y={y2 - 8}
          fill='black'
          textAnchor={'middle'}
          dominantBaseline='central'
          style={{fontSize: 12}}>
          {`${data[index].name}`}
        </text> */}
        <text
          x={x2}
          y={y2-addY}
          fill='black'
          textAnchor={'middle'}
          dominantBaseline='central'
          style={{fontSize: 12}}>
          {`${(percent * 100).toFixed(2)}%`}
        </text>
      </>
    );
  };
  
  const classes = useStyles(props);

  return (
    <Box className={classes.container}>
      <Box>
        <TableContainer component={Paper}>
          <Table size='small' aria-label='a dense table'>
            <TableHead>
              <TableRow>
                  <TableCell className={classes.fontBold}>Producto</TableCell>
                  <TableCell className={classes.fontBold}>Instalaciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell component='th' scope='row'>{row.name}</TableCell>
                  <TableCell align='right'>{row.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <PieChart width={500} height={500}>
        <Pie
          data={data}
          cx='50%'
          cy='50%'
          outerRadius={150}
          fill='#8884d8'
          dataKey='value'
          isAnimationActive={false}
          labelLine
          label={renderCustomizedLabel}
        >
          {data.map((item, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]}/>
          ))}
        </Pie>
        <Tooltip/>
        <Legend/>
      </PieChart> 
    </Box>
  );
};

export default InstalacionesPorProducto;
