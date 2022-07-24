
# Dex Utility CLI

CLI utility tool desgined for an easy interaction with Decentralized Exchanges on EVM compatible blockchains.



## Features

- Save Factory pairs locally on a Mongo DB instance (Useful for swaps path finding ).



## Installation

```bash
  $ git clone https://github.com/aymantaybi/dexutility
  $ cd dexutility
  $ npm install
```

build

```bash
 $ tsc
```

Make the CLI accessible globally :

```bash
 $ npm i -g .
```
## Usage

```bash
Usage: dexutil [options] [command]

Utility CLI for DexClient

Options:
  -m, --mongodb <url>      Mongo DB instance URI ex: mongodb://localhost:27017/
  -d, --db <char>          Database Name, default : `chain:${chainId}`
  -p, --provider <url>     HTTP JSON-RPC provider URL ex: https://bsc-dataseed1.binance.org/
  -f, --factory <address>  Factory Address
  -o, --options <path>     Options JSON file path
  -h, --help               display help for command

Commands:
  pairs [from] [to]        Save pairs for a given Factory address to a Mongo DB instance
  help [command]           display help for command
```

You can use : 

```bash
dexutil --mongodb mongodb://localhost:27017 --provider https://bsc-dataseed1.binance.org --factory 0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73 pairs [from] [to]
```

Or provide a path for options :

```bash
dexutil --options /Users/username/Documents/options.json pairs [from] [to] 
```

options.json
```json
{
    "mongodb": "mongodb://username:password@ip:port",
    "provider": "https://rpc.ankr.com/eth",
    "factory": "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"
}
```
## Screenshots

Terminal :

![image](https://i.ibb.co/ZTX4TP4/Screen-Shot-2022-07-24-at-01-56-20.png)

Mongo DB :

![image](https://i.ibb.co/RHBN2Qp/Screen-Shot-2022-07-24-at-01-58-13.png)

