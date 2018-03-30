export default [
  {
    displayText: 'React: import',
    text: "import React from 'react';\n",
  },
  {
    displayText: 'React: import with Component',
    text: "import React, { Component } from 'react';\n",
  },
  {
    displayText: 'React: import with PureComponent',
    text: "import React, { PureComponent } from 'react';\n",
  },
  {
    displayText: 'React: import react-dom()',
    text: "import ReactDOM from 'react-dom';\n",
  },
  {
    displayText: 'React: this.state.',
    text: 'this.state.#{1}',
  },
  {
    displayText: 'React: this.props.',
    text: 'this.props.#{1}',
  },
  {
    displayText: 'React: constructor(props)',
    text: 'constructor(props) {\n\tsuper(props);\n\tthis.state = #{1};\n}\n',
  },
  {
    displayText: 'React: componentDidMount()',
    text: 'componentDidMount() {\n\t#{1}\n}\n',
  },
  {
    displayText: 'React: componentWillMount()',
    text: 'componentWillMount() {\n\t#{1}\n}\n',
  },
  {
    displayText: 'React: componentWillReceiveProps()',
    text: 'componentWillReceiveProps(nextProps) {\n\t#{1}\n}\n',
  },
  {
    displayText: 'React: shouldComponentUpdate()',
    text: 'shouldComponentUpdate(nextProps, nextState) {\n\t#{1}\n}\n',
  },
  {
    displayText: 'React: componentWillUpdate()',
    text: 'componentWillUpdate(nextProps, nextState) {\n\t#{1}\n}\n',
  },
  {
    displayText: 'React: componentDidUpdate()',
    text: 'componentDidUpdate(prevProps, prevState) {\n\t#{1}\n}\n',
  },
  {
    displayText: 'React: componentWillUnmount()',
    text: 'componentWillUnmount() {\n\t#{1}\n}\n',
  },
  {
    displayText: 'React: componentDidCatch()',
    text: 'componentDidCatch(error, info) {\n\t#{1}\n}\n',
  },
  {
    displayText: 'React: setState()',
    text: 'this.setState({ #{1} });',
  },
  {
    displayText: 'React: dangerouslySetInnerHTML',
    text: 'dangerouslySetInnerHTML={{ __html: #{1} }}',
  },
  {
    displayText: 'React: class skeleton',
    text:
      "import React, { Component } from 'react';\n\nclass #{1} extends Component {\n\trender() {\n\t\treturn (\n\t\t\t<div></div>\n\t\t);\n\t}\n\n}\n\nexport default #{1};\n",
  },
  {
    displayText: 'React: Stateless Component',
    text:
      "import React from 'react';\n\nfunction #{1}(props) {\n\treturn (<div />);\n}\n\nexport default #{1};\n",
  },
];
