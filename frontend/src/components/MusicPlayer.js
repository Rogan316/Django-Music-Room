
import React from "react";
import {
  Grid,
  Typography,
  Card,
  IconButton,
  LinearProgress,
} from "@mui/material"; // MUI v5
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";

// Helper function to format milliseconds to mm:ss
const formatTime = (ms) => {
  const totalSeconds = Math.floor(ms / 1000); // Convert ms to seconds
  const minutes = Math.floor(totalSeconds / 60); // Get minutes
  const seconds = totalSeconds % 60; // Get remaining seconds
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`; // Format as mm:ss
};

const MusicPlayer = ({
  title = "No Song Playing",
  artist = "Unknown Artist",
  is_playing = false,
  time = 0, // in milliseconds
  duration = 0, // in milliseconds
  image_url = "",
  votes = 0,
  votes_required = 0,
}) => {
  
  const skipSong = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    await fetch("/spotify/skip", requestOptions);
  }

  const pauseSong = async () => {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    };
    await fetch("/spotify/pause", requestOptions);
  };

  const playSong = async () => {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    };
    await fetch("/spotify/play", requestOptions);
  };

  const songProgress =
    duration > 0 ? Math.min((time / duration) * 100, 100) : 0;

  return (
    <Card sx={{ padding: 2, marginTop: 2 }}>
      <Grid container alignItems="center">
        <Grid item align="center" xs={4}>
          {image_url ? (
            <img
              src={image_url}
              alt={`${title} album cover`}
              style={{ height: "100%", width: "100%", objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                height: "100px",
                width: "100px",
                backgroundColor: "#ccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="caption">No Image</Typography>
            </div>
          )}
        </Grid>
        <Grid item align="center" xs={8}>
          <Typography component="h5" variant="h5">
            {title}
          </Typography>
          <Typography color="textSecondary" variant="subtitle1">
            {artist}
          </Typography>
          <div>
            <IconButton
              aria-label="play/pause"
              onClick={is_playing ? pauseSong : playSong}
            >
              {is_playing ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
            <IconButton aria-label="skip" onClick={skipSong}>
              <SkipNextIcon />
              <Typography variant="caption" sx={{ marginLeft: 0.5 }}>
                {votes} / {votes_required}
              </Typography>
            </IconButton>
          </div>
        </Grid>
      </Grid>
      <LinearProgress
        variant="determinate"
        value={songProgress}
        sx={{ marginTop: 1 }}
      />
      <Typography variant="caption" display="block" align="center">
        {formatTime(time)} / {formatTime(duration)}
      </Typography>
    </Card>
  );
};

export default MusicPlayer;
