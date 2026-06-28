from ai.safety_checker import is_safe_query

queries = [
    "SELECT * FROM students",
    "DELETE FROM students",
    "DROP TABLE students",
    "UPDATE students SET cgpa = 10",
    "SELECT COUNT(*) FROM students"
]

for q in queries:
    print(q)
    print("Allowed:", is_safe_query(q))
    print("-" * 30)