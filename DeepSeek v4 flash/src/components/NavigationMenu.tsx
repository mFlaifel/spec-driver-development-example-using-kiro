import { useState, useEffect, useCallback, useRef } from 'react';
import styled, { createGlobalStyle, css } from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import LanguageSwitcher from './LanguageSwitcher';
import Button from './Button';

const HEADER_HEIGHT = '64px';

const GlobalNavStyle = createGlobalStyle`
  body {
    padding-top: ${HEADER_HEIGHT};
  }
`;

const SkipLink = styled.a`
  position: absolute;
  left: -9999px;
  z-index: 9999;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  background-color: ${({ theme }) => theme.colors.emeraldGreen};
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  text-decoration: none;
  border-radius: 0 0 4px 4px;

  &:focus {
    left: ${({ theme }) => theme.spacing.sm};
    top: 0;
  }
`;

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: ${HEADER_HEIGHT};
  background-color: ${({ theme }) => theme.colors.darkNavy};
  box-shadow: ${({ theme }) => theme.shadows.md};
  display: flex;
  align-items: center;
  padding: 0 ${({ theme }) => theme.spacing.xl};
`;

const NavContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const Brand = styled(Link)`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.white};
  text-decoration: none;
  letter-spacing: 1px;
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.emeraldGreen};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.emeraldGreen};
    outline-offset: 2px;
  }
`;

const NavLinks = styled.ul`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  list-style: none;
  margin: 0;
  padding: 0;

  @media (max-width: 767px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.neutral[300]};
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: ${({ theme }) => theme.transitions.fast};
  position: relative;
  padding: ${({ theme }) => `${theme.spacing.xs} 0`};

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: ${({ theme }) => theme.colors.emeraldGreen};
    transform: scaleX(0);
    transition: transform ${({ theme }) => theme.transitions.base};
  }

  &:hover {
    color: ${({ theme }) => theme.colors.white};

    &::after {
      transform: scaleX(1);
    }
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.emeraldGreen};
    outline-offset: 2px;
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const CartButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.neutral[300]};
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.white};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.emeraldGreen};
    outline-offset: 2px;
  }
`;

const Badge = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  background-color: ${({ theme }) => theme.colors.emeraldGreen};
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  border-radius: 50%;
  line-height: 1;
`;

const HamburgerButton = styled.button<{ $isOpen: boolean }>`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.white};

  @media (max-width: 767px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.emeraldGreen};
    outline-offset: 2px;
  }
`;

const HamburgerLine = styled.span<{ $isOpen: boolean }>`
  display: block;
  width: 24px;
  height: 2px;
  background-color: ${({ theme }) => theme.colors.white};
  transition: ${({ theme }) => theme.transitions.base};
`;

const DrawerOverlay = styled.div<{ $isOpen: boolean }>`
  display: none;

  @media (max-width: 767px) {
    display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
    position: fixed;
    inset: 0;
    z-index: 999;
    background-color: rgba(0, 0, 0, 0.5);
  }
`;

const Drawer = styled.div<{ $isOpen: boolean; $direction: 'ltr' | 'rtl' }>`
  display: none;

  @media (max-width: 767px) {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    bottom: 0;
    z-index: 1000;
    width: 280px;
    max-width: 80vw;
    background-color: ${({ theme }) => theme.colors.darkNavy};
    box-shadow: ${({ theme }) => theme.shadows.lg};
    transition: transform ${({ theme }) => theme.transitions.base};
    padding: ${({ theme }) => theme.spacing.lg};
    overflow-y: auto;

    ${({ $isOpen, $direction }) =>
      $direction === 'rtl'
        ? css`
            right: 0;
            transform: translateX(${$isOpen ? '0' : '100%'});
          `
        : css`
            left: 0;
            transform: translateX(${$isOpen ? '0' : '-100%'});
          `}
  }
`;

const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.neutral[300]};
  transition: ${({ theme }) => theme.transitions.fast};
  font-size: 1.25rem;
  line-height: 1;

  &:hover {
    color: ${({ theme }) => theme.colors.white};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.emeraldGreen};
    outline-offset: 2px;
  }
