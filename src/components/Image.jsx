import React from 'react';

const Image = ({ src, alt, className, ...props }) => {
    // Mock function to simulate Cloudinary URL transformation
    // In a real scenario, this would manipulate the URL string to add 'w_xxx' params
    const generateSrcSet = (url) => {
        if (!url || !url.includes('http')) return ''; // Basic check

        // Check if it's a placeholder service that supports resizing (like via args)
        // For demo purposes with placehold.co or unsplash, we simulate:
        return `
      ${url}&w=400 400w,
      ${url}&w=800 800w,
      ${url}&w=1200 1200w
    `;
    };

    return (
        <img
            src={src}
            srcSet={generateSrcSet(src)}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            alt={alt}
            className={className}
            loading="lazy"
            {...props}
        />
    );
};

export default Image;
