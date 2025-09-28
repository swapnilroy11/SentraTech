#!/usr/bin/env python3
"""
Update team member photos - replace Swapnil Roy's photo and adjust Ajmal Hossen's cropping
"""

import requests
from PIL import Image, ImageEnhance, ImageFilter
import io
import os

def download_and_process_image(url, output_path, name_specific_processing=None):
    """
    Download image from URL and process it into a professional B&W headshot
    """
    try:
        # Download the image
        response = requests.get(url)
        response.raise_for_status()
        
        # Open image with PIL
        img = Image.open(io.BytesIO(response.content))
        
        # Convert to RGB if needed
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Apply name-specific processing
        if name_specific_processing:
            img = name_specific_processing(img)
        
        # Resize to standard headshot dimensions (400x400 for web)
        img = img.resize((400, 400), Image.Resampling.LANCZOS)
        
        # Convert to grayscale for B&W effect
        bw_img = img.convert('L')
        
        # Enhance contrast for professional look
        enhancer = ImageEnhance.Contrast(bw_img)
        bw_img = enhancer.enhance(1.2)
        
        # Enhance sharpness slightly
        enhancer = ImageEnhance.Sharpness(bw_img)
        bw_img = enhancer.enhance(1.1)
        
        # Apply subtle blur to background (simulate depth of field)
        # This is a simple approach - in practice you'd mask the subject
        mask = Image.new('L', bw_img.size, 255)
        # Apply slight overall softening
        bw_img = bw_img.filter(ImageFilter.UnsharpMask(radius=1, percent=120, threshold=3))
        
        # Convert back to RGB for web compatibility
        final_img = bw_img.convert('RGB')
        
        # Save the processed image
        final_img.save(output_path, 'JPEG', quality=95, optimize=True)
        
        print(f"✅ Processed and saved: {output_path}")
        return True
        
    except Exception as e:
        print(f"❌ Error processing {url}: {str(e)}")
        return False

def process_swapnil_roy_new(img):
    """
    Process the new Swapnil Roy photo - minimal cropping since it's already well-cropped
    """
    width, height = img.size
    
    # This photo is already well-cropped as a headshot, so minimal processing needed
    # Just ensure it's roughly square by taking the center portion
    if width != height:
        # Make it square by cropping to the smaller dimension
        crop_size = min(width, height)
        left = (width - crop_size) // 2
        top = (height - crop_size) // 2
        right = left + crop_size
        bottom = top + crop_size
        img = img.crop((left, top, right, bottom))
    
    return img

def process_ajmal_hossen_less_crop(img):
    """
    Process Ajmal Hossen's photo with less aggressive cropping to show more body
    """
    width, height = img.size
    
    # Less aggressive cropping - keep more of the body
    # For the rooftop photo, we want to include more of his torso/body
    if width > height:
        # Landscape - crop to roughly 3:4 ratio to include more body, then make square
        target_width = int(height * 0.75)  # 3:4 ratio
        left = (width - target_width) // 4  # Offset slightly to avoid pure center
        top = 0
        right = left + target_width
        bottom = height
        img = img.crop((left, top, right, bottom))
        
        # Now make it square by cropping from top
        crop_size = min(target_width, height)
        final_left = 0
        final_top = 0
        final_right = crop_size
        final_bottom = crop_size
        img = img.crop((final_left, final_top, final_right, final_bottom))
    else:
        # Portrait - crop to keep upper 85% (more body) instead of 70%
        crop_height = int(height * 0.85)
        top = 0
        bottom = crop_height
        img = img.crop((0, top, width, bottom))
        
        # Make square
        crop_size = min(width, crop_height)
        left = (width - crop_size) // 2
        top = 0
        right = left + crop_size
        bottom = crop_size
        img = img.crop((left, top, right, bottom))
    
    return img

def main():
    """Update specific team member photos"""
    output_dir = "/app/frontend/public/images/team"
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    print("🎯 Updating team member photos...")
    
    # Update Swapnil Roy with new cropped photo
    print("📸 Processing new Swapnil Roy photo...")
    swapnil_new_url = "https://customer-assets.emergentagent.com/job_customer-flow-5/artifacts/xetpiv1e_IMG_3886.jpg"
    swapnil_output = os.path.join(output_dir, "swapnil_roy.jpg")
    success = download_and_process_image(swapnil_new_url, swapnil_output, process_swapnil_roy_new)
    
    if success:
        print("✅ Swapnil Roy's photo updated successfully!")
    else:
        print("❌ Failed to update Swapnil Roy's photo")
    
    # Re-process Ajmal Hossen with less aggressive cropping
    print("📸 Re-processing Ajmal Hossen photo with less cropping...")
    ajmal_url = "https://customer-assets.emergentagent.com/job_customer-flow-5/artifacts/9q5pwa01_7269f31f-864f-4369-8902-f9ad1931a31d.jpeg"
    ajmal_output = os.path.join(output_dir, "ajmal_hossen.jpg")
    success = download_and_process_image(ajmal_url, ajmal_output, process_ajmal_hossen_less_crop)
    
    if success:
        print("✅ Ajmal Hossen's photo updated with more body visible!")
    else:
        print("❌ Failed to update Ajmal Hossen's photo")
    
    print("🎉 Team photo updates completed!")
    print(f"📁 Photos saved to: {output_dir}")

if __name__ == "__main__":
    main()