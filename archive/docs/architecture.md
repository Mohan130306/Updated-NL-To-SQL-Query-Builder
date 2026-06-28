# System Architecture

## Overview

The AI-Powered Natural Language to SQL Query Builder enables users to interact with a SQLite database using plain English questions. The system converts natural language into SQL queries using Google's Gemini AI model, validates the generated query for security, executes it on a SQLite database, and displays the results through a Streamlit web application.

---

## Architecture Flow

User Question
↓
Gemini AI Model
↓
SQL Generator
↓
Safety Checker
↓
SQLite Query Executor
↓
Result Processing
↓
Streamlit User Interface

---

## Components

### 1. Streamlit Frontend

Responsible for:

* Accepting user questions
* Displaying generated SQL
* Showing query results
* Displaying explanations and history

### 2. Schema Reader

Responsible for:

* Reading SQLite database schema
* Extracting table names
* Extracting column information
* Providing schema context to Gemini

### 3. Gemini AI Engine

Responsible for:

* Understanding user intent
* Generating valid SQLite queries
* Following database schema constraints

### 4. Safety Checker

Responsible for:

* Preventing unsafe SQL operations
* Blocking INSERT, UPDATE, DELETE, DROP, ALTER, TRUNCATE and PRAGMA commands
* Allowing only SELECT statements

### 5. Query Executor

Responsible for:

* Executing validated SQL queries
* Returning results from SQLite database
* Handling execution errors

### 6. SQLite Database

Stores:

* Student information
* Department details
* CGPA records
* Academic year data

---

## Security Layer

Only SELECT queries are permitted.

Blocked Operations:

* INSERT
* UPDATE
* DELETE
* DROP
* ALTER
* TRUNCATE
* ATTACH
* PRAGMA

This ensures read-only database access.

---

## Technology Stack

Frontend: Streamlit

Programming Language: Python 3.11

Database: SQLite

AI Model: Gemini 2.5 Flash

Version Control: GitHub

Deployment: Streamlit Community Cloud

---

## Future Enhancements

* Support multiple tables
* Query explanation module
* Authentication and user management
* Database upload feature
* Query visualization dashboard
* Export results to CSV and Excel
