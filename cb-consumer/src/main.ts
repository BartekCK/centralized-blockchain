import { BlockService } from './infrastructure/services/block.service';
import { ValueData } from './domain/value-objects/value-data';
import { DatabaseConnector } from './infrastructure/config/database-connector';
import {EnvConfig} from "./infrastructure/config/env-config";

const connection = DatabaseConnector.connect(EnvConfig.getDatabaseConfigParams());

//
// const chain = BlockService.create(1);
// chain.addBlock(new ValueData('Ala ma kota'));
// chain.addBlock(new ValueData('I Psa marka'));

// console.log(chain.isValid());
