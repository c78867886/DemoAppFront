import {BetweenIsuCombination, GroupId} from './BetweenIsuCombination';

export class Predictor {
  name = '';
  groups: string[] = [];
  child: Predictor;

  mapCombinations() {
    let combinations = [] ;
    this.groupIds.forEach( group => {
      combinations.push(new BetweenIsuCombination( [group] , 1));
    });

    if (!this.child) {
      return combinations;
    }

    const childCombinations = this.child.mapCombinations();
    combinations = this.combineLists(combinations, childCombinations);
    return combinations;
  }

  combineLists(combinations, childCombinations) {
    const newCombinations = [];
    combinations.forEach( combination => {
      childCombinations.forEach( childCombination => {
          const id = combination.id.concat(childCombination.id);
          newCombinations.push(new BetweenIsuCombination(id, 1));
      });
      }
    );
    return newCombinations;
  }

  get groupIds(): GroupId[] {
    const  nameGroupPairs = [];
    for ( const group of this.groups ) {
      nameGroupPairs.push( new GroupId(this.name, group));
    }
    return nameGroupPairs;
  }
}
