import cv2
import numpy as np
import matplotlib.pyplot as plt

# Read the provided image (Figure 3)
# IMPORTANT: cv2.imread loads images in BGR format, not RGB!
image_path = '3.png'
image = cv2.imread(image_path)

if image is None:
    print(f"Error: Could not load image from {image_path}")
    print("Please make sure the image file exists in the correct path.")
else:
    print(f"Image loaded successfully!")
    print(f"Image shape: {image.shape}")
    print(f"Image color space: BGR (OpenCV default)")
    
    # Show the original image
    fig1, axes = plt.subplots(1, 2, figsize=(14, 6))
    fig1.suptitle('Uncovering Hidden Information through Channel Remapping', 
                  fontsize=16, fontweight='bold')
    
    # Display original image (convert BGR to RGB for correct display)
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    axes[0].imshow(image_rgb)
    axes[0].set_title('Original Image (Normal RGB View)')
    axes[0].axis('off')
    
    print("\nApplying channel remapping...")
    print("Remapping formula: R_new = -R - G - B")
    
    # Extract BGR channels (remember: cv2 uses BGR, not RGB!)
    B = image[:, :, 0].astype(np.float32)
    G = image[:, :, 1].astype(np.float32)
    R = image[:, :, 2].astype(np.float32)
    
    # Apply the remapping: R_new = -R - G - B
    # For all channels, we apply the same formula
    R_new = -R - G - B
    G_new = -R - G - B
    B_new = -R - G - B
    
    # Clip values to valid range [0, 255]
    R_new = np.clip(R_new, 0, 255).astype(np.uint8)
    G_new = np.clip(G_new, 0, 255).astype(np.uint8)
    B_new = np.clip(B_new, 0, 255).astype(np.uint8)
    
    # Combine channels back (in BGR order for OpenCV)
    remapped_image = np.stack([B_new, G_new, R_new], axis=2)
    
    # Convert to RGB for display
    remapped_rgb = cv2.cvtColor(remapped_image, cv2.COLOR_BGR2RGB)
    
    # Display remapped image
    axes[1].imshow(remapped_rgb)
    axes[1].set_title('Remapped Image (Secret Revealed! 🔍)')
    axes[1].axis('off')
    
    plt.tight_layout()
    plt.show()
    
    # Additional visualization: Show channel-by-channel comparison
    fig2, axes2 = plt.subplots(2, 3, figsize=(15, 10))
    fig2.suptitle('Channel-by-Channel Analysis', fontsize=16, fontweight='bold')
    
    # Original channels
    axes2[0, 0].imshow(R, cmap='Reds')
    axes2[0, 0].set_title('Original R Channel')
    axes2[0, 0].axis('off')
    
    axes2[0, 1].imshow(G, cmap='Greens')
    axes2[0, 1].set_title('Original G Channel')
    axes2[0, 1].axis('off')
    
    axes2[0, 2].imshow(B, cmap='Blues')
    axes2[0, 2].set_title('Original B Channel')
    axes2[0, 2].axis('off')
    
    # Remapped channels
    axes2[1, 0].imshow(R_new, cmap='Reds')
    axes2[1, 0].set_title('Remapped R Channel')
    axes2[1, 0].axis('off')
    
    axes2[1, 1].imshow(G_new, cmap='Greens')
    axes2[1, 1].set_title('Remapped G Channel')
    axes2[1, 1].axis('off')
    
    axes2[1, 2].imshow(B_new, cmap='Blues')
    axes2[1, 2].set_title('Remapped B Channel')
    axes2[1, 2].axis('off')
    
    plt.tight_layout()
    plt.show()
    
    print("\n" + "="*70)
    print("ANALYSIS: LOOKING vs SEEING")
    print("="*70)
    
    print("\n📊 What happened:")
    print("-" * 70)
    print("The remapping formula R = -R - G - B inverts and combines all color")
    print("channels. This mathematical transformation reveals hidden information")
    print("that was encoded in the image but invisible in normal RGB view.")
    
    print("\n🔍 Looking vs Seeing:")
    print("-" * 70)
    print("• LOOKING: Simply viewing the image shows normal colors and patterns.")
    print("  The human eye sees the RGB representation as intended.")
    print("\n• SEEING: Applying channel remapping uncovers hidden data encoded")
    print("  within the color channels. This demonstrates that images can contain")
    print("  information beyond what is immediately visible.")
    
    print("\n💡 Technical Explanation:")
    print("-" * 70)
    print("The negative sum (-R - G - B) creates an inverted grayscale-like")
    print("representation where the hidden shapes become visible. This works")
    print("because the secret was likely encoded by carefully manipulating")
    print("channel values in a way that appears normal in RGB but reveals")
    print("patterns when mathematically transformed.")
    
    print("="*70)
    
    # Save the remapped image
    save_option = input("\nDo you want to save the remapped image? (yes/no): ")
    if save_option.lower() in ['yes', 'y']:
        output_filename = 'secret_revealed.png'
        cv2.imwrite(output_filename, remapped_image)
        print(f"✓ Saved remapped image as: {output_filename}")
        print("The secret has been uncovered and saved! 🎉")