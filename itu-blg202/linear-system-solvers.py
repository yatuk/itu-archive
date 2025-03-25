import numpy as np

def gauss_jordan_solve(A, b):
    """Solve linear system using Gauss-Jordan elimination"""
    # Augment the matrix
    Aug = np.column_stack((A, b))
    n = len(b)
    
    for i in range(n):
        max_element = abs(Aug[i:, i]).argmax() + i
        Aug[[i, max_element]] = Aug[[max_element, i]]
        
        Aug[i] = Aug[i] / Aug[i, i]
        
        for j in range(n):
            if i != j:
                Aug[j] -= Aug[j, i] * Aug[i]
    
    return Aug[:, -1]

def gauss_seidel_solve(A, b, max_iterations=100, tolerance=1e-6):
    """Solve linear system using Gauss-Seidel iteration"""
    n = len(b)
    x = np.zeros(n)
    
    for _ in range(max_iterations):
        x_old = x.copy()
        
        for i in range(n):
            sigma = sum(A[i, j] * x[j] for j in range(n) if i != j)
            x[i] = (b[i] - sigma) / A[i, i]
        
        if np.linalg.norm(x - x_old) < tolerance:
            break
    
    return x

A = np.array([
    [10, 2, 1],
    [2, 10, 1],
    [2, 1, 10]
])
b = np.array([13, 13, 13])

print("Gauss-Jordan Solution:")
gj_solution = gauss_jordan_solve(A, b)
print(gj_solution)

print("\nGauss-Seidel Solution:")
gs_solution = gauss_seidel_solve(A, b)
print(gs_solution)
