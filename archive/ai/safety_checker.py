def is_safe_query(sql_query):
    """
    Allow only SELECT queries.
    Block dangerous SQL operations.
    """

    sql_upper = sql_query.upper()

    blocked_keywords = [
        "INSERT",
        "UPDATE",
        "DELETE",
        "DROP",
        "ALTER",
        "TRUNCATE",
        "ATTACH",
        "PRAGMA",
        "CREATE",
        "REPLACE"
    ]

    # Must start with SELECT
    if not sql_upper.strip().startswith("SELECT"):
        return False

    # Check blocked keywords
    for keyword in blocked_keywords:
        if keyword in sql_upper:
            return False

    return True


if __name__ == "__main__":

    safe_query = """
    SELECT * FROM students
    """

    unsafe_query = """
    DELETE FROM students
    """

    print("Safe Query:", is_safe_query(safe_query))
    print("Unsafe Query:", is_safe_query(unsafe_query))