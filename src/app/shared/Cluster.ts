import {ClusterLevel} from './ClusterLevel';
import {constants} from './constants';
import {ISUFactor} from './ISUFactor';

/**
 * Model object for Cluster.
 */
export class Cluster extends ISUFactor {
  levels: ClusterLevel[] = [];

  /**
   * Default constructor.
   * @param {string} name
   */
  constructor(name?: string) {
    super(name);
    this.nature = constants.HYPOTHESIS_NATURE.WITHIN;
    this.origin = constants.HYPOTHESIS_ORIGIN.CLUSTER;
  }
}
