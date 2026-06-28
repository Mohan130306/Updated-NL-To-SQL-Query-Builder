import os
import streamlit as st
from dotenv import load_dotenv
import google.generativeai as genai
from ai.schema_reader import get_schema

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

try:
    api_key = st.secrets["GEMINI_API_KEY"]
except:
    pass

genai.configure(api_key=api_key)

model = genai.GenerativeModel("gemini-2.5-flash")


def generate_sql(user_question):

    schema = get_schema()

    prompt = f"""
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
"""

    response = model.generate_content(prompt)

    sql_query = response.text.strip()

    # Remove markdown if Gemini returns it
    sql_query = sql_query.replace("```sql", "")
    sql_query = sql_query.replace("```", "")

    return sql_query.strip()


if __name__ == "__main__":

    question = input("Enter Question: ")

    sql = generate_sql(question)

    print("\nGenerated SQL:")
    print(sql)