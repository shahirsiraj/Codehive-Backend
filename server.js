require('dotenv').config()
const express = require('express');
// const methodOverride = require('method-override')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express();
const port = 3000;


app.use(express.static('public'))


app.use(express.urlencoded({extended: true})) // same as above
app.use(express.json())

app.use(methodOverride('_method'))

app.use(cors({
  origin: '*'
}))

// handle cors pre-flight requests
app.options('*', cors())
