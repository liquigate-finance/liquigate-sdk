import path from 'path';
import fs from 'fs';
import solc from 'solc';

// returns a contract object compiled using solc
// baseContractPath: relative path of the base contract, i.e. "./BaseContract.sol"
export const instantiateContract = (baseContractPath: string) => {
  const sources = {};
  const sourcePath = path.join(__dirname, baseContractPath);
  const filename = baseContractPath.replace(/^.*[\\\/]/, '').split('.')[0];

  compileImports(sourcePath, sources);

  const input = {
    language: 'Solidity',
    sources: sources,
    settings: {
      outputSelection: {
        '*': {
          '*': ['*'],
        },
      },
    },
  };

  const output = solc.compile(JSON.stringify(input));
  const contract = JSON.parse(output);
  const bytecode = '0x' + contract.contracts[sourcePath][filename].evm.bytecode.object;
  const abi = contract.contracts[sourcePath][filename].abi;

  return {
    bytecode: bytecode,
    abi: abi,
  };
};

// returns sources: { "Contract.sol": { content: fs.readFileSync("pathName.sol",utf8)...}}
// using recursion
const compileImports = (root: any, sources: any) => {
  sources[root] = { content: fs.readFileSync(root, 'utf8') };
  const imports = getNeededImports(root);
  for (let i = 0; i < imports.length; i++) {
    compileImports(imports[i], sources);
  }
};

// returns all the import paths in absolute path
const getNeededImports = (path: string) => {
  const file = fs.readFileSync(path, 'utf8');
  const files = new Array<any>();
  file
    .toString()
    .split('\n')
    .forEach(function (line, index, arr) {
      if ((index === arr.length - 1 && line === '') || !line.trim().startsWith('import')) {
        return;
      }
      // the import is legit
      const relativePath = line.substring(8, line.length - 2);
      const fullPath = buildFullPath(path, relativePath);
      files.push(fullPath);
    });
  return files;
};

// parent: node_modules/.../ERC721/ERC721.sol
// returns absolute path of a relative one using the parent path
const buildFullPath = (parent: string, path: string) => {
  let curDir = parent.substr(0, parent.lastIndexOf('/')); //i.e. ./node/.../ERC721
  if (path.startsWith('./')) {
    return curDir + '/' + path.substr(2);
  }

  while (path.startsWith('../')) {
    curDir = curDir.substr(0, curDir.lastIndexOf('/'));
    path = path.substr(3);
  }

  return curDir + '/' + path;
};

module.exports = {
  instantiateContract,
};

export const compileSol = (filename: string) => {
  const sourcePath = path.join(__dirname, filename);
  const modules = path.join(__dirname, '../../node_modules');
  const input = {
    sources: {
      [sourcePath]: {
        content: fs.readFileSync(sourcePath, { encoding: 'utf8' }),
        urls: [
          modules,
          // If files are used, their directories should be added to the command line via
          // `--allow-paths <path>`.
        ],
      },
    },
    language: 'Solidity',
    settings: {
      outputSelection: {
        '*': {
          '*': ['*'],
        },
      },
    },
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  const artifact = output.contracts[sourcePath];

  return artifact;
};
