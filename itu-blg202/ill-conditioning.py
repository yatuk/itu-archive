import numpy as np

def solve_linear_system(A, b):
    """Solve linear system Ax = b using numpy"""
    try:
        x = np.linalg.solve(A, b)
        return x
    except np.linalg.LinAlgError as e:
        print(f"Error solving system: {e}")
        return None

print("Problem Set a:")
A1 = np.array([[2, 1], [2, 1.01]])
b1 = np.array([4, 4.02])
solution1 = solve_linear_system(A1, b1)
print("Solution 1:", solution1)

print("\nProblem Set b:")
A2 = np.array([[2, 1], [2.01, 1]])
b2 = np.array([3.82, 4.02])
solution2 = solve_linear_system(A2, b2)
print("Solution 2:", solution2)

print("\nCondition Number Analysis:")
print("Set a condition number:", np.linalg.cond(A1))
print("Set b condition number:", np.linalg.cond(A2))
