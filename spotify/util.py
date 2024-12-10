from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
from requests import post, put, get
from dotenv import load_dotenv
import os

load_dotenv()

BASE_URL = "https://api.spotify.com/v1/me/"

def get_user_tokens(session_id):
    user_tokens = SpotifyToken.objects.filter(user=session_id)
    if user_tokens.exists():
        return user_tokens[0]
    else:
        return None

def update_or_create_user_tokens(session_id, access_token, token_type, expires_in, refresh_token=None):
    tokens = get_user_tokens(session_id)
    expires_in = timezone.now() + timedelta(seconds=expires_in)

    if tokens:
        tokens.access_token = access_token
        tokens.token_type = token_type
        tokens.expires_in = expires_in
        if refresh_token:
            tokens.refresh_token = refresh_token
        tokens.save(update_fields=['access_token', 'token_type', 'expires_in', 'refresh_token'])
    else:
        tokens = SpotifyToken(
            user=session_id,
            access_token=access_token,
            token_type=token_type,
            expires_in=expires_in,
            refresh_token=refresh_token
        )
        tokens.save()

def is_spotify_authenticated(session_id):
    tokens = get_user_tokens(session_id)
    if tokens:
        if tokens.expires_in <= timezone.now():
            refresh_spotify_token(session_id)
        return True
    return False

def refresh_spotify_token(session_id):
    tokens = get_user_tokens(session_id)
    if tokens is None:
        return  # Handle the case where tokens are not found

    refresh_token = tokens.refresh_token

    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
        'client_id': os.getenv('CLIENT_ID'),
        'client_secret': os.getenv('CLIENT_SECRET'),
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    expires_in = response.get('expires_in')
    new_refresh_token = response.get('refresh_token')

    # Use existing refresh token if new one is not provided
    if new_refresh_token is None:
        new_refresh_token = refresh_token

    update_or_create_user_tokens(session_id, access_token, token_type, expires_in, new_refresh_token)

def execute_spotify_api_request(session_id, endpoint, post_=False, put_=False):
    tokens = get_user_tokens(session_id)
    if tokens is None:
        print(f"No tokens found for session_id: {session_id}")
        return {'Error': 'User not authenticated'}

    if tokens.expires_in <= timezone.now():
        print("Access token expired, refreshing...")
        refresh_spotify_token(session_id)
        tokens = get_user_tokens(session_id)

    print(f"Using access token: {tokens.access_token}")

    headers = {
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + tokens.access_token
    }

    url = BASE_URL + endpoint

    try:
        if post_:
            response = post(url, headers=headers)
        elif put_:
            response = put(url, headers=headers)
        else:
            response = get(url, headers=headers)

        # Log the status code and response content
        print(f"Spotify API response status code: {response.status_code}")
        print(f"Spotify API response content: {response.content}")

        # Handle 204 No Content response
        if response.status_code == 204:
            print("Spotify API returned 204 No Content")
            return {'Error': 'No Content', 'Content': {}}

        # Handle non-success status codes
        if response.status_code >= 400:
            print(f"Spotify API returned error status code {response.status_code}")
            print(f"Response content: {response.content}")
            try:
                return {'Error': f"Spotify API returned status code {response.status_code}", 'Content': response.json()}
            except ValueError:
                return {'Error': f"Spotify API returned status code {response.status_code}", 'Content': {}}

        # Attempt to parse the JSON response
        try:
            return response.json()
        except ValueError:
            print("Response content is not valid JSON")
            return {'Error': 'Invalid JSON in response', 'Content': {}}
    except Exception as e:
        print(f"Error in execute_spotify_api_request: {e}")
        return {'Error': 'Issue with request'}

def play_song(session_id):
    return execute_spotify_api_request(session_id, "player/play", put_=True)

def pause_song(session_id):
    return execute_spotify_api_request(session_id, "player/pause", put_=True)

def skip_song(session_id):
    return execute_spotify_api_request(session_id, "player/next", post_=True)