#!/usr/bin/env node

import { program } from 'commander';
import fs from 'fs';
import pairs from './pairs';

program
    .name('dexutil')
    .description('Utility CLI for DexClient')
    .option('-m, --mongodb <url>', 'Mongo DB instance URI ex: mongodb://localhost:27017/')
    .option('-d, --db <char>', 'Database Name, default : `chain:${chainId}` ')
    .option('-p, --provider <url>', 'HTTP JSON-RPC provider URL ex: https://bsc-dataseed1.binance.org/')
    .option('-f, --factory <address>', 'Factory Address')
    .option('-o, --options <path>', 'Options JSON file path')

program
    .command('pairs')
    .argument('[from]', 'start at N pair index, default : 0', (arg) => Number(arg))
    .argument('[to]', 'stop at N pair index, default : Factory contract allPairsLength ', (arg) => Number(arg))
    .description('Save pairs for a given Factory address to a Mongo DB instance')
    .action(async (from, to) => {

        var { mongodb, db, provider, factory, options } = program.opts();

        if (options) {

            const data = fs.readFileSync(options, { encoding: 'utf8', flag: 'r' });

            ({ mongodb, db, provider, factory } = JSON.parse(data));

        }

        pairs({ mongodb, db, provider, factory }, { from, to });

    });

program.parse();