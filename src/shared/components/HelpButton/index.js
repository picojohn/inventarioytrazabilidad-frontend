import React from 'react'
import { IconButton, makeStyles, Tooltip } from '@material-ui/core';
import { HelpOutline } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  createButton: {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    padding: 5,
    height: 48,
    aspectRatio: 1/1,
    boxShadow:
      '0px 3px 5px -1px rgb(0 0 0 / 30%), 0px 6px 10px 0px rgb(0 0 0 / 20%), 0px 1px 18px 0px rgb(0 0 0 / 16%)',
    '&:hover': {
      backgroundColor: theme.palette.colorHover,
      cursor: 'pointer',
    },
  },
}));

export default function HelpButton(props) {
  const {url} = props;
  const classes = useStyles();

  const onClick = (url) => {
    if(url) window.open(url, '_blank').focus()
  }

  return (
    <Tooltip
      title='Ayuda'
      onClick={() => onClick(url)}>
      <IconButton
        className={classes.createButton}
        aria-label='filter list'>
        <HelpOutline style={{fontSize: 40, color: 'white'}}/>
      </IconButton>
    </Tooltip>
  )
}
