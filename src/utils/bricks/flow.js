/**
 * Given a flow `type` instance, detect the corresponding React element type.
 * @param {string} typeAnnotation
 * @return {string}
 */
function normalizeType(typeAnnotation) {
  switch (typeAnnotation) {
    case 'ObjectTypeAnnotation':
      return 'object';

    case 'ArrayTypeAnnotation':
      return 'array';

    case 'BooleanTypeAnnotation':
      return 'bool';

    case 'FunctionTypeAnnotation':
      return 'func';

    case 'NumberTypeAnnotation':
      return 'number';

    case 'StringTypeAnnotation':
      return 'string';

    default:
    case 'NullTypeAnnotation':
    case 'VoidTypeAnnotation':
    case 'UnionTypeAnnotation':
    case 'TypeofTypeAnnotation':
    case 'NumericLiteralTypeAnnotation':
    case 'NumberLiteralTypeAnnotation':
    case 'StringLiteralTypeAnnotation':
    case 'ThisTypeAnnotation':
    case 'NullLiteralTypeAnnotation':
    case 'NullableTypeAnnotation':
    case 'IntersectionTypeAnnotation':
    case 'GenericTypeAnnotation':
    case 'BooleanLiteralTypeAnnotation':
    case 'MixedTypeAnnotation':
    case 'AnyTypeAnnotation':
    case 'MemberTypeAnnotation':
    case 'TupleTypeAnnotation':
      return 'other';
  }
}

export default {
  normalizeType,
};
