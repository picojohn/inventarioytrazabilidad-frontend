import React from 'react';
import TableCell from '@material-ui/core/TableCell';

const MyCell = (props) => {
  const {align, width, claseBase, value, cellColor, useStyles} = props;
  const classes = useStyles({width: width, cellColor: cellColor});

  let allClassName = claseBase;

  if (width !== undefined) {
    allClassName = `${allClassName} ${classes.cellWidth}`;
  }

  return (
    <TableCell align={align} className={allClassName}>
      <span className={cellColor ? classes.cellColor : ''}>{value}</span>
    </TableCell>
  );
};

export default MyCell;
