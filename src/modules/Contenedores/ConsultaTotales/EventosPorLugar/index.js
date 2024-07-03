import React from 'react';
import { Box, Checkbox, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts';
import { COLORS } from 'shared/constants/Constantes';
import { useState } from 'react';
import { useEffect } from 'react';

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '15px 0px',
    gap: 10,
    paddingBottom: 15,
  },
  tablesContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  fontBold: {
    fontWeight: 'bold'
  }
}));

const EventosPorLugar = (props) => {
  const {
    data,
  } = props;
  
  const [keys, setKeys] = useState([]);
  const classes = useStyles(props);

  useEffect(() => {
    if(data.length > 0){
      specifyKeys(data)
    }
  },[data])

  const handleClick = (name) => {
    const selectedIndex = keys.indexOf(name);
    let newSelected = [];
    if ( selectedIndex !==-1 && keys.length===1 ){
      return;
    }
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(keys, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(keys.slice(1));
    } else if (selectedIndex === keys.length - 1) {
      newSelected = newSelected.concat(keys.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        keys.slice(0, selectedIndex),
        keys.slice(selectedIndex + 1),
      );
    }

    setKeys(newSelected);
  };

  const isSelected = (name) => keys.indexOf(name) !== -1;

  const calcTotal = (row, ks) => {
    return ks.reduce((result, data) => result+=row[data], 0);
  }

  const specifyKeys = (datos) => {
    setKeys(Object.keys(datos[0]).slice(1))
  }

  return (
    <Box className={classes.mainContainer}>
      { keys.length > 0 && (
        <>
          <Box className={classes.tablesContainer}>
            <Box>
              <TableContainer component={Paper}>
                <Table size='small' aria-label='a dense table'>
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.fontBold} align={'center'} padding='checkbox'>
                        -
                      </TableCell>
                      <TableCell className={classes.fontBold} align={'left'}>
                        Evento
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.keys(data[0]).slice(1).map((row, index) => {
                      
                      const isItemSelected = isSelected(row);
                      return (
                        <TableRow 
                          key={index} 
                          role='checkbox' 
                          onClick={(e) => handleClick(row)}
                          aria-checked={isItemSelected} 
                          tabIndex={-1}
                          selected={isItemSelected}
                        >
                          <TableCell padding='checkbox'>
                            <Checkbox
                              checked={isItemSelected}
                              inputProps={{'aria-labelledby': index}}
                            />
                          </TableCell>
                          <TableCell 
                            key={index} 
                            component='th' 
                            scope='row' 
                            align={'left'}
                          >
                            {row}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
            <Box>
              <TableContainer component={Paper}>
                <Table size='small' aria-label='a dense table'>
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.fontBold} align={'left'}>
                        Almacén
                      </TableCell>
                      {keys.map((item, index) => {
                        return (
                          <TableCell key={index} className={classes.fontBold} align={'right'}>
                            {item}
                          </TableCell>
                        );
                      })}
                      <TableCell className={classes.fontBold} align={'right'}>
                        Total
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell 
                            component='th' 
                            scope='row' 
                            align={'left'}
                          >
                            {row['name']}
                        </TableCell>
                        {keys.map((k, index) => (
                          <TableCell 
                            key={index} 
                            component='th' 
                            scope='row' 
                            align={'right'}
                          >
                            {row[k]}
                          </TableCell>
                        ))}
                        <TableCell 
                            component='th' 
                            scope='row' 
                            align={'left'}
                          >
                            {calcTotal(row, keys)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
          <BarChart
            width={950}
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
              {keys.map((k, index) => (
                <Bar key={index} dataKey={k} fill={COLORS[index]}/>
              ))}
          </BarChart> 
        </>
      )}
    </Box>
  );
};

export default EventosPorLugar;
