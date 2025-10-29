import cv2
import numpy as np
import matplotlib.pyplot as plt

def rgb_to_hsv_manual(image):
    """
    Convert RGB image to HSV color space manually.
    
    Parameters:
    - image: RGB image (numpy array with values 0-255)
    
    Returns:
    - HSV image (H: 0-179, S: 0-255, V: 0-255) to match OpenCV format
    """
    # Normalize RGB values to [0, 1]
    rgb_normalized = image.astype(np.float32) / 255.0
    r = rgb_normalized[:, :, 0]
    g = rgb_normalized[:, :, 1]
    b = rgb_normalized[:, :, 2]
    
    # Calculate V (Value) - maximum of R, G, B
    v = np.max(rgb_normalized, axis=2)
    
    # Calculate S (Saturation)
    min_rgb = np.min(rgb_normalized, axis=2)
    delta = v - min_rgb
    
    # Avoid division by zero
    s = np.zeros_like(v)
    s[v != 0] = delta[v != 0] / v[v != 0]
    
    # Calculate H (Hue)
    h = np.zeros_like(v)
    
    # Red is max
    mask_r = (v == r) & (delta != 0)
    h[mask_r] = 60 * (((g[mask_r] - b[mask_r]) / delta[mask_r]) % 6)
    
    # Green is max
    mask_g = (v == g) & (delta != 0)
    h[mask_g] = 60 * (((b[mask_g] - r[mask_g]) / delta[mask_g]) + 2)
    
    # Blue is max
    mask_b = (v == b) & (delta != 0)
    h[mask_b] = 60 * (((r[mask_b] - g[mask_b]) / delta[mask_b]) + 4)
    
    # Convert to OpenCV's HSV format
    # H: 0-179 (OpenCV uses 0-180 range, divided by 2 to fit in uint8)
    # S: 0-255
    # V: 0-255
    h_cv = (h / 2).astype(np.uint8)
    s_cv = (s * 255).astype(np.uint8)
    v_cv = (v * 255).astype(np.uint8)
    
    hsv_image = np.stack([h_cv, s_cv, v_cv], axis=2)
    
    return hsv_image

def segment_colors(hsv_image):
    """
    Segment different colors from the HSV image.
    Returns masks for different color ranges.
    """
    masks = {}
    
    # Define color ranges in HSV (H: 0-179, S: 0-255, V: 0-255)
    # Red color (appears in two ranges due to hue wrap-around)
    lower_red1 = np.array([0, 50, 50])
    upper_red1 = np.array([10, 255, 255])
    lower_red2 = np.array([170, 50, 50])
    upper_red2 = np.array([179, 255, 255])
    
    mask_red1 = cv2.inRange(hsv_image, lower_red1, upper_red1)
    mask_red2 = cv2.inRange(hsv_image, lower_red2, upper_red2)
    masks['Red'] = cv2.bitwise_or(mask_red1, mask_red2)
    
    # Yellow color
    lower_yellow = np.array([20, 50, 50])
    upper_yellow = np.array([35, 255, 255])
    masks['Yellow'] = cv2.inRange(hsv_image, lower_yellow, upper_yellow)
    
    # Green color
    lower_green = np.array([40, 50, 50])
    upper_green = np.array([80, 255, 255])
    masks['Green'] = cv2.inRange(hsv_image, lower_green, upper_green)
    
    # Blue color
    lower_blue = np.array([90, 50, 50])
    upper_blue = np.array([130, 255, 255])
    masks['Blue'] = cv2.inRange(hsv_image, lower_blue, upper_blue)
    
    # Purple/Magenta color
    lower_purple = np.array([135, 50, 50])
    upper_purple = np.array([165, 255, 255])
    masks['Purple'] = cv2.inRange(hsv_image, lower_purple, upper_purple)
    
    return masks

# Load the RGB image (Figure 2)
image_path = '2.png'  # Change this to your image path
image = cv2.imread(image_path)

if image is None:
    print(f"Error: Could not load image from {image_path}")
    print("Please make sure the image file exists in the correct path.")
