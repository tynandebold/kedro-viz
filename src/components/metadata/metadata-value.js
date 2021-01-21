import React from 'react';
import modifiers from '../../utils/modifiers';
import './styles/metadata.css';

/**
 * Shows a metadata value
 */
const MetaDataValue = ({
  isPai,
  container: Container = isPai ? 'a' : 'span',
  className,
  value,
  kind,
  empty
}) => {
  return isPai ? (
    <Container
      title={value}
      className={modifiers(
        'pipeline-metadata__value--pai',
        { kind },
        className
      )}
      href="http://127.0.0.1:5000/"
      target="_blank">
      {!value && value !== 0 ? empty : value}
    </Container>
  ) : (
    <Container
      title={value}
      className={modifiers('pipeline-metadata__value', { kind }, className)}>
      {!value && value !== 0 ? empty : value}
    </Container>
  );
};

export default MetaDataValue;
