import React, { Component } from 'react';
import RoomJoinPage from './RoomJoinPage';
import CreateRoomPage from './CreateRoomPage';
import Room from './room';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Grid, Button, ButtonGroup, Typography } from '@mui/material';
import Info from './info';

export default class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomCode: null,
        };
        this.clearRoomCode = this.clearRoomCode.bind(this); // Bind the method
    }

    async componentDidMount() {
        fetch('/api/user-in-room')
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    roomCode: data.code,
                });
            });
    }

    clearRoomCode() {
        this.setState({ roomCode: null });
    }

    renderHomePage() {
        return (
            <Grid container spacing={3} alignItems="center" justifyContent="center" align="center">
                <Grid item xs={12} align="center">
                    <Typography variant="h3">Bloc Party</Typography>
                </Grid>
                <ButtonGroup disableElevation variant="contained" color="primary">
                    <Button color="primary" to="/join" component={Link}>
                        Join a Room
                    </Button>
                    <Button color="inherit" to="/info" component={Link}>
                        info
                    </Button>
                    <Button color="secondary" to="/create" component={Link}>
                        Create a Room
                    </Button>
                </ButtonGroup>
                <Grid item xs={12} align="center"></Grid>
            </Grid>
        );
    }

    render() {
        return (
            <Router>
                <Routes>
                    <Route
                        path="/"
                        element={
                            this.state.roomCode ? (
                                <Navigate to={`/room/${this.state.roomCode}`} />
                            ) : (
                                this.renderHomePage()
                            )
                        }
                    />
                    <Route path="/join" element={<RoomJoinPage />} />
                    <Route path="/info" element={<Info />} />
                    <Route path="/create" element={<CreateRoomPage />} />

                    <Route
                        path="/room/:roomCode"
                        element={<Room leaveRoomCallback={this.clearRoomCode} />} // Pass clearRoomCode as a prop
                    />
                </Routes>
            </Router>
        );
    }
}