`;

const DrawerNavLink = styled(Link)`
  display: block;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.neutral[300]};
  text-decoration: none;
  transition: ${({ theme }) => theme.transitions.fast};
  border-radius: 4px;

  &:hover {
    color: ${({ theme }) => theme.colors.white};
    background-color: ${({ theme }) => theme.colors.neutral[800]};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.emeraldGreen};
    outline-offset: 2px;
  }
`;

const DrawerActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: auto;
  padding-top: ${({ theme }) => theme.spacing.lg};
`;

export default function NavigationMenu() {
  const { t } = useTranslation();
  const { direction } = useLanguage();
  const { summary } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
    hamburgerRef.current?.focus();
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMobileMenu();
        return;
      }

      if (e.key === 'Tab' && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
          'a, button, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    const timer = setTimeout(() => {
      const firstFocusable = drawerRef.current?.querySelector<HTMLElement>(
        'a, button, [tabindex]:not([tabindex="-1"])',
      );
      firstFocusable?.focus();
    }, 100);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [mobileMenuOpen, closeMobileMenu]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleNavClick = () => {
    closeMobileMenu();
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  const navItems = [
    { key: 'nav.home', to: '/' },
    { key: 'nav.products', to: '/products' },
    { key: 'nav.about', to: '/about' },
    { key: 'nav.contact', to: '/contact' },
  ] as const;

  const itemCount = summary?.itemCount ?? 0;

  return (
    <>
      <GlobalNavStyle />
      <SkipLink href="#main-content">
        {t('nav.skipToContent', 'Skip to content')}
      </SkipLink>
      <Nav role="navigation" aria-label={t('nav.mainNavigation', 'Main navigation')}>
        <NavContainer>
          <Brand to="/" aria-label={t('nav.home')}>
            TABLET
          </Brand>

          <NavLinks>
            {navItems.map(({ key, to }) => (
              <li key={key}>
                <NavLink to={to}>{t(key)}</NavLink>
              </li>
            ))}
          </NavLinks>

          <Actions>
            <LanguageSwitcher />
            <CartButton
              onClick={handleCartClick}
              aria-label={`${t('nav.cart')} (${itemCount} ${itemCount === 1 ? 'item' : 'items'})`}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {itemCount > 0 && <Badge>{itemCount > 99 ? '99+' : itemCount}</Badge>}
            </CartButton>

            <HamburgerButton
              ref={hamburgerRef}
              $isOpen={mobileMenuOpen}
              onClick={toggleMobileMenu}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={
                mobileMenuOpen
                  ? t('nav.closeMenu', 'Close navigation menu')
                  : t('nav.openMenu', 'Open navigation menu')
              }
            >
              <HamburgerLine $isOpen={mobileMenuOpen} />
              <HamburgerLine $isOpen={mobileMenuOpen} />
              <HamburgerLine $isOpen={mobileMenuOpen} />
            </HamburgerButton>
          </Actions>
        </NavContainer>
      </Nav>

      <DrawerOverlay
        $isOpen={mobileMenuOpen}
        onClick={closeMobileMenu}
        aria-hidden="true"
      />

      <Drawer
        ref={drawerRef}
        id="mobile-menu"
        $isOpen={mobileMenuOpen}
        $direction={direction}
        role="dialog"
        aria-modal="true"
        aria-label={t('nav.mainNavigation', 'Main navigation')}
      >
        <DrawerHeader>
          <Brand to="/" onClick={handleNavClick} aria-label={t('nav.home')}>
            TABLET
          </Brand>
          <CloseButton
            onClick={closeMobileMenu}
            aria-label={t('nav.closeMenu', 'Close navigation menu')}
          >
            ✕
          </CloseButton>
        </DrawerHeader>

        {navItems.map(({ key, to }) => (
          <DrawerNavLink key={key} to={to} onClick={handleNavClick}>
            {t(key)}
          </DrawerNavLink>
        ))}

        <DrawerActions>
          <Button
            variant="outline"
            size="small"
            onClick={() => {
              handleNavClick();
              navigate('/cart');
            }}
            aria-label={`${t('nav.cart')} (${itemCount} items)`}
          >
            {t('nav.cart')}
          </Button>
          <LanguageSwitcher />
        </DrawerActions>
      </Drawer>
    </>
  );
}
