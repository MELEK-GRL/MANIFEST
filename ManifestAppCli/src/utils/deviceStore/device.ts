import useDeviceStore from '../../store/useDeviceStore';

export const useResponsive = () => {
  const w1px = useDeviceStore(state => state.w1px);
  const h1px = useDeviceStore(state => state.h1px);
  const fs1px = useDeviceStore(state => state.fs1px);

  return {w1px, h1px, fs1px};
};
