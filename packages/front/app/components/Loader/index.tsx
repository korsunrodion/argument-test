import React from "react";
import s from './Loader.module.scss';

type Props = {
  isActive: boolean
};

const Loader: React.FC<Props> = ({ isActive }) => {
  return (
    <div>
      {isActive && (
        <div className={s.loader} />
      )}
    </div>
  )
}

export default Loader;