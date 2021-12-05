import { useEffect, useRef } from 'react';
import { isEqual } from '../utils/lodash';

export default function useEffectDeep(func, deps) {
  const isFirst = useRef(true);
  const prevDeps = useRef(deps);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    const isFirstEffect = isFirst.current;
    const isSame = prevDeps.current.every((obj, index) => isEqual(obj, deps[index]));

    isFirst.current = false;
    prevDeps.current = deps;

    if (isFirstEffect || !isSame) {
      return func();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
