import React, { useState, useEffect } from "react";
import { Grid, Typography, Button, IconButton } from "@mui/material";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Link } from "react-router-dom";

const pages = {
    JOIN: 'pages.join',
    CREATE: 'pages.create',
};

export default function Info(props) {
    const [page, setPage] = useState(pages.JOIN);

    function joinInfo() {
        return "Join Page";
    }

    function createInfo() {
        return "Create Page";
    }

    useEffect(() => {console.log("ran");
            return () => {
                console.log("cleanup");
            };
    });

    const togglePage = () => {
        if (page === pages.CREATE) {
            setPage(pages.JOIN);
        } else {
            setPage(pages.CREATE);
        }
    };

    return (
        <Grid container spacing={1} align="center">
            <Grid item xs={12} align="center">
                <Typography component="h4" variant="h4">
                    What is Bloc Party?
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="body1">
                    {page === pages.JOIN ? joinInfo() : createInfo()}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <IconButton onClick={togglePage}>
                    {page === pages.CREATE ? <NavigateBeforeIcon /> : <NavigateNextIcon />}
                </IconButton>
            </Grid>
            <Grid item xs={12} align="center">
                <Button color="secondary" variant="contained" to="/" component={Link}> 
                    Back
                </Button>
            </Grid>
        </Grid>
    );
}
