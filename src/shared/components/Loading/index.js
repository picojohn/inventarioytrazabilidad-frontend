import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Dialog, makeStyles, Slide } from "@material-ui/core";
import { Fonts } from "shared/constants/AppEnums";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='down' ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  dialogBox: {
    position: 'relative',
    '& .MuiDialog-paperWidthSm': {
      maxWidth: 600,
      width: '100%',
      boxShadow: 'none',
      backgroundColor: 'transparent'
      // maxHeight:'fit-content'
    },
    '& .MuiTypography-h6': {
      fontWeight: Fonts.LIGHT,
    },
  },
  center: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10
  }
}));

const Loading = (props) => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
    }, 800);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const classes = useStyles(props);
  return (
    <Dialog
      open={true}
      onClose={() => console.log('cerrado')}
      TransitionComponent={Transition}
      className={classes.dialogBox}
      fullWidth
      maxWidth={'sm'}
    >
      <Box className={classes.center}>
        <CircularProgress
          size={100}
          variant="determinate"
          value={progress}
        />
      </Box>
    </Dialog>
  );
} 

export default Loading;