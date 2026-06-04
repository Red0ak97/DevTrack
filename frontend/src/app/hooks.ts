import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Типизированный dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Типизированный selector
export const useAppSelector = <TSelected>(
  selector: (state: RootState) => TSelected
) => useSelector(selector);