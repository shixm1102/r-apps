// [object Object]
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import ErrorBoundary from '../error/ErrorBoundary';

export const
  Box = ({ children,
    className = 'pa4',
    style,
    ...props }) => {
    return (
      <section className={className}
        style={{ background: '#fbfbfb', ...style }}>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </section>
    );
  };

export default Box;
