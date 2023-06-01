import { AppBar, Box, Button, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from "react-router-dom";

function NavBar(props) {
    let navigate = useNavigate();

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            BRF Kaptenen
                        </Typography>
                        <Button color="inherit" onClick={() => navigate("/logout")}>Logga ut</Button>
                    </Toolbar>
                </AppBar>
            </Box>
            {props.children}
        </>
    )
}

export default NavBar;