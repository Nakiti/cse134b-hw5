#!/bin/bash

# 1. Define the directory to process
# Usage: ./process_assets.sh [path_to_assets_folder]
TARGET_DIR="${1:-.}"

# 2. Define dimensions
SIZE_SMALL=300
SIZE_MEDIUM=800
# Note: We treat 'large' as the source (original quality), so we don't resize it.

# 3. Define paths
SOURCE_DIR="$TARGET_DIR/large"
MEDIUM_DIR="$TARGET_DIR/medium"
SMALL_DIR="$TARGET_DIR/small"

# 4. Safety Check
if [ ! -d "$SOURCE_DIR" ]; then
    echo "⚠️  Start setup: Creating 'large' folder..."
    mkdir -p "$SOURCE_DIR"
    echo "👉 Please put your original images in '$SOURCE_DIR' and run this script again."
    # Optional: If you want to automatically move images from root to large, uncomment the next line:
    # mv "$TARGET_DIR"/*.{jpg,png,jpeg,JPG,PNG} "$SOURCE_DIR" 2>/dev/null
    exit 1
fi

# Ensure output directories exist
mkdir -p "$MEDIUM_DIR"
mkdir -p "$SMALL_DIR"

echo "📂 Reading originals from: $SOURCE_DIR"

# 5. Loop through images in the 'large' folder
shopt -s nullglob
for img in "$SOURCE_DIR"/*.{jpg,jpeg,png,JPG,JPEG,PNG,tif,tiff}; do
    
    filename=$(basename "$img")
    
    # Only process if the file doesn't exist or if you want to overwrite.
    # Currently set to always overwrite to ensure updates are captured.
    
    echo "⚡ Processing: $filename"

    # Generate Medium (800px)
    sips -Z $SIZE_MEDIUM "$img" --out "$MEDIUM_DIR/$filename" > /dev/null 2>&1
    
    # Generate Small (300px)
    sips -Z $SIZE_SMALL "$img" --out "$SMALL_DIR/$filename" > /dev/null 2>&1

done

echo "-----------------------------------"
echo "✅ Done! 'medium' and 'small' folders are synced with 'large'."