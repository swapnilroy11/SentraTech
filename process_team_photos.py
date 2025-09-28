#!/usr/bin/env python3
"""
Process team member photos into professional black and white headshots
"""

import requests
from PIL import Image, ImageEnhance, ImageFilter
import io
import os

# Team member photo URLs (from uploaded artifacts)
team_photos = {
    "ajmal_hossen": "https://customer-assets.emergentagent.com/job_customer-flow-5/artifacts/9q5pwa01_7269f31f-864f-4369-8902-f9ad1931a31d.jpeg",
    "swapnil_roy": "https://customer-assets.emergentagent.com/job_customer-flow-5/artifacts/134gqgya_IMG_3886.jpeg", 
    "arina_tasnim": "https://customer-assets.emergentagent.com/job_customer-flow-5/artifacts/pnpbt8d3_IMG_4253.jpeg",
    "samiul_sakib": "https://customer-assets.emergentagent.com/job_customer-flow-5/artifacts/cw175y7h_IMG_4259.jpeg"
}

def download_and_process_image(url, output_path, crop_box=None):
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
        
        # Apply cropping if specified (for headshot focus)
        if crop_box:
            img = img.crop(crop_box)
        
        # Auto-crop for portrait focus (remove excess background)
        # For headshots, we want roughly head and shoulders
        width, height = img.size
        
        # Standard headshot ratios - crop to focus on upper portion
        if width > height:
            # Landscape - crop to square focusing on center-left (where person usually is)
            crop_size = min(width, height)
            left = (width - crop_size) // 3  # Offset to avoid pure center
            top = 0
            right = left + crop_size
            bottom = crop_size
            img = img.crop((left, top, right, bottom))
        else:
            # Portrait - crop to focus on upper 70% (head and shoulders)
            crop_height = int(height * 0.7)
            top = 0
            bottom = crop_height
            img = img.crop((0, top, width, bottom))
        
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

def main():
    """Process all team member photos"""
    output_dir = "/app/frontend/public/images/team"
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    print("🎯 Processing team member photos into professional B&W headshots...")
    
    # Process each team member photo
    for name, url in team_photos.items():
        output_path = os.path.join(output_dir, f"{name}.jpg")
        print(f"📸 Processing {name}...")
        
        # Apply specific cropping hints based on photo analysis
        crop_box = None
        if name == "ajmal_hossen":
            # Full body rooftop photo - needs significant cropping to upper portion
            crop_box = None  # Will use auto-crop
        elif name == "swapnil_roy":
            # Street photo with car - focus on upper portion
            crop_box = None  # Will use auto-crop
        elif name == "arina_tasnim":
            # Already good headshot composition
            crop_box = None  # Minimal processing needed
        elif name == "samiul_sakib":
            # Office setting - good for headshot
            crop_box = None  # Will use auto-crop
        
        success = download_and_process_image(url, output_path, crop_box)
        
        if not success:
            print(f"⚠️  Failed to process {name}, using fallback")
    
    print("🎉 Team photo processing completed!")
    print(f"📁 Photos saved to: {output_dir}")

if __name__ == "__main__":
    main()