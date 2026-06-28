import sqlite3

def get_schema(db_path="college.db"):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    schema_text = ""

    # Get all tables
    cursor.execute("""
        SELECT name
        FROM sqlite_master
        WHERE type='table';
    """)

    tables = cursor.fetchall()

    for table in tables:
        table_name = table[0]

        schema_text += f"\nTable: {table_name}\n"

        cursor.execute(f"PRAGMA table_info({table_name})")

        columns = cursor.fetchall()

        schema_text += "Columns:\n"

        for column in columns:
            schema_text += f"- {column[1]}\n"

    conn.close()

    return schema_text


if __name__ == "__main__":
    print(get_schema())