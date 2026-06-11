# Implementation Plan: Premium MENA Tablet Store

## Overview

This implementation plan breaks down the premium MENA tablet e-commerce website into discrete coding tasks. The approach follows a bottom-up strategy: establishing project infrastructure, building reusable UI components and core services, implementing feature modules (i18n, product catalog, cart, checkout), and finally integrating everything with comprehensive testing.

The implementation uses **TypeScript** with React 18+, styled-components for styling, React Context for state management, react-i18next for bilingual support (English/Arabic with RTL), and Vite as the build tool.

## Tasks

- [ ] 1. Initialize project infrastructure and development environment
  - [ ] 1.1 Create Vite + React + TypeScript project with initial configuration
    - Initialize Vite project with React-TS template
    - Configure TypeScript with strict mode enabled
    - Setup ESLint and Prettier with React and TypeScript rules
    - Create project directory structure (src/components, src/services, src/contexts, src/types, src/utils, src/locales)
    - Configure Vite for development and production builds
    - Add package.json scripts for dev server, build, and test
    - _Requirements: All (foundational infrastructure)_

  - [ ] 1.2 Install and configure core dependencies
    - Install React Router v6 for routing
    - Install styled-components with TypeScript types
    - Install react-i18next and i18next for internationalization
    - Install React Hook Form and Zod for form validation
    - Install Vitest and fast-check for testing
    - Configure test environment with Vitest and React Testing Library
    - _Requirements: All (foundational infrastructure)_