else:
    # Convert BGR to RGB (OpenCV loads as BGR)
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    
    print("Converting RGB to HSV...")
    
    # Method 1: Manual conversion
    hsv_manual = rgb_to_hsv_manual(image_rgb)
    
    # Method 2: Using OpenCV (for comparison)
    hsv_opencv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    
    # Split HSV channels
    h, s, v = cv2.split(hsv_manual)
    
    # Display original image and HSV channels
    fig1, axes = plt.subplots(2, 3, figsize=(15, 10))
    fig1.suptitle('RGB to HSV Conversion', fontsize=16, fontweight='bold')
    
    axes[0, 0].imshow(image_rgb)
    axes[0, 0].set_title('Original RGB Image')
    axes[0, 0].axis('off')
    
    axes[0, 1].imshow(h, cmap='hsv')
    axes[0, 1].set_title('Hue (H) Channel')
    axes[0, 1].axis('off')
    
    axes[0, 2].imshow(s, cmap='gray')
    axes[0, 2].set_title('Saturation (S) Channel')
    axes[0, 2].axis('off')
    
    axes[1, 0].imshow(v, cmap='gray')
    axes[1, 0].set_title('Value (V) Channel')
    axes[1, 0].axis('off')
    
    # Display HSV image (convert back to RGB for display)
    hsv_display = cv2.cvtColor(hsv_manual, cv2.COLOR_HSV2RGB)
    axes[1, 1].imshow(hsv_display)
    axes[1, 1].set_title('HSV Image (converted back to RGB)')
    axes[1, 1].axis('off')
    
    axes[1, 2].axis('off')
    
    plt.tight_layout()
    plt.show()
    
    # Segment colors
    print("Segmenting colors...")
    masks = segment_colors(hsv_manual)
    
    # Display segmented colors
    num_colors = len(masks)
    fig2, axes2 = plt.subplots(2, 3, figsize=(15, 10))
    fig2.suptitle('Color Segmentation using HSV Masking', fontsize=16, fontweight='bold')
    
    # Show original image
    axes2[0, 0].imshow(image_rgb)
    axes2[0, 0].set_title('Original Image')
    axes2[0, 0].axis('off')
    
    # Show each color mask and extracted color
    positions = [(0, 1), (0, 2), (1, 0), (1, 1), (1, 2)]
    
    for idx, (color_name, mask) in enumerate(masks.items()):
        if idx < len(positions):
            row, col = positions[idx]
            
            # Apply mask to original image
            result = cv2.bitwise_and(image_rgb, image_rgb, mask=mask)
            
            axes2[row, col].imshow(result)
            axes2[row, col].set_title(f'{color_name} Segmentation')
            axes2[row, col].axis('off')
    
    plt.tight_layout()
    plt.show()
    
    # Print explanations
    print("\n" + "="*70)
    print("COLOR SPACE CONVERSION ANALYSIS")
    print("="*70)
    
    print("\n1. WHY COLOR SPACE CONVERSION IS USEFUL:")
    print("-" * 70)
    print("Color space conversion (RGB to HSV) is crucial in image processing")
    print("because it separates chromatic information (hue) from intensity")
    print("information (value). This makes color-based segmentation much easier")
    print("and more robust to lighting variations, unlike RGB where color and")
    print("brightness are intertwined across all three channels.")
    
    print("\n2. WHAT H, S, AND V VALUES REPRESENT:")
    print("-" * 70)
    print("• Hue (H): Represents the color type (red, green, blue, etc.) as an")
    print("  angle on a color wheel (0-360°, scaled to 0-179 in OpenCV).")
    print("• Saturation (S): Represents the purity or intensity of the color,")
    print("  ranging from 0 (gray) to 255 (fully saturated/vivid color).")
    print("• Value (V): Represents the brightness of the color, ranging from")
    print("  0 (black) to 255 (maximum brightness).")
    
    print("\n3. REAL-WORLD APPLICATION EXAMPLE:")
    print("-" * 70)
    print("Object Tracking in Robotics: HSV is extensively used in autonomous")
    print("robots for tracking colored objects (e.g., following a colored ball).")
    print("By defining a specific hue range, robots can reliably identify and")
    print("track objects regardless of lighting changes, making HSV superior to")
    print("RGB for real-time vision applications in varying environments.")
    
    print("="*70)
    
    # Save results
    save_option = input("\nDo you want to save the segmented images? (yes/no): ")
    if save_option.lower() in ['yes', 'y']:
        for color_name, mask in masks.items():
            result = cv2.bitwise_and(image, image, mask=mask)
            filename = f'segmented_{color_name.lower()}.png'
            cv2.imwrite(filename, result)
            print(f"Saved: {filename}")
        print("All segmented images saved successfully!")