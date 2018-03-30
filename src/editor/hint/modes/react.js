import Hint from '../hint';
import { autocomplete } from '../../../utils';

// Find using: https://www.w3schools.com/TAGS/att_<ATTRIBUTE>.asp

// IDEA
// this.props => suggest component props
// this.state => suggest component state properties

const attributes = {
  all: [
    'accessKey',
    'dir',

    // TODO
    'cite',
    'classID',
    'className',
    'colSpan',
    'cols',
    'content',
    'contentEditable',
    'contextMenu',
    'controls',
    'controlsList',
    'coords',
    'crossOrigin',
    'data',
    'dateTime',
    'disabled',
    'download',
    'draggable',
    'encType',
    'form',
    'frameBorder',
    'headers',
    'height',
    'hidden',
    'high',
    'href',
    'htmlFor',
    'icon',
    'id',
    'integrity',
    'is',
    'keyParams',
    'keyType',
    'label',
    'lang',
    'manifest',
    'marginHeight',
    'marginWidth',
    'max',
    'maxLength',
    'media',
    'mediaGroup',
    'method',
    'min',
    'minLength',
    'multiple',
    'muted',
    'name',
    'noValidate',
    'nonce',
    'open',
    'optimum',
    'pattern',
    'placeholder',
    'poster',
    'preload',
    'profile',
    'radioGroup',
    'readOnly',
    'rel',
    'required',
    'reversed',
    'role',
    'rowSpan',
    'rows',
    'sandbox',
    'scope',
    'scoped',
    'scrolling',
    'seamless',
    'selected',
    'shape',
    'size',
    'sizes',
    'span',
    'spellCheck',
    'src',
    'srcDoc',
    'srcLang',
    'srcSet',
    'start',
    'step',
    'style',
    'summary',
    'tabIndex',
    'target',
    'title',
    'type',
    'useMap',
    'value',
    'width',
    'wmode',
    'wrap',

    // Unknown
    'allowFullScreen',
    'capture',
    'cellPadding',
    'cellSpacing',
    'inputMode',
    'hrefLang',
  ],
  area: ['alt'],
  audio: ['autoPlay', 'loop'],
  button: ['autoFocus'],
  form: [
    'acceptCharset',
    'action',
    'autoComplete',
    'formAction',
    'formEncType',
    'formMethod',
    'formNoValidate',
    'formTarget',
  ],
  img: ['alt'],
  input: ['alt', 'autoComplete', 'autoFocus', 'checked', 'list', 'accept'],
  keygen: ['challenge'],
  meta: ['charSet', 'httpEquiv'],
  meter: ['low'],
  script: ['async', 'charSet', 'defer'],
  select: ['autoFocus'],
  textarea: ['autoFocus'],
  track: ['kind', 'default'],
  video: ['autoPlay', 'loop'],
};

export default class ReactHint extends Hint {
  getSuggestions(editor, token, options) {
    let found = new Set();

    // TODO refine results
    if (token.string.trim().length > 0 && token.type === 'attribute') {
      const tagName = token.state.context.state.tagName;
      let attributesSuggestions = attributes.all;

      if (attributes[tagName]) {
        attributesSuggestions = attributesSuggestions.concat(
          attributes[tagName]
        );
      }

      for (const attribute of attributesSuggestions) {
        found.add({
          text: attribute + '=',
          displayText: attribute,
          render: autocomplete.render.bind(this, 'attr', token),
        });
      }
    }

    return Array.from(found);
  }
}
