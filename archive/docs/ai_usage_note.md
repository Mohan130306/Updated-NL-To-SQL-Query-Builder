# AI Usage Note

## Project Title

AI-Powered Natural Language to SQL Query Builder for SQLite

---

## Objective

The objective of this project is to enable non-technical users to retrieve information from a database using natural language instead of manually writing SQL queries.

The application uses Artificial Intelligence to understand user questions, generate SQL queries, validate them for safety, execute them on a SQLite database, and present the results through a user-friendly interface.

---

## AI Technologies Used

### AI Model

* Google Gemini 2.5 Flash
* Gemini API

### Frameworks and Tools

* Python 3.11
* Streamlit
* SQLite
* Pandas
* Google Generative AI SDK

---

## How AI Was Used

### 1. Natural Language to SQL Conversion

The primary AI capability of the project is converting plain English questions into valid SQLite queries.

Example:

User Input:

Show all students with CGPA above 8.5

Generated SQL:

SELECT * FROM students WHERE cgpa > 8.5;

---

### 2. Schema-Aware SQL Generation

The system dynamically reads the SQLite database schema and provides it as context to Gemini.

Example Schema:

Table: students

Columns:

* student_id
* name
* department
* cgpa
* year

This allows the AI model to generate accurate SQL queries using only available tables and columns.

---

### 3. AI Workflow

The implemented workflow is:

User Question
↓
Read Database Schema
↓
Generate SQL using Gemini
↓
Validate SQL
↓
Execute Query
↓
Display Results

This demonstrates an AI-assisted database interaction workflow.

---

### 4. Prompt Engineering

The following prompt strategy was used:

You are an expert SQLite SQL generator.

Database Schema:
{schema}

Rules:

* Generate ONLY SQLite SELECT queries.
* Do NOT generate explanations.
* Do NOT generate markdown.
* Return only SQL.
* Use only available schema fields.

Question:
{user_question}

This prompt helps ensure accurate SQL generation and prevents hallucinations.

---

### 5. Security Validation

All AI-generated SQL is validated before execution.

Allowed:

* SELECT

Blocked:

* INSERT
* UPDATE
* DELETE
* DROP
* ALTER
* TRUNCATE
* ATTACH
* PRAGMA

Example:

User Input:
Delete all students

Generated SQL:
DELETE FROM students;

Result:
Query Blocked by Safety Layer

---

## Challenges Faced

1. Converting natural language into valid SQLite syntax.
2. Preventing unsafe database operations.
3. Migrating from local Ollama-based inference to Gemini API for cloud deployment.
4. Managing API keys securely during deployment.
5. Handling Python package and dependency issues during integration.

---

## Lessons Learned

* Prompt engineering significantly affects SQL generation quality.
* Database safety checks are essential when executing AI-generated code.
* Cloud-hosted AI APIs simplify deployment compared to local LLM inference.
* Schema-aware prompting improves query accuracy.
* AI can make databases accessible to non-technical users.

---

## Conclusion

This project successfully demonstrates how Generative AI can bridge the gap between natural language and database querying. Users can interact with a SQLite database using simple English questions while maintaining security through query validation and controlled execution.