- [ ] 2. Implement theme system and global styling infrastructure
  - [ ] 2.1 Create theme configuration with brand colors, typography, and spacing
    - Define TypeScript interfaces for Theme structure
    - Implement color palette (Dark Navy #0F172A, White #FFFFFF, Emerald Green #10B981, semantic colors)
    - Define typography system with font families (Inter for English, Tajawal for Arabic)
    - Create spacing scale (xs to 3xl) and shadow system
    - Define transition constants
    - Create theme provider wrapper component
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [ ] 2.2 Implement global styles with RTL/LTR support
    - Create GlobalStyles component using styled-components createGlobalStyle
    - Apply CSS reset/normalize
    - Set direction-aware CSS properties (margin-inline-start, padding-inline-end)
    - Configure font-face declarations for custom fonts
    - Implement responsive breakpoint mixins
    - Add smooth scrolling and box-sizing defaults
    - _Requirements: 1.2, 1.3, 3.1, 3.2, 3.3_

  - [ ]* 2.3 Write property tests for theme color consistency
    - **Property 3: Theme Color Consistency**
    - **Validates: Requirements 1.9, 2.1, 2.2, 2.3**
    - Generate random language toggles and verify brand colors remain unchanged
    - Test with fast-check using fc.constantFrom(['en', 'ar'])
    - _Requirements: 1.9, 2.1, 2.2, 2.3_

- [ ] 3. Implement internationalization (i18n) infrastructure
  - [ ] 3.1 Configure react-i18next with English and Arabic translation files
    - Create i18n configuration file with language detection and fallback
    - Create translation JSON files organized by namespace (common, navigation, products, cart, errors, forms)
    - Implement language detection logic (localStorage, browser preference)
    - Setup i18next with react-i18next integration
    - Create translation hook utilities (useTranslation wrapper)
    - _Requirements: 1.1, 1.7, 1.8_

  - [ ] 3.2 Create LanguageContext for global language state management
    - Define LanguageContext interface with current language, direction, and change handler
    - Implement LanguageProvider with useReducer for state management
    - Persist language preference to localStorage
    - Synchronize HTML dir attribute (ltr/rtl) with language state
    - Export useLanguage custom hook
    - _Requirements: 1.4, 1.5, 1.6_

  - [ ] 3.3 Build LanguageSwitcher component
    - Create toggle button component with current language indicator
    - Implement smooth transition animation for toggle
    - Connect to LanguageContext to trigger language changes
    - Apply accessibility attributes (aria-label, role)
    - Style with theme colors and hover effects
    - _Requirements: 1.4, 1.5_

  - [ ] 3.4 Write property test for language toggle round-trip
    - **Property 1: Language Toggle Round-Trip**
    - **Validates: Requirements 1.5, 1.6**
    - Generate random initial languages and navigation contexts
    - Verify toggling language twice returns to original language and preserves route
    - Test with fast-check using fc.constantFrom(['en', 'ar']) and fc.webPath()
    - _Requirements: 1.5, 1.6_

  - [ ] 3.5 Write property test for translation completeness
    - **Property 2: Translation Completeness**
    - **Validates: Requirements 1.7, 1.8**
    - Extract all translation keys from English translation files
    - Verify each key exists in Arabic translation files
    - Test using fast-check to generate random key paths
    - _Requirements: 1.7, 1.8_

- [ ] 4. Create TypeScript data models and type definitions
  - [ ] 4.1 Define core data model interfaces
    - Create Product interface with bilingual fields (name, nameAr, description, descriptionAr)
    - Define ProductImage, Specifications interfaces
    - Create CartItem, CartSummary, ShoppingCart interfaces
    - Define FilterState, PriceRange, FilterOptions interfaces
    - Create Country, CountryCode, CurrencyCode, ShippingOption types
    - Define Order, OrderData, Address, ContactInfo, PaymentMethod types
    - Create validation error and API error interfaces
    - _Requirements: 4.2, 4.3, 4.4, 4.5, 7.1, 7.6, 8.1-8.13, 12.1, 12.2_

  - [ ] 4.2 Create utility type guards and validation schemas
    - Implement Zod schemas for Product, CartItem, Order validation
    - Create type guard functions (isProduct, isCartItem, isValidCountryCode)
    - Define form validation schemas using Zod (Address, ContactInfo, OrderData)
    - Export all schemas and type guards
    - _Requirements: 12.5, 12.6, 13.2, 13.3_

- [ ] 5. Build reusable UI component library
  - [ ] 5.1 Create base Button component with variants and states
    - Implement Button component with styled-components
    - Support variants (primary, secondary, outline, text)
    - Add size options (small, medium, large)
    - Implement disabled and loading states
    - Apply hover and focus styles with smooth transitions
    - Include proper accessibility attributes (aria-disabled, aria-busy)
    - _Requirements: 2.7, 11.2, 11.6_

  - [ ] 5.2 Create Input component with validation styling
    - Build text input component with label and error message support
    - Add variant support (text, email, tel, number)
    - Style invalid state with error border color
    - Display inline error messages below input
    - Implement accessibility attributes (aria-invalid, aria-describedby)
    - Support bilingual placeholder text
    - _Requirements: 13.2, 13.3, 11.4_

  - [ ] 5.3 Create Card component with shadow and hover effects
    - Build Card wrapper component with styled-components
    - Apply rounded corners and shadow elevation
    - Implement smooth hover effect with transform and shadow transition
    - Support clickable variant that shows pointer cursor
    - _Requirements: 2.5, 2.6, 2.7_

  - [ ] 5.4 Create Select/Dropdown component
    - Implement select component with custom styling
    - Support bilingual option labels
    - Add disabled state styling
    - Implement accessibility attributes (aria-label, role)
    - Apply focus styles consistent with theme
    - _Requirements: 8.11, 11.2, 11.6_

  - [ ] 5.5 Create Loading component with spinner animation
    - Build loading spinner with CSS animation
    - Implement overlay variant for full-page loading
    - Add inline variant for button loading states
    - Apply brand colors (Emerald Green)
    - Ensure smooth 60fps animation using RequestAnimationFrame principles
    - _Requirements: 10.4_

  - [ ] 5.6 Write property test for interactive element hover states
    - **Property 4: Interactive Element Hover States**
    - **Validates: Requirements 2.7, 9.6**
    - Generate random interactive elements (buttons, links, cards)
    - Verify CSS transition properties are applied on hover state
    - Test using React Testing Library hover simulation
    - _Requirements: 2.7, 9.6_

  - [ ] 5.7 Write property test for touch target sizing on mobile
    - **Property 7: Touch Target Sizing**
    - **Validates: Requirements 3.5**
    - Render interactive elements in mobile viewport (<768px)
    - Verify computed dimensions meet 44x44px minimum
    - Test using fast-check to generate various element types
    - _Requirements: 3.5_

  - [ ] 5.8 Write property test for keyboard navigation accessibility
    - **Property 24: Keyboard Navigation Accessibility**
    - **Validates: Requirements 11.2**
    - Generate random interactive components
    - Verify tabIndex values allow keyboard focus (≥ -1)
    - Test using React Testing Library keyboard navigation
    - _Requirements: 11.2_

- [ ] 6. Checkpoint - Verify core infrastructure and base components
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Implement service layer for business logic
  - [ ] 7.1 Create ProductService for product operations
    - Implement getProducts() method fetching from API
    - Create getProductById(id) method with error handling
    - Build searchProducts(term) with full-text search logic
    - Implement filterProducts(products, filters) applying all filter criteria
    - Create getFilterOptions(products) extracting unique filter values
    - Add proper error handling with ApiError types
    - _Requirements: 4.1, 5.1, 5.2, 5.6_

  - [ ] 7.2 Create CartService for shopping cart operations
    - Implement addToCart(productId, quantity) method
    - Create removeFromCart(itemId) method
    - Build updateQuantity(itemId, quantity) with validation
    - Implement calculateCartSummary(items, shipping) computing totals
    - Create persistCart(cart) saving to localStorage with 7-day expiration
    - Build loadCart() loading from localStorage with expiration check
    - Add clearCart() method
    - _Requirements: 6.9, 7.1, 7.7, 7.8, 7.9, 7.10, 7.11_

  - [ ] 7.3 Create CurrencyService for currency handling
    - Implement convertPrice(amount, fromCurrency, toCurrency) method
    - Create formatPrice(amount, currency, language) with locale-aware formatting
    - Build getExchangeRate(fromCurrency, toCurrency) method
    - Support all MENA currencies (SAR, AED, KWD, QAR, BHD, OMR, EGP, JOD, MAD, DZD)
    - _Requirements: 4.8, 8.13_

  - [ ] 7.4 Create ValidationService for data validation
    - Implement validateEmail(email) using RFC 5322 format
    - Create validatePhone(phone, countryCode) with country-specific rules
    - Build validateAddress(address) checking required fields
    - Implement validateCartItem(item) for quantity and availability
    - Create validateOrderData(orderData) for checkout validation
    - Return ValidationResult objects with error messages in both languages
    - _Requirements: 12.5, 12.6, 13.3_

  - [ ] 7.5 Create ShippingService for shipping calculations
    - Implement getShippingOptions(countryCode) fetching available options
    - Create calculateShipping(cartWeight, countryCode, shippingOptionId) method
    - Build estimateDelivery(countryCode, shippingOptionId) returning days
    - Support all MENA countries (SA, AE, KW, QA, BH, OM, EG, JO, MA, DZ)
    - _Requirements: 8.1-8.12, 12.7_

  - [ ] 7.6 Create ApiClient for backend communication
    - Implement ApiClient class with base URL and timeout configuration
    - Create get<T>(endpoint, params) method with query parameter handling
    - Build post<T>(endpoint, data) method
    - Add put, delete, patch methods
    - Implement request/response interceptors for headers (Content-Type, Accept-Language)
    - Add error normalization to ApiError format
    - Implement timeout handling with default 10 seconds
    - Include retry logic with exponential backoff for network failures
    - _Requirements: 10.1, 10.2, 13.1, 13.6_

  - [ ] 7.7 Write unit tests for cart calculation logic
    - Test calculateCartSummary with various item combinations
    - Test edge cases (empty cart, single item, multiple quantities)
    - Test subtotal, shipping, and total calculations
    - Verify cart persistence and loading from localStorage
    - _Requirements: 7.9, 7.10, 7.11_

  - [ ] 7.8 Write property test for cart total calculation
    - **Property 21: Cart Total Calculation**
    - **Validates: Requirements 7.9, 7.10, 7.11**
    - Generate random cart items with prices and quantities
    - Verify total equals sum of (price × quantity) + shipping
    - Test using fast-check with fc.array and fc.integer
    - _Requirements: 7.9, 7.10, 7.11_

  - [ ] 7.9 Write property test for filter result accuracy
    - **Property 12: Filter Result Accuracy**
    - **Validates: Requirements 5.6**
    - Generate random filter combinations (brand, price range, specs)
    - Apply filters and verify all returned products satisfy all criteria
    - Test using fast-check with fc.record for filter state
    - _Requirements: 5.6_

  - [ ] 7.10 Write property test for currency formatting by country
    - **Property 11: Currency Formatting by Country**
    - **Validates: Requirements 4.8, 8.13**
    - Generate random MENA countries
    - Verify prices are formatted with correct currency code for each country
    - Test using fast-check with fc.constantFrom for country codes
    - _Requirements: 4.8, 8.13_

- [ ] 8. Implement global state management contexts
  - [ ] 8.1 Create CartContext for cart state management
    - Define CartContext interface with items, operations, and summary
    - Implement CartProvider using useReducer for state management
    - Create reducer handling ADD_ITEM, REMOVE_ITEM, UPDATE_QUANTITY, CLEAR_CART actions
    - Integrate CartService for persistence and calculations
    - Export useCart custom hook
    - _Requirements: 7.1, 7.2, 7.3, 7.7, 7.8, 7.9, 7.10, 7.11_

  - [ ] 8.2 Create LocationContext for country and currency state
    - Define LocationContext interface with country, currency, shipping options
    - Implement LocationProvider with useReducer
    - Integrate geolocation detection on first visit
    - Persist country selection to localStorage
    - Fetch shipping options when country changes
    - Export useLocation custom hook
    - _Requirements: 8.1-8.13_

  - [ ] 8.3 Create FilterContext for product filtering state
    - Define FilterContext interface with filters, available options, search term
    - Implement FilterProvider with useReducer
    - Synchronize filter state with URL query parameters
    - Create actions for SET_SEARCH, SET_FILTERS, CLEAR_FILTERS
    - Export useFilters custom hook
    - _Requirements: 5.1, 5.3, 5.4, 5.5, 5.6, 5.8_

  - [ ] 8.4 Write unit tests for context state updates
    - Test CartContext add, remove, update operations
    - Test LocationContext country change updates currency
    - Test FilterContext synchronization with URL parameters
    - _Requirements: 7.7, 8.12, 5.6_

- [ ] 9. Checkpoint - Verify services and state management
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Build product catalog components
  - [ ] 10.1 Create ProductCard component
    - Implement Card wrapper with product image, name, price, specs, availability
    - Display bilingual product name based on current language from LanguageContext
    - Format price with CurrencyService and currency from LocationContext
    - Implement lazy loading for product images using loading="lazy" attribute
    - Apply hover effect with smooth transform and shadow transition
    - Add onClick handler navigating to product detail page
    - Include accessibility attributes (alt text for images, semantic HTML)
    - _Requirements: 4.2, 4.3, 4.4, 4.5, 4.7, 4.9, 2.5, 2.6, 2.7_

  - [ ] 10.2 Create ProductCatalog component
    - Implement responsive CSS grid layout (4 columns desktop, 2 tablet, 1 mobile)
    - Map filtered products to ProductCard components
    - Display result count above grid
    - Show empty state message when no products match filters
    - Implement loading state with skeleton cards
    - _Requirements: 4.1, 4.6, 5.7, 13.4_

  - [ ] 10.3 Create SearchBar component
    - Build search input with icon using Input base component
    - Implement debounced search (300ms) using useEffect and setTimeout
    - Connect to FilterContext to update search term
    - Add keyboard navigation (ESC to clear search)
    - Support bilingual placeholder text
    - _Requirements: 5.1, 5.2_

  - [ ] 10.4 Create FilterPanel component
    - Implement collapsible filter sections (Brand, Price Range, Screen Size, Storage, RAM, Processor)
    - Create checkbox groups for discrete values (brand, specs)
    - Build range slider for price using input type="range"
    - Display active filter count badge
    - Add "Clear All Filters" button
    - Connect to FilterContext for state management
    - Update URL query parameters when filters change
    - _Requirements: 5.3, 5.4, 5.5, 5.6, 5.8_

  - [ ] 10.5 Write property test for product card required elements
    - **Property 9: Product Card Required Elements**
    - **Validates: Requirements 4.2, 4.3, 4.4, 4.5, 4.9**
    - Generate random products using fast-check
    - Verify rendered ProductCard includes image, name, price, specs, availability
    - Test using React Testing Library queries
    - _Requirements: 4.2, 4.3, 4.4, 4.5, 4.9_

  - [ ] 10.6 Write property test for product card navigation
    - **Property 10: Product Card Navigation**
    - **Validates: Requirements 4.7**
    - Generate random products with IDs
    - Simulate click and verify navigation to correct product detail URL
    - Test using React Testing Library and React Router memory router
    - _Requirements: 4.7_

  - [ ] 10.7 Write property test for filter result count accuracy
    - **Property 13: Filter Result Count Accuracy**
    - **Validates: Requirements 5.7**
    - Generate random filter combinations
    - Verify displayed result count equals actual filtered product array length
    - Test using fast-check for filter state generation
    - _Requirements: 5.7_

  - [ ] 10.8 Write property test for product image resolution
    - **Property 5: Product Image Resolution**
    - **Validates: Requirements 2.10**
    - Generate random product image URLs
    - Verify image dimensions meet minimum requirements (width ≥ 800px)
    - Test using fast-check and image dimension checking
    - _Requirements: 2.10_

  - [ ] 10.9 Write property test for content width constraint
    - **Property 6: Content Width Constraint**
    - **Validates: Requirements 3.4**
    - Generate random viewport widths
    - Verify document body width never exceeds viewport width
    - Test using React Testing Library with window resize simulation
    - _Requirements: 3.4_

- [ ] 11. Build product detail page components
  - [ ] 11.1 Create ImageCarousel component for product images
    - Implement image carousel with navigation arrows
    - Build thumbnail preview strip below main image
    - Add zoom capability on click or hover
    - Support swipe gestures for touch devices
    - Include keyboard navigation (arrow keys)
    - Display loading state for images
    - Add accessibility attributes (aria-label, role="region")
    - _Requirements: 6.1, 6.2_

  - [ ] 11.2 Create ProductDetailPage component
    - Fetch product details by ID from route params using ProductService
    - Render ImageCarousel with product images
    - Display bilingual product name and description
    - Show complete specifications table
    - Format price with CurrencyService
    - Display availability status with color-coded badge
    - Show shipping information for selected country from LocationContext
    - Implement quantity selector (default 1, min 1, max stock quantity)
    - Add "Add to Cart" button calling CartContext.addToCart
    - Disable cart button when out of stock
    - Display breadcrumb navigation (Home > Products > Product Name)
    - Show loading state while fetching product data
    - Handle not found error (invalid product ID)
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 6.10, 9.7, 13.5_

  - [ ] 11.3 Write property test for product detail page completeness
    - **Property 14: Product Detail Page Completeness**
    - **Validates: Requirements 6.1-6.8, 6.10**
    - Generate random valid product IDs
    - Verify all required elements render (carousel, name, price, specs, description, availability, shipping, cart button)
    - Test using React Testing Library
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.10_

  - [ ] 11.4 Write property test for add to cart increments count
    - **Property 15: Add to Cart Increments Count**
    - **Validates: Requirements 6.9**
    - Generate random products
    - Click "Add to Cart" and verify cart count increments by 1
    - Test duplicate adds increase quantity of existing item
    - _Requirements: 6.9_

- [ ] 12. Checkpoint - Verify product catalog and detail pages
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 13. Build shopping cart components
  - [ ] 13.1 Create CartItem component
    - Display product image, name (bilingual), price, and quantity
    - Implement quantity stepper controls (increment/decrement buttons)
    - Add remove button with confirmation
    - Validate quantity constraints (min 1, max stock availability)
    - Show out of stock warning if availability changes
    - Apply responsive layout (horizontal on desktop, vertical on mobile)
    - _Requirements: 7.6, 7.7, 7.8_

  - [ ] 13.2 Create ShoppingCart component
    - Fetch cart items from CartContext
    - Render list of CartItem components
    - Calculate and display subtotal, shipping (from LocationContext), and total
    - Show empty cart state with "Browse Products" CTA button
    - Display cart icon with item count badge
    - Add "Proceed to Checkout" button (disabled when cart empty)
    - Implement loading state during cart operations
    - _Requirements: 7.1, 7.2, 7.3, 7.5, 7.9, 7.10, 7.11, 7.12, 13.4_

  - [ ] 13.3 Write property test for cart icon badge accuracy
    - **Property 16: Cart Icon Badge Accuracy**
    - **Validates: Requirements 7.3**
    - Generate random cart states with various quantities
    - Verify cart icon badge displays sum of all item quantities
    - Test using fast-check with fc.array of cart items
    - _Requirements: 7.3_

  - [ ] 13.4 Write property test for cart page displays all items
    - **Property 17: Cart Page Displays All Items**
    - **Validates: Requirements 7.5**
    - Generate random cart states with multiple items
    - Verify cart page renders component for each item
    - Count rendered CartItem components and compare to cart array length
    - _Requirements: 7.5_

  - [ ] 13.5 Write property test for cart item display completeness
    - **Property 18: Cart Item Display Completeness**
    - **Validates: Requirements 7.6**
    - Generate random cart items
    - Verify each rendered item includes name, image, price, quantity controls
    - Test using React Testing Library queries
    - _Requirements: 7.6_

  - [ ] 13.6 Write property test for cart quantity update persistence
    - **Property 19: Cart Quantity Update Persistence**
    - **Validates: Requirements 7.7**
    - Generate random cart items and quantity updates
    - Update quantity and verify both state and UI reflect new value
    - Check localStorage persistence
    - _Requirements: 7.7_

  - [ ] 13.7 Write property test for cart item removal decreases count
    - **Property 20: Cart Item Removal Decreases Count**
    - **Validates: Requirements 7.8**
    - Generate random cart states
    - Remove item and verify total count decreases by item quantity
    - Test using fast-check with fc.array
    - _Requirements: 7.8_

- [ ] 14. Build navigation and layout components
  - [ ] 14.1 Create NavigationMenu component
    - Implement fixed-position header with styled-components
    - Display brand logo with link to homepage
    - Render navigation links (Home, Products, About, Contact)
    - Include LanguageSwitcher component
    - Show cart icon with badge from CartContext
    - Apply hover effects to navigation items
    - Implement responsive transformation to hamburger menu on mobile (<768px)
    - Build slide-out drawer for mobile navigation
    - Add keyboard navigation support (Tab, Enter, Escape)
    - Include skip-to-content link for screen readers
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.9, 11.2, 11.3_

  - [ ] 14.2 Create Footer component
    - Display company information and copyright
    - Include additional links (Privacy Policy, Terms of Service, Contact)
    - Support bilingual content
    - Apply responsive layout (columns on desktop, stacked on mobile)
    - _Requirements: 9.8_

  - [ ] 14.3 Create CountrySelector component
    - Implement dropdown with MENA country options
    - Display country flags and bilingual names
    - Connect to LocationContext to update selected country
    - Show current country in dropdown trigger
    - Update currency and fetch shipping options on selection
    - Persist selection to localStorage
    - _Requirements: 8.1-8.12_

  - [ ] 14.4 Create ErrorBoundary component
    - Implement React Error Boundary class component
    - Catch JavaScript errors in child component tree
    - Display fallback UI with user-friendly error message (bilingual)
    - Include "Reload Page" and "Go Home" action buttons
    - Log error details to console for debugging
    - _Requirements: 13.1, 13.7_

  - [ ] 14.5 Create MainLayout component
    - Wrap pages with NavigationMenu, Footer, and ErrorBoundary
    - Apply consistent spacing and max-width constraints
    - Include theme provider and global styles
    - Set up all context providers (Language, Cart, Location, Filter)
    - _Requirements: 9.1, 9.8_

  - [ ] 14.6 Write property test for country-specific shipping options
    - **Property 22: Country-Specific Shipping Options**
    - **Validates: Requirements 8.12**
    - Generate random MENA country selections
    - Verify shipping options API returns at least one option for each country
    - Test using fast-check with fc.constantFrom for country codes
    - _Requirements: 8.12_

- [ ] 15. Build checkout flow components
  - [ ] 15.1 Create AddressForm component
    - Implement form fields for shipping address (first name, last name, address lines, city, postal code)
    - Use React Hook Form for form state management
    - Apply Zod validation schema for address
    - Display field-specific error messages inline
    - Highlight invalid fields with error styling
    - Support bilingual labels and placeholders
    - Include country selector (read-only, from LocationContext)
    - _Requirements: 12.1, 12.5, 12.6, 13.2, 13.3_

  - [ ] 15.2 Create ContactInfoForm component
    - Implement form fields for email and phone
    - Apply email and phone validation using ValidationService
    - Display real-time validation feedback
    - Support bilingual content
    - _Requirements: 12.2, 12.5, 12.6, 13.3_

  - [ ] 15.3 Create ShippingOptionsSelector component
    - Fetch shipping options from LocationContext for selected country
    - Display radio group with shipping methods
    - Show cost and estimated delivery days for each option
    - Support bilingual option names
    - Update cart summary when shipping option changes
    - _Requirements: 12.7_

  - [ ] 15.4 Create PaymentMethodSelector component
    - Implement radio group for payment methods (credit card, PayPal, cash on delivery)
    - Display payment method icons and descriptions
    - Support bilingual content
    - Apply validation ensuring a method is selected
    - _Requirements: 12.4_

  - [ ] 15.5 Create OrderSummary component
    - Display all cart items with individual prices
    - Show subtotal, shipping cost, and total cost
    - Format prices with CurrencyService
    - Support bilingual labels
    - Update dynamically when cart or shipping changes
    - _Requirements: 12.3, 7.9, 7.10, 7.11_

  - [ ] 15.6 Create CheckoutForm component (multi-step orchestrator)
    - Implement multi-step form (Step 1: Shipping Info, Step 2: Payment, Step 3: Review)
    - Integrate AddressForm, ContactInfoForm, ShippingOptionsSelector, PaymentMethodSelector
    - Display OrderSummary sidebar
    - Validate each step before allowing progression
    - Prevent form submission when required fields invalid
    - Show loading indicator during order submission
    - Call order API endpoint on final submission
    - Handle submission errors with user-friendly messages (bilingual)
    - Navigate to confirmation page on success
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 12.8, 12.9_

  - [ ] 15.7 Create OrderConfirmation component
    - Display order confirmation message with order number
    - Show order summary with all details
    - Provide "Continue Shopping" button
    - Clear cart after successful order
    - Support bilingual content
    - _Requirements: 12.9_

  - [ ] 15.8 Write property test for checkout order summary completeness
    - **Property 29: Checkout Order Summary Completeness**
    - **Validates: Requirements 12.3**
    - Generate random cart states and shipping costs
    - Verify order summary lists all items, subtotal, shipping, total
    - Test using fast-check
    - _Requirements: 12.3_

  - [ ] 15.9 Write property test for form validation prevents incomplete submission
    - **Property 30: Form Validation Prevents Incomplete Submission**
    - **Validates: Requirements 12.5, 12.6**
    - Generate random incomplete form states (missing required fields)
    - Attempt submission and verify it is prevented
    - Verify validation errors are displayed
    - _Requirements: 12.5, 12.6_

  - [ ] 15.10 Write property test for field-specific error messages
    - **Property 31: Field-Specific Error Messages**
    - **Validates: Requirements 12.6, 13.3**
    - Generate random invalid field values
    - Trigger validation and verify specific error messages appear
    - Test using React Testing Library
    - _Requirements: 12.6, 13.3_

  - [ ] 15.11 Write property test for invalid field visual highlighting
    - **Property 32: Invalid Field Visual Highlighting**
    - **Validates: Requirements 13.2**
    - Generate random invalid form fields
    - Verify error styling is applied (border color, background)
    - Test using computed styles
    - _Requirements: 13.2_

- [ ] 16. Checkpoint - Verify checkout flow and cart functionality
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 17. Implement routing and page components
  - [ ] 17.1 Create HomePage component
    - Display product catalog with ProductCatalog component
    - Include SearchBar and FilterPanel components
    - Show welcome banner with hero image
    - Apply responsive layout
    - _Requirements: 4.1_

  - [ ] 17.2 Create ProductsPage component
    - Display full product catalog with filtering
    - Include SearchBar and FilterPanel
    - Show pagination controls (if implementing pagination)
    - Apply responsive grid layout
    - _Requirements: 4.1, 5.1, 5.3, 5.4, 5.5, 5.6_

  - [ ] 17.3 Create CartPage component
    - Render ShoppingCart component
    - Apply responsive layout
    - _Requirements: 7.4, 7.5, 7.6, 7.7, 7.8, 7.9, 7.10, 7.11, 7.12_

  - [ ] 17.4 Create CheckoutPage component
    - Render CheckoutForm component
    - Apply responsive layout
    - Redirect to cart if cart is empty
    - _Requirements: 12.1-12.9_

  - [ ] 17.5 Create NotFoundPage component
    - Display 404 error message (bilingual)
    - Provide navigation links to home and products
    - Apply consistent styling with theme
    - _Requirements: 13.1_

  - [ ] 17.6 Configure React Router with routes
    - Define routes: / (HomePage), /products (ProductsPage), /products/:id (ProductDetailPage), /cart (CartPage), /checkout (CheckoutPage), /order-confirmation (OrderConfirmation), * (NotFoundPage)
    - Implement route-based code splitting using React.lazy()
    - Add loading fallback for lazy-loaded routes
    - Configure BrowserRouter with basename for deployment
    - _Requirements: All navigation requirements_

- [ ] 18. Implement accessibility enhancements
  - [ ] 18.1 Add ARIA labels and roles throughout application
    - Add role="navigation" to NavigationMenu
    - Add role="search" to SearchBar
    - Add role="button" to custom button components
    - Add aria-label to icon-only buttons (cart icon, language switcher)
    - Add aria-live="polite" to cart count updates
    - Add aria-describedby to form field error messages
    - Add aria-expanded to collapsible filter sections
    - _Requirements: 11.5_

  - [ ] 18.2 Implement focus management and indicators
    - Ensure visible focus ring on all interactive elements
    - Use emerald green (#10B981) for focus outline
    - Trap focus in modals and drawers
    - Return focus to trigger element when closing modals
    - Implement skip-to-content link
    - _Requirements: 11.6_

  - [ ] 18.3 Add comprehensive alt text for images
    - Ensure all product images have descriptive alt text
    - Support bilingual alt text (alt for English, altAr for Arabic)
    - Use empty alt="" for decorative images
    - _Requirements: 11.1_

  - [ ] 18.4 Write property test for image alt text presence
    - **Property 23: Image Alt Text Presence**
    - **Validates: Requirements 11.1**
    - Generate random images throughout application
    - Verify alt attribute is defined and non-empty (or empty for decorative)
    - Test using React Testing Library
    - _Requirements: 11.1_

  - [ ] 18.5 Write property test for tab order logical sequence
    - **Property 25: Tab Order Logical Sequence**
    - **Validates: Requirements 11.3**
    - Render pages and simulate tab navigation
    - Verify focus sequence matches visual layout hierarchy
    - Test using React Testing Library keyboard simulation
    - _Requirements: 11.3_

  - [ ] 18.6 Write property test for color contrast compliance
    - **Property 26: Color Contrast Compliance**
    - **Validates: Requirements 11.4**
    - Generate random text and background color combinations from theme
    - Verify contrast ratios meet WCAG AA (4.5:1 normal, 3:1 large)
    - Use contrast calculation library
    - _Requirements: 11.4_

  - [ ] 18.7 Write property test for accessible names on interactive elements
    - **Property 27: Accessible Names for Interactive Elements**
    - **Validates: Requirements 11.5**
    - Generate random interactive elements
    - Verify accessible name determinable via text content, aria-label, or aria-labelledby
    - Test using React Testing Library accessibility queries
    - _Requirements: 11.5_

  - [ ] 18.8 Write property test for focus indicator visibility
    - **Property 28: Focus Indicator Visibility**
    - **Validates: Requirements 11.6**
    - Generate random focusable elements
    - Simulate focus and verify distinct visual styling applied
    - Test using computed styles
    - _Requirements: 11.6_

  - [ ] 18.9 Write property test for responsive text readability
    - **Property 8: Responsive Text Readability**
    - **Validates: Requirements 3.6**
    - Render text at various viewport sizes
    - Verify font sizes meet minimums (≥14px mobile, ≥16px desktop)
    - Test using React Testing Library viewport resizing
    - _Requirements: 3.6_

- [ ] 19. Implement performance optimizations
  - [ ] 19.1 Add image optimization and lazy loading
    - Configure WebP format with JPEG fallback using picture element
    - Implement responsive image sizes using srcset
    - Add lazy loading attribute to below-the-fold images
    - Specify image dimensions to prevent layout shift
    - _Requirements: 10.5_

  - [ ] 19.2 Implement code splitting and lazy loading
    - Apply route-based code splitting using React.lazy() for all page components
    - Create separate bundles for heavy components (ImageCarousel, CheckoutForm)
    - Implement dynamic imports for FilterPanel when opened
    - Configure Vite to generate vendor bundle separation
    - _Requirements: 10.1, 10.3_

  - [ ] 19.3 Add React performance optimizations
    - Wrap expensive components with React.memo (ProductCard, CartItem)
    - Use useMemo for cart calculations and filter operations
    - Apply useCallback to function props to prevent re-renders
    - Implement virtualized scrolling for large product lists using react-window
    - Debounce scroll handlers for performance
    - _Requirements: 10.1, 10.2, 10.3, 10.7_

  - [ ] 19.4 Configure caching strategies
    - Set up browser caching headers for static assets (1 year with version hashing)
    - Implement API response caching (5 minutes for product data)
    - Configure localStorage for cart with 7-day expiration
    - Add service worker for offline support (optional enhancement)
    - _Requirements: 10.1, 10.2_

  - [ ] 19.5 Optimize bundle size
    - Configure Vite for production build with minification and compression
    - Enable tree shaking to eliminate unused code
    - Analyze bundle size using rollup-plugin-visualizer
    - Extract and minify CSS
    - Remove development warnings in production build
    - _Requirements: 10.1_

- [ ] 20. Checkpoint - Verify accessibility and performance
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 21. Create mock data and API integration
  - [ ] 21.1 Create mock product data
    - Generate mock Product objects with bilingual content
    - Include 20-30 products covering various brands, specs, and price ranges
    - Create high-quality product images (use placeholder service or CDN)
    - Ensure all products have complete specifications
    - Include mix of in_stock, out_of_stock, and preorder availability
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ] 21.2 Create mock API endpoints or mock service
    - Implement mock ProductService methods returning mock data
    - Add simulated network delays (200-500ms) for realistic behavior
    - Create mock ShippingService with MENA country data
    - Generate mock shipping options for each country
    - Implement mock OrderService for checkout
    - Add error simulation for testing error handling
    - _Requirements: All API-dependent requirements_

  - [ ] 21.3 Setup API integration with real backend (if available)
    - Configure ApiClient base URL from environment variables
    - Implement authentication headers if required
    - Add request/response logging for debugging
    - Configure CORS settings
    - Test all endpoints with real backend
    - _Requirements: All API-dependent requirements_

- [ ] 22. Add error handling and edge case coverage
  - [ ] 22.1 Implement comprehensive error handling
    - Add error boundaries around major sections
    - Implement network error recovery with retry logic
    - Display user-friendly error messages for all error scenarios
    - Add loading indicators for all async operations >500ms
    - Handle out of stock scenarios gracefully
    - Implement empty state messages (empty cart, no search results, no filters match)
    - _Requirements: 10.4, 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7_

  - [ ]* 22.2 Write integration tests for key user flows
    - Test browse products → view detail → add to cart → checkout flow
    - Test search products → apply filters → view results
    - Test language switching with route preservation
    - Test country selection updates currency and shipping
    - Test cart persistence to localStorage
    - _Requirements: All major user flows_

- [ ] 23. Final integration and polish
  - [ ] 23.1 Wire all components together in App component
    - Set up MainLayout with all context providers
    - Configure React Router with all routes
    - Add ErrorBoundary at root level
    - Initialize i18n on app mount
    - Load persisted state (language, country, cart) on startup
    - _Requirements: All integration requirements_

  - [ ] 23.2 Add animations and transitions
    - Implement smooth page transitions using React Router
    - Add hover animations to interactive elements
    - Create loading animations for async operations
    - Add cart item add/remove animations
    - Implement mobile menu slide-in animation
    - Ensure all animations run at 60fps
    - _Requirements: 2.7, 2.8, 10.7_

  - [ ] 23.3 Responsive design final verification
    - Test all pages at mobile breakpoint (375px, 414px)
    - Test all pages at tablet breakpoint (768px, 1024px)
    - Test all pages at desktop breakpoint (1280px, 1920px)
    - Verify no horizontal scrolling at any breakpoint
    - Test touch interactions on mobile devices
    - Verify text remains readable at all sizes
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

  - [ ] 23.4 Bilingual content final verification
    - Verify all UI elements translate correctly
    - Test RTL layout in Arabic mode
    - Verify icons flip correctly for RTL
    - Test all forms with Arabic input
    - Verify error messages appear in correct language
    - Test all empty states in both languages
    - _Requirements: 1.1, 1.2, 1.3, 1.7, 1.8_

  - [ ] 23.5 Create deployment configuration
    - Configure Vite build for production
    - Set up environment variables for different environments (dev, staging, prod)
    - Create deployment scripts
    - Configure static site hosting (Vercel, Netlify, or AWS S3)
    - Set up CDN for asset delivery
    - Configure domain and SSL certificates
    - Add error tracking integration (optional)
    - Add analytics integration (optional, with privacy compliance)
    - _Requirements: 10.1, 10.2_

- [ ] 24. Final checkpoint and testing
  - [ ] 24.1 Run full test suite and fix any failures
    - Execute all unit tests
    - Execute all property-based tests
    - Execute all integration tests
    - Achieve minimum test coverage thresholds
    - Fix any test failures or flaky tests
    - _Requirements: All testing requirements_

  - [ ] 24.2 Perform manual QA testing
    - Test complete user journey end-to-end
    - Test all error scenarios
    - Test on multiple browsers (Chrome, Firefox, Safari, Edge)
    - Test on multiple devices (desktop, tablet, mobile)
    - Test both languages thoroughly
    - Test all MENA countries
    - Verify accessibility with screen reader
    - Test keyboard-only navigation
    - _Requirements: All functional requirements_

  - [ ] 24.3 Performance audit
    - Run Lighthouse performance audit
    - Verify homepage loads within 3 seconds
    - Verify product detail page loads within 2 seconds
    - Verify page navigation completes within 1 second
    - Check Core Web Vitals (LCP, FID, CLS)
    - Optimize any performance bottlenecks
    - _Requirements: 10.1, 10.2, 10.3, 10.7_

  - [ ] 24.4 Accessibility audit
    - Run axe DevTools accessibility scan
    - Verify WCAG 2.1 Level AA compliance
    - Test with screen reader (NVDA or JAWS)
    - Test keyboard navigation on all pages
    - Verify text resize up to 200% works correctly
    - Fix any accessibility violations
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7_


## Notes

- Tasks marked with `*` are optional property-based and unit test tasks that can be skipped for faster MVP delivery
- Each implementation task references specific requirements for traceability
- The workflow follows a bottom-up approach: infrastructure → components → services → features → integration
- Checkpoints are placed at logical breaks to ensure quality before proceeding
- Property tests validate universal correctness properties defined in the design document
- The technology stack uses TypeScript, React 18+, styled-components, react-i18next, React Router v6, and Vite
- All bilingual content must support both English (LTR) and Arabic (RTL) layouts
- MENA countries supported: SA, AE, KW, QA, BH, OM, EG, JO, MA, DZ
- Brand colors: Dark Navy (#0F172A), White (#FFFFFF), Emerald Green (#10B981)
- Responsive breakpoints: Mobile (<768px), Tablet (768-1023px), Desktop (≥1024px)
- Accessibility target: WCAG 2.1 Level AA compliance
- Performance targets: Homepage ≤3s, Product Detail ≤2s, Navigation ≤1s
- All property tests should run a minimum of 100 iterations with fast-check
- Test tasks are complementary to implementation; unit tests validate examples, property tests validate universal properties

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "2.1", "4.1"] },
    { "id": 2, "tasks": ["2.2", "3.1", "4.2"] },
    { "id": 3, "tasks": ["2.3", "3.2", "5.1", "5.2", "5.3", "5.4", "5.5"] },
    { "id": 4, "tasks": ["3.3", "3.4", "3.5", "5.6", "5.7", "5.8"] },
    { "id": 5, "tasks": ["7.1", "7.2", "7.3", "7.4", "7.5"] },
    { "id": 6, "tasks": ["7.6", "7.7", "7.8", "7.9", "7.10"] },
    { "id": 7, "tasks": ["8.1", "8.2", "8.3"] },
    { "id": 8, "tasks": ["8.4", "10.1", "10.3", "10.4"] },
    { "id": 9, "tasks": ["10.2", "10.5", "10.6", "10.7", "10.8", "10.9"] },
    { "id": 10, "tasks": ["11.1"] },
    { "id": 11, "tasks": ["11.2", "11.3", "11.4"] },
    { "id": 12, "tasks": ["13.1"] },
    { "id": 13, "tasks": ["13.2", "13.3", "13.4", "13.5", "13.6", "13.7"] },
    { "id": 14, "tasks": ["14.1", "14.2", "14.3", "14.4"] },
    { "id": 15, "tasks": ["14.5", "14.6"] },
    { "id": 16, "tasks": ["15.1", "15.2", "15.3", "15.4", "15.5"] },
    { "id": 17, "tasks": ["15.6", "15.8", "15.9", "15.10", "15.11"] },
    { "id": 18, "tasks": ["15.7", "17.1", "17.2", "17.3", "17.4", "17.5"] },
    { "id": 19, "tasks": ["17.6"] },
    { "id": 20, "tasks": ["18.1", "18.2", "18.3", "19.1", "19.2", "19.3", "19.4", "19.5"] },
    { "id": 21, "tasks": ["18.4", "18.5", "18.6", "18.7", "18.8", "18.9"] },
    { "id": 22, "tasks": ["21.1", "21.2"] },
    { "id": 23, "tasks": ["21.3", "22.1", "22.2"] },
    { "id": 24, "tasks": ["23.1"] },
    { "id": 25, "tasks": ["23.2", "23.3", "23.4"] },
    { "id": 26, "tasks": ["23.5", "24.1"] },
    { "id": 27, "tasks": ["24.2", "24.3", "24.4"] }
  ]
}
```
