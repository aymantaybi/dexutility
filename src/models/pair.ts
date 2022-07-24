import { Schema, model } from 'mongoose';

const pairSchema = new Schema({
    factory: String,
    address: String,
    token0: String,
    token1: String
}, { versionKey: false });

const Pair = model('Pair', pairSchema, "pairs");

pairSchema.index({ token0: 1 });

pairSchema.index({ token1: 1 });

export default Pair;