# Flutter Trading Orders Page

A professional, responsive trading orders page built with Flutter Web that replicates a modern trading platform interface. This application is designed to work seamlessly across all screen sizes from mobile to desktop with advanced responsive features.

## 🚀 Features

**Core Features**:
- Professional trading interface with responsive stock tickers and navigation
- Comprehensive orders table with responsive column management
- Advanced search and filtering functionality with responsive breakpoints
- Real-time order status tracking with color-coded side indicators and directional icons
- Fully responsive design that adapts to all screen sizes (mobile, tablet, desktop)
- Pagination for large order datasets
- Responsive drawer navigation for mobile and tablet

**Design Elements**:
- Clean, modern UI with professional color scheme (blues, greys, whites)
- Responsive layout using LayoutBuilder with constraint-based sizing
- Smooth transitions and hover states for better user experience
- Data table for desktop/tablet view, card-based layout for mobile
- Custom filter chips and action buttons with responsive sizing
- Professional typography and spacing system
- Responsive icons that scale based on screen size and available space

## 📱 Responsive Design

### Desktop (>1000px)
- Full data table with all columns visible (Time, Client, Ticker, Side, Product, Qty, Price, Actions)
- Complete navigation bar with stock tickers and dropdown menus
- Horizontal layout for filters and search with cancel button on extreme right
- Full-size icons and spacing

### Tablet (600-1000px)
- Responsive table with progressive column hiding
- Client column hidden below 700px width
- Product column hidden below 900px width
- Condensed navigation elements with tablet-optimized sizing
- Responsive icons and spacing
- Search bar width reduced to 250px

### Mobile (<600px)
- Card-based order display instead of table
- Collapsible navigation with drawer menu
- Stacked layout for filters
- Touch-friendly interface elements
- Mobile-optimized stock ticker carousel

## 🛠️ Technology Stack

- **Flutter** - Cross-platform UI framework
- **Dart** - Programming language
- **Material Design** - UI component library
- **Responsive Design** - MediaQuery, LayoutBuilder, Flex widgets

## 📋 Installation & Setup

### Prerequisites
- Flutter SDK (latest stable version)
- Dart SDK (comes with Flutter)
- Web browser for testing

### Getting Started

1. **Clone and navigate to the project:**
```bash
cd orders_page_app
```

2. **Install dependencies:**
```bash
flutter pub get
```

3. **Run the application:**
```bash
flutter run -d chrome
```

The application will open in your default web browser at `http://localhost:xxxx`

## 📁 Project Structure

```
lib/
├── main.dart                   # App entry point
├── models/
│   └── order_model.dart       # Order data model with sample data
├── screens/                    # (Currently empty - main logic in widgets)
├── utils/
│   └── constants.dart         # Colors, text styles, spacing definitions
└── widgets/
    └── orders_table.dart      # Complete responsive orders page implementation
        ├── OrdersTable (StatefulWidget) - Main widget
        ├── Responsive navigation (mobile/tablet/desktop)
        ├── Stock ticker carousel
        ├── Filter bar with responsive elements
        ├── Orders table with progressive column hiding
        ├── Mobile card layout
        ├── Pagination controls
        └── Drawer navigation for mobile/tablet
```

## 🎨 Design System

### Colors
- **Primary Blue**: #1565C0 (buttons, accents)
- **Success Green**: #4CAF50 (buy orders)
- **Error Red**: #E53935 (sell orders, cancel buttons)
- **Background**: #F5F6FA (page background)
- **White**: #FFFFFF (cards, table background)
- **Grey Variations**: For text and borders

### Typography
- **Headers**: 24px, semi-bold for page titles
- **Body**: 14px for general content
- **Table**: 13px for data table cells
- **Small**: 12px for secondary information

### Spacing
- Consistent 8px spacing system
- Responsive padding and margins
- Proper visual hierarchy

## 💻 Responsive Implementation

The application uses advanced Flutter techniques for responsiveness:

1. **LayoutBuilder**: Constraint-based layouts with dynamic breakpoints
2. **Flexible/Expanded**: Adaptive sizing with proper flex values
3. **SingleChildScrollView**: Horizontal scrolling for navigation and tables
4. **Progressive Disclosure**: Columns and elements hide based on available width
5. **Responsive Icons**: Icon sizing based on screen size and available space
6. **Constraint-based Breakpoints**: Different breakpoints for tablet vs desktop
7. **MainAxisAlignment.spaceBetween**: For positioning cancel button on extreme right

### Key Responsive Features:
- **Tablet-optimized breakpoints**: 700px for Client column, 900px for Product column
- **Responsive icon sizing**: Icons scale from 8px to 14px based on constraints
- **Progressive column hiding**: Table adapts by hiding less critical columns
- **Adaptive search bar**: 250px for tablet, 300px for desktop
- **Overflow protection**: Icons hide when space is insufficient

## 🔧 Customization

### Adding New Orders
Modify `order_model.dart` to add new sample orders:

```dart
OrderModel(
  time: '08:17:30',
  client: 'AAA004',
  ticker: 'WIPRO',
  side: 'Buy',
  product: 'CNC',
  quantity: '20/40',
  price: '450.25',
  hasInfo: true, // Shows info icon after ticker
),
```

### Styling Changes
Update colors and styles in `utils/constants.dart`:

```dart
static const Color primaryBlue = Color(0xFF1565C0);
static const Color newColor = Color(0xFF123456);
```

### Responsive Breakpoint Customization
Modify breakpoints in `orders_table.dart`:

```dart
// Client column visibility
if (constraints.maxWidth > (isTablet ? 700 : 800))

// Product column visibility  
if (constraints.maxWidth > (isTablet ? 900 : 1000))
```

## 📸 Screenshots

The application automatically adapts its layout:

- **Large screens (>1000px)**: Full data table with all columns and features
- **Medium screens (600-1000px)**: Responsive table with progressive column hiding
- **Small screens (<600px)**: Card-based layout for optimal mobile viewing

## 🚀 Building for Production

To build the web application for production:

```bash
flutter build web --release
```

The built files will be in the `build/web/` directory and can be deployed to any web hosting service.

## 🐛 Troubleshooting

### Common Issues:
- **Overflow errors**: Ensure proper use of `Expanded` and `Flexible` widgets
- **Icon sizing**: Icons automatically scale based on available space
- **Tablet layout**: Uses optimized breakpoints for better tablet experience
- **Cancel button**: Positioned on extreme right using `MainAxisAlignment.spaceBetween`

### Performance Tips:
- Icons hide automatically when space is insufficient
- Progressive column hiding reduces layout complexity
- Responsive breakpoints prevent overflow issues

---

This Flutter application demonstrates advanced responsive design principles with constraint-based layouts, progressive disclosure, and tablet-optimized breakpoints. The codebase is fully responsive, maintainable, and ready for further customization or integration with real trading APIs.