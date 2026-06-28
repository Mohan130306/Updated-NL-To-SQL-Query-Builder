import sqlite3
import pandas as pd


def execute_query(sql_query, db_path="college.db"):
    """
    Execute a safe SELECT query and return results as DataFrame
    """

    conn = sqlite3.connect(db_path)

    try:
        df = pd.read_sql_query(sql_query, conn)
        return df

    except Exception as e:
        print(f"Error: {e}")
        return None

    finally:
        conn.close()


if __name__ == "__main__":

    test_query = """
    SELECT * FROM students
    LIMIT 5
    """

    result = execute_query(test_query)

    print(result)