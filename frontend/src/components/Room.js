// Room.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Grid, Button, Typography } from '@mui/material';
import CreateRoomPage from './CreateRoomPage';
import MusicPlayer from './MusicPlayer'; // Import MusicPlayer component

const Room = ({ leaveRoomCallback }) => {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const [votesToSkip, setVotesToSkip] = useState(2);
  const [guestCanPause, setGuestCanPause] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
  const [song, setSong] = useState({}); // Add song state

  const authenticateSpotify = useCallback(async () => {
    try {
      const response = await fetch('/spotify/is-authenticated');
      const data = await response.json();
      setSpotifyAuthenticated(data.status);
      console.log('Spotify Authenticated:', data.status);
      if (!data.status) {
        const authResponse = await fetch('/spotify/get-auth-url');
        const authData = await authResponse.json();
        window.location.replace(authData.url);
      }
    } catch (error) {
      console.error('Error authenticating Spotify:', error);
    }
  }, []);

  // Fetch room details
  const getRoomDetails = useCallback(async () => {
    try {
      const response = await fetch(`/api/get-room?code=${roomCode}`);
      if (!response.ok) {
        leaveRoomCallback();
        navigate('/');
        return;
      }
      const data = await response.json();
      setVotesToSkip(data.votes_to_skip);
      setGuestCanPause(data.guest_can_pause);
      setIsHost(data.is_host);

      if (data.is_host) {
        authenticateSpotify();
      }
    } catch (error) {
      console.error('Error fetching room details:', error);
      setErrorMsg('Failed to load room details. Please try again.');
      leaveRoomCallback();
      navigate('/');
    }
  }, [roomCode, navigate, leaveRoomCallback, authenticateSpotify]);

  useEffect(() => {
    getRoomDetails();
  }, [getRoomDetails]);

  // Fetch current song
  const getCurrentSong = useCallback(async () => {
    try {
      const response = await fetch('/spotify/current-song');
      if (response.ok) {
        const data = await response.json();
        setSong(data);
        console.log('Current Song:', data);
      } else {
        setSong({});
      }
    } catch (error) {
      console.error('Error fetching current song:', error);
    }
  }, []);

  // Poll for the current song every second
  useEffect(() => {
    const interval = setInterval(getCurrentSong, 1000);
    return () => clearInterval(interval); // Cleanup on unmount
  }, [getCurrentSong]);

  const leaveButtonPressed = async () => {
    try {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      };
      const response = await fetch('/api/leave-room', requestOptions);

      if (response.ok) {
        leaveRoomCallback();
        navigate('/');
      } else {
        console.error('Failed to leave room:', response.status);
        setErrorMsg('Failed to leave the room. Please try again.');
      }
    } catch (error) {
      console.error('Error leaving room:', error);
      setErrorMsg('An error occurred while trying to leave the room.');
    }
  };

  const renderSettings = () => (
    <Grid container spacing={1}>
      {errorMsg && (
        <Grid item xs={12} align="center">
          <Typography color="error">{errorMsg}</Typography>
        </Grid>
      )}
      <Grid item xs={12} align="center">
        <CreateRoomPage
          update
          votesToSkip={votesToSkip}
          guestCanPause={guestCanPause}
          roomCode={roomCode}
          updateCallback={getRoomDetails}
        />
      </Grid>
      <Grid item xs={12} align="center">
        <Button variant="contained" color="secondary" onClick={() => setShowSettings(false)}>
          Close
        </Button>
      </Grid>
    </Grid>
  );

  const renderSettingsButton = () => (
    <Grid item xs={12} align="center">
      <Button variant="contained" color="primary" onClick={() => setShowSettings(true)}>
        Settings
      </Button>
    </Grid>
  );

  return showSettings ? (
    renderSettings()
  ) : (
    <Grid container spacing={1}>
      {errorMsg && (
        <Grid item xs={12} align="center">
          <Typography color="error">{errorMsg}</Typography>
        </Grid>
      )}
      <Grid item xs={12} align="center">
        <Typography variant="h4" component="h4">
          Code: {roomCode}
        </Typography>
      </Grid>
      {/* Render the MusicPlayer component */}
      <MusicPlayer {...song} />
      {isHost && renderSettingsButton()}
      <Grid item xs={12} align="center">
        <Button variant="contained" color="secondary" onClick={leaveButtonPressed}>
          Leave Room
        </Button>
      </Grid>
    </Grid>
  );
};

export default Room;
