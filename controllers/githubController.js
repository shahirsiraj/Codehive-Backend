require('dotenv').config('../../.env');
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());



app.get('/getAccessToken', async function (req, res) {
  const code = req.query.code;
  const params = `?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${code}`;

  try {
    const response = await axios.post("https://github.com/login/oauth/access_token" + params, {
      headers: {
        "Accept": "application/json"
      }
    });

    accessToken = response.data.access_token;
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve access token' });
  }
});

app.get('/getUserData', async function (req, res) {
  try {
    const response = await axios.get("https://api.github.com/user", {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Accept": "application/vnd.github.v3+json"
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve user data' });
  }
});


app.get('/repositories/:username', async (req, res) => {
    const username = req.params.username;
  
    try {
      const repositories = await getUserRepositories(username);
      res.json(repositories);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve user repositories' });
    }
  });
  
  // Function to retrieve user repositories
  async function getUserRepositories(username) {
    try {
      const response = await axios.get(`https://api.github.com/users/${username}/repos`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github.v3+json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to retrieve user repositories');
    }
  }

  app.get('/profile/:username', async (req, res) => {
    const username = req.params.username;
  
    try {
      const userProfile = await getUserProfile(username);
      res.json(userProfile);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve user profile' });
    }
  });
  
  async function getUserProfile(username) {
    try {
      const response = await axios.get(`https://api.github.com/users/${username}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github.v3+json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to retrieve user profile');
    }
  }
  
  
  module.exports = { getUserRepositories, getUserProfile };

