/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/layout/Layout';
import { CartProvider } from './context/CartContext';
import { UIProvider } from './context/UIContext';

export default function App() {
  return (
    <HelmetProvider>
      <UIProvider>
        <CartProvider>
          <Layout />
        </CartProvider>
      </UIProvider>
    </HelmetProvider>
  );
}
