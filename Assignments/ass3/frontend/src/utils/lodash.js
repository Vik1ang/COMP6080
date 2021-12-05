import _get from 'lodash/get';
import _has from 'lodash/has';
import _findIndex from 'lodash/findIndex';
import _isEqual from 'lodash/isEqual';
import _remove from 'lodash/remove';
import _pullAt from 'lodash/pullAt';
import _parseInt from 'lodash/parseInt';
import _isNaN from 'lodash/isNaN';
import _trim from 'lodash/trim';
import _startsWith from 'lodash/startsWith';
import _endsWith from 'lodash/endsWith';
import _uniq from 'lodash/uniq';
import _toLower from 'lodash/toLower';
import _toUpper from 'lodash/toUpper';
import _fill from 'lodash/fill';
import _last from 'lodash/last';
import _set from 'lodash/set';
import _includes from 'lodash/includes';

export function get(object, path, defaultValue) {
  return _get(object, path, defaultValue);
}

export function has(object, path) {
  return _has(object, path);
}

export function findIndex(array, predication, fromIndex = 0) {
  return _findIndex(array, predication, fromIndex);
}

export function isEqual(value, other) {
  return _isEqual(value, other);
}

export function remove(array, predicate) {
  return _remove(array, predicate);
}

export function pullAt(array, [indexes]) {
  return _pullAt(array, [indexes]);
}

export function parseInt(string, radix = 10) {
  return _parseInt(string, radix);
}

export function isNaN(value) {
  return _isNaN(value);
}

export function trim(string = '') {
  return _trim(string);
}

export function startsWith(string = '', target, position = 0) {
  return _startsWith(string, target, position);
}

export function endsWith(string = '', target, position = 0) {
  return _endsWith(string, target, position);
}

export function uniq(array) {
  return _uniq(array);
}

export function toLower(string = '') {
  return _toLower(string);
}

export function toUpper(string = '') {
  return _toUpper(string);
}

export function fill(array, value, start = 0, end = array.length) {
  return _fill(array, value, start, end);
}

export function last(array) {
  return _last(array);
}

export function set(object, path, value) {
  return _set(object, path, value);
}

export function includes(collection, value, fromIndex = 0) {
  return _includes(collection, value, fromIndex);
}
