import * as util from '../../utils/util';
import { HERO_ACTION, IMG_BIG_SIZE, IMG_SMALL_SIZE } from '../../utils/constants';

describe('Util Functions', () => {

  describe('randomInteger', () => {
    test('randomInteger (0,0)', () => {
      const min = 0;
      const max = 0;
      const actual = util.randomInteger(min, max);

      expect(actual).toBeGreaterThanOrEqual(min);
      expect(actual).toBeLessThanOrEqual(max);
    });

    test('randomInteger (0,10)', () => {
      const min = 0;
      const max = 10;
      const actual = util.randomInteger(min, max);

      expect(actual).toBeGreaterThanOrEqual(min);
      expect(actual).toBeLessThanOrEqual(max);
    });
  });

  describe('xyTOij', () => {
    test('xyTOij (0, 0, 0)', () => {
      const expected = {i: -1, j: 0};
      const actual = util.xyTOij(0, 0, 0);
      
      expect(actual).toMatchObject(expected);
    });

    test('xyTOij (10, 10, 10)', () => {
      const expected = {i: -1, j: 10};
      const actual = util.xyTOij(10, 10, 10);
      
      expect(actual).toMatchObject(expected);
    });
  });

  describe('arrayToMap', () => {
    test('arrayToMap ([], TestType, {})', () => {
      const expected = {};
      const actual = util.arrayToMap([], 'TestType', {});
      
      expect(actual).toMatchObject(expected);
    });

    test('arrayToMap (arrayOfObjects, TestType, {})', () => {
      const arrayOfObjects = [
        {
          id: 1,
          data: 'data1',
          position: {
            x: 1,
            y: 2,
          }
        },
        {          
          id: 2,
          data: 'data2',
          position: {
            x: 2,
            y: 2,
          }}
      ];

      const expected = {
        '1-2': { id: 1, data: 'data1', position: { x: 1, y: 2 }, type: 'TestType' },
        '2-2': { id: 2, data: 'data2', position: { x: 2, y: 2 }, type: 'TestType' }
      };
      const actual = util.arrayToMap(arrayOfObjects, 'TestType', {});
      
      expect(actual).toMatchObject(expected);
    });

    test('arrayToMap (arrayOfObjects, TestType, turnObject)', () => {
      const arrayOfObjects = [
        {
          id: 1,
          data: 'data1',
          position: {
            x: 1,
            y: 2,
          }
        },
        {          
          id: 2,
          data: 'data2',
          position: {
            x: 2,
            y: 2,
          }}
      ];

      const turnObject = {
        heroId: 1,
        action: 'TestAction',
      }

      const expected = {
        '1-2': { id: 1, data: 'data1', position: { x: 1, y: 2 }, type: 'TestType', action: 'TestAction' },
        '2-2': { id: 2, data: 'data2', position: { x: 2, y: 2 }, type: 'TestType' }
      };
      const actual = util.arrayToMap(arrayOfObjects, 'TestType', turnObject);
      
      expect(actual).toMatchObject(expected);
    });
  });

  describe('mapToArray', () => {
    test('mapToArray ({})', () => {
      const expected = [];
      const actual = util.mapToArray({});
      
      expect(actual).toMatchObject(expected);
    });

    test('mapToArray (testObject)', () => {
      const testObject = {
        '1': [1],
        '2': [1,2],
      }

      const expected = [
        {position: {x: 1, y: 1}},
        {position: {x: 2, y: 1}},
        {position: {x: 2, y: 2}},
      ];

      const actual = util.mapToArray(testObject);
      
      expect(actual).toMatchObject(expected);
    });

  });

  describe('getImageSize', () => {
    test('getImageSize ()', () => {
      const expected = IMG_BIG_SIZE;
      const actual = util.getImageSize();
      
      expect(actual).toEqual(expected);
    });

    test('getImageSize (1)', () => {
      const expected = IMG_BIG_SIZE;
      const actual = util.getImageSize(1);
      
      expect(actual).toEqual(expected);
    });

    test('getImageSize (9)', () => {
      const expected = IMG_BIG_SIZE;
      const actual = util.getImageSize(9);
      
      expect(actual).toEqual(expected);
    });

    test('getImageSize (10)', () => {
      const expected = IMG_SMALL_SIZE;
      const actual = util.getImageSize(10);
      
      expect(actual).toEqual(expected);
    });

  });

  describe('getHeroAction', () => {
    test('getHeroAction ()', () => {
      const expected = HERO_ACTION.NOTHING;
      const actual = util.getHeroAction();
      
      expect(actual).toEqual(expected);
    });

    test('getHeroAction (`U`)', () => {
      const direction = 'U';
      const expected = HERO_ACTION.MOVE_UP;
      const actual = util.getHeroAction(direction);
      
      expect(actual).toEqual(expected);
    });

    test('getHeroAction (`D`)', () => {
      const direction = 'D';
      const expected = HERO_ACTION.MOVE_DOWN;
      const actual = util.getHeroAction(direction);
      
      expect(actual).toEqual(expected);
    });

    test('getHeroAction (`L`)', () => {
      const direction = 'L';
      const expected = HERO_ACTION.MOVE_LEFT;
      const actual = util.getHeroAction(direction);
      
      expect(actual).toEqual(expected);
    });

    test('getHeroAction (`R`)', () => {
      const direction = 'R';
      const expected = HERO_ACTION.MOVE_RIGHT;
      const actual = util.getHeroAction(direction);
      
      expect(actual).toEqual(expected);
    });

    test('getHeroAction (`X`)', () => {
      const direction = 'X';
      const expected = HERO_ACTION.NOTHING;
      const actual = util.getHeroAction(direction);
      
      expect(actual).toEqual(expected);
    });
  });

  describe('validateHeroAction', () => {
    test('validateHeroAction ()', () => {
      const expected = HERO_ACTION.NOTHING;
      const actual = util.validateHeroAction();
      
      expect(actual).toEqual(expected);
    });

    test('validateHeroAction (``)', () => {
      const expected = HERO_ACTION.NOTHING;
      const actual = util.validateHeroAction('');
      
      expect(actual).toEqual(expected);
    });

    test('validateHeroAction (`NOTHING`)', () => {
      const heroAction = HERO_ACTION.NOTHING;
      const expected = HERO_ACTION.NOTHING;
      const actual = util.validateHeroAction(heroAction);
      
      expect(actual).toEqual(expected);
    });

    test('validateHeroAction (`USE_SHIELD`)', () => {
      const heroAction = HERO_ACTION.USE_SHIELD;
      const expected = HERO_ACTION.USE_SHIELD;
      const actual = util.validateHeroAction(heroAction);
      
      expect(actual).toEqual(expected);
    });
  });
});