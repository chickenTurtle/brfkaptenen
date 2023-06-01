import { CircularProgress, Grid } from "@mui/material";

function Loading(props) {
    return (props.overlay ?
        <Grid
            container
            spacing={0}
            position="absolute"
            direction="column"
            alignItems="center"
            justifyContent="center"
            sx={{ minHeight: '100vh', marginTop: -20, background: "rgba(45,45,45,0.55)", zIndex: 1000 }}
        >
            <Grid item xs={3}>
                <CircularProgress />
            </Grid>
        </Grid>
        :
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            sx={{ minHeight: '100vh' }}
        >
            <Grid item xs={3}>
                <CircularProgress />
            </Grid>
        </Grid>
    )
};

export default Loading;