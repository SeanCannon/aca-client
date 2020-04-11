const getCurrentTenancy = () => {
  const hostNameParts = window.location.hostname.split('.').reverse(),
        tld           = hostNameParts[0],
        aName         = hostNameParts[1],
        tenancyDomain = hostNameParts[2];

  return {
    tld,
    aName,
    tenant : tenancyDomain !== 'www' && {
      domain : tenancyDomain.indexOf('-') !== -1 ? tenancyDomain.split('-')[1] : tenancyDomain.split('-')[0]
    },
    tenantLocation : tenancyDomain.indexOf('-') !== -1 && {
      subdomain : tenancyDomain.split('-')[0]
    },
    domain : tenancyDomain
  }
};

export default getCurrentTenancy;
