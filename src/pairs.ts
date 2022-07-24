import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';

import mongoose from 'mongoose';

import contracts from './chain/contracts';
import { logger, executeAsync } from './utils';
import Pair from './models/pair';

var web3: Web3;
var factoryContract: Contract;

interface Opts {
    mongodb: string,
    db: string,
    provider: string,
    factory: string
};

interface Args {
    from: number,
    to: number
};

const queueSize = 50;

export default async (opts: Opts, args: Args) => {

    var { mongodb, db, provider, factory } = opts;
    var { from, to } = args;

    web3 = new Web3(new Web3.providers.HttpProvider(provider));

    var chainId = await web3.eth.getChainId();

    logger.info(`Chain Id : ${chainId}`);

    db = db || `chain:${chainId}`;

    mongoose.connect(mongodb, { dbName: db });

    factoryContract = new web3.eth.Contract(contracts.abi.factory as any, factory);

    var allPairsLength = await factoryContract.methods.allPairsLength().call();

    logger.info(`All Pairs Length : ${allPairsLength}`);

    from = from || 0;
    to = to || allPairsLength;

    for (var i = from; i < to; i += queueSize + 1) {

        logger.info(`Pairs [${i}...${i + queueSize}]`);

        var pairs = await getAllPairs(i, Math.min(allPairsLength, i + queueSize));

        logger.info(`Save pairs data (${(i / allPairsLength * 100).toFixed(3)}%)`);

        var result = await Pair.bulkWrite(pairs.map(pair => {
            return {
                updateOne: {
                    filter: { address: pair.address },
                    update: { ...pair },
                    upsert: true
                }
            }
        }));

        logger.info(`${result.nUpserted} document inserted`);

    };

}

async function getAllPairs(start: number, end: number) {

    var batch: any = new web3.BatchRequest();

    for (var i = start; i < end; i++) {
        batch.add(factoryContract.methods.allPairs(i).call.request());
    }

    var pairsAddress = await executeAsync(batch) as string[];

    batch = new web3.BatchRequest();

    var requestsLength = 0;

    for (var pairAddress of pairsAddress) {
        var requests = getPair(pairAddress).method.requests();
        requestsLength = requests.length;
        for (var request of requests) {
            batch.add(request);
        }
    };

    var pairsData = await executeAsync(batch) as string[];

    var { address: factory } = factoryContract.options;

    var pairs = pairsAddress.map((address, index) => {

        var data: string[] = pairsData.slice(index * requestsLength, (index + 1) * requestsLength);

        var [token0, token1] = data;

        return {
            factory: web3.utils.toChecksumAddress(factory),
            address: web3.utils.toChecksumAddress(address),
            token0: web3.utils.toChecksumAddress(token0),
            token1: web3.utils.toChecksumAddress(token1)
        }

    });

    return pairs;
}

function getPair(address: string) {

    var pairContract = new web3.eth.Contract(contracts.abi.pair as any, address);

    var batch: any = new web3.BatchRequest();

    var requests = [
        pairContract.methods.token0().call.request(),
        pairContract.methods.token1().call.request()
    ];

    for (var request of requests) {
        batch.add(request);
    };

    return {
        data: async () => {
            var [
                token0,
                token1
            ]: any = await executeAsync(batch);
            return {
                address: web3.utils.toChecksumAddress(address),
                token0: web3.utils.toChecksumAddress(token0),
                token1: web3.utils.toChecksumAddress(token1)
            }
        },
        method: {
            requests: () => requests
        }
    }

};