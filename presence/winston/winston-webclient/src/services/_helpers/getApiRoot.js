import { getCurrentTenancy } from '../../services/Tenant';

const getApiRoot = () => {
  const environmentValue = process.env.REACT_APP_API_ROOT,
        tenancy          = getCurrentTenancy();

  if (!environmentValue) {
    throw new Error('Missing REACT_APP_API_ROOT environment variable');
  }

  if (tenancy.domain === 'www') {
    return environmentValue;
  } else {
    return environmentValue.replace('platform', tenancy.domain)
  }
};

export default getApiRoot;
