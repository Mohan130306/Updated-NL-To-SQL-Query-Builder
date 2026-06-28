# Prompts Used During Development

## 1. Project Architecture Planning

Prompt:

Build a complete AI-Powered Natural Language to SQL Query Builder using Python, Streamlit, SQLite and Gemini AI. The application should convert natural language questions into SQL queries, validate them, execute them safely on a SQLite database and display results through a user-friendly web interface.

Purpose:
Used to design the overall system architecture and project structure.

---

## 2. Database Schema Design

Prompt:

Create a SQLite database for a student management system containing the following fields:
student_id, name, department, cgpa, year.

Generate sample data suitable for testing Natural Language to SQL conversion.

Purpose:
Used to create the SQLite database and sample records.

---

## 3. Schema Reader Development

Prompt:

Create a Python module that reads SQLite database metadata and returns table names and column information dynamically. The output should be usable as context for an AI model generating SQL queries.

Purpose:
Used to build schema_reader.py.

---

## 4. SQL Generation Prompt

Prompt Template:

You are an expert SQLite SQL generator.

Database Schema:
{schema}

Rules:

1. Generate ONLY SQLite SELECT queries.
2. Do NOT generate explanations.
3. Do NOT generate markdown.
4. Do NOT generate code blocks.
5. Return only SQL.
6. Use only columns from the schema.

Question:
{user_question}

Purpose:
Used by Gemini AI to convert natural language into SQL.

---

## 5. Safety Validation Design

Prompt:

Design a safety layer for an AI-powered SQL generator. Allow only SELECT statements and block INSERT, UPDATE, DELETE, DROP, ALTER, TRUNCATE, ATTACH and PRAGMA operations.

Purpose:
Used to create safety_checker.py.

---

## 6. Query Execution Module

Prompt:

Create a Python module that executes validated SQLite SELECT queries and returns results as a Pandas DataFrame. Include proper exception handling and database connection management.

Purpose:
Used to build query_executor.py.

---

## 7. Streamlit User Interface

Prompt:

Design a modern Streamlit interface for an AI SQL Assistant with:

* Natural language input
* Generated SQL display
* Query results table
* Query history
* System architecture sidebar
* Professional dashboard layout

Purpose:
Used to create app.py.

---

## 8. Gemini API Migration

Prompt:

Replace Ollama-based local inference with Gemini API integration while preserving the existing application workflow. Ensure compatibility with Streamlit Cloud deployment.

Purpose:
Used when migrating from Ollama to Gemini.

---

## 9. Debugging and Error Resolution

Prompts Used:

* Explain why ModuleNotFoundError occurs and how to fix it.
* Explain Python package import issues in modular applications.
* Diagnose Streamlit deployment failures.
* Explain Gemini model compatibility errors.
* Explain environment variable and API key loading issues.
* Debug schema reader integration problems.

Purpose:
Used during troubleshooting and application stabilization.

---

## 10. Documentation Generation

Prompt:

Generate professional project documentation including README, architecture document, AI usage note, test cases and deployment instructions suitable for a hackathon submission.

Purpose:
Used to prepare submission deliverables.

---

## AI Assistance Summary

Artificial Intelligence was used for:

* System architecture planning
* Database schema design
* Prompt engineering
* SQL generation workflow design
* Safety validation logic
* User interface design
* Code debugging
* Deployment guidance
* Documentation generation
* Testing strategy preparation

The final implementation, testing, integration and validation were performed by the project team.
