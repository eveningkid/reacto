import React from 'react';
import { Icon } from 'antd';
import { PromptUserManager } from '../managers';
import finder from '../search';

export default function search() {
  PromptUserManager.ask(
    {
      question: <Icon type="search" />,
      inputPlaceholder: 'Search...',
      shouldBeEmptyAtMounting: true,
      getSuggestions: input => finder.getSuggestions(input),
    },
    search => {}
  );
}
