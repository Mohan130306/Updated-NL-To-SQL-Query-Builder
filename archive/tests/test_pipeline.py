from ai.sql_generator import generate_sql
from ai.safety_checker import is_safe_query
from ai.query_executor import execute_query

question = "Show top 5 students by CGPA"

sql = generate_sql(question)

print("\nGenerated SQL:")
print(sql)

if is_safe_query(sql):

    print("\nSafety Check: PASSED")

    result = execute_query(sql)

    print("\nResults:")
    print(result)

else:

    print("\nSafety Check: FAILED")