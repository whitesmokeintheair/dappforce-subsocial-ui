// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';

import React from 'react';
import SUIModal from 'semantic-ui-react/dist/commonjs/modules/Modal/Modal';
import settings from '../settings';

import { classes } from '@polkadot/ui-app/util';

type Props = BareProps & {
  children: React.ReactNode,
  [index: string]: any
};

export default class Modal extends React.PureComponent<Props> {
  static Actions = SUIModal.Actions;
  static Content = SUIModal.Content;
  static Header = SUIModal.Header;
  static Description = SUIModal.Description;

  render () {
    const { className } = this.props;

    return (
      <SUIModal
        {...this.props}
        className={classes(`theme--${settings.uiTheme}`, 'ui--Modal', className)}
      />
    );
  }
}
