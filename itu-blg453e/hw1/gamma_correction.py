import cv2
import numpy as np
import matplotlib.pyplot as plt

def apply_gamma_correction(image, gamma):
    """
    Apply gamma correction to an image.
    
    Parameters:
    - image: Input image (grayscale or color)
    - gamma: Gamma value for correction
    
    Returns:
    - Corrected image
    """
    # Normalize pixel values to [0, 1]
    normalized = image / 255.0
    
    # Apply gamma correction
    corrected = np.power(normalized, gamma)
    
    # Scale back to [0, 255]
    output = (corrected * 255).astype(np.uint8)
    
    return output

def plot_gamma_curve(gamma, ax):
    """
    Plot the transformation curve for a given gamma value.
    
    Parameters:
    - gamma: Gamma value
    - ax: Matplotlib axis to plot on
    """
    input_intensities = np.arange(0, 256)
    output_intensities = np.power(input_intensities / 255.0, gamma) * 255
    
    ax.plot(input_intensities, output_intensities, linewidth=2, label=f'γ = {gamma}')
    ax.plot([0, 255], [0, 255], 'k--', linewidth=1, alpha=0.5, label='γ = 1.0 (Identity)')
    ax.set_xlabel('Input Intensity')
    ax.set_ylabel('Output Intensity')
    ax.set_title(f'Gamma Transformation Curve (γ = {gamma})')
    ax.grid(True, alpha=0.3)
    ax.legend()
    ax.set_xlim([0, 255])
    ax.set_ylim([0, 255])

# Load the image
image_path = '1.jpg'
image = cv2.imread(image_path)

# Check if image is loaded
if image is None:
    print(f"Error: Could not load image from {image_path}")
    print("Please make sure the image file exists in the correct path.")
else:
    # Convert from BGR to RGB for display
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    
    # Define gamma values
    gamma_values = [0.4, 1.0, 2.2]
    
    # Apply gamma correction for each value
    corrected_images = {}
    for gamma in gamma_values:
        corrected_images[gamma] = apply_gamma_correction(image_rgb, gamma)
    
    # Create figure for image comparison
    fig1, axes = plt.subplots(2, 2, figsize=(12, 10))
    fig1.suptitle('Gamma Correction Results', fontsize=16, fontweight='bold')
    
    # Display original image
    axes[0, 0].imshow(image_rgb)
    axes[0, 0].set_title('Original Image')
    axes[0, 0].axis('off')
    
    # Display gamma corrected images
    axes[0, 1].imshow(corrected_images[0.4])
    axes[0, 1].set_title(f'γ = 0.4 (Brightened)')
    axes[0, 1].axis('off')
    
    axes[1, 0].imshow(corrected_images[1.0])
    axes[1, 0].set_title(f'γ = 1.0 (No Change)')
    axes[1, 0].axis('off')
    
    axes[1, 1].imshow(corrected_images[2.2])
    axes[1, 1].set_title(f'γ = 2.2 (Darkened)')
    axes[1, 1].axis('off')
    
    plt.tight_layout()
    plt.show()
    
    # Create figure for transformation curves
    fig2, axes2 = plt.subplots(1, 3, figsize=(15, 4))
    fig2.suptitle('Gamma Transformation Curves', fontsize=16, fontweight='bold')
    
    for idx, gamma in enumerate(gamma_values):
        plot_gamma_curve(gamma, axes2[idx])
    
    plt.tight_layout()
    plt.show()
    
    # Print analysis
    print("\n" + "="*60)
    print("GAMMA CORRECTION ANALYSIS")
    print("="*60)
    
    print("\n5(a) Best Detail Enhancement:")
    print("-" * 60)
    print("For a low-light image:")
    print("  • γ = 0.4 provides the best detail enhancement")
    print("  • It brightens dark regions, revealing hidden details")
    print("  • Foreground elements become more visible")
    print("  • However, very bright areas (like the sun) may become")
    print("    oversaturated")
    
    print("\n5(b) Why Gamma Correction > Simple Intensity Increase:")
    print("-" * 60)
    print("  • Gamma correction is NON-LINEAR:")
    print("    - It affects dark and bright pixels differently")
    print("    - Dark pixels get boosted more than bright pixels (γ<1)")
    print("    - Preserves relative contrast relationships")
    print("\n  • Simple intensity increase (adding constant) is LINEAR:")
    print("    - All pixels increase by same amount")
    print("    - Can cause clipping (values > 255 become 255)")
    print("    - Loses detail in bright regions")
    print("    - Doesn't account for human perception")
    print("\n  • Gamma correction matches human vision:")
    print("    - Our eyes perceive brightness logarithmically")
    print("    - Gamma correction mimics this perception")
    print("    - Better preserves natural appearance")
    print("="*60)
    
    # Optional: Save corrected images
    save_images = input("\nDo you want to save the corrected images? (yes/no): ")
    if save_images.lower() in ['yes', 'y']:
        for gamma in gamma_values:
            filename = f'gamma_{str(gamma).replace(".", "_")}.png'
            corrected_bgr = cv2.cvtColor(corrected_images[gamma], cv2.COLOR_RGB2BGR)
            cv2.imwrite(filename, corrected_bgr)
            print(f"Saved: {filename}")
        print("All images saved successfully!")