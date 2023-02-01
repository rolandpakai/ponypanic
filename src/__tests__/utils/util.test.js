import { render, act } from '@testing-library/react';
import * as util from '../../utils/util';

describe('Util Functions', () => {

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
      console.log('actual', actual);
      
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
});