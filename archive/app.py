import streamlit as st
import pandas as pd

from ai.sql_generator import generate_sql
from ai.safety_checker import is_safe_query
from ai.query_executor import execute_query

# ----------------------------------------------------
# PAGE CONFIG
# ----------------------------------------------------

st.set_page_config(
    page_title="AI SQL Assistant",
    page_icon="🤖",
    layout="wide"
)

# ----------------------------------------------------
# SESSION STATE
# ----------------------------------------------------

if "history" not in st.session_state:
    st.session_state.history = []

# ----------------------------------------------------
# SIDEBAR
# ----------------------------------------------------

with st.sidebar:

    st.title(" Project Information")

    st.info("""
    AI-Powered NL → SQL Query Builder

    Tech Stack:
    • Python 3.11
    • Streamlit
    • SQLite
    • Gemini API
    • Gemini 2.5 Flash
    """)

    st.divider()

    st.subheader(" Architecture")

    st.markdown("""
    User Question

    ↓

    Gemini 2.5 Flash

    ↓

    SQL Generator

    ↓

    Safety Checker

    ↓

    SQLite Database

    ↓

    Results
    """)

    st.divider()

    st.subheader(" Query History")

    if st.session_state.history:
        for item in reversed(st.session_state.history):
            st.write("•", item)
    else:
        st.write("No queries yet.")

# ----------------------------------------------------
# HEADER
# ----------------------------------------------------

st.markdown("""
<h1 style='text-align:center;color:#4CAF50;'>
 AI-Powered NL → SQL Query Builder
</h1>

<h4 style='text-align:center;'>
Ask questions in plain English and let AI generate SQL
</h4>
""", unsafe_allow_html=True)

st.success("Developed by Team of Victory Squad")

st.markdown("<br>", unsafe_allow_html=True)

# ----------------------------------------------------
# METRICS
# ----------------------------------------------------

col1, col2, col3 = st.columns(3)

with col1:
    st.metric("Database", "SQLite")

with col2:
    st.metric("AI Model", "Gemini 2.5 Flash")

with col3:
    st.metric("Records", "200+")

st.divider()

# ----------------------------------------------------
# SAMPLE QUESTIONS
# ----------------------------------------------------

with st.expander("Sample Questions"):

    st.markdown("""
- Show all CSE students

- Show students with CGPA above 8.5

- Count students in ECE

- Show top 5 students by CGPA

- Show final year students

- Show IT students with CGPA above 9

- Count students in each department
""")

# ----------------------------------------------------
# USER INPUT
# ----------------------------------------------------

question = st.text_area(
    "Enter your question:",
    height=120,
    placeholder="Example: Show top 5 students by CGPA"
)

# ----------------------------------------------------
# GENERATE BUTTON
# ----------------------------------------------------

if st.button("Generate Query", use_container_width=True):

    if not question.strip():
        st.warning("Please enter a question.")
        st.stop()

    with st.spinner("Generating SQL using Gemini AI..."):

        sql_query = generate_sql(question)

    # --------------------------------------------
    # SHOW SQL
    # --------------------------------------------

    st.subheader("Generated SQL")

    st.code(sql_query, language="sql")

    # --------------------------------------------
    # SAFETY CHECK
    # --------------------------------------------

    if is_safe_query(sql_query):

        st.success("Safe Query Approved")

        # ----------------------------------------
        # EXECUTE QUERY
        # ----------------------------------------

        result = execute_query(sql_query)

        if result is not None:

            st.subheader("Query Results")

            st.dataframe(
                result,
                use_container_width=True
            )

            # ------------------------------------
            # DOWNLOAD CSV
            # ------------------------------------

            csv = result.to_csv(index=False)

            st.download_button(
                label="Download Results as CSV",
                data=csv,
                file_name="query_results.csv",
                mime="text/csv"
            )

            # ------------------------------------
            # AI EXPLANATION
            # ------------------------------------

            st.subheader("AI Explanation")

            st.info(f"""
Question:
{question}

Generated SQL:
{sql_query}

Gemini AI converted the natural language question into a valid SQLite query. The query passed the safety validation layer and was executed successfully on the SQLite database.
""")

            # ------------------------------------
            # SAVE HISTORY
            # ------------------------------------

            st.session_state.history.append(question)

        else:

            st.error("❌ Failed to execute query.")

    else:

        st.error("🚫 Unsafe Query Blocked")

        st.warning("""
Only SELECT queries are allowed.

Blocked operations:
- INSERT
- UPDATE
- DELETE
- DROP
- ALTER
- TRUNCATE
- ATTACH
- PRAGMA
""")

# ----------------------------------------------------
# FOOTER
# ----------------------------------------------------

st.divider()

st.caption(
    "Built using Streamlit + SQLite + Gemini 2.5 Flash"
)
