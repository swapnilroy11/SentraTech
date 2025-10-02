# SentraTech Brand Kit

## Brand Overview
SentraTech is an AI+BI-powered omnichannel customer support platform that transforms customer service into a growth engine. Our brand represents innovation, reliability, and intelligent automation in the customer support industry.

## Color Palette

### Primary Colors
- **Matrix Green**: #00FF41 (Primary brand color for interactive elements, CTAs, and accents)
- **Deep Black**: #0A0A0A (Primary background color)
- **Pure White**: #F8F9FA (High contrast text color)

### Secondary Colors  
- **Dark Gray**: #1a1a1a (Secondary background)
- **Medium Gray**: #2a2a2a (Borders and tertiary elements)
- **Light Gray**: #e2e8f0 (Secondary text)
- **Muted Gray**: #a1a1aa (Muted text and placeholders)

### Accent Colors
- **Neon Cyan**: #00DDFF (Secondary accent for variety)
- **Silver**: #C0C0C0 (Tertiary accent for highlights)

## Typography

### Primary Font: Rajdhani
- **Weights**: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semi-Bold), 700 (Bold)
- **Usage**: All headings, body text, and UI elements
- **Characteristics**: Modern, clean, tech-focused sans-serif

### Font Hierarchy
- **Hero Titles**: Rajdhani Bold (700) - 4rem desktop, 2.5rem mobile
- **Section Titles**: Rajdhani Semi-Bold (600) - 3rem desktop, 2rem mobile  
- **Card Titles**: Rajdhani Semi-Bold (600) - 1.5rem
- **Body Text**: Rajdhani Regular (400) - 1.125rem
- **Small Text**: Rajdhani Medium (500) - 0.875rem

## Logo Usage

### Logo Variations
1. **Primary Logo**: Full logo with icon and text
2. **Icon Only**: Geometric logo mark without text
3. **Horizontal Layout**: Logo and text side by side
4. **Stacked Layout**: Logo above text

### Logo Sizes
- **Desktop Navigation**: 48x48px icon
- **Mobile Navigation**: 32x32px icon  
- **Footer**: 48x48px icon
- **Favicon**: 16x16px, 32x32px, 48x48px

### Clear Space
- Maintain minimum clear space of 1x logo height on all sides
- Never place logo on busy backgrounds without sufficient contrast

## Design Principles

### Visual Style
- **Minimalist**: Clean, uncluttered layouts with ample whitespace
- **High Contrast**: Strong contrast between text and backgrounds for accessibility
- **Geometric**: Sharp angles, precise alignment, and geometric patterns
- **Space-Themed**: Subtle cosmic elements and AI-inspired animations

### Interactive Elements
- **Hover States**: Transform scale (1.05), subtle shadows, color transitions
- **Button Styles**: Rounded corners (12px), Matrix green backgrounds, bold text
- **Animation Timing**: 200-300ms for micro-interactions, 600ms for transitions

### Grid System
- **Desktop**: 1200px max-width container with 24px padding
- **Tablet**: 768px breakpoint with responsive scaling
- **Mobile**: 480px breakpoint with stacked layouts

## Accessibility Standards

### Color Contrast
- **Minimum Ratio**: 4.5:1 for normal text, 3:1 for large text
- **Matrix Green on Black**: Meets WCAG AA standards
- **White on Black**: Exceeds WCAG AAA standards

### Focus States
- **Visible Focus**: 2px Matrix green outline with 2px offset
- **Interactive Elements**: Clear visual feedback for all clickable items
- **Keyboard Navigation**: Full keyboard accessibility support

## File Formats

### Logo Files
- **SVG**: Scalable vector format (primary)
- **PNG**: High-resolution raster (fallback)
- **ICO**: Favicon formats

### Export Specifications
- **SVG**: Optimized, clean code, no unnecessary elements
- **PNG**: 300 DPI, transparent backgrounds
- **Sizes**: 16px, 32px, 48px, 64px, 128px, 256px, 512px

## Usage Guidelines

### Do's
✅ Use the Matrix green (#00FF41) consistently across all interactive elements
✅ Maintain proper contrast ratios for accessibility
✅ Keep animations subtle and performance-optimized
✅ Use Rajdhani font family for all text elements
✅ Ensure responsive behavior across all devices

### Don'ts
❌ Never use colors outside the defined brand palette
❌ Don't stretch or distort the logo proportions
❌ Avoid using Matrix green for large background areas
❌ Never place logo on low-contrast backgrounds
❌ Don't use system fonts instead of Rajdhani

## Implementation Notes

### CSS Variables
```css
:root {
  --brand-matrix-green: #00FF41;
  --brand-deep-black: #0A0A0A;
  --brand-pure-white: #F8F9FA;
  --brand-dark-gray: #1a1a1a;
  --brand-medium-gray: #2a2a2a;
}
```

### React Component Usage
```jsx
import SentraTechLogo from './components/SentraTechLogo';

<SentraTechLogo 
  width={48} 
  height={48} 
  showText={true} 
  textColor="#00FF41" 
/>
```

## Brand Applications

### Digital
- Website headers and footers
- Social media profiles and posts  
- Email signatures and templates
- Digital presentations and PDFs

### Print (Future)
- Business cards and stationery
- Marketing collateral and brochures
- Conference materials and signage

---

**Brand Kit Version**: 1.0  
**Last Updated**: December 2024  
**Created by**: SentraTech Design Team

For questions about brand usage, contact: brand@sentratech.ai