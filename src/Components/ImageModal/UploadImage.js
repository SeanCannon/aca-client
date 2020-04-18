import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Upload } from 'antd';
import { Button } from 'semantic-ui-react';
import Styled from 'styled-components';

import { getBase64 } from './utils';

const StyledUploadContainer = Styled.div`
  margin: 20px 0;
`;

const VALID_FILE_TYPES = [
  'image/jpeg',
  'image/png'
];
const MAX_FILE_SIZE_MB = 5;

const UploadImage = ({ onSetImage }) => {
  const [loading, setLoading] = useState(false);

  const isFileValid = file => {
    const isJpgOrPng = VALID_FILE_TYPES.includes(file.type);
    const isLt2M = file.size / 1024 / 1024 < MAX_FILE_SIZE_MB;

    return isJpgOrPng && isLt2M;
  };

  const handleChange = info => {
    const isValid = isFileValid(info.file);

    // TODO: handle invalid file

    if (isValid) {
      getBase64(info.file.originFileObj, imageUrl => {
        setLoading(false);
        onSetImage(imageUrl);
      });
    }
  };

  return (
    <StyledUploadContainer>
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        customRequest={() => {}}
        onChange={handleChange}
      >
        <Button
          primary
          icon
          disabled={loading}
          loading={loading}
        >
          Upload File
        </Button>
      </Upload>
    </StyledUploadContainer>
  );
};

UploadImage.propTypes = {
  onSetImage: PropTypes.func
};

export default UploadImage;
