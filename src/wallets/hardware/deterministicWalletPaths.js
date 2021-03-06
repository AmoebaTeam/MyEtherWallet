import * as nodes from '../../configs/networks/types';

const derivationPaths = {
  [nodes.AMBA.name]: "m/44'/60'/0'/0",
};

function getDerivationPath(networkName) {
  if (paths[networkName]) {
    return { dpath: paths[networkName], label: nodes[networkName].name_long };
  }
}

const paths = {};

Object.keys(derivationPaths).forEach(key => {
  paths[derivationPaths[key]] = {
    dpath: paths[key],
    label: nodes[key].name_long
  };
});

export { paths, getDerivationPath };
