import math

def iteration_function(x):
    """Iteration function: x = sqrt(-ln(x))"""
    try:
        return math.sqrt(-math.log(x))
    except ValueError:
        return None

def demonstrate_nonconvergence():
    print("Demonstrating Non-Convergence of x = sqrt(-ln(x))")
    x = 0.5  
    print(f"Initial x: {x}")
    
    for i in range(10):
        next_x = iteration_function(x)
        if next_x is None:
            print("Iteration failed due to domain constraints")
            return
        
        print(f"Iteration {i+1}: x = {next_x}")
        x = next_x

demonstrate_nonconvergence()

print("\nNon-Convergence Explanation:")
print("1. The iteration x = sqrt(-ln(x)) does not converge due to:")
print("   a) Domain restrictions (ln(x) requires x > 0)")
print("   b) The function's behavior creates unstable iterations")
print("   c) Small changes in initial guess lead to rapid divergence")
