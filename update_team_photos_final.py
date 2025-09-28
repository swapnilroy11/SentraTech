#!/usr/bin/env python3
"""
Process Ajmal Hossen and Samiul Sakib photos with the same professional treatment as Swapnil Roy
"""

import requests
from PIL import Image, ImageEnhance, ImageFilter
import io
import os

def download_and_process_image(url, output_path, processing_function=None):
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
        
        # Apply specific processing function if provided
        if processing_function:
            img = processing_function(img)
        else:
            # Default processing - minimal cropping like Swapnil Roy's treatment
            img = process_minimal_crop(img)
        
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

def process_minimal_crop(img):
    """
    Process with minimal cropping - same treatment as Swapnil Roy's updated photo
    """
    width, height = img.size
    
    # Minimal cropping - just ensure it's roughly square by taking the center portion
    if width != height:
        # Make it square by cropping to the smaller dimension, centered
        crop_size = min(width, height)
        left = (width - crop_size) // 2
        top = (height - crop_size) // 2
        right = left + crop_size
        bottom = top + crop_size
        img = img.crop((left, top, right, bottom))
    
    return img

def process_ajmal_hossen_professional(img):
    """
    Process Ajmal Hossen's rooftop photo with professional minimal cropping
    """
    width, height = img.size
    
    # This is a rooftop photo - crop to focus on upper body/head area like CEO photo
    if width > height:
        # Landscape orientation - crop to square focusing on center-left where person is
        crop_size = min(width, height)
        left = (width - crop_size) // 3  # Slight offset like CEO photo
        top = 0
        right = left + crop_size
        bottom = crop_size
        img = img.crop((left, top, right, bottom))
    else:
        # Portrait - crop upper portion (head and shoulders)
        crop_height = int(height * 0.75)  # Keep more body like CEO photo
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

def process_samiul_sakib_professional(img):
    """
    Process Samiul Sakib's office photo with professional minimal cropping
    """
    width, height = img.size
    
    # This appears to be an office/indoor photo - minimal crop like CEO photo
    # Just center and make square
    if width != height:
        crop_size = min(width, height)
        left = (width - crop_size) // 2
        top = (height - crop_size) // 2
        right = left + crop_size
        bottom = top + crop_size
        img = img.crop((left, top, right, bottom))
    
    return img

def main():
    """Process both team member photos with professional treatment"""
    output_dir = "/app/frontend/public/images/team"
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    print("🎯 Processing Ajmal Hossen and Samiul Sakib photos with CEO-level treatment...")
    
    # Process Ajmal Hossen (COO) - white striped shirt, rooftop setting
    print("📸 Processing Ajmal Hossen (COO) photo...")
    ajmal_url = "https://customer-assets.emergentagent.com/job_customer-flow-5/artifacts/jug3xwr7_7269f31f-864f-4369-8902-f9ad1931a31d.jpg"
    ajmal_output = os.path.join(output_dir, "ajmal_hossen.jpg")
    success1 = download_and_process_image(ajmal_url, ajmal_output, process_ajmal_hossen_professional)
    
    if success1:
        print("✅ Ajmal Hossen's photo processed with professional CEO-level treatment!")
    else:
        print("❌ Failed to process Ajmal Hossen's photo")
    
    # Process Samiul Sakib (CTO) - black blazer, office setting
    print("📸 Processing Samiul Sakib (CTO) photo...")
    samiul_url = "https://customer-assets.emergentagent.com/job_customer-flow-5/artifacts/vej8jmq0_IMG_4259.jpg"
    samiul_output = os.path.join(output_dir, "samiul_sakib.jpg")
    success2 = download_and_process_image(samiul_url, samiul_output, process_samiul_sakib_professional)
    
    if success2:
        print("✅ Samiul Sakib's photo processed with professional CEO-level treatment!")
    else:
        print("❌ Failed to process Samiul Sakib's photo")
    
    if success1 and success2:
        print("🎉 Both team photos processed successfully with professional treatment!")
        print("📸 All leadership team photos now have consistent CEO-level quality")
    else:
        print("⚠️ Some photos may have processing issues")
    
    print(f"📁 Photos saved to: {output_dir}")

if __name__ == "__main__":
    main()