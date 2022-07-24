import factoryAbi from './abi/Factory.json';
import pairAbi from './abi/Pair.json';
import erc20Abi from './abi/Erc20.json';

const contracts = {
    abi: {
        factory: factoryAbi,
        pair: pairAbi,
        erc20: erc20Abi,
    }
}

export default contracts;