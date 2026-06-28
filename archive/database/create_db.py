import sqlite3
import random

# Connect to database
conn = sqlite3.connect("college.db")
cursor = conn.cursor()

# Drop table if exists
cursor.execute("DROP TABLE IF EXISTS students")

# Create table
cursor.execute("""
CREATE TABLE students (
    student_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    cgpa REAL NOT NULL,
    year INTEGER NOT NULL
)
""")

# Sample names
names = [
    "Mohan", "Rahul", "Priya", "Anjali", "Karthik",
    "Nisha", "Arun", "Divya", "Vignesh", "Keerthana",
    "Sanjay", "Akash", "Deepika", "Riya", "Harish",
    "Sneha", "Lokesh", "Meena", "Ajay", "Pooja"
]

departments = [
    "CSE",
    "IT",
    "ECE",
    "EEE",
    "MECH"
]

students = []

for student_id in range(1, 101):
    name = random.choice(names) + str(student_id)
    department = random.choice(departments)
    cgpa = round(random.uniform(6.0, 10.0), 2)
    year = random.randint(1, 4)

    students.append(
        (student_id, name, department, cgpa, year)
    )

cursor.executemany("""
INSERT INTO students
(student_id, name, department, cgpa, year)
VALUES (?, ?, ?, ?, ?)
""", students)

conn.commit()

print("✅ Database created successfully!")
print(f"✅ {len(students)} student records inserted!")

conn.close()