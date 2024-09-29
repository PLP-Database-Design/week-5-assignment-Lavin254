const express = require("express");
const app = express();

require("dotenv").config();

const mysql = require("mysql2");

// Create a connection to the database using environment variables
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    return console.error("Error connecting: " + err.stack);
  }
  console.log("Connected as id " + connection.threadId);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Question 1 goes here
const PATIENTS_QUERY =
  "SELECT patient_id, first_name, last_name, date_of_birth FROM patients;";
app.get("/patients", (req, res) => {
  // query the database
  connection.query(PATIENTS_QUERY, (error, results) => {
    if (error) {
      res.send("Error in fetching patients please try again.");
      return;
    }
    res.send({ patients: results });
  });
});

// Question 2 goes here
const PROVIDERS_QUERY =
  "SELECT first_name, last_name, provider_specialty FROM providers;";
app.get("/providers", (req, res) => {
  // query the database
  connection.query(PROVIDERS_QUERY, (error, results) => {
    if (error) {
      res.send("Error in fetching providers please try again.");
      return;
    }
    res.send({ providers: results });
  });
});

// Question 3 goes here
app.get("/patients_by_name", (req, res) => {
  // construct query
  const first_name = req.query.name;
  const PATIENTS_QUERY_FILTERED_BY_FIRST_NAME = `SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = "${first_name}";`;
  // query the database
  connection.query(PATIENTS_QUERY_FILTERED_BY_FIRST_NAME, (error, results) => {
    if (error) {
      res.send(
        "Error in fetching patients filtered by their first_name, please try again."
      );
      return;
    }
    res.send({ patients: results });
  });
});

// Question 4 goes here
app.get("/providers_by_specialty", (req, res) => {
  // construct query
  const specialty = req.query.specialty;
  const PROVIDERS_QUERY_FILTERED_BY_SPECIALTY = `SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = "${specialty}";`;
  // query the database
  connection.query(PROVIDERS_QUERY_FILTERED_BY_SPECIALTY, (error, results) => {
    if (error) {
      res.send(
        "Error in fetching providers filtered by their specialty, please try again."
      );
      return;
    }
    res.send({ providers: results });
  });
});

// listen to the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`server is runnig on http://localhost:${PORT}`);
});
